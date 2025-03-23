# DateCalculatorPlus Development Plan

## Quick Start
```bash
# Initial setup
npm install
npm run setup-db
npm run process-images  # Runs the image optimization pipeline

# Development
npm run dev  # Runs the main server on port 5000

# Testing
npm run test  # Runs all tests
npm run test:unit  # Runs unit tests only
npm run test:api  # Runs API tests only

# Production
npm run build
npm run start
```

## Overview

DateCalculatorPlus is a comprehensive date calculation application that helps users perform complex date operations with ease. The application provides a modern, user-friendly interface for calculating time differences, adding or subtracting time periods, scheduling recurring events, managing time zones, and visualizing date ranges.

Key features include:
- Date difference calculations (days, weeks, months, years)
- Date addition/subtraction with flexible time units
- Working/business days calculations 
- Time zone conversion and management
- Holiday awareness for multiple countries/regions
- Date formatting for different locales
- Custom date range visualization
- Scheduling capabilities with recurring events
- Date history and favorites management

## Implementation Plan

### Step 1: Repository Structure and Development Environment
```typescript
1. Repository Initialization:
   - Verify existing repository structure ✅
   - Update package.json with required dependencies ⏳
   - Configure ESLint and Prettier for code formatting ✅
   - Setup Jest and Testing Library for testing ✅
   - Configure Webpack for bundling ✅

2. Directory Structure Organization:
   - Reorganize the src folder for better organization ⏳
   - Ensure proper separation of concerns:
     - /lib for utility functions
     - /components for UI components
     - /features for domain-specific code
     - /hooks for custom React hooks
     - /api for API client and integrations
   
3. Environment Configuration:
   - Setup environment variables in .env file ✅
   - Configure development, test, and production environments ⏳
   - Setup database connection using Drizzle ORM ⏳
   - Initialize Express backend for API routes ⏳

4. Project Configuration Scripts:
   - Create database setup script (setup-db.js) ⏳
   - Configure build and deployment scripts ⏳
   - Setup CI/CD pipeline with GitHub Actions ⏳
```

### Step 2: Core Date Calculation Engine
```typescript
1. Implement Core Date Utility Library (/src/lib/date/):
   - Create directory structure for date utilities ⏳
   - Implement essential date calculation functions:
     - date-diff.ts: For calculating differences between dates ⏳
     - date-add.ts: For adding/subtracting time periods ⏳
     - workdays.ts: For handling business days calculations ⏳
     - timezone.ts: For timezone conversions and management ⏳
     - holidays.ts: For holiday detection across regions ⏳
     - formatting.ts: For date formatting in various locales ⏳

2. Essential Function Implementation:
   - Implement calculateDateDifference() in date-diff.ts ⏳
     - Support for different units (days, weeks, months, years)
     - Options for excluding weekends and holidays
     - Handle timezone differences

   - Implement addToDate() in date-add.ts ⏳
     - Support for different units (days, weeks, months, years)
     - Support for workdays-only calculations
     - Handle month/year boundary cases
     - Adjust for holidays if needed

   - Implement getWorkdaysInRange() in workdays.ts ⏳
     - Configurable work week (e.g., Mon-Fri, Sun-Thu)
     - Holiday exclusion by region
     - Half-day holiday support

   - Implement convertToTimezone() in timezone.ts ⏳
     - Convert dates between timezones
     - Calculate time differences across zones
     - Handle DST transitions

   - Implement getHolidays() in holidays.ts ⏳
     - Integration with holiday API
     - Regional holiday calendars
     - Custom holiday definitions

   - Implement formatDate() in formatting.ts ⏳
     - Format date according to specified format
     - Apply locale-specific formatting
```

### Step 3: UI Components & Calculator Interface
```typescript
1. Base UI Component Implementation:
   - Create reusable UI components in /src/components/ui/ ⏳
     - Button.tsx: Enhanced button component with variants
     - DatePicker.tsx: Accessible date selection component
     - NumberInput.tsx: Input with validation for numeric values
     - Select.tsx: Enhanced dropdown component
     - Card.tsx: Container component with various styles
     - Tabs.tsx: Tab navigation component

2. Calculator Component Implementation:
   - Create specialized calculator components in /src/components/calculator/ ⏳
     - DateDiffCalculator.tsx: For date difference calculations
     - DateAddCalculator.tsx: For date addition/subtraction
     - WorkdayCalculator.tsx: For business day calculations
     - TimezoneCalculator.tsx: For timezone conversions
     - RecurrenceCalculator.tsx: For recurring date patterns
     - DateRangeVisualizer.tsx: For visualizing date ranges

3. Layout Component Implementation:
   - Create layout components in /src/components/layout/ ⏳
     - Header.tsx: Application header with navigation
     - Footer.tsx: Application footer with links
     - Layout.tsx: Main layout wrapper
     - Sidebar.tsx: Navigation sidebar

4. Component Styling:
   - Implement styling using Tailwind CSS ⏳
   - Create custom Tailwind theme in tailwind.config.js ⏳
   - Ensure responsive design for all components ⏳
   - Create dark mode variants for all components ⏳

5. Component Testing:
   - Create comprehensive component tests ⏳
   - Test user interactions using Testing Library ⏳
   - Verify accessibility using axe-core ⏳
   - Test responsiveness using different viewport sizes ⏳
```

### Step 4: API Routes & Data Persistence
```typescript
1. Database Schema Setup:
   - Implement Drizzle ORM schema in /src/server/db/schema.ts ⏳
     - Create dateCalculations table for storing calculations
     - Create savedDates table for storing user-saved dates
     - Create users table for user authentication
   - Create database migration scripts ⏳
   - Implement database seed script for initial data ⏳

2. API Route Implementation:
   - Create Express API routes in /src/server/api/ ⏳
     - calculations.ts: CRUD operations for calculations
     - saved-dates.ts: CRUD operations for saved dates
     - holidays.ts: Holiday data retrieval endpoints
     - timezones.ts: Timezone data and conversion endpoints
   - Implement route validation using Zod ⏳
   - Create middleware for authentication and error handling ⏳

3. Database Query Implementation:
   - Create database query functions in /src/server/db/ ⏳
     - calculations.ts: Queries for calculation operations
     - saved-dates.ts: Queries for saved date operations
     - users.ts: Queries for user management
   - Implement efficient query patterns and indexing ⏳

4. API Integration Testing:
   - Create API test suite using Supertest and Jest ⏳
   - Test happy paths for all endpoints ⏳
   - Test error cases and edge conditions ⏳
   - Test authentication and authorization ⏳

5. API Client Implementation:
   - Create API client functions in /src/lib/api/ ⏳
     - calculations.ts: Client functions for calculation API
     - saved-dates.ts: Client functions for saved dates API
     - holidays.ts: Client functions for holiday API
     - timezones.ts: Client functions for timezone API
   - Implement error handling and retry logic ⏳
   - Add request caching for improved performance ⏳
```

### Step 5: Authentication & User Management
```typescript
1. Authentication Implementation:
   - Set up NextAuth.js for authentication ⏳
     - Configure OAuth providers (Google, GitHub, etc.)
     - Setup email/password authentication
     - Implement JWT token handling
   - Create login and registration pages ⏳
   - Implement session management ⏳

2. User Management:
   - Create user profile page ⏳
   - Implement user settings management ⏳
     - Default timezone setting
     - Preferred date format
     - Work week configuration (e.g., Mon-Fri or Sun-Thu)
   - Create account management functions ⏳
     - Password reset
     - Email verification
     - Account deletion

3. Authorization System:
   - Implement role-based access control ⏳
   - Create protected routes using NextAuth middleware ⏳
   - Add permission checks to API endpoints ⏳

4. User Preference Persistence:
   - Store user preferences in database ⏳
   - Implement client-side preference caching ⏳
   - Create preference sync between devices ⏳

5. Authentication Testing:
   - Test authentication flows ⏳
   - Test authorization rules ⏳
   - Test user preference management ⏳
```

### Step 6: Advanced Features & Visualizations
```typescript
1. Date Range Visualization:
   - Implement calendar view component ⏳
     - Support for day, week, month, and year views
     - Highlight date ranges
     - Mark holidays and special dates
   - Create timeline visualization component ⏳
     - Support for linear time representation
     - Zoom levels for different time scales
     - Interactive elements for date selection

2. Recurring Date Patterns:
   - Implement recurrence rule engine ⏳
     - Support for daily, weekly, monthly, yearly patterns
     - Custom recurrence rules (e.g., first Monday of month)
     - Exclusion dates and exception handling
   - Create recurrence pattern editor ⏳
   - Implement recurrence preview visualization ⏳

3. Export and Integration:
   - Implement export options ⏳
     - CSV export for calculation results
     - PDF export with formatted reports
     - iCal export for recurring dates
     - Outlook export for recurring dates
   - Create API for external integrations ⏳
   - Implement webhook system for automation ⏳

4. Advanced Calculation Features:
   - Implement date series generation ⏳
   - Create batch calculation functionality ⏳
   - Implement date pattern recognition ⏳

5. Offline Support:
   - Implement service worker for offline access ⏳
   - Create IndexedDB storage for offline data ⏳
   - Add offline calculation capability ⏳
```

### Step 7: Testing & Quality Assurance
```typescript
1. Unit Testing Enhancement:
   - Expand test coverage for core utilities ⏳
   - Implement property-based testing for date functions ⏳
   - Create comprehensive test fixtures and factories ⏳

2. Integration Testing:
   - Create integration tests for feature combinations ⏳
   - Test data flow between components and API ⏳
   - Test persistence and data consistency ⏳

3. End-to-End Testing:
   - Implement Cypress E2E tests for critical flows ⏳
     - Complete date calculation workflow
     - User authentication and profile management
     - Saved calculation management
   - Create visual regression tests ⏳
   - Implement performance testing ⏳

4. Accessibility Testing:
   - Audit all components with axe-core ⏳
   - Test keyboard navigation throughout app ⏳
   - Verify screen reader compatibility ⏳
   - Ensure color contrast compliance ⏳

5. Performance Optimization:
   - Implement bundle analysis and optimization ⏳
   - Add code splitting for improved loading ⏳
   - Optimize API performance and caching ⏳
   - Implement performance monitoring ⏳
```

### Step 8: Deployment & Production Readiness
```typescript
1. Deployment Infrastructure:
   - Configure Replit deployment settings ⏳
   - Ensure ongoing compatibility for common packages and libraries
   - Setup database deployment and migration ⏳
   - Configure environment variables for production ⏳
   - Implement CI/CD pipeline with GitHub Actions ⏳

2. Production Optimization:
   - Configure caching strategy ⏳
     - API response caching
     - Static asset caching
     - Database query optimization
   - Implement CDN for static assets ⏳
   - Configure rate limiting and security headers ⏳

3. Monitoring and Logging:
   - Setup application logging ⏳
   - Implement error tracking with Sentry ⏳
   - Configure performance monitoring ⏳
   - Setup alerting for critical issues ⏳

4. Backup and Recovery:
   - Implement automated database backups ⏳
   - Create backup verification process ⏳
   - Document disaster recovery procedures ⏳

5. Documentation and Training:
   - Create comprehensive user documentation ⏳
   - Prepare admin documentation ⏳
   - Record demo videos and tutorials ⏳
```

## Detailed Implementation Tasks

### Implementation Task 1: Core Date Utilities

Create the essential date utility functions in `/src/lib/date/`:

```typescript
// date-diff.ts
export function calculateDateDifference(
  startDate: Date, 
  endDate: Date, 
  unit: 'days' | 'weeks' | 'months' | 'years' = 'days',
  options?: { 
    excludeWeekends?: boolean, 
    excludeHolidays?: boolean,
    holidayRegion?: string
  }
): number {
  // Implementation details
  // 1. Handle timezone normalization
  // 2. Calculate raw difference
  // 3. Convert to requested unit
  // 4. Apply exclusion rules if needed
}

// date-add.ts
export function addToDate(
  date: Date,
  value: number,
  unit: 'days' | 'weeks' | 'months' | 'years',
  options?: { 
    onlyWorkdays?: boolean, 
    excludeHolidays?: boolean,
    holidayRegion?: string
  }
): Date {
  // Implementation details
  // 1. Handle unit conversion
  // 2. Apply special rules for workdays if needed
  // 3. Handle month/year boundary cases
  // 4. Adjust for holidays if needed
}

// workdays.ts
export function getWorkdaysInRange(
  startDate: Date,
  endDate: Date,
  options?: { 
    excludeHolidays?: boolean, 
    region?: string,
    workWeek?: number[]  // e.g., [1,2,3,4,5] for Mon-Fri
  }
): number {
  // Implementation details
  // 1. Count days excluding weekends
  // 2. Subtract holidays if needed
  // 3. Handle custom work weeks
}

// timezone.ts
export function convertToTimezone(
  date: Date,
  timezone: string
): Date {
  // Implementation details
  // 1. Convert date to target timezone
  // 2. Handle DST transitions
}

// holidays.ts
export async function getHolidays(
  year: number,
  region: string
): Promise<Holiday[]> {
  // Implementation details
  // 1. Fetch holidays from API or cache
  // 2. Format and normalize data
  // 3. Handle caching for performance
}

// formatting.ts
export function formatDate(
  date: Date,
  format: string,
  locale: string = 'en-US'
): string {
  // Implementation details
  // 1. Format date according to specified format
  // 2. Apply locale-specific formatting
}
```

### Implementation Task 2: Database Schema Setup

Create the database schema using Drizzle ORM in `/src/server/db/schema.ts`:

```typescript
import { pgTable, serial, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  passwordHash: text('password_hash'),
  role: text('role').default('user'),
  createdAt: timestamp('created_at').defaultNow()
});

export const dateCalculations = pgTable('date_calculations', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(),  // difference, addition, workdays, etc.
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  timeValue: integer('time_value'),
  timeUnit: text('time_unit'),  // days, weeks, months, years
  userId: text('user_id').references(() => users.id),
  timezone: text('timezone'),
  includeHolidays: boolean('include_holidays'),
  result: text('result'),  // JSON string with calculation results
  createdAt: timestamp('created_at').defaultNow()
});

export const savedDates = pgTable('saved_dates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  date: timestamp('date').notNull(),
  notes: text('notes'),
  userId: text('user_id').notNull().references(() => users.id),
  isRecurring: boolean('is_recurring'),
  recurrenceRule: text('recurrence_rule'),
  createdAt: timestamp('created_at').defaultNow()
});

export const userPreferences = pgTable('user_preferences', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id).unique(),
  defaultTimezone: text('default_timezone').default('UTC'),
  dateFormat: text('date_format').default('yyyy-MM-dd'),
  workWeekStart: integer('work_week_start').default(1),  // 1 = Monday
  workWeekEnd: integer('work_week_end').default(5),      // 5 = Friday
  theme: text('theme').default('light'),
  updatedAt: timestamp('updated_at').defaultNow()
});
```

### Implementation Task 3: UI Component Development

Create the DateDiffCalculator component in `/src/components/calculator/DateDiffCalculator.tsx`:

```typescript
import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { DatePicker } from '../ui/DatePicker';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { calculateDateDifference } from '../../lib/date/date-diff';

type Unit = 'days' | 'weeks' | 'months' | 'years';

export const DateDiffCalculator: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [unit, setUnit] = useState<Unit>('days');
  const [excludeWeekends, setExcludeWeekends] = useState(false);
  const [excludeHolidays, setExcludeHolidays] = useState(false);
  const [region, setRegion] = useState('US');
  const [result, setResult] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    try {
      setIsCalculating(true);
      setError(null);
      
      const difference = calculateDateDifference(
        startDate,
        endDate,
        unit,
        {
          excludeWeekends,
          excludeHolidays,
          holidayRegion: excludeHolidays ? region : undefined
        }
      );
      
      setResult(difference);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setResult(null);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Calculate Date Difference</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Start Date</label>
          <DatePicker 
            value={startDate} 
            onChange={setStartDate} 
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block mb-2">End Date</label>
          <DatePicker 
            value={endDate} 
            onChange={setEndDate} 
            className="w-full"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-2">Unit</label>
          <Select
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit)}
            options={[
              { value: 'days', label: 'Days' },
              { value: 'weeks', label: 'Weeks' },
              { value: 'months', label: 'Months' },
              { value: 'years', label: 'Years' }
            ]}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="excludeWeekends"
            checked={excludeWeekends}
            onChange={(e) => setExcludeWeekends(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="excludeWeekends">Exclude Weekends</label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="excludeHolidays"
            checked={excludeHolidays}
            onChange={(e) => setExcludeHolidays(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="excludeHolidays">Exclude Holidays</label>
        </div>
      </div>
      
      {excludeHolidays && (
        <div className="mb-4">
          <label className="block mb-2">Region</label>
          <Select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            options={[
              { value: 'US', label: 'United States' },
              { value: 'GB', label: 'United Kingdom' },
              { value: 'CA', label: 'Canada' },
              { value: 'AU', label: 'Australia' },
              // Add more regions as needed
            ]}
            className="w-full"
          />
        </div>
      )}
      
      <Button
        onClick={handleCalculate}
        disabled={isCalculating}
        className="w-full"
      >
        {isCalculating ? 'Calculating...' : 'Calculate Difference'}
      </Button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {result !== null && !error && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
          <p className="font-bold">Result:</p>
          <p>
            {result} {result === 1 ? unit.slice(0, -1) : unit}
          </p>
        </div>
      )}
    </Card>
  );
};
```

## Testing Strategy

### Unit Testing
- **Framework**: Jest + React Testing Library
- **Coverage Target**: 85%+ for utility functions
- **Key Test Areas**:
  - Date calculation functions
  - Time zone conversions
  - Holiday detection
  - Working days calculations
  - Form validation logic

### API Testing
- **Framework**: Supertest + Jest
- **Coverage Target**: 100% of API endpoints
- **Test Approach**:
  - Happy path scenarios
  - Error handling scenarios
  - Edge cases
  - Performance testing
  - Authentication/authorization testing

### End-to-End Testing
- **Framework**: Cypress
- **Key Flows**:
  - Date difference calculation
  - Date addition/subtraction
  - Saving calculations
  - User authentication flow
  - Settings customization

### Accessibility Testing
- **Tools**: axe-core, Lighthouse
- **Standards**: WCAG 2.1 AA compliance
- **Testing Areas**:
  - Keyboard navigation
  - Screen reader compatibility
  - Color contrast
  - Focus management
  - Semantic HTML

## Deployment Checklist

- [ ] Run and pass all tests
- [ ] Database migrations finalized
- [ ] Environment variables configured
- [ ] Bundle size optimized
- [ ] Error logging and monitoring setup
- [ ] Performance benchmarks pass
- [ ] Security scan completed
- [ ] SSL configured
- [ ] Backup system tested
- [ ] Documentation updated

## Performance Targets
- Initial page load: < 1.5s
- Time to interactive: < 2s
- API response time: < 200ms
- Lighthouse score: > 90
- Mobile responsiveness: 100%

## Development Workflow

1. **Feature Development**:
   - Create feature branch from `main`
   - Implement feature with tests
   - Submit PR with test results
   - Review and address feedback
   - Merge to `main` after approval

2. **Bug Fixes**:
   - Create bug fix branch
   - Add regression test
   - Fix the bug
   - Verify with tests
   - Submit PR for review

3. **Code Quality**:
   - Run ESLint before commits
   - Ensure test coverage meets targets
   - Follow TypeScript best practices
   - Keep components small and focused
   - Document complex logic

4. **Documentation**:
   - Update README.md with new features
   - Keep development.md current with implementation details
   - Document API changes
   - Update deployment instructions as needed
   - Track progress in cursor-updates.md

## Next Steps

1. Complete repository structure setup and standardize the development environment:
   - [ ] Update package.json with missing dependencies (Express, Drizzle ORM, NextAuth)
   - [ ] Create initial database migration scripts
   - [ ] Set up the Express server for API routes

2. Implement core date calculation utilities:
   - [ ] Create the basic date utility functions
   - [ ] Write comprehensive unit tests for date utilities
   - [ ] Set up test fixtures for holidays and timezones

3. Build UI components for calculator interfaces:
   - [ ] Create the shared UI component library
   - [ ] Implement the calculator-specific components
   - [ ] Build responsive layouts for all device sizes

4. Set up API routes and database layer:
   - [ ] Configure Drizzle ORM with the database
   - [ ] Implement API routes for calculations and saved dates
   - [ ] Create database service functions for data operations

5. Add authentication and user management:
   - [ ] Set up NextAuth.js for authentication
   - [ ] Create login and registration pages
   - [ ] Implement user preference management

6. Develop advanced features and visualizations:
   - [ ] Create the date range visualization components
   - [ ] Implement recurring date patterns
   - [ ] Build export and integration features

7. Complete testing infrastructure:
   - [ ] Expand unit test coverage
   - [ ] Implement integration tests
   - [ ] Create end-to-end tests for critical flows

8. Prepare for deployment:
   - [ ] Configure deployment settings for Replit
   - [ ] Set up production environment
   - [ ] Implement monitoring and logging

This development plan will evolve as the project progresses, with more detailed implementation tasks added for each step.

## Detailed Next Steps for Implementation

Based on reviewing the current repository structure and code, here are the detailed next steps to implement DateCalculatorPlus:

### 1. Repository Structure and Development Environment

- [ ] **Update package.json dependencies**:
  ```bash
  npm install express drizzle-orm pg next-auth date-fns @radix-ui/react-* tailwindcss @tanstack/react-query
  ```

- [ ] **Create database setup script** in `scripts/setup-db.js`:
  ```javascript
  import { drizzle } from 'drizzle-orm/node-postgres';
  import { migrate } from 'drizzle-orm/node-postgres/migrator';
  import { Pool } from 'pg';
  import dotenv from 'dotenv';

  dotenv.config();

  const main = async () => {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const db = drizzle(pool);
    
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: './migrations' });
    console.log('Migrations completed!');
    
    await pool.end();
  };

  main().catch((err) => {
    console.error('Error during database setup:', err);
    process.exit(1);
  });
  ```

- [ ] **Create initial directory structure**:
  ```bash
  mkdir -p src/lib/date
  mkdir -p src/components/ui
  mkdir -p src/components/calculator
  mkdir -p src/components/layout
  mkdir -p src/server/api
  mkdir -p src/server/db
  mkdir -p tests/unit/lib/date
  ```

### 2. Core Date Calculation Engine

- [ ] **Implement date-diff.ts** in `src/lib/date/date-diff.ts`:
  ```typescript
  import { differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears } from 'date-fns';
  import { getWorkdaysInRange } from './workdays';
  import { isHoliday } from './holidays';

  type DateDiffUnit = 'days' | 'weeks' | 'months' | 'years';
  
  interface DateDiffOptions {
    excludeWeekends?: boolean;
    excludeHolidays?: boolean;
    holidayRegion?: string;
  }
  
  export function calculateDateDifference(
    startDate: Date, 
    endDate: Date, 
    unit: DateDiffUnit = 'days',
    options: DateDiffOptions = {}
  ): number {
    // For weekend/holiday exclusions, delegate to workdays calculation
    if (options.excludeWeekends || options.excludeHolidays) {
      const workdays = getWorkdaysInRange(startDate, endDate, {
        excludeHolidays: options.excludeHolidays,
        region: options.holidayRegion
      });
      
      // Convert workdays to the requested unit if needed
      if (unit === 'days') {
        return workdays;
      }
      
      // For other units, calculate ratio based on typical values
      // This is a simplification - actual implementation would be more nuanced
      switch (unit) {
        case 'weeks': return workdays / 5;
        case 'months': return workdays / 22;
        case 'years': return workdays / 260;
        default: return workdays;
      }
    }
    
    // For standard calculations without exclusions
    switch (unit) {
      case 'days': return differenceInDays(endDate, startDate);
      case 'weeks': return differenceInWeeks(endDate, startDate);
      case 'months': return differenceInMonths(endDate, startDate);
      case 'years': return differenceInYears(endDate, startDate);
      default: return differenceInDays(endDate, startDate);
    }
  }
  ```

- [ ] **Create unit tests** for date calculations in `tests/unit/lib/date/date-diff.test.ts`:
  ```typescript
  import { calculateDateDifference } from '../../../../src/lib/date/date-diff';
  
  describe('calculateDateDifference', () => {
    test('should calculate days between two dates', () => {
      const startDate = new Date(2023, 0, 1); // Jan 1, 2023
      const endDate = new Date(2023, 0, 10); // Jan 10, 2023
      
      expect(calculateDateDifference(startDate, endDate, 'days')).toBe(9);
    });
    
    test('should calculate weeks between two dates', () => {
      const startDate = new Date(2023, 0, 1); // Jan 1, 2023
      const endDate = new Date(2023, 0, 15); // Jan 15, 2023
      
      expect(calculateDateDifference(startDate, endDate, 'weeks')).toBe(2);
    });
    
    test('should exclude weekends when option is set', () => {
      // Jan 2023 - 1st is Sunday, 2nd is Monday
      const startDate = new Date(2023, 0, 2); // Monday
      const endDate = new Date(2023, 0, 9); // Next Monday
      
      // Should give 5 days (Mon-Fri of one week)
      expect(calculateDateDifference(
        startDate, 
        endDate, 
        'days', 
        { excludeWeekends: true }
      )).toBe(5);
    });
    
    // More tests for holidays, leap years, etc.
  });
  ```

### 3. UI Components & Calculator Interface

- [ ] **Create DatePicker component** in `src/components/ui/DatePicker.tsx`:
  ```tsx
  import React from 'react';
  import { format } from 'date-fns';
  
  interface DatePickerProps {
    value: Date;
    onChange: (date: Date) => void;
    className?: string;
    min?: Date;
    max?: Date;
  }
  
  export const DatePicker: React.FC<DatePickerProps> = ({
    value,
    onChange,
    className = '',
    min,
    max
  }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const date = new Date(e.target.value);
      onChange(date);
    };
    
    return (
      <input
        type="date"
        value={format(value, 'yyyy-MM-dd')}
        onChange={handleChange}
        className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        min={min ? format(min, 'yyyy-MM-dd') : undefined}
        max={max ? format(max, 'yyyy-MM-dd') : undefined}
      />
    );
  };
  ```

- [ ] **Implement basic DateDiffCalculator component** in `src/components/calculator/DateDiffCalculator.tsx`:
  ```tsx
  import React, { useState } from 'react';
  import { DatePicker } from '../ui/DatePicker';
  import { calculateDateDifference } from '../../lib/date/date-diff';
  
  export const DateDiffCalculator: React.FC = () => {
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [unit, setUnit] = useState<'days' | 'weeks' | 'months' | 'years'>('days');
    const [excludeWeekends, setExcludeWeekends] = useState(false);
    const [excludeHolidays, setExcludeHolidays] = useState(false);
    const [result, setResult] = useState<number | null>(null);
    
    const calculateDifference = () => {
      const difference = calculateDateDifference(
        startDate,
        endDate,
        unit,
        {
          excludeWeekends,
          excludeHolidays
        }
      );
      
      setResult(difference);
    };
    
    return (
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Date Difference Calculator</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2">Start Date</label>
            <DatePicker value={startDate} onChange={setStartDate} />
          </div>
          
          <div>
            <label className="block mb-2">End Date</label>
            <DatePicker value={endDate} onChange={setEndDate} />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Unit</label>
          <select 
            value={unit} 
            onChange={(e) => setUnit(e.target.value as any)}
            className="w-full p-2 border rounded"
          >
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
        </div>
        
        <div className="flex mb-4">
          <div className="mr-4">
            <input 
              type="checkbox" 
              id="excludeWeekends" 
              checked={excludeWeekends}
              onChange={(e) => setExcludeWeekends(e.target.checked)}
            />
            <label htmlFor="excludeWeekends" className="ml-2">Exclude Weekends</label>
          </div>
          
          <div>
            <input 
              type="checkbox" 
              id="excludeHolidays" 
              checked={excludeHolidays}
              onChange={(e) => setExcludeHolidays(e.target.checked)}
            />
            <label htmlFor="excludeHolidays" className="ml-2">Exclude Holidays</label>
          </div>
        </div>
        
        <button 
          onClick={calculateDifference}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Calculate
        </button>
        
        {result !== null && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <p className="font-bold">Result:</p>
            <p>{result} {result === 1 ? unit.slice(0, -1) : unit}</p>
          </div>
        )}
      </div>
    );
  };
  ```

### 4. API Routes & Database Setup

- [ ] **Create database schema** in `src/server/db/schema.ts`:
  ```typescript
  import { pgTable, serial, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
  
  export const dateCalculations = pgTable('date_calculations', {
    id: serial('id').primaryKey(),
    type: text('type').notNull(),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date'),
    timeValue: integer('time_value'),
    timeUnit: text('time_unit'),
    userId: text('user_id'),
    timezone: text('timezone'),
    includeHolidays: boolean('include_holidays'),
    createdAt: timestamp('created_at').defaultNow()
  });
  
  export const savedDates = pgTable('saved_dates', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    date: timestamp('date').notNull(),
    notes: text('notes'),
    userId: text('user_id').notNull(),
    isRecurring: boolean('is_recurring'),
    recurrenceRule: text('recurrence_rule'),
    createdAt: timestamp('created_at').defaultNow()
  });
  ```

- [ ] **Implement basic API route** for calculations in `src/server/api/calculations.ts`:
  ```typescript
  import express from 'express';
  import { drizzle } from 'drizzle-orm/node-postgres';
  import { Pool } from 'pg';
  import { dateCalculations } from '../db/schema';
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  
  const db = drizzle(pool);
  const router = express.Router();
  
  // Get all calculations
  router.get('/', async (req, res) => {
    try {
      const calculations = await db.select().from(dateCalculations);
      res.json(calculations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch calculations' });
    }
  });
  
  // Save new calculation
  router.post('/', async (req, res) => {
    try {
      const newCalculation = await db.insert(dateCalculations).values({
        type: req.body.type,
        startDate: new Date(req.body.startDate),
        endDate: req.body.endDate ? new Date(req.body.endDate) : null,
        timeValue: req.body.timeValue,
        timeUnit: req.body.timeUnit,
        userId: req.body.userId,
        timezone: req.body.timezone,
        includeHolidays: req.body.includeHolidays
      }).returning();
      
      res.status(201).json(newCalculation[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to save calculation' });
    }
  });
  
  export default router;
  ```

### 5. Authentication & User Management

- [ ] **Configure NextAuth** in `src/pages/api/auth/[...nextauth].ts`:
  ```typescript
  import NextAuth from 'next-auth';
  import CredentialsProvider from 'next-auth/providers/credentials';
  import GoogleProvider from 'next-auth/providers/google';
  import { Pool } from 'pg';
  import { drizzle } from 'drizzle-orm/node-postgres';
  import bcrypt from 'bcrypt';
  import { users } from '../../../server/db/schema';
  import { eq } from 'drizzle-orm';
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  
  const db = drizzle(pool);
  
  export default NextAuth({
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' }
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }
          
          const user = await db.select()
            .from(users)
            .where(eq(users.email, credentials.email))
            .limit(1);
          
          if (!user.length) {
            return null;
          }
          
          const match = await bcrypt.compare(
            credentials.password,
            user[0].passwordHash
          );
          
          if (!match) {
            return null;
          }
          
          return {
            id: user[0].id.toString(),
            email: user[0].email,
            name: user[0].name
          };
        }
      })
    ],
    session: {
      strategy: 'jwt'
    },
    pages: {
      signIn: '/auth/signin',
    },
    callbacks: {
      async session({ session, token }) {
        if (token.sub && session.user) {
          session.user.id = token.sub;
        }
        return session;
      }
    }
  });
  ```

### 6. Advanced Features & Visualizations

- [ ] **Implement DateRangeVisualizer component** in `src/components/calculator/DateRangeVisualizer.tsx`:
  ```tsx
  import React from 'react';
  import { format, eachDayOfInterval, isWeekend, isSameMonth } from 'date-fns';
  
  interface DateRangeVisualizerProps {
    startDate: Date;
    endDate: Date;
    excludeWeekends?: boolean;
    holidays?: Date[];
  }
  
  export const DateRangeVisualizer: React.FC<DateRangeVisualizerProps> = ({
    startDate,
    endDate,
    excludeWeekends = false,
    holidays = []
  }) => {
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    const filteredDays = excludeWeekends
      ? days.filter(day => !isWeekend(day))
      : days;
    
    const holidayMap = new Map(
      holidays.map(date => [format(date, 'yyyy-MM-dd'), true])
    );
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Date Range Visualization</h3>
        
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium text-sm py-1">
              {day}
            </div>
          ))}
          
          {filteredDays.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isHoliday = holidayMap.has(dateStr);
            const isSameMonthAsStart = isSameMonth(day, startDate);
            
            return (
              <div
                key={dateStr}
                className={`
                  text-center p-2 rounded
                  ${isWeekend(day) ? 'bg-gray-100' : 'bg-white'}
                  ${isHoliday ? 'bg-red-100' : ''}
                  ${!isSameMonthAsStart ? 'text-gray-400' : ''}
                  border border-gray-200
                `}
              >
                <div className="text-sm">{format(day, 'd')}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  ```

### 7. Testing Infrastructure

- [ ] **Configure Jest for API testing** in `jest.config.js`:
  ```javascript
  module.exports = {
    testEnvironment: 'node',
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|js)x?$',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
      'src/**/*.{ts,tsx,js,jsx}',
      '!src/**/*.d.ts',
    ],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
  };
  ```

- [ ] **Create API test** for calculations in `tests/api/calculations.test.ts`:
  ```typescript
  import request from 'supertest';
  import express from 'express';
  import calculationsRouter from '../../src/server/api/calculations';
  
  const app = express();
  app.use(express.json());
  app.use('/api/calculations', calculationsRouter);
  
  describe('Calculations API', () => {
    test('GET /api/calculations should return all calculations', async () => {
      const response = await request(app).get('/api/calculations');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
    
    test('POST /api/calculations should save a new calculation', async () => {
      const newCalculation = {
        type: 'difference',
        startDate: '2023-01-01T00:00:00.000Z',
        endDate: '2023-01-10T00:00:00.000Z',
        timeUnit: 'days',
        includeHolidays: false
      };
      
      const response = await request(app)
        .post('/api/calculations')
        .send(newCalculation);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.type).toBe(newCalculation.type);
    });
  });
  ```

### 8. Deployment Setup

- [ ] **Create deployment configuration** in `.github/workflows/deploy.yml`:
  ```yaml
  name: Deploy to Replit
  
  on:
    push:
      branches: [ main ]
  
  jobs:
    deploy:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2
        
        - name: Setup Node.js
          uses: actions/setup-node@v2
          with:
            node-version: '18'
            
        - name: Install dependencies
          run: npm ci
          
        - name: Run tests
          run: npm test
          
        - name: Build application
          run: npm run build
          
        - name: Deploy to Replit
          uses: JorisCoppieters/deploy-replit@v1
          with:
            token: ${{ secrets.REPLIT_TOKEN }}
            repl-id: ${{ secrets.REPL_ID }}
  ```

- [ ] **Create startup script** in `scripts/start.js`:
  ```javascript
  import dotenv from 'dotenv';
  import express from 'express';
  import path from 'path';
  import { fileURLToPath } from 'url';

  dotenv.config();
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  const app = express();
  const PORT = process.env.PORT || 5000;
  
  // API routes
  import calculationsRouter from '../src/server/api/calculations.js';
  import savedDatesRouter from '../src/server/api/saved-dates.js';
  
  app.use(express.json());
  
  // API endpoints
  app.use('/api/calculations', calculationsRouter);
  app.use('/api/saved-dates', savedDatesRouter);
  
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '../build')));
  
  // The "catchall" handler for any request that doesn't match the ones above
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  ```

This detailed implementation plan provides concrete code examples and steps for each major part of the DateCalculatorPlus application. Following these steps will create a functional application with all the planned features.

## Code Modularity, Reusability & Maintainability Guidelines

To ensure the DateCalculatorPlus codebase remains clean, maintainable, and extensible throughout its development lifecycle, all team members should adhere to the following principles and best practices:

### 1. Code Organization & Architecture

#### Modular Directory Structure
- **Feature-Based Organization**: Group related code by feature rather than by type
  ```
  src/
    features/
      date-diff/        # Date difference calculator feature
        components/     # UI components specific to this feature
        hooks/          # Custom hooks for this feature
        utils/          # Utility functions for this feature
        tests/          # Tests for this feature
        index.ts        # Public API for this feature
  ```

- **Clear Domain Boundaries**: Define clear boundaries between domains with explicit interfaces
  ```typescript
  // Good: Clear domain boundary with explicit interface
  export interface HolidayService {
    getHolidays(year: number, region: string): Promise<Holiday[]>;
    isHoliday(date: Date, region: string): Promise<boolean>;
  }

  // Bad: No clear interface, implicit dependencies
  export function getHolidays(year, region) { /* ... */ }
  export function isHoliday(date, region) { /* ... */ }
  ```

- **Public API Patterns**: Use barrel files (index.ts) to define public APIs for modules
  ```typescript
  // src/lib/date/index.ts
  export { calculateDateDifference } from './date-diff';
  export { addToDate } from './date-add';
  export { getWorkdaysInRange } from './workdays';
  export type { DateDiffOptions } from './types';
  
  // Do NOT export implementation details or helpers
  // export { isWeekend }; // Don't expose internal utility
  ```

### 2. Component Design Principles

#### Component Composition
- **Single Responsibility**: Each component should do one thing and do it well
  ```typescript
  // Good: Single responsibility
  const DateRangePicker = () => { /* Date range selection only */ }
  const CalculationOptions = () => { /* Options selection only */ }
  const CalculationResult = () => { /* Results display only */ }
  
  // Bad: Mixed responsibilities
  const DateCalculator = () => { 
    /* Handles selection, options, calculation, and results */ 
  }
  ```

- **Component Composition Over Inheritance**: Use composition for UI elements
  ```typescript
  // Good: Composition
  const DateDiffCalculator = () => (
    <Card>
      <DateRangePicker 
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />
      <CalculationOptions 
        options={options} 
        onChange={setOptions} 
      />
      <CalculationResult result={result} />
    </Card>
  );
  ```

- **Prop Drilling Avoidance**: Use context or custom hooks for deeply nested data
  ```typescript
  // Create context for calculation settings
  const CalculationContext = createContext<CalculationContextType>(null);
  
  // Use context in deeply nested components without prop drilling
  const CalculationOptions = () => {
    const { options, setOptions } = useContext(CalculationContext);
    // ...
  };
  ```

### 3. State Management Patterns

- **Centralized State Management**: Use React Query for server state
  ```typescript
  // Use React Query for server state
  const { data: holidays, isLoading } = useQuery({
    queryKey: ['holidays', year, region],
    queryFn: () => fetchHolidays(year, region),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
  ```

- **Local State Management**: Use useState for component-specific state
  ```typescript
  // Use local state for UI state
  const [isExpanded, setIsExpanded] = useState(false);
  ```

- **Derived State**: Calculate derived state instead of duplicating state
  ```typescript
  // Good: Derive values from existing state
  const totalDays = useMemo(() => {
    return calculateDateDifference(startDate, endDate, 'days');
  }, [startDate, endDate]);
  
  // Bad: Store derived state that may become out of sync
  const [totalDays, setTotalDays] = useState(0);
  ```

### 4. Code Reusability Techniques

#### Custom Hooks
- **Extract Common Logic**: Create custom hooks for reusable logic
  ```typescript
  // Custom hook for date calculations
  export function useDateCalculation(
    startDate: Date, 
    endDate: Date, 
    options: DateCalculationOptions
  ) {
    const [result, setResult] = useState<number | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    const calculate = useCallback(() => {
      try {
        setIsCalculating(true);
        setError(null);
        
        const calculatedResult = calculateDateDifference(
          startDate, endDate, options
        );
        
        setResult(calculatedResult);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Calculation failed'));
      } finally {
        setIsCalculating(false);
      }
    }, [startDate, endDate, options]);
    
    return { result, isCalculating, error, calculate };
  }
  ```

#### Utility Functions
- **Pure Functions**: Create pure utility functions for reusable calculations
  ```typescript
  // Pure function for date formatting
  export function formatDateRange(
    startDate: Date, 
    endDate: Date, 
    locale: string = 'en-US'
  ): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    const start = startDate.toLocaleDateString(locale, options);
    const end = endDate.toLocaleDateString(locale, options);
    
    return `${start} to ${end}`;
  }
  ```

- **Function Composition**: Build complex utilities from simpler ones
  ```typescript
  // Simple utility for checking if date is a weekend
  export const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
  };
  
  // Composition of simpler utilities
  export const isBusinessDay = (
    date: Date, 
    holidays: Date[] = []
  ): boolean => {
    if (isWeekend(date)) return false;
    if (isHoliday(date, holidays)) return false;
    return true;
  };
  ```

### 5. Code Maintainability Practices

#### TypeScript Best Practices
- **Strong Typing**: Use specific types instead of `any`
  ```typescript
  // Good: Specific types
  type DateUnit = 'days' | 'weeks' | 'months' | 'years';
  
  function addToDate(date: Date, value: number, unit: DateUnit): Date {
    // Type-safe implementation
  }
  
  // Bad: Using any
  function addToDate(date: any, value: any, unit: any): any {
    // No type safety
  }
  ```

- **Type Guards**: Use type guards for runtime type checking
  ```typescript
  // Type guard for Holiday object
  function isHoliday(obj: unknown): obj is Holiday {
    return (
      typeof obj === 'object' && 
      obj !== null &&
      'date' in obj &&
      'name' in obj &&
      'region' in obj
    );
  }
  ```

#### Error Handling
- **Consistent Error Handling**: Use a consistent approach to error handling
  ```typescript
  async function fetchHolidays(year: number, region: string): Promise<Holiday[]> {
    try {
      const response = await fetch(`/api/holidays?year=${year}&region=${region}`);
      
      if (!response.ok) {
        throw new ApiError(
          `Failed to fetch holidays: ${response.status}`, 
          response.status
        );
      }
      
      return await response.json();
    } catch (error) {
      // Rethrow with context
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        `Error fetching holidays: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  }
  ```

- **Error Boundaries**: Use React error boundaries for UI error recovery
  ```typescript
  class CalculatorErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
  > {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
    
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
    
    render() {
      if (this.state.hasError) {
        return <ErrorFallback onReset={() => this.setState({ hasError: false })} />;
      }
      
      return this.props.children;
    }
  }
  ```

#### Documentation
- **JSDoc Comments**: Document complex functions with JSDoc
  ```typescript
  /**
   * Calculates the number of working days between two dates.
   * 
   * @param startDate - The start date of the range
   * @param endDate - The end date of the range
   * @param options - Configuration options
   * @param options.excludeHolidays - Whether to exclude holidays from the count
   * @param options.region - The region to use for holiday determination
   * @returns The number of working days in the range
   * 
   * @example
   * ```typescript
   * // Get working days excluding holidays in the US
   * const workdays = getWorkdaysInRange(
   *   new Date('2023-01-01'),
   *   new Date('2023-01-31'),
   *   { excludeHolidays: true, region: 'US' }
   * );
   * ```
   */
  export function getWorkdaysInRange(
    startDate: Date,
    endDate: Date,
    options?: WorkdayOptions
  ): number {
    // Implementation...
  }
  ```

- **Component Documentation**: Document components with Storybook stories
  ```typescript
  // DatePicker.stories.tsx
  import { Story, Meta } from '@storybook/react';
  import { DatePicker, DatePickerProps } from './DatePicker';
  
  export default {
    title: 'Components/DatePicker',
    component: DatePicker,
    argTypes: {
      onChange: { action: 'changed' },
      value: { control: 'date' },
    },
  } as Meta;
  
  const Template: Story<DatePickerProps> = (args) => <DatePicker {...args} />;
  
  export const Default = Template.bind({});
  Default.args = {
    value: new Date(),
  };
  
  export const WithMinMaxDates = Template.bind({});
  WithMinMaxDates.args = {
    value: new Date(),
    min: new Date(2023, 0, 1),
    max: new Date(2023, 11, 31),
  };
  ```

### 6. Testing Strategies for Maintainability

- **Unit Testing**: Test individual units in isolation
  ```typescript
  // Testing a pure utility function
  describe('calculateDateDifference', () => {
    it('should calculate correct difference in days', () => {
      const start = new Date(2023, 0, 1);  // Jan 1, 2023
      const end = new Date(2023, 0, 10);   // Jan 10, 2023
      
      expect(calculateDateDifference(start, end, 'days')).toBe(9);
    });
  });
  ```

- **Component Testing**: Test components with React Testing Library
  ```typescript
  // Testing a component
  describe('DatePicker', () => {
    it('should call onChange when date changes', () => {
      const handleChange = jest.fn();
      
      render(<DatePicker value={new Date(2023, 0, 1)} onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '2023-01-15' } });
      
      expect(handleChange).toHaveBeenCalledWith(new Date(2023, 0, 15));
    });
  });
  ```

- **Integration Testing**: Test interactions between components
  ```typescript
  // Integration test for calculator functionality
  describe('DateDiffCalculator', () => {
    it('should calculate and display date difference when button is clicked', async () => {
      render(<DateDiffCalculator />);
      
      // Set start date
      const startDateInput = screen.getByLabelText(/start date/i);
      fireEvent.change(startDateInput, { target: { value: '2023-01-01' } });
      
      // Set end date
      const endDateInput = screen.getByLabelText(/end date/i);
      fireEvent.change(endDateInput, { target: { value: '2023-01-31' } });
      
      // Click calculate button
      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      fireEvent.click(calculateButton);
      
      // Check result
      const result = await screen.findByText(/30 days/i);
      expect(result).toBeInTheDocument();
    });
  });
  ```

### 7. Performance Optimization

- **Memoization**: Use `useMemo` and `useCallback` for expensive operations
  ```typescript
  // Memoize expensive calculations
  const filteredHolidays = useMemo(() => {
    return holidays.filter(holiday => holiday.region === selectedRegion);
  }, [holidays, selectedRegion]);
  
  // Memoize event handlers
  const handleDateChange = useCallback((newDate: Date) => {
    setSelectedDate(newDate);
    onDateChange?.(newDate);
  }, [onDateChange]);
  ```

- **Code Splitting**: Use dynamic imports for code splitting
  ```typescript
  // Dynamic import for large feature
  const DateRangeVisualizer = React.lazy(() => 
    import('./DateRangeVisualizer')
  );
  
  // Use with suspense
  <Suspense fallback={<LoadingSpinner />}>
    <DateRangeVisualizer startDate={startDate} endDate={endDate} />
  </Suspense>
  ```

- **Virtualization**: Use virtualization for large lists
  ```typescript
  import { FixedSizeList } from 'react-window';
  
  // Virtualized list of dates
  const DateList = ({ dates }) => (
    <FixedSizeList
      height={400}
      width="100%"
      itemCount={dates.length}
      itemSize={50}
    >
      {({ index, style }) => (
        <div style={style}>
          {formatDate(dates[index])}
        </div>
      )}
    </FixedSizeList>
  );
  ```

### 8. Design Patterns & Best Practices

- **Adapter Pattern**: Use adapters to normalize external services
  ```typescript
  // Adapter for holiday API
  class HolidayApiAdapter implements HolidayService {
    private apiClient: ApiClient;
    
    constructor(apiClient: ApiClient) {
      this.apiClient = apiClient;
    }
    
    async getHolidays(year: number, region: string): Promise<Holiday[]> {
      const response = await this.apiClient.get(`/holidays/${region}/${year}`);
      
      // Normalize API response to our internal format
      return response.data.map(item => ({
        date: new Date(item.date),
        name: item.name,
        region: region,
        type: this.mapHolidayType(item.type)
      }));
    }
    
    private mapHolidayType(apiType: string): HolidayType {
      // Map API-specific types to our internal types
      switch (apiType) {
        case 'public': return 'public';
        case 'bank': return 'bank';
        default: return 'other';
      }
    }
  }
  ```

- **Repository Pattern**: Use repositories to abstract data access
  ```typescript
  // Repository for saved calculations
  class CalculationRepository {
    private db: Database;
    
    constructor(db: Database) {
      this.db = db;
    }
    
    async saveCalculation(calculation: CalculationInput): Promise<Calculation> {
      const result = await this.db.insert('calculations', calculation);
      return this.mapToCalculation(result);
    }
    
    async getCalculationById(id: string): Promise<Calculation | null> {
      const result = await this.db.findById('calculations', id);
      return result ? this.mapToCalculation(result) : null;
    }
    
    async getUserCalculations(userId: string): Promise<Calculation[]> {
      const results = await this.db.find('calculations', { userId });
      return results.map(this.mapToCalculation);
    }
    
    private mapToCalculation(data: any): Calculation {
      return {
        id: data.id,
        type: data.type,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        // Map other fields...
      };
    }
  }
  ```

- **Strategy Pattern**: Use strategies for different calculation methods
  ```typescript
  // Interface for calculation strategies
  interface DateCalculationStrategy {
    calculate(startDate: Date, endDate: Date, options?: any): number;
  }
  
  // Strategy for date difference in days
  class DayDifferenceStrategy implements DateCalculationStrategy {
    calculate(startDate: Date, endDate: Date): number {
      return differenceInDays(endDate, startDate);
    }
  }
  
  // Strategy for workdays calculation
  class WorkdayDifferenceStrategy implements DateCalculationStrategy {
    calculate(startDate: Date, endDate: Date, options?: WorkdayOptions): number {
      // Implementation for counting workdays
    }
  }
  
  // Context that uses the strategy
  class DateCalculator {
    private strategy: DateCalculationStrategy;
    
    constructor(strategy: DateCalculationStrategy) {
      this.strategy = strategy;
    }
    
    setStrategy(strategy: DateCalculationStrategy): void {
      this.strategy = strategy;
    }
    
    calculate(startDate: Date, endDate: Date, options?: any): number {
      return this.strategy.calculate(startDate, endDate, options);
    }
  }
  ```

By following these guidelines and patterns, the DateCalculatorPlus codebase will maintain high quality, be easier to maintain, and allow for more efficient collaboration among team members throughout the project's lifecycle.
