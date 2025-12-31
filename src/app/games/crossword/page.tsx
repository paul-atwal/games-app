import { CrosswordGame } from "@/components/games/crossword";

export const metadata = {
  title: "Crossword - Daily Puzzle",
  description: "Solve the daily crossword puzzle",
};

export default function CrosswordPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <CrosswordGame />
    </div>
  );
}
