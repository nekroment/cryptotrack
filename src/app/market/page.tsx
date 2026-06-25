import { getCoins } from "@/lib/coingecko";
import CoinRow from "@/components/market/CoinRow";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Market",
};

export default async function MarketPage() {
  const coins = await getCoins();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-primary">
          Cryptocurrency Market
        </h1>
        <p className="mt-1 text-sm text-secondary">
          Top {coins.length} coins by market cap
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2 text-left text-xs font-medium uppercase tracking-wider text-secondary">
              <th className="px-4 py-3 w-12">#</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">24h %</th>
              <th className="hidden px-4 py-3 text-right md:table-cell">
                Market Cap
              </th>
              <th className="hidden px-4 py-3 text-right lg:table-cell">
                Volume (24h)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {coins.map((coin) => (
              <CoinRow key={coin.id} coin={coin} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
