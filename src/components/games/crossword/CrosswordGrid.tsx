"use client";

import { CrosswordCell } from "./CrosswordCell";
import type { CrosswordPuzzle, CellPosition } from "@/lib/games/crossword/types";
import { getClueNumber, getClueForCell, getCellsForClue } from "@/lib/games/crossword/engine";

interface CrosswordGridProps {
  puzzle: CrosswordPuzzle;
  userGrid: string[][];
  currentCell: CellPosition | null;
  direction: "across" | "down";
  onCellClick: (row: number, col: number) => void;
}

export function CrosswordGrid({
  puzzle,
  userGrid,
  currentCell,
  direction,
  onCellClick,
}: CrosswordGridProps) {
  // Get highlighted cells (cells in the same word as current selection)
  const highlightedCells = new Set<string>();

  if (currentCell) {
    const clue = getClueForCell(puzzle, currentCell.row, currentCell.col, direction);
    if (clue) {
      const cells = getCellsForClue(clue, direction);
      cells.forEach((cell) => {
        highlightedCells.add(`${cell.row}-${cell.col}`);
      });
    }
  }

  // Determine if this is a mini (5x5 or smaller) or full puzzle
  const isMini = puzzle.size.rows <= 7 && puzzle.size.cols <= 7;

  return (
    <div
      className="grid gap-0 border-2 border-black"
      style={{
        gridTemplateColumns: `repeat(${puzzle.size.cols}, minmax(0, 1fr))`,
      }}
    >
      {puzzle.grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isSelected =
            currentCell?.row === rowIndex && currentCell?.col === colIndex;
          const isHighlighted = highlightedCells.has(`${rowIndex}-${colIndex}`);
          const clueNumber = getClueNumber(puzzle, rowIndex, colIndex);

          return (
            <CrosswordCell
              key={`${rowIndex}-${colIndex}`}
              value={userGrid[rowIndex]?.[colIndex] || ""}
              solution={cell}
              isSelected={isSelected}
              isHighlighted={isHighlighted}
              clueNumber={clueNumber}
              onClick={() => onCellClick(rowIndex, colIndex)}
              size={isMini ? "mini" : "full"}
            />
          );
        })
      )}
    </div>
  );
}
