import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Category } from '../types/product';

interface CategoryFilterProps {
  categories: Category[];
  active: string | null;
  onSelect: (slug: string | null) => void;
}

export default function CategoryFilter({
  categories,
  active,
  onSelect,
}: CategoryFilterProps) {
  const [expanded, setExpanded] = useState(false);

  // Show all if expanded, otherwise just show first 7 (plus the "All" pill makes 8)
  const visibleCategories = expanded ? categories : categories.slice(0, 7);
  const hiddenCount = categories.length - 7;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
          Browse Categories
        </h3>
        {categories.length > 7 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            {expanded ? 'Show Less' : `Show All (${categories.length})`}
          </button>
        )}
      </div>

      <motion.div layout transition={{ duration: 0.3, ease: 'easeInOut' }} className="flex flex-wrap gap-2.5">
        <motion.div layout transition={{ duration: 0.3, ease: 'easeInOut' }}>
          <Pill
            label="All Products"
            active={active === null}
            onClick={() => onSelect(null)}
          />
        </motion.div>
        <AnimatePresence>
          {visibleCategories.map((cat) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              layout
            >
              <Pill
                label={cat.name}
                active={active === cat.slug}
                onClick={() => onSelect(cat.slug)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {!expanded && hiddenCount > 0 && (
          <motion.button
            layout
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={() => setExpanded(true)}
            className="px-5 py-2 rounded-full text-sm font-semibold text-zinc-500 dark:text-zinc-400 border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            +{hiddenCount} more
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}

function Pill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors overflow-hidden
        ${
          active
            ? 'text-white'
            : 'bg-white/50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 border border-zinc-200/50 dark:border-zinc-700/50'
        }`}
    >
      {active && (
        <motion.div
          layoutId="activeCategory"
          className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </motion.button>
  );
}
