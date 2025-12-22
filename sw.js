const CACHE_NAME = "study-arc-v3.2-offline";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/app-logo-192.png",
  "./icons/app-logo-512.png",
  "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
];

// 1. Install Event (Cache Files)
self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log("[Service Worker] Caching Assets...");
      try {
        await cache.addAll(STATIC_ASSETS);
      } catch (err) {
        console.error("Caching Failed:", err);
      }
    })()
  );
  self.skipWaiting();
});

// 2. Activate Event (Clean Old Cache)
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// 3. Fetch Event (Offline Support)
self.addEventListener("fetch", (e) => {
  // Navigation requests (HTML)
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).catch(() => caches.match("./index.html"))
    );
  } else {
    // Other requests (Images, JS, CSS)
    e.respondWith(
      caches.match(e.request).then((cached) => cached || fetch(e.request))
    );
  }
});