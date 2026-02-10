import React from 'react';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function Input({ value, onChange, placeholder, disabled, className = '', onKeyDown }: InputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-3 text-base md:text-lg bg-white border-[3px] border-[var(--dark-gray)] rounded-xl focus:outline-none focus:border-[var(--blue-light)] disabled:bg-gray-100 disabled:cursor-not-allowed shadow-[0_4px_0_0_var(--dark-gray)] transition-all ${className}`}
    />
  );
}
