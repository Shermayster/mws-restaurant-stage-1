importScripts('./scripts/idb.js');
importScripts('./scripts/utils.js');

var CACHE_VERSION_STATIC = 'static-v16';
const CACHE_VERSION_PICTURE = 'picture-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    // create cache
    caches
      .open(CACHE_VERSION_STATIC)
      .then(cache => {
        cache.addAll([
          './',
          './index.html',
          './restaurant.html',
          './scripts/idb.js',
          './scripts/main.js',
          './scripts/utils.js',
          './scripts/dbhelper.js',
          './scripts/lazysizes.min.js',
          './scripts/restaurant_info.js',
          './styles/styles.css',
          './styles/styles-medium.css',
          'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.css'
        ]);
      })
      .catch(err => {})
  );
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(
        keyList.map(function(key) {
          if (key !== CACHE_VERSION_STATIC && key !== CACHE_VERSION_PICTURE) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  return event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response
        } else if(event.request.url.includes('restaurants')) {
          cacheResturants(event);
        } else if (event.request.url.includes('images')) {
          cacheImages(event);
        } else {
          return fetch(event.request).then(res => res).catch(err => console.log(err))
        }
      }));
});

function cacheResturants(event) {
  return event.respondWith(fetch(event.request).then(res => {
    const clonedRes = res.clone();
    readAllData('restaurants').then(() => {
      return clonedRes.json();
    }).then(data => {
      writeData('restaurants', data, 'restaurants');
    });
    return res;
  }));
}

function cacheImages(event) {
  return fetch(event.request).then((res) => {
      return caches.open(CACHE_VERSION_PICTURE).then(function (cache) {
          cache.put(event.request.url, res.clone());
          return res;
        })
    });
}
