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
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
      >
        <span>☕</span>
        <span>Entwicklung unterstützen</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span>☕</span> Entwicklung unterstützen
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-[var(--border)] rounded-lg transition-colors"
                aria-label="Schließen"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-[var(--muted)] text-sm mb-5">
              Diese App wird mit ❤️ von <span className="text-[var(--text)] font-medium">Marco Pagani</span> entwickelt. 
              Unterstütze die Weiterentwicklung mit einer kleinen Spende!
            </p>

            {/* Crypto Networks */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-3 p-3 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-sm font-bold text-black">
                  B
                </div>
                <div>
                  <div className="font-medium text-sm">BNB (BSC)</div>
                  <div className="text-xs text-[var(--muted)]">Binance Smart Chain</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold text-white">
                  E
                </div>
                <div>
                  <div className="font-medium text-sm">ETH (Ethereum)</div>
                  <div className="text-xs text-[var(--muted)]">Ethereum Mainnet</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-sm font-bold text-white">
                  P
                </div>
                <div>
                  <div className="font-medium text-sm">MATIC (Polygon)</div>
                  <div className="text-xs text-[var(--muted)]">Polygon Network</div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">Multichain Adresse</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={DONATION_ADDRESS}
                  readOnly
                  className="flex-1 px-3 py-2 text-xs font-mono bg-[var(--bg)] border border-[var(--border)] rounded-lg"
                />
                <button
                  onClick={copyAddress}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    copied 
                      ? 'bg-green-500 text-white' 
                      : 'bg-[var(--accent)] text-white hover:opacity-90'
                  }`}
                >
                  {copied ? '✓' : 'Kopieren'}
                </button>
              </div>
            </div>

            {/* QR Code */}
            <div className="text-center p-3 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
              <div className="text-xs text-[var(--muted)] mb-2">QR-Code scannen</div>
              <div className="inline-block p-2 bg-white rounded-lg">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${DONATION_ADDRESS}`}
                  alt="Donation QR Code"
                  className="w-24 h-24 sm:w-28 sm:h-28"
                />
              </div>
            </div>

            <p className="text-xs text-center text-[var(--muted)] mt-4">
              Vielen Dank für deine Unterstützung! 🙏
            </p>
          </div>
        </div>
      )}
    </>
  );
}