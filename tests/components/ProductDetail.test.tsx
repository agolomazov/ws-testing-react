import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import ProductDetail from '../../src/components/ProductDetail';
import { db } from '../mocks/db';
import { server } from '../mocks/server';
import { AllProviders } from '../AllProviders';

describe('<ProductDetail>', () => {
  let productId: number;

  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId } } });
  });

  const renderComponent = (id: number) => {
    render(
      <AllProviders>
        <ProductDetail productId={id} />
      </AllProviders>
    );
  };

  it('Будет выведена карточка товара', async () => {
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });
    renderComponent(productId);

    const heading = await screen.findByRole('heading');
    const price = await screen.findByText(
      new RegExp(product!.price.toString())
    );
    const productName = await screen.findByText(new RegExp(product!.name));

    expect(heading).toBeInTheDocument();
    expect(price).toBeInTheDocument();
    expect(productName).toBeInTheDocument();
  });

  it('Выведется сообщение об ошибке при не валидном id товара', async () => {
    renderComponent(0);

    const errorText = await screen.findByText(/error:/i);

    expect(errorText).toBeInTheDocument();
    expect(errorText.textContent).toMatch(/invalid productId/i);
  });

  it('Выведет сообщение об ошибке если товар не найден', async () => {
    renderComponent(110);

    const errorText = await screen.findByText(/error:/i);

    expect(errorText).toBeInTheDocument();
    expect(errorText).toHaveTextContent(/request failed with status code 404/i);
  });

  it('Если товар не найден', async () => {
    server.use(
      http.get('/products/1', () => {
        return HttpResponse.json(null);
      })
    );

    renderComponent(1);

    const errorText = await screen.findByText(/not found/i);

    expect(errorText).toBeInTheDocument();
  });

  it('Будет показан индикатор загрузки в момент получения данных', async () => {
    server.use(
      http.get('/products/:id', async () => {
        await delay();
        return HttpResponse.json(null);
      })
    );

    renderComponent(productId);

    const loader = await screen.findByText(/loading/i);

    expect(loader).toBeInTheDocument();
  });

  it('Будет скрыт индикатор загрузки после получения данных', async () => {
    renderComponent(productId);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    const loader = screen.queryByText(/loading/i);

    expect(loader).not.toBeInTheDocument();
  });

  it('Будет скрыт индикатор загрузки после получения ошибки', async () => {
    server.use(
      http.get('/products/:id', () => {
        return new HttpResponse(null, { status: 404, statusText: 'Not found' });
      })
    );

    renderComponent(productId);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    const loader = screen.queryByText(/loading/i);

    expect(loader).not.toBeInTheDocument();
  });
});
