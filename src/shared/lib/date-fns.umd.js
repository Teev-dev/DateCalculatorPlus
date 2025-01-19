console.error("Couldn't find the requested file /dist/date-fns.umd.js in date-fns.");
import { format, parseISO } from 'date-fns';

function formatDate(dateString) {
    console.log('Input Date String:', dateString); // Debugging statement

    try {
        const date = parseISO(dateString);
        console.log('Parsed Date:', date); // Debugging statement

        const formattedDate = format(date, 'yyyy-MM-dd');
        console.log('Formatted Date:', formattedDate); // Debugging statement

        return formattedDate;
    } catch (error) {
        console.error('Error formatting date:', error); // Error handling
    }
}

// Example usage
const dateStr = '2023-10-01T00:00:00Z';
formatDate(dateStr);