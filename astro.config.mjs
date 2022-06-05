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
      config: {
        iconPurpose: ["maskable", "any"],
        insertAppleTouchLinks: true
      },
      name: "myHill Cycling",
      description: "Sportives and weekend training camps set in the peak district to get more people on their bikes!",
      developerName: "Vespion Softworks",
      //developerURL: "", // prevent retrieving from the nearest package.json
      background: "#ffffff",
      theme_color: "#f70702",
      display: "browser",
      start_url: "/",
      scope: "/"
  })],
  vite: {
    plugins: [imagetools() // favicons({
    //   inject: true,
    //   cache: true,
    
    //   path: "./assets/favi",
    //   icons: {
    //     android: {
    //       mask: true,
    //       source: "./assets/images/favicon.png"
    //     },
    //     windows: {
    //       mask: true,
    //       source: "./assets/images/favicon.png"
    //     },
    //     appleIcon: {
    //       mask: true,
    //       source: "./assets/images/favicon.png"
    //     },
    //     appleStartup: {
    //       mask: true,
    //       source: "./assets/images/favicon.png"
    //     },
    //     favicons: {
    //       mask: true,
    //       source: "./assets/images/favicon.png"
    //     }
    //   }
    // })
    ],
    ssr: {
      external: ["svgo"]
    }
  }
});