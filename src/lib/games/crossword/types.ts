export interface CrosswordClue {
  number: number;
  clue: string;
  answer: string;
  row: number;
  col: number;
  length: number;
}

export interface CrosswordPuzzle {
  id: string;
  title?: string;
  author?: string;
  date: string;
  size: { rows: number; cols: number };
  // Grid where null = black square, empty string = white square
  grid: (string | null)[][];
  clues: {
    across: CrosswordClue[];
    down: CrosswordClue[];
  };
}

export interface CellPosition {
  row: number;
  col: number;
}

export interface CrosswordGameState {
  puzzle: CrosswordPuzzle;
  userGrid: string[][];
  currentCell: CellPosition | null;
  direction: "across" | "down";
  isComplete: boolean;
  startedAt: Date | null;
  completedAt: Date | null;
}

export type CrosswordAction =
  | { type: "SET_CELL"; row: number; col: number; value: string }
  | { type: "SELECT_CELL"; row: number; col: number }
  | { type: "TOGGLE_DIRECTION" }
  | { type: "MOVE"; direction: "up" | "down" | "left" | "right" }
  | { type: "MOVE_TO_NEXT_CELL" }
  | { type: "MOVE_TO_PREV_CELL" }
  | { type: "SELECT_CLUE"; clueNumber: number; direction: "across" | "down" }
  | { type: "CHECK_CELL" }
  | { type: "CHECK_WORD" }
  | { type: "CHECK_PUZZLE" }
  | { type: "REVEAL_CELL" }
  | { type: "REVEAL_WORD" }
  | { type: "REVEAL_PUZZLE" }
  | { type: "RESET" };
