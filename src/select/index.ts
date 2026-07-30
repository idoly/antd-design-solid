import { Select as InternalSelect, SelectOptGroup, SelectOptionComponent } from './Select';

export const Select = Object.assign(InternalSelect, { Option: SelectOptionComponent, OptGroup: SelectOptGroup });
export { SelectOptGroup, SelectOptionComponent };
export type * from './Select';
