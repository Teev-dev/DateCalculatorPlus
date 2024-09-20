import { addDays, format, getDay, startOfDay } from 'date-fns';
import { updateHolidayData, getHolidayData } from './holiday_data_updater';
import { countries } from './countries';

console.log('date-fns, holiday_data_updater, and countries imported successfully');
console.log('Countries:', countries);

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
    const endDateGroup = document.getElementById('endDateGroup');
    const endDateInput = document.getElementById('endDate');
    const workingDaysInput = document.getElementById('workingDays');
    const countrySelect = document.getElementById('country');
    const countrySearchInput = document.getElementById('countrySearch');

    // Populate country select with virtual scroll
    populateCountrySelect(countries);
    console.log('Country select populated with all ISO 3166-1 countries');

    // Add event listener for country search
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
        if (this.value === 'betweenDates') {
            workingDaysGroup.style.display = 'none';
            directionGroup.style.display = 'none';
            endDateGroup.style.display = 'block';
            endDateInput.required = true;
            workingDaysInput.required = false;
        } else {
            workingDaysGroup.style.display = 'block';
            directionGroup.style.display = 'block';
            endDateGroup.style.display = 'none';
            endDateInput.required = false;
            workingDaysInput.required = true;
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
            const endDate = new Date(document.getElementById('endDate').value);
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

function populateCountrySelect(countriesList) {
    const countrySelect = document.getElementById('country');
    countrySelect.innerHTML = '';
    
    const fragment = document.createDocumentFragment();
    countriesList.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.innerHTML = `
            <span class="country-option">
                <img src="${country.flag}" alt="${country.name} flag" class="country-flag">
                ${country.name} (${country.code})
            </span>
        `;
        fragment.appendChild(option);
    });
    
    countrySelect.appendChild(fragment);
    console.log('Country select options updated');
}

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
    console.log(`Holiday data for ${country}:`, holidays[country]);
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
        
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return false;
        }

        const formattedDate = format(date, 'yyyy-MM-dd');
        if (holidays[country].includes(formattedDate)) {
            console.log(`Holiday detected for ${country}: ${formattedDate}`);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error in isWorkingDay:', error);
        throw error;
    }
}
