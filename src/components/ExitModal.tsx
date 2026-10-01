import { motion, AnimatePresence } from 'motion/react';
import { LogOut, X, ShieldAlert, Check } from 'lucide-react';

interface ExitModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirmExit: () => void;
}

export default function ExitModal({ isOpen, onCancel, onConfirmExit }: ExitModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl overflow-hidden"
        >
          {/* Subtle red/amber glow accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500" />
          
          <button
            onClick={onCancel}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4 mb-5">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Exit PostFlow AI?</h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Are you sure you want to exit? Your scheduled auto-publishing queue will continue running smoothly on our cloud servers.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80 mb-6 text-xs text-neutral-300 space-y-1.5 font-mono">
            <div className="flex items-center gap-2 text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              <span>Queue status: 2 scheduled posts active</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-300">
              <Check className="w-3.5 h-3.5" />
              <span>Drafts & media auto-saved to cloud session</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onCancel}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirmExit}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-rose-600/20 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit App</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
