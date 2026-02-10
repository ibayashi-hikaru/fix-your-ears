import React from 'react';

interface GamePanelProps {
  children: React.ReactNode;
  className?: string;
}

export function GamePanel({ children, className = '' }: GamePanelProps) {
  return (
    <div className={`bg-white border-[3px] md:border-[4px] border-[var(--dark-gray)] rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-[6px_6px_0_0_var(--dark-gray)] md:shadow-[8px_8px_0_0_var(--dark-gray)] ${className}`}>
      {children}
    </div>
  );
}
