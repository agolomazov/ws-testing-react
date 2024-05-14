import { useState } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import { ProductCategory } from '../components/ProductCategory';
import { ProductTable } from '../components/ProductTable';

function BrowseProducts() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >();

  return (
    <div>
      <h1>Products</h1>
      <div className='max-w-xs'>
        <ProductCategory onChange={setSelectedCategoryId} />
      </div>
      {/* {renderProducts()} */}
      <ProductTable categoryId={selectedCategoryId} />
    </div>
  );
}

export default BrowseProducts;
