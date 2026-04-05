"use client";

import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  fullTitle?: string;
  value: string | number;
  subtitle?: string;
  fullSubtitle?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  size?: "sm" | "md" | "lg";
}

export function StatsCard({
  title,
  fullTitle,
  value,
  subtitle,
  fullSubtitle,
  icon,
  trend = "neutral",
}: StatsCardProps) {
  const trendColors = {
    up: "text-profit",
    down: "text-loss",
    neutral: "text-text",
  };

  return (
    <div
      className={`
        group relative bg-bg-card border border-border rounded-xl sm:rounded-2xl p-3 sm:p-5 
        hover:border-accent/30 hover:shadow-glow transition-all duration-200 sm:duration-300
      `}
      title={fullTitle || title}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative">
        <div className="flex items-start justify-between gap-2 sm:gap-4">
          {/* Left side - Content */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-xs text-text-muted font-semibold mb-1 sm:mb-1.5 uppercase tracking-wider truncate">
              {title}
            </p>
            <p
              className={`font-display font-bold text-base sm:text-2xl truncate ${trendColors[trend]} leading-tight`}
            >
              {value}
            </p>
            {subtitle && (
              <p
                className="text-[10px] sm:text-xs text-text-muted mt-0.5 sm:mt-1 truncate"
                title={fullSubtitle}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Right side - Icon */}
          {icon && (
            <div className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-accent-dim flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                {icon}
              </div>
            </div>
          )}
        </div>

        {/* Trend Indicator - Only on larger screens */}
        <div
          className={`hidden sm:flex absolute bottom-0 right-5 items-center gap-1 text-xs font-medium ${trendColors[trend]}`}
        >
          {trend !== "neutral" && (
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {trend === "up" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              )}
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

// Skeleton loader for stats card
export function StatsCardSkeleton({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "p-3",
    md: "p-3 sm:p-5",
    lg: "p-3 sm:p-6",
  };

  return (
    <div
      className={`bg-bg-card border border-border rounded-xl sm:rounded-2xl ${sizeClasses[size]}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="skeleton h-2 sm:h-3 w-14 sm:w-20 rounded mb-1 sm:mb-2"></div>
          <div className="skeleton h-6 sm:h-8 w-20 sm:w-28 rounded"></div>
          <div className="skeleton h-1.5 sm:h-2 w-12 sm:w-16 rounded mt-1 sm:mt-2"></div>
        </div>
        <div className="skeleton w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl"></div>
      </div>
    </div>
  );
}

export default StatsCard;
