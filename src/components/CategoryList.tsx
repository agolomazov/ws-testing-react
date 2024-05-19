import axios, { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { Category } from '../entities';

function CategoryList() {
  const {
    error,
    isLoading,
    data: categories,
  } = useQuery<Category[], AxiosError>({
    queryKey: ['queries'],
    queryFn: async () => {
      const response = await axios.get<Category[]>('/categories');
      return response.data;
    },
  });

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Category List</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {categories!.map((category) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CategoryList;
