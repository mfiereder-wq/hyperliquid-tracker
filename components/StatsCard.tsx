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
  trend = 'neutral',
  className = '',
  size = 'md',
}: StatsCardProps) {
  const trendColors = {
    up: 'text-profit',
    down: 'text-loss',
    neutral: 'text-text',
  };

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  const valueSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div
      className={`
        group relative bg-bg-card border border-border rounded-2xl ${sizeClasses[size]} 
        hover:border-accent/30 hover:shadow-glow transition-all duration-300
        ${className}
      `}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">
        <div className="flex items-start justify-between">
          {/* Left side - Content */}
          <div className="flex-1 min-w-0">
            <p className="text-text-muted text-xs font-semibold mb-1 uppercase tracking-wider">
              {title}
            </p>
            <p className={`${valueSizes[size]} font-display font-bold truncate ${trendColors[trend]}`}>
              {value}
            </p>
            {subtitle && (
              <p className="text-text-muted text-xs mt-1">{subtitle}</p>
            )}
          </div>

          {/* Right side - Icon */}
          {icon && (
            <div className="flex-shrink-0 ml-4">
              <div className="w-12 h-12 rounded-xl bg-accent-dim flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                {icon}
              </div>
            </div>
          )}
        </div>

        {/* Trend Indicator */}
        {trend !== 'neutral' && (
          <div className={`absolute bottom-4 right-5 flex items-center gap-1 text-xs font-medium ${trendColors[trend]}`}>
            <svg 
              className="w-3 h-3" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {trend === 'up' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              )}
            </svg>
            <span>Live</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Skeleton loader for stats card
export function StatsCardSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <div className={`bg-bg-card border border-border rounded-2xl ${sizeClasses[size]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="skeleton h-3 w-20 rounded mb-2"></div>
          <div className="skeleton h-8 w-28 rounded"></div>
          <div className="skeleton h-2 w-16 rounded mt-2"></div>
        </div>
        <div className="skeleton w-12 h-12 rounded-xl"></div>
      </div>
    </div>
  );
}

export default StatsCard;
