import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import SearchBox from '../../src/components/SearchBox';

describe('<SearchBox>', () => {
  const renderSearchBox = () => {
    const onChangeFn = vi.fn();
    render(<SearchBox onChange={onChangeFn} />);

    const input = screen.getByPlaceholderText(/search/i);

    return {
      input,
      onChangeFn,
      user: userEvent.setup(),
    };
  };

  it('Будет отображено поле ввода поисковой строки', () => {
    const { input } = renderSearchBox();

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('class', 'input');
  });

  it('Будет вызван onChange когда будет нажата клавиша Enter', async () => {
    const { input, onChangeFn, user } = renderSearchBox();

    await user.type(input, 'king lion{enter}');

    expect(onChangeFn).toHaveBeenCalledWith('king lion');
  });

  it('Callback не будет вызываться если поле ввода пустое', async () => {
    const { input, onChangeFn, user } = renderSearchBox();

    await user.type(input, '{enter}');

    expect(onChangeFn).toHaveBeenCalledTimes(0);
  });
});
