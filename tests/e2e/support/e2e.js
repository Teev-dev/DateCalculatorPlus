// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Prevent uncaught exception from failing tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});

// Add custom command to check if element is visible and enabled
Cypress.Commands.add('shouldBeInteractive', { prevSubject: true }, (subject) => {
  cy.wrap(subject)
    .should('be.visible')
    .and('not.be.disabled');
});

// Add custom command for common calculator setup
Cypress.Commands.add('setupCalculator', (country = 'US') => {
  cy.get('[data-testid="country-select"]').click();
  cy.get(`[data-testid="country-option-${country}"]`).click();
  cy.get('[data-testid="quick-select-today"]').click();
}); 