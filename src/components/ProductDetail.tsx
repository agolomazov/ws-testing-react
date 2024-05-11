import axios, { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { Product } from '../entities';

const ProductDetail = ({ productId }: { productId: number }) => {
  const {
    data: product,
    error,
    isLoading,
  } = useQuery<Product, AxiosError>({
    queryKey: ['productById', productId],
    queryFn: async () => {
      const response = await axios.get<Product>(`/products/${productId}`);
      return response.data;
    },
  });

  if (!productId) return <div>Error: invalid productId</div>;

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  if (!product) return <div>The given product was not found.</div>;

  return (
    <div>
      <h1>Product Detail</h1>
      <div>Name: {product.name}</div>
      <div>Price: ${product.price}</div>
    </div>
  );
};

export default ProductDetail;
