"use client";

import { useState } from "react";

import DataTable from "@/components/ui/DataTable";
import PortfolioRow from "./PortfolioRow";

export interface EnrichedEntry {
  coinId: string;
  symbol: string;
  name: string;
  image: string;
  amount: number;
  buyPrice: number;
  currentPrice: number;
  value: number;
  pnl: number;
}

interface PortfolioTableProps {
  entries: EnrichedEntry[];
  onRemove: (coinId: string) => void;
  onUpdate: (coinId: string, amount: number, buyPrice: number) => void;
}

export default function PortfolioTable({ entries, onRemove, onUpdate }: PortfolioTableProps) {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  return (
    <DataTable
      head={
        <>
          <th className="px-2 py-3 sm:px-4">Coin</th>
          <th className="px-2 py-3 text-right sm:px-4">Amount</th>
          <th className="hidden px-4 py-3 text-right md:table-cell">Buy Price</th>
          <th className="hidden px-4 py-3 text-right sm:table-cell">Current</th>
          <th className="hidden px-4 py-3 text-right lg:table-cell">Value</th>
          <th className="px-2 py-3 text-right sm:px-4">P&amp;L</th>
          <th className="px-2 py-3 sm:px-4" />
        </>
      }
    >
      {entries.map((entry) => (
        <PortfolioRow
          key={entry.coinId}
          entry={entry}
          isActive={activeRowId === entry.coinId}
          onActivate={() => setActiveRowId(entry.coinId)}
          onDeactivate={() => setActiveRowId(null)}
          onUpdate={onUpdate}
          onRemove={onRemove}
        />
      ))}
    </DataTable>
  );
}
