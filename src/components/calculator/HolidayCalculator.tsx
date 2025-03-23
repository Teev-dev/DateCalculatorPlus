import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { DatePicker } from '../ui/DatePicker';
import { isHoliday, fetchHolidays } from '../../lib/date/holidays';
import { formatDate } from '../../lib/date';

/**
 * HolidayCalculator component for checking and finding holidays
 */
export const HolidayCalculator: React.FC = () => {
  // State for selected date and region
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [region, setRegion] = useState('US');
  
  // State for holidays list
  const [upcomingHolidays, setUpcomingHolidays] = useState<{
    date: Date;
    name: string;
    isWeekend: boolean;
  }[]>([]);
  
  // State for holiday check result
  const [holidayCheckResult, setHolidayCheckResult] = useState<{
    isHoliday: boolean;
    holidayName?: string;
  } | null>(null);
  
  // Available regions
  const regions = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
  ];
  
  // Check if the selected date is a holiday
  useEffect(() => {
    if (selectedDate && region) {
      checkIfHoliday();
    } else {
      setHolidayCheckResult(null);
    }
  }, [selectedDate, region]);
  
  // Load upcoming holidays when region changes
  useEffect(() => {
    if (region) {
      loadUpcomingHolidays();
    }
  }, [region]);
  
  // Function to check if the selected date is a holiday
  const checkIfHoliday = async () => {
    if (!selectedDate || !region) {
      setHolidayCheckResult(null);
      return;
    }
    
    try {
      const result = await isHoliday(selectedDate, region);
      if (result) {
        setHolidayCheckResult({
          isHoliday: true,
          holidayName: result,
        });
      } else {
        // Check if it's a weekend
        const day = selectedDate.getDay();
        if (day === 0 || day === 6) {
          setHolidayCheckResult({
            isHoliday: false,
            holidayName: 'Weekend',
          });
        } else {
          setHolidayCheckResult({
            isHoliday: false,
          });
        }
      }
    } catch (err) {
      console.error('Error checking holiday:', err);
      setHolidayCheckResult(null);
    }
  };
  
  // Function to load upcoming holidays
  const loadUpcomingHolidays = async () => {
    if (!region) return;
    
    try {
      const currentYear = new Date().getFullYear();
      const holidays = await fetchHolidays(currentYear, region);
      
      // Filter for upcoming holidays (from today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const upcoming = Object.entries(holidays)
        .map(([dateStr, name]) => {
          const date = new Date(dateStr);
          return {
            date,
            name,
            isWeekend: date.getDay() === 0 || date.getDay() === 6,
          };
        })
        .filter(h => h.date >= today)
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, 5); // Show next 5 holidays
      
      setUpcomingHolidays(upcoming);
    } catch (err) {
      console.error('Error loading holidays:', err);
      setUpcomingHolidays([]);
    }
  };
  
  // Function to reset all inputs
  const handleReset = () => {
    setSelectedDate(new Date());
    setRegion('US');
    setHolidayCheckResult(null);
  };
  
  return (
    <Card
      title="Holiday Calculator"
      subtitle="Check dates for holidays and view upcoming holidays"
      className="max-w-lg mx-auto"
      shadow="lg"
    >
      <div className="space-y-4">
        {/* Date Selection */}
        <div>
          <label htmlFor="selected-date" className="block text-sm font-medium text-gray-700 mb-1">
            Check if a date is a holiday
          </label>
          <DatePicker
            id="selected-date"
            value={selectedDate}
            onChange={setSelectedDate}
            fullWidth
          />
        </div>
        
        {/* Region Selection */}
        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
            Region
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
        
        {/* Holiday Check Result */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Holiday Check Result</h3>
          
          {holidayCheckResult ? (
            <div className="text-center">
              {holidayCheckResult.isHoliday ? (
                <div className="bg-green-100 p-3 rounded-md">
                  <p className="text-green-800 font-medium">
                    This date is a holiday!
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    {holidayCheckResult.holidayName}
                  </p>
                </div>
              ) : (
                <div className="bg-gray-100 p-3 rounded-md">
                  <p className="text-gray-800 font-medium">
                    This date is not a holiday
                    {holidayCheckResult.holidayName === 'Weekend' && ' (but it is a weekend)'}
                  </p>
                </div>
              )}
              
              <p className="text-sm text-gray-500 mt-2">
                Date: {selectedDate ? formatDate(selectedDate, 'MMMM d, yyyy') : ''}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 text-center text-sm">
              {!selectedDate ? 'Please select a date' : 'Select a date and region to check'}
            </p>
          )}
        </div>
        
        {/* Upcoming Holidays */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Upcoming Holidays in {regions.find(r => r.code === region)?.name || region}
          </h3>
          
          {upcomingHolidays.length > 0 ? (
            <ul className="space-y-2">
              {upcomingHolidays.map((holiday, index) => (
                <li 
                  key={index} 
                  className={`p-2 rounded-md ${
                    holiday.isWeekend ? 'bg-amber-50' : 'bg-blue-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">
                        {holiday.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatDate(holiday.date, 'EEEE, MMMM d, yyyy')}
                      </p>
                    </div>
                    <div className="text-xs px-2 py-1 rounded">
                      {Math.ceil((holiday.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days away
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center text-sm">
              No upcoming holidays found for this region
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
            onClick={checkIfHoliday}
            disabled={!selectedDate}
          >
            Check Date
          </Button>
        </div>
      </div>
    </Card>
  );
}; 