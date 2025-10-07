import { useGameStore, useGameActions } from '@/store/game-store';
import { Button } from '@/components/ui/button';
import type { Piece } from '@shared/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';
const pieceMap: Record<Piece['type'], string> = {
  pawn: '♙', rook: '♖', knight: '♘', bishop: '♗', queen: '♕', king: '♔',
};
function CapturedPieces({ pieces, player }: { pieces: Piece[], player: 'w' | 'b' }) {
  return (
    <div className="flex flex-wrap gap-1 min-h-[2rem]">
      {pieces.map((p, i) => (
        <span key={i} className={cn('text-2xl', player === 'w' ? 'text-retro-dark' : 'text-retro-light')}>
          {pieceMap[p.type]}
        </span>
      ))}
    </div>
  );
}
export function GameInfoPanel() {
  const { gameId, currentPlayer, gameStatus, capturedPieces, playerColor } = useGameStore();
  const { leaveGame } = useGameActions();
  const statusText = () => {
    const turnPlayer = currentPlayer === 'w' ? 'White' : 'Black';
    const isMyTurn = playerColor === currentPlayer;
    switch (gameStatus) {
      case 'waiting': return 'Waiting for opponent...';
      case 'check': return `${turnPlayer} is in Check! ${isMyTurn ? "(Your Turn)" : ""}`;
      case 'checkmate': return `Checkmate! ${currentPlayer === 'w' ? 'Black' : 'White'} wins!`;
      case 'stalemate': return 'Stalemate! It\'s a draw.';
      case 'draw': return 'Draw!';
      default: return `${turnPlayer}'s Turn ${isMyTurn ? "(Your Turn)" : ""}`;
    }
  };
  const copyGameId = () => {
    if (gameId) {
      navigator.clipboard.writeText(gameId);
      toast.success("Game ID copied to clipboard!");
    }
  };
  return (
    <div className="w-full md:w-80 flex flex-col space-y-6 p-6 bg-retro-dark/50 border-2 border-retro-neon-pink shadow-neon-pink rounded-lg">
      <h2 className="font-pixel text-3xl text-retro-neon-pink text-center tracking-wider">
        INFO
      </h2>
      {gameId && (
        <div className="text-center">
          <p className="font-pixel text-retro-light mb-2">GAME ID</p>
          <div className="flex items-center justify-center gap-2 p-2 bg-retro-dark/80 border border-retro-neon-cyan rounded">
            <p className="font-mono text-retro-neon-cyan truncate">{gameId}</p>
            <Button size="icon" variant="ghost" onClick={copyGameId} className="h-8 w-8 text-retro-neon-cyan hover:bg-retro-neon-cyan/20">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <div className="text-center font-mono text-lg p-3 border border-retro-neon-cyan rounded">
        <p className="text-retro-neon-cyan animate-pulse">{statusText()}</p>
      </div>
      <div>
        <h3 className="font-pixel text-xl text-retro-light mb-2">Captured (White)</h3>
        <div className="p-2 bg-retro-light/10 rounded min-h-[3rem]">
          <CapturedPieces pieces={capturedPieces.b} player="b" />
        </div>
      </div>
      <div>
        <h3 className="font-pixel text-xl text-retro-light mb-2">Captured (Black)</h3>
        <div className="p-2 bg-retro-light/10 rounded min-h-[3rem]">
          <CapturedPieces pieces={capturedPieces.w} player="w" />
        </div>
      </div>
      <Button
        onClick={leaveGame}
        className="w-full font-pixel text-lg bg-retro-neon-pink text-retro-dark hover:bg-retro-neon-pink/80 hover:shadow-neon-pink transition-all duration-300"
      >
        Leave Game
      </Button>
    </div>
  );
}