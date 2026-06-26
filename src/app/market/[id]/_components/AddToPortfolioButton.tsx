"use client";

import { Pencil, Plus, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

import type { PortfolioEntry } from "@/types/portfolio";
import { calcWeightedAvgBuyPrice } from "@/lib/utils";
import { usePortfolio } from "@/hooks/usePortfolio";
import Button from "@/components/ui/Button";

type FormMode = "add" | "edit" | "buy";

interface AddToPortfolioButtonProps {
  coinId: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
}

export default function AddToPortfolioButton({
  coinId,
  symbol,
  name,
  image,
  currentPrice,
}: AddToPortfolioButtonProps) {
  const { entries, addEntry, updateEntry, mounted } = usePortfolio();
  const [mode, setMode] = useState<FormMode | null>(null);
  const [amount, setAmount] = useState("");
  const [buyPrice, setBuyPrice] = useState(String(currentPrice));

  const existing = entries.find((e) => e.coinId === coinId);

  useEffect(() => {
    if (!mode) return;
    if (mode === "edit" && existing) {
      setAmount(String(existing.amount));
      setBuyPrice(String(existing.buyPrice));
    } else if (mode === "buy") {
      setAmount("");
      setBuyPrice(String(currentPrice));
    } else {
      setAmount("");
      setBuyPrice(String(currentPrice));
    }
  }, [mode]);

  if (!mounted) return null;

  const handleSave = () => {
    if (!amount || Number(amount) <= 0) return;

    if (mode === "buy" && existing) {
      const addAmount = Number(amount);
      const addPrice = Number(buyPrice) || currentPrice;
      const { newAmount, newAvgPrice } = calcWeightedAvgBuyPrice(existing.amount, existing.buyPrice, addAmount, addPrice);
      updateEntry(coinId, newAmount, newAvgPrice);
    } else if (mode === "edit" && existing) {
      updateEntry(coinId, Number(amount), Number(buyPrice) || currentPrice);
    } else {
      const entry: PortfolioEntry = {
        coinId, symbol, name, image,
        amount: Number(amount),
        buyPrice: Number(buyPrice) || currentPrice,
        addedAt: Date.now(),
      };
      addEntry(entry);
    }
    setMode(null);
  };

  if (!mode) {
    if (!existing) {
      return (
        <Button onClick={() => setMode("add")}>
          <PlusCircle className="h-4 w-4" />
          Add to Portfolio
        </Button>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => setMode("buy")}>
          <Plus className="h-3.5 w-3.5" />
          Buy more
        </Button>
        <Button variant="outline" onClick={() => setMode("edit")}>
          <Pencil className="h-3.5 w-3.5" />
          Edit · {existing.amount.toLocaleString("en-US", { maximumFractionDigits: 6 })}{" "}
          {symbol.toUpperCase()}
        </Button>
      </div>
    );
  }

  const isBuying = mode === "buy";

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-secondary">{isBuying ? "+ add" : "amount"}</span>
        <input
          type="number"
          placeholder={isBuying ? "0" : "Amount"}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="any"
          autoFocus
          className="w-28 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-secondary">{isBuying ? "buy price" : "avg price"}</span>
        <input
          type="number"
          placeholder="Price"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
          min="0"
          step="any"
          className="w-32 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={!amount || Number(amount) <= 0}>
          {isBuying ? "Buy" : existing ? "Update" : "Add"}
        </Button>
        <Button variant="outline" onClick={() => setMode(null)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
