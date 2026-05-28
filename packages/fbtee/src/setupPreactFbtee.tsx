import type { PatternHash } from './CompilerTypes.ts';
import FbtTranslations, { TranslationDictionary } from './FbtTranslations.tsx';
import getFbsResult from './getFbsResult.tsx';
import Hook, { Hooks } from './Hooks.tsx';
import type { IFbtErrorListener, NestedFbtContentItems } from './Types.ts';
import IntlViewerContext from './ViewerContext.tsx';
import PreactFbtResult from './PreactFbtResult.tsx';

const hasWindow = typeof window !== 'undefined';

const getPreactFbtResult = (
  contents: NestedFbtContentItems,
  hashKey: PatternHash | null | undefined,
  errorListener: IFbtErrorListener | null,
) => {
  const result = new PreactFbtResult(contents, errorListener, hashKey);
  if (hasWindow) {
    return result;
  }

  const resolvedContents = result.getContents();
  return (resolvedContents?.length === 1 &&
  typeof resolvedContents[0] === 'string'
    ? resolvedContents[0]
    : resolvedContents) as unknown as PreactFbtResult;
};

export default function setupPreactFbtee({
  hooks,
  translations,
}: {
  hooks?: Hooks | null;
  translations: TranslationDictionary;
}) {
  FbtTranslations.registerTranslations(translations);

  if (!hooks) {
    hooks = {};
  }

  if (!hooks.getFbtResult) {
    hooks.getFbtResult = getPreactFbtResult;
  }
  if (!hooks.getFbsResult) {
    hooks.getFbsResult = getFbsResult;
  }
  if (!hooks.getTranslatedInput) {
    hooks.getTranslatedInput = FbtTranslations.getTranslatedInput;
  }
  if (!hooks.getViewerContext) {
    hooks.getViewerContext = () => IntlViewerContext;
  }

  Hook.register(hooks);
}
