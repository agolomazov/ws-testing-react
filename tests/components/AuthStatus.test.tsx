import { render, screen } from '@testing-library/react';
import { mockAuthState } from '../mocks/utils';
import AuthStatus from '../../src/components/AuthStatus';
import { User } from '@auth0/auth0-react';

describe('<AuthStatus />', () => {
  it('Будет отображен индикатор загрузки в момент получения данных о пользователе', () => {
    mockAuthState({
      isLoading: true,
      isAuthenticated: false,
      user: undefined,
    });

    render(<AuthStatus />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('Будет показана кнопка авторизации если пользователь не авторизован', () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: false,
      user: undefined,
    });

    render(<AuthStatus />);

    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /log out/i })
    ).not.toBeInTheDocument();
  });

  it('Будет показана информация о пользователе если он авторизован', () => {
    const mockedUser: User = {
      name: 'Anton',
    };

    mockAuthState({
      isLoading: false,
      isAuthenticated: true,
      user: mockedUser,
    });

    render(<AuthStatus />);

    const user = screen.getByText(/anton/i);
    const logoutButton = screen.getByRole('button', { name: /log out/i });

    expect(user).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /log in/i })
    ).not.toBeInTheDocument();
  });
});
