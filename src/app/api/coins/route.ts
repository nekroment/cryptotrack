import { type NextRequest } from "next/server";
import type { Coin } from "@/types/coin";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = searchParams.get("page") ?? "1";
  const per_page = searchParams.get("per_page") ?? "50";

  const url = new URL(`${COINGECKO_BASE}/coins/markets`);
  url.searchParams.set("vs_currency", "usd");
  url.searchParams.set("order", "market_cap_desc");
  url.searchParams.set("per_page", per_page);
  url.searchParams.set("page", page);
  url.searchParams.set("sparkline", "true");
  url.searchParams.set("price_change_percentage", "24h");

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return Response.json(
      { error: "Failed to fetch from CoinGecko" },
      { status: res.status }
    );
  }

  const coins: Coin[] = await res.json();
  return Response.json(coins);
}
