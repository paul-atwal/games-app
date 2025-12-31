import type {
  ConnectionsPuzzle,
  ConnectionsGameState,
  ConnectionsAction,
  ConnectionCategory,
} from "./types";

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function createInitialState(puzzle: ConnectionsPuzzle): ConnectionsGameState {
  // Collect all words and shuffle them
  const allWords = puzzle.categories.flatMap((cat) => cat.words);
  const shuffledWords = shuffleArray(allWords);

  return {
    puzzle,
    remainingWords: shuffledWords,
    selectedWords: [],
    solvedCategories: [],
    mistakes: 0,
    status: "playing",
    guessHistory: [],
  };
}

function checkGuess(
  selectedWords: string[],
  puzzle: ConnectionsPuzzle
): { correct: boolean; category?: ConnectionCategory; isOneAway?: boolean } {
  // Sort selected words for consistent comparison
  const sortedSelected = [...selectedWords].sort();

  for (const category of puzzle.categories) {
    const sortedCategory = [...category.words].sort();

    // Check for exact match
    if (
      sortedSelected.length === sortedCategory.length &&
      sortedSelected.every((word, i) => word === sortedCategory[i])
    ) {
      return { correct: true, category };
    }

    // Check for "one away" (3 out of 4 correct)
    const matchCount = sortedSelected.filter((word) =>
      sortedCategory.includes(word)
    ).length;
    if (matchCount === 3) {
      return { correct: false, isOneAway: true };
    }
  }

  return { correct: false, isOneAway: false };
}

function hasAlreadyGuessed(guessHistory: string[][], selectedWords: string[]): boolean {
  const sortedSelected = [...selectedWords].sort().join(",");
  return guessHistory.some(
    (guess) => [...guess].sort().join(",") === sortedSelected
  );
}

export function connectionsReducer(
  state: ConnectionsGameState,
  action: ConnectionsAction
): ConnectionsGameState {
  switch (action.type) {
    case "SELECT_WORD": {
      if (state.status !== "playing") return state;
      if (state.selectedWords.length >= 4) return state;
      if (state.selectedWords.includes(action.word)) return state;
      if (!state.remainingWords.includes(action.word)) return state;

      return {
        ...state,
        selectedWords: [...state.selectedWords, action.word],
      };
    }

    case "DESELECT_WORD": {
      if (state.status !== "playing") return state;

      return {
        ...state,
        selectedWords: state.selectedWords.filter((w) => w !== action.word),
      };
    }

    case "CLEAR_SELECTION": {
      return {
        ...state,
        selectedWords: [],
      };
    }

    case "SUBMIT_GUESS": {
      if (state.status !== "playing") return state;
      if (state.selectedWords.length !== 4) return state;

      // Check if already guessed
      if (hasAlreadyGuessed(state.guessHistory, state.selectedWords)) {
        return state; // Already guessed this combination
      }

      const result = checkGuess(state.selectedWords, state.puzzle);

      if (result.correct && result.category) {
        // Correct guess!
        const newSolvedCategories = [...state.solvedCategories, result.category];
        const newRemainingWords = state.remainingWords.filter(
          (w) => !state.selectedWords.includes(w)
        );

        const isWon = newSolvedCategories.length === 4;

        return {
          ...state,
          remainingWords: newRemainingWords,
          selectedWords: [],
          solvedCategories: newSolvedCategories,
          status: isWon ? "won" : "playing",
        };
      } else {
        // Wrong guess
        const newMistakes = state.mistakes + 1;
        const isLost = newMistakes >= 4;

        return {
          ...state,
          selectedWords: [],
          mistakes: newMistakes,
          status: isLost ? "lost" : "playing",
          guessHistory: [...state.guessHistory, [...state.selectedWords]],
        };
      }
    }

    case "SHUFFLE": {
      if (state.status !== "playing") return state;

      return {
        ...state,
        remainingWords: shuffleArray(state.remainingWords),
        selectedWords: [],
      };
    }

    case "RESET": {
      return createInitialState(state.puzzle);
    }

    default:
      return state;
  }
}

// Helper to check if a guess is "one away" from correct
export function isOneAway(selectedWords: string[], puzzle: ConnectionsPuzzle): boolean {
  if (selectedWords.length !== 4) return false;

  for (const category of puzzle.categories) {
    const matchCount = selectedWords.filter((word) =>
      category.words.includes(word)
    ).length;
    if (matchCount === 3) {
      return true;
    }
  }
  return false;
}
