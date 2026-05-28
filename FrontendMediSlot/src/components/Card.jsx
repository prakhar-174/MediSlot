import React from 'react';

const Card = ({ children, className = '', hoverable = false, ...props }) => {
  const hoverClasses = hoverable 
    ? "hover:shadow-3 hover:-translate-y-[2px] transition-all duration-instant" 
    : "";

  return (
    <div 
      className={`bg-surface-strong rounded-md shadow-1 p-6 border border-text-tertiary/20 ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
