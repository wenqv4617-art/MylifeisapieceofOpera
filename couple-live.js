/* ================================================================
 * couple-live.js - 情侣空间 · 直播系统
 * 依赖：
 * window.DB, window.callLLM, window.escapeHtml, window.showStatus,
 * window.getAvatarColor, window.currentConversationId
 * ================================================================ */

(function () {
  "use strict";

  console.log("LIVE SYSTEM module loading");

  const ICONS = {
    back: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
    live: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 10l5 2-5 2v-4z"/></svg>',
    users: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    rank: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    book: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="M22 6 12 13 2 6"/></svg>',
    send: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>'
  };

  const DEFAULT_STATE = {
    enabled: false,
    minDanmaku: 4,
    maxDanmaku: 10,
    fans: 128,
    worldbookIds: [],
    rank: [
      { name: "NullPointer", amount: 2600 },
      { name: "BlackBox", amount: 1800 },
      { name: "ObserverX", amount: 900 }
    ],
    danmakuHistory: [],
    fanGroup: {
      messages: [
        { role: "system", sender: "SYSTEM", content: "粉丝群已创建。", time: Date.now() }
      ]
    },
    inbox: {
      char: [],
      user: []
    },
    currentTab: "group"
  };

  function esc(s) {
    if (window.escapeHtml) return window.escapeHtml(s);
    return String(s == null ? "" : s).replace(/[&<>"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m]));
  }

  function keyOf(convId) {
    return "couple_live_state_" + convId;
  }

  async function getState(convId) {
    const raw = await window.DB.getSetting(keyOf(convId), null);
    if (!raw) {
      const s = structuredCloneSafe(DEFAULT_STATE);
      await saveState(convId, s);
      return s;
    }
    return mergeState(structuredCloneSafe(DEFAULT_STATE), raw);
  }

  async function saveState(convId, state) {
    await window.DB.setSetting(keyOf(convId), state);
  }

  function structuredCloneSafe(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function mergeState(base, saved) {
    const out = Object.assign(base, saved || {});
    out.rank = Array.isArray(out.rank) ? out.rank : [];
    out.danmakuHistory = Array.isArray(out.danmakuHistory) ? out.danmakuHistory : [];
    out.worldbookIds = Array.isArray(out.worldbookIds) ? out.worldbookIds : [];
    out.fanGroup = out.fanGroup || { messages: [] };
    out.fanGroup.messages = Array.isArray(out.fanGroup.messages) ? out.fanGroup.messages : [];
    out.inbox = out.inbox || {};
    out.inbox.char = Array.isArray(out.inbox.char) ? out.inbox.char : [];
    out.inbox.user = Array.isArray(out.inbox.user) ? out.inbox.user : [];
    return out;
  }

  async function getNames(convId) {
    const DB = window.DB;
    const conv = await DB.get("conversations", convId);
    if (!conv) return { charName: "CHAR", userName: "USER", charDetail: "", userDetail: "" };

    const char = await DB.get("characters", conv.charId);
    const mask = await DB.get("userProfiles", conv.maskId);
    const detail = await DB.get("convDetails", convId);

    return {
      conv,
      char,
      mask,
      charName: detail?.charName || char?.name || "CHAR",
      userName: detail?.userName || mask?.name || "USER",
      charDetail: detail?.charDetail || char?.detail || "",
      userDetail: detail?.userDetail || mask?.bio || ""
    };
  }

  async function getLiveWorldbookText(state) {
    const all = await window.DB.getAll("worldbooks");
    const selected = all.filter(w => state.worldbookIds.includes(w.id));
    if (!selected.length) return "";
    return selected.map(w => `【${w.group || "未分组"} / ${w.title}】\n${w.content}`).join("\n\n");
  }

  function ensurePage() {
    let page = document.getElementById("page-couple-live");
    if (page) return page;

    page = document.createElement("div");
    page.id = "page-couple-live";
    page.className = "page";
    page.innerHTML = `
      <div class="chat-header cs-header">
        <div class="chat-header-left">
          <button class="back-btn clickable" id="cliveBackBtn">${ICONS.back}</button>
          <h2 class="cs-title">LIVE SYSTEM</h2>
        </div>
        <div class="header-actions"></div>
      </div>
      <div class="cs-scroll clive-page" id="cliveRoot"></div>
    `;

    const appMain = document.querySelector(".app-main");
    if (appMain) appMain.appendChild(page);
    else document.body.appendChild(page);

    page.querySelector("#cliveBackBtn").addEventListener("click", () => {
      if (window.coupleSpaceModule && window._currentCoupleSpaceConvId) {
        window.coupleSpaceModule.openCoupleSpace(window._currentCoupleSpaceConvId);
      } else if (window.switchPage) {
        window.switchPage("conversation");
      }
    });

    return page;
  }

  function activatePage() {
    document.querySelectorAll(".page").forEach(p => {
      if (p.id !== "page-couple-live") {
        p.classList.remove("active");
        if (p.style.display && p.style.display !== "none") p.style.display = "none";
      }
    });

    const homeMain = document.getElementById("homeMain");
    const homeDock = document.querySelector(".home-dock");
    const pageInd = document.querySelector(".page-indicator");
    const appMain = document.querySelector(".app-main");
    const tabBar = document.getElementById("mainTabBar");
    const momentsFab = document.getElementById("momentsFabBtn");

    if (homeMain) homeMain.style.display = "none";
    if (homeDock) homeDock.style.display = "none";
    if (pageInd) pageInd.style.display = "none";
    if (appMain) appMain.style.display = "";
    if (tabBar) tabBar.style.display = "none";
    if (momentsFab) momentsFab.style.display = "none";

    const couplePage = document.getElementById("page-couple-space");
    if (couplePage) couplePage.setAttribute("data-live-theme", "tech");

    const page = ensurePage();
    page.style.display = "";
    page.classList.add("active");
  }

  async function open(convId) {
    if (!convId) {
      window.showStatus?.("请先进入对话", "error");
      return;
    }
    window._currentCoupleLiveConvId = convId;
    ensurePage();
    activatePage();
    await render(convId);
  }

  async function render(convId) {
    const root = document.getElementById("cliveRoot");
    if (!root) return;

    const state = await getState(convId);
    const names = await getNames(convId);

    root.innerHTML = `
      ${renderControlPanel(state)}
      ${await renderWorldbookPanel(state)}
      ${renderFanChannel(state, names)}
    `;

    bindControlEvents(convId);
    bindWorldbookEvents(convId);
    bindChannelEvents(convId);
  }

  function renderControlPanel(state) {
    const totalTip = state.rank.reduce((sum, r) => sum + Number(r.amount || 0), 0);
    const rankHtml = state.rank.length
      ? state.rank
          .sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0))
          .slice(0, 10)
          .map((r, i) => `
            <div class="clive-rank-row">
              <div class="clive-rank-no">${String(i + 1).padStart(2, "0")}</div>
              <div class="clive-rank-name">${esc(r.name)}</div>
              <div class="clive-rank-amt">${Number(r.amount || 0)}</div>
            </div>
          `).join("")
      : `<div class="clive-empty">暂无打榜记录</div>`;

    return `
      <div class="clive-panel">
        <div class="clive-panel-title">${ICONS.live}<span>CONTROL PANEL</span></div>

        <div class="clive-row">
          <div>
            <div class="clive-label">直播系统开关</div>
            <div class="clive-sub">开启后，线上与线下每轮角色回复都会生成弹幕和粉丝动态。</div>
          </div>
          <div class="clive-switch ${state.enabled ? "on" : ""}" id="cliveSwitch"></div>
        </div>

        <div class="clive-row">
          <div>
            <div class="clive-label">每轮弹幕数量</div>
            <div class="clive-sub">控制 API 每次返回的弹幕最小与最大条数。</div>
          </div>
          <div class="clive-two-inputs">
            <input class="clive-input" id="cliveMinInput" type="number" min="1" max="30" value="${Number(state.minDanmaku || 4)}">
            <span class="clive-label">to</span>
            <input class="clive-input" id="cliveMaxInput" type="number" min="1" max="60" value="${Number(state.maxDanmaku || 10)}">
          </div>
        </div>

        <div class="clive-num-card">
          <div class="clive-stat">
            <div class="clive-stat-num" id="cliveFansNum">${Number(state.fans || 0)}</div>
            <div class="clive-stat-label">FOLLOWERS</div>
          </div>
          <div class="clive-stat">
            <div class="clive-stat-num">${totalTip}</div>
            <div class="clive-stat-label">TOTAL TIPS</div>
          </div>
        </div>

        <div style="height:12px"></div>

        <div class="clive-panel-title">${ICONS.rank}<span>RANKING</span></div>
        <div class="clive-rank-list">${rankHtml}</div>

        <div style="height:12px"></div>
        <button class="clive-save-btn" id="cliveSaveControlBtn">SAVE SETTINGS</button>
      </div>
    `;
  }

  async function renderWorldbookPanel(state) {
    const all = await window.DB.getAll("worldbooks");
    if (!all.length) {
      return `
        <div class="clive-panel">
          <div class="clive-panel-title">${ICONS.book}<span>LIVE WORLDBOOK</span></div>
          <div class="clive-empty">暂无世界书</div>
        </div>
      `;
    }

    const groups = {};
    all.forEach(w => {
      const g = w.group || "未分组";
      if (!groups[g]) groups[g] = [];
      groups[g].push(w);
    });

    const groupHtml = Object.keys(groups).sort().map(groupName => {
      const list = groups[groupName];
      const checkedCount = list.filter(w => state.worldbookIds.includes(w.id)).length;
      return `
        <div class="clive-wb-group ${checkedCount ? "" : "collapsed"}">
          <div class="clive-wb-group-head">
            <span>${esc(groupName)}</span>
            <span>${checkedCount}/${list.length}</span>
          </div>
          <div class="clive-wb-group-body">
            ${list.map(w => `
              <label class="clive-wb-check">
                <input type="checkbox" class="cliveWbCheck" value="${esc(w.id)}" ${state.worldbookIds.includes(w.id) ? "checked" : ""}>
                <div>
                  <div class="ive-titleesc(w.title || "未命名")}</div>
                  <div class="clive-wb-preview">${esc((w.content || "").slice(0, 80))}${(w.content || "").length > 80 ?div>
 </>
).}
          </div>
        </div>
      `;
    }).join("");

    return `
      <div class="clive-panel">
        <div class="clive-panel-title">${ICONS.book}<span>LIVE WORLDBOOK</span></div>
        <div class="clive-sub" style="margin-bottom:10px;">直播世界书独立于线上/线下聊天，仅用于弹幕、粉丝群和私信。</div>
        ${groupHtml}
        <button class="clive-save-btn" id="cliveSaveWbBtn">SAVE WORLDBOOKS</button>
      </div>
    `;
  }

  function renderFanChannel(state, names) {
    const tab = state.currentTab || "group";

    let body = "";
    if (tab === "group") {
      body = `
        <div class="clive-fan-group-card" id="cliveOpenFanGroup">
          <div class="clive-fan-group-title">FAN GROUP</div>
          <div class="clive-fan-group-desc">观众集中讨论 ${esc(names.charName)} 与 ${esc(names.userName)} 的直播内容。</div>
        </div>
      `;
    } else {
      const boxType = tab === "charInbox" ? "char" : "user";
      const list = state.inbox[boxType] || [];
      if (!list.length) {
        body = `<div class="clive-empty">当前私信箱暂无消息</div>`;
      } else {
        body = list.map(dm => `
          <div class="clive-dm-card" data-dm-id="${esc(dm.id)}" data-dm-box="${boxType}">
            <div class="clive-dm-name">${esc(dm.from || "anonymous")}</div>
            <div class="clive-dm-preview">${esc(lastDmPreview(dm))}</div>
          </div>
        `).join("");
      }
    }

    return `
      <div class="clive-panel">
        <div class="clive-panel-title">${ICONS.users}<span>FAN CHANNEL</span></div>

        <div class="clive-channel-tabs">
          <div class="clive-channel-tab ${tab === "group" ? "active" : ""}" data-clive-tab="group">粉丝群</div>
          <div class="clive-channel-tab ${tab === "charInbox" ? "active" : ""}" data-clive-tab="charInbox">${esc(names.charName)} 私信箱</div>
          <div class="clive-channel-tab ${tab === "userInbox" ? "active" : ""}" data-clive-tab="userInbox">${esc(names.userName)} 私信箱</div>
        </div>

        ${body}

        <div style="height:10px"></div>
        <button class="clive-secondary-btn" id="cliveSeedInboxBtn">GENERATE TEST MESSAGES</button>
      </div>
    `;
  }

  function lastDmPreview(dm) {
    const arr = dm.messages || [];
    const last = arr[arr.length - 1];
    return last ? last.content : dm.content || "";
  }

  function bindControlEvents(convId) {
    const sw = document.getElementById("cliveSwitch");
    sw?.addEventListener("click", async () => {
      const s = await getState(convId);
      s.enabled = !s.enabled;
      await saveState(convId, s);
      await render(convId);
      window.showStatus?.(s.enabled ? "直播系统已开启" : "直播系统已关闭", "success");
    });

    document.getElementById("cliveSaveControlBtn")?.addEventListener("click", async () => {
      const s = await getState(convId);
      let min = parseInt(document.getElementById("cliveMinInput").value || "4", 10);
      let max = parseInt(document.getElementById("cliveMaxInput").value || "10", 10);
      min = Math.max(1, Math.min(30, min));
      max = Math.max(min, Math.min(60, max));
      s.minDanmaku = min;
      s.maxDanmaku = max;
      await saveState(convId, s);
      await render(convId);
      window.showStatus?.("直播控制参数已保存", "success");
    });
  }

  function bindWorldbookEvents(convId) {
    document.querySelectorAll(".clive-wb-group-head").forEach(head => {
      head.addEventListener("click", () => {
        head.closest(".clive-wb-group")?.classList.toggle("collapsed");
      });
    });

    document.getElementById("cliveSaveWbBtn")?.addEventListener("click", async () => {
      const s = await getState(convId);
      s.worldbookIds = Array.from(document.querySelectorAll(".cliveWbCheck:checked")).map(x => x.value);
      await saveState(convId, s);
      await render(convId);
      window.showStatus?.("直播世界书已保存", "success");
    });
  }

  function bindChannelEvents(convId) {
    document.querySelectorAll(".clive-channel-tab").forEach(tab => {
      tab.addEventListener("click", async () => {
        const s = await getState(convId);
        s.currentTab = tab.dataset.cliveTab;
        await saveState(convId, s);
        await render(convId);
      });
    });

    document.getElementById("cliveOpenFanGroup")?.addEventListener("click", () => openFanGroup(convId));

    document.querySelectorAll(".clive-dm-card").forEach(card => {
      card.addEventListener("click", () => openDm(convId, card.dataset.dmBox, card.dataset.dmId));
    });

    document.getElementById("cliveSeedInboxBtn")?.addEventListener("click", async () => {
      await seedFanMessages(convId);
      await render(convId);
      window.showStatus?.("已生成模拟私信", "success");
    });
  }

  async function openFanGroup(convId) {
    const page = ensurePage();
    activatePage();

    const root = document.getElementById("cliveRoot");
    const s = await getState(convId);
    const messages = s.fanGroup.messages || [];

    root.innerHTML = `
      <div class="clive-panel">
        <div class="clive-panel-title">${ICONS.users}<span>FAN GROUP</span></div>
        <div class="clive-chat-log" id="cliveFanGroupLog">
          ${messages.map(m => renderChatMsg(m)).join("")}
        </div>
        <div class="clive-chat-row">
          <input class="clive-input-wide" id="cliveFanGroupInput" placeholder="输入要发送到粉丝群的内容">
          <button class="clive-primary-btn" id="cliveFanGroupSend">${ICONS.send}</button>
        </div>
        <div style="height:8px"></div>
        <button class="clive-secondary-btn" id="cliveFanGroupAi">GENERATE FAN REPLIES</button>
      </div>
    `;

    scrollChatLog();

    document.getElementById("cliveFanGroupSend")?.addEventListener("click", async () => {
      const input = document.getElementById("cliveFanGroupInput");
      const text = input.value.trim();
      if (!text) return;
      const ss = await getState(convId);
      ss.fanGroup.messages.push({
        role: "self",
        sender: "YOU",
        content: text,
        time: Date.now()
      });
      await saveState(convId, ss);
      await openFanGroup(convId);
    });

    document.getElementById("cliveFanGroupAi")?.addEventListener("click", async () => {
      await generateFanGroupReplies(convId);
      await openFanGroup(convId);
    });
  }

  function renderChatMsg(m) {
    return `
      <div class="clive-chat-msg ${m.role === "self" ? "self" : m.role === "system" ? "system" : ""}">
        <div class="clive-chat-sender">${esc(m.sender || "FAN")}</div>
        <div>${esc(m.content || "")}</div>
      </div>
    `;
  }

  function scrollChatLog() {
    setTimeout(() => {
      const el = document.querySelector(".clive-chat-log");
      if (el) el.scrollTop = el.scrollHeight;
    }, 60);
  }

  async function openDm(convId, box, dmId) {
    const page = ensurePage();
    activatePage();

    const s = await getState(convId);
    const list = s.inbox[box] || [];
    const dm = list.find(x => String(x.id) === String(dmId));
    if (!dm) return;

    const root = document.getElementById("cliveRoot");
    root.innerHTML = `
      <div class="clive-panel">
        <div class="clive-panel-title">${ICONS.mail}<span>${box === "char" ? "CHAR INBOX" : "USER INBOX"} / ${esc(dm.from)}</span></div>

        <div class="clive-chat-log">
          ${(dm.messages || []).map(m => renderChatMsg(m)).join("")}
        </div>

        <div class="clive-chat-row">
          <input class="clive-input-wide" id="cliveDmInput" placeholder="输入回复内容">
          <button class="clive-primary-btn" id="cliveDmSend">${ICONS.send}</button>
        </div>

        <div style="height:8px"></div>
        <button class="clive-secondary-btn" id="cliveDmAiReply">GENERATE REPLY</button>
      </div>
    `;

    scrollChatLog();

    document.getElementById("cliveDmSend")?.addEventListener("click", async () => {
      const input = document.getElementById("cliveDmInput");
      const text = input.value.trim();
      if (!text) return;
      await addDmMessage(convId, box, dmId, {
        role: "self",
        sender: box === "char" ? "CHAR" : "USER",
        content: text,
        time: Date.now()
      });
      await openDm(convId, box, dmId);
    });

    document.getElementById("cliveDmAiReply")?.addEventListener("click", async () => {
      await generateDmReply(convId, box, dmId);
      await openDm(convId, box, dmId);
    });
  }

  async function addDmMessage(convId, box, dmId, msg) {
    const s = await getState(convId);
    const list = s.inbox[box] || [];
    const dm = list.find(x => String(x.id) === String(dmId));
    if (!dm) return;
    dm.messages = dm.messages || [];
    dm.messages.push(msg);
    await saveState(convId, s);
  }

  async function seedFanMessages(convId) {
    const s = await getState(convId);
    const t = Date.now();

    s.inbox.char.unshift({
      id: "dm_char_" + t,
      from: "ColdReader",
      messages: [
        { role: "fan", sender: "ColdReader", content: "你刚才那句不像营业，像真心话。", time: t }
      ]
    });

    s.inbox.user.unshift({
      id: "dm_user_" + t,
      from: "DeepViewer",
      messages: [
        { role: "fan", sender: "DeepViewer", content: "你是不是故意在镜头前逗他？观众已经看出来了。", time: t }
      ]
    });

    await saveState(convId, s);
  }

  async function generateFanGroupReplies(convId) {
    const s = await getState(convId);
    const names = await getNames(convId);
    const wb = await getLiveWorldbookText(s);

    const recent = (s.fanGroup.messages || []).slice(-12)
      .map(m => `${m.sender}: ${m.content}`).join("\n");

    const prompt = `
你正在模拟一个直播间的粉丝群。
风格要求：强网感、会玩梗、会阴阳怪气、会嗑、会吵架，但不要脏话和人身攻击。
禁止使用 emoji。
禁止解释。
每条格式：昵称:内容
返回 3 到 6 条。

直播主角：
char=${names.charName}
user=${names.userName}

直播世界书：
${wb || "无"}

粉丝群最近聊天：
${recent || "暂无"}

现在生成粉丝群的新回复。`;

    try {
      window.recordApiPending?.();
      const res = await window.callLLM([{ role: "user", content: prompt }], { maxTokens: 700, temperature: 0.95 });
      const lines = res.split(/\n+/).map(x => x.trim()).filter(Boolean).slice(0, 8);

      lines.forEach(line => {
        const idx = line.indexOf(":");
        const sender = idx > -1 ? line.slice(0, idx).trim() : "Viewer";
        const content = idx > -1 ? line.slice(idx + 1).trim() : line;
        s.fanGroup.messages.push({ role: "fan", sender, content, time: Date.now() });
      });

      await saveState(convId, s);
    } catch (e) {
      window.showStatus?.("粉丝群生成失败：" + e.message, "error");
    }
  }

  async function generateDmReply(convId, box, dmId) {
    const s = await getState(convId);
    const list = s.inbox[box] || [];
    const dm = list.find(x => String(x.id) === String(dmId));
    if (!dm) return;

    const names = await getNames(convId);
    const wb = await getLiveWorldbookText(s);

    const speaker = box === "char" ? names.charName : names.userName;
    const persona = box === "char" ? names.charDetail : names.userDetail;

    const history = (dm.messages || [])
      .slice(-10)
      .map(m => `${m.sender}: ${m.content}`)
      .join("\n");

    const prompt = `
你正在代替 ${speaker} 回复直播间网友私信。

人物设定：
${persona || "无"}

直播世界书：
${wb || "无"}

私信历史：
${history}

要求：
1. 回复要有网感，像真实私信，不要官腔。
2. 可以多条回复。
3. 禁止使用 emoji。
4. 严格输出格式：
[MSG]文字:第一条
[MSG]文字:第二条
`;

    try {
      window.recordApiPending?.();
      const res = await window.callLLM([{ role: "user", content: prompt }], { maxTokens: 700, temperature: 0.85 });
      const msgs = parseMsgTexts(res);
      msgs.forEach(content => {
        dm.messages.push({
          role: "self",
          sender: speaker,
          content,
          time: Date.now()
        });
      });
      await saveState(convId, s);
    } catch (e) {
      window.showStatus?.("私信回复失败：" + e.message, "error");
    }
  }

  function parseMsgTexts(text) {
    const arr = [];
    const reg = /\[MSG\]文字\s*[:：]\s*([\s\S]*?)(?=\n\s*\[MSG\]|$)/g;
    let m;
    while ((m = reg.exec(text)) !== null) {
      const v = m[1].trim();
      if (v) arr.push(v);
    }
    if (!arr.length && text.trim()) arr.push(text.trim());
    return arr.slice(0, 6);
  }

  /* ============================================================
   * 弹幕系统
   * ============================================================ */

  function ensureDanmakuLayer() {
    const page = document.getElementById("page-conversation");
    if (!page) return null;

    let layer = page.querySelector(".clive-danmaku-layer");
    if (!layer) {
      layer = document.createElement("div");
      layer.className = "clive-danmaku-layer";
      page.appendChild(layer);
    }
    return layer;
  }

  function showDanmaku(events) {
    const layer = ensureDanmakuLayer();
    if (!layer) return;

    const laneCount = 7;
    events.forEach((ev, i) => {
      const item = document.createElement("div");
      item.className = "clive-danmaku-item " + (ev.type || "comment");
      item.textContent = ev.text || "";
      const lane = i % laneCount;
      item.style.top = (lane * 24 + 4) + "px";
      item.style.animationDuration = (8 + Math.random() * 4) + "s";
      item.style.animationDelay = (i * 0.35) + "s";
      layer.appendChild(item);
      setTimeout(() => item.remove(), 14000);
    });
  }

  async function generateLiveEvents(convId, chatObj) {
    const state = await getState(convId);
    if (!state.enabled) return;
    if (!chatObj || chatObj.messageType === "innerVoice" || chatObj.messageType === "phone_intrusion") return;

    const names = await getNames(convId);
    const wb = await getLiveWorldbookText(state);

    const min = Math.max(1, Number(state.minDanmaku || 4));
    const max = Math.max(min, Number(state.maxDanmaku || 10));
    const count = Math.floor(min + Math.random() * (max - min + 1));

    const chats = await window.DB.queryByIndex("chats", "conversationId", convId);
    const recent = chats
      .filter(c => c.messageType !== "innerVoice" && c.messageType !== "phone_intrusion")
      .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
      .slice(-8)
      .map(c => {
        const role = c.role === "user" ? names.userName : names.charName;
        return `${role}: ${String(c.content || "").replace(/<[^>]*>/g, "").slice(0, 220)}`;
      }).join("\n");

    const prompt = `
你是一个直播间弹幕生成器。
核心风格：网感强、像真实网友、会嗑、会看热闹、会打榜、会关注、会起哄、会做阅读理解。
禁止使用 emoji。
禁止解释。
禁止输出 Markdown。
需要生成 ${count} 条直播事件。

事件类型：
comment: 普通弹幕，格式类似 "昵称:内容"
tip: 打赏通知，格式类似 "昵称 给直播间打赏了1000元，留言:内容"
follow: 关注通知，格式类似 "昵称 关注了直播间"

要求：
1. comment 占大多数。
2. tip 可以有 0 到 2 条。
3. follow 可以有 0 到 2 条。
4. 内容要贴合当前互动，不能空泛。
5. 可以有路人误读、嗑 CP、拱火、阴阳怪气、拉踩、打榜发言，但不要低俗辱骂。
6. 返回 JSON 数组，不要包代码块。
格式：
[
  {"type":"comment","name":"昵称","text":"昵称:内容"},
  {"type":"tip","name":"昵称","amount":1000,"text":"昵称 给直播间打赏了1000元，留言:内容"},
  {"type":"follow","name":"昵称","text":"昵称 关注了直播间"}
]

直播主角：
char=${names.charName}
user=${names.userName}

直播世界书：
${wb || "无"}

最近直播内容：
${recent}

刚刚发生：
${chatObj.role}: ${String(chatObj.content || "").replace(/<[^>]*>/g, "").slice(0, 500)}
`;

    try {
      window.recordApiPending?.();
      const res = await window.callLLM([{ role: "user", content: prompt }], {
        maxTokens: 1000,
        temperature: 0.98
      });

      const events = parseEvents(res).slice(0, count);
      if (!events.length) return;

      applyEventEffects(state, events);
      state.danmakuHistory.push(...events.map(e => ({ ...e, time: Date.now() })));
      state.danmakuHistory = state.danmakuHistory.slice(-300);

      // 弹幕也会带动粉丝群和私信
      injectEventsToFanChannel(state, events, names);

      await saveState(convId, state);

      if (Number(window.currentConversationId) === Number(convId)) {
        showDanmaku(events);
      }
    } catch (e) {
      console.warn("live events failed:", e);
    }
  }

  function parseEvents(text) {
    let raw = String(text || "").trim();
    raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();

    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        return arr.map(normalizeEvent).filter(e => e.text);
      }
    } catch (e) {}

    return raw.split(/\n+/).map(line => {
      line = line.trim().replace(/^[\-\d.、\s]+/, "");
      if (!line) return null;
      const type = line.includes("打赏") ? "tip" : line.includes("关注") ? "follow" : "comment";
      return normalizeEvent({ type, text: line });
    }).filter(Boolean);
  }

  function normalizeEvent(e) {
    const text = String(e.text || "").trim();
    return {
      type: e.type === "tip" || e.type === "follow" ? e.type : "comment",
      name: String(e.name || guessName(text) || "Viewer").trim(),
      amount: Number(e.amount || guessAmount(text) || 0),
      text
    };
  }

  function guessName(text) {
    const m = String(text).match(/^([^:：\s]+)[:：\s]/);
    return m ? m[1] : "";
  }

  function guessAmount(text) {
    const m = String(text).match(/打赏了?\s*(\d+)/);
    return m ? Number(m[1]) : 0;
  }

  function applyEventEffects(state, events) {
    events.forEach(e => {
      if (e.type === "follow") {
        state.fans = Number(state.fans || 0) + 1;
      }
      if (e.type === "tip") {
        const name = e.name || guessName(e.text) || "Viewer";
        const amount = Number(e.amount || guessAmount(e.text) || 0);
        if (amount > 0) {
          let row = state.rank.find(r => r.name === name);
          if (!row) {
            row = { name, amount: 0 };
            state.rank.push(row);
          }
          row.amount = Number(row.amount || 0) + amount;
        }
      }
    });
  }

  function injectEventsToFanChannel(state, events, names) {
    const comments = events.filter(e => e.type === "comment").slice(0, 4);
    comments.forEach(e => {
      const idx = e.text.indexOf(":");
      state.fanGroup.messages.push({
        role: "fan",
        sender: idx > -1 ? e.text.slice(0, idx).trim() : e.name || "Viewer",
        content: idx > -1 ? e.text.slice(idx + 1).trim() : e.text,
        time: Date.now()
      });
    });

    // 少量弹幕转化为私信，制造玩法
    const maybe = events.find(e => e.type === "comment" && /私信|想问|告诉|磕|刺激|真心/.test(e.text));
    if (maybe && Math.random() 0.45) {
      const target = Math.random() < 0.5 ? "char" : "user";
      const from = maybe.name || guessName(maybe.text) || "Viewer";
      state.inbox[target].unshift({
        id: "dm_" + target + "_" + Date.now() + "_" + Math.random().toString(36).slice(2),
        from,
        messages: [
          {
            role: "fan",
            sender: from,
            content: maybe.text.replace(/^([^:：]+)[:：]/, "").trim(),
            time: Date.now()
          }
        ]
      });
      state.inbox[target] = state.inbox[target].slice(0, 50);
    }
  }

  async function patchDBPut() {
    if (!window.DB || window.DB._clivePutPatched) return;

    const originalPut = window.DB.put.bind(window.DB);

    window.DB.put = async function (store, obj) {
      const result = await originalPut(store, obj);

      try {
        if (
          store === "chats" &&
          obj &&
          obj.conversationId &&
          (obj.role === "assistant" || obj.role === "char") &&
          !["innerVoice", "phone_intrusion", "mode_switch"].includes(obj.messageType)
        ) {
          setTimeout(() => {
            generateLiveEvents(obj.conversationId, obj);
          }, 500);
        }
      } catch (e) {
        console.warn("live DB hook failed:", e);
      }

      return result;
    };

    window.DB._clivePutPatched = true;
  }

  function patchSwitchPage() {
    if (!window.switchPage || window.switchPage._clivePatched) return;

    const orig = window.switchPage;
    window.switchPage = function (pageId) {
      if (pageId !== "couple-live") {
        const page = document.getElementById("page-couple-live");
        if (page) page.classList.remove("active");
        const cp = document.getElementById("page-couple-space");
        if (cp) cp.removeAttribute("data-live-theme");
      }
      if (pageId === "couple-live") {
        activatePage();
        return;
      }
      return orig.apply(this, arguments);
    };

    window.switchPage._clivePatched = true;
  }

  function bootstrap() {
    ensurePage();

    let tries = 0;
    const timer = setInterval(() => {
      if (window.DB) patchDBPut();
      if (window.switchPage) patchSwitchPage();

      tries++;
      if ((window.DB && window.DB._clivePutPatched && window.switchPage && window.switchPage._clivePatched) || tries > 80) {
        clearInterval(timer);
      }
    }, 100);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }

  window.coupleLiveModule = {
    open,
    getState,
    saveState,
    generateLiveEvents,
    showDanmaku
  };

  console.log("LIVE SYSTEM module ready");
})();