import ProductForm from '../components/ProductForm';
import { ProductFormData } from '../validationSchemas/productSchema';

const PlaygroundPage = () => {
  return (
    <ProductForm
      onSubmit={(product: ProductFormData) => {
        console.log(product);
        return Promise.resolve();
      }}
    />
  );
};

export default PlaygroundPage;
