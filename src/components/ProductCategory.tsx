import axios, { AxiosError } from 'axios';
import { Category } from '../entities';
import { useQuery } from 'react-query';
import Skeleton from 'react-loading-skeleton';
import { Select } from '@radix-ui/themes';
interface Props {
  onChange: (id: number | undefined) => void;
}

export const ProductCategory = ({ onChange }: Props) => {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery<Category[], AxiosError>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get<Category[]>('/categories');
      return response.data;
    },
  });

  if (isLoading)
    return (
      <div role='progressbar' aria-label='Loading categories'>
        <Skeleton />
      </div>
    );

  if (error) return null;

  return (
    <Select.Root onValueChange={(categoryId) => onChange(parseInt(categoryId))}>
      <Select.Trigger
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        placeholder='Filter by Category'
        aria-label='categories'
      />
      <Select.Content>
        <Select.Group>
          <Select.Label>Category</Select.Label>
          <Select.Item value='all'>All</Select.Item>
          {categories?.map((category) => (
            <Select.Item key={category.id} value={category.id.toString()}>
              {category.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};
