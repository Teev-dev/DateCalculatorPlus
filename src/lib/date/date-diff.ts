/**
 * Date difference calculation utility
 */
import {
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
} from 'date-fns';
import { DateUnit, DateDiffOptions } from './types';
import { getWorkdaysInRange } from './workdays';

/**
 * Calculates the difference between two dates in the specified unit.
 * 
 * @param startDate - The start date of the range
 * @param endDate - The end date of the range
 * @param unit - The unit to calculate the difference in (days, weeks, months, years)
 * @param options - Optional configuration for the calculation
 * @returns The difference between the dates in the specified unit
 * 
 * @example
 * // Get the difference in days
 * const diffInDays = calculateDateDifference(
 *   new Date('2023-01-01'),
 *   new Date('2023-01-10'),
 *   'days'
 * );
 * 
 * @example
 * // Get the difference in working days (excluding weekends)
 * const workingDays = calculateDateDifference(
 *   new Date('2023-01-01'),
 *   new Date('2023-01-31'),
 *   'days',
 *   { excludeWeekends: true }
 * );
 */
export function calculateDateDifference(
  startDate: Date, 
  endDate: Date, 
  unit: DateUnit = 'days',
  options: DateDiffOptions = {}
): number {
  // Validate dates
  if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    throw new Error('Both startDate and endDate must be valid Date objects');
  }
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Both startDate and endDate must be valid dates');
  }
  
  // For weekend/holiday exclusions, delegate to workdays calculation
  if (options.excludeWeekends || options.excludeHolidays) {
    const workdays = getWorkdaysInRange(startDate, endDate, {
      excludeHolidays: options.excludeHolidays,
      region: options.holidayRegion
    });
    
    // Convert workdays to the requested unit if needed
    if (unit === 'days') {
      return workdays;
    }
    
    // For other units, calculate approximate conversion
    // This is a simplification - for more accuracy, we'd need to consider
    // variations in month lengths, leap years, etc.
    switch (unit) {
      case 'weeks': 
        return workdays / 5; // Assuming 5-day work week
      case 'months': 
        return workdays / 22; // Approximate workdays in a month
      case 'years': 
        return workdays / 260; // Approximate workdays in a year (52 weeks * 5 days)
      default: 
        return workdays;
    }
  }
  
  // For standard calculations without exclusions
  switch (unit) {
    case 'days': 
      return differenceInDays(endDate, startDate);
    case 'weeks': 
      return differenceInWeeks(endDate, startDate);
    case 'months': 
      return differenceInMonths(endDate, startDate);
    case 'years': 
      return differenceInYears(endDate, startDate);
    default: 
      return differenceInDays(endDate, startDate);
  }
} 