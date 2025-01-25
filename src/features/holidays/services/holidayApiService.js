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

  // Validate year
  const currentYear = new Date().getFullYear();
  if (year < currentYear - 1 || year > currentYear + 1) {
    throw new HolidayApiError(`Holiday data is only available for years ${currentYear - 1} to ${currentYear + 1}`, 400);
  }

  try {
    // Check cache first
    const cachedData = holidayCache.get(countryCode, year);
    if (cachedData) {
      return cachedData;
    }

    // Create API request
    const baseUrl = API_CONFIG.HOLIDAY_API.BASE_URL.replace(/\/$/, '');
    const endpoint = `${baseUrl}/${API_CONFIG.HOLIDAY_API.ENDPOINTS.PUBLIC_HOLIDAYS}/${year}/${countryCode}`;
    console.log('Fetching holidays from:', endpoint);
    
    const request = createAPIRequest(endpoint);
    console.log('Request:', {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries())
    });
    
    const response = await fetch(request);
    console.log('Response:', {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type'),
      url: response.url
    });
    
    const holidays = await handleAPIResponse(response);

    if (!Array.isArray(holidays)) {
      throw new HolidayApiError('Invalid response format from holiday API', 500);
    }

    // Transform the data
    const transformedHolidays = holidays.map(holiday => ({
      date: new Date(holiday.date),
      name: holiday.name,
      localName: holiday.localName || holiday.name,
      countryCode: holiday.countryCode || countryCode,
      fixed: holiday.fixed || false,
      global: holiday.global || true,
      type: holiday.types?.[0] || 'Public'
    }));

    // Cache the results
    holidayCache.set(countryCode, year, transformedHolidays);

    return transformedHolidays;
  } catch (error) {
    console.error('Holiday API Error:', {
      countryCode,
      year,
      error: error.message,
      status: error.status
    });
    
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(`Failed to fetch holidays: ${error.message}`, error.status || 500);
  }
};

export const getAvailableCountries = async () => {
  try {
    const baseUrl = API_CONFIG.HOLIDAY_API.BASE_URL.replace(/\/$/, '');
    const endpoint = `${baseUrl}/${API_CONFIG.HOLIDAY_API.ENDPOINTS.AVAILABLE_COUNTRIES}`;
    console.log('Fetching available countries from:', endpoint);
    
    const request = createAPIRequest(endpoint);
    console.log('Request:', {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries())
    });
    
    const response = await fetch(request);
    console.log('Response:', {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type'),
      url: response.url
    });
    
    return handleAPIResponse(response);
  } catch (error) {
    console.error('Available Countries API Error:', error);
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(`Failed to fetch available countries: ${error.message}`, error.status || 500);
  }
}; 