import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  className = '',
  icon: Icon,
  disabled = false,
  loading = false,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center h-[44px] px-8 py-4 text-sm font-semibold rounded-sm duration-instant focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-text-primary active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100";
  
  const variants = {
    primary: "bg-surface-base text-text-secondary hover:brightness-110 hover:shadow-3",
    secondary: "bg-surface-strong text-text-primary hover:brightness-95 hover:shadow-3",
    destructive: "bg-status-rejected text-text-secondary hover:brightness-110 hover:shadow-3",
    ghost: "bg-transparent text-text-primary hover:bg-surface-strong",
    link: "bg-transparent text-text-primary underline hover:opacity-80 p-0 h-auto"
  };

  const loadingClass = loading ? "cursor-wait pointer-events-none" : "";

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${loadingClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5 mr-2" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
