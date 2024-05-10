import { it, expect, describe } from 'vitest';

describe('Test group', () => {
  it('Test async fetching', async () => {
    const response = await fetch('/categories');
    const data = (await response.json()) as { id: number; name: string }[];

    expect(data).toHaveLength(3);
  });
});
