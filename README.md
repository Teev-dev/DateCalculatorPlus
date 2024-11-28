# Date Calculator Plus

Date Calculator Plus is a web application that allows users to calculate future or past dates based on working days for various countries. It also provides functionality to calculate the number of working days between two dates.

## Features

- Calculate future or past dates based on a given number of working days
- Calculate the number of working days between two dates
- Support for multiple countries with their respective public holidays
- Automatic handling of weekends and public holidays
- User-friendly interface with intuitive controls
- Country search functionality
- Display of country flags

## Usage

1. Visit the web application at [your-url-here]
2. Choose the calculation mode:
   - "Calculate Future/Past Date": To find a date in the future or past based on working days
   - "Calculate Working Days Between Dates": To count working days between two dates
3. Enter the required information:
   - Start Date
   - Number of Working Days (for Future/Past Date calculation)
   - End Date (for Working Days Between Dates calculation)
   - Country (use the search functionality to find your desired country)
   - Direction (Future or Past, for Future/Past Date calculation)
4. Click "Calculate" to see the result.

## Development

This application is built using HTML, CSS, and JavaScript. It uses the following libraries:

- date-fns: For date manipulation and calculations
- countries-list: For country data

To set up the development environment:

1. Clone the repository and navigate to the project directory
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Visit `http://localhost:8080` in your browser

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Acknowledgments

- [date-fns](https://date-fns.org/) for providing excellent date manipulation utilities
- [OpenHolidays API](https://openholidaysapi.org/) for public holiday data
- [flag-icons](https://flagicons.lipis.dev/) for providing country flag icons
