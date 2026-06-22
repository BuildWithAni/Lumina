import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useDebounce } from '../hooks/useDebounce';
import { useTheme } from '../hooks/useTheme';
import { sortProducts } from '../utils/sort';
import { encodeProductId } from '../utils/productId';
import type { Product, SortOption } from '../types/product';
import ProductGrid from './ProductGrid';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import ErrorState from './ErrorState';
import ThemeToggle from './ThemeToggle';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';

export default function ProductsPage() {
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchRaw, setSearchRaw] = useState('');
  const [sort, setSort] = useState<SortOption>('default');
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('lumina:recentlyViewed');
      return stored ? (JSON.parse(stored) as Product[]) : [];
    } catch {
      return [];
    }
  });
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 83000]);

  const search = useDebounce(searchRaw, 400);

  const {
    products,
    total,
    page,
    totalPages,
    loading,
    error,
    setPage,
    retry,
  } = useProducts(activeCategory);

  const { categories, loading: catLoading } = useCategories();

  const processed = useMemo(() => {
    let result = products;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q));
    }
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }
    if (priceRange[1] < 83000 || priceRange[0] > 0) {
      result = result.filter((p) => {
        const inrPrice = p.price * 83;
        return inrPrice >= priceRange[0] && inrPrice <= priceRange[1];
      });
    }
    return sortProducts(result, sort);
  }, [products, search, sort, minRating, priceRange]);

  const handleCategoryChange = useCallback((slug: string | null) => {
    setActiveCategory(slug);
    setSearchRaw('');
    navigate('/products', { replace: true });
  }, [navigate]);

  // Persist recently viewed to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('lumina:recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const handleProductClick = useCallback((p: Product) => {
    navigate(`/products/${encodeProductId(p.id)}`);
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((x) => x.id !== p.id);
      return [p, ...filtered].slice(0, 5);
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-mesh-light dark:bg-gradient-mesh text-zinc-900 dark:text-zinc-50 transition-colors duration-500 relative">
      <header className="sticky top-0 z-30 bg-white/70 dark:bg-[#0a0a10]/70 backdrop-blur-2xl border-b border-zinc-200/50 dark:border-white/5">
        <div className="max-w-full mx-auto px-4 lg:px-6 h-[72px] flex items-center justify-center">
          <button onClick={() => navigate('/')} className="absolute left-4 lg:left-6 flex items-center gap-2.5 shrink-0">
            <span className="font-black text-2xl tracking-[-0.03em] text-zinc-900 dark:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_2px_6px_rgba(255,255,255,0.1)]">Lumina</span>
          </button>
          <div className="w-full max-w-md">
            <SearchBar value={searchRaw} onChange={setSearchRaw} />
          </div>
        </div>
      </header>

      {/* ─── Theme Toggle (fixed right side) ─── */}
      <div className="fixed top-4 right-6 z-50">
        <ThemeToggle dark={dark} onToggle={toggle} />
      </div>

      <div className="max-w-full mx-auto px-4 lg:px-6 py-8">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <LeftSidebar
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={handleCategoryChange}
            sort={sort}
            onSelectSort={setSort}
            minRating={minRating}
            onMinRatingChange={setMinRating}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            loading={catLoading}
          />

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Result info bar */}
            {!loading && !error && (
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200/50 dark:border-white/10">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Showing{' '}
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{processed.length}</span>
                  {' '}of{' '}
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{total}</span>
                  {' '}products
                  {activeCategory && (
                    <span className="ml-1">in <span className="capitalize font-semibold text-indigo-600 dark:text-indigo-400">{activeCategory}</span></span>
                  )}
                  {search.trim() && (
                    <span className="ml-1">for <span className="font-semibold text-indigo-600 dark:text-indigo-400">"{search}"</span></span>
                  )}
                </p>
                {(minRating > 0 || priceRange[1] < 83000 || activeCategory) && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-700/50">
                    Filters Active
                  </span>
                )}
              </div>
            )}

            {error ? (
              <ErrorState message={error} onRetry={retry} />
            ) : (
              <>
                <ProductGrid
                  products={processed}
                  loading={loading}
                  onProductClick={handleProductClick}
                />
                {!search.trim() && (
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                )}
              </>
            )}
          </main>

          {/* Right Sidebar */}
          <RightSidebar
            recentlyViewed={recentlyViewed}
            allProducts={products}
            onProductClick={handleProductClick}
          />
        </div>
      </div>

    </div>
  );
}
