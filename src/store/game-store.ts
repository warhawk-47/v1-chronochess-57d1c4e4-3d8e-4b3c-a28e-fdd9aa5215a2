import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { GameState, Square, PieceType, Player, PlayerColor, GameSession, ApiResponse } from '@shared/types';
import { getInitialGameState, getValidMoves } from '@/lib/chess-logic';
import { toast } from 'sonner';
const getPlayerId = (): string => {
  let playerId = localStorage.getItem('chronoChessPlayerId');
  if (!playerId) {
    playerId = crypto.randomUUID();
    localStorage.setItem('chronoChessPlayerId', playerId);
  }
  return playerId;
};
interface GameStore extends GameState {
  gameId: string | null;
  playerId: string;
  playerColor: PlayerColor | null;
  isLoading: boolean;
  selectedSquare: Square | null;
  validMoves: Square[];
  actions: {
    createGame: () => Promise<void>;
    joinGame: (gameId: string) => Promise<void>;
    syncGameState: () => Promise<void>;
    selectSquare: (square: Square) => void;
    makeMove: (from: Square, to: Square) => Promise<void>;
    leaveGame: () => void;
  };
}
const initialState = {
  ...getInitialGameState(),
  gameId: null,
  playerId: getPlayerId(),
  playerColor: null,
  isLoading: false,
  selectedSquare: null,
  validMoves: [],
};
export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    ...initialState,
    actions: {
      createGame: async () => {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/games/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerId: get().playerId }),
          });
          const { success, data, error } = await res.json() as ApiResponse<{ gameId: string; playerColor: PlayerColor }>;
          if (success && data) {
            set({ gameId: data.gameId, playerColor: data.playerColor, gameStatus: 'waiting' });
            toast.success("Game created! Share the Game ID to play.");
            get().actions.syncGameState();
          } else {
            toast.error(error || "Failed to create game.");
          }
        } catch (e) {
          toast.error("An error occurred while creating the game.");
        } finally {
          set({ isLoading: false });
        }
      },
      joinGame: async (gameId) => {
        set({ isLoading: true });
        try {
          const res = await fetch(`/api/games/${gameId}/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerId: get().playerId }),
          });
          const { success, data, error } = await res.json() as ApiResponse<{ playerColor: PlayerColor }>;
          if (success && data) {
            set({ gameId, playerColor: data.playerColor });
            toast.success("Joined game successfully!");
            get().actions.syncGameState();
          } else {
            toast.error(error || "Failed to join game.");
          }
        } catch (e) {
          toast.error("An error occurred while joining the game.");
        } finally {
          set({ isLoading: false });
        }
      },
      syncGameState: async () => {
        const { gameId } = get();
        if (!gameId) return;
        try {
          const res = await fetch(`/api/games/${gameId}`);
          const { success, data, error } = await res.json() as ApiResponse<GameSession>;
          if (success && data) {
            set((state) => {
              Object.assign(state, data);
            });
          } else {
            console.error("Sync failed:", error);
          }
        } catch (e) {
          console.error("Sync error:", e);
        }
      },
      selectSquare: (square) => {
        const { selectedSquare, validMoves, boardState, currentPlayer, playerColor } = get();
        const piece = boardState[square];
        if (playerColor !== currentPlayer) {
            set({ selectedSquare: null, validMoves: [] });
            return;
        }
        if (selectedSquare) {
          if (validMoves.includes(square)) {
            get().actions.makeMove(selectedSquare, square);
          } else {
            set((state) => {
              if (piece && piece.player === currentPlayer) {
                state.selectedSquare = square;
                state.validMoves = getValidMoves(get(), square);
              } else {
                state.selectedSquare = null;
                state.validMoves = [];
              }
            });
          }
        } else if (piece && piece.player === currentPlayer) {
          set((state) => {
            state.selectedSquare = square;
            state.validMoves = getValidMoves(get(), square);
          });
        }
      },
      makeMove: async (from, to) => {
        const { gameId, playerId } = get();
        if (!gameId) return;
        set({ isLoading: true, selectedSquare: null, validMoves: [] });
        try {
          const res = await fetch(`/api/games/${gameId}/move`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerId, from, to }),
          });
          const { success, data, error } = await res.json() as ApiResponse<GameSession>;
          if (success && data) {
            set((state) => {
              Object.assign(state, data);
            });
          } else {
            toast.error(error || "Invalid move.");
            get().actions.syncGameState(); // Re-sync to correct local state
          }
        } catch (e) {
          toast.error("An error occurred while making a move.");
        } finally {
          set({ isLoading: false });
        }
      },
      leaveGame: () => {
        set(initialState);
        toast.info("You have left the game.");
      },
    },
  }))
);
export const useGameActions = () => useGameStore((state) => state.actions);