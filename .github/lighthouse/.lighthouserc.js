module.exports = {
    ci: {
      collect: {
        // collect options here
        settings: {
            chromeFlags: "--no-sandbox"
        }
      },
      assert: {
        preset: 'lighthouse:no-pwa',
        assertions: {
          "errors-in-console": "warn",
          "uses-text-compression": "off", //Handled externally
          "uses-long-cache-ttl": "off",
          "csp-xss": "off", //CSP handled in server outside of lighthouse
          "legacy-javascript": "off", //JavaScript is generated from Astro and can't be developer controlled
          "image-size-responsive": "warn", //We don't have any high resolution images avaliable
          "uses-responsive-images": "warn", //Ditto
          "unused-css-rules": "off", //False positives due to GTM scripts
          "unused-javascript": "off"
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
