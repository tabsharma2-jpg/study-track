const CACHE_NAME = "study-tracker-v2";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Install
self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log("Caching static assets...");
      await cache.addAll(STATIC_ASSETS);

      // Cache CDN
      try {
        await cache.add("https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js");
      } catch (err) {
        console.warn("Failed to cache CDN file:", err);
      }
    })()
  );
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", (e) => {
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).catch(() => caches.match("./index.html"))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then((cached) => cached || fetch(e.request))
    );
  }
});
