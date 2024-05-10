import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import OrderStatusSelector from '../../src/components/OrderStatusSelector';
import { Theme } from '@radix-ui/themes';

describe('<OrderStatusSelector />', () => {
  const renderComponent = () => {
    const onChange = vi.fn();

    render(
      <Theme>
        <OrderStatusSelector onChange={onChange} />
      </Theme>
    );

    return {
      button: screen.getByRole('combobox'),
      user: userEvent.setup(),
      getOptions: async () => await screen.findAllByRole('option'),
      onChange,
    };
  };

  it('Отображается селектор со значением New по умолчанию', () => {
    const { button } = renderComponent();

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/new/i);
  });

  it('Будет отображен корректный список статусов', async () => {
    const { user, button, getOptions } = renderComponent();
    await user.click(button);

    const options = await getOptions();
    expect(options.length).toBeGreaterThan(0);

    const labels = options.map((opt) => opt.textContent);
    expect(labels).toEqual(['New', 'Processed', 'Fulfilled']);
  });

  it.each([
    { label: /processed/i, value: 'processed' },
    { label: /fulfilled/i, value: 'fulfilled' },
  ])(
    'Будет вызван метод onChange с параметром $label если была выбрана опция $value',
    async ({ label, value }) => {
      const { button, user, onChange } = renderComponent();

      await user.click(button);

      const option = await screen.findByRole('option', { name: label });
      await user.click(option);

      expect(onChange).toBeCalledTimes(1);
      expect(onChange).toBeCalledWith(value);
    }
  );

  it('Будет вызван метод onChange с параметром "new" если в селекте выбрано другое значение', async () => {
    const { button, user, onChange } = renderComponent();

    await user.click(button);

    const processedOption = await screen.findByRole('option', {
      name: /processed/i,
    });
    await user.click(processedOption);

    await user.click(button);
    const newOption = await screen.findByRole('option', { name: /new/i });
    await user.click(newOption);

    expect(onChange).toHaveBeenLastCalledWith('new');
  });
});
