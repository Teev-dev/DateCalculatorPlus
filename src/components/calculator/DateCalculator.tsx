import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { DatePicker } from '../ui/DatePicker';
import { Input } from '../ui/Input';
import { calculateDateDifference, formatDate } from '../../lib/date';
import { DateUnit, DateDiffOptions } from '../../lib/date/types';

/**
 * DateCalculator component for calculating the difference between two dates
 */
export const DateCalculator: React.FC = () => {
  // State for input dates
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  // State for calculation options
  const [unit, setUnit] = useState<DateUnit>('days');
  const [excludeWeekends, setExcludeWeekends] = useState(false);
  const [excludeHolidays, setExcludeHolidays] = useState(false);
  const [region, setRegion] = useState('US');
  
  // State for calculation result
  const [result, setResult] = useState<{
    value: number;
    formatted: string;
  } | null>(null);
  
  // Calculate the difference when inputs change
  useEffect(() => {
    if (startDate && endDate) {
      calculateDifference();
    } else {
      setResult(null);
    }
  }, [startDate, endDate, unit, excludeWeekends, excludeHolidays, region]);
  
  // Function to calculate the difference between dates
  const calculateDifference = () => {
    if (!startDate || !endDate) {
      setResult(null);
      return;
    }
    
    const options: DateDiffOptions = {
      excludeWeekends,
      excludeHolidays: excludeHolidays,
      holidayRegion: excludeHolidays ? region : undefined,
    };
    
    try {
      const value = calculateDateDifference(startDate, endDate, unit, options);
      
      let formattedValue = value.toString();
      
      if (unit === 'days') {
        formattedValue = `${value} day${value !== 1 ? 's' : ''}`;
      } else if (unit === 'weeks') {
        formattedValue = `${value} week${value !== 1 ? 's' : ''}`;
      } else if (unit === 'months') {
        formattedValue = `${value} month${value !== 1 ? 's' : ''}`;
      } else if (unit === 'years') {
        formattedValue = `${value} year${value !== 1 ? 's' : ''}`;
      }
      
      setResult({
        value,
        formatted: formattedValue,
      });
    } catch (err) {
      console.error('Error calculating date difference:', err);
      setResult(null);
    }
  };
  
  // Function to swap start and end dates
  const handleSwapDates = () => {
    setStartDate(endDate);
    setEndDate(startDate);
  };
  
  // Function to reset all inputs
  const handleReset = () => {
    setStartDate(new Date());
    setEndDate(null);
    setUnit('days');
    setExcludeWeekends(false);
    setExcludeHolidays(false);
    setRegion('US');
    setResult(null);
  };
  
  // Available regions for holiday exclusion
  const regions = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
  ];
  
  // Available units for calculation
  const units: { value: DateUnit; label: string }[] = [
    { value: 'days', label: 'Days' },
    { value: 'weeks', label: 'Weeks' },
    { value: 'months', label: 'Months' },
    { value: 'years', label: 'Years' },
  ];
  
  return (
    <Card
      title="Date Calculator"
      subtitle="Calculate the difference between two dates"
      className="max-w-lg mx-auto"
      shadow="lg"
    >
      <div className="space-y-4">
        {/* Start Date */}
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <DatePicker
            id="start-date"
            value={startDate}
            onChange={setStartDate}
            fullWidth
          />
        </div>
        
        {/* End Date */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            
            <button
              type="button"
              onClick={handleSwapDates}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Swap Dates
            </button>
          </div>
          <DatePicker
            id="end-date"
            value={endDate}
            onChange={setEndDate}
            fullWidth
          />
        </div>
        
        {/* Calculation Options */}
        <div className="border-t border-b border-gray-200 py-4 space-y-3">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Calculation Options</h3>
          
          {/* Unit Selection */}
          <div>
            <label htmlFor="unit" className="block text-sm text-gray-600 mb-1">
              Calculate in
            </label>
            <select
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value as DateUnit)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Exclusion Options */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <input
                id="exclude-weekends"
                type="checkbox"
                checked={excludeWeekends}
                onChange={(e) => setExcludeWeekends(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="exclude-weekends" className="ml-2 block text-sm text-gray-600">
                Exclude weekends
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="exclude-holidays"
                type="checkbox"
                checked={excludeHolidays}
                onChange={(e) => setExcludeHolidays(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="exclude-holidays" className="ml-2 block text-sm text-gray-600">
                Exclude holidays
              </label>
            </div>
          </div>
          
          {/* Region Selection (only shown if exclude holidays is enabled) */}
          {excludeHolidays && (
            <div>
              <label htmlFor="region" className="block text-sm text-gray-600 mb-1">
                Holiday Region
              </label>
              <select
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                {regions.map((region) => (
                  <option key={region.code} value={region.code}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        {/* Results Section */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Result</h3>
          
          {result ? (
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">{result.formatted}</p>
              
              <p className="text-sm text-gray-500 mt-1">
                From: {startDate ? formatDate(startDate, 'MMMM d, yyyy') : 'N/A'}<br />
                To: {endDate ? formatDate(endDate, 'MMMM d, yyyy') : 'N/A'}
              </p>
              
              {(excludeWeekends || excludeHolidays) && (
                <p className="text-xs text-gray-500 mt-2">
                  {excludeWeekends && excludeHolidays
                    ? 'Excluding weekends and holidays'
                    : excludeWeekends
                    ? 'Excluding weekends'
                    : 'Excluding holidays'}
                  {excludeHolidays && ` in ${region}`}
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center text-sm">
              {!startDate || !endDate
                ? 'Please select both start and end dates'
                : 'Error calculating date difference'}
            </p>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <Button
            variant="light"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            variant="primary"
            onClick={calculateDifference}
            disabled={!startDate || !endDate}
          >
            Calculate
          </Button>
        </div>
      </div>
    </Card>
  );
}; 