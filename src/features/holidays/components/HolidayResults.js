import React from 'react';
import { format } from 'date-fns';

const HolidayResults = ({ holidays }) => {
  const sortedHolidays = [...holidays].sort((a, b) => a.date - b.date);

  return (
    <div className="holiday-results">
      <h3>Holidays Found: {holidays.length}</h3>
      <div className="holiday-grid">
        {sortedHolidays.map((holiday) => (
          <div key={`${holiday.date}-${holiday.name}`} className="holiday-card">
            <div className="holiday-date">
              {format(holiday.date, 'MMMM d, yyyy')}
            </div>
            <div className="holiday-name">
              <h4>{holiday.name}</h4>
              {holiday.localName !== holiday.name && (
                <div className="local-name">({holiday.localName})</div>
              )}
            </div>
            <div className="holiday-details">
              <span className={`holiday-type ${holiday.type.toLowerCase()}`}>
                {holiday.type}
              </span>
              {holiday.global && (
                <span className="holiday-global">National</span>
              )}
              {holiday.fixed && (
                <span className="holiday-fixed">Fixed Date</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HolidayResults; 