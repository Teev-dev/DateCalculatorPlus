import { getHolidaysForCountry, getAvailableCountries, HolidayApiError } from '../../../src/features/holidays/services/holidayApiService';
import { holidayCache, createAPIRequest, handleAPIResponse, API_CONFIG, APIError } from '../../../src/config/apiConfig';

// Mock the config module
jest.mock('../../../src/config/apiConfig', () => require('../../mocks/configMock'));

describe('holidayApiService', () => {
  // Mock fetch globally
  global.fetch = jest.fn();

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset handleAPIResponse default behavior
    handleAPIResponse.mockImplementation(async (response) => {
      if (!response.ok) {
        const error = new APIError(`API Error: ${response.status}`, response.status);
        error.status = response.status;
        throw error;
      }
      return response.json();
    });
  });

  describe('getHolidaysForCountry', () => {
    const mockHolidays = [
      {
        date: '2024-01-01',
        name: "New Year's Day",
        localName: "New Year's Day",
        countryCode: 'US',
        fixed: true,
        global: true,
        types: ['Public']
      }
    ];

    it('should throw error if country code is not provided', async () => {
      await expect(getHolidaysForCountry()).rejects.toThrow('Country code is required');
    });

    it('should throw error if country code is invalid', async () => {
      await expect(getHolidaysForCountry('INVALID')).rejects.toThrow('Invalid country code');
    });

    it('should return cached data if available', async () => {
      const cachedHolidays = [{ 
        date: new Date('2024-01-01'),
        name: 'Cached Holiday',
        type: 'Public'
      }];
      holidayCache.get.mockReturnValue(cachedHolidays);

      const result = await getHolidaysForCountry('US', 2024);
      
      expect(result).toBe(cachedHolidays);
      expect(holidayCache.get).toHaveBeenCalledWith('US', 2024);
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should fetch and transform holidays when cache is empty', async () => {
      // Setup mocks
      holidayCache.get.mockReturnValue(null);
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockHolidays)
      };
      global.fetch.mockResolvedValueOnce(mockResponse);
      handleAPIResponse.mockResolvedValueOnce(mockHolidays);

      const result = await getHolidaysForCountry('US', 2024);

      // Verify API call
      expect(createAPIRequest).toHaveBeenCalledWith(
        `${API_CONFIG.HOLIDAY_API.ENDPOINTS.PUBLIC_HOLIDAYS}/2024/US`
      );
      expect(fetch).toHaveBeenCalled();

      // Verify result transformation
      expect(result).toEqual([{
        date: expect.any(Date),
        name: "New Year's Day",
        localName: "New Year's Day",
        countryCode: 'US',
        fixed: true,
        global: true,
        type: 'Public'
      }]);

      // Verify caching
      expect(holidayCache.set).toHaveBeenCalledWith('US', 2024, result);
    });

    it('should handle API errors correctly', async () => {
      holidayCache.get.mockReturnValue(null);
      const errorResponse = {
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Network error' })
      };
      global.fetch.mockResolvedValueOnce(errorResponse);
      handleAPIResponse.mockRejectedValueOnce(new APIError('API Error: 500', 500));

      await expect(getHolidaysForCountry('US', 2024))
        .rejects
        .toThrow('API Error: 500');
    });

    it('should handle API response errors', async () => {
      holidayCache.get.mockReturnValue(null);
      const errorResponse = {
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Not found' })
      };
      global.fetch.mockResolvedValueOnce(errorResponse);
      handleAPIResponse.mockRejectedValueOnce(new APIError('API Error: 404', 404));

      await expect(getHolidaysForCountry('US', 2024))
        .rejects
        .toThrow('API Error: 404');
    });
  });

  describe('getAvailableCountries', () => {
    const mockCountries = [
      { countryCode: 'US', name: 'United States' },
      { countryCode: 'GB', name: 'United Kingdom' }
    ];

    it('should fetch available countries successfully', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockCountries)
      };
      global.fetch.mockResolvedValueOnce(mockResponse);
      handleAPIResponse.mockResolvedValueOnce(mockCountries);

      const result = await getAvailableCountries();

      expect(createAPIRequest).toHaveBeenCalledWith(
        API_CONFIG.HOLIDAY_API.ENDPOINTS.AVAILABLE_COUNTRIES
      );
      expect(result).toEqual(mockCountries);
    });

    it('should handle API errors correctly', async () => {
      const errorResponse = {
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Network error' })
      };
      global.fetch.mockResolvedValueOnce(errorResponse);
      handleAPIResponse.mockRejectedValueOnce(new APIError('API Error: 500', 500));

      await expect(getAvailableCountries())
        .rejects
        .toThrow('API Error: 500');
    });

    it('should handle API response errors', async () => {
      const errorResponse = {
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Server error' })
      };
      global.fetch.mockResolvedValueOnce(errorResponse);
      handleAPIResponse.mockRejectedValueOnce(new APIError('API Error: 500', 500));

      await expect(getAvailableCountries())
        .rejects
        .toThrow('API Error: 500');
    });
  });
}); 