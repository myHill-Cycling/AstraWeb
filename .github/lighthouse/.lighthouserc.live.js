const base = require("./.lighthouserc.js");



module.exports = {
    ci: {
      collect: {
        // collect options here
        ...base.ci.collect,
        staticDistDir: undefined
      },
      assert: base.ci.assert,
      upload: base.ci.upload,
      server: base.ci.server,
      wizard: base.ci.wizard
    },
  };