const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:4200",
    specPattern: "**/*.cy.{js,jsx,ts,tsx}",
    supportFile: false,
    reporter: "junit",
    reporterOptions: {
      mochaFile: "results/results.xml",
      toConsole: true,
      useFullSuiteTitle: false, // Fundamental para evitar errores de parseo
    },
  },
});
