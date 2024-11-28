import { getCountries } from './countries.js';
import { addBusinessDays, subBusinessDays, differenceInBusinessDays } from 'date-fns';
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

    // Handle calculation mode changes
    calculationMode.addEventListener('change', function() {
        const isBetweenDates = this.value === 'betweenDates';
        workingDaysGroup.style.display = isBetweenDates ? 'none' : 'block';
        endDateGroup.style.display = isBetweenDates ? 'block' : 'none';
        directionGroup.style.display = isBetweenDates ? 'none' : 'block';
    });

    // Handle form submission
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
    // Adjust for holidays
    const businessDays = differenceInBusinessDays(endDate, startDate);
    const holidaysInRange = holidays.filter(holiday => {
        const holidayDate = new Date(holiday);
        return holidayDate >= startDate && holidayDate <= endDate;
    });
    return businessDays - holidaysInRange.length;
}

function calculateDate(startDate, workingDays, direction, holidays) {
    const calculateFunc = direction === 'future' ? addBusinessDays : subBusinessDays;
    let resultDate = calculateFunc(startDate, workingDays);
    
    // Adjust for holidays
    let additionalDays = 0;
    holidays.forEach(holiday => {
        const holidayDate = new Date(holiday);
        if (direction === 'future' && holidayDate > startDate && holidayDate <= resultDate) {
            additionalDays++;
        } else if (direction === 'past' && holidayDate < startDate && holidayDate >= resultDate) {
            additionalDays++;
        }
    });

    if (additionalDays > 0) {
        resultDate = calculateFunc(resultDate, additionalDays);
    }

    return resultDate;
} 