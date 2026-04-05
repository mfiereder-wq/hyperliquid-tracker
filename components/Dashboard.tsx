'use client';

import { useState, useCallback, useEffect } from 'react';
import { WalletInput } from './WalletInput';
import { QuickFavorites } from './QuickFavorites';
import { Donation } from './Donation';
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      const state = stateData as {
        assetPositions?: AssetPosition[];
        marginSummary?: { accountValue: string };
      };
      
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

  const handleFavoriteSelect = (selectedAddress: string) => {
    setAddress(selectedAddress);
    fetchData(selectedAddress);
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-teal-500 flex items-center justify-center animate-pulse-glow">
                <svg className="w-6 h-6 text-bg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-text">
                  Hyper<span className="text-accent">liquid</span>
                </h1>
                <p className="text-xs text-text-muted">Tracker</p>
              </div>
            </div>

            {/* Stats in Header */}
            {address && stats && (
              <div className="hidden md:flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-text-muted">Account Value</p>
                  <p className="font-mono font-bold text-text">{formatUSD(accountValue)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-muted">Total P&L</p>
                  <p className={`font-mono font-bold ${Number(stats.totalPnl) >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {Number(stats.totalPnl) >= 0 ? '+' : ''}{formatUSD(stats.totalPnl.toString())}
                  </p>
                </div>
              </div>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with Search */}
        <div className={`mb-8 transition-all duration-700 ${isMounted ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-text mb-3">
              Wallet <span className="gradient-text">Analytics</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Detaillierte Einblicke in deine Hyperliquid-Trades. Positions-Tracking, P&L-Analyse und mehr.
            </p>
          </div>

          {/* Wallet Input */}
          <div className="max-w-2xl mx-auto mb-6">
            <WalletInput 
              onSubmit={handleSubmit} 
              isLoading={isLoading} 
              currentAddress={address}
            />
          </div>

          {/* Quick Favorites - Prominent on Startpage */}
          <div className="max-w-4xl mx-auto">
            <QuickFavorites 
              onSelect={handleFavoriteSelect}
              currentAddress={address}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-loss-dim border border-loss/30 rounded-xl">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-loss" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-text">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingDashboard />}

        {/* Dashboard Content */}
        {!isLoading && address && stats && (
          <div className={`space-y-6 transition-all duration-700 ${isMounted ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-bg-elevated rounded-xl">
              {[
                { id: 'overview', label: 'Übersicht', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
                { id: 'trades', label: 'Trades', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                { id: 'positions', label: 'Positionen', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                { id: 'analytics', label: 'Analyse', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-accent text-bg shadow-glow'
                      : 'text-text-secondary hover:text-text hover:bg-bg-card'
                    }
                  `}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  {tab.label}
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
                    trend={Number(accountValue) > 10000 ? 'up' : 'neutral'}
                    icon={
                      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                  />
                  <StatsCard
                    title="Total P&L"
                    value={`${Number(stats.totalPnl) >= 0 ? '+' : ''}${formatUSD(stats.totalPnl.toString())}`}
                    subtitle={`Win Rate: ${formatPercent(stats.winRate)}`}
                    trend={Number(stats.totalPnl) >= 0 ? 'up' : 'down'}
                    icon={
                      <svg className="w-5 h-5 text-profit" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    }
                  />
                  <StatsCard
                    title="Total Trades"
                    value={formatNumber(stats.totalTrades)}
                    subtitle={`${stats.winningTrades} Wins / ${stats.losingTrades} Losses`}
                    trend={stats.winRate > 50 ? 'up' : 'neutral'}
                    icon={
                      <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    }
                  />
                  <StatsCard
                    title="Total Volume"
                    value={`$${formatNumber(stats.totalVolume)}`}
                    trend="neutral"
                    icon={
                      <svg className="w-5 h-5 text-premium" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    }
                  />
                </div>

                {/* Charts Row */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {stats.pnlByDay.size > 0 && (
                    <DailyPnL pnlByDay={stats.pnlByDay} pnlByWeek={stats.pnlByWeek} />
                  )}
                  <LongShortStats 
                    longTrades={stats.longTrades}
                    shortTrades={stats.shortTrades}
                    longPnl={stats.longPnl}
                    shortPnl={stats.shortPnl}
                    longWinRate={stats.longWinRate}
                    shortWinRate={stats.shortWinRate}
                  />
                </div>

                {/* PnL Chart */}
                <PnLChart fills={fills} />

                {/* Volume Chart */}
                <VolumeChart fills={fills} />
              </div>
            )}

            {/* Trades Tab */}
            {activeTab === 'trades' && (
              <TradesTable fills={fills} />
            )}

            {/* Positions Tab */}
            {activeTab === 'positions' && (
              <PositionsTable positions={positions} />
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <PnLChart fills={fills} showCumulative={true} />
                <VolumeChart fills={fills} detailed={true} />
                <LongShortStats 
                  longTrades={stats.longTrades}
                  shortTrades={stats.shortTrades}
                  longPnl={stats.longPnl}
                  shortPnl={stats.shortPnl}
                  longWinRate={stats.longWinRate}
                  shortWinRate={stats.shortWinRate}
                />
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !address && (
          <div className="text-center py-16 animate-fade-in-up">
            <div className="w-24 h-24 mx-auto mb-6 bg-bg-card rounded-3xl flex items-center justify-center animate-float">
              <svg className="w-12 h-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-semibold text-text mb-2">
              Wallet-Adresse eingeben
            </h3>
            <p className="text-text-secondary max-w-md mx-auto">
              Gib eine Hyperliquid-Wallet-Adresse ein, um detaillierte Trading-Statistiken und Positionsdaten zu sehen.
            </p>
            
            {/* Quick tip */}
            <div className="mt-8 inline-flex items-center gap-2 text-xs text-text-muted bg-bg-card px-4 py-2 rounded-full border border-border">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Tippe eine Adresse ein und speichere sie als Favorit für schnellen Zugriff</span>
            </div>
          </div>
        )}

        {/* Donation */}
        <div className="mt-12">
          <Donation />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-bg-elevated py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-text-muted">
              Hyperliquid Tracker &copy; {new Date().getFullYear()} — Unofficial Analytics Tool
            </p>
            <div className="flex items-center gap-6">
              <a 
                href="https://hyperliquid.xyz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-text-muted hover:text-accent transition-colors flex items-center gap-1"
              >
                <span>Hyperliquid</span>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
