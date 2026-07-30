import { TabPane, Tabs as InternalTabs } from './Tabs';

export const Tabs = Object.assign(InternalTabs, { TabPane });
export { TabPane };
export type * from './Tabs';
