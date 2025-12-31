"use client";

import { useEffect, useState, useCallback } from "react";
import { WordleBoard } from "./WordleBoard";
import { WordleKeyboard } from "./WordleKeyboard";
import { useWordleStore } from "@/stores/wordleStore";
import { getGuessStatuses } from "@/lib/games/wordle/engine";
import { isValidWord } from "@/lib/games/wordle/words";
import { Modal, Button } from "@/components/ui";

export function WordleGame() {
  const { state, dispatch, checkAndResetDaily } = useWordleStore();
  const [isInvalidGuess, setIsInvalidGuess] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Check for daily reset on mount
  useEffect(() => {
    checkAndResetDaily();
  }, [checkAndResetDaily]);

  // Show result modal when game ends
  useEffect(() => {
    if (state.gameStatus === "won" || state.gameStatus === "lost") {
      const timer = setTimeout(() => setShowResult(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [state.gameStatus]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (state.gameStatus !== "playing") return;

      if (key === "ENTER") {
        if (state.currentGuess.length === 5) {
          if (!isValidWord(state.currentGuess)) {
            setIsInvalidGuess(true);
            setTimeout(() => setIsInvalidGuess(false), 500);
            return;
          }
          dispatch({ type: "SUBMIT_GUESS" });
        }
      } else if (key === "BACK") {
        dispatch({ type: "REMOVE_LETTER" });
      } else if (/^[A-Z]$/.test(key)) {
        dispatch({ type: "ADD_LETTER", letter: key });
      }
    },
    [state.gameStatus, state.currentGuess, dispatch]
  );

  // Physical keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "Enter") {
        handleKeyPress("ENTER");
      } else if (e.key === "Backspace") {
        handleKeyPress("BACK");
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  const rows = getGuessStatuses(
    state.guesses,
    state.currentGuess,
    state.solution
  );

  const currentRowIndex = state.guesses.length;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Game board */}
      <WordleBoard
        rows={rows}
        currentRowIndex={currentRowIndex}
        isInvalidGuess={isInvalidGuess}
      />

      {/* Keyboard */}
      <WordleKeyboard
        keyboardStatus={state.keyboardStatus}
        onKeyPress={handleKeyPress}
        disabled={state.gameStatus !== "playing"}
      />

      {/* Result modal */}
      <Modal
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        title={state.gameStatus === "won" ? "Congratulations!" : "Game Over"}
      >
        <div className="text-center">
          {state.gameStatus === "won" ? (
            <p className="text-lg mb-4">
              You got it in{" "}
              <span className="font-bold">{state.guesses.length}</span>{" "}
              {state.guesses.length === 1 ? "guess" : "guesses"}!
            </p>
          ) : (
            <p className="text-lg mb-4">
              The word was{" "}
              <span className="font-bold">{state.solution}</span>
            </p>
          )}

          <div className="flex flex-col gap-2">
            <Button onClick={() => setShowResult(false)}>Close</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
