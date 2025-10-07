import { Hono } from "hono";
import { Env } from './core-utils';
import type { Square, PieceType } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    app.post('/api/games/create', async (c) => {
        const { playerId } = await c.req.json<{ playerId: string }>();
        if (!playerId) return c.json({ success: false, error: 'Player ID is required' }, 400);
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const res = await stub.createGame(playerId);
        return c.json(res);
    });
    app.post('/api/games/:gameId/join', async (c) => {
        const gameId = c.req.param('gameId');
        const { playerId } = await c.req.json<{ playerId: string }>();
        if (!playerId) return c.json({ success: false, error: 'Player ID is required' }, 400);
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const res = await stub.joinGame(gameId, playerId);
        return c.json(res);
    });
    app.get('/api/games/:gameId', async (c) => {
        const gameId = c.req.param('gameId');
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const res = await stub.getGameState(gameId);
        return c.json(res);
    });
    app.post('/api/games/:gameId/move', async (c) => {
        const gameId = c.req.param('gameId');
        const { playerId, from, to, promotion } = await c.req.json<{ playerId: string; from: Square; to: Square; promotion?: PieceType }>();
        if (!playerId || !from || !to) return c.json({ success: false, error: 'Missing required fields' }, 400);
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const res = await stub.makeMove(gameId, playerId, from, to, promotion);
        return c.json(res);
    });
}