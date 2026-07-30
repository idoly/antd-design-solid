import { DirectoryTree, moveTreeNode, Tree as InternalTree, TreeNode } from './Tree';

export const Tree = Object.assign(InternalTree, { TreeNode, DirectoryTree });
export { DirectoryTree, moveTreeNode, TreeNode };
export type * from './Tree';
