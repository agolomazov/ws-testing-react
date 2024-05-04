import { render, screen } from '@testing-library/react';
import UserList from '../../src/components/UserList';
import { type User } from '../../src/entities';

describe('<UserList>', () => {
  let users: User[] = [];

  beforeEach(() => {
    users = [
      {
        id: 1,
        name: 'Anton',
        isAdmin: false,
      },
      {
        id: 2,
        name: 'Dima',
        isAdmin: true,
      },
      {
        id: 3,
        name: 'Nelya',
        isAdmin: false,
      },
    ];
  });

  it('Если массив пользователей пуст, выводиться сообщение', () => {
    users = [];

    render(<UserList users={users} />);

    const messageParagraph = screen.getByText(/no users/i);

    expect(messageParagraph).toBeInTheDocument();
    expect(messageParagraph).toHaveTextContent(/available/i);
  });

  it('Если в массиве пользователей есть хотя бы 1 элемент, то выводиться список', () => {
    render(<UserList users={users} />);

    const usersList = screen.getByRole('list');
    const userItems = screen.getAllByRole('listitem');

    expect(usersList).toBeInTheDocument();
    expect(userItems.length).toBe(users.length);
  });

  it('Проверка вывода каждой ссылки', () => {
    render(<UserList users={users} />);

    users.forEach((user) => {
      const link = screen.getByRole('link', { name: user.name });

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', `/users/${user.id}`);
    });
  });
});
