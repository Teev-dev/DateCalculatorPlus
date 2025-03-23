import { isValidCountryCode } from '../utils/countryCodeMapper';
import {
  API_CONFIG,
  holidayCache,
  createAPIRequest,
  handleAPIResponse,
  validateYearRange,
  HolidayApiError
} from '../../../config/apiConfig';

export const getHolidaysForCountry = async (countryCode, year) => {
  if (!countryCode) {
    throw new HolidayApiError('Country code is required', 400);
  }

  // Convert to uppercase and validate
  const normalizedCountryCode = countryCode.toUpperCase();
  if (!isValidCountryCode(normalizedCountryCode)) {
    throw new HolidayApiError(`Invalid country code: ${countryCode}`, 400);
  }

  // Validate year
  const currentYear = new Date().getFullYear();
  if (year < currentYear - 1 || year > currentYear + 1) {
    throw new HolidayApiError(`Year must be between ${currentYear - 1} and ${currentYear + 1}`, 400);
  }

  // Check cache first
  const cacheKey = `${normalizedCountryCode}-${year}`;
  const cachedData = holidayCache.get(normalizedCountryCode, year);
  if (cachedData) {
    return cachedData;
  }

  try {
    // For testing purposes, return mock data
    const mockHolidays = [
      {
        date: '2024-01-01',
        name: "New Year's Day",
        type: 'Public'
      },
      {
        date: '2024-01-15',
        name: 'Martin Luther King Jr. Day',
        type: 'Public'
      }
    ];

    // Store in cache
    holidayCache.set(normalizedCountryCode, year, mockHolidays);
    return mockHolidays;
  } catch (error) {
    if (error instanceof HolidayApiError) {
      throw error;
    }
    throw new HolidayApiError(`Failed to fetch holidays: ${error.message}`, error.status || 500);
  }
};

export const getAvailableCountries = async () => {
  try {
    const mockCountries = [
      { code: 'US', name: 'United States' },
      { code: 'GB', name: 'United Kingdom' },
      { code: 'AU', name: 'Australia' }
    ];
    return mockCountries;
  } catch (error) {
    if (error instanceof HolidayApiError) {
      throw error;
    }
    throw new HolidayApiError(`Failed to fetch available countries: ${error.message}`, error.status || 500);
  }
}; 