import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Sparkles, FastForward } from 'lucide-react';

interface IntroVideoProps {
  onComplete: () => void;
}

export default function IntroVideo({ onComplete }: IntroVideoProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1500; // 1.5 seconds high speed intro video specification

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(interval);
        onComplete();
      }
    }, 25);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07080c] overflow-hidden select-none"
      >
        {/* Animated Cyber Wave Background */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/25 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
          {/* Subtle grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#312e81_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
        </div>

        {/* Skip button for instant bypass */}
        <button
          onClick={onComplete}
          className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs text-neutral-400 hover:text-white border border-white/10 transition-all z-20 backdrop-blur-md cursor-pointer"
        >
          <span>Skip</span>
          <FastForward className="w-3.5 h-3.5" />
        </button>

        {/* Center Branding Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-md">
          {/* Dynamic Glowing Logo Emblem */}
          <motion.div
            initial={{ scale: 0.6, rotate: -15, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-6"
          >
            {/* Outer spinning kinetic rings */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-indigo-500 via-cyan-400 to-violet-600 opacity-60 blur-lg animate-spin" style={{ animationDuration: '6s' }} />
            
            <div className="relative w-28 h-28 rounded-2xl bg-neutral-900 border border-indigo-400/40 shadow-2xl flex items-center justify-center p-2 overflow-hidden">
              <img
                src="/logo.png"
                alt="PostFlow AI Logo"
                className="w-full h-full object-contain rounded-xl drop-shadow-2xl"
              />
            </div>
          </motion.div>

          {/* Typography Reveal */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-2 mb-2"
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-cyan-300 bg-clip-text text-transparent">
              PostFlow AI
            </h1>
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
          </motion.div>

          <motion.p
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.45 }}
            className="text-xs sm:text-sm text-neutral-400 tracking-wide font-medium mb-6 flex items-center justify-center gap-2"
          >
            <span>Automate</span>
            <span className="text-indigo-500 font-bold">·</span>
            <span>Create</span>
            <span className="text-cyan-500 font-bold">·</span>
            <span>Dominate Social</span>
          </motion.p>

          {/* High speed 1.5s progress timeline bar */}
          <div className="w-48 h-1 bg-neutral-800 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-violet-500"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-neutral-500 font-mono">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>Initializing Engine {progress}%</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
