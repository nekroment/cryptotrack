"use client";

import { useEffect, useState } from "react";

import { useLivePrices } from "@/hooks/useLivePrices";
import type { Coin } from "@/types/coin";

import CoinRow from "./CoinRow";

interface LiveCoinTableProps {
  coins: Coin[];
}

export default function LiveCoinTable({ coins }: LiveCoinTableProps) {
  const [mounted, setMounted] = useState(false);
  const prices = useLivePrices(coins);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border bg-surface-2 text-left text-xs font-medium uppercase tracking-wider text-secondary">
          <th className="hidden w-12 px-4 py-3 sm:table-cell">#</th>
          <th className="px-4 py-3">Name</th>
          <th className="px-4 py-3 text-right">Price</th>
          <th className="hidden px-4 py-3 text-right sm:table-cell">24h %</th>
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
          <CoinRow
            key={coin.id}
            coin={coin}
            livePrice={mounted ? prices[coin.id] : undefined}
          />
        ))}
      </tbody>
    </table>
  );
}
