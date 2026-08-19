/* 账号保护启用后停用离线页面缓存，避免登出后仍读取旧工作台。 */
self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (key) { return caches.delete(key); }));
  }).then(function () {
    return self.registration.unregister();
  }));
});
