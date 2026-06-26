import { Suspense } from "react";
import type { Metadata } from "next";

import { getCoins } from "@/lib/coingecko";

import LiveCoinTable from "./_components/LiveCoinTable";
import Pagination from "./_components/Pagination";

const PER_PAGE = 50;

export const metadata: Metadata = {
  title: "Market",
};

export default function MarketPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-primary">
          Cryptocurrency Market
        </h1>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <CoinTable searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function CoinTable({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page ?? 1));
  const coins = await getCoins(currentPage, PER_PAGE);

  return (
    <>
      <p className="mb-4 text-sm text-secondary">
        Showing {(currentPage - 1) * PER_PAGE + 1}–
        {(currentPage - 1) * PER_PAGE + coins.length} by market cap
      </p>

      <LiveCoinTable coins={coins} />

      <Pagination
        currentPage={currentPage}
        hasNextPage={coins.length === PER_PAGE}
      />
    </>
  );
}

function TableSkeleton() {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-2 text-left text-xs font-medium uppercase tracking-wider text-secondary">
            <th className="hidden px-4 py-3 w-12 sm:table-cell">#</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3 text-right">Price</th>
            <th className="hidden px-4 py-3 text-right sm:table-cell">24h %</th>
            <th className="hidden px-4 py-3 text-right md:table-cell">Market Cap</th>
            <th className="hidden px-4 py-3 text-right lg:table-cell">Volume (24h)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {Array.from({ length: 10 }).map((_, i) => (
            <tr key={i} className="bg-surface">
              <td className="hidden px-4 py-3 sm:table-cell"><div className="h-4 w-6 rounded bg-surface-2 animate-pulse" /></td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-full bg-surface-2 animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-4 w-24 rounded bg-surface-2 animate-pulse" />
                    <div className="h-3 w-12 rounded bg-surface-2 animate-pulse" />
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-right"><div className="ml-auto h-4 w-20 rounded bg-surface-2 animate-pulse" /></td>
              <td className="hidden px-4 py-3 text-right sm:table-cell"><div className="ml-auto h-4 w-14 rounded bg-surface-2 animate-pulse" /></td>
              <td className="hidden px-4 py-3 text-right md:table-cell"><div className="ml-auto h-4 w-24 rounded bg-surface-2 animate-pulse" /></td>
              <td className="hidden px-4 py-3 text-right lg:table-cell"><div className="ml-auto h-4 w-20 rounded bg-surface-2 animate-pulse" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
