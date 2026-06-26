"use client";

import { useMemo, useState } from "react";
import { PlusCircle } from "lucide-react";

import Button from "@/components/ui/Button";

import { usePortfolio } from "@/hooks/usePortfolio";
import { useLivePrices } from "@/hooks/useLivePrices";
import PortfolioStats from "./PortfolioStats";
import PortfolioTable from "./PortfolioTable";
import PortfolioDonut from "./PortfolioDonut";
import AddCoinModal from "./AddCoinModal";

export default function PortfolioView() {
  const { entries, addEntry, removeEntry, updateEntry, mounted } = usePortfolio();
  const [showModal, setShowModal] = useState(false);

  const coinRefs = useMemo(
    () => entries.map((e) => ({ id: e.coinId, symbol: e.symbol })),
    [entries]
  );
  const prices = useLivePrices(coinRefs);

  const enrichedEntries = useMemo(
    () =>
      entries.map((entry) => {
        const currentPrice = prices[entry.coinId] ?? entry.buyPrice;
        return {
          ...entry,
          currentPrice,
          value: entry.amount * currentPrice,
          pnl: entry.amount * (currentPrice - entry.buyPrice),
        };
      }),
    [entries, prices]
  );

  const totalValue = enrichedEntries.reduce((sum, e) => sum + e.value, 0);
  const totalCost = entries.reduce((sum, e) => sum + e.amount * e.buyPrice, 0);
  const totalPnL = totalValue - totalCost;

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-9 w-48 rounded bg-surface-2 animate-pulse" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-surface-2 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 rounded-full bg-surface-2 p-6">
            <PlusCircle className="h-10 w-10 text-secondary" />
          </div>
          <h2 className="text-xl font-semibold text-primary">Your portfolio is empty</h2>
          <p className="mt-2 text-sm text-secondary">
            Add your first coin to start tracking your investments
          </p>
          <Button onClick={() => setShowModal(true)}>
            Add Coin
          </Button>
        </div>

        {showModal && (
          <AddCoinModal
            entries={entries}
            onAdd={addEntry}
            onUpdate={(coinId, amount, buyPrice) => updateEntry(coinId, amount, buyPrice)}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-primary">My Portfolio</h1>
        <Button onClick={() => setShowModal(true)}>
          <PlusCircle className="h-4 w-4" />
          Add Coin
        </Button>
      </div>

      <div className="space-y-6">
        <PortfolioStats
          totalValue={totalValue}
          totalCost={totalCost}
          totalPnL={totalPnL}
          count={entries.length}
        />

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <PortfolioTable entries={enrichedEntries} onRemove={removeEntry} onUpdate={updateEntry} />
          </div>
          <div>
            <PortfolioDonut entries={enrichedEntries} />
          </div>
        </div>
      </div>

      {showModal && (
        <AddCoinModal
          entries={entries}
          onAdd={addEntry}
          onUpdate={(coinId, amount, buyPrice) => updateEntry(coinId, amount, buyPrice)}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
