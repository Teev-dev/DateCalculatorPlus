console.log('countries.js file loaded');

let countriesList;
try {
  const countriesModule = require('countries-list');
  countriesList = countriesModule.countries;
  console.log('countriesList imported successfully:', Object.keys(countriesList).length, 'countries');
} catch (error) {
  console.error('Error importing countries-list:', error);
  countriesList = {};
}

export const countries = Object.entries(countriesList).map(([code, country]) => {
  const entry = {
    code,
    name: country.name,
    flag: `https://flagcdn.com/w20/${code.toLowerCase()}.png`
  };
  return entry;
}).sort((a, b) => a.name.localeCompare(b.name));

console.log('countries array created, length:', countries.length);

export function getCountries() {
  console.log('getCountries called, returning:', countries.length, 'countries');
  console.log('First 5 countries:', countries.slice(0, 5));
  return countries;
}

export function areCountriesInitialized() {
  const initialized = countries.length > 0;
  console.log('areCountriesInitialized called, returning:', initialized);
  return initialized;
}
