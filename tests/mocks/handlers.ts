import { http, HttpResponse } from 'msw';
import { Product } from '../../src/entities';

export const handlers = [
  http.get('/categories', () => {
    return HttpResponse.json([
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Beauty' },
      { id: 3, name: 'Gardening' },
    ]);
  }),
  http.get('/products', () => {
    return HttpResponse.json<Product[]>([
      { id: 1, name: 'Product #1', price: 1800, categoryId: 1 },
      { id: 2, name: 'Product #2', price: 3600, categoryId: 2 },
      { id: 3, name: 'Product #3', price: 7200, categoryId: 1 },
    ]);
  }),
];
