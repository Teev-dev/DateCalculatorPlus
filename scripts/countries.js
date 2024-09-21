// Fetch countries from OpenHolidays API
async function fetchCountries() {
    const API_ENDPOINT = 'https://openholidaysapi.org/Countries';
    try {
        console.log('Fetching countries from API...');
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Raw API response:', data);
        
        if (!Array.isArray(data)) {
            throw new Error('API response is not an array');
        }
        
        const mappedCountries = data.map(country => {
            if (!country.isoCode || !Array.isArray(country.name) || country.name.length === 0) {
                console.warn('Invalid country data:', country);
                return null;
            }
            return {
                code: country.isoCode,
                name: country.name[0].text,
                flag: `https://flagcdn.com/w20/${country.isoCode.toLowerCase()}.png`
            };
        }).filter(country => country !== null);
        
        console.log('Mapped countries:', mappedCountries);
        
        return mappedCountries.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        console.error('Error fetching countries:', error);
        return [];
    }
}

export let countries = [];
let countriesInitialized = false;

// Initialize countries
console.log('Initializing countries...');
fetchCountries().then(fetchedCountries => {
    countries = fetchedCountries;
    countriesInitialized = true;
    console.log('Countries fetched and sorted:', countries);
}).catch(error => {
    console.error('Failed to initialize countries:', error);
});

export function areCountriesInitialized() {
    return countriesInitialized;
}

// Fallback country list in case API fails
export const fallbackCountries = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    // Add more countries as needed
];

// Function to get countries, using fallback if necessary
export function getCountries() {
    return countries.length > 0 ? countries : fallbackCountries;
}
