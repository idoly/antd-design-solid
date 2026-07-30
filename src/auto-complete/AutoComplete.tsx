import { createSignal, merge, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { Select, type SelectOption, type SelectProps } from '../select';
import { useFormItemControl } from '../form/context';

export interface AutoCompleteOption extends Omit<SelectOption, 'value'> {
  value: string;
}

export interface AutoCompleteProps extends Omit<SelectProps, 'options' | 'value' | 'defaultValue' | 'mode' | 'showSearch' | 'searchValue' | 'onChange' | 'onSearch' | 'onSelect' | 'labelInValue' | 'tokenSeparators'> {
  options?: readonly AutoCompleteOption[];
  value?: string;
  defaultValue?: string;
  dataSource?: readonly string[];
  onChange?: (value: string) => void;
  onSelect?: (value: string, option: AutoCompleteOption) => void;
  onSearch?: (value: string) => void;
  children?: JSX.Element;
}

export function AutoComplete(inputProps: AutoCompleteProps) {
  const props = merge({ options: [] as readonly AutoCompleteOption[], dataSource: [] as readonly string[] }, inputProps);
  const field = useFormItemControl();
  const [internalValue, setInternalValue] = createSignal(props.defaultValue ?? '', { ownedWrite: true });
  const selectProps = omit(props, 'options', 'value', 'defaultValue', 'dataSource', 'onChange', 'onSelect', 'onSearch', 'children');
  const options = (): AutoCompleteOption[] => [
    ...props.options,
    ...props.dataSource.filter((value) => !props.options.some((option) => option.value === value)).map((value) => ({ value, label: value })),
  ];
  const value = () => props.value ?? (field?.value() !== undefined ? String(field.value()) : internalValue());
  const commit = (next: string) => {
    if (props.value === undefined) {
      if (field) field.setValue(next);
      else setInternalValue(next);
    }
    props.onChange?.(next);
  };
  const search = (next: string) => {
    commit(next);
    props.onSearch?.(next);
  };
  const select: NonNullable<SelectProps['onChange']> = (next, option) => {
    const raw = Array.isArray(next) ? next[0] : next;
    const selected = String(typeof raw === 'object' && raw ? raw.value : raw ?? '');
    commit(selected);
    if (option && !Array.isArray(option)) props.onSelect?.(selected, option as AutoCompleteOption);
  };

  return (
    <Select
      {...selectProps}
      options={options().length ? options() : undefined}
      showSearch
      searchValue={value()}
      filterOption={props.filterOption}
      onSearch={search}
      onChange={select}
    >{props.children}</Select>
  );
}
