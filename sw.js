const CACHE_NAME = 'story-phone-v2';

// 包含所有平铺引用的功能文件和图标
const ASSETS = [
  './index.html',
  './manifest.json',
  './style.css',
  './app.css',
  './chat.css',
  './db.js',
  './app_desktop.js',
  './app_settings.js',
  './app_archive.js',
  './app_chat.js',
  './icon-144.png',
  './icon-512.png',
  'https://unpkg.com/dexie@4.0.1/dist/dexie.js'
];

// 安装阶段：预缓存所有资源
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 激活阶段：清理旧版本的缓存
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 请求拦截：优先使用缓存，若无则发起网络请求
self.addEventListener('fetch', (e) => {
  // 排除对外部 API 请求的拦截，仅缓存本地应用静态资源
  if (e.request.url.startsWith('http') && !e.request.url.includes('unpkg.com')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});