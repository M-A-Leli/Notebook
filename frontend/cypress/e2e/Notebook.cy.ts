// describe('template spec', () => {
//   it('passes', () => {
//     cy.visit('https://example.cypress.io')
//   })
// })

describe('NotebookComponent', () => {
  beforeEach(() => {
    // Visit the application URL before each test
    cy.visit('http://localhost:4200/notebook');
  });

  it('should load the notebook page', () => {
    cy.contains('notebook').should('be.visible');
  });

  it('should load notes on init', () => {
    cy.intercept('GET', '/api/v1/notes', { fixture: 'notes.json' }).as('getNotes');
    cy.visit('http://localhost:4200/notebook');
    cy.wait('@getNotes');
    cy.get('.note').should('have.length', 2);
  });

  it('should create a new note', () => {
    cy.get('.create-note-button').click().debug();
    cy.get('input[name="title"]').type('New Note');
    cy.get('textarea[name="content"]').type('New Content');
    cy.get('.save-note-button').click();
    cy.contains('Note created successfully!').should('be.visible');
  });

  it('should edit a note', () => {
    cy.get('.edit-note-button').first().click().debug();
    cy.get('input[name="title2"]').clear().type('Updated Note');
    cy.get('textarea[name="content2"]').clear().type('Updated Content');
    cy.get('.save-note-button').click();
    cy.contains('Note updated successfully!').should('be.visible');
  });

  it('should delete a note', () => {
    cy.get('.delete-note-button').first().click().debug();
    cy.get('.confirm-delete-button').click();
    cy.contains('Note deleted successfully!').should('be.visible');
  });
});
