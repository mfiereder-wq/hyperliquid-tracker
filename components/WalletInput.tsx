"use client";

import { useState, useEffect } from "react";
import { isValidAddress, formatAddress } from "@/lib/api";

interface WalletInputProps {
  onSubmit: (address: string) => void;
  isLoading: boolean;
  currentAddress: string | null;
}

export function WalletInput({
  onSubmit,
  isLoading,
  currentAddress,
}: WalletInputProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isFocused, setIsFocused] = useState(false);

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
      setError("Ungültiges Ethereum-Adressformat (muss mit 0x beginnen)");
    }
  }, [input]);

  // Update input when currentAddress changes (from favorites selection)
  useEffect(() => {
    if (currentAddress) {
      setInput(currentAddress);
      setIsValid(true);
    }
  }, [currentAddress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = input.trim();

    if (!trimmed) {
      setError("Bitte gib eine Wallet-Adresse ein");
      return;
    }

    if (!isValidAddress(trimmed)) {
      setError("Ungültige Wallet-Adresse. Bitte überprüfe die Eingabe.");
      return;
    }

    onSubmit(trimmed);
  };

  const clearInput = () => {
    setInput("");
    setIsValid(null);
    setError(null);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`
            relative flex items-center gap-3 p-2 bg-bg-elevated border-2 rounded-2xl transition-all duration-300
            ${
              isFocused
                ? isValid === true
                  ? "border-accent shadow-glow"
                  : isValid === false
                    ? "border-loss shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                    : "border-accent/50"
                : "border-border hover:border-border-accent"
            }
          `}
        >
          {/* Search Icon */}
          <div className="flex-shrink-0 pl-3">
            <div
              className={`
              w-10 h-10 rounded-xl flex items-center justify-center transition-colors
              ${isFocused ? "bg-accent/10" : "bg-bg-card"}
            `}
            >
              <svg
                className={`w-5 h-5 transition-colors ${isFocused ? "text-accent" : "text-text-muted"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Input Field */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Hyperliquid Wallet-Adresse eingeben (0x...)"
            className="flex-1 bg-transparent border-none outline-none text-text font-mono text-sm placeholder:text-text-muted h-12"
            disabled={isLoading}
            spellCheck={false}
            autoComplete="off"
          />

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 pr-2">
            {/* Clear Button */}
            {input && (
              <button
                type="button"
                onClick={clearInput}
                className="p-2 text-text-muted hover:text-text hover:bg-bg-card rounded-lg transition-colors"
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
            )}

            {/* Validation Indicator */}
            {isValid !== null && !isLoading && (
              <div
                className={`flex-shrink-0 ${isValid ? "text-profit" : "text-loss"}`}
              >
                {isValid ? (
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
                ) : (
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
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isValid}
              className={`
                flex-shrink-0 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200
                ${
                  isLoading || !isValid
                    ? "bg-bg-card text-text-muted cursor-not-allowed"
                    : "bg-accent text-bg hover:bg-accent/90 shadow-glow hover:shadow-[0_0_30px_rgba(0,212,255,0.5)]"
                }
              `}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Laden...</span>
                </div>
              ) : (
                <span>Analysieren</span>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="absolute -bottom-8 left-0 flex items-center gap-2 text-sm text-loss">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Helper Text */}
        {!error && (
          <div className="absolute -bottom-8 left-0 flex items-center gap-2 text-xs text-text-muted">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Gib eine gültige Ethereum-Adresse ein</span>
          </div>
        )}
      </form>
    </div>
  );
}

export default WalletInput;
