import type { BoardState, GameState, Piece, Player, Square, PieceType, GameStatus } from '@shared/types';

const SQUARES: Square[] = ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8', 'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7', 'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6', 'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5', 'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4', 'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3', 'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'];

export const getInitialGameState = (): GameState => ({
  boardState: {
    'a8': { type: 'rook', player: 'b' }, 'b8': { type: 'knight', player: 'b' }, 'c8': { type: 'bishop', player: 'b' }, 'd8': { type: 'queen', player: 'b' }, 'e8': { type: 'king', player: 'b' }, 'f8': { type: 'bishop', player: 'b' }, 'g8': { type: 'knight', player: 'b' }, 'h8': { type: 'rook', player: 'b' },
    'a7': { type: 'pawn', player: 'b' }, 'b7': { type: 'pawn', player: 'b' }, 'c7': { type: 'pawn', player: 'b' }, 'd7': { type: 'pawn', player: 'b' }, 'e7': { type: 'pawn', player: 'b' }, 'f7': { type: 'pawn', player: 'b' }, 'g7': { type: 'pawn', player: 'b' }, 'h7': { type: 'pawn', player: 'b' },
    'a2': { type: 'pawn', player: 'w' }, 'b2': { type: 'pawn', player: 'w' }, 'c2': { type: 'pawn', player: 'w' }, 'd2': { type: 'pawn', player: 'w' }, 'e2': { type: 'pawn', player: 'w' }, 'f2': { type: 'pawn', player: 'w' }, 'g2': { type: 'pawn', player: 'w' }, 'h2': { type: 'pawn', player: 'w' },
    'a1': { type: 'rook', player: 'w' }, 'b1': { type: 'knight', player: 'w' }, 'c1': { type: 'bishop', player: 'w' }, 'd1': { type: 'queen', player: 'w' }, 'e1': { type: 'king', player: 'w' }, 'f1': { type: 'bishop', player: 'w' }, 'g1': { type: 'knight', player: 'w' }, 'h1': { type: 'rook', player: 'w' }
  },
  currentPlayer: 'w',
  gameStatus: 'ongoing',
  capturedPieces: { w: [], b: [] },
  moveHistory: [],
  castlingRights: {
    w: { kingSide: true, queenSide: true },
    b: { kingSide: true, queenSide: true }
  },
  enPassantTarget: null
});
const squareToCoords = (square: Square): [number, number] => {
  const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = 8 - parseInt(square[1], 10);
  return [rank, file];
};
const coordsToSquare = (rank: number, file: number): Square | null => {
  if (rank < 0 || rank > 7 || file < 0 || file > 7) return null;
  return `${String.fromCharCode('a'.charCodeAt(0) + file)}${8 - rank}` as Square;
};
const getPseudoLegalMoves = (boardState: BoardState, square: Square, enPassantTarget: Square | null, castlingRights: GameState['castlingRights']): Square[] => {
  const piece = boardState[square];
  if (!piece) return [];
  const [rank, file] = squareToCoords(square);
  const moves: Square[] = [];
  const player = piece.player;
  const addMove = (r: number, f: number) => {
    const targetSquare = coordsToSquare(r, f);
    if (!targetSquare) return;
    const targetPiece = boardState[targetSquare];
    if (!targetPiece || targetPiece.player !== player) {
      moves.push(targetSquare);
    }
  };
  const addSlidingMoves = (directions: [number, number][]) => {
    for (const [dr, df] of directions) {
      for (let i = 1; i < 8; i++) {
        const newRank = rank + i * dr;
        const newFile = file + i * df;
        const targetSquare = coordsToSquare(newRank, newFile);
        if (!targetSquare) break;
        const targetPiece = boardState[targetSquare];
        if (targetPiece) {
          if (targetPiece.player !== player) moves.push(targetSquare);
          break;
        }
        moves.push(targetSquare);
      }
    }
  };
  switch (piece.type) {
    case 'pawn':{
        const dir = player === 'w' ? -1 : 1;
        const startRank = player === 'w' ? 6 : 1;
        const oneStep = coordsToSquare(rank + dir, file);
        if (oneStep && !boardState[oneStep]) {
          moves.push(oneStep);
          if (rank === startRank) {
            const twoSteps = coordsToSquare(rank + 2 * dir, file);
            if (twoSteps && !boardState[twoSteps]) {
              moves.push(twoSteps);
            }
          }
        }
        for (const df of [-1, 1]) {
          const targetSquare = coordsToSquare(rank + dir, file + df);
          if (targetSquare) {
            const targetPiece = boardState[targetSquare];
            if (targetPiece && targetPiece.player !== player) {
              moves.push(targetSquare);
            }
            if (targetSquare === enPassantTarget) {
              moves.push(targetSquare);
            }
          }
        }
        break;
      }
    case 'knight':
      for (const [dr, df] of [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]) {
        addMove(rank + dr, file + df);
      }
      break;
    case 'bishop':
      addSlidingMoves([[-1, -1], [-1, 1], [1, -1], [1, 1]]);
      break;
    case 'rook':
      addSlidingMoves([[-1, 0], [1, 0], [0, -1], [0, 1]]);
      break;
    case 'queen':
      addSlidingMoves([[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]]);
      break;
    case 'king':
      for (const [dr, df] of [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]) {
        addMove(rank + dr, file + df);
      }

      if (castlingRights[player].kingSide) {
        const gSquare = coordsToSquare(rank, file + 1);
        const fSquare = coordsToSquare(rank, file + 2);
        if (gSquare && fSquare && !boardState[gSquare] && !boardState[fSquare]) {
          moves.push(fSquare);
        }
      }
      if (castlingRights[player].queenSide) {
        const dSquare = coordsToSquare(rank, file - 1);
        const cSquare = coordsToSquare(rank, file - 2);
        const bSquare = coordsToSquare(rank, file - 3);
        if (dSquare && cSquare && bSquare && !boardState[dSquare] && !boardState[cSquare] && !boardState[bSquare]) {
          moves.push(cSquare);
        }
      }
      break;
  }
  return moves;
};
export const isSquareAttacked = (gameState: GameState, square: Square, byPlayer: Player): boolean => {
  for (const s of SQUARES) {
    const piece = gameState.boardState[s as Square];
    if (piece && piece.player === byPlayer) {
      const moves = getPseudoLegalMoves(gameState.boardState, s as Square, gameState.enPassantTarget, gameState.castlingRights);
      if (moves.includes(square)) {
        return true;
      }
    }
  }
  return false;
};
const findKing = (boardState: BoardState, player: Player): Square | null => {
  for (const s of SQUARES) {
    const piece = boardState[s as Square];
    if (piece && piece.type === 'king' && piece.player === player) {
      return s as Square;
    }
  }
  return null;
};
export const isKingInCheck = (gameState: GameState, player: Player): boolean => {
  const kingSquare = findKing(gameState.boardState, player);
  if (!kingSquare) return false;
  return isSquareAttacked(gameState, kingSquare, player === 'w' ? 'b' : 'w');
};
export const getValidMoves = (gameState: GameState, square: Square): Square[] => {
  const piece = gameState.boardState[square];
  if (!piece || piece.player !== gameState.currentPlayer) return [];
  const pseudoLegalMoves = getPseudoLegalMoves(gameState.boardState, square, gameState.enPassantTarget, gameState.castlingRights);
  const validMoves: Square[] = [];
  for (const move of pseudoLegalMoves) {
    const tempGameState = makeMove(gameState, square, move, 'queen', true);
    if (!isKingInCheck(tempGameState, gameState.currentPlayer)) {
      validMoves.push(move);
    }
  }

  if (piece.type === 'king') {
    const [rank, file] = squareToCoords(square);
    const opponent = gameState.currentPlayer === 'w' ? 'b' : 'w';
    if (isKingInCheck(gameState, gameState.currentPlayer)) return validMoves.filter((m) => !['c1', 'g1', 'c8', 'g8'].includes(m));
    const kingSideMove = coordsToSquare(rank, file + 2);
    if (kingSideMove && pseudoLegalMoves.includes(kingSideMove)) {
      const transitSquare = coordsToSquare(rank, file + 1);
      if (transitSquare && isSquareAttacked(gameState, transitSquare, opponent)) {
        const index = validMoves.indexOf(kingSideMove);
        if (index > -1) validMoves.splice(index, 1);
      }
    }
    const queenSideMove = coordsToSquare(rank, file - 2);
    if (queenSideMove && pseudoLegalMoves.includes(queenSideMove)) {
      const transitSquare = coordsToSquare(rank, file - 1);
      if (transitSquare && isSquareAttacked(gameState, transitSquare, opponent)) {
        const index = validMoves.indexOf(queenSideMove);
        if (index > -1) validMoves.splice(index, 1);
      }
    }
  }
  return validMoves;
};
export const makeMove = (
gameState: GameState,
from: Square,
to: Square,
promotion: PieceType = 'queen',
isTemporary: boolean = false)
: GameState => {
  const newGameState = JSON.parse(JSON.stringify(gameState)) as GameState;
  const piece = newGameState.boardState[from];
  if (!piece) return gameState;
  const capturedPiece = newGameState.boardState[to];
  if (capturedPiece && !isTemporary) {
    newGameState.capturedPieces[piece.player === 'w' ? 'b' : 'w'].push(capturedPiece);
  }
  if (piece.type === 'pawn' && to === newGameState.enPassantTarget) {
    const dir = piece.player === 'w' ? 1 : -1;
    const [toRank, toFile] = squareToCoords(to);
    const capturedPawnSquare = coordsToSquare(toRank + dir, toFile);
    if (capturedPawnSquare) {
      const capturedPawn = newGameState.boardState[capturedPawnSquare];
      if (capturedPawn && !isTemporary) {
        newGameState.capturedPieces[piece.player === 'w' ? 'b' : 'w'].push(capturedPawn);
      }
      delete newGameState.boardState[capturedPawnSquare];
    }
  }
  newGameState.boardState[to] = piece;
  delete newGameState.boardState[from];
  const [toRank] = squareToCoords(to);
  if (piece.type === 'pawn' && (toRank === 0 || toRank === 7)) {
    newGameState.boardState[to] = { type: promotion, player: piece.player };
  }
  if (piece.type === 'king') {
    const [fromFile] = squareToCoords(from);
    const [toFile] = squareToCoords(to);
    if (Math.abs(fromFile - toFile) === 2) {
      const rookFile = toFile > fromFile ? 7 : 0;
      const newRookFile = toFile > fromFile ? 5 : 3;
      const rookSquare = coordsToSquare(toRank, rookFile);
      const newRookSquare = coordsToSquare(toRank, newRookFile);
      if (rookSquare && newRookSquare && newGameState.boardState[rookSquare]) {
        newGameState.boardState[newRookSquare] = newGameState.boardState[rookSquare];
        delete newGameState.boardState[rookSquare];
      }
    }
  }
  if (piece.type === 'king') {
    newGameState.castlingRights[piece.player].kingSide = false;
    newGameState.castlingRights[piece.player].queenSide = false;
  }
  if (piece.type === 'rook') {
    if (from === 'h1' || from === 'h8') newGameState.castlingRights[piece.player].kingSide = false;
    if (from === 'a1' || from === 'a8') newGameState.castlingRights[piece.player].queenSide = false;
  }
  const opponent = piece.player === 'w' ? 'b' : 'w';
  if (capturedPiece?.type === 'rook') {
    if (to === 'h1' || to === 'h8') newGameState.castlingRights[opponent].kingSide = false;
    if (to === 'a1' || to === 'a8') newGameState.castlingRights[opponent].queenSide = false;
  }
  const [fromRank] = squareToCoords(from);
  const [toRank_] = squareToCoords(to);
  if (piece.type === 'pawn' && Math.abs(fromRank - toRank_) === 2) {
    const dir = piece.player === 'w' ? 1 : -1;
    newGameState.enPassantTarget = coordsToSquare(fromRank + dir, squareToCoords(from)[1]);
  } else {
    newGameState.enPassantTarget = null;
  }
  if (!isTemporary) {
    newGameState.currentPlayer = opponent;
    newGameState.moveHistory.push({ from, to, piece });
  }
  return newGameState;
};
export const getGameStatus = (gameState: GameState): GameStatus => {
  const { currentPlayer } = gameState;
  let hasValidMoves = false;
  for (const square of SQUARES) {
    const piece = gameState.boardState[square as Square];
    if (piece && piece.player === currentPlayer) {
      if (getValidMoves(gameState, square as Square).length > 0) {
        hasValidMoves = true;
        break;
      }
    }
  }
  const inCheck = isKingInCheck(gameState, currentPlayer);
  if (!hasValidMoves) {
    return inCheck ? 'checkmate' : 'stalemate';
  }
  return inCheck ? 'check' : 'ongoing';
};