// Hyperliquid API Types

export interface Fill {
  coin: string;
  side: 'B' | 'A'; // B = Buy, A = Sell
  px: string; // Price
  sz: string; // Size
  time: number; // Timestamp in ms
  startPosition: string;
  dir: string;
  closedPnl?: string;
  hash: string;
  oid: number;
  crossed: boolean;
  fee: string;
}

export interface Position {
  coin: string;
  entryPx: string;
  leverage: {
    type: string;
    value: number;
    rawUsd: string;
  };
  positionValue: string;
  szi: string; // Size (negative for short)
  unrealizedPnl: string;
  marginUsed: string;
  returnOnEquity: number;
  liquidationPx: string;
}

export interface Order {
  coin: string;
  limitPx: string;
  oid: number;
  side: 'B' | 'A';
  sz: string;
  timestamp: number;
  origSz: string;
}

export interface AssetPosition {
  position: Position;
  type: 'oneWay';
}

export interface Meta {
  universe: Array<{
    name: string;
    szDecimals: number;
    maxLeverage: number;
    onlyIsolated?: boolean;
  }>;
}

export interface UserState {
  assetPositions: AssetPosition[];
  crossMarginSummary: {
    accountValue: string;
    totalMarginUsed: string;
    totalNtlPos: string;
    totalRawUsd: string;
  };
  marginSummary: {
    accountValue: string;
    totalMarginUsed: string;
    totalNtlPos: string;
    totalRawUsd: string;
  };
  withdrawable: string;
}

export interface Candle {
  t: number; // Timestamp
  o: string; // Open
  h: string; // High
  l: string; // Low
  c: string; // Close
  v: string; // Volume
}

export interface TradeStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalPnl: number;
  totalVolume: number;
  avgTradeSize: number;
  bestTrade: number;
  worstTrade: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  totalFees: number;
  longTrades: number;
  shortTrades: number;
  longPnl: number;
  shortPnl: number;
  longWinRate: number;
  shortWinRate: number;
  pnlByDay: Map<string, { pnl: number; trades: number }>;
  pnlByWeek: Map<string, { pnl: number; trades: number }>;
}

export interface ChartDataPoint {
  time: number;
  value: number;
}

export interface PnLDataPoint {
  time: number;
  value: number;
  color?: string;
}

// Time filter options
export type TimeFilter = '24h' | '7d' | '30d' | '90d' | 'all';

export function getTimeFilterRange(filter: TimeFilter): { startTime: number; endTime?: number } {
  const now = Date.now();
  const endTime = now;
  
  switch (filter) {
    case '24h':
      return { startTime: now - 24 * 60 * 60 * 1000, endTime };
    case '7d':
      return { startTime: now - 7 * 24 * 60 * 60 * 1000, endTime };
    case '30d':
      return { startTime: now - 30 * 24 * 60 * 60 * 1000, endTime };
    case '90d':
      return { startTime: now - 90 * 24 * 60 * 60 * 1000, endTime };
    case 'all':
    default:
      return { startTime: 0 }; // All time
  }
}