// Teinc Food — intentionally empty service worker.
// The previous cache-first worker served stale app shells whose hashed
// /next/static chunk URLs change every deploy, crashing the page on refresh
// ("This page couldn't load"). This worker unregisters itself and clears all
// caches so returning visitors fall back to network loading. No fetch handler
// is registered and nothing is cached.
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
      .then(() => self.registration.unregister()),
  );
});