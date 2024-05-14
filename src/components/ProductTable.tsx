import axios, { AxiosError } from 'axios';
import { Product } from '../entities';
import { useQuery } from 'react-query';
import { Table } from '@radix-ui/themes';
import Skeleton from 'react-loading-skeleton';
import QuantitySelector from './QuantitySelector';

interface Props {
  categoryId: number | undefined;
}

export const ProductTable = ({ categoryId }: Props) => {
  const {
    data: products,
    error,
    isLoading,
  } = useQuery<Product[], AxiosError>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await axios.get<Product[]>('/products');
      return response.data;
    },
  });

  const skeletons = [1, 2, 3, 4, 5];

  if (error) return <div>Error: {error.message}</div>;

  const productsByCategory =
    categoryId && products
      ? products.filter((p) => p.categoryId === categoryId)
      : products;

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body
        role={isLoading ? 'progressbar' : undefined}
        aria-label={isLoading ? 'Loading products' : undefined}
      >
        {isLoading &&
          skeletons.map((skeleton) => (
            <Table.Row key={skeleton}>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
            </Table.Row>
          ))}
        {!isLoading &&
          productsByCategory &&
          productsByCategory.map((product) => (
            <Table.Row key={product.id}>
              <Table.Cell>{product.name}</Table.Cell>
              <Table.Cell>${product.price}</Table.Cell>
              <Table.Cell>
                <QuantitySelector product={product} />
              </Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table.Root>
  );
};
