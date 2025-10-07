import { useEffect } from 'react';
import { Chessboard } from '@/components/chess/Chessboard';
import { GameInfoPanel } from '@/components/chess/GameInfoPanel';
import { GameOverDialog } from '@/components/chess/GameOverDialog';
import { Lobby } from '@/components/multiplayer/Lobby';
import { useGameStore, useGameActions } from '@/store/game-store';
import { motion } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner';
export function HomePage() {
  const gameId = useGameStore((state) => state.gameId);
  const { syncGameState } = useGameActions();
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (gameId) {
      interval = setInterval(() => {
        syncGameState();
      }, 2000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameId, syncGameState]);
  return (
    <main className="min-h-screen w-full bg-retro-dark text-retro-light flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
      <Toaster theme="dark" position="bottom-right" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <motion.h1
        className="font-pixel text-4xl md:text-6xl text-retro-neon-cyan mb-8 text-center"
        style={{ textShadow: '0 0 5px #00f6ff, 0 0 10px #00f6ff, 0 0 20px #00f6ff' }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        ChronoChess
      </motion.h1>
      {gameId ? (
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-center gap-8">
          <motion.div
            className="w-full md:flex-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Chessboard />
          </motion.div>
          <motion.div
            className="w-full md:w-auto"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <GameInfoPanel />
          </motion.div>
        </div>
      ) : (
        <Lobby />
      )}
      <GameOverDialog />
      <footer className="absolute bottom-4 text-center text-retro-light/50 font-mono text-sm">
        <p>Built with ❤️ at Cloudflare</p>
      </footer>
    </main>
  );
}