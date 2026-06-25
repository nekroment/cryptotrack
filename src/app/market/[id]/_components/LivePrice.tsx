"use client";

import { useEffect, useRef, useState } from "react";

import { useLivePrices } from "@/hooks/useLivePrices";
import { cn, formatPrice } from "@/lib/utils";

interface LivePriceProps {
  coinId: string;
  coinSymbol: string;
  initialPrice: number;
}

export default function LivePrice({ coinId, coinSymbol, initialPrice }: LivePriceProps) {
  const prices = useLivePrices([{ id: coinId, symbol: coinSymbol }]);
  const livePrice = prices[coinId] ?? initialPrice;

  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const prevPriceRef = useRef(initialPrice);

  useEffect(() => {
    const price = prices[coinId];
    if (price == null || price === prevPriceRef.current) return;

    setFlash(price > prevPriceRef.current ? "up" : "down");
    prevPriceRef.current = price;

    const timer = setTimeout(() => setFlash(null), 800);
    return () => clearTimeout(timer);
  }, [prices, coinId]);

  return (
    <p
      className={cn(
        "mt-1 text-3xl font-semibold transition-colors duration-300",
        flash === "up" && "text-up",
        flash === "down" && "text-down",
        flash === null && "text-primary",
      )}
    >
      {formatPrice(livePrice)}
    </p>
  );
}
