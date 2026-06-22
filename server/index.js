import express from 'express';
import cors from 'cors';
import { productCache, detailCache, categoryCache } from './cache.js';

const app = express();
const PORT = process.env.PORT || 3001;

const DUMMYJSON_BASE = 'https://dummyjson.com';

app.use(cors());
app.use(express.json());

// ── Helper: fetch with caching ──

async function fetchWithCache(url, cache, cacheKey) {
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached !== undefined) {
    console.log(`  [CACHE HIT] ${cacheKey}`);
    return cached;
  }

  console.log(`  [FETCH]    ${url}`);
  const res = await fetch(url);

  if (!res.ok) {
    const err = new Error(`DummyJSON returned ${res.status}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();

  // Store in cache
  cache.set(cacheKey, data);
  return data;
}

// ── Routes ──

/** GET /api/products?limit=12&skip=0&select=... */
app.get('/api/products', async (req, res) => {
  try {
    const { limit = 12, skip = 0, ...rest } = req.query;

    // Build query string preserving ALL original params
    const params = new URLSearchParams({ limit, skip });
    for (const [k, v] of Object.entries(rest)) {
      if (Array.isArray(v)) v.forEach(val => params.append(k, val));
      else params.append(k, v);
    }
    const qs = params.toString();

    const cacheKey = `products:${qs}`;
    const data = await fetchWithCache(
      `${DUMMYJSON_BASE}/products?${qs}`,
      productCache,
      cacheKey,
    );
    res.json(data);
  } catch (err) {
    console.error('  [ERROR] /api/products', err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
});

/** GET /api/products/:id */
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ error: 'Product ID must be numeric' });
    }
    const cacheKey = `product:${id}`;
    const data = await fetchWithCache(
      `${DUMMYJSON_BASE}/products/${id}`,
      detailCache,
      cacheKey,
    );
    res.json(data);
  } catch (err) {
    console.error(`  [ERROR] /api/products/${req.params.id}`, err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
});

/** GET /api/categories */
app.get('/api/categories', async (req, res) => {
  try {
    const data = await fetchWithCache(
      `${DUMMYJSON_BASE}/products/categories`,
      categoryCache,
      'categories',
    );
    res.json(data);
  } catch (err) {
    console.error('  [ERROR] /api/categories', err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
});

/** GET /api/products/category/:slug?limit=12&skip=0&select=... */
app.get('/api/products/category/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { limit = 12, skip = 0, ...rest } = req.query;

    const params = new URLSearchParams({ limit, skip });
    for (const [k, v] of Object.entries(rest)) {
      if (Array.isArray(v)) v.forEach(val => params.append(k, val));
      else params.append(k, v);
    }
    const qs = params.toString();

    const cacheKey = `category:${slug}:${qs}`;
    const data = await fetchWithCache(
      `${DUMMYJSON_BASE}/products/category/${slug}?${qs}`,
      productCache,
      cacheKey,
    );
    res.json(data);
  } catch (err) {
    console.error(`  [ERROR] /api/products/category/${req.params.slug}`, err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ── Health check ──
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    cache: {
      productCache: productCache.size,
      detailCache: detailCache.size,
      categoryCache: categoryCache.size,
    },
  });
});

// ── Start ──
app.listen(PORT, () => {
  console.log(`\n  🚀  DummyJSON Proxy Server running on http://localhost:${PORT}`);
  console.log(`  📦  Caches: products=${productCache._defaultTtl/1000}s | details=${detailCache._defaultTtl/1000}s | categories=${categoryCache._defaultTtl/1000}s\n`);
});
