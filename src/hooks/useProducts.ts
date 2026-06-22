import { useState, useEffect, useCallback } from 'react';
import {
  fetchProducts,
  fetchProductsByCategory,
} from '../services/api';
import type { Product } from '../types/product';

const PAGE_SIZE = 12;

interface UseProductsResult {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  setPage: (p: number) => void;
  retry: () => void;
}

export function useProducts(category: string | null): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Reset to page 1 when category changes
  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const skip = (page - 1) * PAGE_SIZE;
    const req = category
      ? fetchProductsByCategory(category, controller.signal)
      : fetchProducts(PAGE_SIZE, skip, controller.signal);

    req
      .then((data) => {
        setProducts(data.products);
        setTotal(data.total);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          setError('Failed to load products. Check your connection and try again.');
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [category, page, attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return { products, total, page, totalPages, loading, error, setPage, retry };
}
