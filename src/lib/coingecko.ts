import { cacheLife } from "next/cache";
import type { Coin } from "@/types/coin";

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
