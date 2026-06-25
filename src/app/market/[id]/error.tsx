"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, ArrowLeft, Clock } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CoinErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isRateLimited = error.message === "RATE_LIMITED";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link
        href="/market"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-secondary transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Market
      </Link>

      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 rounded-full bg-surface-2 p-4">
          {isRateLimited ? (
            <Clock className="h-8 w-8 text-secondary" />
          ) : (
            <AlertTriangle className="h-8 w-8 text-down" />
          )}
        </div>

        <h1 className="mb-2 text-xl font-semibold text-primary">
          {isRateLimited ? "Too many requests" : "Something went wrong"}
        </h1>

        <p className="mb-6 max-w-sm text-sm text-secondary">
          {isRateLimited
            ? "CoinGecko API rate limit reached. Wait a moment and try again."
            : "Failed to load coin data. Please try again."}
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            className="rounded-lg border border-border px-4 py-2 text-sm text-primary transition-colors hover:bg-surface-2"
          >
            Try again
          </button>
          <Link
            href="/market"
            className="rounded-lg bg-accent/10 px-4 py-2 text-sm text-accent transition-colors hover:bg-accent/20"
          >
            Go to Market
          </Link>
        </div>
      </div>
    </div>
  );
}
