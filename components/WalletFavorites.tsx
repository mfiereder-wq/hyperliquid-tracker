"use client";

import { useState, useEffect } from "react";
import { formatAddress } from "@/lib/api";

interface FavoriteWallet {
  address: string;
  label: string;
  addedAt: number;
}

interface WalletFavoritesProps {
  onSelect: (address: string) => void;
  currentAddress?: string | null;
}

// Diese Komponente wird jetzt intern vom Dashboard verwendet
// Die QuickFavorites-Komponente zeigt die Favoriten prominent auf der Startseite
export function WalletFavorites({
  onSelect,
  currentAddress,
}: WalletFavoritesProps) {
  const [favorites, setFavorites] = useState<FavoriteWallet[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAddLabel, setShowAddLabel] = useState(false);
  const [labelInput, setLabelInput] = useState("");

  // Load favorites from localStorage (client-side only)
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

  // Save favorites to localStorage
  const saveFavorites = (favs: FavoriteWallet[]) => {
    setFavorites(favs);
    try {
      localStorage.setItem("hyperliquid-favorites", JSON.stringify(favs));
    } catch (e) {
      console.error("Failed to save favorites:", e);
    }
  };

  const addFavorite = (label: string = "") => {
    if (!currentAddress) return;
    if (
      favorites.some(
        (f) => f.address.toLowerCase() === currentAddress.toLowerCase(),
      )
    ) {
      return; // Already exists
    }

    const newFav: FavoriteWallet = {
      address: currentAddress,
      label:
        label || `${currentAddress.slice(0, 6)}...${currentAddress.slice(-4)}`,
      addedAt: Date.now(),
    };

    saveFavorites([newFav, ...favorites]);
    setShowAddLabel(false);
    setLabelInput("");
  };

  const removeFavorite = (address: string, e: React.MouseEvent) => {
    e.stopPropagation();
    saveFavorites(
      favorites.filter(
        (f) => f.address.toLowerCase() !== address.toLowerCase(),
      ),
    );
  };

  const isFavorite =
    currentAddress &&
    favorites.some(
      (f) => f.address.toLowerCase() === currentAddress.toLowerCase(),
    );

  // Don't render until loaded (prevents hydration mismatch)
  if (!isLoaded) return null;

  // Compact view when used in Dashboard header or similar
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Add current to favorites button */}
      {currentAddress && !isFavorite && (
        <button
          onClick={() => setShowAddLabel(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-muted hover:text-accent border border-dashed border-text-muted hover:border-accent rounded-lg transition-all"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Zu Favoriten</span>
        </button>
      )}

      {/* Label input popup */}
      {showAddLabel && (
        <div className="flex items-center gap-2 bg-bg-card p-2 rounded-xl border border-border">
          <input
            type="text"
            value={labelInput}
            onChange={(e) => setLabelInput(e.target.value)}
            placeholder="Name..."
            className="input text-sm py-1.5 px-3 w-32"
            onKeyDown={(e) => e.key === "Enter" && addFavorite(labelInput)}
            autoFocus
          />
          <button
            onClick={() => addFavorite(labelInput)}
            className="p-1.5 text-accent hover:bg-accent-dim rounded-lg"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
          <button
            onClick={() => setShowAddLabel(false)}
            className="p-1.5 text-text-muted hover:text-loss hover:bg-loss-dim rounded-lg"
          >
            <svg
              className="w-5 h-5"
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
      )}

      {/* Favorites List */}
      {favorites.map((fav) => (
        <button
          key={fav.address}
          onClick={() => onSelect(fav.address)}
          className={`
            group flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
            ${
              currentAddress?.toLowerCase() === fav.address.toLowerCase()
                ? "bg-accent text-bg"
                : "bg-bg-card border border-border hover:border-accent/50 text-text-secondary hover:text-text"
            }
          `}
        >
          <span className="truncate max-w-[100px]">{fav.label}</span>
          <span
            onClick={(e) => removeFavorite(fav.address, e)}
            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/10 rounded"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </span>
        </button>
      ))}
    </div>
  );
}

export default WalletFavorites;
