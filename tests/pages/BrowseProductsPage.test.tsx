import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { server } from '../mocks/server';
import { delay, http, HttpResponse } from 'msw';
import BrowseProducts from '../../src/pages/BrowseProductsPage';
import { AllProviders } from '../AllProviders';

describe('<BrowseProductsPage />', () => {
  const renderComponent = () => {
    render(
      <AllProviders>
        <BrowseProducts />
      </AllProviders>
    );

    const skeleton = screen.queryByRole('progressbar', { name: /categories/i });
    const productSkeleton = screen.queryByRole('progressbar', {
      name: /products/i,
    });

    return { skeleton, productSkeleton };
  };

  it('Будет показан индикатор загрузки когда будут данные запрошены', () => {
    server.use(
      http.get('/categories', async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    const { skeleton } = renderComponent();

    expect(skeleton).toBeInTheDocument();
  });

  it('Будет скрыт индикатор загрузки когда данные будут получены', async () => {
    server.use(
      http.get('/categories', () => {
        return HttpResponse.json([]);
      })
    );

    const { skeleton } = renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole('progressbar', { name: /categories/i })
    );

    expect(skeleton).not.toBeInTheDocument();
  });

  it('Будет показан индикатор загрузки когда запрашиваются данные', () => {
    server.use(
      http.get('/products', async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    const { productSkeleton } = renderComponent();

    expect(productSkeleton).toBeInTheDocument();
  });

  it('Будет скрыт индикатор загрузки когда данные получены', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole('progressbar', { name: /products/i })
    );
  });

  it('Не будет показано сообщение об ошибке если список категорий не будет загружен', async () => {
    server.use(http.get('/categories', () => HttpResponse.error()));

    renderComponent();

    await waitForElementToBeRemoved(() => {
      return screen.getByRole('progressbar', { name: /categories/i });
    });

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('combobox', { name: /filter by category/i })
    ).not.toBeInTheDocument();
  });

  it('Будет выведена ошибка, если продукты не были загружены', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));

    renderComponent();

    await waitForElementToBeRemoved(() => {
      return screen.getByRole('progressbar', { name: /products/i });
    });

    expect(screen.queryByText(/error/i)).toBeInTheDocument();
  });
});
