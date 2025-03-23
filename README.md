# DateCalculatorPlus

An advanced date calculation application that helps you manage complex date calculations, time zone conversions, working days calculations, and holiday awareness.

![DateCalculatorPlus](https://via.placeholder.com/800x400?text=DateCalculatorPlus)

## Features

- **Date Difference Calculator**: Calculate the exact difference between dates in various units, with options to exclude weekends and holidays.
- **Date Add/Subtract**: Add or subtract time from a date with support for working days only.
- **Timezone Converter**: Convert dates and times between different timezones around the world.
- **Holiday Calculator**: Check if a date is a holiday and view upcoming holidays in different regions.
- **Responsive Interface**: Beautiful, intuitive UI that works on desktop and mobile devices.
- **Customizable Settings**: Set your preferences for default date formats, timezones, and calculation options.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/date-calculator-plus.git
   cd date-calculator-plus
   ```

2. Run the setup script to install all dependencies:
   ```bash
   ./setup.sh
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Usage

### Date Difference Calculator

1. Navigate to the Date Calculator tab.
2. Enter start and end dates.
3. Choose calculation options (include/exclude weekends and holidays).
4. View the result showing the exact difference in your preferred units.

### Date Add/Subtract

1. Navigate to the Date Adder tab.
2. Select a base date.
3. Enter the amount of time to add or subtract.
4. Choose calculation options (work days only, exclude holidays).
5. View the resulting date.

### Timezone Converter

1. Navigate to the Timezone Converter tab.
2. Enter a date and time.
3. Select source and target timezones.
4. View the converted time and the timezone difference.

### Holiday Calculator

1. Navigate to the Holiday Calculator tab.
2. Select a date and region.
3. Check if the date is a holiday.
4. View upcoming holidays in the selected region.

## Technology Stack

- **Frontend**: React.js with TypeScript
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: React Query
- **Routing**: React Router
- **Date Manipulation**: date-fns library
- **Backend**: Express.js (for API endpoints)
- **Database**: Drizzle ORM (for persistent storage)

## Project Structure

```
date-calculator-plus/
├── src/
│   ├── components/       # UI components
│   │   ├── calculator/   # Calculator components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # Common UI components
│   ├── lib/              # Utility functions
│   │   └── date/         # Date manipulation utilities
│   ├── server/           # Server-side code
│   │   ├── api/          # API routes
│   │   └── db/           # Database models and utilities
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── public/               # Public assets
├── setup.sh              # Setup script
└── package.json          # Project dependencies
```

## Development

To contribute to the project:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [date-fns](https://date-fns.org/) - Modern JavaScript date utility library
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible UI components
- [React Query](https://react-query.tanstack.com/) - Hooks for fetching, caching and updating data
