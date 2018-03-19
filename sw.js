self.addEventListener('install', (event) => {
    event.waitUntil(
        // create cache
        caches.open('static')
        .then((cache) => {
            cache.addAll([
                './',
                './index.html',
                './js/main.js',
                './js/dbhelper.js',
                './js/restaurant_info.js',
                './css/styles.css',
                './css/styles-medium.css',
            ]);
        }));
});

self.addEventListener('activate', (event) => {
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            // try to load from cache
            return response ? response :
                // add response to dynamic cache
                fetch(event.request).then((res) => {
                    caches.open('dynamic').then((cache) => {
                        cache.put(event.request.url, res.clone());
                        // return response to the app
                        return res;
                    });
                })
                .catch(err => console.log(err));
        }));
});