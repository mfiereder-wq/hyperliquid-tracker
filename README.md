# Hyperliquid Wallet Tracker

Eine produktionsreife Webanwendung zum Anzeigen von Trading-Aktivitäten auf Hyperliquid über eine Wallet-Adresse.

## Features

### Kernfunktionen
- **Wallet-Eingabe**: Echtzeit-Validierung der Ethereum-Adresse
- **Trading-History**: Alle Trades mit Zeitstempel, Market, Seite, Preis, Größe, Fee, PnL
- **Offene Positionen**: Entry Price, Size, Leverage, Liquidation Price, Unrealized PnL
- **CSV Export**: Alle Trades als CSV herunterladen

### Performance-Metriken
- Account Value
- Gesamt PnL
- Win Rate (W/L)
- Total Trades
- Total Volumen
- Profit Factor
- Bester/Schlechtester Trade
- Durchschnittlicher Gewinn/Verlust
- Gesamtgebühren

### Charts (TradingView lightweight-charts)
- **Equity Curve**: Kumulativer PnL-Verlauf
- **PnL pro Trade**: Histogram mit Grün/Rot
- **Tägliches Volumen**: Netto-Volumen pro Tag

### Analytik
- **Long vs Short Statistik**: Trades, PnL, Win Rate pro Seite
- **PnL nach Tag**: Balkendiagramm der letzten 14 Tage
- **Wochenübersicht**: Aggregierte Wochenperformance

### UX
- **Dark/Light Mode**: Mit System-Auto-Erkennung
- **Skeleton Loader**: Keine leeren Bildschirme
- **Fehlermeldungen**: In normaler Sprache
- **Mobile First**: Responsive für alle Geräte
- **Sofortige Validierung**: Grün/Rot-Feedback bei Adresseingabe

## Installation

```bash
# In das Projektverzeichnis wechseln
cd hyperliquid-tracker

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die Anwendung ist dann unter `http://localhost:3000` erreichbar.

## Produktions-Build

```bash
# Build erstellen
npm run build

# Produktions-Server starten
npm start
```

## Architektur

```
hyperliquid-tracker/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root Layout mit Theme Provider
│   ├── page.tsx           # Hauptseite
│   └── globals.css        # Tailwind + Custom Styles
├── components/            # React Komponenten
│   ├── Dashboard.tsx      # Haupt-Dashboard
│   ├── WalletInput.tsx    # Adressen-Eingabe mit Validierung
│   ├── StatsCard.tsx      # Statistik-Karten
│   ├── PositionsTable.tsx # Positionen-Tabelle
│   ├── TradesTable.tsx    # Trades-Tabelle mit CSV Export
│   ├── PnLChart.tsx       # Equity Curve Chart
│   ├── VolumeChart.tsx    # Volumen Chart
│   ├── LongShortStats.tsx # Long vs Short Analyse
│   ├── DailyPnL.tsx       # Tägliche PnL Übersicht
│   ├── ThemeProvider.tsx  # Theme Toggle
│   └── LoadingSpinner.tsx # Loading Komponenten
├── lib/api.ts             # Hyperliquid API Client mit Retry-Logik
├── types/index.ts         # TypeScript Types
└── context/ThemeContext.tsx # Theme State
```

### Technologie-Stack

| Technologie | Verwendung |
|-------------|------------|
| Next.js 14 | Framework (App Router) |
| React 18 | UI Komponenten |
| TypeScript | Typsicherheit |
| Tailwind CSS | Styling |
| lightweight-charts | Trading Charts (TradingView) |

### API-Endpunkte

| Endpoint | Beschreibung |
|----------|--------------|
| `userFills` | Trade-History mit PnL |
| `clearinghouseState` | Positionen + Account Value |

### Features im Detail

#### Rate Limiting & Retry
- 100ms zwischen API-Requests
- 3 Retries mit exponentiellem Backoff
- Benutzerfreundliche Fehlermeldungen

#### Datenstruktur
Jeder Trade enthält:
- Zeitstempel
- Market/Pair (z.B. ETH-PERP)
- Seite (Long/Short)
- Größe
- Entry/Exit Preis
- Realized PnL
- Fees
- Status (offen/geschlossen)

#### CSV Export
- Alle Trades exportierbar
- Format: Zeitstempel, Market, Seite, Preis, Größe, Wert, Fee, PnL, TX Hash

## Beispiel-Wallet zum Testen

```
0x2259e3D7F14D85B140B1a7AA7D713a7B7A2a2c5F
```

## Sicherheit

- **Keine Authentifizierung**: View-only Zugriff
- **Keine Datenspeicherung**: Alle Daten sind temporär
- **Client-seitig**: API-Calls direkt vom Browser
- **Read-Only**: Nur Lesezugriff auf öffentliche Daten
- **Wallet-Adresse**: Wird nur im Request verwendet, nie gespeichert

## Lizenz

MIT