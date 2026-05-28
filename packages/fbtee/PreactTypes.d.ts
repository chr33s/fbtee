import type { ComponentChild, VNode } from 'preact';
import {
  FbtConjunction,
  FbtDelimiter,
  FbtWithoutString,
} from './lib/index-preact.d.mts';

enum IntlVariations {
  GENDER_MALE = 1,
  GENDER_FEMALE = 2,
  GENDER_UNKNOWN = 3,
  NUMBER_ONE = 4,
  NUMBER_TWO = 8,
  NUMBER_MANY = 12,
  NUMBER_ZERO = 16,
  NUMBER_FEW = 20,
  NUMBER_OTHER = 24,
  BITMASK_NUMBER = 28,
}

enum GenderConst {
  NOT_A_PERSON = 0,
  FEMALE_SINGULAR = 1,
  MALE_SINGULAR = 2,
  UNKNOWN_SINGULAR = 7,
  UNKNOWN_PLURAL = 11,
}

export type ParamOptions = {
  gender?: IntlVariations;
  number?: number | true;
};

export type PronounOptions = {
  capitalize?: boolean;
  human?: boolean;
};

export type PluralOptions = {
  many?: string;
  name?: string;
  showCount?: 'yes' | 'no' | 'ifMany';
  value?: unknown;
};

type FbtEnumProps = {
  'enum-range': Array<string> | { [enumKey: string]: string };
  key?: string | null;
  value: string;
};

type FbtParamProps = ParamOptions & {
  key?: string | null;
  name: string;
};

type FbtPluralProps = PluralOptions & {
  count: number;
  key?: string | null;
};

type FbtPronounProps = PronounOptions & {
  gender: GenderConst;
  key?: string | null;
  type: 'object' | 'possessive' | 'reflexive' | 'subject';
};

type FbtNameProps = {
  gender: IntlVariations;
  key?: string | null;
  name: string;
};

type FbtSameParamProps = {
  key?: string | null;
  name: string;
};

type FbtProps = { key?: string | null } & (
  | {
      author?: string;
      common?: boolean;
      desc: string;
      doNotExtract?: boolean;
      preserveWhitespace?: boolean;
      project?: string;
      subject?: IntlVariations;
    }
  | { common: true }
);

type FbtListProps = {
  conjunction?: FbtConjunction;
  delimiter?: FbtDelimiter;
  items: Array<FbtWithoutString | VNode | null | undefined>;
  key?: string | null;
  name: string;
};

type PropsWithChildren<P> = P & { children?: ComponentChild | undefined };
type PropsWithStringChild<P> = P & {
  children?: string | Array<string> | undefined;
};

declare module 'preact' {
  namespace JSX {
    interface IntrinsicElements {
      fbs: PropsWithChildren<FbtProps>;
      'fbs:enum': FbtEnumProps;
      'fbs:name': PropsWithStringChild<FbtNameProps>;
      'fbs:param': PropsWithStringChild<FbtParamProps>;
      'fbs:plural': PropsWithStringChild<FbtPluralProps>;
      'fbs:pronoun': FbtPronounProps;
      'fbs:same-param': FbtSameParamProps;
      fbt: PropsWithChildren<FbtProps>;
      'fbt:enum': FbtEnumProps;
      'fbt:list': FbtListProps;
      'fbt:name': PropsWithChildren<FbtNameProps>;
      'fbt:param': PropsWithChildren<FbtParamProps>;
      'fbt:plural': PropsWithChildren<FbtPluralProps>;
      'fbt:pronoun': FbtPronounProps;
      'fbt:same-param': FbtSameParamProps;
    }
  }
}
