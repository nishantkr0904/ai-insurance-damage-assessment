import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    to?: string;
    onClick?: () => void;
  };
  /** Optional second subtle action */
  secondaryAction?: {
    label: string;
    to?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, secondaryAction, className = '' }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`flex flex-col items-center justify-center py-20 px-6 text-center ${className}`}
    >
      {/* Animated icon container */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 20 }}
        className="relative mb-6"
      >
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-xl scale-150" />
        <div className="relative w-20 h-20 glass rounded-2xl flex items-center justify-center border border-white/10">
          <Icon className="w-9 h-9 text-slate-500" />
        </div>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg font-bold text-slate-300 mb-2"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="text-sm text-slate-500 max-w-xs leading-relaxed mb-7"
      >
        {description}
      </motion.p>

      {(action || secondaryAction) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 flex-wrap justify-center"
        >
          {action && (
            action.to ? (
              <Link to={action.to}>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="gradient-brand text-white text-sm font-semibold px-5 py-2.5 rounded-xl glow-sm"
                >
                  {action.label}
                </motion.button>
              </Link>
            ) : (
              <motion.button
                onClick={action.onClick}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="gradient-brand text-white text-sm font-semibold px-5 py-2.5 rounded-xl glow-sm"
              >
                {action.label}
              </motion.button>
            )
          )}

          {secondaryAction && (
            secondaryAction.to ? (
              <Link to={secondaryAction.to} className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                {secondaryAction.label}
              </Link>
            ) : (
              <button
                onClick={secondaryAction.onClick}
                className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
              >
                {secondaryAction.label}
              </button>
            )
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
