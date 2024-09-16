import { addDays, format, getDay, startOfDay } from 'date-fns';
import { updateHolidayData, getHolidayData } from './holiday_data_updater';

console.log('date-fns and holiday_data_updater imported successfully');

document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM content loaded');
    await updateHolidayData();
    const holidays = getHolidayData();
    
    const form = document.getElementById('calculatorForm');
    const resultDiv = document.getElementById('result');
    const calculatedDateEl = document.getElementById('calculatedDate');

    form.addEventListener('submit', function(e) {
        console.log('Form submitted');
        e.preventDefault();
        
        const startDate = new Date(document.getElementById('startDate').value);
        const workingDays = parseInt(document.getElementById('workingDays').value);
        const country = document.getElementById('country').value;
        const direction = document.getElementById('direction').value;

        console.log('Input values:', { startDate, workingDays, country, direction });

        try {
            const calculatedDate = calculateWorkingDate(startDate, workingDays, country, direction, holidays);
            console.log('Calculated date:', calculatedDate);

            resultDiv.classList.remove('hidden');
            calculatedDateEl.textContent = `The ${direction === 'future' ? 'future' : 'past'} date after ${workingDays} working days is: ${format(calculatedDate, 'MMMM d, yyyy')}`;
        } catch (error) {
            console.error('Error calculating date:', error);
            resultDiv.classList.remove('hidden');
            calculatedDateEl.textContent = 'An error occurred while calculating the date. Please try again.';
        }
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
        return currentDate;
    } catch (error) {
        console.error('Error in calculateWorkingDate:', error);
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
