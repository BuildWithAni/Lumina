import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, Check, Sparkles, TrendingUp, TrendingDown, ArrowDownAZ, ArrowUpZA } from 'lucide-react';
import type { Category, SortOption } from '../types/product';

const SORT_OPTIONS: { value: SortOption; label: string; desc: string; icon: React.ElementType }[] = [
  { value: 'default', label: 'Default', desc: 'Recommended', icon: Sparkles },
  { value: 'price-asc', label: 'Price', desc: 'Low to High', icon: TrendingUp },
  { value: 'price-desc', label: 'Price', desc: 'High to Low', icon: TrendingDown },
  { value: 'title-asc', label: 'Title', desc: 'A to Z', icon: ArrowDownAZ },
  { value: 'title-desc', label: 'Title', desc: 'Z to A', icon: ArrowUpZA },
];

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  activeCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
  sort: SortOption;
  onSelectSort: (s: SortOption) => void;
}

export default function FilterPanel({
  isOpen,
  onClose,
  categories,
  activeCategory,
  onSelectCategory,
  sort,
  onSelectSort,
}: FilterPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Panel Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-sm glass-panel bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-3xl shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-zinc-200/50 dark:border-white/10">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
                <Filter className="w-5 h-5" />
                <h2 className="text-xl font-bold">Filters</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-200/50 dark:hover:bg-white/10 text-zinc-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              <div className="mb-10">
                <h3 className="text-sm font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase mb-4">
                  Sort By
                </h3>
                <div className="flex flex-col gap-1">
                  {SORT_OPTIONS.map((opt) => (
                    <SortItem
                      key={opt.value}
                      label={opt.label}
                      desc={opt.desc}
                      icon={opt.icon}
                      active={sort === opt.value}
                      onClick={() => onSelectSort(opt.value)}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase mb-4">
                  Categories
                </h3>
                <div className="flex flex-col gap-1">
                  <CategoryItem
                    label="All Products"
                    active={activeCategory === null}
                    onClick={() => onSelectCategory(null)}
                  />
                  {categories.map((cat) => (
                    <CategoryItem
                      key={cat.slug}
                      label={cat.name}
                      active={activeCategory === cat.slug}
                      onClick={() => onSelectCategory(cat.slug)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-zinc-200/50 dark:border-white/10">
              <button
                onClick={onClose}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CategoryItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
        ${
          active
            ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-semibold'
            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5'
        }`}
    >
      <span className="capitalize">{label}</span>
      {active && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
    </button>
  );
}

function SortItem({
  label,
  desc,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  desc: string;
  icon: React.ElementType;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
        ${
          active
            ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-semibold'
            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5'
        }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
        <span>{label}</span>
      </div>
      <span className={`text-xs ${active ? 'text-indigo-600/70 dark:text-indigo-400/70 font-medium' : 'text-zinc-400 dark:text-zinc-500'}`}>
        {desc}
      </span>
    </button>
  );
}
