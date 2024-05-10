import { http, HttpResponse } from 'msw';
import { Product } from '../../src/entities';
import { productsMockData } from './data';

export const handlers = [
  http.get('/categories', () => {
    return HttpResponse.json([
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Beauty' },
      { id: 3, name: 'Gardening' },
    ]);
  }),
  http.get('/products', () => {
    return HttpResponse.json<Product[]>(productsMockData);
  }),
  http.get('/products/:id', ({ params }) => {
    const { id } = params;

    const product = productsMockData.find((prod) => prod.id === Number(id));

    if (!product) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(product);
  }),
];
