import { version } from "$app/env";
import { assets, immutable, prerendered } from "$app/manifest";
import { self } from "$app/service-worker";

const CACHE = `banger-${version}`;
const ASSETS = [...immutable, ...assets, ...prerendered].map((asset) => `/${asset.path}`);

console.log(ASSETS);

const CACHE_DESTINATIONS = [
  "audio",
  "audioworklet",
  "font",
  "image",
  "manifest",
  "sharedworker",
  "style",
  "worker",
];

self.addEventListener("install", (event) => {
  // Create a new cache and add all files to it
  async function addFilesToCache() {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  }
  self.skipWaiting();
  event.waitUntil(addFilesToCache());
});

self.addEventListener("activate", (event) => {
  // Remove previous cached data from disk
  async function deleteOldCaches() {
    for (const key of await caches.keys()) {
      if (key !== CACHE) await caches.delete(key);
    }
  }

  event.waitUntil(
    (async () => {
      await deleteOldCaches();
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || !req.url.startsWith("http")) return;

  async function respond() {
    const url = new URL(event.request.url);
    const cache = await caches.open(CACHE);

    if (ASSETS.includes(url.pathname) || CACHE_DESTINATIONS.includes(req.destination)) {
      const response = await cache.match(url.pathname);

      if (response) {
        console.info(`(SW) ✅ - ${url.pathname}`);
        return response;
      } else {
        console.info(`(SW) ❌ - ${url.pathname}`);
      }
    }

    // for everything else, network only with offline fallback
    try {
      const response = await fetch(event.request);

      // if we're offline, fetch can return a value that is not a Response
      // instead of throwing - and we can't pass this non-Response to respondWith
      if (!(response instanceof Response)) {
        throw new Error("invalid response from fetch");
      }

      const shouldCache =
        CACHE_DESTINATIONS.includes(req.destination) &&
        !response.headers.get("cache-control")?.includes("no-store") &&
        response.status === 200;

      if (shouldCache) {
        cache.put(event.request, response.clone());
      }

      return response;
    } catch (err) {
      throw err;
    }
  }

  event.respondWith(respond());
});
