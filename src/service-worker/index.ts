import { buildFiles, publicFiles, version } from "virtual:typed-sw-extras";

declare let self: ServiceWorkerGlobalScope;

const CACHE = `banger-${version}`;
const ASSETS = [...buildFiles, ...publicFiles];

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
  async function addFilesToCache() {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  }
  self.skipWaiting();
  event.waitUntil(addFilesToCache());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim();
      for (const key of await caches.keys()) {
        if (key !== CACHE) await caches.delete(key);
      }
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

    const response = await fetch(event.request);

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
  }

  event.respondWith(respond());
});
