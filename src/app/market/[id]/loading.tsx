import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CoinDetailSkeleton } from "./_components/CoinDetail";

export default function CoinLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link
        href="/market"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-secondary transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Market
      </Link>

      <CoinDetailSkeleton />
    </div>
  );
}
