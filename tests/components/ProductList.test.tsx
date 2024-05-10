import { render, screen } from '@testing-library/react';
import ProductList from '../../src/components/ProductList';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
import { Product } from '../../src/entities';

describe('<ProductList>', () => {
  it('Отрисует список товаров', async () => {
    render(<ProductList />);

    const listItems = await screen.findAllByRole('listitem');

    expect(listItems.length).toBeGreaterThan(0);
  });

  it('Отрисует сообщение о том, что товаров нет, если придет пустой список', async () => {
    server.use(
      http.get('/products', () => {
        return HttpResponse.json<Product[]>([]);
      })
    );

    render(<ProductList />);

    const messageText = await screen.findByText(/no products available/i);

    expect(messageText).toBeInTheDocument();
  });

  it.only('Отрисует загрузчик в случае, если данные ещё не загрузились', () => {
    render(<ProductList />);

    const loader = screen.getByText(/loading/i);

    expect(loader).toBeInTheDocument();
  });
});
