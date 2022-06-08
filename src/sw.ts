import {precacheAndRoute, cleanupOutdatedCaches} from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import {googleFontsCache, imageCache} from "workbox-recipes";
import { registerRoute, Route } from "workbox-routing";
import {StaleWhileRevalidate} from "workbox-strategies";

// Give TypeScript the correct global.
//@ts-ignore
declare let self: ServiceWorkerGlobalScope;


const manifest = self.__WB_MANIFEST;
console.debug("Cleaning outdated asset caches...");
cleanupOutdatedCaches();
console.debug("SW - Precaching assets...");
precacheAndRoute(manifest);
console.debug("SW - Precached manifest");

console.debug("SW - Configure font cache");
googleFontsCache();

console.debug("SW - Configure image cache");
imageCache();

console.debug("SW - Configure cookiehub cache");
const cookiehub = new Route(({ request }) => {
    if(request.destination !== "style" && request.destination !== "script") {
        return false;
    }

    return request.url.startsWith("https://cookiehub.net") || request.url.startsWith("https://static.cookiehub.com/");
  }, new StaleWhileRevalidate());
registerRoute(cookiehub);

console.debug("SW - Configure GTM cache");
const gtm = new Route(({ request }) => {
    if(request.destination !== "style" && request.destination !== "script") {
        return false;
    }

    return request.url.startsWith("https://www.googletagmanager.com");
  }, new StaleWhileRevalidate());
registerRoute(gtm);

console.debug("Activating...");
//@ts-ignore
self.skipWaiting();
clientsClaim();