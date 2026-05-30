/* ========== Haloes SMS / Email (Gmail Layout) Module ========== */
(function() {
    "use strict";

    // 原生高精度无 Emoji 矢量路径图标库
    const SVGS = {
        menu: `<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>`,
        compose: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`,
        back: `<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>`,
        inbox: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5v-3h3.56c.69 0 1.34.39 1.66 1 .49.92 1.46 1.5 2.53 1.5s2.04-.58 2.53-1.5c.32-.61.97-1 1.66-1H19v3zm0-5h-4.18c-.49.92-1.46 1.5-2.53 1.5s-2.04-.58-2.53-1.5H5V5h14v9z"/></svg>`,
        sent: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`,
        settings: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`,
        feed: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M4 20h16v-2H4v2zm0-5h16v-2H4v2zm0-5h16V8H4v2zm0-6v2h16V4H4z"/></svg>`,
        trash: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`,
        refresh: `<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>`,
        user: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>`,
        star: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`
    };

    let activeAccount = null; 
    let currentFolder = 'primary'; // 'primary', 'sent', 'subs'
    let searchQuery = '';

    window.initSMSModule = function({ DB, showStatus, escapeHtml, callLLM, switchPage, getActiveMask }) {
        
        async function init() {
            console.log('📬 SMS/Email 模块正常启动');
            await ensureDefaultAccount();
            await checkPeriodicalSubscriptions();
            renderInbox();
        }

        // 确保数据库中有该面具关联的默认账号
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

            const savedActiveId = await DB.get('smsMeta', 'activeAccountId');
            const freshAccounts = await DB.getAll('smsAccounts');
            
            if (savedActiveId && freshAccounts.some(a => a.id === savedActiveId.value)) {
                activeAccount = await DB.get('smsAccounts', savedActiveId.value);
            } else {
                const maskAccounts = await DB.queryByIndex('smsAccounts', 'maskId', mask.id);
                activeAccount = maskAccounts.find(a => a.isDefault) || maskAccounts[0];
                if (activeAccount) {
                    await DB.put('smsMeta', { key: 'activeAccountId', value: activeAccount.id });
                }
            }
        }

        // ================== 核心视图路由器 ==================
        function renderInbox() {
            const shell = document.getElementById('smsShell');
            if (!shell) return;

            shell.innerHTML = `
                <div class="sms-search-bar">
                    <button class="sms-menu-btn" id="smsInboxBackBtn">${SVGS.back}</button>
                    <button class="sms-menu-btn" id="smsMenuBtn">${SVGS.menu}</button>
                    <input type="text" class="sms-search-input" id="smsSearchInput" placeholder="在邮件中搜索" value="${escapeHtml(searchQuery)}">
                    <button class="sms-menu-btn" id="smsRefreshBtn" title="同步与收取邮件">${SVGS.refresh}</button>
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

            // 加载邮件列表
            loadMailList();

            // 1. 主页面返回键（返回桌面）
            document.getElementById('smsInboxBackBtn').addEventListener('click', () => {
                switchPage('desktop');
            });

            // 侧栏展开与隐藏
            document.getElementById('smsMenuBtn').addEventListener('click', toggleDrawer);
            document.getElementById('smsDrawerOverlay').addEventListener('click', function(e) {
                if(e.target === this) toggleDrawer();
            });

            // 主动收信（刷新）动作
            document.getElementById('smsRefreshBtn').addEventListener('click', async function() {
                this.style.transform = 'rotate(360deg)';
                this.style.transition = 'transform 0.6s ease';
                showStatus('正在收取新邮件与更新订阅...', 'info');
                await checkPeriodicalSubscriptions();
                await triggerIncomingProactiveEmail();
                await loadMailList();
                setTimeout(() => {
                    this.style.transform = 'none';
                    this.style.transition = 'none';
                }, 600);
            });

            // 搜索、头像、写信
            document.getElementById('smsSearchInput').addEventListener('input', function(e) {
                searchQuery = e.target.value.toLowerCase().trim();
                loadMailList();
            });

            document.getElementById('smsProfileBadge').addEventListener('click', () => {
                openAliasManager();
            });

            document.getElementById('smsComposeFab').addEventListener('click', openCompose);

            // Tab栏切换
            document.querySelectorAll('.sms-folder-tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    currentFolder = this.dataset.folder;
                    renderInbox();
                });
            });

            // 抽屉菜单项事件
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

        // ================== 获取邮件数据 ==================
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
                displayThreads = threads.filter(t => t.isSubscription);
            } else if (currentFolder === 'sent') {
                // Sent 文件夹中展现非订阅、且最后一条由我发出的线程
                displayThreads = threads.filter(t => !t.isSubscription);
            } else {
                displayThreads = threads.filter(t => !t.isSubscription);
            }

            const enrichedThreads = [];
            for (const t of displayThreads) {
                const msgs = await DB.queryByIndex('smsMessages', 'threadId', t.id);
                msgs.sort((a,b) => b.timestamp - a.timestamp);
                
                if (msgs.length > 0) {
                    const lastMsg = msgs[0];
                    // 在已发送文件夹里，过滤掉完全没有我回复的消息
                    if (currentFolder === 'sent' && lastMsg.isReceived) {
                        continue;
                    }
                    enrichedThreads.push({
                        thread: t,
                        lastMsg: lastMsg,
                        timestamp: lastMsg.timestamp
                    });
                }
            }

            enrichedThreads.sort((a, b) => b.timestamp - a.timestamp);

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
                                <span class="sms-mail-sender" style="${isUnread ? 'font-weight:700;' : ''}">${escapeHtml(m.senderName)} ${disguiseLabel}</span>
                                <span class="sms-mail-time" style="${isUnread ? 'color:#c5221f; font-weight:700;' : ''}">${dateStr}</span>
                            </div>
                            <div class="sms-mail-subject" style="${isUnread ? 'font-weight:700;' : ''}">${escapeHtml(t.subject)}</div>
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

            // 详情页返回键 -> 返回 Inbox
            document.getElementById('smsDetailBackBtn').addEventListener('click', () => {
                renderInbox();
            });

            // 删除线程
            document.getElementById('smsDetailDeleteBtn').addEventListener('click', async () => {
                if(confirm('确定永久删除此邮件往来对话吗？')) {
                    const messages = await DB.queryByIndex('smsMessages', 'threadId', thread.id);
                    for (const m of messages) {
                        await DB.delete('smsMessages', m.id);
                    }
                    await DB.delete('smsThreads', thread.id);
                    showStatus('邮件已删除', 'info');
                    renderInbox();
                }
            });

            // 消息折叠板交互
            shell.querySelectorAll('.sms-message-card').forEach(card => {
                card.querySelector('.sms-message-card-header').addEventListener('click', () => {
                    card.classList.toggle('collapsed');
                });
            });

            // 回信发送执行
            const sendBtn = document.getElementById('smsReplySendBtn');
            if (sendBtn) {
                sendBtn.addEventListener('click', async () => {
                    const bodyEl = document.getElementById('smsReplyInput');
                    const text = bodyEl.value.trim();
                    if (!text) return;

                    bodyEl.value = '';
                    sendBtn.disabled = true;
                    sendBtn.innerHTML = '正在发送...';

                    await handleReplyMail(thread, text);
                    openThreadDetail(thread.id);
                });
            }
        }

        // ================== 回信处理与 LLM 生成 ==================
        async function handleReplyMail(thread, text) {
            // 保存用户回信
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

            // 更新 Thread 时间与状态
            thread.unread = false;
            await DB.put('smsThreads', thread);

            try {
                let systemPrompt = '';
                const msgs = await DB.queryByIndex('smsMessages', 'threadId', thread.id);
                msgs.sort((a,b) => a.timestamp - b.timestamp);

                const trueMask = await getActiveMask();

                if (thread.disguised) {
                    const realChar = await DB.get('characters', thread.disguisedCharId);
                    systemPrompt = `
                        你当前是伪装状态。
                        你的真实身份是：【${realChar?.name || '一个已知联系人'}】。
                        目前你正在使用假名及地址：【${thread.subject}】<${thread.peerKey}@stranger.mail> 给用户写信。
                        你在邮件中呈现的陌生人性格：冷淡、神秘或带有试探。
                        
                        用户当前的全局真实名字是：【${trueMask?.name}】。
                        用户目前写信使用的账户名是：【${activeAccount.name}】（邮箱：${activeAccount.address}）。
                        
                        你需要在回信中：
                        1. 模拟陌生人与对方交流。
                        2. 穿透检测机制（极为重要）：
                           - 仔细对照用户写信的语气、写信时泄露的专属秘密、或是其使用的小号发信名字【${activeAccount.name}】。
                           - 如果名字拼音、文字透露的信息或熟人秘密非常明显，你应当在此轮回复中有所怀疑，并表达类似于“小白？是你吗？别装了，你的写信习惯我太熟悉了”这样的话，直接无情揭穿。
                           - 穿透机制被触发后，你应在后续部分完全变回【${realChar?.name}】的说话人设和语气跟其交流。
                           - 如果用户伪装得极好，没有破绽，则继续扮演陌生人。
                        
                        严格规则：
                        - 禁止使用任何 Emoji。
                        - 保持标准的邮件往来书面格式。
                    `;
                } else {
                    const realChar = await DB.get('characters', thread.peerKey);
                    systemPrompt = `
                        你是【${realChar?.name}】。
                        你收到了一封来自【${activeAccount.name}】<${activeAccount.address}> 的电子邮件。
                        用户的真实面具主名字是：【${trueMask?.name}】。
                        
                        你与用户的角色关系：
                        ${realChar?.detail || '熟人。'}
                        
                        你需要在回信中：
                        1. 保持你原本的人设说话风格，按照写信而非即时聊天的格式回复。
                        2. 穿透推导（高优先级）：
                           - 用户写信名【${activeAccount.name}】很可能是为了试探或捉弄你而设的小号别名（例如他用‘Anonymous’）。
                           - 如果他在写信时表现出只有你与【${trueMask?.name}】才知道的秘密/约定，或者名字很相似，请在信中果断地看穿并取笑他。
                           - 如果伪装无破绽，则以客气、疑惑但得体的态度回复。
                        
                        严格规则：
                        - 禁止使用任何 Emoji。
                        - 保持规范的书信格式。
                    `;
                }

                const promptMessages = [{role: 'system', content: systemPrompt}];
                msgs.forEach(m => {
                    const role = m.isReceived ? 'assistant' : 'user';
                    promptMessages.push({role: role, content: `发件人: ${m.senderName}\n内容: ${m.body}`});
                });

                showStatus('对方正在构思邮件回信...', 'info');
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
                showStatus('发送失败，请重试: ' + e.message, 'error');
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
                        <h2>撰写新邮件</h2>
                        <button class="sms-menu-btn" id="smsComposeSendBtn" style="color:#1a73e8;">${SVGS.sent}</button>
                    </div>
                    <div class="sms-compose-fields">
                        <div class="sms-compose-row">
                            <span class="sms-compose-label">从：</span>
                            <select class="sms-compose-select" id="smsComposeFrom">
                                ${fromOptions}
                            </select>
                        </div>
                        <div class="sms-compose-row">
                            <span class="sms-compose-label">发送至：</span>
                            <select class="sms-compose-select" id="smsComposeTo">
                                ${toOptions}
                            </select>
                        </div>
                        <div class="sms-compose-row">
                            <span class="sms-compose-label">主题：</span>
                            <input type="text" class="sms-compose-input" id="smsComposeSubject" placeholder="邮件主题" maxlength="150">
                        </div>
                        <textarea class="sms-compose-body" id="smsComposeBody" placeholder="撰写电子邮件内容..." maxlength="3000"></textarea>
                    </div>
                </div>
            `;

            // 写信返回键 -> 返回 Inbox
            document.getElementById('smsComposeBackBtn').addEventListener('click', () => {
                renderInbox();
            });

            // 写信发送按键
            document.getElementById('smsComposeSendBtn').addEventListener('click', async function() {
                const fromId = document.getElementById('smsComposeFrom').value;
                const toVal = document.getElementById('smsComposeTo').value;
                const subject = document.getElementById('smsComposeSubject').value.trim() || '无主题';
                const body = document.getElementById('smsComposeBody').value.trim();

                if (!body) {
                    alert('邮件内容不能为空');
                    return;
                }

                this.disabled = true;
                this.innerHTML = '正在发送...';

                // 保存发信账号配置
                activeAccount = await DB.get('smsAccounts', fromId);
                await DB.put('smsMeta', { key: 'activeAccountId', value: fromId });

                let threadId = 'thread_' + Date.now();
                let peerKey = toVal;
                let disguised = false;
                let disguisedCharId = '';

                if (toVal === 'random') {
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

        // ================== 小号切换与创建 ==================
        async function openAliasManager() {
            const shell = document.getElementById('smsShell');
            if (!shell) return;

            const mask = await getActiveMask();
            const accounts = await DB.queryByIndex('smsAccounts', 'maskId', mask.id);

            let aliasHtml = '';
            accounts.forEach(a => {
                const isDef = a.isDefault;
                const isActive = (a.id === activeAccount.id);
                aliasHtml += `
                    <div class="sms-alias-item">
                        <div class="sms-alias-info">
                            <div class="sms-alias-name">
                                ${escapeHtml(a.name)} 
                                ${isDef ? '<span class="sms-mail-badge-disguise" style="color:#1a73e8; background:#e8f0fe;">主号</span>' : ''}
                                ${isActive ? '<span class="sms-mail-badge-disguise" style="color:#2ecc71; background:#eafaf1;">正在使用</span>' : ''}
                            </div>
                            <div class="sms-alias-addr">${escapeHtml(a.address)}</div>
                        </div>
                        <div style="display:flex; gap:8px;">
                            ${!isActive ? `
                                <button class="sms-btn-sm primary use-alias-btn" data-id="${a.id}">切换至此账号</button>
                                ${!isDef ? `<button class="sms-btn-sm danger del-alias-btn" data-id="${a.id}">删除</button>` : ''}
                            ` : `<button class="sms-btn-sm" disabled style="opacity:0.6;">正在使用</button>`}
                        </div>
                    </div>
                `;
            });

            shell.innerHTML = `
                <div class="sms-compose-view">
                    <div class="sms-detail-header">
                        <button class="sms-menu-btn" id="smsAliasBackBtn">${SVGS.back}</button>
                        <h2>邮箱小号账户管理</h2>
                    </div>
                    <div style="flex:1; overflow-y:auto; padding:16px;">
                        <div style="font-size:13px; color:#5f6368; margin-bottom:16px;">
                            当前正在使用的主面具为【${escapeHtml(mask.name)}】。为了进行多面具或匿名试探，您可以新建多个独立的邮箱小号（别名）给联系人写信，他们会根据信件逻辑做出穿透判断。
                        </div>
                        <div class="sms-sub-card" style="margin-bottom:20px;">
                            <div class="sms-sub-title" style="margin-bottom:12px;">✨ 新增邮箱小号</div>
                            <div class="sms-compose-row" style="padding:4px 0;">
                                <span class="sms-compose-label">姓名：</span>
                                <input type="text" class="sms-compose-input" id="newAliasName" placeholder="例如：小白">
                            </div>
                            <div class="sms-compose-row" style="padding:4px 0;">
                                <span class="sms-compose-label">别名：</span>
                                <input type="text" class="sms-compose-input" id="newAliasAddr" placeholder="例如：xiaobai">
                                <span style="color:#5f6368; font-size:14px; margin-left:4px;">@haloes.mail</span>
                            </div>
                            <div style="display:flex; justify-content:flex-end; margin-top:12px;">
                                <button class="sms-btn-sm primary" id="smsCreateAliasBtn">创建并切换</button>
                            </div>
                        </div>

                        <div class="sms-sub-title" style="margin-bottom:12px;">📋 账号列表</div>
                        ${aliasHtml}
                    </div>
                </div>
            `;

            // 小号页面返回键 -> 返回 Inbox
            document.getElementById('smsAliasBackBtn').addEventListener('click', () => {
                renderInbox();
            });

            // 新增小号
            document.getElementById('smsCreateAliasBtn').addEventListener('click', async () => {
                const name = document.getElementById('newAliasName').value.trim();
                const prefix = document.getElementById('newAliasAddr').value.trim().toLowerCase();

                if(!name || !prefix) {
                    alert('请完整输入别名账户信息');
                    return;
                }

                if(!/^[a-z0-9_]{2,15}$/.test(prefix)) {
                    alert('前缀仅支持2-15位小写英文字母、数字和下划线');
                    return;
                }

                const allAccts = await DB.getAll('smsAccounts');
                const fullAddr = prefix + '@haloes.mail';
                if(allAccts.some(a => a.address === fullAddr)) {
                    alert('该别名账户已存在，请换一个名称');
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

                showStatus('成功创建并切换至小号账户', 'success');
                openAliasManager();
            });

            // 切换小号动作实现
            shell.querySelectorAll('.use-alias-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const acctId = btn.dataset.id;
                    activeAccount = await DB.get('smsAccounts', acctId);
                    await DB.put('smsMeta', { key: 'activeAccountId', value: acctId });
                    showStatus(`已切换为活动账户: ${activeAccount.name}`, 'success');
                    openAliasManager();
                });
            });

            // 删除小号别名
            shell.querySelectorAll('.del-alias-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const acctId = btn.dataset.id;
                    if(confirm('确定删除该邮箱账户吗？关联的历史往来信件也将一同清除！')) {
                        const threads = await DB.queryByIndex('smsThreads', 'accountId', acctId);
                        for(const t of threads) {
                            const msgs = await DB.queryByIndex('smsMessages', 'threadId', t.id);
                            for(const m of msgs) await DB.delete('smsMessages', m.id);
                            await DB.delete('smsThreads', t.id);
                        }
                        await DB.delete('smsAccounts', acctId);
                        
                        const maskAccts = await DB.queryByIndex('smsAccounts', 'maskId', mask.id);
                        activeAccount = maskAccts.find(a => a.isDefault) || maskAccts[0];
                        await DB.put('smsMeta', { key: 'activeAccountId', value: activeAccount.id });

                        showStatus('别名账号已成功删除', 'info');
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
            
            const userSubs = subs.filter(s => s.maskId === mask.id && !s.isCharSub);
            const charSubs = subs.filter(s => s.isCharSub);

            let userSubsHtml = '';
            userSubs.forEach(s => {
                userSubsHtml += `
                    <div class="sms-sub-card">
                        <div class="sms-sub-header">
                            <span class="sms-sub-title">📡 ${escapeHtml(s.name)}</span>
                            <span class="sms-sub-freq">频次: ${s.frequency === '0' ? '手动' : s.frequency + '小时'}</span>
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
                            <span class="sms-sub-freq">系统内置频道</span>
                        </div>
                        <div class="sms-sub-desc">${escapeHtml(s.description)}</div>
                        <div class="sms-sub-actions">
                            <button class="sms-btn-sm primary trigger-sub-btn" data-id="${s.id}">立刻推送</button>
                        </div>
                    </div>
                `;
            });

            const wbs = await DB.getAll('worldbooks');
            const wbOptions = wbs.map(w => `<option value="${w.id}">${escapeHtml(w.title)}</option>`).join('');

            shell.innerHTML = `
                <div class="sms-compose-view">
                    <div class="sms-detail-header">
                        <button class="sms-menu-btn" id="smsSubBackBtn">${SVGS.back}</button>
                        <h2>订阅号推送设定</h2>
                    </div>
                    <div style="flex:1; overflow-y:auto; padding:16px;">
                        
                        <div class="sms-sub-card" style="margin-bottom:20px; background:#f8f9fa;">
                            <div class="sms-sub-title" style="margin-bottom:12px;">✨ 创建我的自定义订阅号</div>
                            <div class="sms-compose-row" style="padding:4px 0;">
                                <span class="sms-compose-label">名称：</span>
                                <input type="text" class="sms-compose-input" id="newSubName" placeholder="例如：废土周刊">
                            </div>
                            <div class="sms-compose-row" style="padding:4px 0;">
                                <span class="sms-compose-label">主题：</span>
                                <input type="text" class="sms-compose-input" id="newSubDesc" placeholder="例如：科幻朋克日常，八卦">
                            </div>
                            <div class="sms-compose-row" style="padding:4px 0;">
                                <span class="sms-compose-label">背景：</span>
                                <select class="sms-compose-select" id="newSubWb">
                                    <option value="">(不关联任何世界书)</option>
                                    ${wbOptions}
                                </select>
                            </div>
                            <div class="sms-compose-row" style="padding:4px 0;">
                                <span class="sms-compose-label">频次：</span>
                                <select class="sms-compose-select" id="newSubFreq">
                                    <option value="0">完全由手动推送</option>
                                    <option value="1">每 1 小时检测自动推送</option>
                                    <option value="6">每 6 小时检测自动推送</option>
                                    <option value="24">每日检测自动推送</option>
                                </select>
                            </div>
                            <div style="display:flex; justify-content:flex-end; margin-top:12px;">
                                <button class="sms-btn-sm primary" id="smsCreateSubBtn">创建新订阅号</button>
                            </div>
                        </div>

                        <div class="sms-sub-title" style="margin-bottom:12px;">📋 我订阅的频道</div>
                        ${userSubsHtml || '<div style="color:#5f6368; font-size:13px; margin-bottom:16px;">暂无自定义订阅频道</div>'}

                        <div class="sms-sub-title" style="margin-bottom:12px; margin-top:20px;">📰 推荐官方内置订阅</div>
                        ${charSubsHtml}
                    </div>
                </div>
            `;

            // 订阅号页面返回键 -> 返回 Inbox
            document.getElementById('smsSubBackBtn').addEventListener('click', () => {
                renderInbox();
            });

            // 确定创建订阅
            document.getElementById('smsCreateSubBtn').addEventListener('click', async () => {
                const name = document.getElementById('newSubName').value.trim();
                const desc = document.getElementById('newSubDesc').value.trim();
                const wbId = document.getElementById('newSubWb').value;
                const freq = document.getElementById('newSubFreq').value;

                if (!name || !desc) {
                    alert('请完整填写新订阅号的名称和描述主题');
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
                showStatus('订阅号创建成功: ' + name, 'success');
                openSubscriptionManager();
            });

            // 立刻推送一条邮件
            shell.querySelectorAll('.trigger-sub-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const subId = btn.dataset.id;
                    btn.disabled = true;
                    btn.innerHTML = '正在拉取内容...';
                    await triggerSubscriptionPush(subId);
                    openSubscriptionManager();
                });
            });

            // 取消订阅
            shell.querySelectorAll('.del-sub-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const subId = btn.dataset.id;
                    if(confirm('确定退订并永久退订此频道吗？')) {
                        await DB.delete('smsSubs', subId);
                        showStatus('已成功退订', 'info');
                        openSubscriptionManager();
                    }
                });
            });

            await ensureBuiltinCharSubscriptions();
        }

        // 绑定内置角色官方推送号
        async function ensureBuiltinCharSubscriptions() {
            const chars = await DB.getAll('characters');
            if (chars.length === 0) return;

            const subs = await DB.getAll('smsSubs');
            for(const c of chars) {
                const subId = 'sub_char_' + c.id;
                if(!subs.some(s => s.id === subId)) {
                    const charSub = {
                        id: subId,
                        name: `${c.name}的每日随笔`,
                        description: `由著名联系人【${c.name}】亲自撰写，为您推送个人的独家观察与日常思想碎片。`,
                        frequency: '0', 
                        isCharSub: true,
                        charId: c.id,
                        lastPushed: 0
                    };
                    await DB.put('smsSubs', charSub);
                }
            }
        }

        // ================== 订阅号邮件推送生成机制 ==================
        async function triggerSubscriptionPush(subId) {
            const sub = await DB.get('smsSubs', subId);
            if (!sub) return;

            let systemPrompt = '';
            let userPrompt = '';

            if (sub.isCharSub) {
                const c = await DB.get('characters', sub.charId);
                systemPrompt = `
                    你是【${c?.name}】。你正在为自己的专属订阅号/随笔栏目撰写一期文章。
                    人设背景：\n${c?.detail || '普通朋友'}
                    
                    请你撰写一篇字数约300字左右的高水平日常随笔，写一写你今天读过的书，对生活的小牢骚，或者一件小趣闻。语气需要富有你自己的独特人格张力。
                    
                    严格规则：
                    - 禁止使用任何 Emoji。
                    - 保持一封独立文章/随笔的整洁信件结构。
                `;
                userPrompt = `请为您最新的专栏《${sub.name}》撰写正文。`;
            } else {
                let wbContext = '';
                if(sub.worldbookId) {
                    const wb = await DB.get('worldbooks', sub.worldbookId);
                    if(wb) wbContext = `背景世界书参考：\n${wb.content}`;
                }

                systemPrompt = `
                    您现在是一个智能订阅专栏生成器。
                    本期专栏名：【${sub.name}】。
                    专栏的主题与设定：【${sub.description}】。
                    ${wbContext}
                    
                    请为您撰写一期最新的深度阅读邮件专栏内容。文章长度约350字，文风根据设定自行调整。
                    
                    严格规则：
                    - 禁止使用任何 Emoji。
                    - 保持邮件阅读卡片结构，不要输出 Markdown 的代码块。
                `;
                userPrompt = `请生成最新一期《${sub.name}》期刊的深度好文。`;
            }

            try {
                showStatus(`正在抓取云端数据，生成并推送 ${sub.name}...`, 'info');
                recordApiPending();
                const contentText = await callLLM([
                    {role: 'system', content: systemPrompt},
                    {role: 'user', content: userPrompt}
                ]);

                const threadId = 'sub_th_' + sub.id + '_' + Date.now();
                const newThread = {
                    id: threadId,
                    maskId: sub.maskId || (await getActiveMask())?.id,
                    accountId: activeAccount?.id,
                    peerKey: sub.id,
                    subject: `[期刊] ${sub.name} 新推`,
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

                showStatus(`📰 订阅专栏 ${sub.name} 投递成功`, 'success');

            } catch (e) {
                showStatus('获取订阅内容失败，请稍后刷新: ' + e.message, 'error');
            }
        }

        // ================== 定时推送检查 ==================
        async function checkPeriodicalSubscriptions() {
            const subs = await DB.getAll('smsSubs');
            const now = Date.now();

            for (const s of subs) {
                if (s.frequency && s.frequency !== '0') {
                    const intervalMs = parseInt(s.frequency) * 60 * 60 * 1000;
                    const elapsed = now - (s.lastPushed || 0);
                    if (elapsed >= intervalMs) {
                        console.log(`📡 周期性自动投递触发: ${s.name}`);
                        triggerSubscriptionPush(s.id).catch(err => {
                            console.warn('定时订阅静默投递失败', err);
                        });
                    }
                }
            }
        }

        // ================== 刷新时主动触发随机来信（提升游戏体验） ==================
        async function triggerIncomingProactiveEmail() {
            const chars = await DB.getAll('characters');
            if (chars.length === 0 || !activeAccount) return;

            // 35% 几率触发一封来自联系人（或者是其伪装成陌生人）的主动邮件
            if (Math.random() > 0.35) {
                showStatus('信箱已是最新状态', 'success');
                return;
            }

            const chosenChar = chars[Math.floor(Math.random() * chars.length)];
            const trueMask = await getActiveMask();

            const isDisguised = (Math.random() > 0.5); // 是否伪装成陌生人
            const peerKey = isDisguised ? 'stranger_' + Math.random().toString(36).substring(2, 8) : chosenChar.id;
            const senderName = isDisguised ? '神秘人' : chosenChar.name;
            const senderAddr = isDisguised ? `${peerKey}@stranger.mail` : `${chosenChar.id}@haloes.mail`;

            // 用 LLM 生成主动来信的主题和正文
            let systemPrompt = '';
            if (isDisguised) {
                systemPrompt = `
                    你是【${chosenChar.name}】。
                    你现在伪装成一个化名为“【${senderName}】”的陌生人（邮箱为 <${senderAddr}>），写信给【${trueMask?.name}】（此时你发件的邮箱别名为【${activeAccount.name}】）。
                    你可能出于一种善意的玩笑、试探、甚至是某个秘密事件在跟写信联系TA。
                    
                    请写一封带有悬疑或试探感、300字以内的信件。
                    
                    要求：
                    1. 严格禁止 Emoji。
                    2. 主题格式：---主题---主题内容
                    3. 正文格式：---正文---正文内容
                `;
            } else {
                systemPrompt = `
                    你是【${chosenChar.name}】。你正在主动给好朋友【${trueMask?.name}】（他的写信别名为【${activeAccount.name}】）写一封日常倾诉邮件。
                    你的人设背景为：\n${chosenChar.detail || '熟人'}
                    
                    写信探讨一期最近的艺术电影、你的日常感悟、或者询问TA对某件事情的看法。
                    
                    要求：
                    1. 严格禁止 Emoji。
                    2. 主题格式：---主题---主题内容
                    3. 正文格式：---正文---正文内容
                `;
            }

            try {
                recordApiPending();
                const aiResult = await callLLM([
                    {role: 'system', content: systemPrompt},
                    {role: 'user', content: '请生成一期精细的日常主动来信内容'}
                ]);

                const subjMatch = aiResult.match(/---主题---(.*)/);
                const bodyMatch = aiResult.match(/---正文---([\s\S]*)/);

                const subject = (subjMatch ? subjMatch[1].trim() : `新回复：关于最近的事`) || '一封突如其来的来信';
                const body = bodyMatch ? bodyMatch[1].trim() : aiResult.trim();

                const threadId = 'thread_' + Date.now();
                const newThread = {
                    id: threadId,
                    maskId: activeAccount.maskId,
                    accountId: activeAccount.id,
                    peerKey: peerKey,
                    subject: subject,
                    isSubscription: false,
                    disguised: isDisguised,
                    disguisedCharId: isDisguised ? chosenChar.id : '',
                    unread: true,
                    createdAt: Date.now()
                };

                const newMsg = {
                    id: 'msg_' + Date.now(),
                    threadId: threadId,
                    senderName: senderName,
                    senderAddress: senderAddr,
                    body: body,
                    timestamp: Date.now(),
                    isReceived: true
                };

                await DB.put('smsThreads', newThread);
                await DB.put('smsMessages', newMsg);
                showStatus(`📬 收到了一封来自 [${senderName}] 的新邮件！`, 'success');

            } catch (err) {
                console.warn('主动邮件生成失败', err);
            }
        }

        // ================== 汉字拼音快速拼凑别名 ==================
        function pinyin(str) {
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

        // 全局模块输出
        window.smsModule = {
            init,
            openCompose,
            openAliasManager,
            openSubscriptionManager
        };

        init();
    };

})();