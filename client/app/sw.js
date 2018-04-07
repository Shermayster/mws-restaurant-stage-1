var CACHE_VERSION_STATIC = 'static-v2';
var CACHE_VERSION_DYNAMIC = 'dynamic-v1'
self.addEventListener('install', event => {
  event.waitUntil(
    // create cache
    caches.open(CACHE_VERSION_STATIC)
      .then(cache => {
        cache.addAll([
          './',
          './index.html',
          './restaurant.html',
          './scripts/main.js',
          './scripts/dbhelper.js',
          './scripts/restaurant_info.js',
          './styles/styles.css',
          './styles/styles-medium.css',
          'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.css'
        ]);
      }).catch(err => {

      }));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => Promise.all(keyList.map(key => {
      if (key !== CACHE_VERSION_STATIC && key !== CACHE_VERSION_DYNAMIC) {
        console.log('[service worker] remove old cache');
        return caches.delete(key);
      }
    })))
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
 if(!event.request.url.includes('maps.googleapis.com') &&
    !event.request.url.includes('browser-sync')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          console.log('dynamic cache', event.request.url)
          // try to load from cache
          if (response) {
            return response;
          } else {
            return fetch(event.request)
              .then(res => {
                return caches.open(CACHE_VERSION_DYNAMIC).then(cache => {
                   cache.put(event.request.url, res.clone());
                   // return response to the app
                   return res;
                 });
             }).catch(err => console.log(err));
          }
        }));
      } else {
        return fetch(event.request).then(res => res);
      }
});
