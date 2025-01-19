# Date Calculator Plus

Date Calculator Plus is a Google Chrome extension that allows users to calculate future or past dates based on working days for various countries. It also provides functionality to calculate the number of working days between two dates.

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.template` to `.env`
   - Fill in your API keys and tokens:
     - `REACT_APP_HOLIDAY_API_KEY`: Your holiday API key (if required)
     - `REACT_APP_GITHUB_TOKEN`: Your GitHub personal access token

   To create a GitHub personal access token:
   1. Go to GitHub Settings > Developer settings > Personal access tokens
   2. Click "Generate new token"
   3. Select the necessary scopes for your application
   4. Copy the token and paste it in your `.env` file

   Note: Never commit your `.env` file or share your tokens publicly!

4. Start the development server:
```bash
npm start
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run lint` - Runs the linter
- `npm run format` - Formats code with Prettier

## Features

- Calculate future or past dates based on a given number of working days
- Calculate the number of working days between two dates
- Support for multiple countries with their respective public holidays
- Automatic handling of weekends and public holidays
- User-friendly interface with intuitive controls
- Country search functionality
- Display of country flags
- Real-time calculations
- Responsive design

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

This extension is built using HTML, CSS, and JavaScript. It uses the following libraries:

- date-fns: For date manipulation and calculations

To set up the development environment:

1. Ensure you have Python installed on your system.
2. Clone the repository and navigate to the project directory.
3. Run the development server using the command: `python -m http.server 8000`
4. Make changes to the source files in the `scripts` directory.

### Reloading the Extension After Changes

After making changes to the extension:

1. Go to `chrome://extensions/` in your Chrome browser.
2. Find the Date Calculator Plus extension.
3. Click the circular refresh icon next to the extension to reload it.
4. Open the extension popup to see your changes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Acknowledgments

- [date-fns](https://date-fns.org/) for providing excellent date manipulation utilities
- [OpenHolidays API](https://openholidaysapi.org/) for public holiday data
- [flag-icons](https://flagicons.lipis.dev/) for providing country flag icons

## Security Notes

- Environment variables prefixed with `REACT_APP_` are exposed to the client
- The GitHub token should only have the minimum required permissions
- Regularly rotate your access tokens
- Monitor token usage in GitHub security settings
