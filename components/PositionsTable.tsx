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

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
      <div className="p-4 border-b border-[var(--border)]">
        <h3 className="text-lg font-semibold">Offene Positionen</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="trade-table">
          <thead>
            <tr>
              <th>Market</th>
              <th>Seite</th>
              <th>Größe</th>
              <th>Entry</th>
              <th>Mark Price</th>
              <th>Liq. Price</th>
              <th>PnL</th>
              <th>ROE</th>
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
                <tr key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                  <td className="font-semibold">{pos.coin}</td>
                  <td>
                    <span className={`badge ${isLong ? 'badge-long' : 'badge-short'}`}>
                      {isLong ? 'LONG' : 'SHORT'}
                    </span>
                  </td>
                  <td className="font-mono">
                    {formatNumber(Math.abs(size), 4)}
                    <span className="text-[var(--muted)] text-xs ml-1">{leverage}x</span>
                  </td>
                  <td className="font-mono">${formatNumber(entryPx, 4)}</td>
                  <td className="font-mono">${formatNumber(markPrice, 4)}</td>
                  <td className="font-mono text-loss">${formatNumber(liqPrice, 4)}</td>
                  <td className={`font-mono font-semibold ${unrealizedPnl >= 0 ? 'profit' : 'loss'}`}>
                    {formatUSD(unrealizedPnl)}
                  </td>
                  <td className={`font-mono ${roe >= 0 ? 'profit' : 'loss'}`}>
                    {formatPercent(roe)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}