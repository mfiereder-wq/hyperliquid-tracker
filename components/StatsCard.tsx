'use client';

import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  className = '',
  size = 'md' 
}: StatsCardProps) {
  const trendColors = {
    up: 'text-profit',
    down: 'text-loss',
    neutral: 'text-[var(--text)]',
  };

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const valueSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`bg-[var(--card)] border border-[var(--border)] rounded-xl ${sizeClasses[size]} card-hover ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[var(--muted)] text-xs font-medium mb-1 uppercase tracking-wide">{title}</p>
          <p className={`${valueSizes[size]} font-bold truncate ${trend ? trendColors[trend] : ''}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-[var(--muted)] text-xs mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-[var(--accent)] bg-opacity-10 flex-shrink-0 ml-2">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

// Skeleton loader for stats card
export function StatsCardSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div className={`bg-[var(--card)] border border-[var(--border)] rounded-xl ${sizeClasses[size]}`}>
      <div className="skeleton h-3 w-20 rounded mb-2"></div>
      <div className="skeleton h-8 w-28 rounded"></div>
    </div>
  );
}