// API Configuration
export const API_CONFIG = {
  HOLIDAY_API: {
    BASE_URL: process.env.REACT_APP_HOLIDAY_API_BASE_URL || 'https://date.nager.at/api/v3',
    API_KEY: process.env.REACT_APP_HOLIDAY_API_KEY,
    ENDPOINTS: {
      PUBLIC_HOLIDAYS: '/PublicHolidays',
      AVAILABLE_COUNTRIES: '/AvailableCountries',
    },
    CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  },
};

// Feature Configuration
export const FEATURES = {
  ENABLE_HOLIDAY_CACHING: process.env.REACT_APP_ENABLE_HOLIDAY_CACHING === 'true',
  MAX_YEAR_RANGE: parseInt(process.env.REACT_APP_MAX_YEAR_RANGE || '5', 10),
};

// Function to initialize app defaults
export const initializeAppDefaults = async () => {
  const defaultCountry = await getUserCountry() || 'United States'; // Get user's country or fallback
  return {
    DEFAULT_COUNTRY: defaultCountry,
    WORKING_DAYS_PER_MONTH: parseInt(process.env.REACT_APP_DEFAULT_WORKING_DAYS_PER_MONTH || '21', 10),
  };
};

// Function to get user's country based on geolocation
const getUserCountry = async () => {
  if (!navigator.geolocation) return null; // Check if geolocation is supported
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`);
      const data = await response.json();
      resolve(data.countryCode); // Return the country code
    }, () => resolve(null)); // Fallback if geolocation fails
  });
};

// Cache implementation for holiday data
class HolidayCache {
  constructor() {
    this.cache = new Map();
  }

  getKey(countryCode, year) {
    return `${countryCode}-${year}`;
  }

  get(countryCode, year) {
    if (!FEATURES.ENABLE_HOLIDAY_CACHING) return null;
    
    const key = this.getKey(countryCode, year);
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    // Check if cache has expired
    if (Date.now() - cached.timestamp > API_CONFIG.HOLIDAY_API.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  set(countryCode, year, data) {
    if (!FEATURES.ENABLE_HOLIDAY_CACHING) return;
    
    const key = this.getKey(countryCode, year);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear() {
    this.cache.clear();
  }
}

export const holidayCache = new HolidayCache();

// API Error handling
export class APIError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
  }
}

// API Response handler
export const handleAPIResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new APIError(
      error.message || 'An error occurred while fetching data',
      response.status,
      error.code
    );
  }
  return response.json();
};

// API Request builder
export const createAPIRequest = (endpoint, options = {}) => {
  const url = new URL(endpoint, API_CONFIG.HOLIDAY_API.BASE_URL);
  
  const headers = {
    'Content-Type': 'application/json',
    ...(API_CONFIG.HOLIDAY_API.API_KEY && {
      'Authorization': `Bearer ${API_CONFIG.HOLIDAY_API.API_KEY}`
    }),
    ...options.headers,
  };

  return new Request(url.toString(), {
    ...options,
    headers,
  });
};

// Utility function to validate year range
export const validateYearRange = (startYear, endYear) => {
  const yearDiff = endYear - startYear;
  if (yearDiff < 0) {
    throw new Error('End year must be greater than or equal to start year');
  }
  if (yearDiff > FEATURES.MAX_YEAR_RANGE) {
    throw new Error(`Year range cannot exceed ${FEATURES.MAX_YEAR_RANGE} years`);
  }
  return true;
}; 