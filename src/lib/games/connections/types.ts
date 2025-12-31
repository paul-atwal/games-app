// Difficulty levels correspond to colors in NYT Connections
export type ConnectionDifficulty = "easy" | "medium" | "hard" | "tricky";

export interface ConnectionCategory {
  name: string;
  words: string[];
  difficulty: ConnectionDifficulty;
}

export interface ConnectionsPuzzle {
  id: string;
  date: string;
  categories: ConnectionCategory[];
}

export interface ConnectionsGameState {
  puzzle: ConnectionsPuzzle;
  // Words that haven't been solved yet (shuffled)
  remainingWords: string[];
  // Currently selected words
  selectedWords: string[];
  // Solved categories in order they were solved
  solvedCategories: ConnectionCategory[];
  // Number of mistakes made (max 4)
  mistakes: number;
  // Game status
  status: "playing" | "won" | "lost";
  // History of wrong guesses (for "already guessed" detection)
  guessHistory: string[][];
}

export type ConnectionsAction =
  | { type: "SELECT_WORD"; word: string }
  | { type: "DESELECT_WORD"; word: string }
  | { type: "CLEAR_SELECTION" }
  | { type: "SUBMIT_GUESS" }
  | { type: "SHUFFLE" }
  | { type: "RESET" };

// Color mapping for difficulties
export const DIFFICULTY_COLORS: Record<ConnectionDifficulty, { bg: string; text: string }> = {
  easy: { bg: "bg-yellow-300", text: "text-yellow-900" },
  medium: { bg: "bg-green-400", text: "text-green-900" },
  hard: { bg: "bg-blue-400", text: "text-blue-900" },
  tricky: { bg: "bg-purple-400", text: "text-purple-900" },
};
