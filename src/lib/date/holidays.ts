/**
 * Holiday detection and management utilities
 */
import { isSameDay, getYear, format } from 'date-fns';
import { Holiday, HolidayType } from './types';

// Type for a holiday response
export type HolidayResponse = string;

// Type for holidays by date
export type HolidayMap = Record<string, HolidayResponse>;

// Cache for holiday data to avoid repeated API calls
const holidayCache: Record<string, HolidayMap> = {};

/**
 * Check if a date is a holiday in the specified region
 * @param date - The date to check
 * @param region - The region code (e.g., 'US', 'GB')
 * @returns The holiday name if it's a holiday, otherwise false
 * 
 * @example
 * // Check if January 1, 2023 is a holiday in the US
 * const isNewYearsDay = await isHoliday(new Date(2023, 0, 1), 'US');
 * // Returns "New Year's Day" if it's a holiday
 */
export async function isHoliday(date: Date, region: string = 'US'): Promise<string | false> {
  if (!date) return false;
  
  const year = date.getFullYear();
  const formattedDate = format(date, 'yyyy-MM-dd');
  
  // Get all holidays for the year and region
  const holidays = await getHolidays(year, region);
  
  // Check if the date matches any holiday
  return holidays[formattedDate] || false;
}

/**
 * Fetch holidays for a specific year and region
 * @param year - The year to fetch holidays for
 * @param region - The region code (e.g., 'US', 'GB')
 * @returns A map of holiday dates to names
 * 
 * @example
 * // Get all US holidays for 2023
 * const holidays = await fetchHolidays(2023, 'US');
 */
export async function fetchHolidays(year: number, region: string = 'US'): Promise<HolidayMap> {
  // In a real app, this would call an API
  // For this example, we'll return hardcoded data
  
  // Create a key for the cache
  const cacheKey = `${year}-${region}`;
  
  // Use cached data if available
  if (holidayCache[cacheKey]) {
    return holidayCache[cacheKey];
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Return different holidays based on region
  let holidays: HolidayMap = {};
  
  if (region === 'US') {
    holidays = {
      [`${year}-01-01`]: "New Year's Day",
      [`${year}-01-16`]: "Martin Luther King Jr. Day",
      [`${year}-02-20`]: "Presidents' Day",
      [`${year}-05-29`]: "Memorial Day",
      [`${year}-06-19`]: "Juneteenth",
      [`${year}-07-04`]: "Independence Day",
      [`${year}-09-04`]: "Labor Day",
      [`${year}-10-09`]: "Columbus Day",
      [`${year}-11-11`]: "Veterans Day",
      [`${year}-11-23`]: "Thanksgiving Day",
      [`${year}-12-25`]: "Christmas Day"
    };
  } else if (region === 'GB') {
    holidays = {
      [`${year}-01-01`]: "New Year's Day",
      [`${year}-04-07`]: "Good Friday",
      [`${year}-04-10`]: "Easter Monday",
      [`${year}-05-01`]: "Early May Bank Holiday",
      [`${year}-05-29`]: "Spring Bank Holiday",
      [`${year}-08-28`]: "Summer Bank Holiday",
      [`${year}-12-25`]: "Christmas Day",
      [`${year}-12-26`]: "Boxing Day"
    };
  } else if (region === 'CA') {
    holidays = {
      [`${year}-01-01`]: "New Year's Day",
      [`${year}-02-20`]: "Family Day",
      [`${year}-04-07`]: "Good Friday",
      [`${year}-05-22`]: "Victoria Day",
      [`${year}-07-01`]: "Canada Day",
      [`${year}-09-04`]: "Labour Day",
      [`${year}-10-09`]: "Thanksgiving Day",
      [`${year}-11-11`]: "Remembrance Day",
      [`${year}-12-25`]: "Christmas Day",
      [`${year}-12-26`]: "Boxing Day"
    };
  } else {
    // Default holidays for other regions
    holidays = {
      [`${year}-01-01`]: "New Year's Day",
      [`${year}-12-25`]: "Christmas Day"
    };
  }
  
  // Cache the result
  holidayCache[cacheKey] = holidays;
  
  return holidays;
}

/**
 * Get holidays from cache or fetch if not available
 * @param year - The year to get holidays for
 * @param region - The region code
 * @returns A map of holiday dates to names
 */
export async function getHolidays(year: number, region: string = 'US'): Promise<HolidayMap> {
  const cacheKey = `${year}-${region}`;
  
  if (!holidayCache[cacheKey]) {
    return fetchHolidays(year, region);
  }
  
  return holidayCache[cacheKey];
}

/**
 * Get the next holiday from a given date in a specific region
 * @param fromDate - The starting date
 * @param region - The region code
 * @returns The next holiday date and name
 */
export async function getNextHoliday(
  fromDate: Date = new Date(),
  region: string = 'US'
): Promise<{ date: Date; name: string } | null> {
  const year = fromDate.getFullYear();
  
  // Get holidays for the current year
  let holidays = await getHolidays(year, region);
  
  // Check if we need to fetch next year's holidays too
  const needNextYear = fromDate.getMonth() > 9; // After October
  
  if (needNextYear) {
    const nextYearHolidays = await getHolidays(year + 1, region);
    holidays = { ...holidays, ...nextYearHolidays };
  }
  
  // Convert to array and sort by date
  const holidayList = Object.entries(holidays)
    .map(([dateStr, name]) => ({
      date: new Date(dateStr),
      name
    }))
    .filter(h => h.date >= fromDate)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Return the first upcoming holiday
  return holidayList.length > 0 ? holidayList[0] : null;
} 