import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import CategoryList from '../../src/components/CategoryList';
import { Category } from '../../src/entities';
import { AllProviders } from '../AllProviders';
import { db } from '../mocks/db';
import { simulateDelay, simulateError } from '../mocks/utils';

describe('<CategoryList />', () => {
  const categories: Category[] = [];

  beforeAll(() => {
    [1, 2].forEach(() => {
      const category = db.category.create();
      categories.push(category);
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });
  });

  const renderComponent = () => {
    render(
      <AllProviders>
        <CategoryList />
      </AllProviders>
    );
  };

  it('Будет выведен список категорий', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    categories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });

  it('Будет выведен индикатор загрузки', () => {
    simulateDelay('/categories');

    renderComponent();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('Будет выведен текст ошибки, в случае неудачного запроса', async () => {
    simulateError('/categories');

    renderComponent();
    const errorMessage = await screen.findByText(/error/i);

    expect(errorMessage).toBeInTheDocument();
  });
});
