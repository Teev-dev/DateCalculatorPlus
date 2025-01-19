import { initializeCalculator } from '../Feature/calculator.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeCalculator();

    // Add web-specific functionality
    const installButton = document.getElementById('installExtension');
    
    installButton.addEventListener('click', () => {
        // Check if Chrome browser
        if (navigator.userAgent.includes('Chrome')) {
            window.open('https://chrome.google.com/webstore/detail/your-extension-id', '_blank');
        } else {
            alert('This extension is only available for Google Chrome browser.');
        }
    });
}); 