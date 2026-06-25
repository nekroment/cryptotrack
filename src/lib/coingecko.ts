import { cacheLife } from "next/cache";
import type { Coin, CoinDetail } from "@/types/coin";

const BASE = "https://api.coingecko.com/api/v3";

export async function getCoins(page = 1, perPage = 50): Promise<Coin[]> {
  "use cache";
  cacheLife("minutes");

  const url = new URL(`${BASE}/coins/markets`);
  url.searchParams.set("vs_currency", "usd");
  url.searchParams.set("order", "market_cap_desc");
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("page", String(page));
  url.searchParams.set("sparkline", "true");
  url.searchParams.set("price_change_percentage", "24h");

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);
  return res.json();
}

export async function getCoinDetail(id: string): Promise<CoinDetail | null> {
  "use cache";
  cacheLife("minutes");

  const url = new URL(`${BASE}/coins/${id}`);
  url.searchParams.set("localization", "false");
  url.searchParams.set("tickers", "false");
  url.searchParams.set("community_data", "false");
  url.searchParams.set("developer_data", "false");
  url.searchParams.set("sparkline", "true");

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);
  return res.json();
}
