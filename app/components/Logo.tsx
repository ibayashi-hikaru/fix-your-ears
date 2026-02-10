"use client";

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'small' | 'large';
  className?: string;
}

export function Logo({ size = 'large', className = '' }: LogoProps) {
  const sizeClasses = {
    small: 'h-16 md:h-20',
    large: 'h-24 md:h-32'
  };

  return (
    <Image
      src="/images/logo.png"
      alt="Fix Your Ears"
      width={800}
      height={240}
      className={`${sizeClasses[size]} w-auto ${className}`}
    />
  );
}
