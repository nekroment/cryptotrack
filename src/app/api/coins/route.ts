import { type NextRequest } from "next/server";
import { getCoins } from "@/lib/coingecko";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Number(searchParams.get("page") ?? "1");
  const perPage = Number(searchParams.get("per_page") ?? "50");

  try {
    const coins = await getCoins(page, perPage);
    return Response.json(coins);
  } catch {
    return Response.json(
      { error: "Failed to fetch coins" },
      { status: 500 }
    );
  }
}
