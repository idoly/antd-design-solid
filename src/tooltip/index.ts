import { Tooltip as InternalTooltip, TooltipUniqueProvider } from './Tooltip';

export const Tooltip = Object.assign(InternalTooltip, { UniqueProvider: TooltipUniqueProvider });
export { TooltipUniqueProvider };
export type * from './Tooltip';
