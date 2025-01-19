import React, { useState, useEffect } from 'react';
import { getAvailableCountries, countryToCode } from '../utils/countryCodeMapper';
import { getHolidaysForCountry } from '../services/holidayApiService';
import HolidayResults from './HolidayResults';

const HolidayLookup = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const countries = getAvailableCountries();
  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - 2 + i
  );

  // Debug logging
  useEffect(() => {
    console.log('Available countries:', countries);
    console.log('Country mapping:', countryToCode);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!selectedCountry) {
      setError('Please select a country');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Selected country:', selectedCountry);
      const countryCode = countryToCode[selectedCountry];
      console.log('Converted country code:', countryCode);
      
      if (!countryCode) {
        throw new Error('Invalid country selection');
      }
      
      console.log('Fetching holidays for:', countryCode, selectedYear);
      const holidayData = await getHolidaysForCountry(countryCode, selectedYear);
      console.log('Received holiday data:', holidayData);
      setHolidays(holidayData);
    } catch (err) {
      console.error('Error in holiday lookup:', err);
      setError(err.message);
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="holiday-lookup">
      <h2>Holiday Lookup</h2>
      <form onSubmit={handleSearch} className="lookup-form">
        <div className="form-group">
          <label htmlFor="country">Country:</label>
          <select
            id="country"
            value={selectedCountry}
            onChange={(e) => {
              console.log('Selected value:', e.target.value);
              setSelectedCountry(e.target.value);
            }}
            required
          >
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="year">Year:</label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Search Holidays'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
      
      {holidays.length > 0 && (
        <HolidayResults holidays={holidays} />
      )}
    </div>
  );
};

export default HolidayLookup; 