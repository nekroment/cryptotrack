import { AlertTriangle, Clock, RefreshCw } from "lucide-react";

interface ErrorDisplayProps {
  error: Error & { digest?: string };
  reset: () => void;
  actions?: React.ReactNode;
}

export default function ErrorDisplay({ error, reset, actions }: ErrorDisplayProps) {
  const isRateLimited = error.message === "RATE_LIMITED";

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
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
          : "Failed to load data. Please try again."}
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
        {actions}
      </div>
    </div>
  );
}
