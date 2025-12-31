export type GameType = "wordle" | "connections" | "crossword";

export type GameStatus = "idle" | "playing" | "won" | "lost";

// Wordle types
export type LetterStatus = "correct" | "present" | "absent" | "empty" | "tbd";

export interface WordleTile {
  letter: string;
  status: LetterStatus;
}

export interface WordleGameState {
  solution: string;
  guesses: string[];
  currentGuess: string;
  gameStatus: GameStatus;
  keyboardStatus: Record<string, LetterStatus>;
}

// Connections types
export type CategoryDifficulty = 1 | 2 | 3 | 4;

export interface ConnectionsCategory {
  name: string;
  words: string[];
  difficulty: CategoryDifficulty;
}

export interface ConnectionsPuzzle {
  id: string;
  categories: ConnectionsCategory[];
}

export interface ConnectionsGameState {
  puzzle: ConnectionsPuzzle;
  selectedWords: string[];
  solvedCategories: ConnectionsCategory[];
  mistakes: number;
  gameStatus: GameStatus;
}

// Crossword types
export interface CrosswordClue {
  number: number;
  clue: string;
  answer: string;
  row: number;
  col: number;
}

export interface CrosswordPuzzle {
  id: string;
  size: { rows: number; cols: number };
  grid: (string | null)[][];
  clues: {
    across: CrosswordClue[];
    down: CrosswordClue[];
  };
}

export interface CrosswordGameState {
  puzzle: CrosswordPuzzle;
  userGrid: string[][];
  currentCell: { row: number; col: number } | null;
  direction: "across" | "down";
  gameStatus: GameStatus;
}
