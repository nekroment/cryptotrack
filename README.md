# CryptoTrack

Real-time cryptocurrency market tracker and portfolio manager.

**Live demo:** https://cryptotrack-flax.vercel.app

## Features

- **Market** — live prices for 100+ coins via WebSocket (Binance), sortable table with pagination
- **Coin detail** — price chart, market stats (cap, volume, ATH/ATL), 24h/7d change
- **Portfolio** — track holdings with buy price, P&L calculation, donut allocation chart
  - Add coins, buy more at a new price (weighted average recalculation), edit or remove positions

## Tech stack

| | |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Chart.js + react-chartjs-2 |
| Real-time | Binance WebSocket |
| Data | CoinGecko API (via BFF route handlers) |
| Deploy | Vercel |

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
