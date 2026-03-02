'use client';

import { useState, useEffect } from 'react';
import { isValidAddress, formatAddress } from '@/lib/api';

interface WalletInputProps {
  onSubmit: (address: string) => void;
  isLoading: boolean;
  currentAddress: string | null;
}

export function WalletInput({ onSubmit, isLoading, currentAddress }: WalletInputProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  // Real-time validation
  useEffect(() => {
    const trimmed = input.trim();
    if (!trimmed) {
      setIsValid(null);
      setError(null);
    } else if (isValidAddress(trimmed)) {
      setIsValid(true);
      setError(null);
    } else {
      setIsValid(false);
      setError('Ungültiges Ethereum-Adressformat (muss mit 0x beginnen)');
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = input.trim();
    if (!trimmed) {
      setError('Bitte gib eine Wallet-Adresse ein');
      return;
    }

    if (!isValidAddress(trimmed)) {
      setError('Ungültige Wallet-Adresse. Bitte überprüfe die Eingabe.');
      return;
    }

    onSubmit(trimmed);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hyperliquid Wallet-Adresse eingeben (0x...)"
            className={`w-full pl-12 pr-12 py-4 bg-[var(--card)] border rounded-xl text-[var(--text)] placeholder-[var(--muted)] font-mono text-sm transition-all ${
              isValid === true 
                ? 'border-profit focus:border-profit' 
                : isValid === false 
                  ? 'border-loss focus:border-loss' 
                  : 'border-[var(--border)] focus:border-[var(--accent)]'
            }`}
            disabled={isLoading}
            spellCheck={false}
            autoComplete="off"
          />
          {isValid !== null && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              {isValid ? (
                <svg className="w-5 h-5 text-profit" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-loss" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
          )}
        </div>

        {error && (
          <p className="text-loss text-sm flex items-center gap-2 animate-fade-in">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || isValid === false}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Lade Daten...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Wallet analysieren
            </>
          )}
        </button>
      </form>

      {currentAddress && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[var(--muted)]">
          <span>Aktuelle Wallet:</span>
          <code className="bg-[var(--card)] px-2 py-1 rounded border border-[var(--border)] font-mono text-profit">
            {formatAddress(currentAddress)}
          </code>
        </div>
      )}
    </div>
  );
}