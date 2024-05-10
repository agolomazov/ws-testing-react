import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import ProductList from '../../src/components/ProductList';
import { server } from '../mocks/server';
import { http, HttpResponse, delay } from 'msw';
import { Product } from '../../src/entities';
import { db } from '../mocks/db';

describe('<ProductList>', () => {
  const productIds: number[] = [];

  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      productIds.push(product.id);
    });
  });

  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

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

  it('Отрисует загрузчик в случае, если данные ещё не загрузились', () => {
    render(<ProductList />);

    const loader = screen.getByText(/loading/i);

    expect(loader).toBeInTheDocument();
  });

  it('Будет показана ошибка, если возникнет ошибка сети', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));

    render(<ProductList />);

    const errorText = await screen.findByText(/error:/i);

    expect(errorText).toBeInTheDocument();
  });

  it('Будет показан индикатор загрузки в момент получения данных', async () => {
    server.use(
      http.get('/products', async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    render(<ProductList />);

    const loader = await screen.findByText(/loading/i);

    expect(loader).toBeInTheDocument();
  });

  it('Будет удален индикатор загрузки после получения данных', async () => {
    render(<ProductList />);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    const loader = screen.queryByText(/loading/i);

    expect(loader).not.toBeInTheDocument();
  });

  it('Будет скрыт индикатор загрузки если будет получена ошибка сети', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));

    render(<ProductList />);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    const loader = screen.queryByText(/loading/i);

    expect(loader).not.toBeInTheDocument();
  });
});
