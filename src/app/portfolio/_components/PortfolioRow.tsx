"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";

import { calcWeightedAvgBuyPrice, cn, formatPercent, formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import type { EnrichedEntry } from "./PortfolioTable";

type ActionMode = "edit" | "buy";

interface PortfolioRowProps {
  entry: EnrichedEntry;
  isActive: boolean;
  onActivate: (mode: ActionMode) => void;
  onDeactivate: () => void;
  onUpdate: (coinId: string, amount: number, buyPrice: number) => void;
  onRemove: (coinId: string) => void;
}

export default function PortfolioRow({
  entry,
  isActive,
  onActivate,
  onDeactivate,
  onUpdate,
  onRemove,
}: PortfolioRowProps) {
  const [mode, setMode] = useState<ActionMode>("edit");
  const [amount, setAmount] = useState("");
  const [buyPrice, setBuyPrice] = useState("");

  useEffect(() => {
    if (!isActive) return;
    if (mode === "edit") {
      setAmount(String(entry.amount));
      setBuyPrice(String(entry.buyPrice));
    } else {
      setAmount("");
      setBuyPrice(String(entry.currentPrice));
    }
  }, [isActive, mode, entry.amount, entry.buyPrice, entry.currentPrice]);

  const startEdit = () => {
    setMode("edit");
    onActivate("edit");
  };

  const startBuy = () => {
    setMode("buy");
    onActivate("buy");
  };

  const save = () => {
    if (!amount || Number(amount) <= 0) return;
    if (mode === "edit") {
      onUpdate(entry.coinId, Number(amount), Number(buyPrice) || entry.buyPrice);
    } else {
      const addAmount = Number(amount);
      const addPrice = Number(buyPrice) || entry.currentPrice;
      const { newAmount, newAvgPrice } = calcWeightedAvgBuyPrice(entry.amount, entry.buyPrice, addAmount, addPrice);
      onUpdate(entry.coinId, newAmount, newAvgPrice);
    }
    onDeactivate();
  };

  const isBuying = isActive && mode === "buy";
  const isPositive = entry.pnl >= 0;
  const pnlPercent =
    entry.buyPrice > 0
      ? ((entry.currentPrice - entry.buyPrice) / entry.buyPrice) * 100
      : 0;

  return (
    <tr className="bg-surface transition-colors hover:bg-surface-2">
      <td className="px-2 py-3 sm:px-4">
        <Link href={`/market/${entry.coinId}`} className="flex items-center gap-2">
          <Image
            src={entry.image}
            alt={entry.name}
            width={24}
            height={24}
            className="rounded-full"
          />
          <div>
            <p className="font-medium text-primary">{entry.name}</p>
            <p className="text-xs uppercase text-secondary">{entry.symbol}</p>
          </div>
        </Link>
      </td>

      <td className="px-2 py-3 text-right sm:px-4">
        {isActive ? (
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="any"
            autoFocus
            placeholder={isBuying ? "0" : String(entry.amount)}
            className="w-24 rounded border border-accent bg-surface-2 px-2 py-1 text-right text-sm text-primary focus:outline-none"
          /> 
        ) : (
          <span className="text-primary">
            {entry.amount.toLocaleString("en-US", { maximumFractionDigits: 8 })}
          </span>
        )}
      </td>

      <td className="hidden px-4 py-3 text-right md:table-cell">
        {isActive ? (
          <input
            type="number"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            min="0"
            step="any"
            className="w-28 rounded border border-accent bg-surface-2 px-2 py-1 text-right text-sm text-primary focus:outline-none"
          />
        ) : (
          <span className="text-secondary">{formatPrice(entry.buyPrice)}</span>
        )}
      </td>

      <td className="hidden px-4 py-3 text-right font-medium text-primary sm:table-cell">
        {formatPrice(entry.currentPrice)}
      </td>
      <td className="hidden px-4 py-3 text-right text-primary lg:table-cell">
        {formatPrice(entry.value)}
      </td>

      <td className="px-2 py-3 text-right sm:px-4">
        <p className={cn("font-medium", isPositive ? "text-up" : "text-down")}>
          {isPositive ? "+" : ""}
          {formatPrice(entry.pnl)}
        </p>
        <p className={cn("text-xs", isPositive ? "text-up" : "text-down")}>
          {formatPercent(pnlPercent)}
        </p>
      </td>

      <td className="px-2 py-3 sm:px-4">
        <div className="flex items-center justify-end gap-1">
          {isActive ? (
            <>
              <Button size="sm" onClick={save} aria-label="Save">
                <Check className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="outline" onClick={onDeactivate} aria-label="Cancel">
                <X className="h-3.5 w-3.5" />
              </Button>
            </>
          ) : (
            <>
              <button
                onClick={startBuy}
                className="hidden cursor-pointer rounded p-1 text-secondary transition-colors hover:bg-surface-2 hover:text-accent sm:block"
                aria-label={`Buy more ${entry.name}`}
                title="Buy more"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                onClick={startEdit}
                className="cursor-pointer rounded p-1 text-secondary transition-colors hover:bg-surface-2 hover:text-primary"
                aria-label={`Edit ${entry.name}`}
                title="Edit position"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onRemove(entry.coinId)}
                className="cursor-pointer rounded p-1 text-secondary transition-colors hover:bg-surface-2 hover:text-down"
                aria-label={`Remove ${entry.name}`}
                title="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
