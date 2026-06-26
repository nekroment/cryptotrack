interface DataTableProps {
  head: React.ReactNode;
  children: React.ReactNode;
}

export default function DataTable({ head, children }: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-2 text-left text-xs font-medium uppercase tracking-wider text-secondary">
            {head}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}
