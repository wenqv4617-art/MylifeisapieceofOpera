(function () {
  if (window.__NarrativeSiyuLoaded) return;
  window.__NarrativeSiyuLoaded = true;

  const N = window.NarrativePhone;

  const db = new Dexie("NarrativeSiyuDB");
  db.version(1).stores({
    stickerGroups: "++id, name, order, createdAt",
    stickers: "++id, groupId, text, url, createdAt",
    chats: "++id, type, title, userPersonaId, charPersonaId, createdAt, updatedAt",
    messages: "++id, chatId, role, text, avatar, name, createdAt, fav",
    state: "key"
  });

  const state = {
    opened: false,
    tab: "chat",
    view: "tab",
    currentUserId: null,
    currentChatId: null,
    currentStickerGroupId: null,
    users: [],
    chars: [],
    currentMessages: []  // 缓存当前聊天的消息
  };

  let layer;
  let headLeft;
  let headTitle;
  let headSub;
  let headRight;
  let main;
  let tabs;
  let modalMask;

  const icon = {
    back: `<svg viewBox="0 0 24 24"><path d="M15 6L9 12L15 18"/></svg>`,
    close: `<svg viewBox="0 0 24 24"><path d="M7 7L17 17"/><path d="M17 7L7 17"/></svg>`,
    plus: `<svg viewBox="0 0 24 24"><path d="M12 5V19"/><path d="M5 12H19"/></svg>`,
    chat: `<svg viewBox="0 0 24 24"><path d="M5 7.5C5 5.8 6.4 4.5 8.1 4.5H15.9C17.6 4.5 19 5.8 19 7.5V12.4C19 14.1 17.6 15.4 15.9 15.4H10.2L6 19V15.1C5.4 14.5 5 13.5 5 12.4V7.5Z"/><path d="M8.4 9H15.4"/><path d="M8.4 12H13"/></svg>`,
    moment: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7.5"/><path d="M12 4.5C14.2 6.5 15.2 9 15.2 12S14.2 17.5 12 19.5"/><path d="M12 4.5C9.8 6.5 8.8 9 8.8 12S9.8 17.5 12 19.5"/><path d="M4.8 12H19.2"/></svg>`,
    me: `<svg viewBox="0 0 24 24"><circle cx="12" cy="8.8" r="3.4"/><path d="M5.6 19C6.4 15.7 8.8 13.8 12 13.8S17.6 15.7 18.4 19"/></svg>`,
    user: `<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="3.6"/><path d="M5.5 19c.8-3.4 3.4-5.4 6.5-5.4S17.7 15.6 18.5 19"/></svg>`,
    sticker: `<svg viewBox="0 0 24 24"><path d="M6.4 4.8H17.6C18.5 4.8 19.2 5.5 19.2 6.4V13.8L13.8 19.2H6.4C5.5 19.2 4.8 18.5 4.8 17.6V6.4C4.8 5.5 5.5 4.8 6.4 4.8Z"/><path d="M13.8 19.2V15.2C13.8 14.4 14.4 13.8 15.2 13.8H19.2"/><path d="M8.4 9.2H8.5"/><path d="M15.4 9.2H15.5"/><path d="M9.3 12.6C10.6 13.7 13.4 13.7 14.7 12.6"/></svg>`,
    star: `<svg viewBox="0 0 24 24"><path d="M12 4.5L14.2 9L19.2 9.7L15.6 13.2L16.5 18.2L12 15.8L7.5 18.2L8.4 13.2L4.8 9.7L9.8 9L12 4.5Z"/></svg>`,
    diary: `<svg viewBox="0 0 24 24"><path d="M7 4.8H16.3C17.2 4.8 18 5.6 18 6.5V18.8H7C6.1 18.8 5.4 18.1 5.4 17.2V6.4C5.4 5.5 6.1 4.8 7 4.8Z"/><path d="M8.4 8.4H15"/><path d="M8.4 11.4H14"/><path d="M8.4 14.4H12.4"/></svg>`,
    tool: `<svg viewBox="0 0 24 24"><path d="M12 5V19"/><path d="M5 12H19"/></svg>`,
    send: `<svg viewBox="0 0 24 24"><path d="M4.8 5.2L19.2 12L4.8 18.8L7.2 12L4.8 5.2Z"/><path d="M7.2 12H13.4"/></svg>`,
    reply: `<svg viewBox="0 0 24 24"><path d="M7.2 7.4H16.8C18.1 7.4 19.1 8.4 19.1 9.7V14.3C19.1 15.6 18.1 16.6 16.8 16.6H7.2C5.9 16.6 4.9 15.6 4.9 14.3V9.7C4.9 8.4 5.9 7.4 7.2 7.4Z"/><path d="M8.2 7.4V5.3"/><path d="M15.8 7.4V5.3"/><path d="M9.2 11.3H9.3"/><path d="M14.7 11.3H14.8"/><path d="M9.8 14.1C11.1 14.8 12.9 14.8 14.2 14.1"/></svg>`,
    more: `<svg viewBox="0 0 24 24"><path d="M6.8 12H6.9"/><path d="M12 12H12.1"/><path d="M17.2 12H17.3"/></svg>`,
 upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 16V4"/>
    <path d="M8 8L12 4L16 8"/>
    <path d="M4 16V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V16"/>
    <circle cx="12" cy="14" r="1" fill="currentColor" stroke="none"/>
  </svg>`,

  batchImport: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 16V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V16"/>
    <path d="M8 12L12 16L16 12"/>
    <path d="M12 16V4"/>
    <rect x="6" y="2" width="12" height="4" rx="1"/>
  </svg>`,

  urlImport: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="8"/>
    <path d="M12 4C9.3 4 7 8 7 12C7 16 9.3 20 12 20"/>
    <path d="M12 4C14.7 4 17 8 17 12C17 16 14.7 20 12 20"/>
    <path d="M4 12H20"/>
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>
  </svg>`,

  paste: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M10 4H6C4.9 4 4 4.9 4 6V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V10"/>
    <path d="M14 4H20V10"/>
    <rect x="10" y="10" width="8" height="8" rx="1"/>
    <path d="M12 14L16 14"/>
    <path d="M12 16L14 16"/>
  </svg>`,

  deleteGroup: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 6L6 18"/>
    <path d="M6 6L18 18"/>
    <circle cx="12" cy="12" r="10"/>
  </svg>`,

  // 卡片内的按钮
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 12L10 17L20 7"/>
  </svg>`,
  
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 6H21"/>
    <path d="M19 6V18C19 19.1 18.1 20 17 20H7C5.9 20 5 19.1 5 18V6"/>
    <path d="M8 4V6H16V4"/>
    <path d="M10 10V16"/>
    <path d="M14 10V16"/>
  </svg>`
  };

  function esc(v) {
    return String(v ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function toast(t) {
    if (window.NarrativePhone && window.NarrativePhone.openSettings) {
      const el = document.getElementById("toast");
      if (el) {
        el.textContent = t;
        el.classList.add("show");
        clearTimeout(toast.timer);
        toast.timer = setTimeout(() => el.classList.remove("show"), 1500);
      }
    }
  }

  function avatarHTML(src) {
    if (src) return `<img src="${esc(src)}" alt="">`;
    return icon.user;
  }

  async function getState(key, fallback) {
    const row = await db.state.get(key);
    return row ? row.value : fallback;
  }

  async function setState(key, value) {
    await db.state.put({ key, value });
  }

  async function ensureDefaultData() {
    const c = await db.stickerGroups.count();
    if (!c) {
      const now = Date.now();
      await db.stickerGroups.add({
        name: "默认",
        order: 1,
        createdAt: now
      });
    }
  }

  async function refreshPersonas() {
    state.users = N && N.listPersonas ? await N.listPersonas("user") : [];
    state.chars = N && N.listPersonas ? await N.listPersonas("char") : [];

    const saved = await getState("currentUserId", null);
    const exists = state.users.some(p => Number(p.id) === Number(saved));

    if (exists) {
      state.currentUserId = Number(saved);
    } else if (state.users[0]) {
      state.currentUserId = Number(state.users[0].id);
      await setState("currentUserId", state.currentUserId);
    } else {
      state.currentUserId = null;
    }
  }

  function currentUser() {
    return state.users.find(p => Number(p.id) === Number(state.currentUserId)) || null;
  }

  function setHeader(title, subtitle, opts = {}) {
    headLeft.innerHTML = "";
    headRight.innerHTML = "";
    headTitle.textContent = title || "";
    headSub.textContent = subtitle || "";

    if (opts.back) {
      const b = document.createElement("button");
      b.className = "siyu-icon-btn";
      b.innerHTML = icon.back;
      b.dataset.act = opts.backAct || "back-tab";
      headLeft.appendChild(b);
    } else {
      const c = document.createElement("button");
      c.className = "siyu-icon-btn";
      c.innerHTML = icon.close;
      c.dataset.act = "close";
      headLeft.appendChild(c);
    }

    if (opts.right) {
      opts.right.forEach(item => {
        const b = document.createElement("button");
        b.className = "siyu-icon-btn";
        b.innerHTML = item.svg;
        b.dataset.act = item.act;
        if (item.id) b.dataset.id = item.id;
        headRight.appendChild(b);
      });
    }
  }

  function setTabsVisible(show) {
    tabs.style.display = show ? "grid" : "none";
    const app = layer.querySelector(".siyu-app");
    app.style.gridTemplateRows = show ? "48px 1fr 62px" : "48px 1fr 0px";
  }

  function markTab() {
    tabs.querySelectorAll(".siyu-tab").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === state.tab);
    });
  }

  function ensureShell() {
    if (layer) return;

    const screen = document.getElementById("screen") || document.body;

    layer = document.createElement("section");
    layer.id = "siyuLayer";
    layer.className = "siyu-layer";

    layer.innerHTML = `
      <div class="siyu-app">
        <header class="siyu-head">
          <div class="siyu-head-left"></div>
          <div class="siyu-titlebox">
            <div class="siyu-title"></div>
            <div class="siyu-subtitle"></div>
          </div>
          <div class="siyu-head-right"></div>
        </header>

        <main class="siyu-main"></main>

        <nav class="siyu-tabs">
          <button class="siyu-tab active" data-tab="chat">${icon.chat}<span>聊天</span></button>
          <button class="siyu-tab" data-tab="moment">${icon.moment}<span>朋友圈</span></button>
          <button class="siyu-tab" data-tab="me">${icon.me}<span>我的</span></button>
        </nav>

        <div class="siyu-modal-mask"></div>
      </div>
    `;

    screen.appendChild(layer);

    headLeft = layer.querySelector(".siyu-head-left");
    headTitle = layer.querySelector(".siyu-title");
    headSub = layer.querySelector(".siyu-subtitle");
    headRight = layer.querySelector(".siyu-head-right");
    main = layer.querySelector(".siyu-main");
    tabs = layer.querySelector(".siyu-tabs");
    modalMask = layer.querySelector(".siyu-modal-mask");

    layer.addEventListener("click", onClick);
    layer.addEventListener("change", onChange);
    layer.addEventListener("input", onInput);
  }

  async function openSiyu() {
    ensureShell();
    await ensureDefaultData();
    await refreshPersonas();

    layer.classList.add("show");

    if (!state.opened) {
      state.opened = true;
      state.tab = "chat";
      await renderTab("chat");
    } else {
      markTab();
    }
  }

  function closeSiyu() {
    if (layer) layer.classList.remove("show");
  }

  async function renderTab(tab) {
    state.tab = tab;
    state.view = "tab";
    markTab();
    setTabsVisible(true);

    if (tab === "chat") return renderChatHome();
    if (tab === "moment") return renderMoment();
    if (tab === "me") return renderMe();
  }

  async function renderChatHome() {
  setHeader("私语", "聊天", {
    right: [{ svg: icon.plus, act: "new-chat" }]
  });

  const chats = await db.chats.orderBy("updatedAt").reverse().limit(50).toArray();

  if (!chats.length) {
    main.innerHTML = `
      <div class="siyu-scroll">
        <div class="siyu-empty">还没有聊天。点击右上角新建聊天。</div>
      </div>
    `;
    return;
  }

  const html = chats.map(c => {
    const char = state.chars.find(p => Number(p.id) === Number(c.charPersonaId));
    // 截断预览文本
    const preview = c.preview && c.preview.length > 20 
      ? c.preview.slice(0, 20) + '...' 
      : (c.preview || "点击继续对话");
    
    return `
      <button class="siyu-chat-item" data-act="open-chat" data-id="${c.id}">
        <div class="siyu-avatar">${avatarHTML(char && char.avatar)}</div>
        <div class="siyu-chat-main">
          <div class="siyu-chat-title">${esc(c.title || "未命名聊天")}</div>
          <div class="siyu-chat-preview">${esc(preview)}</div>
        </div>
      </button>
    `;
  }).join("");

  main.innerHTML = `<div class="siyu-scroll"><div class="siyu-chat-list">${html}</div></div>`;
}

  function renderMoment() {
    setHeader("朋友圈", "轻轻记录故事流");
    main.innerHTML = `
      <div class="siyu-scroll">
        <div class="siyu-empty">朋友圈页面先留作入口，后续可以接入动态发布、评论与点赞。</div>
      </div>
    `;
  }

  async function renderMe() {
    await refreshPersonas();
    setHeader("我的", "当前人设与私语设置");

    const user = currentUser();

    const options = state.users.map(p => {
      return `<option value="${p.id}" ${Number(p.id) === Number(state.currentUserId) ? "selected" : ""}>${esc(p.name || "未命名")}</option>`;
    }).join("");

    main.innerHTML = `
      <div class="siyu-scroll">
        <div class="siyu-card siyu-profile">
          <div class="siyu-avatar">${avatarHTML(user && user.avatar)}</div>
          <div class="siyu-profile-main">
            <div class="siyu-profile-name">${esc(user ? user.name : "未选择人设")}</div>
            <div class="siyu-profile-desc">${esc(user ? (user.gender || "未设定性别") : "请先在存笺中创建用户档案")}</div>
            <select class="siyu-select" id="siyuUserSelect">
              ${state.users.length ? options : `<option value="">暂无用户人设</option>`}
            </select>
          </div>
        </div>

        <div class="siyu-row-list">
          <button class="siyu-row" data-act="stickers">
            ${icon.sticker}
            <div class="siyu-row-main">
              <div class="siyu-row-name">表情包</div>
              <div class="siyu-row-desc">全局共享，支持分组、上传、URL 与批量导入</div>
            </div>
          </button>

          <button class="siyu-row" data-act="favorites">
            ${icon.star}
            <div class="siyu-row-main">
              <div class="siyu-row-name">收藏</div>
              <div class="siyu-row-desc">随当前人设切换，后续用于收藏对话消息</div>
            </div>
          </button>

          <button class="siyu-row" data-act="diary">
            ${icon.diary}
            <div class="siyu-row-main">
              <div class="siyu-row-name">日记</div>
              <div class="siyu-row-desc">入口已预留</div>
            </div>
          </button>
        </div>
      </div>
    `;
  }

  async function renderSinglePicker() {
  await refreshPersonas();

  setTabsVisible(false);
  setHeader("新建单聊", "选择一个角色开始私语", { back: true, backAct: "back-chat" });

  if (!state.chars.length) {
    main.innerHTML = `
      <div class="siyu-scroll">
        <div class="siyu-empty">存笺中还没有角色档案，请先去「存笺」创建角色。</div>
      </div>
    `;
    return;
  }

  const html = state.chars.slice(0, 50).map(p => {
    // 截断详情描述，最多显示 20 个字符
    const preview = p.details && p.details.length > 20 
      ? p.details.slice(0, 20) + '...' 
      : p.details || "点击创建单聊";
    
    return `
      <button class="siyu-chat-item" data-act="create-single" data-id="${p.id}">
        <div class="siyu-avatar">${avatarHTML(p.avatar)}</div>
        <div class="siyu-chat-main">
          <div class="siyu-chat-title">${esc(p.name || "未命名")}</div>
          <div class="siyu-chat-preview">${esc(preview)}</div>
        </div>
      </button>
    `;
  }).join("");

  main.innerHTML = `<div class="siyu-scroll"><div class="siyu-picker">${html}</div></div>`;
}

  async function createSingle(charId) {
    await refreshPersonas();

    const char = state.chars.find(p => Number(p.id) === Number(charId));
    if (!char) return toast("角色不存在");

    const user = currentUser();
    const now = Date.now();

    const id = await db.chats.add({
      type: "single",
      title: char.name || "单聊",
      userPersonaId: user ? Number(user.id) : null,
      charPersonaId: Number(char.id),
      createdAt: now,
      updatedAt: now,
      preview: "新会话"
    });

    await openChat(id);
  }

  async function openChat(id) {
  state.currentChatId = Number(id);
  state.view = "room";

  await refreshPersonas();

  const chat = await db.chats.get(state.currentChatId);
  if (!chat) {
    toast("聊天不存在");
    return renderTab("chat");
  }

  const char = state.chars.find(p => Number(p.id) === Number(chat.charPersonaId));

  setTabsVisible(false);
  setHeader(chat.title || "单聊", char ? "单聊" : "角色不存在", {
    back: true,
    backAct: "back-chat",
    right: [{ svg: icon.more, act: "chat-detail" }]
  });

  main.innerHTML = `
    <div class="siyu-room">
      <div class="siyu-messages" id="siyuMessages"></div>
      <div class="siyu-inputbar">
        <button class="siyu-icon-btn" data-act="tools">${icon.tool}</button>
        <input class="siyu-input" id="siyuInput" placeholder="写一句私语">
        <button class="siyu-icon-btn" data-act="send">${icon.send}</button>
        <button class="siyu-icon-btn" data-act="get-reply">${icon.reply}</button>
      </div>
    </div>
  `;

  // 只加载最近 100 条消息，避免卡顿
  const messages = await db.messages
    .where("chatId")
    .equals(state.currentChatId)
    .reverse()
    .limit(100)
    .sortBy("createdAt");

  const box = main.querySelector("#siyuMessages");
  
  // 使用 DocumentFragment 批量追加
  const frag = document.createDocumentFragment();
  messages.forEach(m => {
    frag.appendChild(messageNode(m));
  });
  box.appendChild(frag);
  box.scrollTop = box.scrollHeight;

  // 绑定输入框事件
  const input = main.querySelector("#siyuInput");
  if (input) {
    input.addEventListener("keydown", async (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        await sendUserMessage();
      }
    });
  }
}

  function messageNode(m) {
    const node = document.createElement("div");
    node.className = `siyu-msg ${m.role === "user" ? "user" : "char"}`;
    node.dataset.id = m.id || "";

    node.innerHTML = `
      <div class="siyu-bubble-avatar">${avatarHTML(m.avatar)}</div>
      <div class="siyu-bubble-wrap">
        <div class="siyu-bubble-name">${esc(m.name || (m.role === "user" ? "我" : "对方"))}</div>
        <div class="siyu-bubble">${esc(m.text || "")}</div>
      </div>
    `;

    return node;
  }

  async function appendMessage(role, text) {
  const chat = await db.chats.get(state.currentChatId);
  if (!chat) return;

  await refreshPersonas();

  const user = currentUser();
  const char = state.chars.find(p => Number(p.id) === Number(chat.charPersonaId));

  const persona = role === "user" ? user : char;

  const row = {
    chatId: state.currentChatId,
    role,
    text: String(text || ""),
    avatar: persona && persona.avatar ? persona.avatar : "",
    name: persona && persona.name ? persona.name : role === "user" ? "我" : "对方",
    createdAt: Date.now(),
    fav: false
  };

  const id = await db.messages.add(row);
  row.id = id;

  await db.chats.update(state.currentChatId, {
    preview: row.text.slice(0, 40),
    updatedAt: Date.now()
  });

  const box = main.querySelector("#siyuMessages");
  if (box) {
    // 直接追加新节点，不重新渲染整个列表
    box.appendChild(messageNode(row));
    box.scrollTop = box.scrollHeight;
  }
}

  async function sendUserMessage() {
    const input = main.querySelector("#siyuInput");
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    input.value = "";
    await appendMessage("user", text);
  }

  function buildChatCompletionURL(raw) {
    let url = String(raw || "").trim();
    if (!url) return "";

    url = url.replace(/\/+$/, "");

    if (url.endsWith("/chat/completions")) return url;
    if (url.endsWith("/v1")) return `${url}/chat/completions`;
    if (url.endsWith("/models")) return url.replace(/\/models$/, "/chat/completions");

    return `${url}/chat/completions`;
  }

  async function getAIReply() {
    const chat = await db.chats.get(state.currentChatId);
    if (!chat) return;

    await refreshPersonas();

    const char = state.chars.find(p => Number(p.id) === Number(chat.charPersonaId));
    const user = currentUser();

    if (!char) {
      toast("角色不存在");
      return;
    }

    const oldMessages = await db.messages
      .where("chatId")
      .equals(state.currentChatId)
      .sortBy("createdAt");

    const recent = oldMessages.slice(-20);

    const fallbackReply = () => {
      const name = char.name || "对方";
      return `${name}轻轻看向你，像是把刚才的话收进了心里。\n\n“我听见了，我们可以慢慢说。”`;
    };

    try {
      const api = N && N.getApiConfig ? await N.getApiConfig() : null;
      const awareness = N && N.getChatAwarenessContext ? await N.getChatAwarenessContext() : null;

      if (!api || !api.url || !api.model) {
        await appendMessage("char", fallbackReply());
        return;
      }

      const endpoint = buildChatCompletionURL(api.url);
      if (!endpoint) {
        await appendMessage("char", fallbackReply());
        return;
      }

      const headers = {
        "Content-Type": "application/json"
      };

      if (api.apiKey) {
        headers.Authorization = `Bearer ${api.apiKey}`;
      }

      const systemParts = [
        "你正在进行一个中文私聊角色扮演对话。",
        "请自然、细腻、贴合角色地回复。",
        "不要输出系统提示，不要解释规则。",
        "回复可以简短，有情绪和动作描写，但不要过度冗长。"
      ];

      if (user) {
        systemParts.push(`用户人设：姓名=${user.name || "未命名"}；性别=${user.gender || "未设定"}；详情=${user.details || "无"}`);
      }

      if (char) {
        systemParts.push(`角色人设：姓名=${char.name || "未命名"}；性别=${char.gender || "未设定"}；详情=${char.details || "无"}`);
      }

      if (awareness && awareness.timeAwarenessEnabled) {
        systemParts.push(`当前本地时间：${awareness.localTimeText || awareness.currentTime || ""}`);
      }

      const messages = [
        {
          role: "system",
          content: systemParts.join("\n")
        },
        ...recent.map(m => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.text || ""
        }))
      ];

      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: api.model,
          messages,
          temperature: Number(api.temperature ?? 0.7),
          top_p: Number(api.topP ?? 0.9)
        })
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`回复获取失败：${res.status} ${text.slice(0, 160)}`);
      }

      const json = await res.json();

      if (N && N.reportApiUsage && json.usage) {
        await N.reportApiUsage(json.usage);
      }

      const reply =
        json.choices &&
        json.choices[0] &&
        json.choices[0].message &&
        json.choices[0].message.content
          ? json.choices[0].message.content.trim()
          : "";

      await appendMessage("char", reply || fallbackReply());
    } catch (error) {
      if (N && N.logApiError) {
        await N.logApiError("siyu.getAIReply", error);
      }

      toast(error.message || "获取回复失败");
      await appendMessage("char", fallbackReply());
    }
  }

  async function renderStickers() {
  state.view = "stickers";

  setTabsVisible(false);
  setHeader("表情包", "分组管理与导入", {
    back: true,
    backAct: "back-me",
    right: [
      {
        svg: icon.plus,
        act: "add-sticker-group"
      }
    ]
  });

  const groups = await db.stickerGroups.orderBy("order").toArray();

  if (!groups.length) {
    const now = Date.now();
    const id = await db.stickerGroups.add({
      name: "默认",
      order: 1,
      createdAt: now
    });
    state.currentStickerGroupId = id;
  } else if (
    !state.currentStickerGroupId ||
    !groups.some(g => Number(g.id) === Number(state.currentStickerGroupId))
  ) {
    state.currentStickerGroupId = groups[0].id;
  }

  const freshGroups = await db.stickerGroups.orderBy("order").toArray();

  main.innerHTML = `
  <div class="siyu-sticker-page">
    <aside class="siyu-sticker-groups" id="siyuStickerGroups"></aside>

    <section class="siyu-sticker-panel">
      <div class="siyu-sticker-tools">
        <button class="siyu-mini-btn primary" data-act="upload-sticker" title="上传">${icon.upload}</button>
        <button class="siyu-mini-btn" data-act="url-sticker" title="URL导入">${icon.urlImport}</button>
        <button class="siyu-mini-btn" data-act="paste-sticker" title="批量粘贴">${icon.paste}</button>
        <button class="siyu-mini-btn danger" data-act="delete-sticker-group" title="删除分组">${icon.deleteGroup}</button>
      </div>

      <div class="siyu-sticker-grid" id="siyuStickerGrid"></div>

      <input type="file" id="siyuStickerFile" accept="image/*" style="display:none">
      <input type="file" id="siyuStickerFiles" accept="image/*" multiple style="display:none">

      <div class="siyu-sticker-modal" id="siyuStickerModal"></div>
    </section>
  </div>
`;

  renderStickerGroups(freshGroups);
  await refreshStickerGrid();
}

// ========== 表情包弹出卡片 ==========
async function openStickerModal(stickerId) {
  const sticker = await db.stickers.get(Number(stickerId));
  if (!sticker) return toast("表情包不存在");

  const modal = main.querySelector("#siyuStickerModal");
  if (!modal) return;

  modal.classList.add("show");

  modal.innerHTML = `
  <div class="siyu-sticker-modal-card">
    <div class="siyu-sticker-modal-preview">
      <img src="${esc(sticker.url)}" alt="">
    </div>
    <input class="siyu-sticker-modal-input" id="stickerTextInput" 
      placeholder="表情文字" value="${esc(sticker.text || '表情')}" maxlength="30">
    <div class="siyu-sticker-modal-actions">
      <button class="siyu-mini-btn" data-act="close-sticker-modal">取消</button>
      <button class="siyu-mini-btn primary" data-act="save-sticker-text">${icon.check} 保存</button>
      <button class="siyu-mini-btn danger" data-act="delete-sticker">${icon.trash} 删除</button>
    </div>
  </div>
`;

  // 绑定事件
  modal.querySelector('[data-act="close-sticker-modal"]').addEventListener('click', closeStickerModal);
  modal.querySelector('[data-act="save-sticker-text"]').addEventListener('click', async () => {
    const input = modal.querySelector('#stickerTextInput');
    const text = input.value.trim() || '表情';
    await db.stickers.update(stickerId, { text });
    closeStickerModal();
    await refreshStickerGrid();
    toast('表情已更新');
  });
  modal.querySelector('[data-act="delete-sticker"]').addEventListener('click', async () => {
    if (!confirm('确定删除这个表情包吗？')) return;
    await db.stickers.delete(stickerId);
    closeStickerModal();
    await refreshStickerGrid();
    toast('表情已删除');
  });

  // 点击外部关闭
  modal.addEventListener('click', e => {
    if (e.target === modal) closeStickerModal();
  });
}

function closeStickerModal() {
  const modal = main.querySelector("#siyuStickerModal");
  if (modal) modal.classList.remove("show");
}

  function renderStickerGroups(groups) {
    const box = main.querySelector("#siyuStickerGroups");
    if (!box) return;

    box.innerHTML = groups.map(g => `
      <button class="siyu-group-btn ${Number(g.id) === Number(state.currentStickerGroupId) ? "active" : ""}"
        data-act="switch-sticker-group"
        data-id="${g.id}">
        ${esc(g.name || "未命名")}
      </button>
    `).join("");
  }

  async function refreshStickerGroupsOnly() {
    const groups = await db.stickerGroups.orderBy("order").toArray();

    if (!groups.length) {
      state.currentStickerGroupId = await db.stickerGroups.add({
        name: "默认",
        order: 1,
        createdAt: Date.now()
      });
      return refreshStickerGroupsOnly();
    }

    if (!groups.some(g => Number(g.id) === Number(state.currentStickerGroupId))) {
      state.currentStickerGroupId = groups[0].id;
    }

    renderStickerGroups(groups);
  }

  async function refreshStickerGrid() {
  const grid = main.querySelector("#siyuStickerGrid");
  if (!grid) return;

  const stickers = await db.stickers
    .where("groupId")
    .equals(Number(state.currentStickerGroupId))
    .sortBy("createdAt");

  if (!stickers.length) {
    grid.innerHTML = `<div class="siyu-empty" style="grid-column:1/-1;">这个分组还没有表情包。</div>`;
    return;
  }

  grid.innerHTML = stickers.map(item => `
    <div class="siyu-sticker-card" data-id="${item.id}">
      <div class="siyu-sticker-img">
        <img src="${esc(item.url)}" alt="">
      </div>
      <div class="siyu-sticker-name">${esc(item.text || "表情")}</div>
    </div>
  `).join("");

  // 给每个卡片绑定点击事件
  grid.querySelectorAll('.siyu-sticker-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      if (id) openStickerModal(Number(id));
    });
  });
}

  function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);

      reader.readAsDataURL(file);
    });
  }

  async function addStickerByFile(file) {
    if (!file) return;

    if (!file.type || !file.type.startsWith("image/")) {
      toast("请选择图片文件");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast("单张图片需小于 3MB");
      return;
    }

    const dataUrl = await fileToDataURL(file);

    await db.stickers.add({
      groupId: Number(state.currentStickerGroupId),
      text: file.name ? file.name.replace(/\.[^.]+$/, "") : "表情",
      url: String(dataUrl || ""),
      createdAt: Date.now()
    });
  }

  async function uploadStickerSingle() {
    const input = main.querySelector("#siyuStickerFile");
    if (!input) return;

    input.value = "";

    input.onchange = async e => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      try {
        await addStickerByFile(file);
        await refreshStickerGrid();
        toast("表情包已导入");
      } catch (error) {
        toast("图片读取失败");
      }
    };

    input.click();
  }

  async function uploadStickerBatch() {
    const input = main.querySelector("#siyuStickerFiles");
    if (!input) return;

    input.value = "";

    input.onchange = async e => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      let count = 0;

      for (const file of files) {
        try {
          await addStickerByFile(file);
          count++;
        } catch (_) {}
      }

      await refreshStickerGrid();
      toast(`已导入 ${count} 张表情包`);
    };

    input.click();
  }

  async function importStickerURL() {
    const text = prompt("请输入表情文字", "表情");
    if (text === null) return;

    const url = prompt("请输入图片 URL");
    if (url === null) return;

    const cleanURL = String(url || "").trim();

    if (!/^https?:\/\//i.test(cleanURL)) {
      toast("请输入 http 或 https 开头的 URL");
      return;
    }

    await db.stickers.add({
      groupId: Number(state.currentStickerGroupId),
      text: String(text || "表情").trim() || "表情",
      url: cleanURL,
      createdAt: Date.now()
    });

    await refreshStickerGrid();
    toast("URL 表情已导入");
  }

  function showBatchPasteModal() {
  modalMask.classList.add("show");

  modalMask.innerHTML = `
    <div class="siyu-modal">
      <div class="siyu-modal-title">批量复制粘贴导入</div>
      <textarea class="siyu-textarea" id="siyuPasteText" placeholder="格式：
文字:URL;
文字:URL;
文字:URL;"></textarea>
      <div class="siyu-modal-actions">
        <button class="siyu-mini-btn" data-act="close-modal">取消</button>
        <button class="siyu-mini-btn primary" data-act="confirm-paste-sticker">保存</button>
      </div>
    </div>
  `;
}

  function parseBatchStickerText(raw) {
    const lines = String(raw || "")
      .split(/\n+/)
      .map(line => line.trim())
      .filter(Boolean);

    const list = [];

    for (const line of lines) {
      const httpIndex = line.search(/https?:\/\//i);
      if (httpIndex < 0) continue;

      let label = line.slice(0, httpIndex).trim();
      let url = line.slice(httpIndex).trim();

      label = label.replace(/[:：]\s*$/, "").trim();
      url = url.replace(/[;；]\s*$/, "").trim();

      const nextSpace = url.search(/\s/);
      if (nextSpace > 0) {
        url = url.slice(0, nextSpace).trim();
      }

      if (!/^https?:\/\//i.test(url)) continue;

      list.push({
        text: label || "表情",
        url
      });
    }

    return list;
  }

  async function confirmBatchPaste() {
    const textarea = modalMask.querySelector("#siyuPasteText");
    if (!textarea) return;

    const list = parseBatchStickerText(textarea.value);

    if (!list.length) {
      toast("没有解析到有效 URL");
      return;
    }

    const now = Date.now();

    await db.stickers.bulkAdd(list.map((item, index) => ({
      groupId: Number(state.currentStickerGroupId),
      text: item.text,
      url: item.url,
      createdAt: now + index
    })));

    closeModal();
    await refreshStickerGrid();
    toast(`已导入 ${list.length} 个表情`);
  }

  function closeModal() {
    modalMask.classList.remove("show");
    modalMask.innerHTML = "";
  }
  
  function showNewChatModal() {
  modalMask.classList.add("show");

  modalMask.innerHTML = `
    <div class="siyu-modal">
      <div class="siyu-modal-title">新建聊天</div>
      <div style="display:grid; gap:12px; margin-top:14px;">
        <button class="siyu-chat-item" data-act="new-single" style="justify-content:center; min-height:56px;">
          <div style="display:flex; align-items:center; gap:12px;">
            ${icon.user}
            <div style="text-align:left;">
              <div style="font-weight:850; color:rgba(38,50,74,.84);">单聊</div>
              <div style="font-size:12px; color:rgba(38,50,74,.42);">与一个角色单独对话</div>
            </div>
          </div>
        </button>

        <button class="siyu-chat-item" data-act="new-group" style="justify-content:center; min-height:56px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="8" r="3.2"/>
              <circle cx="15" cy="9" r="2.8"/>
              <path d="M5.2 18.5C5.8 15.4 7.2 13.4 9 13.4C10.8 13.4 12.2 15.4 12.8 18.5"/>
              <path d="M13 14.8C13.8 14.2 14.6 13.8 15.6 13.8C17.4 13.8 18.8 15.4 19.4 18.1"/>
            </svg>
            <div style="text-align:left;">
              <div style="font-weight:850; color:rgba(38,50,74,.84);">群聊</div>
              <div style="font-size:12px; color:rgba(38,50,74,.42);">与多个角色一起对话（敬请期待）</div>
            </div>
          </div>
        </button>
      </div>

      <div class="siyu-modal-actions" style="margin-top:16px;">
        <button class="siyu-mini-btn" data-act="close-modal">取消</button>
      </div>
    </div>
  `;
}

  async function addStickerGroup() {
    const name = prompt("请输入分组名称", "新分组");
    if (!name) return;

    const count = await db.stickerGroups.count();

    const id = await db.stickerGroups.add({
      name: String(name).trim() || "新分组",
      order: count + 1,
      createdAt: Date.now()
    });

    state.currentStickerGroupId = id;
    await refreshStickerGroupsOnly();
    await refreshStickerGrid();
  }

  async function deleteStickerGroup() {
    const groups = await db.stickerGroups.toArray();

    if (groups.length <= 1) {
      toast("至少保留一个分组");
      return;
    }

    if (!confirm("确定删除当前分组及其下所有表情包吗？")) return;

    const id = Number(state.currentStickerGroupId);

    await db.transaction("rw", db.stickerGroups, db.stickers, async () => {
      await db.stickers.where("groupId").equals(id).delete();
      await db.stickerGroups.delete(id);
    });

    const rest = await db.stickerGroups.orderBy("order").toArray();
    state.currentStickerGroupId = rest[0] ? rest[0].id : null;

    await refreshStickerGroupsOnly();
    await refreshStickerGrid();

    toast("分组已删除");
  }

  async function renderFavorites() {
    setTabsVisible(false);
    setHeader("收藏", "随当前人设切换", {
      back: true,
      backAct: "back-me"
    });

    const user = currentUser();

    main.innerHTML = `
      <div class="siyu-scroll">
        <div class="siyu-empty">
          当前人设：${esc(user ? user.name : "未选择")}<br>
          收藏入口已预留，后续会接入聊天消息收藏。
        </div>
      </div>
    `;
  }

  async function renderDiary() {
    setTabsVisible(false);
    setHeader("日记", "入口预留", {
      back: true,
      backAct: "back-me"
    });

    main.innerHTML = `
      <div class="siyu-scroll">
        <div class="siyu-empty">日记页面先做入口，后续可以接入按人设区分的日记本。</div>
      </div>
    `;
  }

  async function onClick(e) {
    const btn = e.target.closest("[data-act]");
    if (!btn || !layer.contains(btn)) return;

    const act = btn.dataset.act;
    const id = btn.dataset.id;

    if (act === "close") {
      closeSiyu();
      return;
    }

    if (act === "back-tab") {
      await renderTab(state.tab);
      return;
    }

    if (act === "back-chat") {
      await renderTab("chat");
      return;
    }

    if (act === "back-me") {
      await renderTab("me");
      return;
    }

    if (act === "new-chat") {
  showNewChatModal();
  return;
}

if (act === "new-single") {
  closeModal();
  await renderSinglePicker();
  return;
}

if (act === "new-group") {
  closeModal();
  toast("群聊功能即将上线，敬请期待");
  return;
}

    if (act === "create-single") {
      await createSingle(Number(id));
      return;
    }

    if (act === "open-chat") {
      await openChat(Number(id));
      return;
    }

    if (act === "send") {
      await sendUserMessage();
      return;
    }

    if (act === "get-reply") {
      await getAIReply();
      return;
    }

    if (act === "tools") {
      toast("工具栏入口已预留");
      return;
    }

    if (act === "chat-detail") {
      toast("聊天详情入口已预留");
      return;
    }

    if (act === "stickers") {
      await renderStickers();
      return;
    }

    if (act === "favorites") {
      await renderFavorites();
      return;
    }

    if (act === "diary") {
      await renderDiary();
      return;
    }

    if (act === "add-sticker-group") {
      await addStickerGroup();
      return;
    }

    if (act === "switch-sticker-group") {
      state.currentStickerGroupId = Number(id);
      await refreshStickerGroupsOnly();
      await refreshStickerGrid();
      return;
    }

    if (act === "upload-sticker") {
      await uploadStickerSingle();
      return;
    }

    if (act === "batch-upload-sticker") {
      await uploadStickerBatch();
      return;
    }

    if (act === "url-sticker") {
      await importStickerURL();
      return;
    }

    if (act === "paste-sticker") {
      showBatchPasteModal();
      return;
    }

    if (act === "confirm-paste-sticker") {
      await confirmBatchPaste();
      return;
    }

    if (act === "close-modal") {
      closeModal();
      return;
    }

    if (act === "delete-sticker-group") {
      await deleteStickerGroup();
      return;
    }
    
    if (act === "close-sticker-modal") {
  closeStickerModal();
  return;
}
  }

  async function onChange(e) {
    if (e.target && e.target.id === "siyuUserSelect") {
      const id = Number(e.target.value || 0);
      state.currentUserId = id || null;
      await setState("currentUserId", state.currentUserId);
      await renderMe();
    }
  }

  async function onInput(e) {
    // 预留：之后如果要做搜索、草稿保存，可以在这里增量处理
  }

  async function onTabClick(e) {
    const btn = e.target.closest(".siyu-tab");
    if (!btn) return;

    const tab = btn.dataset.tab;
    if (!tab || tab === state.tab && state.view === "tab") return;

    await renderTab(tab);
  }

  document.addEventListener("keydown", async e => {
    if (!layer || !layer.classList.contains("show")) return;

    const input = main && main.querySelector("#siyuInput");

    if (input && document.activeElement === input && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await sendUserMessage();
    }

    if (e.key === "Escape") {
      if (modalMask && modalMask.classList.contains("show")) {
        closeModal();
      } else {
        closeSiyu();
      }
    }
  });

  function bindTabsOnce() {
    if (!tabs || tabs.dataset.bound === "1") return;
    tabs.dataset.bound = "1";
    tabs.addEventListener("click", onTabClick);
  }

  const oldOpen = window.NarrativePhone && window.NarrativePhone.openSiyu;

  window.NarrativePhone = window.NarrativePhone || {};
  window.NarrativePhone.openSiyu = async function () {
    await openSiyu();
    bindTabsOnce();

    if (typeof oldOpen === "function") {
      try {
        oldOpen();
      } catch (_) {}
    }
  };

  window.addEventListener("appopen", async e => {
    if (!e.detail || e.detail.id !== "siyu") return;
    await window.NarrativePhone.openSiyu();
  });
})();