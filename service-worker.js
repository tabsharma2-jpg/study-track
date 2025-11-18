const CACHE_NAME = "study-tracker-v2";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./service-worker.js"
];

// Install event
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching static assets...");
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener("fetch", (e) => {
  if (e.request.mode === "navigate") {
    // For page navigation: try network first, fallback to cache
    e.respondWith(
      fetch(e.request)
        .then((res) => res)
        .catch(() => caches.match("./index.html"))
    );
  } else {
    // For static assets: cache first, then network
    e.respondWith(
      caches.match(e.request).then((cachedRes) => {
        return cachedRes || fetch(e.request);
      })
    );
  }
});
