import { render, screen } from '@testing-library/react';
import QuantitySelector from '../../src/components/QuantitySelector';
import { Category, Product } from '../../src/entities';
import { db } from '../mocks/db';
import { CartProvider } from '../../src/providers/CartProvider';
import userEvent from '@testing-library/user-event';

describe('<QuantitySelector />', () => {
  let category: Category;
  let product: Product;

  beforeAll(() => {
    category = db.category.create();
    product = db.product.create({
      categoryId: category.id,
    }) as unknown as Product;
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: product.id } } });
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  const renderComponent = (product: Product) => {
    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    );

    const addToButton = screen.getByRole('button', { name: /add to cart/i });

    return {
      addToButton,
      user: userEvent.setup(),
    };
  };

  it('Будет показана кнопка В Корзину', () => {
    const { addToButton } = renderComponent(product);

    expect(addToButton).toBeInTheDocument();
  });

  it('Товар будет добавлен в корзину', async () => {
    const { addToButton, user } = renderComponent(product);

    await user.click(addToButton);

    const quantity = screen.getByRole('status');

    expect(quantity).toBeInTheDocument();
    expect(quantity).toHaveTextContent('1');

    const incrementButton = screen.getByRole('button', { name: '+' });
    expect(incrementButton).toBeInTheDocument();

    const decrementButton = screen.getByRole('button', { name: '-' });
    expect(decrementButton).toBeInTheDocument();
    expect(addToButton).not.toBeInTheDocument();

    await user.click(incrementButton);
    await user.click(incrementButton);

    expect(quantity).toHaveTextContent('3');

    await user.click(decrementButton);
    await user.click(decrementButton);
    await user.click(decrementButton);

    expect(incrementButton).not.toBeInTheDocument();
    expect(decrementButton).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add to cart/i })
    ).toBeInTheDocument();
  });
});
