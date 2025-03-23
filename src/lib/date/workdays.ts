/**
 * Workday calculation utilities
 */
import { eachDayOfInterval, isWeekend } from 'date-fns';
import { WorkdayOptions } from './types';
import { isHoliday } from './holidays';

/**
 * Default work week (Monday to Friday)
 * 0 = Sunday, 1 = Monday, ..., 6 = Saturday
 */
export const DEFAULT_WORK_WEEK = [1, 2, 3, 4, 5];

/**
 * Checks if a date is a workday
 * 
 * @param date - The date to check
 * @param options - Options for determining workdays
 * @returns True if the date is a workday, false otherwise
 */
export function isWorkday(
  date: Date,
  options: WorkdayOptions = {}
): boolean {
  // Get work week (default: Monday to Friday)
  const workWeek = options.workWeek || DEFAULT_WORK_WEEK;
  
  // Check if it's a weekend (not in work week)
  const dayOfWeek = date.getDay();
  if (!workWeek.includes(dayOfWeek)) {
    return false;
  }
  
  // Check if it's a holiday
  if (options.excludeHolidays && options.region) {
    return !isHoliday(date, options.region);
  }
  
  return true;
}

/**
 * Calculates the number of workdays between two dates
 * 
 * @param startDate - The start date of the range
 * @param endDate - The end date of the range
 * @param options - Options for determining workdays
 * @returns The number of workdays in the date range
 * 
 * @example
 * // Get workdays between two dates (excluding weekends)
 * const workdays = getWorkdaysInRange(
 *   new Date('2023-01-01'),
 *   new Date('2023-01-31')
 * );
 * 
 * @example
 * // Get workdays excluding weekends and holidays in the US
 * const workdays = getWorkdaysInRange(
 *   new Date('2023-01-01'),
 *   new Date('2023-01-31'),
 *   { excludeHolidays: true, region: 'US' }
 * );
 */
export function getWorkdaysInRange(
  startDate: Date,
  endDate: Date,
  options: WorkdayOptions = {}
): number {
  // Validate dates
  if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    throw new Error('Both startDate and endDate must be valid Date objects');
  }
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Both startDate and endDate must be valid dates');
  }
  
  // Ensure startDate is before or equal to endDate
  if (startDate > endDate) {
    return 0;
  }
  
  // Get all days in the range
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Get work week (default: Monday to Friday)
  const workWeek = options.workWeek || DEFAULT_WORK_WEEK;
  
  // Simple case: only exclude weekends
  if (!options.excludeHolidays) {
    return days.filter(day => workWeek.includes(day.getDay())).length;
  }
  
  // Complex case: exclude weekends and holidays
  return days.filter(day => {
    // Check if it's a work day of the week
    if (!workWeek.includes(day.getDay())) {
      return false;
    }
    
    // Check if it's a holiday
    if (options.excludeHolidays && options.region) {
      return !isHoliday(day, options.region);
    }
    
    return true;
  }).length;
} 