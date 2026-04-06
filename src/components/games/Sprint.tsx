import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SPRINT_FACTS } from '../../constants';
import { GameResult } from '../GameResult';

interface SprintProps {
  onMenu: () => void;
}

interface FallingFact {
  id: number;
  text: string;
  isTrue: boolean;
  left: number;
  duration: number;
}

export const Sprint: React.FC<SprintProps> = ({ onMenu }) => {
  const [lives, setLives] = useState(5);
  const [hits, setHits] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [fallingFacts, setFallingFacts] = useState<FallingFact[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
  
  const nextId = useRef(0);
  const TARGET = 50;

  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnInterval = setInterval(() => {
      const fact = SPRINT_FACTS[Math.floor(Math.random() * SPRINT_FACTS.length)];
      const newFact: FallingFact = {
        id: nextId.current++,
        text: fact.text,
        isTrue: fact.true,
        left: 10 + Math.random() * 70,
        duration: 4 + Math.random() * 3
      };

      setFallingFacts(prev => [...prev, newFact]);

      // Auto-remove and penalty if missed true fact
      setTimeout(() => {
        setFallingFacts(prev => {
          const found = prev.find(f => f.id === newFact.id);
          if (found && found.isTrue) {
            setLives(l => {
              if (l <= 1) setGameState('lost');
              return l - 1;
            });
          }
          return prev.filter(f => f.id !== newFact.id);
        });
      }, newFact.duration * 1000);

    }, 1800);

    return () => clearInterval(spawnInterval);
  }, [gameState]);

  const handleCatch = (fact: FallingFact, e: React.MouseEvent | React.TouchEvent) => {
    if (gameState !== 'playing') return;

    // Get position for floating text
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    setFallingFacts(prev => prev.filter(f => f.id !== fact.id));

    if (fact.isTrue) {
      setHits(h => {
        if (h + 1 >= TARGET) setGameState('won');
        return h + 1;
      });
      addFloatingText('✅', x, y);
    } else {
      setLives(l => {
        if (l <= 1) setGameState('lost');
        return l - 1;
      });
      addFloatingText('❌', x, y);
    }
  };

  const addFloatingText = (text: string, x: number, y: number) => {
    const id = Date.now();
    setFloatingTexts(prev => [...prev, { id, text, x, y }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(f => f.id !== id));
    }, 600);
  };

  if (gameState !== 'playing') {
    return (
      <GameResult 
        won={gameState === 'won'}
        score={hits}
        maxScore={TARGET}
        title={gameState === 'won' ? 'SPRINT COMPLETATO!' : 'GAME OVER'}
        subtitle={gameState === 'won' ? `50 fatti catturati con ${lives} vite rimaste!` : `Catturati ${hits}/${TARGET} fatti`}
        onRetry={() => window.location.reload()}
        onMenu={onMenu}
        icon="⚡"
      />
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden touch-none bg-gradient-to-b from-[#0a0a0f] to-[#1a1a0d]">
      {/* HUD */}
      <div className="absolute top-4 left-0 right-0 flex justify-center gap-8 z-20 pointer-events-none font-mono text-sm">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-green-500/30 text-green-400 backdrop-blur-md">
          <span className="opacity-60">SCORE</span>
          <span className="font-bold">{hits}/{TARGET}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-red-500/30 text-red-400 backdrop-blur-md">
          <span className="opacity-60">VITE</span>
          <span className="font-bold">{lives}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none">
        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            animate={{ width: `${(hits / TARGET) * 100}%` }}
            className="h-full bg-gradient-to-r from-green-400 to-yellow-400 shadow-[0_0_15px_rgba(74,222,128,0.3)]"
          />
        </div>
      </div>

      {/* Falling Facts */}
      <AnimatePresence>
        {fallingFacts.map(fact => (
          <motion.div
            key={fact.id}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: '100dvh', opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: fact.duration, ease: 'linear' }}
            onPointerDown={(e) => handleCatch(fact, e)}
            style={{ left: `${fact.left}%` }}
            className={`absolute px-4 py-3 rounded-2xl text-sm font-bold text-center leading-tight cursor-pointer select-none max-w-[200px] border-2 shadow-lg backdrop-blur-sm ${
              fact.isTrue 
                ? 'bg-green-500/10 border-green-500 text-green-400 shadow-green-500/20' 
                : 'bg-red-500/10 border-red-500 text-red-400 shadow-red-500/20'
            }`}
          >
            {fact.text}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Floating Feedback */}
      <AnimatePresence>
        {floatingTexts.map(f => (
          <motion.div
            key={f.id}
            initial={{ opacity: 1, y: f.y, x: f.x - 20 }}
            animate={{ opacity: 0, y: f.y - 100 }}
            className="absolute pointer-events-none text-3xl z-30"
          >
            {f.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
