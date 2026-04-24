self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // minimal pass-through service worker requires active fetch event listener to qualify as a PWA
  if (event.request.method !== 'GET') return;
});
