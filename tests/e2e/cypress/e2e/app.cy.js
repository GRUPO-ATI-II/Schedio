describe('App Boot Test', () => {
  it('Carga el frontend', () => {
    cy.visit('/')
    cy.get('body').should('exist')
  })
})
