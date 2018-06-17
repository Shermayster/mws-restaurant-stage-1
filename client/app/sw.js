importScripts('./scripts/idb.js');
importScripts('./scripts/utils.js');

var CACHE_VERSION_STATIC = 'static-v19';
const CACHE_VERSION_PICTURE = 'picture-v3';

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
    .catch(err => console.log('sw install errror: ', err))
  );
});

self.addEventListener('activate', function (event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
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
  var requestUrl = new URL(event.request.url);

  if (requestUrl.pathname.startsWith('/images/')) {
    event.respondWith(serveImages(event.request));
    return;
  }

  if (requestUrl.pathname.startsWith('/restaurants')) {
    serveResturants(event);
    return;
  }
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});

function serveResturants(event) {
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


function serveImages(request) {
  var storageUrl = request.url.replace(/(-\d+px\.(jpg|webp)|.jpg)$/, '');
  return caches.open(CACHE_VERSION_PICTURE).then(function (cache) {
    return cache.match(storageUrl).then(function (response) {
      //serve form cache
      if (response) return response;
      //serve from network
      return fetch(request).then(function (networkResponse) {
        cache.put(storageUrl, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}
