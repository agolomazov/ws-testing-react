import { describe, it } from 'vitest';
import { db } from './mocks/db';

describe('Test group', () => {
  it.only('Test async fetching', () => {
    const product = db.product.create({ name: 'MKB' });
    console.log(db.product.delete({ where: { id: { equals: product.id } } }));
  });
});
