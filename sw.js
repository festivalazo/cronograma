// Guarda la página para que funcione sin señal. Subir la versión al publicar cambios.
const CACHE = 'crono-v1';
const BASE = ['./', 'index.html', 'manifest.json', 'img/margarita.png', 'img/hongos.png', 'img/icon-192.png', 'img/cronograma.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.hostname === 'docs.google.com') return; // la planilla siempre por red
  // red primero (para tener lo último), y si no hay señal, lo guardado
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok || r.type === 'opaque') { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); }
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
