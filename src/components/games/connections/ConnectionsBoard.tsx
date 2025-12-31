"use client";

import { ConnectionsTile } from "./ConnectionsTile";
import { ConnectionsCategory } from "./ConnectionsCategory";
import type { ConnectionCategory } from "@/lib/games/connections/types";

interface ConnectionsBoardProps {
  remainingWords: string[];
  selectedWords: string[];
  solvedCategories: ConnectionCategory[];
  onWordClick: (word: string) => void;
  disabled?: boolean;
}

export function ConnectionsBoard({
  remainingWords,
  selectedWords,
  solvedCategories,
  onWordClick,
  disabled = false,
}: ConnectionsBoardProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Solved categories */}
      {solvedCategories.map((category, index) => (
        <ConnectionsCategory key={category.name} category={category} animate />
      ))}

      {/* Remaining words grid (4 columns) */}
      {remainingWords.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {remainingWords.map((word) => (
            <ConnectionsTile
              key={word}
              word={word}
              isSelected={selectedWords.includes(word)}
              onClick={() => onWordClick(word)}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  );
}
