import { createSignal, For, merge, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import type { CascaderOption, CascaderProps, CascaderValue } from './Cascader';

export interface CascaderPanelProps extends Pick<CascaderProps, 'options' | 'value' | 'defaultValue' | 'multiple' | 'changeOnSelect' | 'expandTrigger' | 'loadData' | 'onChange'> {
  class?: string;
  style?: JSX.CSSProperties;
}

const samePath = (left: readonly CascaderValue[], right: readonly CascaderValue[]) => left.length === right.length && left.every((value, index) => value === right[index]);

export function CascaderPanel(inputProps: CascaderPanelProps) {
  const props = merge({ options: [] as readonly CascaderOption[], defaultValue: [] as readonly CascaderValue[], expandTrigger: 'click' as const }, inputProps);
  const [internalValue, setInternalValue] = createSignal<CascaderProps['value']>(props.defaultValue, { ownedWrite: true });
  const [activePath, setActivePath] = createSignal<CascaderOption[]>([], { ownedWrite: true });
  let currentValue: CascaderProps['value'] = props.defaultValue;
  let rootRef: HTMLDivElement | undefined;
  const value = () => props.value ?? (internalValue(), currentValue);
  const paths = (): CascaderValue[][] => props.multiple ? value() as CascaderValue[][] ?? [] : value()?.length ? [value() as CascaderValue[]] : [];
  const optionPath = (path: readonly CascaderValue[]) => {
    const result: CascaderOption[] = [];
    let options = props.options;
    for (const key of path) { const option = options.find((item) => item.value === key); if (!option) break; result.push(option); options = option.children ?? []; }
    return result;
  };
  const commit = (path: CascaderOption[]) => {
    const keys = path.map((option) => option.value);
    if (props.multiple) {
      const next = paths().some((item) => samePath(item, keys)) ? paths().filter((item) => !samePath(item, keys)) : [...paths(), keys];
      currentValue = next;
      if (props.value === undefined) setInternalValue(next);
      props.onChange?.(next, next.map(optionPath));
    } else {
      currentValue = keys;
      if (props.value === undefined) setInternalValue(keys);
      props.onChange?.(keys, path);
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
  const keyboard = (event: KeyboardEvent, level: number) => {
    const buttons = [...(rootRef?.querySelectorAll<HTMLButtonElement>(`[data-level="${level}"]`) ?? [])].filter((button) => !button.disabled);
    const index = buttons.indexOf(event.currentTarget as HTMLButtonElement);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); buttons[(index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length]?.focus(); }
    if (event.key === 'ArrowRight') { event.preventDefault(); rootRef?.querySelector<HTMLButtonElement>(`[data-level="${level + 1}"]`)?.focus(); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); rootRef?.querySelector<HTMLButtonElement>(`[data-level="${Math.max(0, level - 1)}"]`)?.focus(); }
  };
  return <div ref={rootRef} role="group" aria-label="Cascader panel" class={['ads-cascader-panel flex max-h-72 min-w-56 overflow-auto rounded-control border border-border-secondary bg-surface', props.class]} style={props.style}>
    <For each={columns()}>{(options, level) => <div role="listbox" aria-label={`Level ${level() + 1}`} class="min-w-40 border-r border-border-secondary p-1 last:border-r-0"><For each={options}>{(option) => {
      const active = () => activePath()[level()]?.value === option.value;
      const selected = () => paths().some((path) => samePath(path, [...activePath().slice(0, level()), option].map((item) => item.value)));
      return <button type="button" role="option" aria-selected={selected() ? 'true' : 'false'} data-level={level()} disabled={option.disabled} class={['flex min-h-8 w-full items-center rounded-small px-3 text-left text-sm hover:bg-surface-container disabled:text-text-disabled', active() ? 'bg-surface-container' : '', option.class]} onClick={() => void activate(option, level())} onKeyDown={(event) => keyboard(event, level())} onPointerEnter={() => { if (props.expandTrigger === 'hover') void activate(option, level()); }}><span class="min-w-0 flex-1 truncate">{option.label ?? option.value}</span><Show when={option.loading}><span class="ads-spin size-3 rounded-full border border-primary border-r-transparent" /></Show><Show when={option.children?.length || option.isLeaf === false}><span aria-hidden="true">&gt;</span></Show></button>;
    }}</For></div>}</For>
  </div>;
}
