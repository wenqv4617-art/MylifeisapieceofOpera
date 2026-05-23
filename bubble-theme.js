/* ================================================================
 * bubble-theme.js - 对话气泡与全局样式系统 (完全升级版)
 * 功能：
 * 1) 气泡样式 DIY、图标替换、会话/群聊挂载
 * 2) 🖥️ 桌面全局主题：独立 CSS、手势滑动预览、独创桌面存档
 * 3) 💬 聊天应用全局主题：独立 CSS、多页高保真 Tab 切换预览、独立聊天室存档
 * ================================================================ */

(function () {
  "use strict";
  console.log("🎨 联合美化主题模块 (气泡 + 分离式双全局) 加载完成");

  const STORE_NAME = "bubbleThemes";
  const STYLE_PREFIX = "bt-style-";
  const PREVIEW_STYLE_ID = "bt-preview-style";

  const ICON_SCHEMA = [
    { key: "expandMenuBtn", label: "" },
    { key: "convSendBtn", label: "" },
    { key: "convFetchBtn", label: "" },
    { key: "userImage", label: "" },
    { key: "userVoice", label: "" },
    { key: "emoticon", label: "" },
    { key: "innerVoice", label: "" },
    { key: "voiceCall", label: "" },
    { key: "sendDiary", label: "" },
    { key: "toggleMode", label: "" },
    { key: "transfer", label: "" },
    { key: "sendRedPacket", label: "" },
    { key: "openSummary", label: "" },
    { key: "openDetail", label: "" },
    { key: "checkPhone", label: "" },
    { key: "focus", label: "" },
    { key: "coupleSpace", label: "" }
  ];

  const DEFAULT_ICON_MAP = {
    expandMenuBtn: { type: "svg", value: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' },
    convSendBtn: { type: "svg", value: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>' },
    convFetchBtn: { type: "svg", value: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>' },
    userImage: { type: "svg", value: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>' },
    userVoice: { type: "svg", value: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>' },
    emoticon: { type: "svg", value: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>' },
    innerVoice: { type: "svg", value: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>' },
    voiceCall: { type: "svg", value: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' },
    sendDiary: { type: "svg", value: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' },
    toggleMode: { type: "svg", value: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>' },
    transfer: { type: "svg", value: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
    sendRedPacket: { type: "svg", value: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="2" width="18" height="20" rx="3"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="12" cy="10" r="3"/></svg>' },
    openSummary: { type: "svg", value: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
    openDetail: { type: "svg", value: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' },
    checkPhone: { type: "svg", value: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>' },
    focus: { type: "svg", value: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>' },
    coupleSpace: { type: "svg", value: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' }
  };

  let currentEditingIconMap = JSON.parse(JSON.stringify(DEFAULT_ICON_MAP));

  function esc(s) {
    if (window.escapeHtml) return window.escapeHtml(s);
    return String(s || "").replace(/[&<>"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
  }

  function toast(msg, type) {
    if (window.showStatus) window.showStatus(msg, type || "info");
    else console.log(msg);
  }

  function uid() {
    return "bt_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
  }

  function getStyleEl(id) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("style");
      el.id = id;
      document.head.appendChild(el);
    }
    return el;
  }

  function removeStyleEl(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  async function ensureStore() {
    try {
      await window.DB.getAll(STORE_NAME);
    } catch (e) {
      console.error("bubbleThemes store 不可用", e);
      toast("❌ bubbleThemes 存储不可用，请检查 DB 升级", "error");
    }
  }

  function normalizeIconMap(raw) {
    const map = JSON.parse(JSON.stringify(DEFAULT_ICON_MAP));
    if (!raw) return map;

    Object.keys(raw).forEach(k => {
      const v = raw[k];
      if (!v) return;
      if (typeof v === "string") {
        map[k] = { type: "text", value: v };
      } else if (typeof v === "object" && v.value) {
        map[k] = { type: v.type || "text", value: v.value };
      }
    });
    return map;
  }

  function isImageValue(v) {
    if (!v) return false;
    const s = String(v).trim().toLowerCase();
    return s.startsWith("data:image/") ||
      s.includes(".svg") || s.includes(".png") || s.includes(".jpg") || s.includes(".jpeg") || s.includes(".webp") || s.includes(".gif");
  }
  
  function isSvgMarkup(v) {
    if (!v) return false;
    return String(v).trim().startsWith("<svg");
  }

  function scopeCss(cssText, scopeSelector) {
    if (!cssText || !cssText.trim()) return "";
    
    let text = cssText.replace(/\/\*[\s\S]*?\*\//g, "");
    const preserved = [];

    text = text.replace(/@keyframes\s+[^{]+\{[\s\S]*?\n\}/g, function(match) {
        const token = "__BT_KEYFRAMES_" + preserved.length + "__";
        preserved.push(match);
        return token;
    });

    text = text.replace(/@keyframes\s+[^{]+\{(?:[^{}]|\{[^{}]*\})*\}/g, function(match) {
        const token = "__BT_KEYFRAMES_" + preserved.length + "__";
        preserved.push(match);
        return token;
    });

    const chunks = text.split("}");
    let out = "";

    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i].trim();
        if (!chunk) continue;

        if (chunk.startsWith("__BT_KEYFRAMES_")) {
            out += chunk;
            continue;
        }

        const idx = chunk.indexOf("{");
        if (idx === -1) continue;

        const selectorPart = chunk.slice(0, idx).trim();
        const bodyPart = chunk.slice(idx + 1);

        if (selectorPart.startsWith("@")) {
            out += selectorPart + "{" + bodyPart + "}";
            continue;
        }

        const scopedSel = selectorPart
            .split(",")
            .map(s => s.trim())
            .filter(Boolean)
            .map(s => {
                if (s.startsWith(scopeSelector)) return s;
                return scopeSelector + " " + s;
            })
            .join(", ");

        out += scopedSel + "{" + bodyPart + "}";
    }

    preserved.forEach((block, i) => {
        out = out.replace("__BT_KEYFRAMES_" + i + "__", block);
    });

    return out;
  }

  function buildPreviewHtml() {
    const imageSvg = DEFAULT_ICON_MAP.userImage.value;
    const micSvg = DEFAULT_ICON_MAP.userVoice.value;
    const phoneSvg = DEFAULT_ICON_MAP.voiceCall.value;
    const quoteSvg = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11H6a2 2 0 0 0-2 2v5h6v-7z"/><path d="M20 11h-4a2 2 0 0 0-2 2v5h6v-7z"/><path d="M6 11V8a4 4 0 0 1 4-4"/><path d="M16 11V8a4 4 0 0 1 4-4"/></svg>';

    return [
      '<div class="chat-header">',
      '  <div class="chat-header-left"><button class="back-btn">←</button><h2 style="font-size:18px;">预览会话</h2></div>',
      '  <div class="header-actions"><button class="header-btn">···</button></div>',
      '</div>',
      '<div class="chat-messages" style="height:260px;overflow:auto;">',
      '  <div class="group-system-msg">— 系统消息：示例系统提示 —</div>',
      '  <div class="message-row other"><div class="message-avatar" style="background:#7aa;">C</div><div class="bubble">这是对方文字气泡</div></div>',
      '  <div class="message-row self"><div class="bubble">这是我的文字气泡</div><div class="message-avatar" style="background:#c88;">U</div></div>',
      '  <div class="message-row other"><div class="message-avatar" style="background:#7aa;">C</div><div class="bubble image-bubble"><span class="image-icon">' + imageSvg + '</span></div></div>',
      '  <div class="message-row other"><div class="message-avatar" style="background:#7aa;">C</div><div class="bubble voice-bubble"><div class="voice-bubble-header"><span class="voice-icon">' + micSvg + '</span><span class="voice-duration">7"</span></div></div></div>',
      '  <div class="message-row self"><div class="bubble voice-bubble"><div class="voice-bubble-header"><span class="voice-icon">' + micSvg + '</span><span class="voice-duration">7"</span></div></div><div class="message-avatar" style="background:#c88;">U</div></div>',
      '  <div class="message-row other"><div class="message-avatar" style="background:#7aa;">C</div><div class="bubble call-record-bubble"><span class="call-record-icon">' + phoneSvg + '</span><span>语音通话已结束1分20秒</span></div></div>',
      '  <div class="message-row self"><div class="bubble quoted-bubble"><div>这是带引年的回复正文</div><div class="quote-ref-footer"><div class="quote-ref-footer-title"><span>' + quoteSvg + '</span><span>引用</span></div><div class="quote-ref-footer-content">对方：这是被引用的那条消息</div></div></div><div class="message-avatar" style="background:#c88;">U</div></div>',
      '</div>',
      '<div class="chat-input-area">',
      '  <div class="mini-btn"><span data-icon-key="expandMenuBtn"></span></div>',
      '  <div class="input-wrapper"><input type="text" placeholder="输入框预览"></div>',
      '  <div class="mini-btn"><span data-icon-key="convSendBtn"></span></div>',
      '  <div class="mini-btn"><span data-icon-key="convFetchBtn"></span></div>',
      '</div>'
    ].join("");
  }

  function setIconNode(el, iconDef) {
    if (!el || !iconDef) return;
    const value = iconDef.value || "";
    const type = iconDef.type || "text";

    if (type === "svg" || isSvgMarkup(value)) {
      el.innerHTML = value;
    } else if (type === "image" || isImageValue(value)) {
      el.innerHTML = `<img src="${value}" style="width:2em;height:2em;object-fit:contain;vertical-align:middle;" alt="">`;
    } else {
      el.textContent = value || "";
    }
  }

  function applyIconMapToPreview() {
    const root = document.getElementById("bubbleThemePreviewRoot");
    if (!root) return;
    root.querySelectorAll("[data-icon-key]").forEach(el => {
      const key = el.getAttribute("data-icon-key");
      const def = currentEditingIconMap[key] || DEFAULT_ICON_MAP[key];
      setIconNode(el, def);
    });
  }

  function applyIconMapToConversationDOM(iconMap) {
    const plus = document.querySelector("#expandMenuBtn");
    const send = document.querySelector("#convSendBtn");
    const fetch = document.querySelector("#convFetchBtn");

    if (plus) plus.innerHTML = "";
    if (send) send.innerHTML = "";
    if (fetch) fetch.innerHTML = "";

    if (plus) {
      const span = document.createElement("span");
      setIconNode(span, iconMap.expandMenuBtn);
      plus.appendChild(span);
    }
    if (send) {
      const span = document.createElement("span");
      setIconNode(span, iconMap.convSendBtn);
      send.appendChild(span);
    }
    if (fetch) {
      const span = document.createElement("span");
      setIconNode(span, iconMap.convFetchBtn);
      fetch.appendChild(span);
    }

    document.querySelectorAll("#expandMenu .expand-menu-item").forEach(item => {
      const action = item.getAttribute("data-action");
      const iconEl = item.querySelector(".expand-menu-icon");
      if (!iconEl) return;

      const mapKey = {
        userImage: "userImage",
        userVoice: "userVoice",
        emoticon: "emoticon",
        innerVoice: "innerVoice",
        voiceCall: "voiceCall",
        sendDiary: "sendDiary",
        toggleMode: "toggleMode",
        transfer: "transfer",
        sendRedPacket: "sendRedPacket",
        openSummary: "openSummary",
        openDetail: "openDetail",
        checkPhone: "checkPhone",
        focus: "focus",
        coupleSpace: "coupleSpace"
      }[action];

      if (!mapKey) return;
      setIconNode(iconEl, iconMap[mapKey] || DEFAULT_ICON_MAP[mapKey]);
    });
  }

  function applyIconMapToGroupDOM(iconMap) {
    const plus = document.querySelector("#groupExpandMenuBtn");
    const send = document.querySelector("#groupSendBtn");
    const fetch = document.querySelector("#groupFetchBtn");

    if (plus) plus.innerHTML = "";
    if (send) send.innerHTML = "";
    if (fetch) fetch.innerHTML = "";

    if (plus) {
      const span = document.createElement("span");
      setIconNode(span, iconMap.expandMenuBtn);
      plus.appendChild(span);
    }
    if (send) {
      const span = document.createElement("span");
      setIconNode(span, iconMap.convSendBtn);
      send.appendChild(span);
    }
    if (fetch) {
      const span = document.createElement("span");
      setIconNode(span, iconMap.convFetchBtn);
      fetch.appendChild(span);
    }

    document.querySelectorAll("#groupExpandMenu .expand-menu-item").forEach(item => {
      const action = item.getAttribute("data-action");
      const iconEl = item.querySelector(".expand-menu-icon");
      if (!iconEl) return;

      const mapKey = {
        groupImage: "userImage",
        groupVoice: "userVoice",
        groupEmoticon: "emoticon",
        groupToggleMode: "toggleMode",
        groupTransfer: "transfer",
        groupRedPacket: "sendRedPacket",
        groupSummary: "openSummary",
        groupOpenDetail: "openDetail",
        focus: "focus"
      }[action];

      if (!mapKey) return;
      setIconNode(iconEl, iconMap[mapKey] || DEFAULT_ICON_MAP[mapKey]);
    });
  }

  async function getAllThemes(type = "bubble") {
    const list = await window.DB.getAll(STORE_NAME);
    return (list || []).filter(t => {
      if (type === "global_desktop") return t.type === "global_desktop" || t.type === "global"; // 兼容旧版global
      if (type === "global_chatroom") return t.type === "global_chatroom";
      return !t.type || t.type === "bubble";
    }).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }

  async function renderArchiveList() {
    const box = document.getElementById("bubbleThemeArchiveList");
    if (!box) return;
    const list = await getAllThemes("bubble");

    if (!list.length) {
      box.innerHTML = '<div class="bubble-theme-empty">暂无样式存档</div>';
      return;
    }

    box.innerHTML = list.map(t => {
      return `<div class="bubble-theme-row" data-id="${t.id}">
        <div class="bubble-theme-row-main">
          <div class="bubble-theme-row-name">${esc(t.name)}</div>
          <div class="bubble-theme-row-time">${new Date(t.updatedAt || Date.now()).toLocaleString("zh-CN")}</div>
        </div>
        <div class="bubble-theme-row-actions">
          <button class="small-btn bt-load">载入</button>
          <button class="small-btn bt-edit">重命名</button>
          <button class="small-btn bt-del" style="color:#c0392b;">删除</button>
        </div>
      </div>`;
    }).join("");
  }

  async function renderMountThemeSelect() {
    const sel = document.getElementById("bubbleThemeMountSelect");
    if (!sel) return;
    const list = await getAllThemes("bubble");

    if (!list.length) {
      sel.innerHTML = `<option value="">暂无存档</option>`;
      return;
    }
    sel.innerHTML = `<option value="">请选择一个样式存档</option>` +
      list.map(t => `<option value="${t.id}">${esc(t.name)}</option>`).join("");
  }

  async function renderMountTargetList() {
    const box = document.getElementById("bubbleThemeTargetList");
    if (!box) return;

    const convs = await window.DB.getAll("conversations");
    const groups = await window.DB.getAll("groupChats");

    let html = `<div class="bubble-theme-target-title">单聊会话</div>`;
    if (!convs.length) {
      html += `<div class="bubble-theme-empty">暂无单聊</div>`;
    } else {
      for (const c of convs) {
        const ch = await window.DB.get("characters", c.charId);
        const cd = await window.DB.get("convDetails", c.id);
        const name = cd?.charName || ch?.name || ("会话#" + c.id);
        html += `<div class="bubble-theme-target-row">
          <span>${esc(name)}</span>
          <button class="small-btn bt-mount-conv" data-conv-id="${c.id}">挂载</button>
        </div>`;
      }
    }

    html += `<div class="bubble-theme-target-title" style="margin-top:10px;">群聊会话</div>`;
    if (!groups.length) {
      html += `<div class="bubble-theme-empty">暂无群聊</div>`;
    } else {
      groups.forEach(g => {
        html += `<div class="bubble-theme-target-row">
          <span>${esc(g.name || ("群聊#" + g.id))}</span>
          <button class="small-btn bt-mount-group" data-group-id="${g.id}">挂载</button>
        </div>`;
      });
    }

    box.innerHTML = html;
  }

  function renderIconEditor() {
    const box = document.getElementById("bubbleIconEditorList");
    if (!box) return;
    box.innerHTML = ICON_SCHEMA.map(item => {
      const def = currentEditingIconMap[item.key] || DEFAULT_ICON_MAP[item.key];
      let preview;
      if (def.type === "svg" || isSvgMarkup(def.value)) {
        preview = `<span style="display:flex;align-items:center;justify-content:center;width:20px;height:20px;">${def.value}</span>`;
      } else if (def.type === "image" || isImageValue(def.value)) {
        preview = `<img src="${esc(def.value)}" style="width:20px;height:20px;object-fit:contain;">`;
      } else {
        preview = `<span>${esc(def.value)}</span>`;
      }
      return `<div class="theme-icon-edit-row" data-icon-key="${item.key}" style="padding:10px 8px;margin-bottom:6px;">
        <div class="theme-icon-preview" style="width:40px;height:40px;border-radius:10px;background:#f8f8f8;">${preview}</div>
        <div class="theme-icon-info">
          <div class="theme-icon-name">${esc(item.label)}</div>
        </div>
        <div class="theme-icon-actions">
          <button class="theme-icon-action-btn bt-icon-text">文本/URL</button>
          <button class="theme-icon-action-btn bt-icon-upload">上传</button>
          <button class="theme-icon-action-btn reset-btn bt-icon-reset">重置</button>
          <input type="file" class="bt-icon-file" accept=".svg,image/*" style="display:none;">
        </div>
      </div>`;
    }).join("");
  }

  function initPreviewBox() {
    const root = document.getElementById("bubbleThemePreviewRoot");
    if (!root) return;
    root.setAttribute("data-bubble-scope", "preview");
    root.innerHTML = buildPreviewHtml();
    applyIconMapToPreview();
  }

  function runPreview() {
    const input = document.getElementById("bubbleCssInput");
    if (!input) return;
    const cssText = input.value || "";
    const scoped = scopeCss(cssText, '[data-bubble-scope="preview"]');
    getStyleEl(PREVIEW_STYLE_ID).textContent = scoped;
    applyIconMapToPreview();
    toast("预览已更新", "success");
  }

  function clearPreview() {
    removeStyleEl(PREVIEW_STYLE_ID);
    currentEditingIconMap = JSON.parse(JSON.stringify(DEFAULT_ICON_MAP));
    renderIconEditor();
    initPreviewBox();
    toast("预览已清除", "info");
  }

  async function saveSnapshot() {
    const input = document.getElementById("bubbleCssInput");
    const cssText = (input?.value || "").trim();
    if (!cssText) {
      toast("请输入 CSS 后再保存", "error");
      return;
    }
    const name = prompt("请输入存档名称：", "我的气泡样式");
    if (!name || !name.trim()) return;

    const theme = {
      id: uid(),
      name: name.trim(),
      cssText,
      iconMap: currentEditingIconMap,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await window.DB.put(STORE_NAME, theme);
    await renderArchiveList();
    await renderMountThemeSelect();
    toast("存档已保存", "success");
  }

  async function applyBubbleThemeForConversation(convId) {
    const page = document.getElementById("page-conversation");
    if (!page || !convId) return;
    const scope = "conv_" + convId;
    page.setAttribute("data-bubble-scope", scope);

    const convDetail = await window.DB.get("convDetails", convId);
    const themeId = convDetail?.bubbleThemeId || "";
    const styleId = STYLE_PREFIX + scope;

    if (!themeId) {
      removeStyleEl(styleId);
      applyIconMapToConversationDOM(DEFAULT_ICON_MAP);
      return;
    }

    const theme = await window.DB.get(STORE_NAME, themeId);
    if (!theme) {
      removeStyleEl(styleId);
      applyIconMapToConversationDOM(DEFAULT_ICON_MAP);
      return;
    }

    getStyleEl(styleId).textContent = scopeCss(theme.cssText || "", `[data-bubble-scope="${scope}"]`);
    applyIconMapToConversationDOM(normalizeIconMap(theme.iconMap));
  }

  async function applyBubbleThemeForGroup(groupId) {
    const page = document.getElementById("page-group-conversation");
    if (!page || !groupId) return;
    const scope = "group_" + groupId;
    page.setAttribute("data-bubble-scope", scope);

    const g = await window.DB.get("groupChats", groupId);
    const themeId = g?.bubbleThemeId || "";
    const styleId = STYLE_PREFIX + scope;

    if (!themeId) {
      removeStyleEl(styleId);
      applyIconMapToGroupDOM(DEFAULT_ICON_MAP);
      return;
    }

    const theme = await window.DB.get(STORE_NAME, themeId);
    if (!theme) {
      removeStyleEl(styleId);
      applyIconMapToGroupDOM(DEFAULT_ICON_MAP);
      return;
    }

    getStyleEl(styleId).textContent = scopeCss(theme.cssText || "", `[data-bubble-scope="${scope}"]`);
    applyIconMapToGroupDOM(normalizeIconMap(theme.iconMap));
  }

  // ================================================================
  // 🖥️ 全局双系统：桌面 (Desktop) 核心业务
  // ================================================================
  const DESKTOP_PREVIEW_STYLE_ID = "gt-desktop-preview-style";
  const DESKTOP_APPLIED_STYLE_ID = "gt-desktop-style-applied";

  function buildDesktopPreviewHtml() {
    return `
      <div class="home-main" style="width:100%; height:100%; display:flex; flex-direction:column; position:relative; overflow:hidden; user-select:none;">
        <div class="home-pages-track" id="prevPagesTrack" style="width:200%; height:100%; display:flex; transition:transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); transform:translateX(0);">
          
          <!-- 第一页 -->
          <div class="home-page" id="prevPage1" style="width:50%; height:100%; display:flex; flex-direction:column; padding:16px 12px; gap:10px; flex-shrink:0;">
            <div style="height:12px;"></div>
            <div class="namecard" style="border-radius:12px; overflow:hidden; background:#fff; height:125px; display:flex; flex-direction:column; box-shadow:0 4px 12px rgba(0,0,0,0.05); position:relative;">
              <div class="namecard-upper" style="height:55px; background:#ebdcc5;"></div>
              <div class="namecard-avatar" style="width:36px; height:36px; border-radius:50%; background:#8ba3c7; border:2.5px solid #fff; position:absolute; left:50%; top:55px; transform:translate(-50%, -50%);"></div>
              <div class="namecard-lower" style="padding-top:20px; text-align:center;">
                <div class="namecard-title" style="font-size:12px; font-weight:700; color:#4a5568;">晨曦海岸</div>
                <div class="namecard-body" style="font-size:9px; color:#8ba3c7; margin-top:2px;">每一帧都是壁纸级的风景</div>
              </div>
            </div>
            <div style="height:4px;"></div>
            <div style="display:flex; gap:10px; height:90px;">
              <div class="page1-photo" style="flex:1; border-radius:10px; background:#ebdcc5;"></div>
              <div class="page1-apps" style="flex:1; display:grid; grid-template-columns:repeat(2,1fr); gap:6px; align-content:center;">
                <div class="app-icon-item" style="display:flex; flex-direction:column; align-items:center; gap:2px;">
                  <div class="app-icon-box" style="width:28px; height:28px; border-radius:8px; background:#8ba3c7; display:flex; align-items:center; justify-content:center; font-size:14px;">💬</div>
                  <div class="app-icon-label" style="font-size:8px; color:#4a5568; font-weight:500;">聊天室</div>
                </div>
                <div class="app-icon-item" style="display:flex; flex-direction:column; align-items:center; gap:2px;">
                  <div class="app-icon-box" style="width:28px; height:28px; border-radius:8px; background:#8ba3c7; display:flex; align-items:center; justify-content:center; font-size:14px;">📖</div>
                  <div class="app-icon-label" style="font-size:8px; color:#4a5568; font-weight:500;">世界书</div>
                </div>
                <div class="app-icon-item" style="display:flex; flex-direction:column; align-items:center; gap:2px;">
                  <div class="app-icon-box" style="width:28px; height:28px; border-radius:8px; background:#8ba3c7; display:flex; align-items:center; justify-content:center; font-size:14px;">💾</div>
                  <div class="app-icon-label" style="font-size:8px; color:#4a5568; font-weight:500;">数据</div>
                </div>
                <div class="app-icon-item" style="display:flex; flex-direction:column; align-items:center; gap:2px;">
                  <div class="app-icon-box" style="width:28px; height:28px; border-radius:8px; background:#8ba3c7; display:flex; align-items:center; justify-content:center; font-size:14px;">⚙️</div>
                  <div class="app-icon-label" style="font-size:8px; color:#4a5568; font-weight:500;">设置</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 第二页 -->
          <div class="home-page" id="prevPage2" style="width:50%; height:100%; display:flex; flex-direction:column; padding:16px 12px; gap:10px; flex-shrink:0;">
            <div style="height:12px;"></div>
            <div class="polaroid-fan" style="height:110px; position:relative; display:flex; justify-content:center; align-items:center; margin-bottom:10px;">
              <div class="polaroid-card" style="width:75px; height:90px; background:#fff; padding:4px; box-shadow:0 3px 8px rgba(0,0,0,0.1); border-radius:4px; transform:rotate(-8deg); position:absolute; left:40px;">
                <div class="polaroid-photo" style="width:100%; height:62px; background:#dfdfdf; border-radius:2px;"></div>
                <div class="polaroid-bottom" style="font-size:8px; text-align:center; margin-top:4px; color:#8ba3c7;">Polaroid</div>
              </div>
              <div class="polaroid-card" style="width:75px; height:90px; background:#fff; padding:4px; box-shadow:0 3px 8px rgba(0,0,0,0.12); border-radius:4px; transform:rotate(4deg); position:absolute; right:40px;">
                <div class="polaroid-photo" style="width:100%; height:62px; background:#ebdcc5; border-radius:2px;"></div>
                <div class="polaroid-bottom" style="font-size:8px; text-align:center; margin-top:4px; color:#8ba3c7;">Polaroid</div>
              </div>
            </div>
            <div class="page2-photo" style="height:64px; border-radius:10px; background:#dcdcd8; margin-bottom:4px;"></div>
            <div class="page2-apps" style="display:grid; grid-template-columns:repeat(4,1fr); gap:6px; justify-items:center;">
              <div class="app-icon-item" style="display:flex; flex-direction:column; align-items:center; gap:2px;">
                <div class="app-icon-box" style="width:28px; height:28px; border-radius:8px; background:#7aa; display:flex; align-items:center; justify-content:center; font-size:14px;">🌟</div>
                <div class="app-icon-label" style="font-size:8px; color:#4a5568; font-weight:500;">重逢</div>
              </div>
              <div class="app-icon-item" style="display:flex; flex-direction:column; align-items:center; gap:2px;">
                <div class="app-icon-box" style="width:28px; height:28px; border-radius:8px; background:#7aa; display:flex; align-items:center; justify-content:center; font-size:14px;">🗣️</div>
                <div class="app-icon-label" style="font-size:8px; color:#4a5568; font-weight:500;">论坛</div>
              </div>
              <div class="app-icon-item" style="display:flex; flex-direction:column; align-items:center; gap:2px;">
                <div class="app-icon-box" style="width:28px; height:28px; border-radius:8px; background:#7aa; display:flex; align-items:center; justify-content:center; font-size:14px;">🛍️</div>
                <div class="app-icon-label" style="font-size:8px; color:#4a5568; font-weight:500;">逛逛</div>
              </div>
              <div class="app-icon-item" style="display:flex; flex-direction:column; align-items:center; gap:2px;">
                <div class="app-icon-box" style="width:28px; height:28px; border-radius:8px; background:#7aa; display:flex; align-items:center; justify-content:center; font-size:14px;">📊</div>
                <div class="app-icon-label" style="font-size:8px; color:#4a5568; font-weight:500;">记账</div>
              </div>
            </div>
          </div>

        </div>
        <!-- Indicator dots -->
        <div class="page-indicator" style="position:absolute; bottom:8px; left:0; width:100%; display:flex; justify-content:center; gap:6px; z-index:10; pointer-events:auto;">
          <div class="page-dot active" id="prevDot1" style="width:6px; height:6px; border-radius:50%; background:#d7e4ee; opacity:1; cursor:pointer; transition:all 0.2s;"></div>
          <div class="page-dot" id="prevDot2" style="width:6px; height:6px; border-radius:50%; background:#d7e4ee; opacity:0.4; cursor:pointer; transition:all 0.2s;"></div>
        </div>
      </div>
    `;
  }

  function bindDesktopPreviewEvents(root) {
    const track = root.querySelector('#prevPagesTrack');
    const dot1 = root.querySelector('#prevDot1');
    const dot2 = root.querySelector('#prevDot2');
    if (!track || !dot1 || !dot2) return;

    function setPage(pageNum) {
      if (pageNum === 1) {
        track.style.transform = 'translateX(0)';
        dot1.style.opacity = '1';
        dot2.style.opacity = '0.4';
      } else {
        track.style.transform = 'translateX(-50%)';
        dot2.style.opacity = '1';
        dot1.style.opacity = '0.4';
      }
    }

    dot1.addEventListener('click', () => setPage(1));
    dot2.addEventListener('click', () => setPage(2));

    // Touch Swipe sliding
    let startX = 0;
    track.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', e => {
      const diff = e.changedTouches[0].clientX - startX;
      if (diff > 45) {
        setPage(1);
      } else if (diff < -45) {
        setPage(2);
      }
    }, { passive: true });

    // Mouse drag swipe
    let isDown = false;
    track.addEventListener('mousedown', e => {
      isDown = true;
      startX = e.clientX;
    });
    track.addEventListener('mouseup', e => {
      if (!isDown) return;
      isDown = false;
      const diff = e.clientX - startX;
      if (diff > 45) setPage(1);
      else if (diff < -45) setPage(2);
    });
  }

  function runDesktopPreview() {
    const input = document.getElementById("desktopCssInput");
    if (!input) return;
    const cssText = input.value || "";
    const scoped = scopeCss(cssText, '[data-desktop-scope="preview_desktop"]');
    getStyleEl(DESKTOP_PREVIEW_STYLE_ID).textContent = scoped;
    toast("桌面效果预览已更新", "success");
  }

  function clearDesktopPreview() {
    removeStyleEl(DESKTOP_PREVIEW_STYLE_ID);
    const input = document.getElementById("desktopCssInput");
    if (input) input.value = "";
    toast("桌面预览已重置", "info");
  }

  // ================================================================
  // 💬 全局双系统：聊天室 (Chatroom & App) 核心业务
  // ================================================================
  const CHATROOM_PREVIEW_STYLE_ID = "gt-chatroom-preview-style";
  const CHATROOM_APPLIED_STYLE_ID = "gt-chatroom-style-applied";

  function buildChatroomPreviewHtml() {
    return `
      <div style="width:100%; height:100%; display:flex; flex-direction:column; background:#f8f8f8; position:relative; overflow:hidden; user-select:none;">
        
        <!-- Live Tab Pages Content -->
        <div id="prevAppContent" style="flex:1; width:100%; overflow-y:auto; overflow-x:hidden; position:relative; background:#f8f8f8;">
          
          <!-- 1. 聊天列表页 (page-chat) -->
          <div id="prevPageChat" class="page active" style="display:flex; flex-direction:column; width:100%; height:100%;">
            <div class="chat-header" style="background:#faf9f6; padding:8px 12px; display:flex; align-items:center; justify-content:space-between; border-bottom:0.5px solid #d4ccbe;">
              <div class="chat-header-left" style="display:flex; align-items:center; gap:6px;">
                <button class="back-btn" style="background:none; border:none; font-size:16px;">←</button>
                <h2 style="font-size:16px; margin:0; font-weight:600; color:#4a5568;">𝓜𝓮𝓼𝓼𝓪𝓰𝓮</h2>
              </div>
              <div class="header-actions"><button class="header-btn" style="font-size:12px; color:#8ba3c7; background:none; border:none;">𝑁𝑒𝑤</button></div>
            </div>
            <div id="conversationListContainer" style="background:#fff; flex:1; overflow-y:auto; min-height:100%;">
              <div class="conversation-item" style="display:flex; align-items:center; padding:10px 12px; border-bottom:0.5px solid #efefef;">
                <div class="conversation-avatar" style="width:34px; height:34px; border-radius:6px; background:#f39c12; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:600; font-size:14px; margin-right:10px;">林</div>
                <div class="conversation-info" style="flex:1;">
                  <div class="conversation-title" style="font-size:13px; font-weight:500; color:#4a5568; margin-bottom:2px;">林栖</div>
                  <div class="conversation-last-message" style="font-size:11px; color:#888;">其实呢，最近新进了一些书...</div>
                </div>
                <div class="conversation-time" style="font-size:9px; color:#aaa;">14:32</div>
              </div>
              <div class="conversation-item" style="display:flex; align-items:center; padding:10px 12px; border-bottom:0.5px solid #efefef;">
                <div class="conversation-avatar" style="width:34px; height:34px; border-radius:6px; background:#3498db; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:600; font-size:14px; margin-right:10px;">夜</div>
                <div class="conversation-info" style="flex:1;">
                  <div class="conversation-title" style="font-size:13px; font-weight:500; color:#4a5568; margin-bottom:2px;">夜影</div>
                  <div class="conversation-last-message" style="font-size:11px; color:#888;">今晚加班，不用等我了。</div>
                </div>
                <div class="conversation-time" style="font-size:9px; color:#aaa;">昨天</div>
              </div>
            </div>
          </div>

          <!-- 2. 联系人列表 (page-contacts) -->
          <div id="prevPageContacts" class="page" style="display:none; flex-direction:column; width:100%; height:100%;">
            <div class="contacts-header" style="background:#faf9f6; padding:8px 12px; border-bottom:0.5px solid #c9bfae; display:flex; align-items:center; justify-content:space-between;">
              <h2 style="font-size:16px; margin:0; font-weight:600; color:#4a5568;">𝓒𝓸𝓷𝓽𝓪𝓬𝓽𝓼</h2>
              <button class="add-btn" style="background:#d7e4ee; color:#fff; border:none; padding:3px 10px; border-radius:12px; font-size:11px;">𝑁𝑒𝑤</button>
            </div>
            <div class="contact-list" style="background:#fff; flex:1; overflow-y:auto; min-height:100%;">
              <div class="contact-item" style="display:flex; align-items:center; padding:10px 12px; border-bottom:0.5px solid #efefef;">
                <div class="avatar" style="width:32px; height:32px; border-radius:6px; background:#2ecc71; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:600; font-size:14px; margin-right:10px;">林</div>
                <div class="contact-info" style="flex:1;">
                  <div class="contact-name" style="font-size:13px; font-weight:500; color:#4a5568; margin-bottom:2px;">林栖 <span class="contact-badge" style="background:#d7e4ee; color:#fff; padding:1px 4px; border-radius:6px; font-size:8px;">知己</span></div>
                  <div class="contact-persona" style="font-size:11px; color:#888;">温和内敛的图书管理员</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. 朋友圈 (page-moments) -->
          <div id="prevPageMoments" class="page" style="display:none; flex-direction:column; width:100%; height:100%; background:#fff;">
            <div class="chat-header" style="background:#faf9f6; padding:8px 12px; border-bottom:0.5px solid #d4ccbe; display:flex; align-items:center;">
              <h2 style="font-size:16px; margin:0; font-weight:600; color:#4a5568; text-align:center; width:100%;">朋友圈</h2>
            </div>
            <div class="moments-container" style="padding:12px; display:flex; flex-direction:column; gap:16px; overflow-y:auto;">
              <div class="moments-post" style="border-bottom:1px solid #efefef; padding-bottom:12px; display:flex; gap:10px;">
                <div class="moments-avatar" style="width:32px; height:32px; border-radius:6px; background:#f39c12; color:#fff; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; flex-shrink:0;">林</div>
                <div class="moments-main" style="flex:1;">
                  <div class="moments-author" style="font-size:13px; font-weight:600; color:#4a5568; margin-bottom:4px;">林栖</div>
                  <div class="moments-content" style="font-size:12px; color:#333; line-height:1.5; margin-bottom:6px;">今天整理了仓库旧书，翻到一本带干枯枫叶书签的书。岁月很温柔。🍁</div>
                  <div class="moments-meta" style="font-size:9px; color:#a0a8a2; display:flex; justify-content:space-between; align-items:center;">
                    <span>2小时前</span>
                    <span style="color:#8ba3c7; cursor:pointer;">赞 · 评论</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 4. 我的面具 (page-profile) -->
          <div id="prevPageProfile" class="page" style="display:none; flex-direction:column; width:100%; height:100%;">
            <div class="profile-header" style="background:#faf9f6; padding:16px 12px; display:flex; align-items:center; gap:12px; border-bottom:0.5px solid #c9bfae;">
              <div class="profile-avatar" style="width:44px; height:44px; border-radius:8px; background:#3498db; color:#fff; display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:600;">👤</div>
              <div class="profile-meta">
                <div class="profile-name" style="font-size:14px; font-weight:600; color:#4a5568;">真实的我</div>
                <div class="profile-bio" style="font-size:11px; color:#8ba3c7; margin-top:2px;">我就是我自己</div>
              </div>
            </div>
            <div class="menu-list" style="margin-top:12px; background:#fff; border-top:0.5px solid #eee; border-bottom:0.5px solid #eee;">
              <div class="menu-item" style="display:flex; align-items:center; padding:12px; border-bottom:0.5px solid #eee; font-size:13px; color:#333;">
                <span class="menu-icon" style="margin-right:10px; font-size:16px;">🎭</span><span class="menu-text">切换面具</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Tab bar simulator -->
        <div class="tab-bar" id="prevTabBar" style="height:50px; background:#ffffff; border-top:0.5px solid #d6d6d6; display:flex; align-items:center; justify-content:space-around; z-index:100; flex-shrink:0;">
          <div class="tab-item active" data-prev-tab="chat" style="flex:1; display:flex; flex-direction:column; align-items:center; gap:2px; font-size:9px; color:#8ba3c7; cursor:pointer;">
            <span class="tab-icon" style="font-size:16px; line-height:1;">💬</span>
            <span>聊天</span>
          </div>
          <div class="tab-item" data-prev-tab="contacts" style="flex:1; display:flex; flex-direction:column; align-items:center; gap:2px; font-size:9px; color:#6b6b6b; cursor:pointer;">
            <span class="tab-icon" style="font-size:16px; line-height:1;">👥</span>
            <span>联系人</span>
          </div>
          <div class="tab-item" data-prev-tab="moments" style="flex:1; display:flex; flex-direction:column; align-items:center; gap:2px; font-size:9px; color:#6b6b6b; cursor:pointer;">
            <span class="tab-icon" style="font-size:16px; line-height:1;">🌸</span>
            <span>朋友圈</span>
          </div>
          <div class="tab-item" data-prev-tab="profile" style="flex:1; display:flex; flex-direction:column; align-items:center; gap:2px; font-size:9px; color:#6b6b6b; cursor:pointer;">
            <span class="tab-icon" style="font-size:16px; line-height:1;">👤</span>
            <span>我的</span>
          </div>
        </div>
      </div>
    `;
  }

  function bindChatroomPreviewEvents(root) {
    const tabs = root.querySelectorAll('#prevTabBar [data-prev-tab]');
    const pages = {
      chat: root.querySelector('#prevPageChat'),
      contacts: root.querySelector('#prevPageContacts'),
      moments: root.querySelector('#prevPageMoments'),
      profile: root.querySelector('#prevPageProfile')
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('active');
          t.style.color = '#6b6b6b';
        });
        tab.classList.add('active');
        tab.style.color = '#8ba3c7';

        const target = tab.dataset.prevTab;
        Object.keys(pages).forEach(k => {
          if (pages[k]) {
            pages[k].style.display = (k === target) ? 'flex' : 'none';
          }
        });
      });
    });
  }

  function runChatroomPreview() {
    const input = document.getElementById("chatroomCssInput");
    if (!input) return;
    const cssText = input.value || "";
    const scoped = scopeCss(cssText, '[data-chatroom-scope="preview_chatroom"]');
    getStyleEl(CHATROOM_PREVIEW_STYLE_ID).textContent = scoped;
    toast("聊天应用效果预览已更新", "success");
  }

  function clearChatroomPreview() {
    removeStyleEl(CHATROOM_PREVIEW_STYLE_ID);
    const input = document.getElementById("chatroomCssInput");
    if (input) input.value = "";
    toast("聊天应用预览已重置", "info");
  }

  // ================================================================
  // 💾 统一存档业务逻辑 (桌面 & 聊天室 分离存档)
  // ================================================================
  async function saveGlobalSnapshot(subType) {
    const inputId = subType === "desktop" ? "desktopCssInput" : "chatroomCssInput";
    const input = document.getElementById(inputId);
    const cssText = (input?.value || "").trim();
    if (!cssText) {
      toast("请输入 CSS 后再保存", "error");
      return;
    }
    const label = subType === "desktop" ? "桌面全局样式" : "应用与聊天室全局样式";
    const name = prompt(`请输入${label}存档名称：`, `我的${label}`);
    if (!name || !name.trim()) return;

    const theme = {
      id: uid(),
      name: name.trim(),
      cssText,
      type: "global_" + subType,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await window.DB.put(STORE_NAME, theme);
    await renderGlobalArchiveList(subType);
    toast(`${label}已保存到样式存档`, "success");
  }

  async function applyGlobalTheme(themeId, subType) {
    const theme = await window.DB.get(STORE_NAME, themeId);
    if (!theme) return;

    const settingKey = subType === "desktop" ? "activeDesktopThemeId" : "activeChatroomThemeId";
    const styleId = subType === "desktop" ? DESKTOP_APPLIED_STYLE_ID : CHATROOM_APPLIED_STYLE_ID;

    await window.DB.setSetting(settingKey, themeId);
    getStyleEl(styleId).textContent = theme.cssText || "";
    toast(`已生效${subType === "desktop" ? "桌面" : "聊天应用"}样式: ` + theme.name, "success");
    await renderGlobalArchiveList(subType);
  }

  async function removeActiveGlobalTheme(subType) {
    const settingKey = subType === "desktop" ? "activeDesktopThemeId" : "activeChatroomThemeId";
    const styleId = subType === "desktop" ? DESKTOP_APPLIED_STYLE_ID : CHATROOM_APPLIED_STYLE_ID;

    await window.DB.setSetting(settingKey, "");
    removeStyleEl(styleId);
    toast(`已卸载${subType === "desktop" ? "桌面" : "聊天应用"}样式`, "info");
    await renderGlobalArchiveList(subType);
  }

  async function renderGlobalArchiveList(subType) {
    const boxId = subType === "desktop" ? "desktopThemeArchiveList" : "chatroomThemeArchiveList";
    const box = document.getElementById(boxId);
    if (!box) return;

    const list = await getAllThemes("global_" + subType);
    const settingKey = subType === "desktop" ? "activeDesktopThemeId" : "activeChatroomThemeId";
    const activeId = await window.DB.getSetting(settingKey, "");

    if (!list.length) {
      box.innerHTML = '<div class="bubble-theme-empty">暂无样式存档</div>';
      return;
    }

    box.innerHTML = list.map(t => {
      const isActive = t.id === activeId;
      const loadClass = subType === "desktop" ? "gt-desktop-load" : "gt-chatroom-load";
      const applyClass = subType === "desktop" ? "gt-desktop-apply" : "gt-chatroom-apply";
      const unloadClass = subType === "desktop" ? "gt-desktop-unload" : "gt-chatroom-unload";
      const delClass = subType === "desktop" ? "gt-desktop-del" : "gt-chatroom-del";

      return `<div class="bubble-theme-row" data-id="${t.id}" style="${isActive ? 'border-color:#8ba3c7; background:#f0f6f1;' : ''}">
        <div class="bubble-theme-row-main">
          <div class="bubble-theme-row-name">${esc(t.name)} ${isActive ? '<span style="font-size:11px; color:#4a7a4e; margin-left:6px; font-weight:bold;">应用中</span>' : ''}</div>
          <div class="bubble-theme-row-time">${new Date(t.updatedAt || Date.now()).toLocaleString("zh-CN")}</div>
        </div>
        <div class="bubble-theme-row-actions">
          ${isActive 
            ? `<button class="small-btn ${unloadClass}" style="color:#c0392b;">卸载</button>` 
            : `<button class="small-btn ${applyClass}">应用</button>`
          }
          <button class="small-btn ${loadClass}">载入</button>
          <button class="small-btn ${delClass}" style="color:#c0392b;">删除</button>
        </div>
      </div>`;
    }).join("");
  }

  // 启动自动读取生效样式
  async function applyActiveGlobalThemeOnStartup() {
    try {
      const activeDesktopId = await window.DB.getSetting("activeDesktopThemeId", "");
      if (activeDesktopId) {
        const theme = await window.DB.get(STORE_NAME, activeDesktopId);
        if (theme && theme.cssText) {
          getStyleEl(DESKTOP_APPLIED_STYLE_ID).textContent = theme.cssText;
        }
      }
      const activeChatroomId = await window.DB.getSetting("activeChatroomThemeId", "");
      if (activeChatroomId) {
        const theme = await window.DB.get(STORE_NAME, activeChatroomId);
        if (theme && theme.cssText) {
          getStyleEl(CHATROOM_APPLIED_STYLE_ID).textContent = theme.cssText;
        }
      }
    } catch (e) {
      console.error("加载全局主题失败:", e);
    }
  }

  // ================================================================
  // ⚙️ 统一事件绑定及面板初始化
  // ================================================================
  function bindDelegatedEventsOnce() {
    if (window.__btDelegatedBound) return;
    window.__btDelegatedBound = true;

    document.addEventListener("click", async (e) => {
      const t = e.target;

      // 气泡模块 DIY
      if (t.id === "bubblePreviewBtn") return runPreview();
      if (t.id === "bubbleClearPreviewBtn") return clearPreview();
      if (t.id === "bubbleSaveSnapshotBtn") return saveSnapshot();

      // 双全局 DIY 按钮
      if (t.id === "desktopPreviewBtn") return runDesktopPreview();
      if (t.id === "desktopClearPreviewBtn") return clearDesktopPreview();
      if (t.id === "desktopSaveSnapshotBtn") return saveGlobalSnapshot("desktop");

      if (t.id === "chatroomPreviewBtn") return runChatroomPreview();
      if (t.id === "chatroomClearPreviewBtn") return clearChatroomPreview();
      if (t.id === "chatroomSaveSnapshotBtn") return saveGlobalSnapshot("chatroom");

      // 气泡样式列表点击代理
      const row = t.closest(".bubble-theme-row");
      if (row) {
        const id = row.getAttribute("data-id");

        // 气泡存档控制
        if (t.classList.contains("bt-load")) {
          const theme = await window.DB.get(STORE_NAME, id);
          if (!theme) return;
          document.getElementById("bubbleCssInput").value = theme.cssText || "";
          currentEditingIconMap = normalizeIconMap(theme.iconMap);
          renderIconEditor();
          initPreviewBox();
          toast("已载入气泡存档", "success");
          return;
        }
        if (t.classList.contains("bt-edit")) {
          const theme = await window.DB.get(STORE_NAME, id);
          if (!theme) return;
          const name = prompt("新名称：", theme.name || "");
          if (!name || !name.trim()) return;
          theme.name = name.trim();
          theme.updatedAt = Date.now();
          await window.DB.put(STORE_NAME, theme);
          await renderArchiveList();
          await renderMountThemeSelect();
          toast("已重命名", "success");
          return;
        }
        if (t.classList.contains("bt-del")) {
          if (!confirm("确定删除这个气泡样式存档吗？")) return;
          await window.DB.delete(STORE_NAME, id);
          // 解绑单聊/群聊关联
          const cds = await window.DB.getAll("convDetails");
          for (const d of cds) {
            if (d.bubbleThemeId === id) { d.bubbleThemeId = ""; await window.DB.put("convDetails", d); }
          }
          const gs = await window.DB.getAll("groupChats");
          for (const g of gs) {
            if (g.bubbleThemeId === id) { g.bubbleThemeId = ""; await window.DB.put("groupChats", g); }
          }
          await renderArchiveList();
          await renderMountThemeSelect();
          await renderMountTargetList();
          toast("已删除并解除挂载", "success");
          return;
        }

        // 🖥️ 桌面主题列表动作
        if (t.classList.contains("gt-desktop-load")) {
          const theme = await window.DB.get(STORE_NAME, id);
          if (theme) {
            document.getElementById("desktopCssInput").value = theme.cssText || "";
            toast("已载入桌面样式到编辑器", "success");
          }
          return;
        }
        if (t.classList.contains("gt-desktop-apply")) {
          await applyGlobalTheme(id, "desktop");
          return;
        }
        if (t.classList.contains("gt-desktop-unload")) {
          await removeActiveGlobalTheme("desktop");
          return;
        }
        if (t.classList.contains("gt-desktop-del")) {
          if (confirm("确定删除这个桌面样式吗？")) {
            const activeId = await window.DB.getSetting("activeDesktopThemeId", "");
            if (id === activeId) await removeActiveGlobalTheme("desktop");
            await window.DB.delete(STORE_NAME, id);
            await renderGlobalArchiveList("desktop");
            toast("桌面样式已删除", "success");
          }
          return;
        }

        // 💬 聊天室主题列表动作
        if (t.classList.contains("gt-chatroom-load")) {
          const theme = await window.DB.get(STORE_NAME, id);
          if (theme) {
            document.getElementById("chatroomCssInput").value = theme.cssText || "";
            toast("已载入聊天室样式到编辑器", "success");
          }
          return;
        }
        if (t.classList.contains("gt-chatroom-apply")) {
          await applyGlobalTheme(id, "chatroom");
          return;
        }
        if (t.classList.contains("gt-chatroom-unload")) {
          await removeActiveGlobalTheme("chatroom");
          return;
        }
        if (t.classList.contains("gt-chatroom-del")) {
          if (confirm("确定删除这个聊天室样式吗？")) {
            const activeId = await window.DB.getSetting("activeChatroomThemeId", "");
            if (id === activeId) await removeActiveGlobalTheme("chatroom");
            await window.DB.delete(STORE_NAME, id);
            await renderGlobalArchiveList("chatroom");
            toast("聊天室样式已删除", "success");
          }
          return;
        }
      }

      // 气泡挂载事件
      if (t.classList.contains("bt-mount-conv")) {
        const themeId = document.getElementById("bubbleThemeMountSelect")?.value || "";
        if (!themeId) return toast("请先选择气泡存档", "error");
        const convId = parseInt(t.getAttribute("data-conv-id"));
        if (!convId) return;

        let cd = await window.DB.get("convDetails", convId);
        if (!cd) cd = { conversationId: convId, worldbookIds: [] };
        cd.bubbleThemeId = themeId;
        await window.DB.put("convDetails", cd);

        if (window.currentConversationId === convId) {
          await applyBubbleThemeForConversation(convId);
        }
        toast("✅ 已成功挂载到该单聊", "success");
        return;
      }

      if (t.classList.contains("bt-mount-group")) {
        const themeId = document.getElementById("bubbleThemeMountSelect")?.value || "";
        if (!themeId) return toast("请先选择气泡存档", "error");
        const groupId = parseInt(t.getAttribute("data-group-id"));
        if (!groupId) return;

        const g = await window.DB.get("groupChats", groupId);
        if (!g) return;
        g.bubbleThemeId = themeId;
        await window.DB.put("groupChats", g);

        if (window.currentGroupId === groupId) {
          await applyBubbleThemeForGroup(groupId);
        }
        toast("✅ 已成功挂载到该群聊", "success");
        return;
      }

      // 图标编辑自定义动作
      const iconRow = t.closest("[data-icon-key]");
      if (iconRow && t.classList.contains("bt-icon-text")) {
        const key = iconRow.getAttribute("data-icon-key");
        const old = currentEditingIconMap[key]?.value || "";
        const v = prompt("输入自定义 emoji / 文本 / 矢量图 SVG / 链接：", old);
        if (v === null) return;
        const value = v.trim();
        if (!value) return;
        currentEditingIconMap[key] = { type: isImageValue(value) ? "image" : "text", value };
        renderIconEditor();
        initPreviewBox();
        return;
      }

      if (iconRow && t.classList.contains("bt-icon-upload")) {
        const fileInput = iconRow.querySelector(".bt-icon-file");
        if (fileInput) fileInput.click();
        return;
      }

      if (iconRow && t.classList.contains("bt-icon-reset")) {
        const key = iconRow.getAttribute("data-icon-key");
        currentEditingIconMap[key] = JSON.parse(JSON.stringify(DEFAULT_ICON_MAP[key]));
        renderIconEditor();
        initPreviewBox();
        return;
      }
    });

    // 监听本地选择本地图标上传
    document.addEventListener("change", async (e) => {
      const t = e.target;
      if (!t.classList.contains("bt-icon-file")) return;
      const file = t.files && t.files[0];
      if (!file) return;

      const row = t.closest("[data-icon-key]");
      const key = row?.getAttribute("data-icon-key");
      if (!key) return;

      const reader = new FileReader();
      reader.onload = function (ev) {
        const dataUrl = ev.target.result;
        currentEditingIconMap[key] = { type: "image", value: dataUrl };
        renderIconEditor();
        initPreviewBox();
      };
      reader.readAsDataURL(file);
      t.value = "";
    });
  }

  async function initBubbleThemePanel() {
    await ensureStore();
    currentEditingIconMap = JSON.parse(JSON.stringify(DEFAULT_ICON_MAP));
    renderIconEditor();
    initPreviewBox();
    await renderArchiveList();
    await renderMountThemeSelect();
    await renderMountTargetList();
  }

  // 初始化全局样式双面板
  async function initGlobalThemePanel() {
    const desktopRoot = document.getElementById("desktopThemePreviewRoot");
    const chatroomRoot = document.getElementById("chatroomThemePreviewRoot");

    if (desktopRoot) {
      desktopRoot.setAttribute("data-desktop-scope", "preview_desktop");
      desktopRoot.innerHTML = buildDesktopPreviewHtml();
      bindDesktopPreviewEvents(desktopRoot);
    }

    if (chatroomRoot) {
      chatroomRoot.setAttribute("data-chatroom-scope", "preview_chatroom");
      chatroomRoot.innerHTML = buildChatroomPreviewHtml();
      bindChatroomPreviewEvents(chatroomRoot);
    }

    // 载入当前已生效的 CSS 设定，填充编辑区
    const activeDesktopId = await window.DB.getSetting("activeDesktopThemeId", "");
    const activeChatroomId = await window.DB.getSetting("activeChatroomThemeId", "");

    if (activeDesktopId) {
      const theme = await window.DB.get(STORE_NAME, activeDesktopId);
      if (theme && document.getElementById("desktopCssInput")) {
        document.getElementById("desktopCssInput").value = theme.cssText || "";
        runDesktopPreview();
      }
    }
    if (activeChatroomId) {
      const theme = await window.DB.get(STORE_NAME, activeChatroomId);
      if (theme && document.getElementById("chatroomCssInput")) {
        document.getElementById("chatroomCssInput").value = theme.cssText || "";
        runChatroomPreview();
      }
    }

    await renderGlobalArchiveList("desktop");
    await renderGlobalArchiveList("chatroom");
  }

  window.bubbleThemeModule = {
    initBubbleThemePanel,
    applyBubbleThemeForConversation,
    applyBubbleThemeForGroup,
    scopeCss
  };

  window.globalThemeModule = {
    initGlobalThemePanel,
    applyActiveGlobalThemeOnStartup
  };

  bindDelegatedEventsOnce();
})();