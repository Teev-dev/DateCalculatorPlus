/**
 * Common types for date calculation functions
 */

// Date units for calculations
export type DateUnit = 'days' | 'weeks' | 'months' | 'years';

// Options for date difference calculations
export interface DateDiffOptions {
  excludeWeekends?: boolean;
  excludeHolidays?: boolean;
  holidayRegion?: string;
}

// Options for adding to date
export interface DateAddOptions {
  onlyWorkdays?: boolean;
  excludeHolidays?: boolean;
  holidayRegion?: string;
}

// Options for workday calculations
export interface WorkdayOptions {
  excludeHolidays?: boolean;
  region?: string;
  workWeek?: number[];  // e.g., [1,2,3,4,5] for Mon-Fri
}

// Holiday object structure
export interface Holiday {
  date: Date;
  name: string;
  region: string;
  type: HolidayType;
}

// Types of holidays
export type HolidayType = 'public' | 'bank' | 'observance' | 'other';

// Result of a date calculation
export interface DateCalculationResult {
  value: number;
  unit: DateUnit;
  startDate: Date;
  endDate: Date;
  options: Record<string, any>;
} 