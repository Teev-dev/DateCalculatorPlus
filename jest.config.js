module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'json'],
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.js',
    '<rootDir>/tests/integration/**/*.test.js'
  ],
  // Don't run Cypress tests with Jest
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/e2e/'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  // Silence console logs during tests
  silent: true,
  // Mock all .css imports
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/tests/mocks/styleMock.js'
  }
}; 