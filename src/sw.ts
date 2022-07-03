/// <reference lib="WebWorker" />
import {precacheAndRoute, cleanupOutdatedCaches} from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import {googleFontsCache, imageCache} from "workbox-recipes";
import { registerRoute, Route } from "workbox-routing";
import {StaleWhileRevalidate} from "workbox-strategies";

// Give TypeScript the correct global.
declare let self: ServiceWorkerGlobalScope;

console.info("👷 - Installing service worker...");
const manifest = self.__WB_MANIFEST;
console.info("👷 - Revitalising asset caches...");
console.debug("👷 - Cleaing outdated caches...");
cleanupOutdatedCaches();
console.debug("👷 - Precaching assets...");
precacheAndRoute(manifest);
console.debug("👷 - Precached manifest");

console.debug("👷 - Configure font cache");
googleFontsCache();

console.debug("👷 - Configure image cache");
imageCache();

console.debug("👷 - Configure cookiehub cache");
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

console.debug("👷 - Activating...");
console.debug("👷 - Skipping waiting and claiming clients...");
void self.skipWaiting();
clientsClaim();
console.info("👷 - Installation complete");
