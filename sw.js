// Summer of Soccer — service worker
// Caches the static app shell so the UI loads instantly on repeat visits
// and degrades gracefully offline. Live data (API calls) always goes to
// the network — we never cache /api/* responses here.

const CACHE_NAME = 'summer-of-soccer-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/flags.js',
  '/data.js',
  '/facts.js',
  '/squads.js',
  '/players.js',
  '/team.js',
  '/diyk.js',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Never cache API calls — live data must always be fresh from the network.
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // App shell: cache-first, falling back to network, then updating the cache.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((res) => {
          if (res && res.status === 200) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          }
          return res;
        })
        .catch(() => cached); // offline — fall back to cache if network fails

      return cached || networkFetch;
    })
  );
});
