import { SHOW_ALL, SHOW_CHILD, SHOW_PARENT, TreeSelect as InternalTreeSelect, TreeSelectNodeComponent } from './TreeSelect';

export const TreeSelect = Object.assign(InternalTreeSelect, { TreeNode: TreeSelectNodeComponent, SHOW_ALL, SHOW_PARENT, SHOW_CHILD });
export { SHOW_ALL, SHOW_CHILD, SHOW_PARENT, TreeSelectNodeComponent };
export type * from './TreeSelect';
