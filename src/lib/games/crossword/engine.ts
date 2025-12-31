import type {
  CrosswordPuzzle,
  CrosswordGameState,
  CrosswordAction,
  CellPosition,
  CrosswordClue,
} from "./types";

export function createInitialState(puzzle: CrosswordPuzzle): CrosswordGameState {
  // Create empty user grid matching puzzle dimensions
  const userGrid: string[][] = [];
  for (let row = 0; row < puzzle.size.rows; row++) {
    userGrid[row] = [];
    for (let col = 0; col < puzzle.size.cols; col++) {
      // null for black squares, empty string for white squares
      userGrid[row][col] = puzzle.grid[row][col] === null ? "" : "";
    }
  }

  // Find first white cell
  let firstCell: CellPosition | null = null;
  outer: for (let row = 0; row < puzzle.size.rows; row++) {
    for (let col = 0; col < puzzle.size.cols; col++) {
      if (puzzle.grid[row][col] !== null) {
        firstCell = { row, col };
        break outer;
      }
    }
  }

  return {
    puzzle,
    userGrid,
    currentCell: firstCell,
    direction: "across",
    isComplete: false,
    startedAt: null,
    completedAt: null,
  };
}

export function isBlackCell(puzzle: CrosswordPuzzle, row: number, col: number): boolean {
  if (row < 0 || row >= puzzle.size.rows || col < 0 || col >= puzzle.size.cols) {
    return true;
  }
  return puzzle.grid[row][col] === null;
}

export function getClueForCell(
  puzzle: CrosswordPuzzle,
  row: number,
  col: number,
  direction: "across" | "down"
): CrosswordClue | null {
  const clues = puzzle.clues[direction];

  for (const clue of clues) {
    if (direction === "across") {
      if (row === clue.row && col >= clue.col && col < clue.col + clue.length) {
        return clue;
      }
    } else {
      if (col === clue.col && row >= clue.row && row < clue.row + clue.length) {
        return clue;
      }
    }
  }

  return null;
}

export function getCellsForClue(
  clue: CrosswordClue,
  direction: "across" | "down"
): CellPosition[] {
  const cells: CellPosition[] = [];
  for (let i = 0; i < clue.length; i++) {
    if (direction === "across") {
      cells.push({ row: clue.row, col: clue.col + i });
    } else {
      cells.push({ row: clue.row + i, col: clue.col });
    }
  }
  return cells;
}

export function getClueNumber(
  puzzle: CrosswordPuzzle,
  row: number,
  col: number
): number | null {
  // Check if this cell starts any clue
  for (const clue of puzzle.clues.across) {
    if (clue.row === row && clue.col === col) {
      return clue.number;
    }
  }
  for (const clue of puzzle.clues.down) {
    if (clue.row === row && clue.col === col) {
      return clue.number;
    }
  }
  return null;
}

function findNextCell(
  state: CrosswordGameState,
  forward: boolean
): CellPosition | null {
  const { puzzle, currentCell, direction } = state;
  if (!currentCell) return null;

  let { row, col } = currentCell;
  const delta = forward ? 1 : -1;

  if (direction === "across") {
    col += delta;
    // Skip black cells
    while (col >= 0 && col < puzzle.size.cols && isBlackCell(puzzle, row, col)) {
      col += delta;
    }
    if (col >= 0 && col < puzzle.size.cols) {
      return { row, col };
    }
  } else {
    row += delta;
    while (row >= 0 && row < puzzle.size.rows && isBlackCell(puzzle, row, col)) {
      row += delta;
    }
    if (row >= 0 && row < puzzle.size.rows) {
      return { row, col };
    }
  }

  return null;
}

function checkCompletion(state: CrosswordGameState): boolean {
  const { puzzle, userGrid } = state;

  for (let row = 0; row < puzzle.size.rows; row++) {
    for (let col = 0; col < puzzle.size.cols; col++) {
      const solution = puzzle.grid[row][col];
      if (solution !== null) {
        if (userGrid[row][col].toUpperCase() !== solution.toUpperCase()) {
          return false;
        }
      }
    }
  }

  return true;
}

export function crosswordReducer(
  state: CrosswordGameState,
  action: CrosswordAction
): CrosswordGameState {
  switch (action.type) {
    case "SET_CELL": {
      const { row, col, value } = action;
      if (isBlackCell(state.puzzle, row, col)) return state;

      const newGrid = state.userGrid.map((r) => [...r]);
      newGrid[row][col] = value.toUpperCase();

      const newState = {
        ...state,
        userGrid: newGrid,
        startedAt: state.startedAt || new Date(),
      };

      // Check if puzzle is complete
      if (checkCompletion(newState)) {
        return {
          ...newState,
          isComplete: true,
          completedAt: new Date(),
        };
      }

      return newState;
    }

    case "SELECT_CELL": {
      const { row, col } = action;
      if (isBlackCell(state.puzzle, row, col)) return state;

      // If clicking the same cell, toggle direction
      if (
        state.currentCell?.row === row &&
        state.currentCell?.col === col
      ) {
        return {
          ...state,
          direction: state.direction === "across" ? "down" : "across",
        };
      }

      return {
        ...state,
        currentCell: { row, col },
      };
    }

    case "TOGGLE_DIRECTION": {
      return {
        ...state,
        direction: state.direction === "across" ? "down" : "across",
      };
    }

    case "MOVE": {
      if (!state.currentCell) return state;

      let { row, col } = state.currentCell;

      switch (action.direction) {
        case "up": row--; break;
        case "down": row++; break;
        case "left": col--; break;
        case "right": col++; break;
      }

      // Skip black cells
      while (
        row >= 0 && row < state.puzzle.size.rows &&
        col >= 0 && col < state.puzzle.size.cols &&
        isBlackCell(state.puzzle, row, col)
      ) {
        switch (action.direction) {
          case "up": row--; break;
          case "down": row++; break;
          case "left": col--; break;
          case "right": col++; break;
        }
      }

      if (
        row >= 0 && row < state.puzzle.size.rows &&
        col >= 0 && col < state.puzzle.size.cols
      ) {
        return {
          ...state,
          currentCell: { row, col },
        };
      }

      return state;
    }

    case "MOVE_TO_NEXT_CELL": {
      const nextCell = findNextCell(state, true);
      if (nextCell) {
        return { ...state, currentCell: nextCell };
      }
      return state;
    }

    case "MOVE_TO_PREV_CELL": {
      const prevCell = findNextCell(state, false);
      if (prevCell) {
        return { ...state, currentCell: prevCell };
      }
      return state;
    }

    case "SELECT_CLUE": {
      const { clueNumber, direction } = action;
      const clues = state.puzzle.clues[direction];
      const clue = clues.find((c) => c.number === clueNumber);

      if (clue) {
        return {
          ...state,
          currentCell: { row: clue.row, col: clue.col },
          direction,
        };
      }
      return state;
    }

    case "REVEAL_CELL": {
      if (!state.currentCell) return state;
      const { row, col } = state.currentCell;
      const solution = state.puzzle.grid[row][col];

      if (solution) {
        const newGrid = state.userGrid.map((r) => [...r]);
        newGrid[row][col] = solution;

        const newState = { ...state, userGrid: newGrid };
        if (checkCompletion(newState)) {
          return { ...newState, isComplete: true, completedAt: new Date() };
        }
        return newState;
      }
      return state;
    }

    case "REVEAL_WORD": {
      if (!state.currentCell) return state;

      const clue = getClueForCell(
        state.puzzle,
        state.currentCell.row,
        state.currentCell.col,
        state.direction
      );

      if (!clue) return state;

      const newGrid = state.userGrid.map((r) => [...r]);
      const cells = getCellsForClue(clue, state.direction);

      for (const cell of cells) {
        const solution = state.puzzle.grid[cell.row][cell.col];
        if (solution) {
          newGrid[cell.row][cell.col] = solution;
        }
      }

      const newState = { ...state, userGrid: newGrid };
      if (checkCompletion(newState)) {
        return { ...newState, isComplete: true, completedAt: new Date() };
      }
      return newState;
    }

    case "REVEAL_PUZZLE": {
      const newGrid = state.userGrid.map((r) => [...r]);

      for (let row = 0; row < state.puzzle.size.rows; row++) {
        for (let col = 0; col < state.puzzle.size.cols; col++) {
          const solution = state.puzzle.grid[row][col];
          if (solution) {
            newGrid[row][col] = solution;
          }
        }
      }

      return {
        ...state,
        userGrid: newGrid,
        isComplete: true,
        completedAt: new Date(),
      };
    }

    case "RESET": {
      return createInitialState(state.puzzle);
    }

    default:
      return state;
  }
}
