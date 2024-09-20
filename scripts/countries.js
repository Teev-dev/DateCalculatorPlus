// Fetch countries from OpenHolidays API
async function fetchCountries() {
    const API_ENDPOINT = 'https://openholidaysapi.org/Countries';
    try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.map(country => ({
            code: country.countryCode,
            name: country.name,
            flag: `https://flagcdn.com/w20/${country.countryCode.toLowerCase()}.png`
        })).sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        console.error('Error fetching countries:', error);
        return [];
    }
}

export let countries = [];

// Initialize countries
fetchCountries().then(fetchedCountries => {
    countries = fetchedCountries;
    console.log('Countries fetched and sorted:', countries);
});
