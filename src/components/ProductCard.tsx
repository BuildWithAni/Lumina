import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Star } from 'lucide-react';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = rating >= i + 1;
        const half = !filled && rating >= i + 0.5;
        return (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              filled
                ? 'fill-amber-400 text-amber-400'
                : half
                ? 'fill-amber-200 text-amber-400'
                : 'fill-zinc-200 text-zinc-300 dark:fill-zinc-600 dark:text-zinc-600'
            }`}
          />
        );
      })}
    </div>
  );
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const discountedPrice =
    product.discountPercentage > 0
      ? product.price * (1 - product.discountPercentage / 100)
      : null;

  return (
    <motion.article
      variants={cardVariants}
      layout
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className="group relative glass-card rounded-2xl overflow-hidden cursor-pointer
        shadow-lg hover:shadow-2xl hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/10
        transition-all duration-300 flex flex-col md:flex-row"
      style={{ willChange: 'transform' }}
    >
      {/* Image */}
      <div className="relative overflow-hidden md:w-64 lg:w-72 shrink-0 bg-white dark:bg-zinc-900/60 p-6 flex items-center justify-center min-h-[200px]">
        {/* Subtle glow behind image */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {discountedPrice && (
          <span className="absolute top-3 left-3 z-20 px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg">
            {product.discountPercentage.toFixed(0)}% OFF
          </span>
        )}
        <motion.img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="w-full h-48 object-contain drop-shadow-xl relative z-10"
          whileHover={{ scale: 1.08, rotate: -1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      </div>

      {/* Content */}
      <div className="p-6 py-7 flex flex-col flex-1 relative z-20 gap-3">
        {/* Title */}
        <h3 className="text-base md:text-lg font-semibold text-zinc-900 dark:text-zinc-50 leading-snug hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2">
          {product.title}
          {product.brand && <span className="text-zinc-400 dark:text-zinc-500 font-normal"> — {product.brand}</span>}
        </h3>

        {/* Category badge */}
        <span className="capitalize text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 self-start">
          {product.category}
        </span>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{product.rating.toFixed(1)}</span>
          <StarRating rating={product.rating} />
          <span className="text-sm text-sky-600 dark:text-sky-400">({(Math.floor(product.rating * 1234) % 4900 + 100).toLocaleString()} reviews)</span>
        </div>

        {/* Positively reviewed */}
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Positively reviewed for <span className="font-semibold text-zinc-800 dark:text-zinc-200">{product.category} quality</span>
        </p>

        {/* Separator */}
        <div className="border-t border-zinc-200/60 dark:border-zinc-700/50 mt-1" />

        {/* Price */}
        <div className="flex flex-wrap items-baseline gap-2">
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50 relative -top-1.5">INR</span>
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {discountedPrice
                ? (discountedPrice * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })
                : (product.price * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50 relative -top-1.5">00</span>
            {discountedPrice && (
              <span className="text-sm text-zinc-400 line-through ml-1">
                INR {(product.price * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
            )}
          </div>
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            (${discountedPrice ? discountedPrice.toFixed(2) : product.price.toFixed(2)}
            {discountedPrice && (
              <span className="line-through opacity-60 ml-1">${product.price.toFixed(2)}</span>
            )})
          </span>
        </div>
      </div>
    </motion.article>
  );
}
