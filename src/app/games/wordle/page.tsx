import { WordleGame } from "@/components/games/wordle";

export const metadata = {
  title: "Wordle - Daily Word Puzzle",
  description: "Guess the 5-letter word in 6 tries",
};

export default function WordlePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="text-center mb-6">
        <h1 className="font-serif text-2xl font-bold">Wordle</h1>
        <p className="text-[var(--muted)] text-sm mt-1">
          Guess the word in 6 tries
        </p>
      </div>

      <WordleGame />

      <div className="mt-8 p-4 bg-[var(--card)] border border-[var(--border)] rounded-lg">
        <h2 className="font-semibold mb-2">How to Play</h2>
        <ul className="text-sm text-[var(--muted)] space-y-1">
          <li>• Guess the 5-letter word in 6 attempts</li>
          <li>
            • <span className="text-[var(--color-correct)]">Green</span> = correct letter, correct position
          </li>
          <li>
            • <span className="text-[var(--color-present)]">Yellow</span> = correct letter, wrong position
          </li>
          <li>
            • <span className="text-[var(--color-absent)]">Gray</span> = letter not in word
          </li>
        </ul>
      </div>
    </div>
  );
}
