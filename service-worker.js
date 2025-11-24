const CACHE_NAME = "study-tracker-v2";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Install event
self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log("Caching static assets...");
      await cache.addAll(STATIC_ASSETS);

      // Try caching CDN (optional)
      try {
        await cache.add("https://cdn.jsdelivr.net/npm/chart.js");
      } catch (err) {
        console.warn("Failed to cache CDN file:", err);
      }
    })()
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener("fetch", (e) => {
  if (e.request.mode === "navigate") {
    // network → fallback index.html
    e.respondWith(
      fetch(e.request).catch(() => caches.match("./index.html"))
    );
  } else {
    // cache → network
    e.respondWith(
      caches.matc

