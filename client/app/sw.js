importScripts('./scripts/idb.js');
importScripts('./scripts/utils.js');

var CACHE_VERSION_STATIC = 'static-v15';
var CACHE_VERSION_DYNAMIC = 'dynamic-v3';

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
          './scripts/dbhelper.js',
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
          if (key !== CACHE_VERSION_STATIC && key !== CACHE_VERSION_DYNAMIC) {
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
  if(event.request.url.includes('restaurants')) {
      event.respondWith(fetch(event.request).then(res => {
        const clonedRes = res.clone();
        readAllData('restaurants').then(() => {
          return clonedRes.json();
        }).then(data => {
          writeData('restaurants', data, 'restaurants');
        })
        return res;
      }));
    } else if (event.request.url.includes('images')) {
    event.respondWith(
      caches.match(event.request)
        .then(function (response) {
          if (response) {
            return response;
          } else {
            return fetch(event.request)
              .then(function (res) {
                return caches.open(CACHE_VERSION_DYNAMIC)
                  .then(function (cache) {
                    // trimCache(CACHE_DYNAMIC_NAME, 3);
                    cache.put(event.request.url, res.clone());
                    return res;
                  })
              })
            }
          })
        )
  } else {
    return fetch(event.request).then(res => res);
  }
});

function isInArray(string, array) {
  var cachePath;
  if (string.indexOf(self.origin) === 0) { // request targets domain where we serve the page from (i.e. NOT a CDN)
    console.log('matched ', string);
    cachePath = string.substring(self.origin.length); // take the part of the URL AFTER the domain (e.g. after localhost:8080)
  } else {
    cachePath = string; // store the full request (for CDNs)
  }
  return array.indexOf(cachePath) > -1;
}
