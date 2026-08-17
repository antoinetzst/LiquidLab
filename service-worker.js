const CACHE_NAME = "liquidlab-v1.12";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.webmanifest",
    "./icon-192.png",
    "./icon-512.png",
    "./apple-touch-icon.png"
];


/*
    Installation
*/

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches
                .open(CACHE_NAME)
                .then(
                    cache =>
                        cache.addAll(
                            FILES_TO_CACHE
                        )
                )

        );

        self.skipWaiting();

    }
);


/*
    Activation
*/

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches
                .keys()
                .then(keys => {

                    return Promise.all(

                        keys
                            .filter(
                                key =>
                                    key !== CACHE_NAME
                            )
                            .map(
                                key =>
                                    caches.delete(key)
                            )

                    );

                })

        );

        self.clients.claim();

    }
);


/*
    Chargement
*/

self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            fetch(event.request)

                .then(response => {

                    const copy =
                        response.clone();

                    caches
                        .open(CACHE_NAME)
                        .then(
                            cache =>
                                cache.put(
                                    event.request,
                                    copy
                                )
                        );

                    return response;

                })

                .catch(
                    () =>
                        caches.match(
                            event.request
                        )
                )

        );

    }
);
