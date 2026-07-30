import { Space as InternalSpace, SpaceAddon, SpaceCompact, SpaceContext } from './Space';

export const Space = Object.assign(InternalSpace, { Addon: SpaceAddon, Compact: SpaceCompact });
export { SpaceAddon, SpaceCompact, SpaceContext };
export type * from './Space';
