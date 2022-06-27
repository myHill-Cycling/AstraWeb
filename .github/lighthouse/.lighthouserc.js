module.exports = {
    ci: {
      collect: {
        startServerCommand: "yarn run start",
        startServerReadyPattern: "Server listening on: 127.0.0.1:3000",
        // collect options here
        settings: {
            chromeFlags: "--no-sandbox"
        }
      },
      assert: {
        preset: 'lighthouse:no-pwa',
        assertions: {
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
      },
      server: {
        // server options here
      },
      wizard: {
        // wizard options here
      },
    },
  };