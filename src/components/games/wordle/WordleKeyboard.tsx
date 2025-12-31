"use client";

import { cn } from "@/lib/utils/cn";
import type { LetterStatus } from "@/types/games";

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"],
];

interface WordleKeyboardProps {
  keyboardStatus: Record<string, LetterStatus>;
  onKeyPress: (key: string) => void;
  disabled?: boolean;
}

const statusStyles: Record<LetterStatus | "unused", string> = {
  correct: "bg-[var(--color-correct)] text-white border-transparent",
  present: "bg-[var(--color-present)] text-white border-transparent",
  absent: "bg-[var(--color-absent)] text-white border-transparent",
  empty: "bg-[var(--border)] text-[var(--foreground)]",
  tbd: "bg-[var(--border)] text-[var(--foreground)]",
  unused: "bg-[var(--border)] text-[var(--foreground)] hover:bg-[var(--border)]/80",
};

export function WordleKeyboard({
  keyboardStatus,
  onKeyPress,
  disabled = false,
}: WordleKeyboardProps) {
  const getKeyStatus = (key: string): LetterStatus | "unused" => {
    return keyboardStatus[key] || "unused";
  };

  return (
    <div className="flex flex-col gap-1.5 w-full max-w-lg mx-auto">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={cn(
            "flex justify-center gap-1.5",
            rowIndex === 1 && "px-4"
          )}
        >
          {row.map((key) => {
            const isSpecial = key === "ENTER" || key === "BACK";
            const status = isSpecial ? "unused" : getKeyStatus(key);

            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                disabled={disabled}
                className={cn(
                  "flex items-center justify-center rounded font-semibold",
                  "transition-colors duration-100",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  isSpecial
                    ? "px-2 sm:px-4 h-12 sm:h-14 text-xs sm:text-sm"
                    : "w-8 sm:w-10 h-12 sm:h-14 text-sm sm:text-base",
                  statusStyles[status]
                )}
              >
                {key === "BACK" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                    <line x1="18" y1="9" x2="12" y2="15" />
                    <line x1="12" y1="9" x2="18" y2="15" />
                  </svg>
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
