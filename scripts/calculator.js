import dateFns from '../lib/date-fns.umd.min.js';
import { getCountries } from './countries.js';
import { getHolidayData } from './holiday_data_updater.js';

export function initializeCalculator() {
    const form = document.getElementById('calculatorForm');
    const calculationMode = document.getElementById('calculationMode');
    const workingDaysGroup = document.getElementById('workingDaysGroup');
    const endDateGroup = document.getElementById('endDateGroup');
    const directionGroup = document.getElementById('directionGroup');
    const countrySelect = document.getElementById('country');
    const result = document.getElementById('result');
    const calculatedResult = document.getElementById('calculatedResult');

    // Initialize country selection
    const countries = getCountries();
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = country.name;
        countrySelect.appendChild(option);
    });

    calculationMode.addEventListener('change', function() {
        const isBetweenDates = this.value === 'betweenDates';
        workingDaysGroup.style.display = isBetweenDates ? 'none' : 'block';
        endDateGroup.style.display = isBetweenDates ? 'block' : 'none';
        directionGroup.style.display = isBetweenDates ? 'none' : 'block';
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const startDate = new Date(document.getElementById('startDate').value);
        const countryCode = countrySelect.value;
        const holidays = getHolidayData()?.[countryCode] || [];

        let resultText = '';
        
        if (calculationMode.value === 'betweenDates') {
            const endDate = new Date(document.getElementById('endDate').value);
            const workingDays = calculateWorkingDaysBetween(startDate, endDate, holidays);
            resultText = `There are ${workingDays} working days between ${startDate.toLocaleDateString()} and ${endDate.toLocaleDateString()}`;
        } else {
            const workingDays = parseInt(document.getElementById('workingDays').value);
            const direction = document.getElementById('direction').value;
            const resultDate = calculateDate(startDate, workingDays, direction, holidays);
            resultText = `The resulting date is ${resultDate.toLocaleDateString()}`;
        }

        result.classList.remove('hidden');
        calculatedResult.textContent = resultText;
    });
}

function calculateWorkingDaysBetween(startDate, endDate, holidays) {
    let workingDays = 0;
    let currentDate = dateFns.startOfDay(startDate);
    const lastDate = dateFns.startOfDay(endDate);

    while (dateFns.isBefore(currentDate, lastDate) || dateFns.isEqual(currentDate, lastDate)) {
        if (isWorkingDay(currentDate, holidays)) {
            workingDays++;
        }
        currentDate = dateFns.addDays(currentDate, 1);
    }

    return workingDays;
}

function calculateDate(startDate, workingDays, direction, holidays) {
    let currentDate = dateFns.startOfDay(startDate);
    let remainingDays = workingDays;

    while (remainingDays > 0) {
        currentDate = dateFns.addDays(currentDate, direction === 'future' ? 1 : -1);
        if (isWorkingDay(currentDate, holidays)) {
            remainingDays--;
        }
    }

    return currentDate;
}

function isWorkingDay(date, holidays) {
    const dayOfWeek = dateFns.getDay(date);
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dateString = dateFns.format(date, 'yyyy-MM-dd');
    const isHoliday = holidays.includes(dateString);
    return !isWeekend && !isHoliday;
} 