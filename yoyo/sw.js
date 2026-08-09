/* 桃子工作台 Service Worker — 网络优先，离线回退缓存 */
var CACHE = "yoyo-v2";
var ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./assets/css/yoyo.css",
  "./assets/js/data.js",
  "./assets/js/ai.js",
  "./assets/js/app.js",
  "./assets/yoyo-avatar.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (e) {
  var url = new URL(e.request.url);
  /* API 请求（DeepSeek / GitHub）不缓存，直接走网络 */
  if (url.origin !== location.origin) return;
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(function (resp) {
      if (resp.ok) {
        var clone = resp.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, clone); });
      }
      return resp;
    }).catch(function () {
      return caches.match(e.request);
    })
  );
});
