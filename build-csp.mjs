import { readFile, writeFile } from "fs/promises";
import { getCSP, SELF, DATA, UNSAFE_HASHES, NONE } from "csp-header";
import gaBase from "csp-preset-google-analytics";
import glob from "glob";
import * as cheerio from "cheerio";
import { createHash } from "crypto";

const fonts = {
    "style-src": ["https://fonts.googleapis.com:443"],
    "connect-src": ["https://fonts.googleapis.com"]
};

const cookies = {
    "style-src": [
        "https://cookiehub.net/",
        "https://static.cookiehub.com/",
        "'sha256-1z/7NiPfYq2hoFozHGzJKg6OUzne/YSqaCgvOeXuXOY='",
        "'sha256-aqNNdDLnnrDOnTNdkJpYlAxKVJtLt9CtFLklmInuUAE='"
    ],
    "script-src": [
        "https://cookiehub.net/",
        "https://dash.cookiehub.com/",
        "'sha256-aqNNdDLnnrDOnTNdkJpYlAxKVJtLt9CtFLklmInuUAE='"
    ],
    "connect-src": [
        "https://cookiehub.net/",
        "https://static.cookiehub.com/"
    ]
};

const gtm = {
    "style-src": [
        "https://www.googletagmanager.com/",
        "'sha256-/cz+p719dOFygDAqDgEjHhHSRaka+kWXk3WHAOXiURk='"
    ],
    "script-src": [
        "https://www.googletagmanager.com/"
    ],
    "img-src": [
        "https://www.googletagmanager.com/"
    ],
    "connect-src": [
        "https://www.googletagmanager.com/"
    ]
};

const ga = {
    ...gaBase,
    "img-src": [
        "https://*.google-analytics.com"
    ],
    "connect-src": [
        "https://*.google-analytics.com"
    ]
};

const scriptHashes = [];
const styleHashes = [];

function buildHash(data){
    return createHash("sha256").update(data, "utf-8").digest("base64");
}

const files = glob.sync("./dist/**/*.html");
console.info(`Generating hash data for files:\n  ${files.join("/n  ")}`);
for (const htmlFile of files) {
    const html = await readFile(htmlFile);
    const $ = cheerio.load(html);
    $("script").each((i, el) => {
      const self = $(el);
      scriptHashes.push(`'sha256-${buildHash(self.html())}'`);
    });
    $("[onload]").each((i, el) => {
        const self = $(el);
        const attr = self.attr("onload");
        scriptHashes.push(`'sha256-${buildHash(attr)}'`);
    });
    $("style").each((i, el) => {
        const self = $(el);
        styleHashes.push(`'sha256-${buildHash(self.html())}'`);
    });
}

const csp = {
    directives: {
        "default-src": SELF,
        "base-uri": SELF,
        "connect-src": [SELF],
        "img-src": [SELF, DATA],
        "style-src": [SELF, UNSAFE_HASHES, ...styleHashes],
        "script-src": [SELF, UNSAFE_HASHES, ...scriptHashes]
    },
    presets: [
        ga,
        fonts,
        cookies,
        gtm
    ]
};

const policyString = getCSP(csp);

const path = "./dist/staticwebapp.config.json";
const json = JSON.parse(await readFile(path));
console.debug("JSON config before header injection");
console.debug(json);
json.globalHeaders["Content-Security-Policy"] = policyString;
console.debug("JSON config after header injection");
console.debug(json);
await writeFile(path, JSON.stringify(json));

