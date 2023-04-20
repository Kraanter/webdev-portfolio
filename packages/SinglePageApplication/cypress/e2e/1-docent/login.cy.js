/// <reference types="cypress" />

context('Window', () => {
  beforeEach(() => {
    cy.visit('https://localhost:5174/');
  });

  it('password show', () => {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.w-4\\/5').type('test');
    cy.get('.bg-gray-700').click();
    cy.get('.w-4\\/5').should('have.prop', 'type', 'text');
    /* ==== End Cypress Studio ==== */
  });

  it('password hide', () => {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.w-4\\/5').type('test');
    cy.get('.bg-gray-700').click();
    cy.get('.bg-gray-700').click();
    cy.get('.w-4\\/5').should('have.prop', 'type', 'password');
    /* ==== End Cypress Studio ==== */
  });

  it('admin login', () => {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.px-12 > :nth-child(1) > :nth-child(1) > :nth-child(1) > .w-full').type('admin');
    cy.get('.w-4\\/5').type('admin');
    cy.get('.mt-8').click();
    /* ==== End Cypress Studio ==== */
    // /* ==== Generated with Cypress Studio ==== */
    // cy.get('.px-12 > :nth-child(1) > :nth-child(1) > :nth-child(1) > .w-full').type('admin');
    // cy.get('.w-4\\/5').type('admin');
    // cy.get('.mt-8').click();
    // /* ==== End Cypress Studio ==== */
    cy.wait(500);
    cy.reload();
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.inline-flex').should('be.visible');
    /* ==== End Cypress Studio ==== */
  });
});
