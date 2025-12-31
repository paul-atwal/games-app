import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CrosswordGameState, CrosswordAction } from "@/lib/games/crossword/types";
import { createInitialState, crosswordReducer } from "@/lib/games/crossword/engine";
import { getTodaysPuzzle } from "@/data/crossword-puzzles";

interface CrosswordStore {
  state: CrosswordGameState;
  lastPlayedDate: string | null;
  lastPuzzleId: string | null;
  dispatch: (action: CrosswordAction) => void;
  checkAndResetDaily: () => void;
}

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export const useCrosswordStore = create<CrosswordStore>()(
  persist(
    (set, get) => ({
      state: createInitialState(getTodaysPuzzle()),
      lastPlayedDate: null,
      lastPuzzleId: null,

      dispatch: (action: CrosswordAction) => {
        set((store) => ({
          state: crosswordReducer(store.state, action),
          lastPlayedDate: getTodayString(),
          lastPuzzleId: store.state.puzzle.id,
        }));
      },

      checkAndResetDaily: () => {
        const today = getTodayString();
        const todaysPuzzle = getTodaysPuzzle();
        const { lastPuzzleId, state } = get();

        // If it's a new puzzle, reset the game
        if (lastPuzzleId !== todaysPuzzle.id || state.puzzle.id !== todaysPuzzle.id) {
          set({
            state: createInitialState(todaysPuzzle),
            lastPlayedDate: today,
            lastPuzzleId: todaysPuzzle.id,
          });
        }
      },
    }),
    {
      name: "crossword-storage",
      partialize: (state) => ({
        state: {
          ...state.state,
          // Convert dates to strings for storage
          startedAt: state.state.startedAt?.toISOString() || null,
          completedAt: state.state.completedAt?.toISOString() || null,
        },
        lastPlayedDate: state.lastPlayedDate,
        lastPuzzleId: state.lastPuzzleId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.state) {
          // Convert date strings back to Date objects
          if (state.state.startedAt) {
            state.state.startedAt = new Date(state.state.startedAt as unknown as string);
          }
          if (state.state.completedAt) {
            state.state.completedAt = new Date(state.state.completedAt as unknown as string);
          }
        }
      },
    }
  )
);
