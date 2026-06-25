import { type NextRequest } from "next/server";

import { getBinanceChart } from "@/lib/binance";
import { getCoinChart } from "@/lib/coingecko";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const days = Number(request.nextUrl.searchParams.get("days") ?? "7");
  const symbol = request.nextUrl.searchParams.get("symbol");

  try {
    if (symbol) {
      const binanceData = await getBinanceChart(symbol, days);
      if (binanceData) return Response.json(binanceData);
    }

    const data = await getCoinChart(id, days);
    return Response.json(data);
  } catch {
    return Response.json({ error: "Failed to fetch chart data" }, { status: 500 });
  }
}
