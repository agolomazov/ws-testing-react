import { render, screen } from '@testing-library/react';
import Label from '../../src/components/Label';
import { LanguageProvider } from '../../src/providers/language/LanguageProvider';
import { Language } from '../../src/providers/language/type';

import en from '../../src/providers/language/data/en.json';

type LabelKey = keyof typeof en;

describe('<Label />', () => {
  const renderComponent = (labelId: LabelKey, lang: Language = 'en') => {
    render(
      <LanguageProvider language={lang}>
        <Label labelId={labelId} />
      </LanguageProvider>
    );
  };

  describe('Выбран язык EN', () => {
    it.each([
      {
        labelId: 'welcome',
        text: 'Welcome',
      },
      {
        labelId: 'new_product',
        text: 'New Product',
      },
      {
        labelId: 'edit_product',
        text: 'Edit Product',
      },
    ])('Показать текст $text по метке $labelId', ({ labelId, text }) => {
      renderComponent(labelId as LabelKey, 'en');

      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  describe('Выбран язык ES', () => {
    it.each([
      {
        labelId: 'welcome',
        text: 'Bienvenidos',
      },
      {
        labelId: 'new_product',
        text: 'Nuevo Producto',
      },
      {
        labelId: 'edit_product',
        text: 'Editar Producto',
      },
    ])('Показать текст $text по метке $labelId', ({ labelId, text }) => {
      renderComponent(labelId as LabelKey, 'es');

      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  describe('Выбрасываем ошибку, если такой метки нет', () => {
    it.each([
      {
        labelId: 'welcomen',
      },
      {
        labelId: 'new_products',
      },
      {
        labelId: 'edit_products',
      },
    ])(
      'Выбрасываем ошибку в случае если передаем метку $labelId',
      ({ labelId }) => {
        expect(() => renderComponent(labelId as LabelKey)).toThrowError();
      }
    );
  });
});
