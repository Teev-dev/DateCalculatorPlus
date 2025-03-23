import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { DatePicker } from '../ui/DatePicker';
import { Input } from '../ui/Input';
import { addToDate, formatDate } from '../../lib/date';
import { DateUnit, DateAddOptions } from '../../lib/date/types';

/**
 * DateAdder component for adding time to a date
 */
export const DateAdder: React.FC = () => {
  // State for the base date
  const [baseDate, setBaseDate] = useState<Date | null>(new Date());
  
  // State for the time to add
  const [timeValue, setTimeValue] = useState(1);
  const [timeUnit, setTimeUnit] = useState<DateUnit>('days');
  
  // State for options
  const [onlyWorkdays, setOnlyWorkdays] = useState(false);
  const [excludeHolidays, setExcludeHolidays] = useState(false);
  const [region, setRegion] = useState('US');
  
  // State for calculation result
  const [resultDate, setResultDate] = useState<Date | null>(null);
  
  // Calculate the result date when inputs change
  useEffect(() => {
    if (baseDate && typeof timeValue === 'number') {
      calculateResultDate();
    } else {
      setResultDate(null);
    }
  }, [baseDate, timeValue, timeUnit, onlyWorkdays, excludeHolidays, region]);
  
  // Function to calculate the result date
  const calculateResultDate = () => {
    if (!baseDate || typeof timeValue !== 'number') {
      setResultDate(null);
      return;
    }
    
    const options: DateAddOptions = {
      onlyWorkdays: onlyWorkdays && timeUnit === 'days',
      excludeHolidays: excludeHolidays && (onlyWorkdays || timeUnit === 'days'),
      holidayRegion: excludeHolidays ? region : undefined,
    };
    
    try {
      const result = addToDate(baseDate, timeValue, timeUnit, options);
      setResultDate(result);
    } catch (err) {
      console.error('Error calculating result date:', err);
      setResultDate(null);
    }
  };
  
  // Function to handle time value change
  const handleTimeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setTimeValue(value);
    } else {
      setTimeValue(0);
    }
  };
  
  // Function to handle direction change (add/subtract)
  const toggleDirection = () => {
    setTimeValue(prev => prev * -1);
  };
  
  // Function to reset all inputs
  const handleReset = () => {
    setBaseDate(new Date());
    setTimeValue(1);
    setTimeUnit('days');
    setOnlyWorkdays(false);
    setExcludeHolidays(false);
    setRegion('US');
    setResultDate(null);
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
  
  // Get the direction of calculation (add or subtract)
  const isAddition = timeValue >= 0;
  
  return (
    <Card
      title="Date Add/Subtract"
      subtitle="Add or subtract time from a date"
      className="max-w-lg mx-auto"
      shadow="lg"
    >
      <div className="space-y-4">
        {/* Base Date */}
        <div>
          <label htmlFor="base-date" className="block text-sm font-medium text-gray-700 mb-1">
            Base Date
          </label>
          <DatePicker
            id="base-date"
            value={baseDate}
            onChange={setBaseDate}
            fullWidth
          />
        </div>
        
        {/* Time Value */}
        <div className="grid grid-cols-5 gap-3 items-start">
          <div className="col-span-2">
            <label htmlFor="time-value" className="block text-sm font-medium text-gray-700 mb-1">
              {isAddition ? 'Add' : 'Subtract'}
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type="number"
                id="time-value"
                value={Math.abs(timeValue)}
                onChange={handleTimeValueChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <button
                  type="button"
                  onClick={toggleDirection}
                  className="h-full rounded-r-md border-0 bg-gray-100 px-2 text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {isAddition ? '+' : '-'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="col-span-3">
            <label htmlFor="time-unit" className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <select
              id="time-unit"
              value={timeUnit}
              onChange={(e) => setTimeUnit(e.target.value as DateUnit)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Calculation Options */}
        <div className="border-t border-b border-gray-200 py-4 space-y-3">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Calculation Options</h3>
          
          {/* Only show workday option for days unit */}
          {timeUnit === 'days' && (
            <div className="flex items-center">
              <input
                id="only-workdays"
                type="checkbox"
                checked={onlyWorkdays}
                onChange={(e) => setOnlyWorkdays(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="only-workdays" className="ml-2 block text-sm text-gray-600">
                Only count workdays (Mon-Fri)
              </label>
            </div>
          )}
          
          {/* Only show holiday exclusion if using days or workdays */}
          {(timeUnit === 'days' || onlyWorkdays) && (
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
          )}
          
          {/* Region Selection (only shown if exclude holidays is enabled) */}
          {excludeHolidays && (timeUnit === 'days' || onlyWorkdays) && (
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
          
          {resultDate ? (
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">
                {formatDate(resultDate, 'MMMM d, yyyy')}
              </p>
              
              <p className="text-sm text-gray-500 mt-1">
                {isAddition ? 'Added' : 'Subtracted'} {Math.abs(timeValue)} {timeUnit}
                {Math.abs(timeValue) !== 1 ? 's' : ''} 
                {onlyWorkdays ? ' (workdays only)' : ''}
                {excludeHolidays && (onlyWorkdays || timeUnit === 'days') ? `, excluding holidays in ${region}` : ''}
                <br />
                From: {baseDate ? formatDate(baseDate, 'MMMM d, yyyy') : 'N/A'}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 text-center text-sm">
              {!baseDate ? 'Please select a base date' : 'Error calculating result date'}
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
            onClick={calculateResultDate}
            disabled={!baseDate || typeof timeValue !== 'number'}
          >
            Calculate
          </Button>
        </div>
      </div>
    </Card>
  );
}; 