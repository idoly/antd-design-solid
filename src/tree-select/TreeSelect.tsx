import { createContext, createSignal, For, merge, omit, onCleanup, Show, useContext } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { CloseIcon, DownIcon } from '../_internal/icons';
import { Popover } from '../popover';
import { Tree, type TreeDataNode, type TreeKey } from '../tree';
import { useFormItemControl } from '../form/context';
import { useConfig } from '../config-provider';
import type { LabeledValue } from '../select';

export type { LabeledValue } from '../select';

export const SHOW_ALL = 'SHOW_ALL' as const;
export const SHOW_PARENT = 'SHOW_PARENT' as const;
export const SHOW_CHILD = 'SHOW_CHILD' as const;
export type ShowCheckedStrategy = typeof SHOW_ALL | typeof SHOW_PARENT | typeof SHOW_CHILD;

interface TreeSelectRegistryValue { register: (node: TreeDataNode) => () => void }
const TreeSelectRegistry = createContext<TreeSelectRegistryValue | null>(null);
export interface TreeSelectNodeProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title'> { nodeKey?: TreeKey; key?: TreeKey; value?: TreeKey; title?: JSX.Element; disabled?: boolean; disableCheckbox?: boolean; selectable?: boolean; isLeaf?: boolean; children?: JSX.Element }
export function TreeSelectNodeComponent(props: TreeSelectNodeProps) {
  const parent = useContext(TreeSelectRegistry); const children: TreeDataNode[] = [];
  const registry: TreeSelectRegistryValue = { register(node) { children.push(node); return () => { const index = children.indexOf(node); if (index >= 0) children.splice(index, 1); }; } };
  let unregister: (() => void) | undefined; let cancelled = false;
  queueMicrotask(() => queueMicrotask(() => { if (!cancelled) { const key = props.value ?? props.nodeKey ?? props.key ?? ''; unregister = parent?.register({ key, title: props.title ?? key, disabled: props.disabled, disableCheckbox: props.disableCheckbox, selectable: props.selectable, isLeaf: props.isLeaf, class: props.class as string | undefined, children }); } }));
  onCleanup(() => { cancelled = true; unregister?.(); });
  return <TreeSelectRegistry value={registry}>{props.children}</TreeSelectRegistry>;
}

export interface TreeSelectFieldNames { label?: string; value?: string; children?: string }
export type TreeDataSimpleMode = boolean | { id?: string; pId?: string; rootPId?: TreeKey | null };

export type TreeSelectSemanticName = 'root' | 'panel' | 'tree' | 'tag' | 'input';
export type TreeSelectSemanticClassNames = Partial<Record<TreeSelectSemanticName, string>> | ((info: { props: TreeSelectProps }) => Partial<Record<TreeSelectSemanticName, string>>);
export type TreeSelectSemanticStyles = Partial<Record<TreeSelectSemanticName, JSX.CSSProperties>> | ((info: { props: TreeSelectProps }) => Partial<Record<TreeSelectSemanticName, JSX.CSSProperties>>);

export interface TreeSelectProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSelect' | 'onLoad' | 'prefix'> {
  treeData?: readonly Record<string, any>[];
  fieldNames?: TreeSelectFieldNames;
  treeDataSimpleMode?: TreeDataSimpleMode;
  children?: JSX.Element;
  value?: TreeKey | readonly TreeKey[] | LabeledValue | readonly LabeledValue[] | null;
  defaultValue?: TreeKey | readonly TreeKey[] | null;
  multiple?: boolean;
  treeCheckable?: boolean;
  treeCheckStrictly?: boolean;
  treeDefaultExpandAll?: boolean;
  treeDefaultExpandedKeys?: readonly TreeKey[];
  treeExpandedKeys?: readonly TreeKey[];
  treeExpandAction?: 'click' | 'doubleClick' | false;
  treeLine?: boolean;
  treeIcon?: boolean;
  switcherIcon?: JSX.Element | ((info: { expanded: boolean; loading: boolean; node: TreeDataNode }) => JSX.Element);
  showCheckedStrategy?: ShowCheckedStrategy;
  labelInValue?: boolean;
  allowClear?: boolean;
  autoClearSearchValue?: boolean;
  maxCount?: number;
  maxTagCount?: number;
  maxTagTextLength?: number;
  maxTagPlaceholder?: JSX.Element | ((omitted: TreeDataNode[]) => JSX.Element);
  tagRender?: (info: { label: JSX.Element; value: TreeKey; closable: boolean; onClose: () => void; node: TreeDataNode }) => JSX.Element;
  showSearch?: boolean;
  searchValue?: string;
  defaultOpen?: boolean;
  open?: boolean;
  disabled?: boolean;
  placeholder?: JSX.Element;
  notFoundContent?: JSX.Element;
  prefix?: JSX.Element;
  suffixIcon?: JSX.Element;
  showArrow?: boolean;
  bordered?: boolean;
  variant?: 'outlined' | 'borderless' | 'filled' | 'underlined';
  size?: 'small' | 'middle' | 'large';
  status?: 'error' | 'warning';
  filterTreeNode?: boolean | ((input: string, node: TreeDataNode) => boolean);
  treeNodeFilterProp?: string;
  treeNodeLabelProp?: string;
  treeTitleRender?: (node: TreeDataNode) => JSX.Element;
  loadData?: (node: TreeDataNode) => Promise<void>;
  treeLoadedKeys?: readonly TreeKey[];
  listHeight?: number;
  virtual?: boolean;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
  getPopupContainer?: (trigger: HTMLElement) => HTMLElement;
  popupClassName?: string;
  dropdownClassName?: string;
  popupStyle?: JSX.CSSProperties;
  dropdownStyle?: JSX.CSSProperties;
  popupMatchSelectWidth?: boolean | number;
  dropdownMatchSelectWidth?: boolean | number;
  popupRender?: (menu: JSX.Element) => JSX.Element;
  dropdownRender?: (menu: JSX.Element) => JSX.Element;
  classNames?: TreeSelectSemanticClassNames;
  styles?: TreeSelectSemanticStyles;
  onChange?: (value: TreeKey | TreeKey[] | LabeledValue | LabeledValue[] | undefined, label: JSX.Element | JSX.Element[] | undefined) => void;
  onSelect?: (value: TreeKey, node: TreeDataNode) => void;
  onSearch?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  onTreeExpand?: (expandedKeys: TreeKey[]) => void;
  onLoad?: (loadedKeys: TreeKey[], info: { node: TreeDataNode }) => void;
  onClear?: () => void;
  onDropdownVisibleChange?: (open: boolean) => void;
  onPopupScroll?: JSX.EventHandler<HTMLDivElement, Event>;
}

const flatten = (nodes: readonly TreeDataNode[]): TreeDataNode[] => nodes.flatMap((node) => [node, ...flatten(node.children ?? [])]);

export function TreeSelect(inputProps: TreeSelectProps) {
  const config = useConfig();
  const props = merge({ treeData: [] as readonly Record<string, any>[], treeExpandAction: 'click' as const, defaultValue: null, allowClear: false, autoClearSearchValue: true, showArrow: true, showSearch: false, defaultOpen: false, listHeight: 256, filterTreeNode: true as boolean | ((input: string, node: TreeDataNode) => boolean) }, config.componentDefaults('treeSelect') as Partial<TreeSelectProps>, inputProps);
  const field = useFormItemControl();
  const [registeredNodes, setRegisteredNodes] = createSignal<readonly TreeDataNode[]>([], { ownedWrite: true });
  let currentRegistered: readonly TreeDataNode[] = [];
  const normalizeTreeData = (items: readonly Record<string, any>[]): TreeDataNode[] => {
    const names = { label: 'title', value: 'value', children: 'children', ...props.fieldNames };
    if (props.treeDataSimpleMode) {
      const simple = typeof props.treeDataSimpleMode === 'object' ? props.treeDataSimpleMode : {};
      const idField = simple.id ?? 'id';
      const parentField = simple.pId ?? 'pId';
      const mapped = items.map((item) => ({ ...item, key: item[names.value] ?? item[idField], title: item[names.label] ?? item.title ?? item[idField], children: [] as TreeDataNode[], __parent: item[parentField] }));
      const byKey = new Map(mapped.map((item) => [item.key, item]));
      const roots: TreeDataNode[] = [];
      mapped.forEach((item) => { const parent = byKey.get(item.__parent); if (parent && item.__parent !== simple.rootPId) parent.children.push(item); else roots.push(item); });
      return roots;
    }
    return items.map((item) => ({ ...item, key: item[names.value] ?? item.key, title: item[names.label] ?? item.title, children: Array.isArray(item[names.children]) ? normalizeTreeData(item[names.children]) : item.children } as TreeDataNode));
  };
  const treeData = () => props.treeData?.length ? normalizeTreeData(props.treeData) : (registeredNodes(), [...currentRegistered]);
  const [internalValue, setInternalValue] = createSignal<TreeKey | readonly TreeKey[] | null>(props.defaultValue, { ownedWrite: true });
  const [internalOpen, setInternalOpen] = createSignal(Boolean(props.defaultOpen), { ownedWrite: true });
  const [internalSearch, setInternalSearch] = createSignal('');
  const others = omit(props, 'treeData', 'fieldNames', 'treeDataSimpleMode', 'children', 'value', 'defaultValue', 'multiple', 'treeCheckable', 'treeCheckStrictly', 'treeDefaultExpandAll', 'treeDefaultExpandedKeys', 'treeExpandedKeys', 'treeExpandAction', 'treeLine', 'treeIcon', 'switcherIcon', 'showCheckedStrategy', 'labelInValue', 'allowClear', 'autoClearSearchValue', 'maxCount', 'maxTagCount', 'maxTagTextLength', 'maxTagPlaceholder', 'tagRender', 'showSearch', 'searchValue', 'defaultOpen', 'open', 'disabled', 'placeholder', 'notFoundContent', 'prefix', 'suffixIcon', 'showArrow', 'bordered', 'variant', 'size', 'status', 'filterTreeNode', 'treeNodeFilterProp', 'treeNodeLabelProp', 'treeTitleRender', 'loadData', 'treeLoadedKeys', 'listHeight', 'virtual', 'placement', 'getPopupContainer', 'popupClassName', 'dropdownClassName', 'popupStyle', 'dropdownStyle', 'popupMatchSelectWidth', 'dropdownMatchSelectWidth', 'popupRender', 'dropdownRender', 'classNames', 'styles', 'onChange', 'onSelect', 'onSearch', 'onOpenChange', 'onTreeExpand', 'onLoad', 'onClear', 'onDropdownVisibleChange', 'onPopupScroll', 'class', 'style');
  const rawValue = () => props.value ?? (field?.value() !== undefined ? field.value() as TreeSelectProps['value'] : internalValue());
  const keys = (): TreeKey[] => {
    const value = rawValue();
    if (value === null || value === undefined) return [];
    const list = Array.isArray(value) ? value : [value];
    return list.map((item) => typeof item === 'object' ? (item as LabeledValue).value : item as TreeKey);
  };
  const nodes = () => flatten(treeData());
  const selectedNodes = () => keys().map((key) => nodes().find((node) => node.key === key)).filter((node): node is TreeDataNode => Boolean(node));
  const open = () => props.open ?? internalOpen();
  const search = () => props.searchValue ?? internalSearch();
  const disabled = () => props.disabled ?? field?.disabled() ?? false;
  const setOpen = (next: boolean) => { if (disabled()) return; if (props.open === undefined) setInternalOpen(next); props.onOpenChange?.(next); props.onDropdownVisibleChange?.(next); };
  const strategyKeys = (nextKeys: TreeKey[]) => {
    if (!props.treeCheckable || props.showCheckedStrategy === SHOW_ALL) return nextKeys;
    if ((props.showCheckedStrategy ?? SHOW_CHILD) === SHOW_CHILD) return nextKeys.filter((key) => !(nodes().find((node) => node.key === key)?.children?.length));
    const parentByKey = new Map<TreeKey, TreeKey>();
    const visit = (items: readonly TreeDataNode[], parent?: TreeKey) => items.forEach((node) => { if (parent !== undefined) parentByKey.set(node.key, parent); visit(node.children ?? [], node.key); });
    visit(treeData());
    return nextKeys.filter((key) => { let parent = parentByKey.get(key); while (parent !== undefined) { if (nextKeys.includes(parent)) return false; parent = parentByKey.get(parent); } return true; });
  };
  const output = (requestedKeys: TreeKey[]) => {
    let nextKeys = strategyKeys(requestedKeys);
    if (props.maxCount !== undefined) nextKeys = nextKeys.slice(0, props.maxCount);
    const nextNodes = nextKeys.map((key) => nodes().find((node) => node.key === key)).filter((node): node is TreeDataNode => Boolean(node));
    const multiple = props.multiple || props.treeCheckable;
    const value = props.labelInValue
      ? (multiple ? nextNodes.map((node) => ({ value: node.key, label: node.title })) : nextNodes[0] ? { value: nextNodes[0].key, label: nextNodes[0].title } : undefined)
      : (multiple ? nextKeys : nextKeys[0]);
    if (props.value === undefined) { if (field) field.setValue(value); else setInternalValue(multiple ? nextKeys : nextKeys[0] ?? null); }
    props.onChange?.(value, multiple ? nextNodes.map((node) => node.title) : nextNodes[0]?.title);
  };
  const filterNodes = (items: readonly TreeDataNode[]): TreeDataNode[] => {
    if (!search() || props.filterTreeNode === false) return [...items];
    const filter = props.filterTreeNode;
    return items.flatMap((node) => {
      const children = filterNodes(node.children ?? []);
      const filterValue = props.treeNodeFilterProp ? (node as Record<string, any>)[props.treeNodeFilterProp] : node.title;
      const matches = typeof filter === 'function' ? filter(search(), node) : String(filterValue ?? '').toLocaleLowerCase().includes(search().toLocaleLowerCase());
      return matches || children.length ? [{ ...node, children }] : [];
    });
  };
  const renderedTreeData = () => {
    const render = (items: readonly TreeDataNode[]): TreeDataNode[] => items.map((node) => ({ ...node, title: props.treeTitleRender?.(node) ?? node.title, children: node.children ? render(node.children) : undefined }));
    return render(filterNodes(treeData()));
  };
  const nodeLabel = (node: TreeDataNode) => props.treeNodeLabelProp ? (node as Record<string, any>)[props.treeNodeLabelProp] ?? node.title : node.title;
  const visibleNodes = () => selectedNodes().slice(0, props.maxTagCount ?? selectedNodes().length);
  const omittedNodes = () => selectedNodes().slice(visibleNodes().length);
  const tagLabel = (node: TreeDataNode) => typeof nodeLabel(node) === 'string' && props.maxTagTextLength !== undefined ? String(nodeLabel(node)).slice(0, props.maxTagTextLength) : nodeLabel(node);
  const semanticClasses = () => typeof props.classNames === 'function' ? props.classNames({ props }) : props.classNames ?? {};
  const semanticStyles = () => typeof props.styles === 'function' ? props.styles({ props }) : props.styles ?? {};
  const panel = () => (
    <div class={['min-w-64 overflow-y-auto p-2', semanticClasses().panel, props.popupClassName, props.dropdownClassName]} style={{ 'max-height': `${props.listHeight}px`, width: typeof props.popupStyle?.width === 'number' ? `${props.popupStyle.width}px` : props.popupStyle?.width, ...semanticStyles().panel, ...props.dropdownStyle, ...props.popupStyle }} onScroll={props.onPopupScroll}>
      <Show when={renderedTreeData().length > 0} fallback={<div class="p-3 text-center text-text-disabled">{props.notFoundContent ?? config.renderEmpty()?.('TreeSelect') ?? config.locale().Empty?.description ?? 'No data'}</div>}>
        <Tree
          class={semanticClasses().tree}
          style={semanticStyles().tree}
          treeData={renderedTreeData()}
          height={props.listHeight}
          virtual={props.virtual ?? config.virtual()}
          multiple={props.multiple}
          checkable={props.treeCheckable}
          checkStrictly={props.treeCheckStrictly}
          selectedKeys={props.treeCheckable ? [] : keys()}
          checkedKeys={props.treeCheckable ? keys() : []}
          defaultExpandAll={props.treeDefaultExpandAll || Boolean(search())}
          defaultExpandedKeys={props.treeDefaultExpandedKeys}
          expandedKeys={props.treeExpandedKeys}
          expandAction={props.treeExpandAction}
          showLine={props.treeLine}
          showIcon={props.treeIcon}
          switcherIcon={props.switcherIcon}
          loadData={props.loadData}
          loadedKeys={props.treeLoadedKeys}
          onLoad={(loaded, info) => props.onLoad?.(loaded, { node: info.node })}
          onExpand={(expanded) => props.onTreeExpand?.(expanded)}
          onSelect={(next, info) => { output(next); props.onSelect?.(info.node.key, info.node); if (props.autoClearSearchValue && props.searchValue === undefined) setInternalSearch(''); if (!props.multiple) setOpen(false); }}
          onCheck={(next) => output(Array.isArray(next) ? next : next.checked)}
        />
      </Show>
    </div>
  );
  const clear = () => { output([]); props.onClear?.(); };
  const placement = () => ({ bottomLeft: 'bottom-start', bottomRight: 'bottom-end', topLeft: 'top-start', topRight: 'top-end' } as const)[props.placement ?? 'bottomLeft'];
  const sizeClass = () => (props.size ?? config.componentSize()) === 'large' ? 'min-h-10 text-base' : (props.size ?? config.componentSize()) === 'small' ? 'min-h-6' : 'min-h-8';
  const variantClass = () => props.bordered === false || props.variant === 'borderless' ? 'border-transparent' : props.variant === 'filled' ? 'border-transparent bg-surface-container' : props.variant === 'underlined' ? 'rounded-none border-x-0 border-t-0' : 'border-border';

  const registry: TreeSelectRegistryValue = { register(node) { currentRegistered = [...currentRegistered, node]; setRegisteredNodes(currentRegistered); return () => { currentRegistered = currentRegistered.filter((entry) => entry !== node); setRegisteredNodes(currentRegistered); }; } };
  return (
    <>
    <TreeSelectRegistry value={registry}><div hidden>{props.children}</div></TreeSelectRegistry>
    <Popover open={open()} trigger={[]} placement={placement()} getPopupContainer={props.getPopupContainer} matchTriggerWidth={props.popupMatchSelectWidth ?? props.dropdownMatchSelectWidth} content={(props.popupRender ?? props.dropdownRender)?.(panel()) ?? panel()} onOpenChange={setOpen}>
      <div {...others} id={field?.id} role="combobox" aria-expanded={open() ? 'true' : 'false'} aria-haspopup="tree" class={['ads-tree-select flex w-full items-center gap-1 rounded-control border bg-surface px-2 text-sm text-text hover:border-primary', sizeClass(), variantClass(), props.status === 'error' ? 'border-error' : props.status === 'warning' ? 'border-warning' : '', disabled() ? 'cursor-not-allowed bg-surface-container text-text-disabled' : '', semanticClasses().root, props.class]} style={{ ...semanticStyles().root, ...(props.style && typeof props.style === 'object' ? props.style as JSX.CSSProperties : {}) }} onClick={() => setOpen(true)}>
        <Show when={props.prefix}><span class="inline-flex shrink-0">{props.prefix}</span></Show>
        <Show when={(props.multiple || props.treeCheckable) && selectedNodes().length > 0}><For each={visibleNodes()}>{(node) => props.tagRender?.({ label: tagLabel(node), value: node.key, closable: true, onClose: () => output(keys().filter((key) => key !== node.key)), node }) ?? <span class={['inline-flex h-5 max-w-32 items-center rounded-small border border-border bg-surface-container px-1.5 text-xs', semanticClasses().tag]} style={semanticStyles().tag}><span class="truncate">{tagLabel(node)}</span><button type="button" aria-label={`Remove ${String(nodeLabel(node))}`} class="ml-1 bg-transparent" onClick={(event) => { event.stopPropagation(); output(keys().filter((key) => key !== node.key)); }}><CloseIcon /></button></span>}</For><Show when={omittedNodes().length > 0}><span class="text-xs text-text-secondary">{typeof props.maxTagPlaceholder === 'function' ? props.maxTagPlaceholder(omittedNodes()) : props.maxTagPlaceholder ?? `+${omittedNodes().length}`}</span></Show></Show>
        <Show when={!props.multiple && !props.treeCheckable && selectedNodes()[0]}>{(node) => <span class="min-w-0 flex-1 truncate">{nodeLabel(node())}</span>}</Show>
        <Show when={props.showSearch}><input aria-label={props['aria-label'] ?? 'Search tree'} value={search()} disabled={disabled()} class={['min-w-8 flex-1 bg-transparent outline-none', semanticClasses().input]} style={semanticStyles().input} onClick={(event) => event.stopPropagation()} onFocus={() => setOpen(true)} onInput={(event) => { if (props.searchValue === undefined) setInternalSearch(event.currentTarget.value); props.onSearch?.(event.currentTarget.value); }} /></Show>
        <Show when={selectedNodes().length === 0 && !search()}><span class="min-w-0 flex-1 truncate text-text-disabled">{props.placeholder ?? 'Please select'}</span></Show>
        <Show when={props.allowClear && keys().length > 0}><button type="button" aria-label="Clear selection" class="size-6 bg-transparent text-text-disabled" onClick={(event) => { event.stopPropagation(); clear(); }}><CloseIcon /></button></Show>
        <Show when={props.showArrow !== false}><span aria-hidden="true" class="ml-auto text-xs text-text-disabled">{props.suffixIcon ?? <DownIcon />}</span></Show>
      </div>
    </Popover>
    </>
  );
}
