'use client';

import { useState, useEffect } from 'react';

const DONATION_ADDRESS = '0x8532214951d64B11Be341922CB134b46F2D41293';

export function Donation() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(DONATION_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Support Button */}
      <div className="text-center">
        <button
          onClick={() => setIsOpen(true)}
          className="group inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-warning to-orange-500 text-bg font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
        >
          <span className="text-lg">☕</span>
          <span>Entwicklung unterstützen</span>
          <svg 
            className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg/80 backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                  <span className="text-xl">☕</span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-text">Unterstützung</h3>
                  <p className="text-xs text-text-muted">Jede Spende hilft weiter</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-bg-elevated rounded-lg transition-colors"
                aria-label="Schließen"
              >
                <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-text-secondary text-sm mb-6">
              Diese App wird mit ❤️ entwickelt. Unterstütze die Weiterentwicklung mit einer kleinen Spende auf verschiedenen Chains!
            </p>

            {/* Crypto Networks */}
            <div className="space-y-2 mb-6">
              {[
                { symbol: 'B', name: 'BNB', chain: 'BSC', color: 'bg-warning' },
                { symbol: 'E', name: 'ETH', chain: 'Ethereum', color: 'bg-accent' },
                { symbol: 'P', name: 'MATIC', chain: 'Polygon', color: 'bg-premium' },
              ].map((net) => (
                <div
                  key={net.symbol}
                  className="flex items-center gap-3 p-3 bg-bg-elevated rounded-xl border border-border"
                >
                  <div className={`w-9 h-9 rounded-lg ${net.color} flex items-center justify-center text-sm font-bold text-bg`}>
                    {net.symbol}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-text">{net.name}</div>
                    <div className="text-xs text-text-muted">{net.chain}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Address */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                Multichain Adresse
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={DONATION_ADDRESS}
                  readOnly
                  className="flex-1 px-4 py-3 text-xs font-mono bg-bg-elevated border border-border rounded-xl text-text"
                />
                <button
                  onClick={copyAddress}
                  className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    copied
                      ? 'bg-profit text-bg'
                      : 'bg-accent text-bg hover:opacity-90'
                  }`}
                >
                  {copied ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* QR Code */}
            <div className="text-center p-4 bg-bg-elevated rounded-xl border border-border">
              <div className="text-xs text-text-muted uppercase tracking-wider mb-3">QR-Code scannen</div>
              <div className="inline-block p-3 bg-white rounded-xl">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${DONATION_ADDRESS}`}
                  alt="Donation QR Code"
                  className="w-28 h-28"
                />
              </div>
            </div>

            <p className="text-xs text-center text-text-muted mt-5">
              Vielen Dank für deine Unterstützung! 🙏
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Donation;
