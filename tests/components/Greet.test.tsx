import { render, screen } from '@testing-library/react';
import Greet from '../../src/components/Greet';

describe('<Greet />', () => {
  it('Будет выведено приветствие, если был передан параметр name', () => {
    render(<Greet name='Anton' />);

    const heading = screen.getByRole('heading');

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/hello anton/i);
  });

  it('Будет показана кнопка Login, если не был передан параметр name', () => {
    render(<Greet />);

    const greeting = screen.getByRole('button');

    expect(greeting).toBeInTheDocument();
    expect(greeting).toHaveTextContent(/login/i);
  });
});
