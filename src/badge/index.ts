import { Badge as InternalBadge } from './Badge';
import { Ribbon } from './Ribbon';

export const Badge = Object.assign(InternalBadge, { Ribbon });
export { Ribbon };
export type * from './Badge';
export type * from './Ribbon';
