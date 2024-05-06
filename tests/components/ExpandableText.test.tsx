import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpandableText from '../../src/components/ExpandableText';

const longText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus feugiat velit et volutpat. Maecenas eu tellus commodo, tincidunt sem tristique, bibendum purus. In eget dolor et diam sodales eleifend. Pellentesque lacinia nisi eu leo vulputate, ut laoreet justo pulvinar. Praesent lobortis congue pharetra. Phasellus sollicitudin, erat vitae pulvinar maximus, ligula nisi pulvinar nulla, gravida molestie urna nunc et risus. Suspendisse vitae venenatis dui. Sed sed tincidunt est, vitae aliquet quam. Nam tincidunt lacus et volutpat porttitor. Proin sagittis sodales justo, quis rutrum nulla ultricies eu. Sed dapibus, dolor id iaculis tincidunt, erat tortor feugiat ipsum, id ultricies augue ex ac velit. Quisque cursus quis odio eu laoreet. Praesent semper dictum ligula vitae lacinia.Nam rhoncus sem consequat purus ultrices dictum. Fusce lobortis sagittis egestas. Duis laoreet mi non sodales auctor. Integer pharetra libero quis tortor volutpat rutrum. Nulla non dui metus. Morbi faucibus nibh vitae egestas posuere. Nulla eu accumsan lacus. Nulla hendrerit lacus eget efficitur convallis. Etiam vitae magna vulputate, ullamcorper neque in, tempus risus. Integer tristique nisl eu neque molestie pharetra. Nulla facilisi. Suspendisse a arcu felis.';

describe('<ExpandableText />', () => {
  it('Будет выведен полный текст, если число символов меньше 255', () => {
    render(<ExpandableText text='short text' />);

    const article = screen.getByRole('article');

    expect(article).toBeInTheDocument();
    expect(article).toHaveTextContent(/short text/i);

    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });

  it('Будет отрисована кнопка показа/скрытия полного текста', () => {
    render(<ExpandableText text={longText} />);

    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/show more/i);
  });

  it('Проверка состояния компонента при клике на кнопку', async () => {
    render(<ExpandableText text={longText} />);

    const shortText = longText.substring(0, 255);

    const user = userEvent.setup();

    const button = screen.getByRole('button');

    const article = screen.getByRole('article');
    expect(article).toBeInTheDocument();
    expect(article).toHaveTextContent(shortText);
    expect(button).toHaveTextContent(/show more/i);

    await user.click(button);

    expect(button).toHaveTextContent(/show less/i);
    expect(article).toHaveTextContent(longText);

    await user.click(button);

    expect(article).toHaveTextContent(shortText);
    expect(button).toHaveTextContent(/show more/i);
  });
});
