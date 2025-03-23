/**
 * Date addition/subtraction utilities
 */
import {
  addDays,
  addWeeks,
  addMonths,
  addYears,
  isWeekend,
  getDay,
} from 'date-fns';
import { DateUnit, DateAddOptions } from './types';
import { isHoliday } from './holidays';
import { DEFAULT_WORK_WEEK } from './workdays';

/**
 * Adds the specified amount of time to a date
 * 
 * @param date - The base date to add to
 * @param value - The amount to add (can be negative for subtraction)
 * @param unit - The unit of time to add (days, weeks, months, years)
 * @param options - Optional configuration for the calculation
 * @returns The resulting date after addition
 * 
 * @example
 * // Add 10 days to a date
 * const newDate = addToDate(
 *   new Date('2023-01-01'),
 *   10,
 *   'days'
 * );
 * 
 * @example
 * // Add 5 working days to a date (skipping weekends)
 * const newWorkDate = addToDate(
 *   new Date('2023-01-01'),
 *   5,
 *   'days',
 *   { onlyWorkdays: true }
 * );
 */
export function addToDate(
  date: Date,
  value: number,
  unit: DateUnit,
  options: DateAddOptions = {}
): Date {
  // Validate inputs
  if (!(date instanceof Date)) {
    throw new Error('date must be a valid Date object');
  }
  
  if (isNaN(date.getTime())) {
    throw new Error('date must be a valid date');
  }
  
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error('value must be a valid number');
  }
  
  // Handle workday-only addition
  if (options.onlyWorkdays && unit === 'days') {
    return addWorkdays(date, value, options);
  }
  
  // Handle standard date addition
  switch (unit) {
    case 'days':
      return addDays(date, value);
    case 'weeks':
      return addWeeks(date, value);
    case 'months':
      return addMonths(date, value);
    case 'years':
      return addYears(date, value);
    default:
      return addDays(date, value);
  }
}

/**
 * Adds a number of workdays to a date, skipping weekends and optionally holidays
 * 
 * @param date - The base date
 * @param days - Number of workdays to add
 * @param options - Options for workday calculation
 * @returns The resulting date after adding the workdays
 */
function addWorkdays(
  date: Date,
  days: number,
  options: DateAddOptions
): Date {
  // Return original date if days is 0
  if (days === 0) {
    return new Date(date);
  }
  
  // Determine direction (positive or negative)
  const direction = days > 0 ? 1 : -1;
  const workWeek = DEFAULT_WORK_WEEK;
  
  // Initialize result date
  let result = new Date(date);
  let remainingDays = Math.abs(days);
  
  while (remainingDays > 0) {
    // Move one calendar day in the appropriate direction
    result = addDays(result, direction);
    
    // Skip weekend days
    const dayOfWeek = getDay(result);
    if (!workWeek.includes(dayOfWeek)) {
      continue;
    }
    
    // Skip holidays if specified
    if (options.excludeHolidays && options.holidayRegion) {
      if (isHoliday(result, options.holidayRegion)) {
        continue;
      }
    }
    
    // Count this as a workday
    remainingDays--;
  }
  
  return result;
} 