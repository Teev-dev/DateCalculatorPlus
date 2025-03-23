import { getHolidaysForCountry, getAvailableCountries } from '../../../src/features/holidays/services/holidayApiService';
import { createAPIRequest } from '../../../src/config/apiConfig';
import { HolidayApiError } from '../../../src/config/apiConfig';

jest.mock('../../../src/config/apiConfig', () => ({
  createAPIRequest: jest.fn(),
  HolidayApiError: jest.requireActual('../../../src/config/apiConfig').HolidayApiError
}));

describe('holidayApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getHolidaysForCountry', () => {
    it('should return cached data if available', async () => {
      const mockHolidays = [
        { date: '2024-01-01', name: 'New Year\'s Day' },
        { date: '2024-01-15', name: 'Martin Luther King Jr. Day' }
      ];

      createAPIRequest.mockResolvedValueOnce(mockHolidays);

      const result = await getHolidaysForCountry('US', 2024);
      expect(result).toEqual(mockHolidays);
      expect(createAPIRequest).toHaveBeenCalledTimes(1);

      // Second call should use cache
      const cachedResult = await getHolidaysForCountry('US', 2024);
      expect(cachedResult).toEqual(mockHolidays);
      expect(createAPIRequest).toHaveBeenCalledTimes(1);
    });

    it('should fetch and transform holidays when cache is empty', async () => {
      const mockHolidays = [
        { date: '2024-01-01', name: 'New Year\'s Day' },
        { date: '2024-01-15', name: 'Martin Luther King Jr. Day' }
      ];

      createAPIRequest.mockResolvedValueOnce(mockHolidays);

      const result = await getHolidaysForCountry('US', 2024);
      expect(result).toEqual(mockHolidays);
      expect(createAPIRequest).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors correctly', async () => {
      createAPIRequest.mockRejectedValueOnce(new HolidayApiError('API Error: 500', 500));

      await expect(getHolidaysForCountry('US', 2024))
        .rejects
        .toThrow('API Error: 500');
    });

    it('should handle API response errors', async () => {
      createAPIRequest.mockRejectedValueOnce(new HolidayApiError('API Error: 404', 404));

      await expect(getHolidaysForCountry('US', 2024))
        .rejects
        .toThrow('API Error: 404');
    });
  });

  describe('getAvailableCountries', () => {
    const mockCountries = [
      { code: 'US', name: 'United States' },
      { code: 'GB', name: 'United Kingdom' }
    ];

    it('should fetch available countries successfully', async () => {
      createAPIRequest.mockResolvedValueOnce(mockCountries);

      const result = await getAvailableCountries();
      expect(result).toEqual(mockCountries);
      expect(createAPIRequest).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors correctly', async () => {
      createAPIRequest.mockRejectedValueOnce(new HolidayApiError('API Error: 500', 500));

      await expect(getAvailableCountries())
        .rejects
        .toThrow('API Error: 500');
    });

    it('should handle API response errors', async () => {
      createAPIRequest.mockRejectedValueOnce(new HolidayApiError('API Error: 500', 500));

      await expect(getAvailableCountries())
        .rejects
        .toThrow('API Error: 500');
    });
  });
}); 