import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WordleGameState } from "@/types/games";
import {
  createInitialState,
  wordleReducer,
  type WordleAction,
} from "@/lib/games/wordle/engine";
import { getTodaysWord } from "@/lib/games/wordle/words";

interface WordleStore {
  state: WordleGameState;
  lastPlayedDate: string | null;
  dispatch: (action: WordleAction) => void;
  checkAndResetDaily: () => void;
}

function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const useWordleStore = create<WordleStore>()(
  persist(
    (set, get) => ({
      state: createInitialState(),
      lastPlayedDate: null,

      dispatch: (action: WordleAction) => {
        set((store) => ({
          state: wordleReducer(store.state, action),
          lastPlayedDate: getTodayString(),
        }));
      },

      checkAndResetDaily: () => {
        const today = getTodayString();
        const { lastPlayedDate, state } = get();

        // If it's a new day, reset the game
        if (lastPlayedDate !== today) {
          const todaysWord = getTodaysWord();
          set({
            state: createInitialState(todaysWord),
            lastPlayedDate: today,
          });
        } else if (state.solution !== getTodaysWord()) {
          // Solution mismatch (shouldn't happen, but just in case)
          set({
            state: createInitialState(getTodaysWord()),
            lastPlayedDate: today,
          });
        }
      },
    }),
    {
      name: "wordle-storage",
      partialize: (state) => ({
        state: state.state,
        lastPlayedDate: state.lastPlayedDate,
      }),
    }
  )
);
