// Add custom jest matchers from jest-dom
import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn();

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  fetch.mockClear();
});

// Mock environment variables
process.env = {
  ...process.env,
  REACT_APP_HOLIDAY_API_BASE_URL: 'https://date.nager.at/api/v3',
  REACT_APP_HOLIDAY_API_KEY: 'test-api-key',
  REACT_APP_ENABLE_HOLIDAY_CACHING: 'true',
  REACT_APP_MAX_YEAR_RANGE: '5',
};

// Mock ResizeObserver which is not available in JSDOM
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Suppress console errors during tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Add missing DOM elements that might be required
beforeAll(() => {
  // Add any elements that calculatorService expects to find
  document.body.innerHTML = `
    <div id="countrySearch"></div>
    <div id="countryList"></div>
    <div id="calculator-form"></div>
  `;
}); 