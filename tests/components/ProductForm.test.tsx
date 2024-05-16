import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ProductForm from '../../src/components/ProductForm';
import { Category, Product } from '../../src/entities';
import { AllProviders } from '../AllProviders';
import { db } from '../mocks/db';

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

    const textboxName = await screen.findByPlaceholderText(/name/i);
    const textboxPrice = await screen.findByPlaceholderText(/price/i);
    const comboboxCategory = await screen.findByRole('combobox', {
      name: /category/i,
    });

    return {
      onSubmit,
      textboxName,
      textboxPrice,
      comboboxCategory,
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
});
