import { factory, primaryKey } from '@mswjs/data';
import { faker } from '@faker-js/faker';

export const db = factory({
  product: {
    id: primaryKey(faker.number.int),
    name: () => faker.commerce.productName(),
    price: () => faker.commerce.price({ min: 1, max: 100 }),
  },
});
