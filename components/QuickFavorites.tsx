"use client";

import { useState, useEffect } from "react";
import { formatAddress } from "@/lib/api";

interface FavoriteWallet {
  address: string;
  label: string;
  addedAt: number;
  lastViewed?: number;
}

interface QuickFavoritesProps {
  onSelect: (address: string) => void;
  currentAddress?: string | null;
}

export function QuickFavorites({
  onSelect,
  currentAddress,
}: QuickFavoritesProps) {
  const [favorites, setFavorites] = useState<FavoriteWallet[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sort by last viewed (most recent first), then by added date
  const sortedFavorites = [...favorites].sort((a, b) => {
    if (a.lastViewed && b.lastViewed) {
      return b.lastViewed - a.lastViewed;
    }
    if (a.lastViewed) return -1;
    if (b.lastViewed) return 1;
    return b.addedAt - a.addedAt;
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hyperliquid-favorites");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load favorites:", e);
    }
    setIsLoaded(true);
  }, []);

  // Update lastViewed when current address changes
  useEffect(() => {
    if (currentAddress && favorites.length > 0) {
      const updated = favorites.map((f) =>
        f.address.toLowerCase() === currentAddress.toLowerCase()
          ? { ...f, lastViewed: Date.now() }
          : f,
      );
      if (JSON.stringify(updated) !== JSON.stringify(favorites)) {
        setFavorites(updated);
        localStorage.setItem("hyperliquid-favorites", JSON.stringify(updated));
      }
    }
  }, [currentAddress, favorites]);

  const handleSelect = (address: string) => {
    // Update lastViewed
    const updated = favorites.map((f) =>
      f.address.toLowerCase() === address.toLowerCase()
        ? { ...f, lastViewed: Date.now() }
        : f,
    );
    setFavorites(updated);
    localStorage.setItem("hyperliquid-favorites", JSON.stringify(updated));
    onSelect(address);
  };

  const removeFavorite = (address: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = favorites.filter(
      (f) => f.address.toLowerCase() !== address.toLowerCase(),
    );
    setFavorites(updated);
    localStorage.setItem("hyperliquid-favorites", JSON.stringify(updated));
  };

  if (!isLoaded || favorites.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-accent"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-semibold text-text-secondary">
            Schnellzugriff
          </span>
          <span className="text-xs text-text-muted bg-bg-elevated px-2 py-0.5 rounded-full">
            {favorites.length}
          </span>
        </div>
        <span className="text-xs text-text-muted">Klicken zum Anzeigen</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sortedFavorites.map((fav, index) => (
          <button
            key={fav.address}
            onClick={() => handleSelect(fav.address)}
            className={`
              group relative text-left p-4 rounded-xl border transition-all duration-300
              ${
                currentAddress?.toLowerCase() === fav.address.toLowerCase()
                  ? "bg-accent-dim border-accent shadow-glow"
                  : "bg-bg-card border-border hover:border-accent/50 hover:bg-bg-hover"
              }
            `}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Background Gradient on Hover */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Content */}
            <div className="relative">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`
                    w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                    ${
                      currentAddress?.toLowerCase() ===
                      fav.address.toLowerCase()
                        ? "bg-accent text-bg"
                        : "bg-bg-elevated text-accent group-hover:bg-accent/20"
                    }
                  `}
                  >
                    {fav.label.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-text text-sm truncate max-w-[120px]">
                      {fav.label}
                    </p>
                    <p className="font-mono text-xs text-text-muted">
                      {formatAddress(fav.address)}
                    </p>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={(e) => removeFavorite(fav.address, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-loss-dim rounded-lg transition-all duration-200"
                  title="Entfernen"
                >
                  <svg
                    className="w-4 h-4 text-text-muted hover:text-loss"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Info Row */}
              <div className="flex items-center gap-3 text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {fav.lastViewed ? getRelativeTime(fav.lastViewed) : "Nie"}
                </span>
                {currentAddress?.toLowerCase() ===
                  fav.address.toLowerCase() && (
                  <span className="text-accent font-medium">Aktiv</span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Gerade eben";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return new Date(timestamp).toLocaleDateString("de-DE", {
    month: "short",
    day: "numeric",
  });
}
