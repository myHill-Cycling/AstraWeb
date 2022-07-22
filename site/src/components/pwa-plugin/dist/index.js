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
async function buildManifestEntryTransform(ssgUrl, path) {
  const [size, { url, revision }] = await Promise.all([
    new Promise((resolve, reject) => {
      fs.lstat(path, (err, stats) => {
        if (err)
          reject(err);
        else
          resolve(stats.size);
      });
    }),
    buildManifestEntry(ssgUrl, path)
  ]);
  return { url, revision, size };
}
function isStatic(route) {
  if (!route.segments)
    return true;
  for (let i = 0; i < route.segments.length; i++) {
    for (let j = 0; j < route.segments[i].length; j++) {
      if (route.segments[i][j].dynamic)
        return false;
    }
  }
  return true;
}
function createManifestTransform(enableManifestTransform) {
  return async (entries) => {
    const pages = enableManifestTransform();
    if (pages) {
      const manifest = entries.filter((e) => !e.url.endsWith(".html"));
      const addRoutes = await Promise.all(pages.filter((r) => r.type === "page" && r.pathname && r.distURL && isStatic(r)).map((r) => {
        return buildManifestEntryTransform(r.pathname, r.distURL);
      }));
      manifest.push(...addRoutes);
      return { manifest };
    }
    return { manifest: entries };
  };
}
function getViteConfiguration(config, options, enableManifestTransform) {
  var _a, _b, _c;
  const plugin = (_b = (_a = config.vite) == null ? void 0 : _a.plugins) == null ? void 0 : _b.flat(Infinity).find((p) => p.name === "vite-plugin-pwa");
  if (plugin) {
    throw new Error("Remove the vite-plugin-pwa plugin from Vite Plugins entry in Astro config file, configure it via @astrojs/pwa integration");
  }
  const {
    strategies = "generateSW",
    registerType = "prompt",
    injectRegister,
    workbox = {},
    injectManifest = {},
    ...rest
  } = options;
  if (strategies === "generateSW") {
    const useWorkbox = { ...workbox };
    const newOptions = {
      ...rest,
      strategies,
      registerType,
      injectRegister
    };
    if (!useWorkbox.navigateFallback)
      useWorkbox.navigateFallback = ((_c = config.vite) == null ? void 0 : _c.base) ?? "/";
    newOptions.workbox = useWorkbox;
    newOptions.workbox.manifestTransforms = newOptions.workbox.manifestTransforms ?? [];
    newOptions.workbox.manifestTransforms.push(createManifestTransform(enableManifestTransform));
    return {
      plugins: [VitePWA(newOptions)]
    };
  }
  options.injectManifest = options.injectManifest ?? {};
  options.injectManifest.manifestTransforms = injectManifest.manifestTransforms ?? [];
  options.injectManifest.manifestTransforms.push(createManifestTransform(enableManifestTransform));
  return {
    plugins: [VitePWA(options)]
  };
}
async function regeneratePWA(dir, pwaPlugin) {
  const api = pwaPlugin == null ? void 0 : pwaPlugin.api;
  if (api && !api.disabled) {
    await api.generateSW();
  }
}
function src_default(options = {}) {
  let pwaPlugin;
  let data;
  const enableManifestTransform = () => {
    return data;
  };
  return {
    name: "@astrojs/pwa",
    hooks: {
      "astro:config:setup": ({ config, updateConfig }) => {
        updateConfig({ vite: getViteConfiguration(config, options, enableManifestTransform) });
      },
      "astro:config:done": ({ config }) => {
        pwaPlugin = config.vite.plugins.flat(Infinity).find((p) => p.name === "vite-plugin-pwa");
      },
      "astro:build:done": async ({ dir, routes }) => {
        data = routes;
        await regeneratePWA(dir, pwaPlugin);
      }
    }
  };
}
export {
  src_default as default
};
