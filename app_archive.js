let archiveCurrentTab = 'character';
let temporaryAvatarBase64 = "";

function initArchiveApp() {
  loadArchivesData();
  
  const tabs = document.querySelectorAll("#win-archive .archive-tabs .tab-item");
  tabs.forEach(tab => {
    tab.onclick = () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      archiveCurrentTab = tab.getAttribute("data-tab");
      document.getElementById("archive-title").innerText = `档案库 - ${getTabZhName(archiveCurrentTab)}`;
      loadArchivesData();
    };
  });

  initPasteAndDropEvents();
}

function getTabZhName(t) {
  const map = { character: '角色', user: '用户', npc: 'NPC', relation: '关系网' };
  return map[t] || '';
}

// 支持任意分组折叠的卡片渲染
async function loadArchivesData() {
  const container = document.getElementById("archive-list-container");
  container.innerHTML = "";

  if (archiveCurrentTab === 'relation') {
    // 关系网展示 (非折叠模式)
    const rels = await db.relations.toArray();
    rels.forEach(r => {
      const card = document.createElement("div");
      card.className = "archive-card";
      card.innerHTML = `<div class="card-info"><div class="card-name">关系：ID(${r.fromId}) → [${r.relation}] → ID(${r.toId})</div></div>`;
      container.appendChild(card);
    });
    return;
  }

  const items = await db.archives.where('type').equals(archiveCurrentTab).toArray();
  // 按照 group 进行聚合
  const groups = {};
  items.forEach(item => {
    const grp = item.group || "默认未分组";
    if (!groups[grp]) groups[grp] = [];
    groups[grp].push(item);
  });

  for (let key in groups) {
    const wrapper = document.createElement("div");
    wrapper.className = "archive-group-wrapper";
    
    const isCollapsed = localStorage.getItem(`collapse_${archiveCurrentTab}_${key}`) === 'true';

    wrapper.innerHTML = `
      <div class="archive-group-header" data-group="${key}">
        <span>${key} (${groups[key].length})</span>
        <svg viewBox="0 0 24 24" width="16" height="16" style="transform: ${isCollapsed ? 'rotate(-90deg)' : 'none'};"><path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>
      </div>
      <div class="archive-group-content ${isCollapsed ? 'collapsed' : ''}"></div>
    `;

    const contentArea = wrapper.querySelector(".archive-group-content");
    groups[key].forEach(item => {
      const card = document.createElement("div");
      card.className = "archive-card";
      card.innerHTML = `
        <img class="card-avatar" src="${item.avatar || 'data:image/svg+xml;utf8,<svg viewBox=%220 0 100 100%22 xmlns=%22http://www.w3.org/2000/svg%22><circle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23e3f2fd%22/></svg>'}" />
        <div class="card-info">
          <div class="card-name">${item.name}</div>
          <div class="card-desc">${item.remark || '暂无备注'}</div>
        </div>
        <div class="card-actions">
          <button class="btn-icon" onclick="editArchiveItem(${item.id})">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/></svg>
          </button>
        </div>
      `;
      contentArea.appendChild(card);
    });

    // 绑定展开折叠点击事件
    wrapper.querySelector(".archive-group-header").addEventListener("click", (e) => {
      const collapsed = contentArea.classList.toggle("collapsed");
      localStorage.setItem(`collapse_${archiveCurrentTab}_${key}`, collapsed);
      const icon = e.currentTarget.querySelector("svg");
      icon.style.transform = collapsed ? "rotate(-90deg)" : "none";
    });

    container.appendChild(wrapper);
  }
}

// 拖拽及粘帖截图高级导入支持
function initPasteAndDropEvents() {
  const dropzone = document.getElementById("avatar-dropzone");
  const fileInput = document.getElementById("archive-avatar-file");

  dropzone.onclick = () => fileInput.click();

  fileInput.onchange = (e) => {
    if (e.target.files.length > 0) handleAvatarFile(e.target.files[0]);
  };

  // 支持屏幕拖拽
  dropzone.ondragover = (e) => e.preventDefault();
  dropzone.ondrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) handleAvatarFile(e.dataTransfer.files[0]);
  };

  // 微信/键盘截图粘帖识别
  document.addEventListener("paste", (e) => {
    const activeOverlay = document.getElementById("archive-form-overlay");
    if (!activeOverlay.classList.contains("active")) return;
    
    const items = e.clipboardData.items;
    for (let item of items) {
      if (item.type.indexOf("image") !== -1) {
        handleAvatarFile(item.getAsFile());
      }
    }
  });
}

function handleAvatarFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    temporaryAvatarBase64 = e.target.result;
    document.getElementById("placeholder-avatar").style.display = "none";
    const previewImg = document.getElementById("avatar-preview-img");
    previewImg.src = temporaryAvatarBase64;
    previewImg.style.display = "block";
  };
  reader.readAsDataURL(file);
}

// 编辑载入
window.editArchiveItem = async function(id) {
  const item = await db.archives.get(id);
  if (!item) return;
  document.getElementById("archive-id").value = item.id;
  document.getElementById("archive-name").value = item.name;
  document.getElementById("archive-remark").value = item.remark;
  document.getElementById("archive-group").value = item.group;
  document.getElementById("archive-persona").value = item.persona;
  
  if (item.avatar) {
    temporaryAvatarBase64 = item.avatar;
    document.getElementById("placeholder-avatar").style.display = "none";
    const previewImg = document.getElementById("avatar-preview-img");
    previewImg.src = item.avatar;
    previewImg.style.display = "block";
  }

  document.getElementById("archive-form-overlay").classList.add("active");
};