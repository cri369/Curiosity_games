import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SPRINT_FACTS } from '../../constants';
import { GameResult } from '../GameResult';
import { Volume2, VolumeX, Timer } from 'lucide-react';

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
  const [levelTier, setLevelTier] = useState<1 | 2 | 3>(1);
  const hitsPerLevel = { 1: 10, 2: 15, 3: 25 };
  
  const [lives, setLives] = useState(5);
  const [hits, setHits] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost' | 'levelUp'>('playing');
  const [fallingFacts, setFallingFacts] = useState<FallingFact[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const nextId = useRef(0);
  const TARGET = hitsPerLevel[levelTier];

  // Audio for ticking
  useEffect(() => {
    if (gameState !== 'playing' || isMuted || !hasStarted || fallingFacts.length === 0) return;

    const tickAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    tickAudio.volume = 0.2;
    
    const interval = setInterval(() => {
      if (gameState === 'playing' && !isMuted && fallingFacts.length > 0) {
        tickAudio.play().catch(() => {});
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      tickAudio.pause();
    };
  }, [gameState, isMuted, hasStarted, fallingFacts.length]);

  const handleLevelUp = () => {
    setLevelTier(prev => (prev + 1) as 1 | 2 | 3);
    setHits(0);
    setLives(5);
    setFallingFacts([]);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnInterval = setInterval(() => {
      const fact = SPRINT_FACTS[Math.floor(Math.random() * SPRINT_FACTS.length)];
      const newFact: FallingFact = {
        id: nextId.current++,
        text: fact.text,
        isTrue: fact.true,
        left: 10 + Math.random() * 70,
        duration: Math.max(2, (4 + Math.random() * 3) - (levelTier * 0.5)) // Più veloce ai livelli alti
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

    }, Math.max(800, 1800 - (levelTier * 300))); // Più frequente ai livelli alti

    return () => clearInterval(spawnInterval);
  }, [gameState, levelTier]);

  const handleCatch = (fact: FallingFact, e: React.MouseEvent | React.TouchEvent) => {
    if (gameState !== 'playing') return;

    // Get position for floating text
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    setFallingFacts(prev => prev.filter(f => f.id !== fact.id));

    if (fact.isTrue) {
      setHits(h => {
        if (h + 1 >= TARGET) {
          if (levelTier < 3) setGameState('levelUp');
          else setGameState('won');
        }
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

  if (!hasStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white p-6 text-center bg-[#0f0a1e]">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#251845] p-10 rounded-[3rem] border-4 border-[#eab308] shadow-[0_0_50px_rgba(234,179,8,0.2)] max-w-sm w-full"
        >
          <div className="text-6xl mb-6">⚡</div>
          <h2 className="text-4xl font-black mb-4 text-[#eab308]">Fatti SPRINT</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Cattura i fatti <span className="text-green-400 font-bold">VERI</span> prima che cadano. <br/>
            Evita quelli <span className="text-red-400 font-bold">FALSI</span>!
          </p>
          <button
            onClick={() => setHasStarted(true)}
            className="w-full py-5 bg-gradient-to-r from-[#eab308] to-[#f97316] rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
          >
            GIOCA ORA
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'levelUp') {
    const nextTier = levelTier + 1;
    const tierName = nextTier === 2 ? 'SUPER' : 'CAMPIONE';
    const nextCount = hitsPerLevel[nextTier as 1|2|3];

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-full p-6 text-center bg-[#0a0a0f]"
      >
        <div className="text-7xl mb-6">⚡</div>
        <h2 className="text-4xl font-black mb-2 text-yellow-400">LIVELLO COMPLETATO!</h2>
        <p className="text-xl mb-8 text-slate-400">
          Sei pronto per il livello <span className="text-yellow-400 font-bold">{tierName}</span>?<br/>
          Devi catturare <span className="text-white font-bold">{nextCount} fatti</span>!
        </p>
        <button 
          onClick={handleLevelUp}
          className="px-12 py-4 rounded-2xl font-bold text-xl transition-all active:scale-95 bg-gradient-to-r from-yellow-600 to-orange-500 text-white shadow-lg shadow-yellow-500/20"
        >
          Inizia Livello {nextTier}
        </button>
      </motion.div>
    );
  }

  if (gameState !== 'playing') {
    const tierName = levelTier === 1 ? 'Base' : levelTier === 2 ? 'Super' : 'Campione';
    return (
      <GameResult 
        won={gameState === 'won'}
        score={hits}
        maxScore={hitsPerLevel[levelTier]}
        title={gameState === 'won' ? `SPRINT ${tierName.toUpperCase()}!` : 'GAME OVER'}
        subtitle={gameState === 'won' ? `Hai superato il livello ${tierName}!` : `Catturati ${hits}/${hitsPerLevel[levelTier]} fatti`}
        onRetry={() => window.location.reload()}
        onMenu={onMenu}
        icon="⚡"
      />
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden touch-none bg-gradient-to-b from-[#0a0a0f] to-[#1a1a0d]">
      {/* HUD */}
      <div className="absolute top-4 left-0 right-0 flex justify-center gap-4 z-20 pointer-events-none font-mono text-[10px] sm:text-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-yellow-500/30 text-yellow-400 backdrop-blur-md">
          <span className="opacity-60">LV</span>
          <span className="font-bold">{levelTier === 1 ? 'BASE' : levelTier === 2 ? 'SUPER' : 'CAMPIONE'}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-green-500/30 text-green-400 backdrop-blur-md">
          <span className="opacity-60">SCORE</span>
          <span className="font-bold">{hits}/{TARGET}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-red-500/30 text-red-400 backdrop-blur-md">
          <span className="opacity-60">VITE</span>
          <span className="font-bold">{lives}</span>
        </div>
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-black/40 border border-white/10 text-gray-500 hover:text-white transition-all pointer-events-auto"
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
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
