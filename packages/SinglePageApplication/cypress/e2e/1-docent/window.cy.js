/// <reference types="cypress" />

context('Window', () => {
  beforeEach(() => {
    cy.visit('https://localhost:5174/');
  });

  it('cy.document() - get the document object', () => {
    // https://on.cypress.io/document
    cy.document().should('have.property', 'charset').and('eq', 'UTF-8');
  });

  it('cy.title() - get the title', () => {
    // https://on.cypress.io/title
    cy.title().should('include', 'Portfolio Streamer');
  });

  it('Login header', () => {
    cy.contains('Docent login');
  });
});
