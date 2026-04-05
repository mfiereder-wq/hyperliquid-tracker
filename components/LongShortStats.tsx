'use client';

import { StatsCard } from './StatsCard';
import { formatUSD, formatPercent, formatNumber } from '@/lib/api';

interface LongShortStatsProps {
  longTrades: number;
  shortTrades: number;
  longPnl: number;
  shortPnl: number;
  longWinRate: number;
  shortWinRate: number;
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
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Long vs Short</h3>
      
      {/* Visual bar */}
      <div className="h-3 rounded-full overflow-hidden bg-loss mb-4">
        <div 
          className="h-full bg-profit transition-all duration-500"
          style={{ width: `${longPercent}%` }}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Long Stats */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="badge badge-long">LONG</span>
            <span className="text-sm text-[var(--muted)]">{longTrades} Trades ({formatPercent(longPercent - 50)})</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)]">PnL</span>
              <span className={longPnl >= 0 ? 'profit font-semibold' : 'loss font-semibold'}>
                {formatUSD(longPnl)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)]">Win Rate</span>
              <span className={longWinRate >= 50 ? 'profit' : ''}>{formatPercent(longWinRate)}</span>
            </div>
          </div>
        </div>
        
        {/* Short Stats */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="badge badge-short">SHORT</span>
            <span className="text-sm text-[var(--muted)]">{shortTrades} Trades ({formatPercent(shortPercent - 50)})</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)]">PnL</span>
              <span className={shortPnl >= 0 ? 'profit font-semibold' : 'loss font-semibold'}>
                {formatUSD(shortPnl)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)]">Win Rate</span>
              <span className={shortWinRate >= 50 ? 'profit' : ''}>{formatPercent(shortWinRate)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}