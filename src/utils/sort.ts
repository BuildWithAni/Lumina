import type { Product, SortOption } from '../types/product';

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const arr = [...products];
  switch (sort) {
    case 'price-asc':
      return arr.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return arr.sort((a, b) => b.price - a.price);
    case 'title-asc':
      return arr.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return arr.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return arr;
  }
}
