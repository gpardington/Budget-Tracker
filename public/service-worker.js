//Dependencies and variables
const FILES_TO_CACHE = [
    "/",
    "/db.js",
    "/index.js",
    "/manifest.json",
    "/styles.css",
    "/icons/icon-512x512.png",
    "/icons/icon-192x192.png",
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(PRECACHE)
            .then(cache => cache.addAll(FILES_TO_CACHE))
            .then(self.skipWaiting())
    );
});