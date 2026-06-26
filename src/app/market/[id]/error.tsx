"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

import ErrorDisplay from "@/components/ui/ErrorDisplay";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CoinErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link
        href="/market"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-secondary transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Market
      </Link>

      <ErrorDisplay
        error={error}
        reset={reset}
        actions={
          <Link
            href="/market"
            className="rounded-lg bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
          >
            Go to Market
          </Link>
        }
      />
    </div>
  );
}
