const SW_VERSION = "0.0.3";
const CACHE_NAME = "banger";
const URLS_TO_CACHE = [
  "/index.html",
  "/styles.css",
  "/opensearch.xml",
  "/favicon.svg",
];

// Install event - clean all caches and cache new files
self.addEventListener("install", (event) => {
  // Skip the waiting phase and activate immediately
  self.skipWaiting();

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log("Deleting cache:", cacheName);
            return caches.delete(cacheName);
          })
        );
      })
      .then(() => {
        return caches.open(CACHE_NAME);
      })
      .then((cache) => {
        console.log("Cache opened");
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Activate event - claim clients so the new service worker takes over immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch event - serve from cache or fetch from network
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // Don't cache the service worker itself
  if (url.pathname === "/sw.js") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found
      if (response) {
        return response;
      }

      // Clone the request because it's a one-time use stream
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then((response) => {
        // Check if valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Only cache requests with supported schemes (http or https)
        const url = new URL(event.request.url);
        if (url.protocol !== "http:" && url.protocol !== "https:") {
          console.log(
            `Skipping cache for unsupported scheme: ${url.protocol}`,
            url.href
          );
          return response;
        }

        // Clone the response because it's a one-time use stream
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          try {
            cache.put(event.request, responseToCache);
          } catch (error) {
            console.error("Error caching response:", error, event.request.url);
          }
        });

        return response;
      });
    })
  );
});
