// 设置页面的具体逻辑
function initSettingsApp() {
  loadPresetsList();
  updateDataStatistics();

  // Tab 切换逻辑
  const navTabs = document.querySelectorAll("#win-settings .nav-tab");
  navTabs.forEach(tab => {
    tab.onclick = () => {
      navTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.getAttribute("data-tab");
      document.querySelectorAll(".settings-panel").forEach(panel => {
        panel.classList.remove("active");
      });
      document.getElementById(`panel-${target}`).classList.add("active");
    };
  });
}

// 模拟API温度数值变化
document.getElementById("api-temp").addEventListener("input", (e) => {
  document.getElementById("temp-val").innerText = e.target.value;
});

// 加载预设列表
async function loadPresetsList() {
  const select = document.getElementById("api-presets-select");
  const presets = await db.api_presets.toArray();
  select.innerHTML = '<option value="">-- 选择已有预设 --</option>';
  presets.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.innerText = p.name;
    select.appendChild(opt);
  });
}

// 预设选择切换
document.getElementById("api-presets-select").addEventListener("change", async (e) => {
  const presetId = e.target.value;
  if (!presetId) return;
  const p = await db.api_presets.get(Number(presetId));
  if (p) {
    document.getElementById("api-preset-name").value = p.name;
    document.getElementById("api-protocol").value = p.protocol;
    document.getElementById("api-url").value = p.url;
    document.getElementById("api-key").value = p.key;
    document.getElementById("api-temp").value = p.temperature;
    document.getElementById("temp-val").innerText = p.temperature;
    
    // 清空重装模型列表
    const modelSelect = document.getElementById("api-model-select");
    modelSelect.innerHTML = `<option value="${p.model}">${p.model}</option>`;
  }
});

// 保存预设
document.getElementById("btn-save-preset").addEventListener("click", async () => {
  const name = document.getElementById("api-preset-name").value.trim();
  const protocol = document.getElementById("api-protocol").value;
  const url = document.getElementById("api-url").value.trim();
  const key = document.getElementById("api-key").value.trim();
  const model = document.getElementById("api-model-select").value;
  const temperature = parseFloat(document.getElementById("api-temp").value);

  if (!name) {
    alert("请为该预设命名！");
    return;
  }

  const existingId = document.getElementById("api-presets-select").value;
  const data = { name, protocol, url, key, model, temperature };

  if (existingId) {
    await db.api_presets.update(Number(existingId), data);
  } else {
    await db.api_presets.add(data);
  }

  alert("预设保存成功");
  loadPresetsList();
});

// 删除预设
document.getElementById("btn-delete-preset").addEventListener("click", async () => {
  const existingId = document.getElementById("api-presets-select").value;
  if (!existingId) {
    alert("未选择任何预设");
    return;
  }
  if (confirm("确定要删除当前预设吗？")) {
    await db.api_presets.delete(Number(existingId));
    document.getElementById("api-form").reset();
    loadPresetsList();
  }
});

// 模拟拉取模型列表
document.getElementById("btn-fetch-models").addEventListener("click", async () => {
  const protocol = document.getElementById("api-protocol").value;
  const url = document.getElementById("api-url").value;
  const key = document.getElementById("api-key").value;

  if (!url || !key) {
    alert("请先填写正确的端点 URL 和 API Key");
    return;
  }

  const modelSelect = document.getElementById("api-model-select");
  modelSelect.innerHTML = '<option>拉取中...</option>';

  try {
    // 这里以标准 OpenAI endpoint 拉取为例
    const response = await fetch(`${url}/models`, {
      headers: { "Authorization": `Bearer ${key}` }
    });
    if (!response.ok) throw new Error("无法拉取模型");
    const data = await response.json();
    modelSelect.innerHTML = "";
    data.data.forEach(m => {
      const opt = document.createElement("option");
      opt.value = m.id;
      opt.innerText = m.id;
      modelSelect.appendChild(opt);
    });
    alert("模型拉取完成！");
  } catch (err) {
    // 出于测试目的或离线开发状态，提供后备默认模型
    console.warn("拉取失败，启用后备默认模型", err);
    modelSelect.innerHTML = "";
    const defaults = ["gpt-4o", "gpt-3.5-turbo", "deepseek-chat", "gemini-1.5-pro"];
    defaults.forEach(m => {
      const opt = document.createElement("option");
      opt.value = m;
      opt.innerText = m;
      modelSelect.appendChild(opt);
    });
    alert("连接失败。已为您加载本地协议推荐模型列表。");
  }
});

// 测试模型返回
document.getElementById("btn-test-api").addEventListener("click", async () => {
  const url = document.getElementById("api-url").value;
  const key = document.getElementById("api-key").value;
  const model = document.getElementById("api-model-select").value;

  if (!url || !key || !model) {
    alert("请先配置完整再进行测试。");
    return;
  }

  try {
    const response = await fetch(`${url}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: "hi" }],
        max_tokens: 5
      })
    });
    const result = await response.json();
    if (result.choices) {
      alert("配置测试成功！AI 回复：" + result.choices[0].message.content);
    } else {
      throw new Error();
    }
  } catch (err) {
    alert("测试连接失败，请检查填写参数或网络。");
  }
});

// 数据管理：获取全库统计
async function updateDataStatistics() {
  const cCount = await db.archives.count();
  const rCount = await db.relations.count();
  const pCount = await db.api_presets.count();
  document.getElementById("db-total-records").innerText = cCount + rCount + pCount;
}

// 导出全量备份 JSON
document.getElementById("btn-export-data").addEventListener("click", async () => {
  const presets = await db.api_presets.toArray();
  const archives = await db.archives.toArray();
  const relations = await db.relations.toArray();
  
  const fullBackup = { presets, archives, relations };
  const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = `story_phone_backup_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

// 触发导入选择
document.getElementById("btn-import-trigger").addEventListener("click", () => {
  document.getElementById("file-import").click();
});

// 执行导入操作
document.getElementById("file-import").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const data = JSON.parse(event.target.result);
      if (confirm("导入覆盖将清除当前库数据，是否继续？")) {
        await db.api_presets.clear();
        await db.archives.clear();
        await db.relations.clear();

        if (data.presets) await db.api_presets.bulkAdd(data.presets);
        if (data.archives) await db.archives.bulkAdd(data.archives);
        if (data.relations) await db.relations.bulkAdd(data.relations);

        alert("导入数据恢复成功！");
        updateDataStatistics();
        loadPresetsList();
      }
    } catch (err) {
      alert("文件解析错误，导入失败。");
    }
  };
  reader.readAsText(file);
});