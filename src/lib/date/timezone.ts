/**
 * Timezone conversion and management utilities
 */
import {
  format,
  formatISO,
  parse,
  parseISO,
} from 'date-fns';
import {
  formatInTimeZone,
  utcToZonedTime,
  zonedTimeToUtc,
} from 'date-fns-tz';

/**
 * Convert a date from one timezone to another
 * @param date - The date to convert
 * @param fromTimezone - Source timezone
 * @param toTimezone - Target timezone
 * @returns The date converted to the target timezone
 * 
 * @example
 * // Convert a date from New York to London time
 * const nyDate = new Date('2023-01-01T12:00:00-05:00');
 * const londonDate = convertToTimezone(nyDate, 'America/New_York', 'Europe/London');
 */
export function convertToTimezone(date: Date, fromTimezone: string, toTimezone?: string): Date {
  if (!date) return new Date();
  
  // Clone the date
  const newDate = new Date(date);
  
  // If no target timezone provided, convert to local timezone
  if (!toTimezone) return newDate;
  
  try {
    // Format with the source timezone
    const timeString = date.toLocaleString('en-US', { timeZone: fromTimezone });
    const sourceDate = new Date(timeString);
    
    // Format with the target timezone
    const targetTimeString = date.toLocaleString('en-US', { timeZone: toTimezone });
    const targetDate = new Date(targetTimeString);
    
    // Calculate the timezone difference
    const tzDiff = targetDate.getTime() - sourceDate.getTime();
    
    // Apply the timezone difference to the original date
    return new Date(date.getTime() + tzDiff);
  } catch (error) {
    console.error('Error converting timezone:', error);
    return newDate;
  }
}

/**
 * Format a date in a specific timezone
 * @param date - The date to format
 * @param timezone - The timezone to format the date in
 * @param formatStr - The format string to use (date-fns format)
 * @returns The formatted date string
 * 
 * @example
 * // Format a date in Tokyo timezone
 * const date = new Date();
 * const formatted = formatInTimezone(date, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss');
 */
export function formatInTimezone(date: Date, timezone: string, formatStr: string): string {
  if (!date) return '';
  
  try {
    // Convert to the target timezone's string representation
    const timeString = date.toLocaleString('en-US', { timeZone: timezone });
    const timezoneDate = new Date(timeString);
    
    // Format using date-fns
    let formatted = format(timezoneDate, formatStr);
    
    // Add timezone abbreviation if 'z' is in the format string
    if (formatStr.includes('z')) {
      const tzAbbr = getTimezoneAbbreviation(timezone, date);
      formatted = formatted.replace('z', tzAbbr);
    }
    
    return formatted;
  } catch (error) {
    console.error('Error formatting date in timezone:', error);
    return format(date, formatStr);
  }
}

/**
 * Get a list of common timezones
 * @returns Array of common timezone identifiers
 * 
 * @example
 * const timezones = getCommonTimezones();
 * // ['America/New_York', 'Europe/London', ...]
 */
export function getCommonTimezones(): string[] {
  return [
    'America/New_York',
    'America/Los_Angeles',
    'America/Chicago',
    'America/Denver',
    'America/Toronto',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Moscow',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Singapore',
    'Australia/Sydney',
    'Pacific/Auckland'
  ];
}

/**
 * Get the timezone offset in hours
 * @param timezone - The timezone to get the offset for
 * @param date - The date to get the offset for (default: current date)
 * @returns The timezone offset in hours
 * 
 * @example
 * // Get the offset for Tokyo
 * const offset = getTimezoneOffset('Asia/Tokyo');
 * // "+9:00"
 */
export function getTimezoneOffset(timezone: string, date: Date = new Date()): string {
  try {
    // Get the local timestamp
    const localDate = new Date(date);
    
    // Get the timestamp in the specified timezone
    const targetDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    
    // Calculate the timezone offset in minutes
    let offsetMinutes = (targetDate.getTime() - localDate.getTime()) / 60000 +
                       localDate.getTimezoneOffset();
    
    // Convert to hours and minutes
    const hours = Math.floor(Math.abs(offsetMinutes) / 60);
    const minutes = Math.abs(offsetMinutes) % 60;
    
    // Format the offset
    const sign = offsetMinutes >= 0 ? '+' : '-';
    return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error('Error getting timezone offset:', error);
    return '+00:00';
  }
}

/**
 * Get the timezone abbreviation
 * @param timezone - The timezone to get the abbreviation for
 * @param date - The date to get the abbreviation for (default: current date)
 * @returns The timezone abbreviation
 * 
 * @example
 * // Get the abbreviation for New York
 * const abbr = getTimezoneAbbreviation('America/New_York');
 * // "EST" or "EDT" depending on daylight saving time
 */
function getTimezoneAbbreviation(timezone: string, date: Date = new Date()): string {
  try {
    // Try to get the timezone abbreviation from the timezone offset
    const offset = getTimezoneOffset(timezone, date);
    
    // Common timezone abbreviations
    const abbreviations: Record<string, string> = {
      'America/New_York': date.getMonth() > 2 && date.getMonth() < 10 ? 'EDT' : 'EST',
      'America/Los_Angeles': date.getMonth() > 2 && date.getMonth() < 10 ? 'PDT' : 'PST',
      'America/Chicago': date.getMonth() > 2 && date.getMonth() < 10 ? 'CDT' : 'CST',
      'America/Denver': date.getMonth() > 2 && date.getMonth() < 10 ? 'MDT' : 'MST',
      'Europe/London': date.getMonth() > 2 && date.getMonth() < 10 ? 'BST' : 'GMT',
      'Europe/Paris': date.getMonth() > 2 && date.getMonth() < 10 ? 'CEST' : 'CET',
      'Asia/Tokyo': 'JST',
      'Australia/Sydney': date.getMonth() < 3 || date.getMonth() > 9 ? 'AEDT' : 'AEST'
    };
    
    // Return the abbreviation if we have one, otherwise use the offset
    return abbreviations[timezone] || `GMT${offset}`;
  } catch (error) {
    console.error('Error getting timezone abbreviation:', error);
    return 'UTC';
  }
} 