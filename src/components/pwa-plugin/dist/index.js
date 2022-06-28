import { VitePWA } from "vite-plugin-pwa";
import crypto from "crypto";
import fs from "fs";
function buildManifestEntry(url, path) {
  return new Promise((resolve, reject) => {
    const cHash = crypto.createHash("MD5");
    const stream = fs.createReadStream(path);
    stream.on("error", (err) => {
      reject(err);
    });
    stream.on("data", (chunk) => {
      cHash.update(chunk);
    });
    stream.on("end", () => {
      return resolve({
        url,
        revision: `${cHash.digest("hex")}`
      });
    });
  });
}
function lookupPWAVitePlugin(config) {
  const plugins = config.vite.plugins ?? [];
  for (const p of plugins) {
    if (Array.isArray(p)) {
      return p.find((p1) => p1 && !Array.isArray(p1) && p1.name === "vite-plugin-pwa");
    }
  }
  return void 0;
}
function getViteConfiguration(config, options) {
  if (lookupPWAVitePlugin(config)) {
    throw new Error("Remove the vite-plugin-pwa plugin from Astro Vite Plugins entry, use only @astrojs/pwa integration");
  }
  return {
    plugins: [VitePWA(options)]
  };
}
async function regeneratePWA(dir, routes, pwaPlugin) {
  const api = pwaPlugin == null ? void 0 : pwaPlugin.api;
  if (routes && api && !api.disabled) {
    const addRoutes = await Promise.all(routes.filter((r) => r.type === "page" && r.pathname && r.distURL).map((r) => {
      return buildManifestEntry(r.pathname, r.distURL);
    }));
    api.extendManifestEntries((manifestEntries) => {
      manifestEntries.push(...addRoutes);
      return manifestEntries;
    });
    api.generateBundle();
    await api.generateSW();
  }
}
function src_default(options = {}) {
  let pwaPlugin;
  return {
    name: "@astrojs/pwa",
    hooks: {
      "astro:config:setup": ({ config, updateConfig }) => {
        updateConfig({ vite: getViteConfiguration(config, options) });
      },
      "astro:config:done": ({ config }) => {
        pwaPlugin = lookupPWAVitePlugin(config);
      },
      "astro:build:done": async ({ dir, routes }) => {
        await regeneratePWA(dir, routes, pwaPlugin);
      }
    }
  };
}
export {
  src_default as default
};
