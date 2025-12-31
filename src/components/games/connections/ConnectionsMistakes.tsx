"use client";

import { cn } from "@/lib/utils/cn";

interface ConnectionsMistakesProps {
  mistakes: number;
  maxMistakes?: number;
}

export function ConnectionsMistakes({ mistakes, maxMistakes = 4 }: ConnectionsMistakesProps) {
  const remaining = maxMistakes - mistakes;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Mistakes remaining:</span>
      <div className="flex gap-1">
        {Array.from({ length: maxMistakes }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              i < remaining ? "bg-gray-700" : "bg-gray-300"
            )}
          />
        ))}
      </div>
    </div>
  );
}
