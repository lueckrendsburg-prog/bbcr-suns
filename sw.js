const CACHE='bbcr-v1.2.2';
const LIBS=[
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,900&family=Barlow:wght@300;400;500;600&display=swap',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(LIBS).catch(()=>{})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // pwa.html und bbc-data.json immer vom Netzwerk (Network-First)
  if (url.includes('pwa.html') || url.includes('bbc-data.json')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('./pwa.html'))
    );
    return;
  }
  // Externe Libraries: Cache-First
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});