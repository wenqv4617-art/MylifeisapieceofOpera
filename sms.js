/* ========== Haloes SMS / Email (Gmail Layout) Module ========== */
(function() {
    "use strict";

    // 通用 SVG 图标库 (不使用任何 emoji)
    const SVGS = {
        menu: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>`,
        compose: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`,
        back: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>`,
        inbox: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5v-3h3.56c.69 0 1.34.39 1.66 1 .49.92 1.46 1.5 2.53 1.5s2.04-.58 2.53-1.5c.32-.61.97-1 1.66-1H19v3zm0-5h-4.18c-.49.92-1.46 1.5-2.53 1.5s-2.04-.58-2.53-1.5H5V5h14v9z"/></svg>`,
        sent: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`,
        star: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`,
        settings: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`,
        feed: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 20h16v-2H4v2zm0-5h16v-2H4v2zm0-5h16V8H4v2zm0-6v2h16V4H4z"/></svg>`,
        add: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`,
        trash: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`,
        refresh: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>`,
        user: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>`
    };

    let activeAccount = null; 
    let currentFolder = 'primary'; // 'primary', 'sent', 'subs'
    let searchQuery = '';

    // ================== 初始化模块入口 ==================
    window.initSMSModule = function({ DB, showStatus, escapeHtml, callLLM, switchPage, getActiveMask }) {
        
        async function init() {
            console.log('📬 SMS/Email 模块加载成功');
            await ensureDefaultAccount();
            await checkPeriodicalSubscriptions();
            renderInbox();
        }

        // 确保面具在数据库里至少有一个对应的短信默认邮箱账号
        async function ensureDefaultAccount() {
            const mask = await getActiveMask();
            if (!mask) return;

            const accounts = await DB.getAll('smsAccounts');
            const hasDefault = accounts.some(a => a.maskId === mask.id && a.isDefault);

            if (!hasDefault) {
                const defaultEmail = {
                    id: 'acct_def_' + mask.id,
                    maskId: mask.id,
                    name: mask.name,
                    address: pinyin(mask.name) + '@haloes.mail',
                    isDefault: true,
                    createdAt: Date.now()
                };
                await DB.put('smsAccounts', defaultEmail);
            }

            // 获取或设置当前活动账户
            const savedActiveId = await DB.get('smsMeta', 'activeAccountId');
            if (savedActiveId && accounts.some(a => a.id === savedActiveId.value)) {
                activeAccount = await DB.get('smsAccounts', savedActiveId.value);
            } else {
                const maskAccounts = await DB.queryByIndex('smsAccounts', 'maskId', mask.id);
                activeAccount = maskAccounts.find(a => a.isDefault) || maskAccounts[0];
                if (activeAccount) {
                    await DB.put('smsMeta', { key: 'activeAccountId', value: activeAccount.id });
                }
            }
        }

        // ================== UI 视图渲染函数 ==================
        function renderInbox() {
            const shell = document.getElementById('smsShell');
            if (!shell) return;

            shell.innerHTML = `
                <div class="sms-search-bar">
                    <button class="sms-menu-btn" id="smsMenuBtn">${SVGS.menu}</button>
                    <input type="text" class="sms-search-input" id="smsSearchInput" placeholder="在邮件中搜索" value="${escapeHtml(searchQuery)}">
                    <div class="sms-profile-badge" id="smsProfileBadge" style="${activeAccount?.avatar ? `background-image:url('${activeAccount.avatar}')` : ''}">
                        ${activeAccount?.avatar ? '' : escapeHtml(activeAccount?.name?.charAt(0) || 'U')}
                    </div>
                </div>

                <div class="sms-folder-tabs">
                    <div class="sms-folder-tab ${currentFolder === 'primary' ? 'active' : ''}" data-folder="primary">
                        ${SVGS.inbox} <span>主要信箱</span>
                    </div>
                    <div class="sms-folder-tab ${currentFolder === 'sent' ? 'active' : ''}" data-folder="sent">
                        ${SVGS.sent} <span>已发送</span>
                    </div>
                    <div class="sms-folder-tab ${currentFolder === 'subs' ? 'active' : ''}" data-folder="subs">
                        ${SVGS.feed} <span>订阅号</span>
                    </div>
                </div>

                <div class="sms-mail-list" id="smsMailList">
                    <div style="text-align:center; padding:40px; color:#5f6368;">邮件加载中...</div>
                </div>

                <button class="sms-compose-fab" id="smsComposeFab">
                    ${SVGS.compose} <span>撰写</span>
                </button>

                <!-- 滑动抽屉菜单 -->
                <div class="sms-drawer-overlay" id="smsDrawerOverlay">
                    <div class="sms-drawer">
                        <div class="sms-drawer-header">
                            <div class="sms-drawer-title">Haloes Mail</div>
                            <div class="sms-account-selector-box">
                                <div class="sms-sender-avatar" style="${activeAccount?.avatar ? `background-image:url('${activeAccount.avatar}');` : ''} width:32px; height:32px; font-size:12px; margin-right:8px;">
                                    ${activeAccount?.avatar ? '' : escapeHtml(activeAccount?.name?.charAt(0) || 'U')}
                                </div>
                                <div style="flex:1; min-width:0;">
                                    <div style="font-size:13px; font-weight:500; color:#202124; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(activeAccount?.name)}</div>
                                    <div style="font-size:11px; color:#5f6368; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(activeAccount?.address)}</div>
                                </div>
                            </div>
                        </div>
                        <div class="sms-drawer-menu">
                            <div class="sms-drawer-item ${currentFolder==='primary'?'active':''}" data-action="folder" data-val="primary">${SVGS.inbox} 主要</div>
                            <div class="sms-drawer-item ${currentFolder==='sent'?'active':''}" data-action="folder" data-val="sent">${SVGS.sent} 已发送</div>
                            <div class="sms-drawer-item ${currentFolder==='subs'?'active':''}" data-action="folder" data-val="subs">${SVGS.feed} 订阅号</div>
                            <hr style="border:none; border-top:1px solid #dadce0; margin:8px 0;">
                            <div class="sms-drawer-item" data-action="alias-mgr">${SVGS.user} 邮箱小号管理</div>
                            <div class="sms-drawer-item" data-action="sub-mgr">${SVGS.star} 订阅号设置</div>
                            <div class="sms-drawer-item" data-action="exit">${SVGS.back} 返回桌面</div>
                        </div>
                    </div>
                </div>
            `;

            // 异步载入信箱
            loadMailList();

            // 监听事件
            document.getElementById('smsMenuBtn').addEventListener('click', toggleDrawer);
            document.getElementById('smsDrawerOverlay').addEventListener('click', function(e) {
                if(e.target === this) toggleDrawer();
            });

            document.getElementById('smsSearchInput').addEventListener('input', function(e) {
                searchQuery = e.target.value.toLowerCase().trim();
                loadMailList();
            });

            document.getElementById('smsProfileBadge').addEventListener('click', () => {
                openAliasManager();
            });

            document.getElementById('smsComposeFab').addEventListener('click', openCompose);

            document.querySelectorAll('.sms-folder-tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    currentFolder = this.dataset.folder;
                    renderInbox();
                });
            });

            document.querySelectorAll('.sms-drawer-item').forEach(item => {
                item.addEventListener('click', async function() {
                    const action = this.dataset.action;
                    if (action === 'folder') {
                        currentFolder = this.dataset.val;
                        toggleDrawer();
                        renderInbox();
                    } else if (action === 'alias-mgr') {
                        toggleDrawer();
                        openAliasManager();
                    } else if (action === 'sub-mgr') {
                        toggleDrawer();
                        openSubscriptionManager();
                    } else if (action === 'exit') {
                        switchPage('desktop');
                    }
                });
            });
        }

        function toggleDrawer() {
            const overlay = document.getElementById('smsDrawerOverlay');
            if (overlay) overlay.classList.toggle('active');
        }

        // ================== 信箱列表核心逻辑 ==================
        async function loadMailList() {
            const listEl = document.getElementById('smsMailList');
            if (!listEl) return;

            if (!activeAccount) {
                listEl.innerHTML = `<div style="text-align:center; padding:40px; color:#5f6368;">暂无可用邮箱。</div>`;
                return;
            }

            const threads = await DB.queryByIndex('smsThreads', 'accountId', activeAccount.id);
            let displayThreads = [];

            if (currentFolder === 'subs') {
                // 筛选出订阅号类的 Thread
                displayThreads = threads.filter(t => t.isSubscription);
            } else if (currentFolder === 'sent') {
                // 筛选出包含我发件的 Thread
                displayThreads = threads.filter(t => !t.isSubscription);
            } else {
                // 主要收件箱
                displayThreads = threads.filter(t => !t.isSubscription);
            }

            // 获取最新消息概要
            const enrichedThreads = [];
            for (const t of displayThreads) {
                const msgs = await DB.queryByIndex('smsMessages', 'threadId', t.id);
                msgs.sort((a,b) => b.timestamp - a.timestamp);
                
                if (msgs.length > 0) {
                    const lastMsg = msgs[0];
                    enrichedThreads.push({
                        thread: t,
                        lastMsg: lastMsg,
                        timestamp: lastMsg.timestamp
                    });
                }
            }

            // 按最后往来时间降序
            enrichedThreads.sort((a, b) => b.timestamp - a.timestamp);

            // 搜索过滤
            let filtered = enrichedThreads;
            if (searchQuery) {
                filtered = enrichedThreads.filter(et => {
                    const subj = et.thread.subject.toLowerCase();
                    const body = et.lastMsg.body.toLowerCase();
                    const sender = et.lastMsg.senderName.toLowerCase();
                    return subj.includes(searchQuery) || body.includes(searchQuery) || sender.includes(searchQuery);
                });
            }

            if (filtered.length === 0) {
                listEl.innerHTML = `<div style="text-align:center; padding:40px; color:#5f6368; font-size:14px;">没有邮件。</div>`;
                return;
            }

            let html = '';
            filtered.forEach(et => {
                const t = et.thread;
                const m = et.lastMsg;
                const isUnread = t.unread && m.isReceived;
                const dateStr = formatCompactTime(m.timestamp);
                const initial = m.senderName ? m.senderName.charAt(0) : '?';
                const disguiseLabel = t.disguised ? `<span class="sms-mail-badge-disguise">陌生人</span>` : '';

                html += `
                    <div class="sms-mail-item ${isUnread ? 'unread' : ''}" data-thread-id="${t.id}">
                        <div class="sms-sender-avatar" style="background-color: ${getAvatarColor(m.senderName)}">
                            ${escapeHtml(initial)}
                        </div>
                        <div class="sms-mail-content">
                            <div class="sms-mail-meta">
                                <span class="sms-mail-sender">${escapeHtml(m.senderName)} ${disguiseLabel}</span>
                                <span class="sms-mail-time">${dateStr}</span>
                            </div>
                            <div class="sms-mail-subject">${escapeHtml(t.subject)}</div>
                            <div class="sms-mail-snippet">${escapeHtml(m.body.substring(0, 45))}</div>
                        </div>
                    </div>
                `;
            });

            listEl.innerHTML = html;

            listEl.querySelectorAll('.sms-mail-item').forEach(el => {
                el.addEventListener('click', () => {
                    openThreadDetail(el.dataset.threadId);
                });
            });
        }

        // ================== 邮件详情页 ==================
        async function openThreadDetail(threadId) {
            const thread = await DB.get('smsThreads', threadId);
            if (!thread) return;

            // 设为已读
            thread.unread = false;
            await DB.put('smsThreads', thread);

            const shell = document.getElementById('smsShell');
            if (!shell) return;

            const msgs = await DB.queryByIndex('smsMessages', 'threadId', thread.id);
            msgs.sort((a,b) => a.timestamp - b.timestamp);

            let msgCardsHtml = '';
            msgs.forEach((m, idx) => {
                const isLast = idx === msgs.length - 1;
                const dateStr = new Date(m.timestamp).toLocaleString('zh-CN', {month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit'});
                const initial = m.senderName ? m.senderName.charAt(0) : '?';
                
                msgCardsHtml += `
                    <div class="sms-message-card ${!isLast ? 'collapsed' : ''}" data-msg-idx="${idx}">
                        <div class="sms-message-card-header">
                            <div class="sms-sender-avatar" style="background-color: ${getAvatarColor(m.senderName)}; width:32px; height:32px; font-size:14px; margin-right:12px;">
                                ${escapeHtml(initial)}
                            </div>
                            <div class="sms-message-card-sender-info">
                                <span class="sms-message-card-sender-name">${escapeHtml(m.senderName)}</span>
                                <span class="sms-message-card-sender-addr">&lt;${escapeHtml(m.senderAddress)}&gt;</span>
                            </div>
                            <span class="sms-message-card-time">${dateStr}</span>
                        </div>
                        <div class="sms-message-card-body">${escapeHtml(m.body)}</div>
                    </div>
                `;
            });

            shell.innerHTML = `
                <div class="sms-detail-view">
                    <div class="sms-detail-header">
                        <button class="sms-menu-btn" id="smsDetailBackBtn">${SVGS.back}</button>
                        <h2>${escapeHtml(thread.subject)}</h2>
                        <button class="sms-menu-btn" id="smsDetailDeleteBtn">${SVGS.trash}</button>
                    </div>
                    <div class="sms-detail-body">
                        <div class="sms-thread-subject">${escapeHtml(thread.subject)}</div>
                        ${msgCardsHtml}
                    </div>
                    ${!thread.isSubscription ? `
                    <div class="sms-reply-box">
                        <textarea class="sms-reply-textarea" id="smsReplyInput" placeholder="回复电子邮件" maxlength="1500"></textarea>
                        <div class="sms-reply-actions">
                            <button class="sms-btn-send" id="smsReplySendBtn">
                                ${SVGS.sent} <span>发送</span>
                            </button>
                        </div>
                    </div>
                    ` : ''}
                </div>
            `;

            document.getElementById('smsDetailBackBtn').addEventListener('click', () => {
                renderInbox();
            });

            document.getElementById('smsDetailDeleteBtn').addEventListener('click', async () => {
                if(confirm('删除此对话？')) {
                    const messages = await DB.queryByIndex('smsMessages', 'threadId', thread.id);
                    for (const m of messages) {
                        await DB.delete('smsMessages', m.id);
                    }
                    await DB.delete('smsThreads', thread.id);
                    showStatus('邮件已删除', 'info');
                    renderInbox();
                }
            });

            // 折叠展开折叠板
            shell.querySelectorAll('.sms-message-card').forEach(card => {
                card.querySelector('.sms-message-card-header').addEventListener('click', () => {
                    card.classList.toggle('collapsed');
                });
            });

            // 回信事件
            const sendBtn = document.getElementById('smsReplySendBtn');
            if (sendBtn) {
                sendBtn.addEventListener('click', async () => {
                    const bodyEl = document.getElementById('smsReplyInput');
                    const text = bodyEl.value.trim();
                    if (!text) return;

                    bodyEl.value = '';
                    sendBtn.disabled = true;
                    sendBtn.textContent = '正在发送...';

                    await handleReplyMail(thread, text);
                    openThreadDetail(thread.id);
                });
            }
        }

        // ================== 回信处理与 LLM 生成 ==================
        async function handleReplyMail(thread, text) {
            const peerId = thread.peerKey; // 如果是已知联系人则是 charId，伪装则是个性串

            // 1. 保存用户的回信
            const userMsg = {
                id: 'msg_' + Date.now(),
                threadId: thread.id,
                senderName: activeAccount.name,
                senderAddress: activeAccount.address,
                body: text,
                timestamp: Date.now(),
                isReceived: false
            };
            await DB.put('smsMessages', userMsg);

            // 更新 Thread 状态
            thread.unread = false;
            await DB.put('smsThreads', thread);

            // 2. 调度 AI 生成回信
            try {
                let systemPrompt = '';
                const msgs = await DB.queryByIndex('smsMessages', 'threadId', thread.id);
                msgs.sort((a,b) => a.timestamp - b.timestamp);

                const trueMask = await getActiveMask(); // 获取真实面具名字，传授给 AI 作穿透判读

                if (thread.disguised) {
                    // 伪装模式
                    const realChar = await DB.get('characters', thread.disguisedCharId);
                    systemPrompt = `
                        你当前是伪装状态。
                        你的秘密真实身份是：【${realChar?.name}】。
                        目前你正在使用假名及地址：【${thread.subject}】<${thread.peerKey}@stranger.mail> 给用户发邮件。
                        你在邮件中呈现的假身份特点是：稍微神秘，不会轻易暴露真实姓名。
                        
                        用户当前的真实面具主身份是：【${trueMask?.name}】。
                        用户目前对你发送的邮箱写信账户名字是：【${activeAccount.name}】（邮箱：${activeAccount.address}）。
                        
                        你需要在回信中：
                        1. 模拟该陌生人假面具进行回复，语气要符合你们邮件的语境。
                        2. 仔细检查用户发送的内容或使用的写信账户名。如果发现：
                           - 用户写信名【${activeAccount.name}】与用户真实面具名【${trueMask?.name}】极为接近（例如"白舟"和"小白"）；
                           - 或者用户写信时透露了和【${realChar?.name}】熟稔的秘密/细节。
                           你可以在本次或接下来的回信中展示“推导和怀疑”。你可以选择：
                           - A. 试探对方是不是【${trueMask?.name}】；
                           - B. 带着怀疑的态度调侃“你写信的语气真的很像我认识的一个叫${trueMask?.name}的人呢”；
                           - C. 如果穿透度极高，你可以直接爽朗地揭穿，并向对方揭示你自己的真实身份是【${realChar?.name}】。
                        
                        严格要求：
                        - 不要使用任何 Emoji 符号。
                        - 保持一封规整的电子邮件格式，包括招呼、正文、落款，不要带有Markdown多余标记。
                    `;
                } else {
                    // 已知联系人模式
                    const realChar = await DB.get('characters', thread.peerKey);
                    systemPrompt = `
                        你是【${realChar?.name}】。你收到了一封电子邮件。
                        发件人（用户的别名账户）：【${activeAccount.name}】（邮箱地址：${activeAccount.address}）。
                        用户的全局真实面具主身份是：【${trueMask?.name}】。
                        
                        你与用户的角色关系和性格设定：
                        ${realChar?.detail || '朋友关系。'}
                        
                        你需要在回信中：
                        1. 保持你原本的人设说话风格，但要符合电子邮件（稍微比微信聊天正式一丁点，但仍富有个性）的格式。
                        2. 仔细分析用户的这个写信别名账户【${activeAccount.name}】以及写信内容：
                           - 如果这并不是你熟悉的【${trueMask?.name}】名字，而是一个陌生或奇怪的小号（如：小白、Anonymous），你必须在心中做出推导：这个写信风格、透露的相处秘密，或者名字的拼音相似度，是不是就是【${trueMask?.name}】在捉弄/试探你？
                           - 如果发现了端倪，可以在信中直接穿透揭露，例如：“好啦，小白。虽然你的发信地址是 anonymous，但你一开口我就知道是白舟了。下次记得换个语气~”。
                           - 如果完全没有破绽，就将对方当作普通陌生人或对应的别名进行礼貌但保持距离的普通邮件回复。
                        
                        严格要求：
                        - 不要使用任何 Emoji 符号。
                        - 保持规整的电子邮件格式，不要附带任何微信聊天式气泡描写。
                    `;
                }

                // 组装对话上下文
                const promptMessages = [{role: 'system', content: systemPrompt}];
                msgs.forEach(m => {
                    const r = m.isReceived ? 'assistant' : 'user';
                    promptMessages.push({role: r, content: `发信人: ${m.senderName}\n正文: ${m.body}`});
                });

                showStatus('对方正在写回信...', 'info');
                const replyText = await callLLM(promptMessages);

                const aiSenderName = thread.disguised ? thread.subject : (await DB.get('characters', thread.peerKey))?.name || '未知';
                const aiSenderAddr = thread.disguised ? `${thread.peerKey}@stranger.mail` : `${thread.peerKey}@haloes.mail`;

                const aiMsg = {
                    id: 'msg_' + Date.now(),
                    threadId: thread.id,
                    senderName: aiSenderName,
                    senderAddress: aiSenderAddr,
                    body: replyText,
                    timestamp: Date.now(),
                    isReceived: true
                };

                await DB.put('smsMessages', aiMsg);
                
                thread.unread = true;
                await DB.put('smsThreads', thread);
                showStatus('收到一封新邮件', 'success');

            } catch (e) {
                showStatus('发送失败: ' + e.message, 'error');
            }
        }

        // ================== 撰写新邮件页 ==================
        async function openCompose() {
            const shell = document.getElementById('smsShell');
            if (!shell) return;

            const chars = await DB.getAll('characters');
            const accounts = await DB.getAll('smsAccounts');

            let toOptions = chars.map(c => `<option value="${c.id}">${escapeHtml(c.name)} &lt;${c.id}@haloes.mail&gt;</option>`).join('');
            toOptions += `<option value="random" class="sms-random-char-option">随机漂流瓶 (未知陌生人邮件)</option>`;

            const fromOptions = accounts.map(a => `<option value="${a.id}" ${a.id === activeAccount.id ? 'selected' : ''}>${escapeHtml(a.name)} &lt;${escapeHtml(a.address)}&gt;</option>`).join('');

            shell.innerHTML = `
                <div class="sms-compose-view">
                    <div class="sms-detail-header">
                        <button class="sms-menu-btn" id="smsComposeBackBtn">${SVGS.back}</button>
                        <h2>撰写邮件</h2>
                        <button class="sms-menu-btn" id="smsComposeSendBtn" style="color:#1a73e8;">${SVGS.sent}</button>
                    </div>
                    <div class="sms-compose-fields">
                        <div class="sms-compose-row">
                            <span class="sms-compose-label">发件人：</span>
                            <select class="sms-compose-select" id="smsComposeFrom">
                                ${fromOptions}
                            </select>
                        </div>
                        <div class="sms-compose-row">
                            <span class="sms-compose-label">收件人：</span>
                            <select class="sms-compose-select" id="smsComposeTo">
                                ${toOptions}
                            </select>
                        </div>
                        <div class="sms-compose-row">
                            <span class="sms-compose-label">主题：</span>
                            <input type="text" class="sms-compose-input" id="smsComposeSubject" placeholder="输入邮件主题" maxlength="150">
                        </div>
                        <textarea class="sms-compose-body" id="smsComposeBody" placeholder="撰写电子邮件内容..." maxlength="3000"></textarea>
                    </div>
                </div>
            `;

            document.getElementById('smsComposeBackBtn').addEventListener('click', () => {
                renderInbox();
            });

            document.getElementById('smsComposeSendBtn').addEventListener('click', async function() {
                const fromId = document.getElementById('smsComposeFrom').value;
                const toVal = document.getElementById('smsComposeTo').value;
                const subject = document.getElementById('smsComposeSubject').value.trim() || '无主题';
                const body = document.getElementById('smsComposeBody').value.trim();

                if (!body) {
                    alert('请输入信件正文内容');
                    return;
                }

                this.disabled = true;
                this.textContent = '正在发送...';

                // 更新活跃账号
                activeAccount = await DB.get('smsAccounts', fromId);
                await DB.put('smsMeta', { key: 'activeAccountId', value: fromId });

                let threadId = 'thread_' + Date.now();
                let peerKey = toVal;
                let disguised = false;
                let disguisedCharId = '';

                if (toVal === 'random') {
                    // 陌生人漂流
                    const randomChar = chars[Math.floor(Math.random() * chars.length)];
                    disguised = true;
                    disguisedCharId = randomChar ? randomChar.id : '';
                    peerKey = 'stranger_' + Math.random().toString(36).substring(2, 8);
                }

                const newThread = {
                    id: threadId,
                    maskId: activeAccount.maskId,
                    accountId: activeAccount.id,
                    peerKey: peerKey,
                    subject: subject,
                    isSubscription: false,
                    disguised: disguised,
                    disguisedCharId: disguisedCharId,
                    unread: false,
                    createdAt: Date.now()
                };

                await DB.put('smsThreads', newThread);
                await handleReplyMail(newThread, body);
                renderInbox();
            });
        }

        // ================== 小号（别名）管理器 ==================
        async function openAliasManager() {
            const shell = document.getElementById('smsShell');
            if (!shell) return;

            const mask = await getActiveMask();
            const accounts = await DB.queryByIndex('smsAccounts', 'maskId', mask.id);

            let aliasHtml = '';
            accounts.forEach(a => {
                const isDef = a.isDefault;
                aliasHtml += `
                    <div class="sms-alias-item">
                        <div class="sms-alias-info">
                            <div class="sms-alias-name">${escapeHtml(a.name)} ${isDef ? '<span class="sms-mail-badge-disguise" style="color:#1a73e8; background:#e8f0fe;">主号</span>' : ''}</div>
                            <div class="sms-alias-addr">${escapeHtml(a.address)}</div>
                        </div>
                        <div style="display:flex; gap:8px;">
                            ${!isDef ? `
                                <button class="sms-btn-sm primary use-alias-btn" data-id="${a.id}">使用</button>
                                <button class="sms-btn-sm danger del-alias-btn" data-id="${a.id}">删除</button>
                            ` : `<button class="sms-btn-sm use-alias-btn" data-id="${a.id}" disabled style="opacity:0.5;">使用中</button>`}
                        </div>
                    </div>
                `;
            });

            shell.innerHTML = `
                <div class="sms-compose-view">
                    <div class="sms-detail-header">
                        <button class="sms-menu-btn" id="smsAliasBackBtn">${SVGS.back}</button>
                        <h2>邮箱小号(别名)管理</h2>
                    </div>
                    <div style="flex:1; overflow-y:auto; padding:16px;">
                        <div style="font-size:13px; color:#5f6368; margin-bottom:16px;">
                            你的身份在 SMS 内部跟随当前面具【${escapeHtml(mask.name)}】。为了试探对方，你可以多创建几个不同的邮箱别名（小号）写信。对方有可能会识破。
                        </div>
                        <div class="sms-sub-card" style="margin-bottom:20px;">
                            <div class="sms-sub-title" style="margin-bottom:12px;">🌟 新建邮箱别名</div>
                            <div class="sms-compose-row" style="padding:4px 0;">
                                <span class="sms-compose-label">姓名：</span>
                                <input type="text" class="sms-compose-input" id="newAliasName" placeholder="例如：小白">
                            </div>
                            <div class="sms-compose-row" style="padding:4px 0;">
                                <span class="sms-compose-label">邮箱：</span>
                                <input type="text" class="sms-compose-input" id="newAliasAddr" placeholder="例如：xiaobai">
                                <span style="color:#5f6368; font-size:14px; margin-left:4px;">@haloes.mail</span>
                            </div>
                            <div style="display:flex; justify-content:flex-end; margin-top:12px;">
                                <button class="sms-btn-sm primary" id="smsCreateAliasBtn">创建并切换</button>
                            </div>
                        </div>

                        <div class="sms-sub-title" style="margin-bottom:12px;">📋 已有账户</div>
                        ${aliasHtml}
                    </div>
                </div>
            `;

            document.getElementById('smsAliasBackBtn').addEventListener('click', () => {
                renderInbox();
            });

            document.getElementById('smsCreateAliasBtn').addEventListener('click', async () => {
                const name = document.getElementById('newAliasName').value.trim();
                const prefix = document.getElementById('newAliasAddr').value.trim().toLowerCase();

                if(!name || !prefix) {
                    alert('请完整填写姓名及邮箱前缀');
                    return;
                }

                if(!/^[a-z0-9_]{3,15}$/.test(prefix)) {
                    alert('邮箱前缀需为3-15位字母、数字或下划线组成');
                    return;
                }

                const allAccts = await DB.getAll('smsAccounts');
                const fullAddr = prefix + '@haloes.mail';
                if(allAccts.some(a => a.address === fullAddr)) {
                    alert('此邮箱地址已被占用');
                    return;
                }

                const newAcct = {
                    id: 'acct_' + Date.now(),
                    maskId: mask.id,
                    name: name,
                    address: fullAddr,
                    isDefault: false,
                    createdAt: Date.now()
                };

                await DB.put('smsAccounts', newAcct);
                activeAccount = newAcct;
                await DB.put('smsMeta', { key: 'activeAccountId', value: newAcct.id });

                showStatus('小号创建成功，已自动切换', 'success');
                openAliasManager();
            });

            shell.querySelectorAll('.use-alias-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const acctId = btn.dataset.id;
                    activeAccount = await DB.get('smsAccounts', acctId);
                    await DB.put('smsMeta', { key: 'activeAccountId', value: acctId });
                    showStatus(`已切换为账户: ${activeAccount.name}`, 'success');
                    openAliasManager();
                });
            });

            shell.querySelectorAll('.del-alias-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const acctId = btn.dataset.id;
                    if(confirm('删除此小号？关联的邮件也将永久清除！')) {
                        const threads = await DB.queryByIndex('smsThreads', 'accountId', acctId);
                        for(const t of threads) {
                            const msgs = await DB.queryByIndex('smsMessages', 'threadId', t.id);
                            for(const m of msgs) await DB.delete('smsMessages', m.id);
                            await DB.delete('smsThreads', t.id);
                        }
                        await DB.delete('smsAccounts', acctId);
                        
                        // 强制切回默认
                        const maskAccts = await DB.queryByIndex('smsAccounts', 'maskId', mask.id);
                        activeAccount = maskAccts.find(a => a.isDefault) || maskAccts[0];
                        await DB.put('smsMeta', { key: 'activeAccountId', value: activeAccount.id });

                        showStatus('小号已删除', 'info');
                        openAliasManager();
                    }
                });
            });
        }

        // ================== 订阅号管理器 ==================
        async function openSubscriptionManager() {
            const shell = document.getElementById('smsShell');
            if (!shell) return;

            const mask = await getActiveMask();
            const subs = await DB.getAll('smsSubs');
            
            // 筛选出属于当前面具的订阅
            const userSubs = subs.filter(s => s.maskId === mask.id && !s.isCharSub);
            const charSubs = subs.filter(s => s.isCharSub); // 系统/Char推送

            let userSubsHtml = '';
            userSubs.forEach(s => {
                userSubsHtml += `
                    <div class="sms-sub-card">
                        <div class="sms-sub-header">
                            <span class="sms-sub-title">📡 ${escapeHtml(s.name)}</span>
                            <span class="sms-sub-freq">频率: ${s.frequency === '0' ? '手动' : s.frequency + '小时'}</span>
                        </div>
                        <div class="sms-sub-desc">${escapeHtml(s.description)}</div>
                        <div class="sms-sub-actions">
                            <button class="sms-btn-sm trigger-sub-btn" data-id="${s.id}">立刻推送一条</button>
                            <button class="sms-btn-sm danger del-sub-btn" data-id="${s.id}">退订</button>
                        </div>
                    </div>
                `;
            });

            let charSubsHtml = '';
            charSubs.forEach(s => {
                charSubsHtml += `
                    <div class="sms-sub-card">
                        <div class="sms-sub-header">
                            <span class="sms-sub-title">📰 ${escapeHtml(s.name)}</span>
                            <span class="sms-sub-freq">官方订阅号</span>
                        </div>
                        <div class="sms-sub-desc">${escapeHtml(s.description)}</div>
                        <div class="sms-sub-actions">
                            <button class="sms-btn-sm primary trigger-sub-btn" data-id="${s.id}">索要推送</button>
                        </div>
                    </div>
                `;
            });

            // 获取世界书作为订阅号上下文挂载
            const wbs = await DB.getAll('worldbooks');
            const wbOptions = wbs.map(w => `<option value="${w.id}">${escapeHtml(w.title)}</option>`).join('');

            shell.innerHTML = `
                <div class="sms-compose-view">
                    <div class="sms-detail-header">
                        <button class="sms-menu-btn" id="smsSubBackBtn">${SVGS.back}</button>
                        <h2>订阅号推送系统</h2>
                    </div>
                    <div style="flex:1; overflow-y:auto; padding:16px;">
                        
                        <div class="sms-sub-card" style="margin-bottom:20px; background:#f8f9fa;">
                            <div class="sms-sub-title" style="margin-bottom:12px;">✨ 创建自定义订阅号</div>
                            <div class="sms-compose-row" style="padding:4px 0;">
                                <span class="sms-compose-label">名称：</span>
                                <input type="text" class="sms-compose-input" id="newSubName" placeholder="例如：星际日报">
                            </div>
                            <div class="sms-compose-row" style="padding:4px 0;">
                                <span class="sms-compose-label">内容：</span>
                                <input type="text" class="sms-compose-input" id="newSubDesc" placeholder="设定此订阅号主要推送什么，例如：赛博废土八卦">
                            </div>
                            <div class="sms-compose-row" style="padding:4px 0;">
                                <span class="sms-compose-label">世界书：</span>
                                <select class="sms-compose-select" id="newSubWb">
                                    <option value="">(无世界书挂载)</option>
                                    ${wbOptions}
                                </select>
                            </div>
                            <div class="sms-compose-row" style="padding:4px 0;">
                                <span class="sms-compose-label">频率：</span>
                                <select class="sms-compose-select" id="newSubFreq">
                                    <option value="0">完全手动推送</option>
                                    <option value="1">每 1 小时自动推送</option>
                                    <option value="6">每 6 小时自动推送</option>
                                    <option value="24">每日推送</option>
                                </select>
                            </div>
                            <div style="display:flex; justify-content:flex-end; margin-top:12px;">
                                <button class="sms-btn-sm primary" id="smsCreateSubBtn">创建订阅号</button>
                            </div>
                        </div>

                        <div class="sms-sub-title" style="margin-bottom:12px;">📋 我的自定义订阅</div>
                        ${userSubsHtml || '<div style="color:#5f6368; font-size:13px; margin-bottom:16px;">暂无自定义订阅。</div>'}

                        <div class="sms-sub-title" style="margin-bottom:12px; margin-top:20px;">📰 推荐联系人订阅号</div>
                        ${charSubsHtml}
                    </div>
                </div>
            `;

            document.getElementById('smsSubBackBtn').addEventListener('click', () => {
                renderInbox();
            });

            // 创建自定义订阅
            document.getElementById('smsCreateSubBtn').addEventListener('click', async () => {
                const name = document.getElementById('newSubName').value.trim();
                const desc = document.getElementById('newSubDesc').value.trim();
                const wbId = document.getElementById('newSubWb').value;
                const freq = document.getElementById('newSubFreq').value;

                if (!name || !desc) {
                    alert('请填写名称及描述');
                    return;
                }

                const newSub = {
                    id: 'sub_' + Date.now(),
                    maskId: mask.id,
                    accountId: activeAccount.id,
                    name: name,
                    description: desc,
                    frequency: freq,
                    worldbookId: wbId,
                    isCharSub: false,
                    lastPushed: Date.now()
                };

                await DB.put('smsSubs', newSub);
                showStatus('成功创建订阅号: ' + name, 'success');
                openSubscriptionManager();
            });

            // 一键推送
            shell.querySelectorAll('.trigger-sub-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const subId = btn.dataset.id;
                    btn.disabled = true;
                    btn.textContent = '正在推送...';
                    await triggerSubscriptionPush(subId);
                    openSubscriptionManager();
                });
            });

            // 退订
            shell.querySelectorAll('.del-sub-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const subId = btn.dataset.id;
                    if(confirm('取消订阅这个频道？')) {
                        await DB.delete('smsSubs', subId);
                        showStatus('已取消订阅', 'info');
                        openSubscriptionManager();
                    }
                });
            });

            // 初始化自带联系人推送号
            await ensureBuiltinCharSubscriptions();
        }

        // ================== 系统内置联系人订阅号建立 ==================
        async function ensureBuiltinCharSubscriptions() {
            const chars = await DB.getAll('characters');
            if (chars.length === 0) return;

            const subs = await DB.getAll('smsSubs');
            for(const c of chars) {
                const subId = 'sub_char_' + c.id;
                if(!subs.some(s => s.id === subId)) {
                    const charSub = {
                        id: subId,
                        name: `${c.name}的个人日志`,
                        description: `由联系人【${c.name}】维护的专属日志，推送TA的日常感想与思考。`,
                        frequency: '0', 
                        isCharSub: true,
                        charId: c.id,
                        lastPushed: 0
                    };
                    await DB.put('smsSubs', charSub);
                }
            }
        }

        // ================== 触发订阅号 LLM 自动生成内容 ==================
        async function triggerSubscriptionPush(subId) {
            const sub = await DB.get('smsSubs', subId);
            if (!sub) return;

            let systemPrompt = '';
            let userPrompt = '';

            if (sub.isCharSub) {
                // Char 的订阅号
                const c = await DB.get('characters', sub.charId);
                systemPrompt = `
                    你是【${c?.name}】。你正在为自己的专属订阅号/播客撰写一篇文章或随笔。
                    你的人设背景是：\n${c?.detail || '普通人。'}
                    请撰写一篇富有个性的日常见闻文章，题目自拟，可以提及你的专业工作、个人喜好或小吐槽。
                    
                    格式要求：
                    - 严禁使用任何 Emoji 符号。
                    - 必须是独立的信件/推文风格。
                `;
                userPrompt = `请撰写最新一期《${sub.name}》正文内容。`;
            } else {
                // 自定义订阅号
                let wbContext = '';
                if(sub.worldbookId) {
                    const wb = await DB.get('worldbooks', sub.worldbookId);
                    if(wb) wbContext = `世界书背景参考：\n${wb.content}`;
                }

                systemPrompt = `
                    你现在是一个订阅号生成器。
                    这个订阅号的名字叫做：【${sub.name}】。
                    它的主要内容类型是：【${sub.description}】。
                    ${wbContext}
                    
                    你的任务是：
                    生成一期内容精湛、排版规整（包含标题、引言和多段内容）的文章。
                    
                    格式要求：
                    - 严禁使用任何 Emoji 符号。
                    - 不需要包含外部任何 Markdown 代码块，直接返回纯文本。
                `;
                userPrompt = `请生成一期《${sub.name}》的专属最新期刊内容。`;
            }

            try {
                showStatus(`正在抓取并生成 ${sub.name} 的更新...`, 'info');
                recordApiPending();
                const contentText = await callLLM([
                    {role: 'system', content: systemPrompt},
                    {role: 'user', content: userPrompt}
                ]);

                // 准备 Thread 和 Message
                const threadId = 'sub_th_' + sub.id + '_' + Date.now();
                const newThread = {
                    id: threadId,
                    maskId: sub.maskId || (await getActiveMask())?.id,
                    accountId: activeAccount?.id,
                    peerKey: sub.id,
                    subject: `[期刊] ${sub.name} 最新更新`,
                    isSubscription: true,
                    unread: true,
                    createdAt: Date.now()
                };

                const newMsg = {
                    id: 'msg_' + Date.now(),
                    threadId: threadId,
                    senderName: sub.name,
                    senderAddress: `${sub.id}@subscription.haloes`,
                    body: contentText,
                    timestamp: Date.now(),
                    isReceived: true
                };

                await DB.put('smsThreads', newThread);
                await DB.put('smsMessages', newMsg);

                sub.lastPushed = Date.now();
                await DB.put('smsSubs', sub);

                showStatus(`📰 订阅号 ${sub.name} 已送达`, 'success');

            } catch (e) {
                showStatus('生成失败: ' + e.message, 'error');
            }
        }

        // ================== 订阅号周期定时检查 ==================
        async function checkPeriodicalSubscriptions() {
            const subs = await DB.getAll('smsSubs');
            const now = Date.now();

            for (const s of subs) {
                if (s.frequency && s.frequency !== '0') {
                    const intervalMs = parseInt(s.frequency) * 60 * 60 * 1000;
                    const elapsed = now - (s.lastPushed || 0);
                    if (elapsed >= intervalMs) {
                        console.log(`📡 周期订阅号触发自动推送: ${s.name}`);
                        // 异步静默触发
                        triggerSubscriptionPush(s.id).catch(err => {
                            console.warn('定时订阅推送失败', err);
                        });
                    }
                }
            }
        }

        // ================== 工具函数 ==================
        function pinyin(str) {
            // 轻量级简易拼音/首字母生成，保障邮箱前缀语义
            return str.split('').map(c => {
                const code = c.charCodeAt(0);
                if (code >= 19968 && code <= 40869) return String.fromCharCode(97 + (code % 26));
                return c.toLowerCase().replace(/[^a-z0-9]/g, '');
            }).join('').substring(0, 10);
        }

        function formatCompactTime(timestamp) {
            const d = new Date(timestamp);
            const now = new Date();
            if (d.toDateString() === now.toDateString()) {
                return d.toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit', hour12: false});
            }
            return d.toLocaleDateString('zh-CN', {month: 'numeric', day: 'numeric'});
        }

        // 绑定暴露
        window.smsModule = {
            init,
            openCompose,
            openAliasManager,
            openSubscriptionManager
        };

        init();
    };

})();