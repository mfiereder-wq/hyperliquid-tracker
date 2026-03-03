# Hyperliquid Tracker Anleitung

## 🚀 Fertige Features
✅ Dauerhaft gespeicherte Wallet-Favoriten
✅ Deutlicher Spenden-Button mit Modal für BNB/ETH/MATIC
✅ 🏆 Top-Trader Leaderboard mit 24h/7d/30d Filter
✅ Mobile-optimierte Ansicht für Smartphones
✅ Zurück-Button zur Suche
✅ CSV-Export aller Trades
✅ Dunkel/Helm Modus
✅ Responsive Design für alle Geräte
✅ Echte Live-Daten über offizielle Hyperliquid Public API

## 📊 Echte Live-Daten

Die App nutzt ausschließlich die **offizielle Hyperliquid Public API** über einen sicheren Proxy-Server:

### Funktionsweise:
1. Unser Proxy-Server leitet alle Anfragen an `https://api.hyperliquid.xyz/info` weiter
2. Keine API-Keys erforderlich
3. Nur sichere POST-Anfragen mit JSON-Body
4. Keine sensitiven Daten gespeichert

### Verfügbare Endpunkte:
- `POST /api/hyperliquid` - Allgemeine API-Anfrage an Hyperliquid
- Leaderboard-Daten: `{"type": "leaderboard"}`
- Wallet-Daten: `{"type": "clearinghouseState", "user": "0xWALLET"}`
- Handelshistorie: `{"type": "userFills", "user": "0xWALLET"}`

## 🛠️ Lokale Entwicklung

```bash
# Installiere Abhängigkeiten
npm install

# Starte Entwicklungs-Server
npm run dev

# Baue Produktions-Version
npm run build

# Starte Produktions-Server
npm start
```

## 🚀 Deployment

Die App ist bereits für Vercel konfiguriert. Pushe einfach deine Änderungen an GitHub:

```bash
git add .
git commit -m "Deine Änderungen"
git push
```

Vercel deployed die App automatisch in ~1 Minute.

## 📝 Wichtige Hinweise
- Hyperliquid benötigt **keine API-Keys** für öffentliche Endpunkte
- Alle Anfragen müssen als POST mit `Content-Type: application/json` gesendet werden
- Die App zeigt nur echte Live-Daten von Hyperliquid
- Bei Fehlern wird eine klare Fehlermeldung angezeigt

---

*Entwickelt mit ❤️ von Marco Pagani*