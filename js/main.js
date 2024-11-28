const COUNTRIES = {
    'US': 'United States',
    'GB': 'United Kingdom',
    'DE': 'Germany',
    'FR': 'France',
    'ES': 'Spain',
    // Add more countries as needed
};

document.addEventListener('DOMContentLoaded', function() {
    const countrySearch = document.getElementById('countrySearch');
    const countryList = document.getElementById('countryList');
    
    // Create country list HTML
    Object.entries(COUNTRIES).forEach(([code, name]) => {
        const div = document.createElement('div');
        div.className = 'country-item';
        div.textContent = name;
        div.dataset.code = code;
        countryList.appendChild(div);
    });

    // Country search functionality
    countrySearch.addEventListener('input', function(e) {
        const searchText = e.target.value.toLowerCase();
        const countryItems = countryList.getElementsByClassName('country-item');
        
        Array.from(countryItems).forEach(item => {
            const countryName = item.textContent.toLowerCase();
            item.style.display = countryName.includes(searchText) ? 'block' : 'none';
        });
        
        countryList.style.display = searchText ? 'block' : 'none';
    });

    // Country selection
    countryList.addEventListener('click', function(e) {
        if (e.target.classList.contains('country-item')) {
            countrySearch.value = e.target.textContent;
            countrySearch.dataset.code = e.target.dataset.code;
            countryList.style.display = 'none';
        }
    });

    // Holiday API integration
    async function getHolidays(countryCode, year) {
        try {
            const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
            if (!response.ok) throw new Error('Failed to fetch holidays');
            return await response.json();
        } catch (error) {
            console.error('Error fetching holidays:', error);
            return [];
        }
    }

    // Calculate button click handler
    document.getElementById('calculate').addEventListener('click', async function(e) {
        e.preventDefault();
        const startDate = new Date(document.getElementById('startDate').value);
        const workingDays = parseInt(document.getElementById('workingDays').value);
        const countryCode = countrySearch.dataset.code;
        const direction = document.getElementById('direction').value;

        if (!countryCode) {
            alert('Please select a country');
            return;
        }

        // Get holidays for the relevant years
        const startYear = startDate.getFullYear();
        const holidays = await getHolidays(countryCode, startYear);
        
        // Display result
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
            <h3>Calculation Result:</h3>
            <p>Start Date: ${startDate.toLocaleDateString()}</p>
            <p>Working Days: ${workingDays}</p>
            <p>Country: ${COUNTRIES[countryCode]}</p>
            <p>Direction: ${direction}</p>
            <p>Holidays found: ${holidays.length}</p>
        `;
        resultDiv.classList.add('show');
    });
}); 