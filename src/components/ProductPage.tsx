import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { decodeProductId } from '../utils/productId';
import { fetchProductById } from '../services/api';
import { useTheme } from '../hooks/useTheme';
import {
  ArrowLeft, ChevronLeft, ChevronRight, Star, Tag,
  Ruler, Package, Truck, ShieldCheck, RotateCcw, Weight,
  User, Quote,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import type { Product, Review } from '../types/product';

/* ─── Sub-components ─── */

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' }) {
  const cls = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = rating >= i + 1;
        const half = !filled && rating >= i + 0.5;
        return (
          <Star
            key={i}
            className={`${cls} ${
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

function StockBadge({ stock, status }: { stock: number; status: string }) {
  const color =
    stock === 0
      ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800/30'
      : stock <= 10
      ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/30'
      : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      {status || (stock === 0 ? 'Out of Stock' : stock <= 10 ? `Low Stock (${stock} left)` : 'In Stock')}
    </span>
  );
}

function SpecCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50">
      <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 dark:text-indigo-400 shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 break-words">{value}</p>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: string }) {
  const dotColor =
    color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
    color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
    'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400';

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm">
      <div className={`w-10 h-10 rounded-xl ${dotColor} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1">{title}</h4>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            {review.reviewerName.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{review.reviewerName}</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              {new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>
      <div className="relative pl-4 border-l-2 border-zinc-200 dark:border-zinc-700">
        <Quote className="absolute -top-1 -left-1.5 w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600 rotate-180" />
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed italic">{review.comment}</p>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */

export default function ProductPage() {
  const { id: encodedId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    if (!encodedId) return;
    const decoded = decodeProductId(encodedId);
    if (decoded === null) {
      setError('Invalid product ID');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const controller = new AbortController();

    fetchProductById(decoded, controller.signal)
      .then((data) => {
        setProduct(data);
        setImgIndex(0);
        setLoading(false);

        // Track in recently viewed (persisted via localStorage)
        try {
          const stored = localStorage.getItem('lumina:recentlyViewed');
          const viewed: Product[] = stored ? JSON.parse(stored) : [];
          const filtered = viewed.filter((x) => x.id !== data.id);
          filtered.unshift(data);
          localStorage.setItem('lumina:recentlyViewed', JSON.stringify(filtered.slice(0, 5)));
        } catch { /* ignore */ }
      })
      .catch((e) => {
        if (e.name !== 'CanceledError' && e.name !== 'AbortError') {
          setError(e.message || 'Failed to load product');
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [encodedId]);

  const navigateImg = useCallback(
    (dir: number) => {
      if (!product) return;
      setImgIndex((i) => (i + dir + product.images.length) % product.images.length);
    },
    [product]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/products');
      if (e.key === 'ArrowRight' && product) navigateImg(1);
      if (e.key === 'ArrowLeft' && product) navigateImg(-1);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  });

  const discountedPrice =
    product && product.discountPercentage > 0
      ? product.price * (1 - product.discountPercentage / 100)
      : null;

  /* ─── Loading State ─── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-mesh-light dark:bg-gradient-mesh flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-400/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  /* ─── Error State ─── */
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-mesh-light dark:bg-gradient-mesh flex flex-col items-center justify-center gap-6">
        <p className="text-zinc-500 dark:text-zinc-400 text-lg">{error || 'Product not found'}</p>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-500/25"
        >
          Back to Products
        </button>
      </div>
    );
  }

  /* ─── Main Render ─── */
  return (
    <div className="min-h-screen bg-gradient-mesh-light dark:bg-gradient-mesh text-zinc-900 dark:text-zinc-50 transition-colors duration-500">
      {/* ═══════════ HEADER ═══════════ */}
      <header className="sticky top-0 z-30 bg-white/70 dark:bg-[#0a0a10]/70 backdrop-blur-2xl border-b border-zinc-200/50 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 sm:h-[72px] flex items-center justify-between pr-16 sm:pr-4 lg:pr-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/products')}
              className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              aria-label="Back to products"
            >
              <ArrowLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
            </button>
            <button onClick={() => navigate('/')} className="flex items-center gap-2.5">
              <span className="font-black text-2xl tracking-[-0.03em] text-zinc-900 dark:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_2px_6px_rgba(255,255,255,0.1)]">
                Lumina
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-700/50 text-xs font-mono font-semibold tracking-wider">
              <Tag className="w-3 h-3" />
              ID: {encodedId}
            </span>
          </div>
        </div>
      </header>

      {/* ─── Theme Toggle ─── */}
      <div className="fixed top-3 right-4 sm:top-4 sm:right-6 z-50">
        <ThemeToggle dark={dark} onToggle={toggle} />
      </div>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <div className="flex flex-col lg:h-[calc(100vh-72px)] lg:overflow-hidden lg:flex-row">

        {/* ── LEFT: Square Image (stays fixed while details scroll) ── */}
        <div className="w-full bg-zinc-100/50 dark:bg-zinc-900/30 lg:w-[500px] xl:w-[580px] shrink-0 flex flex-col">
          {/* Mobile: horizontal scroll of thumbs */}
          <div className="flex lg:hidden gap-2 p-4 pb-0 overflow-x-auto">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setImgIndex(i)}
                className={`w-16 h-16 rounded-xl border-2 shrink-0 overflow-hidden transition-all ${
                  i === imgIndex
                    ? 'border-indigo-500 ring-2 ring-indigo-500/30 shadow-md'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Square image area */}
          <div className="flex h-[min(72vw,360px)] gap-3 p-4 sm:h-[420px] sm:p-6 lg:h-auto lg:gap-4 lg:p-8 xl:p-10 lg:flex-1 lg:aspect-square lg:max-h-[580px] xl:max-h-[680px]">
            {/* Desktop: vertical thumbnail strip */}
            <div className="hidden lg:flex flex-col gap-2.5">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={`w-[72px] h-[72px] rounded-xl border-2 overflow-hidden transition-all ${
                    i === imgIndex
                      ? 'border-indigo-500 ring-2 ring-indigo-500/30 shadow-md scale-105'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main square image */}
            <div className="flex-1 flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none rounded-2xl" />
              <img
                src={product.images[imgIndex]}
                alt={`${product.title} image ${imgIndex + 1}`}
                className="relative w-full h-full object-contain drop-shadow-2xl transition-all duration-300 p-2"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImg(-1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                      bg-white/80 dark:bg-zinc-900/80 flex items-center justify-center
                      shadow-lg hover:bg-white dark:hover:bg-zinc-900 transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
                  </button>
                  <button
                    onClick={() => navigateImg(1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                      bg-white/80 dark:bg-zinc-900/80 flex items-center justify-center
                      shadow-lg hover:bg-white dark:hover:bg-zinc-900 transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Scrollable details column ── */}
        <div className="flex-1 lg:border-l border-zinc-200/50 dark:border-zinc-700/50 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md lg:overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 xl:p-10 space-y-6">

            {/* Tags & Stock */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full
                bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400
                border border-indigo-100 dark:border-indigo-800/30 capitalize">
                <Tag className="w-3 h-3" />
                {product.category}
              </span>
              <StockBadge stock={product.stock} status={product.availabilityStatus} />
            </div>

            {/* Title & Brand */}
            <div>
              <h1 className="text-2xl sm:text-3xl xl:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight">
                {product.title}
              </h1>
              {product.brand && (
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1.5 uppercase tracking-widest">
                  {product.brand}
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <StarRating rating={product.rating} />
              <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                {product.rating.toFixed(1)}
              </span>
              {product.reviews && (
                <span className="text-sm text-indigo-500 dark:text-indigo-400">
                  ({product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''})
                </span>
              )}
            </div>

            {/* Price */}
            <div className="py-4 px-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-700/50">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">INR</span>
                  <span className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
                    {discountedPrice
                      ? (discountedPrice * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })
                      : (product.price * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                {discountedPrice && (
                  <span className="text-base text-zinc-400 line-through">
                    INR {(product.price * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                )}
                {discountedPrice && (
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md">
                    {product.discountPercentage.toFixed(0)}% OFF
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2 mt-1 text-sm text-zinc-400 dark:text-zinc-500">
                <span>(${discountedPrice ? discountedPrice.toFixed(2) : product.price.toFixed(2)}</span>
                {discountedPrice && <span className="line-through">${product.price.toFixed(2)}</span>}
                <span>)</span>
              </div>
              {product.minimumOrderQuantity > 1 && (
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2 border-t border-zinc-200/50 dark:border-zinc-700/50 pt-2">
                  Minimum order: {product.minimumOrderQuantity} units
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {product.description}
            </p>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 capitalize border border-zinc-200/50 dark:border-zinc-700/50"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* ── Divider ── */}
            <hr className="border-zinc-200/50 dark:border-zinc-700/50" />

            {/* ── SPECIFICATIONS ── */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-4 flex items-center gap-2">
                <motion.div
                  initial={{ rotate: -15, scale: 0.8 }}
                  whileInView={{ rotate: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
                >
                  <Ruler className="w-5 h-5 text-indigo-500" />
                </motion.div>
                Specifications
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Weight className="w-5 h-5" />, label: 'Weight', value: `${product.weight} g` },
                  { icon: <Ruler className="w-5 h-5" />, label: 'Dimensions', value: `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm` },
                  { icon: <Package className="w-5 h-5" />, label: 'SKU', value: product.sku },
                  { icon: <Tag className="w-5 h-5" />, label: 'Min Order', value: `${product.minimumOrderQuantity} unit${product.minimumOrderQuantity > 1 ? 's' : ''}` },
                ].map((spec, i) => (
                  <motion.div
                    key={spec.label}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <SpecCard icon={spec.icon} label={spec.label} value={spec.value} />
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* ── POLICIES & SHIPPING ── */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-4 flex items-center gap-2">
                <motion.div
                  initial={{ rotate: -15, scale: 0.8 }}
                  whileInView={{ rotate: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
                >
                  <ShieldCheck className="w-5 h-5 text-indigo-500" />
                </motion.div>
                Policies & Shipping
              </h2>
              <div className="space-y-3">
                {[
                  { icon: <ShieldCheck className="w-5 h-5" />, title: 'Warranty', description: product.warrantyInformation, color: 'blue' as const },
                  { icon: <Truck className="w-5 h-5" />, title: 'Shipping', description: product.shippingInformation, color: 'amber' as const },
                  { icon: <RotateCcw className="w-5 h-5" />, title: 'Returns', description: product.returnPolicy, color: 'emerald' as const },
                ].map((card, i) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <InfoCard icon={card.icon} title={card.title} description={card.description} color={card.color} />
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* ── CUSTOMER REVIEWS ── */}
            {product.reviews && product.reviews.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-4 flex items-center gap-2">
                  <motion.div
                    initial={{ rotate: -15, scale: 0.8 }}
                    whileInView={{ rotate: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
                  >
                    <User className="w-5 h-5 text-indigo-500" />
                  </motion.div>
                  Customer Reviews
                  <span className="text-sm font-normal text-zinc-400 dark:text-zinc-500">({product.reviews.length})</span>
                </h2>
                <div className="space-y-3">
                  {product.reviews.map((review, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ duration: 0.35, delay: 0.08 + i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <ReviewCard review={review} />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* ── Back button ── */}
            <motion.div
              className="pt-2 pb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <button
                onClick={() => navigate('/products')}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 font-semibold text-sm transition-colors border border-zinc-200/50 dark:border-zinc-700/50"
              >
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ArrowLeft className="w-4 h-4" />
                </motion.span>
                Back to All Products
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
