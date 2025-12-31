import Link from "next/link";

const games = [
  {
    name: "Wordle",
    description: "Guess the hidden word in 6 tries",
    href: "/games/wordle",
    color: "bg-[#6aaa64]",
  },
  {
    name: "Connections",
    description: "Group words that share a common thread",
    href: "/games/connections",
    color: "bg-[#a0c35a]",
  },
  {
    name: "Crossword",
    description: "Fill in the grid with clues",
    href: "/games/crossword",
    color: "bg-[#b0c4ef]",
  },
];

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl font-bold mb-4">Daily Puzzles</h1>
        <p className="text-[var(--muted)] text-lg">
          Challenge your mind with our collection of word games
        </p>
      </div>

      <div className="grid gap-4">
        {games.map((game) => (
          <Link
            key={game.href}
            href={game.href}
            className="group flex items-center gap-4 p-4 bg-[var(--card)] border border-[var(--border)] rounded-lg hover:border-[var(--foreground)]/20 transition-colors"
          >
            <div
              className={`w-12 h-12 ${game.color} rounded-lg flex items-center justify-center text-white font-bold text-xl`}
            >
              {game.name[0]}
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg group-hover:underline">
                {game.name}
              </h2>
              <p className="text-[var(--muted)] text-sm">{game.description}</p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
