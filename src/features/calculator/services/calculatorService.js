import { getHolidaysForCountry } from '../../holidays/services/holidayApiService';
import { isWeekend, addDays, parseISO, format, isValid } from 'date-fns';

export const calculateEndDate = async (startDate, workingDays, countryCode) => {
  // Validate inputs
  if (!isValid(parseISO(startDate))) {
    throw new Error('Invalid start date');
  }
  if (!Number.isInteger(workingDays) || workingDays < 1) {
    throw new Error('Invalid number of working days');
  }

  // Get holidays for the relevant period
  const holidays = await getHolidaysForCountry(countryCode, new Date().getFullYear());
  const holidayDates = holidays.map(h => h.date);

  let currentDate = parseISO(startDate);
  let remainingDays = workingDays;

  while (remainingDays > 0) {
    currentDate = addDays(currentDate, 1);
    const isWeekendDay = isWeekend(currentDate);
    const isHoliday = holidayDates.includes(format(currentDate, 'yyyy-MM-dd'));
    
    if (!isWeekendDay && !isHoliday) {
      remainingDays--;
    }
  }

  return currentDate;
};

export const calculateWorkingDays = async (startDate, endDate, countryCode) => {
  // Validate inputs
  if (!isValid(parseISO(startDate))) {
    throw new Error('Invalid start date');
  }
  if (!isValid(parseISO(endDate))) {
    throw new Error('Invalid end date');
  }
  if (parseISO(endDate) < parseISO(startDate)) {
    throw new Error('End date must be after start date');
  }

  // Get holidays for the relevant period
  const holidays = await getHolidaysForCountry(countryCode, new Date().getFullYear());
  const holidayDates = holidays.map(h => h.date);

  let workingDays = 0;
  let currentDate = parseISO(startDate);
  const targetDate = parseISO(endDate);

  while (currentDate <= targetDate) {
    const isWeekendDay = isWeekend(currentDate);
    const isHoliday = holidayDates.includes(format(currentDate, 'yyyy-MM-dd'));
    
    if (!isWeekendDay && !isHoliday) {
      workingDays++;
    }
    currentDate = addDays(currentDate, 1);
  }

  return workingDays;
}; 