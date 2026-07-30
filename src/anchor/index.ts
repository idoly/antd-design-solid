import { Anchor as InternalAnchor, AnchorLink } from './Anchor';

export const Anchor = Object.assign(InternalAnchor, { Link: AnchorLink });
export { AnchorLink };
export type * from './Anchor';
