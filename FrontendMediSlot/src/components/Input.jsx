import React from 'react';

const Input = ({ label, id, className = '', error, ...props }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`h-[44px] px-4 rounded-sm border bg-white text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 duration-instant ${
          error ? 'border-status-rejected focus:ring-status-rejected' : 'border-text-tertiary/30 focus:ring-text-primary focus:border-text-primary'
        }`}
        {...props}
      />
      {error && <span className="text-xs text-status-rejected mt-1">{error}</span>}
    </div>
  );
};

export default Input;
