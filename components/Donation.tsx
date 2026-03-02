'use client';

import { useState } from 'react';

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

  return (
    <>
      {/* Coffee Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl text-sm font-medium"
      >
        <span className="text-lg">☕</span>
        Entwicklung unterstützen
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in" onClick={() => setIsOpen(false)}>
          <div 
            className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">☕ Entwicklung unterstützen</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-[var(--border)] rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-[var(--muted)] mb-6">
              Diese App wird mit ❤️ von <span className="text-[var(--text)] font-medium">Marco Pagani</span> entwickelt. 
              Unterstütze die Weiterentwicklung mit einer kleinen Spende!
            </p>

            {/* Crypto Networks */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-sm font-bold">
                  B
                </div>
                <div>
                  <div className="font-medium">BNB (BSC)</div>
                  <div className="text-xs text-[var(--muted)]">Binance Smart Chain</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
                  E
                </div>
                <div>
                  <div className="font-medium">ETH (Ethereum)</div>
                  <div className="text-xs text-[var(--muted)]">Ethereum Mainnet</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-sm font-bold">
                  P
                </div>
                <div>
                  <div className="font-medium">MATIC (Polygon)</div>
                  <div className="text-xs text-[var(--muted)]">Polygon Network</div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Multichain Adresse</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={DONATION_ADDRESS}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm font-mono bg-[var(--bg)] border border-[var(--border)] rounded-lg"
                />
                <button
                  onClick={copyAddress}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    copied 
                      ? 'bg-green-500 text-white' 
                      : 'bg-[var(--accent)] text-white hover:opacity-90'
                  }`}
                >
                  {copied ? '✓ Kopiert!' : 'Kopieren'}
                </button>
              </div>
            </div>

            {/* QR Code placeholder */}
            <div className="text-center p-4 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
              <div className="text-xs text-[var(--muted)] mb-2">QR-Code scannen</div>
              <div className="inline-block p-2 bg-white rounded-lg">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${DONATION_ADDRESS}`}
                  alt="Donation QR Code"
                  className="w-30 h-30"
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