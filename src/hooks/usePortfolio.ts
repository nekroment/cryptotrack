"use client";

import { useCallback, useEffect, useState } from "react";

import type { PortfolioEntry } from "@/types/portfolio";

const STORAGE_KEY = "cryptotrack:portfolio";

function save(next: PortfolioEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
}

export function usePortfolio() {
  const [entries, setEntries] = useState<PortfolioEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setEntries(JSON.parse(stored) as PortfolioEntry[]);
    } catch {}
  }, []);

  const addEntry = useCallback((entry: PortfolioEntry) => {
    setEntries((prev) => {
      const next = [...prev, entry];
      save(next);
      return next;
    });
  }, []);

  const removeEntry = useCallback((coinId: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.coinId !== coinId);
      save(next);
      return next;
    });
  }, []);

  const updateEntry = useCallback((coinId: string, amount: number, buyPrice: number) => {
    setEntries((prev) => {
      const next = prev.map((e) => (e.coinId === coinId ? { ...e, amount, buyPrice } : e));
      save(next);
      return next;
    });
  }, []);

  const hasEntry = useCallback(
    (coinId: string) => entries.some((e) => e.coinId === coinId),
    [entries]
  );

  return { entries, addEntry, removeEntry, updateEntry, hasEntry, mounted };
}
