'use client';

import { useState, useCallback } from 'react';
import { WalletInput } from './WalletInput';
import { StatsCard, StatsCardSkeleton } from './StatsCard';
import { PositionsTable } from './PositionsTable';
import { TradesTable } from './TradesTable';
import { PnLChart } from './PnLChart';
import { VolumeChart } from './VolumeChart';
import { LongShortStats } from './LongShortStats';
import { DailyPnL } from './DailyPnL';
import { ThemeToggle } from './ThemeProvider';
import { LoadingDashboard } from './LoadingSpinner';
import { 
  getUserFills, 
  getUserState, 
  calculateTradeStats, 
  formatUSD, 
  formatNumber, 
  formatPercent 
} from '@/lib/api';
import { Fill, AssetPosition, TradeStats } from '@/types';

export default function Dashboard() {
  const [address, setAddress] = useState<string | null>(null);
  const [fills, setFills] = useState<Fill[]>([]);
  const [positions, setPositions] = useState<AssetPosition[]>([]);
  const [accountValue, setAccountValue] = useState<string>('0');
  const [stats, setStats] = useState<TradeStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'trades' | 'positions' | 'analytics'>('overview');

  const fetchData = useCallback(async (walletAddress: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch fills and user state in parallel
      const [fillsData, stateData] = await Promise.all([
        getUserFills(walletAddress),
        getUserState(walletAddress),
      ]);

      // Process fills
      const fillsArray = Array.isArray(fillsData) ? fillsData : [];
      // Sort by time descending (newest first)
      fillsArray.sort((a: Fill, b: Fill) => b.time - a.time);
      setFills(fillsArray);
      
      // Calculate stats
      const tradeStats = calculateTradeStats(fillsArray);
      setStats(tradeStats);

      // Process positions
      const state = stateData as { assetPositions?: AssetPosition[]; marginSummary?: { accountValue: string } };
      if (state?.assetPositions) {
        setPositions(state.assetPositions);
      } else {
        setPositions([]);
      }

      // Get account value
      if (state?.marginSummary?.accountValue) {
        setAccountValue(state.marginSummary.accountValue);
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Wallet-Daten');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = (newAddress: string) => {
    setAddress(newAddress);
    fetchData(newAddress);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--bg)] border-b border-[var(--border)] backdrop-blur-sm bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">Hyperliquid Tracker</h1>
              <p className="text-xs text-[var(--muted)]">View-only Wallet Analytics</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <WalletInput 
            onSubmit={handleSubmit} 
            isLoading={isLoading}
            currentAddress={address}
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-loss bg-opacity-10 border border-loss rounded-xl text-loss flex items-center gap-3 animate-fade-in">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Empty State */}
        {!address && !isLoading && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center">
              <svg className="w-12 h-12 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Wallet-Adresse eingeben</h2>
            <p className="text-[var(--muted)] max-w-md mx-auto mb-6">
              Zeige Trading-Historie, offene Positionen und Performance-Metriken für jede Hyperliquid-Wallet.
              Kein Login erforderlich.
            </p>
            <div className="flex flex-col items-center gap-2 text-sm text-[var(--muted)]">
              <span className="font-medium">Beispiel-Wallet:</span>
              <code className="bg-[var(--card)] px-3 py-1 rounded border border-[var(--border)] font-mono text-xs">
                0x2259e3D7F14D85B140B1a7AA7D713a7B7A2a2c5F
              </code>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingDashboard />}

        {/* Dashboard Content */}
        {address && !isLoading && (
          <div className="space-y-6 animate-fade-in">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-[var(--border)] pb-2 overflow-x-auto">
              {(['overview', 'trades', 'positions', 'analytics'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-[var(--accent)] text-white'
                      : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]'
                  }`}
                >
                  {tab === 'overview' ? 'Übersicht' : tab === 'trades' ? 'Trades' : tab === 'positions' ? 'Positionen' : 'Analytik'}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatsCard
                    title="Account Value"
                    value={formatUSD(accountValue)}
                    icon={
                      <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                  />
                  <StatsCard
                    title="Gesamt PnL"
                    value={formatUSD(stats?.totalPnl || 0)}
                    trend={stats && stats.totalPnl >= 0 ? 'up' : 'down'}
                    icon={
                      <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    }
                  />
                  <StatsCard
                    title="Win Rate"
                    value={formatPercent(stats?.winRate || 0)}
                    subtitle={stats ? `${stats.winningTrades}W / ${stats.losingTrades}L` : undefined}
                    trend={stats && stats.winRate >= 50 ? 'up' : 'neutral'}
                    icon={
                      <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    }
                  />
                  <StatsCard
                    title="Total Trades"
                    value={formatNumber(stats?.totalTrades || 0, 0)}
                    icon={
                      <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    }
                  />
                </div>

                {/* Secondary Stats */}
                {stats && stats.totalTrades > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatsCard
                      title="Total Volumen"
                      value={formatUSD(stats.totalVolume)}
                      size="sm"
                    />
                    <StatsCard
                      title="Profit Factor"
                      value={stats.profitFactor === Infinity ? '∞' : formatNumber(stats.profitFactor)}
                      size="sm"
                    />
                    <StatsCard
                      title="Bester Trade"
                      value={formatUSD(stats.bestTrade)}
                      trend="up"
                      size="sm"
                    />
                    <StatsCard
                      title="Schlechtester Trade"
                      value={formatUSD(stats.worstTrade)}
                      trend="down"
                      size="sm"
                    />
                  </div>
                )}

                {/* Tertiary Stats */}
                {stats && stats.totalTrades > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <StatsCard
                      title="Gesamtgebühren"
                      value={formatUSD(stats.totalFees)}
                      size="sm"
                    />
                    <StatsCard
                      title="Ø Gewinn"
                      value={formatUSD(stats.avgWin)}
                      trend="up"
                      size="sm"
                    />
                    <StatsCard
                      title="Ø Verlust"
                      value={formatUSD(stats.avgLoss)}
                      trend="down"
                      size="sm"
                    />
                  </div>
                )}

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PnLChart fills={fills} isLoading={isLoading} />
                  <VolumeChart fills={fills} isLoading={isLoading} />
                </div>

                {/* Open Positions */}
                <PositionsTable positions={positions} isLoading={isLoading} />

                {/* Recent Trades */}
                <TradesTable fills={fills.slice(0, 10)} isLoading={isLoading} walletAddress={address || undefined} />
              </div>
            )}

            {/* Trades Tab */}
            {activeTab === 'trades' && (
              <TradesTable fills={fills} isLoading={isLoading} walletAddress={address || undefined} />
            )}

            {/* Positions Tab */}
            {activeTab === 'positions' && (
              <PositionsTable positions={positions} isLoading={isLoading} />
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && stats && (
              <div className="space-y-6">
                {/* Long vs Short */}
                <LongShortStats
                  longTrades={stats.longTrades}
                  shortTrades={stats.shortTrades}
                  longPnl={stats.longPnl}
                  shortPnl={stats.shortPnl}
                  longWinRate={stats.longWinRate}
                  shortWinRate={stats.shortWinRate}
                />

                {/* Daily PnL */}
                <DailyPnL pnlByDay={stats.pnlByDay} pnlByWeek={stats.pnlByWeek} />

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PnLChart fills={fills} isLoading={isLoading} />
                  <VolumeChart fills={fills} isLoading={isLoading} />
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-[var(--muted)]">
          <p>Hyperliquid Tracker — View-only Analytics. Keine Datenspeicherung.</p>
          <p className="mt-1">Daten von Hyperliquid API.</p>
        </div>
      </footer>
    </div>
  );
}