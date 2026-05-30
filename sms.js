/* =========================
 * sms.js
 * 依赖：
 * window.initSMSModule({ DB, showStatus, escapeHtml, callLLM, switchPage, getActiveMask })
 * ========================= */

(function () {
  "use strict";

  const STORE_NAMES = {
    ACCOUNTS: "smsAccounts",
    THREADS: "smsThreads",
    MESSAGES: "smsMessages",
    SUBS: "smsSubs",
    META: "smsMeta",
  };

  const META_KEYS = {
    TICK_LAST_AT_PREFIX: "tickLastAt_", // + maskId
    STRANGER_LAST_AT_PREFIX: "strangerLastAt_", // + maskId
  };

  // ===== 小工具 =====
  const nowTs = () => Date.now();
  const uid = (p = "id") => `${p}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  function randomPick(arr) {
    if (!arr || !arr.length) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function prettyTime(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    const n = new Date();
    const sameDay = d.toDateString() === n.toDateString();
    if (sameDay) {
      return d.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" });
  }

  function domainFromMask(maskName) {
    const safe = (maskName || "user").replace(/\s+/g, "").replace(/[^\w\u4e00-\u9fa5]/g, "");
    return `${safe || "user"}mail.app`;
  }

  function localPartFromName(name) {
    const s = (name || "user")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ".")
      .replace(/[^\w.\-]/g, "");
    return s || "user";
  }

  function safeText(s) {
    if (s == null) return "";
    return String(s);
  }

  function parseAddress(addr) {
    // "name <a@b.com>" or "a@b.com"
    const a = safeText(addr).trim();
    const m = a.match(/^(.*)<([^>]+)>$/);
    if (m) {
      return {
        name: m[1].trim().replace(/^"|"$/g, ""),
        email: m[2].trim()
      };
    }
    return { name: "", email: a };
  }

  // ===== 低耦合 DB helpers =====
  async function ensureStores(DB) {
    // 这里不创建 store（因为你的 DB open 在 index 里），仅探测调用时兜底提示
    const required = Object.values(STORE_NAMES);
    try {
      // 粗探测：任意 getAll 一次
      for (const sn of required) {
        try {
          await DB.getAll(sn);
        } catch (e) {
          console.warn("[sms] 缺少对象仓库：", sn);
        }
      }
    } catch (e) {}
  }

  async function dbGetMeta(DB, key, def = null) {
    try {
      const r = await DB.get(STORE_NAMES.META, key);
      return r ? r.value : def;
    } catch (e) {
      return def;
    }
  }

  async function dbSetMeta(DB, key, value) {
    await DB.put(STORE_NAMES.META, { key, value, updatedAt: nowTs() });
  }

  // ===== 模块主体 =====
  window.initSMSModule = function initSMSModule(deps) {
    const { DB, showStatus, escapeHtml, callLLM, switchPage, getActiveMask } = deps || {};

    if (!DB || !showStatus || !escapeHtml || !switchPage || !getActiveMask) {
      console.error("[sms] 初始化参数不足");
      return null;
    }

    const state = {
      activeMask: null, // 聊天主面具（硬绑定）
      activeMaskId: null,
      smsAccounts: [],  // 当前 mask 下的小号
      activeAccountId: null, // 当前小号
      currentThreadId: null,
      currentView: "inbox", // inbox | thread | compose | settings | subs
      contactPeers: [], // 从 conversations + characters 抽取
      allThreads: [],
      threadMessagesMap: new Map(),
      composingReplyToThreadId: null,
      timer: null,
      inited: false,
      pushing: false,
    };

    // ====== 对外 ======
    async function init() {
      if (state.inited) return;
      await ensureStores(DB);
      await bootstrapMaskAndAccounts();
      bindGlobalDelegation();
      startTicker();
      state.inited = true;
      console.log("[sms] init done");
    }

    async function openSMSPage() {
      await bootstrapMaskAndAccounts();
      await refreshPeers();
      await pullThreadsAndRenderInbox();
      renderTopLayout();
      renderInbox();
      // 每次打开顺手触发一次被动来信模拟
      await maybeInjectIncoming();
      await maybeTickSubscriptions();
    }

    // ====== 初始化逻辑 ======
    async function bootstrapMaskAndAccounts() {
      const m = await getActiveMask();
      state.activeMask = m || null;
      state.activeMaskId = m?.id || null;

      if (!state.activeMaskId) {
        showStatus("❌ 未找到当前面具", "error");
        return;
      }

      state.smsAccounts = await getSMSAccountsByMask(state.activeMaskId);

      if (!state.smsAccounts.length) {
        const defAcc = await createDefaultAccountForMask(state.activeMask);
        state.smsAccounts = [defAcc];
      }

      // 恢复 activeAccountId
      const metaKey = `activeAccountId_${state.activeMaskId}`;
      const saved = await dbGetMeta(DB, metaKey, "");
      const exists = state.smsAccounts.find(a => a.id === saved);
      if (exists) {
        state.activeAccountId = exists.id;
      } else {
        state.activeAccountId = state.smsAccounts[0].id;
        await dbSetMeta(DB, metaKey, state.activeAccountId);
      }
    }

    async function refreshPeers() {
      const peers = await getContactPeersFromConversations(state.activeMaskId);
      state.contactPeers = peers;
    }

    async function getSMSAccountsByMask(maskId) {
      const all = await DB.getAll(STORE_NAMES.ACCOUNTS);
      return (all || [])
        .filter(a => a.maskId === maskId)
        .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    }

    async function createDefaultAccountForMask(mask) {
      const name = safeText(mask?.name || "用户");
      const local = localPartFromName(name);
      const domain = domainFromMask(name);
      const email = `${local}@${domain}`;

      const acc = {
        id: uid("sms_acc"),
        maskId: mask.id,
        alias: name,
        email,
        note: "主账号",
        createdAt: nowTs(),
        updatedAt: nowTs(),
      };
      await DB.put(STORE_NAMES.ACCOUNTS, acc);
      return acc;
    }

    async function createSMSAccount(maskId, alias, customEmail, note = "") {
      const em = safeText(customEmail).trim();
      if (!em.includes("@")) throw new Error("邮箱格式不正确");
      const acc = {
        id: uid("sms_acc"),
        maskId,
        alias: safeText(alias || "小号"),
        email: em,
        note: safeText(note || ""),
        createdAt: nowTs(),
        updatedAt: nowTs(),
      };
      await DB.put(STORE_NAMES.ACCOUNTS, acc);
      return acc;
    }

    async function switchSMSAccount(accountId) {
      const found = state.smsAccounts.find(a => a.id === accountId);
      if (!found) return;
      state.activeAccountId = accountId;
      await dbSetMeta(DB, `activeAccountId_${state.activeMaskId}`, accountId);
      await pullThreadsAndRenderInbox();
      renderTopLayout();
      renderInbox();
    }

    function getActiveAccount() {
      return state.smsAccounts.find(a => a.id === state.activeAccountId) || null;
    }

    // ====== 联系人来源（单聊列表）======
    async function getContactPeersFromConversations(maskId) {
      const convs = await DB.getAll("conversations");
      const chars = await DB.getAll("characters");
      const charMap = new Map((chars || []).map(c => [c.id, c]));

      const picked = (convs || []).filter(c => c.maskId === maskId && !!c.charId);
      const uniq = new Map();
      for (const c of picked) {
        if (!uniq.has(c.charId)) uniq.set(c.charId, c);
      }

      const peers = [];
      for (const [charId] of uniq) {
        const ch = charMap.get(charId);
        if (!ch) continue;
        // 为每个 char 生成一个默认邮件地址（可稳定）
        const local = localPartFromName(ch.name || "char");
        const email = `${local}@companion.mail`;
        peers.push({
          peerKey: `char:${charId}`,
          peerType: "char",
          charId,
          name: ch.name || "联系人",
          email,
          avatar: ch.avatar || "",
          detail: ch.detail || "",
        });
      }
      return peers.sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
    }

    // ====== 线程 & 消息 ======
    async function pullThreadsAndRenderInbox() {
      const activeAcc = getActiveAccount();
      if (!activeAcc) return;

      const allThreads = await DB.getAll(STORE_NAMES.THREADS);
      const allMsgs = await DB.getAll(STORE_NAMES.MESSAGES);

      const threads = (allThreads || [])
        .filter(t =>
          t.maskId === state.activeMaskId &&
          t.accountId === activeAcc.id
        )
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

      state.allThreads = threads;
      state.threadMessagesMap.clear();

      const group = new Map();
      for (const m of allMsgs || []) {
        if (!group.has(m.threadId)) group.set(m.threadId, []);
        group.get(m.threadId).push(m);
      }
      for (const t of threads) {
        const list = (group.get(t.id) || []).sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        state.threadMessagesMap.set(t.id, list);
      }
    }

    async function upsertThread(payload) {
      // payload: { maskId, accountId, peerKey, peerType, peerName, peerEmail, charId?, subject? }
      const all = await DB.getAll(STORE_NAMES.THREADS);
      const existed = (all || []).find(t =>
        t.maskId === payload.maskId &&
        t.accountId === payload.accountId &&
        t.peerKey === payload.peerKey
      );

      if (existed) {
        existed.peerName = payload.peerName || existed.peerName;
        existed.peerEmail = payload.peerEmail || existed.peerEmail;
        existed.peerType = payload.peerType || existed.peerType;
        existed.charId = payload.charId || existed.charId || "";
        existed.updatedAt = nowTs();
        await DB.put(STORE_NAMES.THREADS, existed);
        return existed;
      }

      const t = {
        id: uid("sms_th"),
        maskId: payload.maskId,
        accountId: payload.accountId,
        peerKey: payload.peerKey,
        peerType: payload.peerType, // char | stranger | sub
        charId: payload.charId || "",
        peerName: payload.peerName || "",
        peerEmail: payload.peerEmail || "",
        lastSubject: payload.subject || "",
        lastSnippet: "",
        unreadCount: 0,
        flags: payload.flags || {},
        createdAt: nowTs(),
        updatedAt: nowTs(),
      };
      await DB.put(STORE_NAMES.THREADS, t);
      return t;
    }

    async function appendMessage(threadId, msg) {
      // msg: { fromName, fromEmail, toName, toEmail, subject, body, direction: out|in, senderType, meta }
      const m = {
        id: uid("sms_msg"),
        threadId,
        timestamp: nowTs(),
        fromName: safeText(msg.fromName),
        fromEmail: safeText(msg.fromEmail),
        toName: safeText(msg.toName),
        toEmail: safeText(msg.toEmail),
        subject: safeText(msg.subject),
        body: safeText(msg.body),
        direction: msg.direction || "out",
        senderType: msg.senderType || "user", // user|char|stranger|sub
        read: msg.direction === "out" ? true : false,
        meta: msg.meta || {},
      };
      await DB.put(STORE_NAMES.MESSAGES, m);

      const th = await DB.get(STORE_NAMES.THREADS, threadId);
      if (th) {
        th.lastSubject = m.subject || th.lastSubject || "";
        th.lastSnippet = (m.body || "").slice(0, 80);
        th.updatedAt = m.timestamp;
        if (m.direction === "in") th.unreadCount = (th.unreadCount || 0) + 1;
        await DB.put(STORE_NAMES.THREADS, th);
      }
      return m;
    }

    async function markThreadRead(threadId) {
      const msgs = await DB.getAll(STORE_NAMES.MESSAGES);
      const target = (msgs || []).filter(m => m.threadId === threadId && !m.read && m.direction === "in");
      for (const m of target) {
        m.read = true;
        await DB.put(STORE_NAMES.MESSAGES, m);
      }
      const th = await DB.get(STORE_NAMES.THREADS, threadId);
      if (th) {
        th.unreadCount = 0;
        await DB.put(STORE_NAMES.THREADS, th);
      }
    }

    // ====== 发信 ======
    async function sendMail({ toPeer, subject, body, randomSend = false }) {
      const activeAcc = getActiveAccount();
      if (!activeAcc) throw new Error("当前无可用账号");
      if (!body.trim()) throw new Error("正文不能为空");

      let peer = toPeer;
      if (randomSend) {
        peer = randomPick(state.contactPeers);
        if (!peer) throw new Error("没有可随机发送的联系人");
      }
      if (!peer) throw new Error("收件人不能为空");

      const thread = await upsertThread({
        maskId: state.activeMaskId,
        accountId: activeAcc.id,
        peerKey: peer.peerKey,
        peerType: peer.peerType,
        charId: peer.charId || "",
        peerName: peer.name,
        peerEmail: peer.email,
        subject
      });

      await appendMessage(thread.id, {
        fromName: activeAcc.alias,
        fromEmail: activeAcc.email,
        toName: peer.name,
        toEmail: peer.email,
        subject: subject || "(无主题)",
        body,
        direction: "out",
        senderType: "user",
      });

      // 发完后触发自动回信（char/stranger/sub类型不同）
      await autoReplyForThread(thread.id);

      await pullThreadsAndRenderInbox();
      state.currentThreadId = thread.id;
      state.currentView = "thread";
      renderThread(thread.id);
      renderTopLayout();
    }

    // ====== 回信逻辑 ======
    async function autoReplyForThread(threadId) {
      const thread = await DB.get(STORE_NAMES.THREADS, threadId);
      if (!thread) return;

      const msgsAll = await DB.getAll(STORE_NAMES.MESSAGES);
      const msgs = (msgsAll || [])
        .filter(m => m.threadId === threadId)
        .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

      const activeAcc = getActiveAccount();
      if (!activeAcc) return;

      const lastOut = [...msgs].reverse().find(m => m.direction === "out");
      if (!lastOut) return;

      // 订阅号线程通常不自动“回信”
      if (thread.peerType === "sub") return;

      const peer = {
        peerType: thread.peerType,
        charId: thread.charId || "",
        name: thread.peerName,
        email: thread.peerEmail
      };

      let reply = null;
      try {
        reply = await genAutoReply({
          thread,
          allMessages: msgs,
          lastUserMail: lastOut,
          peer,
          accountProfile: activeAcc,
        });
      } catch (e) {
        console.warn("[sms] auto reply llm failed:", e.message);
      }

      if (!reply) {
        // fallback
        reply = {
          subject: `Re: ${lastOut.subject || "(无主题)"}`,
          body: "已收到你的来信，稍后详细回复。",
        };
      }

      await appendMessage(thread.id, {
        fromName: peer.name || "未知发件人",
        fromEmail: peer.email || "unknown@mail",
        toName: activeAcc.alias,
        toEmail: activeAcc.email,
        subject: reply.subject || `Re: ${lastOut.subject || "(无主题)"}`,
        body: reply.body || "收到。",
        direction: "in",
        senderType: peer.peerType === "char" ? "char" : "stranger",
      });
    }

    async function genAutoReply({ thread, allMessages, lastUserMail, peer, accountProfile }) {
      if (!callLLM) return null;

      const chars = await DB.getAll("characters");
      const char = chars.find(c => c.id === peer.charId);

      const recent = allMessages.slice(-10).map(m => {
        const who = m.direction === "out" ? `${accountProfile.alias} <${accountProfile.email}>` : `${m.fromName} <${m.fromEmail}>`;
        return `${who}\nSubject: ${m.subject}\n${m.body}`;
      }).join("\n\n---\n\n");

      // 是否可能识破小号
      const identityHint = `
当前收件用户的小号信息：
- 发件别名: ${accountProfile.alias}
- 发件邮箱: ${accountProfile.email}
主面具名（真实身份）: ${state.activeMask?.name || "未知"}

请根据历史邮件内容判断：
- 你是否能推测这个小号与主身份有关
- 但不要每次都直接点破，可保持暧昧、试探或装不知道。
`;

      let rolePrompt = "";
      if (peer.peerType === "char" && char) {
        rolePrompt = `
你是一个真实的人类，正在通过邮箱回复来信。
你的身份：${char.name}
你的性格设定：${char.detail || "正常自然说话"}
邮件语气要更完整，像真实邮件，不要聊天式碎句。
`;
      } else {
        rolePrompt = `
你是一个陌生发件人，可能与收件人的联系人有关，也可能无关。
你可以保持礼貌、神秘或试探，但不要使用夸张悬疑腔。
`;
      }

      const prompt = `
${rolePrompt}
${identityHint}

以下是最近邮件往来：
${recent}

请你写一封回信，只输出以下格式，不要多余内容：

---subject---
（主题）
---body---
（正文，80~280字）
`;

      const raw = await callLLM([{ role: "user", content: prompt }], { maxTokens: 500 });

      const m1 = raw.match(/---subject---([\s\S]*?)---body---/);
      const m2 = raw.match(/---body---([\s\S]*)$/);

      const subject = (m1 ? m1[1] : "").trim() || `Re: ${lastUserMail.subject || "(无主题)"}`;
      const body = (m2 ? m2[1] : "").trim() || "收到你的邮件，稍后回复。";

      return { subject, body };
    }

    // ====== 陌生来信注入 ======
    async function maybeInjectIncoming() {
      const key = META_KEYS.STRANGER_LAST_AT_PREFIX + state.activeMaskId;
      const lastAt = await dbGetMeta(DB, key, 0);
      const now = nowTs();

      // 最短间隔 10 分钟
      if (now - lastAt < 10 * 60 * 1000) return;

      // 打开页面时小概率注入
      const p = Math.random();
      if (p > 0.35) return;

      const activeAcc = getActiveAccount();
      if (!activeAcc) return;

      let incomingType = "stranger"; // stranger | char
      if (Math.random() < 0.6 && state.contactPeers.length) incomingType = "char";

      let peer = null;
      if (incomingType === "char") {
        peer = randomPick(state.contactPeers);
      } else {
        peer = buildRandomStrangerPeer();
      }
      if (!peer) return;

      const thread = await upsertThread({
        maskId: state.activeMaskId,
        accountId: activeAcc.id,
        peerKey: peer.peerKey,
        peerType: peer.peerType,
        charId: peer.charId || "",
        peerName: peer.name,
        peerEmail: peer.email,
        subject: "问候",
      });

      const msg = await generateIncomingFirstMail(peer, activeAcc);
      await appendMessage(thread.id, {
        fromName: peer.name,
        fromEmail: peer.email,
        toName: activeAcc.alias,
        toEmail: activeAcc.email,
        subject: msg.subject,
        body: msg.body,
        direction: "in",
        senderType: peer.peerType === "char" ? "char" : "stranger",
        meta: {
          disguisedFromChar: !!peer.disguisedFromChar,
          realCharId: peer.realCharId || "",
        },
      });

      await dbSetMeta(DB, key, nowTs());
      await pullThreadsAndRenderInbox();

      if (state.currentView === "inbox") {
        renderInbox();
      }
    }

    function buildRandomStrangerPeer() {
      const poolNames = [
        "秦言", "陈北", "周岚", "白川", "林岸", "顾禾", "宋择", "匿名来信", "投稿箱", "部门通知"
      ];
      const n = randomPick(poolNames);
      const local = localPartFromName(n + Math.floor(Math.random() * 1000));
      const domains = ["letterhub.net", "postmail.cc", "mx-note.org", "companion.mail"];
      const email = `${local}@${randomPick(domains)}`;
      return {
        peerKey: `stranger:${email}`,
        peerType: "stranger",
        name: n,
        email
      };
    }

    async function generateIncomingFirstMail(peer, activeAcc) {
      // 简单模板 + 可选 llm
      if (!callLLM) {
        return {
          subject: "您好",
          body: "打扰了，我想确认一下这是不是您常用的邮箱地址。"
        };
      }
      try {
        const prompt = `
你要写一封“首次来信”，发给 ${activeAcc.alias} <${activeAcc.email}>。
发件人名：${peer.name}
发件人类型：${peer.peerType}
要求：
- 正常现实邮件风格
- 主题简短（不超过14字）
- 正文 60~180字
- 不要使用夸张悬疑语气，不要emoji
输出格式：
---subject---
...
---body---
...
`;
        const raw = await callLLM([{ role: "user", content: prompt }], { maxTokens: 260 });
        const m1 = raw.match(/---subject---([\s\S]*?)---body---/);
        const m2 = raw.match(/---body---([\s\S]*)$/);
        return {
          subject: (m1 ? m1[1] : "").trim() || "问候",
          body: (m2 ? m2[1] : "").trim() || "您好，冒昧来信，想和您确认一件事情。"
        };
      } catch {
        return {
          subject: "问候",
          body: "您好，冒昧来信，想和您确认一件事情。"
        };
      }
    }

    // ====== 订阅号 ======
    async function getSubsByMask(maskId) {
      const all = await DB.getAll(STORE_NAMES.SUBS);
      return (all || []).filter(s => s.maskId === maskId).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    }

    async function createSubChannel({ name, content, worldbookIds, freqType, freqHours, bindAccountId }) {
      const sub = {
        id: uid("sms_sub"),
        maskId: state.activeMaskId,
        accountId: bindAccountId || state.activeAccountId,
        name: safeText(name).trim(),
        content: safeText(content).trim(),
        worldbookIds: Array.isArray(worldbookIds) ? worldbookIds : [],
        freqType: freqType || "hours", // hours | once
        freqHours: clamp(parseInt(freqHours || 6), 1, 72),
        enabled: true,
        lastPushAt: 0,
        createdAt: nowTs(),
        updatedAt: nowTs(),
      };
      if (!sub.name) throw new Error("订阅号名称不能为空");
      if (!sub.content) throw new Error("订阅号内容不能为空");

      await DB.put(STORE_NAMES.SUBS, sub);
      return sub;
    }

    async function pushOneSubMail(sub) {
      const activeAcc = state.smsAccounts.find(a => a.id === sub.accountId);
      if (!activeAcc) return;

      const peerName = sub.name;
      const peerEmail = `${localPartFromName(sub.name)}@newsletter.mail`;
      const peerKey = `sub:${sub.id}`;

      const thread = await upsertThread({
        maskId: sub.maskId,
        accountId: sub.accountId,
        peerKey,
        peerType: "sub",
        peerName,
        peerEmail,
        subject: `${sub.name} 更新`,
      });

      const body = await buildSubMailBody(sub, activeAcc);

      await appendMessage(thread.id, {
        fromName: peerName,
        fromEmail: peerEmail,
        toName: activeAcc.alias,
        toEmail: activeAcc.email,
        subject: `${sub.name} 更新`,
        body,
        direction: "in",
        senderType: "sub",
      });

      sub.lastPushAt = nowTs();
      sub.updatedAt = nowTs();
      await DB.put(STORE_NAMES.SUBS, sub);
    }

    async function buildSubMailBody(sub, activeAcc) {
      // worldbook 摘要拼接
      let wbPart = "";
      if (sub.worldbookIds && sub.worldbookIds.length) {
        const allWb = await DB.getAll("worldbooks");
        const wbMap = new Map((allWb || []).map(w => [w.id, w]));
        const lines = [];
        for (const id of sub.worldbookIds) {
          const w = wbMap.get(id);
          if (w) lines.push(`- ${w.title}: ${(w.content || "").slice(0, 120)}`);
        }
        wbPart = lines.join("\n");
      }

      if (!callLLM) {
        return `${sub.content}\n\n${wbPart ? "参考素材：\n" + wbPart : ""}`;
      }

      try {
        const prompt = `
你是一个订阅号编辑器，要给用户发送一封“简洁但有信息量”的邮件。
订阅号名称：${sub.name}
基础内容：${sub.content}
可参考素材：
${wbPart || "无"}

要求：
- 保持现实邮件风格，不要emoji
- 120~320字
- 可分2~4段
- 不要夸张宣传口吻
只输出正文，不要加任何标记。
`;
        const out = await callLLM([{ role: "user", content: prompt }], { maxTokens: 420 });
        return (out || "").trim() || sub.content;
      } catch {
        return sub.content;
      }
    }

    async function maybeTickSubscriptions() {
      if (state.pushing) return;
      state.pushing = true;
      try {
        const subs = await getSubsByMask(state.activeMaskId);
        const now = nowTs();
        for (const s of subs) {
          if (!s.enabled) continue;

          if (s.freqType === "once") {
            if (!s.lastPushAt) {
              await pushOneSubMail(s);
            }
            continue;
          }

          const interval = clamp(parseInt(s.freqHours || 6), 1, 72) * 3600 * 1000;
          if (!s.lastPushAt || now - s.lastPushAt >= interval) {
            await pushOneSub        if (state.currentView === "inbox") renderInbox();
      } finally {
        state.pushing = false;
      }
    }

    function startTicker() {
      if (state.timer) clearInterval(state.timer);
      // 每分钟 tick 一次订阅 + 来信机会
      state.timer = setInterval(async () => {
        if (!state.activeMaskId) return;
        await maybeTickSubscriptions();
        await maybeInjectIncoming();
      }, 60 * 1000);
    }

    // ====== UI ======
    function renderTopLayout() {
      const shell = document.getElementById("smsShell");
      if (!shell) return;

      const activeAcc = getActiveAccount();
      const title = "Inbox";
      const addr = activeAcc ? `${activeAcc.alias} <${activeAcc.email}>` : "未选择账号";

      shell.innerHTML = `
        <div class="sms-app">
          <header class="sms-header">
            <button class="sms-icon-btn" data-action="sms_back" aria-label="back">
              <svg viewBox="0 0 24 24" class="sms-icon"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <div class="sms-header-main">
              <div class="sms-title">${escapeHtml(title)}</div>
              <div class="sms-subtitle">${escapeHtml(addr)}</div>
            </div>
            <button class="sms-icon-btn" data-action="sms_open_settings" aria-label="settings">
              <svg viewBox="0 0 24 24" class="sms-icon"><path d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm8.5 3.5l-1.8-.6a6.9 6.9 0 00-.6-1.4l.9-1.7-1.8-1.8-1.7.9a6.9 6.9 0 00-1.4-.6L14 3.5h-4l-.6 1.8a6.9 6.9 0 00-1.4.6l-1.7-.9-1.8 1.8.9 1.7a6.9 6.9 0 00-.6 1.4L3.5 12l1.8.6c.1.5.3 1 .6 1.4l-.9 1.7 1.8 1.8 1.7-.9c.4.3.9.5 1.4.6l.6 1.8h4l.6-1.8c.5-.1 1-.3 1.4-.6l1.7.9 1.8-1.8-.9-1.7c.3-.4.5-.9.6-1.4L20.5 12z"/></svg>
            </button>
          </header>

          <main class="sms-main" id="smsMainRegion"></main>

          <button class="sms-fab" data-action="sms_open_compose" aria-label="compose">
            <svg viewBox="0 0 24 24" class="sms-fab-icon"><path d="M4 20h4l10.5-10.5a1.5 1.5 0 10-2.1-2.1L5.9 17.9V20H4zM14 6l4 4"/></svg>
          </button>
        </div>
      `;
    }

    function renderInbox() {
      state.currentView = "inbox";
      const region = document.getElementById("smsMainRegion");
      if (!region) return;

      const threads = state.allThreads || [];

      const rows = threads.map(t => {
        const unread = (t.unreadCount || 0) > 0;
        return `
          <div class="sms-thread-row ${unread ? "unread" : ""}" data-action="sms_open_thread" data-thread-id="${t.id}">
            <div class="sms-thread-avatar">${escapeHtml((t.peerName || "?").slice(0, 1))}</div>
            <div class="sms-thread-body">
              <div class="sms-thread-top">
                <span class="sms-thread-name">${escapeHtml(t.peerName || "未知发件人")}</span>
                <span class="sms-thread-time">${prettyTime(t.updatedAt)}</span>
              </div>
              <div class="sms-thread-subject">${escapeHtml(t.lastSubject || "(无主题)")}</div>
              <div class="sms-thread-snippet">${escapeHtml(t.lastSnippet || "")}</div>
            </div>
            ${unread ? `<span class="sms-unread-dot"></span>` : ""}
          </div>
        `;
      }).join("");

      region.innerHTML = `
        <section class="sms-list-wrap">
          <div class="sms-search-bar" data-action="sms_open_compose">
            <svg viewBox="0 0 24 24" class="sms-icon"><path d="M11 4a7 7 0 105.3 11.6l4 4 1.4-1.4-4-4A7 7 0 0011 4z"/></svg>
            <span>写邮件</span>
          </div>

          ${rows || `<div class="sms-empty">暂无邮件</div>`}
        </section>
      `;
    }

    function renderThread(threadId) {
      state.currentView = "thread";
      state.currentThreadId = threadId;

      const region = document.getElementById("smsMainRegion");
      if (!region) return;

      const th = state.allThreads.find(t => t.id === threadId);
      if (!th) {
        region.innerHTML = `<div class="sms-empty">线程不存在</div>`;
        return;
      }

      const msgs = state.threadMessagesMap.get(threadId) || [];

      const items = msgs.map(m => {
        const isOut = m.direction === "out";
        return `
          <article class="sms-mail-card ${isOut ? "out" : "in"}">
            <div class="sms-mail-head">
              <div class="sms-mail-from">${escapeHtml(isOut ? `${m.fromName} <${m.fromEmail}>` : `${m.fromName} <${m.fromEmail}>`)}</div>
              <div class="sms-mail-time">${new Date(m.timestamp).toLocaleString("zh-CN")}</div>
            </div>
            <div class="sms-mail-subject">${escapeHtml(m.subject || "(无主题)")}</div>
            <div class="sms-mail-body">${escapeHtml(m.body || "").replace(/\n/g, "<br>")}</div>
          </article>
        `;
      }).join("");

      region.innerHTML = `
        <section class="sms-thread-view">
          <div class="sms-thread-headerline">
            <div class="sms-thread-peer">${escapeHtml(th.peerName || "未知发件人")}</div>
            <div class="sms-thread-peer-mail">${escapeHtml(th.peerEmail || "")}</div>
          </div>

          <div class="sms-thread-messages">${items || `<div class="sms-empty">暂无内容</div>`}</div>

          <div class="sms-reply-box">
            <input id="smsReplySubject" class="sms-input" placeholder="主题（可选）" />
            <textarea id="smsReplyBody" class="sms-textarea" placeholder="撰写回信"></textarea>
            <div class="sms-reply-actions">
              <button class="sms-btn ghost" data-action="sms_back_inbox">返回收件箱</button>
              <button class="sms-btn primary" data-action="sms_send_reply" data-thread-id="${th.id}">发送回信</button>
            </div>
          </div>
        </section>
      `;

      // 清未读
      markThreadRead(threadId).then(async () => {
        await pullThreadsAndRenderInbox();
      });
    }

    async function renderCompose() {
      state.currentView = "compose";
      const region = document.getElementById("smsMainRegion");
      if (!region) return;

      await refreshPeers();

      const opts = state.contactPeers.map(p =>
        `<option value="${escapeHtml(p.peerKey)}">${escapeHtml(p.name)} &lt;${escapeHtml(p.email)}&gt;</option>`
      ).join("");

      region.innerHTML = `
        <section class="sms-compose-view">
          <div class="sms-form-row">
            <label class="sms-label">收件人</label>
            <select id="smsToPeer" class="sms-select">
              <option value="">请选择联系人</option>
              ${opts}
            </select>
          </div>

          <div class="sms-form-row sms-inline-check">
            <input type="checkbox" id="smsRandomSend" />
            <label for="smsRandomSend">随机发送给一个联系人</label>
          </div>

          <div class="sms-form-row">
            <label class="sms-label">主题</label>
            <input id="smsSubject" class="sms-input" placeholder="主题（可选）" />
          </div>

          <div class="sms-form-row">
            <label class="sms-label">正文</label>
            <textarea id="smsBody" class="sms-textarea large" placeholder="撰写邮件内容"></textarea>
          </div>

          <div class="sms-compose-actions">
            <button class="sms-btn ghost" data-action="sms_back_inbox">取消</button>
            <button class="sms-btn primary" data-action="sms_send_compose">发送</button>
          </div>
        </section>
      `;
    }

    async function renderSettings() {
      state.currentView = "settings";
      const region = document.getElementById("smsMainRegion");
      if (!region) return;

      const activeId = state.activeAccountId;
      const rows = state.smsAccounts.map(acc => `
        <div class="sms-account-row ${acc.id === activeId ? "active" : ""}">
          <div class="sms-account-main">
            <div class="sms-account-alias">${escapeHtml(acc.alias)}</div>
            <div class="sms-account-email">${escapeHtml(acc.email)}</div>
            <div class="sms-account-note">${escapeHtml(acc.note || "")}</div>
          </div>
          ${acc.id === activeId
            ? `<span class="sms-badge">当前</span>`
            : `<button class="sms-btn small" data-action="sms_switch_account" data-account-id="${acc.id}">切换</button>`
          }
        </div>
      `).join("");

      region.innerHTML = `
        <section class="sms-settings-view">
          <div class="sms-settings-head">账号管理</div>
          <div class="sms-account-list">${rows || `<div class="sms-empty">暂无账号</div>`}</div>

          <div class="sms-divider"></div>

          <div class="sms-settings-head">新建小号</div>
          <div class="sms-form-row">
            <label class="sms-label">显示名</label>
            <input id="smsNewAlias" class="sms-input" placeholder="例如：小白" />
          </div>
          <div class="sms-form-row">
            <label class="sms-label">邮箱地址</label>
            <input id="smsNewEmail" class="sms-input" placeholder="例如：xiaobai@alias.mail" />
          </div>
          <div class="sms-form-row">
            <label class="sms-label">备注</label>
            <input id="smsNewNote" class="sms-input" placeholder="可选" />
          </div>

          <div class="sms-compose-actions">
            <button class="sms-btn ghost" data-action="sms_back_inbox">返回</button>
            <button class="sms-btn primary" data-action="sms_create_account">创建小号</button>
          </div>

          <div class="sms-divider"></div>
          <div class="sms-settings-head">订阅号</div>
          <div class="sms-compose-actions">
            <button class="sms-btn ghost" data-action="sms_open_subs">管理订阅号</button>
          </div>
        </section>
      `;
    }

    async function renderSubs() {
      state.currentView = "subs";
      const region = document.getElementById("smsMainRegion");
      if (!region) return;

      const subs = await getSubsByMask(state.activeMaskId);
      const worldbooks = await DB.getAll("worldbooks");
      const wbOpts = (worldbooks || []).map(w => `<option value="${w.id}">${escapeHtml(w.title)}</option>`).join("");

      const rows = subs.map(s => `
        <div class="sms-sub-row">
          <div class="sms-sub-main">
            <div class="sms-sub-name">${escapeHtml(s.name)}</div>
            <div class="sms-sub-meta">
              ${escapeHtml(s.freqType === "once" ? "立即推送一次" : `${s.freqHours}小时/次`)}
              · ${s.enabled ? "启用" : "停用"}
            </div>
            <div class="sms-sub-content">${escapeHtml((s.content || "").slice(0, 90))}</div>
          </div>
          <div class="sms-sub-actions">
            <button class="sms-btn small" data-action="sms_push_sub_once" data-sub-id="${s.id}">立即推送</button>
            <button class="sms-btn small" data-action="sms_toggle_sub" data-sub-id="${s.id}">${s.enabled ? "停用" : "启用"}</button>
          </div>
        </div>
      `).join("");

      region.innerHTML = `
        <section class="sms-subs-view">
          <div class="sms-settings-head">订阅号列表</div>
          <div>${rows || `<div class="sms-empty">暂无订阅号</div>`}</div>

          <div class="sms-divider"></div>

          <div class="sms-settings-head">新建订阅号</div>
          <div class="sms-form-row">
            <label class="sms-label">名称</label>
            <input id="smsSubName" class="sms-input" placeholder="例如：晨报简讯" />
          </div>
          <div class="sms-form-row">
            <label class="sms-label">内容模板</label>
            <textarea id="smsSubContent" class="sms-textarea" placeholder="自由文本内容"></textarea>
          </div>
          <div class="sms-form-row">
            <label class="sms-label">世界书（可多选）</label>
            <select id="smsSubWorldbooks" class="sms-select" multiple size="4">${wbOpts}</select>
          </div>
          <div class="sms-form-row">
            <label class="sms-label">推送频率</label>
            <select id="smsSubFreqType" class="sms-select">
              <option value="hours">按小时推送</option>
              <option value="once">立刻推送一条</option>
            </select>
          </div>
          <div class="sms-form-row" id="smsSubHoursRow">
            <label class="sms-label">间隔小时</label>
            <input id="smsSubFreqHours" class="sms-input" type="number" min="1" max="72" value="6" />
          </div>

          <div class="sms-compose-actions">
            <button class="sms-btn ghost" data-action="sms_open_settings">返回设置</button>
            <button class="sms-btn primary" data-action="sms_create_sub">创建订阅号</button>
          </div>
        </section>
      `;
    }

    // ====== 事件委托 ======
    function bindGlobalDelegation() {
      const root = document.body;
      if (!root || root.dataset.smsDelegated) return;
      root.dataset.smsDelegated = "1";

      root.addEventListener("click", async (e) => {
        const btn = e.target.closest("[data-action]");
        if (!btn) return;
        const act = btn.dataset.action;

        try {
          if (act === "sms_back") {
            switchPage("desktop");
            return;
          }

          if (act === "sms_back_inbox") {
            await pullThreadsAndRenderInbox();
            renderInbox();
            renderTopLayout();
            return;
          }

          if (act === "sms_open_compose") {
            await renderCompose();
            renderTopLayout();
            return;
          }

          if (act === "sms_open_thread") {
            const id = btn.dataset.threadId;
            if (!id) return;
            await pullThreadsAndRenderInbox();
            renderThread(id);
            renderTopLayout();
            return;
          }

          if (act === "sms_send_compose") {
            const toPeerKey = (document.getElementById("smsToPeer")?.value || "").trim();
            const randomSend = !!document.getElementById("smsRandomSend")?.checked;
            const subject = (document.getElementById("smsSubject")?.value || "").trim();
            const body = (document.getElementById("smsBody")?.value || "").trim();

            let peer = null;
            if (!randomSend) {
              peer = state.contactPeers.find(p => p.peerKey === toPeerKey) || null;
            }

            await sendMail({ toPeer: peer, subject, body, randomSend });
            showStatus("✅ 邮件已发送", "success");
            return;
          }

          if (act === "sms_send_reply") {
            const threadId = btn.dataset.threadId;
            if (!threadId) return;
            const th = state.allThreads.find(t => t.id === threadId);
            if (!th) throw new Error("线程不存在");

            const subject = (document.getElementById("smsReplySubject")?.value || "").trim() || `Re: ${th.lastSubject || "(无主题)"}`;
            const body = (document.getElementById("smsReplyBody")?.value || "").trim();
            if (!body) throw new Error("回信正文不能为空");

            const activeAcc = getActiveAccount();
            await appendMessage(threadId, {
              fromName: activeAcc.alias,
              fromEmail: activeAcc.email,
              toName: th.peerName,
              toEmail: th.peerEmail,
              subject,
              body,
              direction: "out",
              senderType: "user",
            });

            await autoReplyForThread(threadId);
            await pullThreadsAndRenderInbox();
            renderThread(threadId);
            renderTopLayout();
            showStatus("✅ 回信已发送", "success");
            return;
          }

          if (act === "sms_open_settings") {
            await bootstrapMaskAndAccounts();
            renderTopLayout();
            await renderSettings();
            return;
          }

          if (act === "sms_create_account") {
            const alias = (document.getElementById("smsNewAlias")?.value || "").trim();
            const email = (document.getElementById("smsNewEmail")?.value || "").trim();
            const note = (document.getElementById("smsNewNote")?.value || "").trim();

            if (!alias) throw new Error("显示名不能为空");
            const acc = await createSMSAccount(state.activeMaskId, alias, email, note);
            state.smsAccounts = await getSMSAccountsByMask(state.activeMaskId);
            await switchSMSAccount(acc.id);
            await renderSettings();
            renderTopLayout();
            showStatus("✅ 小号创建成功", "success");
            return;
          }

          if (act === "sms_switch_account") {
            const id = btn.dataset.accountId;
            await switchSMSAccount(id);
            await renderSettings();
            renderTopLayout();
            showStatus("✅ 已切换账号", "success");
            return;
          }

          if (act === "sms_open_subs") {
            renderTopLayout();
            await renderSubs();
            return;
          }

          if (act === "sms_create_sub") {
            const name = (document.getElementById("smsSubName")?.value || "").trim();
            const content = (document.getElementById("smsSubContent")?.value || "").trim();
            const freqType = (document.getElementById("smsSubFreqType")?.value || "hours").trim();
            const freqHours = parseInt(document.getElementById("smsSubFreqHours")?.value || "6");
            const wbSel = document.getElementById("smsSubWorldbooks");
            const worldbookIds = wbSel
              ? Array.from(wbSel.selectedOptions || []).map(o => o.value).filter(Boolean)
              : [];

            const sub = await createSubChannel({
              name, content, worldbookIds, freqType, freqHours, bindAccountId: state.activeAccountId
            });

            if (sub.freqType === "once") {
              await pushOneSubMail(sub);
            }

            await pullThreadsAndRenderInbox();
            await renderSubs();
            showStatus("✅ 订阅号已创建", "success");
            return;
          }

          if (act === "sms_push_sub_once") {
            const id = btn.dataset.subId;
            const sub = await DB.get(STORE_NAMES.SUBS, id);
            if (!sub) return;
            await pushOneSubMail(sub);
            await pullThreadsAndRenderInbox();
            await renderSubs();
            showStatus("✅ 已推送一条订阅邮件", "success");
            return;
          }

          if (act === "sms_toggle_sub") {
            const id = btn.dataset.subId;
            const sub = await DB.get(STORE_NAMES.SUBS, id);
            if (!sub) return;
            sub.enabled = !sub.enabled;
            sub.updatedAt = nowTs();
            await DB.put(STORE_NAMES.SUBS, sub);
            await renderSubs();
            showStatus("✅ 已更新订阅状态", "success");
            return;
          }
        } catch (err) {
          console.error("[sms action error]", err);
          showStatus(`❌ ${err.message || "操作失败"}`, "error");
        }
      });

      // 订阅频率 UI 联动
      root.addEventListener("change", (e) => {
        const el = e.target;
        if (el && el.id === "smsSubFreqType") {
          const row = document.getElementById("smsSubHoursRow");
          if (row) row.style.display = el.value === "hours" ? "" : "none";
        }
        if (el && el.id === "smsRandomSend") {
          const sel = document.getElementById("smsToPeer");
          if (sel) sel.disabled = !!el.checked;
        }
      });
    }

    // ====== 公开 API ======
    return {
      init,
      openSMSPage,
      // 便于调试
      _state: state,
      _api: {
        refreshPeers,
        maybeInjectIncoming,
        maybeTickSubscriptions
      }
    };
  };
})();