import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MEMORY_WORDS_POOL } from '../../constants';
import { GameResult } from '../GameResult';

interface OblioProps {
  onMenu: () => void;
}

export const Oblio: React.FC<OblioProps> = ({ onMenu }) => {
  const [levelTier, setLevelTier] = useState<1 | 2 | 3>(1);
  const stepsPerLevel = { 1: 10, 2: 15, 3: 25 };
  
  const [level, setLevel] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [phase, setPhase] = useState<'memo' | 'input' | 'result' | 'levelUp'>('memo');
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(100);

  const maxErrors = 5;

  useEffect(() => {
    if (phase === 'memo') {
      // Difficoltà crescente: più parole man mano che si avanza
      const wordCount = 3 + Math.floor(level / 3);
      const words = [...MEMORY_WORDS_POOL].sort(() => Math.random() - 0.5).slice(0, wordCount);
      setCurrentWords(words);
      setSelectedWords(new Set());
      
      const showTime = 3000 + wordCount * 800;
      let start = Date.now();
      
      const timer = setInterval(() => {
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, 100 - (elapsed / showTime) * 100);
        setTimeLeft(remaining);
        if (remaining <= 0) {
          clearInterval(timer);
          setShuffledOptions([...words].sort(() => Math.random() - 0.5));
          setPhase('input');
        }
      }, 50);

      return () => clearInterval(timer);
    }
  }, [level, phase]);

  const handleWordSelect = (word: string) => {
    const newSelected = new Set(selectedWords);
    if (newSelected.has(word)) {
      newSelected.delete(word);
    } else {
      newSelected.add(word);
    }
    setSelectedWords(newSelected);

    if (newSelected.size === currentWords.length) {
      setTimeout(() => {
        const target = stepsPerLevel[levelTier];
        if (level < target - 1) {
          setLevel(prev => prev + 1);
          setPhase('memo');
        } else {
          if (levelTier < 3) setPhase('levelUp');
          else setPhase('result');
        }
      }, 800);
    }
  };

  const handleLevelUp = () => {
    setLevelTier(prev => (prev + 1) as 1 | 2 | 3);
    setLevel(0);
    setTotalErrors(0);
    setPhase('memo');
  };

  if (phase === 'levelUp') {
    const nextTier = levelTier + 1;
    const tierName = nextTier === 2 ? 'SUPER' : 'CAMPIONE';
    const nextCount = stepsPerLevel[nextTier as 1|2|3];

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-full p-6 text-center"
      >
        <div className="text-7xl mb-6">🧠</div>
        <h2 className="text-4xl font-black mb-2 text-cyan-400">LIVELLO COMPLETATO!</h2>
        <p className="text-xl mb-8 text-slate-400">
          Sei pronto per il livello <span className="text-yellow-400 font-bold">{tierName}</span>?<br/>
          Ti aspettano <span className="text-white font-bold">{nextCount} sequenze</span>!
        </p>
        <button 
          onClick={handleLevelUp}
          className="px-12 py-4 rounded-2xl font-bold text-xl transition-all active:scale-95 bg-gradient-to-r from-cyan-600 to-blue-500 text-white shadow-lg shadow-cyan-500/20"
        >
          Inizia Livello {nextTier}
        </button>
      </motion.div>
    );
  }

  if (phase === 'result' || totalErrors >= maxErrors) {
    const tierName = levelTier === 1 ? 'Base' : levelTier === 2 ? 'Super' : 'Campione';
    return (
      <GameResult 
        won={phase === 'result' && totalErrors < maxErrors}
        score={level}
        maxScore={stepsPerLevel[levelTier]}
        title={phase === 'result' ? `OBLIO ${tierName.toUpperCase()}!` : 'TROPPI ERRORI'}
        subtitle={phase === 'result' ? `Hai superato il livello ${tierName}!` : `Arrivato alla sequenza ${level + 1}`}
        onRetry={() => window.location.reload()}
        onMenu={onMenu}
        icon="🧠"
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 max-w-2xl mx-auto text-center">
      <div className="w-full mb-8">
        <div className="flex justify-between items-center mb-2 text-xs font-mono text-slate-500 uppercase tracking-widest">
          <div className="flex flex-col text-left">
            <span className="text-cyan-400 font-bold">LIVELLO {levelTier === 1 ? 'BASE' : levelTier === 2 ? 'SUPER' : 'CAMPIONE'}</span>
            <span>Sequenza {level + 1}/{stepsPerLevel[levelTier]}</span>
          </div>
          <span className="text-red-400">Errori: {totalErrors}/{maxErrors}</span>
        </div>
        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            animate={{ width: phase === 'memo' ? `${timeLeft}%` : '100%' }}
            className={`h-full ${phase === 'memo' ? 'bg-cyan-400' : 'bg-green-400'}`}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'memo' ? (
          <motion.div 
            key="memo"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full"
          >
            <p className="text-sm font-mono text-cyan-400/60 mb-6 uppercase tracking-widest">Memorizza queste parole</p>
            <div className="flex flex-wrap justify-center gap-3">
              {currentWords.map((word, i) => (
                <motion.span 
                  key={word}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="px-6 py-3 rounded-2xl text-xl font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/5"
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="input"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            <p className="text-sm font-mono text-green-400/60 mb-6 uppercase tracking-widest">Seleziona le parole corrette ({selectedWords.size}/{currentWords.length})</p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {shuffledOptions.map((word, i) => {
                const isSelected = selectedWords.has(word);
                return (
                  <motion.button
                    key={word}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleWordSelect(word)}
                    className={`px-5 py-3 rounded-2xl font-bold text-lg border transition-all active:scale-95 ${
                      isSelected 
                        ? 'bg-green-500/20 border-green-500 text-green-400' 
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    {word}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
