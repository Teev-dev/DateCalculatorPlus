import { addDays, format, getDay, startOfDay, differenceInBusinessDays } from './date-fns.js';
import { updateHolidayData, getHolidayData, getLastUpdated } from './holiday_data_updater.js';
import { getCountries, areCountriesInitialized } from './countries.js';

console.log('date-fns, holiday_data_updater, and countries imported successfully');

document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM content loaded');
    try {
        await updateHolidayData();
        const holidays = getHolidayData();
        const lastUpdated = getLastUpdated();
        console.log(`Holiday data last updated: ${lastUpdated}`);
        
        if (!holidays) {
            console.warn('No holiday data available. Calculations may be inaccurate.');
        }
    } catch (error) {
        console.error('Failed to update holiday data:', error);
    }
    
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

    console.log('Are countries initialized:', areCountriesInitialized());
    const countries = getCountries();
    console.log('Countries fetched:', countries.length);
    populateCountrySelect(countries);

    countrySearchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredCountries = getCountries().filter(country => 
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

    form.addEventListener('submit', function(e) {
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
    });
});

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

// ... rest of the file remains unchanged
