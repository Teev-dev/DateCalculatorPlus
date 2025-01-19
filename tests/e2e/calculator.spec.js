describe('Holiday Calculator', () => {
  beforeEach(() => {
    // Visit the calculator page before each test
    cy.visit('/calculator');
  });

  describe('Form Elements', () => {
    it('should load all form elements correctly', () => {
      cy.get('[data-testid="country-select"]').should('be.visible');
      cy.get('[data-testid="start-date-input"]').should('be.visible');
      cy.get('[data-testid="working-days-input"]').should('be.visible');
      cy.get('[data-testid="calculate-button"]').should('be.visible');
    });

    it('should have working quick select date buttons', () => {
      cy.get('[data-testid="quick-select-today"]').click();
      cy.get('[data-testid="start-date-input"]').should('have.value', 
        new Date().toISOString().split('T')[0]
      );

      cy.get('[data-testid="quick-select-tomorrow"]').click();
      cy.get('[data-testid="start-date-input"]').should('have.value',
        new Date(Date.now() + 86400000).toISOString().split('T')[0]
      );
    });

    it('should have working month quick select buttons', () => {
      cy.get('[data-testid="quick-select-1-month"]').click();
      cy.get('[data-testid="working-days-input"]').should('have.value', '21');

      cy.get('[data-testid="quick-select-3-months"]').click();
      cy.get('[data-testid="working-days-input"]').should('have.value', '63');
    });
  });

  describe('Calculation Workflow', () => {
    it('should complete a successful calculation', () => {
      // Select country
      cy.get('[data-testid="country-select"]').click();
      cy.get('[data-testid="country-option-US"]').click();

      // Set start date
      cy.get('[data-testid="quick-select-today"]').click();

      // Set working days
      cy.get('[data-testid="quick-select-1-month"]').click();

      // Calculate
      cy.get('[data-testid="calculate-button"]').click();

      // Verify result appears
      cy.get('[data-testid="result-message"]')
        .should('be.visible')
        .and('contain', 'End date')
        .and('contain', 'holidays');
    });

    it('should handle API errors gracefully', () => {
      // Force API error
      cy.intercept('GET', '**/PublicHolidays/**', {
        statusCode: 500,
        body: 'Server Error'
      });

      // Attempt calculation
      cy.get('[data-testid="country-select"]').click();
      cy.get('[data-testid="country-option-US"]').click();
      cy.get('[data-testid="quick-select-today"]').click();
      cy.get('[data-testid="working-days-input"]').type('10');
      cy.get('[data-testid="calculate-button"]').click();

      // Verify error message
      cy.get('[data-testid="error-message"]')
        .should('be.visible')
        .and('contain', 'Error');
    });
  });

  describe('Form Validation', () => {
    it('should require country selection', () => {
      cy.get('[data-testid="quick-select-today"]').click();
      cy.get('[data-testid="working-days-input"]').type('10');
      cy.get('[data-testid="calculate-button"]').click();

      cy.get('[data-testid="country-select-error"]')
        .should('be.visible')
        .and('contain', 'Please select a country');
    });

    it('should require start date', () => {
      cy.get('[data-testid="country-select"]').click();
      cy.get('[data-testid="country-option-US"]').click();
      cy.get('[data-testid="working-days-input"]').type('10');
      cy.get('[data-testid="calculate-button"]').click();

      cy.get('[data-testid="start-date-error"]')
        .should('be.visible')
        .and('contain', 'Please select a start date');
    });

    it('should validate working days input', () => {
      cy.get('[data-testid="working-days-input"]').type('-1');
      cy.get('[data-testid="calculate-button"]').click();

      cy.get('[data-testid="working-days-error"]')
        .should('be.visible')
        .and('contain', 'Please enter a valid number');
    });
  });

  describe('Result Display', () => {
    beforeEach(() => {
      // Setup for a successful calculation
      cy.get('[data-testid="country-select"]').click();
      cy.get('[data-testid="country-option-US"]').click();
      cy.get('[data-testid="quick-select-today"]').click();
      cy.get('[data-testid="working-days-input"]').type('10');
    });

    it('should display formatted result message', () => {
      cy.get('[data-testid="calculate-button"]').click();

      cy.get('[data-testid="result-message"]').within(() => {
        cy.get('[data-testid="result-country"]').should('be.visible');
        cy.get('[data-testid="result-start-date"]').should('be.visible');
        cy.get('[data-testid="result-end-date"]').should('be.visible');
        cy.get('[data-testid="result-working-days"]').should('be.visible');
        cy.get('[data-testid="result-holidays"]').should('be.visible');
      });
    });

    it('should highlight end date in result', () => {
      cy.get('[data-testid="calculate-button"]').click();

      cy.get('[data-testid="result-end-date"]')
        .should('have.class', 'highlighted-date');
    });
  });
}); 