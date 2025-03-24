# DateCalculatorPlus Development Plan

## Quick Start
```bash
# Initial setup
npm install
npm run setup-db

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
   - Update package.json with required dependencies ✅
   - Configure ESLint and Prettier for code formatting ✅
   - Setup Jest and Testing Library for testing ✅
   - Configure Webpack for bundling ✅

2. Directory Structure Organization:
   - Reorganize the src folder for better organization ✅
   - Ensure proper separation of concerns:
     - /lib for utility functions
     - /components for UI components
     - /features for domain-specific code
     - /hooks for custom React hooks
     - /api for API client and integrations
   
3. Environment Configuration:
   - Setup environment variables in .env file ✅
   - Configure development, test, and production environments ✅
   - Setup database connection using Drizzle ORM ✅
   - Initialize Express backend for API routes ✅

4. Project Configuration Scripts:
   - Create database setup script (setup-db.js) ✅
   - Configure build and deployment scripts ✅
   - Setup CI/CD pipeline with GitHub Actions ✅
```

### Step 2: Core Date Calculation Engine
```typescript
1. Implement Core Date Utility Library (/src/lib/date/):
   - Create directory structure for date utilities ✅
   - Implement essential date calculation functions:
     - date-diff.ts: For calculating differences between dates ✅
     - date-add.ts: For adding/subtracting time periods ✅
     - workdays.ts: For handling business days calculations ✅
     - timezone.ts: For timezone conversions and management ✅
     - holidays.ts: For holiday detection across regions ✅
     - formatting.ts: For date formatting in various locales ✅

2. Essential Function Implementation:
   - Implement calculateDateDifference() in date-diff.ts ✅
     - Support for different units (days, weeks, months, years)
     - Options for excluding weekends and holidays
     - Handle timezone differences

   - Implement addToDate() in date-add.ts ✅
     - Support for different units (days, weeks, months, years)
     - Support for workdays-only calculations
     - Handle month/year boundary cases
     - Adjust for holidays if needed

   - Implement getWorkdaysInRange() in workdays.ts ✅
     - Configurable work week (e.g., Mon-Fri, Sun-Thu)
     - Holiday exclusion by region
     - Half-day holiday support

   - Implement convertToTimezone() in timezone.ts ✅
     - Convert dates between timezones
     - Calculate time differences across zones
     - Handle DST transitions

   - Implement getHolidays() in holidays.ts ✅
     - Integration with holiday API
     - Regional holiday calendars
     - Custom holiday definitions

   - Implement formatDate() in formatting.ts ✅
     - Format date according to specified format
     - Apply locale-specific formatting
```

### Step 3: UI Components & Calculator Interface
```typescript
1. Base UI Component Implementation:
   - Create reusable UI components in /src/components/ui/ ✅
     - Button.tsx: Enhanced button component with variants ✅
     - DatePicker.tsx: Accessible date selection component ✅
     - NumberInput.tsx: Input with validation for numeric values ✅
     - Select.tsx: Enhanced dropdown component ✅
     - Card.tsx: Container component with various styles ✅
     - Tabs.tsx: Tab navigation component ✅

2. Calculator Component Implementation:
   - Create specialized calculator components in /src/components/calculator/ ✅
     - DateDiffCalculator.tsx: For date difference calculations ✅
     - DateAddCalculator.tsx: For date addition/subtraction ✅
     - WorkdayCalculator.tsx: For business day calculations ✅
     - TimezoneCalculator.tsx: For timezone conversions ✅
     - RecurrenceCalculator.tsx: For recurring date patterns ⏳
     - DateRangeVisualizer.tsx: For visualizing date ranges ⏳

3. Layout Component Implementation:
   - Create layout components in /src/components/layout/ ✅
     - Header.tsx: Application header with navigation ✅
     - Footer.tsx: Application footer with links ✅
     - Layout.tsx: Main layout wrapper ✅
     - Sidebar.tsx: Navigation sidebar ✅

4. Component Styling:
   - Implement styling using Tailwind CSS ✅
   - Create custom Tailwind theme in tailwind.config.js ✅
   - Ensure responsive design for all components ✅
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

## Next Steps

1. ✅ Complete repository structure setup and standardize the development environment:
   - ✅ Update package.json with missing dependencies (Express, Drizzle ORM, NextAuth)
   - ⏳ Create initial database migration scripts
   - ✅ Set up the Express server for API routes

2. ✅ Implement core date calculation utilities:
   - ✅ Create the basic date utility functions
   - ⏳ Write comprehensive unit tests for date utilities
   - ✅ Set up test fixtures for holidays and timezones

3. ✅ Build UI components for calculator interfaces:
   - ✅ Create the shared UI component library
   - ✅ Implement the calculator-specific components
   - ⏳ Build responsive layouts for all device sizes

4. ⏳ Set up API routes and database layer:
   - ⏳ Configure Drizzle ORM with the database
   - ⏳ Implement API routes for calculations and saved dates
   - ⏳ Create database service functions for data operations

5. ⏳ Add authentication and user management:
   - ⏳ Set up NextAuth.js for authentication
   - ⏳ Create login and registration pages
   - ⏳ Implement user preference management

6. ⏳ Develop advanced features and visualizations:
   - ⏳ Create the date range visualization components
   - ⏳ Implement recurring date patterns
   - ⏳ Build export and integration features

7. ⏳ Complete testing infrastructure:
   - ⏳ Expand unit test coverage
   - ⏳ Implement integration tests
   - ⏳ Create end-to-end tests for critical flows

8. ✅ Prepare for deployment:
   - ✅ Configure deployment settings for Replit (updated .replit file)
   - ✅ Set up production environment (enhanced server.js)
   - ✅ Implement monitoring and logging (debug-server.js)

## 403 Error Troubleshooting Implementation

Following our troubleshooting plan for the 403 Forbidden errors, we've successfully implemented a comprehensive solution with robust server configurations and diagnostic tools.

### Key Implementations

1. **Enhanced Server Configuration**:
   - Rewritten server.js with proper CORS configuration and error handling
   - Configured server to bind to all network interfaces (0.0.0.0)
   - Implemented proper Express middleware stack with JSON and URL encoding support
   - Added explicit content-type headers for different file types
   - Updated port configuration to use more reliable ports (8080, 3000) instead of 5000

2. **Diagnostic and Troubleshooting Tools**:
   - Created debug-server.js for comprehensive system diagnostics
   - Implemented test-server.js for basic connectivity testing
   - Built replit-fix.js specifically for Replit hosting environment issues
   - Developed fix-env.js to automatically detect and fix environment configuration problems
   - Added detailed troubleshooting documentation in docs/403-troubleshooting.md

3. **Development Workflow Improvements**:
   - Updated package.json scripts for different server configurations:
     ```json
     "dev": "PORT=8080 node server.js",
     "test-server": "PORT=3000 node test-server.js",
     "debug": "PORT=3000 node debug-server.js",
     "fix-replit": "PORT=4000 node replit-fix.js",
     "fix-env": "node fix-env.js"
     ```
   - Added environment validation on startup
   - Implemented automatic public directory creation and basic HTML fallback
   - Created enhanced error reporting for API endpoints

4. **Replit-Specific Configuration**:
   - Added proper port configuration in .replit file
   - Implemented server binding to all interfaces for Replit compatibility
   - Created specialized CORS handling for Replit proxy requirements
   - Added static file serving with explicit MIME types

### Troubleshooting Tools Overview

#### debug-server.js
A comprehensive diagnostic tool that provides detailed system information, network configuration, port availability, and file system checks through an interactive web interface. The tool helps identify the root cause of server issues by providing a clear picture of the environment.

Key features:
- System information (OS, architecture, Node version)
- Process details and environment variables
- Network interface configuration
- Port availability checks
- File system verification
- Interactive web UI with diagnostic tools

#### test-server.js
A minimal Express server designed specifically for connectivity testing. This server provides basic endpoints to verify network connectivity, request handling, and static file serving without the complexity of the full application.

Key features:
- Minimal dependencies and configuration
- Basic HTML and JSON endpoints
- Display of request headers and server information
- Simple HTML interface with server status

#### replit-fix.js
A specialized server designed to address Replit-specific hosting issues. This server implements specific configurations needed for Replit's environment, including proper CORS handling, content-type headers, and file system checks.

Key features:
- Replit-specific CORS configuration
- Proper content-type headers for static files
- Automatic creation of missing directories and files
- Diagnostic endpoints for Replit environment

#### fix-env.js
An automatic environment validator and fixer that checks for common configuration issues and attempts to fix them. This tool verifies the project structure, essential files, package.json scripts, and dependencies.

Key features:
- Checks for missing directories and files
- Verifies package.json scripts and dependencies
- Creates default configuration files if missing
- Provides clear next steps for troubleshooting

### Usage Instructions

To resolve 403 Forbidden errors, follow these steps:

1. Run the environment fixer to check and fix basic configuration issues:
   ```bash
   npm run fix-env
   ```

2. If still experiencing issues, try the Replit-specific fix server:
   ```bash
   npm run fix-replit
   ```

3. For detailed diagnostics, run the debug server:
   ```bash
   npm run debug
   ```

4. To verify basic connectivity, run the test server:
   ```bash
   npm run test-server
   ```

5. If all else fails, consult the comprehensive troubleshooting guide:
   ```
   docs/403-troubleshooting.md
   ```

### Next Steps Post-Fix

With the server configuration issues resolved, we can now proceed with the following development tasks:

1. **API Implementation**:
   - Implement the calculation API endpoints
   - Create saved calculation storage
   - Add holiday and timezone data endpoints
   - Implement API authentication and authorization

2. **Database Integration**:
   - Complete the Drizzle ORM setup
   - Implement database migrations
   - Create data models for user calculations
   - Implement efficient query patterns

3. **Authentication System**:
   - Set up user authentication
   - Create login and registration UI
   - Implement secure session management
   - Add user preference storage

4. **Frontend Features**:
   - Complete all calculator components
   - Add data persistence to UI
   - Implement history and favorites
   - Create advanced calculation options

This implementation resolves the 403 Forbidden errors by addressing server configuration issues, providing robust error handling, and creating specialized tools for diagnosing and fixing environment-specific problems.

By following these guidelines and patterns, the DateCalculatorPlus codebase will maintain high quality, be easier to maintain, and allow for more efficient collaboration among team members throughout the project's lifecycle.

This development plan will evolve as the project progresses, with more detailed implementation tasks added for each step.

## Short-Range Implementation Plan

Based on our testing and evaluation of the stack, we're implementing a simplified approach that maintains the React/Vite frontend while adopting a more reliable data storage solution.

### Phase 1: Frontend Preservation & Optimization
1. **Backup Current Frontend Code**
   - Create a branch or backup of the current codebase
   - Extract and preserve all React components in src/components/
   - Save all utility functions from src/lib/ directory

2. **Frontend Configuration Update**
   - Ensure Vite configuration is optimized
   - Update Tailwind configuration if needed

3. **Frontend-Backend Decoupling**
   - Identify all API calls in the frontend code
   - Create a services layer that can be easily switched between backend API and client storage

### Phase 2: Backend Simplification
1. **Client-Side Storage Approach**
   - Implement LocalStorage Service with wrappers for localStorage operations
   - Implement Session Management
     - Create a simple user session handler using localStorage
     - Generate unique IDs for calculator sessions
   - Data Management
     - Create collection helpers for common operations
   - Export/Import Functionality
     - Add functionality to export saved data as JSON
     - Allow importing previously exported data

### Phase 3: Integration & Testing
1. **Update Service Implementation**
   - Update service layer to use your chosen approach
   - Ensure all frontend components use the service layer

2. **Configuration Updates**
   - Update package.json scripts
   - Update .replit configuration for proper port binding

3. **Comprehensive Testing**
   - Test all calculator components with new storage approach
   - Verify data persistence works as expected
   - Test on different devices and browsers

4. **Documentation Updates**
   - Update README.md with new setup instructions
   - Document any localStorage limitations (if used)
   - Provide clear guide on data import/export

### Phase 4: Progressive Enhancement
1. **Add Offline Support**
   - Implement service workers for offline functionality
   - Add offline detection and user notifications

2. **Improve User Experience**
   - Add data sync status indicators (saved/unsaved)
   - Implement auto-save functionality
   - Add calculation history views

3. **Performance Optimization**
   - Implement pagination or virtualization for large datasets
   - Add data pruning strategies for localStorage if needed
   - Optimize React renders with memoization
