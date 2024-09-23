import { countries as countriesList } from 'countries-list';

export const countries = Object.entries(countriesList).map(([code, country]) => ({
  code,
  name: country.name,
  flag: `https://flagcdn.com/w20/${code.toLowerCase()}.png`
})).sort((a, b) => a.name.localeCompare(b.name));

export function getCountries() {
  console.log('getCountries called, returning:', countries.length, 'countries');
  return countries;
}

export function areCountriesInitialized() {
  console.log('areCountriesInitialized called, returning:', countries.length > 0);
  return countries.length > 0;
}
