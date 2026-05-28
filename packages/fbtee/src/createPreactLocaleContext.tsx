/** @jsxImportSource preact */
import { createContext, Fragment } from 'preact';
import type { ComponentChildren, Context as PreactContext } from 'preact';
import { useCallback, useContext, useState } from 'preact/hooks';
import Hooks from './Hooks.tsx';
import IntlVariations from './IntlVariations.tsx';
import setupLocaleContext, {
  Gender,
  LocaleContextProps,
  resolveGender,
} from './setupLocaleContext.tsx';

export type LocaleContext = {
  gender: IntlVariations;
  locale: string;
  localeChangeIsPending: boolean;
  setGender: (gender: Gender) => void;
  setLocale: (locale: string) => void;
};

const hasWindow = typeof window !== 'undefined';

export const Context = (() =>
  hasWindow
    ? createContext<LocaleContext>(null as unknown as LocaleContext)
    : ((({ children }: { children?: ComponentChildren }) =>
        children) as unknown as PreactContext<LocaleContext>))();

export const useLocaleContext = (() =>
  hasWindow
    ? () => useContext(Context)
    : () => {
        const viewerContext = Hooks.getViewerContext();
        return {
          gender: viewerContext.GENDER,
          locale: viewerContext.locale,
          localeChangeIsPending: false,
          setGender: (gender: Gender) => {
            const viewerContext = Hooks.getViewerContext();
            Hooks.register({
              getViewerContext: () => ({
                ...viewerContext,
                GENDER: resolveGender(gender),
              }),
            });
          },
          setLocale: (locale: string) => {
            const viewerContext = Hooks.getViewerContext();
            Hooks.register({
              getViewerContext: () => ({
                ...viewerContext,
                locale,
              }),
            });
          },
        };
      })();

export default function createLocaleContext(props: LocaleContextProps) {
  const {
    gender: initialGender,
    getLocale,
    setGender,
    setLocale,
  } = setupLocaleContext(props);

  return function LocaleContext({
    children,
  }: {
    children?: ComponentChildren;
  }) {
    const [locale, updateLocale] = useState(getLocale());
    const [localeChangeIsPending, setLocaleChangeIsPending] = useState(false);
    const [gender, updateGender] = useState(initialGender);

    const changeLocale = useCallback(
      (newLocale: string) => {
        if (newLocale === locale) {
          return;
        }

        setLocaleChangeIsPending(true);
        void setLocale(newLocale)
          .then(updateLocale)
          .finally(() => setLocaleChangeIsPending(false));
      },
      [locale],
    );

    const changeGender = useCallback(
      (newGender: Gender) => {
        if (newGender !== gender) {
          const gender = setGender(newGender);
          updateGender(gender);
        }
      },
      [gender],
    );

    return (
      <Context.Provider
        value={{
          gender,
          locale,
          localeChangeIsPending,
          setGender: changeGender,
          setLocale: changeLocale,
        }}
      >
        <Fragment key={`${locale}-${gender}`}>{children}</Fragment>
      </Context.Provider>
    );
  };
}
