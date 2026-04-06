import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Skull, RotateCcw, Home } from 'lucide-react';

interface GameResultProps {
  won: boolean;
  score: number;
  maxScore: number;
  title: string;
  subtitle: string;
  onRetry: () => void;
  onMenu: () => void;
  icon?: React.ReactNode;
}

export const GameResult: React.FC<GameResultProps> = ({
  won,
  score,
  maxScore,
  title,
  subtitle,
  onRetry,
  onMenu,
  icon
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-full p-6 text-center"
    >
      <div className="text-7xl mb-6">
        {icon || (won ? '🏆' : '💀')}
      </div>
      <h2 className={`text-4xl font-black mb-2 ${won ? 'text-green-400' : 'text-red-400'}`}>
        {title}
      </h2>
      <p className="text-xl mb-8 text-slate-400">
        {subtitle}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
        <button 
          onClick={onRetry}
          className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-lg shadow-purple-500/20"
        >
          <RotateCcw size={20} />
          Rigioca
        </button>
        <button 
          onClick={onMenu}
          className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10"
        >
          <Home size={20} />
          Menu
        </button>
      </div>
    </motion.div>
  );
};
