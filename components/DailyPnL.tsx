"use client";

import { useMemo } from "react";
import { formatUSD, formatDate } from "@/lib/api";

interface DailyPnLProps {
  pnlByDay: Map<string, { pnl: number; trades: number }>;
  pnlByWeek: Map<string, { pnl: number; trades: number }>;
}

export function DailyPnL({ pnlByDay, pnlByWeek }: DailyPnLProps) {
  const sortedDays = useMemo(() => {
    return Array.from(pnlByDay.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 14); // Last 14 days
  }, [pnlByDay]);

  const sortedWeeks = useMemo(() => {
    return Array.from(pnlByWeek.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 8); // Last 8 weeks
  }, [pnlByWeek]);

  if (sortedDays.length === 0) {
    return null;
  }

  // Find max absolute value for scaling
  const maxPnl = Math.max(...sortedDays.map(([, d]) => Math.abs(d.pnl)), 1);

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">PnL nach Tag</h3>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {sortedDays.map(([date, data]) => {
          const isPositive = data.pnl >= 0;
          const barWidth = Math.min((Math.abs(data.pnl) / maxPnl) * 100, 100);

          return (
            <div key={date} className="flex items-center gap-3 group">
              <div className="w-20 text-xs text-[var(--muted)] flex-shrink-0">
                {formatDate(new Date(date).getTime())}
              </div>
              <div className="flex-1 h-6 bg-[var(--bg)] rounded overflow-hidden relative">
                <div
                  className={`absolute inset-y-0 ${isPositive ? "left-0 bg-profit" : "right-0 bg-loss"} transition-all duration-300`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <div
                className={`w-24 text-right text-sm font-mono ${isPositive ? "profit" : "loss"}`}
              >
                {formatUSD(data.pnl)}
              </div>
              <div className="w-12 text-right text-xs text-[var(--muted)]">
                {data.trades} Trades
              </div>
            </div>
          );
        })}
      </div>

      {sortedWeeks.length > 1 && (
        <div className="mt-6 pt-4 border-t border-[var(--border)]">
          <h4 className="text-sm font-medium text-[var(--muted)] mb-3">
            Wochenübersicht
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {sortedWeeks.slice(0, 4).map(([week, data]) => {
              const isPositive = data.pnl >= 0;
              return (
                <div
                  key={week}
                  className="text-center p-2 rounded-lg bg-[var(--bg)]"
                >
                  <div className="text-xs text-[var(--muted)] mb-1">{week}</div>
                  <div
                    className={`text-sm font-semibold ${isPositive ? "profit" : "loss"}`}
                  >
                    {formatUSD(data.pnl)}
                  </div>
                  <div className="text-xs text-[var(--muted)]">
                    {data.trades} Trades
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
