const { getData } = require('country-list');

const allCountries = getData();

export const countries = allCountries.map(country => ({
    code: country.code,
    name: country.name,
    flag: `https://flagcdn.com/w20/${country.code.toLowerCase()}.png`
}));

// Sort countries alphabetically by name
countries.sort((a, b) => a.name.localeCompare(b.name));
