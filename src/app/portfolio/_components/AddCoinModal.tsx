"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Search, X } from "lucide-react";

import type { Coin } from "@/types/coin";
import type { PortfolioEntry } from "@/types/portfolio";
import Button from "@/components/ui/Button";
import { calcWeightedAvgBuyPrice } from "@/lib/utils";

interface AddCoinModalProps {
  entries: PortfolioEntry[];
  onAdd: (entry: PortfolioEntry) => void;
  onUpdate: (coinId: string, amount: number, buyPrice: number) => void;
  onClose: () => void;
}

export default function AddCoinModal({ entries, onAdd, onUpdate, onClose }: AddCoinModalProps) {
  const existingMap = new Map(entries.map((e) => [e.coinId, e]));
  const [coins, setCoins] = useState<Coin[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Coin | null>(null);
  const [formMode, setFormMode] = useState<"buy" | "edit">("buy");
  const [amount, setAmount] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    fetch("/api/coins?per_page=100")
      .then((r) => r.json())
      .then((data: Coin[]) => setCoins(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    const ex = existingMap.get(selected.id);
    if (ex) {
      setFormMode("buy");
      setAmount("");
      setBuyPrice(String(selected.current_price));
    } else {
      setAmount("");
      setBuyPrice(String(selected.current_price));
    }
  }, [selected]);

  const handleModeChange = (m: "buy" | "edit") => {
    if (!selected) return;
    const ex = existingMap.get(selected.id);
    if (!ex) return;
    setFormMode(m);
    if (m === "buy") {
      setAmount("");
      setBuyPrice(String(selected.current_price));
    } else {
      setAmount(String(ex.amount));
      setBuyPrice(String(ex.buyPrice));
    }
  };

  const filtered = coins.filter((c) => {
    const q = query.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q);
  });

  const handleSave = () => {
    if (!selected || !amount || Number(amount) <= 0) return;
    const existing = existingMap.get(selected.id);
    if (existing && formMode === "buy") {
      const addAmount = Number(amount);
      const addPrice = Number(buyPrice) || selected.current_price;
      const { newAmount, newAvgPrice } = calcWeightedAvgBuyPrice(existing.amount, existing.buyPrice, addAmount, addPrice);
      onUpdate(selected.id, newAmount, newAvgPrice);
    } else if (existing && formMode === "edit") {
      onUpdate(selected.id, Number(amount), Number(buyPrice) || selected.current_price);
    } else {
      onAdd({
        coinId: selected.id,
        symbol: selected.symbol,
        name: selected.name,
        image: selected.image,
        amount: Number(amount),
        buyPrice: Number(buyPrice) || selected.current_price,
        addedAt: Date.now(),
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-primary">Add Coin</h2>
          <button onClick={onClose} className="rounded p-1 text-secondary hover:text-primary">
            <X className="h-5 w-5 cursor-pointer" />
          </button>
        </div>

        {!selected ? (
          <div className="p-4">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search coin..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface-2 py-2 pl-9 pr-4 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            {loading ? (
              <p className="py-8 text-center text-sm text-secondary">Loading...</p>
            ) : (
              <ul className="max-h-72 overflow-y-auto">
                {filtered.slice(0, 30).map((coin) => (
                  <li key={coin.id}>
                    <button
                      onClick={() => setSelected(coin)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-surface-2 cursor-pointer"
                    >
                      <Image src={coin.image} alt={coin.name} width={24} height={24} className="rounded-full" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-primary truncate">{coin.name}</p>
                        <p className="text-xs uppercase text-secondary">{coin.symbol}</p>
                      </div>
                      {existingMap.has(coin.id) && (
                        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs text-accent">
                          owned
                        </span>
                      )}
                      <p className="text-sm text-secondary">
                        ${coin.current_price.toLocaleString("en-US")}
                      </p>
                    </button>
                  </li>
                ))}
                {filtered.length === 0 && !loading && (
                  <p className="py-6 text-center text-sm text-secondary">No coins found</p>
                )}
              </ul>
            )}
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Image src={selected.image} alt={selected.name} width={36} height={36} className="rounded-full" />
              <div>
                <p className="font-semibold text-primary">{selected.name}</p>
                <p className="text-xs uppercase text-secondary">{selected.symbol}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="ml-auto text-xs text-secondary hover:text-primary cursor-pointer"
              >
                Change
              </button>
            </div>

            {existingMap.has(selected.id) && (
              <div className="flex rounded-lg border border-border p-0.5">
                {(["buy", "edit"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => handleModeChange(m)}
                    className={`flex-1 cursor-pointer rounded-md py-1.5 text-xs font-medium transition-colors ${
                      formMode === m
                        ? "bg-accent text-white"
                        : "text-secondary hover:text-primary"
                    }`}
                  >
                    {m === "buy" ? "Buy more" : "Edit position"}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-secondary">
                  {existingMap.has(selected.id) && formMode === "buy" ? "Amount to add" : "Amount"}
                </label>
                <input
                  type="number"
                  placeholder="e.g. 0.5"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="any"
                  autoFocus
                  className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-secondary">
                  {existingMap.has(selected.id) && formMode === "buy"
                    ? "Buy Price (USD)"
                    : "Avg Buy Price (USD)"}{" "}
                  <span className="text-secondary/60">— defaults to current price</span>
                </label>
                <input
                  type="number"
                  placeholder={String(selected.current_price)}
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  min="0"
                  step="any"
                  className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={!amount || Number(amount) <= 0}
              className="w-full justify-center py-2.5"
            >
              {existingMap.has(selected.id)
                ? formMode === "buy" ? "Buy" : "Update Position"
                : "Add to Portfolio"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
