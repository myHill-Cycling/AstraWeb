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
        // assert options here
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