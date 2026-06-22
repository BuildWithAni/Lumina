import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  dark: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ dark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      className="relative w-14 h-7 rounded-full flex items-center cursor-pointer
        bg-zinc-200 dark:bg-blue-950/60
        transition-colors duration-300 shrink-0"
    >
      {/* Sun icon */}
      <Sun className="w-3 h-3 text-zinc-400 dark:text-zinc-500 absolute left-[10px] pointer-events-none z-10" />

      {/* Moon icon */}
      <Moon className="w-3 h-3 text-zinc-500 dark:text-zinc-300 absolute right-[10px] pointer-events-none z-10" />

      {/* Thumb */}
      <motion.div
        className="absolute top-[3px] w-5 h-5 rounded-full shadow-md bg-white dark:bg-zinc-100 z-20"
        style={{ left: 3 }}
        animate={{ x: dark ? 30 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
}
