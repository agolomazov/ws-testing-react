import { render, screen } from '@testing-library/react';
import UserAccount from '../../src/components/UserAccount';
import { type User } from '../../src/entities';

describe('<UserAccount />', () => {
  let user: User;

  beforeEach(() => {
    user = {
      id: 1,
      name: 'Anton',
      isAdmin: false,
    };
  });

  it('Увидим имя пользователя при передаче параметра name', async () => {
    render(<UserAccount user={user} />);

    expect(screen.getByText(user.name)).toBeInTheDocument();
  });

  it('Увидим кнопку редактирования, если пользователь является администратором', () => {
    user.isAdmin = true;

    render(<UserAccount user={user} />);

    const editButton = screen.getByRole('button');

    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveTextContent(/edit/i);
  });

  it('Скрываем кнопку редактирования, если пользователь не является администратором', () => {
    render(<UserAccount user={user} />);

    const editButton = screen.queryByRole('button');

    expect(editButton).not.toBeInTheDocument();
  });
});
