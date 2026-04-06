import { useState } from 'react';
import { Menu } from './components/Menu';
import { Caccia } from './components/games/Caccia';
import { Oblio } from './components/games/Oblio';
import { Sprint } from './components/games/Sprint';
import { Emoji } from './components/games/Emoji';
import { VeroFalso } from './components/games/VeroFalso';
import { ArrowLeft, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type GameType = 'caccia' | 'oblio' | 'sprint' | 'emoji' | 'verofalso' | null;

export default function App() {
  const [currentGame, setCurrentGame] = useState<GameType>(null);

  const renderGame = () => {
    switch (currentGame) {
      case 'caccia': return <Caccia onMenu={() => setCurrentGame(null)} />;
      case 'oblio': return <Oblio onMenu={() => setCurrentGame(null)} />;
      case 'sprint': return <Sprint onMenu={() => setCurrentGame(null)} />;
      case 'emoji': return <Emoji onMenu={() => setCurrentGame(null)} />;
      case 'verofalso': return <VeroFalso onMenu={() => setCurrentGame(null)} />;
      default: return null;
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-[#0a0a0f] overflow-hidden">
      <AnimatePresence mode="wait">
        {!currentGame ? (
          <motion.div 
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-auto"
          >
            <Menu onStartGame={(id) => setCurrentGame(id as GameType)} />
          </motion.div>
        ) : (
          <motion.div 
            key="game"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md z-50">
              <button 
                onClick={() => setCurrentGame(null)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 bg-white/5 hover:bg-white/10 active:scale-95 transition-all"
              >
                <ArrowLeft size={16} />
                Menu
              </button>
              <div className="text-xs font-mono text-slate-600 uppercase tracking-widest hidden sm:block">
                Curiosity Games
              </div>
            </div>

            {/* Game Area */}
            <div className="flex-1 overflow-auto relative">
              {renderGame()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="w-full py-4 border-t border-white/5 bg-[#0a0a0f]/90 backdrop-blur-sm text-center">
        <a 
          href="https://www.maestracris.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-purple-400 transition-colors"
        >
          <Globe size={12} />
          www.maestracris.com
        </a>
      </footer>
    </div>
  );
}
