// Minimal Service Worker to satisfy PWA installability requirements.
// Caching and offline support are disabled to prevent stale resources or client/server state mismatch.

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Pass-through fetch directly to the network without caching
  event.respondWith(fetch(event.request));
});
