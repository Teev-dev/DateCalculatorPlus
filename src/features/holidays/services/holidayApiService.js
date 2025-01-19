import { isValidCountryCode } from '../utils/countryCodeMapper';
import {
  API_CONFIG,
  holidayCache,
  createAPIRequest,
  handleAPIResponse,
  validateYearRange,
  APIError
} from '../../../config/apiConfig';

export class HolidayApiError extends APIError {}

export const getHolidaysForCountry = async (countryCode, year = new Date().getFullYear()) => {
  if (!countryCode) {
    throw new HolidayApiError('Country code is required', 400);
  }

  if (!isValidCountryCode(countryCode)) {
    throw new HolidayApiError(`Invalid country code: ${countryCode}`, 400);
  }

  try {
    // Check cache first
    const cachedData = holidayCache.get(countryCode, year);
    if (cachedData) {
      return cachedData;
    }

    // Validate year range
    validateYearRange(year, year);

    // Create API request
    const request = createAPIRequest(
      `${API_CONFIG.HOLIDAY_API.ENDPOINTS.PUBLIC_HOLIDAYS}/${year}/${countryCode}`
    );

    const response = await fetch(request);
    const holidays = await handleAPIResponse(response);

    // Transform the data
    const transformedHolidays = holidays.map(holiday => ({
      date: new Date(holiday.date),
      name: holiday.name,
      localName: holiday.localName,
      countryCode: holiday.countryCode,
      fixed: holiday.fixed,
      global: holiday.global,
      type: holiday.types?.[0] || 'Public'
    }));

    // Cache the results
    holidayCache.set(countryCode, year, transformedHolidays);

    return transformedHolidays;
  } catch (error) {
    if (error instanceof APIError) {
      // Preserve the original error status and message
      throw error;
    }
    // For network or other errors, create a new APIError
    throw new APIError(`API Error: ${error.status || 500}`, error.status || 500);
  }
};

export const getAvailableCountries = async () => {
  try {
    const request = createAPIRequest(API_CONFIG.HOLIDAY_API.ENDPOINTS.AVAILABLE_COUNTRIES);
    const response = await fetch(request);
    return handleAPIResponse(response);
  } catch (error) {
    if (error instanceof APIError) {
      // Preserve the original error status and message
      throw error;
    }
    // For network or other errors, create a new APIError
    throw new APIError(`API Error: ${error.status || 500}`, error.status || 500);
  }
}; 