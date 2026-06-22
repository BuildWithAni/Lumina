import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Star, SlidersHorizontal, Sparkles, TrendingUp, TrendingDown, ArrowDownAZ, ArrowUpZA } from 'lucide-react';
import type { Category, SortOption } from '../types/product';

interface LeftSidebarProps {
  categories: Category[];
  activeCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
  sort: SortOption;
  onSelectSort: (s: SortOption) => void;
  minRating: number;
  onMinRatingChange: (r: number) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  loading?: boolean;
}

const SORT_OPTIONS: { value: SortOption; label: string; icon: React.ElementType }[] = [
  { value: 'default', label: 'Recommended', icon: Sparkles },
  { value: 'price-asc', label: 'Price: Low to High', icon: TrendingUp },
  { value: 'price-desc', label: 'Price: High to Low', icon: TrendingDown },
  { value: 'title-asc', label: 'Title: A to Z', icon: ArrowDownAZ },
  { value: 'title-desc', label: 'Title: Z to A', icon: ArrowUpZA },
];

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-zinc-200/50 dark:border-white/10 pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <span className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">{title}</span>
        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LeftSidebar({
  categories,
  activeCategory,
  onSelectCategory,
  sort,
  onSelectSort,
  minRating,
  onMinRatingChange,
  priceRange,
  onPriceRangeChange,
  loading = false,
}: LeftSidebarProps) {
  const [showAllCats, setShowAllCats] = useState(false);
  const visibleCats = showAllCats ? categories : categories.slice(0, 8);

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="sticky top-20 glass-card rounded-2xl p-4 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
          <h2 className="font-bold text-zinc-900 dark:text-zinc-50">Filters</h2>
        </div>

        {/* Sort */}
        <Section title="Sort By">
          <div className="flex flex-col gap-1">
            {SORT_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const active = sort === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => onSelectSort(opt.value)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all
                    ${active ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5'}`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-indigo-500' : 'text-zinc-400'}`} />
                  {opt.label}
                  {active && <Check className="w-3.5 h-3.5 ml-auto text-indigo-500" />}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Rating */}
        <Section title="Min. Rating">
          <div className="flex flex-col gap-1.5">
            {[4, 3, 2, 1].map((r) => (
              <button
                key={r}
                onClick={() => onMinRatingChange(minRating === r ? 0 : r)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all
                  ${minRating === r ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5'}`}
              >
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < r ? 'fill-amber-400 text-amber-400' : 'fill-zinc-200 text-zinc-300 dark:fill-zinc-700 dark:text-zinc-700'}`} />
                  ))}
                </div>
                <span>& up</span>
                {minRating === r && <Check className="w-3.5 h-3.5 ml-auto text-amber-500" />}
              </button>
            ))}
          </div>
        </Section>

        {/* Price Range */}
        <Section title="Price Range (INR)">
          <div className="px-1">
            <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-3">
              <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
              <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
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
            <div className="flex gap-2 mt-3">
              {[10000, 25000, 50000, 83000].map((v) => (
                <button
                  key={v}
                  onClick={() => onPriceRangeChange([0, v])}
                  className={`flex-1 text-[10px] py-1 rounded-lg font-medium transition-all
                    ${priceRange[1] === v ? 'bg-indigo-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}
                >
                  ₹{v >= 1000 ? `${v / 1000}k` : v}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Categories */}
        <Section title="Categories">
          <div className="flex flex-col gap-1">
            {loading || categories.length === 0 ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 animate-pulse" style={{ width: `${70 + (i % 3) * 10}%` }} />
              ))
            ) : (
              <>
                <button
                  onClick={() => onSelectCategory(null)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all
                    ${activeCategory === null ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5'}`}
                >
                  All Products
                  {activeCategory === null && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                </button>
                {visibleCats.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => onSelectCategory(cat.slug)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm capitalize transition-all
                      ${activeCategory === cat.slug ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5'}`}
                  >
                    {cat.name}
                    {activeCategory === cat.slug && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                  </button>
                ))}
                {categories.length > 8 && (
                  <button
                    onClick={() => setShowAllCats(!showAllCats)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 px-3 py-2 hover:underline text-left"
                  >
                    {showAllCats ? 'Show less' : `+${categories.length - 8} more`}
                  </button>
                )}
              </>
            )}
          </div>
        </Section>

        {/* Reset */}
        {(activeCategory || sort !== 'default' || minRating > 0 || priceRange[1] < 83000) && (
          <button
            onClick={() => {
              onSelectCategory(null);
              onSelectSort('default');
              onMinRatingChange(0);
              onPriceRangeChange([0, 83000]);
            }}
            className="w-full py-2.5 text-sm font-semibold text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </aside>
  );
}
