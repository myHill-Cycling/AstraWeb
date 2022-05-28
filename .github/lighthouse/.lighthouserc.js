module.exports = {
    ci: {
      collect: {
        // collect options here
        staticDistDir: "./dist",
        settings: {
            plugins: ["lighthouse-plugin-field-performance"]
        }
      },
      assert: {
        preset: 'lighthouse:recommended',
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