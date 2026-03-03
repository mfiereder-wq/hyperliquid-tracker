'use client';

import { useState } from 'react';
import { Fill } from '@/types';
import { formatNumber, formatUSD, formatTimestamp, formatTimestampFull, exportToCSV } from '@/lib/api';

interface TradesTableProps {
  fills: Fill[];
  isLoading?: boolean;
  walletAddress?: string;
}

export function TradesTable({ fills, isLoading, walletAddress }: TradesTableProps) {
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState<'all' | 'long' | 'short'>('all');
  const displayFills = showAll ? fills : fills.slice(0, 20);
  
  const filteredFills = filter === 'all' 
    ? displayFills 
    : displayFills.filter(f => filter === 'long' ? f.side === 'B' : f.side === 'A');

  if (isLoading) {
    return (
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <div className="skeleton h-6 w-40 rounded mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="skeleton h-12 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!fills || fills.length === 0) {
    return (
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Trade-Historie</h3>
        <div className="text-center py-8 text-[var(--muted)]">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p>Keine Trades gefunden</p>
        </div>
      </div>
    );
  }

  const handleExport = () => {
    exportToCSV(fills, `hyperliquid_trades_${walletAddress?.slice(0, 8) || 'export'}`);
  };

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
      <div className="p-4 border-b border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">Trade-Historie</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex rounded-lg overflow-hidden border border-[var(--border)]">
            {(['all', 'long', 'short'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs font-medium transition-colors ${
                  filter === f
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--bg)] text-[var(--muted)] hover:text-[var(--text)]'
                }`}
              >
                {f === 'all' ? 'Alle' : f === 'long' ? 'Long' : 'Short'}
              </button>
            ))}
          </div>
          <button
            onClick={handleExport}
            className="px-3 py-1 text-xs font-medium rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            CSV
          </button>
          <span className="text-sm text-[var(--muted)]">{fills.length} Trades</span>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="trade-table">
          <thead>
            <tr>
              <th>Zeit</th>
              <th>Market</th>
              <th>Seite</th>
              <th>Preis</th>
              <th>Größe</th>
              <th>Wert</th>
              <th>Fee</th>
              <th>Closed PnL</th>
            </tr>
          </thead>
          <tbody>
            {filteredFills.map((fill, idx) => {
              const isBuy = fill.side === 'B';
              const price = parseFloat(fill.px);
              const size = parseFloat(fill.sz);
              const value = price * size;
              const fee = parseFloat(fill.fee);
              const closedPnl = fill.closedPnl ? parseFloat(fill.closedPnl) : null;

              return (
                <tr key={fill.oid + '-' + idx} className="animate-fade-in" style={{ animationDelay: `${idx * 15}ms` }}>
                  <td className="font-mono text-sm whitespace-nowrap" title={formatTimestampFull(fill.time)}>
                    {formatTimestamp(fill.time)}
                  </td>
                  <td className="font-semibold">{fill.coin}</td>
                  <td>
                    <span className={`badge ${isBuy ? 'badge-long' : 'badge-short'}`}>
                      {isBuy ? 'BUY' : 'SELL'}
                    </span>
                  </td>
                  <td className="font-mono">${formatNumber(price, 4)}</td>
                  <td className="font-mono">{formatNumber(size, 4)}</td>
                  <td className="font-mono">{formatUSD(value)}</td>
                  <td className="font-mono text-[var(--muted)]">{formatUSD(fee, 4)}</td>
                  <td className={`font-mono font-semibold ${closedPnl === null ? 'text-[var(--muted)]' : closedPnl >= 0 ? 'profit' : 'loss'}`}>
                    {closedPnl !== null ? formatUSD(closedPnl) : '−'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-[var(--border)]">
        {filteredFills.map((fill, idx) => {
          const isBuy = fill.side === 'B';
          const price = parseFloat(fill.px);
          const size = parseFloat(fill.sz);
          const value = price * size;
          const fee = parseFloat(fill.fee);
          const closedPnl = fill.closedPnl ? parseFloat(fill.closedPnl) : null;

          return (
            <div key={fill.oid + '-' + idx} className="p-3 animate-fade-in" style={{ animationDelay: `${idx * 15}ms` }}>
              {/* Header Row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{fill.coin}</span>
                  <span className={`badge ${isBuy ? 'badge-long' : 'badge-short'}`}>
                    {isBuy ? 'BUY' : 'SELL'}
                  </span>
                </div>
                <span className="text-xs text-[var(--muted)]" title={formatTimestampFull(fill.time)}>
                  {formatTimestamp(fill.time)}
                </span>
              </div>
              
              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Preis</span>
                  <span className="font-mono">${formatNumber(price, 4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Größe</span>
                  <span className="font-mono">{formatNumber(size, 4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Wert</span>
                  <span className="font-mono">{formatUSD(value)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Fee</span>
                  <span className="font-mono text-[var(--muted)]">{formatUSD(fee, 4)}</span>
                </div>
              </div>

              {/* PnL Row */}
              {closedPnl !== null && (
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-[var(--border)]">
                  <span className="text-[var(--muted)] text-sm">Closed PnL</span>
                  <span className={`font-mono font-semibold ${closedPnl >= 0 ? 'profit' : 'loss'}`}>
                    {formatUSD(closedPnl)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {fills.length > 20 && (
        <div className="p-4 border-t border-[var(--border)] text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-[var(--accent)] hover:underline text-sm font-medium"
          >
            {showAll ? 'Weniger anzeigen' : `Alle ${fills.length} Trades anzeigen`}
          </button>
        </div>
      )}
    </div>
  );
}