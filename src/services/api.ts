import axios from 'axios';
import type { Product, ProductsResponse, Category } from '../types/product';

/**
 * Axios client – during development, requests to /api are proxied by Vite
 * to the Express proxy server running on localhost:3001.
 *
 * In production, the Express server would serve the built frontend
 * and handle /api routes directly.
 */
const client = axios.create({ baseURL: '' });

export async function fetchProducts(
  limit: number,
  skip: number,
  signal?: AbortSignal
): Promise<ProductsResponse> {
  const { data } = await client.get<ProductsResponse>('/api/products', {
    params: { limit, skip },
    signal,
  });
  return data;
}

export async function fetchProductById(
  id: number,
  signal?: AbortSignal
): Promise<Product> {
  const { data } = await client.get<Product>(`/api/products/${id}`, { signal });
  return data;
}

export async function fetchCategories(
  signal?: AbortSignal
): Promise<Category[]> {
  const { data } = await client.get<Category[]>('/api/categories', {
    signal,
  });
  return data;
}

export async function fetchProductsByCategory(
  category: string,
  signal?: AbortSignal
): Promise<ProductsResponse> {
  const { data } = await client.get<ProductsResponse>(
    `/api/products/category/${category}`,
    { signal }
  );
  return data;
}
