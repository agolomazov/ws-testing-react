import { render, screen } from '@testing-library/react';

import ProductImageGallery from '../../src/components/ProductImageGallery';

describe('<ProductImageGallery>', () => {
  it('Ничего не выведется если передан пустой список ссылок', () => {
    const { container } = render(<ProductImageGallery imageUrls={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('Будет выведен список изображений, если передан массив ссылок', () => {
    const imageUrls = ['url1', 'url2'];

    render(<ProductImageGallery imageUrls={imageUrls} />);

    const images = screen.getAllByRole('img');

    expect(images).toHaveLength(imageUrls.length);

    imageUrls.forEach((url, idx) => {
      expect(images[idx]).toHaveAttribute('src', url);
    });
  });
});
