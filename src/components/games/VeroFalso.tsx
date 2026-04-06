import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SPRINT_FACTS } from '../../constants';
import { GameResult } from '../GameResult';
import { Check, X, Timer, Volume2, VolumeX } from 'lucide-react';

interface VeroFalsoProps {
  onMenu: () => void;
}

export const VeroFalso: React.FC<VeroFalsoProps> = ({ onMenu }) => {
  const [levelTier, setLevelTier] = useState<1 | 2 | 3>(1);
  const questionsPerLevel = { 1: 10, 2: 15, 3: 25 };
  
  const [facts, setFacts] = useState(() => {
    return [...SPRINT_FACTS].sort(() => Math.random() - 0.5).slice(0, 25);
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5); // Molto rapido: 5 secondi
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost' | 'levelUp'>('playing');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Audio for ticking
  useEffect(() => {
    if (gameState !== 'playing' || feedback !== null || isMuted) return;

    const tickAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    tickAudio.volume = 0.3;
    
    // Play tick every second when timeLeft changes
    if (timeLeft > 0) {
      tickAudio.play().catch(() => {}); // Catch browser autoplay block
    }

    return () => {
      tickAudio.pause();
      tickAudio.currentTime = 0;
    };
  }, [timeLeft, gameState, feedback, isMuted]);

  const nextQuestion = useCallback(() => {
    const target = questionsPerLevel[levelTier];
    if (currentIdx < target - 1) {
      setCurrentIdx(prev => prev + 1);
      setTimeLeft(5);
      setFeedback(null);
    } else {
      if (levelTier < 3) {
        setGameState('levelUp');
      } else {
        setGameState('won');
      }
    }
  }, [currentIdx, levelTier, questionsPerLevel]);

  useEffect(() => {
    if (gameState !== 'playing' || feedback !== null) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('lost');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, feedback]);

  const handleAnswer = (userChoice: boolean) => {
    if (feedback !== null || gameState !== 'playing') return;
    
    const isCorrect = facts[currentIdx].true === userChoice;
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setScore(prev => prev + 1);
      setTimeout(nextQuestion, 400); // Più veloce!
    } else {
      setTimeout(() => setGameState('lost'), 800);
    }
  };

  const handleLevelUp = () => {
    setLevelTier(prev => (prev + 1) as 1 | 2 | 3);
    setCurrentIdx(0);
    setGameState('playing');
    setFeedback(null);
    setTimeLeft(5);
    // Rimescoliamo per il nuovo livello
    setFacts([...SPRINT_FACTS].sort(() => Math.random() - 0.5).slice(0, 25));
  };

  if (gameState === 'levelUp') {
    const nextTier = levelTier + 1;
    const tierName = nextTier === 2 ? 'SUPER' : 'CAMPIONE';
    const nextCount = nextTier === 2 ? 15 : 25;

    return (
      <div className="flex flex-col items-center justify-center h-full text-white p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#251845] p-8 rounded-3xl border-2 border-[#ff00ff] shadow-[0_0_30px_rgba(255,0,255,0.3)]"
        >
          <h2 className="text-4xl font-black mb-4 text-[#ff00ff]">LIVELLO COMPLETATO!</h2>
          <p className="text-xl mb-6">Sei pronto per il livello <span className="font-bold text-[#00ffff]">{tierName}</span>?</p>
          <div className="bg-[#1a1535] p-4 rounded-xl mb-8">
            <p className="text-gray-400 text-sm uppercase tracking-widest mb-1">Prossima Sfida</p>
            <p className="text-2xl font-bold">{nextCount} Domande Rapidissime</p>
          </div>
          <button
            onClick={handleLevelUp}
            className="w-full py-4 bg-gradient-to-r from-[#ff00ff] to-[#00ffff] rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg"
          >
            INIZIA LIVELLO {nextTier}
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'won' || gameState === 'lost') {
    const tierName = levelTier === 1 ? 'Base' : levelTier === 2 ? 'Super' : 'Campione';
    return (
      <GameResult 
        won={gameState === 'won'}
        score={score}
        maxScore={questionsPerLevel[levelTier]}
        title={gameState === 'won' ? `CAMPIONE ${tierName.toUpperCase()}!` : 'TEMPO SCADUTO'}
        subtitle={gameState === 'won' ? `Hai superato il livello ${tierName}!` : `Punteggio: ${score}/${questionsPerLevel[levelTier]}`}
        onRetry={() => {
          setScore(0);
          setCurrentIdx(0);
          setLevelTier(1);
          setGameState('playing');
          setTimeLeft(5);
          setFeedback(null);
          setFacts([...SPRINT_FACTS].sort(() => Math.random() - 0.5).slice(0, 25));
        }}
        onMenu={onMenu}
        icon={gameState === 'won' ? '🏆' : '⏰'}
      />
    );
  }

  const currentFact = facts[currentIdx];

  return (
    <div className="flex flex-col h-full bg-[#0f0a1e] text-white p-4 relative overflow-hidden">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-8 z-10">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 uppercase tracking-widest">Livello</span>
          <span className="text-xl font-black text-[#00ffff]">
            {levelTier === 1 ? 'BASE' : levelTier === 2 ? 'SUPER' : 'CAMPIONE'}
          </span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className={`flex items-center gap-2 px-4 py-1 rounded-full border-2 ${timeLeft <= 2 ? 'border-red-500 text-red-500 animate-pulse' : 'border-[#ff00ff] text-[#ff00ff]'}`}>
            <Timer size={18} />
            <span className="text-2xl font-black font-mono">{timeLeft}s</span>
          </div>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="mt-2 text-gray-500 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-400 uppercase tracking-widest">Progresso</span>
          <span className="text-xl font-black">
            {currentIdx + 1}<span className="text-gray-500 text-sm">/{questionsPerLevel[levelTier]}</span>
          </span>
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ y: 20, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              x: feedback === 'wrong' ? [0, -10, 10, -10, 10, 0] : 0
            }}
            transition={{ 
              x: { duration: 0.4, ease: "easeInOut" }
            }}
            exit={{ y: -20, opacity: 0 }}
            className="text-center max-w-md"
          >
            <h2 className="text-3xl md:text-5xl font-black leading-tight mb-8 drop-shadow-lg">
              {currentFact.text}
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* Feedback Overlay */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className={`absolute inset-0 flex items-center justify-center z-20 pointer-events-none`}
            >
              <div className={`p-8 rounded-full ${feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'} shadow-[0_0_50px_rgba(0,0,0,0.5)]`}>
                {feedback === 'correct' ? <Check size={80} strokeWidth={4} /> : <X size={80} strokeWidth={4} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Buttons Area */}
      <div className="grid grid-cols-2 gap-6 mb-12 z-10 px-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleAnswer(true)}
          disabled={feedback !== null}
          className={`h-40 md:h-48 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 font-black text-3xl transition-all shadow-2xl
            ${feedback === null ? 'bg-green-500 hover:bg-green-400 border-b-[12px] border-green-700 active:border-b-0 active:translate-y-2' : 
              currentFact.true === true ? 'bg-green-400 border-b-0 translate-y-2' : 'bg-gray-800 opacity-30 border-b-0 translate-y-2'}
          `}
        >
          <Check size={50} strokeWidth={4} />
          VERO
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleAnswer(false)}
          disabled={feedback !== null}
          className={`h-40 md:h-48 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 font-black text-3xl transition-all shadow-2xl
            ${feedback === null ? 'bg-red-500 hover:bg-red-400 border-b-[12px] border-red-700 active:border-b-0 active:translate-y-2' : 
              currentFact.true === false ? 'bg-red-400 border-b-0 translate-y-2' : 'bg-gray-800 opacity-30 border-b-0 translate-y-2'}
          `}
        >
          <X size={50} strokeWidth={4} />
          FALSO
        </motion.button>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-[#1a1535] rounded-full overflow-hidden mb-4">
        <motion.div 
          className="h-full bg-gradient-to-r from-[#ff00ff] to-[#00ffff]"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIdx + 1) / questionsPerLevel[levelTier]) * 100}%` }}
        />
      </div>

      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ff00ff] rounded-full blur-[120px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00ffff] rounded-full blur-[120px] opacity-10 pointer-events-none" />
    </div>
  );
};
