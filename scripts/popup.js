import { initializeCalculator } from './calculator';
import { updateHolidayData } from './holiday_data_updater';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing application...');
    
    // Update holiday data first
    try {
        await updateHolidayData();
        console.log('Holiday data updated successfully');
    } catch (error) {
        console.error('Error updating holiday data:', error);
    }

    // Initialize calculator
    try {
        initializeCalculator();
        console.log('Calculator initialized successfully');
    } catch (error) {
        console.error('Error initializing calculator:', error);
    }
});
