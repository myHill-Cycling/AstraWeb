/// <reference lib="WebWorker" />
import { clientsClaim, cacheNames } from 'workbox-core'
import { registerRoute, Route } from 'workbox-routing'
import { ExpirationPlugin } from 'workbox-expiration'
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import {
  StaleWhileRevalidate
} from 'workbox-strategies'
import { ManifestEntry } from 'workbox-build'

// Give TypeScript the correct global.
// @ts-ignore
declare let self: ServiceWorkerGlobalScope
declare type ExtendableEvent = any

function runPrecache() {
    const manifest = self.__WB_MANIFEST as Array<ManifestEntry>

    cleanupOutdatedCaches();

    precacheAndRoute(manifest);
}

function daysToSeconds(days: number){
    return 60 * 60 * 24 * days;
}

function registerSWRCache(cache: RequestDestination, maxAge: number){
    const route = new Route(({ request, sameOrigin }) => {
        return sameOrigin && request.destination === cache
    }, new StaleWhileRevalidate({
        cacheName: `${cacheNames.prefix}-${cache}-${cacheNames.suffix}`,
        plugins: [
            new ExpirationPlugin({
              maxAgeSeconds: maxAge,
            })
          ]
    }));

    registerRoute(route);
}

export default function() {
    runPrecache();
    registerSWRCache("image", daysToSeconds(30));
    registerSWRCache("script", daysToSeconds(120));
    registerSWRCache("style", daysToSeconds(120));
}