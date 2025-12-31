"use client";

import { useCallback, useState, useEffect } from "react";
import { ConnectionsBoard } from "./ConnectionsBoard";
import { ConnectionsMistakes } from "./ConnectionsMistakes";
import { ConnectionsCategory } from "./ConnectionsCategory";
import { useConnectionsStore } from "@/stores/connectionsStore";
import { isOneAway } from "@/lib/games/connections/engine";
import { Button } from "@/components/ui";

export function ConnectionsGame() {
  const { state, dispatch, checkAndResetDaily } = useConnectionsStore();
  const { puzzle, remainingWords, selectedWords, solvedCategories, mistakes, status } = state;

  const [message, setMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  // Check for new daily puzzle on mount
  useEffect(() => {
    checkAndResetDaily();
  }, [checkAndResetDaily]);

  // Handle word click
  const handleWordClick = useCallback(
    (word: string) => {
      if (status !== "playing") return;

      if (selectedWords.includes(word)) {
        dispatch({ type: "DESELECT_WORD", word });
      } else if (selectedWords.length < 4) {
        dispatch({ type: "SELECT_WORD", word });
      }
    },
    [dispatch, selectedWords, status]
  );

  // Handle submit
  const handleSubmit = useCallback(() => {
    if (selectedWords.length !== 4) return;

    // Check if one away before submitting
    const oneAway = isOneAway(selectedWords, puzzle);

    dispatch({ type: "SUBMIT_GUESS" });

    // Show feedback message
    if (oneAway) {
      setMessage("One away...");
      setIsShaking(true);
      setTimeout(() => {
        setMessage(null);
        setIsShaking(false);
      }, 1500);
    } else {
      // Check if it was correct by seeing if solvedCategories changed
      // This is a bit hacky - we'll check after the state updates
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  }, [dispatch, selectedWords, puzzle]);

  const handleShuffle = () => dispatch({ type: "SHUFFLE" });
  const handleClear = () => dispatch({ type: "CLEAR_SELECTION" });
  const handleReset = () => dispatch({ type: "RESET" });

  // Get remaining unsolved categories for end-game display
  const unsolvedCategories = puzzle.categories.filter(
    (cat) => !solvedCategories.some((solved) => solved.name === cat.name)
  );

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-serif text-xl md:text-2xl font-bold">Connections</h2>
        <p className="text-sm text-gray-500 mt-1">
          Group the 16 words into 4 categories of 4
        </p>
      </div>

      {/* Message display */}
      {message && (
        <div className="text-center py-2 px-4 bg-yellow-100 text-yellow-800 rounded-lg font-medium">
          {message}
        </div>
      )}

      {/* Game board */}
      <div className={isShaking ? "animate-[shake_0.5s_ease-in-out]" : ""}>
        <ConnectionsBoard
          remainingWords={remainingWords}
          selectedWords={selectedWords}
          solvedCategories={solvedCategories}
          onWordClick={handleWordClick}
          disabled={status !== "playing"}
        />
      </div>

      {/* Show unsolved categories when game is over */}
      {status === "lost" && unsolvedCategories.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-500 text-center">The answers were:</p>
          {unsolvedCategories.map((category) => (
            <ConnectionsCategory key={category.name} category={category} />
          ))}
        </div>
      )}

      {/* Mistakes indicator */}
      {status === "playing" && (
        <div className="flex justify-center">
          <ConnectionsMistakes mistakes={mistakes} />
        </div>
      )}

      {/* Controls */}
      {status === "playing" && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={handleShuffle}>
            Shuffle
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={selectedWords.length === 0}
          >
            Deselect All
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedWords.length !== 4}
          >
            Submit
          </Button>
        </div>
      )}

      {/* Game over messages */}
      {status === "won" && (
        <div className="text-center bg-green-100 text-green-800 rounded-lg px-4 py-3">
          <p className="font-bold text-lg">Congratulations!</p>
          <p className="text-sm">You found all the connections!</p>
        </div>
      )}

      {status === "lost" && (
        <div className="text-center bg-red-100 text-red-800 rounded-lg px-4 py-3">
          <p className="font-bold text-lg">Game Over</p>
          <p className="text-sm">Better luck next time!</p>
        </div>
      )}

      {/* Reset button when game is over */}
      {status !== "playing" && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={handleReset}>
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
}
