const CACHE_NAME = 'story-phone-v1';
const ASSETS = [
  './index.html',
  './style.css',
  './app.css',
  './db.js',
  './app.js',
  './settings.js',
  './archive.js',
  'https://unpkg.com/dexie@4.0.1/dist/dexie.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});