//Dependencies and variables
const FILES_TO_CACHE = [
    "/",
    "/db.js",
    "/index.js",
    "/manifest.json",
    "/styles.css",
    "./icons/icon-192x192.png",
    "./icons/icon-512x512.png",
];

// static cache for all public folders
const CACHE_NAME = "static-cache-v2";
// user input data / api data / database day
const DATA_CACHE_NAME = "data-cache-v1";

//Installs service worker when installing PWA

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Your files were pre-cached successfully!");
            return cache.addAll(FILES_TO_CACHE);
          })
        );

        self.skipWaiting();
    });

//Activate handler that helps clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((keyList) => {
          return Promise.all(
            keyList.map((key) => {
                if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                  console.log("Removing old cache data", key);
                  return caches.delete(key);
                }
            })
        );
    })
);
      
    self.clients.claim();
});            

//Cache responses for requests for data - opens the data cache
self.addEventListener("fetch", (event) => {
    if (event.request.url.includes("/api/")) {
        console.log("[Service Worker] Fetch (data)", event.request.url);
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then((cache) => {
                return fetch(event.request)
                    .then((response) => {
                        if (response.status === 200) {
                            cache.put(event.request.url, response.clone());
                            }
                            return response;
                        })
                        .catch((err) => {
                            //Network request failed, try to get it from cache
                            return cache.match(event.request);
                        });
                    })
            );
        return;
    } 
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((response) => {
              return response || fetch(event.request);
            });
          })
        );
      });