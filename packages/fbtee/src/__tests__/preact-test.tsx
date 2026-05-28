/** @jsxImportSource preact */
/// <reference types="../../PreactTypes.d.ts" />

import { expect, jest } from '@jest/globals';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/preact';
import fbtInternal from '../fbt.tsx';
import {
  createLocaleContext,
  fbt,
  PreactFbtResult,
  setupFbtee,
  useLocaleContext,
} from '../index-preact.tsx';

beforeEach(() => {
  // Ensure the Preact entrypoint binding is used for transformed <fbt> JSX.
  // eslint-disable-next-line no-unused-expressions, @typescript-eslint/no-unused-expressions
  fbt;

  setupFbtee({
    translations: {},
  });
});

test('renders rich fbt content as native Preact VNodes', () => {
  const { container } = render(
    <div>
      <fbt desc="Greeting with rich content">
        Hello{' '}
        <fbt:param name="name">
          <strong>Preact</strong>
        </fbt:param>
      </fbt>
    </div>,
  );

  expect(container.textContent).toBe('Hello Preact');
  expect(container.querySelector('strong')?.textContent).toBe('Preact');
});

test('uses PreactFbtResult for runtime rich content', () => {
  const result = fbtInternal._('Hello {name}', [
    // @ts-expect-error Testing renderer content in the internal runtime.
    fbtInternal._param('name', <strong>Preact</strong>),
  ]);

  expect(result).toBeInstanceOf(PreactFbtResult);
});

test('retains keyed Preact child identity when sentence order changes', () => {
  const childA = <span data-testid="a" key="A" />;
  const childB = <span data-testid="b" key="B" />;

  const TestComponent = ({ value }: { value: 'A' | 'B' }) => {
    const fbtFragment = fbtInternal._(
      {
        A: '{tokenA} is before {tokenB}',
        B: '{tokenB} is after {tokenA}',
      },
      [
        // @ts-expect-error Testing renderer content in the internal runtime.
        fbtInternal._param('tokenA', childA),
        // @ts-expect-error Testing renderer content in the internal runtime.
        fbtInternal._param('tokenB', childB),
        fbtInternal._enum(value, { A: 'is before', B: 'is after' }),
      ],
    );
    return <div>{fbtFragment}</div>;
  };

  const { container, rerender } = render(<TestComponent value="A" />);
  const firstA = screen.getByTestId('a');
  const firstB = screen.getByTestId('b');

  rerender(<TestComponent value="B" />);

  expect(container.children[0].children.length).toBe(2);
  expect(screen.getByTestId('a')).toBe(firstA);
  expect(screen.getByTestId('b')).toBe(firstB);
});

test('locale context works with Preact hooks', async () => {
  const LocaleContext = createLocaleContext({
    availableLanguages: new Map([
      ['en_US', 'English'],
      ['de_AT', 'German'],
    ]),
    clientLocales: ['en_US', 'de_AT'],
    loadLocale: jest.fn(async () => ({})),
  });

  const Button = () => {
    const { locale, setLocale } = useLocaleContext();
    return <button onClick={() => setLocale('de_AT')}>{locale}</button>;
  };

  render(
    <LocaleContext>
      <Button />
    </LocaleContext>,
  );

  expect(screen.getByRole('button').textContent).toBe('en_US');

  await act(async () => {
    fireEvent.click(screen.getByRole('button'));
  });

  await waitFor(() =>
    expect(screen.getByRole('button').textContent).toBe('de_AT'),
  );
});
