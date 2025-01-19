class MockAPIError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'APIError';
    this.status = status;
  }
}

const mockConfigModule = {
  holidayCache: {
    get: jest.fn(),
    set: jest.fn(),
  },
  createAPIRequest: jest.fn(endpoint => `http://mock-api${endpoint}`),
  handleAPIResponse: jest.fn(),
  API_CONFIG: {
    HOLIDAY_API: {
      ENDPOINTS: {
        PUBLIC_HOLIDAYS: '/PublicHolidays',
        AVAILABLE_COUNTRIES: '/AvailableCountries'
      }
    }
  },
  APIError: MockAPIError
};

module.exports = mockConfigModule; 