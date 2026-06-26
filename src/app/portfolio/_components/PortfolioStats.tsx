import { TrendingDown, TrendingUp, Wallet } from "lucide-react";

import { formatLargeNumber, formatPercent, formatPrice } from "@/lib/utils";
import StatCard from "@/components/ui/StatCard";

interface PortfolioStatsProps {
  totalValue: number;
  totalCost: number;
  totalPnL: number;
  count: number;
}

export default function PortfolioStats({
  totalValue,
  totalCost,
  totalPnL,
  count,
}: PortfolioStatsProps) {
  const pnlPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;
  const isPositive = totalPnL >= 0;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard label="Total Value" value={formatLargeNumber(totalValue)} />
      <StatCard label="Total Cost" value={formatLargeNumber(totalCost)} />
      <StatCard
        label="P&L"
        value={(isPositive ? "+" : "") + formatPrice(totalPnL)}
        subValue={formatPercent(pnlPercent)}
        positive={isPositive}
        icon={isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
      />
      <StatCard
        label="Assets"
        value={String(count)}
        icon={<Wallet className="h-4 w-4" />}
      />
    </div>
  );
}
