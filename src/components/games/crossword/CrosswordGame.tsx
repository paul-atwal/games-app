"use client";

import { useEffect, useCallback } from "react";
import { CrosswordGrid } from "./CrosswordGrid";
import { CrosswordClues } from "./CrosswordClues";
import { useCrosswordStore } from "@/stores/crosswordStore";
import { getClueForCell } from "@/lib/games/crossword/engine";
import { Button } from "@/components/ui";

export function CrosswordGame() {
  const { state, dispatch, checkAndResetDaily } = useCrosswordStore();
  const { puzzle, userGrid, currentCell, direction, isComplete } = state;

  // Check for new daily puzzle on mount
  useEffect(() => {
    checkAndResetDaily();
  }, [checkAndResetDaily]);

  // Get the current clue
  const currentClue = currentCell
    ? getClueForCell(puzzle, currentCell.row, currentCell.col, direction)
    : null;

  // Handle cell click
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      dispatch({ type: "SELECT_CELL", row, col });
    },
    [dispatch]
  );

  // Handle clue click
  const handleClueClick = useCallback(
    (clueNumber: number, dir: "across" | "down") => {
      dispatch({ type: "SELECT_CLUE", clueNumber, direction: dir });
    },
    [dispatch]
  );

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComplete) return;

      // Prevent default for game keys
      if (
        e.key.length === 1 ||
        ["Backspace", "Delete", "Tab", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      ) {
        e.preventDefault();
      }

      // Letter input
      if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
        if (currentCell) {
          dispatch({
            type: "SET_CELL",
            row: currentCell.row,
            col: currentCell.col,
            value: e.key.toUpperCase(),
          });
          dispatch({ type: "MOVE_TO_NEXT_CELL" });
        }
        return;
      }

      // Backspace - clear current cell and move back
      if (e.key === "Backspace") {
        if (currentCell) {
          const currentValue = userGrid[currentCell.row]?.[currentCell.col];
          if (currentValue) {
            // Clear current cell
            dispatch({
              type: "SET_CELL",
              row: currentCell.row,
              col: currentCell.col,
              value: "",
            });
          } else {
            // Move to previous cell and clear it
            dispatch({ type: "MOVE_TO_PREV_CELL" });
          }
        }
        return;
      }

      // Delete - just clear current cell
      if (e.key === "Delete") {
        if (currentCell) {
          dispatch({
            type: "SET_CELL",
            row: currentCell.row,
            col: currentCell.col,
            value: "",
          });
        }
        return;
      }

      // Space or Tab - toggle direction
      if (e.key === " " || e.key === "Tab") {
        dispatch({ type: "TOGGLE_DIRECTION" });
        return;
      }

      // Arrow keys - navigate
      if (e.key === "ArrowUp") {
        dispatch({ type: "MOVE", direction: "up" });
        return;
      }
      if (e.key === "ArrowDown") {
        dispatch({ type: "MOVE", direction: "down" });
        return;
      }
      if (e.key === "ArrowLeft") {
        dispatch({ type: "MOVE", direction: "left" });
        return;
      }
      if (e.key === "ArrowRight") {
        dispatch({ type: "MOVE", direction: "right" });
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentCell, direction, isComplete, userGrid, dispatch]);

  const handleRevealCell = () => dispatch({ type: "REVEAL_CELL" });
  const handleRevealWord = () => dispatch({ type: "REVEAL_WORD" });
  const handleRevealPuzzle = () => dispatch({ type: "REVEAL_PUZZLE" });
  const handleReset = () => dispatch({ type: "RESET" });

  // Determine if it's a full-sized puzzle
  const isFullSize = puzzle.size.rows > 7 || puzzle.size.cols > 7;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="text-center">
        {puzzle.title && (
          <h2 className="font-[var(--font-display)] text-xl md:text-2xl font-semibold">
            {puzzle.title}
          </h2>
        )}
        {puzzle.author && (
          <p className="text-sm text-[var(--muted)]">by {puzzle.author}</p>
        )}
      </div>

      {/* Current clue display */}
      {currentClue && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-black">
          <span className="font-bold">{currentClue.number} {direction.charAt(0).toUpperCase() + direction.slice(1)}:</span>{" "}
          {currentClue.clue}
        </div>
      )}

      {/* Main content: Grid + Clues side by side on larger screens */}
      <div className={isFullSize ? "flex flex-col lg:flex-row gap-6" : "flex flex-col gap-6"}>
        {/* Grid section */}
        <div className={isFullSize ? "lg:flex-shrink-0" : ""}>
          <div className="flex justify-center">
            <CrosswordGrid
              puzzle={puzzle}
              userGrid={userGrid}
              currentCell={currentCell}
              direction={direction}
              onCellClick={handleCellClick}
            />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={handleRevealCell}>
              Reveal Cell
            </Button>
            <Button variant="outline" size="sm" onClick={handleRevealWord}>
              Reveal Word
            </Button>
            <Button variant="outline" size="sm" onClick={handleRevealPuzzle}>
              Reveal All
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-center text-xs text-[var(--muted)] mt-3">
            <p>Arrow keys to navigate • Space/Tab to switch direction</p>
          </div>
        </div>

        {/* Clues section */}
        <div className={isFullSize ? "lg:flex-1 lg:min-w-0" : ""}>
          <CrosswordClues
            acrossClues={puzzle.clues.across}
            downClues={puzzle.clues.down}
            currentClue={currentClue}
            direction={direction}
            onClueClick={handleClueClick}
          />
        </div>
      </div>

      {/* Completion message */}
      {isComplete && (
        <div className="text-center bg-[var(--color-correct)] text-white rounded-lg px-4 py-3">
          <p className="font-bold text-lg">Puzzle Complete!</p>
          <p className="text-sm opacity-90">Great job solving today&apos;s crossword!</p>
        </div>
      )}
    </div>
  );
}
