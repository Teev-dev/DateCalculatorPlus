import { getAvailableCountries as fetchCountriesFromAPI } from '../services/holidayApiService';

let countriesCache = null;
let codeToCountryCache = null;

export const initializeCountries = async () => {
  try {
    const countries = await fetchCountriesFromAPI();
    countriesCache = countries.reduce((acc, country) => ({
      ...acc,
      [country.name]: country.countryCode
    }), {});

    codeToCountryCache = countries.reduce((acc, country) => ({
      ...acc,
      [country.countryCode]: country.name
    }), {});

    return countries;
  } catch (error) {
    console.error('Failed to initialize countries:', error);
    return [];
  }
};

// Get array of available countries for dropdown
export const getAvailableCountries = async () => {
  if (!countriesCache) {
    await initializeCountries();
  }
  return Object.keys(countriesCache || {}).sort();
};

// Validate country code
export const isValidCountryCode = (code) => {
  return codeToCountryCache ? Object.keys(codeToCountryCache).includes(code) : false;
};

// Get country code from name
export const getCountryCode = (name) => {
  return countriesCache ? countriesCache[name] : null;
};

// Get country name from code
export const getCountryName = (code) => {
  return codeToCountryCache ? codeToCountryCache[code] : null;
};

// Format country name for display
export const formatCountryName = (name) => {
  return name.trim();
}; 