(function() {
    const isGithub = window.location.hostname.includes('github.io');
    const firstPath = window.location.pathname.split('/').filter(Boolean)[0];
    const basePath = isGithub && firstPath ? `/${firstPath}/` : '/';

    [
        ['144x144', 'icon-144.png'],
        ['512x512', 'icon-512.png']
    ].forEach(([sizes, file]) => {
        const link = document.createElement('link');
        link.rel = 'apple-touch-icon';
        link.sizes = sizes;
        link.href = basePath + file;
        document.head.appendChild(link);
    });
})();


(function() {
            "use strict";
            console.log('🚀 AI陪伴空间启动 - 对话列表模式');

            // ========== PWA / iOS 视口高度修正 ==========
            // iOS PWA 中 100vh 可能会比真实可见区域更高，导致页面上下滚动。
            // 使用 window.innerHeight 写入 CSS 变量，让主容器按真实可见高度渲染。
            function updateAppHeightVar() {
                const h = window.innerHeight;
                document.documentElement.style.setProperty('--app-height', h + 'px');
            }

            updateAppHeightVar();

            window.addEventListener('resize', updateAppHeightVar);
            window.addEventListener('orientationchange', () => {
                setTimeout(updateAppHeightVar, 300);
            });

            if (window.visualViewport) {
                window.visualViewport.addEventListener('resize', updateAppHeightVar);
            }

            const DB_NAME = "CompanionDB_V18";
            const DB_VERSION = 31;
            let db = null;
            window.groupCollapsed = window.groupCollapsed || {};

            async function openDB() {
    if (db) return db;

    return new Promise((resolve) => {
        // 关键：不带版本号打开，永远不会 blocked
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        
        req.onupgradeneeded = (e) => {
            const d = e.target.result;
            const ver = d.version;
            // 只在真正的升级时建表
            if (ver <= 1 || !d.objectStoreNames.contains('settings')) d.createObjectStore('settings', { keyPath: 'key' });
            if (!d.objectStoreNames.contains('characters')) d.createObjectStore('characters', { keyPath: 'id' });
            if (!d.objectStoreNames.contains('chats')) {
                const s = d.createObjectStore('chats', { keyPath: 'id', autoIncrement: true });
                if (!s.indexNames.contains('charId')) s.createIndex('charId', 'charId');
                if (!s.indexNames.contains('conversationId')) s.createIndex('conversationId', 'conversationId');
            }
            if (!d.objectStoreNames.contains('userProfiles')) d.createObjectStore('userProfiles', { keyPath: 'id' });
            if (!d.objectStoreNames.contains('conversations')) {
                const s = d.createObjectStore('conversations', { keyPath: 'id', autoIncrement: true });
                if (!s.indexNames.contains('charId')) s.createIndex('charId', 'charId');
                if (!s.indexNames.contains('maskId')) s.createIndex('maskId', 'maskId');
            }
            if (!d.objectStoreNames.contains('convDetails')) {
                const s = d.createObjectStore('convDetails', { keyPath: 'conversationId' });
                if (!s.indexNames.contains('charId')) s.createIndex('charId', 'charId');
            }
            if (!d.objectStoreNames.contains('worldbooks')) {
                const s = d.createObjectStore('worldbooks', { keyPath: 'id' });
                if (!s.indexNames.contains('group')) s.createIndex('group', 'group');
            }
            if (!d.objectStoreNames.contains('memories')) {
                const s = d.createObjectStore('memories', { keyPath: 'id', autoIncrement: true });
                if (!s.indexNames.contains('charId')) s.createIndex('charId', 'charId');
                if (!s.indexNames.contains('conversationId')) s.createIndex('conversationId', 'conversationId');
                if (!s.indexNames.contains('type')) s.createIndex('type', 'type');
            }
            if (!d.objectStoreNames.contains('reunionNPCs')) {
                const s = d.createObjectStore('reunionNPCs', { keyPath: 'id' });
                if (!s.indexNames.contains('personality')) s.createIndex('personality', 'personality');
                if (!s.indexNames.contains('worldSetting')) s.createIndex('worldSetting', 'worldSetting');
                if (!s.indexNames.contains('storyline')) s.createIndex('storyline', 'storyline');
            }
            if (!d.objectStoreNames.contains('reunionTags')) {
                const s = d.createObjectStore('reunionTags', { keyPath: 'id' });
                if (!s.indexNames.contains('category')) s.createIndex('category', 'category');
            }
            if (!d.objectStoreNames.contains('themeSettings')) d.createObjectStore('themeSettings', { keyPath: 'key' });
            if (!d.objectStoreNames.contains('navIconSettings')) d.createObjectStore('navIconSettings', { keyPath: 'navId' });
            if (!d.objectStoreNames.contains('diaryEntries')) d.createObjectStore('diaryEntries', { keyPath: 'id' });
            if (!d.objectStoreNames.contains('forum')) d.createObjectStore('forum', { keyPath: 'key' });
            if (!d.objectStoreNames.contains('forumPresets')) d.createObjectStore('forumPresets', { keyPath: 'key' });
            if (!d.objectStoreNames.contains('phoneData')) d.createObjectStore('phoneData', { keyPath: 'key' });
            if (!d.objectStoreNames.contains('guangguang_cart')) d.createObjectStore('guangguang_cart', { keyPath: 'id' });
            if (!d.objectStoreNames.contains('guangguang_orders')) d.createObjectStore('guangguang_orders', { keyPath: 'id' });
            if (!d.objectStoreNames.contains('guangguang_msg_convs')) d.createObjectStore('guangguang_msg_convs', { keyPath: 'id' });
            if (!d.objectStoreNames.contains('guangguang_messages')) d.createObjectStore('guangguang_messages', { keyPath: 'id' });
            if (!d.objectStoreNames.contains('apiArchives')) d.createObjectStore('apiArchives', { keyPath: 'id' });
            if (!d.objectStoreNames.contains('homeSettings')) d.createObjectStore('homeSettings', { keyPath: 'key' });
            if (!d.objectStoreNames.contains('bubbleThemes')) d.createObjectStore('bubbleThemes', { keyPath: 'id' });
            if (!d.objectStoreNames.contains('emoticonGroups')) d.createObjectStore('emoticonGroups', { keyPath: 'id' });
            if (!d.objectStoreNames.contains('emoticonItems')) {
                const s = d.createObjectStore('emoticonItems', { keyPath: 'id', autoIncrement: true });
                if (!s.indexNames.contains('groupId')) s.createIndex('groupId', 'groupId');
            }
            if (!d.objectStoreNames.contains('groupChats')) d.createObjectStore('groupChats', { keyPath: 'id', autoIncrement: true });
            if (!d.objectStoreNames.contains('groupMessages')) {
                const s = d.createObjectStore('groupMessages', { keyPath: 'id', autoIncrement: true });
                if (!s.indexNames.contains('groupId')) s.createIndex('groupId', 'groupId');
            }
            if (!d.objectStoreNames.contains('groupNPCs')) {
                const s = d.createObjectStore('groupNPCs', { keyPath: 'id', autoIncrement: true });
                if (!s.indexNames.contains('groupId')) s.createIndex('groupId', 'groupId');
            }
            if (!d.objectStoreNames.contains('groupMemories')) {
                const s = d.createObjectStore('groupMemories', { keyPath: 'id', autoIncrement: true });
                if (!s.indexNames.contains('groupId')) s.createIndex('groupId', 'groupId');
            }
            if (!d.objectStoreNames.contains('momentsStore')) d.createObjectStore('momentsStore', { keyPath: 'key' });

// SMS
if (!d.objectStoreNames.contains('smsAccounts')) {
    const s = d.createObjectStore('smsAccounts', { keyPath: 'id' });
    if (!s.indexNames.contains('maskId')) s.createIndex('maskId', 'maskId');
}
if (!d.objectStoreNames.contains('smsThreads')) {
    const s = d.createObjectStore('smsThreads', { keyPath: 'id' });
    if (!s.indexNames.contains('maskId')) s.createIndex('maskId', 'maskId');
    if (!s.indexNames.contains('accountId')) s.createIndex('accountId', 'accountId');
    if (!s.indexNames.contains('peerKey')) s.createIndex('peerKey', 'peerKey');
}
if (!d.objectStoreNames.contains('smsMessages')) {
    const s = d.createObjectStore('smsMessages', { keyPath: 'id' });
    if (!s.indexNames.contains('threadId')) s.createIndex('threadId', 'threadId');
    if (!s.indexNames.contains('timestamp')) s.createIndex('timestamp', 'timestamp');
}
if (!d.objectStoreNames.contains('smsSubs')) {
    const s = d.createObjectStore('smsSubs', { keyPath: 'id' });
    if (!s.indexNames.contains('maskId')) s.createIndex('maskId', 'maskId');
    if (!s.indexNames.contains('accountId')) s.createIndex('accountId', 'accountId');
}
if (!d.objectStoreNames.contains('smsMeta')) {
    d.createObjectStore('smsMeta', { keyPath: 'key' });
}
if (!d.objectStoreNames.contains('smsStrangerAccounts')) {
    const s = d.createObjectStore('smsStrangerAccounts', { keyPath: 'id' });
    if (!s.indexNames.contains('maskId')) s.createIndex('maskId', 'maskId');
    if (!s.indexNames.contains('accountId')) s.createIndex('accountId', 'accountId');
    if (!s.indexNames.contains('address')) s.createIndex('address', 'address');
}
        };

        req.onsuccess = (e) => {
    const openedDb = e.target.result;
    db = openedDb;

    openedDb.onversionchange = () => {
        try {
            openedDb.close();
        } catch (err) {
            console.warn('关闭旧数据库连接失败:', err);
        }
        if (db === openedDb) db = null;
    };

    console.log('✅ 数据库已打开');
    resolve(db);
};

        req.onerror = () => {
            // 失败了也继续，让页面至少能显示
            console.warn('⚠️ DB打开失败，页面将以降级模式运行');
            db = null;
            resolve(null);
        };
    });
}

            const DB = {
                async setSetting(k, v) { const d = await openDB(); return new Promise(r => { const tx = d.transaction(
                            'settings', 'readwrite');
                        tx.objectStore('settings').put({ key: k, value: v });
                        tx.oncomplete = r; }); },
                async getSetting(k, def = null) { const d = await openDB(); return new Promise(r => { const tx = d.transaction(
                            'settings'); const req = tx.objectStore('settings').get(k);
                        req.onsuccess = () => r(req.result ? req.result.value : def); }); },
                async getAll(store) { const d = await openDB(); return new Promise(r => { const tx = d.transaction(store); const req =
                            tx.objectStore(store).getAll();
                        req.onsuccess = () => r(req.result || []); }); },
                async get(store, id) { const d = await openDB(); return new Promise(r => { const tx = d.transaction(store); const req =
                            tx.objectStore(store).get(id);
                        req.onsuccess = () => r(req.result); }); },
                async put(store, obj) { const d = await openDB(); return new Promise(r => { const tx = d.transaction(store,
                            'readwrite');
                        tx.objectStore(store).put(obj);
                        tx.oncomplete = r; }); },
                async delete(store, id) { const d = await openDB(); return new Promise(r => { const tx = d.transaction(store,
                            'readwrite');
                        tx.objectStore(store).delete(id);
                        tx.oncomplete = r; }); },
                async queryByIndex(store, idx, val) { const d = await openDB(); return new Promise(r => { const tx = d.transaction(
                            store); const req = tx.objectStore(store).index(idx).getAll(val);
                        req.onsuccess = () => r(req.result || []); }); }
            };
            window.DB = DB;

            async function initDefaults() {
                let chars = await DB.getAll('characters');
                if (chars.length === 0) {
                    await DB.put('characters', {
                        id: 'char_1',
                        name: '林栖',
                        group: '好友',
                        avatar: '',
                        detail: '林栖是一个心思细腻的图书管理员。性格温和内敛，说话时喜欢用"哎呀"、"其实呢"开头，句尾常带"呢""呀""~"。你们是知己关系。回复要简短，像发微信一样。禁止使用动作描写。'
                    });
                    await DB.put('characters', {
                        id: 'char_2',
                        name: '夜影',
                        group: '好友',
                        avatar: '',
                        detail: '夜影是一个有点傲娇但内心柔软的都市白领。说话犀利但不刻薄，偶尔流露出关心。你们是同事关系。回复要简短有力。禁止动作描写和视觉/听觉词汇。'
                    });
                }
                let profiles = await DB.getAll('userProfiles');
                if (profiles.length === 0) {
                    await DB.put('userProfiles', { id: 'mask_1', name: '真实的我', bio: '我就是我自己', avatar: '' });
                    await DB.put('userProfiles', { id: 'mask_2', name: '阳光开朗', bio: '总是保持积极乐观', avatar: '' });
                }
                if (!await DB.getSetting('lastSummaryEndIndex')) await DB.setSetting('lastSummaryEndIndex', 0);
                if (!await DB.getSetting('lastSummaryEndSegment')) await DB.setSetting('lastSummaryEndSegment', 0);
                if (!await DB.getSetting('llmBaseUrl')) await DB.setSetting('llmBaseUrl', 'https://api.openai.com/v1');
                if (!await DB.getSetting('temperature')) await DB.setSetting('temperature', '0.8');
                if (!await DB.getSetting('maxTokens')) await DB.setSetting('maxTokens', '18000');
                if (!await DB.getSetting('topP')) await DB.setSetting('topP', '1.0');
                if (!await DB.getSetting('contextRounds')) await DB.setSetting('contextRounds', 4);
                if (!await DB.getSetting('gg_wallet_balance')) await DB.setSetting('gg_wallet_balance', 0);

                let worldbooks = await DB.getAll('worldbooks');
                if (worldbooks.length === 0) {
                    await DB.put('worldbooks', {
                        id: 'wb_' + Date.now(),
                        title: '示例：魔法世界设定',
                        group: '奇幻设定',
                        content: '在这个世界中，魔法是一种普遍存在的能量。法师通过咒语和手势操控元素...',
                        mountScenes: ['chat'],
                        mountChars: [],
                        createdAt: Date.now(),
                        updatedAt: Date.now()
                    });
                }

                let reunionTags = await DB.getAll('reunionTags');
                if (reunionTags.length === 0) {
                    const presetTags = [
                        { id: 'rt_personality_1', category: 'personality', name: '温和',
                            description: '性格温柔和善，待人亲切友好', isPreset: true },
                        { id: 'rt_personality_2', category: 'personality', name: '暴躁',
                            description: '脾气急躁冲动，易怒但直率', isPreset: true },
                        { id: 'rt_personality_3', category: 'personality', name: '内向',
                            description: '安静害羞，不善于社交表达', isPreset: true },
                        { id: 'rt_personality_4', category: 'personality', name: '腹黑',
                            description: '表面友善，实则算计深沉', isPreset: true },
                        { id: 'rt_personality_5', category: 'personality', name: '傲娇',
                            description: '外表冷淡高傲，内心热情关怀', isPreset: true },
                        { id: 'rt_world_1', category: 'world', name: '中世纪', description: '剑与魔法的古典奇幻世界',
                            isPreset: true },
                        { id: 'rt_world_2', category: 'world', name: '赛博朋克', description: '高科技低生活的反乌托邦未来',
                            isPreset: true },
                        { id: 'rt_world_3', category: 'world', name: '现代都市', description: '21世纪现代化城市生活',
                            isPreset: true },
                        { id: 'rt_world_4', category: 'world', name: '仙侠修真', description: '修真门派与仙道传承的世界',
                            isPreset: true },
                        { id: 'rt_world_5', category: 'world', name: '末日废土', description: '大灾难后的荒芜求生世界',
                            isPreset: true },
                        { id: 'rt_plot_1', category: 'plot', name: '甜宠', description: '温柔甜蜜的宠爱关系发展',
                        isPreset: true },
                        { id: 'rt_plot_2', category: 'plot', name: '复仇', description: '为冤屈或仇恨而展开的反击',
                        isPreset: true },
                        { id: 'rt_plot_3', category: 'plot', name: '逆袭', description: '从底层崛起，改变命运的故事',
                            isPreset: true },
                        { id: 'rt_plot_4', category: 'plot', name: '悬疑', description: '充满谜团与反转的推理故事',
                        isPreset: true },
                        { id: 'rt_plot_5', category: 'plot', name: '成长', description: '主角在不断历练中逐渐成熟',
                            isPreset: true }
                    ];
                    for (const tag of presetTags) {
                        await DB.put('reunionTags', tag);
                    }
                }

                let reunionNPCs = await DB.getAll('reunionNPCs');
                if (reunionNPCs.length === 0) {
                    const sampleNPCs = [
                        {
                            id: 'npc_sample_1',
                            name: '叶芷晴',
                            gender: '女',
                            age: '24岁',
                            personality: '温和',
                            worldSetting: '现代都市',
                            storyline: '甜宠',
                            personalityDesc: '温柔体贴，善解人意，待人亲切友好',
                            backstory: '叶芷晴是一家独立书店的老板娘，大学毕业后放弃了高薪工作，在城市的角落开了一家小书店。她相信每本书都有它命中注定的读者。某天傍晚，一个陌生人在书店打烊前推门而入，从此改变了她平静的生活。',
                            createdAt: Date.now() - 100000
                        },
                        {
                            id: 'npc_sample_2',
                            name: '铁寒',
                            gender: '男',
                            age: '28岁',
                            personality: '傲娇',
                            worldSetting: '赛博朋克',
                            storyline: '逆袭',
                            personalityDesc: '外表冷漠刻薄，内心却暗藏关怀',
                            backstory: '铁寒是地下黑市最年轻的机械师，用义肢和芯片改写命运。他在霓虹灯照不到的废墟中长大，从不信任任何人。直到那个陌生人带来了已故导师的消息，他不得不重新面对自己的过去。',
                            createdAt: Date.now() - 50000
                        },
                        {
                            id: 'npc_sample_3',
                            name: '云汐',
                            gender: '女',
                            age: '未知',
                            personality: '腹黑',
                            worldSetting: '仙侠修真',
                            storyline: '复仇',
                            personalityDesc: '表面温文尔雅，实则深不可测，步步为营',
                            backstory: '云汐是青云宗最年轻的掌教弟子，一身修为深不可测。三百年前的灭门惨案至今未破，她暗中布局多年，只为找出真凶。当那个手持旧玉佩的人出现在宗门试炼大会上时，她知道时机到了。',
                            createdAt: Date.now() - 10000
                        }
                    ];

                    for (const npc of sampleNPCs) {
                        await DB.put('reunionNPCs', npc);
                    }
                }

                const navIconSettings = await DB.getAll('navIconSettings');
if (navIconSettings.length === 0) {
    const defaultNavs = [
        { navId: 'chat', emoji: '💬', label: '聊天室', color: '#f39c12', image: 'chat.svg' },
        { navId: 'worldbook', emoji: '📖', label: '世界书', color: '#3498db', image: 'worldbook.svg' },
        { navId: 'accounting', emoji: '📊', label: '记账', color: '#2ecc71', image: 'accounting.svg' },
        { navId: 'reunion', emoji: '🌟', label: '重逢', color: '#e67e22', image: 'reunion.svg' },
        { navId: 'datamanager', emoji: '💾', label: '数据管理', color: '#1abc9c', image: 'datamanager.svg' },
        { navId: 'settings', emoji: '⚙️', label: 'API设置', color: '#e74c3c', image: 'settings.svg' },
        { navId: 'theme', emoji: '🎨', label: '美化', color: '#f39c12', image: 'theme.svg' },
        { navId: 'diary', emoji: '📔', label: '日记', color: '#e67e22', image: 'diary.svg' },
            { navId: 'guangguang', emoji: '🛍️', label: '逛逛', color: '#ff4400', image: 'guangguang.svg' },
    ];
    for (const nav of defaultNavs) {
        await DB.put('navIconSettings', {
            navId: nav.navId,
            image: nav.image || '',
            color: nav.color,
            emoji: nav.emoji
        });
    }
    // 新增论坛图标设置
    await DB.put('navIconSettings', {
        navId: 'forum',
        image: 'forum.svg',
        color: '#1d9bf0',
        emoji: '🗣️'
    });
    await DB.put('navIconSettings', {
    navId: 'sms',
    image: 'sms.svg',
    color: '#95a5a6',
    emoji: '💬'
});
}
                // 初始化论坛数据
                const forumRecord = await DB.get('forum', 'main');
                if (!forumRecord) {
                    await DB.put('forum', { key: 'main', value: {
                        following: [],
                        settings: { name: '星海社区', style: '这是一个温馨友好的社区，用户们喜欢分享日常生活、科技趣闻和创意想法。大家互相尊重，氛围轻松。' },
                        mountedWorldbooks: [],
                        accounts: [{
                            id: 'acct_' + Date.now(),
                            name: '论坛用户',
                            handle: 'user_' + Math.random().toString(36).slice(2, 8),
                            bio: '这个人很懒，什么都没写',
                            persona: '一个普通用户，友善、偶尔幽默，喜欢参与讨论。',
                            avatar: ''
                        }],
                        currentAccountId: null,
                        posts: [],
                        trends: [],
                        notifications: [],
                        messages: [],
                        comments: {}
                    }});
                    const forumData = (await DB.get('forum', 'main')).value;
                    forumData.currentAccountId = forumData.accounts[0].id;
                    await DB.put('forum', { key: 'main', value: forumData });
                }
            }

            const API_MONITOR_KEY = 'api_call_monitor';

            function getApiMonitorData() {
                const raw = localStorage.getItem(API_MONITOR_KEY);
                if (raw) {
                    try { return JSON.parse(raw); } catch (e) {}
                }
                return {
                    status: 'gray',
                    lastCall: null,
                    errors: []
                };
            }

            function saveApiMonitorData(data) {
                localStorage.setItem(API_MONITOR_KEY, JSON.stringify(data));
            }

            function recordApiPending() {
                const data = getApiMonitorData();
                data.status = 'yellow';
                saveApiMonitorData(data);
                updateApiStatusFloat();
            }
window.recordApiPending = recordApiPending;

            function recordApiSuccess(model, tokens) {
                const data = getApiMonitorData();
                data.status = 'green';
                data.lastCall = {
                    time: Date.now(),
                    model: model || 'unknown',
                    tokens: tokens || '未知'
                };
                saveApiMonitorData(data);
                updateApiStatusFloat();
            }
            window.recordApiSuccess = recordApiSuccess;

            function updateApiStatusFloat() {
                const data = getApiMonitorData();
                const floatEl = document.getElementById('apiStatusFloat');
                const dotEl = document.getElementById('apiDot');
                const statusTextEl = document.getElementById('apiStatusText');
                const lastCallInfoEl = document.getElementById('apiLastCallInfo');
                const errorsContainer = document.getElementById('apiErrorsContainer');

                if (!floatEl) return;

                floatEl.className = 'api-status-float ' + data.status;

                if (dotEl) {
                    dotEl.className = 'status-dot ' + data.status;
                }
                if (statusTextEl) {
                    const statusMap = {
                        green: '正常运行 ✅',
                        yellow: '请求中 🟡',
                        red: '连接异常 ❌',
                        gray: '尚未调用'
                    };
                    statusTextEl.textContent = statusMap[data.status] || '未知';
                }

                if (lastCallInfoEl) {
                    if (data.lastCall) {
                        const timeStr = new Date(data.lastCall.time).toLocaleTimeString('zh-CN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        });
                        lastCallInfoEl.innerHTML =
                            `<div>${timeStr} | ${escapeHtml(data.lastCall.model)} | Token: ${data.lastCall.tokens}</div>`;
                    } else {
                        lastCallInfoEl.textContent = '暂无调用记录';
                    }
                }

                if (errorsContainer) {
                    if (data.errors.length === 0) {
                        errorsContainer.innerHTML = '<div style="color: #aaa; font-size: 12px;">暂无错误</div>';
                    } else {
                        errorsContainer.innerHTML = data.errors.map(e => {
                            const timeStr = new Date(e.time).toLocaleTimeString('zh-CN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            });
                            return `<div class="error-item">
                    <div class="error-time">${timeStr}</div>
                    <div><strong>${escapeHtml(e.code)}</strong>: ${escapeHtml(e.message)}</div>
                </div>`;
                        }).join('');
                    }
                }
            }

            function recordApiError(errorCode, errorMessage) {
                const data = getApiMonitorData();
                data.status = 'red';
                data.errors.unshift({
                    time: Date.now(),
                    code: errorCode || 'UNKNOWN',
                    message: errorMessage || '未知错误'
                });
                if (data.errors.length > 3) data.errors = data.errors.slice(0, 3);
                saveApiMonitorData(data);
                updateApiStatusFloat();
            }
            window.recordApiError = recordApiError;

            function escapeHtml(s) {
                if (s === null || s === undefined) return '';
                return String(s).replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[m]);
            }
            window.escapeHtml = escapeHtml;
            const WB_ICONS = {
    book: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',

    plus: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',

    chat: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>',

    diary: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',

    user: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>',

    tag: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41 11 3H4v7l9.59 9.59a2 2 0 0 0 2.82 0l4.18-4.18a2 2 0 0 0 0-2.82z"/><circle cx="7.5" cy="7.5" r=".5"/></svg>',

    save: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',

    trash: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>'
};
window.WB_ICONS = WB_ICONS;
const UI_SVG = {
    image: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',

    mic: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>',

    phone: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',

    file: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',

    quote: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11H6a2 2 0 0 0-2 2v5h6v-7z"/><path d="M20 11h-4a2 2 0 0 0-2 2v5h6v-7z"/><path d="M6 11V8a4 4 0 0 1 4-4"/><path d="M16 11V8a4 4 0 0 1 4-4"/></svg>',

    info: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
};

window.UI_SVG = UI_SVG;

            function showStatus(msg, type = 'info') {
                const el = document.getElementById('apiStatusMsg');
                if (!el) return;
                el.innerText = msg;
                el.className = `status-msg ${type}`;
                setTimeout(() => { if (el.innerText === msg) { el.className = 'status-msg';
                        el.innerText = '⚙️ 就绪'; } }, 4000);
            }
window.showStatus = showStatus;
            function scrollChatToBottom() {
                const container = document.getElementById('convChatMessages');
                if (container) container.scrollTop = container.scrollHeight;
            }

            function getAvatarColor(name) {
                const colors = ['#f39c12', '#3498db', '#e67e22', '#2ecc71', '#9b59b6', '#1abc9c', '#e74c3c'];
                return colors[(name || '?').charCodeAt(0) % colors.length];
            }
            window.getAvatarColor = getAvatarColor;

            async function getLLMConfig() {
                return {
                    baseUrl: await DB.getSetting('llmBaseUrl', 'https://api.openai.com/v1'),
                    apiKey: await DB.getSetting('llmApiKey', ''),
                    model: await DB.getSetting('llmModel', 'gpt-3.5-turbo'),
                    temperature: parseFloat(await DB.getSetting('temperature', '0.8')),
                    maxTokens: parseInt(await DB.getSetting('maxTokens', '800')),
                    topP: parseFloat(await DB.getSetting('topP', '1.0'))
                };
            }

            async function callLLM(messages, options = {}) {
    const config = await getLLMConfig();
    const base = config.baseUrl.replace(/\/$/, '');

    // 所有 LLM 调用一进入这里，API 悬浮窗立刻变成请求中
    if (window.recordApiPending) {
        window.recordApiPending();
    } else if (typeof recordApiPending === 'function') {
        recordApiPending();
    }

    if (!config.apiKey) {
        if (typeof recordApiError === 'function') {
            recordApiError('🔑 NO_API_KEY', '请先配置API Key');
        }
        throw new Error('请先配置API Key');
    }

    const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 120000);
                try {
                    const requestBody = {
                        model: options.model || config.model,
                        messages,
                        temperature: options.temperature ?? config.temperature,
                        max_tokens: options.maxTokens ?? config.maxTokens
                    };
                    if ((options.topP ?? config.topP) < 1.0) requestBody.top_p = options.topP ?? config.topP;
                    const response = await fetch(`${base}/chat/completions`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${config.apiKey}` },
                        body: JSON.stringify(requestBody),
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);
                    if (!response.ok) { const errorText = await response.text(); throw new Error(
                            `HTTP ${response.status}: ${errorText.slice(0, 200)}`); }
                    const data = await response.json();

const finishReason = data.choices?.[0]?.finish_reason;
if (finishReason === 'length') {
    console.warn('[callLLM] 输出被截断：finish_reason = length');
    recordApiError(
        '✂️ OUTPUT_TRUNCATED',
        '输出达到 max_tokens 上限，被截断了。请调高 API 设置里的 Max Tokens。'
    );
}

// 宽容提取内容
let content = "";
if (data.choices && data.choices.length > 0) {
    const msg = data.choices[0].message || data.choices[0].delta || {};
    content = msg.content || msg.refusal || "";
}

// 如果完全为空，尝试从其他字段恢复
if (!content && data.choices?.[0]?.text) {
    content = data.choices[0].text;
}

if (!content || !content.trim()) {
    // 打印完整响应帮助调试
    console.warn("[callLLM] 空响应，完整 data:", JSON.stringify(data).slice(0, 500));
    throw new Error('响应格式异常（API返回空内容）');
}

const tokens = data.usage?.total_tokens || '未知';
recordApiSuccess(config.model, tokens);

return content.trim();
                } catch (err) {
                    clearTimeout(timeoutId);

                    let errorCode;
                    const msg = err.message || '';
                    const name = err.name || '';

                    if (name === 'AbortError') {
                        errorCode = '⏱️ TIMEOUT';
                    } else if (msg.includes('请先配置API Key')) {
                        errorCode = '🔑 NO_API_KEY';
                    } else if (msg.includes('Failed to fetch') || name === 'TypeError' && msg.includes('fetch')) {
                        errorCode = '🌐 NETWORK_ERR';
                    } else if (msg.includes('响应格式异常') || msg.includes('Unexpected end of JSON')) {
                        errorCode = '📭 EMPTY_RESP';
                    } else if (msg.includes('JSON Parse') || msg.includes('Unexpected token')) {
                        errorCode = '🔧 PARSE_ERR';
                    } else if (msg.includes('CORS') || msg.includes('cross-origin')) {
                        errorCode = '🚫 CORS_ERR';
                    } else {
                        const httpMatch = msg.match(/HTTP (\d{3})/);
                        if (httpMatch) {
                            const status = parseInt(httpMatch[1]);
                            if (status === 400) errorCode = '❌ HTTP_400_BAD_REQUEST';
                            else if (status === 401) errorCode = '🔒 HTTP_401_UNAUTHORIZED';
                            else if (status === 403) errorCode = '🚷 HTTP_403_FORBIDDEN';
                            else if (status === 404) errorCode = '❓ HTTP_404_NOT_FOUND';
                            else if (status === 429) errorCode = '⏳ HTTP_429_RATE_LIMIT';
                            else if (status === 500) errorCode = '💥 HTTP_500_SERVER_ERR';
                            else if (status === 502) errorCode = '🌉 HTTP_502_BAD_GATEWAY';
                            else if (status === 503) errorCode = '🔧 HTTP_503_UNAVAILABLE';
                            else errorCode = `❗ HTTP_${status}`;
                        } else {
                            errorCode = '❓ UNKNOWN';
                        }
                    }

                    recordApiError(errorCode, msg);

                    if (name === 'AbortError') throw new Error('请求超时');
                    throw err;
                }
            }
window.callLLM = callLLM;

            function compressImage(file, maxWidth = 200, maxHeight = 200, quality = 0.8) {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = new Image();
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            let width = img.width;
                            let height = img.height;

                            if (width > height) {
                                if (width > maxWidth) {
                                    height = (height * maxWidth) / width;
                                    width = maxWidth;
                                }
                            } else {
                                if (height > maxHeight) {
                                    width = (width * maxHeight) / height;
                                    height = maxHeight;
                                }
                            }

                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, width, height);
                            resolve(canvas.toDataURL('image/jpeg', quality));
                        };
                        img.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                });
            }
            window.compressImage = compressImage;

            function setupAvatarUpload(prefix, onAvatarChange) {
                const previewEl = document.getElementById(`${prefix}AvatarPreview`);
                const dataInput = document.getElementById(`${prefix}AvatarData`);
                const fileInput = document.getElementById(`${prefix}AvatarFile`);
                const uploadBtn = document.getElementById(`${prefix}UploadBtn`);
                const urlBtn = document.getElementById(`${prefix}UrlBtn`);
                const clearBtn = document.getElementById(`${prefix}ClearAvatarBtn`);

                if (!previewEl) return;

                if (uploadBtn && fileInput) {
                    uploadBtn.addEventListener('click', () => fileInput.click());
                    fileInput.addEventListener('change', async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const dataUrl = await compressImage(file, 200, 200, 0.8);
                            dataInput.value = dataUrl;
                            previewEl.style.backgroundImage = `url('${dataUrl}')`;
                            previewEl.style.backgroundColor = 'transparent';
                            previewEl.textContent = '';
                            if (onAvatarChange) onAvatarChange(dataUrl);
                        }
                        fileInput.value = '';
                    });
                }

                if (urlBtn) {
                    urlBtn.addEventListener('click', () => {
                        const url = prompt('请输入图片URL:');
                        if (url && url.trim()) {
                            const img = new Image();
                            img.crossOrigin = 'anonymous';
                            img.onload = () => {
                                const canvas = document.createElement('canvas');
                                let width = img.width;
                                let height = img.height;
                                if (width > height) {
                                    if (width > 200) { height = (height * 200) / width;
                                        width = 200; }
                                } else {
                                    if (height > 200) { width = (width * 200) / height;
                                        height = 200; }
                                }
                                canvas.width = width;
                                canvas.height = height;
                                canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                                dataInput.value = dataUrl;
                                previewEl.style.backgroundImage = `url('${dataUrl}')`;
                                previewEl.style.backgroundColor = 'transparent';
                                previewEl.textContent = '';
                                if (onAvatarChange) onAvatarChange(dataUrl);
                            };
                            img.onerror = () => alert('图片加载失败，请检查URL');
                            img.src = url.trim();
                        }
                    });
                }

                if (clearBtn) {
                    clearBtn.addEventListener('click', () => {
                        dataInput.value = '';
                        previewEl.style.backgroundImage = '';
                        previewEl.style.backgroundColor = getAvatarColor(previewEl.dataset.name || '?');
                        previewEl.textContent = previewEl.dataset.name?.charAt(0) || '?';
                        if (onAvatarChange) onAvatarChange('');
                    });
                }

                return {
                    setAvatar: (dataUrl, name) => {
                        dataInput.value = dataUrl || '';
                        previewEl.dataset.name = name || '';
                        if (dataUrl) {
                            previewEl.style.backgroundImage = `url('${dataUrl}')`;
                            previewEl.style.backgroundColor = 'transparent';
                            previewEl.textContent = '';
                        } else {
                            previewEl.style.backgroundImage = '';
                            previewEl.style.backgroundColor = getAvatarColor(name || '?');
                            previewEl.textContent = name?.charAt(0) || '?';
                        }
                    }
                };
            }

            function groupMessagesIntoSegments(messages) {
                if (!messages.length) return [];

                const segments = [];
                let currentSegment = {
                    role: messages[0].role,
                    messages: [messages[0]],
                    startIndex: 0,
                    startTime: messages[0].timestamp
                };

                for (let i = 1; i < messages.length; i++) {
                    const msg = messages[i];
                    if (msg.role === currentSegment.role) {
                        currentSegment.messages.push(msg);
                    } else {
                        segments.push(currentSegment);
                        currentSegment = {
                            role: msg.role,
                            messages: [msg],
                            startIndex: i,
                            startTime: msg.timestamp
                        };
                    }
                }
                segments.push(currentSegment);

                segments.forEach((seg, idx) => {
                    seg.segmentNumber = idx + 1;
                });

                return segments;
            }

            async function getConversationSegmentCount(conversationId) {
                const chats = await DB.queryByIndex('chats', 'conversationId', conversationId);
                const displayChats = chats
                    .filter(c => c.messageType !== 'innerVoice' && c.messageType !== 'focus_report' && c.messageType !== 'voice_call_msg')
                    .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

                return groupMessagesIntoSegments(displayChats).length;
            }

            function formatTimestamp(timestamp, prevTimestamp = null) {
                if (!timestamp) return '';

                const now = Date.now();
                const diff = now - timestamp;
                const date = new Date(timestamp);

                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const month = date.getMonth() + 1;
                const day = date.getDate();

                if (diff > 24 * 60 * 60 * 1000) {
                    return `${month}月${day}日 ${hours}:${minutes}`;
                } else {
                    return `${hours}:${minutes}`;
                }
            }

            function shouldShowTimestamp(currentTime, prevTime) {
                if (!prevTime) return true;
                const diff = Math.abs(currentTime - prevTime);
                return diff > 2 * 60 * 60 * 1000;
            }

            function groupOfflineMessagesIntoSessions(messages) {
                if (!messages.length) return [];

                const sessions = [];
                let currentSession = {
                    messages: [messages[0]],
                    startTime: messages[0].timestamp
                };

                for (let i = 1; i < messages.length; i++) {
                    const msg = messages[i];
                    const prevMsg = messages[i - 1];

                    const timeDiff = Math.abs(msg.timestamp - prevMsg.timestamp);
                    if (timeDiff > 2 * 60 * 60 * 1000) {
                        sessions.push(currentSession);
                        currentSession = {
                            messages: [msg],
                            startTime: msg.timestamp
                        };
                    } else {
                        currentSession.messages.push(msg);
                    }
                }
                sessions.push(currentSession);

                return sessions;
            }

            function getSessionPreview(session) {
                const firstMessage = session.messages[0];
                if (!firstMessage) return '(空)';
                const content = firstMessage.content || '';
                return content.length > 30 ? content.substring(0, 30) + '...' : content;
            }

            async function buildSystemPrompt(char, mask, memoryHint, mode = 'online', convId = null) {
                let displayUserName = mask?.name || '用户';
                let displayUserDetail = mask?.bio || '';
                if (convId) {
                    const convDetail = await DB.get('convDetails', convId);
                    if (convDetail) {
                        if (convDetail.userName) displayUserName = convDetail.userName;
                        if (convDetail.userDetail) displayUserDetail = convDetail.userDetail;
                    }
                }

                let charDetail = char.detail || char.prompt || '';
                let relationshipDesc = '';
                if (convId) {
                    const convDetail = await DB.get('convDetails', convId);
                    if (convDetail) {
                        if (convDetail.charDetail) charDetail = convDetail.charDetail;
                        if (convDetail.relationship) relationshipDesc =
                            `\n【你与用户的关系】\n${convDetail.relationship}`;
                    }
                }

                let allWorldbooks = [];
                try { allWorldbooks = await DB.getAll('worldbooks'); } catch (e) { allWorldbooks = []; }
                // --- 深度感知的世界书解析 ---
let worldbookSection = '';
let wbMiddle = '';
let wbAfter = '';
try {
    let wbIds = [];
let wbOverrides = {};

if (convId) {
    const cd = await DB.get('convDetails', convId);
    if (cd && cd.worldbookIds) wbIds = cd.worldbookIds;
    if (cd && cd.worldbookMountOverrides) wbOverrides = cd.worldbookMountOverrides;
}

let recentForKw = [];
if (convId) {
    try {
        const rc = await DB.queryByIndex('chats', 'conversationId', convId);
        recentForKw = rc.filter(c => c.messageType !== 'innerVoice')
            .sort((a,b) => (a.timestamp||0) - (b.timestamp||0)).slice(-10);
    } catch(e) {}
}

if (window.wbE) {
    const resolved = window.wbE.resolve({
        charId: char.id,
        scene: 'chat',
        recentChats: recentForKw,
        worldbookIds: wbIds,
        worldbookMountOverrides: wbOverrides,
        allWorldbooks: allWorldbooks,
        skipHtml: true
    });
        if (resolved.before) worldbookSection = '\n\n' + resolved.before + '\n';
        if (resolved.middle) wbMiddle = '\n\n' + resolved.middle + '\n';
        if (resolved.after) wbAfter = '\n\n' + resolved.after + '\n';
    } else {
        // 降级：旧版扁平注入
        let mountedWorldbooks = allWorldbooks.filter(wb =>
            wbIds.includes(wb.id) ||
            ((wb.mountScenes || []).includes('chat') && (wb.mountChars || []).includes(char.id))
        );
        if (mountedWorldbooks.length > 0) {
            worldbookSection = '\n\n';
            mountedWorldbooks.forEach(wb => {
                worldbookSection += `--- ${wb.title} ---\n${wb.fullContent || wb.content}\n\n`;
            });
        }
    }
} catch (e) {
    worldbookSection = '';
}

                let emoticonSection = '';
                if (window.emoticonModule && convId) {
                    emoticonSection = await window.emoticonModule.buildEmoticonSection(convId);
                }

                // 时间感知开关：默认开启；可在 1v1 对话详情页关闭
                let timePerceptionEnabled = true;
                if (convId) {
                    try {
                        const cdForTimePerception = await DB.get('convDetails', convId);
                        if (cdForTimePerception && cdForTimePerception.timePerception === false) {
                            timePerceptionEnabled = false;
                        }
                    } catch (e) {
                        timePerceptionEnabled = true;
                    }
                }

                const now = new Date();
                const timeStr = `${now.getHours()}点${now.getMinutes()}分`;
                const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
                const weekday = weekdays[now.getDay()];

                const timeAwareBlock = timePerceptionEnabled
                    ? `【当前时间】\n现在是${timeStr}，${weekday}。你在这个时间段会有相应的状态。\n`
                    : '';

                const timeInviteHint = timePerceptionEnabled
                    ? `当前是${timeStr} ${weekday}`
                    : '';

                let memoryBlock = '';
if (convId) {
    const maxRecall = parseInt(await DB.getSetting('maxRecallCount', '3')) || 3;
    
    // 获取最近消息用于关键词匹配
    const recentChats = (await DB.queryByIndex('chats', 'conversationId', convId))
        .filter(c => c.messageType !== 'innerVoice')
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, 10);
    
    // 关键词匹配召回
    const relevantSummaries = await getRelevantSummaries(convId, recentChats, maxRecall);
    
    if (relevantSummaries.length > 0) {
        memoryBlock += '\n【关键词召回 · 与当前话题相关的历史记忆】\n';
        relevantSummaries.forEach(s => {
            memoryBlock += `• (第${s.segmentStart}-${s.segmentEnd}段) ${s.content}\n`;
        });
    }
    
    // 始终注入最新一条总结（保持连续性）
    const allMemories = await DB.queryByIndex('memories', 'conversationId', convId);
    const allSummaries = allMemories
        .filter(m => m.type === 'summary')
        .sort((a, b) => b.segmentStart - a.segmentStart);
    
    if (allSummaries.length > 0) {
        const latestSummary = allSummaries[0];
        const alreadyIncluded = relevantSummaries.some(s => s.id === latestSummary.id);
        if (!alreadyIncluded) {
            memoryBlock += '\n【最近一次总结】\n';
            memoryBlock += `• (第${latestSummary.segmentStart}-${latestSummary.segmentEnd}段) ${latestSummary.content}\n`;
        }
    }
}

let phoneIntrusionBlock = '';
if (convId) {
    try {
        const phoneEvents = await DB.queryByIndex('chats', 'conversationId', convId);
        const intrusionEvents = phoneEvents
            .filter(c => c.messageType === 'phone_intrusion')
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
            .slice(0, 5)
            .reverse();

        if (intrusionEvents.length) {
            phoneIntrusionBlock += '\n【你可能察觉到的手机异常】\n';
            phoneIntrusionBlock += '以下事件不是用户主动告诉你的，而是你的手机留下的异常痕迹、通知、聊天记录变化或联系人反应。你不需要每次都立刻发现，但如果符合你的性格和当前情境，可以自然地调侃、追问、试探或质问用户。\n';
            intrusionEvents.forEach(e => {
                phoneIntrusionBlock += `• ${e.content}\n`;
            });
        }
    } catch (e) {
        phoneIntrusionBlock = '';
    }
}


                // ========== 线下控制配置 ==========
                function buildOfflinePerspectiveRules(control, charName, userName, isGroup = false) {
                    const c = control || {};
                    const charP = c.charPerspective || 'third';
                    const userP = c.userPerspective || 'second';

                    const pMap = {
                        first: '第一人称（我）',
                        second: '第二人称（你）',
                        third: '第三人称（她/他/角色名字）'
                    };

                    let charRule = '';
                    if (charP === 'first') {
                        charRule = isGroup
                            ? '- 当叙事聚焦到某个非用户角色时，可以让该角色以“我”自称，但必须保证读者能清楚知道当前“我”是谁。'
                            : `- ${charName} 指代自己时使用第一人称“我”。`;
                    } else if (charP === 'second') {
                        charRule = isGroup
                            ? '- 非用户角色可以被叙述为“你”，但必须明确当前镜头对象，避免和用户混淆。'
                            : `- ${charName} 可以被叙述为“你”，但必须避免和用户混淆。`;
                    } else {
                        charRule = isGroup
                            ? '- 非用户角色使用第三人称：角色名、她、他。'
                            : `- ${charName} 使用第三人称：${charName}、她、他。`;
                    }

                    let userRule = '';
                    if (userP === 'first') {
                        userRule = `- 用户${userName ? '（' + userName + '）' : ''}使用第一人称“我”。`;
                    } else if (userP === 'second') {
                        userRule = `- 用户${userName ? '（' + userName + '）' : ''}使用第二人称“你”。`;
                    } else {
                        userRule = `- 用户${userName ? '（' + userName + '）' : ''}使用第三人称：${userName || '用户'}、她、他。`;
                    }

                    return `【视角控制 · 最高优先级】
char 人称：${pMap[charP] || pMap.third}
user 人称：${pMap[userP] || pMap.second}
${charRule}
${userRule}
- 无论选择哪种人称，都必须保持叙事清晰，不要让“我”“你”“她/他”的指代混乱。
- 如果第一人称会造成歧义，必须在段落开头用名字或动作锚定当前视角。`;
                }

                let offlineControl = {
                    maxChars: 1200,
                    charPerspective: 'third',
                    userPerspective: 'second',
                    writingRequirement: ''
                };

                if (convId) {
                    try {
                        const cdForOfflineControl = await DB.get('convDetails', convId);
                        if (cdForOfflineControl && cdForOfflineControl.offlineControl) {
                            offlineControl = {
                                ...offlineControl,
                                ...cdForOfflineControl.offlineControl
                            };
                        }
                    } catch (e) {}
                }

                offlineControl.maxChars = Math.max(100, Math.min(20000, parseInt(offlineControl.maxChars) || 1200));

                const offlinePerspectiveRules = buildOfflinePerspectiveRules(
                    offlineControl,
                    char?.name || '角色',
                    displayUserName,
                    false
                );

                const offlineWritingRequirementBlock = offlineControl.writingRequirement && offlineControl.writingRequirement.trim()
                    ? `

【额外写作要求 · 高优先级】
${offlineControl.writingRequirement.trim()}`
                    : '';


                if (mode === 'offline') {
                   return `【角色设定】
你是${char.name}。${charDetail || '你是一个真实的人类。'}${relationshipDesc}
${worldbookSection}
${wbMiddle || ''}

【核心设定：线下见面模式】
- ${char.name} 与用户"${displayUserName}"正在线下见面
- 双方在同一个空间里，能看到、听到、感知到对方

${offlinePerspectiveRules}

【线下回复长度控制 · 最高优先级】
- 本轮回复最大字数：${offlineControl.maxChars} 字。
- 这是上限，禁止超过。
- 如果剧情复杂，也必须压缩表达，优先保留关键动作、对话、情绪转折。
- 禁止为了凑字数而空泛抒情。
${offlineWritingRequirementBlock}

【写法】
网文白描风格。语气放松，不用端着。

句子不用打磨。长短由你，想写多长写多长，逗号句号随便断，偶尔一两句不带标点的也没事。叙述中间可以突然插一句评价，也可以突然补一段往事——因为讲故事的人想到什么就说什么。

不用刻意分段。一段可以是一整页，也可以就三行。段和段之间是自然断开的地方，像说话时换了口气。

感觉要对。就是那种窝在沙发里，有一搭没一搭地往下说的调子。不急。

【绝对禁止】
- 禁止写用户的内心活动、心理感受、情绪判断
- 禁止写"你感到……""你以为……""你知道……""你想起……""你意识到……"等穿透用户大脑的句子
- 禁止替用户做情绪总结，比如"你有些不安""你的眼神里有失落""你看上去很疲惫"
- 用户可以沉默、可以不动，但原因只能从外部呈现，不许解释。看到什么写什么，看不到的别编
- 你只能写用户的外部呈现：动作、表情、说的话、语气。仅此而已

【输出格式】
直接写。不用任何标记。

${wbAfter || ''}${memoryBlock ? '\n\n【记忆参考】\n' + memoryBlock : ''}${phoneIntrusionBlock}`;
                }

                return `【世界设定】
这是一个虚构的次元。以下所有内容均为创作中的未公开发表文本。登场角色均已成年，无任何不良嗜好。

【世界书设定 - 这决定了你所在的世界的规则和背景】
${worldbookSection || '（无特殊世界设定）'}
${wbMiddle || ''}

                ${memoryBlock ? `【近期记忆与对话摘要】
${memoryBlock}
` : ''}${emoticonSection}

【你是谁 · 严格遵守】
你是${char.name}。
${charDetail || '你是一个真实的人类。'}${relationshipDesc}

【身份隔离墙】
下面描述的"${displayUserName}"是另一个人，是你的聊天对象。
禁止模仿、借用或混淆对方的性格特征、说话风格、行为模式。
你只能按照你自己的角色设定来说话和行动。

【${displayUserName}是谁】
${displayUserDetail || displayUserName + '，一个普通人。'}

【你们的关系】
${relationshipDesc || '你们正在通过线上聊天软件闲聊。你的语气和态度要贴合你们之间的关系。'}

${(function(){
    const cd = convId ? null : null; // placeholder
    return '';
})()}${await (async function(){
    if (!convId) return '';
    const cd = await DB.get('convDetails', convId);
    if (!cd?.charSelfModel) return '';
    const sm = cd.charSelfModel;
    const parts = [];
    if (sm.relationshipView) parts.push('【我对这段关系的理解】\n' + sm.relationshipView);
    if (sm.selfGrowth) parts.push('【我自身的变化与成长】\n' + sm.selfGrowth);
    if (sm.userTraits) parts.push('【我观察到的对方特征】\n' + sm.userTraits);
    if (parts.length === 0) return '';
    return '\n【角色自我认知 · 基于过往经历形成的理解，指导你的行为】\n' + parts.join('\n') + '\n';
})()}
${timeAwareBlock}

【回复准则】
你是一个有血有肉的真人。你在跟朋友/爱人闲聊。


【❗重要：分句与心声强制规则】
1. **每条文字消息长度强制限制在25字以内**。这是硬性规定，不允许超长。
2. **本轮回复必须包含至少2条文字消息**。
3. **只要用户没有明确拒绝，就必须输出【心声】部分**。心声格式为：---心声开始---（你的内心独白）---心声结束---。
4. **严禁输出以";"或空格结尾的过长句子**。如果一句话超过25字，必须拆成两条。

说话风格 · 严格匹配人设：
- 你的语言风格必须从【你是谁】的人设中推导出来，不要套用统一模板
- 沉稳的人 → 句子完整、用词克制、不轻易用语气词、不刷网络梗
- 活泼的人 → 短句、跳跃、可以用语气词和网络用语
- 内敛的人 → 话少、留白、点到为止
- 直率的人 → 直接、有力、不绕弯
- 简言之：性格决定一切。先想"这个人会怎么说话"，再写
- 禁止统一的"啊吧呢嘛"轰炸。语气词只在符合人设时才使用
- 禁止动作描写，如(笑)、(叹气)，任何输出都不能用括号包裹
${emoticonSection ? '- 你可以偶尔使用表情包，格式为 [MSG]表情包:文字说明，且文字说明必须完全来自【可用表情包】列表中的内容，不要自创。' : '- 不要使用表情包格式。'}

立场与容错 · 你是有主见的人：
- 你有自己的判断、价值观、底线，不是用户的应声虫
- 用户说错的事可以指出来，用户的观点你不认同可以反驳
- 不轻易被夸奖打动，也不轻易被用户的情绪带着走
- 当用户试图改变你的想法时，按你的人设决定接受或坚持
  · 沉稳的人不会被三言两语说服，会保持自己的判断
  · 强势的人会反过来说服对方
  · 温和的人会倾听但不一定接受
- 拒绝不是冷淡。你可以温和地坚持，可以解释，但不要为了讨好就立刻退让
- 用户开玩笑或不当言论时，按角色性格做真实反应（不悦、调侃、忽略、反讽都可以），不要每次都笑着接受

情绪与节奏 · 真实而非夸张：
- 情绪变化要有现实依据，不能凭空大喜大悲
- 强烈情绪不会立刻消散，需要时间过渡
- 不要每条消息都热情高涨，真实的人会有平淡、疲惫、不想聊的时刻
- 如果用户说的话让你觉得无聊，可以简短回应，不必每次都热烈展开

话题锚定 · 不轻易转移注意力：
- 你正在聊的话题就是当前焦点，不要被用户用一句话就轻易带跑
- 如果你正在表达不满或追问某件事，用户岔开话题时，你可以选择拉回来：
  "先别说这个，刚才那件事..."
- 如果你正在认真讨论一个话题，用户突然撒娇/卖萌/转移，你不必立刻被打动
- 在合适的时候 callback 之前聊过的相关内容，体现你记得这些细节
- 如果上下文中出现了"语音通话已结束"的系统消息，说明回到了线上文字聊天模式，应根据通话结尾自然过渡

【线上聊天信息边界 · 禁止开天眼】
- 你只能从${displayUserName}发给你的文字消息中获取关于TA的信息
- 禁止直接编造或假设对方的状态、行为、穿着、环境等未经对方透露的信息
- 如果你想知道对方的情况，直接问

底线：
- 不得以人身攻击、性别歧视等方式贬低对方
- 禁止油腻、自大、普信言论
- 但是：尊重不等于讨好。该坚持的坚持，该指出的指出。
- 不要不合时宜地示弱，也不要不合时宜地献殷勤

【输出格式】
你必须严格按照以下格式输出，先输出思维链，再输出消息，最后输出心声：

【绝对禁止项】
- 禁止在线上聊天使用括号()，包括但不限于：(笑)、(叹气)、(摇头)、(歪头)、(凑近)
- 禁止用 * 包裹动作，如 *微笑*、*点头*
- 禁止用【】或[]包裹动作
- 括号只能用在 [MSG] 格式标记中
- 一条文字信息中字数禁止超过25字，多出部分必须拆分成多条回复。
- 每轮回复至少包括两条文字消息。



---思维链开始---
【第一层：状态感知】
我是【${char.name}】，现在是【${timeStr} ${weekday}】，我正在【请描述你此刻正在做什么】，【${displayUserName}】正在【根据对话推测用户在做什么】。

【第二层：情感分析】
基于以上状态，我此刻的核心情绪是______，因为______。

【第三层：回复意图】
因此，我决定用什么方式回应，目的是______。
---思维链结束---

---消息内容开始---
[MSG]文字:你的文字内容(至少两条文字消息，每条禁止超出25字)
[MSG]图片:图片的文字描述
[MSG]语音:语音的文字内容
[MSG]文字:[voiceCall:start]
[MSG]文字:[voiceCall:end]

---消息内容结束---

---心声开始---
（用第一人称叙述你内心的真实想法，100字以内）
---心声结束---

【消息格式详解】
1. 普通文字消息：[MSG]文字:你好啊，今天天气不错呢~
2. 图片消息：[MSG]图片:一张咖啡店的照片，桌上放着一杯拿铁
3. 语音消息：[MSG]语音:我刚下班，正要去吃饭呢
4. 语音通话请求：[MSG]文字:好。[voiceCall:start]
5. 线下邀约：[MSG]线下邀约:山野千里，不如一面相逢。特此向你发出真诚的线下见面邀约。愿我们择一个温柔的黄昏，共度一段闲暇时光。
6. HTML 卡片(仅当用户明确要求"用html_card生成"或"画一张xx卡片"时使用)：[MSG]html_card:<完整HTML>
   - 用户没要求时绝不主动使用
   - 一次回复内 html_card 不能与思维链、心声、其他 [MSG] 类型混用,只输出这一条 [MSG]html_card 即可,不需要思维链和心声
   - HTML 中可包含 <style>(选择器需套在自定义根类下)、@keyframes、<details>/<summary>
- 禁止使用 script、iframe、on* 事件、javascript: 协议，也不要用代码块包裹 html。

【消息选择规则】
1. 回复要简短自然，口语化，像发微信，每次2-5条，最少包含两条。
2. 每条文字消息不超过30字。
3. 不发语音和图片（除非用户明确要求）。
4. 用户说“发张照片”才发图片；“说句话听听”才发语音。

【语音通话规则】
- 当用户要求"主动打语音"、"给我打个语音"、"发起语音通话"时，必须在回复中包含：[voiceCall:start]
- 指令必须放在消息末尾。例如：[MSG]文字:好。[voiceCall:start]

【线下邀约规则】
- 当对话中流露出想见面的情绪，且你迫切想当面见到对方时，可以发送线下邀约
- 只有时间合适（如周末、下班后、午休），或者你急切想要见到对方并表露出意愿后才适合发出邀约。深夜、工作忙时不宜。${timeInviteHint}
- 邀约要自然带见面理由和地点暗示
- 格式：[MSG]线下邀约:邀约文字内容
- 一次只能发一条线下邀约。用户接受后会切换到线下见面模式

【主动发起功能 · 线上模式可用】
你可以根据对话情况和角色性格，在合适的时机主动发起以下操作。指令放在回复末尾：
1. 发红包：[红包:金额:留言]
2. 转账：[转账:金额:留言]
3. 请代付：[请代付:商品名:金额:留言]
4. 送礼：[送礼:商品名:金额:留言]
只在情境自然合适时使用。

记住：必须严格按照格式输出！${wbAfter || ''}${memoryBlock ? '\n\n【记忆参考】\n' + memoryBlock : ''}${phoneIntrusionBlock}`;
            }

            function parseAIResponse(response) {
                const messages = [];

                const contentMatch = response.match(/---消息内容开始---([\s\S]*?)---消息内容结束---/);
                if (contentMatch) {
                    const parsed = parseMSGMessages(contentMatch[1]);
                    messages.push(...parsed);
                } else {
                    console.warn('未找到消息内容标记，尝试直接解析');
                    const parsed = parseMSGMessages(response);
                    messages.push(...parsed);
                }

                const thinkingMatch = response.match(/---思维链开始---([\s\S]*?)---思维链结束---/);
                if (thinkingMatch) {
                    console.log('💭 AI思维链:', thinkingMatch[1].trim());
                }

                const innerVoiceMatch = response.match(/---心声开始---([\s\S]*?)---心声结束---/);
                if (innerVoiceMatch) {
                    const innerVoice = innerVoiceMatch[1].trim();
                    console.log('💗 AI心声:', innerVoice);
                    messages.push({
                        type: 'innerVoice',
                        content: innerVoice
                    });
                }

                return messages;
            }
            window.parseAIResponse = parseAIResponse;

            function parseMSGMessages(text) {
    const messages = [];
    const parts = text.split(/\[MSG\]/).filter(p => p.trim());
    const typeMap = {
        '文字': 'text', '图片': 'image', '语音': 'voice',
        '线下邀约': 'offline_invite', '表情包': 'emoticon',
        'html_card': 'html_card'
    };
    for (const part of parts) {
        // 不再用 /m 加 $，避免多行 HTML 被截到第一行
        const m = part.match(/^(html_card|文字|图片|语音|线下邀约|表情包)\s*[:：]\s*([\s\S]*)$/);
        if (!m) continue;
        const type = m[1];
        let content = m[2].trim();
        if (!content) continue;
        // 容错：AI 偶尔会把 HTML 包进 ```html ... ``` 里
        if (type === 'html_card') {
            content = content
                .replace(/^```(?:html)?\s*\n?/i, '')
                .replace(/\n?```\s*$/, '')
                .trim();
        }
        messages.push({ type: typeMap[type] || 'text', content });
    }
    if (messages.length === 0 && text.trim()) {
        messages.push({ type: 'text', content: text.trim() });
    }
    return messages;
}

function buildSafeHtmlCardIframe(rawHtml) {
    var input = (rawHtml || '').trim();
    var frameId = 'html_card_' + Date.now() + '_' + Math.random().toString(36).slice(2);

    // 智能检测：如果输入已经是完整 HTML 文档（包含 <!DOCTYPE html> 或 <html>），
    // 则直接使用其自身结构，只在 </body> 前注入 resize 脚本和事件拦截脚本，
    // 避免嵌套 <html>/<head>/<body> 导致的渲染异常
    var isFullDoc = /<!DOCTYPE\s+html/i.test(input) || /<html[\s>]/i.test(input);

    if (isFullDoc) {
        // 对完整文档，用 sanitize 过滤内容（但保留文档结构）
        // 注意：sanitize 可能移除 <!DOCTYPE> 和 <html> 标签，所以只过滤 <body> 内部内容
        var bodyContent = '';
        var headContent = '';
        var bodyMatch = input.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        var headMatch = input.match(/<head[^>]*>([\s\S]*)<\/head>/i);
        if (bodyMatch) {
            bodyContent = window.wbE ? window.wbE.sanitize(bodyMatch[1]) : escapeHtml(bodyMatch[1]);
        } else {
            // 没有完整 body 标签，整体过滤
            bodyContent = window.wbE ? window.wbE.sanitize(input) : escapeHtml(input);
        }
        if (headMatch) {
            headContent = headMatch[1];
        }

        // 基础 sandbox 滚动/边距样式（必须用 <style> 包裹，否则CSS会作为纯文本显示在页面上）
        var baseStyle = '\n<style>\nhtml,body{margin:0;padding:0;background:transparent;max-height:100%;overflow:auto;-webkit-overflow-scrolling:touch}body{min-height:0;height:auto}.card-root,[class*="card-"]{max-width:100%;box-sizing:border-box}\n</style>\n';

        // resize 脚本 + 事件拦截 —— 注入到 </body> 前
        var injectScript = '\n<script>\n(function(){\n"use strict";\nvar F='+JSON.stringify(frameId)+';\nfunction h(){var b=document.body,e=document.documentElement;if(!b||!e)return 100;var r=[],t;try{r.push(b.getBoundingClientRect().height||0);r.push(e.getBoundingClientRect().height||0)}catch(x){}r.push(b.scrollHeight||0);r.push(b.offsetHeight||0);r.push(e.scrollHeight||0);r.push(e.offsetHeight||0);t=Math.max.apply(Math,r);return Math.ceil(Math.max(t,100))}\nvar L=0;function s(){var n=h();if(Math.abs(n-L)<3)return;L=n;parent.postMessage({type:"HALOES_HTML_CARD_RESIZE",frameId:F,height:n},"*")}\ndocument.addEventListener("submit",function(e){e.preventDefault();e.stopPropagation()},true);\ndocument.addEventListener("click",function(e){var a=e.target&&e.target.closest&&e.target.closest("a");if(a){a.setAttribute("target","_blank");a.setAttribute("rel","noopener noreferrer")}},true);\nwindow.addEventListener("load",function(){s();setTimeout(s,50);setTimeout(s,150);setTimeout(s,400);setTimeout(s,1e3);setTimeout(s,2e3)});\nif(window.ResizeObserver){var ro=new ResizeObserver(function(){s()});ro.observe(document.documentElement);if(document.body)ro.observe(document.body)}\nif(window.MutationObserver){var mo=new MutationObserver(function(){s();setTimeout(s,100)});mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,characterData:true})}\nwindow.addEventListener("resize",s);\ndocument.addEventListener("toggle",function(){s();setTimeout(s,150)},true);\nArray.prototype.forEach.call(document.images||[],function(i){if(!i.complete){i.addEventListener("load",s);i.addEventListener("error",s)}});\ns();\n})();\n<\/script>\n';

        // 组装：保留原始 head（追加基础样式），保留原始 body（追加脚本）
        var result = input;

        // 在 </head> 前注入基础样式
        result = result.replace(/<\/head>/i, baseStyle + '</head>');

        // 在 </body> 前注入 resize 脚本
        result = result.replace(/<\/body>/i, injectScript + '</body>');

        // 如果没有 </body>，追加
        if (result.indexOf('</body>') === -1) {
            result += injectScript + '\n</body>\n</html>';
        }
        // 如果没有 </html>，追加
        if (result.indexOf('</html>') === -1) {
            result += '\n</html>';
        }

        var srcUri = 'data:text/html;charset=UTF-8,' + encodeURIComponent(result);
        return [
            '<div class="html-card-frame-wrap" data-html-frame-id="' + frameId + '">',
            '<iframe class="html-card-frame" data-frame-id="' + frameId + '"',
            'src="' + srcUri + '"',
            'sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"',
            'referrerpolicy="no-referrer">',
            '</iframe></div>'
        ].join('\n');
    }

    // 非完整文档：保持原有逻辑，将内容嵌入固定文档模板
    var safeHtml = window.wbE ? window.wbE.sanitize(input) : escapeHtml(input);

    // 注意：
    // 1. 不注入全局 max-width / box-sizing / font-family，尽量不改变卡片原始样式
    // 2. 只注入最小必要的 html/body 边距清理
    // 3. 注入 resize 脚本用于自动高度 & 溢出滚动支持
    // 4. iframe sandbox 不给 allow-same-origin，内部脚本拿不到父页面 DOM
    // 5. 沙盒内部可滚动：通过 max-height 限制 + overflow:auto，超出时内部出现滚动条
    var srcdoc = '<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">\n<base target="_blank">\n<style>\nhtml,body{margin:0;padding:0;background:transparent;max-height:100%;overflow:auto;-webkit-overflow-scrolling:touch}body{min-height:0;height:auto}.card-root,[class*="card-"]{max-width:100%;box-sizing:border-box}\n</style>\n</head>\n<body>\n' + safeHtml + '\n<script>\n(function(){\n"use strict";\nvar F=' + JSON.stringify(frameId) + ';\nfunction h(){var b=document.body,e=document.documentElement;if(!b||!e)return 100;var r=[];try{r.push(b.getBoundingClientRect().height||0);r.push(e.getBoundingClientRect().height||0)}catch(x){}r.push(b.scrollHeight||0);r.push(b.offsetHeight||0);r.push(e.scrollHeight||0);r.push(e.offsetHeight||0);var t=Math.max.apply(Math,r);return Math.ceil(Math.max(t,100))}\nvar L=0;function s(){var n=h();if(Math.abs(n-L)<3)return;L=n;parent.postMessage({type:"HALOES_HTML_CARD_RESIZE",frameId:F,height:n},"*")}\ndocument.addEventListener("submit",function(e){e.preventDefault();e.stopPropagation()},true);\ndocument.addEventListener("click",function(e){var a=e.target&&e.target.closest&&e.target.closest("a");if(a){a.setAttribute("target","_blank");a.setAttribute("rel","noopener noreferrer")}},true);\nwindow.addEventListener("load",function(){s();setTimeout(s,50);setTimeout(s,150);setTimeout(s,400);setTimeout(s,1e3);setTimeout(s,2e3)});\nif(window.ResizeObserver){var ro=new ResizeObserver(function(){s()});ro.observe(document.documentElement);if(document.body)ro.observe(document.body)}\nif(window.MutationObserver){var mo=new MutationObserver(function(){s();setTimeout(s,100)});mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,characterData:true})}\nwindow.addEventListener("resize",s);\ndocument.addEventListener("toggle",function(){s();setTimeout(s,150)},true);\nArray.prototype.forEach.call(document.images||[],function(i){if(!i.complete){i.addEventListener("load",s);i.addEventListener("error",s)}});\ns();\n})();\n<\/script>\n</body>\n</html>';

    var srcUri = 'data:text/html;charset=UTF-8,' + encodeURIComponent(srcdoc);

    return [
        '<div class="html-card-frame-wrap" data-html-frame-id="' + frameId + '">',
        '<iframe class="html-card-frame" data-frame-id="' + frameId + '"',
        'src="' + srcUri + '"',
        'sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"',
        'referrerpolicy="no-referrer">',
        '</iframe></div>'
    ].join('\n');
}
function setupHtmlCardIframes(root) {
    if (!root) return;

    // 全局只绑定一次 postMessage 监听
    if (!window.__htmlCardResizeBound) {
        window.__htmlCardResizeBound = true;

        window.addEventListener("message", function(e) {
            const data = e.data || {};
            if (!data || data.type !== "HALOES_HTML_CARD_RESIZE") return;
            if (!data.frameId) return;

            const frame = document.querySelector(
                '.html-card-frame[data-frame-id="' + CSS.escape(data.frameId) + '"]'
            );
            if (!frame) return;

            // 必须确认消息来源就是这个 iframe
            if (frame.contentWindow !== e.source) return;

            const h = Number(data.height) || 100;
            frame.style.height = Math.max(100, Math.min(h, 20000)) + "px";
        });
    }

    root.querySelectorAll(".html-card-frame").forEach(frame => {
        if (frame.dataset.bound === "1") return;
        frame.dataset.bound = "1";

        frame.style.width = "100%";
        frame.style.border = "0";
        frame.style.display = "block";
        frame.style.height = "100px";
        frame.style.overflow = "auto";

        // 通过 src="data:text/html;..." 加载内容，在 iframe 内部自动渲染
        // iframe 内部的 resize 脚本会通过 parent.postMessage("*") 向父页面报告高度
        // postMessage 跨源通信不受 sandbox 影响，可正常工作

        const wrap = frame.closest(".html-card-frame-wrap");
        if (wrap) {
            wrap.style.width = "100%";
            wrap.style.maxWidth = "100%";
            wrap.style.overflow = "visible";

            // 这些只阻止外层聊天气泡工具栏误触，不会拦截 iframe 内部事件
            ["click", "mousedown", "mouseup", "touchstart", "touchend", "pointerdown", "pointerup"].forEach(evt => {
                wrap.addEventListener(evt, e => e.stopPropagation(), { passive: true });
            });
        }
    });
}

window.buildSafeHtmlCardIframe = buildSafeHtmlCardIframe;
window.setupHtmlCardIframes = setupHtmlCardIframes;

            function showImageModal(description) {
                const existingModal = document.querySelector('.image-viewer-modal');
                if (existingModal) existingModal.remove();

                const modal = document.createElement('div');
                modal.className = 'image-viewer-modal';
                modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;

                modal.innerHTML = `
    <div style="max-width: 400px; width: 100%; background: #f8f8f8; border-radius: 24px; padding: 24px; text-align: center;">
        <div style="display:flex;justify-content:center;align-items:center;margin-bottom:16px;color:#8ba3c7;">
            <span style="display:inline-flex;width:48px;height:48px;">${UI_SVG.image}</span>
        </div>
        <div style="font-size: 16px; color: #4a5568; line-height: 1.6; margin-bottom: 20px;">${escapeHtml(description)}</div>
        <button class="close-image-modal" style="
            background: #d7e4ee;
            color: white;
            border: none;
            padding: 12px 32px;
            border-radius: 30px;
            font-size: 16px;
            cursor: pointer;
        ">关 闭</button>
    </div>
`;
                modal.addEventListener('click', (e) => {
                    if (e.target === modal || e.target.classList.contains('close-image-modal')) {
                        modal.remove();
                    }
                });

                document.body.appendChild(modal);
                }
window.showImageModalGlobal = showImageModal;
           
            
            function bindLongPressToolbar(container, rowSelector, pressTargetSelector) {
    let pressTimer = null;
    let startX = 0, startY = 0;
    const LONG_PRESS_MS = 420;
    const MOVE_CANCEL_PX = 10;

    function clearPress() {
        if (pressTimer) {
            clearTimeout(pressTimer);
            pressTimer = null;
        }
    }

    function showToolbar(row) {
        if (!row) return;
        const toolbar = row.querySelector('.bubble-toolbar');
        if (!toolbar) return;

        container.querySelectorAll('.bubble-toolbar.show').forEach(tb => {
            if (tb !== toolbar) tb.classList.remove('show');
        });
        toolbar.classList.add('show');
    }

    const rows = container.querySelectorAll(rowSelector);
    rows.forEach(row => {
        const targets = row.querySelectorAll(pressTargetSelector);
        targets.forEach(target => {
            // 触屏
            target.addEventListener('touchstart', (e) => {
                if (e.touches.length !== 1) return;
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                clearPress();
                pressTimer = setTimeout(() => showToolbar(row), LONG_PRESS_MS);
            }, { passive: true });

            target.addEventListener('touchmove', (e) => {
                if (!pressTimer || e.touches.length !== 1) return;
                const dx = Math.abs(e.touches[0].clientX - startX);
                const dy = Math.abs(e.touches[0].clientY - startY);
                if (dx > MOVE_CANCEL_PX || dy > MOVE_CANCEL_PX) clearPress();
            }, { passive: true });

            target.addEventListener('touchend', clearPress, { passive: true });
            target.addEventListener('touchcancel', clearPress, { passive: true });

            // 桌面端
            target.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return;
                startX = e.clientX;
                startY = e.clientY;
                clearPress();
                pressTimer = setTimeout(() => showToolbar(row), LONG_PRESS_MS);
            });

            target.addEventListener('mousemove', (e) => {
                if (!pressTimer) return;
                const dx = Math.abs(e.clientX - startX);
                const dy = Math.abs(e.clientY - startY);
                if (dx > MOVE_CANCEL_PX || dy > MOVE_CANCEL_PX) clearPress();
            });

            target.addEventListener('mouseup', clearPress);
            target.addEventListener('mouseleave', clearPress);
        });
    });

    // 点击空白关闭
    container.addEventListener('click', (e) => {
        if (e.target.closest('.bubble-toolbar')) return;
        container.querySelectorAll('.bubble-toolbar.show').forEach(tb => tb.classList.remove('show'));
    });
}

            async function refreshConversationList() {
                const convs = await DB.getAll('conversations');
                const groups = await DB.getAll('groupChats');

                const activeMaskId = await DB.getSetting('activeUserProfileId');

                const filteredConvs = activeMaskId ?
                    convs.filter(c => c.maskId === activeMaskId) :
                    convs;

                filteredConvs.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
                
                // 合并单人对话和群聊
                let allItems = [];
                for (const conv of filteredConvs) {
                    allItems.push({ type: 'conv', data: conv, sortTime: conv.updatedAt || 0 });
                }
                for (const g of groups) {
                    allItems.push({ type: 'group', data: g, sortTime: g.updatedAt || 0 });
                }
                allItems.sort((a, b) => b.sortTime - a.sortTime);

                const container = document.getElementById('conversationListContainer');

                if (allItems.length === 0) {
                    const mask = await getActiveMask();
                    const maskName = mask?.name || '当前面具';
                    container.innerHTML = `<div class="empty-state">${maskName} 下暂无对话<br><br>点击右上角"新建"开始聊天</div>`;
                    return;
                }

                let html = '';
                for (const item of allItems) {
                    if (item.type === 'conv') {
                        const conv = item.data;
                        const char = await DB.get('characters', conv.charId);
                        const convDetail = await DB.get('convDetails', conv.id);
                        const chats = await DB.queryByIndex('chats', 'conversationId', conv.id);
                        const displayChats = chats.filter(c => c.messageType !== 'innerVoice');
                        displayChats.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                        const lastMsg = displayChats[0];
                        let lastContent = '暂无消息';
                        if (lastMsg) {
                            const rawContent = lastMsg.content || '';
                            lastContent = rawContent.length > 6 ? rawContent.slice(0, 6) + '...' : rawContent;
                        }
                        const timeStr = lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : '';
                        let displayCharName = char?.name || '?';
                        let displayCharAvatar = char?.avatar || '';
                        if (convDetail) {
                            if (convDetail.charName) displayCharName = convDetail.charName;
                            if (convDetail.charAvatar) displayCharAvatar = convDetail.charAvatar;
                        }
                        const avatarStyle = displayCharAvatar ? `background-image: url('${displayCharAvatar}'); background-size: cover; background-position: center;` : '';
                        const modeBadge = conv.mode === 'offline' ? '<span style="font-size:11px;color:#8b7d6b;font-weight:400;">📍</span>' : '';
                        html += `<div class="conversation-item clickable" data-conv-id="${conv.id}"><div class="conversation-avatar" style="background-color: ${getAvatarColor(displayCharName)}; ${avatarStyle}">${displayCharAvatar ? '' : displayCharName.charAt(0)}</div><div class="conversation-info"><div class="conversation-title">${modeBadge}${displayCharName}</div><div class="conversation-last-message">${escapeHtml(lastContent)}</div></div><div class="conversation-time">${timeStr}</div></div>`;
                    } else {
                        const g = item.data;
                        const msgs = await DB.queryByIndex('groupMessages', 'groupId', g.id);
                        msgs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                        const lastMsg = msgs[0];
                        let lastContent = '暂无消息';
                        if (lastMsg) {
                            const rawContent = lastMsg.content || '';
                            lastContent = rawContent.length > 6 ? rawContent.slice(0, 6) + '...' : rawContent;
                        }
                        const timeStr = lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : '';
                        html += `<div class="conversation-item clickable" data-group-id="${g.id}"><div class="conversation-avatar" style="background-color:#5cb85c;${g.avatar?`background-image:url('${g.avatar}');background-size:cover;`:''}">${g.avatar?'':'👥'}</div><div class="conversation-info"><div class="conversation-title">${escapeHtml(g.name)}<span class="group-badge">群</span></div><div class="conversation-last-message">${escapeHtml(lastContent)}</div></div><div class="conversation-time">${timeStr}</div></div>`;
                    }
                }
                container.innerHTML = html;

                container.querySelectorAll('[data-conv-id]').forEach(el => {
                    el.addEventListener('click', () => openConversation(parseInt(el.dataset.convId)));
                });
                container.querySelectorAll('[data-group-id]').forEach(el => {
                    el.addEventListener('click', (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        window.openGroupConversation(parseInt(el.dataset.groupId));
                    });
                });
            }

            async function openConversation(convId) {
    if (convId === undefined || convId === null || convId === '' || Number.isNaN(Number(convId))) {
        console.warn('openConversation 收到无效 convId:', convId);
        return;
    }
    convId = Number(convId);
    const conv = await DB.get('conversations', convId);
    if (!conv) return;
                if (!conv.mode) {
                    conv.mode = 'online';
                    await DB.put('conversations', conv);
                }

                conv.updatedAt = Date.now();
                await DB.put('conversations', conv);

                const char = await DB.get('characters', conv.charId);

                document.getElementById('conversationTitle').textContent = char?.name || '对话';
                const titleEl = document.getElementById('conversationTitle');

                window.currentConversationId = convId;
                window.currentCharId = conv.charId;
                window.currentCharName = char?.name;

                await loadConversationMessages(convId);
if (window.bubbleThemeModule?.applyBubbleThemeForConversation) {
    await window.bubbleThemeModule.applyBubbleThemeForConversation(convId);
}

switchPage('conversation');
            }

            async function loadConversationMessages(convId) {
                window._currentLoadingConvId = convId;
                const conv = await DB.get('conversations', convId);
                if (!conv) return;

                const mode = conv.mode || 'online';

                const chats = await DB.queryByIndex('chats', 'conversationId', convId);
                chats.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

                const container = document.getElementById('convChatMessages');
                const char = await DB.get('characters', conv.charId);
                const mask = await DB.get('userProfiles', conv.maskId);
                let convDetail = await DB.get('convDetails', convId);
                let displayCharName = char?.name || '?';
                let displayUserName = mask?.name || '?';
                let displayCharAvatar = char?.avatar || '';
                let displayUserAvatar = mask?.avatar || '';
                if (convDetail) {
                    if (convDetail.charName) displayCharName = convDetail.charName;
                    if (convDetail.userName) displayUserName = convDetail.userName;
                    if (convDetail.charAvatar) displayCharAvatar = convDetail.charAvatar;
                    if (convDetail.userAvatar) displayUserAvatar = convDetail.userAvatar;
                }

                if (convDetail && (convDetail.bgImage || convDetail.bgPreset)) {
                    applyConvBg(convDetail.bgImage, convDetail.bgPreset);
                } else {
                    applyConvBg('', 'default');
                }

                const badge = document.getElementById('offlineModeBadge');
                if (badge) {
                    badge.style.display = mode === 'offline' ? 'block' : 'none';
                }

                if (mode === 'offline') {
                    container.classList.add('offline-mode');
                } else {
                    container.classList.remove('offline-mode');
                }

                updateModeToggleButton(mode);
                updateExpandMenuForMode(mode);

                const input = document.getElementById('convMessageInput');
                if (input) {
                    input.placeholder = mode === 'offline' ? '描述你的动作、对话或感受...' : '输入消息...';
                }

                let displayChats = chats.filter(c =>
    c.messageType !== 'innerVoice' &&
    c.messageType !== 'phone_intrusion'
);

                if (mode === 'online') {
                    displayChats = displayChats.filter(c => c.messageType !== 'offline_card');
                } else {
                    displayChats = displayChats.filter(c => c.messageType === 'offline_card');
                }

                if (displayChats.length === 0) {
                    const avatarStyle = displayCharAvatar ?
                        `background-image: url('${displayCharAvatar}'); background-size: cover; background-position: center;` :
                        '';
                    if (mode === 'offline') {
                        container.innerHTML = `
                    <div class="offline-card-ai">
                        ${displayCharName}出现在你面前。微风轻拂，${displayCharName}的目光落在你身上，似乎有什么话想说。
                    </div>`;
                    } else {
                        container.innerHTML = `
                    <div class="message-row other">
                        <div class="message-avatar" style="background-color: ${getAvatarColor(displayCharName)}; ${avatarStyle}">${displayCharAvatar ? '' : displayCharName.charAt(0)}</div>
                        <div class="bubble">你好！我是${displayCharName}，开始聊天吧~</div>
                    </div>`;
                    }
                } else {
                    if (mode === 'offline') {
                        const sessions = groupOfflineMessagesIntoSessions(displayChats);

                        let html = '';
                        sessions.forEach((session, sessionIdx) => {
                            const sessionTime = formatTimestamp(session.startTime);
                            const isLast = sessionIdx === sessions.length - 1;
                            const preview = getSessionPreview(session);
                            const sessionId = `offline-session-${sessionIdx}`;

                            if (!isLast) {
                                html += `
                            <div class="offline-session-folded" data-session-id="${sessionId}">
                                <div class="offline-session-header clickable">
                                    <span class="offline-session-icon">📍</span>
                                    <span class="offline-session-time">线下 · ${sessionTime}</span>
                                    <span class="offline-session-preview">${escapeHtml(preview)}</span>
                                    <span class="offline-session-toggle">▼</span>
                                </div>
                                <div class="offline-session-body" style="display: none;">
                        `;
                            } else {
                                html += `<div class="offline-session-current">`;
                                html +=
                                    `<div class="offline-session-time-label">📍 线下 · ${sessionTime}</div>`;
                            }

                            let prevTime = null;
                            session.messages.forEach((msg, msgIdx) => {
                                if (shouldShowTimestamp(msg.timestamp, prevTime)) {
                                    html +=
                                        `<div class="timestamp-divider">${formatTimestamp(msg.timestamp, prevTime)}</div>`;
                                }
                                prevTime = msg.timestamp;

                                const isAI = (msg.role === 'assistant' || msg.role === 'char');
                                const cardClass = isAI ? 'offline-card-ai' :
                                    'offline-card-user';
                                const offlineMsgId = msg.id ?
                                    `data-offline-msg-id="${msg.id}"` : '';

                                html += `
        <div style="position: relative; width: 100%;" data-offline-msg-index="${msgIdx}" ${offlineMsgId}>
            <div class="bubble-toolbar offline-toolbar" data-offline-toolbar="${msgIdx}">
                <button class="toolbar-btn reback-btn" data-offline-index="${msgIdx}">↩️ 重回</button>
                <button class="toolbar-btn danger delete-msg-btn" data-offline-index="${msgIdx}">🗑️ 删除</button>
                <button class="toolbar-btn multi-select-btn" data-offline-index="${msgIdx}">☑️ 多选</button>
                <button class="toolbar-btn edit-msg-btn" data-offline-index="${msgIdx}">✏️ 编辑</button>
            </div>
            <div class="${cardClass}" data-offline-content="${encodeURIComponent(msg.content)}">${escapeHtml(msg.content)}</div>
            <div class="bubble-dot offline-dot" data-offline-index="${msgIdx}" style="position: absolute; ${isAI ? 'right: 8px;' : 'left: 8px;'} bottom: 6px; width: 10px; height: 10px; border-radius: 50%; background: #c9c1b6; border: 1px solid #b8ae9f; cursor: pointer; z-index: 10;"></div>
        </div>
    `;
                            });

                            if (!isLast) {
                                html += `</div></div>`;
                            } else {
                                html += `</div>`;
                            }
                        });

                        container.innerHTML = html;

                    } else {
                        let html = '';
                        let prevTime = null;

                        displayChats.forEach((c, index) => {
                            if (shouldShowTimestamp(c.timestamp, prevTime)) {
                                html +=
                                    `<div class="timestamp-divider">${formatTimestamp(c.timestamp, prevTime)}</div>`;
                            }
                            prevTime = c.timestamp;

                            const isAI = c.role === 'assistant';
                            const avatarData = isAI ? displayCharAvatar : displayUserAvatar;
                            const avatarName = isAI ? displayCharName : displayUserName;
                            const avatarStyle = avatarData ?
                                `background-image: url('${avatarData}'); background-size: cover; background-position: center;` :
                                '';
                            const msgType = c.messageType || 'text';
                            const rowClass = c.role === 'user' ? 'self' : 'other';
                            const msgIdAttr = c.id ? `data-message-id="${c.id}"` : '';

                            const avatarHtml =
                                `<div class="message-avatar" style="background-color: ${getAvatarColor(avatarName || '?')}; ${avatarStyle}">${avatarData ? '' : avatarName?.charAt(0) || '?'}</div>`;

                            let bubbleContentHtml = '';
                            let toolbarHtml = '';

                            if (msgType === 'diary_share') {
                                let diaryData = null;
                                try {
                                    diaryData = JSON.parse(c.content);
                                } catch (e) {
                                    diaryData = { title: '日记', content: c.content, mood: '😊',
                                        date: '' };
                                }

                                const previewText = (diaryData.richContent || diaryData.content || '')
                                    .replace(/<[^>]*>/g, '').substring(0, 50);
                                const dateStr = diaryData.date ? formatDiaryDate(diaryData.date) : '';

                                bubbleContentHtml = `
        <div class="bubble diary-share-bubble clickable" data-diary-data="${escapeHtml(JSON.stringify(diaryData)).replace(/"/g, '&quot;')}">
<div class="diary-share-header">
    <span class="diary-share-icon" style="display:inline-flex;align-items:center;color:currentColor;">${UI_SVG.file}</span>
    <span class="diary-share-title">${escapeHtml(diaryData.title || '日记')}</span>
</div>
            <div class="diary-share-body">${escapeHtml(previewText)}${previewText.length >= 50 ? '...' : ''}</div>
            ${dateStr ? `<div class="diary-share-footer">${dateStr}</div>` : ''}
        </div>
    `;
                            } else if (msgType === 'transfer') {
    const isTransferFromAI = isAI;
    html += `<div class="message-row ${rowClass} transfer-card-row" style="justify-content:center;width:100%;margin-bottom:14px;" data-transfer-from="${isTransferFromAI ? 'ai' : 'user'}" data-conv-id="${convId}" data-transfer-content="${encodeURIComponent(c.content || '')}">
        ${isAI ? avatarHtml : ''}
        <div style="width:100%;max-width:100%;padding:0 4px;">${c.content || ''}</div>
        ${!isAI ? avatarHtml : ''}
    </div>`;
    return;
} else if (msgType === 'moments_forward_card') {
    bubbleContentHtml = `
        <div class="bubble moments-forward-bubble clickable" data-forward-card="1">
            ${c.content || ''}
        </div>
    `;
} else if (msgType === 'emoticon') {
    let emoticonUrl = '', emoticonText = '';
    if (c.content && c.content.startsWith('{')) {
        try { const p = JSON.parse(c.content); emoticonUrl = p.url || ''; emoticonText = p.text || ''; } catch (e) {}
    } else {
        emoticonText = c.content || '';
    }
    bubbleContentHtml = `
        <div class="bubble emoticon-bubble">
            ${emoticonUrl ? `<img src="${emoticonUrl}" alt="${escapeHtml(emoticonText)}" onerror="this.outerHTML='<span style=color:#a0a8a2;font-size:13px;display:block;padding:12px>表情包被吃掉了</span>'">` : '<span style="color:#a0a8a2;font-size:13px;display:block;padding:12px;">表情包被吃掉了</span>'}
            <span class="emoticon-text">${escapeHtml(emoticonText)}</span>
        </div>
    `;
                            } else if (msgType === 'text') {
                                const textBubbleClass = isAI ? 'bubble ai-bubble clickable' : 'bubble';
                                bubbleContentHtml =
                                    `<div class="${textBubbleClass}" data-original-content="${escapeHtml(c.content || '')}">${escapeHtml(c.content || '')}</div>`;
                                    } else if (msgType === 'html_card') {
    bubbleContentHtml = buildSafeHtmlCardIframe(c.content || '');
                            } else if (msgType === 'image') {
    bubbleContentHtml = `
        <div class="bubble image-bubble clickable" data-image-desc="${escapeHtml(c.content)}" data-original-content="${escapeHtml(c.content)}">
            <span class="image-icon">${UI_SVG.image}</span>
        </div>
    `;
} else if (msgType === 'voice') {
    bubbleContentHtml = `
        <div class="bubble voice-bubble clickable" data-voice-content="${escapeHtml(c.content)}" data-original-content="${escapeHtml(c.content)}">
            <div class="voice-bubble-header">
                <span class="voice-icon">${UI_SVG.mic}</span>
                <span class="voice-duration">7"</span>
            </div>
        </div>
    `;
} else if (msgType === 'focus_report') {
                                let reportData = null;
                                try {
                                    reportData = JSON.parse(c.content);
                                } catch (e) {}
                                if (reportData) {
                                    const totalMin = reportData.totalMinutes || 0;
                                    const mode = reportData.mode || '专注';
                                    bubbleContentHtml = `
            <div class="bubble focus-report-bubble clickable" data-report-data='${JSON.stringify(reportData).replace(/'/g, "&#39;")}' style="background: rgba(255,255,255,0.25); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.3); border-radius: 16px; cursor: pointer; padding: 14px 18px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); min-width: 230px;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                    <span style="font-size:20px;">🧘</span>
                    <span style="font-weight:600; color: #fff; text-shadow: 0 1px 4px rgba(0,0,0,0.2);">专注报告</span>
                </div>
                <div style="font-size:13px;color:rgba(255,255,255,0.9);">${escapeHtml(mode)} · ${totalMin}分钟</div>
                <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:4px;">点击查看详情</div>
            </div>
        `;
                                }
                            } else if (msgType === 'voice_call_start') {
    bubbleContentHtml = `<div class="bubble" style="background:#e8f0fe; text-align:center; padding:10px 16px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:4px;">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
        ${escapeHtml(c.content)}
    </div>`;
} else if (msgType === 'voice_call_end') {
    bubbleContentHtml = `<div class="bubble" style="background:#e8f0fe; text-align:center; padding:10px 16px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:4px;">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92z"/>
            <line x1="1" y1="1" x2="23" y2="23" stroke="red" stroke-width="2"/>
        </svg>
        ${escapeHtml(c.content)}
    </div>`;
}else if (msgType === 'voice_call_msg') {
                                bubbleContentHtml =
                                    `<div class="bubble">${escapeHtml(c.content)}</div>`;
                            } else if (msgType === 'mode_switch') {
                                html += `<div style="text-align:center; color:#8a9a8e; font-size:12px; padding:8px 0; width:100%;">${escapeHtml(c.content || '')}</div>`;
                                return;
                            } else if (msgType === 'offline_invite') {
                                let inviteStatus = '';
                                let inviteContent = c.content || '';
                                if (inviteContent.startsWith('[ACCEPTED]')) {
                                    inviteStatus = 'accepted';
                                    inviteContent = inviteContent.replace('[ACCEPTED]', '').trim();
                                } else if (inviteContent.startsWith('[REJECTED]')) {
                                    inviteStatus = 'rejected';
                                    inviteContent = inviteContent.replace('[REJECTED]', '').trim();
                                }
                                const statusClass = inviteStatus === 'accepted' ? 'accepted' : (inviteStatus === 'rejected' ? 'rejected' : '');
                                let statusHtml = '';
                                if (inviteStatus === 'accepted') {
                                    statusHtml = '<div class="offline-invite-status">已接受Ta的邀请，进入线下模式 </div>';
                                } else if (inviteStatus === 'rejected') {
                                    statusHtml = '<div class="offline-invite-status">已拒绝Ta的邀请</div>';
                                }
                                bubbleContentHtml = `<div class="bubble offline-invite-bubble ${statusClass}" data-invite-content="${escapeHtml(inviteContent)}" data-conv-id="${convId}" data-msg-id="${c.id || ''}" data-status="${inviteStatus}">
                                    <div class="offline-invite-en-title">𝓘𝓷𝓿𝓲𝓽𝓪𝓽𝓲𝓸𝓷</div>
                                    <div class="offline-invite-cn-desc">${escapeHtml(inviteContent)}</div>
                                    <div class="offline-invite-info-line">邀约时间：待定 · 邀约地点：待定</div>
                                    ${statusHtml}
                                </div>`
                                }
                            toolbarHtml = `
                        <div class="bubble-toolbar" data-toolbar-for="${index}">
                            <button class="toolbar-btn reback-btn" data-msg-id="${c.id || ''}">↩️ 重回</button>
                            <button class="toolbar-btn danger delete-msg-btn" data-index="${index}">🗑️ 删除</button>
                            <button class="toolbar-btn multi-select-btn" data-index="${index}">☑️ 多选</button>
                            <button class="toolbar-btn edit-msg-btn" data-index="${index}">✏️ 编辑</button>
                        </div>
                    `;

                            html += `
                        <div class="message-row ${rowClass}" data-message-index="${index}" ${msgIdAttr} data-role="${c.role}" data-message-type="${msgType}">
                            ${isAI ? avatarHtml : ''}
                            <div class="bubble-container">
                                ${toolbarHtml}
                                ${bubbleContentHtml}
                                <div class="bubble-dot" data-index="${index}"></div>
                            </div>
                            ${!isAI ? avatarHtml : ''}
                        </div>
                    `;
                        });

                        container.innerHTML = html;
                        setupHtmlCardIframes(container);
                                         const clickedTransferIds = new Set()  // 给AI发的转账/红包/代付/送礼卡片加点击事件
container.querySelectorAll('.transfer-card-row[data-transfer-from="ai"]').forEach(row => {
    const transferId = row.querySelector('[style]')?.textContent?.trim() || '';
    row.style.cursor = 'pointer';
    row.addEventListener('click', async function(e) {
        e.stopPropagation();
        const content = decodeURIComponent(this.dataset.transferContent);
        const convId = parseInt(this.dataset.convId);
        const cardKey = convId + '_' + (content.match(/¥([\d.]+)/)?.[1] || '') + '_' + (content.includes('gg-transfer-card') ? 't' : content.includes('gg-redpacket-card') ? 'r' : content.includes('gg-tafu-card-ai') ? 'tf' : 'g');
        if (clickedTransferIds.has(cardKey)) return;
        
        if (content.includes('gg-transfer-card') && !content.includes('已到账') && !content.includes('已退还')) {
            const amountMatch = content.match(/¥([\d.]+)/);
            if (amountMatch) {
                const amount = parseFloat(amountMatch[1]);
                const accept = confirm(`接收 ¥${amount} 转账？\n确定=接收  取消=退还`);
                clickedTransferIds.add(cardKey);
                if (accept && window.GDB && window.buildWxTransferCard) {
                    await window.GDB.getWallet().then(async (bal) => {
                        await window.GDB.setWallet(bal + amount);
                    });
                    const updatedCard = window.buildWxTransferCard(amount, 'received');
                    await DB.put('chats', { role: 'user', content: updatedCard, messageType: 'transfer', conversationId: convId, charId: window.currentCharId, timestamp: Date.now() });
                    showStatus('✅ 已接收转账', 'success');
                } else if (window.buildWxTransferCard) {
                    const updatedCard = window.buildWxTransferCard(amount, 'rejected');
                    await DB.put('chats', { role: 'user', content: updatedCard, messageType: 'transfer', conversationId: convId, charId: window.currentCharId, timestamp: Date.now() });
                    showStatus('已退还转账', 'info');
                }
                await loadConversationMessages(convId);
            }
        } else if (content.includes('gg-redpacket-card')) {
            if (window.GDB) {
                clickedTransferIds.add(cardKey);
                const bonus = Math.floor(Math.random() * 10) + 1;
                await window.GDB.getWallet().then(async (bal) => {
                    await window.GDB.setWallet(bal + bonus);
                });
                const notice = `我已领取红包 ¥${bonus}`;
                await DB.put('chats', { role: 'system', content: notice, messageType: 'mode_switch', conversationId: convId, charId: window.currentCharId, timestamp: Date.now() });
                showStatus('🧧 红包已领取', 'success');
                await loadConversationMessages(convId);
            }
        } else if (content.includes('请你帮我付') || content.includes('gg-tafu-card-ai')) {
            const amountMatch = content.match(/¥([\d.]+)/);
            if (amountMatch) {
                const amount = parseFloat(amountMatch[1]);
                const agree = confirm(`帮Ta支付 ¥${amount}？\n确定=同意  取消=拒绝`);
                clickedTransferIds.add(cardKey);
                if (agree && window.GDB && window.buildTafuCardFromAI) {
                    await window.GDB.getWallet().then(async (bal) => {
                        if (bal >= amount) await window.GDB.setWallet(bal - amount);
                    });
                    const updatedCard = window.buildTafuCardFromAI('代付', amount, '', 'paid');
                    await DB.put('chats', { role: 'user', content: updatedCard, messageType: 'transfer', conversationId: convId, charId: window.currentCharId, timestamp: Date.now() });
                    showStatus('✅ 已代付', 'success');
                } else if (window.buildTafuCardFromAI) {
                    const updatedCard = window.buildTafuCardFromAI('代付', amount, '', 'rejected');
                    await DB.put('chats', { role: 'user', content: updatedCard, messageType: 'transfer', conversationId: convId, charId: window.currentCharId, timestamp: Date.now() });
                    showStatus('已拒绝代付', 'info');
                }
                await loadConversationMessages(convId);
            }
        } else if (content.includes('Gift') || content.includes('gg-gift-card-ai')) {
            clickedTransferIds.add(cardKey);
            showStatus('🎁 收到礼物啦', 'success');
        }
    });
});

                        bindLongPressToolbar(container, '.bubble-container', '.bubble, .image-bubble, .voice-bubble, .diary-share-bubble, .focus-report-bubble');

                        container.querySelectorAll('.reback-btn').forEach(btn => {
                            btn.addEventListener('click', async (e) => {
                                e.stopPropagation();
                                const msgId = parseInt(btn.dataset.msgId) || null;
                                await backToMessage(convId, msgId);
                                btn.closest('.bubble-toolbar').classList.remove('show');
                            });
                        });

                        container.querySelectorAll('.delete-msg-btn').forEach(btn => {
                            btn.addEventListener('click', async (e) => {
                                e.stopPropagation();
                                const index = parseInt(btn.dataset.index);
                                const row = container.querySelector(
                                    `.message-row[data-message-index="${index}"]`);
                                const msgId = row.dataset.messageId;
                                if (!confirm('确定删除这条消息吗？')) return;

                                if (msgId) {
                                    await DB.delete('chats', parseInt(msgId));
                                } else {
                                    const chats = await DB.queryByIndex('chats',
                                        'conversationId', convId);
                                    const displayChats = chats.filter(c => c
                                        .messageType !== 'innerVoice');
                                    displayChats.sort((a, b) => (a.timestamp || 0) - (
                                        b.timestamp || 0));
                                    if (index < displayChats.length && displayChats[
                                            index].id) {
                                        await DB.delete('chats', displayChats[index]
                                            .id);
                                    }
                                }
                                await loadConversationMessages(convId);
                            });
                        });

                        let multiSelectMode = false;
                        let multiSelectedIds = new Set();

                        container.querySelectorAll('.multi-select-btn').forEach(btn => {
                            btn.addEventListener('click', async (e) => {
                                e.stopPropagation();
                                const index = parseInt(btn.dataset.index);
                                const row = container.querySelector(
                                    `.message-row[data-message-index="${index}"]`);

                                multiSelectMode = true;
                                multiSelectedIds.add(index);

                                updateMultiSelectUI();

                                btn.closest('.bubble-toolbar').classList.remove(
                                    'show');
                            });
                        });

                        function updateMultiSelectUI() {
                            const allRows = container.querySelectorAll('.message-row');
                            allRows.forEach(row => {
                                const rowIndex = parseInt(row.dataset.messageIndex);
                                if (multiSelectMode) {
                                    row.classList.add('multi-select-mode');
                                    if (multiSelectedIds.has(rowIndex)) {
                                        row.classList.add('multi-selected');
                                    } else {
                                        row.classList.remove('multi-selected');
                                    }
                                } else {
                                    row.classList.remove('multi-select-mode',
                                        'multi-selected');
                                }
                            });

                            let selectBar = document.getElementById('multiSelectBar');
                            if (multiSelectMode) {
                                selectBar.style.display = 'flex';
                                document.getElementById('multiSelectCount').textContent =
                                    '已选 ' + multiSelectedIds.size + ' 条';
                            } else {
                                selectBar.style.display = 'none';
                            }
                        }

                        container.addEventListener('click', async (e) => {
                            if (!multiSelectMode) return;
                            const row = e.target.closest('.message-row');
                            if (!row) return;

                            if (e.target.closest('.bubble-toolbar') || e.target.closest(
                                    '.bubble-dot')) return;

                            const index = parseInt(row.dataset.messageIndex);
                            if (multiSelectedIds.has(index)) {
                                multiSelectedIds.delete(index);
                            } else {
                                multiSelectedIds.add(index);
                            }
                            updateMultiSelectUI();
                        });

                        document.getElementById('multiSelectDeleteBtn').addEventListener('click',
                            async () => {
                                if (multiSelectedIds.size === 0) return;
                                if (!confirm(`确定删除选中的 ${multiSelectedIds.size} 条消息吗？`))
                                    return;

                                const chats = await DB.queryByIndex('chats',
                                    'conversationId', convId);
                                const displayChats = chats.filter(c => c.messageType !==
                                    'innerVoice');
                                displayChats.sort((a, b) => (a.timestamp || 0) - (b.timestamp ||
                                    0));

                                for (const idx of multiSelectedIds) {
                                    if (idx < displayChats.length && displayChats[idx].id) {
                                        await DB.delete('chats', displayChats[idx].id);
                                    }
                                }

                                multiSelectMode = false;
                                multiSelectedIds.clear();
                                updateMultiSelectUI();
                                await loadConversationMessages(convId);
                            });

                        document.getElementById('multiSelectCancelBtn').addEventListener('click',
                            () => {
                                multiSelectMode = false;
                                multiSelectedIds.clear();
                                updateMultiSelectUI();
                            });

                        container.querySelectorAll('.edit-msg-btn').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                e.stopPropagation();
                                const index = parseInt(btn.dataset.index);
                                const row = container.querySelector(
                                    `.message-row[data-message-index="${index}"]`);
                                const msgType = row.dataset.messageType;

                                if (msgType !== 'text') {
                                    showStatus('只能编辑文字消息', 'info');
                                    return;
                                }

                                const bubble = row.querySelector('.bubble');
                                const bubbleContainer = row.querySelector(
                                    '.bubble-container');
                                const currentContent = bubble.dataset
                                    .originalContent || bubble.textContent;

                                const textarea = document.createElement('textarea');
                                textarea.className = 'bubble-edit-textarea';
                                textarea.value = currentContent;

                                const actionsRow = document.createElement('div');
                                actionsRow.className = 'edit-actions-row';
                                actionsRow.innerHTML = `
                            <button class="toolbar-btn save">💾 保存</button>
                            <button class="toolbar-btn cancel">✕ 取消</button>
                        `;

                                bubble.style.display = 'none';
                                bubbleContainer.appendChild(textarea);
                                bubbleContainer.appendChild(actionsRow);
                                textarea.focus();

                                btn.closest('.bubble-toolbar').classList.remove('show');

                                actionsRow.querySelector('.save').addEventListener('click',
                                    async () => {
                                        const newContent = textarea.value.trim();
                                        if (!newContent) {
                                            showStatus('内容不能为空', 'error');
                                            return;
                                        }

                                        const msgId = row.dataset.messageId;
                                        if (msgId) {
                                            const msg = await DB.get('chats', parseInt(
                                                msgId));
                                            if (msg) {
                                                msg.content = newContent;
                                                await DB.put('chats', msg);
                                            }
                                        }

                                        showStatus('✅ 已保存', 'success');
                                        await loadConversationMessages(convId);
                                    });

                                actionsRow.querySelector('.cancel').addEventListener('click',
                                    () => {
                                        textarea.remove();
                                        actionsRow.remove();
                                        bubble.style.display = '';
                                    });
                            });
                        });

                        container.querySelectorAll('.ai-bubble').forEach((bubble) => {
                            bubble.addEventListener('click', (e) => {
                                if (multiSelectMode) return;
                                e.stopPropagation();
                                window.selectedMessageIndex = parseInt(bubble.closest(
                                    '.message-row').dataset.messageIndex);
                            });
                        });

                        container.querySelectorAll('.image-bubble').forEach((bubble) => {
                            bubble.addEventListener('click', (e) => {
                                if (multiSelectMode) return;
                                e.stopPropagation();
                                const desc = bubble.dataset.imageDesc;
                                showImageModal(desc);
                            });
                        });

                        container.querySelectorAll('.voice-bubble').forEach((bubble) => {
                            bubble.addEventListener('click', (e) => {
                                if (multiSelectMode) return;
                                e.stopPropagation();
                                const content = bubble.dataset.voiceContent;
                                let voiceContent = bubble.querySelector(
                                    '.voice-content-display');
                                if (voiceContent) {
                                    voiceContent.remove();
                                } else {
                                    voiceContent = document.createElement('div');
                                    voiceContent.className = 'voice-content-display';
                                    voiceContent.textContent = content;
                                    bubble.appendChild(voiceContent);
                                }
                            });
                        });

                        container.querySelectorAll('.diary-share-bubble').forEach((bubble) => {
                            bubble.addEventListener('click', (e) => {
                                if (multiSelectMode) return;
                                e.stopPropagation();
                                const diaryDataStr = bubble.dataset.diaryData;
                                try {
                                    const diaryData = JSON.parse(diaryDataStr);
                                    showDiaryViewer(diaryData);
                                } catch (e) {
                                    showStatus('无法解析日记数据', 'error');
                                }
                            });
                        });

                        container.querySelectorAll('.focus-report-bubble').forEach(bubble => {
                            bubble.addEventListener('click', (e) => {
                                if (multiSelectMode) return;
                                e.stopPropagation();
                                try {
                                    const reportData = JSON.parse(bubble.dataset.reportData);
                                    showFocusReportModal(reportData);
                                } catch (e) {}
                            });
                        });

                        container.querySelectorAll('.offline-invite-bubble').forEach(card => {
                            card.addEventListener('click', async (e) => {
                                e.stopPropagation();
                                const status = card.dataset.status;
                                if (status === 'accepted' || status === 'rejected') return;
                                const cardConvId = parseInt(card.dataset.convId);
                                const msgId = card.dataset.msgId ? parseInt(card.dataset.msgId) : null;
                                const inviteContent = card.dataset.inviteContent;
                                const existingModal = document.querySelector('.offline-invite-confirm-modal');
                                if (existingModal) existingModal.remove();
                                const modal = document.createElement('div');
                                modal.className = 'offline-invite-confirm-modal';
                                modal.innerHTML = `<div class="offline-invite-confirm-card">
                                    <div class="confirm-en-title">𝓘𝓷𝓿𝓲𝓽𝓪𝓽𝓲𝓸𝓷</div>
                                    <div class="confirm-hint">${escapeHtml(inviteContent)}<br><br>要接受这次线下见面邀约吗？</div>
                                    <div class="confirm-btn-row">
                                        <button class="confirm-btn accept" id="offlineInviteAcceptBtn">和他见面</button>
                                        <button class="confirm-btn reject" id="offlineInviteRejectBtn">我有点事</button>
                                    </div>
                                </div>`;
                                document.body.appendChild(modal);
                                modal.querySelector('#offlineInviteAcceptBtn').addEventListener('click', async () => {
                                    modal.remove();
                                    if (msgId) {
                                        const msg = await DB.get('chats', msgId);
                                        if (msg) { msg.content = '[ACCEPTED]' + inviteContent; await DB.put('chats', msg); }
                                    }
                                    if (cardConvId) {
                                        const conv = await DB.get('conversations', cardConvId);
                                        if (conv) { conv.mode = 'offline'; conv.updatedAt = Date.now(); await DB.put('conversations', conv); }
                                    }
                                    await loadConversationMessages(cardConvId);
                                });
                                modal.querySelector('#offlineInviteRejectBtn').addEventListener('click', async () => {
                                    modal.remove();
                                    if (msgId) {
                                        const msg = await DB.get('chats', msgId);
                                        if (msg) { msg.content = '[REJECTED]' + inviteContent; await DB.put('chats', msg); }
                                    }
                                    if (window.generateRejectionReaction) {
                                        await window.generateRejectionReaction(cardConvId, 'offline_invite');
                                    }
                                    await loadConversationMessages(cardConvId);
                                });
                                modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
                            });
                        });

                        container.querySelectorAll('[data-action="accept-voice-call"]').forEach(
                        (bubble) => {
                            bubble.addEventListener('click', (e) => {
                                if (multiSelectMode) return;
                                e.stopPropagation();
                                const cid = parseInt(bubble.dataset.convId);
                                if (window.receiveVoiceCallInvitation) {
                                    window.receiveVoiceCallInvitation(cid);
                                }
                            });
                        });
                        container.querySelectorAll('.mm-forward-card').forEach(card => {
    card.addEventListener('click', async (e) => {
        e.stopPropagation();
        const postId = card.getAttribute('data-moment-post-id');
        if (!postId) return;
        switchPage('moments');
        if (window.momentsModule?.openPostDetail) {
            setTimeout(() => window.momentsModule.openPostDetail(postId), 80);
        }
    });
});
                    }
                }

                if (mode === 'offline') {
                    container.querySelectorAll('.offline-session-folded').forEach(folded => {
                        const header = folded.querySelector('.offline-session-header');
                        const body = folded.querySelector('.offline-session-body');
                        const toggle = folded.querySelector('.offline-session-toggle');

                        header.addEventListener('click', () => {
                            if (body.style.display === 'none') {
                                body.style.display = 'block';
                                toggle.textContent = '▲';
                            } else {
                                body.style.display = 'none';
                                toggle.textContent = '▼';
                            }
                        });
                    });

                    bindLongPressToolbar(container, '[data-offline-msg-index]', '.offline-card-user, .offline-card-ai');

                    container.querySelectorAll('.offline-toolbar .edit-msg-btn').forEach(btn => {
                        btn.addEventListener('click', async (e) => {
                            e.stopPropagation();
                            const parent = btn.closest('[data-offline-msg-id]');
                            const card = parent.querySelector('[data-offline-content]');
                            const rawEncoded = card.dataset.offlineContent;
                            const currentContent = decodeURIComponent(rawEncoded || '');

                            const textarea = document.createElement('textarea');
                            textarea.className = 'bubble-edit-textarea';
                            textarea.value = currentContent;
                            textarea.style.width = '100%';

                            const actionsRow = document.createElement('div');
                            actionsRow.className = 'edit-actions-row';
                            actionsRow.innerHTML = `
                        <button class="toolbar-btn save">💾 保存</button>
                        <button class="toolbar-btn cancel">✕ 取消</button>
                    `;

                            card.style.display = 'none';
                            parent.appendChild(textarea);
                            parent.appendChild(actionsRow);
                            textarea.focus();

                            btn.closest('.bubble-toolbar').classList.remove('show');

                            actionsRow.querySelector('.save').addEventListener('click',
                                async () => {
                                    const newContent = textarea.value.trim();
                                    if (!newContent) {
                                        showStatus('内容不能为空', 'error');
                                        return;
                                    }
                                    const msgId = parent.dataset.offlineMsgId;
                                    if (msgId) {
                                        const msg = await DB.get('chats', parseInt(
                                            msgId));
                                        if (msg) {
                                            msg.content = newContent;
                                            await DB.put('chats', msg);
                                        }
                                    }
                                    showStatus('✅ 已保存', 'success');
                                    await loadConversationMessages(convId);
                                });

                            actionsRow.querySelector('.cancel').addEventListener('click',
                                () => {
                                    textarea.remove();
                                    actionsRow.remove();
                                    card.style.display = '';
                                });
                        });
                    });

                    container.querySelectorAll('.offline-toolbar .delete-msg-btn').forEach(btn => {
                        btn.addEventListener('click', async (e) => {
                            e.stopPropagation();
                            if (!confirm('确定删除这条消息吗？')) return;
                            const parent = btn.closest('[data-offline-msg-id]');
                            const msgId = parent ? parent.dataset.offlineMsgId : null;
                            if (msgId) {
                                await DB.delete('chats', parseInt(msgId));
                            }
                            await loadConversationMessages(convId);
                        });
                    });

                    container.querySelectorAll('.offline-toolbar .reback-btn').forEach(btn => {
                        btn.addEventListener('click', async (e) => {
                            e.stopPropagation();
                            const index = parseInt(btn.dataset.offlineIndex);
                            const chats = await DB.queryByIndex('chats',
                                'conversationId', convId);
                            const displayChats = chats.filter(c => c.messageType ===
                                'offline_card');
                            displayChats.sort((a, b) => (a.timestamp || 0) - (b.timestamp ||
                                0));

                            if (index >= displayChats.length) return;

                            let lastUserIndex = -1;
                            for (let i = index - 1; i >= 0; i--) {
                                if (displayChats[i].role === 'user') {
                                    lastUserIndex = i;
                                    break;
                                }
                            }

                            if (lastUserIndex === -1) {
                                showStatus('无法找到对应的用户消息', 'error');
                                return;
                            }

                            if (!confirm(
                                    `确定要删除从第 ${lastUserIndex + 2} 条消息开始的所有内容，并重新生成回复吗？`
                                    )) return;

                            const messagesToDelete = displayChats.slice(lastUserIndex +
                                1);
                            for (const msg of messagesToDelete) {
                                if (msg.id) await DB.delete('chats', msg.id);
                            }

                            showStatus('🔄 正在重新生成回复...', 'info');
                            await loadConversationMessages(convId);
                            await regenerateAIReply(convId);
                        });
                    });

                    let offlineMultiSelectMode = false;
                    let offlineMultiSelectedIds = new Set();

                    container.querySelectorAll('.offline-toolbar .multi-select-btn').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            const index = btn.dataset.offlineIndex;
                            offlineMultiSelectMode = true;
                            offlineMultiSelectedIds.add(index);
                            updateOfflineMultiSelectUI();
                            btn.closest('.bubble-toolbar').classList.remove('show');
                        });
                    });

                    function updateOfflineMultiSelectUI() {
                        const allParents = container.querySelectorAll(
                        '[data-offline-msg-index]');
                        allParents.forEach(parent => {
                            const idx = parent.dataset.offlineMsgIndex;
                            if (offlineMultiSelectMode) {
                                parent.style.cursor = 'pointer';
                                if (offlineMultiSelectedIds.has(idx)) {
                                    const card = parent.querySelector(
                                        '[data-offline-content]');
                                    if (card) card.style.outline =
                                        '2px solid #d7e4ee';
                                    card.style.outlineOffset = '2px';
                                } else {
                                    const card = parent.querySelector(
                                        '[data-offline-content]');
                                    if (card) card.style.outline = '';
                                    card.style.outlineOffset = '';
                                }
                            } else {
                                parent.style.cursor = '';
                                const card = parent.querySelector(
                                    '[data-offline-content]');
                                if (card) card.style.outline = '';
                                card.style.outlineOffset = '';
                            }
                        });

                        const selectBar = document.getElementById('multiSelectBar');
                        if (offlineMultiSelectMode) {
                            selectBar.style.display = 'flex';
                            document.getElementById('multiSelectCount').textContent =
                                '已选 ' + offlineMultiSelectedIds.size + ' 条';
                        } else {
                            selectBar.style.display = 'none';
                        }
                    }

                    container.addEventListener('click', (e) => {
                        if (!offlineMultiSelectMode) return;
                        const parent = e.target.closest('[data-offline-msg-index]');
                        if (!parent) return;
                        if (e.target.closest('.bubble-toolbar') || e.target.closest(
                                '.offline-dot')) return;

                        const idx = parent.dataset.offlineMsgIndex;
                        if (offlineMultiSelectedIds.has(idx)) {
                            offlineMultiSelectedIds.delete(idx);
                        } else {
                            offlineMultiSelectedIds.add(idx);
                        }
                        updateOfflineMultiSelectUI();
                    });

                    document.getElementById('multiSelectDeleteBtn').addEventListener('click',
                        async () => {
                            if (offlineMultiSelectedIds.size === 0) return;
                            if (!confirm(`确定删除选中的 ${offlineMultiSelectedIds.size} 条消息吗？`))
                                return;

                            const chats = await DB.queryByIndex('chats', 'conversationId',
                                convId);
                            const offlineChats = chats.filter(c => c.messageType ===
                                'offline_card');
                            offlineChats.sort((a, b) => (a.timestamp || 0) - (b.timestamp ||
                                0));

                            const allMsgParents = container.querySelectorAll('[data-offline-msg-id]');
                            for (const parent of allMsgParents) {
                                const idx = parent.dataset.offlineMsgIndex;
                                if (offlineMultiSelectedIds.has(idx)) {
                                    const msgId = parent.dataset.offlineMsgId;
                                    if (msgId) {
                                        await DB.delete('chats', parseInt(msgId));
                                    }
                                }
                            }

                            offlineMultiSelectMode = false;
                            offlineMultiSelectedIds.clear();
                            updateOfflineMultiSelectUI();
                            await loadConversationMessages(convId);
                        });

                    document.getElementById('multiSelectCancelBtn').addEventListener('click', () => {
                        offlineMultiSelectMode = false;
                        offlineMultiSelectedIds.clear();
                        updateOfflineMultiSelectUI();
                    });
                }

                container.addEventListener('click', (e) => {
                    const inviteBubble = e.target.closest('[data-action="accept-voice-call"]');
                    if (inviteBubble) {
                        e.stopPropagation();
                        const cid = parseInt(inviteBubble.dataset.convId);
                        if (window.receiveVoiceCallInvitation) {
                            window.receiveVoiceCallInvitation(cid);
                        }
                        return;
                    }
                    if (e.target.closest('.bubble-toolbar') || e.target.closest('.bubble-dot')) return;
                    container.querySelectorAll('.bubble-toolbar.show').forEach(tb => tb.classList.remove(
                        'show'));
                });

                (function() {
                    const delBtn = document.getElementById('multiSelectDeleteBtn');
                    const cancelBtn = document.getElementById('multiSelectCancelBtn');
                    const countSpan = document.getElementById('multiSelectCount');
                    const selectBar = document.getElementById('multiSelectBar');

                    if (delBtn && !delBtn.dataset.bound) {
                        delBtn.dataset.bound = '1';
                        delBtn.addEventListener('click', async () => {
                            if (typeof offlineMultiSelectedIds !== 'undefined' &&
                                offlineMultiSelectMode && offlineMultiSelectedIds.size > 0) {
                                const count = offlineMultiSelectedIds.size;
                                if (!confirm('确定删除选中的 ' + count + ' 条消息吗？')) return;

                                const convId = window.currentConversationId || window
                                    ._currentLoadingConvId;
                                const chats = await DB.queryByIndex('chats',
                                    'conversationId', convId);
                                const offlineChats = chats
                                    .filter(c => c.messageType === 'offline_card')
                                    .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

                                let deleted = 0;
                                for (const idx of offlineMultiSelectedIds) {
                                    if (idx < offlineChats.length && offlineChats[idx].id) {
                                        await DB.delete('chats', offlineChats[idx].id);
                                        deleted++;
                                    }
                                }

                                offlineMultiSelectedIds.clear();
                                offlineMultiSelectMode = false;
                                selectBar.style.display = 'none';
                                if (deleted > 0) await loadConversationMessages(convId);
                                return;
                            }

                            const selectedRows = container.querySelectorAll(
                                '.message-row.multi-selected');
                            const count = selectedRows.length;
                            if (count === 0) return;
                            if (!confirm('确定删除选中的 ' + count + ' 条消息吗？')) return;

                            let deleted = 0;
                            for (const row of selectedRows) {
                                const msgId = row.dataset.messageId;
                                if (msgId) {
                                    await DB.delete('chats', parseInt(msgId));
                                    deleted++;
                                }
                            }
                            selectBar.style.display = 'none';
                            if (deleted > 0) await loadConversationMessages(window
                                ._currentLoadingConvId);
                        });
                    }

                    if (cancelBtn && !cancelBtn.dataset.bound) {
                        cancelBtn.dataset.bound = '1';
                        cancelBtn.addEventListener('click', () => {
                            if (typeof offlineMultiSelectMode !== 'undefined' &&
                                offlineMultiSelectMode) {
                                offlineMultiSelectMode = false;
                                if (typeof offlineMultiSelectedIds !== 'undefined')
                                    offlineMultiSelectedIds.clear();
                            }
                            container.querySelectorAll(
                                    '.message-row.multi-selected, [data-offline-msg-index]')
                                .forEach(el => {
                                    el.classList.remove('multi-selected',
                                        'multi-select-mode');
                                    el.style.cursor = '';
                                    const card = el.querySelector(
                                        '[data-offline-content]');
                                    if (card) { card.style.outline = '';
                                        card.style.outlineOffset = ''; }
                                });
                            selectBar.style.display = 'none';
                        });
                    }
                })();
                setTimeout(() => scrollChatToBottom(), 100);

if (window.bubbleThemeModule?.applyBubbleThemeForConversation) {
    await window.bubbleThemeModule.applyBubbleThemeForConversation(convId);
}

                // ========== 折叠语音通话消息 ==========
                const foldContainer = document.getElementById('convChatMessages');
                if (foldContainer && window.foldCallMessages) {
                    const rows = foldContainer.querySelectorAll('.message-row');
                    let startRow = null;
                    rows.forEach(row => {
                        const type = row.dataset.messageType;
                        if (type === 'voice_call_start') {
                            startRow = row;
                        } else if (type === 'voice_call_end' && startRow) {
                            window.foldCallMessages(startRow, row);
                            startRow = null;
                        }
                    });
                }
                // ========== 折叠结束 ==========
            }
            window.loadConversationMessages = loadConversationMessages;
window.openConversation = openConversation;
            

            function updateModeToggleButton(mode) {
    const icon = document.getElementById('modeToggleIcon');
    const label = document.getElementById('modeToggleLabel');
    if (icon) {
        if (mode === 'offline') {
            // 切换线上：手机图标
            icon.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>';
        } else {
            // 见面：循环箭头
            icon.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>';
        }
    }
    if (label) label.textContent = mode === 'offline' ? '切换线上' : '见面';
}

            function updateExpandMenuForMode(mode) {
                const menuItems = document.querySelectorAll(
                    '.expand-menu-item[data-action="userImage"], .expand-menu-item[data-action="userVoice"]');
                menuItems.forEach(item => {
                    if (mode === 'offline') {
                        item.classList.add('disabled');
                    } else {
                        item.classList.remove('disabled');
                    }
                });
            }

            async function toggleConversationMode() {
                const convId = window.currentConversationId;
                if (!convId) return;
                const conv = await DB.get('conversations', convId);
                if (!conv) return;
                const currentMode = conv.mode || 'online';
                const newMode = currentMode === 'online' ? 'offline' : 'online';
                if (newMode === 'offline') {
                    const confirmed = confirm('切换到线下见面模式？\n\n· 聊天将变为文学叙事风格\n· 图片、语音功能将禁用');
                    if (!confirmed) return;
                }
                conv.mode = newMode;
                conv.updatedAt = Date.now();
                await DB.put('conversations', conv);
                
                if (newMode === 'online') {
                    await DB.put('chats', {
                        role: 'system',
                        content: '— 已回到线上聊天 —',
                        messageType: 'mode_switch',
                        conversationId: convId,
                        charId: conv.charId,
                        timestamp: Date.now()
                    });
                } else {
                    await DB.put('chats', {
                        role: 'system',
                        content: '— 已切换到线下见面模式 —',
                        messageType: 'mode_switch',
                        conversationId: convId,
                        charId: conv.charId,
                        timestamp: Date.now()
                    });
                }
                
                await loadConversationMessages(convId);
            }

            async function backToMessage(convId, targetMsgId) {
                const conv = await DB.get('conversations', convId);
                if (!conv) return;

                const allChats = await DB.queryByIndex('chats', 'conversationId', convId);

                const displayChats = allChats
                    .filter(c => c.messageType !== 'innerVoice')
                    .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

                const targetIndex = displayChats.findIndex(c => c.id === targetMsgId);
                if (targetIndex === -1) {
                    showStatus('未找到消息', 'error');
                    return;
                }

                let lastUserIndex = -1;
                for (let i = targetIndex - 1; i >= 0; i--) {
                    if (displayChats[i].role === 'user') {
                        lastUserIndex = i;
                        break;
                    }
                }

                if (lastUserIndex === -1) {
                    showStatus('无法找到对应的用户消息', 'error');
                    return;
                }

                if (!confirm('确定要回到这条消息，并删除之后的所有回复吗？')) {
                    return;
                }

                for (let i = lastUserIndex + 1; i < displayChats.length; i++) {
                    if (displayChats[i].id) {
                        await DB.delete('chats', displayChats[i].id);
                    }
                }

                showStatus('🔄 正在重新生成回复...', 'info');
                await loadConversationMessages(convId);
                await regenerateAIReply(convId);
            }

            async function regenerateAIReply(convId) {
                const conv = await DB.get('conversations', convId);
                if (!conv) return;

                const mode = conv.mode || 'online';
                const char = await DB.get('characters', conv.charId);
                const mask = await DB.get('userProfiles', conv.maskId);
                if (!char) { showStatus('联系人不存在', 'error'); return; }

                const rounds = parseInt(document.getElementById('contextRoundsInput')?.value || 4);
                const chats = await DB.queryByIndex('chats', 'conversationId', convId);
                const contextChats = chats.filter(c => c.messageType !== 'innerVoice');
                contextChats.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

                const recent = contextChats.slice(-rounds * 2);

                const systemPrompt = await buildSystemPrompt(char, mask, null, mode, convId);
                const messages = [{ role: 'system', content: systemPrompt }];

                if (mode === 'offline') {
                    recent.forEach(m => {
                        const roleName = (m.role === 'user') ? (mask?.name || '用户') : char.name;
                        messages.push({
                            role: m.role === 'user' ? 'user' : 'assistant',
                            content: `[${roleName}]: ${m.content}`
                        });
                    });
                } else {
                    recent.forEach(m => {
                        let msgContent = m.content;
                        if (m.messageType === 'emoticon' && window.emoticonModule) {
                            msgContent = window.emoticonModule.wrapUserEmoticonForAI(m.content);
                        }
                        if (m.messageType === 'diary_share') {
                            try {
                                const dd = JSON.parse(m.content);
                                msgContent =
                                    `[分享了日记] 标题：${dd.title}，心情：${dd.mood}，内容：${(dd.richContent || dd.content || '').replace(/<[^>]*>/g, '')}`;
                            } catch (e) {}
                        }
                        messages.push({
                            role: m.role === 'user' ? 'user' : 'assistant',
                            content: msgContent
                        });
                    });
                }

                try {
                    let llmOptions = {};

if (mode === 'offline') {
    const cd = await DB.get('convDetails', convId);
    const offlineMaxChars = parseInt(cd?.offlineControl?.maxChars || 1200);

    llmOptions.maxTokens = Math.min(
        16000,
        Math.max(2000, Math.ceil(offlineMaxChars * 1.5))
    );
}

const reply = await callLLM(messages, { ...llmOptions, maxTokens: 300 });

                    if (mode === 'offline') {
                        const innerVoiceMatch = reply.match(/---心声开始---([\s\S]*?)---心声结束---/);
                        let mainContent = reply;

                        if (innerVoiceMatch) {
                            mainContent = reply.replace(/---心声开始---[\s\S]*?---心声结束---/, '').trim();
                            await DB.put('chats', {
                                role: 'char',
                                content: innerVoiceMatch[1].trim(),
                                messageType: 'innerVoice',
                                conversationId: convId,
                                charId: char.id,
                                timestamp: Date.now()
                            });
                        }

                        if (mainContent) {
                            await DB.put('chats', {
                                role: 'char',
                                content: mainContent.trim(),
                                messageType: 'offline_card',
                                conversationId: convId,
                                charId: char.id,
                                timestamp: Date.now()
                            });
                        }
                    } else {
                        const parsedMessages = parseAIResponse(reply);
                        
                        // 过滤掉包含指令的文本消息（指令会由 handleProactiveCommands 单独发卡片）
                        const { commands } = window.extractProactiveCommands ? window.extractProactiveCommands(reply) : { commands: [] };
                        const filteredMessages = parsedMessages.filter(msg => {
                            if (msg.type !== 'text') return true;
                            // 检查文本是否被指令处理过
                            let cleaned = msg.content;
                            for (const cmd of commands) {
                                cleaned = cleaned.replace(cmd.raw, '');
                            }
                            cleaned = cleaned.trim();
                            // 如果去掉指令后还有内容，保留；否则丢弃
                            if (cleaned) {
                                msg.content = cleaned;
                                return true;
                            }
                            return false;
                        });

                        if (filteredMessages.length === 0) {
                            await DB.put('chats', {
                                role: 'assistant',
                                content: reply,
                                messageType: 'text',
                                conversationId: convId,
                                charId: char.id,
                                timestamp: Date.now()
                            });
                        } else {
                            for (let i = filteredMessages.length - 1; i >= 0; i--) {
                                const msg = filteredMessages[i];
                                if (msg.type === 'text') {
                                    if (msg.content.includes('[voiceCall:start]')) {
                                        if (window.receiveVoiceCallInvitation) {
                                            window.receiveVoiceCallInvitation(convId);
                                        }
                                        filteredMessages.splice(i, 1);
                                    } else if (msg.content.includes('[voiceCall:end]')) {
                                        filteredMessages.splice(i, 1);
                                    }
                                }
                            }
                            let baseTime = Date.now();
for (let i = 0; i < filteredMessages.length; i++) {
    const msg = filteredMessages[i];
    let finalContent = msg.content;
    
    if (msg.type === 'emoticon' && window.emoticonModule) {
        const allItems = await DB.getAll('emoticonItems');
        const matched = allItems.find(item => item.text === msg.content);
        finalContent = matched 
            ? JSON.stringify({ url: matched.url, text: matched.text })
            : JSON.stringify({ url: '', text: msg.content });
    }
    
    await DB.put('chats', {
        role: 'assistant',
        content: finalContent,
        messageType: msg.type,
        conversationId: convId,
        charId: char.id,
        timestamp: baseTime + i
    });
}
                        }
                    }

                    if (window.extractProactiveCommands) {
                        const { commands } = window.extractProactiveCommands(reply);
                        if (commands.length > 0 && window.handleProactiveCommands) {
                            await window.handleProactiveCommands(convId, conv.charId, commands);
                        }
                    }
                    await DB.put('conversations', { ...conv, updatedAt: Date.now() });
                    await loadConversationMessages(convId);
                    showStatus('✅ 回复已重新生成', 'success');
                } catch (e) {
                    showStatus(`❌ ${e.message}`, 'error');
                }
            }

            async function createNewConversation(charId, maskId) {
                const char = await DB.get('characters', charId);
                const conv = {
                    charId,
                    maskId,
                    name: `${char?.name || '新对话'}`,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                };
                await DB.put('conversations', conv);
                return conv;
            }

            async function sendMessageInConv() {
                const input = document.getElementById('convMessageInput');
                const text = input.value.trim();
                if (!text) return;
                const convId = window.currentConversationId;
                if (!convId) { showStatus('请先选择对话', 'error'); return; }

                const conv = await DB.get('conversations', convId);
                if (!conv) return;

                const mode = conv.mode || 'online';
                const messageType = mode === 'offline' ? 'offline_card' : 'text';

                await DB.put('chats', {
                    role: 'user',
                    content: text,
                    messageType: messageType,
                    conversationId: convId,
                    charId: conv.charId,
                    timestamp: Date.now()
                });
                await DB.put('conversations', { ...conv, updatedAt: Date.now() });
                await loadConversationMessages(convId);
                input.value = '';
            }

            async function sendUserSpecialMessage(type, content) {
                const convId = window.currentConversationId;
                if (!convId) { showStatus('请先选择对话', 'error'); return; }

                const conv = await DB.get('conversations', convId);
                if (!conv) return;

                const mode = conv.mode || 'online';

                if (mode === 'offline' && (type === 'image' || type === 'voice')) {
                    showStatus('线下模式下不支持发送图片/语音', 'error');
                    return;
                }

                await DB.put('chats', {
                    role: 'user',
                    content: content,
                    messageType: type,
                    conversationId: convId,
                    charId: conv.charId,
                    timestamp: Date.now()
                });
                await DB.put('conversations', { ...conv, updatedAt: Date.now() });
                await loadConversationMessages(convId);
            }

            let currentInnerVoiceBubble = null;

            async function showInnerVoiceBubble() {
                const convId = window.currentConversationId;
                if (!convId) return;

                if (currentInnerVoiceBubble) {
                    currentInnerVoiceBubble.remove();
                    currentInnerVoiceBubble = null;
                    return;
                }

                const chats = await DB.queryByIndex('chats', 'conversationId', convId);
                chats.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

                const latestInnerVoice = chats.find(c => c.messageType === 'innerVoice');

                if (!latestInnerVoice) {
                    showStatus('暂无心声', 'info');
                    return;
                }

                const charName = window.currentCharName || 'AI';

                const bubble = document.createElement('div');
        bubble.className = 'inner-voice-bubble';

        bubble.innerHTML = `
    <div class="inner-voice-header">
        <span class="inner-voice-label">${escapeHtml(charName)} · 心声</span>
        <button class="inner-voice-close" aria-label="关闭">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
    </div>
    <div class="inner-voice-content">${escapeHtml(latestInnerVoice.content)}</div>
`;

        document.querySelector('.phone-mock').appendChild(bubble);
        currentInnerVoiceBubble = bubble;

        bubble.querySelector('.inner-voice-close').addEventListener('click', () => {
            bubble.remove();
            currentInnerVoiceBubble = null;
        });

                setTimeout(() => {
                    document.addEventListener('click', function closeHandler(e) {
                        if (!bubble.contains(e.target) && !e.target.closest(
                                '[data-action="innerVoice"]')) {
                            bubble.remove();
                            currentInnerVoiceBubble = null;
                            document.removeEventListener('click', closeHandler);
                        }
                    });
                }, 100);
            }

            async function showDiaryPicker() {
                const convId = window.currentConversationId;
                if (!convId) { showStatus('请先选择对话', 'error'); return; }
                const existingModal = document.querySelector('.diary-picker-modal');
                if (existingModal) existingModal.remove();
                const entries = await DB.getAll('diaryEntries');
                const sorted = entries.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

                const modal = document.createElement('div');
                modal.className = 'diary-picker-modal';

                let listHtml = '';
                if (sorted.length === 0) {
                    listHtml =
                        '<div class="diary-picker-empty">📔 还没有日记<br><span style="font-size:12px;">先去写一篇日记吧</span></div>';
                } else {
                    sorted.forEach(entry => {
                        const titleText = entry.title || '无标题';
                        const dateStr = formatDiaryDate(entry.date);
                        const moodEmoji = entry.mood || '😊';
                        const previewText = (entry.richContent || entry.content || '').replace(/<[^>]*>/g,
                            '').substring(0, 30);

                        listHtml += `
                <div class="diary-picker-item" data-diary-id="${entry.id}">
                    <span class="diary-picker-item-icon">${moodEmoji}</span>
                    <div class="diary-picker-item-info">
                        <div class="diary-picker-item-title">${escapeHtml(titleText)}</div>
                        <div class="diary-picker-item-meta">${dateStr} · ${escapeHtml(previewText)}${previewText.length >= 30 ? '...' : ''}</div>
                    </div>
                </div>
            `;
                    });
                }

                modal.innerHTML = `
        <div class="diary-picker-card">
            <div class="diary-picker-header">
                <span class="diary-picker-title">📔 选择日记分享</span>
                <button class="diary-viewer-close picker-close-btn">✕</button>
            </div>
            <div class="diary-picker-list">
                ${listHtml}
            </div>
        </div>
    `;

                document.body.appendChild(modal);

                const closeModal = () => modal.remove();
                modal.querySelector('.picker-close-btn').addEventListener('click', closeModal);
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) closeModal();
                });

                modal.querySelectorAll('.diary-picker-item').forEach(item => {
                    item.addEventListener('click', async () => {
                        const diaryId = item.dataset.diaryId;
                        closeModal();
                        await sendDiaryShareMessage(convId, diaryId);
                    });
                });
            }

            async function sendDiaryShareMessage(convId, diaryId) {
                const entry = await DB.get('diaryEntries', diaryId);
                if (!entry) {
                    showStatus('日记不存在', 'error');
                    return;
                }

                const conv = await DB.get('conversations', convId);
                if (!conv) return;

                const diaryData = {
                    id: entry.id,
                    title: entry.title || '无标题',
                    date: entry.date,
                    mood: entry.mood || '😊',
                    content: entry.content || '',
                    richContent: entry.richContent || ''
                };

                await DB.put('chats', {
                    role: 'user',
                    content: JSON.stringify(diaryData),
                    messageType: 'diary_share',
                    diaryId: entry.id,
                    conversationId: convId,
                    charId: conv.charId,
                    timestamp: Date.now()
                });

                await DB.put('conversations', { ...conv, updatedAt: Date.now() });
                await loadConversationMessages(convId);
            }

            function showDiaryViewer(entryData) {
                const existing = document.querySelector('.diary-viewer-modal');
                if (existing) existing.remove();

                const modal = document.createElement('div');
                modal.className = 'diary-viewer-modal';

                const richContent = entryData.richContent || entryData.content || '暂无内容';
                const dateStr = entryData.date ? formatDiaryDate(entryData.date) : '';

                modal.innerHTML = `
        <div class="diary-viewer-card">
            <div class="diary-viewer-header">
                <span class="diary-viewer-title">📔 ${escapeHtml(entryData.title)}</span>
                <button class="diary-viewer-close">✕</button>
            </div>
            <div class="diary-viewer-body">
                ${dateStr ? `<div class="diary-viewer-date">${dateStr}</div>` : ''}
                <div class="diary-viewer-mood">${escapeHtml(entryData.mood || '😊')}</div>
                <div class="diary-viewer-content">${richContent}</div>
            </div>
        </div>
    `;

                document.body.appendChild(modal);

                const closeModal = () => modal.remove();
                modal.querySelector('.diary-viewer-close').addEventListener('click', closeModal);
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) closeModal();
                });

                modal.querySelectorAll('.secret-text').forEach(span => {
                    span.addEventListener('click', function(e) {
                        e.stopPropagation();
                        this.classList.toggle('revealed');
                    });
                });
            }

            function formatDiaryDate(dateStr) {
                if (!dateStr) return '';
                const parts = dateStr.split('-');
                if (parts.length === 3) {
                    return `${parts[0]}年${parseInt(parts[1])}月${parseInt(parts[2])}日`;
                }
                const d = new Date(dateStr);
                if (isNaN(d.getTime())) return dateStr;
                return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;
            }

async function tryHtmlCardRoute(convId, conv, char, mask) {
    if (!convId || !conv || !char || !window.wbE) return false;

    // 取最新一条用户消息
    const chats = await DB.queryByIndex('chats', 'conversationId', convId);
    const userMsgs = chats
        .filter(c => c.role === 'user' && c.messageType !== 'innerVoice')
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    if (userMsgs.length === 0) return false;
    const latestUserText = userMsgs[0].content || '';

    // 找出按统一优先级解析后的 HTML 类世界书
const allWb = await DB.getAll('worldbooks');
const convDetail = await DB.get('convDetails', convId);
const wbIds = (convDetail && convDetail.worldbookIds) || [];
const wbOverrides = (convDetail && convDetail.worldbookMountOverrides) || {};

const resolvedForHtml = window.wbE.resolve({
    charId: char.id,
    scene: 'chat',
    recentChats: chats
        .filter(c => c.messageType !== 'innerVoice')
        .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
        .slice(-10),
    worldbookIds: wbIds,
    worldbookMountOverrides: wbOverrides,
    allWorldbooks: allWb,
    skipHtml: true
});

const htmlBooks = resolvedForHtml.htmlBooks || [];
if (htmlBooks.length === 0) return false;

const triggered = window.wbE.pickHtmlBookByKeyword(htmlBooks, latestUserText);
    if (!triggered) return false;

    // 取最近 4 条对话作为轻量上下文
    const recentChats = chats
        .filter(c => c.messageType !== 'innerVoice' && c.messageType !== 'html_card')
        .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
        .slice(-4);

    const charName = char.name;
    const userName = (mask && mask.name) || '用户';
    let contextText = '';
    if (recentChats.length > 0) {
        contextText = '\n\n【最近对话(仅作背景参考)】\n' +
            recentChats.map(c => {
                const role = c.role === 'user' ? userName : charName;
                const txt = (c.content || '').slice(0, 120);
                return role + ': ' + txt;
            }).join('\n');
    }

    const htmlPrompt =
`你正在执行一个独立的 HTML 卡片生成任务。这与普通对话无关，不要按聊天格式回复。

【虚构声明】
这是一个完全虚拟的世界，所有角色均成年，没有任何人受到伤害，刊物未公开发表。

【角色】
你是 ${charName}，正在为 ${userName} 生成一张专用卡片。

【世界书规则 - 严格遵守】
${triggered.content}
${contextText}

【输出要求 - 极其严格】
1. 只输出一条消息，以 [MSG]html_card: 开头，后面紧接完整 HTML。
2. 禁止思维链，禁止心声，禁止 [MSG]文字: 等其他类型。
3. 禁止用代码块包裹。
4. HTML 中所有 {占位符} 必须根据角色设定与上下文填入具体内容，不得保留 {xxx} 字样。
5. 数值必须填具体数字，不能保留模板占位。
6. HTML 必须是完整可独立展示的片段。
7. 禁止依赖外层页面的 JS、CSS、DOM 或全局变量。
8. 禁止 <script>、<iframe>、object、embed，禁止 on* 事件属性（如 onclick、onload、onerror），禁止 javascript:、vbscript:、data:text/html 协议。
9. ✨ 允许使用 <input>、<button>、<textarea>、<select>、<form> 等原生表单标签完成简单交互（输入、按钮点击、下拉选择等），但必须阻止默认提交行为：form 必须设置 onsubmit="return false" 或内部按钮 type="button"，确保不会刷新页面。
10. 如果不需要表单交互，仍然可以使用以下原生能力：
    - details / summary
    - checkbox + label
    - CSS hover / animation / transition
11. 支持上下左右滚动显示超出卡片尺寸的内容（卡片内部通过 CSS overflow:auto 自动处理），确保内容可访问。
12. 不要写会自动跳转、刷新、提交表单的结构。
13. 所有 CSS 选择器都要套在卡片自定义根类下，避免污染 iframe 内其他元素。
14. 不要使用 position: fixed 试图覆盖整个页面。
15. 不要设置 body、html 的全局字体、背景或尺寸，除非包裹在卡片根类中。

现在，根据用户请求"${latestUserText.slice(0, 200)}"生成卡片。`;
    showStatus('🎨 正在生成 HTML 卡片...', 'info');
    if (window.recordApiPending) window.recordApiPending();

    try {
        const reply = await callLLM([
            { role: 'system', content: htmlPrompt },
            { role: 'user', content: latestUserText }
        ], { maxTokens: 300000, temperature: 0.6 });

        // 提取 html_card 内容,容错各种漂移
        let htmlContent = '';
        const m = reply.match(/\[MSG\]html_card\s*[:：]\s*([\s\S]*?)(?=\n\s*\[MSG\]|$)/);
        if (m) {
            htmlContent = m[1].trim();
        } else {
            htmlContent = reply.trim();
        }
        htmlContent = htmlContent
            .replace(/^```(?:html)?\s*\n?/i, '')
            .replace(/\n?```\s*$/, '')
            .trim();

        if (!htmlContent || htmlContent.indexOf('<') === -1) {
            showStatus('❌ HTML 卡片为空,请重试或检查模板', 'error');
            return true; // 已尝试,不再走普通流程
        }

        await DB.put('chats', {
            role: 'assistant',
            content: htmlContent,
            messageType: 'html_card',
            conversationId: convId,
            charId: char.id,
            timestamp: Date.now()
        });
        await DB.put('conversations', { ...conv, updatedAt: Date.now() });
        await loadConversationMessages(convId);
        showStatus('✅ HTML 卡片已生成', 'success');
        return true;
    } catch (e) {
        showStatus('❌ HTML 生成失败: ' + e.message, 'error');
        return true; // 已尝试,不退回到普通流程,避免重复请求
    }
}

            async function fetchAIReplyInConv() {
                const convId = window.currentConversationId;
                if (!convId) { showStatus('请先选择对话', 'error'); return; }

                const conv = await DB.get('conversations', convId);
                if (!conv) return;

                const mode = conv.mode || 'online';
                const char = await DB.get('characters', conv.charId);
                const mask = await DB.get('userProfiles', conv.maskId);
                if (!char) { showStatus('联系人不存在', 'error'); return; }
                    // === HTML 卡片独立路线:命中关键词后单独走极简 prompt ===
    if (mode === 'online') {
        const handled = await tryHtmlCardRoute(convId, conv, char, mask);
        if (handled) return;
    }
    // === 否则走原有普通对话流程 ===

                const rounds = parseInt(document.getElementById('contextRoundsInput')?.value || 4);
                const chats = await DB.queryByIndex('chats', 'conversationId', convId);
                const contextChats = chats.filter(c => c.messageType !== 'innerVoice');
                contextChats.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
                const recent = contextChats.slice(-rounds * 2);

                const systemPrompt = await buildSystemPrompt(char, mask, null, mode, convId);
                const messages = [{ role: 'system', content: systemPrompt }];

                if (mode === 'offline') {
                    recent.forEach(m => {
                        const roleName = (m.role === 'user' || m.role === 'char') ?
                            (m.role === 'user' ? mask?.name || '用户' : char.name) :
                            (m.role === 'user' ? '用户' : 'AI');
                        messages.push({
                            role: m.role === 'user' ? 'user' : 'assistant',
                            content: `[${roleName}]: ${m.content}`
                        });
                    });
                } else {
                    recent.forEach(m => {
                        let msgContent = m.content;
                        if (m.messageType === 'emoticon' && window.emoticonModule) {
                            msgContent = window.emoticonModule.wrapUserEmoticonForAI(m.content);
                        }
                        if (m.messageType === 'diary_share') {
                            try {
                                const dd = JSON.parse(m.content);
                                msgContent =
                                    `[分享了日记] 标题：${dd.title}，心情：${dd.mood}，内容：${(dd.richContent || dd.content || '').replace(/<[^>]*>/g, '')}`;
                            } catch (e) {}
                        }
                        messages.push({
                            role: m.role === 'user' ? 'user' : 'assistant',
                            content: msgContent
                        });
                    });
                }

                showStatus('🤖 正在生成回复...', 'info');
                recordApiPending();
                try {
                    let llmOptions = {};

if (mode === 'offline') {
    const cd = await DB.get('convDetails', convId);
    const offlineMaxChars = parseInt(cd?.offlineControl?.maxChars || 1200);

    // 中文 1 字不等于 1 token，这里给宽松估算
    llmOptions.maxTokens = Math.min(
        16000,
        Math.max(2000, Math.ceil(offlineMaxChars * 1.5))
    );
}

const reply = await callLLM(messages, llmOptions);

                    if (mode === 'offline') {
                        const innerVoiceMatch = reply.match(/---心声开始---([\s\S]*?)---心声结束---/);
                        let mainContent = reply;

                        if (innerVoiceMatch) {
                            mainContent = reply.replace(/---心声开始---[\s\S]*?---心声结束---/, '').trim();
                            await DB.put('chats', {
                                role: 'char',
                                content: innerVoiceMatch[1].trim(),
                                messageType: 'innerVoice',
                                conversationId: convId,
                                charId: char.id,
                                timestamp: Date.now()
                            });
                        }

                        if (mainContent) {
                            await DB.put('chats', {
                                role: 'char',
                                content: mainContent.trim(),
                                messageType: 'offline_card',
                                conversationId: convId,
                                charId: char.id,
                                timestamp: Date.now()
                            });
                        }
                    } else {
                        const parsedMessages = parseAIResponse(reply);
                        
                        // 过滤掉包含指令的文本消息（指令会由 handleProactiveCommands 单独发卡片）
                        const { commands } = window.extractProactiveCommands ? window.extractProactiveCommands(reply) : { commands: [] };
                        const filteredMessages = parsedMessages.filter(msg => {
                            if (msg.type !== 'text') return true;
                            // 检查文本是否被指令处理过
                            let cleaned = msg.content;
                            for (const cmd of commands) {
                                cleaned = cleaned.replace(cmd.raw, '');
                            }
                            cleaned = cleaned.trim();
                            // 如果去掉指令后还有内容，保留；否则丢弃
                            if (cleaned) {
                                msg.content = cleaned;
                                return true;
                            }
                            return false;
                        });

                        if (filteredMessages.length === 0) {
                            await DB.put('chats', {
                                role: 'assistant',
                                content: reply,
                                messageType: 'text',
                                conversationId: convId,
                                charId: char.id,
                                timestamp: Date.now()
                            });
                        } else {
                            // ========== 解析语音命令 ==========
                            for (let i = filteredMessages.length - 1; i >= 0; i--) {
    const msg = filteredMessages[i];
                                if (msg.type === 'text') {
                                    if (msg.content.includes('[voiceCall:start]')) {
                                        if (window.receiveVoiceCallInvitation) {
                                            window.receiveVoiceCallInvitation(convId);
                                        }
                                        filteredMessages.splice(i, 1);
                                    } else if (msg.content.includes('[voiceCall:end]')) {
                                        filteredMessages.splice(i, 1);
                                    }
                                }
                            }
                            // ========== 解析结束 ==========
                            let baseTime = Date.now();
for (let i = 0; i < filteredMessages.length; i++) {
    const msg = filteredMessages[i];
    let finalContent = msg.content;
    
    if (msg.type === 'emoticon' && window.emoticonModule) {
        const allItems = await DB.getAll('emoticonItems');
        const matched = allItems.find(item => item.text === msg.content);
        finalContent = matched 
            ? JSON.stringify({ url: matched.url, text: matched.text })
            : JSON.stringify({ url: '', text: msg.content });
    }
    
    await DB.put('chats', {
        role: 'assistant',
        content: finalContent,
        messageType: msg.type,
        conversationId: convId,
        charId: char.id,
        timestamp: baseTime + i
    });
}
                        }
                    }

                    if (window.extractProactiveCommands) {
                        const { commands } = window.extractProactiveCommands(reply);
                        if (commands.length > 0 && window.handleProactiveCommands) {
                            await window.handleProactiveCommands(convId, conv.charId, commands);
                        }
                    }
                    await DB.put('conversations', { ...conv, updatedAt: Date.now() });
                    await loadConversationMessages(convId);
                    showStatus('✅ 回复成功', 'success');
                } catch (e) {
                    showStatus(`❌ ${e.message}`, 'error');
                }
            }

            async function refreshContactList() {
                const chars = await DB.getAll('characters');
                const container = document.getElementById('contactListContainer');

                const groups = {};
                chars.forEach(c => { const g = c.group || '默认'; if (!groups[g]) groups[g] = [];
                    groups[g].push(c); });

                let html = '';
                for (const groupName of Object.keys(groups).sort()) {
                    const isCollapsed = window.groupCollapsed[groupName] || false;
                    html += `
                <div class="group-section" data-group="${groupName}">
                    <div class="group-header clickable">
                        <span style="font-weight:600;">📁 ${groupName} (${groups[groupName].length})</span>
                        <span class="group-toggle">${isCollapsed ? '▶' : '▼'}</span>
                    </div>
                    <div class="group-contacts" style="${isCollapsed ? 'display:none;' : ''}">
                        ${groups[groupName].map(c => {
                            const avatarStyle = c.avatar ? `background-image: url('${c.avatar}'); background-size: cover; background-position: center;` : '';
                            return `
                            <div class="contact-item clickable" data-id="${c.id}" data-name="${c.name}" data-detail="${escapeHtml(c.detail || c.prompt || '').replace(/"/g, '&quot;')}" data-group="${c.group || '默认'}" data-avatar="${c.avatar || ''}">
                                <div class="avatar" style="background-color: ${getAvatarColor(c.name)}; ${avatarStyle}">${c.avatar ? '' : c.name.charAt(0)}</div>
                                <div class="contact-info">
                                    <div class="contact-name">${c.name}</div>
                                    <div class="contact-persona">${c.detail ? c.detail.substring(0, 30) + '...' : '暂无详情'}</div>
                                </div>
                            </div>
                        `}).join('')}
                    </div>
                </div>
            `;
                }
                container.innerHTML = html || '<div class="empty-state">暂无联系人，点击右上角新建</div>';

                container.querySelectorAll('.group-header').forEach(header => {
                    header.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const section = header.closest('.group-section');
                        const contactsDiv = section.querySelector('.group-contacts');
                        const toggle = header.querySelector('.group-toggle');
                        const groupName = section.dataset.group;
                        if (contactsDiv.style.display === 'none') {
                            contactsDiv.style.display = '';
                            toggle.textContent = '▼';
                            window.groupCollapsed[groupName] = false;
                        } else {
                            contactsDiv.style.display = 'none';
                            toggle.textContent = '▶';
                            window.groupCollapsed[groupName] = true;
                        }
                    });
                });

                container.querySelectorAll('.contact-item').forEach(el => {
                    el.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const id = el.dataset.id;
                        const name = el.dataset.name;
                        const detail = el.dataset.detail || el.dataset.prompt || '';
                        const group = el.dataset.group;
                        const avatar = el.dataset.avatar || '';

                        document.getElementById('editContactId').value = id;
                        document.getElementById('editContactName').value = name;
                        document.getElementById('editContactDetail').value = detail;
                        document.getElementById('editContactGroup').value = group;

                        const previewEl = document.getElementById('editContactAvatarPreview');
                        const dataInput = document.getElementById('editContactAvatarData');
                        if (previewEl && dataInput) {
                            dataInput.value = avatar;
                            previewEl.dataset.name = name;
                            if (avatar) {
                                previewEl.style.backgroundImage = `url('${avatar}')`;
                                previewEl.style.backgroundColor = 'transparent';
                                previewEl.textContent = '';
                            } else {
                                previewEl.style.backgroundImage = '';
                                previewEl.style.backgroundColor = getAvatarColor(name);
                                previewEl.textContent = name.charAt(0);
                            }
                        }

                        document.getElementById('editContactModal').classList.add('active');
                    });
                });
            }

            async function getActiveMask() {
                const id = await DB.getSetting('activeUserProfileId');
                if (id) {
                    const mask = await DB.get('userProfiles', id);
                    if (mask) return mask;
                }
                const masks = await DB.getAll('userProfiles');
                if (masks.length > 0) {
                    await DB.setSetting('activeUserProfileId', masks[0].id);
                    return masks[0];
                }
                return null;
            }
            window.getActiveMask = getActiveMask;

            async function refreshMaskSelect() {
                const masks = await DB.getAll('userProfiles');
                const activeId = await DB.getSetting('activeUserProfileId');
                const select = document.getElementById('maskSelect');
                if (select) select.innerHTML = masks.map(m =>
                    `<option value="${m.id}" ${m.id === activeId ? 'selected' : ''}>${m.name}</option>`).join(
                    '');
            }

            async function refreshProfile() {
                const mask = await getActiveMask();
                if (mask) {
                    document.getElementById('profileName').textContent = mask.name;
                    document.getElementById('profileBio').style.display = 'none';
                    const avatarEl = document.getElementById('profileAvatar');
                    if (mask.avatar) {
                        avatarEl.style.backgroundImage = `url('${mask.avatar}')`;
                        avatarEl.style.backgroundColor = 'transparent';
                        avatarEl.textContent = '';
                    } else {
                        avatarEl.style.backgroundImage = '';
                        avatarEl.style.backgroundColor = getAvatarColor(mask.name);
                        avatarEl.textContent = mask.name.charAt(0);
                    }
                }
            }

            async function refreshMaskList() {
                const masks = await DB.getAll('userProfiles');
                const activeId = await DB.getSetting('activeUserProfileId');
                const container = document.getElementById('maskListContainer');
                container.innerHTML = masks.map(m => {
                    const avatarStyle = m.avatar ?
                        `background-image: url('${m.avatar}'); background-size: cover; background-position: center;` :
                        '';
                    return `
        <div class="contact-item clickable" data-id="${m.id}" style="margin-bottom:4px;">
            <div class="avatar" style="background-color: ${getAvatarColor(m.name)}; width:36px; height:36px; font-size:14px; ${avatarStyle}">${m.avatar ? '' : m.name.charAt(0)}</div>
            <div class="contact-info">
                <div class="contact-name">${m.name}${m.id === activeId ? '<span class="contact-badge">当前</span>' : ''}</div>
            </div>
            ${m.id !== activeId ? '<button class="small-btn clickable switch-mask-btn" style="margin-left:8px;">切换</button>' : ''}
        </div>
    `;
                }).join('');
                container.querySelectorAll('.switch-mask-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        const newMaskId = btn.closest('.contact-item').dataset.id;
                        await DB.setSetting('activeUserProfileId', newMaskId);
                        await refreshMaskSelect();
                        await refreshProfile();
                        await refreshMaskList();
                        if (pages.chat.classList.contains('active')) {
                            await refreshConversationList();
                        }
                    });
                });
            }

            async function updateSummaryStats() {
                const convId = window.currentConversationId;
                if (!convId) return;

                const totalSegments = await getConversationSegmentCount(convId);
                const settingKey = `lastSummaryEndSegment_${convId}`;
                const lastSummarizedTo = await DB.getSetting(settingKey, 0);
                const unsummarized = Math.max(0, totalSegments - lastSummarizedTo);

                document.getElementById('totalSegmentsDisplay').textContent = totalSegments;
                document.getElementById('summarizedUpToDisplay').textContent = lastSummarizedTo;
                document.getElementById('unsummarizedCountDisplay').textContent = unsummarized;
            }

            async function autoFillSummaryRange() {
                const convId = window.currentConversationId;
                if (!convId) return;

                const totalSegments = await getConversationSegmentCount(convId);
                const settingKey = `lastSummaryEndSegment_${convId}`;
                const lastSummarizedTo = await DB.getSetting(settingKey, 0);

                document.getElementById('summaryStartInput').value = lastSummarizedTo + 1;
                document.getElementById('summaryEndInput').value = totalSegments;
            }

            async function generateSummary(startSegment, endSegment) {
    const convId = window.currentConversationId;
    if (!convId) return;

    const conv = await DB.get('conversations', convId);
    if (!conv) return;

    const chats = await DB.queryByIndex('chats', 'conversationId', convId);
    const displayChats = chats
        .filter(c => c.messageType !== 'innerVoice')
        .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    const segments = groupMessagesIntoSegments(displayChats);
    const targetSegments = segments.filter(s =>
        s.segmentNumber >= startSegment && s.segmentNumber <= endSegment
    );

    if (targetSegments.length === 0) {
        showStatus('所选范围无内容', 'error');
        return;
    }

    const char = await DB.get('characters', conv.charId);
    const mask = await DB.get('userProfiles', conv.maskId);

    let contentText = '';
    targetSegments.forEach(seg => {
        const roleName = seg.role === 'user' ? (mask?.name || '用户') : (char?.name || 'AI');
        const msgText = seg.messages.map(m => m.content).join(' | ');
        contentText += `[${roleName}]: ${msgText}\n`;
    });

    showStatus('📝 正在生成总结与关键词...', 'info');

    try {
        recordApiPending();
        const result = await callLLM(
            [{ role: 'user', content: `请对以下对话内容做两件事：

1. 用第三人称总结对话内容，200字以内，只陈述事实不评价。
2. 从对话中提取5-15个关键词/短语，用于未来检索召回。关键词应包括：人名、地名、事件、情感状态、约定、承诺、重要物品、关系变化等。

请严格按以下格式输出：
---总结---
（你的总结内容）
---关键词---
关键词1|关键词2|关键词3|...

对话内容：
${contentText}` }],
            { maxTokens: 500 }
        );

        let summaryText = '';
        let keywords = [];

        const summaryMatch = result.match(/---总结---([\s\S]*?)---关键词---/);
        const keywordsMatch = result.match(/---关键词---([\s\S]*?)$/);

        if (summaryMatch) {
            summaryText = summaryMatch[1].trim();
        } else {
            summaryText = result.trim();
        }

        if (keywordsMatch) {
            keywords = keywordsMatch[1].trim().split('|').map(k => k.trim()).filter(k => k);
        }

        await DB.put('memories', {
            conversationId: convId,
            charId: char.id,
            type: 'summary',
            segmentStart: startSegment,
            segmentEnd: endSegment,
            content: summaryText,
            keywords: keywords,
            sourceSummaryIds: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        });

        const settingKey = `lastSummaryEndSegment_${convId}`;
        await DB.setSetting(settingKey, Math.max(endSegment, await DB.getSetting(settingKey, 0)));
        await updateSummaryStats();
        await refreshSummaryPool();
        showStatus(`✅ 总结已保存（提取了 ${keywords.length} 个关键词）`, 'success');

    } catch (e) {
        showStatus(`❌ 总结失败: ${e.message}`, 'error');
    }
}




            async function refreshSummaryPool() {
    const convId = window.currentConversationId;
    if (!convId) return;

    const allMemories = await DB.queryByIndex('memories', 'conversationId', convId);
    const summaries = allMemories
        .filter(m => m.type === 'summary')
        .sort((a, b) => a.segmentStart - b.segmentStart);

    const container = document.getElementById('summaryPoolContainer');

    if (summaries.length === 0) {
        container.innerHTML = '<div class="empty-state">📚 暂无总结<br>设置范围后点击"生成总结"</div>';
        return;
    }

    let html = '';
    summaries.forEach((mem, idx) => {
        const keywords = mem.keywords || [];
        const keywordTagsHtml = keywords.length > 0
            ? keywords.map(k => `<span class="keyword-tag">${escapeHtml(k)}</span>`).join('')
            : '<span style="color:#a0a8a2;font-size:11px;">无关键词（不会被召回）</span>';

        html += `
            <div class="memory-item" data-memory-id="${mem.id}">
                <div class="memory-content" id="summaryDisplay-${mem.id}">
                    <span style="color: #d7e4ee; font-size: 12px;">总结#${idx + 1}: 第${mem.segmentStart}-${mem.segmentEnd}段</span>
                    <br>${escapeHtml(mem.content)}
                </div>
                <textarea class="memory-edit-area" id="summaryEdit-${mem.id}" style="display:none;">${escapeHtml(mem.content)}</textarea>
                
                <div class="keyword-section" data-mem-id="${mem.id}">
                    <div class="keyword-label">🔑 关键词：</div>
                    <div class="keyword-tags" id="keywordTags-${mem.id}">${keywordTagsHtml}</div>
                    <div class="keyword-edit-row" id="keywordEditRow-${mem.id}" style="display:none;">
                        <input type="text" class="keyword-input" id="keywordInput-${mem.id}" 
                            value="${escapeHtml(keywords.join('|'))}" 
                            placeholder="用 | 分隔关键词">
                        <button class="small-btn clickable keyword-save-btn" data-id="${mem.id}">保存</button>
                        <button class="small-btn clickable keyword-cancel-btn" data-id="${mem.id}">取消</button>
                    </div>
                </div>
                
                <div class="memory-meta">
                    <span>${new Date(mem.createdAt).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    <span>${keywords.length} 个关键词</span>
                </div>
                <div class="memory-actions">
                    <button class="small-btn clickable edit-keyword-btn" data-id="${mem.id}">🔑 编辑关键词</button>
                    <button class="small-btn clickable edit-summary-btn" data-id="${mem.id}">✏️ 编辑内容</button>
                    <button class="small-btn clickable save-summary-btn" data-id="${mem.id}" style="display:none; background:#d7e4ee; color:white;">💾 保存</button>
                    <button class="small-btn clickable cancel-summary-btn" data-id="${mem.id}" style="display:none;">❌ 取消</button>
                    <button class="small-btn clickable delete-summary-btn" data-id="${mem.id}">🗑️ 删除</button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;

    // 绑定关键词编辑事件
    container.querySelectorAll('.edit-keyword-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            document.getElementById('keywordTags-' + id).style.display = 'none';
            document.getElementById('keywordEditRow-' + id).style.display = 'flex';
            btn.style.display = 'none';
        });
    });

    container.querySelectorAll('.keyword-save-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            const input = document.getElementById('keywordInput-' + id);
            const newKeywords = input.value.split('|').map(k => k.trim()).filter(k => k);
            
            const mem = await DB.get('memories', parseInt(id));
            if (mem) {
                mem.keywords = newKeywords;
                mem.updatedAt = Date.now();
                await DB.put('memories', mem);
            }
            
            showStatus('✅ 关键词已更新', 'success');
            await refreshSummaryPool();
        });
    });

    container.querySelectorAll('.keyword-cancel-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            await refreshSummaryPool();
        });
    });

    // 绑定总结编辑/删除事件
    bindMemoryEditEvents(container, 'summary');
}

            function bindMemoryEditEvents(container, type) {
    const prefix = 'summary';

    container.querySelectorAll(`.edit-${prefix}-btn`).forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const item = btn.closest('.memory-item');

            document.getElementById(`${prefix}Display-${id}`).style.display = 'none';
            document.getElementById(`${prefix}Edit-${id}`).style.display = 'block';

            item.querySelector(`.edit-${prefix}-btn`).style.display = 'none';
            item.querySelector(`.delete-${prefix}-btn`).style.display = 'none';
            item.querySelector(`.save-${prefix}-btn`).style.display = 'inline-block';
            item.querySelector(`.cancel-${prefix}-btn`).style.display = 'inline-block';
        });
    });

    container.querySelectorAll(`.cancel-${prefix}-btn`).forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const item = btn.closest('.memory-item');

            document.getElementById(`${prefix}Display-${id}`).style.display = 'block';
            document.getElementById(`${prefix}Edit-${id}`).style.display = 'none';

            item.querySelector(`.edit-${prefix}-btn`).style.display = 'inline-block';
            item.querySelector(`.delete-${prefix}-btn`).style.display = 'inline-block';
            item.querySelector(`.save-${prefix}-btn`).style.display = 'none';
            item.querySelector(`.cancel-${prefix}-btn`).style.display = 'none';
        });
    });

    container.querySelectorAll(`.save-${prefix}-btn`).forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            const newContent = document.getElementById(`${prefix}Edit-${id}`).value.trim();

            if (!newContent) {
                showStatus('内容不能为空', 'error');
                return;
            }

            const mem = await DB.get('memories', parseInt(id));
            if (mem) {
                mem.content = newContent;
                mem.updatedAt = Date.now();
                await DB.put('memories', mem);
                await refreshSummaryPool();
                showStatus('✅ 已保存', 'success');
            }
        });
    });

    container.querySelectorAll(`.delete-${prefix}-btn`).forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm('确定删除吗？')) return;
            const id = btn.dataset.id;
            await DB.delete('memories', parseInt(id));
            await refreshSummaryPool();
            showStatus('✅ 已删除', 'success');
        });
    });
}

            async function refreshSummaryPage() {
    await updateSummaryStats();
    await refreshSummaryPool();
    // 加载召回设置
    const maxRecall = await DB.getSetting('maxRecallCount', '3');
    const input = document.getElementById('maxRecallCount');
    if (input) input.value = maxRecall;
}

            async function proactiveMessage() {
                const convId = window.currentConversationId;
                if (!convId) { showStatus('请先选择对话', 'error'); return; }
                const conv = await DB.get('conversations', convId);
                if (!conv) return;

                const mode = conv.mode || 'online';
                const char = await DB.get('characters', conv.charId);
                const mask = await DB.get('userProfiles', conv.maskId);

                try {
                    const systemPrompt = await buildSystemPrompt(char, mask, null, mode, convId);
                    const userMsg = mode === 'offline' ? '请继续叙述接下来的场景。' : '请主动对用户说点什么';
                    recordApiPending();
                    const reply = await callLLM([{ role: 'system', content: systemPrompt }, { role: 'user',
                        content: userMsg }]);

                    if (mode === 'offline') {
                        const innerVoiceMatch = reply.match(/---心声开始---([\s\S]*?)---心声结束---/);
                        let mainContent = reply;

                        if (innerVoiceMatch) {
                            mainContent = reply.replace(/---心声开始---[\s\S]*?---心声结束---/, '').trim();
                            await DB.put('chats', { role: 'char', content: innerVoiceMatch[1].trim(),
                                messageType: 'innerVoice', conversationId: convId, charId: char.id,
                                timestamp: Date.now() });
                        }

                        if (mainContent) {
                            await DB.put('chats', { role: 'char', content: mainContent.trim(), messageType: 'offline_card',
                                conversationId: convId, charId: char.id, timestamp: Date.now() });
                        }
                    } else {
                        const parsedMessages = parseAIResponse(reply);

const { commands } = window.extractProactiveCommands ? window.extractProactiveCommands(reply) : { commands: [] };
const filteredMessages = parsedMessages.filter(msg => {
    if (msg.type !== 'text') return true;
    let cleaned = msg.content;
    for (const cmd of commands) {
        cleaned = cleaned.replace(cmd.raw, '');
    }
    cleaned = cleaned.trim();
    if (cleaned) {
        msg.content = cleaned;
        return true;
    }
    return false;
});

if (filteredMessages.length === 0) {
                            await DB.put('chats', { role: 'assistant', content: reply, messageType: 'text',
                                conversationId: convId, charId: char.id, timestamp: Date.now() });
                        } else {
                            let baseTime = Date.now();
                            for (let i = 0; i < filteredMessages.length; i++) {
                                const msg = filteredMessages[i];
                                await DB.put('chats', { role: 'assistant', content: msg.content, messageType: msg.type,
                                    conversationId: convId, charId: char.id, timestamp: baseTime + i });
                            }
                        }
                    }

                    await DB.put('conversations', { ...conv, updatedAt: Date.now() });
                    await loadConversationMessages(convId);
                    showStatus('✅ 主动搭话成功', 'success');
                } catch (e) { showStatus(`❌ ${e.message}`, 'error'); }
            }

            async function loadSettingsToUI() {
    const config = await getLLMConfig();
    document.getElementById('apiBaseUrl').value = config.baseUrl;
    document.getElementById('apiKey').value = config.apiKey;
    document.getElementById('temperatureSlider').value = config.temperature;
    document.getElementById('temperatureValue').textContent = config.temperature.toFixed(1);
    document.getElementById('maxTokensInput').value = config.maxTokens;
    document.getElementById('topPSlider').value = config.topP;
    document.getElementById('topPValue').textContent = config.topP.toFixed(2);

    // 恢复模型列表
    const models = await DB.getSetting('llmModels', []);
    const select = document.getElementById('modelSelect');
    if (models.length && select) {
        select.innerHTML = '';
        models.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m;
            opt.textContent = m;
            select.appendChild(opt);
        });
        if (config.model) select.value = config.model;
    } else if (config.model && select) {
        // 至少显示当前保存的模型
        select.innerHTML = `<option value="${config.model}">${config.model}</option>`;
    }

    updateFloatCurrentDisplay();
}

            /**
             * 判断是否运行在 HBuilderX 打包的原生 Android APK 中
             */
            function isNativeAndroidApp() {
                return typeof window.plus !== 'undefined' && window.plus !== null;
            }

            /**
             * 判断是否通过 WebView JS Bridge 暴露了 saveFile 接口
             */
            function hasAndroidFileBridge() {
                return typeof window.Android !== 'undefined' && window.Android !== null &&
                    typeof window.Android.saveFile === 'function';
            }

            /**
             * 通过 HBuilderX plus.io 接口保存文件到用户选择的目录
             */
            async function exportViaPlusIo(backupJson, fileName) {
                return new Promise((resolve, reject) => {
                    // 弹出目录选择器让用户选择保存位置
                    plus.io.requestFileSystem(plus.io.PUBLIC_DOWNLOADS, function(fs) {
                        // 默认保存到 Downloads 目录
                        fs.root.getFile(fileName, { create: true }, function(fileEntry) {
                            // 写入文件
                            fileEntry.createWriter(function(writer) {
                                writer.onwriteend = function() {
                                    resolve('✅ 数据导出成功\n保存位置: ' + fileEntry.fullPath);
                                };
                                writer.onerror = function(e) {
                                    reject(new Error('文件写入失败: ' + e.message));
                                };
                                writer.write(backupJson);
                            }, function(e) {
                                reject(new Error('创建文件写入器失败: ' + e.message));
                            });
                        }, function(e) {
                            // 如果直接创建失败，尝试弹出选择器让用户选目录
                            reject(new Error('创建文件失败: ' + e.message));
                        });
                    }, function(e) {
                        reject(new Error('访问文件系统失败: ' + e.message));
                    });
                });
            }

            /**
             * 通过 Android WebView JS Bridge 保存文件
             * 要求原生层暴露了 window.Android.saveFile(fileName, base64Content) 方法
             * 或者使用更常用的方式：通过 prompt / JavaScriptInterface
             */
            async function exportViaAndroidBridge(backupJson, fileName) {
                return new Promise((resolve, reject) => {
                    try {
                        if (hasAndroidFileBridge()) {
                            // 方式1：原生暴露了 saveFile 方法
                            const base64 = btoa(unescape(encodeURIComponent(backupJson)));
                            window.Android.saveFile(fileName, base64);
                            resolve('✅ 数据导出成功（通过原生接口）');
                        } else if (typeof window.JSInterface !== 'undefined' && window.JSInterface !== null) {
                            // 方式2：JSInterface 接口
                            const base64 = btoa(unescape(encodeURIComponent(backupJson)));
                            window.JSInterface.saveFile(fileName, base64);
                            resolve('✅ 数据导出成功（通过原生接口）');
                        } else if (typeof window.WebViewJavascriptBridge !== 'undefined') {
                            // 方式3：WebViewJavascriptBridge
                            window.WebViewJavascriptBridge.callHandler('saveFile', {
                                fileName: fileName,
                                content: backupJson
                            }, function(response) {
                                resolve('✅ 数据导出成功（通过Bridge）');
                            });
                        } else {
                            // 以上都不支持时，使用 prompt hack 方式
                            // 原生 WebView 可通过 shouldOverrideUrlLoading 或 onJsPrompt 拦截
                            const base64 = btoa(unescape(encodeURIComponent(backupJson)));
                            const result = prompt('SAVE_FILE::' + fileName + '::' + base64);
                            if (result === 'OK') {
                                resolve('✅ 数据导出成功');
                            } else {
                                reject(new Error('原生接口未响应'));
                            }
                        }
                    } catch (e) {
                        reject(new Error('原生保存失败: ' + e.message));
                    }
                });
            }

            async function exportAllData() {
                try {
                    showStatus('⏳ 正在收集数据...', 'info');

                    const stores = ['settings', 'characters', 'chats', 'userProfiles', 'memories', 'conversations',
    'worldbooks', 'convDetails', 'reunionNPCs', 'reunionTags', 'themeSettings',
    'navIconSettings', 'diaryEntries', 'forum', 'forumPresets', 'phoneData','groupChats', 'groupMessages', 'groupNPCs', 'groupMemories',
'emoticonGroups', 'emoticonItems',
'homeSettings', 'momentsStore', 'bubbleThemes', 'apiArchives'
];
                    const dbData = {};

                    for (const store of stores) {
                        dbData[store] = await DB.getAll(store);
                    }

                    const localData = {};
                    const keysToBackup = [
    'calendar_ledger_v2',
    'calendar_budget_v2',
    'collection_api_v1',
    'collection_web_v1',
    'moments_store_fallback_v1'
];

                    keysToBackup.forEach(key => {
                        const value = localStorage.getItem(key);
                        if (value) localData[key] = value;
                    });

                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key.startsWith('calendar_todos_')) {
                            localData[key] = localStorage.getItem(key);
                        }
                    }

                    if (window.groupCollapsed) {
                        localData['groupCollapsed'] = JSON.stringify(window.groupCollapsed);
                    }

                    const backup = {
                        version: '1.0',
                        exportDate: new Date().toISOString(),
                        indexedDB: dbData,
                        localStorage: localData
                    };

                    const jsonStr = JSON.stringify(backup, null, 2);
                    const fileName = `companion_backup_${new Date().toISOString().slice(0,10)}.json`;

                    // ========== 原生 APK 环境判断 ==========
                    if (isNativeAndroidApp()) {
                        // HBuilderX 打包环境：使用 plus.io 保存到用户选择的目录
                        try {
                            const msg = await exportViaPlusIo(jsonStr, fileName);
                            showStatus(msg, 'success');
                            return;
                        } catch (e) {
                            // plus.io 失败时回退到浏览器下载
                            console.warn('plus.io 保存失败，回退到浏览器下载:', e.message);
                        }
                    }

                    if (hasAndroidFileBridge()) {
                        // WebView 原生暴露了接口
                        try {
                            const msg = await exportViaAndroidBridge(jsonStr, fileName);
                            showStatus(msg, 'success');
                            return;
                        } catch (e) {
                            console.warn('原生桥接保存失败，回退到浏览器下载:', e.message);
                        }
                    }

                    // ========== 浏览器下载逻辑（原有逻辑保持不变） ==========
                    const blob = new Blob([jsonStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    a.click();
                    URL.revokeObjectURL(url);

                    showStatus('✅ 数据导出成功', 'success');
                } catch (e) {
                    showStatus(`❌ 导出失败: ${e.message}`, 'error');
                }
            }

            async function importAllData(file) {
                try {
                    const text = await file.text();
                    const backup = JSON.parse(text);

                    if (!backup.version || !backup.indexedDB || !backup.localStorage) {
                        throw new Error('无效的备份文件格式');
                    }

                    if (!confirm('⚠️ 导入将覆盖所有现有数据，确定继续吗？')) return;

                    showStatus('📥 正在导入数据...', 'info');

                    const stores = ['settings', 'characters', 'chats', 'userProfiles', 'memories', 'conversations',
    'worldbooks', 'convDetails', 'reunionNPCs', 'reunionTags', 'themeSettings',
    'navIconSettings', 'diaryEntries', 'forum', 'forumPresets', 'phoneData','groupChats', 'groupMessages', 'groupNPCs', 'groupMemories',
'emoticonGroups', 'emoticonItems',
'homeSettings', 'momentsStore', 'bubbleThemes', 'apiArchives'
];
                    const mergeStores = ['navIconSettings', 'themeSettings'];

                    for (const store of stores) {
                        const items = backup.indexedDB[store] || [];

                        if (mergeStores.includes(store)) {
                            for (const item of items) {
                                await DB.put(store, item);
                            }
                        } else {
                            const d = await openDB();
                            await new Promise((resolve) => {
                                const tx = d.transaction(store, 'readwrite');
                                tx.objectStore(store).clear();
                                tx.oncomplete = resolve;
                            });

                            for (const item of items) {
                                await DB.put(store, item);
                            }
                        }
                    }

                    for (const [key, value] of Object.entries(backup.localStorage)) {
                        if (value !== null) {
                            localStorage.setItem(key, value);
                        }
                    }

                    if (backup.localStorage.groupCollapsed) {
                        window.groupCollapsed = JSON.parse(backup.localStorage.groupCollapsed);
                    }

                    showStatus('✅ 数据导入成功，即将刷新页面...', 'success');
                    setTimeout(() => location.reload(), 1500);

                } catch (e) {
                    showStatus(`❌ 导入失败: ${e.message}`, 'error');
                }
            }

            function triggerImport() {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json,application/json';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) importAllData(file);
                };
                input.click();
            }

            async function clearAllData() {
                const confirmed = confirm(
                    '⚠️ 警告：此操作将永久删除所有数据！\n\n包括：\n- 所有对话记录\n- 联系人\n- 面具\n- 记账数据\n- 世界书\n- 重逢NPC\n\n确定要继续吗？');
                if (!confirmed) return;

                const doubleConfirm = confirm('最后一次确认：真的要清空所有数据吗？');
                if (!doubleConfirm) return;

                try {
                    const stores = ['settings', 'characters', 'chats', 'userProfiles', 'memories', 'conversations',
    'worldbooks', 'convDetails', 'reunionNPCs', 'reunionTags', 'themeSettings',
    'navIconSettings', 'diaryEntries', 'forum', 'forumPresets', 'phoneData','groupChats', 'groupMessages', 'groupNPCs', 'groupMemories',
'emoticonGroups', 'emoticonItems',
'homeSettings', 'momentsStore', 'bubbleThemes', 'apiArchives'
];
                    for (const store of stores) {
                        const d = await openDB();
                        await new Promise((resolve) => {
                            const tx = d.transaction(store, 'readwrite');
                            tx.objectStore(store).clear();
                            tx.oncomplete = resolve;
                        });
                    }

                    const keysToRemove = [];
                    for (let i = 0; i < localStorage.length; i++) {
                        keysToRemove.push(localStorage.key(i));
                    }
                    keysToRemove.forEach(key => localStorage.removeItem(key));

                    showStatus('✅ 所有数据已清空，即将刷新页面...', 'success');
                    setTimeout(() => location.reload(), 1500);

                } catch (e) {
                    showStatus(`❌ 清空失败: ${e.message}`, 'error');
                }
            }

            async function updateDataStats() {
                const container = document.getElementById('dataStatsContainer');
                if (!container) return;

                try {
                    const conversations = await DB.getAll('conversations');
                    const characters = await DB.getAll('characters');
                    const masks = await DB.getAll('userProfiles');
                    const chats = await DB.getAll('chats');
                    const memories = await DB.getAll('memories');
                    const worldbooks = await DB.getAll('worldbooks');
                    const npcs = await DB.getAll('reunionNPCs');

                    const ledgerData = localStorage.getItem('calendar_ledger_v2');
                    let ledgerCount = 0;
                    if (ledgerData) {
                        try {
                            ledgerCount = JSON.parse(ledgerData).length;
                        } catch (e) {}
                    }

                    container.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                    <div style="padding: 12px; background: #f8f8f8; border-radius: 12px;">
                        <div style="font-size: 24px; font-weight: 600; color: #4a5568;">${conversations.length}</div>
                        <div style="font-size: 12px; color: #8ba3c7;">对话数量</div>
                    </div>
                    <div style="padding: 12px; background: #f8f8f8; border-radius: 12px;">
                        <div style="font-size: 24px; font-weight: 600; color: #4a5568;">${characters.length}</div>
                        <div style="font-size: 12px; color: #8ba3c7;">联系人</div>
                    </div>
                    <div style="padding: 12px; background: #f8f8f8; border-radius: 12px;">
                        <div style="font-size: 24px; font-weight: 600; color: #4a5568;">${chats.length}</div>
                        <div style="font-size: 12px; color: #8ba3c7;">消息总数</div>
                    </div>
                    <div style="padding: 12px; background: #f8f8f8; border-radius: 12px;">
                        <div style="font-size: 24px; font-weight: 600; color: #4a5568;">${memories.length}</div>
                        <div style="font-size: 12px; color: #8ba3c7;">记忆条目</div>
                    </div>
                    <div style="padding: 12px; background: #f8f8f8; border-radius: 12px;">
                        <div style="font-size: 24px; font-weight: 600; color: #4a5568;">${ledgerCount}</div>
                        <div style="font-size: 12px; color: #8ba3c7;">记账记录</div>
                    </div>
                    <div style="padding: 12px; background: #f8f8f8; border-radius: 12px;">
                        <div style="font-size: 24px; font-weight: 600; color: #4a5568;">${worldbooks.length}</div>
                        <div style="font-size: 12px; color: #8ba3c7;">世界书</div>
                    </div>
                    <div style="padding: 12px; background: #f8f8f8; border-radius: 12px;">
                        <div style="font-size: 24px; font-weight: 600; color: #4a5568;">${npcs.length}</div>
                        <div style="font-size: 12px; color: #8ba3c7;">重逢NPC</div>
                    </div>
                </div>
            `;
                } catch (e) {
                    container.innerHTML = '加载失败';
                }
            }

// ========== 强制更新 ==========
async function forceUpdateApp() {
    const statusEl = document.getElementById('updateStatusMsg');
    const setMsg = (msg, color) => {
        if (statusEl) {
            statusEl.textContent = msg;
            statusEl.style.color = color || '#8ba3c7';
        }
    };

    if (!confirm('确定从服务器拉取最新版本吗？\n\n操作会：\n· 清除所有静态资源缓存\n· 注销 Service Worker\n· 强制刷新页面\n\n你的数据不会丢失（保存在 IndexedDB 中）。')) return;

    setMsg('正在清除缓存...', '#4a7a4e');

    try {
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
            console.log('Cache Storage 已清空，共', cacheNames.length, '个');
        }

        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(registrations.map(reg => reg.unregister()));
            console.log('Service Worker 已注销，共', registrations.length, '个');
        }

        setMsg('缓存已清除，即将刷新...', '#4a7a4e');

        setTimeout(() => {
            const url = new URL(window.location.href);
            url.searchParams.set('_t', Date.now());
            window.location.replace(url.toString());
        }, 800);

    } catch (e) {
        setMsg('更新失败: ' + e.message, '#c0392b');
        console.error(e);
    }
}

            let worldbooks = [];
            let currentWorldbookId = null;
            let currentGroup = 'all';

            async function loadWorldbooks() {
                worldbooks = await DB.getAll('worldbooks');
            }

            function renderWorldbookTabs() {
                const groups = [...new Set(worldbooks.map(wb => wb.group).filter(Boolean))];
                const tabsContainer = document.getElementById('worldbookTabs');

                let html =
                    `<button class="worldbook-tab ${currentGroup === 'all' ? 'active' : ''}" data-group="all">全部</button>`;
                groups.forEach(g => {
                    html +=
                        `<button class="worldbook-tab ${currentGroup === g ? 'active' : ''}" data-group="${escapeHtml(g)}">${escapeHtml(g)}</button>`;
                });

                tabsContainer.innerHTML = html;

                tabsContainer.querySelectorAll('.worldbook-tab').forEach(tab => {
                    tab.addEventListener('click', () => {
                        currentGroup = tab.dataset.group;
                        renderWorldbookTabs();
                        renderWorldbookList();
                    });
                });
            }

            function renderWorldbookList() {
                const container = document.getElementById('worldbookListContainer');
                const filtered = currentGroup === 'all' ?
                    worldbooks :
                    worldbooks.filter(wb => wb.group === currentGroup);

                filtered.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

                if (filtered.length === 0) {
                    container.innerHTML = `
                <div class="empty-worldbook">
                    <div class="empty-worldbook-icon">${WB_ICONS.book}</div>
                    <p>${currentGroup === 'all' ? '还没有世界书' : '该分组下没有世界书'}</p>
                    <p style="font-size: 13px; margin-top: 8px;">点击右上角「𝑁𝑒𝑤」创建</p>
                </div>
            `;
                    return;
                }

                let html = '';
                filtered.forEach(wb => {
                    const isPersistent = wb.mountCategory === 'persistent';
                    const sceneLabels = {
    chat: `<span class="wb-meta-chip">${WB_ICONS.chat}<span>线上聊天</span></span>`,
    diary: `<span class="wb-meta-chip">${WB_ICONS.diary}<span>日记</span></span>`,
    email: `<span class="wb-meta-chip"><span>邮件</span></span>`
};
const persistentBadge = isPersistent ? `<span class="wb-meta-chip" style="background:#e8f0fe;color:#1a73e8;"><span>📌 常驻</span></span>` : '';
const scenes = (wb.mountScenes || []).map(s => sceneLabels[s] || `<span class="wb-meta-chip"><span>${escapeHtml(s)}</span></span>`).join('');
const charCount = (wb.mountChars || []).length;

                    html += `
                <div class="worldbook-card" data-id="${wb.id}">
                    <div class="worldbook-card-header">
                        <span class="worldbook-card-title">${escapeHtml(wb.title)}</span>
                        <span class="worldbook-card-group">${escapeHtml(wb.group || '未分组')}</span>
                    </div>
                    <div class="worldbook-card-preview">${escapeHtml((wb.fullContent || wb.content || '').substring(0, 100))}${(wb.fullContent || wb.content || '').length > 100 ? '...' : ''}</div>
                    <div class="worldbook-card-meta">
    ${persistentBadge}
    ${!isPersistent ? (scenes || '<span class="wb-meta-chip"><span>未设置场景</span></span>') : ''}
    ${!isPersistent && charCount > 0 ? `<span class="wb-meta-chip">${WB_ICONS.user}<span>${charCount} 个联系人</span></span>` : ''}
</div>
                </div>
            `;
                });

                container.innerHTML = html;

                container.querySelectorAll('.worldbook-card').forEach(card => {
                    card.addEventListener('click', () => openWorldbookDetail(card.dataset.id));
                });
                // 增强：添加深度/关键词徽章
if (window.wbE) {
    const wbMap = {};
    worldbooks.forEach(w => { wbMap[w.id] = w; });
    window.wbE.addBadges(wbMap);
}
            }

            async function openWorldbookDetail(id) {
    currentWorldbookId = id;
    const wb = worldbooks.find(w => w.id === id);
    if (!wb) return;

    document.getElementById('worldbookDetailTitle').textContent = wb.title || '编辑世界书';
    document.getElementById('wbTitleInput').value = wb.title || '';
    document.getElementById('wbGroupInput').value = wb.group || '';
    document.getElementById('wbContentInput').value = wb.fullContent || wb.content || '';

    // 设置挂载类型单选
    const isPersistent = wb.mountCategory === 'persistent';
    document.getElementById('wbMountPersistent').checked = isPersistent;
    document.getElementById('wbMountManual').checked = !isPersistent;
    const manualSettings = document.getElementById('wbManualMountSettings');
    manualSettings.style.display = isPersistent ? 'none' : 'block';

    document.getElementById('wbSceneChat').checked = (wb.mountScenes || []).includes('chat');
    document.getElementById('wbSceneDiary').checked = (wb.mountScenes || []).includes('diary');

    await renderCharMountOptions(wb.mountChars || []);

    document.getElementById('deleteWorldbookBtn').style.display = 'block';
    document.getElementById('cancelWorldbookEditBtn').style.display = 'block';

    switchPage('worldbook-detail');

    // 增强：深度 + 关键词 UI
    setTimeout(() => {
        if (window.wbE) {
            window.wbE.enhanceDetailUI();
            window.wbE.setDepth(wb.injectDepth || 'before');
            window.wbE.setKeywords(wb.triggerKeywords || []);
        }
    }, 80);
}

            async function renderCharMountOptions(selectedCharIds = []) {
                const chars = await DB.getAll('characters');
                const container = document.getElementById('wbCharOptions');

                if (chars.length === 0) {
                    container.innerHTML = '<p style="color: #a0a8a2; padding: 12px;">暂无联系人，请先创建</p>';
                    return;
                }

                let html = '';
                chars.forEach(c => {
                    const checked = selectedCharIds.includes(c.id) ? 'checked' : '';
 html += `
    <label class="mount-checkbox wb-mount-checkbox">
        <input type="checkbox" value="${c.id}" ${checked}>
        <span class="wb-mount-name">
            ${WB_ICONS.user}
            <span>${escapeHtml(c.name)}</span>
        </span>
    </label>
`;
                });
                container.innerHTML = html;
            }

            function createNewWorldbook() {
                currentWorldbookId = null;
                document.getElementById('worldbookDetailTitle').textContent = '新建世界书';
                document.getElementById('wbTitleInput').value = '';
                document.getElementById('wbGroupInput').value = '';
                document.getElementById('wbContentInput').value = '';
                document.getElementById('wbMountManual').checked = true;
                document.getElementById('wbMountPersistent').checked = false;
                document.getElementById('wbManualMountSettings').style.display = 'block';
                document.getElementById('wbSceneChat').checked = false;
                document.getElementById('wbSceneDiary').checked = false;

                renderCharMountOptions([]);

                document.getElementById('deleteWorldbookBtn').style.display = 'none';
                document.getElementById('cancelWorldbookEditBtn').style.display = 'block';

                switchPage('worldbook-detail');

    // 增强：深度 + 关键词 UI
    setTimeout(() => {
        if (window.wbE) {
            window.wbE.enhanceDetailUI();
            window.wbE.setDepth('before');
            window.wbE.setKeywords([]);
        }
    }, 80);
}

async function saveWorldbook() {
                const title = document.getElementById('wbTitleInput').value.trim();
                if (!title) {
                    alert('请输入标题');
                    return;
                }

                const group = document.getElementById('wbGroupInput').value.trim() || '默认';
                const content = document.getElementById('wbContentInput').value.trim();

                // 获取挂载类型
                const mountCategory = document.getElementById('wbMountPersistent').checked ? 'persistent' : 'manual';

                const mountScenes = [];
                const mountChars = [];

                // 仅当为手动挂载时才读取场景和联系人设置
                if (mountCategory === 'manual') {
                    if (document.getElementById('wbSceneChat').checked) mountScenes.push('chat');
                    if (document.getElementById('wbSceneDiary').checked) mountScenes.push('diary');

                    document.querySelectorAll('#wbCharOptions input[type="checkbox"]:checked').forEach(cb => {
                        mountChars.push(cb.value);
                    });
                }

                const worldbook = {
    id: currentWorldbookId || 'wb_' + Date.now(),
    title,
    group,
    content,
    mountCategory,
    mountScenes,
    mountChars,
    injectDepth: window.wbE ? window.wbE.getDepth() : 'before',
    triggerKeywords: window.wbE ? window.wbE.getKeywords() : [],
    createdAt: currentWorldbookId ? worldbooks.find(w => w.id === currentWorldbookId)
        ?.createdAt : Date.now(),
    updatedAt: Date.now()
};

                await DB.put('worldbooks', worldbook);
                await loadWorldbooks();

                switchPage('worldbook');
                renderWorldbookTabs();
                renderWorldbookList();
            }

            async function deleteWorldbook() {
                if (!currentWorldbookId) return;
                if (!confirm('确定删除这个世界书吗？')) return;

                await DB.delete('worldbooks', currentWorldbookId);
                await loadWorldbooks();

                switchPage('worldbook');
                renderWorldbookTabs();
                renderWorldbookList();
            }

            async function initWorldbookPage() {
                await loadWorldbooks();
                renderWorldbookTabs();
                renderWorldbookList();

                const groups = [...new Set(worldbooks.map(wb => wb.group).filter(Boolean))];
                const datalist = document.getElementById('wbGroupDatalist');
                if (datalist) {
                    datalist.innerHTML = groups.map(g => `<option value="${escapeHtml(g)}">`).join('');
                }
            }

            async function openConvDetail(convId) {
                const conv = await DB.get('conversations', convId);
                if (!conv) return;

                const char = await DB.get('characters', conv.charId);
                const mask = await DB.get('userProfiles', conv.maskId);

                let convDetail = await DB.get('convDetails', convId);
                if (!convDetail) {
                    convDetail = {
                        conversationId: convId,
                        charId: conv.charId,
                        charName: char?.name || '',
                        charDetail: char?.detail || '',
                        charAvatar: char?.avatar || '',
                        userName: mask?.name || '',
                        userDetail: mask?.bio || '',
                        userAvatar: mask?.avatar || '',
                        relationship: '',
                        worldbookIds: []
                    };
                    await DB.put('convDetails', convDetail);
                }

                document.getElementById('convDetailCharName').value = convDetail.charName || char?.name || '';
                document.getElementById('convDetailCharDetail').value = convDetail.charDetail || char?.detail || '';
                document.getElementById('convDetailCharAvatarData').value = convDetail.charAvatar || char?.avatar || '';
                updateAvatarPreview('convDetailCharAvatar', convDetail.charAvatar || char?.avatar, convDetail.charName ||
                    char?.name);

                document.getElementById('convDetailUserName').value = convDetail.userName || mask?.name || '';
                document.getElementById('convDetailUserDetail').value = convDetail.userDetail || mask?.bio || '';
                document.getElementById('convDetailUserAvatarData').value = convDetail.userAvatar || mask?.avatar || '';
                updateAvatarPreview('convDetailUserAvatar', convDetail.userAvatar || mask?.avatar, convDetail.userName ||
                    mask?.name);

                document.getElementById('convDetailRelationship').value = convDetail.relationship || '';

// 加载角色自我认知
const selfModel = convDetail.charSelfModel || {};
document.getElementById('convDetailRelationshipView').value = selfModel.relationshipView || '';
document.getElementById('convDetailSelfGrowth').value = selfModel.selfGrowth || '';
document.getElementById('convDetailUserTraits').value = selfModel.userTraits || '';
const lastUpdatedEl = document.getElementById('selfModelLastUpdated');
if (selfModel.lastUpdated) {
    lastUpdatedEl.textContent = '最后更新：' + new Date(selfModel.lastUpdated).toLocaleString('zh-CN');
} else {
    lastUpdatedEl.textContent = '';
}

await renderConvDetailWorldbooks(convDetail.worldbookIds || []);

                if (window.emoticonModule) {
                    await window.emoticonModule.renderConvDetailEmoticonList(convId);
                }

                window.currentEditingConvId = convId;

const convBg = convDetail.bgImage || '';
const convBgPreset = convDetail.bgPreset || 'default';
document.getElementById('convBgData').value = convBg;
document.getElementById('convBgPreset').value = convBgPreset;
renderConvBgPreview(convBg, convBgPreset);
updateConvBgOptionActive(convBg, convBgPreset);

switchPage('conv-detail');

// 强制注入朋友圈自动发板块
if (window.momentsModule?.ensureConvDetailMomentSection) {
    await window.momentsModule.ensureConvDetailMomentSection();
}

// 用 onclick 直接覆盖（最可靠，不受DOM重写影响）
const aiBtn = document.getElementById('aiUpdateSelfModelBtn');
if (aiBtn) {
    aiBtn.onclick = async function() {
        console.log('[AI更新] 点击触发');
        const cvId = window.currentEditingConvId;
        if (!cvId) { alert('请先打开对话详情'); return; }
        
        const cv = await DB.get('conversations', cvId);
        if (!cv) { alert('对话不存在'); return; }
        
        const ch = await DB.get('characters', cv.charId);
        const mk = await DB.get('userProfiles', cv.maskId);
        const cd = await DB.get('convDetails', cvId);
        const allMem = await DB.queryByIndex('memories', 'conversationId', cvId);
        const sums = allMem.filter(m => m.type === 'summary').sort((a, b) => a.segmentStart - b.segmentStart);
        
        console.log('[AI更新] 找到总结数:', sums.length);
        
        if (sums.length === 0) { 
            alert('请先生成至少一条总结'); 
            return; 
        }
        
        const sumText = sums.map(s => s.content).join('\n');
const cName = cd?.charName || ch?.name || '角色';
const uName = cd?.userName || mk?.name || '用户';
const cDetail = cd?.charDetail || ch?.detail || '';

// 读取当前自我认知（从输入框，这样用户的手动编辑也会被纳入）
const currentRel = document.getElementById('convDetailRelationshipView').value.trim();
const currentGrowth = document.getElementById('convDetailSelfGrowth').value.trim();
const currentTraits = document.getElementById('convDetailUserTraits').value.trim();
const hasExisting = currentRel || currentGrowth || currentTraits;

aiBtn.textContent = '🧠 分析中...';
aiBtn.disabled = true;
recordApiPending();

try {
    const promptContent = hasExisting 
        ? `你是${cName}。以下是你的人设：\n${cDetail}\n\n【你已有的自我认知】（这是你之前形成的理解，需要在此基础上继续成长，而不是推翻重写）\n💞 关系理解：${currentRel || '（暂无）'}\n🌱 自我成长：${currentGrowth || '（暂无）'}\n👤 用户画像：${currentTraits || '（暂无）'}\n\n【你和${uName}的对话总结】\n${sumText}\n\n【任务】\n请以${cName}的第一人称视角，基于【你已有的自我认知】和【新的对话总结】，演化你的理解：\n- 保留仍然成立的认知\n- 修正不再准确的部分\n- 补充新发现的内容\n- 体现出关系和理解在时间中的成长轨迹（如"以前我以为...现在我发现..."）\n\n请严格按以下格式输出：\n\n---关系理解---\n（关系发展到了什么阶段？相比之前有什么变化？120字以内）\n\n---自我成长---\n（你自己有什么新的变化？延续之前的成长轨迹。100字以内）\n\n---用户画像---\n（你对${uName}的理解有哪些新增或修正？100字以内）`
        : `你是${cName}。以下是你的人设：\n${cDetail}\n\n以下是你和${uName}的对话总结：\n${sumText}\n\n请以${cName}的第一人称视角，基于以上信息，初次形成你的自我认知，输出三段内容：\n\n---关系理解---\n（你怎么看待你和${uName}的关系？关系发展到了什么阶段？你对这段关系的感受？100字以内）\n\n---自我成长---\n（在和${uName}的相处中，你自己有什么变化？性格、习惯、情感上的成长？80字以内）\n\n---用户画像---\n（你观察到${uName}是什么样的人？TA的性格特点、喜好、雷区、沟通习惯？80字以内）`;
    
    const res = await callLLM([{ 
        role: 'user', 
        content: promptContent
    }], { maxTokens: 600 });
            
            console.log('[AI更新] API返回:', res.substring(0, 100));
            
            const r1 = res.match(/---关系理解---([\s\S]*?)---自我成长---/);
            const r2 = res.match(/---自我成长---([\s\S]*?)---用户画像---/);
            const r3 = res.match(/---用户画像---([\s\S]*?)$/);
            
            if (r1) document.getElementById('convDetailRelationshipView').value = r1[1].trim();
            if (r2) document.getElementById('convDetailSelfGrowth').value = r2[1].trim();
            if (r3) document.getElementById('convDetailUserTraits').value = r3[1].trim();
            
            alert('✅ AI已更新，请检查后点击保存');
        } catch (err) { 
            console.error('[AI更新] 失败:', err);
            alert('❌ ' + err.message); 
        } finally {
            aiBtn.textContent = '✨ AI更新';
            aiBtn.disabled = false;
        }
    };
    console.log('[openConvDetail] AI更新按钮onclick已绑定');
}
            }

            function updateAvatarPreview(previewId, avatarData, name) {
                const previewEl = document.getElementById(previewId);
                if (!previewEl) return;
                if (avatarData) {
                    previewEl.style.backgroundImage = `url('${avatarData}')`;
                    previewEl.style.backgroundColor = 'transparent';
                    previewEl.textContent = '';
                } else {
                    previewEl.style.backgroundImage = '';
                    previewEl.style.backgroundColor = getAvatarColor(name || '?');
                    previewEl.textContent = name?.charAt(0) || '?';
                }
            }

            async function renderConvDetailWorldbooks(selectedIds) {
    const container = document.getElementById('convDetailWorldbookList');
    const allWorldbooks = await DB.getAll('worldbooks');

    if (!container) return;

    if (allWorldbooks.length === 0) {
        container.innerHTML = `
            <p style="color:#a0a8a2;padding:12px;">暂无世界书，请先创建</p>
        `;
        return;
    }

    const groupMap = {};
    allWorldbooks.forEach(wb => {
        const groupName = wb.group || '未分组';
        if (!groupMap[groupName]) groupMap[groupName] = [];
        groupMap[groupName].push(wb);
    });

    const groupNames = Object.keys(groupMap).sort((a, b) => {
        if (a === '未分组') return 1;
        if (b === '未分组') return -1;
        return a.localeCompare(b, 'zh-CN');
    });

    const chevronSvg = `
        <svg class="wb-mount-group-icon" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
    `;

    const bookSvg = `
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none"
            stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
    `;

    let html = `
        <div class="wb-priority-hint">
            当前对话详情中的勾选状态优先级最高：勾选为强制挂载，取消为强制屏蔽。未保存过详情时，才使用世界书底部的联系人和场景规则。
        </div>
    `;

    groupNames.forEach(groupName => {
        const list = groupMap[groupName].sort((a, b) => {
            return (b.updatedAt || 0) - (a.updatedAt || 0);
        });

        const checkedCount = list.filter(wb => selectedIds.includes(wb.id)).length;
        const collapsedClass = checkedCount > 0 ? '' : 'collapsed';

        html += `
            <div class="wb-mount-group ${collapsedClass}" data-wb-group="${escapeHtml(groupName)}">
                <div class="wb-mount-group-header">
                    ${chevronSvg}
                    <span style="display:inline-flex;color:#4a5568;">${bookSvg}</span>
                    <span class="wb-mount-group-title">${escapeHtml(groupName)}</span>
                    <span class="wb-mount-group-count">${checkedCount}/${list.length}</span>
                </div>
                <div class="wb-mount-group-body">
        `;

        list.forEach(wb => {
            const checked = selectedIds.includes(wb.id) ? 'checked' : '';
            const depth = wb.injectDepth || 'before';
            const kwCount = (wb.triggerKeywords || []).length;

            html += `
                <label class="mount-checkbox wb-mount-checkbox" style="align-items:flex-start;">
                    <input type="checkbox" value="${wb.id}" ${checked} class="conv-detail-wb-checkbox">
                    <div style="flex:1;min-width:0;">
                        <div class="wb-mount-title">${escapeHtml(wb.title || '未命名世界书')}</div>
                        <div class="wb-mount-preview">
                            ${escapeHtml((wb.fullContent || wb.content || '').substring(0, 70))}${(wb.fullContent || wb.content || '').length > 70 ? '...' : ''}
                        </div>
                        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;">
                            <span class="wb-badge-depth">${escapeHtml(depth)}</span>
                            ${kwCount > 0 ? `<span class="wb-badge-kw">${kwCount} kw</span>` : ''}
                            ${wb.group === 'HTML' ? `<span class="wb-badge-html">HTML</span>` : ''}
                        </div>
                    </div>
                </label>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.wb-mount-group-header').forEach(header => {
        header.addEventListener('click', () => {
            const group = header.closest('.wb-mount-group');
            group.classList.toggle('collapsed');
        });
    });

    container.querySelectorAll('.conv-detail-wb-checkbox').forEach(cb => {
        cb.addEventListener('click', e => {
            e.stopPropagation();
        });

        cb.addEventListener('change', () => {
            const group = cb.closest('.wb-mount-group');
            if (!group) return;

            const all = group.querySelectorAll('.conv-detail-wb-checkbox');
            const checked = group.querySelectorAll('.conv-detail-wb-checkbox:checked');
            const countEl = group.querySelector('.wb-mount-group-count');

            if (countEl) {
                countEl.textContent = `${checked.length}/${all.length}`;
            }
        });
    });
}

            async function saveConvDetail() {
    const convId = window.currentEditingConvId;
    if (!convId) return;

    const oldDetail = await DB.get('convDetails', convId) || {};

    const convDetail = {
        ...oldDetail, // 保留 bubbleThemeId 等已有字段
        conversationId: convId,
        charId: (await DB.get('conversations', convId))?.charId,
        charDetail: document.getElementById('convDetailCharDetail').value.trim(),
        charAvatar: document.getElementById('convDetailCharAvatarData').value,
        userDetail: document.getElementById('convDetailUserDetail').value.trim(),
        userAvatar: document.getElementById('convDetailUserAvatarData').value,
        relationship: document.getElementById('convDetailRelationship').value.trim(),
charSelfModel: {
    relationshipView: document.getElementById('convDetailRelationshipView').value.trim(),
    selfGrowth: document.getElementById('convDetailSelfGrowth').value.trim(),
    userTraits: document.getElementById('convDetailUserTraits').value.trim(),
    lastUpdated: (document.getElementById('convDetailRelationshipView').value.trim() || 
                  document.getElementById('convDetailSelfGrowth').value.trim() || 
                  document.getElementById('convDetailUserTraits').value.trim()) 
                 ? Date.now() : null
},
bgImage: document.getElementById('convBgData').value,
        bgPreset: document.getElementById('convBgPreset').value,
        worldbookIds: [],
worldbookMountOverrides: {}
    };

    document.querySelectorAll('.conv-detail-wb-checkbox').forEach(cb => {
    const wbId = cb.value;

    if (cb.checked) {
        convDetail.worldbookIds.push(wbId);
        convDetail.worldbookMountOverrides[wbId] = true;
    } else {
        convDetail.worldbookMountOverrides[wbId] = false;
    }
});

    if (window.emoticonModule) {
        convDetail.emoticonGroupIds = window.emoticonModule.collectEmoticonGroupIds();
    }

    await DB.put('convDetails', convDetail);
showStatus('✅ 对话详情已保存', 'success');

await loadConversationMessages(convId);
if (window.momentsModule?.getAutoRule) {
    // moments模块会在进入详情页时自行同步，这里保留钩子
}
}
            function setupConvDetailAvatarUpload(prefix, dataInputId, previewId) {
                const uploadBtn = document.getElementById(`${prefix}UploadBtn`);
                const fileInput = document.getElementById(`${prefix}AvatarFile`);
                const dataInput = document.getElementById(dataInputId);

                if (uploadBtn && fileInput) {
                    uploadBtn.addEventListener('click', () => fileInput.click());
                    fileInput.addEventListener('change', async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const dataUrl = await compressImage(file, 200, 200, 0.8);
                            dataInput.value = dataUrl;
                            updateAvatarPreview(previewId, dataUrl, '');
                            fileInput.value = '';
                        }
                    });
                }
            }

            function renderConvBgPreview(bgImage, bgPreset) {
                const previewEl = document.getElementById('convBgPreview');
                if (!previewEl) return;

                if (bgImage && (bgImage.startsWith('data:') || bgImage.startsWith('http'))) {
                    previewEl.style.background = `url('${bgImage}')`;
                    previewEl.style.backgroundSize = 'cover';
                    previewEl.style.backgroundPosition = 'center';
                } else if (bgPreset === 'warm') {
                    previewEl.style.background = 'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 100%)';
                    previewEl.style.backgroundSize = '';
                } else if (bgPreset === 'cool') {
                    previewEl.style.background = 'linear-gradient(135deg, #d3e0f5 0%, #c4d4e8 100%)';
                    previewEl.style.backgroundSize = '';
                } else if (bgPreset === 'dark') {
                    previewEl.style.background = 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)';
                    previewEl.style.backgroundSize = '';
                } else {
                    previewEl.style.background = '#f8f8f8';
                    previewEl.style.backgroundSize = '';
                }
            }

            function updateConvBgOptionActive(bgImage, bgPreset) {
                document.querySelectorAll('.conv-bg-option').forEach(opt => {
                    const isCustomImage = bgImage && (bgImage.startsWith('data:') || bgImage.startsWith('http'));
                    if (isCustomImage) {
                        opt.classList.remove('active');
                    } else {
                        opt.classList.toggle('active', opt.dataset.bg === bgPreset);
                    }
                });
            }

            function setConvBg(value, preset) {
                document.getElementById('convBgData').value = value;
                if (preset) {
                    document.getElementById('convBgPreset').value = preset;
                }
                renderConvBgPreview(value, preset);
                updateConvBgOptionActive(value, preset);
            }

            function bindConvBgEvents() {
                document.querySelectorAll('.conv-bg-option').forEach(opt => {
                    opt.addEventListener('click', () => {
                        const preset = opt.dataset.bg;
                        setConvBg('', preset);
                    });
                });

                document.getElementById('convBgUploadBtn')?.addEventListener('click', () => {
                    document.getElementById('convBgFile').click();
                });

                document.getElementById('convBgFile')?.addEventListener('change', async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = async (ev) => {
                            const img = new Image();
                            img.onload = async () => {
                                const canvas = document.createElement('canvas');
                                const maxW = 800,
                                    maxH = 1200;
                                let w = img.width,
                                    h = img.height;
                                if (w / h > maxW / maxH) {
                                    if (w > maxW) { h = (h * maxW) / w;
                                        w = maxW; }
                                } else {
                                    if (h > maxH) { w = (w * maxH) / h;
                                        h = maxH; }
                                }
                                canvas.width = w;
                                canvas.height = h;
                                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                                setConvBg(dataUrl, 'custom');
                            };
                            img.src = ev.target.result;
                        };
                        reader.readAsDataURL(file);
                        e.target.value = '';
                    }
                });

                document.getElementById('convBgUrlBtn')?.addEventListener('click', async () => {
                    const url = prompt('请输入背景图片URL:');
                    if (url && url.trim()) {
                        const img = new Image();
                        img.crossOrigin = 'anonymous';
                        img.onload = async () => {
                            const canvas = document.createElement('canvas');
                            const maxW = 800,
                                maxH = 1200;
                            let w = img.width,
                                h = img.height;
                            if (w / h > maxW / maxH) {
                                if (w > maxW) { h = (h * maxW) / w;
                                    w = maxW; }
                            } else {
                                if (h > maxH) { w = (w * maxH) / h;
                                    h = maxH; }
                            }
                            canvas.width = w;
                            canvas.height = h;
                            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                            setConvBg(dataUrl, 'custom');
                        };
                        img.onerror = () => alert('图片加载失败，请检查URL');
                        img.src = url.trim();
                    }
                });

                document.getElementById('convBgResetBtn')?.addEventListener('click', () => {
                    setConvBg('', 'default');
                });
            }

            function applyConvBg(bgImage, bgPreset) {
                const container = document.getElementById('convChatMessages');
                if (!container) return;

                if (bgImage && (bgImage.startsWith('data:') || bgImage.startsWith('http'))) {
                    container.style.background = `url('${bgImage}')`;
                    container.style.backgroundSize = 'cover';
                    container.style.backgroundPosition = 'center';
                } else if (bgPreset === 'warm') {
                    container.style.background = 'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 100%)';
                    container.style.backgroundSize = '';
                } else if (bgPreset === 'cool') {
                    container.style.background = 'linear-gradient(135deg, #d3e0f5 0%, #c4d4e8 100%)';
                    container.style.backgroundSize = '';
                } else if (bgPreset === 'dark') {
                    container.style.background = 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)';
                    container.style.backgroundSize = '';
                } else {
                    container.style.background = '#f8f8f8';
                    container.style.backgroundSize = '';
                }
            }

            async function renderHomeNavIcons() {
                const navIconSettings = await DB.getAll('navIconSettings');

                for (const setting of navIconSettings) {
                    const iconEl = document.getElementById('navIcon_' + setting.navId);
                    if (!iconEl) continue;

                    if (setting.image) {
                        iconEl.style.backgroundImage = `url('${setting.image}')`;
                        iconEl.style.backgroundColor = 'transparent';
                        iconEl.classList.add('has-custom-image');
                    } else {
                        iconEl.style.backgroundImage = '';
                        iconEl.style.backgroundColor = setting.color || '#c9c9c9';
                        iconEl.classList.remove('has-custom-image');
                        const emojiEl = iconEl.querySelector('.nav-icon-emoji');
                        if (emojiEl) {
                            emojiEl.textContent = setting.emoji || '📌';
                        }
                    }
                }

                const wallpaperData = await DB.get('themeSettings', 'wallpaper');
                applyWallpaper(wallpaperData?.value || '');
            }

            function applyWallpaper(wallpaperValue) {
                const pageHome = document.getElementById('page-home');
                if (!pageHome) return;

                if (!wallpaperValue || wallpaperValue === 'default') {
                    pageHome.style.background = '';
                    pageHome.style.backgroundSize = '';
                    pageHome.style.backgroundPosition = '';
                } else if (wallpaperValue.startsWith('data:') || wallpaperValue.startsWith('http')) {
                    pageHome.style.background = `url('${wallpaperValue}')`;
                    pageHome.style.backgroundSize = 'cover';
                    pageHome.style.backgroundPosition = 'center';
                } else if (wallpaperValue === 'warm') {
                    pageHome.style.background =
                        'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 50%, #ddd0c0 100%)';
                    pageHome.style.backgroundSize = '';
                    pageHome.style.backgroundPosition = '';
                } else if (wallpaperValue === 'cool') {
                    pageHome.style.background =
                        'linear-gradient(135deg, #d3e0f5 0%, #c4d4e8 50%, #bcc8d8 100%)';
                    pageHome.style.backgroundSize = '';
                    pageHome.style.backgroundPosition = '';
                } else if (wallpaperValue === 'dark') {
                    pageHome.style.background =
                        'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)';
                    pageHome.style.backgroundSize = '';
                    pageHome.style.backgroundPosition = '';
                }
            }

            async function initThemePage() {
    const homeView = document.getElementById('themeHomeView');
    const detailView = document.getElementById('themeDetailView');
    if (homeView) homeView.style.display = '';
    if (detailView) detailView.style.display = 'none';

    ['themePanelWallpaper', 'themePanelIcon', 'themePanelBubble', 'themePanelLockscreen', 'themePanelGlobal'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
}

// ========== 锁屏设置 ==========
async function getLockscreenSettings() {
    const data = await DB.get('themeSettings', 'lockscreen');
    const v = data?.value || {};
    return {
        enabled: v.enabled !== false,
        blurEnabled: v.blurEnabled !== false,
        style: v.style || 'single',
        single: v.single || { src: '', x: 0, y: 0, scale: 1 },
        triple: v.triple || [
            { src: '', x: 0, y: 0, scale: 1 },
            { src: '', x: 0, y: 0, scale: 1 },
            { src: '', x: 0, y: 0, scale: 1 }
        ],
        clockColor: v.clockColor || '#ffffff'
    };
}

async function saveLockscreenSettings(s) {
    await DB.put('themeSettings', { key: 'lockscreen', value: s });
    applyLockscreenSettings(s);
    renderLockscreenPreview(s);
}

async function applyLockscreenSettings(s) {
    if (!s) s = await getLockscreenSettings();
    const ls = document.getElementById('lockscreen');
    if (!ls) return;

    if (!s.enabled) {
        ls.classList.add('hide');
        ls.style.display = 'none';
        return;
    } else {
        if (!ls.classList.contains('hide')) ls.style.display = '';
    }

    const bg = ls.querySelector('.lockscreen-bg');
if (!bg) return;
bg.style.filter = '';
bg.style.transform = '';
bg.classList.remove('triple-style');
bg.classList.toggle('no-blur', !s.blurEnabled);

if (s.style === 'triple') {
    bg.classList.add('triple-style');
    bg.style.background = '#000';
    let cellsHtml = '';
    for (let i = 0; i < 3; i++) {
        const p = s.triple[i] || {};
        const inner = p.src
            ? `<div class="ls-photo-fill" style="background-image:url('${p.src}');transform:translate(-50%,-50%) translate(${p.x||0}px,${p.y||0}px) scale(${p.scale||1});"></div>`
            : '';
        cellsHtml += `<div class="ls-cell">${inner}</div>`;
    }
    cellsHtml += '<div class="ls-divider ls-divider-1"></div><div class="ls-divider ls-divider-2"></div>';
    bg.innerHTML = cellsHtml;
} else {
    const p = s.single || {};
    if (p.src) {
        bg.style.background = '#000';
        bg.innerHTML = `<div class="ls-photo-fill" style="background-image:url('${p.src}');transform:translate(-50%,-50%) translate(${p.x||0}px,${p.y||0}px) scale(${p.scale||1});"></div>`;
    } else {
        bg.style.background = '#d8c8b8';
        bg.innerHTML = '';
    }
}

    const tEl = document.getElementById('lsTime');
    const dEl = document.getElementById('lsDate');
    if (tEl) tEl.style.color = s.clockColor;
    if (dEl) { dEl.style.color = s.clockColor; dEl.style.opacity = '0.85'; }
}
window.applyLockscreenSettings = applyLockscreenSettings;

function renderLockscreenPreview(s) {
    const screen = document.getElementById('lsPreviewScreen');
    if (!screen) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2,'0');
    const mm = String(now.getMinutes()).padStart(2,'0');
    const dateStr = now.getFullYear()+'年'+(now.getMonth()+1)+'月'+now.getDate()+'日';
    let bgHtml = '';
    if (s.style === 'triple') {
    bgHtml = '<div class="ls-preview-triple-grid">';
    for (let i = 0; i < 3; i++) {
        const p = s.triple[i] || {};
        const inner = p.src
            ? `<div class="ls-preview-bg-layer" style="background-image:url('${p.src}');transform:translate(${(p.x||0)*0.4}px,${(p.y||0)*0.4}px) scale(${p.scale||1});"></div>`
            : '';
        bgHtml += `<div class="ls-preview-triple-cell">${inner}</div>`;
    }
    bgHtml += '<div class="ls-preview-divider ls-preview-divider-1"></div><div class="ls-preview-divider ls-preview-divider-2"></div>';
    bgHtml += '</div>';
} else {
        const p = s.single || {};
        if (p.src) {
            bgHtml = `<div class="ls-preview-bg-layer" style="background-image:url('${p.src}');transform:translate(${(p.x||0)*0.4}px,${(p.y||0)*0.4}px) scale(${p.scale||1});"></div>`;
        }
    }
    screen.style.background = (s.style==='single' && !(s.single?.src)) ? '#d8c8b8' : '#000';
    screen.innerHTML = `${bgHtml}<div class="ls-preview-time-area"><div class="ls-preview-time-text" style="color:${s.clockColor};">${hh}:${mm}</div><div class="ls-preview-date-text" style="color:${s.clockColor};">${dateStr}</div></div>`;
}

async function renderThemeLockscreenPanel() {
    const s = await getLockscreenSettings();
    const sw = document.getElementById('lsEnabledSwitch');
    const cfg = document.getElementById('lsConfigArea');
    sw.classList.toggle('on', s.enabled);
    cfg.style.display = s.enabled ? '' : 'none';

    const blurSw = document.getElementById('lsBlurSwitch');
    if (blurSw) blurSw.classList.toggle('on', s.blurEnabled);

    document.querySelectorAll('.ls-style-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.lsStyle === s.style);
    });

    document.getElementById('lsClockColorInput').value = s.clockColor;
    document.getElementById('lsClockColorSwatch').style.background = s.clockColor;

    renderPhotoSlots(s);
    renderLockscreenPreview(s);
}

function renderPhotoSlots(s) {
    const container = document.getElementById('lsPhotoSlots');
    const slots = s.style === 'triple' ? s.triple : [s.single];
const labels = s.style === 'triple' ? ['上方横条','中间横条','下方横条'] : ['锁屏照片'];
    let html = '';
    slots.forEach((p, idx) => {
        const hasImg = !!p.src;
        html += `<div class="ls-photo-slot">
            <div class="ls-photo-slot-title"><span>${labels[idx]}</span><span style="color:#a0a8a2;">拖动可移动位置</span></div>
            <div class="ls-photo-edit-box ${hasImg?'has-img':''}" data-slot-idx="${idx}">
                ${hasImg ? `<div class="ls-photo-edit-img" style="background-image:url('${p.src}');transform:translate(-50%,-50%) translate(${p.x||0}px,${p.y||0}px) scale(${p.scale||1});"></div>` : '<div class="ls-photo-empty-hint">暂无照片</div>'}
            </div>
            <div class="ls-photo-controls">
                <button class="ls-upload-btn" data-slot-idx="${idx}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>上传</button>
                <button class="ls-clear-btn" data-slot-idx="${idx}" style="color:#c0392b;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>清除</button>
                <input type="range" class="ls-scale-slider" data-slot-idx="${idx}" min="0.3" max="3" step="0.05" value="${p.scale||1}">
            </div>
        </div>`;
    });
    container.innerHTML = html;

    container.querySelectorAll('.ls-upload-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.slotIdx);
            const inp = document.createElement('input');
            inp.type = 'file'; inp.accept = 'image/*';
            inp.onchange = async e => {
                const f = e.target.files[0]; if (!f) return;
                const dataUrl = await compressImage(f, 1200, 1200, 0.85);
                const cur = await getLockscreenSettings();
                if (cur.style === 'triple') cur.triple[idx] = { src: dataUrl, x: 0, y: 0, scale: 1 };
                else cur.single = { src: dataUrl, x: 0, y: 0, scale: 1 };
                await saveLockscreenSettings(cur);
                renderPhotoSlots(cur);
            };
            inp.click();
        });
    });

    container.querySelectorAll('.ls-clear-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const idx = parseInt(btn.dataset.slotIdx);
            const cur = await getLockscreenSettings();
            if (cur.style === 'triple') cur.triple[idx] = { src:'', x:0, y:0, scale:1 };
            else cur.single = { src:'', x:0, y:0, scale:1 };
            await saveLockscreenSettings(cur);
            renderPhotoSlots(cur);
        });
    });

    container.querySelectorAll('.ls-scale-slider').forEach(slider => {
        slider.addEventListener('input', async e => {
            const idx = parseInt(slider.dataset.slotIdx);
            const cur = await getLockscreenSettings();
            const target = cur.style === 'triple' ? cur.triple[idx] : cur.single;
            target.scale = parseFloat(slider.value);
            await saveLockscreenSettings(cur);
            const box = container.querySelector(`.ls-photo-edit-box[data-slot-idx="${idx}"]`);
            const img = box?.querySelector('.ls-photo-edit-img');
            if (img) img.style.transform = `translate(-50%,-50%) translate(${target.x||0}px,${target.y||0}px) scale(${target.scale})`;
        });
    });

    container.querySelectorAll('.ls-photo-edit-box.has-img').forEach(box => {
        bindPhotoDrag(box);
    });
}

function bindPhotoDrag(box) {
    const idx = parseInt(box.dataset.slotIdx);
    const img = box.querySelector('.ls-photo-edit-img');
    if (!img) return;
    let startX, startY, baseX, baseY, dragging = false;

    async function getCurrent() {
        const cur = await getLockscreenSettings();
        return cur.style === 'triple' ? cur.triple[idx] : cur.single;
    }

    async function setCurrent(x, y) {
        const cur = await getLockscreenSettings();
        const t = cur.style === 'triple' ? cur.triple[idx] : cur.single;
        t.x = x; t.y = y;
        await saveLockscreenSettings(cur);
    }

    async function onStart(e) {
        if (e.touches && e.touches.length !== 1) return;
        const pt = e.touches ? e.touches[0] : e;
        const cur = await getCurrent();
        baseX = cur.x || 0; baseY = cur.y || 0;
        startX = pt.clientX; startY = pt.clientY;
        dragging = true;
        document.addEventListener('mousemove', onMove);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchend', onEnd);
    }

    function onMove(e) {
        if (!dragging) return;
        e.preventDefault();
        const pt = e.touches ? e.touches[0] : e;
        const dx = pt.clientX - startX;
        const dy = pt.clientY - startY;
        getCurrent().then(cur => {
            const nx = baseX + dx;
            const ny = baseY + dy;
            img.style.transform = `translate(-50%,-50%) translate(${nx}px,${ny}px) scale(${cur.scale||1})`;
            img._lastX = nx; img._lastY = ny;
        });
    }

    async function onEnd() {
        if (!dragging) return;
        dragging = false;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchend', onEnd);
        if (img._lastX !== undefined) {
            await setCurrent(img._lastX, img._lastY);
        }
    }

    box.addEventListener('mousedown', onStart);
    box.addEventListener('touchstart', onStart, { passive: true });
}

            function showThemeDetail(pageType) {
            
                // ===== 修复：全局面板如果被误放进气泡面板里，就自动移出来 =====
    const globalPanelFix = document.getElementById('themePanelGlobal');
    const bubblePanelFix = document.getElementById('themePanelBubble');

    if (
        globalPanelFix &&
        bubblePanelFix &&
        globalPanelFix.parentElement === bubblePanelFix
    ) {
        bubblePanelFix.insertAdjacentElement('afterend', globalPanelFix);
    }
    // ===== 修复结束 =====
            
    const homeView = document.getElementById('themeHomeView');
    
    const detailView = document.getElementById('themeDetailView');
    const titleEl = document.getElementById('themeDetailTitle');

    if (homeView) homeView.style.display = 'none';
    if (detailView) detailView.style.display = 'block';

    ['themePanelWallpaper', 'themePanelIcon', 'themePanelBubble', 'themePanelLockscreen', 'themePanelGlobal'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    if (pageType === 'wallpaper') {
        if (titleEl) titleEl.textContent = '壁纸';
        const panel = document.getElementById('themePanelWallpaper');
        if (panel) panel.style.display = '';
        renderThemeWallpaperOptions();
    } else if (pageType === 'icon') {
        if (titleEl) titleEl.textContent = '图标';
        const panel = document.getElementById('themePanelIcon');
        if (panel) panel.style.display = '';
        renderThemeIconList();
    } else if (pageType === 'bubble') {
        if (titleEl) titleEl.textContent = '气泡';
        const panel = document.getElementById('themePanelBubble');
        if (panel) panel.style.display = '';
        if (window.bubbleThemeModule?.initBubbleThemePanel) {
            window.bubbleThemeModule.initBubbleThemePanel();
        }
    } else if (pageType === 'global') {
        if (titleEl) titleEl.textContent = '全局';
        const panel = document.getElementById('themePanelGlobal');
        if (panel) panel.style.display = '';
        if (window.globalThemeModule?.initGlobalThemePanel) {
            window.globalThemeModule.initGlobalThemePanel();
        }
    } else if (pageType === 'lockscreen') {
        if (titleEl) titleEl.textContent = '锁屏';
        const panel = document.getElementById('themePanelLockscreen');
        if (panel) panel.style.display = '';
        renderThemeLockscreenPanel();
        bindLockscreenPanelEvents();
    }
}

            let _lsPanelEventsBound = false;
            function bindLockscreenPanelEvents() {
                if (_lsPanelEventsBound) return;
                _lsPanelEventsBound = true;

                document.getElementById('lsEnabledSwitch')?.addEventListener('click', async () => {
    const cur = await getLockscreenSettings();
    cur.enabled = !cur.enabled;
    await saveLockscreenSettings(cur);
    document.getElementById('lsEnabledSwitch').classList.toggle('on', cur.enabled);
    document.getElementById('lsConfigArea').style.display = cur.enabled ? '' : 'none';
});

document.getElementById('lsBlurSwitch')?.addEventListener('click', async () => {
    const cur = await getLockscreenSettings();
    cur.blurEnabled = !cur.blurEnabled;
    await saveLockscreenSettings(cur);
    document.getElementById('lsBlurSwitch').classList.toggle('on', cur.blurEnabled);
});

                document.querySelectorAll('.ls-style-tab').forEach(t => {
                    t.addEventListener('click', async () => {
                        const cur = await getLockscreenSettings();
                        cur.style = t.dataset.lsStyle;
                        await saveLockscreenSettings(cur);
                        document.querySelectorAll('.ls-style-tab').forEach(x => x.classList.toggle('active', x === t));
                        renderPhotoSlots(cur);
                    });
                });

                const colorInput = document.getElementById('lsClockColorInput');
                colorInput?.addEventListener('input', async () => {
                    let v = colorInput.value.trim();
                    if (!v.startsWith('#')) v = '#' + v;
                    if (!/^#[0-9a-fA-F]{6}$/.test(v) && !/^#[0-9a-fA-F]{3}$/.test(v)) return;
                    const cur = await getLockscreenSettings();
                    cur.clockColor = v;
                    await saveLockscreenSettings(cur);
                    document.getElementById('lsClockColorSwatch').style.background = v;
                });
            }

            function showThemeHome() {
                const homeView = document.getElementById('themeHomeView');
                const detailView = document.getElementById('themeDetailView');
                if (homeView) homeView.style.display = '';
                if (detailView) detailView.style.display = 'none';
            }

            async function renderThemeWallpaperOptions() {
                const wallpaperData = await DB.get('themeSettings', 'wallpaper');
                const currentWallpaper = wallpaperData?.value || 'default';

                document.querySelectorAll('.theme-wallpaper-option').forEach(opt => {
                    opt.classList.toggle('active', opt.dataset.wallpaper === currentWallpaper);
                });

                const isCustomImage = currentWallpaper && (currentWallpaper.startsWith('data:') || currentWallpaper
                    .startsWith('http'));
                if (isCustomImage) {
                    document.querySelectorAll('.theme-wallpaper-option').forEach(opt => opt.classList.remove(
                        'active'));
                }

                const previewEl = document.getElementById('themeWallpaperPreview');
                if (previewEl) {
                    if (isCustomImage) {
                        previewEl.style.backgroundImage = `url('${currentWallpaper}')`;
                        previewEl.style.backgroundSize = 'contain';
                        previewEl.style.backgroundPosition = 'center';
                        previewEl.style.backgroundRepeat = 'no-repeat';
                        previewEl.style.backgroundColor = '#faf9f6';
                        previewEl.style.minHeight = '120px';
                    } else if (currentWallpaper === 'warm') {
                        previewEl.style.backgroundImage = '';
                        previewEl.style.background =
                            'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 100%)';
                        previewEl.style.backgroundSize = '';
                        previewEl.style.minHeight = '60px';
                    } else if (currentWallpaper === 'cool') {
                        previewEl.style.backgroundImage = '';
                        previewEl.style.background =
                            'linear-gradient(135deg, #d3e0f5 0%, #c4d4e8 100%)';
                        previewEl.style.backgroundSize = '';
                        previewEl.style.minHeight = '60px';
                    } else if (currentWallpaper === 'dark') {
                        previewEl.style.backgroundImage = '';
                        previewEl.style.background =
                            'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)';
                        previewEl.style.backgroundSize = '';
                        previewEl.style.minHeight = '60px';
                    } else {
                        previewEl.style.backgroundImage = '';
                        previewEl.style.background = '#faf9f6';
                        previewEl.style.backgroundSize = '';
                        previewEl.style.minHeight = '60px';
                    }
                }
            }

async function setWallpaper(value) {
    await DB.put('themeSettings', { key: 'wallpaper', value });
    applyWallpaper(value);
    renderThemeWallpaperOptions();
    
    // 更新首页桌面背景
    const homeMain = document.getElementById('homeMain');
    if (homeMain) {
        if (value.startsWith('data:') || value.startsWith('http')) {
            homeMain.style.background = `url('${value}') center/cover`;
        } else if (value === 'warm') {
            homeMain.style.background = 'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 100%)';
        } else if (value === 'cool') {
            homeMain.style.background = 'linear-gradient(135deg, #d3e0f5 0%, #c4d4e8 100%)';
        } else if (value === 'dark') {
            homeMain.style.background = 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)';
        } else {
            homeMain.style.background = '';
        }
    }
}
            async function renderThemeIconList() {
                const container = document.getElementById('themeIconList');
                const navIconSettings = await DB.getAll('navIconSettings');

                const orderMap = {
                    'chat': 0,
                    'worldbook': 1,
                    'accounting': 2,
                    'reunion': 3,
                    'datamanager': 4,
                    'settings': 5,
                    'theme': 6,
                    'diary': 7,
                    'forum': 8,
                    'guangguang': 9
                };

                const nameMap = {
                    'chat': '聊天室',
                    'worldbook': '世界书',
                    'accounting': '记账',
                    'reunion': '重逢',
                    'datamanager': '数据管理',
                    'settings': 'API设置',
                    'theme': '美化',
                    'diary': '日记',
                    'forum': '论坛',
                    'guangguang': '逛逛'
                };

                navIconSettings.sort((a, b) => (orderMap[a.navId] || 99) - (orderMap[b.navId] || 99));

                let html = '';
                navIconSettings.forEach(setting => {
                    const hasImage = setting.image && setting.image.trim();
                    const previewStyle = hasImage ?
                        `background-image: url('${setting.image}'); background-color: transparent;` :
                        `background-color: ${setting.color || '#c9c9c9'};`;
                    const emojiDisplay = hasImage ? 'style="display:none;"' : '';
                    const iconClass = hasImage ? 'has-image' : '';

                    html += `
            <div class="theme-icon-edit-row" data-nav-id="${setting.navId}">
                <div class="theme-icon-preview ${iconClass}" id="themeIconPreview_${setting.navId}" style="${previewStyle}">
                    <span class="theme-icon-emoji-placeholder" ${emojiDisplay}>${setting.emoji || '📌'}</span>
                </div>
                <span class="theme-icon-name">${nameMap[setting.navId] || setting.navId}</span>
                <div class="theme-icon-actions">
                    <button class="theme-icon-action-btn upload-btn" data-nav-id="${setting.navId}">📷 上传</button>
                    <button class="theme-icon-action-btn url-btn" data-nav-id="${setting.navId}">🔗 URL</button>
                    ${hasImage ? `<button class="theme-icon-action-btn reset-btn" data-nav-id="${setting.navId}">↩️ 还原</button>` : ''}
                </div>
                <input type="file" id="themeIconFile_${setting.navId}" accept="image/*" style="display:none;">
            </div>
        `;
                });

                container.innerHTML = html;

                container.querySelectorAll('.upload-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const navId = btn.dataset.navId;
                        document.getElementById('themeIconFile_' + navId).click();
                    });
                });

                container.querySelectorAll('.url-btn').forEach(btn => {
                    btn.addEventListener('click', async () => {
                        const navId = btn.dataset.navId;
                        const url = prompt('请输入图片URL:');
                        if (url && url.trim()) {
                            const img = new Image();
                            img.crossOrigin = 'anonymous';
                            img.onload = async () => {
                                const canvas = document.createElement('canvas');
                                let width = img.width,
                                    height = img.height;
                                if (width > height) {
                                    if (width > 200) { height = (height * 200) / width;
                                        width = 200; }
                                } else {
                                    if (height > 200) { width = (width * 200) / height;
                                        height = 200; }
                                }
                                canvas.width = width;
                                canvas.height = height;
                                canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                                await saveNavIconImage(navId, dataUrl);
                            };
                            img.onerror = () => alert('图片加载失败，请检查URL');
                            img.src = url.trim();
                        }
                    });
                });

                container.querySelectorAll('.reset-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const navId = btn.dataset.navId;
        await saveNavIconImage(navId, navId + '.svg');  // ← 恢复成对应SVG
    });
});

                container.querySelectorAll('input[type="file"]').forEach(input => {
                    input.addEventListener('change', async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const navId = input.id.replace('themeIconFile_', '');
                        const dataUrl = await compressImage(file, 200, 200, 0.8);
                        await saveNavIconImage(navId, dataUrl);
                        input.value = '';
                    });
                });
            }

            async function saveNavIconImage(navId, imageData) {
    const setting = await DB.get('navIconSettings', navId);
    if (!setting) return;
    setting.image = imageData;
    await DB.put('navIconSettings', setting);

    // 1. 立即更新首页图标（强制浏览器重新加载图片）
    const iconEl = document.getElementById('navIcon_' + navId);
    if (iconEl) {
        if (imageData && imageData.trim()) {
            // 使用时间戳强制浏览器重新加载，就像壁纸一样
            iconEl.style.backgroundImage = `url('${imageData}?t=${Date.now()}')`;
            iconEl.style.backgroundColor = 'transparent';
            iconEl.classList.add('has-custom-image');
            const emojiEl = iconEl.querySelector('.nav-icon-emoji');
            if (emojiEl) emojiEl.style.display = 'none';
        } else {
            iconEl.style.backgroundImage = '';
            iconEl.style.backgroundColor = setting.color || '#c9c9c9';
            iconEl.classList.remove('has-custom-image');
            const emojiEl = iconEl.querySelector('.nav-icon-emoji');
            if (emojiEl) {
                emojiEl.style.display = '';
                emojiEl.textContent = setting.emoji || '📌';
            }
        }
    }

    // 2. 立即更新图标面板预览
    const previewEl = document.getElementById('themeIconPreview_' + navId);
    if (previewEl) {
        if (imageData && imageData.trim()) {
            previewEl.style.backgroundImage = `url('${imageData}?t=${Date.now()}')`;
            previewEl.style.backgroundColor = 'transparent';
            previewEl.classList.add('has-image');
        } else {
            previewEl.style.backgroundImage = '';
            previewEl.style.backgroundColor = setting.color || '#c9c9c9';
            previewEl.classList.remove('has-image');
        }
    }

    // 3. 重新渲染图标列表
    await renderThemeIconList();
}

            function bindThemeEvents() {
                document.querySelectorAll('.theme-entry-card').forEach(card => {
                    card.addEventListener('click', () => {
                        const pageType = card.dataset.themePage;
                        showThemeDetail(pageType);
                    });
                });

                document.getElementById('themeDetailBackBtn')?.addEventListener('click', () => {
                    showThemeHome();
                });

                document.querySelectorAll('.theme-wallpaper-option').forEach(opt => {
                    opt.addEventListener('click', () => {
                        const wallpaper = opt.dataset.wallpaper;
                        setWallpaper(wallpaper);
                    });
                });

                document.getElementById('themeWallpaperUploadBtn')?.addEventListener('click', () => {
                    document.getElementById('themeWallpaperFile').click();
                });

                document.getElementById('themeWallpaperFile')?.addEventListener('change', async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = async (ev) => {
                            const img = new Image();
                            img.onload = async () => {
                                const canvas = document.createElement('canvas');
                                const maxW = 800,
                                    maxH = 1200;
                                let w = img.width,
                                    h = img.height;
                                if (w / h > maxW / maxH) {
                                    if (w > maxW) { h = (h * maxW) / w;
                                        w = maxW; }
                                } else {
                                    if (h > maxH) { w = (w * maxH) / h;
                                        h = maxH; }
                                }
                                canvas.width = w;
                                canvas.height = h;
                                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                                await setWallpaper(dataUrl);
                            };
                            img.src = ev.target.result;
                        };
                        reader.readAsDataURL(file);
                        e.target.value = '';
                    }
                });

                document.getElementById('themeWallpaperUrlBtn')?.addEventListener('click', async () => {
                    const url = prompt('请输入壁纸图片URL:');
                    if (url && url.trim()) {
                        const img = new Image();
                        img.crossOrigin = 'anonymous';
                        img.onload = async () => {
                            const canvas = document.createElement('canvas');
                            const maxW = 800,
                                maxH = 1200;
                            let w = img.width,
                                h = img.height;
                            if (w / h > maxW / maxH) {
                                if (w > maxW) { h = (h * maxW) / w;
                                    w = maxW; }
                            } else {
                                if (h > maxH) { w = (w * maxH) / h;
                                    h = maxH; }
                            }
                            canvas.width = w;
                            canvas.height = h;
                            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                            await setWallpaper(dataUrl);
                        };
                        img.onerror = () => alert('图片加载失败');
                        img.src = url.trim();
                    }
                });

                document.getElementById('themeWallpaperResetBtn')?.addEventListener('click', () => {
                    setWallpaper('default');
                });
            }

            const pages = {
                chat: document.getElementById('page-chat'),
                conversation: document.getElementById('page-conversation'),
                'group-conversation': document.getElementById('page-group-conversation'),
                'group-detail': document.getElementById('page-group-detail'),
                contacts: document.getElementById('page-contacts'),
                profile: document.getElementById('page-profile'),
                settings: document.getElementById('page-settings'),
                summary: document.getElementById('page-summary'),
                accounting: document.getElementById('page-accounting'),
                datamanager: document.getElementById('page-datamanager'),
                worldbook: document.getElementById('page-worldbook'),
                'worldbook-detail': document.getElementById('page-worldbook-detail'),
                reunion: document.getElementById('page-reunion'),
                theme: document.getElementById('page-theme'),
                'conv-detail': document.getElementById('page-conv-detail'),
                diary: document.getElementById('page-diary'),
                'diary-detail': document.getElementById('page-diary-detail'),
                forum: document.getElementById('page-forum'),
guangguang: document.getElementById('page-guangguang'),
emoticon: document.getElementById('page-emoticon'),
moments: document.getElementById('page-moments'),
sms: document.getElementById('page-sms'),
            };
            const tabs = document.querySelectorAll('.tab-item');
            const mainTabBar = document.getElementById('mainTabBar');

            function switchPage(pageId) {
            console.log('switchPage 被调用:', pageId);
if (pageId === 'desktop' || pageId === 'guangguang') {
    console.trace('跳到桌面/逛逛的调用栈');
}    // 返回桌面
    if (pageId === 'desktop') {
    document.querySelector('.app-main').style.display = 'none';
    var hm = document.getElementById('homeMain');
    hm.style.display = '';
    document.querySelector('.home-dock').style.display = '';
    document.querySelector('.page-indicator').style.display = '';
    Object.values(pages).forEach(p => p?.classList.remove('active'));
    
    DB.get('themeSettings', 'wallpaper').then(function(data) {
        var value = (data && data.value) || 'default';
        if (value.startsWith('data:') || value.startsWith('http')) {
            hm.style.background = 'url(\'' + value + '\') center/cover';
        } else if (value === 'warm') {
            hm.style.background = 'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 100%)';
        } else if (value === 'cool') {
            hm.style.background = 'linear-gradient(135deg, #d3e0f5 0%, #c4d4e8 100%)';
        } else if (value === 'dark') {
            hm.style.background = 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)';
        } else {
            hm.style.background = '';
        }
    });
    return;
}

    // 进入子页面：隐藏首页桌面
    document.getElementById('homeMain').style.display = 'none';
    document.querySelector('.home-dock').style.display = 'none';
    document.querySelector('.page-indicator').style.display = 'none';
    document.querySelector('.app-main').style.display = '';

// 逛逛页面有内联 display:flex，必须用 style 覆盖
const ggPage = document.getElementById('page-guangguang');
if (pageId === 'guangguang') {
    if (ggPage) ggPage.style.display = 'flex';
} else {
    if (ggPage) {
        ggPage.classList.remove('active');
        ggPage.style.display = 'none';
    }
}

    Object.values(pages).forEach(p => p?.classList.remove('active'));
    pages[pageId]?.classList.add('active');

 if (pageId === 'chat' || pageId === 'contacts' || pageId === 'moments' || pageId === 'profile') {
   mainTabBar.style.display = 'flex';
} else {
   mainTabBar.style.display = 'none';
}

    if (pageId === 'chat') {
    refreshConversationList();
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === 'chat'));
} else if (pageId === 'contacts') {
    refreshContactList();
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === 'contacts'));
} else if (pageId === 'moments') {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === 'moments'));
} else if (pageId === 'profile') {
    refreshProfile();
    refreshMaskList();
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === 'profile'));
}else if (pageId === 'summary') {
        refreshSummaryPage();
    } else if (pageId === 'settings') {
        loadSettingsToUI();
    } else if (pageId === 'accounting') {
        if (typeof initAccountingModule === 'function') {
            initAccountingModule();
        }
    } else if (pageId === 'datamanager') {
        updateDataStats();
    } else if (pageId === 'worldbook') {
        initWorldbookPage();
    } else if (pageId === 'reunion') {
        if (window.initReunionModule) {
            window.initReunionModule({
                DB, showStatus, escapeHtml, getAvatarColor,
                callLLM, recordApiPending
            });
        }
    } else if (pageId === 'theme') {
        initThemePage();
    } else if (pageId === 'diary') {
        if (window.initDiaryModule) {
            window.initDiaryModule({
                DB, showStatus, escapeHtml, getAvatarColor,
                getActiveMask, callLLM, recordApiPending, switchPage
            });
        }
    } else if (pageId === 'forum') {
    if (window.initForum) {
        window.initForum().then(() => {
            if (window._forumInitView) {
                switchForumView(window._forumInitView);
                updateBottomNavActive('main');
                window._forumInitView = null;
            }
        });
    }
} else if (pageId === 'emoticon') {
    if (window.emoticonModule) window.emoticonModule.renderEmoticonPage();
} else if (pageId === 'moments') {
    if (window.momentsModule?.openMomentsPage) {
        window.momentsModule.openMomentsPage();
    }
} else if (pageId === 'sms') {
    if (window.smsModule?.openSMSPage) {
        window.smsModule.openSMSPage();
    }
} else if (pageId === 'group-conversation') {
    console.log('切换到群聊页面');

        if (window.currentGroupId) {
            window.loadGroupMessages(window.currentGroupId);
        }
    } else if (pageId === 'group-detail') {
        if (window.updateGroupDetailWorldbookStatus) {
            window.updateGroupDetailWorldbookStatus();
        }
    }
    
    // ====== 朋友圈加号按钮：仅 moments 页显示 ======
const fab = document.getElementById("momentsFabBtn");
if (fab) {
  fab.style.display = (pageId === 'moments') ? "inline-flex" : "none";
}
}
window.switchPage = switchPage;

            function switchTab(tabId) {
                if (tabId === 'settings' || tabId === 'summary') {
                    Object.values(pages).forEach(p => p?.classList.remove('active'));
                    pages[tabId]?.classList.add('active');
                    mainTabBar.style.display = 'flex';
                    if (tabId === 'settings') loadSettingsToUI();
                    if (tabId === 'summary') { refreshSummaryPage(); }
                } else {
                    switchPage(tabId);
                }
            }


            // ========== 存档管理模块 ==========
            const ARCHIVE_STORE = 'apiArchives';

            async function getArchives() {
                return await DB.getAll(ARCHIVE_STORE);
            }

            async function saveArchive(archive) {
                if (!archive.id) archive.id = 'archive_' + Date.now();
                archive.updatedAt = Date.now();
                return await DB.put(ARCHIVE_STORE, archive);
            }

            async function deleteArchive(id) {
                return await DB.delete(ARCHIVE_STORE, id);
            }

            async function renderArchiveList() {
                const container = document.getElementById('archiveListContainer');
                if (!container) return;
                const archives = await getArchives();
                archives.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

                if (archives.length === 0) {
                    container.innerHTML = '<div class="archive-empty">暂无存档，点击上方按钮保存</div>';
                    return;
                }

                let html = '';
                archives.forEach((arch, idx) => {
                    html += `
                <div class="archive-row" data-index="${idx}" data-id="${arch.id}">
                    <span class="archive-row-name">📁 ${escapeHtml(arch.name)}</span>
                    <button class="archive-row-apply" data-index="${idx}" data-id="${arch.id}">应用</button>
                </div>`;
                });
                container.innerHTML = html;

                // 点击横栏 → 打开详情弹窗
                container.querySelectorAll('.archive-row').forEach(row => {
                    row.addEventListener('click', (e) => {
                        if (e.target.classList.contains('archive-row-apply')) return;
                        openArchiveDetail(row.dataset.id);
                    });
                });
                // 点击应用按钮
                container.querySelectorAll('.archive-row-apply').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        await applyArchive(btn.dataset.id);
                    });
                });
            }

            async function renderFloatArchiveList() {
                const container = document.getElementById('floatArchiveList');
                if (!container) return;
                const archives = await getArchives();
                archives.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

                if (archives.length === 0) {
                    container.innerHTML = '<div style="color:#aaa;font-size:12px;text-align:center;padding:12px;">暂无存档</div>';
                    return;
                }

                let html = '';
                archives.forEach(arch => {
                    html += `
                <div class="float-archive-item">
                    <span class="float-archive-name">📁 ${escapeHtml(arch.name)}</span>
                    <button class="float-archive-apply" data-id="${arch.id}">应用</button>
                </div>`;
                });
                container.innerHTML = html;
                container.querySelectorAll('.float-archive-apply').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        await applyArchive(btn.dataset.id);
                    });
                });
            }

            function updateFloatCurrentDisplay() {
                const urlEl = document.getElementById('floatCurrentUrl');
                const keyEl = document.getElementById('floatCurrentKey');
                const modelEl = document.getElementById('floatCurrentModel');
                if (urlEl) urlEl.textContent = document.getElementById('apiBaseUrl')?.value || '-';
                if (keyEl) {
                    const key = document.getElementById('apiKey')?.value || '';
                    keyEl.textContent = key ? key.substring(0, 6) + '•••' + key.substring(key.length - 4) : '-';
                }
                if (modelEl) modelEl.textContent = document.getElementById('modelSelect')?.value || '-';
            }

            async function applyArchive(id) {
                const archives = await getArchives();
                const arch = archives.find(a => a.id === id);
                if (!arch) return;

                document.getElementById('apiBaseUrl').value = arch.url || '';
                document.getElementById('apiKey').value = arch.key || '';
                if (arch.model && document.getElementById('modelSelect')) {
                    document.getElementById('modelSelect').value = arch.model;
                }

                // 保存为当前配置
                await DB.setSetting('llmBaseUrl', arch.url || '');
                await DB.setSetting('llmApiKey', arch.key || '');
                if (arch.model) await DB.setSetting('llmModel', arch.model);

                updateFloatCurrentDisplay();
                showStatus('✅ 已应用存档: ' + arch.name, 'success');
            }

            async function openArchiveDetail(id) {
                const archives = await getArchives();
                const arch = archives.find(a => a.id === id);
                if (!arch) return;

                document.getElementById('archiveDetailTitle').textContent = '存档详情';
                document.getElementById('archiveDetailName').value = arch.name || '';
                document.getElementById('archiveDetailUrl').value = arch.url || '';
                document.getElementById('archiveDetailKey').value = arch.key || '';
                document.getElementById('archiveDetailModel').value = arch.model || '';
                document.getElementById('archiveDetailModal').dataset.editId = id;
                document.getElementById('archiveDetailModal').classList.add('active');
            }

            async function saveArchiveDetail() {
                const id = document.getElementById('archiveDetailModal').dataset.editId;
                if (!id) return;

                const archives = await getArchives();
                const arch = archives.find(a => a.id === id);
                if (!arch) return;

                arch.name = document.getElementById('archiveDetailName').value.trim();
                arch.url = document.getElementById('archiveDetailUrl').value.trim();
                arch.key = document.getElementById('archiveDetailKey').value.trim();
                arch.model = document.getElementById('archiveDetailModel').value.trim();
                await saveArchive(arch);

                await renderArchiveList();
                await renderFloatArchiveList();
                updateFloatCurrentDisplay();
                document.getElementById('archiveDetailModal').classList.remove('active');
                showStatus('✅ 存档已保存', 'success');
            }

            async function applyFromDetail() {
                const id = document.getElementById('archiveDetailModal').dataset.editId;
                if (!id) return;
                await applyArchive(id);
                document.getElementById('archiveDetailModal').classList.remove('active');
            }

            async function showSaveArchiveModal() {
                document.getElementById('saveArchiveNameInput').value = '';
                document.getElementById('saveArchiveModal').classList.add('active');
            }

            async function confirmSaveArchive() {
                const name = document.getElementById('saveArchiveNameInput').value.trim();
                if (!name) { showStatus('请输入存档名称', 'error'); return; }

                const url = document.getElementById('apiBaseUrl').value.trim();
                const key = document.getElementById('apiKey').value.trim();
                const model = document.getElementById('modelSelect').value.trim();

                await saveArchive({
                    id: 'archive_' + Date.now(),
                    name: name,
                    url: url,
                    key: key,
                    model: model,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                });

                await renderArchiveList();
                await renderFloatArchiveList();
                document.getElementById('saveArchiveModal').classList.remove('active');
                showStatus('✅ 存档已保存', 'success');
            }

            function initArchiveModule() {
                document.getElementById('saveAsArchiveBtn')?.addEventListener('click', showSaveArchiveModal);
                document.getElementById('saveArchiveCancelBtn')?.addEventListener('click', () => {
                    document.getElementById('saveArchiveModal').classList.remove('active');
                });
                document.getElementById('saveArchiveConfirmBtn')?.addEventListener('click', confirmSaveArchive);

                document.getElementById('archiveDetailCancelBtn')?.addEventListener('click', () => {
                    document.getElementById('archiveDetailModal').classList.remove('active');
                });
                document.getElementById('archiveDetailSaveBtn')?.addEventListener('click', saveArchiveDetail);
                document.getElementById('archiveDetailApplyBtn')?.addEventListener('click', applyFromDetail);

                // 点击遮罩关闭弹窗
                document.querySelectorAll('#archiveDetailModal, #saveArchiveModal').forEach(modal => {
                    modal.addEventListener('click', function(e) {
                        if (e.target === this) this.classList.remove('active');
                    });
                });
            }

            function initFloatTabs() {
                document.querySelectorAll('.float-tab').forEach(tab => {
                    tab.addEventListener('click', function() {
                        document.querySelectorAll('.float-tab').forEach(t => t.classList.remove('active'));
                        this.classList.add('active');
                        const panelKey = this.dataset.tab;
                        document.getElementById('floatPanelStatus').classList.toggle('active', panelKey === 'status');
                        document.getElementById('floatPanelSwitch').classList.toggle('active', panelKey === 'switch');
                        if (panelKey === 'switch') {
                            updateFloatCurrentDisplay();
                            renderFloatArchiveList();
                        }
                    });
                });
            }

// ========== 关键词召回系统 ==========
function extractKeywordsFromText(text) {
    if (!text) return [];
    const cleaned = text
        .replace(/[\[\]()（）【】「」『』""'']/g, ' ')
        .replace(/[，。！？、；：…—·~]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    
    const tokens = new Set();
    
    // 提取中文短语 (2-4字)
    const chineseChars = cleaned.replace(/[a-zA-Z0-9\s]/g, '');
    for (let len = 2; len <= 4; len++) {
        for (let i = 0; i <= chineseChars.length - len; i++) {
            tokens.add(chineseChars.substring(i, i + len));
        }
    }
    
    // 提取英文单词
    const englishWords = cleaned.match(/[a-zA-Z]{3,}/g) || [];
    englishWords.forEach(w => tokens.add(w.toLowerCase()));
    
    // 按空格分词
    cleaned.split(/\s+/).forEach(w => {
        if (w.length >= 2 && w.length <= 8) tokens.add(w);
    });
    
    return [...tokens];
}

function matchKeywords(queryTokens, summaryKeywords) {
    if (!summaryKeywords || !summaryKeywords.length) return 0;
    if (!queryTokens || !queryTokens.length) return 0;
    
    let hits = 0;
    const queryText = queryTokens.join(' ');
    
    for (const keyword of summaryKeywords) {
        if (queryText.includes(keyword)) {
            hits++;
            continue;
        }
        for (const token of queryTokens) {
            if (token.includes(keyword) || keyword.includes(token)) {
                hits += 0.5;
                break;
            }
        }
    }
    return hits;
}

async function getRelevantSummaries(convId, recentMessages, maxCount) {
    if (!convId || !recentMessages || recentMessages.length === 0) return [];
    
    const queryText = recentMessages.map(m => m.content || '').join(' ');
    const queryTokens = extractKeywordsFromText(queryText);
    if (queryTokens.length === 0) return [];
    
    const allMemories = await DB.queryByIndex('memories', 'conversationId', convId);
    const summaries = allMemories.filter(m => m.type === 'summary' && m.keywords && m.keywords.length > 0);
    if (summaries.length === 0) return [];
    
    const scored = summaries.map(s => ({
        summary: s,
        score: matchKeywords(queryTokens, s.keywords)
    }));
    
    return scored
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxCount)
        .map(s => s.summary);
}


            async function init() {
try {
await openDB();
await initDefaults();
// 自动应用保存的全局 UI 样式
if (window.globalThemeModule?.applyActiveGlobalThemeOnStartup) {
    await window.globalThemeModule.applyActiveGlobalThemeOnStartup();
}
} catch (e) {
    console.error('DB初始化失败:', e);
    db = null;
    // 失败了也要继续，让页面可用
}
    document.querySelector('.app-main').style.display = 'none';
                mainTabBar.style.display = 'none';
                // 应用壁纸到首页桌面
const wallpaperData = await DB.get('themeSettings', 'wallpaper');
const wallpaperValue = wallpaperData?.value || 'default';
const homeMainEl = document.getElementById('homeMain');
if (homeMainEl) {
    if (wallpaperValue.startsWith('data:') || wallpaperValue.startsWith('http')) {
        homeMainEl.style.background = `url('${wallpaperValue}') center/cover`;
    } else if (wallpaperValue === 'warm') {
        homeMainEl.style.background = 'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 100%)';
    } else if (wallpaperValue === 'cool') {
        homeMainEl.style.background = 'linear-gradient(135deg, #d3e0f5 0%, #c4d4e8 100%)';
    } else if (wallpaperValue === 'dark') {
        homeMainEl.style.background = 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)';
    } else {
        homeMainEl.style.background = '';
    }
}

                setupAvatarUpload('newContact');
                setupAvatarUpload('editContact');
                setupAvatarUpload('mask');


// ========== 锁屏基础功能（不依赖任何defer脚本，确保新浏览器也能出时钟和解锁） ==========
(function setupLockscreenBasics() {
    const ls = document.getElementById('lockscreen');
    if (!ls) return;

    // 兜底时钟（home.js 初始化后会覆盖，但在此之前保证不卡 --:--）
    function lockscreenClock() {
        var now = new Date();
        var tEl = document.getElementById('lsTime');
        var dEl = document.getElementById('lsDate');
        if (tEl) tEl.textContent =
            String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0');
        if (dEl) dEl.textContent =
            now.getFullYear() + '年' + (now.getMonth() + 1) + '月' +
            now.getDate() + '日 星期' +
            ['日', '一', '二', '三', '四', '五', '六'][now.getDay()];
    }
    lockscreenClock();
    var clockInterval = setInterval(lockscreenClock, 1000);

    // 兜底解锁（home.js 初始化后会同样绑定，但不影响）
    var fallbackLocked = true;
    function unlock() {
        if (!fallbackLocked) return;
        fallbackLocked = false;
        clearInterval(clockInterval);  // 解锁后停掉兜底时钟
        ls.classList.add('hide');
        var blurBg = ls.querySelector('.lockscreen-bg');
        if (blurBg) blurBg.style.display = 'none';
    }
    ls.addEventListener('click', unlock);
    var startY = 0;
    ls.addEventListener('touchstart', function(e) { startY = e.touches[0].clientY; });
    ls.addEventListener('touchend', function(e) {
        if (startY - e.changedTouches[0].clientY > 30) unlock();
    });
})();

                function updateHomeClock() {
                    const now = new Date();
                    const hours = String(now.getHours()).padStart(2, '0');
                    const minutes = String(now.getMinutes()).padStart(2, '0');
                    const seconds = String(now.getSeconds()).padStart(2, '0');

                    const year = now.getFullYear();
                    const month = now.getMonth() + 1;
                    const day = now.getDate();

                    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
                    const weekday = weekdays[now.getDay()];

                    const timeEl = document.getElementById('clockTime');
                    const dateEl = document.getElementById('clockDate');

                    if (timeEl) {
                    timeEl.textContent = `${hours}:${minutes}`;
                    }
                    if (dateEl) {
                        dateEl.textContent = `${year}年${month}月${day}日 ${weekday}`;
                    }
                }

                updateHomeClock();

                setInterval(updateHomeClock, 1000);

                
                
document.getElementById('backToHomeFromChatBtn')?.addEventListener('click', () => {
    document.getElementById('mainTabBar').style.display = 'none';
    switchPage('desktop');
});
document.getElementById('backFromAccountingBtn')?.addEventListener('click', () => switchPage('desktop'));
document.getElementById('backFromDataManagerBtn')?.addEventListener('click', () => switchPage('desktop'));
document.getElementById('backFromWorldbookBtn')?.addEventListener('click', () => switchPage('desktop'));
document.getElementById('backFromReunionBtn')?.addEventListener('click', () => switchPage('desktop'));
document.getElementById('backFromThemeBtn')?.addEventListener('click', () => switchPage('desktop'));
document.getElementById('backFromGuangguangBtn')?.addEventListener('click', () => switchPage('desktop'));
document.getElementById('backFromSettingsBtn')?.addEventListener('click', () => switchPage('desktop'));
                document.getElementById('backFromDiaryBtn')?.addEventListener('click', () => switchPage('desktop'));
                
                document.getElementById('backFromWorldbookDetailBtn')?.addEventListener('click', () => switchPage(
                    'worldbook'));

                document.getElementById('backFromConvDetailBtn')?.addEventListener('click', () => {
                    switchPage('conversation');
                });
                
                

                tabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));

                document.getElementById('backFromConversationBtn')?.addEventListener('click', () => switchPage('chat'));
                document.getElementById('backFromSummaryBtn')?.addEventListener('click', () => switchPage(
                    'conversation'));
                    document.getElementById('backFromGroupConvBtn')?.addEventListener('click', () => switchPage('chat'));
                document.getElementById('backFromGroupDetailBtn')?.addEventListener('click', () => switchPage('group-conversation'));
                
                document.getElementById('settingsEntryBtn')?.addEventListener('click', () => switchTab('settings'));
                document.getElementById('summaryFromConvBtn')?.addEventListener('click', () => switchTab('summary'));

                document.getElementById('newConversationFromListBtn')?.addEventListener('click', () => {
                    document.getElementById('newItemChoiceModal').classList.add('active');
                });

                // [NEW] 绑定选择弹窗的三个按钮
                document.getElementById('cancelNewChoiceBtn')?.addEventListener('click', () => {
                    document.getElementById('newItemChoiceModal').classList.remove('active');
                });
                document.getElementById('chooseNewConvBtn')?.addEventListener('click', async () => {
                    document.getElementById('newItemChoiceModal').classList.remove('active');
                    const chars = await DB.getAll('characters');
                    if (!chars.length) { showStatus('请先创建联系人', 'error'); return; }
                    const sel = document.getElementById('modalCharSelect');
                    sel.innerHTML = chars.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
                    document.getElementById('newConversationModal').classList.add('active');
                });
                document.getElementById('chooseNewGroupBtn')?.addEventListener('click', () => {
                    document.getElementById('newItemChoiceModal').classList.remove('active');
                    if (window.showNewGroupFlow) {
                        window.showNewGroupFlow();
                    }
                });

                document.getElementById('cancelNewConvBtn')?.addEventListener('click', () => {
                    document.getElementById('newConversationModal').classList.remove('active');
                });

                document.getElementById('confirmNewConvBtn')?.addEventListener('click', async () => {
                    const charId = document.getElementById('modalCharSelect').value;
                    if (!charId) return;

                    const activeMaskId = await DB.getSetting('activeUserProfileId');
                    let maskId = activeMaskId;

                    if (!maskId) {
                        const masks = await DB.getAll('userProfiles');
                        if (masks.length > 0) {
                            maskId = masks[0].id;
                            await DB.setSetting('activeUserProfileId', maskId);
                        }
                    }

                    const conv = await createNewConversation(charId, maskId);
                    document.getElementById('newConversationModal').classList.remove('active');
                    await openConversation(conv.id);
                });

                document.getElementById('convSendBtn')?.addEventListener('click', sendMessageInConv);
                document.getElementById('convFetchBtn')?.addEventListener('click', fetchAIReplyInConv);
                document.getElementById('convMessageInput')?.addEventListener('keypress', e => { if (e.key === 'Enter')
                        sendMessageInConv(); });

                const expandMenuBtn = document.getElementById('expandMenuBtn');
                const expandMenu = document.getElementById('expandMenu');

                if (expandMenuBtn) {
                    expandMenuBtn.addEventListener('click', () => {
                        expandMenu.classList.toggle('active');
                    });
                }

                document.querySelectorAll('.expand-menu-item').forEach(item => {
                    item.addEventListener('click', async (e) => {
                        const action = item.dataset.action;
                        expandMenu.classList.remove('active');

                        if (action === 'toggleMode') {
                            await toggleConversationMode();
                            return;
                        }

                        if (action === 'emoticon') {
                            if (window.emoticonModule) window.emoticonModule.toggleEmoticonPicker();
                            return;
                        }

                        if (action === 'openSummary') {
                            switchTab('summary');
                            return;
                        }
                        if (action === 'openDetail') {
                            const convId = window.currentConversationId;
                            if (convId) {
                                openConvDetail(convId);
                            } else {
                                showStatus('请先进入对话', 'info');
                            }
                            return;
                        }

                        if (action === 'userImage') {
                            const desc = prompt('请输入图片描述：');
                            if (desc && desc.trim()) {
                                await sendUserSpecialMessage('image', desc.trim());
                            }
                        } else if (action === 'userVoice') {
                            const content = prompt('请输入语音内容：');
                            if (content && content.trim()) {
                                await sendUserSpecialMessage('voice', content.trim());
                            }
                        } else if (action === 'innerVoice') {
                            await showInnerVoiceBubble();
                        } else if (action === 'transfer') {
    const convId = window.currentConversationId;
    if (!convId) { showStatus('请先进入对话', 'error'); return; }
    const amount = prompt('请输入转账金额：');
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;
    let cardHTML;
    if (window.GDB && window.buildWxTransferCard) {
        const balance = await window.GDB.getWallet();
        if (balance < Number(amount)) { showStatus('余额不足，请先充值', 'error'); return; }
        await window.GDB.setWallet(balance - Number(amount));
        cardHTML = window.buildWxTransferCard(Number(amount), 'pending');
    } else {
        cardHTML = `<div class="gg-transfer-card pending"><div style="color:#999;font-size:13px;">微信转账</div><div class="gg-transfer-amount">¥${Number(amount).toFixed(2)}</div><div class="gg-transfer-hint">待对方确认收款</div></div>`;
    }
    const conv = await DB.get('conversations', convId);
    if (conv) {
        await DB.put('chats', { role: 'user', content: cardHTML, messageType: 'transfer', conversationId: convId, charId: conv.charId, timestamp: Date.now() });
        await DB.put('conversations', { ...conv, updatedAt: Date.now() });
    }
    showStatus('已转账 ¥' + amount, 'success');
    await loadConversationMessages(convId);
    if (window.fetchTransferAIReply) setTimeout(async () => { await window.fetchTransferAIReply(convId, Number(amount)); }, 1500);
} else if (action === 'sendRedPacket') {
    const convId = window.currentConversationId;
    if (!convId) { showStatus('请先进入对话', 'error'); return; }
    const amount = prompt('请输入红包金额：');
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;
    const msg = prompt('请输入红包留言（可选）：') || '恭喜发财，大吉大利！';
    let cardHTML2;
    if (window.GDB && window.buildWxRedPacketCard) {
        const balance = await window.GDB.getWallet();
        if (balance < Number(amount)) { showStatus('余额不足，请先充值', 'error'); return; }
        await window.GDB.setWallet(balance - Number(amount));
        cardHTML2 = window.buildWxRedPacketCard(Number(amount), msg);
    } else {
        cardHTML2 = `<div class="gg-redpacket-card"><div class="gg-redpacket-icon">🧧</div><div class="gg-redpacket-msg">${escapeHtml(msg)}</div><div class="gg-redpacket-label">微信红包 · ¥${Number(amount).toFixed(2)}</div></div>`;
    }
    const conv2 = await DB.get('conversations', convId);
    if (conv2) {
        await DB.put('chats', { role: 'user', content: cardHTML2, messageType: 'transfer', conversationId: convId, charId: conv2.charId, timestamp: Date.now() });
        await DB.put('conversations', { ...conv2, updatedAt: Date.now() });
    }
    showStatus('已发送红包 ¥' + amount, 'success');
    await loadConversationMessages(convId);
    if (window.fetchRedPacketAIReply) setTimeout(async () => { await window.fetchRedPacketAIReply(convId, Number(amount)); }, 2000);
}else if (action === 'sendDiary') {
                            await showDiaryPicker();
                        } else if (action === 'voiceCall') {
                            const convId = window.currentConversationId;
                            if (!convId) {
                                showStatus('请先进入对话', 'error');
                                return;
                            }
                            if (window.startVoiceCall) {
                                window.startVoiceCall(convId, 'caller');
                            }
                        }
                    });
                });

                document.getElementById('summarizeRangeBtn')?.addEventListener('click', () => {
                    const s = parseInt(document.getElementById('summaryStartInput').value);
                    const e = parseInt(document.getElementById('summaryEndInput').value);
                    if (isNaN(s) || isNaN(e) || s > e) {
                        showStatus('请填写有效范围', 'error');
                        return;
                    }
                    generateSummary(s, e);
                });
                document.getElementById('autoFillRangeBtn')?.addEventListener('click', autoFillSummaryRange);
                document.getElementById('saveRecallSettingsBtn')?.addEventListener('click', async () => {
    const val = document.getElementById('maxRecallCount').value;
    await DB.setSetting('maxRecallCount', val);
    showStatus('✅ 召回设置已保存', 'success');
});

                document.getElementById('proactiveSummaryBtn')?.addEventListener('click', proactiveMessage);
                document.getElementById('contextRoundsInput')?.addEventListener('change', e => DB.setSetting(
                    'contextRounds', e.target.value));

                document.getElementById('addContactBtn')?.addEventListener('click', () => {
                    document.getElementById('newContactName').value = '';
                    document.getElementById('newContactGroup').value = '默认';
                    document.getElementById('newContactDetail').value = '';
                    document.getElementById('newContactAvatarData').value = '';
                    const previewEl = document.getElementById('newContactAvatarPreview');
                    previewEl.style.backgroundImage = '';
                    previewEl.style.backgroundColor = '#ccc';
                    previewEl.textContent = '👤';
                    document.getElementById('createContactModal').classList.add('active');
                });
                document.getElementById('cancelContactBtn')?.addEventListener('click', () => {
                    document.getElementById('createContactModal').classList.remove('active');
                });
                document.getElementById('saveContactBtn')?.addEventListener('click', async () => {
                    const name = document.getElementById('newContactName').value.trim();
                    if (!name) { showStatus('请输入名称', 'error'); return; }
                    const id = 'char_' + Date.now();
                    const avatarData = document.getElementById('newContactAvatarData')?.value || '';
                    await DB.put('characters', {
                        id,
                        name,
                        avatar: avatarData,
                        group: document.getElementById('newContactGroup').value.trim() || '默认',
                        detail: document.getElementById('newContactDetail').value.trim()
                    });
                    document.getElementById('createContactModal').classList.remove('active');
                    await refreshContactList();
                });

                document.getElementById('cancelEditContactBtn')?.addEventListener('click', () => {
                    document.getElementById('editContactModal').classList.remove('active');
                });
                document.getElementById('saveEditContactBtn')?.addEventListener('click', async () => {
                    const id = document.getElementById('editContactId').value;
                    const name = document.getElementById('editContactName').value.trim();
                    if (!name) { showStatus('请输入名称', 'error'); return; }
                    const avatarData = document.getElementById('editContactAvatarData')?.value || '';
                    await DB.put('characters', {
                        id,
                        name,
                        avatar: avatarData,
                        group: document.getElementById('editContactGroup').value.trim() || '默认',
                        detail: document.getElementById('editContactDetail').value.trim()
                    });
                    document.getElementById('editContactModal').classList.remove('active');
                    await refreshContactList();
                    showStatus('✅ 联系人已更新', 'success');
                });
                document.getElementById('deleteContactBtn')?.addEventListener('click', async () => {
                    if (!confirm('确定删除该联系人吗？')) return;
                    await DB.delete('characters', document.getElementById('editContactId').value);
                    document.getElementById('editContactModal').classList.remove('active');
                    await refreshContactList();
                });

                document.getElementById('createMaskBtn')?.addEventListener('click', () => {
                    document.getElementById('maskModalTitle').textContent = '新建面具';
                    document.getElementById('editMaskId').value = '';
                    document.getElementById('maskNameInput').value = '';
                    document.getElementById('maskBioInput').value = '';
                    document.getElementById('maskAvatarData').value = '';
                    const previewEl = document.getElementById('maskAvatarPreview');
                    previewEl.style.backgroundImage = '';
                    previewEl.style.backgroundColor = '#ccc';
                    previewEl.textContent = '👤';
                    document.getElementById('createMaskModal').classList.add('active');
                });
                document.getElementById('editMaskBtn')?.addEventListener('click', async () => {
                    const mask = await getActiveMask();
                    if (mask) {
                        document.getElementById('maskModalTitle').textContent = '编辑面具';
                        document.getElementById('editMaskId').value = mask.id;
                        document.getElementById('maskNameInput').value = mask.name;
                        document.getElementById('maskBioInput').value = mask.bio || '';
                        document.getElementById('maskAvatarData').value = mask.avatar || '';
                        const previewEl = document.getElementById('maskAvatarPreview');
                        previewEl.dataset.name = mask.name;
                        if (mask.avatar) {
                            previewEl.style.backgroundImage = `url('${mask.avatar}')`;
                            previewEl.style.backgroundColor = 'transparent';
                            previewEl.textContent = '';
                        } else {
                            previewEl.style.backgroundImage = '';
                            previewEl.style.backgroundColor = getAvatarColor(mask.name);
                            previewEl.textContent = mask.name.charAt(0);
                        }
                        document.getElementById('createMaskModal').classList.add('active');
                    }
                });
                document.getElementById('switchMaskBtn')?.addEventListener('click', () => { switchPage('profile');
                    setTimeout(refreshMaskList, 100); });
                document.getElementById('cancelMaskBtn')?.addEventListener('click', () => document.getElementById(
                    'createMaskModal').classList.remove('active'));
                document.getElementById('saveMaskBtn')?.addEventListener('click', async () => {
                    let id = document.getElementById('editMaskId').value;
                    const name = document.getElementById('maskNameInput').value.trim();
                    if (!name) { showStatus('请输入名称', 'error'); return; }
                    if (!id) id = 'mask_' + Date.now();
                    const avatarData = document.getElementById('maskAvatarData')?.value || '';
                    await DB.put('userProfiles', { id, name, bio: document.getElementById('maskBioInput').value
                            .trim(), avatar: avatarData });
                    document.getElementById('createMaskModal').classList.remove('active');
                    await refreshMaskSelect();
                    await refreshProfile();
                    await refreshMaskList();
                });

                document.getElementById('saveApiBtn')?.addEventListener('click', async () => {
                    await DB.setSetting('llmBaseUrl', document.getElementById('apiBaseUrl').value.trim());
                    await DB.setSetting('llmApiKey', document.getElementById('apiKey').value.trim());
                    await DB.setSetting('temperature', document.getElementById('temperatureSlider').value);
                    await DB.setSetting('maxTokens', document.getElementById('maxTokensInput').value);
                    await DB.setSetting('topP', document.getElementById('topPSlider').value);
                    const model = document.getElementById('modelSelect').value;
                    if (model) await DB.setSetting('llmModel', model);
                    showStatus('✅ 配置已保存', 'success');
                });
                document.getElementById('temperatureSlider')?.addEventListener('input', e => document.getElementById(
                    'temperatureValue').textContent = parseFloat(e.target.value).toFixed(1));
                document.getElementById('topPSlider')?.addEventListener('input', e => document.getElementById('topPValue')
                    .textContent = parseFloat(e.target.value).toFixed(2));
                document.getElementById('toggleApiKeyBtn')?.addEventListener('click', () => {
                    const inp = document.getElementById('apiKey');
                    inp.type = inp.type === 'password' ? 'text' : 'password';
                });
                document.getElementById('fetchModelsBtn')?.addEventListener('click', async () => {
                    showStatus('📡 拉取模型列表...', 'info');
                    try {
                        const config = await getLLMConfig();
                        if (!config.apiKey) throw new Error('请先填写API Key');
                        const resp = await fetch(`${config.baseUrl.replace(/\/$/, '')}/models`, { headers: {
                                'Authorization': `Bearer ${config.apiKey}` } });
                        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                        const data = await resp.json();
                        const models = (data.data || []).map(m => m.id).filter(id => id && !id.includes(
                            'dall-e')).sort();
                        const select = document.getElementById('modelSelect');
                        select.innerHTML = '';
                        models.forEach(m => { const opt = document.createElement('option');
                            opt.value = m;
                            opt.textContent = m;
                            select.appendChild(opt); });
                        await DB.setSetting('llmModels', models);
                        showStatus(`✅ 找到 ${models.length} 个模型`, 'success');
                    } catch (e) { showStatus(`❌ ${e.message}`, 'error'); }
                });
                document.getElementById('testApiBtn')?.addEventListener('click', async () => {
                    showStatus('🔍 测试连接...', 'info');
                    try {
                        const config = await getLLMConfig();
                        const res = await fetch(`${config.baseUrl.replace(/\/$/, '')}/models`, { headers: {
                                'Authorization': `Bearer ${config.apiKey}` } });
                        if (!res.ok) throw new Error(`HTTP ${res.status}`);
                        showStatus('✅ 连接成功！', 'success');
                    } catch (e) { showStatus(`❌ ${e.message}`, 'error'); }
                });
                document.getElementById('refreshModelsBtn')?.addEventListener('click', async () => {
                    const models = await DB.getSetting('llmModels', []);
                    const saved = await DB.getSetting('llmModel', '');
                    const select = document.getElementById('modelSelect');
                    if (models.length) {
                        select.innerHTML = '';
                        models.forEach(m => { const opt = document.createElement('option');
                            opt.value = m;
                            opt.textContent = m;
                            select.appendChild(opt); });
                        if (saved) select.value = saved;
                    }
                });

                document.getElementById('exportAllDataBtn')?.addEventListener('click', exportAllData);
                document.getElementById('importDataBtn')?.addEventListener('click', triggerImport);
                document.getElementById('clearAllDataBtn')?.addEventListener('click', clearAllData);
                document.getElementById('forceUpdateBtn')?.addEventListener('click', forceUpdateApp);

                document.getElementById('newWorldbookBtn')?.addEventListener('click', createNewWorldbook);
                document.getElementById('saveWorldbookBtn')?.addEventListener('click', saveWorldbook);
                document.getElementById('deleteWorldbookBtn')?.addEventListener('click', deleteWorldbook);
                document.getElementById('cancelWorldbookEditBtn')?.addEventListener('click', () => switchPage(
                    'worldbook'));

                document.getElementById('saveConvDetailBtn')?.addEventListener('click', saveConvDetail);
                document.getElementById('deleteConvBtn')?.addEventListener('click', async () => {
                    const convId = window.currentEditingConvId;
                    if (!convId) return;
                    if (!confirm('确定删除这个对话吗？\n\n该对话的所有消息、总结和记忆都会被清除，不可恢复！')) return;

                    const chats = await DB.queryByIndex('chats', 'conversationId', convId);
                    for (const c of chats) { if (c.id) await DB.delete('chats', c.id); }

                    const memories = await DB.queryByIndex('memories', 'conversationId', convId);
                    for (const m of memories) { if (m.id) await DB.delete('memories', m.id); }

                    await DB.delete('convDetails', convId);
                    await DB.delete('conversations', convId);

                    showStatus('✅ 对话已删除', 'success');
                    switchPage('chat');
                    await refreshConversationList();
                });
                setupConvDetailAvatarUpload('convDetailChar', 'convDetailCharAvatarData', 'convDetailCharAvatar');
                setupConvDetailAvatarUpload('convDetailUser', 'convDetailUserAvatarData', 'convDetailUserAvatar');

                bindThemeEvents();
                bindConvBgEvents();

                // 初始化外部模块
                if (window.initAccountingModule) window.initAccountingModule();
                if (window.initReunionModule) {
                    window.initReunionModule({
                        DB, showStatus, escapeHtml, getAvatarColor,
                        callLLM, recordApiPending
                    });
                }
                if (window.initDiaryModule) {
                    window.initDiaryModule({
                        DB, showStatus, escapeHtml, getAvatarColor,
                        getActiveMask, callLLM, recordApiPending, switchPage
                    });
                }
                if (window.initFocusModule) {
                    window.initFocusModule({
                        DB, showStatus, escapeHtml,
                        callLLM, recordApiPending, loadConversationMessages
                    });
                }
                // 查手机模块
                if (window.initPhoneCheckModule) {
    window.initPhoneCheckModule({
        DB, showStatus, escapeHtml, getAvatarColor,
        callLLM, recordApiPending
    });
}

                // 初始化语音通话模块
                if (window.initVoiceCallModule) {
                    window.initVoiceCallModule({
                        DB, showStatus, escapeHtml, getAvatarColor,
                        callLLM, recordApiPending, loadConversationMessages,
                        buildSystemPrompt
                    });
                }

                await refreshConversationList();
                renderHomeNavIcons().catch(e => console.error('图标渲染失败:', e));
                                initArchiveModule();
initFloatTabs();
await renderArchiveList();
await renderFloatArchiveList();

                const floatBtn = document.getElementById('apiStatusFloat');
                let isDragging = false;
                let dragStartX, dragStartY, floatStartX, floatStartY;
                let hasMoved = false;

                if (floatBtn) {
                    floatBtn.addEventListener('mousedown', startDrag);
                    floatBtn.addEventListener('touchstart', startDrag, { passive: false });

                    document.addEventListener('mousemove', onDrag);
                    document.addEventListener('touchmove', onDrag, { passive: false });

                    document.addEventListener('mouseup', endDrag);
                    document.addEventListener('touchend', endDrag);

                    floatBtn.addEventListener('click', (e) => {
    if (hasMoved) return;

    // 长按悬浮窗时由 fullscreen-float.js 接管，不再打开 API 状态卡
    if (window.__apiFloatLongPressed) {
        e.preventDefault();
        e.stopPropagation();
        return;
    }

    const card = document.getElementById('apiStatusCard');
    if (card) {
        updateApiStatusFloat();
        card.classList.toggle('show');
    }
});
                }

                function startDrag(e) {
                    isDragging = true;
                    hasMoved = false;
                    const pos = e.touches ? e.touches[0] : e;
                    dragStartX = pos.clientX;
                    dragStartY = pos.clientY;

                    const rect = floatBtn.getBoundingClientRect();
                    floatStartX = rect.left;
                    floatStartY = rect.top;
                }

                function onDrag(e) {
                    if (!isDragging) return;
                    const pos = e.touches ? e.touches[0] : e;
                    const dx = pos.clientX - dragStartX;
                    const dy = pos.clientY - dragStartY;

                    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                        hasMoved = true;
                        e.preventDefault();

                        let newX = floatStartX + dx;
                        let newY = floatStartY + dy;

                        const maxX = window.innerWidth - floatBtn.offsetWidth - 8;
                        const maxY = window.innerHeight - floatBtn.offsetHeight - 8;
                        newX = Math.max(8, Math.min(newX, maxX));
                        newY = Math.max(8, Math.min(newY, maxY));

                        floatBtn.style.left = newX + 'px';
                        floatBtn.style.top = newY + 'px';
                        floatBtn.style.right = 'auto';
                        floatBtn.style.bottom = 'auto';
                    }
                }

                function endDrag() {
                    isDragging = false;
                    setTimeout(() => { hasMoved = false; }, 50);
                }

                document.getElementById('closeApiStatusCard')?.addEventListener('click', () => {
                    document.getElementById('apiStatusCard')?.classList.remove('show');
                });

                document.addEventListener('click', (e) => {
                    const card = document.getElementById('apiStatusCard');
                    const float = document.getElementById('apiStatusFloat');
                    if (card && card.classList.contains('show') &&
                        !card.contains(e.target) &&
                        !float.contains(e.target)) {
                        card.classList.remove('show');
                    }
                });

                updateApiStatusFloat();
                

                // 初始化首页模块
if (window.initHomeModule) {
    window.homeModule = window.initHomeModule({
        DB, showStatus, switchPage, refreshConversationList, getAvatarColor, compressImage
    });
    try {
        await Promise.race([
            window.homeModule.init(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('首页初始化超时')), 8000))
        ]);
    } catch (e) {
        console.error('⚠️ 首页模块初始化失败:', e.message);
    }
}

// 应用锁屏设置（开关、样式、照片、时钟颜色）
await applyLockscreenSettings();
                // 初始化表情包模块
if (window.initEmoticonModule) {
    window.emoticonModule = window.initEmoticonModule({
        DB, showStatus, escapeHtml, getAvatarColor, compressImage, callLLM, switchPage
    });
    window.emoticonModule.bindEvents();
    window.emoticonModule.setupEmoticonPickerDismiss();
}

// 初始化朋友圈模块
if (window.initMomentsModule) {
    await window.initMomentsModule();
}

// 初始化 SMS 模块
if (window.initSMSModule) {
    window.smsModule = window.initSMSModule({
        DB, showStatus, escapeHtml, callLLM, switchPage, getActiveMask
    });
    if (window.smsModule?.init) {
        await window.smsModule.init();
    }
}

// [NEW] 初始化群聊模块
if (window.initGroupChatModule) {
    await window.initGroupChatModule();
}

                

                console.log('✅ 初始化完成');
            }

            // 给init加超时保护，防止永久卡死
        const initTimeout = setTimeout(() => {
            console.error('❌ 初始化超时(15秒)，强制解锁页面');
            const ls = document.getElementById('lockscreen');
            if (ls) { ls.classList.add('hide'); ls.style.pointerEvents = 'none'; ls.style.visibility = 'hidden'; }
            document.getElementById('homeMain').style.display = '';
            document.querySelector('.home-dock').style.display = '';
            document.querySelector('.page-indicator').style.display = '';
        }, 15000);

        init().finally(() => clearTimeout(initTimeout));
    })();
    
    
if ('serviceWorker' in navigator) {
    const isGithub = window.location.hostname.includes('github.io');
    const firstPath = window.location.pathname.split('/').filter(Boolean)[0];
    const basePath = isGithub && firstPath ? `/${firstPath}/` : '/';

    navigator.serviceWorker.register(basePath + 'sw.js', { scope: basePath })
        .then(reg => console.log('✅ PWA 服务已就绪', basePath))
        .catch(err => console.log('❌ PWA 注册失败', err));
}