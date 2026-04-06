import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Loader2 } from 'lucide-react';
import { generateNewQuestions } from '../services/geminiService';

interface GameCard {
  id: string;
  title: string;
  description: string;
  emoji: string;
  gradient: string;
  borderColor: string;
  textColor: string;
}

const GAMES: GameCard[] = [
  {
    id: 'caccia',
    title: 'Caccia alla Curiosità',
    description: '10 domande bizzarre, 6 carte, solo 1 giusta. 8 secondi. Un errore = game over.',
    emoji: '🃏',
    gradient: 'from-[#1a1535] to-[#251845]',
    borderColor: 'border-[#3d2a6e]',
    textColor: 'text-[#c4a8ff]'
  },
  {
    id: 'oblio',
    title: "Curva dell'Oblio",
    description: 'Memorizza parole e curiosità, poi riscrivile. 8 livelli, da 3 a 10 parole. Max 5 errori.',
    emoji: '📖',
    gradient: 'from-[#0d1a25] to-[#0a2540]',
    borderColor: 'border-[#1a4a6e]',
    textColor: 'text-[#7ec8e3]'
  },
  {
    id: 'sprint',
    title: 'Curiosity Sprint',
    description: 'Fatti veri (verdi) e falsi (rossi) cadono dall\'alto. Tocca solo quelli veri! 5 vite, 50 per vincere.',
    emoji: '⚡',
    gradient: 'from-[#1a1a0d] to-[#2a2510]',
    borderColor: 'border-[#5a5020]',
    textColor: 'text-[#f0d060]'
  },
  {
    id: 'emoji',
    title: 'Emoji Mystery',
    description: 'Indovina la parola da 5 emoji! 10 round, punti bonus per velocità. Divertimento puro!',
    emoji: '🎨',
    gradient: 'from-[#1a0d2a] to-[#2a1540]',
    borderColor: 'border-[#5d2a8e]',
    textColor: 'text-[#e879f9]'
  },
  {
    id: 'verofalso',
    title: 'Vero o Falso?',
    description: 'Sfida rapidissima! Decidi se la curiosità è vera o falsa in meno di 5 secondi. 3 livelli di difficoltà.',
    emoji: '⚖️',
    gradient: 'from-[#0d2a1a] to-[#15402a]',
    borderColor: 'border-[#2a8e5d]',
    textColor: 'text-[#79f9a8]'
  }
];

interface MenuProps {
  onStartGame: (id: string) => void;
}

export const Menu: React.FC<MenuProps> = ({ onStartGame }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIRefresh = async () => {
    setIsGenerating(true);
    await generateNewQuestions();
    setIsGenerating(false);
    alert("Nuove curiosità generate dall'AI aggiunte al database!");
  };

  return (
    <div className="min-h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#0a0a0f] via-[#1a1025] to-[#0a0a0f]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
          Curiosity Games
        </h1>
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm md:text-base font-mono text-[#8b7aa8] uppercase tracking-[0.2em]">
            5 giochi · AI Powered · Sempre Diversi
          </p>
          
          <button 
            onClick={handleAIRefresh}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 transition-all disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
            {isGenerating ? 'Generazione in corso...' : 'Genera nuove curiosità con AI'}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl w-full">
        {GAMES.map((game, i) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onStartGame(game.id)}
            className={`group relative overflow-hidden rounded-3xl p-8 text-left border transition-all active:scale-95 bg-gradient-to-br ${game.gradient} ${game.borderColor} hover:shadow-2xl hover:shadow-purple-500/10`}
          >
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
              {game.emoji}
            </div>
            <h2 className={`text-2xl font-bold mb-3 ${game.textColor}`}>
              {game.title}
            </h2>
            <p className="text-sm leading-relaxed text-[#8b7aa8]">
              {game.description}
            </p>
            
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/10 ${game.textColor}`}>
                →
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
