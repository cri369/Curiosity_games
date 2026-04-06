import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MEMORY_WORDS_POOL } from '../../constants';
import { GameResult } from '../GameResult';

interface OblioProps {
  onMenu: () => void;
}

export const Oblio: React.FC<OblioProps> = ({ onMenu }) => {
  const levelCounts = [3, 4, 4, 5, 6, 7, 8, 10];
  const [level, setLevel] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [phase, setPhase] = useState<'memo' | 'input' | 'result'>('memo');
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(100);

  const maxErrors = 5;

  useEffect(() => {
    if (phase === 'memo') {
      const words = [...MEMORY_WORDS_POOL].sort(() => Math.random() - 0.5).slice(0, levelCounts[level]);
      setCurrentWords(words);
      setSelectedWords(new Set());
      
      const showTime = 3000 + levelCounts[level] * 800;
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
        if (level < 7) {
          setLevel(prev => prev + 1);
          setPhase('memo');
        } else {
          setPhase('result');
        }
      }, 800);
    }
  };

  if (phase === 'result' || totalErrors >= maxErrors) {
    return (
      <GameResult 
        won={phase === 'result' && totalErrors < maxErrors}
        score={level}
        maxScore={8}
        title={phase === 'result' ? 'MEMORIA PERFETTA!' : 'TROPPI ERRORI'}
        subtitle={phase === 'result' ? 'Tutti gli 8 livelli completati!' : `Arrivato al livello ${level + 1}`}
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
          <span>Livello {level + 1}/8</span>
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
