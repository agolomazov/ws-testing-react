import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import routes from '../src/routes';

describe('<Router />', () => {
  const renderComponent = (route: string) => {
    const router = createMemoryRouter(routes, {
      initialEntries: [route],
    });

    render(<RouterProvider router={router} />);
  };

  it('Будет отрисована Главная страница для маршрута /', () => {
    renderComponent('/');

    expect(screen.getByRole('heading', { name: /home/i })).toBeInTheDocument();
  });

  it('Будет отрисована страница Товары для маршрута /products', () => {
    renderComponent('/products');

    expect(
      screen.getByRole('heading', { name: /products/i })
    ).toBeInTheDocument();
  });
});
