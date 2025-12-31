import Link from "next/link";

const games = [
  {
    name: "Wordle",
    description: "Guess the hidden word in 6 tries",
    href: "/games/wordle",
    bgColor: "bg-[#e6e7ea] dark:bg-[#d7d8dc]",
    icon: (
      <svg viewBox="0 0 40 40" className="w-16 h-16" fill="none">
        <rect x="2" y="2" width="10" height="10" rx="1" fill="white" />
        <rect x="15" y="2" width="10" height="10" rx="1" fill="white" />
        <rect x="28" y="2" width="10" height="10" rx="1" fill="white" />
        <rect x="2" y="15" width="10" height="10" rx="1" fill="white" opacity="0.6" />
        <rect x="15" y="15" width="10" height="10" rx="1" fill="white" />
        <rect x="28" y="15" width="10" height="10" rx="1" fill="white" opacity="0.6" />
        <rect x="2" y="28" width="10" height="10" rx="1" fill="white" opacity="0.3" />
        <rect x="15" y="28" width="10" height="10" rx="1" fill="white" opacity="0.6" />
        <rect x="28" y="28" width="10" height="10" rx="1" fill="white" opacity="0.3" />
      </svg>
    ),
  },
  {
    name: "Connections",
    description: "Group words that share a common thread",
    href: "/games/connections",
    bgColor: "bg-[#c9c3f2] dark:bg-[#bdb5ee]",
    icon: (
      <svg viewBox="0 0 40 40" className="w-16 h-16" fill="none">
        <rect x="2" y="2" width="17" height="17" rx="2" fill="#f9df6d" />
        <rect x="21" y="2" width="17" height="17" rx="2" fill="#a0c35a" />
        <rect x="2" y="21" width="17" height="17" rx="2" fill="#b0c4ef" />
        <rect x="21" y="21" width="17" height="17" rx="2" fill="#ba81c5" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-57px)] flex flex-col">
      {/* Hero Section */}
      <div className="bg-[var(--accent)] dark:bg-[#1c1c1c] py-14 px-4 border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-[var(--font-display)] text-5xl md:text-6xl font-semibold text-[var(--foreground)] mb-3 tracking-tight">
            Daily Puzzles
          </h1>
          <p className="text-[var(--muted)] text-lg md:text-xl max-w-md mx-auto">
            games for msh
          </p>
        </div>
      </div>

      {/* Games Grid */}
      <div className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {games.map((game) => (
              <Link
                key={game.href}
                href={game.href}
                className="group block"
              >
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-200 dark:border-[#2b2b2b] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                  {/* Colored header with icon */}
                  <div className={`${game.bgColor} py-8 flex items-center justify-center`}>
                    {game.icon}
                  </div>

                  {/* Content */}
                  <div className="p-6 text-center">
                    <h2 className="font-[var(--font-display)] text-2xl font-bold mb-2">
                      {game.name}
                    </h2>
                    <p className="text-[var(--muted)] text-sm">
                      {game.description}
                    </p>

                    {/* Play button */}
                    <div className="mt-4">
                      <span className="inline-block px-6 py-2 border border-[var(--border)] text-[#111111] rounded-full text-sm font-semibold bg-white dark:bg-[#f3f2ee] dark:text-[#111111]">
                        Play
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Coming Soon Section */}
          <div className="mt-12 text-center">
            <p className="text-[var(--muted)] text-sm uppercase tracking-wider mb-4">
              Coming Soon
            </p>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-[var(--card)] border border-[var(--border)] rounded-full">
              <div className="w-8 h-8 bg-[#b9c7ee] rounded flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="white" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </div>
              <span className="text-[var(--muted)] font-medium">Crossword</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
