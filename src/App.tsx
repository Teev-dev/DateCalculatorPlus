import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { DateCalculator } from './components/calculator/DateCalculator';
import { DateAdder } from './components/calculator/DateAdder';
import { TimezoneConverter } from './components/calculator/TimezoneConverter';
import { HolidayCalculator } from './components/calculator/HolidayCalculator';

/**
 * Main App component handling routing
 */
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/date-calculator" element={<DateCalculator />} />
          <Route path="/date-adder" element={<DateAdder />} />
          <Route path="/timezone-converter" element={<TimezoneConverter />} />
          <Route path="/holiday-calculator" element={<HolidayCalculator />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

/**
 * Settings page component (placeholder)
 */
const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Application Preferences</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="date-format" className="block text-sm font-medium text-gray-700 mb-1">
              Default Date Format
            </label>
            <select
              id="date-format"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="MM/dd/yyyy">MM/DD/YYYY (e.g., 12/31/2023)</option>
              <option value="dd/MM/yyyy">DD/MM/YYYY (e.g., 31/12/2023)</option>
              <option value="yyyy-MM-dd">YYYY-MM-DD (e.g., 2023-12-31)</option>
              <option value="MMMM d, yyyy">Month D, YYYY (e.g., December 31, 2023)</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
              Default Timezone
            </label>
            <select
              id="timezone"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">GMT/BST (London)</option>
              <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
              Default Holiday Region
            </label>
            <select
              id="region"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              id="weekend-exclusion"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="weekend-exclusion" className="ml-2 block text-sm text-gray-700">
              Exclude weekends by default in calculations
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="holiday-exclusion"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="holiday-exclusion" className="ml-2 block text-sm text-gray-700">
              Exclude holidays by default in calculations
            </label>
          </div>
        </div>
        
        <div className="mt-6 pt-5 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-3 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 404 Not Found page component
 */
const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
      <p className="text-gray-600 mt-2 mb-6 text-center">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        Go Back Home
      </a>
    </div>
  );
};

export default App; 