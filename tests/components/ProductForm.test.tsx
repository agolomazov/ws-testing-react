import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ProductForm from '../../src/components/ProductForm';
import { Category, Product } from '../../src/entities';
import { AllProviders } from '../AllProviders';
import { db } from '../mocks/db';
import userEvent from '@testing-library/user-event';

describe('<ProductForm />', () => {
  let category: Category;

  beforeAll(() => {
    category = db.category.create();
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  const renderComponent = async (product?: Product) => {
    const onSubmit = vi.fn();

    render(
      <AllProviders>
        <ProductForm product={product} onSubmit={vi.fn()} />
      </AllProviders>
    );

    const productForm = await screen.findByRole('form');
    const textboxName = await screen.findByPlaceholderText(/name/i);
    const textboxPrice = await screen.findByPlaceholderText(/price/i);
    const comboboxCategory = await screen.findByRole('combobox', {
      name: /category/i,
    });
    const submitButton = await screen.findByRole('button', { name: /submit/i });

    return {
      onSubmit,
      textboxName,
      textboxPrice,
      comboboxCategory,
      productForm,
      submitButton,
    };
  };

  it('Отображение формы создания товара', async () => {
    const { textboxName, textboxPrice, comboboxCategory } =
      await renderComponent();

    expect(textboxName).toBeInTheDocument();
    expect(textboxPrice).toBeInTheDocument();
    expect(comboboxCategory).toBeInTheDocument();
  });

  it('Будут заполнены все поля формы при редактировании товара', async () => {
    const product: Product = {
      id: 1,
      categoryId: category.id,
      name: 'Bread',
      price: 100,
    };

    const { textboxName, textboxPrice, comboboxCategory } =
      await renderComponent(product);

    expect(textboxName).toBeInTheDocument();
    expect(textboxPrice).toBeInTheDocument();
    expect(comboboxCategory).toBeInTheDocument();

    expect(textboxName).toHaveValue(product.name);
    expect(textboxPrice).toHaveValue(String(product.price));
    expect(comboboxCategory).toHaveTextContent(category.name);
  });

  it('Проверка установки фокуса на поле Name', async () => {
    const { textboxName } = await renderComponent();

    expect(textboxName).toHaveFocus();
  });

  it.each([
    {
      scenario: 'missing',
      errorMessage: /required/i,
    },
    {
      scenario: 'longer than 255 characters',
      name: 'a'.repeat(256),
      errorMessage: /255/i,
    },
  ])(
    'Показана ошибка если не было введено имя $scenario',
    async ({ errorMessage, name }) => {
      const { textboxPrice, comboboxCategory, submitButton, textboxName } =
        await renderComponent();

      const user = userEvent.setup();

      if (name) {
        await user.type(textboxName, name);
      }

      await user.type(textboxPrice, '10');
      await user.click(comboboxCategory);

      const options = screen.getAllByRole('option');

      await user.click(options[0]);
      await user.click(submitButton);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
      expect(textboxName).toHaveFocus();
    }
  );

  it.each([
    {
      scenario: 'missing',
      errorMessage: /required/i,
    },
    {
      scenario: '0',
      price: 0,
      errorMessage: /1/i,
    },
    {
      scenario: 'negative',
      price: -1,
      errorMessage: /1/i,
    },
    {
      scenario: 'greater than 1000',
      price: 1001,
      errorMessage: /1000/i,
    },
  ])(
    'Показана ошибка если не было введено $scenario',
    async ({ errorMessage, price }) => {
      const { textboxPrice, comboboxCategory, submitButton, textboxName } =
        await renderComponent();

      const user = userEvent.setup();

      await user.type(textboxName, 'Anton');

      if (typeof price !== 'undefined') {
        await user.type(textboxPrice, String(price));
      }

      await user.click(comboboxCategory);

      const options = screen.getAllByRole('option');

      await user.click(options[0]);
      await user.click(submitButton);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
    }
  );
});
