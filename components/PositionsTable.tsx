'use client';

import { AssetPosition } from '@/types';
import { formatNumber, formatUSD, formatPercent } from '@/lib/api';

interface PositionsTableProps {
  positions: AssetPosition[];
  isLoading?: boolean;
}

export function PositionsTable({ positions, isLoading }: PositionsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <div className="skeleton h-6 w-40 rounded mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton h-16 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!positions || positions.length === 0) {
    return (
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Offene Positionen</h3>
        <div className="text-center py-8 text-[var(--muted)]">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p>Keine offenen Positionen</p>
        </div>
      </div>
    );
  }

  // Desktop View
  const DesktopTable = () => (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--bg)]">
            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase">Market</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase">Seite</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase">Größe</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase">Entry</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase">Mark Price</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase">Liq. Price</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase">PnL</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase">ROE</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((ap, idx) => {
            const pos = ap.position;
            const size = parseFloat(pos.szi);
            const isLong = size > 0;
            const entryPx = parseFloat(pos.entryPx);
            const positionValue = parseFloat(pos.positionValue);
            const unrealizedPnl = parseFloat(pos.unrealizedPnl);
            const roe = pos.returnOnEquity * 100;
            const liqPrice = parseFloat(pos.liquidationPx);
            const leverage = pos.leverage.value;
            const markPrice = Math.abs(size) > 0 ? positionValue / Math.abs(size) : 0;

            return (
              <tr key={idx} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors" style={{ animationDelay: `${idx * 50}ms` }}>
                <td className="px-4 py-3 font-semibold">{pos.coin}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isLong ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {isLong ? 'LONG' : 'SHORT'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  {formatNumber(Math.abs(size), 4)}
                  <span className="text-[var(--muted)] text-xs ml-1">{leverage}x</span>
                </td>
                <td className="px-4 py-3 text-right font-mono">${formatNumber(entryPx, 4)}</td>
                <td className="px-4 py-3 text-right font-mono">${formatNumber(markPrice, 4)}</td>
                <td className="px-4 py-3 text-right font-mono text-red-500">${formatNumber(liqPrice, 4)}</td>
                <td className={`px-4 py-3 text-right font-mono font-semibold ${
                  unrealizedPnl >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatUSD(unrealizedPnl)}
                </td>
                <td className={`px-4 py-3 text-right font-mono font-semibold ${
                  roe >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatPercent(roe)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // Mobile View
  const MobileCards = () => (
    <div className="md:hidden space-y-3">
      {positions.map((ap, idx) => {
        const pos = ap.position;
        const size = parseFloat(pos.szi);
        const isLong = size > 0;
        const entryPx = parseFloat(pos.entryPx);
        const positionValue = parseFloat(pos.positionValue);
        const unrealizedPnl = parseFloat(pos.unrealizedPnl);
        const roe = pos.returnOnEquity * 100;
        const liqPrice = parseFloat(pos.liquidationPx);
        const leverage = pos.leverage.value;
        const markPrice = Math.abs(size) > 0 ? positionValue / Math.abs(size) : 0;

        return (
          <div key={idx} className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 hover:bg-[var(--bg)] transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">{pos.coin}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isLong ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {isLong ? 'LONG' : 'SHORT'}
                </span>
              </div>
              <span className={`font-mono font-semibold ${
                unrealizedPnl >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {formatUSD(unrealizedPnl)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-xs text-[var(--muted)] mb-1">Größe</div>
                <div className="font-mono">
                  {formatNumber(Math.abs(size), 4)} {leverage}x
                </div>
              </div>
              <div>
                <div className="text-xs text-[var(--muted)] mb-1">Entry</div>
                <div className="font-mono">${formatNumber(entryPx, 4)}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-[var(--muted)] mb-1">Mark Price</div>
                <div className="font-mono">${formatNumber(markPrice, 4)}</div>
              </div>
              <div>
                <div className="text-xs text-[var(--muted)] mb-1">Liq. Price</div>
                <div className="font-mono text-red-500">${formatNumber(liqPrice, 4)}</div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-[var(--border)] flex justify-between">
              <div>
                <div className="text-xs text-[var(--muted)] mb-1">ROE</div>
                <span className={`font-mono font-medium ${
                  roe >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatPercent(roe)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
      <div className="p-4 border-b border-[var(--border)]">
        <h3 className="text-lg font-semibold">Offene Positionen</h3>
      </div>
      
      <DesktopTable />
      <MobileCards />
    </div>
  );
}