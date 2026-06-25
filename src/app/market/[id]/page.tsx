import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";

import { ArrowLeft } from "lucide-react";

import { getCoinDetail } from "@/lib/coingecko";

import CoinDetail, { CoinDetailSkeleton } from "./_components/CoinDetail";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const coin = await getCoinDetail(id);
  if (!coin) return { title: "Coin not found" };
  return { title: coin.name };
}

export default function CoinPage({ params }: Props) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link
        href="/market"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-secondary transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Market
      </Link>

      <Suspense fallback={<CoinDetailSkeleton />}>
        {params.then(({ id }: { id: string }) => (
          <CoinDetail id={id} />
        ))}
      </Suspense>
    </div>
  );
}
