import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { navigateTo } from './mocks/utils';
import { db } from './mocks/db';

describe('<Router />', () => {
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
});
