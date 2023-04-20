/// <reference types="cypress" />

context('Window', () => {
  beforeEach(() => {
    cy.visit('https://localhost:5174/');

    cy.get('.px-12 > :nth-child(1) > :nth-child(1) > :nth-child(1) > .w-full').type('admin');
    cy.get('.w-4\\/5').type('admin');
    cy.get('.mt-8').click();

    cy.wait(500);
    cy.reload();
  });

  it('admin login', () => {});
});
