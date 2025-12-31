import type { LetterStatus, WordleGameState, GameStatus } from "@/types/games";
import { getTodaysWord, isValidWord } from "./words";

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

export function createInitialState(solution?: string): WordleGameState {
  return {
    solution: solution || getTodaysWord(),
    guesses: [],
    currentGuess: "",
    gameStatus: "playing",
    keyboardStatus: {},
  };
}

export function evaluateGuess(
  guess: string,
  solution: string
): LetterStatus[] {
  const result: LetterStatus[] = Array(WORD_LENGTH).fill("absent");
  const solutionChars = solution.split("");
  const guessChars = guess.split("");

  // First pass: mark correct letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessChars[i] === solutionChars[i]) {
      result[i] = "correct";
      solutionChars[i] = "#"; // Mark as used
    }
  }

  // Second pass: mark present letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] !== "correct") {
      const index = solutionChars.indexOf(guessChars[i]);
      if (index !== -1) {
        result[i] = "present";
        solutionChars[index] = "#"; // Mark as used
      }
    }
  }

  return result;
}

export function updateKeyboardStatus(
  currentStatus: Record<string, LetterStatus>,
  guess: string,
  evaluation: LetterStatus[]
): Record<string, LetterStatus> {
  const newStatus = { ...currentStatus };

  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i];
    const status = evaluation[i];

    // Only upgrade status (correct > present > absent)
    if (
      !newStatus[letter] ||
      status === "correct" ||
      (status === "present" && newStatus[letter] === "absent")
    ) {
      newStatus[letter] = status;
    }
  }

  return newStatus;
}

export type WordleAction =
  | { type: "ADD_LETTER"; letter: string }
  | { type: "REMOVE_LETTER" }
  | { type: "SUBMIT_GUESS" }
  | { type: "RESET"; solution?: string };

export function wordleReducer(
  state: WordleGameState,
  action: WordleAction
): WordleGameState {
  switch (action.type) {
    case "ADD_LETTER": {
      if (state.gameStatus !== "playing") return state;
      if (state.currentGuess.length >= WORD_LENGTH) return state;

      return {
        ...state,
        currentGuess: state.currentGuess + action.letter.toUpperCase(),
      };
    }

    case "REMOVE_LETTER": {
      if (state.gameStatus !== "playing") return state;
      if (state.currentGuess.length === 0) return state;

      return {
        ...state,
        currentGuess: state.currentGuess.slice(0, -1),
      };
    }

    case "SUBMIT_GUESS": {
      if (state.gameStatus !== "playing") return state;
      if (state.currentGuess.length !== WORD_LENGTH) return state;

      // Check if word is valid
      if (!isValidWord(state.currentGuess)) {
        return state; // Invalid word, don't submit
      }

      const evaluation = evaluateGuess(state.currentGuess, state.solution);
      const newGuesses = [...state.guesses, state.currentGuess];
      const newKeyboardStatus = updateKeyboardStatus(
        state.keyboardStatus,
        state.currentGuess,
        evaluation
      );

      // Check win/lose conditions
      let newStatus: GameStatus = "playing";
      if (state.currentGuess === state.solution) {
        newStatus = "won";
      } else if (newGuesses.length >= MAX_GUESSES) {
        newStatus = "lost";
      }

      return {
        ...state,
        guesses: newGuesses,
        currentGuess: "",
        gameStatus: newStatus,
        keyboardStatus: newKeyboardStatus,
      };
    }

    case "RESET": {
      return createInitialState(action.solution);
    }

    default:
      return state;
  }
}

// Helper to get tile statuses for display
export function getGuessStatuses(
  guesses: string[],
  currentGuess: string,
  solution: string
): { letter: string; status: LetterStatus }[][] {
  const rows: { letter: string; status: LetterStatus }[][] = [];

  // Add completed guesses
  for (const guess of guesses) {
    const evaluation = evaluateGuess(guess, solution);
    rows.push(
      guess.split("").map((letter, i) => ({
        letter,
        status: evaluation[i],
      }))
    );
  }

  // Add current guess row
  if (guesses.length < MAX_GUESSES) {
    const currentRow = [];
    for (let i = 0; i < WORD_LENGTH; i++) {
      currentRow.push({
        letter: currentGuess[i] || "",
        status: currentGuess[i] ? ("tbd" as LetterStatus) : ("empty" as LetterStatus),
      });
    }
    rows.push(currentRow);
  }

  // Add empty rows
  while (rows.length < MAX_GUESSES) {
    rows.push(
      Array(WORD_LENGTH)
        .fill(null)
        .map(() => ({ letter: "", status: "empty" as LetterStatus }))
    );
  }

  return rows;
}
