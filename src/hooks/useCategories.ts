import { useState, useEffect } from 'react';
import { fetchCategories } from '../services/api';
import type { Category } from '../types/product';

interface UseCategoriesResult {
  categories: Category[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchCategories(controller.signal)
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          setError('Failed to load categories.');
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [attempt]);

  return {
    categories,
    loading,
    error,
    retry: () => setAttempt((a) => a + 1),
  };
}
