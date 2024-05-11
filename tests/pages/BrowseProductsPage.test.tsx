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

  it('Будет скрыт индикатор загрузки и показан текст ошибки в случае, если возникнет ошибка', async () => {
    server.use(http.get('/categories', () => HttpResponse.error()));

    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole('progressbar', { name: /categories/i })
    );

    const errorText = screen.getByText(/network error/i);

    expect(errorText).toBeInTheDocument();
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
});
