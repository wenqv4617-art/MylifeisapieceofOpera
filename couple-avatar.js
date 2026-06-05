/**
 * couple-avatar.js - 情侣头像系统 v3 (高兼容性修复版)
 * 存储优化：采用 themeSettings 统一保存 key='couple_avatars'，完美免除 IndexedDB 升级 schema 失败的问题。
 */
(function() {
    'use strict';

    // ==================== 模块导出 ====================
    window.coupleAvatarModule = {
        init: init,
        showAlbum: showAlbum,
        hideAlbum: hideAlbum,
        getCouplePairs: getCouplePairs,
        getCoupleAvatarByCode: getCoupleAvatarByCode,
        clearCoupleAvatar: clearCoupleAvatar,
        pickCoupleAvatar: pickCoupleAvatar,
        _hidePicker: hidePicker
    };

    // ==================== 内部状态 ====================
    var DB = null;
    var showStatus = null;
    var convIdToSelect = null;
    var initialized = false;

    // ==================== SVG常量 ====================
    var SVGS = {
        heart: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
        trash: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',
        check: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
        image: '<svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
        person: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>'
    };

    // ==================== 初始化 ====================
    function init(deps) {
        DB = deps.DB || window.DB;
        showStatus = deps.showStatus || function(msg) { console.log('[couple-avatar]', msg); };

        bindEvents();
        initialized = true;
        console.log('[couple-avatar] v3 初始化完成');
    }

    // ==================== 极简、高保真 Canvas 图像压缩 ====================
    function compressImageSelf(file, callback) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var img = new Image();
            img.onload = function() {
                var canvas = document.createElement('canvas');
                var max_width = 160;
                var max_height = 160;
                var width = img.width;
                var height = img.height;
                if (width > height) {
                    if (width > max_width) {
                        height = Math.round(height * max_width / width);
                        width = max_width;
                    }
                } else {
                    if (height > max_height) {
                        width = Math.round(width * max_height / height);
                        height = max_height;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                var dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                callback(dataUrl);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // ==================== 事件绑定 ====================
    function bindEvents() {
        var closeAlbumBtn = document.getElementById('closeCoupleAlbumBtn');
        if (closeAlbumBtn) { closeAlbumBtn.addEventListener('click', hideAlbum); }

        var uploadBtn = document.getElementById('coupleAlbumUploadBtn');
        if (uploadBtn) { uploadBtn.addEventListener('click', showUploadModal); }

        var closeUploadBtn = document.getElementById('closeCoupleUploadBtn');
        if (closeUploadBtn) { closeUploadBtn.addEventListener('click', hideUploadModal); }
        var cancelUploadBtn = document.getElementById('cancelCoupleUploadBtn');
        if (cancelUploadBtn) { cancelUploadBtn.addEventListener('click', hideUploadModal); }

        var uploadBtnA = document.getElementById('coupleUploadBtnA');
        if (uploadBtnA) {
            uploadBtnA.addEventListener('click', function() {
                document.getElementById('coupleUploadFileA').click();
            });
        }
        var uploadBtnB = document.getElementById('coupleUploadBtnB');
        if (uploadBtnB) {
            uploadBtnB.addEventListener('click', function() {
                document.getElementById('coupleUploadFileB').click();
            });
        }

        var fileA = document.getElementById('coupleUploadFileA');
        if (fileA) {
            fileA.addEventListener('change', function(e) {
                var file = e.target.files && e.target.files[0];
                if (!file) return;
                compressImageSelf(file, function(dataUrl) {
                    document.getElementById('coupleUploadPreviewA').innerHTML = '<img src="' + dataUrl + '" class="couple-upload-preview-img">';
                    document.getElementById('coupleUploadDataA').value = dataUrl;
                });
            });
        }
        var fileB = document.getElementById('coupleUploadFileB');
        if (fileB) {
            fileB.addEventListener('change', function(e) {
                var file = e.target.files && e.target.files[0];
                if (!file) return;
                compressImageSelf(file, function(dataUrl) {
                    document.getElementById('coupleUploadPreviewB').innerHTML = '<img src="' + dataUrl + '" class="couple-upload-preview-img">';
                    document.getElementById('coupleUploadDataB').value = dataUrl;
                });
            });
        }

        var confirmBtn = document.getElementById('confirmCoupleUploadBtn');
        if (confirmBtn) { confirmBtn.addEventListener('click', confirmUpload); }

        var closePickerBtn = document.getElementById('closeCouplePickerBtn');
        if (closePickerBtn) { closePickerBtn.addEventListener('click', hidePicker); }

        // 使用标准 for 循环，安全绑定弹窗背景点击关闭事件，不使用 NodeList.forEach
        var panelIds = ['coupleAlbumPanel', 'coupleUploadModal', 'couplePickerPanel'];
        for (var i = 0; i < panelIds.length; i++) {
            (function(id) {
                var el = document.getElementById(id);
                if (el) {
                    el.addEventListener('click', function(e) {
                        if (e.target === this) { this.style.display = 'none'; }
                    });
                }
            })(panelIds[i]);
        }
    }

    // ==================== 数据层 ====================
    function getCouplePairs() {
        if (!DB) return Promise.resolve([]);
        return DB.get('themeSettings', 'couple_avatars').then(function(res) {
            return (res && res.value) ? res.value : [];
        }).catch(function() {
            return [];
        });
    }

    function saveCouplePair(code, name, dataA, dataB) {
        if (!DB) return Promise.reject(new Error('DB未初始化'));
        return getCouplePairs().then(function(pairs) {
            var filtered = pairs.filter(function(p) { return p.code !== code; });
            filtered.push({
                code: code,
                name: name,
                dataA: dataA,
                dataB: dataB,
                updatedAt: Date.now()
            });
            return DB.put('themeSettings', { key: 'couple_avatars', value: filtered });
        });
    }

    function deleteCouplePair(code) {
        if (!DB) return Promise.reject(new Error('DB未初始化'));
        return getCouplePairs().then(function(pairs) {
            var filtered = pairs.filter(function(p) { return p.code !== code; });
            return DB.put('themeSettings', { key: 'couple_avatars', value: filtered });
        });
    }

    // 采用高兼容性 for 循环遍历，替换可能由于不支持 ES6 Array.prototype.find 导致崩溃的语法
    function getCoupleAvatarByCode(code, side) {
        return getCouplePairs().then(function(pairs) {
            var found = null;
            for (var i = 0; i < pairs.length; i++) {
                if (pairs[i].code === code) {
                    found = pairs[i];
                    break;
                }
            }
            if (!found) return null;
            return {
                code: code,
                name: found.name,
                data: (side === 'A' ? found.dataA : found.dataB)
            };
        });
    }

    function clearCoupleAvatar(convId) {
        if (!convId) return;
        try { localStorage.removeItem('couple_avatar_selected_' + convId); } catch(e) {}
    }

    // ==================== UI面板逻辑 ====================
    function showAlbum() {
        var panel = document.getElementById('coupleAlbumPanel');
        if (panel) { panel.style.display = 'flex'; renderAlbum(); }
        else { alert('相册面板未找到'); }
    }

    function hideAlbum() {
        var panel = document.getElementById('coupleAlbumPanel');
        if (panel) panel.style.display = 'none';
    }

    function renderAlbum() {
        var grid = document.getElementById('coupleAlbumGrid');
        if (!grid) return;
        grid.innerHTML = '<div class="couple-loading" style="text-align:center;padding:40px;color:#999;">加载中...</div>';

        getCouplePairs().then(function(pairs) {
            if (!pairs || pairs.length === 0) {
                grid.innerHTML = '<div class="couple-empty-state" style="text-align:center;padding:32px 0;">' +
                    SVGS.image +
                    '<p style="margin:12px 0 4px;font-weight:500;color:#333;">还没有情侣头像</p>' +
                    '<p style="margin:0;font-size:13px;color:#999;">点击下方按钮上传第一对</p></div>';
                return;
            }
            var html = '';
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i];
                var imgA = pair.dataA ? '<img src="' + escapeAttr(pair.dataA) + '" class="couple-card-img">' : '<div class="couple-card-placeholder">' + SVGS.person + '</div>';
                var imgB = pair.dataB ? '<img src="' + escapeAttr(pair.dataB) + '" class="couple-card-img">' : '<div class="couple-card-placeholder">' + SVGS.person + '</div>';
                html += '<div class="couple-card">' +
                    '<div class="couple-card-top">' +
                        '<div class="couple-card-name">' + escapeHtml(pair.name) + '</div>' +
                        '<button class="couple-card-del" data-code="' + escapeAttr(pair.code) + '" title="删除">' + SVGS.trash + '</button>' +
                    '</div>' +
                    '<div class="couple-card-images">' +
                        '<div class="couple-card-side">' +
                            '<div class="couple-card-side-label">A侧 (User)</div>' +
                            '<div class="couple-card-img-wrap">' + imgA + '</div>' +
                        '</div>' +
                        '<div class="couple-card-heart-wrap">' + SVGS.heart + '</div>' +
                        '<div class="couple-card-side">' +
                            '<div class="couple-card-side-label">B侧 (Char)</div>' +
                            '<div class="couple-card-img-wrap">' + imgB + '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="couple-card-code">#' + escapeHtml(pair.code) + '</div>' +
                '</div>';
            }
            grid.innerHTML = html;

            // 深度安全绑定：针对不支持 NodeList.forEach 遍历的 WebView，改用兼容型 for 循环和闭包
            var delBtns = grid.querySelectorAll('.couple-card-del');
            for (var j = 0; j < delBtns.length; j++) {
                (function(btn) {
                    btn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        var code = btn.getAttribute('data-code');
                        if (confirm('确定删除此配对情头吗？')) {
                            deleteCouplePair(code).then(function() {
                                renderAlbum();
                            }).catch(function(err) {
                                alert('删除失败');
                            });
                        }
                    });
                })(delBtns[j]);
            }
        }).catch(function(err) {
            console.error('[couple-avatar] renderAlbum error:', err);
            grid.innerHTML = '<div class="couple-empty-state">加载失败</div>';
        });
    }

    function showUploadModal() {
        var modal = document.getElementById('coupleUploadModal');
        if (!modal) return;
        document.getElementById('coupleUploadName').value = '';
        document.getElementById('coupleUploadCode').value = '';
        document.getElementById('coupleUploadPreviewA').innerHTML = '<span style="color:#bbb;font-size:13px;">点击选择</span>';
        document.getElementById('coupleUploadPreviewB').innerHTML = '<span style="color:#bbb;font-size:13px;">点击选择</span>';
        document.getElementById('coupleUploadDataA').value = '';
        document.getElementById('coupleUploadDataB').value = '';
        modal.style.display = 'flex';
    }

    function hideUploadModal() {
        var modal = document.getElementById('coupleUploadModal');
        if (modal) modal.style.display = 'none';
    }

    function confirmUpload() {
        var name = document.getElementById('coupleUploadName').value.trim();
        var code = document.getElementById('coupleUploadCode').value.trim();
        var dataA = document.getElementById('coupleUploadDataA').value;
        var dataB = document.getElementById('coupleUploadDataB').value;

        if (!name) { alert('⚠️ 请输入情头名称'); return; }
        if (!dataA || !dataB) { alert('⚠️ 请分别选择并上传 A侧 和 B侧 两个头像图片'); return; }
        if (!code) { code = 'CP' + Date.now().toString(36).toUpperCase(); }

        var confirmBtn = document.getElementById('confirmCoupleUploadBtn');
        if (confirmBtn) { confirmBtn.disabled = true; confirmBtn.textContent = '上传中...'; }

        saveCouplePair(code, name, dataA, dataB).then(function() {
            if (confirmBtn) { confirmBtn.disabled = false; confirmBtn.textContent = '确认上传'; }
            hideUploadModal();
            renderAlbum();
        }).catch(function(err) {
            alert('❌ 保存失败，请重试');
            if (confirmBtn) { confirmBtn.disabled = false; confirmBtn.textContent = '确认上传'; }
        });
    }

    // ==================== 头像更换选择器 ====================
    function pickCoupleAvatar(convId) {
        convIdToSelect = convId;
        var picker = document.getElementById('couplePickerPanel');
        if (!picker) return;
        renderPicker();
        picker.style.display = 'flex';
    }

    function hidePicker() {
        var picker = document.getElementById('couplePickerPanel');
        if (picker) picker.style.display = 'none';
        convIdToSelect = null;
    }

    function renderPicker() {
        var grid = document.getElementById('couplePickerGrid');
        if (!grid) return;
        grid.innerHTML = '<div class="couple-loading" style="text-align:center;padding:40px;color:#999;">加载中...</div>';

        getCouplePairs().then(function(pairs) {
            if (!pairs || pairs.length === 0) {
                grid.innerHTML = '<div class="couple-picker-empty" style="text-align:center;padding:40px 0;">' +
                    SVGS.image +
                    '<p style="margin:12px 0 4px;font-weight:500;color:#333;">还没有情侣头像</p>' +
                    '<p style="margin:0;font-size:13px;color:#999;">请先在「我的→相册」中上传</p></div>';
                return;
            }
            var html = '';
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i];
                var imgA = pair.dataA ? '<img src="' + escapeAttr(pair.dataA) + '" class="couple-card-img">' : '<div class="couple-card-placeholder">' + SVGS.person + '</div>';
                var imgB = pair.dataB ? '<img src="' + escapeAttr(pair.dataB) + '" class="couple-card-img">' : '<div class="couple-card-placeholder">' + SVGS.person + '</div>';
                html += '<div class="couple-picker-item">' +
                    '<div class="couple-card-top"><div class="couple-card-name">' + escapeHtml(pair.name) + '</div></div>' +
                    '<div class="couple-card-images">' +
                        '<div class="couple-card-side">' +
                            '<div class="couple-card-side-label">A侧 (User)</div>' +
                            '<div class="couple-card-img-wrap">' + imgA + '</div>' +
                        '</div>' +
                        '<div class="couple-card-heart-wrap">' + SVGS.heart + '</div>' +
                        '<div class="couple-card-side">' +
                            '<div class="couple-card-side-label">B侧 (Char)</div>' +
                            '<div class="couple-card-img-wrap">' + imgB + '</div>' +
                        '</div>' +
                    '</div>' +
                    '<button class="couple-pick-btn" data-code="' + escapeAttr(pair.code) + '">' + SVGS.check + ' 选择此情侣配对</button>' +
                '</div>';
            }
            grid.innerHTML = html;

            // 同样使用闭包和 for 循环为选择按钮注入 click 事件监听，摒弃 ES6 NodeList.forEach 隐患
            var pickBtns = grid.querySelectorAll('.couple-pick-btn');
            for (var k = 0; k < pickBtns.length; k++) {
                (function(btn) {
                    btn.addEventListener('click', function() {
                        var code = btn.getAttribute('data-code');
                        selectPair(code);
                    });
                })(pickBtns[k]);
            }
        }).catch(function(err) {
            console.error('[couple-avatar] renderPicker error:', err);
            grid.innerHTML = '<div class="couple-empty-state">加载失败</div>';
        });
    }

    function selectPair(code) {
        var convId = convIdToSelect;
        if (!convId) return;

        getCoupleAvatarByCode(code, 'A').then(function(avatarA) {
            var dataA = avatarA ? avatarA.data : null;
            if (!dataA) {
                alert('获取情侣头像数据失败');
                return;
            }

            // 1. 同步更新详情页 DOM 预览与隐藏 Input (作为临时表单数据暂存)
            var previewEl = document.getElementById('convDetailUserAvatar');
            var dataInput = document.getElementById('convDetailUserAvatarData');
            if (previewEl) {
                previewEl.style.background = '';
                previewEl.innerHTML = '';
                previewEl.style.backgroundImage = "url('" + dataA.replace(/'/g, "\\'") + "')";
                previewEl.style.backgroundSize = 'cover';
                previewEl.style.backgroundPosition = 'center';
                previewEl.style.borderRadius = '8px';
                previewEl.style.backgroundColor = 'transparent';
                previewEl.textContent = '';
            }
            if (dataInput) {
                dataInput.value = dataA;
            }

            // 2. 存入当前对话上下文标志，以便持久化记录
            try {
                localStorage.setItem('couple_avatar_selected_' + convId, JSON.stringify({
                    code: code,
                    side: 'A',
                    name: avatarA.name,
                    timestamp: Date.now()
                }));
            } catch(e) {}

            // 3. 挂载全局临时变量，用于【下一次】请求 API 时触发反应提示词
            window.coupleAvatarJustChanged = window.coupleAvatarJustChanged || {};
            window.coupleAvatarJustChanged[convId] = {
                code: code,
                name: avatarA.name
            };

            // 4. 关闭选择卡片，留在详情页让用户完成保存
            hidePicker();

        }).catch(function(err) {
            alert('选择情头失败: ' + (err.message || '未知错误'));
        });
    }

    // ==================== 工具函数 ====================
    function escapeHtml(str) {
        if (!str && str !== '') return '';
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function escapeAttr(str) {
        if (!str) return '';
        return str.replace(/&/g, '&').replace(/'/g, '&#39;').replace(/"/g, '"').replace(/</g, '<').replace(/>/g, '>');
    }

    console.log('[couple-avatar] 模块加载成功 v3');
})();