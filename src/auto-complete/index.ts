import { AutoComplete as InternalAutoComplete } from './AutoComplete';
import { SelectOptionComponent } from '../select';

export const AutoComplete = Object.assign(InternalAutoComplete, { Option: SelectOptionComponent });
export type * from './AutoComplete';
