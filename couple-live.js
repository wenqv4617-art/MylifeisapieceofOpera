/* ================================================================
 * couple-live.js - Couple Space Live Broadcast Extension
 * Theme: Tech Black & White, No Emojis, High Internet Slang (网感)
 * ================================================================ */

(function () {
  "use strict";

  console.log("▲ Couple Live Extension Loaded");

  /* ------------ SVG Icon Assets (Clean Path, B&W Only) ------------ */
  const ICONS = {
    screen: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="13" rx="2" ry="2"/><line x1="12" y1="20" x2="12" y2="15"/><line x1="8" y1="20" x2="16" y2="20"/><circle cx="12" cy="8" r="2"/></svg>',
    users: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
    send: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
    back: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>'
  };

  /* ------------ Local Internet Slang Pools (Fallback & Slang Engine) ------------ */
  const BARRAGE_TEMPLATES = [
    "KSWL KSWL CP IS REAL!",
    "SWEETNESS OVERLOAD DETECTED.",
    "MARRIAGE REGISTRY OFFICE MOVED TO THIS ROOM.",
    "ARE YOU TWO ACTUALLY DATING?",
    "THE TENSION IS SO REAL.",
    "PRESENTER YOU ARE DOING GREAT.",
    "COULD YOU BE ANY MORE OBVIOUS?",
    "TSUNDERE MODE ACTIVE.",
    "LOUDER FOR THE PEOPLE IN THE BACK.",
    "PLEASE NEVER BREAK UP.",
    "I LIVE FOR THIS CONTENT.",
    "CP FANS OVERJOYED TO NIGHT.",
    "THIS IS HIGH DEFINITION CHEMISTRY."
  ];

  const SYSTEM_DONORS = ["STREAM_SPY", "CP_WATCHER", "LU_XUN_FAN", "TECH_MONSTER", "WHITE_NOISE"];
  const SYSTEM_FOLLOWERS = ["CYBER_PUNK_9", "NEO_FANATIC", "ASCII_SOLDIER", "NULL_POINTER", "X_VIBRATION"];

  const DEFAULT_PMS = {
    char: [
      { id: "pm_c1", sender: "CYBER_STALKER", content: "Is your partner always this demanding? I think you deserve better. Let us know the truth.", replies: [] },
      { id: "pm_c2", sender: "CP_INVESTOR_99", content: "Please read this comment out loud on your stream! We raised 5000 units just to see you blush.", replies: [] },
      { id: "pm_c3", sender: "GLITCH_IN_MATRIX", content: "That TS-Style response was perfect. Are you actually simulated or is this genuine affection?", replies: [] }
    ],
    user: [
      { id: "pm_u1", sender: "DOUBTING_THOMAS", content: "Honestly, the sweet talk feels like a script. Convince us this isn't for views.", replies: [] },
      { id: "pm_u2", sender: "MOM_FAN_CLAN", content: "We noticed they looked tired today. Are you taking care of them properly behind the scenes?", replies: [] },
      { id: "pm_u3", sender: "BINARY_SWEETNESS", content: "The way they looked at you today was legendary. Please stream longer tomorrow!", replies: [] }
    ]
  };

  const DEFAULT_FANGROUP_MESSAGES = [
    { sender: "CP_CHRONICLES", text: "THE STREAM TODAY WAS ABSOLUTELY INSANE." },
    { sender: "STREAM_ARCHIVER", text: "Anyone recorded the 15-minute mark? The eye contact was out of this world." },
    { sender: "VOID_GLANCE", text: "I can confirm, they are not acting. That reaction is 100% natural." }
  ];

  /* ------------ State & Storage Helpers ------------ */
  async function getLiveConfig(convId) {
    const DB = window.DB;
    if (!DB) return null;
    const config = await DB.getSetting("couple_live_config_" + convId);
    if (config) return config;

    const defaultCfg = {
      enabled: false,
      minBarrage: 2,
      maxBarrage: 5,
      followers: 1024,
      totalDonations: 0,
      contributions: [
        { name: "CYBER_DONOR", amount: 1000, message: "PRODUCING THE BEST SHOW ON EARTH" },
        { name: "CP_BELIEVER", amount: 500, message: "MINIMALIST SWEETNESS IS THE KEY" }
      ],
      worldbookIds: [],
      pmList: JSON.parse(JSON.stringify(DEFAULT_PMS)),
      fanGroupChat: JSON.parse(JSON.stringify(DEFAULT_FANGROUP_MESSAGES))
    };
    await DB.setSetting("couple_live_config_" + convId, defaultCfg);
    return defaultCfg;
  }

  async function saveLiveConfig(convId, config) {
    const DB = window.DB;
    if (DB) {
      await DB.setSetting("couple_live_config_" + convId, config);
    }
  }

  /* ------------ UI Creation ------------ */
  function ensureLivePage() {
    let page = document.getElementById("page-couple-live");
    if (page) return page;

    page = document.createElement("div");
    page.id = "page-couple-live";
    page.className = "page";
    page.innerHTML = `
      <div class="chat-header live-header">
        <div class="chat-header-left">
          <button class="back-btn clickable" id="liveBackBtn">${ICONS.back}</button>
          <h2 class="live-title">LIVE MODULE</h2>
        </div>
        <div class="header-actions"></div>
      </div>
      <div class="live-scroll" id="liveScroll"></div>
    `;

    const appMain = document.querySelector(".app-main");
    if (appMain) appMain.appendChild(page);
    else document.body.appendChild(page);

    page.querySelector("#liveBackBtn").addEventListener("click", () => {
      if (window.switchPage) window.switchPage("couple-space");
    });

    return page;
  }

  /* ------------ Render Module Dashboard ------------ */
  async function renderLiveDashboard(convId) {
    const page = ensureLivePage();
    const container = page.querySelector("#liveScroll");
    const config = await getLiveConfig(convId);
    if (!config) return;

    container.innerHTML = `
      <!-- Control Panel -->
      <div class="live-panel-box">
        <div class="live-panel-title">CONTROL PANEL</div>
        
        <div class="live-row">
          <span class="live-label">LIVE SYSTEM SW</span>
          <button class="live-switch-btn ${config.enabled ? 'on' : 'off'}" id="liveSwitchBtn">
            ${config.enabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div class="live-row">
          <span class="live-label">BARRAGE COUNT (MIN / MAX)</span>
          <div class="live-range-ctrl">
            <input type="number" id="liveMinBarrage" class="live-input-num" min="1" max="15" value="${config.minBarrage}">
            <span class="live-separator">/</span>
            <input type="number" id="liveMaxBarrage" class="live-input-num" min="1" max="15" value="${config.maxBarrage}">
          </div>
        </div>

        <div class="live-stats-row">
          <div class="live-stat-card">
            <div class="live-stat-num" id="liveFollowerCount">${config.followers}</div>
            <div class="live-stat-label">SUBSCRIBERS</div>
          </div>
          <div class="live-stat-card">
            <div class="live-stat-num" id="liveTotalDonations">¥${config.totalDonations}</div>
            <div class="live-stat-label">DONATIONS</div>
          </div>
        </div>

        <!-- Leaderboard -->
        <div class="live-rank-box">
          <div class="live-sub-title">DONATION LEADERBOARD</div>
          <div class="live-rank-list" id="liveRankList">
            ${config.contributions.map((c, i) => `
              <div class="live-rank-item">
                <span class="live-rank-index">${i + 1}</span>
                <span class="live-rank-name">${c.name}</span>
                <span class="live-rank-msg">${c.message}</span>
                <span class="live-rank-amount">¥${c.amount}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Mounted Worldbooks -->
        <div class="live-wb-box">
          <div class="live-sub-title">MOUNTED WORLDBOOKS (LIVE ONLY)</div>
          <div id="liveWbContainer" class="live-wb-container"></div>
        </div>
      </div>

      <!-- Fan Channels -->
      <div class="live-panel-box" style="margin-top: 14px;">
        <div class="live-panel-title">FAN CHANNELS</div>
        
        <!-- Sticky Fan Group -->
        <div class="live-fan-group-card clickable" id="liveFanGroupBtn">
          <div class="live-fan-icon">${ICONS.users}</div>
          <div class="live-fan-info">
            <div class="live-fan-name">CP FAN CLUB GROUP</div>
            <div class="live-fan-desc">Active Stream Spectators & Supporters</div>
          </div>
          <div class="live-fan-go">${ICONS.arrow}</div>
        </div>

        <!-- PM Inbox Toggles -->
        <div class="live-tabs">
          <button class="live-tab active" id="liveTabChar">CHAR PM BOX</button>
          <button class="live-tab" id="liveTabUser">USER PM BOX</button>
        </div>

        <div class="live-inbox-list" id="liveInboxList"></div>
      </div>
    `;

    bindDashboardEvents(convId, config);
    await renderLiveWorldbooks(convId, config);
    renderInboxList(convId, config, "char");
  }

  /* ------------ Dashboard Events Handlers ------------ */
  function bindDashboardEvents(convId, config) {
    const page = ensureLivePage();

    // Toggle Switch
    const switchBtn = page.querySelector("#liveSwitchBtn");
    switchBtn.addEventListener("click", async () => {
      config.enabled = !config.enabled;
      switchBtn.className = `live-switch-btn ${config.enabled ? 'on' : 'off'}`;
      switchBtn.textContent = config.enabled ? 'ON' : 'OFF';
      await saveLiveConfig(convId, config);
    });

    // Min Barrage
    const minInput = page.querySelector("#liveMinBarrage");
    minInput.addEventListener("change", async () => {
      const val = parseInt(minInput.value) || 2;
      config.minBarrage = Math.min(val, config.maxBarrage);
      minInput.value = config.minBarrage;
      await saveLiveConfig(convId, config);
    });

    // Max Barrage
    const maxInput = page.querySelector("#liveMaxBarrage");
    maxInput.addEventListener("change", async () => {
      const val = parseInt(maxInput.value) || 5;
      config.maxBarrage = Math.max(val, config.minBarrage);
      maxInput.value = config.maxBarrage;
      await saveLiveConfig(convId, config);
    });

    // Fan Group Navigation
    page.querySelector("#liveFanGroupBtn").addEventListener("click", () => {
      openFanGroup(convId);
    });

    // PM Toggles
    const charTab = page.querySelector("#liveTabChar");
    const userTab = page.querySelector("#liveTabUser");

    charTab.addEventListener("click", () => {
      charTab.classList.add("active");
      userTab.classList.remove("active");
      renderInboxList(convId, config, "char");
    });

    userTab.addEventListener("click", () => {
      userTab.classList.add("active");
      charTab.classList.remove("active");
      renderInboxList(convId, config, "user");
    });
  }

  /* ------------ Render Mounted Worldbooks Grouped ------------ */
  async function renderLiveWorldbooks(convId, config) {
    const DB = window.DB;
    if (!DB) return;
    const allWorldbooks = await DB.getAll("worldbooks");
    const container = document.getElementById("liveWbContainer");
    if (!container) return;

    if (allWorldbooks.length === 0) {
      container.innerHTML = `<div class="live-empty-text">NO WORLDBOOKS AVAILABLE</div>`;
      return;
    }

    const groups = {};
    allWorldbooks.forEach(wb => {
      const g = wb.group || "UNGROUPED";
      if (!groups[g]) groups[g] = [];
      groups[g].push(wb);
    });

    container.innerHTML = Object.keys(groups).map(gName => `
      <div class="live-wb-group">
        <div class="live-wb-group-title">${gName}</div>
        ${groups[gName].map(wb => {
          const checked = (config.worldbookIds || []).includes(wb.id) ? 'checked' : '';
          return `
            <label class="live-wb-checkbox-label">
              <input type="checkbox" value="${wb.id}" ${checked} data-wb-id="${wb.id}">
              <span class="live-wb-title-span">${wb.title}</span>
            </label>
          `;
        }).join("")}
      </div>
    `).join("");

    container.querySelectorAll("input[type='checkbox']").forEach(cb => {
      cb.addEventListener("change", async () => {
        const wbId = cb.dataset.wbId;
        if (cb.checked) {
          if (!config.worldbookIds.includes(wbId)) config.worldbookIds.push(wbId);
        } else {
          config.worldbookIds = config.worldbookIds.filter(id => id !== wbId);
        }
        await saveLiveConfig(convId, config);
      });
    });
  }

  /* ------------ Render PM Inbox List ------------ */
  function renderInboxList(convId, config, inboxType) {
    const container = document.getElementById("liveInboxList");
    if (!container) return;
    const list = config.pmList[inboxType] || [];

    if (list.length === 0) {
      container.innerHTML = `<div class="live-empty-text">INBOX EMPTY</div>`;
      return;
    }

    container.innerHTML = list.map(pm => {
      const isReplied = pm.replies.length > 0;
      return `
        <div class="live-pm-item clickable" data-pm-id="${pm.id}">
          <div class="live-pm-row">
            <span class="live-pm-sender">@${pm.sender}</span>
            <span class="live-pm-status ${isReplied ? 'replied' : 'pending'}">
              ${isReplied ? 'REPLIED' : 'UNREAD'}
            </span>
          </div>
          <div class="live-pm-preview">${pm.content}</div>
        </div>
      `;
    }).join("");

    container.querySelectorAll(".live-pm-item").forEach(item => {
      item.addEventListener("click", () => {
        openPMDetail(convId, inboxType, item.dataset.pmId);
      });
    });
  }

  /* ------------ Fan Club Group Interface ------------ */
  function ensureFanGroupPage() {
    let page = document.getElementById("page-couple-live-fangroup");
    if (page) return page;

    page = document.createElement("div");
    page.id = "page-couple-live-fangroup";
    page.className = "page";
    page.innerHTML = `
      <div class="chat-header live-header">
        <div class="chat-header-left">
          <button class="back-btn clickable" id="fgBackBtn">${ICONS.back}</button>
          <h2 class="live-title">FAN CLUB CHAT</h2>
        </div>
      </div>
      <div class="live-fg-messages" id="liveFgMessages"></div>
      <div class="live-fg-input-row">
        <input type="text" id="liveFgInput" placeholder="ENTER MESSAGE..." autocomplete="off">
        <button id="liveFgSendBtn" class="live-fg-icon-btn">${ICONS.send}</button>
      </div>
    `;

    const appMain = document.querySelector(".app-main");
    if (appMain) appMain.appendChild(page);
    else document.body.appendChild(page);

    page.querySelector("#fgBackBtn").addEventListener("click", () => {
      if (window.switchPage) window.switchPage("couple-live");
    });

    return page;
  }

  async function openFanGroup(convId) {
    const page = ensureFanGroupPage();
    const config = await getLiveConfig(convId);
    if (!config) return;

    if (window.switchPage) window.switchPage("couple-live-fangroup");

    const msgContainer = page.querySelector("#liveFgMessages");
    const input = page.querySelector("#liveFgInput");
    const sendBtn = page.querySelector("#liveFgSendBtn");

    const renderMsgs = () => {
      msgContainer.innerHTML = config.fanGroupChat.map(m => `
        <div class="live-fg-msg-row">
          <span class="live-fg-msg-sender">@${m.sender}:</span>
          <span class="live-fg-msg-text">${m.text}</span>
        </div>
      `).join("");
      msgContainer.scrollTop = msgContainer.scrollHeight;
    };

    renderMsgs();

    const handleSend = async () => {
      const txt = input.value.trim();
      if (!txt) return;

      config.fanGroupChat.push({ sender: "YOU", text: txt });
      input.value = "";
      renderMsgs();

      setTimeout(async () => {
        const reactions = await generateFanGroupReactions(convId, txt);
        reactions.forEach(r => config.fanGroupChat.push(r));
        await saveLiveConfig(convId, config);
        renderMsgs();
      }, 1000);
    };

    sendBtn.onclick = handleSend;
    input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };
  }

  async function generateFanGroupReactions(convId, userMsg) {
    const DB = window.DB;
    const conv = await DB.get("conversations", convId);
    const char = await DB.get("characters", conv?.charId);
    const mask = await DB.get("userProfiles", conv?.maskId);

    const charName = char?.name || "HOST";
    const userName = mask?.name || "CO-HOST";

    const prompt = `You are a group of hyperactive stream spectators in a fans' club group chat. 
Your hosts are the streaming couple: 【${charName}】 and 【${userName}】.
Your speaking style should be minimal, cold-tech style, using high "Internet slang" and netizen buzzwords (KSWL, CP IS REAL, TS-Style, Glitch, CP FANS, etc). 
DO NOT USE EMOJIS.

The co-host (User) just sent this message to the group chat: "${userMsg}".
Generate 2 distinct short netizen replies to simulate active group banter.
Format:
[NETIZEN_HANDLE_A]: reply content
[NETIZEN_HANDLE_B]: reply content`;

    try {
      if (window.callLLM) {
        if (window.recordApiPending) window.recordApiPending();
        const reply = await window.callLLM([{ role: "user", content: prompt }], { maxTokens: 150 });
        const lines = reply.split("\n").filter(l => l.includes(":"));
        if (lines.length > 0) {
          return lines.map(line => {
            const parts = line.split(":");
            const sender = parts[0].replace(/[\[\]]/g, "").trim();
            const text = parts.slice(1).join(":").trim();
            return { sender, text };
          });
        }
      }
    } catch (e) {
      console.warn("LLM fan-group synthesis failed, fallback applied.");
    }

    return [
      { sender: "CP_CHRONICLES", text: `HOLY CRAP, PRESENTER APART FROM THE SCRIPT SHE LITERALLY SAID: ${userMsg}` },
      { sender: "STREAM_STALKER", text: "THE TENSION HAS RISEN BY 500 UNITS. THIS GROUP CHAT IS PEAKING." }
    ];
  }

  /* ------------ Private Messages Details Interface ------------ */
  function ensurePMDetailPage() {
    let page = document.getElementById("page-couple-live-pmdetail");
    if (page) return page;

    page = document.createElement("div");
    page.id = "page-couple-live-pmdetail";
    page.className = "page";
    page.innerHTML = `
      <div class="chat-header live-header">
        <div class="chat-header-left">
          <button class="back-btn clickable" id="pmBackBtn">${ICONS.back}</button>
          <h2 class="live-title" id="pmDetailTitle">PRIVATE MESSAGE</h2>
        </div>
      </div>
      <div class="live-pm-detail-body">
        <div class="live-pm-orig-card">
          <div class="live-pm-orig-sender" id="pmOrigSender">@SENDER</div>
          <div class="live-pm-orig-text" id="pmOrigText">MSG CONTENT</div>
        </div>
        <div class="live-pm-thread" id="pmThread"></div>
      </div>
      <div class="live-pm-action-row" id="pmActionRow"></div>
    `;

    const appMain = document.querySelector(".app-main");
    if (appMain) appMain.appendChild(page);
    else document.body.appendChild(page);

    page.querySelector("#pmBackBtn").addEventListener("click", () => {
      if (window.switchPage) window.switchPage("couple-live");
    });

    return page;
  }

  async function openPMDetail(convId, inboxType, pmId) {
    const page = ensurePMDetailPage();
    const config = await getLiveConfig(convId);
    if (!config) return;

    const pm = config.pmList[inboxType].find(p => p.id === pmId);
    if (!pm) return;

    if (window.switchPage) window.switchPage("couple-live-pmdetail");

    page.querySelector("#pmOrigSender").textContent = `@${pm.sender}`;
    page.querySelector("#pmOrigText").textContent = pm.content;

    const threadContainer = page.querySelector("#pmThread");
    const actionRow = page.querySelector("#pmActionRow");

    const renderThread = () => {
      threadContainer.innerHTML = pm.replies.map(r => `
        <div class="live-pm-bubble-row ${r.sender === 'YOU' || r.sender === 'CHAR' ? 'self' : 'other'}">
          <div class="live-pm-bubble">
            <span class="live-pm-bubble-sender">@${r.sender}:</span>
            <span class="live-pm-bubble-text">${r.text}</span>
          </div>
        </div>
      `).join("");
      threadContainer.scrollTop = threadContainer.scrollHeight;
    };

    renderThread();

    if (inboxType === "char") {
      actionRow.innerHTML = `
        <button id="livePmGenReplyBtn" class="live-pm-btn-block">GENERATE CHAR'S RESPONSE</button>
      `;
      const genBtn = actionRow.querySelector("#livePmGenReplyBtn");
      genBtn.onclick = async () => {
        genBtn.disabled = true;
        genBtn.textContent = "GENERATING RESPONSE...";
        const replyTxt = await generateCharPMResponse(convId, pm.content);
        pm.replies.push({ sender: "CHAR", text: replyTxt });
        await saveLiveConfig(convId, config);
        renderThread();
        genBtn.style.display = "none";
      };
    } else {
      actionRow.innerHTML = `
        <div class="live-pm-reply-input-wrap">
          <input type="text" id="livePmUserInput" placeholder="REPLY AS USER..." autocomplete="off">
          <button id="livePmUserSendBtn" class="live-fg-icon-btn">${ICONS.send}</button>
        </div>
      `;
      const userInput = actionRow.querySelector("#livePmUserInput");
      const userSend = actionRow.querySelector("#livePmUserSendBtn");

      const handleUserReply = async () => {
        const txt = userInput.value.trim();
        if (!txt) return;

        pm.replies.push({ sender: "YOU", text: txt });
        userInput.value = "";
        renderThread();

        setTimeout(async () => {
          const followUp = await generateFanPMFollowUp(convId, pm.content, txt, pm.sender);
          pm.replies.push({ sender: pm.sender, text: followUp });
          await saveLiveConfig(convId, config);
          renderThread();
        }, 1000);
      };

      userSend.onclick = handleUserReply;
      userInput.onkeypress = (e) => { if (e.key === 'Enter') handleUserReply(); };
    }
  }

  async function generateCharPMResponse(convId, fanMsg) {
    const DB = window.DB;
    const conv = await DB.get("conversations", convId);
    const char = await DB.get("characters", conv?.charId);
    const charName = char?.name || "CHAR";
    const prompt = `You are playing 【${charName}】. You received a private message from a stream fan: "${fanMsg}".
Write a reply back to the fan matching your exact persona and tone. Keep it natural, slightly online-styled but highly in-character.
DO NOT USE EMOJIS. No bracketed action narration. Output the reply message text only.`;

    try {
      if (window.callLLM) {
        if (window.recordApiPending) window.recordApiPending();
        return await window.callLLM([{ role: "user", content: prompt }], { maxTokens: 150 });
      }
    } catch (e) {
      console.warn("LLM Char reply synthesis failed.");
    }
    return "Thank you for the message. We appreciate your support. Keep watching.";
  }

  async function generateFanPMFollowUp(convId, origMsg, userReply, fanSender) {
    const prompt = `You are stream fan @${fanSender}. You previously messaged the host: "${origMsg}".
The host just replied directly to you: "${userReply}".
Generate your excited, internet-slang styled direct follow-up message back. Keep it short.
DO NOT USE EMOJIS. Speak in minimal cyber slang.`;

    try {
      if (window.callLLM) {
        if (window.recordApiPending) window.recordApiPending();
        return await window.callLLM([{ role: "user", content: prompt }], { maxTokens: 100 });
      }
    } catch (e) {
      console.warn("LLM Fan follow-up failed.");
    }
    return "OH MY GOD REAL RESPONSE! SPREADING THE NEWS TO THE CLUB!";
  }

  /* ------------ Barrage/Danmaku Trigger Logic ------------ */
  async function triggerLiveBarrageFlow(convId, msg) {
    const config = await getLiveConfig(convId);
    if (!config || !config.enabled) return;

    const count = Math.floor(Math.random() * (config.maxBarrage - config.minBarrage + 1)) + config.minBarrage;
    if (count <= 0) return;

    const chatWindow = document.getElementById("convChatMessages");
    if (!chatWindow) return;

    let barrageWrap = chatWindow.querySelector(".cs-barrage-overlay");
    if (!barrageWrap) {
      barrageWrap = document.createElement("div");
      barrageWrap.className = "cs-barrage-overlay";
      chatWindow.appendChild(barrageWrap);
    }

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        createBarrageElement(barrageWrap, config, msg);
      }, i * 700);
    }
  }

  function createBarrageElement(container, config, msg) {
    const randType = Math.random();
    let text = "";
    let isSystem = false;

    if (randType < 0.1) {
      const user = SYSTEM_FOLLOWERS[Math.floor(Math.random() * SYSTEM_FOLLOWERS.length)];
      text = `>>> @${user} HAS INSCRIBED TO THE SYSTEM CHANNEL.`;
      isSystem = true;
      config.followers += 1;
      updateLiveDashboardStats(config);
    } else if (randType < 0.2) {
      const user = SYSTEM_DONORS[Math.floor(Math.random() * SYSTEM_DONORS.length)];
      const amount = [50, 100, 200, 500, 1000][Math.floor(Math.random() * 5)];
      const donationMessage = BARRAGE_TEMPLATES[Math.floor(Math.random() * BARRAGE_TEMPLATES.length)];
      text = `$$$ @${user} HAS GRANTED ¥${amount} : "${donationMessage}"`;
      isSystem = true;

      config.totalDonations += amount;
      
      const existing = config.contributions.find(c => c.name === user);
      if (existing) {
        existing.amount += amount;
        existing.message = donationMessage;
      } else {
        config.contributions.push({ name: user, amount, message: donationMessage });
      }
      config.contributions.sort((a, b) => b.amount - a.amount);
      updateLiveDashboardStats(config);
    } else {
      const rawText = BARRAGE_TEMPLATES[Math.floor(Math.random() * BARRAGE_TEMPLATES.length)];
      const users = [...SYSTEM_DONORS, ...SYSTEM_FOLLOWERS];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      text = `@${randomUser}: ${rawText}`;
    }

    const item = document.createElement("span");
    item.className = `cs-barrage-item ${isSystem ? 'system' : ''}`;
    item.textContent = text;

    const lane = Math.floor(Math.random() * 7);
    item.style.top = `${12 + lane * 13}%`;

    container.appendChild(item);

    setTimeout(() => {
      item.remove();
    }, 8100);
  }

  function updateLiveDashboardStats(config) {
    const fCount = document.getElementById("liveFollowerCount");
    const dCount = document.getElementById("liveTotalDonations");
    const rList = document.getElementById("liveRankList");

    if (fCount) fCount.textContent = config.followers;
    if (dCount) dCount.textContent = `¥${config.totalDonations}`;
    if (rList) {
      rList.innerHTML = config.contributions.map((c, i) => `
        <div class="live-rank-item">
          <span class="live-rank-index">${i + 1}</span>
          <span class="live-rank-name">${c.name}</span>
          <span class="live-rank-msg">${c.message}</span>
          <span class="live-rank-amount">¥${c.amount}</span>
        </div>
      `).join("");
    }
    const convId = window.currentConversationId || window._currentCoupleSpaceConvId;
    if (convId) saveLiveConfig(convId, config);
  }

  /* ------------ Global Routing Registration & Integration ------------ */
  function registerPagesToGlobal() {
    const livePage = ensureLivePage();
    const fgPage = ensureFanGroupPage();
    const pmPage = ensurePMDetailPage();

    if (window.pages) {
      window.pages["couple-live"] = livePage;
      window.pages["couple-live-fangroup"] = fgPage;
      window.pages["couple-live-pmdetail"] = pmPage;
      console.log("▲ Couple Live registered to global window.pages router map successfully");
    }
  }

  /* ------------ 显示与隐藏控制 (强力清除残留的 display: none) ------------ */
  function activatePage(id) {
    document.querySelectorAll(".page").forEach(p => {
      if (p.id === id) {
        p.classList.add("active");
        p.style.display = ""; // 强力清除可能因为其他模块重置而残留的 display: none 样式 [1]
        return;
      }
      p.classList.remove("active");
      const ds = p.style.display;
      if (ds && ds !== "none") p.style.display = "none";
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
  }

  /* ------------ switchPage 强力显示链 patch ------------ */
  function patchSwitchPage() {
    if (!window.switchPage || window.switchPage._livePatched) return;
    const originalSwitch = window.switchPage;

    window.switchPage = function (pageId) {
      if (pageId === "couple-live") {
        activatePage("page-couple-live");
        return;
      }
      if (pageId === "couple-live-fangroup") {
        activatePage("page-couple-live-fangroup");
        return;
      }
      if (pageId === "couple-live-pmdetail") {
        activatePage("page-couple-live-pmdetail");
        return;
      }

      return originalSwitch.apply(this, arguments);
    };
    window.switchPage._livePatched = true;
  }

  async function openLiveDashboard(convId) {
    await renderLiveDashboard(convId);
    registerPagesToGlobal(); 
    if (window.switchPage) window.switchPage("couple-live");
  }

  /* ------------ Hooking into System Events ------------ */
  function bootstrap() {
    registerPagesToGlobal();
    patchSwitchPage();

    if (window.DB && window.DB.put) {
      const origPut = window.DB.put;
      window.DB.put = async function (store, obj) {
        const res = await origPut.apply(this, arguments);
        if (store === "chats" && obj.conversationId) {
          triggerLiveBarrageFlow(obj.conversationId, obj);
        }
        return res;
      };
    }
  }

  let checkAttempts = 0;
  const initInterval = setInterval(() => {
    if (window.coupleSpaceModule && window.DB && window.pages) {
      bootstrap();
      clearInterval(initInterval);
    } else if (++checkAttempts > 60) {
      clearInterval(initInterval);
    }
  }, 100);

  window.coupleLiveModule = {
    open: openLiveDashboard,
    isLiveActive: async (convId) => {
      const config = await getLiveConfig(convId);
      return config && config.enabled;
    }
  };
})();