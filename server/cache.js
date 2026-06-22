/**
 * Simple in-memory cache with TTL (time-to-live).
 * Stores frequently requested data to reduce redundant calls to DummyJSON.
 */
export class MemoryCache {
  constructor(defaultTtlMs = 60_000) {
    this._store = new Map();
    this._defaultTtl = defaultTtlMs;
  }

  /** Retrieve a cached value. Returns `undefined` if missing or expired. */
  get(key) {
    const entry = this._store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this._store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  /** Store a value with an optional TTL (falls back to default). */
  set(key, value, ttlMs) {
    this._store.set(key, {
      value,
      expiresAt: Date.now() + (ttlMs ?? this._defaultTtl),
    });
  }

  /** Check if a key exists and is still fresh. */
  has(key) {
    const entry = this._store.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this._store.delete(key);
      return false;
    }
    return true;
  }

  /** Manually invalidate a single key. */
  delete(key) {
    this._store.delete(key);
  }

  /** Clear the entire cache. */
  clear() {
    this._store.clear();
  }

  /** Number of entries currently cached. */
  get size() {
    return this._store.size;
  }
}

// ── Pre-configured shared instances ──

/** Short-lived cache for product lists and search results (30 s). */
export const productCache = new MemoryCache(30_000);

/** Medium-lived cache for individual product details (2 min). */
export const detailCache = new MemoryCache(120_000);

/** Long-lived cache for categories (5 min). */
export const categoryCache = new MemoryCache(300_000);
