import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Filter,
  Check,
  Star,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ArrowDownAZ,
  ArrowUpZA,
} from 'lucide-react';
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
  minRating: number;
  onMinRatingChange: (r: number) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
}

export default function FilterPanel({
  isOpen,
  onClose,
  categories,
  activeCategory,
  onSelectCategory,
  sort,
  onSelectSort,
  minRating,
  onMinRatingChange,
  priceRange,
  onPriceRangeChange,
}: FilterPanelProps) {
  const hasFilters =
    activeCategory !== null ||
    sort !== 'default' ||
    minRating > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 83000;

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const clearFilters = () => {
    onSelectCategory(null);
    onSelectSort('default');
    onMinRatingChange(0);
    onPriceRangeChange([0, 83000]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm lg:hidden"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] rounded-t-3xl glass-panel bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-3xl shadow-2xl flex flex-col lg:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-200/60 dark:border-white/10">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
                <Filter className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-bold">Filters & Sort</h2>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-zinc-200/70 dark:hover:bg-white/10 text-zinc-500 transition-colors"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
              <section className="mb-8">
                <h3 className="text-xs font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase mb-3">
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
              </section>

              <section className="mb-8">
                <h3 className="text-xs font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase mb-3">
                  Minimum Rating
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => onMinRatingChange(minRating === rating ? 0 : rating)}
                      className={`flex min-h-11 items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm transition-all ${
                        minRating === rating
                          ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold'
                          : 'bg-zinc-100/70 dark:bg-white/5 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        {rating}+
                      </span>
                      {minRating === rating && <Check className="w-4 h-4 text-amber-500" />}
                    </button>
                  ))}
                </div>
              </section>

              <section className="mb-8">
                <h3 className="text-xs font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase mb-3">
                  Price Range
                </h3>
                <div className="rounded-2xl bg-zinc-100/70 dark:bg-white/5 p-4">
                  <div className="flex justify-between gap-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-4">
                    <span>INR {priceRange[0].toLocaleString('en-IN')}</span>
                    <span>INR {priceRange[1].toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={83000}
                    step={1000}
                    value={priceRange[1]}
                    onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {[10000, 25000, 50000, 83000].map((value) => (
                      <button
                        key={value}
                        onClick={() => onPriceRangeChange([0, value])}
                        className={`min-h-9 rounded-lg px-1 text-[11px] font-bold transition-all ${
                          priceRange[1] === value
                            ? 'bg-indigo-500 text-white'
                            : 'bg-white/80 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        {value === 83000 ? 'Max' : `${value / 1000}k`}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase mb-3">
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
              </section>
            </div>

            <div className="grid grid-cols-[auto_1fr] gap-3 p-4 border-t border-zinc-200/60 dark:border-white/10">
              <button
                onClick={clearFilters}
                disabled={!hasFilters}
                className="min-h-11 px-4 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Clear
              </button>
              <button
                onClick={onClose}
                className="min-h-11 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
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
      className={`w-full min-h-11 flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-left transition-all duration-200 ${
        active
          ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-semibold'
          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5'
      }`}
    >
      <span className="capitalize break-words">{label}</span>
      {active && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
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
      className={`w-full min-h-11 flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
        active
          ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-semibold'
          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5'
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
        <span className="truncate">{label}</span>
      </div>
      <span className={`text-xs shrink-0 ${active ? 'text-indigo-600/70 dark:text-indigo-400/70 font-medium' : 'text-zinc-400 dark:text-zinc-500'}`}>
        {desc}
      </span>
    </button>
  );
}
