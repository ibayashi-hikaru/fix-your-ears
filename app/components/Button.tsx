import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'success' | 'danger' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  type = 'button'
}: ButtonProps) {
  const baseStyles = 'rounded-2xl border-[3px] border-[var(--dark-gray)] font-semibold transition-all active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0';

  const variantStyles = {
    primary: 'bg-gradient-to-br from-[var(--blue-light)] to-[var(--blue-dark)] text-white shadow-[0_4px_0_0_var(--dark-gray)] hover:shadow-[0_6px_0_0_var(--dark-gray)]',
    success: 'bg-gradient-to-br from-[var(--green-light)] to-[var(--green-dark)] text-white shadow-[0_4px_0_0_var(--dark-gray)] hover:shadow-[0_6px_0_0_var(--dark-gray)]',
    danger: 'bg-gradient-to-br from-[var(--red-light)] to-[var(--red-dark)] text-white shadow-[0_4px_0_0_var(--dark-gray)] hover:shadow-[0_6px_0_0_var(--dark-gray)]',
    secondary: 'bg-white text-[var(--dark-gray)] shadow-[0_4px_0_0_var(--dark-gray)] hover:shadow-[0_6px_0_0_var(--dark-gray)]'
  };

  const sizeStyles = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
}
