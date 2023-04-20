/// <reference types="cypress" />

context('Window', () => {
  beforeEach(() => {
    cy.visit('https://localhost:5174/student');

    cy.get('.px-12 > .font-bold').type('test');
    cy.get('.font-extrabold').type('WEBd');
    cy.get('.text-3xl').click();

    cy.wait(500);
    cy.reload();
  });

  it('admin login', () => {});
});
