import Link from "next/link";
import { ChevronFirst, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  hasNextPage: boolean;
}

const linkBase =
  "flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm transition-colors";
const linkActive = "text-primary hover:bg-surface-2";
const linkDisabled = "pointer-events-none opacity-40 text-secondary";

export default function Pagination({ currentPage, hasNextPage }: PaginationProps) {
  const isFirst = currentPage === 1;

  return (
    <div className="mt-4 flex items-center justify-between">
      <p className="text-sm text-secondary">
        Page <span className="font-medium text-primary">{currentPage}</span>
      </p>

      <div className="flex items-center gap-2">
        <Link
          href="/market"
          aria-disabled={isFirst}
          className={cn(linkBase, isFirst ? linkDisabled : linkActive)}
          title="First page"
        >
          <ChevronFirst className="h-4 w-4" />
        </Link>

        <Link
          href={`/market?page=${currentPage - 1}`}
          aria-disabled={isFirst}
          className={cn(linkBase, isFirst ? linkDisabled : linkActive)}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Link>

        <Link
          href={`/market?page=${currentPage + 1}`}
          aria-disabled={!hasNextPage}
          className={cn(linkBase, !hasNextPage ? linkDisabled : linkActive)}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
