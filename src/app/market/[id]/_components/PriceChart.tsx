"use client";

import { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";

import { cn } from "@/lib/utils";
import type { ChartData } from "@/types/coin";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const TABS = [
  { label: "1D", days: 1 },
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1Y", days: 365 },
];

interface PriceChartProps {
  coinId: string;
  isPositive: boolean;
  initialData: ChartData | null;
}

export default function PriceChart({ coinId, isPositive, initialData }: PriceChartProps) {
  const [days, setDays] = useState(7);
  const [chartData, setChartData] = useState<ChartData | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialData ? null : "Failed to load chart.");

  useEffect(() => {
    if (days === 7 && initialData) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/chart/${coinId}?days=${days}`)
      .then(async (r) => {
        const data = await r.json();
        if (cancelled) return;
        if (!r.ok || !Array.isArray(data.prices)) {
          setError(r.status === 429 ? "Rate limit reached. Wait a moment and try again." : "Failed to load chart.");
          setChartData(null);
        } else {
          setChartData(data);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load chart.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [coinId, days, initialData]);

  const color = isPositive ? "#22c55e" : "#ef4444";

  const data = useMemo(() => {
    const labels =
      chartData?.prices.map(([ts]) => {
        const date = new Date(ts);
        return days === 1
          ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
          : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }) ?? [];

    const prices = chartData?.prices.map(([, price]) => price) ?? [];

    return {
      labels,
      datasets: [
        {
          data: prices,
          borderColor: color,
          backgroundColor: `${color}18`,
          borderWidth: 2,
          pointRadius: 0,
          fill: true,
          tension: 0.3,
        },
      ],
    };
  }, [chartData, days, color]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: "index" as const },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: { parsed: { y: number | null } }) =>
            ctx.parsed.y == null
              ? ""
              : `$${ctx.parsed.y.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#6b7280",
          maxTicksLimit: 6,
          maxRotation: 0,
        },
        border: { display: false },
      },
      y: {
        position: "right" as const,
        grid: { color: "#ffffff0d" },
        ticks: {
          color: "#6b7280",
          callback: (v: number | string) =>
            `$${Number(v).toLocaleString("en-US", { notation: "compact" })}`,
        },
        border: { display: false },
      },
    },
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium uppercase tracking-wider text-secondary">
          Price Chart
        </h2>
        <div className="flex items-center gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.days}
              onClick={() => setDays(tab.days)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                days === tab.days
                  ? "bg-accent/10 text-accent"
                  : "text-secondary hover:bg-surface-2 hover:text-primary"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-secondary">{error}</p>
          </div>
        ) : (
          <Line data={data} options={options} />
        )}
      </div>
    </div>
  );
}
