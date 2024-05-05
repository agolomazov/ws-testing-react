import { User } from '../entities';

const UserTable = ({ users }: { users: User[] }) => {
  if (users.length === 0)
    return <p data-testid='userTableEmpty'>No users available.</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} data-testid='userTableRow'>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>
              <a href={`/users/${user.id}`}>Edit</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
