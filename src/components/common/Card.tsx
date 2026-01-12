import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  padding = true,
  hover = false 
}) => {
  const baseClasses = 'bg-white rounded-lg shadow';
  const paddingClass = padding ? 'p-6' : '';
  const hoverClass = hover ? 'hover:shadow-lg transition-shadow cursor-pointer' : '';

  return (
    <div className={`${baseClasses} ${paddingClass} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
};

export default Card;