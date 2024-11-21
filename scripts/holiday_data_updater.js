import * as dateFns from '../node_modules/date-fns/esm/index.js';
import { countries } from './countries';

const API_ENDPOINT = 'https://openholidaysapi.org/PublicHolidays';

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

function parseHolidayData(data) {
    return data.map(holiday => holiday.startDate);
}

function storeHolidayData(holidays) {
    localStorage.setItem('holidayData', JSON.stringify(holidays));
    localStorage.setItem('lastUpdated', new Date().toISOString());
}

function isDataStale() {
    const lastUpdated = localStorage.getItem('lastUpdated');
    if (!lastUpdated) return true;

    const threeMonthsAgo = dateFns.addMonths(new Date(), -3);
    return dateFns.isBefore(new Date(lastUpdated), threeMonthsAgo);
}

export async function updateHolidayData() {
    if (isDataStale()) {
        const currentYear = new Date().getFullYear();
        const holidays = {};
        let successfulFetches = 0;
        let failedFetches = 0;

        for (const country of countries) {
            try {
                const data = await fetchHolidayData(country.code, currentYear);
                if (data) {
                    holidays[country.code] = parseHolidayData(data);
                    successfulFetches++;
                } else {
                    failedFetches++;
                }
            } catch (error) {
                console.error(`Failed to fetch holiday data for ${country.code}:`, error);
                failedFetches++;
            }
        }

        if (Object.keys(holidays).length > 0) {
            storeHolidayData(holidays);
            console.log(`Holiday data updated successfully. Successful fetches: ${successfulFetches}, Failed fetches: ${failedFetches}`);
        } else {
            console.error('Failed to update holiday data. All fetches failed.');
        }
    } else {
        console.log('Holiday data is up to date');
    }
}

export function getHolidayData() {
    const data = localStorage.getItem('holidayData');
    return data ? JSON.parse(data) : null;
}

export function getLastUpdated() {
    return localStorage.getItem('lastUpdated');
}
