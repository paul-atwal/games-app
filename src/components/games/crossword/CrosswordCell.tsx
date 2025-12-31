"use client";

import { cn } from "@/lib/utils/cn";

interface CrosswordCellProps {
  value: string;
  solution: string | null;
  isSelected: boolean;
  isHighlighted: boolean;
  clueNumber?: number | null;
  onClick: () => void;
  size?: "mini" | "full";
}

export function CrosswordCell({
  value,
  solution,
  isSelected,
  isHighlighted,
  clueNumber,
  onClick,
  size = "full",
}: CrosswordCellProps) {
  const isMini = size === "mini";

  // Black cell
  if (solution === null) {
    return (
      <div
        className={cn(
          "bg-black",
          isMini ? "w-10 h-10 sm:w-12 sm:h-12" : "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
        )}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative border border-gray-300",
        "flex items-center justify-center",
        "font-medium uppercase text-black",
        "transition-colors focus:outline-none",
        isMini
          ? "w-10 h-10 sm:w-12 sm:h-12 text-lg sm:text-xl"
          : "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-xs sm:text-sm md:text-base",
        isSelected && "bg-[#ffda00]",
        isHighlighted && !isSelected && "bg-[#a7d8ff]",
        !isSelected && !isHighlighted && "bg-white"
      )}
    >
      {/* Clue number */}
      {clueNumber && (
        <span
          className={cn(
            "absolute font-normal text-gray-600",
            isMini
              ? "top-0.5 left-1 text-[8px] sm:text-[10px]"
              : "top-0 left-0.5 text-[6px] sm:text-[7px] md:text-[8px]"
          )}
        >
          {clueNumber}
        </span>
      )}

      {/* Letter */}
      {value}
    </button>
  );
}
