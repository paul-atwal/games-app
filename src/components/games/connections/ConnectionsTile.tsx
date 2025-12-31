"use client";

import { cn } from "@/lib/utils/cn";

interface ConnectionsTileProps {
  word: string;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function ConnectionsTile({
  word,
  isSelected,
  onClick,
  disabled = false,
}: ConnectionsTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full aspect-[2/1] sm:aspect-[2.5/1] rounded-lg",
        "flex items-center justify-center",
        "text-sm sm:text-base font-bold uppercase",
        "transition-all duration-150",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400",
        isSelected
          ? "bg-gray-700 text-white scale-[0.98]"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {word}
    </button>
  );
}
