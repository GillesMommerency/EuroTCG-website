// Empty service worker - prevents 404 errors
// Service worker functionality disabled during development
self.addEventListener('install', () => {
  // Skip waiting and activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  // Take control of all clients
  self.clients.claim();
});
