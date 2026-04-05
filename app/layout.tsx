import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hyperliquid Tracker | Advanced Wallet Analytics",
  description:
    "Real-time trading analytics for Hyperliquid. Track positions, P&L, volume, and trading history with beautiful visualizations.",
  keywords: [
    "Hyperliquid",
    "trading",
    "crypto",
    "analytics",
    "wallet",
    "DeFi",
    "perpetuals",
  ],
  authors: [{ name: "Hyperliquid Tracker" }],
  openGraph: {
    title: "Hyperliquid Tracker | Advanced Wallet Analytics",
    description:
      "Real-time trading analytics for Hyperliquid perpetual exchange.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hyperliquid Tracker",
    description: "Real-time wallet analytics for Hyperliquid traders",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} ${inter.variable} font-sans antialiased`}
      >
        <div className="bg-grid" />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
