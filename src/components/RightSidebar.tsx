import { motion } from 'framer-motion';
import { Clock, Star, Flame } from 'lucide-react';
import type { Product } from '../types/product';

interface RightSidebarProps {
  recentlyViewed: Product[];
  allProducts: Product[];
  onProductClick: (p: Product) => void;
}

function SideCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl p-3 mb-3">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-indigo-500" />
        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function RightSidebar({
  recentlyViewed,
  allProducts,
  onProductClick,
}: RightSidebarProps) {
  const topRated = [...allProducts]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  const hotDeals = [...allProducts]
    .sort((a, b) => b.discountPercentage - a.discountPercentage)
    .slice(0, 4);

  return (
    <aside className="w-64 shrink-0 hidden xl:block">
      <div className="sticky top-20 flex flex-col gap-0 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide">

        {/* Hot Deals */}
        <SideCard title="Hot Deals" icon={Flame}>
          <div className="flex flex-col gap-2.5">
            {hotDeals.map((p) => {
              const salePrice = p.price * (1 - p.discountPercentage / 100);
              return (
                <motion.button
                  key={p.id}
                  whileHover={{ x: 3 }}
                  onClick={() => onProductClick(p)}
                  className="flex items-center gap-3 text-left group"
                >
                  <div className="relative shrink-0">
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-11 h-11 object-contain rounded-lg bg-white dark:bg-zinc-800 p-1"
                    />
                    <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-red-500 to-orange-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full leading-tight shadow-lg shadow-red-500/30">
                      -{Math.round(p.discountPercentage)}%
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {p.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-zinc-400 line-through">
                        ₹{(p.price * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{(salePrice * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </SideCard>

        {/* Recently Viewed */}
        <SideCard title="Recently Viewed" icon={Clock}>
          {recentlyViewed.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {recentlyViewed.map((p) => {
                const dp = p.discountPercentage > 0 ? p.price * (1 - p.discountPercentage / 100) : null;
                return (
                  <motion.button
                    key={p.id}
                    whileHover={{ x: 3 }}
                    onClick={() => onProductClick(p)}
                    className="flex items-center gap-3 text-left group"
                  >
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-11 h-11 object-contain rounded-lg bg-white dark:bg-zinc-800 p-1 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {p.title}
                      </p>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                        ₹{((dp ?? p.price) * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center py-3">
              Click on a product to start tracking your recently viewed items
            </p>
          )}
        </SideCard>

        {/* Top Rated */}
        <SideCard title="Top Rated Picks" icon={Star}>
          <div className="flex flex-col gap-2.5">
            {topRated.map((p, i) => (
              <motion.button
                key={p.id}
                whileHover={{ x: 3 }}
                onClick={() => onProductClick(p)}
                className="flex items-center gap-3 text-left group"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                  {i + 1}
                </div>
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  className="w-10 h-10 object-contain rounded-lg bg-white dark:bg-zinc-800 p-1 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {p.title}
                  </p>
                  <p className="text-[10px] text-amber-500 font-bold">★ {p.rating.toFixed(1)}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </SideCard>

      </div>
    </aside>
  );
}
