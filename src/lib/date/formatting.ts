/**
 * Date formatting utilities
 */
import { format, parse, formatDistance, Locale } from 'date-fns';
import { enUS, fr, de, es, ja, zhCN } from 'date-fns/locale';

// Map of available locales
const locales: Record<string, Locale> = {
  'en-US': enUS,
  'fr': fr,
  'de': de,
  'es': es,
  'ja': ja,
  'zh-CN': zhCN,
  // Additional locales can be imported and added as needed
  // This map will be populated with all ISO locales from date-fns
};

/**
 * Default format for dates
 */
export const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';

/**
 * Default format for times
 */
export const DEFAULT_TIME_FORMAT = 'HH:mm:ss';

/**
 * Default format for date and time
 */
export const DEFAULT_DATETIME_FORMAT = `${DEFAULT_DATE_FORMAT} ${DEFAULT_TIME_FORMAT}`;

/**
 * Formats a date according to the specified format and locale
 * 
 * @param date - The date to format
 * @param formatStr - The format string (using date-fns format)
 * @param locale - The locale code (e.g., 'en-US', 'fr')
 * @returns The formatted date string
 * 
 * @example
 * // Format a date in US English
 * const formatted = formatDate(
 *   new Date('2023-01-01'),
 *   'MMMM dd, yyyy',
 *   'en-US'
 * ); // Returns "January 01, 2023"
 * 
 * @example
 * // Format a date in French
 * const formatted = formatDate(
 *   new Date('2023-01-01'),
 *   'MMMM dd, yyyy',
 *   'fr'
 * ); // Returns "janvier 01, 2023"
 */
export function formatDate(
  date: Date,
  formatStr: string = DEFAULT_DATE_FORMAT,
  locale: string = 'en-US'
): string {
  // Validate inputs
  if (!(date instanceof Date)) {
    throw new Error('date must be a valid Date object');
  }
  
  if (isNaN(date.getTime())) {
    throw new Error('date must be a valid date');
  }
  
  // Get locale object, default to en-US if not found
  const localeObj = locales[locale] || enUS;
  
  // Format the date
  return format(date, formatStr, { locale: localeObj });
}

/**
 * Formats the relative time between two dates in a human-readable form
 * 
 * @param date - The date to compare
 * @param baseDate - The base date to compare against (defaults to now)
 * @param locale - The locale code (e.g., 'en-US', 'fr')
 * @returns Human-readable relative time
 * 
 * @example
 * // Get relative time
 * const relative = formatRelative(
 *   new Date('2023-01-01'),
 *   new Date('2023-01-10')
 * ); // Returns "9 days ago"
 */
export function formatRelative(
  date: Date,
  baseDate: Date = new Date(),
  locale: string = 'en-US'
): string {
  // Validate inputs
  if (!(date instanceof Date) || !(baseDate instanceof Date)) {
    throw new Error('Both date and baseDate must be valid Date objects');
  }
  
  if (isNaN(date.getTime()) || isNaN(baseDate.getTime())) {
    throw new Error('Both date and baseDate must be valid dates');
  }
  
  // Get locale object, default to en-US if not found
  const localeObj = locales[locale] || enUS;
  
  // Format the relative time
  return formatDistance(date, baseDate, {
    addSuffix: true,
    locale: localeObj,
  });
}

/**
 * Parses a date string using the specified format
 * 
 * @param dateStr - The date string to parse
 * @param formatStr - The format string that matches the date string format
 * @param locale - The locale code
 * @returns A Date object representing the parsed date
 * 
 * @example
 * // Parse a date string
 * const date = parseDate(
 *   'January 01, 2023',
 *   'MMMM dd, yyyy',
 *   'en-US'
 * );
 */
export function parseDate(
  dateStr: string,
  formatStr: string,
  locale: string = 'en-US'
): Date {
  // Validate inputs
  if (!dateStr) {
    throw new Error('dateStr must be specified');
  }
  
  if (!formatStr) {
    throw new Error('formatStr must be specified');
  }
  
  // Get locale object, default to en-US if not found
  const localeObj = locales[locale] || enUS;
  
  // Parse the date string
  return parse(dateStr, formatStr, new Date(), {
    locale: localeObj,
  });
}

/**
 * Gets commonly used date formats
 * 
 * @returns Object containing commonly used date formats
 */
export function getCommonFormats(): Record<string, string> {
  return {
    short: 'MM/dd/yyyy',
    medium: 'MMM d, yyyy',
    long: 'MMMM d, yyyy',
    full: 'EEEE, MMMM d, yyyy',
    iso: 'yyyy-MM-dd',
    time12: 'h:mm a',
    time24: 'HH:mm',
    dateTime: 'MM/dd/yyyy h:mm a',
    dateTimeShort: 'MM/dd/yyyy HH:mm',
    dateTimeLong: 'MMMM d, yyyy h:mm:ss a',
  };
} 