module.exports = function(config) {
  config.set({
    mutator: "javascript",
    packageManager: "npm",
    reporters: ["html", "clear-text", "progress", "dashboard"],
    testRunner: "jest",
    transpilers: ["typescript", "babel", "webpack"],
    coverageAnalysis: "off",
    tsconfigFile: "tsconfig.json",
    mutate: ["src/**/*.ts"],
    babel: {
      optionsFile: ".babelrc"
    },
    webpack: {
      configFile: "webpack.config.js"
    }
  });
};
