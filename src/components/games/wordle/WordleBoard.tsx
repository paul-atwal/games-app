"use client";

import { WordleTile } from "./WordleTile";
import type { LetterStatus } from "@/types/games";
import { cn } from "@/lib/utils/cn";

interface WordleBoardProps {
  rows: { letter: string; status: LetterStatus }[][];
  currentRowIndex: number;
  isInvalidGuess?: boolean;
}

export function WordleBoard({
  rows,
  currentRowIndex,
  isInvalidGuess = false,
}: WordleBoardProps) {
  return (
    <div className="flex flex-col gap-1.5 sm:gap-2">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={cn(
            "flex gap-1.5 sm:gap-2",
            isInvalidGuess && rowIndex === currentRowIndex && "animate-shake"
          )}
        >
          {row.map((tile, tileIndex) => (
            <WordleTile
              key={tileIndex}
              letter={tile.letter}
              status={tile.status}
              position={tileIndex}
              isRevealing={
                rowIndex === currentRowIndex - 1 &&
                tile.status !== "empty" &&
                tile.status !== "tbd"
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}
