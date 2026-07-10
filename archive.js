let currentTab = 'character'; // 默认在“角色”tab

function initArchiveApp() {
  loadArchives();
  
  // 切换底层 Tab 栏
  const tabs = document.querySelectorAll(".archive-tabs .tab-item");
  tabs.forEach(tab => {
    tab.onclick = () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentTab = tab.getAttribute("data-tab");
      document.getElementById("archive-title").innerText = `档案库 - ${getTabName(currentTab)}`;
      loadArchives();
    };
  });
}

function getTabName(tab) {
  switch(tab) {
    case 'character': return '角色';
    case 'user': return '用户';
    case 'npc': return 'NPC';
    case 'relation': return '关系网';
  }
}

// 渲染当前 Tab 数据
async function loadArchives() {
  const listContainer = document.getElementById("archive-list-container");
  listContainer.innerHTML = "";

  if (currentTab === 'relation') {
    // 渲染关系网
    const relations = await db.relations.toArray();
    if (relations.length === 0) {
      listContainer.innerHTML = `<p style="text-align:center;color:var(--text-secondary);font-size:14px;padding:30px 0;">当前暂无关系绑定</p>`;
      return;
    }
    for (let r of relations) {
      const fromChar = await db.archives.get(r.fromId);
      const toChar = await db.archives.get(r.toId);
      if (!fromChar || !toChar) continue;

      const card = document.createElement("div");
      card.className = "archive-card";
      card.innerHTML = `
        <div class="card-info">
          <div class="card-name">${fromChar.name} → <span style="color:var(--primary);">${r.relation}</span> → ${toChar.name}</div>
        </div>
        <div class="card-actions">
          <button class="btn-icon" onclick="deleteRelation(${r.id})">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      `;
      listContainer.appendChild(card);
    }
  } else {
    // 渲染通用角色/用户/NPC卡片
    const items = await db.archives.where('type').equals(currentTab).toArray();
    if (items.length === 0) {
      listContainer.innerHTML = `<p style="text-align:center;color:var(--text-secondary);font-size:14px;padding:30px 0;">该栏目暂无数据，请点击右上角添加</p>`;
      return;
    }

    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "archive-card";
      card.innerHTML = `
        <img class="card-avatar" src="${item.avatar || 'data:image/svg+xml;utf8,<svg viewBox=%220 0 100 100%22 xmlns=%22http://www.w3.org/2000/svg%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23e8f0fe%22/><text x=%2250%25%22 y=%2255%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2240%22 fill=%22%231a73e8%22>U</text></svg>'}" alt="Avatar">
        <div class="card-info">
          <div class="card-header-row">
            <span class="card-name">${item.name}</span>
            ${item.group ? `<span class="card-group">${item.group}</span>` : ''}
          </div>
          <p class="card-desc">${item.remark || '无备注'}</p>
        </div>
        <div class="card-actions">
          <button class="btn-icon" onclick="editArchive(${item.id})">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-icon" onclick="deleteArchive(${item.id})">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      `;
      listContainer.appendChild(card);
    });
  }
}

// 头像单选框切换
document.querySelectorAll('input[name="avatar-type"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    if (e.target.value === 'url') {
      document.getElementById("avatar-url-group").style.display = 'block';
      document.getElementById("avatar-file-group").style.display = 'none';
    } else {
      document.getElementById("avatar-url-group").style.display = 'none';
      document.getElementById("avatar-file-group").style.display = 'block';
    }
  });
});

// 新建弹出
document.getElementById("btn-add-archive").onclick = async () => {
  document.getElementById("archive-form").reset();
  document.getElementById("archive-id").value = "";
  document.getElementById("form-title").innerText = `新建${getTabName(currentTab)}`;
  
  if (currentTab === 'relation') {
    document.getElementById("form-relation-fields").style.display = "block";
    document.getElementById("form-general-fields").style.display = "none";
    document.getElementById("form-npc-parent-group").style.display = "none";
    await populateRelationDropdowns();
  } else {
    document.getElementById("form-relation-fields").style.display = "none";
    document.getElementById("form-general-fields").style.display = "block";
    
    if (currentTab === 'npc') {
      document.getElementById("form-npc-parent-group").style.display = "block";
      await populateParentDropdown();
    } else {
      document.getElementById("form-npc-parent-group").style.display = "none";
    }
  }
  document.getElementById("archive-form-overlay").classList.add("active");
};

// 填充NPC的上级下拉框
async function populateParentDropdown() {
  const parentSelect = document.getElementById("archive-parent-id");
  parentSelect.innerHTML = "";
  // NPC可以归属于“角色”或者“用户”
  const chars = await db.archives.where('type').anyOf(['character', 'user']).toArray();
  chars.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.innerText = `[${getTabName(c.type)}] ${c.name}`;
    parentSelect.appendChild(opt);
  });
}

// 填充关系两端的角色下拉框
async function populateRelationDropdowns() {
  const fromSel = document.getElementById("relation-from");
  const toSel = document.getElementById("relation-to");
  fromSel.innerHTML = "";
  toSel.innerHTML = "";

  const all = await db.archives.toArray();
  all.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.id;
    opt.innerText = `[${getTabName(item.type)}] ${item.name}`;
    fromSel.appendChild(opt);
    
    const optCopy = opt.cloneNode(true);
    toSel.appendChild(optCopy);
  });
}

// 隐藏表单
document.getElementById("btn-close-form").onclick = document.getElementById("btn-cancel-form").onclick = () => {
  document.getElementById("archive-form-overlay").classList.remove("active");
};

// 保存新建或修改
document.getElementById("btn-save-archive").onclick = async (e) => {
  e.preventDefault();
  const id = document.getElementById("archive-id").value;
  
  if (currentTab === 'relation') {
    const fromId = Number(document.getElementById("relation-from").value);
    const toId = Number(document.getElementById("relation-to").value);
    const relation = document.getElementById("relation-desc").value.trim();
    if (!relation) { alert("关系描述不可为空"); return; }
    if (fromId === toId) { alert("不可自身绑定关系"); return; }
    
    await db.relations.add({ fromId, toId, relation });
  } else {
    const name = document.getElementById("archive-name").value.trim();
    const remark = document.getElementById("archive-remark").value.trim();
    const group = document.getElementById("archive-group").value.trim();
    const persona = document.getElementById("archive-persona").value.trim();
    const parentId = currentTab === 'npc' ? Number(document.getElementById("archive-parent-id").value) : null;
    
    if (!name) { alert("姓名不可为空"); return; }

    // 处理头像数据（本地文件转 base64 存入或用 url）
    let avatar = "";
    const avatarType = document.querySelector('input[name="avatar-type"]:checked').value;
    if (avatarType === 'url') {
      avatar = document.getElementById("archive-avatar-url").value.trim();
    } else {
      const fileInput = document.getElementById("archive-avatar-file");
      if (fileInput.files.length > 0) {
        avatar = await convertFileToBase64(fileInput.files[0]);
      } else if (id) {
        // 如果是编辑态且未选新文件，保留原有头像
        const orig = await db.archives.get(Number(id));
        avatar = orig.avatar;
      }
    }

    const doc = { type: currentTab, name, avatar, remark, group, persona, parentId };

    if (id) {
      await db.archives.update(Number(id), doc);
    } else {
      await db.archives.add(doc);
    }
  }

  document.getElementById("archive-form-overlay").classList.remove("active");
  loadArchives();
};

// 辅助：文件转 base64 存入
function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

// 修改数据
window.editArchive = async function(id) {
  const item = await db.archives.get(id);
  if (!item) return;

  document.getElementById("archive-id").value = item.id;
  document.getElementById("form-title").innerText = `编辑${getTabName(item.type)}`;
  document.getElementById("archive-name").value = item.name;
  document.getElementById("archive-remark").value = item.remark;
  document.getElementById("archive-group").value = item.group;
  document.getElementById("archive-persona").value = item.persona;
  
  document.getElementById("form-relation-fields").style.display = "none";
  document.getElementById("form-general-fields").style.display = "block";

  if (item.type === 'npc') {
    document.getElementById("form-npc-parent-group").style.display = "block";
    await populateParentDropdown();
    document.getElementById("archive-parent-id").value = item.parentId || "";
  } else {
    document.getElementById("form-npc-parent-group").style.display = "none";
  }

  // 渲染原有头像地址
  if (item.avatar && !item.avatar.startsWith("data:")) {
    document.querySelector('input[name="avatar-type"][value="url"]').checked = true;
    document.getElementById("archive-avatar-url").value = item.avatar;
    document.getElementById("avatar-url-group").style.display = 'block';
    document.getElementById("avatar-file-group").style.display = 'none';
  }

  document.getElementById("archive-form-overlay").classList.add("active");
};

// 删除数据
window.deleteArchive = async function(id) {
  if (confirm("确定要删除该档案吗？")) {
    await db.archives.delete(id);
    // 同时关联删除与其相关的关系链
    await db.relations.where('fromId').equals(id).or('toId').equals(id).delete();
    loadArchives();
  }
};

window.deleteRelation = async function(id) {
  if (confirm("确定要删除此条关系线吗？")) {
    await db.relations.delete(id);
    loadArchives();
  }
};