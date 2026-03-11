describe("App Boot Test", () => {
  // Mapeado a la clave correspondiente en Zephyr
  it("SCH-T11: Carga el frontend correctamente", () => {
    cy.visit("/");
    cy.get("body").should("exist");
  });
});
