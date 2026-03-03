'use client';

import { useState, useEffect } from 'react';
import { getHyperliquidLeaderboard, HyperliquidLeaderboardEntry } from '@/lib/hyperliquid';

interface LeaderboardProps {
  onSelectWallet: (address: string) => void;
}

export function Leaderboard({ onSelectWallet }: LeaderboardProps) {
  const [traders, setTraders] = useState<HyperliquidLeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/hyperliquid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "leaderboard",
        }),
      });

      if (!response.ok) {
        throw new Error("API error");
      }

      const rawData = await response.json();
      
      // Transform raw API data to our interface
      const data: HyperliquidLeaderboardEntry[] = rawData.map((entry: any) => ({
        address: entry.user,
        totalPnl: entry.totalPnl || 0,
        dailyPnl: entry.dailyPnl || 0,
        weeklyPnl: entry.weeklyPnl || 0,
        monthlyPnl: entry.monthlyPnl || 0,
        winRate: entry.winRate ? Math.round(entry.winRate * 100) : 0,
        volume: entry.volume || 0,
        totalTrades: entry.tradeCount || 0,
        accountValue: entry.accountValue || 0,
      }));
      
      setTraders(data.sort((a, b) => {
        const aPnl = timeframe === '24h' ? a.dailyPnl : timeframe === '7d' ? a.weeklyPnl : a.monthlyPnl;
        const bPnl = timeframe === '24h' ? b.dailyPnl : timeframe === '7d' ? b.weeklyPnl : b.monthlyPnl;
        return bPnl - aPnl;
      }));
    } catch (err) {
      console.error('Leaderboard Fehler:', err);
      setError("Konnte Leaderboard-Daten nicht laden.");
      setTraders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showLeaderboard) {
      fetchLeaderboard();
    }
  }, [timeframe, showLeaderboard]);

  const getPnl = (trader: HyperliquidLeaderboardEntry) => {
    switch (timeframe) {
      case '24h': return trader.dailyPnl;
      case '7d': return trader.weeklyPnl;
      case '30d': return trader.monthlyPnl;
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatUSD = (value: number) => {
    if (!value && value !== 0) return '$0';
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  if (!showLeaderboard) {
    return (
      <div className="mb-8">
        <button
          onClick={() => setShowLeaderboard(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="font-medium">🏆 Top Trader Leaderboard</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLeaderboard(false)}
              className="p-1 hover:bg-[var(--border)] rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span>🏆</span> Top Trader Leaderboard
            </h3>
          </div>
          
          {/* Timeframe Filter */}
          <div className="flex rounded-lg overflow-hidden border border-[var(--border)]">
            {(['24h', '7d', '30d'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  timeframe === tf
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--bg)] text-[var(--muted)] hover:text-[var(--text)]'
                }`}
              >
                {tf === '24h' ? '24h' : tf === '7d' ? '7 Tage' : '30 Tage'}
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="px-4 py-3 bg-red-500/10 border-b border-red-500/20">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="p-8 text-center">
            <div className="w-8 h-8 mx-auto mb-3 animate-spin">
              <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-[var(--muted)]">Lade Leaderboard...</p>
          </div>
        )}

        {/* Desktop Table View */}
        {!isLoading && !error && traders.length > 0 && (
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg)]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase">Wallet</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase">Account Value</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase">PnL</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase">Win Rate</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase">Trades</th>
                </tr>
              </thead>
              <tbody>
                {traders.map((trader, idx) => {
                  const pnl = getPnl(trader);
                  return (
                    <tr
                      key={trader.address}
                      onClick={() => onSelectWallet(trader.address)}
                      className="border-b border-[var(--border)] hover:bg-[var(--bg)] cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className={`font-bold ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-amber-600' : ''}`}>
                          {idx + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-sm">{formatAddress(trader.address)}</td>
                      <td className="px-4 py-3 text-right font-mono">{formatUSD(trader.accountValue)}</td>
                      <td className={`px-4 py-3 text-right font-mono font-semibold ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {pnl >= 0 ? '+' : ''}{formatUSD(pnl)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-medium ${trader.winRate >= 60 ? 'text-green-500' : trader.winRate >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                          {trader.winRate}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-[var(--muted)]">{trader.totalTrades}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Card View */}
        {!isLoading && !error && traders.length > 0 && (
          <div className="md:hidden divide-y divide-[var(--border)]">
            {traders.map((trader, idx) => {
              const pnl = getPnl(trader);
              return (
                <div
                  key={trader.address}
                  onClick={() => onSelectWallet(trader.address)}
                  className="p-4 hover:bg-[var(--bg)] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-lg ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-amber-600' : ''}`}>
                        #{idx + 1}
                      </span>
                      <span className="font-mono text-sm">{formatAddress(trader.address)}</span>
                    </div>
                    <span className={`font-mono font-semibold ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {pnl >= 0 ? '+' : ''}{formatUSD(pnl)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <div className="text-[var(--muted)] text-xs">Account</div>
                      <div className="font-mono">{formatUSD(trader.accountValue)}</div>
                    </div>
                    <div>
                      <div className="text-[var(--muted)] text-xs">Win Rate</div>
                      <div className={`font-medium ${trader.winRate >= 60 ? 'text-green-500' : 'text-yellow-500'}`}>
                        {trader.winRate}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[var(--muted)] text-xs">Trades</div>
                      <div className="font-mono">{trader.totalTrades}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No Data Message */}
        {!isLoading && !error && traders.length === 0 && (
          <div className="p-6 text-center">
            <svg className="w-12 h-12 mx-auto mb-3 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-[var(--muted)]">Keine Trader-Daten gefunden</p>
          </div>
        )}
      </div>
    </div>
  );
}