//For offline fallback page

const OFFLINE_CACHE_NAME = "offline";
const STATIC_ASSETS_CACHE_NAME = "v1";

self.addEventListener('install', event => {
    event.waitUntil(
        caches
            .open(OFFLINE_CACHE_NAME)
            .then(cache => {
                /*
                    Setting {cache: 'reload'} in the new request will ensure that the
                    response isn't fulfilled from the HTTP cache; i.e., it will be from
                    the network.
                */
                return cache.add(
                    new Request('offline.html', {
                        "cache": "reload"
                    })
                )
            })
    )
})

self.addEventListener('fetch', event => {
    // We only want to call event.respondWith() if this is a navigation request

    /*
      If our if() condition is false, then this fetch handler won't intercept the
      request. If there are any other fetch handlers registered, they will get a
      chance to call event.respondWith(). If no fetch handlers call
      event.respondWith(), the request will be handled by the browser as if there
      were no service worker involvement.
    */

    if (event.request.mode !== "navigate") return;

    event.respondWith(
        caches
            .match(event.request)
            .then(res => {
                // caches.match() always resolves
                // but in case of success response will have value
                if (res !== undefined) return res;

                fetch(event.request)
                    .then(res => {
                        const responseClone = res.clone();

                        caches
                            .open(STATIC_ASSETS_CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseClone);
                            })
                    })
                    .catch(err => {
                        // catch is only triggered if an exception is thrown, which is likely
                        // due to a network error.
                        // If fetch() returns a valid HTTP response with a response code in
                        // the 4xx or 5xx range, the catch() will NOT be called.

                        /*show error logic(mb snackbar)*/

                        caches
                            .open(OFFLINE_CACHE_NAME)
                            .then(cache => {
                                return cache.match('offline.html')
                            })
                    })
            })
    )
})

//For push notification
self.addEventListener('push', function(event) {
    console.log('Received a push message', event);

    var title = 'Yay a message.';
    var body = 'We have received a push message.';
    var icon = '/images/icon-192x192.png';
    var tag = 'simple-push-demo-notification-tag';

    event.waitUntil(
        self.registration.showNotification(title, {
            body: body,
            icon: icon,
            tag: tag
        })
    );
});