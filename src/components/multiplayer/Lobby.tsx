import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGameActions } from '@/store/game-store';
import { motion } from 'framer-motion';
export function Lobby() {
  const { createGame, joinGame } = useGameActions();
  const [joinId, setJoinId] = useState('');
  const handleJoin = () => {
    if (joinId.trim()) {
      joinGame(joinId.trim());
    }
  };
  return (
    <motion.div
      className="w-full max-w-md p-8 bg-retro-dark/50 border-2 border-retro-neon-pink shadow-neon-pink rounded-lg flex flex-col items-center space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="font-pixel text-3xl text-retro-neon-pink text-center tracking-wider">
        JOIN A GAME
      </h2>
      <div className="w-full space-y-4">
        <Button
          onClick={createGame}
          className="w-full font-pixel text-lg bg-retro-neon-cyan text-retro-dark hover:bg-retro-neon-cyan/80 hover:shadow-neon-cyan transition-all duration-300"
        >
          Create New Game
        </Button>
      </div>
      <div className="w-full flex items-center space-x-2">
        <hr className="flex-grow border-retro-neon-pink/50" />
        <span className="font-pixel text-retro-light">OR</span>
        <hr className="flex-grow border-retro-neon-pink/50" />
      </div>
      <div className="w-full space-y-4">
        <Input
          type="text"
          placeholder="Enter Game ID..."
          value={joinId}
          onChange={(e) => setJoinId(e.target.value)}
          className="font-mono text-center text-lg bg-retro-dark/80 border-retro-neon-cyan text-retro-light placeholder:text-retro-light/50 focus:ring-retro-neon-cyan"
        />
        <Button
          onClick={handleJoin}
          disabled={!joinId.trim()}
          className="w-full font-pixel text-lg bg-retro-neon-pink text-retro-dark hover:bg-retro-neon-pink/80 hover:shadow-neon-pink transition-all duration-300 disabled:opacity-50"
        >
          Join Game
        </Button>
      </div>
    </motion.div>
  );
}