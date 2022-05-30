module.exports = {
    ci: {
      collect: {
        // collect options here
        staticDistDir: "./dist",
        settings: {
            chromeFlags: "--no-sandbox --headless",
            plugins: ["lighthouse-plugin-field-performance"]
        }
      },
      assert: {
        preset: 'lighthouse:no-pwa',
        assertions: {
          "csp-xss": "off", //CSP handled in server outside of lighthouse
          "legacy-javascript": "off", //JavaScript is generated from Astro and can't be developer controlled
          "image-size-responsive": "off" //We don't have any high resolution images avaliable
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