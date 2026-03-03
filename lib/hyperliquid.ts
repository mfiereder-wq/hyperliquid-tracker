// Hyperliquid Official API Client

const HYPERLIQUID_API = 'https://api.hyperliquid.xyz/info';

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
}

// Get leaderboard data from Hyperliquid API
// Note: Hyperliquid doesn't have a public leaderboard endpoint yet, this is a placeholder
// For real data you would need to use a third-party aggregator or track wallets yourself
export async function getHyperliquidLeaderboard(timeframe: '24h' | '7d' | '30d'): Promise<HyperliquidLeaderboardEntry[]> {
  try {
    // This is a placeholder - Hyperliquid does not currently expose a public leaderboard API
    // In production you would need to:
    // 1. Use a third-party service like DefiLlama, Dune Analytics
    // 2. Track top traders yourself by scanning blockchain transactions
    // 3. Use a paid API service
    
    const response = await fetch(`${HYPERLIQUID_API}/leaderboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timeframe: timeframe,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard data');
    }

    const data = await response.json();
    return data.map((entry: any) => ({
      address: entry.address,
      totalPnl: entry.totalPnl,
      dailyPnl: entry.dailyPnl,
      weeklyPnl: entry.weeklyPnl,
      monthlyPnl: entry.monthlyPnl,
      winRate: entry.winRate,
      volume: entry.volume,
      totalTrades: entry.totalTrades,
      accountValue: entry.accountValue,
    }));
  } catch (error) {
    console.error('Error fetching Hyperliquid leaderboard:', error);
    // Return empty array as fallback
    return [];
  }
}

// Get wallet stats for a specific address
export async function getWalletStats(address: string) {
  try {
    const response = await fetch(`${HYPERLIQUID_API}/userState`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: address,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch wallet stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching wallet stats:', error);
    return null;
  }
}