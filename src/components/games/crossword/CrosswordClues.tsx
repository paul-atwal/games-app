"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import type { CrosswordClue, CellPosition } from "@/lib/games/crossword/types";

interface CrosswordCluesProps {
  acrossClues: CrosswordClue[];
  downClues: CrosswordClue[];
  currentClue: CrosswordClue | null;
  direction: "across" | "down";
  onClueClick: (clueNumber: number, direction: "across" | "down") => void;
}

function ClueList({
  title,
  clues,
  currentClue,
  isCurrentDirection,
  onClueClick,
  direction,
}: {
  title: string;
  clues: CrosswordClue[];
  currentClue: CrosswordClue | null;
  isCurrentDirection: boolean;
  onClueClick: (clueNumber: number, direction: "across" | "down") => void;
  direction: "across" | "down";
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const activeClueNumber = isCurrentDirection ? currentClue?.number : null;

  // Scroll to active clue when it changes
  useEffect(() => {
    if (activeClueNumber && listRef.current) {
      const activeButton = listRef.current.querySelector(`[data-clue="${activeClueNumber}"]`);
      if (activeButton) {
        activeButton.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [activeClueNumber]);

  return (
    <div className="flex-1 min-w-0 flex flex-col">
      <h3 className="font-semibold text-sm mb-2 uppercase tracking-wide text-[var(--muted)] flex-shrink-0">
        {title}
      </h3>
      <ul ref={listRef} className="space-y-0.5 overflow-y-auto max-h-64 md:max-h-80 pr-2">
        {clues.map((clue) => {
          const isActive =
            isCurrentDirection && currentClue?.number === clue.number;

          return (
            <li key={clue.number}>
              <button
                type="button"
                data-clue={clue.number}
                onClick={() => onClueClick(clue.number, direction)}
                className={cn(
                  "w-full text-left px-2 py-1.5 rounded text-sm transition-colors",
                  isActive
                    ? "bg-[#ffda00] text-black"
                    : "hover:bg-gray-100"
                )}
              >
                <span className="font-bold mr-1">{clue.number}</span>
                {clue.clue}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function CrosswordClues({
  acrossClues,
  downClues,
  currentClue,
  direction,
  onClueClick,
}: CrosswordCluesProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
      <ClueList
        title="Across"
        clues={acrossClues}
        currentClue={currentClue}
        isCurrentDirection={direction === "across"}
        onClueClick={onClueClick}
        direction="across"
      />
      <ClueList
        title="Down"
        clues={downClues}
        currentClue={currentClue}
        isCurrentDirection={direction === "down"}
        onClueClick={onClueClick}
        direction="down"
      />
    </div>
  );
}
