import dateFns from '../lib/date-fns.umd.min.js';
import { getCountries } from './countries.js';
import { updateHolidayData, getHolidayData } from './holiday_data_updater.js';

let countries = [];

async function initializeApp() {
  try {
    console.log('Initializing app...');
    const form = document.getElementById('calculatorForm');
    const resultDiv = document.getElementById('result');
    const calculatedResultEl = document.getElementById('calculatedResult');
    const calculationModeEl = document.getElementById('calculationMode');
    const workingDaysGroup = document.getElementById('workingDaysGroup');
    const directionGroup = document.getElementById('directionGroup');
    const endDateGroup = document.getElementById('endDateGroup');
    const endDateInput = document.getElementById('endDate');
    const workingDaysInput = document.getElementById('workingDays');
    const countrySelect = document.getElementById('country');
    const countrySearchInput = document.getElementById('countrySearch');

    console.log('About to fetch countries');
    countries = getCountries();
    console.log('Countries fetched:', countries);

    if (!countries || countries.length === 0) {
      throw new Error('No countries data available');
    }

    populateCountrySelect(countries);

    countrySearchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const filteredCountries = countries.filter(country => 
        country.name.toLowerCase().includes(searchTerm) || 
        country.code.toLowerCase().includes(searchTerm)
      );
      populateCountrySelect(filteredCountries);
      console.log('Country search performed:', searchTerm);
    });

    calculationModeEl.addEventListener('change', function() {
      const isFutureOrPastMode = this.value === 'futureOrPast';
      workingDaysGroup.style.display = isFutureOrPastMode ? 'block' : 'none';
      directionGroup.style.display = isFutureOrPastMode ? 'block' : 'none';
      endDateGroup.style.display = isFutureOrPastMode ? 'none' : 'block';
      
      if (isFutureOrPastMode) {
        endDateInput.removeAttribute('required');
        workingDaysInput.setAttribute('required', 'required');
      } else {
        endDateInput.setAttribute('required', 'required');
        workingDaysInput.removeAttribute('required');
      }
    });

    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const startDate = new Date(document.getElementById('startDate').value);
      const country = document.getElementById('country').value;
      const calculationMode = calculationModeEl.value;
      
      console.log('Form submitted with:', {
        startDate,
        country,
        calculationMode
      });

      let result;
      try {
        if (calculationMode === 'futureOrPast') {
          const workingDays = parseInt(document.getElementById('workingDays').value);
          const direction = document.getElementById('direction').value;
          result = calculateFutureOrPastDate(startDate, workingDays, direction, country);
        } else {
          const endDate = new Date(document.getElementById('endDate').value);
          result = calculateWorkingDaysBetweenDates(startDate, endDate, country);
        }

        resultDiv.classList.remove('hidden');
        calculatedResultEl.textContent = result;
      } catch (error) {
        console.error('Error calculating result:', error);
        calculatedResultEl.textContent = 'Error: Could not calculate result';
      }
    });
  } catch (error) {
    console.error('Failed to initialize app:', error);
    const countrySelect = document.getElementById('country');
    countrySelect.innerHTML = '<option value="">Error loading countries</option>';
  }
}

function populateCountrySelect(countriesList) {
  console.log('Populating country select. Countries list length:', countriesList.length);
  const countrySelect = document.getElementById('country');
  countrySelect.innerHTML = '';
  
  countriesList.forEach(country => {
    const option = document.createElement('option');
    option.value = country.code;
    option.textContent = `${country.name} (${country.code})`;
    countrySelect.appendChild(option);
  });
  
  console.log('Country select options updated. Number of options:', countrySelect.options.length);
  console.log('First 5 options:', Array.from(countrySelect.options).slice(0, 5).map(opt => opt.textContent));
}

function calculateFutureOrPastDate(startDate, workingDays, direction, country) {
  console.log('Calculating future or past date:', { startDate, workingDays, direction, country });
  const holidays = getHolidayData()[country] || [];
  let currentDate = dateFns.startOfDay(startDate);
  let remainingDays = workingDays;

  while (remainingDays > 0) {
    currentDate = dateFns.addDays(currentDate, direction === 'future' ? 1 : -1);
    if (isWorkingDay(currentDate, holidays)) {
      remainingDays--;
    }
  }

  console.log('Calculated date:', currentDate);
  return dateFns.format(currentDate, 'yyyy-MM-dd');
}

function calculateWorkingDaysBetweenDates(startDate, endDate, country) {
  console.log('Calculating working days between dates:', { startDate, endDate, country });
  const holidays = getHolidayData()[country] || [];
  let workingDays = 0;
  let currentDate = dateFns.startOfDay(startDate);
  const lastDate = dateFns.startOfDay(endDate);

  while (dateFns.isBefore(currentDate, lastDate) || dateFns.isEqual(currentDate, lastDate)) {
    if (isWorkingDay(currentDate, holidays)) {
      workingDays++;
    }
    currentDate = dateFns.addDays(currentDate, 1);
  }

  console.log('Calculated working days:', workingDays);
  return workingDays;
}

function isWorkingDay(date, holidays) {
  const dayOfWeek = dateFns.getDay(date);
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isHoliday = holidays.includes(dateFns.format(date, 'yyyy-MM-dd'));
  return !isWeekend && !isHoliday;
}

document.addEventListener('DOMContentLoaded', async function() {
  console.log('DOM content loaded');
  
  try {
    await updateHolidayData();
    const holidays = getHolidayData();
    const lastUpdated = localStorage.getItem('lastUpdated');
    console.log(`Holiday data last updated: ${lastUpdated}`);
    
    if (!holidays) {
      console.warn('No holiday data available. Calculations may be inaccurate.');
    }
  } catch (error) {
    console.error('Failed to update holiday data:', error);
  }

  try {
    await initializeApp();
  } catch (initError) {
    console.error('Failed to initialize app:', initError);
  }
});

console.log('popup.js file fully loaded');
