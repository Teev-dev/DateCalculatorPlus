import React, { useState, useRef, useEffect } from 'react';
import { format, isValid, parse, addMonths, subMonths, addYears, subYears, getYear, getMonth, getDate, isToday, isAfter, isBefore, isSameDay, isSameMonth } from 'date-fns';
import { Input, InputProps } from './Input';
import { Button } from './Button';

/**
 * DatePicker props
 */
export interface DatePickerProps extends Omit<InputProps, 'value' | 'onChange'> {
  /**
   * Selected date value
   */
  value?: Date | null;
  
  /**
   * Callback when date changes
   */
  onChange?: (date: Date | null) => void;
  
  /**
   * Date format string (default: 'MMM d, yyyy')
   */
  dateFormat?: string;
  
  /**
   * Minimum selectable date
   */
  minDate?: Date;
  
  /**
   * Maximum selectable date
   */
  maxDate?: Date;
  
  /**
   * Whether to show today button
   */
  showTodayButton?: boolean;
  
  /**
   * Whether to show clear button
   */
  showClearButton?: boolean;
  
  /**
   * Whether to allow manual editing
   */
  allowManualInput?: boolean;
  
  /**
   * Custom placeholder
   */
  placeholder?: string;
  
  /**
   * Whether the DatePicker is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether to show time select
   */
  showTimeSelect?: boolean;
  
  /**
   * Full width
   */
  fullWidth?: boolean;
  
  /**
   * Additional class name
   */
  className?: string;
  
  /**
   * ID
   */
  id?: string;
}

/**
 * DatePicker component for selecting dates
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  dateFormat = 'MMM d, yyyy',
  minDate,
  maxDate,
  showTodayButton = true,
  showClearButton = true,
  allowManualInput = true,
  placeholder = 'Select date...',
  disabled = false,
  showTimeSelect = false,
  fullWidth = false,
  className,
  id,
  ...props
}) => {
  // State for calendar visibility
  const [isOpen, setIsOpen] = useState(false);
  
  // State for current view (month being displayed)
  const [viewDate, setViewDate] = useState(value || new Date());
  
  // State for input text
  const [inputText, setInputText] = useState(value && isValid(value) ? format(value, dateFormat) : '');
  
  // Refs for click detection
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Handle input change (manual typing)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputText(text);
    
    if (allowManualInput && text) {
      try {
        const parsedDate = parse(text, dateFormat, new Date());
        
        if (isValid(parsedDate)) {
          // Check if date is within valid range
          const isValidRange = (!minDate || !isBefore(parsedDate, minDate)) && 
                              (!maxDate || !isAfter(parsedDate, maxDate));
          
          if (isValidRange) {
            onChange?.(parsedDate);
            setViewDate(parsedDate);
          }
        }
      } catch (err) {
        // Invalid date format, do nothing
      }
    } else if (text === '') {
      onChange?.(null);
    }
  };
  
  // Handle date selection from calendar
  const handleDateSelect = (date: Date) => {
    const formattedDate = format(date, dateFormat);
    setInputText(formattedDate);
    onChange?.(date);
    setIsOpen(false);
  };
  
  // Handle calendar navigation
  const handlePrevMonth = () => setViewDate(subMonths(viewDate, 1));
  const handleNextMonth = () => setViewDate(addMonths(viewDate, 1));
  const handlePrevYear = () => setViewDate(subYears(viewDate, 1));
  const handleNextYear = () => setViewDate(addYears(viewDate, 1));
  
  // Handle today button click
  const handleTodayClick = () => {
    const today = new Date();
    setViewDate(today);
    handleDateSelect(today);
  };
  
  // Handle clear button click
  const handleClearClick = () => {
    setInputText('');
    onChange?.(null);
    setIsOpen(false);
  };
  
  // Handle click outside to close calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Update input value when prop value changes
  useEffect(() => {
    if (value && isValid(value)) {
      setInputText(format(value, dateFormat));
      setViewDate(value);
    } else if (value === null) {
      setInputText('');
    }
  }, [value, dateFormat]);
  
  // Generate calendar grid
  const generateCalendarDays = () => {
    const year = getYear(viewDate);
    const month = getMonth(viewDate);
    
    // First day of month
    const firstDayOfMonth = new Date(year, month, 1);
    const dayOfWeek = firstDayOfMonth.getDay();
    
    // Get days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Generate grid with proper offset for first day
    const calendarDays = [];
    
    // Previous month padding
    for (let i = 0; i < dayOfWeek; i++) {
      calendarDays.push(null);
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(new Date(year, month, day));
    }
    
    return calendarDays;
  };
  
  // Determine if a date is selectable
  const isDateSelectable = (date: Date | null) => {
    if (!date) return false;
    
    return (!minDate || !isBefore(date, minDate)) && 
           (!maxDate || !isAfter(date, maxDate));
  };
  
  // Calendar days
  const calendarDays = generateCalendarDays();
  
  // Day names for header
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  return (
    <div ref={containerRef} className={`relative w-full ${fullWidth ? 'w-full' : ''} ${className || ''}`}>
      <Input
        ref={inputRef}
        value={inputText}
        onChange={handleInputChange}
        onClick={() => !disabled && setIsOpen(true)}
        placeholder={placeholder}
        readOnly={!allowManualInput}
        rightElement={
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(prev => !prev)}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
            </svg>
          </button>
        }
        disabled={disabled}
        {...props}
      />
      
      {isOpen && !disabled && (
        <div className="absolute z-10 mt-1 bg-white rounded-md shadow-lg p-3 border border-gray-200" style={{ width: '300px' }}>
          {/* Calendar header */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex space-x-1">
              <button 
                type="button" 
                onClick={handlePrevYear}
                className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                </svg>
              </button>
              <button 
                type="button" 
                onClick={handlePrevMonth}
                className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
            </div>
            
            <div className="text-gray-900 font-medium">
              {format(viewDate, 'MMMM yyyy')}
            </div>
            
            <div className="flex space-x-1">
              <button 
                type="button" 
                onClick={handleNextMonth}
                className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
              <button 
                type="button" 
                onClick={handleNextYear}
                className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Day names */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {dayNames.map(day => (
              <div 
                key={day} 
                className="text-center text-xs font-medium text-gray-500 py-1"
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const isCurrentDay = day && isToday(day);
              const isSelected = day && value && isSameDay(day, value);
              const isSameMonthDay = day && isSameMonth(day, viewDate);
              const isSelectable = day && isDateSelectable(day);
              
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => day && isSelectable && handleDateSelect(day)}
                  disabled={!day || !isSelectable}
                  className={`
                    h-8 w-8 rounded-full flex items-center justify-center text-sm focus:outline-none
                    ${!day ? 'invisible' : ''}
                    ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                    ${isCurrentDay && !isSelected ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : ''}
                    ${!isSelected && !isCurrentDay && isSelectable ? 'hover:bg-gray-100' : ''}
                    ${!isSelectable ? 'text-gray-300 cursor-not-allowed' : ''}
                    ${!isSameMonthDay && day ? 'text-gray-400' : ''}
                  `}
                >
                  {day ? getDate(day) : ''}
                </button>
              );
            })}
          </div>
          
          {/* Footer with action buttons */}
          {(showTodayButton || showClearButton) && (
            <div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
              {showTodayButton && (
                <button
                  type="button"
                  onClick={handleTodayClick}
                  disabled={!isDateSelectable(new Date())}
                  className={`
                    px-2 py-1 text-xs rounded hover:bg-gray-100 focus:outline-none
                    ${!isDateSelectable(new Date()) ? 'text-gray-300 cursor-not-allowed' : ''}
                  `}
                >
                  Today
                </button>
              )}
              
              {showClearButton && (
                <button
                  type="button"
                  onClick={handleClearClick}
                  className="px-2 py-1 text-xs rounded hover:bg-gray-100 focus:outline-none"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 