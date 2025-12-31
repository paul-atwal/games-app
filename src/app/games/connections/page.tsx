import { ConnectionsGame } from "@/components/games/connections";

export const metadata = {
  title: "Connections - Group Word Puzzle",
  description: "Find groups of four words that share a common thread",
};

export default function ConnectionsPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <ConnectionsGame />
    </div>
  );
}
