importScripts('./scripts/idb.js');

var CACHE_VERSION_STATIC = 'static-v4';
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

const dbPromise = idb.open('restaurants-store', 1, db => {
  if(!db.objectStoreNames.contains('restaurants')) {
    db.createObjectStore('restaurants')
  }
})

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
  if (
    !event.request.url.includes('maps.googleapis.com') &&
    !event.request.url.includes('browser-sync')
  ) {
    if(event.request.url.includes('restaurants')) {
      event.respondWith(fetch(event.request).then(res => {
        const clonedRes = res.clone();
        clonedRes.json().then(data => {
          dbPromise.then((db) => {
            console.log(data);
            const tx = db.transaction('restaurants', 'readwrite');
            tx.objectStore('restaurants').put(data, 'restaurants');
            return tx.complete;
          });
        })
        return res;
      }))
    }
    // event.respondWith(
    //   caches.match(event.request).then(response => {
    //     console.log('dynamic cache', event.request.url);
    //     // try to load from cache
    //     if (response) {
    //       return response;
    //     } else {
    //       return fetch(event.request)
    //         .then(res => {
    //           return caches.open(CACHE_VERSION_DYNAMIC).then(cache => {
    //             cache.put(event.request.url, res.clone());
    //             // return response to the app
    //             return res;
    //           });
    //         })
    //         .catch(err => console.log(err));
    //     }
    //   })
    // );
  } else {
    return fetch(event.request).then(res => res);
  }
});
