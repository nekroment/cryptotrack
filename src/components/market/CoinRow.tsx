import Image from "next/image";
import { cn, formatPrice, formatLargeNumber, formatPercent } from "@/lib/utils";
import type { Coin } from "@/types/coin";

interface CoinRowProps {
  coin: Coin;
}

export default function CoinRow({ coin }: CoinRowProps) {
  const isPositive = coin.price_change_percentage_24h >= 0;

  return (
    <tr className="bg-surface transition-colors hover:bg-surface-2">
      <td className="px-4 py-3 text-secondary">{coin.market_cap_rank}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Image
            src={coin.image}
            alt={coin.name}
            width={28}
            height={28}
            className="rounded-full"
          />
          <div>
            <p className="font-medium text-primary">{coin.name}</p>
            <p className="text-xs uppercase text-secondary">{coin.symbol}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-right font-medium text-primary">
        {formatPrice(coin.current_price)}
      </td>
      <td className="px-4 py-3 text-right">
        <span
          className={cn("font-medium", isPositive ? "text-up" : "text-down")}
        >
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
