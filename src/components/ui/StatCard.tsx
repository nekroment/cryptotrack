import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  positive?: boolean;
  icon?: React.ReactNode;
}

export default function StatCard({ label, value, subValue, positive, icon }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs text-secondary">{label}</p>
      <p
        className={cn(
          "mt-1 flex items-center gap-1 text-lg font-semibold",
          positive === true
            ? "text-up"
            : positive === false
              ? "text-down"
              : "text-primary"
        )}
      >
        {icon}
        {value}
      </p>
      {subValue && (
        <p
          className={cn(
            "text-xs",
            positive === true ? "text-up" : positive === false ? "text-down" : "text-secondary"
          )}
        >
          {subValue}
        </p>
      )}
    </div>
  );
}
