import { readFile, writeFile } from "fs/promises";
import { getCSP, SELF, DATA, UNSAFE_HASHES, NONE } from "csp-header";
import gaBase from "csp-preset-google-analytics";

const fonts = {
    "style-src": ["https://fonts.googleapis.com:443"],
    "connect-src": ["https://fonts.googleapis.com"]
}

const cookies = {
    "style-src": [
        "https://cookiehub.net/",
        "https://static.cookiehub.com/"
    ],
    "script-src": [
        "https://cookiehub.net/"
    ]
}

const gtm = {
    "style-src": [
        "https://cookiehub.net/",
        "https://static.cookiehub.com/"
    ],
    "script-src": [
        "https://www.googletagmanager.com/"
    ]
}

const ga = {
    ...gaBase,
    "img-src": [
        "https://*.google-analytics.com"
    ],
    "connect-src": [
        "https://*.google-analytics.com"
    ]
}

// Onload hash "'sha256-7OYe+LAAHfcHW+MR8MWL3ZnFtA1ZZDMcV8KhE3AicPU='"

const policyString = getCSP({
    directives: {
        "default-src": SELF,
        "base-uri": SELF,
        "connect-src": [SELF],
        "img-src": [SELF, DATA],
        "style-src": [SELF, UNSAFE_HASHES, "'sha256-cfRqpfpH3aNRf610Pd7Z9xYLs/xPgANlDyr8famhgmw='", "'sha256-IHcFpj9cDflFUArOVL8QjEl30/zmBBfDVUKc2Fi5Vy4='", "'sha256-1z/7NiPfYq2hoFozHGzJKg6OUzne/YSqaCgvOeXuXOY='", "'sha256-aqNNdDLnnrDOnTNdkJpYlAxKVJtLt9CtFLklmInuUAE='"],
        "script-src": [SELF, DATA, UNSAFE_HASHES, "'sha256-7OYe+LAAHfcHW+MR8MWL3ZnFtA1ZZDMcV8KhE3AicPU='", "'sha256-ZoH6vV5J6lfvjut2ErMcdZ2nnnT8u7x/cqqrPq7MGNY='", "'sha256-DHyC7uBfNyNRMWTMDvcVnj7JdNRT4p2EcpC+IWFdagg='"]
    },
    presets: [
        ga,
        fonts,
        cookies,
        gtm
    ]
});

const path = "./dist/staticwebapp.config.json";
const json = JSON.parse(await readFile(path));
console.log(json);
json.globalHeaders["Content-Security-Policy"] = policyString;
console.log(json);
await writeFile(path, JSON.stringify(json));

