import { countries as countriesList } from 'countries-list';

console.log('countries.js file loaded');
console.log('Importing countries from countries-list package');

export const countries = Object.entries(countriesList).map(([code, country]) => ({
  code,
  name: country.name,
  flag: `https://flagcdn.com/w20/${code.toLowerCase()}.png`
})).sort((a, b) => a.name.localeCompare(b.name));

console.log('Countries array created:', countries.length, 'countries');

export function getCountries() {
  console.log('getCountries called');
  if (!countries || countries.length === 0) {
    console.error('No countries data available');
    return [];
  }
  console.log('Returning countries:', countries.length);
  return countries;
}
