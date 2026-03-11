const { defineConfig } = require("cypress");

// Desde tu máquina usar localhost; en Docker/CI usar CYPRESS_BASE_URL=http://frontend:4200
const baseUrl = process.env.CYPRESS_BASE_URL || "http://localhost:4200";

module.exports = defineConfig({
  e2e: {
    baseUrl,
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: false
  }
});