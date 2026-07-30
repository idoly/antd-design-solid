import { createSignal, For, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { useFormItemControl } from '../form/context';
import { useConfig } from '../config-provider';

export type TransferSemanticName =
  | 'root' | 'section' | 'header' | 'title' | 'body' | 'list' | 'item' | 'itemIcon' | 'itemContent' | 'footer' | 'actions'
  | 'source.section' | 'target.section' | 'source.header' | 'target.header' | 'source.title' | 'target.title'
  | 'source.body' | 'target.body' | 'source.list' | 'target.list' | 'source.item' | 'target.item'
  | 'source.itemIcon' | 'target.itemIcon' | 'source.itemContent' | 'target.itemContent' | 'source.footer' | 'target.footer';
export type TransferSemanticClassNames = Partial<Record<TransferSemanticName, string>>;
export type TransferSemanticStyles = Partial<Record<TransferSemanticName, JSX.CSSProperties>>;

export interface TransferItem {
  key: string;
  title: string;
  description?: string;
  disabled?: boolean;
  [name: string]: unknown;
}

export interface TransferProps<RecordType extends TransferItem = TransferItem> extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  dataSource: readonly RecordType[];
  targetKeys?: readonly string[];
  defaultTargetKeys?: readonly string[];
  selectedKeys?: readonly string[];
  operations?: readonly [JSX.Element, JSX.Element];
  oneWay?: boolean;
  showSearch?: boolean;
  filterOption?: (inputValue: string, item: RecordType, direction: 'left' | 'right') => boolean;
  render?: (item: RecordType) => JSX.Element | { label: JSX.Element; value: string };
  titles?: readonly [JSX.Element, JSX.Element];
  footer?: (props: { direction: 'left' | 'right' }) => JSX.Element;
  listStyle?: JSX.CSSProperties | ((info: { direction: 'left' | 'right' }) => JSX.CSSProperties);
  disabled?: boolean;
  onChange?: (targetKeys: string[], direction: 'left' | 'right', moveKeys: string[]) => void;
  onSelectChange?: (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => void;
  onSearch?: (direction: 'left' | 'right', value: string) => void;
  classNames?: TransferSemanticClassNames;
  styles?: TransferSemanticStyles;
}

export function Transfer<RecordType extends TransferItem = TransferItem>(inputProps: TransferProps<RecordType>) {
  const config = useConfig();
  const props = merge({ defaultTargetKeys: [] as readonly string[], operations: ['>', '<'] as readonly [JSX.Element, JSX.Element] }, config.componentDefaults('transfer') as Partial<TransferProps<RecordType>>, inputProps);
  const field = useFormItemControl();
  const [internalTarget, setInternalTarget] = createSignal<readonly string[]>(props.defaultTargetKeys, { ownedWrite: true });
  const [sourceSelected, setSourceSelected] = createSignal<readonly string[]>([], { ownedWrite: true });
  const [targetSelected, setTargetSelected] = createSignal<readonly string[]>([], { ownedWrite: true });
  const [sourceSearch, setSourceSearch] = createSignal('');
  const [targetSearch, setTargetSearch] = createSignal('');
  let currentSourceSelected: readonly string[] = [];
  let currentTargetSelected: readonly string[] = [];
  const others = omit(props, 'dataSource', 'targetKeys', 'defaultTargetKeys', 'selectedKeys', 'operations', 'oneWay', 'showSearch', 'filterOption', 'render', 'titles', 'footer', 'listStyle', 'disabled', 'onChange', 'onSelectChange', 'onSearch', 'classNames', 'styles', 'class', 'style');
  const targets = () => props.targetKeys ?? (field?.value() !== undefined ? field.value() as readonly string[] : internalTarget());
  const sourceKeys = () => {
    if (props.selectedKeys) return props.selectedKeys.filter((key) => !targets().includes(key));
    sourceSelected();
    return currentSourceSelected;
  };
  const targetKeysSelected = () => {
    if (props.selectedKeys) return props.selectedKeys.filter((key) => targets().includes(key));
    targetSelected();
    return currentTargetSelected;
  };
  const disabled = () => props.disabled ?? field?.disabled() ?? false;
  const items = (direction: 'left' | 'right') => props.dataSource.filter((item) => direction === 'left' ? !targets().includes(item.key) : targets().includes(item.key));
  const filtered = (direction: 'left' | 'right') => {
    const search = direction === 'left' ? sourceSearch() : targetSearch();
    if (!search) return items(direction);
    return items(direction).filter((item) => props.filterOption ? props.filterOption(search, item, direction) : `${item.title} ${item.description ?? ''}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  };
  const selected = (direction: 'left' | 'right') => direction === 'left' ? sourceKeys() : targetKeysSelected();
  const setSelected = (direction: 'left' | 'right', keys: string[]) => {
    if (!props.selectedKeys) {
      if (direction === 'left') { currentSourceSelected = keys; setSourceSelected(keys); }
      else { currentTargetSelected = keys; setTargetSelected(keys); }
    }
    props.onSelectChange?.(direction === 'left' ? keys : [...sourceKeys()], direction === 'right' ? keys : [...targetKeysSelected()]);
  };
  const toggle = (direction: 'left' | 'right', key: string) => {
    const keys = selected(direction);
    setSelected(direction, keys.includes(key) ? keys.filter((item) => item !== key) : [...keys, key]);
  };
  const move = (direction: 'left' | 'right') => {
    const moveKeys = (direction === 'right' ? sourceKeys() : targetKeysSelected()).filter((key) => !props.dataSource.find((item) => item.key === key)?.disabled);
    const next = direction === 'right' ? [...targets(), ...moveKeys] : targets().filter((key) => !moveKeys.includes(key));
    if (props.targetKeys === undefined) { if (field) field.setValue(next); else setInternalTarget(next); }
    if (direction === 'right') { currentSourceSelected = []; setSourceSelected([]); }
    else { currentTargetSelected = []; setTargetSelected([]); }
    props.onChange?.([...next], direction, [...moveKeys]);
  };
  const renderItem = (item: RecordType) => {
    const rendered = props.render?.(item);
    return rendered && typeof rendered === 'object' && !('nodeType' in rendered) && 'label' in rendered ? rendered.label : rendered ?? item.title;
  };
  const listStyle = (direction: 'left' | 'right') => typeof props.listStyle === 'function' ? props.listStyle({ direction }) : props.listStyle;
  const list = (direction: 'left' | 'right') => {
    const listItems = () => filtered(direction);
    const side = direction === 'left' ? 'source' : 'target';
    const sideKey = (name: 'section' | 'header' | 'title' | 'body' | 'list' | 'item' | 'itemIcon' | 'itemContent' | 'footer') => `${side}.${name}` as TransferSemanticName;
    const slotClass = (name: 'section' | 'header' | 'title' | 'body' | 'list' | 'item' | 'itemIcon' | 'itemContent' | 'footer') => [props.classNames?.[name], props.classNames?.[sideKey(name)]];
    const slotStyle = (name: 'section' | 'header' | 'title' | 'body' | 'list' | 'item' | 'itemIcon' | 'itemContent' | 'footer') => ({ ...props.styles?.[name], ...props.styles?.[sideKey(name)] });
    const selectableKeys = () => listItems().filter((item) => !item.disabled).map((item) => item.key);
    const allSelected = () => selectableKeys().length > 0 && selectableKeys().every((key) => selected(direction).includes(key));
    return (
      <div class={['flex h-72 min-w-0 flex-1 flex-col overflow-hidden rounded-surface border border-border-secondary bg-surface max-sm:w-full', ...slotClass('section')]} style={{ ...listStyle(direction), ...slotStyle('section') }}>
        <div class={['flex h-10 items-center gap-2 border-b border-border-secondary px-3', ...slotClass('header')]} style={slotStyle('header')}>
          <input type="checkbox" aria-label={`Select all ${direction} items`} aria-checked={!allSelected() && selectableKeys().some((key) => selected(direction).includes(key)) ? 'mixed' : undefined} checked={allSelected()} class="size-4 accent-primary" onChange={() => setSelected(direction, allSelected() ? [] : selectableKeys())} />
          <span class={['min-w-0 flex-1 truncate font-semibold', ...slotClass('title')]} style={slotStyle('title')}>{props.titles?.[direction === 'left' ? 0 : 1] ?? config.locale().Transfer?.titles?.[direction === 'left' ? 0 : 1] ?? (direction === 'left' ? 'Source' : 'Target')}</span>
          <span class="text-xs text-text-secondary">{selected(direction).length}/{items(direction).length}</span>
        </div>
        <div class={['flex min-h-0 flex-1 flex-col', ...slotClass('body')]} style={slotStyle('body')}>
        <Show when={props.showSearch}><input aria-label={`Search ${direction} list`} placeholder={config.locale().Transfer?.searchPlaceholder} class="m-2 h-8 rounded-control border border-border px-2 text-sm outline-none focus:border-primary" value={direction === 'left' ? sourceSearch() : targetSearch()} onInput={(event) => { const value = event.currentTarget.value; if (direction === 'left') setSourceSearch(value); else setTargetSearch(value); props.onSearch?.(direction, value); }} /></Show>
        <div role="list" class={['min-h-0 flex-1 overflow-y-auto p-1', ...slotClass('list')]} style={slotStyle('list')}>
          <For each={listItems()}>{(item) => <div role="listitem" aria-label={item.title} aria-disabled={disabled() || item.disabled ? 'true' : undefined} tabindex={disabled() || item.disabled ? -1 : 0} class={['flex min-h-8 w-full cursor-pointer items-center gap-2 rounded-small px-2 text-left text-sm hover:bg-surface-container', disabled() || item.disabled ? 'cursor-not-allowed text-text-disabled' : '', ...slotClass('item')]} style={slotStyle('item')} onClick={() => { if (!disabled() && !item.disabled) toggle(direction, item.key); }} onKeyDown={(event) => { if ((event.key === 'Enter' || event.key === ' ') && !disabled() && !item.disabled) { event.preventDefault(); toggle(direction, item.key); } }}><input type="checkbox" aria-label={`Select ${item.title}`} checked={selected(direction).includes(item.key)} disabled={disabled() || item.disabled} class={['size-4 accent-primary', ...slotClass('itemIcon')]} style={slotStyle('itemIcon')} onClick={(event) => event.stopPropagation()} onChange={() => toggle(direction, item.key)} /><span class={['min-w-0 flex-1 truncate', ...slotClass('itemContent')]} style={slotStyle('itemContent')}>{renderItem(item)}</span></div>}</For>
          <Show when={listItems().length === 0}><div class="p-4 text-center text-text-disabled">{config.locale().Empty?.description ?? 'No data'}</div></Show>
        </div>
        </div>
        <Show when={props.footer}><div class={['border-t border-border-secondary p-2', ...slotClass('footer')]} style={slotStyle('footer')}>{props.footer?.({ direction })}</div></Show>
      </div>
    );
  };
  return (
    <div {...others} id={field?.id} class={['ads-transfer flex min-w-0 items-center gap-3 max-sm:flex-col', props.class, props.classNames?.root]} style={{ ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}>
      {list('left')}
      <div class={['flex shrink-0 flex-col gap-2 max-sm:flex-row', props.classNames?.actions]} style={props.styles?.actions}><button type="button" aria-label="Move right" disabled={disabled() || sourceKeys().length === 0} class="h-8 min-w-8 rounded-control bg-primary px-2 text-white disabled:bg-border disabled:text-text-disabled" onClick={() => move('right')}>{props.operations[0]}</button><Show when={!props.oneWay}><button type="button" aria-label="Move left" disabled={disabled() || targetKeysSelected().length === 0} class="h-8 min-w-8 rounded-control border border-border bg-surface px-2 disabled:text-text-disabled" onClick={() => move('left')}>{props.operations[1]}</button></Show></div>
      {list('right')}
    </div>
  );
}
