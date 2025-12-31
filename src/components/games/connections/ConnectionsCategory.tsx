"use client";

import { cn } from "@/lib/utils/cn";
import type { ConnectionCategory, ConnectionDifficulty } from "@/lib/games/connections/types";

const DIFFICULTY_STYLES: Record<ConnectionDifficulty, string> = {
  easy: "bg-yellow-300 text-yellow-900",
  medium: "bg-green-400 text-green-900",
  hard: "bg-blue-400 text-blue-900",
  tricky: "bg-purple-400 text-purple-900",
};

interface ConnectionsCategoryProps {
  category: ConnectionCategory;
  animate?: boolean;
}

export function ConnectionsCategory({ category, animate = false }: ConnectionsCategoryProps) {
  return (
    <div
      className={cn(
        "w-full rounded-lg py-4 px-3",
        "flex flex-col items-center justify-center gap-1",
        DIFFICULTY_STYLES[category.difficulty],
        animate && "animate-[popIn_0.3s_ease-out]"
      )}
    >
      <span className="font-bold text-sm sm:text-base uppercase tracking-wide">
        {category.name}
      </span>
      <span className="text-xs sm:text-sm opacity-90">
        {category.words.join(", ")}
      </span>
    </div>
  );
}
