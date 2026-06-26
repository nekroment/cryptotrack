import type { Metadata } from "next";

import PortfolioView from "./_components/PortfolioView";

export const metadata: Metadata = { title: "Portfolio — CryptoTrack" };

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <PortfolioView />
    </div>
  );
}
