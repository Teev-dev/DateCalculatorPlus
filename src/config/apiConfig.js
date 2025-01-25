// Default configuration values
const DEFAULT_CONFIG = {
  HOLIDAY_API_BASE_URL: 'https://date.nager.at/api/v3',
  HOLIDAY_API_KEY: '',
  ENABLE_HOLIDAY_CACHING: true,
  MAX_YEAR_RANGE: 5,
  DEFAULT_COUNTRY: 'United States',
  DEFAULT_WORKING_DAYS_PER_MONTH: 21
};

// Security headers for API requests
const SECURITY_HEADERS = {
  'Accept': 'application/json'
};

// Helper function to safely get environment variables
const getEnvVar = (key, defaultValue) => {
  try {
    return process.env[key] ?? defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

// API Configuration
export const API_CONFIG = {
  HOLIDAY_API: {
    BASE_URL: getEnvVar('REACT_APP_HOLIDAY_API_BASE_URL', DEFAULT_CONFIG.HOLIDAY_API_BASE_URL),
    API_KEY: getEnvVar('REACT_APP_HOLIDAY_API_KEY', DEFAULT_CONFIG.HOLIDAY_API_KEY),
    ENDPOINTS: {
      PUBLIC_HOLIDAYS: 'PublicHolidays',
      AVAILABLE_COUNTRIES: 'AvailableCountries'
    },
    CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  },
};

// Feature Configuration
export const FEATURES = {
  ENABLE_HOLIDAY_CACHING: getEnvVar('REACT_APP_ENABLE_HOLIDAY_CACHING', 'true') === 'true',
  MAX_YEAR_RANGE: parseInt(getEnvVar('REACT_APP_MAX_YEAR_RANGE', DEFAULT_CONFIG.MAX_YEAR_RANGE), 10),
};

// Function to initialize app defaults
export const initializeAppDefaults = async () => {
  const defaultCountry = await getUserCountry() || DEFAULT_CONFIG.DEFAULT_COUNTRY;
  return {
    DEFAULT_COUNTRY: defaultCountry,
    WORKING_DAYS_PER_MONTH: parseInt(getEnvVar('REACT_APP_DEFAULT_WORKING_DAYS_PER_MONTH', DEFAULT_CONFIG.DEFAULT_WORKING_DAYS_PER_MONTH), 10),
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
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  
  if (!response.ok || !isJson) {
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      contentType: contentType
    });
    
    // Get the raw text of the response for debugging
    const responseText = await response.text();
    console.error('Response text:', responseText.substring(0, 200) + '...');
    
    let errorMessage;
    if (!isJson) {
      errorMessage = `Invalid response format (expected JSON, got ${contentType})`;
    } else {
      try {
        const error = JSON.parse(responseText);
        errorMessage = error.message;
      } catch {
        errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
      }
    }
    
    throw new APIError(errorMessage, response.status);
  }
  
  return response.json();
};

// Request validation
const validateRequest = (endpoint) => {
  try {
    const url = new URL(endpoint);
    if (!url.href.startsWith(API_CONFIG.HOLIDAY_API.BASE_URL)) {
      console.error('Invalid API endpoint:', {
        endpoint,
        baseUrl: API_CONFIG.HOLIDAY_API.BASE_URL,
        url: url.href
      });
      throw new APIError('Invalid API endpoint', 400);
    }
    return url;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError('Invalid URL format', 400);
  }
};

// Rate limiting configuration
const RATE_LIMIT = {
  MAX_REQUESTS: 100,
  TIME_WINDOW: 60 * 60 * 1000, // 1 hour in milliseconds
  requests: new Map()
};

// Rate limiting implementation
const checkRateLimit = (endpoint) => {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT.TIME_WINDOW;
  
  // Clean up old requests
  for (const [key, timestamps] of RATE_LIMIT.requests.entries()) {
    RATE_LIMIT.requests.set(key, timestamps.filter(time => time > windowStart));
    if (RATE_LIMIT.requests.get(key).length === 0) {
      RATE_LIMIT.requests.delete(key);
    }
  }
  
  // Check current endpoint's rate limit
  const timestamps = RATE_LIMIT.requests.get(endpoint) || [];
  if (timestamps.length >= RATE_LIMIT.MAX_REQUESTS) {
    throw new APIError('Rate limit exceeded. Please try again later.', 429);
  }
  
  // Add new request timestamp
  timestamps.push(now);
  RATE_LIMIT.requests.set(endpoint, timestamps);
};

// API Request builder with enhanced security
export const createAPIRequest = (endpoint) => {
  try {
    // Check rate limit
    checkRateLimit(endpoint);
    
    const url = validateRequest(endpoint);
    
    const headers = {
      ...SECURITY_HEADERS,
      ...(API_CONFIG.HOLIDAY_API.API_KEY && {
        'Authorization': `Bearer ${API_CONFIG.HOLIDAY_API.API_KEY}`
      })
    };

    return new Request(url.toString(), {
      method: 'GET',
      headers,
      mode: 'cors',
      cache: 'default',
      credentials: 'omit'
    });
  } catch (error) {
    console.error('Request creation error:', error);
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Invalid request configuration', 400);
  }
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