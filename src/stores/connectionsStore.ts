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
  return new Date().toISOString().split("T")[0];
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
      name: "connections-storage",
      partialize: (state) => ({
        state: state.state,
        lastPlayedDate: state.lastPlayedDate,
        lastPuzzleId: state.lastPuzzleId,
      }),
    }
  )
);
