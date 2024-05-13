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
      const category = db.category.create();
      categories.push(category);

      [1, 2].forEach(() => {
        products.push(
          db.product.create({ categoryId: category.id }) as unknown as Product
        );
      });
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

  it('Будет отображен список отфильтрованных товаров', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryAllByRole('progressbar'));

    const combobox = screen.queryByRole('combobox');
    const user = userEvent.setup();

    const selectedCategory = categories[0];
    await user.click(combobox!);
    const option = screen.getByRole('option', { name: selectedCategory.name });

    await user.click(option);

    const selectedProducts = db.product.findMany({
      where: {
        categoryId: { equals: selectedCategory.id },
      },
    });

    const rows = screen.getAllByRole('row');
    const dataRows = rows.slice(1);
    expect(dataRows).toHaveLength(selectedProducts.length);

    selectedProducts.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it('Будет отображены все товары если выбран фильтр All', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryAllByRole('progressbar'));

    const combobox = screen.queryByRole('combobox');
    const user = userEvent.setup();

    const selectedCategory = categories[0];
    await user.click(combobox!);
    const option = screen.getByRole('option', { name: selectedCategory.name });

    await user.click(option);

    await user.click(combobox!);

    const allOption = screen.getByRole('option', {
      name: /all/i,
    });
    await user.click(allOption);

    const products = db.product.getAll();

    const rows = screen.getAllByRole('row');
    const dataRows = rows.slice(1);
    expect(dataRows).toHaveLength(products.length);
  });
});
