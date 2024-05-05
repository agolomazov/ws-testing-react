import { render, screen } from '@testing-library/react';

import UserTable from '../../src/components/UserTable';
import { type User } from '../../src/entities';

describe('<UserTable>', () => {
  it('Отобразить сообщение о том что список пользователей пуст, если передан пустой массив', () => {
    render(<UserTable users={[]} />);

    const messageParagraph = screen.getByTestId('userTableEmpty');

    expect(messageParagraph).toBeInTheDocument();
    expect(messageParagraph).toHaveTextContent(/no users available/i);
  });

  it('Отобразиться таблица пользователей, если список пользователей не пуст', () => {
    const users: User[] = [
      {
        id: 1,
        name: 'Anton',
        isAdmin: false,
      },
    ];

    render(<UserTable users={users} />);

    const table = screen.getByRole('table');
    const tableRow = screen.getAllByTestId('userTableRow');

    expect(table).toBeInTheDocument();
    expect(tableRow).toHaveLength(users.length);
  });

  it('Проверка ссылок на страницу редактирования пользователей', () => {
    const users: User[] = [
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
        name: 'Nelia',
        isAdmin: true,
      },
    ];

    render(<UserTable users={users} />);

    const usersRowItem = screen.getAllByTestId('userTableRow');
    const usersEditLinks = screen.getAllByRole('link');

    users.forEach((user, idx) => {
      expect(usersRowItem[idx]).toHaveTextContent(user.name);

      expect(usersEditLinks[idx]).toHaveTextContent(/edit/i);
      expect(usersEditLinks[idx]).toHaveAttribute('href', `/users/${user.id}`);
    });
  });
});
