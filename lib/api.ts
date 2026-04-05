// Hyperliquid API Client with Rate Limiting and Retry Logic

const API_URL = "https://api.hyperliquid.xyz/info";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const RATE_LIMIT_DELAY = 100; // 100ms between requests

let lastRequestTime = 0;

// Rate limiter
async function rateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await new Promise((resolve) =>
      setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest),
    );
  }
  lastRequestTime = Date.now();
}

// Retry logic with exponential backoff
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries: number = MAX_RETRIES,
): Promise<Response> {
  try {
    await rateLimit();
    const response = await fetch(url, options);

    if (!response.ok) {
      if (response.status === 429 && retries > 0) {
        // Rate limited - wait and retry
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY * (MAX_RETRIES - retries + 1)),
        );
        return fetchWithRetry(url, options, retries - 1);
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response;
  } catch (error) {
    if (retries > 0 && error instanceof TypeError) {
      // Network error - retry
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

export interface ApiError {
  message: string;
  code: string;
}

export async function fetchFromHyperliquid(
  type: string,
  payload: Record<string, unknown> = {},
): Promise<unknown> {
  try {
    const response = await fetchWithRetry(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, ...payload }),
    });

    const data = await response.json();

    // Check for API-level errors
    if (data && typeof data === "object" && "error" in data) {
      throw new Error(data.error as string);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      // User-friendly error messages
      if (error.message.includes("Failed to deserialize")) {
        throw new Error(
          "Ungültige Wallet-Adresse. Bitte überprüfe die Adresse.",
        );
      }
      if (
        error.message.includes("NetworkError") ||
        error.message.includes("fetch")
      ) {
        throw new Error(
          "Netzwerkfehler. Bitte überprüfe deine Internetverbindung.",
        );
      }
      if (error.message.includes("429")) {
        throw new Error("Zu viele Anfragen. Bitte warte einen Moment.");
      }
      throw error;
    }
    throw new Error("Ein unbekannter Fehler ist aufgetreten.");
  }
}

// Get user's fills (trade history) with time range
export async function getUserFills(address: string) {
  return fetchFromHyperliquid("userFills", { user: address });
}

export async function getUserFillsByTime(
  address: string,
  startTime: number,
  endTime?: number,
) {
  const payload: Record<string, unknown> = { user: address, startTime };
  if (endTime) payload.endTime = endTime;
  return fetchFromHyperliquid("userFillsByTime", payload);
}

// Get user's open orders
export async function getUserOpenOrders(address: string) {
  return fetchFromHyperliquid("openOrders", { user: address });
}

// Get user's state (positions, margin, etc.)
export async function getUserState(address: string) {
  return fetchFromHyperliquid("clearinghouseState", { user: address });
}

// Get user's historical orders
export async function getUserHistoricalOrders(address: string) {
  return fetchFromHyperliquid("historicalOrders", { user: address });
}

// Get meta (asset info)
export async function getMeta() {
  return fetchFromHyperliquid("meta");
}

// Get all mids (current prices)
export async function getAllMids() {
  return fetchFromHyperliquid("allMids");
}

// Get candle data for charts
export async function getCandles(
  coin: string,
  interval: string,
  startTime: number,
  endTime: number,
) {
  return fetchFromHyperliquid("candleSnapshot", {
    req: { coin, interval, startTime, endTime },
  });
}

// Validate Ethereum address
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Format address for display
export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Format number with commas
export function formatNumber(
  num: number | string,
  decimals: number = 2,
): string {
  const n = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(n)) return "0";

  if (Math.abs(n) >= 1_000_000) {
    return (n / 1_000_000).toFixed(decimals) + "M";
  }
  if (Math.abs(n) >= 1_000) {
    return (n / 1_000).toFixed(decimals) + "K";
  }
  return n.toLocaleString("de-CH", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// Format USD
export function formatUSD(num: number | string, decimals: number = 2): string {
  const n = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(n)) return "$0.00";

  const sign = n < 0 ? "-" : "";
  const absN = Math.abs(n);

  return `${sign}$${formatNumber(absN, decimals)}`;
}

// Format percentage
export function formatPercent(num: number, decimals: number = 2): string {
  if (isNaN(num)) return "0%";
  const sign = num > 0 ? "+" : "";
  return `${sign}${num.toFixed(decimals)}%`;
}

// Format timestamp
export function formatTimestamp(ts: number): string {
  const date = new Date(ts);
  return date.toLocaleString("de-CH", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTimestampFull(ts: number): string {
  const date = new Date(ts);
  return date.toLocaleString("de-CH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatDate(ts: number): string {
  const date = new Date(ts);
  return date.toLocaleDateString("de-CH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Calculate comprehensive trade statistics
export function calculateTradeStats(fills: any[]): {
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
} {
  const empty = {
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    winRate: 0,
    totalPnl: 0,
    totalVolume: 0,
    avgTradeSize: 0,
    bestTrade: 0,
    worstTrade: 0,
    avgWin: 0,
    avgLoss: 0,
    profitFactor: 0,
    totalFees: 0,
    longTrades: 0,
    shortTrades: 0,
    longPnl: 0,
    shortPnl: 0,
    longWinRate: 0,
    shortWinRate: 0,
    pnlByDay: new Map(),
    pnlByWeek: new Map(),
  };

  if (!fills || fills.length === 0) {
    return empty;
  }

  const tradesWithPnl = fills.filter((f) => f.closedPnl !== undefined);
  const pnls = tradesWithPnl.map((f) => parseFloat(f.closedPnl || "0"));

  const wins = pnls.filter((p) => p > 0);
  const losses = pnls.filter((p) => p < 0);

  const totalPnl = pnls.reduce((sum, p) => sum + p, 0);
  const totalVolume = fills.reduce(
    (sum, f) => sum + parseFloat(f.px) * parseFloat(f.sz),
    0,
  );
  const totalFees = fills.reduce((sum, f) => sum + parseFloat(f.fee || "0"), 0);

  const avgWin =
    wins.length > 0 ? wins.reduce((s, w) => s + w, 0) / wins.length : 0;
  const avgLoss =
    losses.length > 0
      ? Math.abs(losses.reduce((s, l) => s + l, 0) / losses.length)
      : 0;
  const totalWins = wins.reduce((s, w) => s + w, 0);
  const totalLosses = Math.abs(losses.reduce((s, l) => s + l, 0));

  // Long vs Short statistics
  const longTrades = fills.filter((f) => f.side === "B");
  const shortTrades = fills.filter((f) => f.side === "A");
  const longWithPnl = longTrades.filter((f) => f.closedPnl !== undefined);
  const shortWithPnl = shortTrades.filter((f) => f.closedPnl !== undefined);

  const longPnl = longWithPnl.reduce(
    (sum, f) => sum + parseFloat(f.closedPnl || "0"),
    0,
  );
  const shortPnl = shortWithPnl.reduce(
    (sum, f) => sum + parseFloat(f.closedPnl || "0"),
    0,
  );

  const longWins = longWithPnl.filter(
    (f) => parseFloat(f.closedPnl || "0") > 0,
  ).length;
  const shortWins = shortWithPnl.filter(
    (f) => parseFloat(f.closedPnl || "0") > 0,
  ).length;

  // PnL by day and week
  const pnlByDay = new Map<string, { pnl: number; trades: number }>();
  const pnlByWeek = new Map<string, { pnl: number; trades: number }>();

  tradesWithPnl.forEach((f) => {
    const date = new Date(f.time);
    const dayKey = date.toISOString().split("T")[0];
    const weekKey = getWeekKey(date);

    const pnl = parseFloat(f.closedPnl || "0");

    if (!pnlByDay.has(dayKey)) {
      pnlByDay.set(dayKey, { pnl: 0, trades: 0 });
    }
    pnlByDay.get(dayKey)!.pnl += pnl;
    pnlByDay.get(dayKey)!.trades += 1;

    if (!pnlByWeek.has(weekKey)) {
      pnlByWeek.set(weekKey, { pnl: 0, trades: 0 });
    }
    pnlByWeek.get(weekKey)!.pnl += pnl;
    pnlByWeek.get(weekKey)!.trades += 1;
  });

  return {
    totalTrades: fills.length,
    winningTrades: wins.length,
    losingTrades: losses.length,
    winRate:
      tradesWithPnl.length > 0 ? (wins.length / tradesWithPnl.length) * 100 : 0,
    totalPnl,
    totalVolume,
    avgTradeSize: fills.length > 0 ? totalVolume / fills.length : 0,
    bestTrade: pnls.length > 0 ? Math.max(...pnls) : 0,
    worstTrade: pnls.length > 0 ? Math.min(...pnls) : 0,
    avgWin,
    avgLoss,
    profitFactor:
      totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0,
    totalFees,
    longTrades: longTrades.length,
    shortTrades: shortTrades.length,
    longPnl,
    shortPnl,
    longWinRate:
      longWithPnl.length > 0 ? (longWins / longWithPnl.length) * 100 : 0,
    shortWinRate:
      shortWithPnl.length > 0 ? (shortWins / shortWithPnl.length) * 100 : 0,
    pnlByDay,
    pnlByWeek,
  };
}

function getWeekKey(date: Date): string {
  const year = date.getFullYear();
  const oneJan = new Date(year, 0, 1);
  const days = Math.floor((date.getTime() - oneJan.getTime()) / 86400000);
  const weekNum = Math.ceil((days + oneJan.getDay() + 1) / 7);
  return `${year}-W${weekNum.toString().padStart(2, "0")}`;
}

// Export trades to CSV
export function exportToCSV(fills: any[], filename: string = "trades"): void {
  if (!fills || fills.length === 0) return;

  const headers = [
    "Zeitstempel",
    "Market",
    "Side",
    "Preis",
    "Größe",
    "Wert",
    "Fee",
    "Closed PnL",
    "TX Hash",
  ];

  const rows = fills.map((f) => [
    formatTimestampFull(f.time),
    f.coin,
    f.side === "B" ? "BUY" : "SELL",
    parseFloat(f.px).toFixed(4),
    parseFloat(f.sz).toFixed(4),
    (parseFloat(f.px) * parseFloat(f.sz)).toFixed(2),
    parseFloat(f.fee || "0").toFixed(4),
    f.closedPnl ? parseFloat(f.closedPnl).toFixed(2) : "",
    f.hash || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
