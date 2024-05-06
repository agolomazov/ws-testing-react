import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TermsAndConditions from '../../src/components/TermsAndConditions';

describe('<TermsAndConditions />', () => {
  it('Будет выведен корректный текст и начальное состояние', () => {
    render(<TermsAndConditions />);

    const heading = screen.getByRole('heading');

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/terms & conditions/i);

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/submit/i);
    expect(button).toBeDisabled();
  });

  it('Будет разблокирована кнопка при включении чекбокса', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<TermsAndConditions />);

    // Act
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    // Asset
    expect(screen.getByRole('button')).toBeEnabled();
  });
});
