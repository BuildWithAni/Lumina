import { ChevronDown, Sparkles, TrendingUp, TrendingDown, ArrowDownAZ, ArrowUpZA } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { SortOption } from '../types/product';

const OPTIONS: { value: SortOption; label: string; desc: string; icon: React.ElementType }[] = [
  { value: 'default', label: 'Default', desc: 'Recommended', icon: Sparkles },
  { value: 'price-asc', label: 'Price', desc: 'Low to High', icon: TrendingUp },
  { value: 'price-desc', label: 'Price', desc: 'High to Low', icon: TrendingDown },
  { value: 'title-asc', label: 'Title', desc: 'A to Z', icon: ArrowDownAZ },
  { value: 'title-desc', label: 'Title', desc: 'Z to A', icon: ArrowUpZA },
];

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scaleY: 0.95 },
  visible: { opacity: 1, y: 0, scaleY: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, y: -8, scaleY: 0.95, transition: { duration: 0.1 } },
};

interface SortDropdownProps {
  value: SortOption;
  onChange: (v: SortOption) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = OPTIONS.find((o) => o.value === value)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm rounded-full glass-card
          text-zinc-700 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-500 transition-all duration-300 whitespace-nowrap shadow-sm"
      >
        <span className="font-medium text-zinc-900 dark:text-zinc-50">{current.label}</span>
        {current.desc !== 'Recommended' && <span className="text-zinc-500 dark:text-zinc-400">({current.desc})</span>}
        <ChevronDown
          className={`w-4 h-4 text-zinc-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ originY: 0 }}
            className="absolute right-0 mt-2 z-50 min-w-[220px] bg-white/95 dark:bg-[#121212]/95 backdrop-blur-3xl
              border border-zinc-200/50 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden p-1.5"
          >
            {OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isActive = opt.value === value;
              return (
                <li key={opt.value}>
                  <button
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-xl transition-all duration-200
                      ${isActive
                        ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-50'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
                      <span>{opt.label}</span>
                    </div>
                    <span className={`text-xs ${isActive ? 'text-indigo-600/70 dark:text-indigo-400/70 font-medium' : 'text-zinc-400 dark:text-zinc-500'}`}>
                      {opt.desc}
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
