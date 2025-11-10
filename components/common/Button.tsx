
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform transform duration-150 hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100';
  
  const variantStyles = {
    primary: 'text-white brand-gradient focus:ring-brandFrom shadow-lg shadow-brandFrom/20 hover:shadow-xl hover:shadow-brandFrom/30',
    secondary: 'text-brandFrom bg-brandFrom/10 hover:bg-brandFrom/20 focus:ring-brandFrom dark:bg-brandFrom/20 dark:text-brandFrom dark:hover:bg-brandFrom/30',
    danger: 'text-white bg-accent1 hover:bg-red-700 focus:ring-accent1',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;