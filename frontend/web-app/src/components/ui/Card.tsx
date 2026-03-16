import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  animate?: boolean;
}

export function Card({ children, className = '', hover, animate }: CardProps) {
  const base = `glass rounded-2xl p-6 ${hover ? 'glass-hover cursor-pointer' : ''} ${className}`;

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={base}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={base}>{children}</div>;
}
