self.addEventListener('install', (event) => {
    console.log('[Service Woker] Installing Service Worker...', event);
});

self.addEventListener('activate', (event) => {
    console.log('[Service Woker] Activating Service Worker...', event);
});