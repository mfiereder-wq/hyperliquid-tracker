import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hyperliquid Tracker — Wallet Analytics',
  description: 'View trading history, positions, and performance for any Hyperliquid wallet. No login required.',
  keywords: ['Hyperliquid', 'trading', 'crypto', 'analytics', 'wallet', 'DeFi'],
  authors: [{ name: 'Hyperliquid Tracker' }],
  openGraph: {
    title: 'Hyperliquid Tracker — Wallet Analytics',
    description: 'View trading history, positions, and performance for any Hyperliquid wallet.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}