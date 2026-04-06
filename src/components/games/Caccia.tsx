import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CURIOSITY_DB } from '../../constants';
import { GameResult } from '../GameResult';
import { Volume2, VolumeX, Timer } from 'lucide-react';

interface CacciaProps {
  onMenu: () => void;
}

export const Caccia: React.FC<CacciaProps> = ({ onMenu }) => {
  const [levelTier, setLevelTier] = useState<1 | 2 | 3>(1);
  const questionsPerLevel = { 1: 10, 2: 15, 3: 25 };
  
  const [questions, setQuestions] = useState(() => {
    const shuffled = [...CURIOSITY_DB].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 25).map(q => ({
      ...q,
      wrong: [...q.wrong].sort(() => Math.random() - 0.5).slice(0, 5)
    }));
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost' | 'levelUp'>('playing');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Audio for ticking
  useEffect(() => {
    if (gameState !== 'playing' || selectedAnswer !== null || isMuted || !hasStarted) return;

    const tickAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    tickAudio.volume = 0.3;
    
    if (timeLeft > 0) {
      tickAudio.play().catch(() => {});
    }

    return () => {
      tickAudio.pause();
      tickAudio.currentTime = 0;
    };
  }, [timeLeft, gameState, selectedAnswer, isMuted, hasStarted]);

  const allAnswers = useMemo(() => {
    const q = questions[currentIdx];
    return [q.correct, ...q.wrong.slice(0, 5)].sort(() => Math.random() - 0.5);
  }, [questions, currentIdx]);

  const nextQuestion = useCallback(() => {
    const target = questionsPerLevel[levelTier];
    if (currentIdx < target - 1) {
      setCurrentIdx(prev => prev + 1);
      setTimeLeft(8);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      if (levelTier < 3) {
        setGameState('levelUp');
      } else {
        setGameState('won');
      }
    }
  }, [currentIdx, levelTier]);

  const handleLevelUp = () => {
    setLevelTier(prev => (prev + 1) as 1 | 2 | 3);
    setCurrentIdx(0);
    setTimeLeft(8);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setGameState('playing');
    // Rimescoliamo per il nuovo livello
    setQuestions([...CURIOSITY_DB].sort(() => Math.random() - 0.5).slice(0, 25).map(q => ({
      ...q,
      wrong: [...q.wrong].sort(() => Math.random() - 0.5).slice(0, 5)
    })));
  };

  useEffect(() => {
    if (gameState !== 'playing' || selectedAnswer !== null) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('lost');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, selectedAnswer]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return;
    
    const correct = questions[currentIdx].correct === answer;
    setSelectedAnswer(answer);
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      setTimeout(nextQuestion, 800);
    } else {
      setTimeout(() => setGameState('lost'), 1500);
    }
  };

  if (!hasStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white p-6 text-center bg-[#0f0a1e]">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#251845] p-10 rounded-[3rem] border-4 border-[#a855f7] shadow-[0_0_50px_rgba(168,85,247,0.2)] max-w-sm w-full"
        >
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-4xl font-black mb-4 text-[#a855f7]">CACCIA AL VERO</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Trova la risposta corretta tra le opzioni. <br/>
            Hai solo <span className="text-white font-bold">8 secondi</span>!
          </p>
          <button
            onClick={() => setHasStarted(true)}
            className="w-full py-5 bg-gradient-to-r from-[#a855f7] to-[#ec4899] rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
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
    const nextCount = nextTier === 2 ? 15 : 25;

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-full p-6 text-center"
      >
        <div className="text-7xl mb-6">🚀</div>
        <h2 className="text-4xl font-black mb-2 text-purple-400">LIVELLO COMPLETATO!</h2>
        <p className="text-xl mb-8 text-slate-400">
          Sei pronto per il livello <span className="text-yellow-400 font-bold">{tierName}</span>?<br/>
          Ti aspettano <span className="text-white font-bold">{nextCount} domande</span>!
        </p>
        <button 
          onClick={handleLevelUp}
          className="px-12 py-4 rounded-2xl font-bold text-xl transition-all active:scale-95 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-lg shadow-purple-500/20"
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
        score={score}
        maxScore={questionsPerLevel[levelTier]}
        title={gameState === 'won' ? `CAMPIONE ${tierName.toUpperCase()}!` : 'GAME OVER'}
        subtitle={gameState === 'won' ? `Hai superato il livello ${tierName}!` : `Punteggio: ${score}/${questionsPerLevel[levelTier]}`}
        onRetry={() => window.location.reload()}
        onMenu={onMenu}
      />
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 max-w-2xl mx-auto">
      <div className="w-full mb-6">
        <div className="flex justify-between items-center mb-2 text-xs font-mono text-slate-500 uppercase tracking-widest">
          <div className="flex flex-col">
            <span className="text-yellow-400 font-bold">LIVELLO {levelTier === 1 ? 'BASE' : levelTier === 2 ? 'SUPER' : 'CAMPIONE'}</span>
            <span>Domanda {currentIdx + 1}/{questionsPerLevel[levelTier]}</span>
          </div>
          <div className="flex flex-col items-center">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border-2 bg-black/20 ${timeLeft <= 3 ? 'border-red-500 text-red-500 animate-pulse' : 'border-yellow-500 text-yellow-500'}`}>
              <Timer size={14} />
              <span className="text-xl font-black font-mono">{timeLeft}s</span>
            </div>
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="mt-1 p-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all"
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
        </div>
        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / 8) * 100}%` }}
            className="h-full bg-gradient-to-r from-purple-400 to-yellow-400"
          />
        </div>
      </div>

      <motion.h2 
        key={currentIdx}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl md:text-2xl font-bold text-center mb-8 leading-tight"
      >
        {currentQ.q}
      </motion.h2>

      <div className="grid grid-cols-2 gap-3 w-full">
        <AnimatePresence mode="wait">
          {allAnswers.map((answer, i) => {
            const isSelected = selectedAnswer === answer;
            const isActuallyCorrect = currentQ.correct === answer;
            
            let bgColor = 'bg-white/5 border-white/10';
            if (selectedAnswer !== null) {
              if (isActuallyCorrect) bgColor = 'bg-green-500/20 border-green-500 text-green-400';
              else if (isSelected) bgColor = 'bg-red-500/20 border-red-500 text-red-400';
            }

            return (
              <motion.button
                key={`${currentIdx}-${answer}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                disabled={selectedAnswer !== null}
                onClick={() => handleAnswer(answer)}
                className={`p-4 rounded-2xl text-center font-semibold border transition-all active:scale-95 min-h-[80px] flex items-center justify-center ${bgColor}`}
              >
                {answer}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
