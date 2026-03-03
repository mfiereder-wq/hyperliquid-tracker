'use client';

import { useState, useEffect } from 'react';

interface LeaderboardTrader {
  address: string;
  accountValue: number;
  pnl24h: number;
  pnl7d: number;
  pnl30d: number;
  winRate: number;
  volume: number;
}

interface LeaderboardProps {
  onSelectWallet: (address: string) => void;
}

export function Leaderboard({ onSelectWallet }: LeaderboardProps) {
  const [traders, setTraders] = useState<LeaderboardTrader[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Sample top traders (in production, this would come from an API or database)
  // Hyperliquid doesn't have a public leaderboard API, so we'd need to track this ourselves
  const sampleTopTraders: LeaderboardTrader[] = [
    { address: '0x2259e3D7F14D85B140B1a7AA7D713a7B7A2a2c5F', accountValue: 125000, pnl24h: 5420, pnl7d: 28450, pnl30d: 125000, winRate: 68, volume: 2500000 },
    { address: '0x3f0d3B8E2B5c4d9F1A7E6C5B8D9F2A3E4B5C6D7E', accountValue: 89000, pnl24h: 3200, pnl7d: 15600, pnl30d: 78000, winRate: 72, volume: 1800000 },
    { address: '0x4a1b2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B', accountValue: 156000, pnl24h: 2800, pnl7d: 12300, pnl30d: 65000, winRate: 61, volume: 3200000 },
    { address: '0x5B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C', accountValue: 78000, pnl24h: 2100, pnl7d: 9800, pnl30d: 45000, winRate: 58, volume: 950000 },
    { address: '0x6C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D', accountValue: 92000, pnl24h: 1850, pnl7d: 8200, pnl30d: 38000, winRate: 55, volume: 1100000 },
  ];

  const getPnl = (trader: LeaderboardTrader) => {
    switch (timeframe) {
      case '24h': return trader.pnl24h;
      case '7d': return trader.pnl7d;
      case '30d': return trader.pnl30d;
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatUSD = (value: number) => {
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

        {/* Info Banner */}
        <div className="px-4 py-3 bg-[var(--bg)] border-b border-[var(--border)]">
          <p className="text-xs text-[var(--muted)] flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Beispiel-Daten — Klicke auf eine Wallet, um sie zu analysieren
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg)]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase">Wallet</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase">Account Value</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase">PnL</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase">Win Rate</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase">Volume</th>
              </tr>
            </thead>
            <tbody>
              {sampleTopTraders.map((trader, idx) => {
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
                    <td className="px-4 py-3 text-right font-mono text-[var(--muted)]">{formatUSD(trader.volume)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-[var(--border)]">
          {sampleTopTraders.map((trader, idx) => {
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
                    <div className="text-[var(--muted)] text-xs">Volume</div>
                    <div className="font-mono">{formatUSD(trader.volume)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}