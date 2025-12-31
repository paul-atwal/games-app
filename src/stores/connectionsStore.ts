import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ConnectionsGameState, ConnectionsAction } from "@/lib/games/connections/types";
import { createInitialState, connectionsReducer } from "@/lib/games/connections/engine";
import { getTodaysPuzzle } from "@/data/connections-puzzles";

interface ConnectionsStore {
  state: ConnectionsGameState;
  lastPlayedDate: string | null;
  lastPuzzleId: string | null;
  dispatch: (action: ConnectionsAction) => void;
  checkAndResetDaily: () => void;
}

function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const useConnectionsStore = create<ConnectionsStore>()(
  persist(
    (set, get) => ({
      state: createInitialState(getTodaysPuzzle()),
      lastPlayedDate: null,
      lastPuzzleId: null,

      dispatch: (action: ConnectionsAction) => {
        set((store) => ({
          state: connectionsReducer(store.state, action),
          lastPlayedDate: getTodayString(),
          lastPuzzleId: store.state.puzzle.id,
        }));
      },

      checkAndResetDaily: () => {
        const today = getTodayString();
        const todaysPuzzle = getTodaysPuzzle();
        const { lastPuzzleId, lastPlayedDate, state } = get();

        // If it's a new puzzle, reset the game
        if (
          lastPlayedDate !== today ||
          lastPuzzleId !== todaysPuzzle.id ||
          state.puzzle.id !== todaysPuzzle.id
        ) {
          set({
            state: createInitialState(todaysPuzzle),
            lastPlayedDate: today,
            lastPuzzleId: todaysPuzzle.id,
          });
        }
      },
    }),
    {
      name: "connections-storage",
      partialize: (state) => ({
        state: state.state,
        lastPlayedDate: state.lastPlayedDate,
        lastPuzzleId: state.lastPuzzleId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.checkAndResetDaily?.();
      },
    }
  )
);
