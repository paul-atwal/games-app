"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const games = [
  { name: "Wordle", href: "/games/wordle" },
  { name: "Connections", href: "/games/connections" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-[var(--border)] bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href="/"
            className="font-[var(--font-display)] text-xl font-bold tracking-tight"
          >
            Puzzles
          </Link>

          {/* Navigation */}
          <nav className="hidden sm:flex items-center gap-1">
            {games.map((game) => (
              <Link
                key={game.href}
                href={game.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === game.href
                    ? "bg-[var(--accent-soft)] text-[var(--foreground)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--accent-soft)]"
                )}
              >
                {game.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <MobileMenu pathname={pathname} />
        </div>
      </div>
    </header>
  );
}

function MobileMenu({ pathname }: { pathname: string }) {
  return (
    <div className="sm:hidden">
      <details className="relative">
        <summary className="list-none cursor-pointer p-2 -m-2 rounded-md hover:bg-[var(--border)]/50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </summary>
        <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg py-2 z-50">
          {games.map((game) => (
            <Link
              key={game.href}
              href={game.href}
                className={cn(
                  "block px-4 py-2 text-sm transition-colors",
                  pathname === game.href
                    ? "bg-[var(--accent-soft)] text-[var(--foreground)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--accent-soft)]"
                )}
            >
              {game.name}
            </Link>
          ))}
        </div>
      </details>
    </div>
  );
}
