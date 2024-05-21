import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { Category, Product } from '../src/entities';
import { db } from './mocks/db';
import { navigateTo } from './mocks/utils';

describe('<Router />', () => {
  let category: Category;
  let product: Product;

  beforeAll(() => {
    category = db.category.create();
    product = db.product.create({
      categoryId: category.id,
    }) as unknown as Product;
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: product.id } } });
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  it('Будет отрисована Главная страница для маршрута /', () => {
    navigateTo('/');

    expect(screen.getByRole('heading', { name: /home/i })).toBeInTheDocument();
  });

  it('Будет отрисована страница Товары для маршрута /products', () => {
    navigateTo('/products');

    expect(
      screen.getByRole('heading', { name: /products/i })
    ).toBeInTheDocument();
  });

  it('Будет отрисована страница Детальной карточки товара по пути /products/:id', async () => {
    const product = db.product.create();

    navigateTo(`/products/${product.id}`);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    expect(
      screen.getByRole('heading', { name: product.name })
    ).toBeInTheDocument();

    expect(screen.getByRole('price')).toBeInTheDocument();

    db.product.delete({ where: { id: { equals: product.id } } });
  });

  it('Отрисовка ошибки при ошибки пути', () => {
    navigateTo(`/xxx`);

    expect(screen.getByRole('heading', { name: /oops/i })).toBeInTheDocument();
  });

  it('Будет отрисована страница Админ. панели по маршруту /admin', () => {
    navigateTo('/admin');

    expect(
      screen.queryByRole('heading', { name: /admin/i })
    ).toBeInTheDocument();
  });

  it('Будет отрисован индикатор загрузки для страницы /products/:id', () => {
    navigateTo(`/products/${product.id}`);

    expect(screen.queryByText(/loading/i)).toBeInTheDocument();
  });

  it('Будет отрисована карточка товара для страницы /products/:id', async () => {
    navigateTo(`/products/${product.id}`);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    expect(
      screen.queryByRole('heading', { name: product.name })
    ).toBeInTheDocument();

    expect(
      screen.queryByText(new RegExp(product.price.toString(), 'i'))
    ).toBeInTheDocument();
  });

  it('Будет отрисована ошибка для страницы /products/:id если товара нет', async () => {
    navigateTo(`/products/31222`);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    expect(screen.queryByText(/not found/i)).toBeInTheDocument();
  });
});
