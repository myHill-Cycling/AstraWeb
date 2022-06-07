import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import { imagetools } from "vite-imagetools";
import critters from "astro-critters";
import favicon from "astro-webmanifest";


// https://astro.build/config
export default defineConfig({
  site: "https://www.myhillcycling.co.uk",
  build: {
    // Example: Generate `page.html` instead of `page/index.html` during build.
    format: "file"
  },
  experimental: {
    integrations: true
  },
  integrations: [preact(), tailwind(), sitemap(), robotsTxt(), critters(), favicon({
      icon: "./assets/images/favicon.png",
      icons: [
        {
          src: "icons/icon-48x48.png",
          sizes: "48x48",
          type: "image/png",
          purpose: "maskable"
        },
        {
          src: "icons/icon-72x72.png",
          sizes: "72x72",
          type: "image/png",
          purpose: "maskable"
        },
        {
          src: "icons/icon-96x96.png",
          sizes: "96x96",
          type: "image/png",
          purpose: "maskable"
        },
        {
          src: "icons/icon-144x144.png",
          sizes: "144x144",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "icons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable"
        },
        {
          src: "icons/icon-256x256.png",
          sizes: "256x256",
          type: "image/png",
          purpose: "maskable"
        },
        {
          src: "icons/icon-384x384.png",
          sizes: "384x384",
          type: "image/png",
          purpose: "maskable"
        },
        {
          src: "icons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable"
        }
      ],
      config: {
        insertAppleTouchLinks: true
      },
      name: "myHill Cycling",
      description: "Sportives and weekend training camps set in the peak district to get more people on their bikes!",
      developerName: "Vespion Softworks",
      //developerURL: "", // prevent retrieving from the nearest package.json
      // background: "#ffffff",
      theme_color: "#f70702",
      background_color: "#f70702",
      display: "browser",
      start_url: "/",
      scope: "/"
  })],
  vite: {
    plugins: [imagetools()],
    ssr: {
      external: ["svgo"]
    }
  }
});