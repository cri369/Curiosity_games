import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EMOJI_PUZZLES } from '../../constants';
import { GameResult } from '../GameResult';
import { Send, SkipForward, Volume2, VolumeX, Timer } from 'lucide-react';

interface EmojiProps {
  onMenu: () => void;
}

export const Emoji: React.FC<EmojiProps> = ({ onMenu }) => {
  const [levelTier, setLevelTier] = useState<1 | 2 | 3>(1);
  const puzzlesPerLevel = { 1: 10, 2: 15, 3: 25 };
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'result' | 'levelUp'>('playing');
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState<{ text: string; type: 'correct' | 'wrong' | 'skip' | null }>({ text: '', type: null });
  const [startTime, setStartTime] = useState(Date.now());
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const maxTime = levelTier === 1 ? 120 : levelTier === 2 ? 180 : 300;
  const timeLeft = maxTime - totalTime;
  const inputRef = useRef<HTMLInputElement>(null);

  // Audio for ticking
  useEffect(() => {
    if (gameState !== 'playing' || isMuted || !hasStarted) return;

    // Tick only in the last 20 seconds or every 5 seconds normally?
    // User said "audio così in tutti i giochi", so I'll do it every second if it's a countdown.
    // Use a slightly different tick sound URL
    const tickAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    tickAudio.volume = 0.2;
    
    if (timeLeft > 0) {
      tickAudio.play().catch(() => {});
    }

    return () => {
      tickAudio.pause();
      tickAudio.currentTime = 0;
    };
  }, [totalTime, gameState, isMuted, hasStarted, timeLeft]);

  const nextPuzzle = () => {
    const target = puzzlesPerLevel[levelTier];
    if (currentIdx < target - 1) {
      setCurrentIdx(prev => prev + 1);
      setInputValue('');
      setFeedback({ text: '', type: null });
      setStartTime(Date.now());
      inputRef.current?.focus();
    } else {
      if (levelTier < 3) {
        setGameState('levelUp');
      } else {
        setGameState('result');
      }
    }
  };

  const handleLevelUp = () => {
    setLevelTier(prev => (prev + 1) as 1 | 2 | 3);
    setCurrentIdx(0);
    setInputValue('');
    setFeedback({ text: '', type: null });
    setStartTime(Date.now());
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => {
        setTotalTime(prev => {
          if (prev >= maxTime) {
            setGameState('result');
            return maxTime;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  const normalize = (s: string) => s.toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const handleCheck = () => {
    if (feedback.type) return;

    const puzzle = EMOJI_PUZZLES[currentIdx];
    const answer = normalize(inputValue);
    const correct = normalize(puzzle.answer);
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const bonus = Math.max(0, 10 - elapsed);

    if (answer === correct) {
      if (!isMuted) {
        new Audio('https://assets.mixkit.co/active_storage/sfx/600/600-preview.mp3').play().catch(() => {});
      }
      const points = 5 + bonus;
      setScore(s => s + points);
      setFeedback({ 
        text: `✅ CORRETTO! +${points} punti${bonus > 0 ? ` (+${bonus} bonus velocità)` : ''}`, 
        type: 'correct' 
      });
      setTimeout(nextPuzzle, 1200);
    } else {
      if (!isMuted) {
        new Audio('https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3').play().catch(() => {});
      }
      setFeedback({ text: `❌ No! Era "${puzzle.answer}"`, type: 'wrong' });
      setTimeout(nextPuzzle, 1500);
    }
  };

  const handleSkip = () => {
    if (feedback.type) return;
    setTotalTime(t => t + 15);
    setFeedback({ text: `⏭️ Saltato! Era "${EMOJI_PUZZLES[currentIdx].answer}"`, type: 'skip' });
    setTimeout(nextPuzzle, 1000);
  };

  if (!hasStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white p-6 text-center bg-[#0f0a1e]">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#251845] p-10 rounded-[3rem] border-4 border-[#d946ef] shadow-[0_0_50px_rgba(217,70,239,0.2)] max-w-sm w-full"
        >
          <div className="text-6xl mb-6">🎨</div>
          <h2 className="text-4xl font-black mb-4 text-[#d946ef]">EMOJI PUZZLE</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Indovina la parola nascosta dietro le emoji. <br/>
            Hai un tempo limitato per finire il livello!
          </p>
          <button
            onClick={() => setHasStarted(true)}
            className="w-full py-5 bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
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
        <div className="text-7xl mb-6">🎨</div>
        <h2 className="text-4xl font-black mb-2 text-fuchsia-400">LIVELLO COMPLETATO!</h2>
        <p className="text-xl mb-8 text-slate-400">
          Sei pronto per il livello <span className="text-yellow-400 font-bold">{tierName}</span>?<br/>
          Ti aspettano <span className="text-white font-bold">{nextCount} puzzle</span>!
        </p>
        <button 
          onClick={handleLevelUp}
          className="px-12 py-4 rounded-2xl font-bold text-xl transition-all active:scale-95 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-lg shadow-fuchsia-500/20"
        >
          Inizia Livello {nextTier}
        </button>
      </motion.div>
    );
  }

  if (gameState === 'result') {
    const tierName = levelTier === 1 ? 'Base' : levelTier === 2 ? 'Super' : 'Campione';
    return (
      <GameResult 
        won={totalTime < maxTime}
        score={score}
        maxScore={puzzlesPerLevel[levelTier] * 15}
        title={totalTime < maxTime ? `EMOJI ${tierName.toUpperCase()}!` : 'TEMPO SCADUTO'}
        subtitle={`Punti: ${score} · Tempo: ${totalTime}s`}
        onRetry={() => window.location.reload()}
        onMenu={onMenu}
        icon="🎨"
      />
    );
  }

  const puzzle = EMOJI_PUZZLES[currentIdx % EMOJI_PUZZLES.length];

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 max-w-2xl mx-auto text-center">
      <div className="w-full mb-8">
        <div className="flex justify-between items-center mb-2 text-xs font-mono text-slate-500 uppercase tracking-widest">
          <div className="flex flex-col text-left">
            <span className="text-fuchsia-400 font-bold">LIVELLO {levelTier === 1 ? 'BASE' : levelTier === 2 ? 'SUPER' : 'CAMPIONE'}</span>
            <span>Puzzle {currentIdx + 1}/{puzzlesPerLevel[levelTier]}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-yellow-400">Score: {score}</span>
            <div className="flex items-center gap-2 justify-end">
              <span className={timeLeft < 20 ? 'text-red-400 animate-pulse font-bold' : ''}>
                Tempo: {timeLeft}s
              </span>
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all"
              >
                {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
              </button>
            </div>
          </div>
        </div>
        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            animate={{ width: `${(1 - totalTime / maxTime) * 100}%` }}
            className="h-full bg-gradient-to-r from-fuchsia-400 to-purple-600"
          />
        </div>
      </div>

      <p className="text-sm font-mono text-slate-500 mb-6 uppercase tracking-widest">Indovina la parola</p>
      
      <div className="flex justify-center gap-2 mb-12">
        {puzzle.emojis.map((emoji, i) => (
          <motion.span
            key={`${currentIdx}-${i}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', delay: i * 0.1 }}
            className="text-5xl sm:text-7xl"
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      <div className="w-full max-w-sm space-y-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            placeholder="Scrivi qui..."
            className={`w-full px-6 py-4 rounded-2xl text-center text-xl font-bold border outline-none transition-all ${
              feedback.type === 'correct' ? 'bg-green-500/10 border-green-500 text-green-400' :
              feedback.type === 'wrong' ? 'bg-red-500/10 border-red-500 text-red-400' :
              'bg-white/5 border-white/10 text-fuchsia-400 focus:border-fuchsia-500/50 focus:bg-white/10'
            }`}
          />
        </div>

        <AnimatePresence mode="wait">
          {feedback.text && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-sm font-bold ${
                feedback.type === 'correct' ? 'text-green-400' : 
                feedback.type === 'wrong' ? 'text-red-400' : 'text-slate-400'
              }`}
            >
              {feedback.text}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex gap-3">
          <button
            onClick={handleCheck}
            disabled={!!feedback.type}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white active:scale-95 transition-all disabled:opacity-50"
          >
            <Send size={20} />
            Invia
          </button>
          <button
            onClick={handleSkip}
            disabled={!!feedback.type}
            className="px-6 py-4 rounded-2xl font-bold bg-white/5 border border-white/10 text-slate-400 active:scale-95 transition-all disabled:opacity-50"
          >
            <SkipForward size={20} />
          </button>
        </div>
        <p className="text-[10px] text-slate-600 uppercase tracking-widest">Penalità salto: -15 secondi</p>
      </div>
    </div>
  );
};
