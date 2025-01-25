# Date Calculator Plus

A modern web application for calculating working days between dates, taking into account holidays and weekends across different countries.

## Features

- **Working Days Calculator**
  - Calculate the number of working days between two dates
  - Calculate end dates based on a number of working days
  - Automatic handling of weekends and public holidays
  - Support for multiple countries

- **Holiday Integration**
  - Real-time holiday data from Nager.Date API
  - Automatic caching of holiday information
  - Support for multiple countries and regions

- **User Interface**
  - Clean, modern design
  - Quick select buttons for common calculations
  - Responsive layout for all devices
  - Detailed results with holiday information

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd date-calculator-plus
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.template` to `.env`:
     ```bash
     cp .env.template .env
     ```
   - Configure the following variables in `.env`:
     ```plaintext
     REACT_APP_HOLIDAY_API_BASE_URL=https://date.nager.at/api/v3
     REACT_APP_HOLIDAY_API_KEY=your_api_key_here
     REACT_APP_ENABLE_HOLIDAY_CACHING=true
     REACT_APP_MAX_YEAR_RANGE=5
     ```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm start` - Starts the development server
- `npm test` - Runs the test suite
  - `npm run test:unit` - Runs unit tests
  - `npm run test:integration` - Runs integration tests
  - `npm run test:e2e` - Runs end-to-end tests with Cypress
- `npm run build` - Creates a production build
- `npm run lint` - Checks code style
- `npm run format` - Formats code with Prettier

## Testing

The application includes comprehensive test coverage:

- **Unit Tests**: Testing individual components and utilities
- **Integration Tests**: Testing API integration and service interactions
- **E2E Tests**: Testing complete user workflows with Cypress

Run the full test suite:
```bash
npm test
```

## Project Structure

```
src/
├── features/
│   ├── calculator/     # Calculator feature
│   │   ├── components/
│   │   ├── services/
│   │   ├── utils/
│   │   └── styles/
│   ├── holidays/       # Holiday management
│   │   ├── components/
│   │   ├── services/
│   │   ├── utils/
│   │   └── styles/
│   └── shared/        # Shared components
├── config/           # Application configuration
└── index.js         # Application entry point
```

## API Integration

The application integrates with the Nager.Date API for holiday data. Key features:

- Automatic caching of holiday data
- Rate limiting protection
- Error handling and retry logic
- Support for multiple countries

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

### Development Guidelines

- Write tests for new features
- Follow the existing code style
- Update documentation as needed
- Add comments for complex logic

## Security

- Environment variables prefixed with `REACT_APP_` are exposed to the client
- API keys should be kept secure and not committed to version control
- Regular security audits are performed on dependencies
- Rate limiting is implemented for API calls

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Nager.Date API](https://date.nager.at/) for holiday data
- [React](https://reactjs.org/) for the UI framework
- [date-fns](https://date-fns.org/) for date manipulation
- [Jest](https://jestjs.io/) and [Cypress](https://www.cypress.io/) for testing
