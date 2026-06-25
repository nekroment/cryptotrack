"use client";

import { memo, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { cn, formatLargeNumber, formatPercent, formatPrice } from "@/lib/utils";
import type { Coin } from "@/types/coin";

interface CoinRowProps {
  coin: Coin;
  livePrice?: number;
}

function CoinRow({ coin, livePrice }: CoinRowProps) {
  const [flash, setFlash] = useState<{ direction: "up" | "down"; count: number } | null>(null);
  const prevPriceRef = useRef(coin.current_price);
  const currentPrice = livePrice ?? coin.current_price;
  const isPositive = coin.price_change_percentage_24h >= 0;

  useEffect(() => {
    if (livePrice == null || livePrice === prevPriceRef.current) return;
    const direction = livePrice > prevPriceRef.current ? "up" : "down";
    prevPriceRef.current = livePrice;
    setFlash((prev) => ({ direction, count: (prev?.count ?? 0) + 1 }));
    const timer = setTimeout(() => setFlash(null), 800);
    return () => clearTimeout(timer);
  }, [livePrice]);

  return (
    <tr className="bg-surface transition-colors hover:bg-surface-2">
      <td className="hidden px-4 py-3 text-secondary sm:table-cell">
        {coin.market_cap_rank}
      </td>
      <td className="px-4 py-3">
        <Link href={`/market/${coin.id}`} className="flex items-center gap-3">
          <Image
            src={coin.image}
            alt={coin.name}
            width={28}
            height={28}
            className="rounded-full"
          />
          <div>
            <p className="font-medium text-primary transition-colors hover:text-accent">{coin.name}</p>
            <p className="text-xs uppercase text-secondary">{coin.symbol}</p>
          </div>
        </Link>
      </td>
      <td className="px-4 py-3 text-right">
        <span
          key={flash ? `${flash.direction}-${flash.count}` : "price"}
          className={cn(
            "inline-block rounded px-1 py-0.5 font-medium text-primary",
            flash?.direction === "up" && "flash-up",
            flash?.direction === "down" && "flash-down",
          )}
        >
          {formatPrice(currentPrice)}
        </span>
        <p className={cn("text-xs sm:hidden", isPositive ? "text-up" : "text-down")}>
          {formatPercent(coin.price_change_percentage_24h)}
        </p>
      </td>
      <td className="hidden px-4 py-3 text-right sm:table-cell">
        <span className={cn("font-medium", isPositive ? "text-up" : "text-down")}>
          {formatPercent(coin.price_change_percentage_24h)}
        </span>
      </td>
      <td className="hidden px-4 py-3 text-right text-primary md:table-cell">
        {formatLargeNumber(coin.market_cap)}
      </td>
      <td className="hidden px-4 py-3 text-right text-secondary lg:table-cell">
        {formatLargeNumber(coin.total_volume)}
      </td>
    </tr>
  );
}

export default memo(CoinRow);
