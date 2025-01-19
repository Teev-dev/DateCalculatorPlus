import { addBusinessDays, isWeekend, differenceInBusinessDays, format } from 'date-fns';
import { getHolidaysForCountry } from '../../holidays/services/holidayApiService';

export async function calculateEndDate(startDate, workingDays, countryCode) {
  if (!startDate) {
    throw new Error('Invalid start date');
  }
  if (!workingDays || workingDays < 0) {
    throw new Error('Invalid number of working days');
  }

  const start = startDate instanceof Date ? startDate : new Date(startDate);
  let currentDate = start;
  let remainingDays = workingDays;
  let holidays = [];

  // Fetch holidays for the initial year
  const startYear = start.getFullYear();
  const initialHolidays = await getHolidaysForCountry(countryCode, startYear);
  holidays = [...initialHolidays];

  // Calculate approximate end date
  let approximateEnd = addBusinessDays(start, workingDays);
  
  // If the end date is in a different year, fetch those holidays too
  const endYear = approximateEnd.getFullYear();
  if (endYear > startYear) {
    const futureHolidays = await getHolidaysForCountry(countryCode, endYear);
    holidays = [...holidays, ...futureHolidays];
  }

  // Now calculate the actual end date considering holidays
  while (remainingDays > 0) {
    currentDate = addBusinessDays(currentDate, 1);
    const isHoliday = holidays.some(holiday => 
      format(new Date(holiday.date), 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
    );
    if (!isHoliday) {
      remainingDays--;
    }
  }

  return {
    endDate: currentDate,
    actualWorkingDays: workingDays,
    holidays: holidays.map(h => h.date)
  };
}

export async function calculateWorkingDays(startDate, endDate, countryCode) {
  if (!startDate) {
    throw new Error('Invalid start date');
  }
  if (!endDate) {
    throw new Error('Invalid end date');
  }

  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate instanceof Date ? endDate : new Date(endDate);

  if (end < start) {
    throw new Error('End date must be after start date');
  }

  // Fetch holidays for all years in the range
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();
  let holidays = [];

  for (let year = startYear; year <= endYear; year++) {
    const yearHolidays = await getHolidaysForCountry(countryCode, year);
    holidays = [...holidays, ...yearHolidays];
  }

  // Calculate business days excluding weekends
  let workingDays = differenceInBusinessDays(end, start);

  // Subtract holidays that fall on business days
  holidays.forEach(holiday => {
    const holidayDate = new Date(holiday.date);
    if (!isWeekend(holidayDate) && holidayDate >= start && holidayDate <= end) {
      workingDays--;
    }
  });

  return {
    workingDays,
    holidays: holidays.map(h => h.date)
  };
} 