# Date Calculator Plus

Date Calculator Plus is a Google Chrome extension that allows users to calculate future or past dates based on working days for various countries. It also provides functionality to calculate the number of working days between two dates.

## Features

- Calculate future or past dates based on a given number of working days
- Calculate the number of working days between two dates
- Support for multiple countries with their respective public holidays
- Automatic handling of weekends and public holidays
- User-friendly interface with intuitive controls
- Country search functionality
- Display of country flags

## Installation

1. Download the extension files or clone the repository.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.
5. The Date Calculator Plus extension should now appear in your Chrome toolbar.

## Usage

1. Click on the Date Calculator Plus icon in your Chrome toolbar to open the extension popup.
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

This extension is built using HTML, CSS, and JavaScript. It uses the following libraries and tools:

- date-fns: For date manipulation and calculations
- Webpack: For bundling JavaScript files
- Node.js and npm: For managing dependencies and build processes

To set up the development environment:

1. Ensure you have Node.js and npm installed.
2. Clone the repository and navigate to the project directory.
3. Run `npm install` to install dependencies.
4. Make changes to the source files in the `scripts` directory.
5. Run `npm run build` to bundle the JavaScript files.

### Reloading the Extension After Changes

After making changes to the extension:

1. Run `npm run build` to update the bundled JavaScript files.
2. Go to `chrome://extensions/` in your Chrome browser.
3. Find the Date Calculator Plus extension.
4. Click the circular refresh icon next to the extension to reload it.
5. Open the extension popup to see your changes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Acknowledgments

- [date-fns](https://date-fns.org/) for providing excellent date manipulation utilities
- [Nager.Date API](https://date.nager.at/) for public holiday data
- [flag-icons](https://flagicons.lipis.dev/) for providing country flag icons
