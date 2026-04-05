// Hyperliquid Official API Client mit Proxy

export const HYPERLIQUID_API_PROXY = '/api/hyperliquid';

export interface HyperliquidLeaderboardEntry {
  address: string;
  totalPnl: number;
  dailyPnl: number;
  weeklyPnl: number;
  monthlyPnl: number;
  winRate: number;
  volume: number;
  totalTrades: number;
  accountValue: number;
  userName?: string;
}

export interface HyperliquidWalletStats {
  user: string;
  crossMarginLeverage: number;
  marginSummary: {
    totalWalletBalance: number;
    availableBalance: number;
    positionMargin: number;
    orderMargin: number;
  };
  assetPositions: any[];
  pnl: {
    total: number;
    daily: number;
    weekly: number;
    monthly: number;
  };
  tradeCount: number;
}

// Generic request to our proxy API
export async function fetchHyperliquidProxy<T>(body: any): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(HYPERLIQUID_API_PROXY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `HTTP Error ${response.status}` }));
      throw new Error(errorData.error || `API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch Hyperliquid API via proxy:', error);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Anfrage abgebrochen durch Timeout – bitte versuche es später erneut');
    }
    throw new Error(error instanceof Error ? error.message : 'Netzwerkfehler');
  }
}

// Get wallet stats for a specific address
export async function getWalletStats(address: string): Promise<HyperliquidWalletStats> {
  return fetchHyperliquidProxy<HyperliquidWalletStats>({
    type: 'clearinghouseState',
    user: address,
  });
}

// Get user fills/trade history
export async function getUserFills(address: string): Promise<any[]> {
  return fetchHyperliquidProxy<any[]>({
    type: 'userFills',
    user: address,
  });
}

// Get leaderboard data from Hyperliquid API
export async function getHyperliquidLeaderboard(timeframe: '24h' | '7d' | '30d'): Promise<HyperliquidLeaderboardEntry[]> {
  try {
    // First get official leaderboard data
    const leaderboardData = await fetchHyperliquidProxy<any[]>({
      type: 'leaderboard',
    });

    // Transform and enrich the data
    return leaderboardData.map((entry: any, index: number) => ({
      address: entry.user,
      totalPnl: entry.totalPnl || 0,
      dailyPnl: entry.dailyPnl || 0,
      weeklyPnl: entry.weeklyPnl || 0,
      monthlyPnl: entry.monthlyPnl || 0,
      winRate: entry.winRate ? Math.round(entry.winRate * 100) : 0,
      volume: entry.volume || 0,
      totalTrades: entry.tradeCount || 0,
      accountValue: entry.accountValue || 0,
      userName: entry.userName,
    }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw new Error('Konnte Leaderboard-Daten nicht laden');
  }
}