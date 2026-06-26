import Image from "next/image";
import { notFound } from "next/navigation";

import { TrendingDown, TrendingUp } from "lucide-react";

import { formatLargeNumber, formatPercent, formatPrice } from "@/lib/utils";
import { getCoinDetail, getCoinChart } from "@/lib/coingecko";
import { getBinanceChart } from "@/lib/binance";
import StatCard from "@/components/ui/StatCard";

import AddToPortfolioButton from "./AddToPortfolioButton";
import PriceChart from "./PriceChart";
import LivePrice from "./LivePrice";

export default async function CoinDetail({ id }: { id: string }) {
  const coin = await getCoinDetail(id);
  if (!coin) notFound();

  const initialChart =
    (await getBinanceChart(coin.symbol, 7).catch(() => null)) ??
    (await getCoinChart(id, 7).catch(() => null));

  const change24h = coin.market_data.price_change_percentage_24h ?? 0;
  const change7d = coin.market_data.price_change_percentage_7d ?? 0;
  const is24hPositive = change24h >= 0;
  const is7dPositive = change7d >= 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Image
            src={coin.image.large}
            alt={coin.name}
            width={56}
            height={56}
            className="rounded-full"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-primary">{coin.name}</h1>
              <span className="rounded-md bg-surface-2 px-2 py-0.5 text-sm uppercase text-secondary">
                {coin.symbol}
              </span>
              <span className="text-sm text-secondary">
                #{coin.market_cap_rank}
              </span>
            </div>
            <LivePrice key={coin.id} coinId={coin.id} coinSymbol={coin.symbol} initialPrice={coin.market_data.current_price.usd} />
          </div>
        </div>
        <AddToPortfolioButton
          coinId={coin.id}
          symbol={coin.symbol}
          name={coin.name}
          image={coin.image.large}
          currentPrice={coin.market_data.current_price.usd}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="24h Change"
          value={formatPercent(change24h)}
          positive={is24hPositive}
          icon={
            is24hPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )
          }
        />
        <StatCard
          label="7d Change"
          value={formatPercent(change7d)}
          positive={is7dPositive}
          icon={
            is7dPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )
          }
        />
        <StatCard
          label="Market Cap"
          value={formatLargeNumber(coin.market_data.market_cap.usd)}
        />
        <StatCard
          label="Volume (24h)"
          value={formatLargeNumber(coin.market_data.total_volume.usd)}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="All Time High"
          value={formatPrice(coin.market_data.ath.usd)}
        />
        <StatCard
          label="All Time Low"
          value={formatPrice(coin.market_data.atl.usd)}
        />
        <StatCard
          label="Circulating Supply"
          value={`${coin.circulating_supply?.toLocaleString("en-US") ?? "—"} ${coin.symbol.toUpperCase()}`}
        />
      </div>

      <PriceChart coinId={coin.id} coinSymbol={coin.symbol} isPositive={is24hPositive} initialData={initialChart} />

      {coin.description.en && (
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-secondary">
            About {coin.name}
          </h2>
          <p
            className="text-sm leading-relaxed text-secondary line-clamp-4"
            dangerouslySetInnerHTML={{
              __html: coin.description.en,
            }}
          />
        </div>
      )}
    </div>
  );
}

export function CoinDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-full bg-surface-2 animate-pulse" />
        <div className="space-y-2">
          <div className="h-8 w-48 rounded bg-surface-2 animate-pulse" />
          <div className="h-8 w-32 rounded bg-surface-2 animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface p-4">
            <div className="h-3 w-16 rounded bg-surface-2 animate-pulse" />
            <div className="mt-2 h-6 w-24 rounded bg-surface-2 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
