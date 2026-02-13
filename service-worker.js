const CACHE_NAME = 'stpl-cms-v1';
const urlsToCache = [
  '/login.html',
  '/signup.html',
  '/dashboard.html',
  '/signup-approvals.html',
  '/view-ticket.html',
  '/new-complaint.html',
  '/hostel.html',
  '/hostel_export.html',
  '/inventory.html',
  '/inventory_export.html',
  '/attendance-report.html',
  '/view-leave-balance.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request)).catch(() => {
      return caches.match('/login.html');
    })
  );
});
