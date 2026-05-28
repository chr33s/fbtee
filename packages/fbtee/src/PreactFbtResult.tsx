import { h } from 'preact';
import type { ComponentChildren, VNode } from 'preact';
import FbtResultBase from './FbtResultBase.tsx';
import type {
  BaseResult,
  IFbtErrorListener,
  NestedFbtContentItems,
} from './Types.ts';

type Props = Readonly<{
  content: NestedFbtContentItems;
}>;

const FbtResultComponent = ({ content }: Props): ComponentChildren => content;

export default class PreactFbtResult
  extends FbtResultBase
  implements BaseResult, VNode<Props>
{
  key!: VNode<Props>['key'];
  props!: VNode<Props>['props'];
  ref?: VNode<Props>['ref'];
  type!: VNode<Props>['type'];

  constructor(
    contents: NestedFbtContentItems,
    errorListener: IFbtErrorListener | null,
    key: string | null | undefined,
  ) {
    super(contents, errorListener);
    Object.assign(this, h(FbtResultComponent, { content: contents, key }));
  }
}
