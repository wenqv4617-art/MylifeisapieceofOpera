document.addEventListener("DOMContentLoaded", () => {
  // 1. 初始化系统时钟
  updateClock();
  setInterval(updateClock, 1000);

  // 2. 注册 PWA Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log("PWA Service Worker Registered!"))
      .catch((err) => console.error("Service Worker Error", err));
  }

  // 3. 渲染桌面布局 (从本地读取或使用默认)
  loadDesktopLayout();

  // 4. 初始化应用图标点击响应
  initAppIcons();
});

// 系统时钟
function updateClock() {
  const now = new Date();
  const hrs = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  document.getElementById("status-time").innerText = `${hrs}:${mins}`;
}

// 桌面图标交互
const appIcons = [
  { id: 'settings', name: '设置', svg: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>'},
  { id: 'archive', name: '档案库', svg: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0-2-.9-2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>'}
];

function loadDesktopLayout() {
  const gridContainer = document.getElementById("desktop-grid");
  const dockContainer = document.getElementById("dock-grid");

  // 读取桌面图标布局设置，如果没有则设默认值
  let desktopLayout = JSON.parse(localStorage.getItem("desktop-layout")) || ['settings', 'archive'];
  let dockLayout = JSON.parse(localStorage.getItem("dock-layout")) || [];

  renderIcons(gridContainer, desktopLayout);
  renderIcons(dockContainer, dockLayout);

  initDragAndDrop();
}

function renderIcons(container, appIds) {
  container.innerHTML = "";
  appIds.forEach(id => {
    const config = appIcons.find(a => a.id === id);
    if (!config) return;
    const div = document.createElement("div");
    div.className = "app-icon";
    div.setAttribute("data-app", id);
    div.setAttribute("draggable", "true");
    div.innerHTML = `
      <div class="icon-wrapper">${config.svg}</div>
      <span>${config.name}</span>
    `;
    container.appendChild(div);
  });
}

function initAppIcons() {
  document.body.addEventListener("click", (e) => {
    const appIcon = e.target.closest(".app-icon");
    if (appIcon) {
      const appName = appIcon.getAttribute("data-app");
      openApp(appName);
    }
  });
}

// 模拟原生滑入效果
function openApp(appName) {
  const win = document.getElementById(`win-${appName}`);
  if (win) {
    win.classList.add("active");
    // 如果是档案库，触发初始数据渲染
    if (appName === "archive") {
      initArchiveApp();
    } else if (appName === "settings") {
      initSettingsApp();
    }
  }
}

function closeApp(appName) {
  const win = document.getElementById(`win-${appName}`);
  if (win) {
    win.classList.remove("active");
  }
}

// 原生触屏和鼠标拖拽布局改变
function initDragAndDrop() {
  let draggedElement = null;

  document.querySelectorAll(".app-icon").forEach(icon => {
    icon.addEventListener("dragstart", (e) => {
      draggedElement = icon;
      e.dataTransfer.setData("text/plain", icon.getAttribute("data-app"));
    });
  });

  const containers = [document.getElementById("desktop-grid"), document.getElementById("dock-grid")];
  containers.forEach(container => {
    container.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    container.addEventListener("drop", (e) => {
      e.preventDefault();
      const appId = e.dataTransfer.getData("text/plain");
      if (draggedElement && draggedElement.parentNode !== container) {
        // 判断放置在Dock还是桌面上并重构
        container.appendChild(draggedElement);
        saveLayouts();
      }
    });
  });
}

function saveLayouts() {
  const desktopIds = Array.from(document.getElementById("desktop-grid").children).map(c => c.getAttribute("data-app"));
  const dockIds = Array.from(document.getElementById("dock-grid").children).map(c => c.getAttribute("data-app"));
  localStorage.setItem("desktop-layout", JSON.stringify(desktopIds));
  localStorage.setItem("dock-layout", JSON.stringify(dockIds));
}