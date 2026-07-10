function initSettingsApp() {
  loadPresetsList();
}

function openSettingsLv2(subTab) {
  document.getElementById("settings-lv1").style.display = "none";
  document.querySelectorAll(".settings-lv2-panel").forEach(p => p.style.display = "none");
  document.getElementById(`settings-lv2-${subTab}`).style.display = "block";
  document.getElementById("settings-title").innerText = subTab === 'api' ? 'API 协议设置' : '本地数据管理';
  
  if (subTab === 'data') computeStorageUsage();
}

function closeSettingsLv2() {
  document.getElementById("settings-lv1").style.display = "block";
  document.querySelectorAll(".settings-lv2-panel").forEach(p => p.style.display = "none");
  document.getElementById("settings-title").innerText = '系统设置';
}

// 将当前选中的预设应用到全局
document.getElementById("btn-apply-global").addEventListener("click", () => {
  const activePresetId = document.getElementById("api-presets-select").value;
  if (!activePresetId) {
    alert("请先选择或保存一个配置预设后再应用到全局！");
    return;
  }
  localStorage.setItem("global_api_preset_id", activePresetId);
  alert("已成功应用为全局默认 API 连接策略");
});

// 计算所有资源所占空间和图片大小 (序列化估算)
async function computeStorageUsage() {
  const presets = await db.api_presets.toArray();
  const archives = await db.archives.toArray();
  const relations = await db.relations.toArray();
  const sessions = await db.sessions.toArray();
  const messages = await db.messages.toArray();
  const stickers = await db.stickers.toArray();

  const totalRecords = presets.length + archives.length + relations.length + sessions.length + messages.length + stickers.length;
  document.getElementById("db-total-records").innerText = totalRecords;

  // 估算图片体积 (Base64长度转换)
  let imgBytes = 0;
  archives.forEach(item => {
    if (item.avatar && item.avatar.startsWith("data:")) {
      imgBytes += item.avatar.length;
    }
  });
  stickers.forEach(item => {
    if (item.imageUrl && item.imageUrl.startsWith("data:")) {
      imgBytes += item.imageUrl.length;
    }
  });

  const fullDataObj = { presets, archives, relations, sessions, messages, stickers };
  const allBytes = new Blob([JSON.stringify(fullDataObj)]).size;

  document.getElementById("db-total-bytes").innerText = `${(allBytes / 1024).toFixed(2)} KB`;
  document.getElementById("db-image-bytes").innerText = `${(imgBytes / 1024).toFixed(2)} KB`;
}