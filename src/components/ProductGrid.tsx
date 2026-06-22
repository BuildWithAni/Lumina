import { AnimatePresence, motion } from 'framer-motion';
import type { Product } from '../types/product';
import ProductCard from './ProductCard';
import SkeletonCard from './SkeletonCard';
import { PackageSearch } from 'lucide-react';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
  exit: {},
};

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  onProductClick: (product: Product) => void;
}

export default function ProductGrid({
  products,
  loading,
  onProductClick,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <PackageSearch className="w-7 h-7 text-zinc-400" />
        </div>
        <div>
          <p className="text-zinc-700 dark:text-zinc-200 font-semibold">No products found</p>
          <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-1">Try a different search or category.</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={products.map((p) => p.id).join('-')}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex flex-col gap-4"
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => onProductClick(product)}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
