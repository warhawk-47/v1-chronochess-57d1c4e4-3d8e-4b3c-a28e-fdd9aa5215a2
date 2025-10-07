import { DurableObject } from "cloudflare:workers";
import type { GameSession, PlayerId, Square, PieceType, ApiResponse, PlayerColor } from "@shared/types";
import { getInitialGameState, makeMove, getValidMoves, getGameStatus } from "../src/lib/chess-logic";

export class GlobalDurableObject extends DurableObject {
  async getGameSession(gameId: string): Promise<GameSession | undefined> {
    return this.ctx.storage.get<GameSession>(`game:${gameId}`);
  }
  async saveGameSession(gameId: string, session: GameSession): Promise<void> {
    await this.ctx.storage.put(`game:${gameId}`, session);
  }
  async createGame(playerId: PlayerId): Promise<ApiResponse<{gameId: string;playerColor: PlayerColor;}>> {
    const gameId = crypto.randomUUID();
    const initialGameState = getInitialGameState();
    const session: GameSession = {
      ...initialGameState,
      gameId,
      gameStatus: 'waiting',
      players: {
        w: playerId,
        b: null
      }
    };
    await this.saveGameSession(gameId, session);
    return { success: true, data: { gameId, playerColor: 'w' } };
  }
  async joinGame(gameId: string, playerId: PlayerId): Promise<ApiResponse<{playerColor: PlayerColor;}>> {
    const session = await this.getGameSession(gameId);
    if (!session) {
      return { success: false, error: "Game not found" };
    }
    if (session.players.w === playerId || session.players.b === playerId) {
      const playerColor = session.players.w === playerId ? 'w' : 'b';
      return { success: true, data: { playerColor } };
    }
    if (session.players.b) {
      return { success: false, error: "Game is full" };
    }
    session.players.b = playerId;
    session.gameStatus = 'ongoing';
    await this.saveGameSession(gameId, session);
    return { success: true, data: { playerColor: 'b' } };
  }
  async getGameState(gameId: string): Promise<ApiResponse<GameSession>> {
    const session = await this.getGameSession(gameId);
    if (!session) {
      return { success: false, error: "Game not found" };
    }
    return { success: true, data: session };
  }
  async makeMove(gameId: string, playerId: PlayerId, from: Square, to: Square, promotion: PieceType = 'queen'): Promise<ApiResponse<GameSession>> {
    const session = await this.getGameSession(gameId);
    if (!session) {
      return { success: false, error: "Game not found" };
    }
    const playerColor = session.players.w === playerId ? 'w' : session.players.b === playerId ? 'b' : null;
    if (!playerColor) {
      return { success: false, error: "Player not in this game" };
    }
    if (session.currentPlayer !== playerColor) {
      return { success: false, error: "Not your turn" };
    }
    const validMoves = getValidMoves(session, from);
    if (!validMoves.includes(to)) {
      return { success: false, error: "Invalid move" };
    }
    const nextState = makeMove(session, from, to, promotion);
    const gameStatus = getGameStatus(nextState);
    const updatedSession: GameSession = {
      ...session,
      ...nextState,
      gameStatus
    };
    await this.saveGameSession(gameId, updatedSession);
    return { success: true, data: updatedSession };
  }
}