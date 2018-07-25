importScripts('./scripts/idb.js');
importScripts('./scripts/utils.js');
importScripts('./scripts/dbhelper.js');

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
        'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.css',
      ]);
    })
    .catch(err => console.log('sw install error: ', err))
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
  console.log('event', event);

  if (requestUrl.pathname.startsWith('/images/')) {
    event.respondWith(serveImages(event.request));
    return;
  }

  if (requestUrl.pathname.startsWith('/restaurants')) {
    serveRestaurants(event);
    return;
  }

  if (requestUrl.pathname.startsWith('/reviews/') &&
    event.request.method === 'GET') {
    serveReviews(event);
    return;
  }
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});

function serveReviews(event) {
  return event.respondWith(fetch(event.request).then(res => {
    if(res) {
      const clonedRes = res.clone();
      clonedRes.json().then(data => {
        writeData('reviews', data, data[0].restaurant_id.toString());
      })
    }
    return res;
  }));
}

function serveRestaurants(event) {
  return event.respondWith(fetch(event.request)
  .then(res => {
    console.log('service worker serveRestaurants', res)
    if(res) {
      const clonedRes = res.clone();
      clonedRes.json().then(data => {
        writeData('restaurants', data, 'restaurants');
      })
    }
    return res;
  })

);
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

self.addEventListener('sync', function(event) {
  console.log('[Service Worker] Background syncing', event);
  if (event.tag === 'post-new-review') {
    console.log('[Service Worker] Syncing new Posts');
    syncNewPosts(event);
  }
  if (event.tag === 'delete-review') {
    console.log('[Service Worker] Deleting Posts');
    syncDeletedPosts(event);
  }

  if (event.tag === 'is-favorite') {
    console.log('[Service Worker] change favorites restaurant');
    event.waitUntil(readAllData('sync-is-favorite')
    .then(function (data) {
      console.log('sync data', data);
      for (var dt of data) {
        const id = Object.keys(dt)[0];
        const isFavorite = dt[id];
        DBHelper.manageFavorite(id, isFavorite)
          .then(function (res) {
            console.log('Sent data', res);
            if (res) {
              console.log('Favorite is updated', res);
              deleteItemFromData('sync-is-favorite', res.id.toString());
            }
          })
          .catch(function (err) {
            console.log('Error while sending data', err);
          });
      }
    }));
  }
});

function syncDeletedPosts(event) {
  event.waitUntil(readAllData('sync-deleted-reviews')
    .then(function (data) {
      console.log('sync data', data);
      for (var dt of data) {
        DBHelper.deleteReview(dt.id)
          .then(function (res) {
            console.log('Sent data', res);
            if (res) {
              console.log('delete sync-deleted-reviews', res);
              deleteItemFromData('sync-deleted-reviews', res.id);
            }
          })
          .catch(function (err) {
            console.log('Error while sending data', err);
          });
      }
    }));
}

function syncNewPosts(event) {
  event.waitUntil(readAllData('sync-reviews')
    .then(function (data) {
      console.log('sync data', data);
      for (var dt of data) {
        const { id, ...item } = dt;
        console.log('item', item);
        DBHelper.addReview(item)
          .then(function (res) {
            console.log('Sent data', res);
            if (res.ok) {
              res.json()
                .then(resData => {
                  console.log('delete sync-post', resData);
                  deleteItemFromData('sync-reviews', id);
                });
            }
          })
          .catch(function (err) {
            console.log('Error while sending data', err);
          });
      }
    }));
}
