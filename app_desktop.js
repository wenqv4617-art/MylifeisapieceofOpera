document.addEventListener("DOMContentLoaded", () => {
  updateClock();
  setInterval(updateClock, 1000);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log("PWA SW Online!"))
      .catch((e) => console.error("SW failed", e));
  }

  loadDesktopLayout();
  initAppClickEvents();
});

function updateClock() {
  const now = new Date();
  document.getElementById("status-time").innerText = 
    `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

const DESKTOP_APPS_CONFIG = {
  settings: { name: "设置", svg: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>' },
  archive: { name: "档案库", svg: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0-2-.9-2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>' },
  chat: { name: "聊天", svg: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>' }
};

function loadDesktopLayout() {
  const grid = document.getElementById("desktop-grid");
  const dock = document.getElementById("dock-grid");

  let desktopIds = JSON.parse(localStorage.getItem("desktop-layout")) || ['settings', 'archive'];
  let dockIds = JSON.parse(localStorage.getItem("dock-layout")) || ['chat']; // 默认聊天挂在Dock

  renderLayout(grid, desktopIds);
  renderLayout(dock, dockIds);
  initDragEvents();
}

function renderLayout(container, ids) {
  container.innerHTML = "";
  ids.forEach(id => {
    const info = DESKTOP_APPS_CONFIG[id];
    if (!info) return;
    const div = document.createElement("div");
    div.className = "app-icon";
    div.setAttribute("data-app", id);
    div.setAttribute("draggable", "true");
    div.innerHTML = `
      <div class="icon-wrapper">${info.svg}</div>
      <span>${info.name}</span>
    `;
    container.appendChild(div);
  });
}

function initAppClickEvents() {
  document.body.addEventListener("click", (e) => {
    const icon = e.target.closest(".app-icon");
    if (icon) {
      const app = icon.getAttribute("data-app");
      openApp(app);
    }
  });
}

function openApp(app) {
  const win = document.getElementById(`win-${app}`);
  if (win) {
    win.classList.add("active");
    if (app === 'settings') initSettingsApp();
    if (app === 'archive') initArchiveApp();
    if (app === 'chat') initChatApp();
  }
}

function closeApp(app) {
  const win = document.getElementById(`win-${app}`);
  if (win) win.classList.remove("active");
}

// 拖拽在网格和Dock栏之间移动
function initDragEvents() {
  let activeDragNode = null;

  document.body.addEventListener("dragstart", (e) => {
    const icon = e.target.closest(".app-icon");
    if (icon) {
      activeDragNode = icon;
      e.dataTransfer.setData("text/plain", icon.getAttribute("data-app"));
    }
  });

  const zones = [document.getElementById("desktop-grid"), document.getElementById("dock-grid")];
  zones.forEach(zone => {
    zone.addEventListener("dragover", (e) => e.preventDefault());
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("text/plain");
      if (activeDragNode && activeDragNode.parentNode !== zone) {
        zone.appendChild(activeDragNode);
        saveLayoutsToLocal();
      }
    });
  });
}

function saveLayoutsToLocal() {
  const desktopIds = Array.from(document.getElementById("desktop-grid").children).map(c => c.getAttribute("data-app"));
  const dockIds = Array.from(document.getElementById("dock-grid").children).map(c => c.getAttribute("data-app"));
  localStorage.setItem("desktop-layout", JSON.stringify(desktopIds));
  localStorage.setItem("dock-layout", JSON.stringify(dockIds));
}