import {
  addBusinessDays,
  isWeekend,
  differenceInBusinessDays,
  format,
  parse,
  isValid
} from 'date-fns';

// Calculate working days between two dates, excluding holidays
export const calculateWorkingDays = (startDate, endDate, holidays = []) => {
  if (!startDate || !endDate) return 0;

  // Convert string dates to Date objects if needed
  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate instanceof Date ? endDate : new Date(endDate);

  if (!isValid(start) || !isValid(end)) {
    throw new Error('Invalid date format');
  }

  // Convert holidays to Date objects
  const holidayDates = holidays.map(h => h instanceof Date ? h : new Date(h));

  // Calculate business days excluding weekends
  let businessDays = differenceInBusinessDays(end, start);

  // Subtract holidays that fall on business days
  holidayDates.forEach(holiday => {
    if (!isWeekend(holiday) && holiday >= start && holiday <= end) {
      businessDays--;
    }
  });

  return businessDays;
};

// Add working days to a date, excluding holidays
export const addWorkingDays = (date, days, holidays = []) => {
  if (!date || typeof days !== 'number') return null;

  const startDate = date instanceof Date ? date : new Date(date);
  if (!isValid(startDate)) {
    throw new Error('Invalid date format');
  }

  // Convert holidays to Date objects
  const holidayDates = holidays.map(h => h instanceof Date ? h : new Date(h));

  let currentDate = startDate;
  let remainingDays = days;

  while (remainingDays > 0) {
    currentDate = addBusinessDays(currentDate, 1);
    if (!holidayDates.some(holiday => 
      format(holiday, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
    )) {
      remainingDays--;
    }
  }

  return currentDate;
};

// Format date for display
export const formatDate = (date, formatString = 'yyyy-MM-dd') => {
  if (!date) return '';
  const dateObj = date instanceof Date ? date : new Date(date);
  return isValid(dateObj) ? format(dateObj, formatString) : '';
};

// Parse date string to Date object
export const parseDate = (dateString, formatString = 'yyyy-MM-dd') => {
  try {
    const parsedDate = parse(dateString, formatString, new Date());
    return isValid(parsedDate) ? parsedDate : null;
  } catch {
    return null;
  }
};

// Check if a date is a working day
export const isWorkingDay = (date, holidays = []) => {
  if (!date) return false;
  
  const checkDate = date instanceof Date ? date : new Date(date);
  if (!isValid(checkDate)) return false;

  // Check if it's a weekend
  if (isWeekend(checkDate)) return false;

  // Check if it's a holiday
  return !holidays.some(holiday => {
    const holidayDate = holiday instanceof Date ? holiday : new Date(holiday);
    return format(holidayDate, 'yyyy-MM-dd') === format(checkDate, 'yyyy-MM-dd');
  });
}; 