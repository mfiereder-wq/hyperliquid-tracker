"use client";

import { useEffect, useState } from "react";

interface LeaderboardEntry {
  user: string;
  pnl: string;
  volume: string;
}

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/hyperliquid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "leaderboard",
        }),
      });

      if (!res.ok) {
        throw new Error("API error");
      }

      const result = await res.json();
      setData(result || []);

    } catch (err) {
      setError("Konnte Leaderboard-Daten nicht laden.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div style={{ padding: 20 }}>Lade Leaderboard...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 20, color: "red" }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Hyperliquid Leaderboard</h1>

      <table style={{ width: "100%", marginTop: 20 }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Wallet</th>
            <th>PnL</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{entry.user}</td>
              <td>{entry.pnl}</td>
              <td>{entry.volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}