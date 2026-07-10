let currentChatTab = 'sessions';
let activeUserPersonaId = null; // 当前“我”的选择
let activeSessionId = null;

function initChatApp() {
  loadMyPersonas();
  renderChatTab();

  // 底层选项卡切换
  const tabs = document.querySelectorAll("#win-chat .chat-tabs .tab-item");
  tabs.forEach(tab => {
    tab.onclick = () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentChatTab = tab.getAttribute("data-chat-tab");
      
      document.querySelectorAll(".chat-tab-panel").forEach(p => p.classList.remove("active"));
      document.getElementById(`chat-tab-${currentChatTab}`).classList.add("active");

      // 微信“新建”按钮只在“对话”下展示
      document.getElementById("btn-new-chat").style.display = currentChatTab === 'sessions' ? 'flex' : 'none';

      renderChatTab();
    };
  });
}

// 渲染“我的人设”选择
async function loadMyPersonas() {
  const select = document.getElementById("me-persona-select");
  const users = await db.archives.where('type').equals('user').toArray();
  select.innerHTML = '<option value="">-- 选择我的人设 --</option>';
  users.forEach(u => {
    const opt = document.createElement("option");
    opt.value = u.id;
    opt.innerText = u.name;
    select.appendChild(opt);
  });

  // 读取上次选择
  activeUserPersonaId = localStorage.getItem("active_me_id");
  if (activeUserPersonaId) {
    select.value = activeUserPersonaId;
    updateMeHeader(Number(activeUserPersonaId));
  }

  select.onchange = (e) => {
    activeUserPersonaId = e.target.value;
    localStorage.setItem("active_me_id", activeUserPersonaId);
    updateMeHeader(Number(activeUserPersonaId));
    if (currentChatTab === 'sessions') renderChatTab();
  };
}

async function updateMeHeader(userId) {
  const user = await db.archives.get(userId);
  if (user) {
    document.getElementById("moment-user-name").innerText = user.name;
    document.getElementById("moment-user-avatar").src = user.avatar || "";
  }
}

// 渲染对应页签
async function renderChatTab() {
  if (currentChatTab === 'sessions') {
    renderSessionList();
  }
}

// 会话加载列表
async function renderSessionList() {
  const container = document.getElementById("session-list-container");
  container.innerHTML = "";
  if (!activeUserPersonaId) {
    container.innerHTML = `<p style="text-align:center;color:var(--text-secondary);font-size:13px;padding:40px 0;">请先到 “我的” 选项卡下选择我的人设！</p>`;
    return;
  }

  const list = await db.sessions.where('userId').equals(Number(activeUserPersonaId)).toArray();
  if (list.length === 0) {
    container.innerHTML = `<p style="text-align:center;color:var(--text-secondary);font-size:13px;padding:40px 0;">暂无会话，请点击右上角新建</p>`;
    return;
  }

  for (let s of list) {
    const char = await db.archives.get(s.charId);
    const lastMsg = await db.messages.where('sessionId').equals(s.id).reverse().sortBy('timestamp');
    const latestText = lastMsg[0] ? lastMsg[0].content : "暂无对话消息";
    const div = document.createElement("div");
    div.className = "session-item";
    div.onclick = () => openWeChatDialog(s.id);
    div.innerHTML = `
      <img class="session-avatar" src="${s.customCharAvatar || char?.avatar || ''}">
      <div class="session-detail">
        <div class="session-row">
          <span class="session-name">${s.customCharName || char?.name || '未知角色'}</span>
          <span class="session-time">10:20</span>
        </div>
        <div class="session-msg">${latestText}</div>
      </div>
    `;
    container.appendChild(div);
  }
}

// 发起单聊
document.getElementById("btn-new-chat").onclick = async () => {
  if (!activeUserPersonaId) { alert("请先去‘我的’中切换我的人设"); return; }
  const overlay = document.getElementById("new-chat-overlay");
  const list = document.getElementById("new-chat-list");
  list.innerHTML = "";

  const chars = await db.archives.where('type').anyOf(['character', 'npc']).toArray();
  chars.forEach(c => {
    const row = document.createElement("div");
    row.className = "menu-item";
    row.onclick = () => startSingleChat(c.id);
    row.innerHTML = `<span>${c.name} (${c.type})</span>`;
    list.appendChild(row);
  });

  overlay.classList.add("active");
};
document.getElementById("btn-close-new-chat").onclick = () => {
  document.getElementById("new-chat-overlay").classList.remove("active");
};

async function startSingleChat(charId) {
  document.getElementById("new-chat-overlay").classList.remove("active");
  
  // 查询是否已有此会话
  let sess = await db.sessions
    .where({ userId: Number(activeUserPersonaId), charId: Number(charId) })
    .first();
  
  if (!sess) {
    const char = await db.archives.get(charId);
    sess = {
      userId: Number(activeUserPersonaId),
      charId: Number(charId),
      customCharName: char.name,
      customCharAvatar: char.avatar,
      customCharPersona: char.persona,
      lastMessageTime: Date.now()
    };
    sess.id = await db.sessions.add(sess);
  }

  openWeChatDialog(sess.id);
}

// 展开聊天仿真页
async function openWeChatDialog(sessionId) {
  activeSessionId = sessionId;
  const sess = await db.sessions.get(sessionId);
  const char = await db.archives.get(sess.charId);
  
  document.getElementById("dialog-header-title").innerText = sess.customCharName || char.name;
  document.getElementById("chat-dialog-panel").classList.add("active");

  // 加载并渲染历史记录 (优化点：由于直接从 Dexie 流式排序读取，且单会话受索引限制，即使几十万条数据也不会导致进入卡顿)
  renderDialogMessages();
}

function closeChatDialog() {
  document.getElementById("chat-dialog-panel").classList.remove("active");
  renderSessionList();
}

async function renderDialogMessages() {
  const container = document.getElementById("dialog-messages-container");
  container.innerHTML = "";
  
  const msgs = await db.messages.where('sessionId').equals(activeSessionId).sortBy('timestamp');
  msgs.forEach(m => {
    appendMessageToDOM(m);
  });
  container.scrollTop = container.scrollHeight;
}

function appendMessageToDOM(msg) {
  const container = document.getElementById("dialog-messages-container");
  const bubble = document.createElement("div");
  bubble.className = `msg-bubble ${msg.senderType === 'user' ? 'self' : 'other'}`;
  
  let contentHtml = "";
  if (msg.contentType === 'image') {
    contentHtml = `<img src="${msg.content}" class="msg-img">`;
  } else {
    contentHtml = `<div class="msg-text">${msg.content}</div>`;
  }

  bubble.innerHTML = `
    <img class="msg-avatar" src="data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><circle cx='12' cy='12' r='12' fill='%23ccc'/></svg>">
    ${contentHtml}
  `;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

// 输入栏加号
document.getElementById("btn-chat-expand-toggle").onclick = () => {
  document.getElementById("chat-expand-panel").classList.toggle("active");
};

// 1. 上屏按钮（纯插入用户文字不触发 AI）
document.getElementById("btn-dialog-send").onclick = async () => {
  const text = document.getElementById("dialog-input-text").value.trim();
  if (!text) return;
  await saveAndRenderMessage('user', text);
  document.getElementById("dialog-input-text").value = "";
};

// 2. 获取回复按钮（核心逻辑：请求API并强制返回两句文字，触发“对方输入中...”动效）
document.getElementById("btn-dialog-reply").onclick = async () => {
  const header = document.getElementById("dialog-header-title");
  const originalTitle = header.innerText;
  
  // 1. 触发输入中动画效果
  header.classList.add("header-typing");

  try {
    // 获取全局 API 预设配置
    const presetId = localStorage.getItem("global_api_preset_id");
    if (!presetId) throw new Error("未配置全局默认 API");
    const api = await db.api_presets.get(Number(presetId));
    if (!api) throw new Error("全局 API 预设已被删除");

    // 获取当前上下文会话历史（最后10条就够，保护 Context）
    const history = await db.messages.where('sessionId').equals(activeSessionId).reverse().limit(10).toArray();
    history.reverse();
    
    // 构建标准的 AI Chat 请求结构
    const messagesToSend = [{ role: "system", content: "你正在扮演一个故事中的角色，请生成连续的、分两次发出的两段对话消息，段落之间用 [SPLIT] 隔开。不要一次性合成一整段。" }];
    history.forEach(h => {
      messagesToSend.push({ role: h.senderType === 'user' ? 'user' : 'assistant', content: h.content });
    });

    const response = await fetch(`${api.url}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${api.key}` },
      body: JSON.stringify({
        model: api.model,
        messages: messagesToSend,
        temperature: api.temperature
      })
    });
    const result = await response.json();
    let rawReply = result.choices[0].message.content;

    // AI 回复分割处理确保至少2句
    let parts = rawReply.split("[SPLIT]");
    if (parts.length < 2) {
      // 备用分割符逻辑
      parts = rawReply.split(/[\n\n]+/);
    }
    if (parts.length < 2) {
      // 兜底拆分
      parts = [rawReply.substring(0, rawReply.length/2), rawReply.substring(rawReply.length/2)];
    }

    // 第一句发出
    await saveAndRenderMessage('char', parts[0].trim());
    
    // 延迟 1.5 秒发出第二句
    setTimeout(async () => {
      await saveAndRenderMessage('char', parts[1].trim());
      header.classList.remove("header-typing");
      header.innerText = originalTitle;
    }, 1500);

  } catch (err) {
    console.error(err);
    alert("API连接异常，加载离线默认两段句");
    await saveAndRenderMessage('char', "你好，当前网络调试未通。");
    setTimeout(async () => {
      await saveAndRenderMessage('char', "这句是为你生成的第二句占位符。");
      header.classList.remove("header-typing");
      header.innerText = originalTitle;
    }, 1500);
  }
};

async function saveAndRenderMessage(senderType, content, contentType = 'text') {
  const msg = {
    sessionId: activeSessionId,
    senderType,
    senderId: senderType === 'user' ? Number(activeUserPersonaId) : 0,
    content,
    contentType,
    timestamp: Date.now()
  };
  msg.id = await db.messages.add(msg);
  appendMessageToDOM(msg);
}

// 朋友圈 “我的” 子级侧边路由
function openMeSub(target) {
  const panel = document.getElementById("me-sub-panel");
  const title = document.getElementById("me-sub-title");
  const body = document.getElementById("me-sub-body");
  const addBtn = document.getElementById("btn-me-sub-add");

  body.innerHTML = "";
  addBtn.style.display = "none";
  panel.classList.add("active");

  if (target === 'stickers') {
    title.innerText = "我的表情包";
    addBtn.style.display = "flex";
    loadStickersList();
    addBtn.onclick = () => uploadStickerTrigger();
  } else if (target === 'collection') {
    title.innerText = "收藏室";
    body.innerHTML = `<p style="padding:40px; text-align:center; color:var(--text-secondary);">暂无收藏记录</p>`;
  } else if (target === 'wallet') {
    title.innerText = "微信钱包";
    body.innerHTML = `<div style="padding:40px; text-align:center;"><div style="font-size:32px; font-weight:700; color:#1e293b;">￥ 88,888.00</div></div>`;
  }
}

function closeMeSub() {
  document.getElementById("me-sub-panel").classList.remove("active");
}

// 表情包共享持久化模块
async function loadStickersList() {
  const body = document.getElementById("me-sub-body");
  body.innerHTML = `<div class="sticker-grid" id="sticker-grid"></div>`;
  const grid = document.getElementById("sticker-grid");
  const list = await db.stickers.toArray();
  list.forEach(stk => {
    const item = document.createElement("div");
    item.className = "sticker-item";
    item.innerHTML = `<img src="${stk.imageUrl}">`;
    grid.appendChild(item);
  });
}

function uploadStickerTrigger() {
  const input = document.createElement("input");
  input.type = "file"; input.accept = "image/*";
  input.onchange = async (e) => {
    if (e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        await db.stickers.add({ imageUrl: ev.target.result });
        loadStickersList();
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  input.click();
}

// 对话单项配置详情侧滑打开
document.getElementById("btn-dialog-details").onclick = async () => {
  const sess = await db.sessions.get(activeSessionId);
  const char = await db.archives.get(sess.charId);

  document.getElementById("details-char-name").value = sess.customCharName || char.name;
  document.getElementById("details-char-persona").value = sess.customCharPersona || char.persona || "";
  document.getElementById("details-user-persona").value = sess.customUserPersona || "";
  
  document.getElementById("chat-details-panel").classList.add("active");
};

function closeChatDetails() {
  document.getElementById("chat-details-panel").classList.remove("active");
}

document.getElementById("btn-save-details").onclick = async () => {
  const name = document.getElementById("details-char-name").value.trim();
  const cPersona = document.getElementById("details-char-persona").value.trim();
  const uPersona = document.getElementById("details-user-persona").value.trim();

  await db.sessions.update(activeSessionId, {
    customCharName: name,
    customCharPersona: cPersona,
    customUserPersona: uPersona
  });

  alert("当前对话专属设定已保存。");
  closeChatDetails();
  document.getElementById("dialog-header-title").innerText = name;
};