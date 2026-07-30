import { createSignal, For, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { CloseIcon, DownIcon } from '../_internal/icons';
import { Popover } from '../popover';
import { useFormItemControl } from '../form/context';

export type CascaderValue = string | number;

export interface CascaderOption {
  value: CascaderValue;
  label?: JSX.Element;
  children?: readonly CascaderOption[];
  disabled?: boolean;
  isLeaf?: boolean;
  loading?: boolean;
  class?: string;
}

export interface CascaderProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options?: readonly CascaderOption[];
  value?: readonly CascaderValue[] | readonly (readonly CascaderValue[])[];
  defaultValue?: readonly CascaderValue[] | readonly (readonly CascaderValue[])[];
  multiple?: boolean;
  changeOnSelect?: boolean;
  showSearch?: boolean;
  searchValue?: string;
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  allowClear?: boolean;
  placeholder?: JSX.Element;
  expandTrigger?: 'click' | 'hover';
  displayRender?: (labels: JSX.Element[], selectedOptions?: CascaderOption[]) => JSX.Element;
  filter?: (inputValue: string, path: CascaderOption[]) => boolean;
  loadData?: (selectedOptions: CascaderOption[]) => void | Promise<void>;
  onChange?: (value: CascaderValue[] | CascaderValue[][] | undefined, selectedOptions?: CascaderOption[] | CascaderOption[][]) => void;
  onSearch?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
}

const allPaths = (options: readonly CascaderOption[], prefix: CascaderOption[] = []): CascaderOption[][] => options.flatMap((option) => option.children?.length ? allPaths(option.children, [...prefix, option]) : [[...prefix, option]]);
const samePath = (left: readonly CascaderValue[], right: readonly CascaderValue[]) => left.length === right.length && left.every((value, index) => value === right[index]);

export function Cascader(inputProps: CascaderProps) {
  const props = merge({ options: [] as readonly CascaderOption[], defaultValue: [] as readonly CascaderValue[], defaultOpen: false, allowClear: true, expandTrigger: 'click' as const }, inputProps);
  const field = useFormItemControl();
  const [internalValue, setInternalValue] = createSignal<CascaderProps['value']>(props.defaultValue, { ownedWrite: true });
  const [activePath, setActivePath] = createSignal<CascaderOption[]>([], { ownedWrite: true });
  const [internalOpen, setInternalOpen] = createSignal(Boolean(props.defaultOpen), { ownedWrite: true });
  const [internalSearch, setInternalSearch] = createSignal('');
  const others = omit(props, 'options', 'value', 'defaultValue', 'multiple', 'changeOnSelect', 'showSearch', 'searchValue', 'open', 'defaultOpen', 'disabled', 'allowClear', 'placeholder', 'expandTrigger', 'displayRender', 'filter', 'loadData', 'onChange', 'onSearch', 'onOpenChange', 'class');
  const value = () => props.value ?? (field?.value() !== undefined ? field.value() as CascaderProps['value'] : internalValue());
  const paths = (): CascaderValue[][] => props.multiple ? (value() as CascaderValue[][] ?? []) : value()?.length ? [value() as CascaderValue[]] : [];
  const open = () => props.open ?? internalOpen();
  const search = () => props.searchValue ?? internalSearch();
  const disabled = () => props.disabled ?? field?.disabled() ?? false;
  const setOpen = (next: boolean) => { if (disabled()) return; if (props.open === undefined) setInternalOpen(next); props.onOpenChange?.(next); };
  const optionPath = (path: readonly CascaderValue[]) => {
    const result: CascaderOption[] = [];
    let options = props.options;
    for (const key of path) { const option = options.find((item) => item.value === key); if (!option) break; result.push(option); options = option.children ?? []; }
    return result;
  };
  const selectedOptionPaths = () => paths().map(optionPath);
  const commit = (path: CascaderOption[]) => {
    const keys = path.map((option) => option.value);
    if (props.multiple) {
      const selected = paths().some((item) => samePath(item, keys));
      const next = selected ? paths().filter((item) => !samePath(item, keys)) : [...paths(), keys];
      if (props.value === undefined) { if (field) field.setValue(next); else setInternalValue(next); }
      props.onChange?.(next, next.map(optionPath));
    } else {
      if (props.value === undefined) { if (field) field.setValue(keys); else setInternalValue(keys); }
      props.onChange?.(keys, path);
      setOpen(false);
    }
  };
  const activate = async (option: CascaderOption, level: number) => {
    if (option.disabled) return;
    const next = [...activePath().slice(0, level), option];
    setActivePath(next);
    if (!option.children?.length && option.isLeaf === false && props.loadData) await props.loadData(next);
    if (!option.children?.length && option.isLeaf !== false) commit(next);
    else if (props.changeOnSelect) commit(next);
  };
  const columns = () => {
    const result: (readonly CascaderOption[])[] = [props.options];
    for (const option of activePath()) if (option.children?.length) result.push(option.children);
    return result;
  };
  const filteredPaths = () => !search() ? [] : allPaths(props.options).filter((path) => props.filter ? props.filter(search(), path) : path.some((option) => String(option.label ?? option.value).toLocaleLowerCase().includes(search().toLocaleLowerCase())));
  const display = (path: CascaderOption[]) => props.displayRender?.(path.map((option) => option.label ?? String(option.value)), path) ?? path.map((option) => option.label ?? String(option.value)).join(' / ');
  const panel = () => (
    <div class="flex max-h-72 min-w-56 overflow-auto">
      <Show when={!props.showSearch || !search()} fallback={<div class="w-72 p-1"><For each={filteredPaths()}>{(path) => <button type="button" class="block min-h-8 w-full rounded-small px-3 text-left text-sm hover:bg-surface-container" onClick={() => commit(path)}>{display(path)}</button>}</For><Show when={filteredPaths().length === 0}><div class="p-3 text-center text-text-disabled">No data</div></Show></div>}>
        <For each={columns()}>{(options, level) => <div class="min-w-40 border-r border-border-secondary p-1 last:border-r-0"><For each={options}>{(option) => { const active = () => activePath()[level()]?.value === option.value; return <button type="button" disabled={option.disabled} class={['flex min-h-8 w-full items-center rounded-small px-3 text-left text-sm hover:bg-surface-container disabled:text-text-disabled', active() ? 'bg-surface-container' : '', option.class]} onClick={() => void activate(option, level())} onPointerEnter={() => { if (props.expandTrigger === 'hover') void activate(option, level()); }}><span class="min-w-0 flex-1 truncate">{option.label ?? option.value}</span><Show when={option.loading}><span class="ads-spin size-3 rounded-full border border-primary border-r-transparent" /></Show><Show when={option.children?.length || option.isLeaf === false}><span>&gt;</span></Show></button>; }}</For></div>}</For>
      </Show>
    </div>
  );
  const clear = () => { if (props.value === undefined) { if (field) field.setValue(props.multiple ? [] : undefined); else setInternalValue([]); } props.onChange?.(undefined); };

  return (
    <Popover open={open()} trigger={[]} placement="bottom-start" content={panel()} onOpenChange={setOpen}>
      <div {...others} id={field?.id} role="combobox" aria-expanded={open() ? 'true' : 'false'} class={['ads-cascader flex min-h-8 w-full items-center gap-1 rounded-control border border-border bg-surface px-3 text-sm hover:border-primary', disabled() ? 'cursor-not-allowed bg-surface-container text-text-disabled' : '', props.class]} onClick={() => setOpen(true)}>
        <Show when={props.showSearch}><input aria-label={props['aria-label'] ?? 'Search options'} value={search()} class="min-w-0 flex-1 bg-transparent outline-none" onClick={(event) => event.stopPropagation()} onFocus={() => setOpen(true)} onInput={(event) => { if (props.searchValue === undefined) setInternalSearch(event.currentTarget.value); props.onSearch?.(event.currentTarget.value); }} /></Show>
        <Show when={!props.showSearch && selectedOptionPaths().length}><span class="min-w-0 flex-1 truncate">{props.multiple ? selectedOptionPaths().map(display).join(', ') : display(selectedOptionPaths()[0])}</span></Show>
        <Show when={paths().length === 0 && !search()}><span class="min-w-0 flex-1 truncate text-text-disabled">{props.placeholder ?? 'Please select'}</span></Show>
        <Show when={props.allowClear && paths().length}><button type="button" aria-label="Clear selection" class="size-6 bg-transparent text-text-disabled" onClick={(event) => { event.stopPropagation(); clear(); }}><CloseIcon /></button></Show>
        <DownIcon class="ml-auto text-text-disabled" />
      </div>
    </Popover>
  );
}
