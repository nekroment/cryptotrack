"use client";

import { useEffect } from "react";

import ErrorDisplay from "@/components/ui/ErrorDisplay";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MarketErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorDisplay error={error} reset={reset} />;
}
