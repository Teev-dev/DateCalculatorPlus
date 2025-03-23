import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { DatePicker } from '../ui/DatePicker';
import { convertToTimezone, formatInTimezone, getCommonTimezones } from '../../lib/date/timezone';

/**
 * TimezoneConverter component for converting times between timezones
 */
export const TimezoneConverter: React.FC = () => {
  // Available timezones
  const timezones = getCommonTimezones();
  
  // State for source date and timezone
  const [sourceDate, setSourceDate] = useState<Date | null>(new Date());
  const [sourceTimezone, setSourceTimezone] = useState('America/New_York');
  
  // State for target timezone
  const [targetTimezone, setTargetTimezone] = useState('Europe/London');
  
  // State for conversion result
  const [result, setResult] = useState<{
    date: Date;
    sourceFormatted: string;
    targetFormatted: string;
    hourDifference: string;
  } | null>(null);
  
  // Calculate conversion when inputs change
  useEffect(() => {
    if (sourceDate) {
      calculateConversion();
    } else {
      setResult(null);
    }
  }, [sourceDate, sourceTimezone, targetTimezone]);
  
  // Function to calculate timezone conversion
  const calculateConversion = () => {
    if (!sourceDate) {
      setResult(null);
      return;
    }
    
    try {
      // Convert the date to the target timezone
      const convertedDate = convertToTimezone(sourceDate, sourceTimezone, targetTimezone);
      
      // Format both dates with timezone information
      const sourceFormatted = formatInTimezone(sourceDate, sourceTimezone, 'MMM d, yyyy h:mm a z');
      const targetFormatted = formatInTimezone(convertedDate, targetTimezone, 'MMM d, yyyy h:mm a z');
      
      // Calculate hour difference for display
      const sourceHours = new Date(formatInTimezone(sourceDate, sourceTimezone, 'yyyy-MM-dd HH:mm:ss')).getHours();
      const targetHours = new Date(formatInTimezone(convertedDate, targetTimezone, 'yyyy-MM-dd HH:mm:ss')).getHours();
      let hourDiff = targetHours - sourceHours;
      
      // Adjust for day crossover
      if (hourDiff > 12) hourDiff -= 24;
      if (hourDiff < -12) hourDiff += 24;
      
      const hourDifference = hourDiff >= 0 
        ? `+${hourDiff}` 
        : hourDiff.toString();
      
      setResult({
        date: convertedDate,
        sourceFormatted,
        targetFormatted,
        hourDifference
      });
    } catch (err) {
      console.error('Error converting timezone:', err);
      setResult(null);
    }
  };
  
  // Function to swap source and target timezones
  const swapTimezones = () => {
    const temp = sourceTimezone;
    setSourceTimezone(targetTimezone);
    setTargetTimezone(temp);
  };
  
  // Function to reset all inputs
  const handleReset = () => {
    setSourceDate(new Date());
    setSourceTimezone('America/New_York');
    setTargetTimezone('Europe/London');
    setResult(null);
  };
  
  // Function to get formatted timezone for display
  const formatTimezone = (tz: string) => {
    return tz.replace(/_/g, ' ').replace(/\//g, ' / ');
  };
  
  return (
    <Card
      title="Timezone Converter"
      subtitle="Convert times between different timezones"
      className="max-w-lg mx-auto"
      shadow="lg"
    >
      <div className="space-y-4">
        {/* Source Date and Time */}
        <div>
          <label htmlFor="source-date" className="block text-sm font-medium text-gray-700 mb-1">
            Date and Time
          </label>
          <DatePicker
            id="source-date"
            value={sourceDate}
            onChange={setSourceDate}
            fullWidth
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
          />
        </div>
        
        {/* Source and Target Timezones */}
        <div className="grid grid-cols-8 gap-2 items-center">
          <div className="col-span-3">
            <label htmlFor="source-timezone" className="block text-sm font-medium text-gray-700 mb-1">
              From Timezone
            </label>
            <select
              id="source-timezone"
              value={sourceTimezone}
              onChange={(e) => setSourceTimezone(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {formatTimezone(tz)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="col-span-2 flex justify-center items-end pb-1">
            <button
              type="button"
              onClick={swapTimezones}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ⇄
            </button>
          </div>
          
          <div className="col-span-3">
            <label htmlFor="target-timezone" className="block text-sm font-medium text-gray-700 mb-1">
              To Timezone
            </label>
            <select
              id="target-timezone"
              value={targetTimezone}
              onChange={(e) => setTargetTimezone(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {formatTimezone(tz)}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Results Section */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Conversion Result</h3>
          
          {result ? (
            <div className="space-y-2">
              <div className="grid grid-cols-1 gap-1 text-center">
                <div className="p-2 bg-white rounded shadow-sm">
                  <p className="text-xs text-gray-500">From</p>
                  <p className="text-sm font-medium">{result.sourceFormatted}</p>
                </div>
                
                <div className="flex justify-center items-center h-6 text-gray-500">
                  ↓ {result.hourDifference} hours ↓
                </div>
                
                <div className="p-2 bg-white rounded shadow-sm">
                  <p className="text-xs text-gray-500">To</p>
                  <p className="text-sm font-medium">{result.targetFormatted}</p>
                </div>
              </div>
              
              <div className="text-xs text-center text-gray-500 mt-2">
                <p>When it's noon in {formatTimezone(sourceTimezone)}, it's {formatInTimezone(
                  convertToTimezone(
                    new Date(new Date().setHours(12, 0, 0, 0)), 
                    sourceTimezone, 
                    targetTimezone
                  ), 
                  targetTimezone, 
                  'h:mm a'
                )} in {formatTimezone(targetTimezone)}.</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center text-sm">
              {!sourceDate ? 'Please select a date and time' : 'Error converting timezone'}
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
            onClick={calculateConversion}
            disabled={!sourceDate}
          >
            Convert
          </Button>
        </div>
      </div>
    </Card>
  );
}; 