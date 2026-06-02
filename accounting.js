// ============================================
// 记账与月经预测模块 - accounting.js
// 版本：v2.0
// 说明：提供极浅粉蓝科技风记账、待办清单、收藏室以及月经期预测
// ============================================

(function() {
    "use strict";

    // ==================== 通用 SVG 路径矢量图标 ====================
    const SVG_ICONS = {
        trash: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
        plus: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
        arrowLeft: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
        arrowRight: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
        income: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`,
        expense: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>`,
        wallet: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12a2 2 0 0 0 2 2h14v-4"></path><path d="M18 12a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4v-6z"></path></svg>`,
        calendar: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
        drop: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z"></path></svg>`,
        todo: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`,
        collection: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
        check: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
    };

    window.initAccountingModule = function() {
        console.log('📊 记账与月经预测模块已加载');
        accountingInjectCleanUI();
        accountingLoadData();
        menstrualLoadData();
        accountingLoadCollectionData();
        accountingSetActiveType('income');
        accountingRenderCalendar();
        accountingBindEvents();
        menstrualSetupSelectGroups();
    };

    // ==================== 状态库 ====================
    let accountingTransactions = [];
    let accountingMonthlyBudget = 3000;
    const ACCOUNTING_STORAGE_KEY = 'calendar_ledger_v2';
    const ACCOUNTING_BUDGET_KEY = 'calendar_budget_v2';
    const ACCOUNTING_TODO_PREFIX = 'calendar_todos_';
    
    let accountingCurrentYear = new Date().getFullYear();
    let accountingCurrentMonth = new Date().getMonth();
    let accountingSelectedDateStr = null;
    let accountingCurrentType = 'income';
    
    let accountingApiItems = [];
    let accountingWebItems = [];
    const ACCOUNTING_API_KEY = 'collection_api_v1';
    const ACCOUNTING_WEB_KEY = 'collection_web_v1';

    // 月经周期数据
    let menstrualPeriods = []; // [{ id, startDate, endDate }]
    let menstrualSettings = { defaultInterval: 28, defaultDuration: 5 };
    let menstrualDailyLogs = {}; // { 'YYYY-MM-DD': { flow, pain, sleep, digestion, log } }

    // ==================== 工具函数 ====================
    function accountingFormatCurrency(val) { 
        return '¥' + (Number(val) || 0).toFixed(2); 
    }

    function accountingGetDateStr(year, month, day) {
        const d = new Date(year, month, day);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const da = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${da}`;
    }

    function accountingExtractDateStr(isoString) {
        const d = new Date(isoString);
        return accountingGetDateStr(d.getFullYear(), d.getMonth(), d.getDate());
    }

    function accountingGenId() { 
        return Date.now() + '-' + Math.random().toString(36).substr(2, 8); 
    }

    function escapeHtml(s) {
        if (s === null || s === undefined) return '';
        return String(s).replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[m]);
    }

    // ==================== UI 动态渲染注入 ====================
    function accountingInjectCleanUI() {
        const mainPage = document.getElementById('page-accounting');
        if (mainPage) {
            mainPage.innerHTML = `
                <div class="chat-header">
                    <div class="chat-header-left">
                        <button class="back-btn clickable" id="backFromAccountingBtn">${SVG_ICONS.arrowLeft}</button>
                        <h2>Calendar</h2>
                    </div>
                    <div class="header-actions"></div>
                </div>
                <div style="flex:1; overflow-y:auto;">
                    <div class="accounting-wrapper">
                        <div class="app-card">
                            <div class="top-bar">
                                <div class="top-bar-icon">${SVG_ICONS.calendar}</div>
                                <div class="month-nav">
                                    <button id="accountingPrevMonthBtn">${SVG_ICONS.arrowLeft}</button>
                                    <span class="current-month" id="accountingCurrentMonthDisplay"></span>
                                    <button id="accountingNextMonthBtn">${SVG_ICONS.arrowRight}</button>
                                    <button id="accountingTodayBtn" class="today-btn">今</button>
                                </div>
                            </div>

                            <div class="budget-summary">
                                <div class="budget-grid">
                                    <div class="month-expense-box">
                                        <span class="summary-label">当月总支出</span>
                                        <span class="summary-number" id="accountingMonthTotalExpense">¥0</span>
                                    </div>
                                    <div class="budget-left-box">
                                        <span class="summary-label">剩余预算</span>
                                        <span class="summary-number" id="accountingBudgetRemainDisplay">¥0</span>
                                    </div>
                                    <button class="set-budget-btn" id="accountingShowBudgetInputBtn">${SVG_ICONS.wallet}</button>
                                </div>
                                <div id="accountingBudgetInputRow" class="budget-set-row" style="display: none;">
                                    <input type="number" id="accountingBudgetAmountInput" placeholder="月预算" min="0" step="100" value="3000">
                                    <button id="accountingSaveBudgetBtn">保存</button>
                                </div>
                            </div>

                            <div class="calendar-grid weekdays">
                                <div class="weekday">一</div><div class="weekday">二</div><div class="weekday">三</div>
                                <div class="weekday">四</div><div class="weekday">五</div><div class="weekday">六</div><div class="weekday">日</div>
                            </div>
                            <div id="accountingCalendarDaysContainer" class="calendar-grid"></div>

                            <div class="collection-entrance" id="accountingCollectionEntranceBtn">
                                <div class="collection-icon">${SVG_ICONS.collection}</div>
                                <div class="collection-info">
                                    <h3>收藏室</h3>
                                    <p>API密钥 · 网页收藏 · 更多</p>
                                </div>
                                <div class="entrance-arrow" style="margin-left:auto;">${SVG_ICONS.arrowRight}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        const transPanel = document.getElementById('accountingTransitionPanel');
        if (transPanel) {
            transPanel.innerHTML = `
                <div class="accounting-transition-content">
                    <div class="accounting-panel-header">
                        <button class="accounting-back-btn" id="accountingBackToCalendarFromTransition">${SVG_ICONS.arrowLeft} 返回日历</button>
                        <span class="accounting-selected-date-title" id="accountingTransitionDateLabel"></span>
                        <span></span>
                    </div>
                    <div class="accounting-transition-cards">
                        <div class="accounting-transition-card" data-target="ledger">
                            <span class="accounting-card-icon">${SVG_ICONS.income}</span>
                            <div class="accounting-card-info">
                                <h3>每日收支</h3>
                                <p>记账 · 查看流水</p>
                            </div>
                        </div>
                        <div class="accounting-transition-card" data-target="todo">
                            <span class="accounting-card-icon">${SVG_ICONS.todo}</span>
                            <div class="accounting-card-info">
                                <h3>待办清单</h3>
                                <p>创建任务 · 标记完成</p>
                            </div>
                        </div>
                        <div class="accounting-transition-card" data-target="reserved">
                            <span class="accounting-card-icon">${SVG_ICONS.drop}</span>
                            <div class="accounting-card-info">
                                <h3>经期记录</h3>
                                <p>月经记录 · 预测分析</p>
                            </div>
                        </div>
                        <div class="accounting-transition-card" data-target="collection">
                            <span class="accounting-card-icon">${SVG_ICONS.collection}</span>
                            <div class="accounting-card-info">
                                <h3>收藏室</h3>
                                <p>API · 网页 · 资料库</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        const ledgerPanel = document.getElementById('accountingLedgerDetailPanel');
        if (ledgerPanel) {
            ledgerPanel.innerHTML = `
                <div class="accounting-detail-content">
                    <div class="accounting-detail-header">
                        <button class="accounting-back-btn" id="accountingBackToTransitionFromLedger">${SVG_ICONS.arrowLeft} 返回</button>
                        <span class="accounting-detail-title">每日收支</span>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <span id="accountingLedgerDateDisplay" style="font-weight: 500; color: var(--tech-text-dark);"></span>
                    </div>
                    <div class="accounting-daily-stats" style="display:flex; gap:16px; margin-bottom:12px;">
                        <span>收入: <span id="accountingDailyIncome">¥0</span></span>
                        <span>支出: <span id="accountingDailyExpense">¥0</span></span>
                    </div>
                    <div class="accounting-add-section">
                        <div class="accounting-form-row" style="display:flex; gap:8px; margin-bottom:8px;">
                            <div class="accounting-form-group" style="flex:1;">
                                <label style="font-size:12px; color:var(--tech-text-muted);">项目</label>
                                <input type="text" id="accountingDescInput" class="accounting-form-control" placeholder="餐饮/工资" maxlength="20" style="width:100%;">
                            </div>
                            <div class="accounting-form-group" style="flex:1;">
                                <label style="font-size:12px; color:var(--tech-text-muted);">金额</label>
                                <input type="number" id="accountingAmountInput" class="accounting-form-control" placeholder="0.00" min="0.01" step="0.01" style="width:100%;">
                            </div>
                        </div>
                        <div class="accounting-form-row" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <div class="accounting-type-toggle" id="accountingTypeToggle" style="display:flex; gap:6px;">
                                <button type="button" class="accounting-type-btn income active" data-type="income" style="padding:6px 12px; border:1px solid var(--tech-border-blue); border-radius:12px; cursor:pointer;">收入</button>
                                <button type="button" class="accounting-type-btn expense" data-type="expense" style="padding:6px 12px; border:1px solid var(--tech-border-blue); border-radius:12px; cursor:pointer;">支出</button>
                            </div>
                        </div>
                        <button class="accounting-btn-add" id="accountingAddTransactionBtn" style="width:100%; padding:10px 0; cursor:pointer;">+ 记录</button>
                    </div>
                    <h4 style="margin: 16px 0 8px; color:var(--tech-text-dark);">当日明细</h4>
                    <ul class="accounting-transactions-list" id="accountingDetailTransactionList" style="list-style:none; padding:0;"></ul>
                </div>
            `;
        }

        const todoPanel = document.getElementById('accountingTodoDetailPanel');
        if (todoPanel) {
            todoPanel.innerHTML = `
                <div class="accounting-detail-content">
                    <div class="accounting-detail-header">
                        <button class="accounting-back-btn" id="accountingBackToTransitionFromTodo">${SVG_ICONS.arrowLeft} 返回</button>
                        <span class="accounting-detail-title">待办清单</span>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <span id="accountingTodoDateDisplay" style="font-weight: 500; color: var(--tech-text-dark);"></span>
                    </div>
                    <div class="accounting-todo-input-area" style="display:flex; gap:8px; margin-bottom:12px;">
                        <input type="text" id="accountingNewTodoInput" placeholder="写一个待办…" maxlength="30" style="flex:1;">
                        <button class="accounting-todo-add-btn" id="accountingAddTodoBtn" style="padding:0 12px; border-radius:14px; border:none; background:var(--tech-blue-primary); color:white; cursor:pointer;">添加</button>
                    </div>
                    <ul class="accounting-todo-list" id="accountingTodoListContainer" style="list-style:none; padding:0;"></ul>
                </div>
            `;
        }

        const periodPanel = document.getElementById('accountingReservedDetailPanel');
        if (periodPanel) {
            periodPanel.innerHTML = `
                <div class="accounting-detail-content">
                    <div class="accounting-detail-header">
                        <button class="accounting-back-btn" id="accountingBackToTransitionFromReserved">${SVG_ICONS.arrowLeft} 返回</button>
                        <span class="accounting-detail-title">经期期纪</span>
                    </div>
                    
                    <div class="period-settings-card">
                        <div class="period-setting-title">周期基础设置</div>
                        <div class="period-setting-fields">
                            <div class="setting-field">
                                <label>预计周期（天）</label>
                                <input type="number" id="menstrualIntervalInput" value="28" min="15" max="45">
                            </div>
                            <div class="setting-field">
                                <label>持续行经（天）</label>
                                <input type="number" id="menstrualDurationInput" value="5" min="2" max="14">
                            </div>
                            <button id="menstrualSaveSettingsBtn" class="menstrual-action-btn">保存</button>
                        </div>
                    </div>

                    <div class="period-status-card">
                        <div class="status-header">
                            <span id="menstrualDateLabel" class="status-date-label"></span>
                            <label class="switch-container">
                                <input type="checkbox" id="menstrualTodayCheckbox">
                                <span class="slider">今日行经</span>
                            </label>
                        </div>
                    </div>

                    <div id="menstrualLogFormCard" class="period-log-card" style="display: none;">
                        <div class="period-setting-title">今日行经症状</div>
                        
                        <div class="log-field">
                            <label>血量流量</label>
                            <div class="select-group" id="menstrualFlowGroup">
                                <button class="select-btn" data-value="low">少</button>
                                <button class="select-btn active" data-value="medium">中</button>
                                <button class="select-btn" data-value="heavy">多</button>
                            </div>
                        </div>

                        <div class="log-field">
                            <label>痛经程度</label>
                            <div class="select-group" id="menstrualPainGroup">
                                <button class="select-btn active" data-value="none">无</button>
                                <button class="select-btn" data-value="mild">轻度</button>
                                <button class="select-btn" data-value="moderate">中度</button>
                                <button class="select-btn" data-value="severe">重度</button>
                            </div>
                        </div>

                        <div class="log-field">
                            <label>睡眠质量</label>
                            <div class="select-group" id="menstrualSleepGroup">
                                <button class="select-btn" data-value="poor">差</button>
                                <button class="select-btn" data-value="fair">一般</button>
                                <button class="select-btn active" data-value="good">极佳</button>
                            </div>
                        </div>

                        <div class="log-field">
                            <label>消化状况</label>
                            <div class="select-group" id="menstrualDigestionGroup">
                                <button class="select-btn" data-value="poor">差</button>
                                <button class="select-btn active" data-value="normal">正常</button>
                                <button class="select-btn" data-value="bloated">胀气</button>
                            </div>
                        </div>

                        <div class="log-field">
                            <label>今日日志 (200字内)</label>
                            <textarea id="menstrualDailyLogText" placeholder="点击这里，写下你今日的身体状况或身体感想..."></textarea>
                        </div>

                        <button id="menstrualSaveLogBtn" class="menstrual-action-btn primary" style="width: 100%; margin-top: 6px;">保存记录</button>
                    </div>

                    <div class="period-predictions-card">
                        <div class="period-setting-title">周期数据与行经预测</div>
                        <div id="menstrualPredictionDetails" class="prediction-details">
                            分析中...
                        </div>
                    </div>
                </div>
            `;
        }

        const colPanel = document.getElementById('accountingCollectionPanel');
        if (colPanel) {
            colPanel.innerHTML = `
                <div class="accounting-detail-content">
                    <div class="accounting-detail-header">
                        <button class="accounting-back-btn" id="accountingBackToTransitionFromCollection">${SVG_ICONS.arrowLeft} 返回</button>
                        <span class="accounting-detail-title">收藏室</span>
                    </div>

                    <div class="accounting-collection-tabs">
                        <button class="accounting-collection-tab-btn active" data-collection-tab="api">API管理器</button>
                        <button class="accounting-collection-tab-btn" data-collection-tab="web">网页收藏器</button>
                        <button class="accounting-collection-tab-btn" data-collection-tab="placeholder">板块3</button>
                    </div>

                    <div id="accountingCollectionViewApi" class="accounting-collection-view">
                        <div class="accounting-section-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <h2>API 密钥库</h2>
                            <button class="accounting-btn-primary" id="accountingShowApiFormBtn" style="padding:6px 12px; cursor:pointer;">新建API</button>
                        </div>
                        <div id="accountingApiCreateCard" class="accounting-create-card" style="display: none; padding:12px; border:1px dashed var(--tech-border-blue); border-radius:14px; margin-bottom:12px;">
                            <div class="accounting-form-row" style="display:flex; flex-direction:column; gap:8px;">
                                <div class="accounting-form-group">
                                    <label style="font-size:12px;">名称</label>
                                    <input type="text" id="accountingApiNameInput" placeholder="例: OpenAI" style="width:100%; padding:6px;">
                                </div>
                                <div class="accounting-form-group">
                                    <label style="font-size:12px;">URL</label>
                                    <input type="text" id="accountingApiUrlInput" placeholder="https://api.example.com" style="width:100%; padding:6px;">
                                </div>
                                <div class="accounting-form-group">
                                    <label style="font-size:12px;">API Key</label>
                                    <input type="text" id="accountingApiKeyInput" placeholder="sk-..." style="width:100%; padding:6px;">
                                </div>
                                <div style="display: flex; gap: 8px; justify-content:flex-end;">
                                    <button class="accounting-btn-primary" id="accountingSaveApiBtn" style="padding:6px 12px; cursor:pointer;">保存</button>
                                    <button class="accounting-btn-outline" id="accountingCancelApiBtn" style="padding:6px 12px; cursor:pointer;">取消</button>
                                </div>
                            </div>
                        </div>
                        <div id="accountingApiListContainer" class="accounting-item-list"></div>
                    </div>

                    <div id="accountingCollectionViewWeb" class="accounting-collection-view">
                        <div class="accounting-section-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <h2>网页收藏</h2>
                            <button class="accounting-btn-primary" id="accountingShowWebFormBtn" style="padding:6px 12px; cursor:pointer;">新建网页</button>
                        </div>
                        <div id="accountingWebCreateCard" class="accounting-create-card" style="display: none; padding:12px; border:1px dashed var(--tech-border-blue); border-radius:14px; margin-bottom:12px;">
                            <div class="accounting-form-row" style="display:flex; flex-direction:column; gap:8px;">
                                <div class="accounting-form-group">
                                    <label style="font-size:12px;">名称</label>
                                    <input type="text" id="accountingWebNameInput" placeholder="例: 设计系统" style="width:100%; padding:6px;">
                                </div>
                                <div class="accounting-form-group">
                                    <label style="font-size:12px;">链接</label>
                                    <input type="text" id="accountingWebUrlInput" placeholder="https://..." style="width:100%; padding:6px;">
                                </div>
                                <div class="accounting-form-group">
                                    <label style="font-size:12px;">备注</label>
                                    <input type="text" id="accountingWebNoteInput" placeholder="备注信息" style="width:100%; padding:6px;">
                                </div>
                                <div style="display: flex; gap: 8px; justify-content:flex-end;">
                                    <button class="accounting-btn-primary" id="accountingSaveWebBtn" style="padding:6px 12px; cursor:pointer;">保存</button>
                                    <button class="accounting-btn-outline" id="accountingCancelWebBtn" style="padding:6px 12px; cursor:pointer;">取消</button>
                                </div>
                            </div>
                        </div>
                        <div id="accountingWebListContainer" class="accounting-item-list"></div>
                    </div>

                    <div id="accountingCollectionViewPlaceholder" class="accounting-collection-view">
                        <div class="accounting-section-header"><h2>板块3</h2></div>
                        <div class="accounting-placeholder-content" style="text-align:center; padding:20px; color:var(--tech-text-muted);">占位区域 · 未来扩展</div>
                    </div>
                </div>
            `;
        }
    }

    // ==================== 待办管理 ====================
    function accountingLoadTodos(dateStr) {
        const key = ACCOUNTING_TODO_PREFIX + dateStr;
        const stored = localStorage.getItem(key);
        if (stored) { try { return JSON.parse(stored); } catch (e) { return []; } }
        return [];
    }

    function accountingSaveTodos(dateStr, todos) {
        localStorage.setItem(ACCOUNTING_TODO_PREFIX + dateStr, JSON.stringify(todos));
    }

    // ==================== 收支计算 ====================
    function accountingCalcMonthExpense(year, month) {
        return accountingTransactions
            .filter(t => {
                if (t.type !== 'expense') return false;
                const d = new Date(t.date);
                return d.getFullYear() === year && d.getMonth() === month;
            })
            .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    }

    // ==================== 数据持久化 ====================
    function accountingSaveAll() {
        localStorage.setItem(ACCOUNTING_STORAGE_KEY, JSON.stringify(accountingTransactions));
        localStorage.setItem(ACCOUNTING_BUDGET_KEY, accountingMonthlyBudget);
    }

    function accountingLoadData() {
        const stored = localStorage.getItem(ACCOUNTING_STORAGE_KEY);
        if (stored) { try { accountingTransactions = JSON.parse(stored); } catch (e) {} }
        const b = localStorage.getItem(ACCOUNTING_BUDGET_KEY);
        if (b) accountingMonthlyBudget = Number(b) || 3000;
        const budgetInput = document.getElementById('accountingBudgetAmountInput');
        if (budgetInput) budgetInput.value = accountingMonthlyBudget;
        
        if (!accountingTransactions.length) {
            const today = new Date();
            const y = today.getFullYear(), m = today.getMonth(), d = today.getDate();
            accountingTransactions.push(
                { id: Date.now() - 200000, description: '买菜', amount: 89.5, type: 'expense', date: new Date(y, m, d, 10, 30).toISOString() },
                { id: Date.now() - 500000, description: '工资', amount: 7000, type: 'income', date: new Date(y, m, d, 9, 0).toISOString() },
                { id: Date.now() - 800000, description: '聚餐', amount: 210, type: 'expense', date: new Date(y, m, d - 1, 19, 0).toISOString() }
            );
            accountingSaveAll();
        }
    }

    function accountingLoadCollectionData() {
        try {
            const savedApi = localStorage.getItem(ACCOUNTING_API_KEY);
            if (savedApi) accountingApiItems = JSON.parse(savedApi);
            const savedWeb = localStorage.getItem(ACCOUNTING_WEB_KEY);
            if (savedWeb) accountingWebItems = JSON.parse(savedWeb);
        } catch (e) {}
    }

    function accountingSaveApiStorage() { 
        localStorage.setItem(ACCOUNTING_API_KEY, JSON.stringify(accountingApiItems)); 
    }

    function accountingSaveWebStorage() { 
        localStorage.setItem(ACCOUNTING_WEB_KEY, JSON.stringify(accountingWebItems)); 
    }

    // ==================== 月经周期逻辑与计算 ====================
    function menstrualLoadData() {
        try {
            const p = localStorage.getItem('menstrual_periods_v1');
            menstrualPeriods = p ? JSON.parse(p) : [];
            const s = localStorage.getItem('menstrual_settings_v1');
            menstrualSettings = s ? JSON.parse(s) : { defaultInterval: 28, defaultDuration: 5 };
            const l = localStorage.getItem('menstrual_daily_logs_v1');
            menstrualDailyLogs = l ? JSON.parse(l) : {};
        } catch(e) {
            menstrualPeriods = [];
            menstrualSettings = { defaultInterval: 28, defaultDuration: 5 };
            menstrualDailyLogs = {};
        }
    }

    function menstrualSaveAll() {
        menstrualPeriods = menstrualMergePeriods(menstrualPeriods);
        localStorage.setItem('menstrual_periods_v1', JSON.stringify(menstrualPeriods));
        localStorage.setItem('menstrual_settings_v1', JSON.stringify(menstrualSettings));
        localStorage.setItem('menstrual_daily_logs_v1', JSON.stringify(menstrualDailyLogs));
    }

    // 智能合并：间隔不超过 2 日（diff <= 2）则行经合并
    function menstrualMergePeriods(periods) {
        if (periods.length <= 1) return periods;
        periods.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        
        const merged = [];
        let current = JSON.parse(JSON.stringify(periods[0]));
        
        for (let i = 1; i < periods.length; i++) {
            const next = periods[i];
            const currentEnd = new Date(current.endDate);
            const nextStart = new Date(next.startDate);
            
            const diffTime = nextStart - currentEnd;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
            
            if (diffDays <= 2) {
                if (new Date(next.endDate) > currentEnd) {
                    current.endDate = next.endDate;
                }
            } else {
                merged.push(current);
                current = JSON.parse(JSON.stringify(next));
            }
        }
        merged.push(current);
        return merged;
    }

    function menstrualIsDateInActualPeriod(dateStr) {
        if (!dateStr) return false;
        const date = new Date(dateStr);
        return menstrualPeriods.some(p => {
            const start = new Date(p.startDate);
            const end = new Date(p.endDate);
            return date >= start && date <= end;
        });
    }

    // 经期智能行经投影预测
    function menstrualGetPredictedPeriodDays(year, month) {
        const predictedDays = new Set();
        if (menstrualPeriods.length === 0) return predictedDays;
        
        const sorted = [...menstrualPeriods].sort((a,b) => new Date(b.startDate) - new Date(a.startDate));
        const latest = sorted[0];
        const latestStart = new Date(latest.startDate);
        
        const interval = menstrualSettings.defaultInterval || 28;
        const duration = menstrualSettings.defaultDuration || 5;
        
        for (let i = 1; i <= 12; i++) {
            const predStart = new Date(latestStart);
            predStart.setDate(latestStart.getDate() + (i * interval));
            
            for (let d = 0; d < duration; d++) {
                const currentPredDay = new Date(predStart);
                currentPredDay.setDate(predStart.getDate() + d);
                
                if (currentPredDay.getFullYear() === year && currentPredDay.getMonth() === month) {
                    const dayStr = accountingGetDateStr(year, month, currentPredDay.getDate());
                    predictedDays.add(dayStr);
                }
            }
        }
        return predictedDays;
    }

    function menstrualSetDatePeriod(dateStr, isPeriod) {
        if (isPeriod) {
            if (menstrualIsDateInActualPeriod(dateStr)) return;
            menstrualPeriods.push({
                id: accountingGenId(),
                startDate: dateStr,
                endDate: dateStr
            });
        } else {
            const newPeriods = [];
            const targetDate = new Date(dateStr);
            
            menstrualPeriods.forEach(p => {
                const start = new Date(p.startDate);
                const end = new Date(p.endDate);
                
                if (targetDate >= start && targetDate <= end) {
                    const leftEnd = new Date(targetDate);
                    leftEnd.setDate(targetDate.getDate() - 1);
                    if (leftEnd >= start) {
                        newPeriods.push({
                            id: accountingGenId(),
                            startDate: p.startDate,
                            endDate: accountingGetDateStr(leftEnd.getFullYear(), leftEnd.getMonth(), leftEnd.getDate())
                        });
                    }
                    const rightStart = new Date(targetDate);
                    rightStart.setDate(targetDate.getDate() + 1);
                    if (rightStart <= end) {
                        newPeriods.push({
                            id: accountingGenId(),
                            startDate: accountingGetDateStr(rightStart.getFullYear(), rightStart.getMonth(), rightStart.getDate()),
                            endDate: p.endDate
                        });
                    }
                } else {
                    newPeriods.push(p);
                }
            });
            menstrualPeriods = newPeriods;
        }
        menstrualSaveAll();
    }

    function menstrualSetupSelectGroups() {
        const groups = ['menstrualFlowGroup', 'menstrualPainGroup', 'menstrualSleepGroup', 'menstrualDigestionGroup'];
        groups.forEach(gId => {
            const el = document.getElementById(gId);
            if (!el) return;
            el.querySelectorAll('.select-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    el.querySelectorAll('.select-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });
        });
    }

    function menstrualGetSelectGroupValue(gId) {
        const el = document.getElementById(gId);
        if (!el) return null;
        const active = el.querySelector('.select-btn.active');
        return active ? active.dataset.value : null;
    }

    function menstrualSetSelectGroupValue(gId, val) {
        const el = document.getElementById(gId);
        if (!el) return;
        el.querySelectorAll('.select-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.value === val);
        });
    }

    function menstrualLoadDailyLogForDate(dateStr) {
        const log = menstrualDailyLogs[dateStr] || { flow: 'medium', pain: 'none', sleep: 'good', digestion: 'normal', log: '' };
        menstrualSetSelectGroupValue('menstrualFlowGroup', log.flow);
        menstrualSetSelectGroupValue('menstrualPainGroup', log.pain);
        menstrualSetSelectGroupValue('menstrualSleepGroup', log.sleep);
        menstrualSetSelectGroupValue('menstrualDigestionGroup', log.digestion);
        const textarea = document.getElementById('menstrualDailyLogText');
        if (textarea) textarea.value = log.log || '';
    }

    function menstrualUpdatePredictionCard() {
        const detailsEl = document.getElementById('menstrualPredictionDetails');
        if (!detailsEl) return;
        
        if (menstrualPeriods.length === 0) {
            detailsEl.innerHTML = '<div style="color:var(--tech-text-muted); text-align:center;">请添加行经记录以激活预测分析</div>';
            return;
        }
        
        const sorted = [...menstrualPeriods].sort((a,b) => new Date(b.startDate) - new Date(a.startDate));
        const latest = sorted[0];
        
        let totalDuration = 0;
        menstrualPeriods.forEach(p => {
            const dStart = new Date(p.startDate);
            const dEnd = new Date(p.endDate);
            const diffDays = Math.ceil((dEnd - dStart) / (1000 * 60 * 60 * 24)) + 1;
            totalDuration += diffDays;
        });
        const avgDuration = (totalDuration / menstrualPeriods.length).toFixed(1);
        
        const latestStart = new Date(latest.startDate);
        const interval = menstrualSettings.defaultInterval || 28;
        const nextStart = new Date(latestStart);
        nextStart.setDate(latestStart.getDate() + interval);
        
        const nextStartStr = accountingGetDateStr(nextStart.getFullYear(), nextStart.getMonth(), nextStart.getDate());
        
        detailsEl.innerHTML = `
            <div class="prediction-item">
                <span class="pred-label">行经总次数</span>
                <span class="pred-val">${menstrualPeriods.length} 次记录</span>
            </div>
            <div class="prediction-item">
                <span class="pred-label">平均行经天数</span>
                <span class="pred-val">${avgDuration} 天</span>
            </div>
            <div class="prediction-item">
                <span class="pred-label">上期行经</span>
                <span class="pred-val">${latest.startDate} 至 ${latest.endDate}</span>
            </div>
            <div class="prediction-item future-highlight">
                <span class="pred-label">下期行经预测</span>
                <span class="pred-val">${nextStartStr} 起</span>
            </div>
        `;
    }

    function menstrualOpenPeriodPanel() {
        if (!accountingSelectedDateStr) return;
        const display = document.getElementById('menstrualDateLabel');
        if (display) display.textContent = accountingSelectedDateStr;
        
        const inPeriod = menstrualIsDateInActualPeriod(accountingSelectedDateStr);
        const chk = document.getElementById('menstrualTodayCheckbox');
        if (chk) chk.checked = inPeriod;
        
        const logCard = document.getElementById('menstrualLogFormCard');
        if (logCard) logCard.style.display = inPeriod ? 'block' : 'none';
        
        menstrualLoadDailyLogForDate(accountingSelectedDateStr);
        
        const intervalInput = document.getElementById('menstrualIntervalInput');
        const durationInput = document.getElementById('menstrualDurationInput');
        if (intervalInput) intervalInput.value = menstrualSettings.defaultInterval;
        if (durationInput) durationInput.value = menstrualSettings.defaultDuration;
        
        menstrualUpdatePredictionCard();
        
        const panel = document.getElementById('accountingReservedDetailPanel');
        if (panel) panel.style.display = 'block';
    }

    // ==================== UI更新 ====================
    function accountingUpdateSummary() {
        const monthExp = accountingCalcMonthExpense(accountingCurrentYear, accountingCurrentMonth);
        const monthTotalEl = document.getElementById('accountingMonthTotalExpense');
        const budgetRemainEl = document.getElementById('accountingBudgetRemainDisplay');
        if (monthTotalEl) monthTotalEl.textContent = accountingFormatCurrency(monthExp);
        if (budgetRemainEl) {
            const remain = Math.max(0, accountingMonthlyBudget - monthExp);
            budgetRemainEl.textContent = accountingFormatCurrency(remain);
        }
    }

    function accountingGetDayTotal(dateStr) {
        let income = 0, expense = 0;
        accountingTransactions.forEach(t => {
            if (accountingExtractDateStr(t.date) === dateStr) {
                if (t.type === 'income') income += Number(t.amount) || 0;
                else expense += Number(t.amount) || 0;
            }
        });
        return { income, expense };
    }

    // ==================== 日历渲染 ====================
    function accountingRenderCalendar() {
        const year = accountingCurrentYear, month = accountingCurrentMonth;
        const firstDay = new Date(year, month, 1);
        let startDayOfWeek = firstDay.getDay();
        startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevMonthDays = new Date(year, month, 0).getDate();
        let cellsHtml = '';

        // 行经预测列表
        const predictedDays = menstrualGetPredictedPeriodDays(year, month);

        // 上个月填充
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            const d = prevMonthDays - i;
            const dateStr = accountingGetDateStr(year, month - 1, d);
            const totals = accountingGetDayTotal(dateStr);
            const isActualPeriod = menstrualIsDateInActualPeriod(dateStr) ? 'period-actual' : '';
            cellsHtml += `<div class="calendar-day other-month ${isActualPeriod}" data-date="${dateStr}">
                <div class="day-number">${d}</div>
                <div class="day-indicators">
                    <div class="day-income">${totals.income > 0 ? '+' + totals.income.toFixed(0) : ''}</div>
                    <div class="day-expense">${totals.expense > 0 ? '-' + totals.expense.toFixed(0) : ''}</div>
                </div>
            </div>`;
        }

        // 当前月
        const todayStr = accountingGetDateStr(new Date());
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = accountingGetDateStr(year, month, d);
            const totals = accountingGetDayTotal(dateStr);
            const isToday = (dateStr === todayStr) ? 'today-cell' : '';
            
            let periodClass = '';
            if (menstrualIsDateInActualPeriod(dateStr)) {
                periodClass = 'period-actual';
            } else if (predictedDays.has(dateStr)) {
                periodClass = 'period-predicted';
            }

            cellsHtml += `<div class="calendar-day ${isToday} ${periodClass}" data-date="${dateStr}">
                <div class="day-number">${d}</div>
                <div class="day-indicators">
                    <div class="day-income">${totals.income > 0 ? '+' + totals.income.toFixed(0) : ''}</div>
                    <div class="day-expense">${totals.expense > 0 ? '-' + totals.expense.toFixed(0) : ''}</div>
                </div>
            </div>`;
        }

        // 下个月填充（42格）
        const totalCells = 42;
        const rendered = startDayOfWeek + daysInMonth;
        for (let i = rendered; i < totalCells; i++) {
            const nextD = i - rendered + 1;
            const dateStr = accountingGetDateStr(year, month + 1, nextD);
            const totals = accountingGetDayTotal(dateStr);
            const isActualPeriod = menstrualIsDateInActualPeriod(dateStr) ? 'period-actual' : '';
            cellsHtml += `<div class="calendar-day other-month ${isActualPeriod}" data-date="${dateStr}">
                <div class="day-number">${nextD}</div>
                <div class="day-indicators">
                    <div class="day-income">${totals.income > 0 ? '+' + totals.income.toFixed(0) : ''}</div>
                    <div class="day-expense">${totals.expense > 0 ? '-' + totals.expense.toFixed(0) : ''}</div>
                </div>
            </div>`;
        }

        const container = document.getElementById('accountingCalendarDaysContainer');
        if (container) container.innerHTML = cellsHtml;

        const monthDisplay = document.getElementById('accountingCurrentMonthDisplay');
        if (monthDisplay) monthDisplay.textContent = `${year}年 ${month + 1}月`;

        accountingUpdateSummary();

        document.querySelectorAll('#accountingCalendarDaysContainer .calendar-day').forEach(el => {
            el.addEventListener('click', function() {
                accountingOpenTransitionPanel(this.dataset.date);
            });
        });
    }

    // ==================== 面板导航 ====================
    function accountingOpenTransitionPanel(dateStr) {
        accountingSelectedDateStr = dateStr;
        const label = document.getElementById('accountingTransitionDateLabel');
        if (label) label.textContent = dateStr;
        const panel = document.getElementById('accountingTransitionPanel');
        if (panel) panel.style.display = 'block';
    }

    function accountingCloseAllPanels() {
        const panels = [
            'accountingTransitionPanel', 'accountingLedgerDetailPanel',
            'accountingTodoDetailPanel', 'accountingReservedDetailPanel', 
            'accountingCollectionPanel'
        ];
        panels.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
    }

    function accountingOpenLedgerPanel() {
        if (!accountingSelectedDateStr) return;
        const display = document.getElementById('accountingLedgerDateDisplay');
        if (display) display.textContent = accountingSelectedDateStr;
        accountingRenderLedgerContent();
        const panel = document.getElementById('accountingLedgerDetailPanel');
        if (panel) panel.style.display = 'block';
    }

    function accountingOpenTodoPanel() {
        if (!accountingSelectedDateStr) return;
        const display = document.getElementById('accountingTodoDateDisplay');
        if (display) display.textContent = accountingSelectedDateStr;
        accountingRenderTodoList();
        const panel = document.getElementById('accountingTodoDetailPanel');
        if (panel) panel.style.display = 'block';
    }

    function accountingOpenCollectionPanel() {
        const panel = document.getElementById('accountingCollectionPanel');
        if (panel) panel.style.display = 'block';
        accountingSwitchCollectionTab('api');
        accountingRefreshCollectionViews();
    }

    // ==================== 收支明细面板 ====================
    function accountingRenderLedgerContent() {
        const totals = accountingGetDayTotal(accountingSelectedDateStr);
        const incomeEl = document.getElementById('accountingDailyIncome');
        const expenseEl = document.getElementById('accountingDailyExpense');
        if (incomeEl) incomeEl.textContent = accountingFormatCurrency(totals.income);
        if (expenseEl) expenseEl.textContent = accountingFormatCurrency(totals.expense);

        const dayTrans = accountingTransactions
            .filter(t => accountingExtractDateStr(t.date) === accountingSelectedDateStr)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        const listEl = document.getElementById('accountingDetailTransactionList');
        if (!listEl) return;

        if (dayTrans.length === 0) {
            listEl.innerHTML = '<li class="accounting-empty-msg" style="text-align:center; padding:12px; color:var(--tech-text-muted);">暂无收支明细</li>';
            return;
        }

        let html = '';
        dayTrans.forEach(t => {
            const amt = Number(t.amount) || 0;
            const sign = t.type === 'income' ? '' : '−';
            const cls = t.type === 'income' ? 'accounting-amount-income' : 'accounting-amount-expense';
            html += `<li class="accounting-transaction-item">
                <div><strong>${escapeHtml(t.description)}</strong></div>
                <div style="display:flex; align-items:center; gap:12px;">
                    <span class="${cls}">${sign}${accountingFormatCurrency(amt)}</span>
                    <button class="accounting-delete-btn" data-id="${t.id}">${SVG_ICONS.trash}</button>
                </div>
            </li>`;
        });
        listEl.innerHTML = html;

        listEl.querySelectorAll('.accounting-delete-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                const id = Number(btn.dataset.id);
                accountingTransactions = accountingTransactions.filter(t => t.id !== id);
                accountingSaveAll();
                accountingRenderCalendar();
                accountingRenderLedgerContent();
                accountingUpdateSummary();
            });
        });
    }

    // ==================== 待办清单面板 ====================
    function accountingRenderTodoList() {
        if (!accountingSelectedDateStr) return;
        const todos = accountingLoadTodos(accountingSelectedDateStr);
        const sorted = [...todos].sort((a, b) => (a.completed ? 1 : 0) - (b.completed ? 1 : 0));
        const container = document.getElementById('accountingTodoListContainer');
        if (!container) return;

        if (sorted.length === 0) {
            container.innerHTML = '<li class="accounting-empty-msg" style="text-align:center; padding:12px; color:var(--tech-text-muted);">当前日期暂无待办</li>';
            return;
        }

        let html = '';
        sorted.forEach(todo => {
            const checkedAttr = todo.completed ? 'checked' : '';
            const completedClass = todo.completed ? 'accounting-todo-completed' : '';
            html += `<li class="accounting-todo-item ${completedClass}" data-id="${todo.id}">
                <input type="checkbox" class="accounting-todo-check" ${checkedAttr}>
                <span class="accounting-todo-text">${escapeHtml(todo.text)}</span>
                <button class="accounting-todo-delete-btn">${SVG_ICONS.trash}</button>
            </li>`;
        });
        container.innerHTML = html;

        container.querySelectorAll('.accounting-todo-item').forEach(item => {
            const id = Number(item.dataset.id);
            const checkbox = item.querySelector('.accounting-todo-check');
            const delBtn = item.querySelector('.accounting-todo-delete-btn');
            checkbox.addEventListener('change', () => {
                const todos = accountingLoadTodos(accountingSelectedDateStr);
                const target = todos.find(t => t.id === id);
                if (target) { target.completed = checkbox.checked; }
                accountingSaveTodos(accountingSelectedDateStr, todos);
                accountingRenderTodoList();
            });
            delBtn.addEventListener('click', () => {
                let todos = accountingLoadTodos(accountingSelectedDateStr);
                todos = todos.filter(t => t.id !== id);
                accountingSaveTodos(accountingSelectedDateStr, todos);
                accountingRenderTodoList();
            });
        });
    }

    function accountingAddTodo() {
        const input = document.getElementById('accountingNewTodoInput');
        if (!input) return;
        const text = input.value.trim();
        if (!text) return;
        const todos = accountingLoadTodos(accountingSelectedDateStr);
        todos.push({ id: Date.now() + Math.floor(Math.random() * 1000), text, completed: false });
        accountingSaveTodos(accountingSelectedDateStr, todos);
        input.value = '';
        accountingRenderTodoList();
    }

    // ==================== 添加交易 ====================
    function accountingAddTransaction() {
        if (!accountingSelectedDateStr) { alert('请先选择日期'); return; }
        const descInput = document.getElementById('accountingDescInput');
        const amtInput = document.getElementById('accountingAmountInput');
        if (!descInput || !amtInput) return;
        const desc = descInput.value.trim();
        if (!desc) { alert('请填写描述'); return; }
        const amt = parseFloat(amtInput.value);
        if (isNaN(amt) || amt <= 0) { alert('金额需大于0'); return; }
        const rounded = Math.round(amt * 100) / 100;
        const [year, month, day] = accountingSelectedDateStr.split('-').map(Number);
        const recordDate = new Date(year, month - 1, day, 12, 0, 0);
        accountingTransactions.push({
            id: Date.now() + Math.floor(Math.random() * 1000),
            description: desc,
            amount: rounded,
            type: accountingCurrentType,
            date: recordDate.toISOString()
        });
        accountingSaveAll();
        descInput.value = '';
        amtInput.value = '';
        accountingRenderCalendar();
        accountingRenderLedgerContent();
        accountingUpdateSummary();
    }

    function accountingSetActiveType(type) {
        accountingCurrentType = type;
        document.querySelectorAll('.accounting-type-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });
    }

    // ==================== 收藏室 ====================
    function accountingSwitchCollectionTab(tabId) {
        document.querySelectorAll('.accounting-collection-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.collectionTab === tabId);
        });
        document.querySelectorAll('.accounting-collection-view').forEach(v => v.style.display = 'none');
        const viewId = tabId === 'api' ? 'Api' : tabId === 'web' ? 'Web' : 'Placeholder';
        const view = document.getElementById('accountingCollectionView' + viewId);
        if (view) view.style.display = 'block';
    }

    function accountingRenderApiList() {
        const container = document.getElementById('accountingApiListContainer');
        if (!container) return;
        if (accountingApiItems.length === 0) {
            container.innerHTML = '<div class="accounting-empty-message" style="text-align:center; padding:12px; color:var(--tech-text-muted);">暂无配置的API</div>';
            return;
        }
        let html = '';
        accountingApiItems.forEach(item => {
            html += `<div class="accounting-item-card ${item.expanded ? 'expanded' : ''}" data-api-id="${item.id}">
                <div class="accounting-item-header" data-action="toggle-api" data-id="${item.id}" style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="accounting-item-name">${escapeHtml(item.name) || '未命名'}</span>
                    <div style="display:flex; align-items:center;">
                        <button class="accounting-delete-btn" data-action="delete-api" data-id="${item.id}">${SVG_ICONS.trash}</button>
                    </div>
                </div>
                <div class="accounting-item-details">
                    <div class="accounting-detail-field"><label>URL</label><input class="accounting-api-url-input" data-id="${item.id}" value="${escapeHtml(item.url || '')}"></div>
                    <div class="accounting-detail-field"><label>API Key</label><input class="accounting-api-key-input" data-id="${item.id}" value="${escapeHtml(item.apikey || '')}"></div>
                    <div class="accounting-detail-actions"><button class="accounting-btn-outline" data-action="save-api-edit" data-id="${item.id}">保存编辑</button></div>
                </div>
            </div>`;
        });
        container.innerHTML = html;

        bindCollectionCardEvents(container, 'api', accountingApiItems, accountingSaveApiStorage, accountingRenderApiList);
    }

    function accountingRenderWebList() {
        const container = document.getElementById('accountingWebListContainer');
        if (!container) return;
        if (accountingWebItems.length === 0) {
            container.innerHTML = '<div class="accounting-empty-message" style="text-align:center; padding:12px; color:var(--tech-text-muted);">暂无网页收藏</div>';
            return;
        }
        let html = '';
        accountingWebItems.forEach(item => {
            html += `<div class="accounting-item-card ${item.expanded ? 'expanded' : ''}" data-web-id="${item.id}">
                <div class="accounting-item-header" data-action="toggle-web" data-id="${item.id}" style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="accounting-item-name">${escapeHtml(item.name) || '未命名'}</span>
                    <div style="display:flex; align-items:center;">
                        <button class="accounting-delete-btn" data-action="delete-web" data-id="${item.id}">${SVG_ICONS.trash}</button>
                    </div>
                </div>
                <div class="accounting-item-details">
                    <div class="accounting-detail-field"><label>链接</label><input class="accounting-web-url-input" data-id="${item.id}" value="${escapeHtml(item.url || '')}"></div>
                    <div class="accounting-detail-field"><label>备注</label><input class="accounting-web-note-input" data-id="${item.id}" value="${escapeHtml(item.note || '')}"></div>
                    <div class="accounting-detail-actions"><button class="accounting-btn-outline" data-action="save-web-edit" data-id="${item.id}">保存编辑</button></div>
                </div>
            </div>`;
        });
        container.innerHTML = html;

        bindCollectionCardEvents(container, 'web', accountingWebItems, accountingSaveWebStorage, accountingRenderWebList);
    }

    function bindCollectionCardEvents(container, type, items, saveFn, renderFn) {
        container.querySelectorAll('.accounting-item-header').forEach(header => {
            header.addEventListener('click', (e) => {
                if (e.target.closest('.accounting-delete-btn')) return;
                const card = header.closest('.accounting-item-card');
                const id = card.dataset[type + 'Id'];
                const item = items.find(a => a.id === id);
                if (item) {
                    item.expanded = !item.expanded;
                    saveFn();
                    renderFn();
                }
            });
        });

        container.querySelectorAll('.accounting-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                if (confirm(`删除当前项目？`)) {
                    const idx = items.findIndex(a => a.id === id);
                    if (idx >= 0) items.splice(idx, 1);
                    saveFn();
                    renderFn();
                }
            });
        });

        container.querySelectorAll('[data-action="save-' + type + '-edit"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                const card = btn.closest('.accounting-item-card');
                const item = items.find(a => a.id === id);
                if (item) {
                    if (type === 'api') {
                        item.url = card.querySelector('.accounting-api-url-input').value;
                        item.apikey = card.querySelector('.accounting-api-key-input').value;
                    } else {
                        item.url = card.querySelector('.accounting-web-url-input').value;
                        item.note = card.querySelector('.accounting-web-note-input').value;
                    }
                    saveFn();
                    renderFn();
                }
            });
        });
    }

    function accountingRefreshCollectionViews() {
        accountingRenderApiList();
        accountingRenderWebList();
    }

    // ==================== 事件绑定 ====================
    function accountingBindEvents() {
        // 月份切换
        const prevBtn = document.getElementById('accountingPrevMonthBtn');
        if (prevBtn && !prevBtn.dataset.accountingBound) {
            prevBtn.dataset.accountingBound = '1';
            prevBtn.addEventListener('click', () => {
                if (accountingCurrentMonth === 0) { accountingCurrentMonth = 11; accountingCurrentYear--; } 
                else { accountingCurrentMonth--; }
                accountingRenderCalendar();
            });
        }

        const nextBtn = document.getElementById('accountingNextMonthBtn');
        if (nextBtn && !nextBtn.dataset.accountingBound) {
            nextBtn.dataset.accountingBound = '1';
            nextBtn.addEventListener('click', () => {
                if (accountingCurrentMonth === 11) { accountingCurrentMonth = 0; accountingCurrentYear++; } 
                else { accountingCurrentMonth++; }
                accountingRenderCalendar();
            });
        }

        const todayBtn = document.getElementById('accountingTodayBtn');
        if (todayBtn && !todayBtn.dataset.accountingBound) {
            todayBtn.dataset.accountingBound = '1';
            todayBtn.addEventListener('click', () => {
                const today = new Date();
                accountingCurrentYear = today.getFullYear();
                accountingCurrentMonth = today.getMonth();
                accountingRenderCalendar();
                const y = today.getFullYear();
                const m = String(today.getMonth() + 1).padStart(2, '0');
                const d = String(today.getDate()).padStart(2, '0');
                accountingOpenTransitionPanel(`${y}-${m}-${d}`);
            });
        }

        // 预算设置
        document.getElementById('accountingShowBudgetInputBtn')?.addEventListener('click', () => {
            const row = document.getElementById('accountingBudgetInputRow');
            const input = document.getElementById('accountingBudgetAmountInput');
            if (row) row.style.display = 'flex';
            if (input) input.value = accountingMonthlyBudget;
        });

        document.getElementById('accountingSaveBudgetBtn')?.addEventListener('click', () => {
            const input = document.getElementById('accountingBudgetAmountInput');
            if (input) {
                let val = parseFloat(input.value);
                accountingMonthlyBudget = (!isNaN(val) && val >= 0) ? val : 0;
            }
            const row = document.getElementById('accountingBudgetInputRow');
            if (row) row.style.display = 'none';
            accountingUpdateSummary();
            accountingSaveAll();
        });

        // 经期周期设置保存
        document.getElementById('menstrualSaveSettingsBtn')?.addEventListener('click', () => {
            const interval = parseInt(document.getElementById('menstrualIntervalInput').value);
            const duration = parseInt(document.getElementById('menstrualDurationInput').value);
            if (interval > 0 && duration > 0) {
                menstrualSettings.defaultInterval = interval;
                menstrualSettings.defaultDuration = duration;
                menstrualSaveAll();
                accountingRenderCalendar();
                menstrualUpdatePredictionCard();
                alert('行经设置已保存');
            }
        });

        // 今日行经 Checkbox 切换
        document.getElementById('menstrualTodayCheckbox')?.addEventListener('change', (e) => {
            const checked = e.target.checked;
            menstrualSetDatePeriod(accountingSelectedDateStr, checked);
            
            accountingRenderCalendar();
            
            const logCard = document.getElementById('menstrualLogFormCard');
            if (logCard) logCard.style.display = checked ? 'block' : 'none';
            
            menstrualUpdatePredictionCard();
        });

        // 经期日志保存
        document.getElementById('menstrualSaveLogBtn')?.addEventListener('click', () => {
            const dateStr = accountingSelectedDateStr;
            if (!dateStr) return;
            
            menstrualDailyLogs[dateStr] = {
                flow: menstrualGetSelectGroupValue('menstrualFlowGroup'),
                pain: menstrualGetSelectGroupValue('menstrualPainGroup'),
                sleep: menstrualGetSelectGroupValue('menstrualSleepGroup'),
                digestion: menstrualGetSelectGroupValue('menstrualDigestionGroup'),
                log: document.getElementById('menstrualDailyLogText').value.trim()
            };
            menstrualSaveAll();
            alert('行经记录保存成功');
        });

        // 返回日历
        document.getElementById('accountingBackToCalendarFromTransition')?.addEventListener('click', () => {
            accountingCloseAllPanels();
            accountingRenderCalendar();
        });

        // 过渡面板卡片跳转
        document.querySelectorAll('.accounting-transition-card').forEach(card => {
            card.addEventListener('click', () => {
                const target = card.dataset.target;
                const panel = document.getElementById('accountingTransitionPanel');
                if (panel) panel.style.display = 'none';
                
                if (target === 'ledger') accountingOpenLedgerPanel();
                else if (target === 'todo') accountingOpenTodoPanel();
                else if (target === 'reserved') menstrualOpenPeriodPanel();
                else if (target === 'collection') accountingOpenCollectionPanel();
            });
        });

        // 其它导航返回绑定
        document.getElementById('accountingBackToTransitionFromLedger')?.addEventListener('click', () => {
            document.getElementById('accountingLedgerDetailPanel').style.display = 'none';
            document.getElementById('accountingTransitionPanel').style.display = 'block';
        });
        document.getElementById('accountingBackToTransitionFromTodo')?.addEventListener('click', () => {
            document.getElementById('accountingTodoDetailPanel').style.display = 'none';
            document.getElementById('accountingTransitionPanel').style.display = 'block';
        });
        document.getElementById('accountingBackToTransitionFromReserved')?.addEventListener('click', () => {
            document.getElementById('accountingReservedDetailPanel').style.display = 'none';
            document.getElementById('accountingTransitionPanel').style.display = 'block';
        });
        document.getElementById('accountingBackToTransitionFromCollection')?.addEventListener('click', () => {
            document.getElementById('accountingCollectionPanel').style.display = 'none';
            document.getElementById('accountingTransitionPanel').style.display = 'block';
        });

        // 收藏室入口
        document.getElementById('accountingCollectionEntranceBtn')?.addEventListener('click', () => {
            accountingOpenCollectionPanel();
        });

        // 添加记账
        document.getElementById('accountingAddTransactionBtn')?.addEventListener('click', accountingAddTransaction);
        document.getElementById('accountingAmountInput')?.addEventListener('keypress', e => { 
            if (e.key === 'Enter') accountingAddTransaction(); 
        });

        // 收支类型
        document.querySelectorAll('.accounting-type-btn').forEach(btn => {
            btn.addEventListener('click', () => accountingSetActiveType(btn.dataset.type));
        });

        // 添加待办
        document.getElementById('accountingAddTodoBtn')?.addEventListener('click', accountingAddTodo);
        document.getElementById('accountingNewTodoInput')?.addEventListener('keypress', e => { 
            if (e.key === 'Enter') accountingAddTodo(); 
        });

        // 收藏室选项卡
        document.querySelectorAll('.accounting-collection-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => accountingSwitchCollectionTab(btn.dataset.collectionTab));
        });

        // API 密钥库新建
        document.getElementById('accountingShowApiFormBtn')?.addEventListener('click', () => {
            document.getElementById('accountingApiCreateCard').style.display = 'block';
        });
        document.getElementById('accountingCancelApiBtn')?.addEventListener('click', () => {
            document.getElementById('accountingApiCreateCard').style.display = 'none';
        });
        document.getElementById('accountingSaveApiBtn')?.addEventListener('click', () => {
            const name = document.getElementById('accountingApiNameInput').value.trim();
            if (!name) { alert('请填写名称'); return; }
            accountingApiItems.push({
                id: accountingGenId(),
                name,
                url: document.getElementById('accountingApiUrlInput').value.trim(),
                apikey: document.getElementById('accountingApiKeyInput').value.trim(),
                expanded: false
            });
            accountingSaveApiStorage();
            accountingRenderApiList();
            document.getElementById('accountingApiCreateCard').style.display = 'none';
            document.getElementById('accountingApiNameInput').value = '';
            document.getElementById('accountingApiUrlInput').value = '';
            document.getElementById('accountingApiKeyInput').value = '';
        });

        // 网页收藏器新建
        document.getElementById('accountingShowWebFormBtn')?.addEventListener('click', () => {
            document.getElementById('accountingWebCreateCard').style.display = 'block';
        });
        document.getElementById('accountingCancelWebBtn')?.addEventListener('click', () => {
            document.getElementById('accountingWebCreateCard').style.display = 'none';
        });
        document.getElementById('accountingSaveWebBtn')?.addEventListener('click', () => {
            const name = document.getElementById('accountingWebNameInput').value.trim();
            if (!name) { alert('请填写名称'); return; }
            accountingWebItems.push({
                id: accountingGenId(),
                name,
                url: document.getElementById('accountingWebUrlInput').value.trim(),
                note: document.getElementById('accountingWebNoteInput').value.trim(),
                expanded: false
            });
            accountingSaveWebStorage();
            accountingRenderWebList();
            document.getElementById('accountingWebCreateCard').style.display = 'none';
            document.getElementById('accountingWebNameInput').value = '';
            document.getElementById('accountingWebUrlInput').value = '';
            document.getElementById('accountingWebNoteInput').value = '';
        });
    }

    console.log('📊 记账与行经预测模块脚本就绪，等待 initAccountingModule() 被触发调用');
})();