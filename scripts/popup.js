import { addDays, format, getDay, startOfDay, differenceInDays } from 'date-fns';
import { updateHolidayData, getHolidayData } from './holiday_data_updater';

console.log('date-fns and holiday_data_updater imported successfully');

document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM content loaded');
    await updateHolidayData();
    const holidays = getHolidayData();
    
    const form = document.getElementById('calculatorForm');
    const resultDiv = document.getElementById('result');
    const calculatedResultEl = document.getElementById('calculatedResult');
    const calculationModeEl = document.getElementById('calculationMode');
    const workingDaysGroup = document.getElementById('workingDaysGroup');
    const directionGroup = document.getElementById('directionGroup');

    calculationModeEl.addEventListener('change', function() {
        if (this.value === 'betweenDates') {
            workingDaysGroup.style.display = 'none';
            directionGroup.style.display = 'none';
        } else {
            workingDaysGroup.style.display = 'block';
            directionGroup.style.display = 'block';
        }
    });

    form.addEventListener('submit', function(e) {
        console.log('Form submitted');
        e.preventDefault();
        
        const startDate = new Date(document.getElementById('startDate').value);
        const country = document.getElementById('country').value;
        const calculationMode = document.getElementById('calculationMode').value;

        let result;
        if (calculationMode === 'betweenDates') {
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 30); // Default to 30 days from start date
            result = calculateWorkingDaysBetweenDates(startDate, endDate, country, holidays);
        } else {
            const workingDays = parseInt(document.getElementById('workingDays').value);
            const direction = document.getElementById('direction').value;
            result = calculateWorkingDate(startDate, workingDays, country, direction, holidays);
        }

        resultDiv.classList.remove('hidden');
        calculatedResultEl.textContent = result;
    });
});

function calculateWorkingDate(startDate, workingDays, country, direction, holidays) {
    console.log('Calculating working date');
    try {
        let currentDate = startOfDay(startDate);
        let daysToAdd = direction === 'future' ? 1 : -1;
        let workingDaysCount = 0;

        while (workingDaysCount < workingDays) {
            currentDate = addDays(currentDate, daysToAdd);
            
            if (isWorkingDay(currentDate, country, holidays)) {
                workingDaysCount++;
            }
        }

        console.log('Calculation complete, returning date:', currentDate);
        return `The ${direction === 'future' ? 'future' : 'past'} date after ${workingDays} working days is: ${format(currentDate, 'MMMM d, yyyy')}`;
    } catch (error) {
        console.error('Error in calculateWorkingDate:', error);
        throw error;
    }
}

function calculateWorkingDaysBetweenDates(startDate, endDate, country, holidays) {
    console.log('Calculating working days between dates');
    try {
        let currentDate = startOfDay(startDate);
        const lastDate = startOfDay(endDate);
        let workingDaysCount = 0;

        while (currentDate <= lastDate) {
            if (isWorkingDay(currentDate, country, holidays)) {
                workingDaysCount++;
            }
            currentDate = addDays(currentDate, 1);
        }

        console.log('Calculation complete, working days:', workingDaysCount);
        return `The number of working days between ${format(startDate, 'MMMM d, yyyy')} and ${format(endDate, 'MMMM d, yyyy')} is: ${workingDaysCount}`;
    } catch (error) {
        console.error('Error in calculateWorkingDaysBetweenDates:', error);
        throw error;
    }
}

function isWorkingDay(date, country, holidays) {
    try {
        const dayOfWeek = getDay(date);
        
        // Check if it's a weekend (Saturday or Sunday)
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return false;
        }

        // Check if it's a public holiday
        const formattedDate = format(date, 'yyyy-MM-dd');
        return !holidays[country].includes(formattedDate);
    } catch (error) {
        console.error('Error in isWorkingDay:', error);
        throw error;
    }
}
