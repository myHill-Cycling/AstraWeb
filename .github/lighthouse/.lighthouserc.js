const baseUrl = process.env.LIGHTHOUSE_BASE_URL ?? "https://127.0.0.1:4280/";

module.exports = {
    ci: {
      collect: {
        // collect options here
        settings: {
			
        },
		url: [
			new URL("/", baseUrl),
			new URL("/contact.html", baseUrl),
			new URL("/400.html", baseUrl),
			new URL("/401.html", baseUrl),
			new URL("/403.html", baseUrl),
			new URL("/404.html", baseUrl)
		]
      },
      assert: {
        preset: 'lighthouse:no-pwa',
        assertions: {
          "errors-in-console": "warn",
          "uses-text-compression": "off", //Handled externally
          "uses-long-cache-ttl": "off",
          "csp-xss": "off", //CSP handled in server outside of lighthouse
          "legacy-javascript": "off", //JavaScript is generated from Astro and can't be developer controlled
		  "unused-css-rules": "off",
          "unused-javascript": "off",
          "image-size-responsive": "warn", //We don't have any high resolution images avaliable
          "uses-responsive-images": "warn", //Ditto
        }
      },
      upload: {
        // upload options here
		target: "temporary-public-storage"
      },
      server: {
        // server options here
      },
      wizard: {
        // wizard options here
      },
    },
  };
