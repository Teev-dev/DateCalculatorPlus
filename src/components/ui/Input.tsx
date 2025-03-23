import React, { forwardRef } from 'react';

/**
 * Input variants for different purposes
 */
export type InputVariant = 'default' | 'outlined' | 'filled';

/**
 * Input sizes
 */
export type InputSize = 'sm' | 'md' | 'lg';

/**
 * Props for the Input component
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input variant
   */
  variant?: InputVariant;
  
  /**
   * Input size
   */
  size?: InputSize;
  
  /**
   * Whether the input is full width
   */
  fullWidth?: boolean;
  
  /**
   * Input label
   */
  label?: string;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Help text to display below the input
   */
  helpText?: string;
  
  /**
   * Left icon/element
   */
  leftElement?: React.ReactNode;
  
  /**
   * Right icon/element
   */
  rightElement?: React.ReactNode;
  
  /**
   * Additional CSS classes for the container
   */
  containerClassName?: string;
  
  /**
   * Additional CSS classes for the input element
   */
  inputClassName?: string;
}

/**
 * A versatile input component with various styles
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  variant = 'default',
  size = 'md',
  fullWidth = false,
  label,
  error,
  helpText,
  leftElement,
  rightElement,
  containerClassName = '',
  inputClassName = '',
  className = '',
  id,
  ...props
}, ref) => {
  // Generate unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  // Container classes
  const containerClasses = [
    'flex flex-col',
    fullWidth ? 'w-full' : '',
    containerClassName,
  ].join(' ');
  
  // Input wrapper classes (for left/right elements)
  const inputWrapperClasses = [
    'relative flex items-center',
    fullWidth ? 'w-full' : '',
  ].join(' ');
  
  // Input size classes
  const sizeClasses = {
    sm: 'text-sm px-2 py-1 h-8',
    md: 'text-base px-3 py-2 h-10',
    lg: 'text-lg px-4 py-3 h-12',
  };
  
  // Variant classes
  const variantClasses = {
    default: 'bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
    outlined: 'bg-transparent border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
    filled: 'bg-gray-100 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
  };
  
  // Status classes
  const statusClasses = error 
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-red-900 placeholder-red-300'
    : '';
  
  // Combine input classes
  const inputClasses = [
    'block rounded-md shadow-sm transition-colors',
    'focus:outline-none focus:ring-1',
    'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500',
    sizeClasses[size],
    variantClasses[variant],
    statusClasses,
    leftElement ? 'pl-10' : '',
    rightElement ? 'pr-10' : '',
    fullWidth ? 'w-full' : '',
    inputClassName,
  ].join(' ');
  
  // Label classes
  const labelClasses = [
    'block font-medium text-gray-700 mb-1',
    size === 'sm' ? 'text-sm' : '',
    size === 'lg' ? 'text-lg' : '',
    error ? 'text-red-600' : '',
  ].join(' ');
  
  // Error and help text classes
  const messageClasses = [
    'mt-1 text-sm',
    error ? 'text-red-600' : 'text-gray-500',
  ].join(' ');
  
  return (
    <div className={containerClasses}>
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className={labelClasses}>
          {label}
        </label>
      )}
      
      {/* Input with possible left/right elements */}
      <div className={inputWrapperClasses}>
        {/* Left element (icon, etc.) */}
        {leftElement && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            {leftElement}
          </div>
        )}
        
        {/* Actual input */}
        <input
          id={inputId}
          ref={ref}
          className={inputClasses}
          {...props}
        />
        
        {/* Right element (icon, etc.) */}
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            {rightElement}
          </div>
        )}
      </div>
      
      {/* Error message or help text */}
      {(error || helpText) && (
        <p className={messageClasses}>
          {error || helpText}
        </p>
      )}
    </div>
  );
});

// Display name for debugging
Input.displayName = 'Input'; 