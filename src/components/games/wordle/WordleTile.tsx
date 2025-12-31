"use client";

import { cn } from "@/lib/utils/cn";
import type { LetterStatus } from "@/types/games";

interface WordleTileProps {
  letter: string;
  status: LetterStatus;
  position: number;
  isRevealing?: boolean;
}

const statusStyles: Record<LetterStatus, string> = {
  correct: "bg-[var(--color-correct)] text-white border-[var(--color-correct)]",
  present: "bg-[var(--color-present)] text-white border-[var(--color-present)]",
  absent: "bg-[var(--color-absent)] text-white border-[var(--color-absent)]",
  empty: "bg-transparent border-[var(--border)]",
  tbd: "bg-transparent border-[var(--foreground)]/50",
};

export function WordleTile({
  letter,
  status,
  position,
  isRevealing = false,
}: WordleTileProps) {
  const hasLetter = letter !== "";

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        "w-[var(--wordle-tile-size)] h-[var(--wordle-tile-size)]",
        "border-2 font-bold text-2xl sm:text-3xl uppercase",
        "transition-all duration-300",
        "select-none",
        statusStyles[status],
        hasLetter && status === "tbd" && "animate-pop",
        isRevealing && "animate-flip"
      )}
      style={{
        animationDelay: isRevealing ? `${position * 300}ms` : undefined,
      }}
    >
      {letter}
    </div>
  );
}
