import React from 'react';

/**
 * Props for the Card component
 */
export interface CardProps {
  /**
   * Card title
   */
  title?: string;
  
  /**
   * Card subtitle
   */
  subtitle?: string;
  
  /**
   * Whether to show a border
   */
  bordered?: boolean;
  
  /**
   * Whether to add a shadow
   */
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  
  /**
   * Card content padding
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  
  /**
   * Whether the card is full width
   */
  fullWidth?: boolean;
  
  /**
   * Optional footer content
   */
  footer?: React.ReactNode;
  
  /**
   * Optional header content (overrides title and subtitle)
   */
  header?: React.ReactNode;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Card content
   */
  children: React.ReactNode;
}

/**
 * A versatile card component for containing content
 */
export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  bordered = true,
  shadow = 'md',
  padding = 'md',
  fullWidth = false,
  footer,
  header,
  className = '',
  children,
}) => {
  // Shadow classes
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
  };
  
  // Padding classes
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };
  
  // Base card classes
  const cardClasses = [
    'bg-white rounded-lg',
    bordered ? 'border border-gray-200' : '',
    shadowClasses[shadow],
    fullWidth ? 'w-full' : '',
    className,
  ].join(' ');
  
  // Content classes
  const contentClasses = paddingClasses[padding];
  
  // Header styles when title/subtitle is provided
  const headerClasses = 'border-b border-gray-200 px-4 py-3';
  const titleClasses = 'font-medium text-gray-900 text-lg';
  const subtitleClasses = 'text-gray-500 text-sm mt-1';
  
  // Footer styles
  const footerClasses = 'border-t border-gray-200 px-4 py-3 bg-gray-50 rounded-b-lg';
  
  return (
    <div className={cardClasses}>
      {/* Header: either custom header or title/subtitle */}
      {header || (title && (
        <div className={headerClasses}>
          <h3 className={titleClasses}>{title}</h3>
          {subtitle && <p className={subtitleClasses}>{subtitle}</p>}
        </div>
      ))}
      
      {/* Card content */}
      <div className={contentClasses}>
        {children}
      </div>
      
      {/* Footer if provided */}
      {footer && (
        <div className={footerClasses}>
          {footer}
        </div>
      )}
    </div>
  );
}; 