import { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import ThemeToggle from './ThemeToggle';

interface ProductTile {
  id: number;
  thumbnail: string;
  title: string;
  x: number;
  y: number;
  rot: number;
  scale: number;
  delay: number;
}

function FloatingProduct({ tile, index }: { tile: ProductTile; index: number }) {
  const floatOffset = useMotionValue(0);
  const rotate = useMotionValue(tile.rot);

  // Gentle floating animation — offset in pixels, base position via CSS %
  useEffect(() => {
    const floatY = animate(floatOffset, index % 2 === 0 ? 7 : -6, {
      duration: 3 + (index % 3) * 0.5,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    });
    const floatRot = animate(rotate, tile.rot + (index % 2 === 0 ? 2 : -2), {
      duration: 4 + (index % 2) * 1,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    });
    return () => {
      floatY.stop();
      floatRot.stop();
    };
  }, []);

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: `${tile.x}%`,
        top: `${tile.y}%`,
        y: floatOffset,
        rotate,
        translateX: '-50%',
        translateY: '-50%',
      }}
      whileHover={{ scale: tile.scale + 0.25, zIndex: 50 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      <div className="relative">
        <img
          src={tile.thumbnail}
          alt={tile.title}
          className="w-24 h-24 sm:w-28 sm:h-28 object-contain bg-white rounded-2xl shadow-[0_8px_32px_-8px_rgba(59,130,246,0.3)] dark:shadow-[0_8px_32px_-8px_rgba(255,255,255,0.15)] ring-1 ring-black/5 dark:ring-white/10"
          draggable={false}
        />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none" />
      </div>
    </motion.div>
  );
}

const SAMPLE_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const ROTS = [-4, 5, -6, 3, -3, 4, -5, 6, -4, 3, -5];
const SCALES = [0.85, 0.8, 0.9, 0.75, 0.85, 0.9, 0.75, 0.85, 0.9, 0.8, 0.85];

// Desktop positions — wide horizontal spread for the right-column container
const DESKTOP_POSITIONS = [
  { x: 6,  y: 3  },
  { x: 82, y: 5  },
  { x: 24, y: 22 },
  { x: 76, y: 19 },
  { x: 6,  y: 40 },
  { x: 46, y: 44 },
  { x: 90, y: 38 },
  { x: 18, y: 62 },
  { x: 74, y: 59 },
  { x: 28, y: 80 },
  { x: 74, y: 83 },
];

// Mobile positions — tighter horizontal spread, better vertical distribution
const MOBILE_POSITIONS = [
  { x: 10, y: 4  },
  { x: 76, y: 6  },
  { x: 22, y: 24 },
  { x: 70, y: 20 },
  { x: 8,  y: 42 },
  { x: 50, y: 44 },
  { x: 85, y: 38 },
  { x: 18, y: 62 },
  { x: 74, y: 58 },
  { x: 28, y: 80 },
  { x: 72, y: 82 },
];

function generateTiles(isMobile: boolean): ProductTile[] {
  const positions = isMobile ? MOBILE_POSITIONS : DESKTOP_POSITIONS;
  return positions.map((pos, i) => ({
    id: SAMPLE_IDS[i],
    thumbnail: '',
    title: '',
    x: pos.x,
    y: pos.y,
    rot: ROTS[i % 11],
    scale: SCALES[i % 11],
    delay: i * 0.08,
  }));
}

export default function LandingPage() {
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const handleEnter = () => navigate('/products');

  // Track viewport width for responsive tile positions
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' && window.innerWidth < 1024
  );
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 1024);
  }, []);
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const [productMap, setProductMap] = useState<Record<number, { thumbnail: string; title: string }>>({});
  const tiles = generateTiles(isMobile);

  useEffect(() => {
    fetch('/api/products?limit=15')
      .then((r) => r.json())
      .then((data) => {
        const map: Record<number, { thumbnail: string; title: string }> = {};
        (data.products as { id: number; thumbnail: string; title: string }[]).forEach((p) => {
          map[p.id] = { thumbnail: p.thumbnail, title: p.title };
        });
        setProductMap(map);
      })
      .catch(() => {});
  }, []);

  const productTiles = tiles.map((t) => ({
    ...t,
    thumbnail: productMap[t.id]?.thumbnail || '',
    title: productMap[t.id]?.title || '',
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a10] text-zinc-900 dark:text-[#e8e8ed] overflow-x-hidden">

      {/* ─── Layered abstract background ─── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Light mode pastel layers */}
        <div className="absolute inset-0 dark:opacity-0 transition-opacity duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(224,210,255,0.35)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(255,220,240,0.25)_0%,transparent_50%)]" />
          <div className="absolute -top-[10%] -right-[8%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(200,180,255,0.3)_0%,rgba(200,180,255,0.1)_40%,transparent_70%)] blur-[80px]" />
          <div className="absolute -bottom-[12%] -left-[6%] w-[60%] h-[55%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,200,220,0.25)_0%,rgba(255,200,220,0.08)_40%,transparent_65%)] blur-[80px]" />
          <div className="absolute top-[25%] right-[15%] w-[300px] h-[300px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(220,200,255,0.15)_0%,transparent_65%)] blur-[60px]" />
          <div className="absolute bottom-[20%] left-[10%] w-[250px] h-[250px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,215,235,0.12)_0%,transparent_60%)] blur-[50px]" />
          <div className="absolute top-[15%] left-[5%] w-[180px] h-[180px] rounded-full border border-[rgba(200,180,255,0.1)] blur-[2px]" />
          <div className="absolute bottom-[10%] right-[8%] w-[140px] h-[140px] rounded-full border border-[rgba(255,210,230,0.1)] blur-[2px]" />
        </div>

        {/* Dark mode subtle layers */}
        <div className="absolute inset-0 hidden dark:block">
          <div className="absolute -top-[20%] -right-[10%] w-[80%] h-[80%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(80,60,140,0.15)_0%,rgba(80,60,140,0.05)_40%,transparent_65%)] blur-[100px]" />
          <div className="absolute -bottom-[15%] -left-[8%] w-[60%] h-[50%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(120,50,80,0.1)_0%,transparent_60%)] blur-[80px]" />
          <div className="absolute top-[30%] right-[20%] w-[200px] h-[200px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(100,80,180,0.06)_0%,transparent_60%)] blur-[60px]" />
        </div>
      </div>

      {/* ─── NAV ─── */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 h-full flex items-center justify-between">
          <span className="font-black text-3xl tracking-[-0.03em] text-zinc-900 dark:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_2px_6px_rgba(255,255,255,0.1)]">Lumina</span>
        </div>
      </nav>

      {/* ─── Theme Toggle (fixed right side) ─── */}
      <div className="fixed top-4 right-6 z-50">
        <ThemeToggle dark={dark} onToggle={toggle} />
      </div>

      {/* ─── HERO (single viewport) ─── */}
      <section className="relative h-screen flex items-center pt-16 overflow-hidden">

        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

            {/* ── Left: Text ── */}
            <div className="flex-[1.2] z-10 pt-8 lg:pt-0 lg:pr-4">

              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                className="mt-6"
              >
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.04] tracking-[-0.03em] max-w-2xl">
                  <span className="text-zinc-900 dark:text-white">Discover Products</span>
                  <br />
                  <span className="relative">
                    <span className="text-blue-500">That Inspire.</span>
                    <span className="absolute -bottom-1.5 left-0 right-0 h-[3px] bg-blue-500/30 rounded-full" />
                  </span>
                </h1>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-zinc-500 dark:text-[#a0a0b0] text-base sm:text-lg lg:text-xl leading-[1.7] max-w-xl mt-6"
              >
                Explore 200+ products across 30+ categories. Filter, sort, and find exactly 
                what you need — all in a lightning-fast interface.
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.26, ease: [0.25, 0.1, 0.25, 1] }}
                className="mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleEnter}
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
                >
                  <span>Start Exploring</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                className="mt-12 pt-8"
              >
                <div className="flex items-center">
                  {[
                    { value: '200+', label: 'Products' },
                    { value: '30+', label: 'Categories' },
                    { value: '4.5★', label: 'Avg Rating' },
                  ].map((s, i) => (
                    <div key={s.label} className={`${i === 0 ? 'pr-8' : i === 1 ? 'px-8' : 'pl-8'}`}>
                      <p className="text-zinc-900 dark:text-white text-xl font-black tracking-tight">{s.value}</p>
                      <p className="text-zinc-400 dark:text-[#707080] text-[11px] font-medium mt-0.5 tracking-wide uppercase">{s.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>

            {/* ── Right: Floating Products ── */}
            <div className="flex-1 relative w-full h-[520px] sm:h-[600px] lg:h-[660px] z-10 mt-4 lg:mt-0">
              <div className="absolute inset-0" style={{ perspective: '1000px' }}>
                {productTiles.map((tile, i) => (
                  tile.thumbnail ? (
                    <FloatingProduct key={tile.id} tile={tile} index={i} />
                  ) : (
                    <div
                      key={tile.id}
                      className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-zinc-200 dark:bg-white/5 animate-pulse"
                      style={{ left: `${tile.x}%`, top: `${tile.y}%`, rotate: `${tile.rot}deg`, transform: 'translate(-50%, -50%)' }}
                    />
                  )
                ))}
              </div>
            </div>

          </div>
        </div>


      </section>

    </div>
  );
}
