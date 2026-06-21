 const CACHE = 'eng-reader-v2';
 const FILES = ['index.html', 'manifest.json', 'icons/icon-192.png'];
 
 self.addEventListener('install', e => {
   e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
   self.skipWaiting();
 });
 
 self.addEventListener('activate', e => {
   e.waitUntil(
     caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
   );
   clients.claim();
 });
 
 self.addEventListener('fetch', e => {
   const url = new URL(e.request.url);
   // Only cache same-origin GET requests
   if (url.origin !== location.origin || e.request.method !== 'GET') return;
   e.respondWith(
     caches.match(e.request).then(r => r || fetch(e.request).then(res => {
       const clone = res.clone();
       caches.open(CACHE).then(c => c.put(e.request, clone));
       return res;
     }))
   );
 });
