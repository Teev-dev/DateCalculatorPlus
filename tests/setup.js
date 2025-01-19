// Mock fetch globally
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([])
  })
);

// Clear all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  // Reset fetch mock default behavior
  global.fetch.mockImplementation(() => 
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([])
    })
  );
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