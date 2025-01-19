import { countries } from './countries';

const API_ENDPOINT = 'https://date.nager.at/api/v3/PublicHolidays';
const CACHE_KEY = 'holiday_data';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Add supported countries
const SUPPORTED_COUNTRIES = ['US', 'GB', 'AU', 'CA', 'NZ']; // Main English-speaking countries

async function fetchCountryHolidays(countryCode, year) {
    const endpoint = `${API_ENDPOINT}/${year}/${countryCode}`;
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.map(holiday => ({
            date: holiday.date,
            name: holiday.name,
            type: holiday.type,
            countryCode: holiday.countryCode
        }));
    } catch (error) {
        console.error(`Failed to fetch holidays for ${countryCode} ${year}:`, error);
        return [];
    }
}

export async function updateHolidayData() {
    try {
        // Check cache first
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            const { timestamp, data } = JSON.parse(cachedData);
            if (Date.now() - timestamp < CACHE_DURATION) {
                console.log('Using cached holiday data');
                return data;
            }
        }

        // Fetch fresh data
        console.log('Fetching fresh holiday data...');
        const currentYear = new Date().getFullYear();
        const years = [currentYear - 1, currentYear, currentYear + 1];
        
        const holidayData = {};
        
        // Fetch data for all supported countries and years
        for (const countryCode of SUPPORTED_COUNTRIES) {
            holidayData[countryCode] = [];
            for (const year of years) {
                const holidays = await fetchCountryHolidays(countryCode, year);
                holidayData[countryCode].push(...holidays);
            }
        }

        // Cache the results
        const cacheData = {
            timestamp: Date.now(),
            data: holidayData
        };
        
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        console.log('Holiday data updated successfully');
        
        return holidayData;
    } catch (error) {
        console.error('Error updating holiday data:', error);
        throw error;
    }
}

export function getHolidayData(countryCode) {
    try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (!cachedData) {
            console.warn('No holiday data found in cache');
            return null;
        }

        const { data } = JSON.parse(cachedData);
        
        if (countryCode) {
            return data[countryCode] || [];
        }
        
        return data;
    } catch (error) {
        console.error('Error retrieving holiday data:', error);
        return null;
    }
}

export function isHoliday(date, countryCode) {
    const holidays = getHolidayData(countryCode);
    if (!holidays) return false;

    const dateStr = date.toISOString().split('T')[0];
    return holidays.some(holiday => holiday.date === dateStr);
}

export function getUpcomingHolidays(countryCode, count = 5) {
    const holidays = getHolidayData(countryCode);
    if (!holidays) return [];

    const today = new Date();
    const upcoming = holidays
        .filter(holiday => new Date(holiday.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, count);

    return upcoming;
}
