import { useGameStore, useGameActions } from '@/store/game-store';
import type { Square } from '@shared/types';
import { ChessPiece } from './ChessPiece';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export function Chessboard() {
  const boardState = useGameStore((state) => state.boardState);
  const selectedSquare = useGameStore((state) => state.selectedSquare);
  const validMoves = useGameStore((state) => state.validMoves);
  const playerColor = useGameStore((state) => state.playerColor);
  const currentPlayer = useGameStore((state) => state.currentPlayer);
  const { selectSquare } = useGameActions();
  const handleSquareClick = (square: Square) => {
    const piece = boardState[square];
    // Allow selection/deselection only if it's the player's turn
    if (playerColor === currentPlayer) {
      // Allow selecting own piece or moving to a valid square
      if ((piece && piece.player === playerColor) || validMoves.includes(square)) {
        selectSquare(square);
      } else if (selectedSquare) {
        // Allow deselecting by clicking an invalid square
        selectSquare(square);
      }
    }
  };
  return (
    <div className="grid grid-cols-8 grid-rows-8 aspect-square w-full max-w-[calc(100vh-12rem)] border-4 border-retro-neon-cyan shadow-neon-cyan">
      {ranks.flatMap((rank) =>
        files.map((file, fileIndex) => {
          const square = `${file}${rank}` as Square;
          const piece = boardState[square];
          const isLight = (ranks.indexOf(rank) + fileIndex) % 2 === 0;
          const isSelected = selectedSquare === square;
          const isValidMove = validMoves.includes(square);
          return (
            <div
              key={square}
              onClick={() => handleSquareClick(square)}
              className={cn(
                'relative flex items-center justify-center aspect-square',
                isLight ? 'bg-retro-light/80' : 'bg-retro-dark/80',
                playerColor === currentPlayer && 'cursor-pointer hover:bg-retro-neon-cyan/30 transition-colors duration-200'
              )}
            >
              <AnimatePresence>
                {piece && <ChessPiece piece={piece} isSelected={isSelected} />}
              </AnimatePresence>
              {isValidMove && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="w-1/3 h-1/3 rounded-full bg-retro-neon-cyan/50 animate-glow" />
                </motion.div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}