/* =========================================================
   LIQUIDLAB — SERVICE WORKER
========================================================= */


/*
    Incrémente cette version
    à chaque mise à jour importante.

    Exemple :
    2.3.1 -> 2.3.2
*/

const APP_VERSION =
    "2.3.1";


const CACHE_NAME =
    "liquidlab-v" +
    APP_VERSION;


/*
    Fichiers essentiels à mettre
    immédiatement en cache.

    Les chemins relatifs "./"
    sont adaptés à GitHub Pages,
    y compris si LiquidLab est dans
    un sous-dossier du type :

    username.github.io/LiquidLab/
*/

const FILES_TO_CACHE = [

    "./",

    "./index.html",

    "./manifest.webmanifest",

    "./icon-192.png",

    "./icon-512.png",

    "./apple-touch-icon.png"

];



/* =========================================================
   INSTALLATION
========================================================= */

self.addEventListener(
    "install",
    event => {

        console.log(
            `[LiquidLab] Installation ${APP_VERSION}`
        );


        event.waitUntil(

            caches
                .open(
                    CACHE_NAME
                )

                .then(
                    cache => {

                        return cache.addAll(
                            FILES_TO_CACHE
                        );

                    }
                )

                .then(
                    () => {

                        /*
                            Permet au nouveau Service Worker
                            de passer directement en attente
                            d'activation.
                        */

                        return self.skipWaiting();

                    }
                )

        );

    }
);



/* =========================================================
   ACTIVATION
========================================================= */

self.addEventListener(
    "activate",
    event => {

        console.log(
            `[LiquidLab] Activation ${APP_VERSION}`
        );


        event.waitUntil(

            caches
                .keys()

                .then(
                    cacheNames => {

                        return Promise.all(

                            cacheNames

                                /*
                                    Ne supprimer QUE
                                    les anciens caches LiquidLab.
                                */

                                .filter(
                                    cacheName => {

                                        return (
                                            cacheName
                                                .toLowerCase()
                                                .startsWith(
                                                    "liquidlab-"
                                                )

                                            &&

                                            cacheName !==
                                            CACHE_NAME
                                        );

                                    }
                                )

                                .map(
                                    cacheName => {

                                        console.log(
                                            "[LiquidLab] Suppression ancien cache :",
                                            cacheName
                                        );


                                        return caches.delete(
                                            cacheName
                                        );

                                    }
                                )

                        );

                    }
                )

                .then(
                    () => {

                        /*
                            Prend immédiatement le contrôle
                            des pages LiquidLab ouvertes.
                        */

                        return self.clients.claim();

                    }
                )

        );

    }
);



/* =========================================================
   FETCH
========================================================= */

self.addEventListener(
    "fetch",
    event => {

        const request =
            event.request;


        /*
            -------------------------------------------------
            1. Ne jamais intercepter les requêtes non-GET

            CleanURI utilise par exemple POST.
            -------------------------------------------------
        */

        if (
            request.method !==
            "GET"
        ) {

            return;

        }


        const url =
            new URL(
                request.url
            );


        /*
            -------------------------------------------------
            2. Ne jamais intercepter les domaines externes

            Exemples :

            cleanuri.com
            api...
            services tiers...

            Ils doivent passer directement
            par le navigateur.
            -------------------------------------------------
        */

        if (
            url.origin !==
            self.location.origin
        ) {

            return;

        }


        /*
            -------------------------------------------------
            3. Stratégie NETWORK FIRST

            On essaie d'abord de récupérer
            la dernière version disponible.

            Si Internet ne fonctionne pas,
            on utilise le cache.
            -------------------------------------------------
        */

        event.respondWith(

            fetch(
                request
            )

                .then(
                    response => {

                        /*
                            Si la réponse réseau
                            n'est pas valide,
                            on la renvoie simplement
                            sans la mettre en cache.
                        */

                        if (
                            !response
                            ||
                            !response.ok
                        ) {

                            return response;

                        }


                        /*
                            Clone obligatoire :

                            une Response ne peut être
                            consommée qu'une fois.
                        */

                        const responseClone =
                            response.clone();


                        /*
                            Mise à jour du cache
                            en arrière-plan.
                        */

                        caches
                            .open(
                                CACHE_NAME
                            )

                            .then(
                                cache => {

                                    return cache.put(
                                        request,
                                        responseClone
                                    );

                                }
                            )

                            .catch(
                                error => {

                                    console.warn(
                                        "[LiquidLab] Impossible de mettre en cache :",
                                        request.url,
                                        error
                                    );

                                }
                            );


                        return response;

                    }
                )


                /*
                    Si le réseau échoue,
                    chercher dans le cache.
                */

                .catch(
                    async error => {

                        console.warn(
                            "[LiquidLab] Réseau indisponible :",
                            request.url,
                            error
                        );


                        const cachedResponse =
                            await caches.match(
                                request
                            );


                        if (
                            cachedResponse
                        ) {

                            return cachedResponse;

                        }


                        /*
                            Cas particulier :

                            si Safari demande une navigation
                            vers l'application et que cette URL
                            exacte n'est pas en cache,
                            essayer index.html.
                        */

                        if (
                            request.mode ===
                            "navigate"
                        ) {

                            const index =
                                await caches.match(
                                    "./index.html"
                                );


                            if (
                                index
                            ) {

                                return index;

                            }

                        }


                        /*
                            respondWith() DOIT recevoir
                            une vraie Response.

                            On évite ainsi :

                            "Returned response is null"
                        */

                        return new Response(

                            `
                            <!DOCTYPE html>

                            <html lang="fr">

                            <head>

                                <meta charset="UTF-8">

                                <meta
                                    name="viewport"
                                    content="width=device-width, initial-scale=1">

                                <title>
                                    LiquidLab hors ligne
                                </title>

                                <style>

                                    body {

                                        margin: 0;

                                        min-height: 100vh;

                                        display: grid;

                                        place-items: center;

                                        padding: 30px;

                                        box-sizing: border-box;

                                        background: #080d18;

                                        color: white;

                                        font-family:
                                            -apple-system,
                                            BlinkMacSystemFont,
                                            "Segoe UI",
                                            sans-serif;

                                        text-align: center;

                                    }

                                    div {

                                        max-width: 420px;

                                    }

                                    h1 {

                                        font-size: 24px;

                                    }

                                    p {

                                        color: #9ba8bd;

                                        line-height: 1.5;

                                    }

                                </style>

                            </head>


                            <body>

                                <div>

                                    <h1>
                                        💧 LiquidLab
                                    </h1>

                                    <p>
                                        Cette ressource n'est pas disponible
                                        hors ligne pour le moment.
                                    </p>

                                    <p>
                                        Reconnecte-toi à Internet puis
                                        recharge l'application.
                                    </p>

                                </div>

                            </body>

                            </html>
                            `,

                            {

                                status:
                                    503,

                                statusText:
                                    "Service Unavailable",

                                headers: {

                                    "Content-Type":
                                        "text/html; charset=utf-8"

                                }

                            }

                        );

                    }
                )

        );

    }
);



/* =========================================================
   COMMUNICATION AVEC INDEX.HTML
========================================================= */

/*
    Permet à LiquidLab de demander :

    - la version du Service Worker
    - le nom exact du cache actif

    Utilisé notamment pour afficher :

    Version installée :
    v2.3.1 · liquidlab-v2.3.1
*/

self.addEventListener(
    "message",
    event => {

        if (
            event.data?.type ===
            "GET_VERSION"
        ) {

            const response = {

                type:
                    "APP_VERSION",

                version:
                    APP_VERSION,

                cache:
                    CACHE_NAME

            };


            /*
                Méthode privilégiée :
                répondre directement
                au client ayant envoyé le message.
            */

            if (
                event.source
            ) {

                event.source.postMessage(
                    response
                );

            }

        }

    }
);
