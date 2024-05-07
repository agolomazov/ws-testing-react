import { render, screen } from '@testing-library/react';
import ToastDemo from '../../src/components/ToastDemo';
import { Toaster } from 'react-hot-toast';
import userEvent from '@testing-library/user-event';

describe('<ToastDemo>', () => {
  it('Будет отрисовано сообщение Success', async () => {
    render(
      <>
        <ToastDemo />
        <Toaster />
      </>
    );

    const user = userEvent.setup();

    const button = screen.getByRole('button');
    await user.click(button);

    const toast = await screen.findByText(/success/i);

    expect(toast).toBeInTheDocument();
  });
});
