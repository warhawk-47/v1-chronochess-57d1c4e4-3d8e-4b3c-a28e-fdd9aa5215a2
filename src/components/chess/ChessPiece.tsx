import type { Piece } from '@shared/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
interface ChessPieceProps {
  piece: Piece;
  isSelected: boolean;
}
const pieceMap: Record<Piece['type'], string> = {
  pawn: '♙',
  rook: '♖',
  knight: '♘',
  bishop: '♗',
  queen: '♕',
  king: '♔',
};
export function ChessPiece({ piece, isSelected }: ChessPieceProps) {
  const pieceSymbol = pieceMap[piece.type];
  const colorClass = piece.player === 'w' ? 'text-retro-light' : 'text-retro-dark';
  return (
    <motion.div
      layoutId={`piece-${piece.type}-${piece.player}`}
      className={cn(
        'w-full h-full flex items-center justify-center text-5xl md:text-6xl cursor-pointer drop-shadow-lg',
        colorClass
      )}
      animate={{
        y: isSelected ? -10 : 0,
        scale: isSelected ? 1.1 : 1,
        textShadow: isSelected ? '0 0 15px var(--retro-neon-cyan)' : 'none',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {pieceSymbol}
    </motion.div>
  );
}