console.log('countries.js file loaded');

// Define a subset of countries for testing
const countriesList = {
  'US': { name: 'United States' },
  'GB': { name: 'United Kingdom' },
  'AU': { name: 'Australia' }
};

export const countries = Object.entries(countriesList).map(([code, country]) => ({
  code,
  name: country.name,
  flag: `https://flagcdn.com/w20/${code.toLowerCase()}.png`
})).sort((a, b) => a.name.localeCompare(b.name));

console.log('Countries array created:', countries.length, 'countries');

export function getCountries() {
  if (!countries || countries.length === 0) {
    console.error('No countries data available');
    return [];
  }
  console.log('Returning countries:', countries.length);
  return countries;
}
