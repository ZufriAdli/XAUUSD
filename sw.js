// Gold Abyss X79: makes the app installable and lets it open offline.
const CACHE = 'gold-abyss-x79-v3';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png?v=3', './icon-512.png?v=3'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // Gemini, fonts etc. go straight to the network
  // network first so updates show up, cache as fallback when offline
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});
