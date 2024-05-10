import { useEffect, useState } from 'react';
import { Product } from '../entities';
import axios, { AxiosError } from 'axios';

const ProductDetail = ({ productId }: { productId: number }) => {
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!productId) {
      setError('Invalid ProductId');
      return;
    }

    async function fetchProductData(id: number) {
      try {
        setLoading(true);
        const { data: productData } = await axios.get<Product>(
          `/products/${id}`
        );
        setProduct(productData);
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProductData(productId).catch(() => {});
  }, []);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

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
