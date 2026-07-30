import { CheckableTag } from './CheckableTag';
import { CheckableTagGroup } from './CheckableTagGroup';
import { InternalTag } from './Tag';

export const Tag = Object.assign(InternalTag, { CheckableTag, CheckableTagGroup });
export { CheckableTag, CheckableTagGroup };
export type * from './CheckableTag';
export type * from './CheckableTagGroup';
export type * from './Tag';
