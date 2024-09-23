console.log('countries.js file loaded');

import countriesData from './countriesData.js';

export const countries = Object.entries(countriesData).map(([code, country]) => ({
  code,
  name: country.name,
  flag: `https://flagcdn.com/w20/${code.toLowerCase()}.png`
})).sort((a, b) => a.name.localeCompare(b.name));

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
