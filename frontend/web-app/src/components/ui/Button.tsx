import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  loading,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl px-6 py-2.5 transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'gradient-brand text-white hover:opacity-90 glow-sm',
    ghost: 'glass glass-hover text-slate-200',
    danger: 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.96 }}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...(props as object)}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {children}
    </motion.button>
  );
}
