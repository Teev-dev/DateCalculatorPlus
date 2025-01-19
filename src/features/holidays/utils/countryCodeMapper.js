// Map of country names to ISO 3166-1 alpha-2 codes
export const countryToCode = {
  'United States': 'US',
  'United Kingdom': 'GB',
  'Canada': 'CA',
  'Australia': 'AU',
  'Germany': 'DE',
  'France': 'FR',
  'Spain': 'ES',
  'Italy': 'IT',
  'Japan': 'JP',
  'China': 'CN',
  'India': 'IN',
  'Brazil': 'BR',
  'Mexico': 'MX',
  'Netherlands': 'NL',
  'Belgium': 'BE',
  'Switzerland': 'CH',
  'Austria': 'AT',
  'Portugal': 'PT',
  'Sweden': 'SE',
  'Norway': 'NO'
};

// Reverse mapping for code to country name
export const codeToCountry = Object.entries(countryToCode).reduce(
  (acc, [country, code]) => ({
    ...acc,
    [code]: country,
  }),
  {}
);

// Get array of available countries for dropdown
export const getAvailableCountries = () => Object.keys(countryToCode).sort();

// Validate country code
export const isValidCountryCode = (code) => {
  console.log('Validating code:', code);
  console.log('Valid codes:', Object.values(countryToCode));
  return Object.values(countryToCode).includes(code);
};

// Format country name for display
export const formatCountryName = (name) => {
  return name.trim();
}; 