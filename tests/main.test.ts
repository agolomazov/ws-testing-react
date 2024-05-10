import { it, expect, describe } from 'vitest';

describe('Test group', () => {
  it.only('Test async fetching', async () => {
    const response = await fetch('/categories');
    const data = (await response.json()) as { id: number; name: string }[];

    console.log(data);
    expect(data).toHaveLength(3);
  });
});
