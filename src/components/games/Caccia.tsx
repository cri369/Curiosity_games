import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CURIOSITY_DB } from '../../constants';
import { GameResult } from '../GameResult';

interface CacciaProps {
  onMenu: () => void;
}

export const Caccia: React.FC<CacciaProps> = ({ onMenu }) => {
  const [questions] = useState(() => {
    const shuffled = [...CURIOSITY_DB].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10).map(q => ({
      ...q,
      wrong: [...q.wrong].sort(() => Math.random() - 0.5).slice(0, 4),
      correct: [...q.correct].sort(() => Math.random() - 0.5)
    }));
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Stabilizziamo le risposte per la domanda corrente
  const allAnswers = useMemo(() => {
    const q = questions[currentIdx];
    return [...q.correct.slice(0, 2), ...q.wrong.slice(0, 4)].sort(() => Math.random() - 0.5);
  }, [questions, currentIdx]);

  const nextQuestion = useCallback(() => {
    if (currentIdx < 9) {
      setCurrentIdx(prev => prev + 1);
      setTimeLeft(8);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setGameState('won');
    }
  }, [currentIdx]);

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
    
    const correct = questions[currentIdx].correct.includes(answer);
    setSelectedAnswer(answer);
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      setTimeout(nextQuestion, 800);
    } else {
      setTimeout(() => setGameState('lost'), 1500);
    }
  };

  if (gameState !== 'playing') {
    return (
      <GameResult 
        won={gameState === 'won'}
        score={score}
        maxScore={10}
        title={gameState === 'won' ? 'PERFETTO!' : 'GAME OVER'}
        subtitle={gameState === 'won' ? 'Tutte le 10 risposte corrette!' : `Punteggio: ${score}/10`}
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
          <span>Domanda {currentIdx + 1}/10</span>
          <span className={`font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>
            {timeLeft}s
          </span>
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
            const isActuallyCorrect = currentQ.correct.includes(answer);
            
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
