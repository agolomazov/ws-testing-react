import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Category, Product } from '../../src/entities';
import BrowseProducts from '../../src/pages/BrowseProductsPage';
import { AllProviders } from '../AllProviders';
import { db } from '../mocks/db';
import { simulateDelay, simulateError, simulateSuccess } from '../mocks/utils';

describe('<BrowseProductsPage />', () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach(() => {
      categories.push(db.category.create());
      products.push(db.product.create() as unknown as Product);
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((category) => category.id);
    const productIds = products.map((product) => product.id);

    db.category.deleteMany({ where: { id: { in: categoryIds } } });
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

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
    simulateDelay('/categories');

    const { skeleton } = renderComponent();

    expect(skeleton).toBeInTheDocument();
  });

  it('Будет скрыт индикатор загрузки когда данные будут получены', async () => {
    simulateSuccess('/categories');

    const { skeleton } = renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole('progressbar', { name: /categories/i })
    );

    expect(skeleton).not.toBeInTheDocument();
  });

  it('Будет показан индикатор загрузки когда запрашиваются данные', () => {
    simulateDelay('/products');

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
    simulateError('/categories');

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
    simulateError('/products');

    renderComponent();

    await waitForElementToBeRemoved(() => {
      return screen.getByRole('progressbar', { name: /products/i });
    });

    expect(screen.queryByText(/error/i)).toBeInTheDocument();
  });

  it('Будет выведен фильтр со списком категорий', async () => {
    renderComponent();

    const combobox = await screen.findByRole('combobox', {
      name: /categories/,
    });

    expect(combobox).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(combobox);

    const options = await screen.findAllByRole('option');
    expect(options.length).toBeGreaterThan(0);

    expect(screen.getByRole('option', { name: /all/i })).toBeInTheDocument();

    categories.forEach((category) => {
      expect(
        screen.getByRole('option', { name: new RegExp(category.name) })
      ).toBeInTheDocument();
    });
  });

  it('Будет выведен список товаров', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryAllByRole('progressbar'));

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });
});
