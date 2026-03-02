'use client';

import { useState, useEffect } from 'react';

interface FavoriteWallet {
  address: string;
  label: string;
  addedAt: number;
}

interface WalletFavoritesProps {
  onSelect: (address: string) => void;
  currentAddress?: string | null;
}

export function WalletFavorites({ onSelect, currentAddress }: WalletFavoritesProps) {
  const [favorites, setFavorites] = useState<FavoriteWallet[]>([]);
  const [showAddLabel, setShowAddLabel] = useState<string | null>(null);
  const [labelInput, setLabelInput] = useState('');

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('hyperliquid-favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load favorites:', e);
      }
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = (favs: FavoriteWallet[]) => {
    setFavorites(favs);
    localStorage.setItem('hyperliquid-favorites', JSON.stringify(favs));
  };

  const addFavorite = (address: string, label: string = '') => {
    if (favorites.some(f => f.address.toLowerCase() === address.toLowerCase())) {
      return; // Already exists
    }
    const newFav: FavoriteWallet = {
      address,
      label: label || `${address.slice(0, 6)}...${address.slice(-4)}`,
      addedAt: Date.now(),
    };
    saveFavorites([newFav, ...favorites]);
    setShowAddLabel(null);
    setLabelInput('');
  };

  const removeFavorite = (address: string) => {
    saveFavorites(favorites.filter(f => f.address.toLowerCase() !== address.toLowerCase()));
  };

  const updateLabel = (address: string, newLabel: string) => {
    saveFavorites(favorites.map(f => 
      f.address.toLowerCase() === address.toLowerCase() 
        ? { ...f, label: newLabel }
        : f
    ));
  };

  const isFavorite = (address: string) => {
    return favorites.some(f => f.address.toLowerCase() === address.toLowerCase());
  };

  if (favorites.length === 0 && !currentAddress) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="text-sm font-medium text-[var(--muted)]">Favoriten</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {favorites.map((fav) => (
          <div
            key={fav.address}
            className={`group flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
              currentAddress?.toLowerCase() === fav.address.toLowerCase()
                ? 'bg-[var(--accent)] bg-opacity-10 border-[var(--accent)]'
                : 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--accent)]'
            }`}
          >
            <button
              onClick={() => onSelect(fav.address)}
              className="flex items-center gap-2 flex-1 min-w-0"
            >
              <span className="text-sm font-medium truncate max-w-[120px] md:max-w-[200px]">
                {fav.label}
              </span>
              <span className="text-xs text-[var(--muted)] font-mono hidden sm:inline">
                ({fav.address.slice(0, 6)}...{fav.address.slice(-4)})
              </span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFavorite(fav.address);
              }}
              className="opacity-0 group-hover:opacity-100 text-[var(--muted)] hover:text-red-500 transition-all"
              title="Aus Favoriten entfernen"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Add current to favorites */}
      {currentAddress && !isFavorite(currentAddress) && (
        <div className="mt-3">
          {showAddLabel === currentAddress ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Name für Favorit..."
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addFavorite(currentAddress, labelInput);
                  } else if (e.key === 'Escape') {
                    setShowAddLabel(null);
                  }
                }}
                className="flex-1 px-3 py-2 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                autoFocus
              />
              <button
                onClick={() => addFavorite(currentAddress, labelInput)}
                className="px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Speichern
              </button>
              <button
                onClick={() => {
                  setShowAddLabel(null);
                  setLabelInput('');
                }}
                className="px-3 py-2 text-sm bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--border)] transition-colors"
              >
                Abbrechen
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddLabel(currentAddress)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--muted)] hover:text-[var(--text)] border border-dashed border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Aktuelle Wallet zu Favoriten hinzufügen
            </button>
          )}
        </div>
      )}
    </div>
  );
}