import { addDays, format, getDay, startOfDay } from 'date-fns';
import { updateHolidayData, getHolidayData, getLastUpdated } from './holiday_data_updater';
import { countries, areCountriesInitialized, getCountries } from './countries';

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

    // Wait for countries to be initialized
    await waitForCountriesInitialization();
    populateCountrySelect(getCountries());

    countrySearchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredCountries = getCountries().filter(country => 
            country.name.toLowerCase().includes(searchTerm) || 
            country.code.toLowerCase().includes(searchTerm)
        );
        populateCountrySelect(filteredCountries);
        console.log('Country search performed:', searchTerm);
    });

    // ... rest of the code remains unchanged ...
});

async function waitForCountriesInitialization() {
    console.log('Waiting for countries initialization...');
    const maxAttempts = 50;
    const delayMs = 100;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        if (areCountriesInitialized()) {
            console.log('Countries initialized successfully.');
            return;
        }
        await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    console.warn('Countries initialization timed out. Using fallback list.');
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

// ... rest of the file remains unchanged
