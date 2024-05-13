import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import ProductList from '../../src/components/ProductList';
import { AllProviders } from '../AllProviders';
import { db } from '../mocks/db';
import { simulateDelay, simulateError, simulateSuccess } from '../mocks/utils';

describe('<ProductList>', () => {
  const productIds: number[] = [];

  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      productIds.push(product.id);
    });
  });

  const renderComponent = () => {
    render(
      <AllProviders>
        <ProductList />
      </AllProviders>
    );
  };

  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  it('Отрисует список товаров', async () => {
    renderComponent();

    const listItems = await screen.findAllByRole('listitem');

    expect(listItems.length).toBeGreaterThan(0);
  });

  it('Отрисует сообщение о том, что товаров нет, если придет пустой список', async () => {
    simulateSuccess('/products');

    renderComponent();

    const messageText = await screen.findByText(/no products available/i);

    expect(messageText).toBeInTheDocument();
  });

  it('Отрисует загрузчик в случае, если данные ещё не загрузились', () => {
    renderComponent();

    const loader = screen.getByText(/loading/i);

    expect(loader).toBeInTheDocument();
  });

  it('Будет показана ошибка, если возникнет ошибка сети', async () => {
    simulateError('/products');

    renderComponent();

    const errorText = await screen.findByText(/error:/i);

    expect(errorText).toBeInTheDocument();
  });

  it('Будет показан индикатор загрузки в момент получения данных', async () => {
    simulateDelay('/products');

    renderComponent();

    const loader = await screen.findByText(/loading/i);

    expect(loader).toBeInTheDocument();
  });

  it('Будет удален индикатор загрузки после получения данных', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    const loader = screen.queryByText(/loading/i);

    expect(loader).not.toBeInTheDocument();
  });

  it('Будет скрыт индикатор загрузки если будет получена ошибка сети', async () => {
    simulateError('/products');

    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    const loader = screen.queryByText(/loading/i);

    expect(loader).not.toBeInTheDocument();
  });
});
