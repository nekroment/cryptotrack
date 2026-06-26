"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useMemo } from "react";

import type { EnrichedEntry } from "./PortfolioTable";

ChartJS.register(ArcElement, Tooltip, Legend);

const hslColor = (i: number) => `hsl(${(i * 137.5) % 360}, 65%, 55%)`;

interface PortfolioDonutProps {
  entries: EnrichedEntry[];
}

export default function PortfolioDonut({ entries }: PortfolioDonutProps) {
  const totalValue = entries.reduce((sum, e) => sum + e.value, 0);

  const data = useMemo(
    () => ({
      labels: entries.map((e) => e.name),
      datasets: [
        {
          data: entries.map((e) => e.value),
          backgroundColor: entries.map((_, i) => hslColor(i)),
          borderColor: "transparent",
          hoverOffset: 6,
        },
      ],
    }),
    [entries]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      cutout: "65%",
      layout: { padding: 8 },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: { parsed: number; label: string }) => {
              const pct = totalValue > 0 ? ((ctx.parsed / totalValue) * 100).toFixed(1) : "0";
              return ` ${ctx.label}: ${pct}%`;
            },
          },
        },
      },
    }),
    [totalValue]
  );

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="mb-4 text-xs font-medium uppercase tracking-wider text-secondary">
        Allocation
      </p>
      <div className="mx-auto w-full max-w-[12rem] overflow-visible">
        <Doughnut data={data} options={options} />
      </div>
      <ul className="mt-4 space-y-1.5">
        {entries.map((entry, i) => {
          const pct = totalValue > 0 ? ((entry.value / totalValue) * 100).toFixed(1) : "0";
          return (
            <li key={entry.coinId} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: hslColor(i) }}
                />
                <span className="text-secondary">{entry.name}</span>
              </div>
              <span className="font-medium text-primary">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
