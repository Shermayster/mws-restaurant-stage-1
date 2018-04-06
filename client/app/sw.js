
self.addEventListener('install', event => {
  event.waitUntil(
    // create cache
    caches.open('static')
      .then(cache => {
        cache.addAll([
          './',
          './index.html',
          './restaurant.html',
          './scripts/main.js',
          './scripts/dbhelper.js',
          './scripts/restaurant_info.js',
          './styles/styles.css',
          './styles/styles-medium.css'
        ]);
      }).catch(err => error.log(err)));
});

self.addEventListener('activate', event => {
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // try to load from cache
        return response || fetch(event.request).then(res => {
          caches.open('dynamic').then(cache => {
            cache.put(event.request.url, res.clone());
            // return response to the app
            return res;
          });
        })
          .catch(err => console.log(err));
      }));
});
