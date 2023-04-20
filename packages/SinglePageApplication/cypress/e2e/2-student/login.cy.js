/// <reference types="cypress" />

context('Window', () => {
  beforeEach(() => {
    cy.visit('https://localhost:5174/student');
  });

  it('admin login', () => {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.px-12 > .font-bold').type('test');
    cy.get('.font-extrabold').type('WEBd');
    cy.get('.text-3xl').click();
    /* ==== End Cypress Studio ==== */
    cy.wait(500);
    cy.reload();
    cy.get('.inline-flex').should('be.visible');
  });
});
