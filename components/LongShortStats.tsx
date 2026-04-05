"use client";

import { formatUSD, formatPercent } from "@/lib/api";

interface LongShortStatsProps {
  longTrades: number;
  shortTrades: number;
  longPnl: number;
  shortPnl: number;
  longWinRate: number;
  shortWinRate: number;
  detailed?: boolean;
}

export function LongShortStats({
  longTrades,
  shortTrades,
  longPnl,
  shortPnl,
  longWinRate,
  shortWinRate,
}: LongShortStatsProps) {
  const total = longTrades + shortTrades;
  const longPercent = total > 0 ? (longTrades / total) * 100 : 0;
  const shortPercent = total > 0 ? (shortTrades / total) * 100 : 0;

  return (
    <div className="bg-bg-card border border-border rounded-2xl p-4 sm:p-6 overflow-hidden">
      <h3 className="font-display font-semibold text-text mb-4 text-base sm:text-lg">
        Long vs Short
      </h3>

      {/* Visual bar */}
      <div className="h-3 sm:h-4 rounded-full overflow-hidden bg-loss/20 mb-4">
        <div
          className="h-full bg-gradient-to-r from-profit to-profit-glow transition-all duration-500"
          style={{ width: `${longPercent}%` }}
        />
      </div>

      {/* Stats Grid - Mobile optimized */}
      <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6">
        {/* Long Stats */}
        <div className="space-y-3 p-3 sm:p-4 rounded-xl bg-bg-elevated">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-long text-xs sm:text-sm py-1.5 px-2.5">
              LONG
            </span>
            <span className="text-xs sm:text-sm text-text-muted">
              {longTrades} Trades ({Math.round(longPercent)}%)
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-baseline gap-2">
              <span className="text-xs sm:text-sm text-text-muted">PnL</span>
              <span
                className={`font-mono font-semibold text-sm sm:text-base truncate ${longPnl >= 0 ? "text-profit" : "text-loss"}`}
              >
                {longPnl >= 0 ? "+" : ""}
                {formatUSD(longPnl)}
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs sm:text-sm text-text-muted">
                Win Rate
              </span>
              <span
                className={`font-semibold text-sm sm:text-base ${longWinRate >= 50 ? "text-profit" : "text-text"}`}
              >
                {formatPercent(longWinRate)}
              </span>
            </div>
          </div>
        </div>

        {/* Short Stats */}
        <div className="space-y-3 p-3 sm:p-4 rounded-xl bg-bg-elevated">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-short text-xs sm:text-sm py-1.5 px-2.5">
              SHORT
            </span>
            <span className="text-xs sm:text-sm text-text-muted">
              {shortTrades} Trades ({Math.round(shortPercent)}%)
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-baseline gap-2">
              <span className="text-xs sm:text-sm text-text-muted">PnL</span>
              <span
                className={`font-mono font-semibold text-sm sm:text-base truncate ${shortPnl >= 0 ? "text-profit" : "text-loss"}`}
              >
                {shortPnl >= 0 ? "+" : ""}
                {formatUSD(shortPnl)}
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs sm:text-sm text-text-muted">
                Win Rate
              </span>
              <span
                className={`font-semibold text-sm sm:text-base ${shortWinRate >= 50 ? "text-profit" : "text-text"}`}
              >
                {formatPercent(shortWinRate)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LongShortStats;
