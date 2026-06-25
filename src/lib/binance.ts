import { cacheLife } from "next/cache";

import type { ChartData } from "@/types/coin";

const BASE = "https://api.binance.com/api/v3";

const STABLECOIN_SYMBOLS = new Set([
  "USDT", "USDC", "DAI", "BUSD", "TUSD", "FDUSD", "PYUSD", "USDS",
]);

const INTERVAL_MAP: Record<number, { interval: string; limit: number }> = {
  1:   { interval: "1h", limit: 24  },
  7:   { interval: "4h", limit: 42  },
  30:  { interval: "1d", limit: 30  },
  90:  { interval: "1d", limit: 90  },
  365: { interval: "1d", limit: 365 },
};

export async function getBinanceChart(symbol: string, days = 7): Promise<ChartData | null> {
  "use cache";
  cacheLife("hours");

  if (STABLECOIN_SYMBOLS.has(symbol.toUpperCase())) return null;

  const { interval, limit } = INTERVAL_MAP[days] ?? { interval: "1d", limit: days };

  const url = new URL(`${BASE}/klines`);
  url.searchParams.set("symbol", `${symbol.toUpperCase()}USDT`);
  url.searchParams.set("interval", interval);
  url.searchParams.set("limit", String(limit));

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) return null;

  const klines: [number, string, string, string, string, ...unknown[]][] = await res.json();

  const prices: [number, number][] = klines.map(
    ([openTime, , , , close]) => [openTime, Number(close)]
  );

  return { prices };
}
