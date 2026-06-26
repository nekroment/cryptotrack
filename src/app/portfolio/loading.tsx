export default function PortfolioLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 rounded bg-surface-2 animate-pulse" />
        <div className="h-9 w-28 rounded-lg bg-surface-2 animate-pulse" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface p-4">
            <div className="h-3 w-20 rounded bg-surface-2 animate-pulse" />
            <div className="mt-2 h-6 w-28 rounded bg-surface-2 animate-pulse" />
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <div className="h-3 w-16 rounded bg-surface-2 animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="bg-surface">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-surface-2 animate-pulse" />
                    <div className="space-y-1">
                      <div className="h-4 w-20 rounded bg-surface-2 animate-pulse" />
                      <div className="h-3 w-10 rounded bg-surface-2 animate-pulse" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="ml-auto h-4 w-16 rounded bg-surface-2 animate-pulse" />
                </td>
                <td className="hidden px-4 py-3 text-right md:table-cell">
                  <div className="ml-auto h-4 w-20 rounded bg-surface-2 animate-pulse" />
                </td>
                <td className="hidden px-4 py-3 text-right sm:table-cell">
                  <div className="ml-auto h-4 w-20 rounded bg-surface-2 animate-pulse" />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="ml-auto h-4 w-16 rounded bg-surface-2 animate-pulse" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
