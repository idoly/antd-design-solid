import { Cascader as InternalCascader } from './Cascader';
import { CascaderPanel } from './CascaderPanel';

export const Cascader = Object.assign(InternalCascader, { Panel: CascaderPanel });
export { CascaderPanel };
export type * from './Cascader';
export type * from './CascaderPanel';
