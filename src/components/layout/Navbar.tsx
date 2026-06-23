import Link from "next/link";
import { TrendingUp } from "lucide-react";

const navLinks = [
  { href: "/market", label: "Market" },
  { href: "/portfolio", label: "Portfolio" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/market" className="flex items-center gap-2 text-primary">
          <TrendingUp className="h-5 w-5 text-accent" />
          <span className="text-lg font-semibold tracking-tight">
            CryptoTrack
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-secondary transition-colors hover:bg-surface-2 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
