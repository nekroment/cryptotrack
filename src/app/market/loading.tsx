export default function MarketLoading() {
  return (
    <>
      <div className="mb-4 h-4 w-48 rounded bg-surface-2 animate-pulse" />

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2 text-left text-xs font-medium uppercase tracking-wider text-secondary">
              <th className="hidden w-12 px-4 py-3 sm:table-cell">#</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="hidden px-4 py-3 text-right sm:table-cell">24h %</th>
              <th className="hidden px-4 py-3 text-right md:table-cell">Market Cap</th>
              <th className="hidden px-4 py-3 text-right lg:table-cell">Volume (24h)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Array.from({ length: 20 }).map((_, i) => (
              <tr key={i} className="bg-surface">
                <td className="hidden px-4 py-3 sm:table-cell">
                  <div className="h-4 w-6 rounded bg-surface-2 animate-pulse" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 shrink-0 rounded-full bg-surface-2 animate-pulse" />
                    <div className="space-y-1">
                      <div className="h-4 w-24 rounded bg-surface-2 animate-pulse" />
                      <div className="h-3 w-12 rounded bg-surface-2 animate-pulse" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="ml-auto h-4 w-20 rounded bg-surface-2 animate-pulse" />
                </td>
                <td className="hidden px-4 py-3 text-right sm:table-cell">
                  <div className="ml-auto h-4 w-14 rounded bg-surface-2 animate-pulse" />
                </td>
                <td className="hidden px-4 py-3 text-right md:table-cell">
                  <div className="ml-auto h-4 w-24 rounded bg-surface-2 animate-pulse" />
                </td>
                <td className="hidden px-4 py-3 text-right lg:table-cell">
                  <div className="ml-auto h-4 w-20 rounded bg-surface-2 animate-pulse" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
