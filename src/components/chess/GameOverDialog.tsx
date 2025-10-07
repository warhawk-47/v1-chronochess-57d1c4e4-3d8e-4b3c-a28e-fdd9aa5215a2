import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useGameStore, useGameActions } from '@/store/game-store';
export function GameOverDialog() {
  const gameStatus = useGameStore((state) => state.gameStatus);
  const currentPlayer = useGameStore((state) => state.currentPlayer);
  const { leaveGame } = useGameActions();
  const isOpen = gameStatus === 'checkmate' || gameStatus === 'stalemate' || gameStatus === 'draw';
  const getTitle = () => {
    switch (gameStatus) {
      case 'checkmate': return "Checkmate!";
      case 'stalemate': return "Stalemate!";
      case 'draw': return "Draw!";
      default: return "";
    }
  };
  const getDescription = () => {
    switch (gameStatus) {
      case 'checkmate': {
        const winner = currentPlayer === 'w' ? 'Black' : 'White';
        return `The game is over. ${winner} wins! Congratulations!`;
      }
      case 'stalemate':
        return "The game is a draw due to stalemate. No legal moves left!";
      case 'draw':
        return "The game has ended in a draw.";
      default:
        return "";
    }
  };
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-retro-dark border-retro-neon-pink text-retro-light font-mono">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-pixel text-3xl text-retro-neon-pink">{getTitle()}</AlertDialogTitle>
          <AlertDialogDescription className="text-retro-light/80 text-lg">
            {getDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={leaveGame}
            className="font-pixel text-lg bg-retro-neon-cyan text-retro-dark hover:bg-retro-neon-cyan/80"
          >
            Back to Lobby
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}