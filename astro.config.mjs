import { defineConfig } from "astro/config";
import { readFile } from "fs/promises";
import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import { imagetools } from "vite-imagetools"; // import { VitePWA } from "vite-plugin-pwa";

import favicons from "@myhill-cycling/astro-favicon-intergration";
const faviconOptions = JSON.parse(await readFile("./assets/images/favi/faviconDescriptor.json"));
import dotenv from "dotenv";
import critters from "astro-critters";
dotenv.config({
  path: "./.env.local"
});


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
  integrations: [preact(), tailwind(), favicons(faviconOptions, process.env.RFG_API_KEY, "./.cache/favi"), sitemap(), robotsTxt(), critters()],
  vite: {
    plugins: [imagetools() // VitePWA({
    //   manifest: false, //RFG already makes a manifest
    //   strategies: 'injectManifest',
    //   registerType: 'autoUpdate',
    //   srcDir: './src/worker',
    //   filename: 'sw.ts',
    //   includeAssets: ["robots.txt"]
    // })
    ],
    ssr: {
      external: ["svgo"]
    }
  }
});