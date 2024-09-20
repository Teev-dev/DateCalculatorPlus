// holiday_data_updater.js

import { format, addMonths, isBefore } from 'date-fns';

// Define API endpoint for OpenHolidays
const API_ENDPOINT = 'https://openholidaysapi.org/PublicHolidays';

// Function to fetch holiday data from OpenHolidays API
async function fetchHolidayData(country, year) {
    const endpoint = `${API_ENDPOINT}?countryIsoCode=${country}&validFrom=${year}-01-01&validTo=${year}-12-31`;
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching holiday data for ${country}:`, error);
        return null;
    }
}

// Function to parse holiday data
function parseHolidayData(data) {
    return data.map(holiday => holiday.startDate);
}

// Function to store fetched data locally
function storeHolidayData(holidays) {
    localStorage.setItem('holidayData', JSON.stringify(holidays));
    localStorage.setItem('lastUpdated', new Date().toISOString());
}

// Function to check if stored data is older than three months
function isDataStale() {
    const lastUpdated = localStorage.getItem('lastUpdated');
    if (!lastUpdated) return true;

    const threeMonthsAgo = addMonths(new Date(), -3);
    return isBefore(new Date(lastUpdated), threeMonthsAgo);
}

// Main function to update holiday data
export async function updateHolidayData() {
    if (isDataStale()) {
        const currentYear = new Date().getFullYear();
        const holidays = {};

        for (const country of ['GB', 'US', 'AU']) { // Using ISO 3166-1 alpha-2 codes
            const data = await fetchHolidayData(country, currentYear);
            if (data) {
                holidays[country] = parseHolidayData(data);
            }
        }

        if (Object.keys(holidays).length > 0) {
            storeHolidayData(holidays);
            console.log('Holiday data updated successfully');
        } else {
            console.error('Failed to update holiday data');
        }
    } else {
        console.log('Holiday data is up to date');
    }
}

// Function to get stored holiday data
export function getHolidayData() {
    const data = localStorage.getItem('holidayData');
    return data ? JSON.parse(data) : null;
}
