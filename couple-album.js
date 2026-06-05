(function() {
    "use strict";

    const coupleAlbumModule = {
        async init() {
            console.log('🖼️ Couple Album Module Initialized');
            this.bindEvents();
            this.bindSaveIntercept(); // 绑定安全的捕获期拦截
        },

        bindEvents() {
            // “我的” 页面中的相册入口
            document.getElementById('coupleAlbumEntryBtn')?.addEventListener('click', () => {
                if (typeof switchPage === 'function') {
                    switchPage('couple-album');
                }
                this.refreshAlbumGrid();
            });

            // 从相册页返回“我的”
            document.getElementById('backFromCoupleAlbumBtn')?.addEventListener('click', () => {
                if (typeof switchPage === 'function') {
                    switchPage('profile');
                }
            });

            // 触发添加情头弹窗
            document.getElementById('addCoupleAlbumBtn')?.addEventListener('click', () => {
                this.openUploadModal();
            });

            document.getElementById('coupleUploadCancelBtn')?.addEventListener('click', () => {
                this.closeUploadModal();
            });

            document.getElementById('coupleUploadSaveBtn')?.addEventListener('click', () => {
                this.saveCoupleAvatarPair();
            });

            document.getElementById('coupleUploadBtnA')?.addEventListener('click', () => {
                document.getElementById('coupleFileA').click();
            });
            document.getElementById('coupleUploadBtnB')?.addEventListener('click', () => {
                document.getElementById('coupleFileB').click();
            });

            document.getElementById('coupleFileA')?.addEventListener('change', (e) => {
                this.handleFileSelect(e, 'A');
            });
            document.getElementById('coupleFileB')?.addEventListener('change', (e) => {
                this.handleFileSelect(e, 'B');
            });

            // 对话详情中点击 “选择情侣头像”
            document.getElementById('convDetailUserCoupleBtn')?.addEventListener('click', () => {
                this.openSelectModal();
            });

            document.getElementById('coupleAvatarSelectCancelBtn')?.addEventListener('click', () => {
                this.closeSelectModal();
            });
        },

        // 在捕获阶段安全地拦截保存按钮的点击事件
        bindSaveIntercept() {
            const saveBtn = document.getElementById('saveConvDetailBtn');
            if (saveBtn) {
                // 第三个参数设置为 true，启用捕获期监听（将在主程序保存方法触发前率先执行并写入DB）
                saveBtn.addEventListener('click', async (e) => {
                    const convId = window.currentEditingConvId;
                    if (convId && window._tempChosenCoupleAvatar) {
                        try {
                            const cd = await DB.get('convDetails', convId) || {};
                            const t = window._tempChosenCoupleAvatar;
                            
                            cd.userCoupleAvatarCode = t.userCode;
                            cd.partnerCoupleAvatarCode = t.partnerCode;
                            cd.coupleAvatarSetId = t.setId;
                            // 标记为下一次 API 调用时触发 AI 反应
                            cd.coupleAvatarChangedPendingReaction = true; 
                            
                            await DB.put('convDetails', cd);
                            window._tempChosenCoupleAvatar = null; // 写入完成，清除暂存
                        } catch (err) {
                            console.error('Failed to intercept and write couple avatar data:', err);
                        }
                    }
                }, true); 
            }
        },

        async handleFileSelect(event, slot) {
            const file = event.target.files[0];
            if (!file) return;

            if (typeof compressImage === 'function') {
                try {
                    const base64 = await compressImage(file, 200, 200, 0.85);
                    document.getElementById(`coupleData${slot}`).value = base64;
                    const preview = document.getElementById(`couplePreview${slot}`);
                    if (preview) {
                        preview.innerHTML = '';
                        preview.style.backgroundImage = `url('${base64}')`;
                        preview.style.backgroundSize = 'cover';
                        preview.style.backgroundPosition = 'center';
                    }
                } catch (e) {
                    console.error('Image compression failed', e);
                }
            } else {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64 = e.target.result;
                    document.getElementById(`coupleData${slot}`).value = base64;
                    const preview = document.getElementById(`couplePreview${slot}`);
                    if (preview) {
                        preview.innerHTML = '';
                        preview.style.backgroundImage = `url('${base64}')`;
                        preview.style.backgroundSize = 'cover';
                        preview.style.backgroundPosition = 'center';
                    }
                };
                reader.readAsDataURL(file);
            }
        },

        openUploadModal() {
            document.getElementById('coupleAlbumCodeName').value = '';
            document.getElementById('coupleDataA').value = '';
            document.getElementById('coupleDataB').value = '';
            document.getElementById('coupleFileA').value = '';
            document.getElementById('coupleFileB').value = '';

            const placeholder = `<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#ccc" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>`;
            const pA = document.getElementById('couplePreviewA');
            const pB = document.getElementById('couplePreviewB');
            if (pA) { pA.style.backgroundImage = ''; pA.innerHTML = placeholder; }
            if (pB) { pB.style.backgroundImage = ''; pB.innerHTML = placeholder; }

            document.getElementById('coupleAlbumUploadModal')?.classList.add('active');
        },

        closeUploadModal() {
            document.getElementById('coupleAlbumUploadModal')?.classList.remove('active');
        },

        async saveCoupleAvatarPair() {
            const codeName = document.getElementById('coupleAlbumCodeName').value.trim();
            const dataA = document.getElementById('coupleDataA').value;
            const dataB = document.getElementById('coupleDataB').value;

            if (!codeName) {
                alert('请输入配对编码名称');
                return;
            }
            if (!dataA || !dataB) {
                alert('请分别为男方(A)和女方(B)选择并上传头像');
                return;
            }

            const albums = await DB.getSetting('couple_albums', []);
            const exists = albums.some(a => a.code === codeName);
            if (exists) {
                alert('该配对编码已存在，请更换名称');
                return;
            }

            const newPair = {
                id: 'pair_' + Date.now(),
                code: codeName,
                avatarA: dataA,
                avatarB: dataB,
                createdAt: Date.now()
            };

            albums.push(newPair);
            await DB.setSetting('couple_albums', albums);

            this.closeUploadModal();
            this.refreshAlbumGrid();
            if (typeof showStatus === 'function') {
                showStatus('成功添加情侣头像配对', 'success');
            }
        },

        async refreshAlbumGrid() {
            const container = document.getElementById('coupleAlbumGrid');
            if (!container) return;

            const albums = await DB.getSetting('couple_albums', []);

            if (albums.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; color: #8ba3c7; padding: 48px 16px; width: 100%; grid-column: 1/-1;">
                        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:12px; opacity:0.5;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        <p style="font-size: 14px;">相册里还没有上传情侣头像</p>
                        <p style="font-size: 12px; margin-top: 4px;">点击右上角按钮添加配对头像</p>
                    </div>
                `;
                return;
            }

            let html = '';
            albums.forEach(album => {
                html += `
                    <div class="album-item" data-id="${album.id}">
                        <div class="album-item-images">
                            <div class="album-img" style="background-image: url('${album.avatarA}')"></div>
                            <div class="album-img" style="background-image: url('${album.avatarB}')"></div>
                        </div>
                        <div class="album-item-meta">
                            <div class="album-code">A: ${escapeHtml(album.code)}-A</div>
                            <div class="album-code">B: ${escapeHtml(album.code)}-B</div>
                        </div>
                        <button class="album-item-delete clickable" data-id="${album.id}">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                    </div>
                `;
            });

            container.innerHTML = html;

            container.querySelectorAll('.album-item-delete').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.deleteCoupleAvatarPair(btn.dataset.id);
                });
            });
        },

        async deleteCoupleAvatarPair(id) {
            if (!confirm('确定删除这一对情侣头像吗？')) return;

            let albums = await DB.getSetting('couple_albums', []);
            albums = albums.filter(a => a.id !== id);
            await DB.setSetting('couple_albums', albums);

            this.refreshAlbumGrid();
            if (typeof showStatus === 'function') {
                showStatus('配对头像已删除', 'success');
            }
        },

        async openSelectModal() {
            const container = document.getElementById('coupleAvatarSelectContainer');
            if (!container) return;

            const albums = await DB.getSetting('couple_albums', []);

            if (albums.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; color: #8ba3c7; padding: 32px 16px;">
                        <p style="font-size:14px;">相册为空，请先在 “我的 -> 相册” 中添加并保存情头配对</p>
                    </div>
                `;
                document.getElementById('coupleAvatarSelectModal')?.classList.add('active');
                return;
            }

            let html = '';
            albums.forEach(album => {
                html += `
                    <div class="couple-select-row">
                        <div class="couple-select-box">
                            <div class="couple-select-avatar clickable" style="background-image: url('${album.avatarA}')" data-set-id="${album.id}" data-suffix="A" data-code="${album.code}-A"></div>
                            <span class="couple-select-code">${escapeHtml(album.code)}-A</span>
                        </div>
                        <div class="couple-select-box">
                            <div class="couple-select-avatar clickable" style="background-image: url('${album.avatarB}')" data-set-id="${album.id}" data-suffix="B" data-code="${album.code}-B"></div>
                            <span class="couple-select-code">${escapeHtml(album.code)}-B</span>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;

            container.querySelectorAll('.couple-select-avatar').forEach(item => {
                item.addEventListener('click', async () => {
                    const setId = item.dataset.setId;
                    const suffix = item.dataset.suffix;
                    const chosenCode = item.dataset.code;
                    
                    const album = albums.find(a => a.id === setId);
                    if (!album) return;

                    const chosenImg = suffix === 'A' ? album.avatarA : album.avatarB;
                    const oppositeCode = suffix === 'A' ? `${album.code}-B` : `${album.code}-A`;

                    // 更新预览
                    const preview = document.getElementById('convDetailUserAvatar');
                    const hiddenInput = document.getElementById('convDetailUserAvatarData');
                    if (preview && hiddenInput) {
                        hiddenInput.value = chosenImg;
                        preview.style.backgroundImage = `url('${chosenImg}')`;
                        preview.style.backgroundColor = 'transparent';
                        preview.textContent = '';
                    }

                    // 暂存状态，等保存详情时一并提交
                    window._tempChosenCoupleAvatar = {
                        setId: setId,
                        userCode: chosenCode,
                        partnerCode: oppositeCode,
                        userImg: chosenImg
                    };

                    this.closeSelectModal();
                });
            });

            document.getElementById('coupleAvatarSelectModal')?.classList.add('active');
        },

        closeSelectModal() {
            document.getElementById('coupleAvatarSelectModal')?.classList.remove('active');
        },

        // 被主 JS 引擎拦截调用的接口，自动处理来自 AI 的更换配套情头指令
        async handleAiAvatarChangeCommand(convId, text) {
            if (!text) return { text, changed: false };

            const match = text.match(/\[CHANGE_AVATAR:([^\]]+)\]/);
            if (!match) return { text, changed: false };

            const partnerCode = match[1].trim(); // 比如 “星河-B”
            const cleanedText = text.replace(/\[CHANGE_AVATAR:[^\]]+\]/g, '').trim();

            const albums = await DB.getSetting('couple_albums', []);
            const lastDashIndex = partnerCode.lastIndexOf('-');
            if (lastDashIndex === -1) return { text: cleanedText, changed: false };

            const setCode = partnerCode.substring(0, lastDashIndex);
            const suffix = partnerCode.substring(lastDashIndex + 1);

            const album = albums.find(a => a.code === setCode);
            if (album) {
                const img = suffix === 'A' ? album.avatarA : album.avatarB;
                if (img) {
                    const cd = await DB.get('convDetails', convId) || {};
                    cd.charAvatar = img;
                    cd.charCoupleAvatarCode = partnerCode;
                    await DB.put('convDetails', cd);

                    // 如果此时用户正打开这个对话的对话详情，进行同步预览更新
                    if (window.currentEditingConvId === convId) {
                        const preview = document.getElementById('convDetailCharAvatar');
                        const dataInput = document.getElementById('convDetailCharAvatarData');
                        if (preview && dataInput) {
                            dataInput.value = img;
                            preview.style.backgroundImage = `url('${img}')`;
                            preview.style.backgroundColor = 'transparent';
                            preview.textContent = '';
                        }
                    }
                    return { text: cleanedText, changed: true };
                }
            }

            return { text: cleanedText, changed: false };
        }
    };

    window.coupleAlbumModule = coupleAlbumModule;

    window.addEventListener('load', () => {
        coupleAlbumModule.init();
    });
})();