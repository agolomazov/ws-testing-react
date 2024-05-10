import { render, screen } from '@testing-library/react';
import ProductDetail from '../../src/components/ProductDetail';
import { productsMockData } from '../mocks/data';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

describe('<ProductDetail>', () => {
  it('Будет выведена карточка товара', async () => {
    render(<ProductDetail productId={1} />);

    const heading = await screen.findByRole('heading');
    const price = await screen.findByText(
      new RegExp(`${productsMockData[0].price}`)
    );
    const productName = await screen.findByText(
      new RegExp(productsMockData[0].name)
    );

    expect(heading).toBeInTheDocument();
    expect(price).toBeInTheDocument();
    expect(productName).toBeInTheDocument();
  });

  it('Выведется сообщение об ошибке при не валидном id товара', async () => {
    render(<ProductDetail productId={0} />);

    const errorText = await screen.findByText(/error:/i);

    expect(errorText).toBeInTheDocument();
    expect(errorText.textContent).toBe('Error: Invalid ProductId');
  });

  it('Выведет сообщение об ошибке если товар не найден', async () => {
    render(<ProductDetail productId={110} />);

    const errorText = await screen.findByText(/error:/i);

    expect(errorText).toBeInTheDocument();
    expect(errorText).toHaveTextContent(/request failed with status code 404/i);
  });

  it('Если товар не корректный', async () => {
    server.use(
      http.get('/products/1', () => {
        return HttpResponse.json(null);
      })
    );

    render(<ProductDetail productId={1} />);

    const errorText = await screen.findByText(/not found/i);

    expect(errorText).toBeInTheDocument();
  });
});
