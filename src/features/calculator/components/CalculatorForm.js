import React, { useState, useEffect } from 'react';
import { formatDate, parseDate, calculateWorkingDays, addWorkingDays } from '../utils/dateUtils';
import { getHolidaysForCountry } from '../../holidays/services/holidayApiService';
import { countryToCode } from '../../holidays/utils/countryCodeMapper';
import { addMonths, addDays, format } from 'date-fns';

const CalculatorForm = () => {
  const [calculationType, setCalculationType] = useState('duration');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [workingDays, setWorkingDays] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Get current year for holiday fetching
  const currentYear = new Date().getFullYear();

  // Quick select options for calendar months
  const quickSelectOptions = [
    { label: '+1m', months: 1 },
    { label: '+2m', months: 2 },
    { label: '+3m', months: 3 },
    { label: '+6m', months: 6 }
  ];

  // Add these validation functions at the top
  const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.replace(/[<>]/g, '').trim();
  };

  const validateDate = (date) => {
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj) && date.match(/^\d{4}-\d{2}-\d{2}$/);
  };

  const validateWorkingDays = (days) => {
    const numDays = Number(days);
    return !isNaN(numDays) && numDays > 0 && numDays <= 1000;
  };

  // Handle quick select button click
  const handleQuickSelect = async (months) => {
    if (!selectedCountry) {
      setError('Please select a country first');
      return;
    }
    if (!startDate) {
      setError('Please select a start date');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const start = parseDate(startDate);
      if (!start) {
        throw new Error('Invalid start date');
      }

      // Calculate the actual end date by adding calendar months
      const calendarEnd = addMonths(start, months);
      
      const startYear = start.getFullYear();
      const endYear = calendarEnd.getFullYear();
      const allHolidays = [];

      // Fetch holidays for all years in the range
      for (let year = startYear; year <= endYear; year++) {
        const countryCode = countryToCode[selectedCountry];
        const yearHolidays = await getHolidaysForCountry(countryCode, year);
        allHolidays.push(...yearHolidays.map(h => h.date));
      }

      // Update holidays state with all fetched holidays
      setHolidays(allHolidays);

      // Calculate actual working days between the dates
      const actualWorkingDays = calculateWorkingDays(start, calendarEnd, allHolidays);
      
      // Set the working days input
      setWorkingDays(actualWorkingDays.toString());
      
      // Show informative message about the calculation
      const holidaysInPeriod = allHolidays.filter(
        holiday => new Date(holiday) >= start && new Date(holiday) <= calendarEnd
      );

      setResult(
        <div>
          <div className="result-header">Calculation results for {selectedCountry}</div>
          <div className="result-details">
            <div className="result-row">
              <span className="result-label">Start date:</span>
              <span className="result-value">{formatDate(start, 'MMMM d, yyyy')}</span>
            </div>
            <div className="result-row end-date">
              <span className="result-label">End date:</span>
              <span className="result-value highlight">{formatDate(calendarEnd, 'MMMM d, yyyy')}</span>
            </div>
            <div className="result-row">
              <span className="result-label">Calendar months:</span>
              <span className="result-value">{months}</span>
            </div>
            <div className="result-row">
              <span className="result-label">Working days:</span>
              <span className="result-value">{actualWorkingDays}</span>
            </div>
            <div className="result-row">
              <span className="result-label">Holidays in period:</span>
              <span className="result-value">{holidaysInPeriod.length}</span>
            </div>
          </div>
        </div>
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch holidays when country changes
  useEffect(() => {
    const fetchHolidays = async () => {
      if (!selectedCountry) {
        setHolidays([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const countryCode = countryToCode[selectedCountry];
        const holidayData = await getHolidaysForCountry(countryCode, currentYear);
        setHolidays(holidayData.map(h => h.date));
      } catch (err) {
        setError('Failed to fetch holidays. Please try again.');
        setHolidays([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, [selectedCountry]);

  const handleCalculate = async (e) => {
    e.preventDefault();
    
    // Input validation
    if (!selectedCountry) {
      setError('Please select a country');
      return;
    }

    if (!validateDate(startDate)) {
      setError('Invalid start date format');
      return;
    }

    if (calculationType === 'duration') {
      if (!validateDate(endDate)) {
        setError('Invalid end date format');
        return;
      }
    } else {
      if (!validateWorkingDays(workingDays)) {
        setError('Working days must be between 1 and 1000');
        return;
      }
    }

    setError(null);
    setResult(null);
    setLoading(true);

    try {
      // Sanitize inputs
      const sanitizedCountry = sanitizeInput(selectedCountry);
      const sanitizedStartDate = sanitizeInput(startDate);
      
      if (calculationType === 'duration') {
        const sanitizedEndDate = sanitizeInput(endDate);
        const start = parseDate(sanitizedStartDate);
        const end = parseDate(sanitizedEndDate);
        
        if (!start || !end) {
          throw new Error('Please enter valid dates');
        }

        // Fetch holidays for the entire period
        const startYear = start.getFullYear();
        const endYear = end.getFullYear();
        const allHolidays = [];

        for (let year = startYear; year <= endYear; year++) {
          const countryCode = countryToCode[sanitizedCountry];
          const yearHolidays = await getHolidaysForCountry(countryCode, year);
          allHolidays.push(...yearHolidays.map(h => h.date));
        }

        // Calculate working days
        const actualWorkingDays = calculateWorkingDays(start, end, allHolidays);

        // Get holidays that fall within the period
        const holidaysInPeriod = allHolidays.filter(
          holiday => new Date(holiday) >= start && new Date(holiday) <= end
        );

        setResult(
          <div>
            <div className="result-header">
              Calculation results for {sanitizedCountry || 'selected period'}
            </div>
            <div className="result-details">
              <div className="result-row">
                <span className="result-label">Start date:</span>
                <span className="result-value">{formatDate(start, 'MMMM d, yyyy')}</span>
              </div>
              <div className="result-row end-date">
                <span className="result-label">End date:</span>
                <span className="result-value highlight">{formatDate(end, 'MMMM d, yyyy')}</span>
              </div>
              <div className="result-row">
                <span className="result-label">Working days:</span>
                <span className="result-value">{actualWorkingDays}</span>
              </div>
              <div className="result-row">
                <span className="result-label">Holidays in period:</span>
                <span className="result-value">{holidaysInPeriod.length}</span>
              </div>
            </div>
          </div>
        );
      } else {
        const sanitizedWorkingDays = Number(sanitizeInput(workingDays));
        const start = parseDate(sanitizedStartDate);
        
        if (!start || isNaN(sanitizedWorkingDays)) {
          throw new Error('Please enter a valid date and number of days');
        }

        // First calculate an approximate end date to determine the year range
        const approximateEnd = addWorkingDays(start, sanitizedWorkingDays, holidays);
        const startYear = start.getFullYear();
        const endYear = approximateEnd.getFullYear();
        const allHolidays = [];

        // Fetch holidays for all years in the range
        for (let year = startYear; year <= endYear; year++) {
          const countryCode = countryToCode[sanitizedCountry];
          const yearHolidays = await getHolidaysForCountry(countryCode, year);
          allHolidays.push(...yearHolidays.map(h => h.date));
        }

        // Calculate final end date with all holidays considered
        const finalEnd = addWorkingDays(start, sanitizedWorkingDays, allHolidays);

        // Get holidays that fall within the period
        const holidaysInPeriod = allHolidays.filter(
          holiday => new Date(holiday) >= start && new Date(holiday) <= finalEnd
        );

        setResult(
          <div>
            <div className="result-header">Calculation results for {sanitizedCountry}</div>
            <div className="result-details">
              <div className="result-row">
                <span className="result-label">Start date:</span>
                <span className="result-value">{formatDate(start, 'MMMM d, yyyy')}</span>
              </div>
              <div className="result-row end-date">
                <span className="result-label">End date:</span>
                <span className="result-value highlight">{formatDate(finalEnd, 'MMMM d, yyyy')}</span>
              </div>
              <div className="result-row">
                <span className="result-label">Working days:</span>
                <span className="result-value">{sanitizedWorkingDays}</span>
              </div>
              <div className="result-row">
                <span className="result-label">Holidays in period:</span>
                <span className="result-value">{holidaysInPeriod.length}</span>
              </div>
            </div>
          </div>
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle quick select for start date
  const handleQuickSelectStartDate = (daysToAdd = 0) => {
    const date = addDays(new Date(), daysToAdd);
    setStartDate(format(date, 'yyyy-MM-dd'));
  };

  return (
    <div className="calculator-form">
      <h2>Working Days Calculator</h2>
      
      <form onSubmit={handleCalculate}>
        <div className="form-group">
          <label>Calculation Type:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="duration"
                checked={calculationType === 'duration'}
                onChange={(e) => setCalculationType(e.target.value)}
              />
              Calculate Duration
            </label>
            <label>
              <input
                type="radio"
                value="endDate"
                checked={calculationType === 'endDate'}
                onChange={(e) => setCalculationType(e.target.value)}
              />
              Calculate End Date
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="country">Country (required for end date calculation):</label>
          <select
            id="country"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            required={calculationType === 'endDate'}
          >
            <option value="">Select a country</option>
            {Object.keys(countryToCode).sort().map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date:</label>
          <div className="quick-select-group">
            <button
              type="button"
              className="quick-select-button"
              onClick={() => handleQuickSelectStartDate(0)}
              title="Set to today"
            >
              Today
            </button>
            <button
              type="button"
              className="quick-select-button"
              onClick={() => handleQuickSelectStartDate(1)}
              title="Set to tomorrow"
            >
              Tomorrow
            </button>
          </div>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        {calculationType === 'duration' ? (
          <div className="form-group">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="workingDays">Number of Working Days:</label>
              <div className="quick-select-group">
                {quickSelectOptions.map(({ label, months }) => (
                  <button
                    key={label}
                    type="button"
                    className="quick-select-button"
                    onClick={() => handleQuickSelect(months)}
                    disabled={!selectedCountry || !startDate}
                    title={!selectedCountry ? 'Select a country first' : !startDate ? 'Select a start date' : `Add ${months} calendar month${months > 1 ? 's' : ''}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <input
                type="number"
                id="workingDays"
                value={workingDays}
                onChange={(e) => setWorkingDays(e.target.value)}
                min="1"
                required
              />
            </div>
          </>
        )}

        <button type="submit" disabled={loading || (calculationType === 'endDate' && !selectedCountry)}>
          {loading ? 'Calculating...' : 'Calculate'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {result && <div className="result-message">{result}</div>}
      
      {loading && <div className="loading-message">Fetching holiday data...</div>}
    </div>
  );
};

export default CalculatorForm; 