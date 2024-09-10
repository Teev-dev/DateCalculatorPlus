// Check if date-fns library is loaded
if (typeof dateFns === 'undefined') {
    console.error('date-fns library not loaded');
} else {
    console.log('date-fns library loaded successfully');
}

console.log('date-fns available:', typeof dateFns !== 'undefined');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');
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
            const calculatedDate = calculateWorkingDate(startDate, workingDays, country, direction);
            console.log('Calculated date:', calculatedDate);

            resultDiv.classList.remove('hidden');
            calculatedDateEl.textContent = `The ${direction === 'future' ? 'future' : 'past'} date after ${workingDays} working days is: ${dateFns.format(calculatedDate, 'MMMM d, yyyy')}`;
        } catch (error) {
            console.error('Error calculating date:', error);
            resultDiv.classList.remove('hidden');
            calculatedDateEl.textContent = 'An error occurred while calculating the date. Please try again.';
        }
    });
});

function calculateWorkingDate(startDate, workingDays, country, direction) {
    console.log('Calculating working date');
    try {
        let currentDate = dateFns.startOfDay(startDate);
        let daysToAdd = direction === 'future' ? 1 : -1;
        let workingDaysCount = 0;

        while (workingDaysCount < workingDays) {
            currentDate = dateFns.addDays(currentDate, daysToAdd);
            
            if (isWorkingDay(currentDate, country)) {
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

function isWorkingDay(date, country) {
    try {
        const dayOfWeek = dateFns.getDay(date);
        
        // Check if it's a weekend (Saturday or Sunday)
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return false;
        }

        // Check if it's a public holiday
        const formattedDate = dateFns.format(date, 'yyyy-MM-dd');
        return !holidays[country].includes(formattedDate);
    } catch (error) {
        console.error('Error in isWorkingDay:', error);
        throw error;
    }
}
