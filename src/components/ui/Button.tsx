import React from 'react';

/**
 * Button variants for different purposes
 */
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

/**
 * Button sizes
 */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Props for the Button component
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant to use
   */
  variant?: ButtonVariant;
  
  /**
   * Button size
   */
  size?: ButtonSize;
  
  /**
   * Whether the button is full width
   */
  fullWidth?: boolean;
  
  /**
   * Whether to show a loading indicator
   */
  isLoading?: boolean;
  
  /**
   * Whether the button is an outline variant
   */
  outline?: boolean;
  
  /**
   * Whether the button is rounded
   */
  rounded?: boolean;
  
  /**
   * Optional icon to show before the button text
   */
  startIcon?: React.ReactNode;
  
  /**
   * Optional icon to show after the button text
   */
  endIcon?: React.ReactNode;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Button children
   */
  children: React.ReactNode;
}

/**
 * A versatile button component with various styles and variants
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  outline = false,
  rounded = false,
  startIcon,
  endIcon,
  className = '',
  children,
  disabled,
  ...props
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size classes
  const sizeClasses = {
    xs: 'text-xs px-2 py-1',
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-5 py-2.5',
    xl: 'text-xl px-6 py-3',
  };
  
  // Variant classes
  const variantClasses = {
    primary: outline
      ? 'text-blue-600 border border-blue-600 hover:bg-blue-50 focus:ring-blue-500'
      : 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    secondary: outline
      ? 'text-gray-600 border border-gray-600 hover:bg-gray-50 focus:ring-gray-500'
      : 'text-white bg-gray-600 hover:bg-gray-700 focus:ring-gray-500',
    success: outline
      ? 'text-green-600 border border-green-600 hover:bg-green-50 focus:ring-green-500'
      : 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500',
    danger: outline
      ? 'text-red-600 border border-red-600 hover:bg-red-50 focus:ring-red-500'
      : 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: outline
      ? 'text-yellow-600 border border-yellow-600 hover:bg-yellow-50 focus:ring-yellow-500'
      : 'text-gray-900 bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
    info: outline
      ? 'text-blue-400 border border-blue-400 hover:bg-blue-50 focus:ring-blue-300'
      : 'text-white bg-blue-400 hover:bg-blue-500 focus:ring-blue-300',
    light: outline
      ? 'text-gray-400 border border-gray-300 hover:bg-gray-50 focus:ring-gray-300'
      : 'text-gray-900 bg-gray-200 hover:bg-gray-300 focus:ring-gray-300',
    dark: outline
      ? 'text-gray-800 border border-gray-800 hover:bg-gray-50 focus:ring-gray-700'
      : 'text-white bg-gray-800 hover:bg-gray-900 focus:ring-gray-700',
  };
  
  // Additional classes
  const additionalClasses = [
    fullWidth ? 'w-full' : '',
    rounded ? 'rounded-full' : 'rounded-md',
    disabled || isLoading ? 'opacity-70 cursor-not-allowed' : '',
  ];
  
  // Combine all classes
  const buttonClasses = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    ...additionalClasses,
    className,
  ].join(' ');
  
  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      
      {startIcon && !isLoading && (
        <span className="mr-2">{startIcon}</span>
      )}
      
      {children}
      
      {endIcon && (
        <span className="ml-2">{endIcon}</span>
      )}
    </button>
  );
}; 