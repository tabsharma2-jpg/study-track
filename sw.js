const CACHE_NAME = "study-arc-v7.0-offline";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/app-logo-192.png",
  "./icons/app-logo-512.png",
  "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
];

// --- 1. Install Event (Cache Files) ---
self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        await cache.addAll(STATIC_ASSETS);
      } catch (err) {
        console.error("Caching Failed:", err);
      }
    })()
  );
  self.skipWaiting();
});

// --- 2. Activate Event (Clean Old Cache) ---
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

// --- 3. Fetch Event (Offline Support) ---
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

// --- 🔥 FIREBASE BACKGROUND NOTIFICATIONS (New Code) 🔥 ---
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyD3cYRcKUetqdNjaObGMgPmCwFinbEJgnE",
  authDomain: "study-arc-app.firebaseapp.com",
  projectId: "study-arc-app",
  storageBucket: "study-arc-app.firebasestorage.app",
  messagingSenderId: "1010200494786",
  appId: "1:1010200494786:web:dead51a759b250bfbaf15b"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[Background Message] ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: './icons/app-logo-192.png',
    badge: './icons/app-logo-192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});