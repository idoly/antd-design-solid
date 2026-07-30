import { createContext, createMemo, createSignal, For, merge, omit, onCleanup, Show, untrack, useContext } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { DownIcon, RightIcon } from '../_internal/icons';
import { createVirtualList } from '../_internal/virtual';
import type { VirtualItem } from '@tanstack/virtual-core';
import { useConfig } from '../config-provider';

export type TreeKey = string | number;

export interface TreeDataNode {
  [field: string]: unknown;
  key: TreeKey;
  title: JSX.Element;
  children?: readonly TreeDataNode[];
  disabled?: boolean;
  disableCheckbox?: boolean;
  selectable?: boolean;
  checkable?: boolean;
  isLeaf?: boolean;
  icon?: JSX.Element;
  class?: string;
}

export interface TreeEventInfo {
  node: TreeDataNode;
  nativeEvent: MouseEvent;
}

interface TreeRegistryValue { register: (node: TreeDataNode) => () => void }
const TreeRegistry = createContext<TreeRegistryValue | null>(null);
export interface TreeNodeProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title'> {
  nodeKey?: TreeKey; key?: TreeKey; title?: JSX.Element; disabled?: boolean; disableCheckbox?: boolean; selectable?: boolean; checkable?: boolean; isLeaf?: boolean; icon?: JSX.Element; children?: JSX.Element;
}
export function TreeNode(props: TreeNodeProps) {
  const parent = useContext(TreeRegistry); let children: TreeDataNode[] = [];
  const registry: TreeRegistryValue = { register(node) { children.push(node); return () => { const index = children.indexOf(node); if (index >= 0) children.splice(index, 1); }; } };
  let unregister: (() => void) | undefined; let cancelled = false;
  queueMicrotask(() => queueMicrotask(() => { if (!cancelled) unregister = parent?.register({ key: props.nodeKey ?? props.key ?? '', title: props.title ?? props.nodeKey ?? props.key ?? '', disabled: props.disabled, disableCheckbox: props.disableCheckbox, selectable: props.selectable, checkable: props.checkable, isLeaf: props.isLeaf, icon: props.icon, class: props.class as string | undefined, children }); }));
  onCleanup(() => { cancelled = true; unregister?.(); });
  return <TreeRegistry value={registry}>{props.children}</TreeRegistry>;
}

export type TreeSemanticName = 'root' | 'item' | 'itemIcon' | 'itemTitle' | 'itemSwitcher';
export type TreeSemanticClassNames = Partial<Record<TreeSemanticName, string>> | ((info: { props: TreeProps }) => Partial<Record<TreeSemanticName, string>>);
export type TreeSemanticStyles = Partial<Record<TreeSemanticName, JSX.CSSProperties>> | ((info: { props: TreeProps }) => Partial<Record<TreeSemanticName, JSX.CSSProperties>>);
export interface TreeFieldNames { title?: string; key?: string; children?: string }
export interface TreeDragInfo { event: DragEvent; node: TreeDataNode }

export interface TreeProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onSelect' | 'onDrop' | 'onLoad' | 'onDoubleClick' | 'onDragEnd' | 'onDragEnter' | 'onDragLeave' | 'onDragOver' | 'onDragStart' | 'onContextMenu' | 'draggable'> {
  treeData?: readonly TreeDataNode[] | readonly Record<string, unknown>[];
  children?: JSX.Element;
  checkable?: boolean;
  checkStrictly?: boolean;
  selectable?: boolean;
  multiple?: boolean;
  showLine?: boolean;
  showIcon?: boolean;
  switcherIcon?: JSX.Element | ((info: { expanded: boolean; loading: boolean; node: TreeDataNode }) => JSX.Element);
  switcherLoadingIcon?: JSX.Element;
  blockNode?: boolean;
  disabled?: boolean;
  draggable?: boolean | ((node: TreeDataNode) => boolean) | { icon?: JSX.Element | false; nodeDraggable?: (node: TreeDataNode) => boolean };
  allowDrop?: (info: { dropNode: TreeDataNode; dropPosition: -1 | 0 | 1 }) => boolean;
  fieldNames?: TreeFieldNames;
  filterTreeNode?: (node: TreeDataNode) => boolean;
  titleRender?: (node: TreeDataNode) => JSX.Element;
  classNames?: TreeSemanticClassNames;
  styles?: TreeSemanticStyles;
  rootStyle?: JSX.CSSProperties;
  height?: number;
  virtual?: boolean;
  autoExpandParent?: boolean;
  defaultExpandParent?: boolean;
  motion?: false | { motionName?: string; motionAppear?: boolean };
  defaultExpandAll?: boolean;
  expandAction?: 'click' | 'doubleClick' | false;
  expandedKeys?: readonly TreeKey[];
  defaultExpandedKeys?: readonly TreeKey[];
  selectedKeys?: readonly TreeKey[];
  defaultSelectedKeys?: readonly TreeKey[];
  checkedKeys?: readonly TreeKey[] | { checked: readonly TreeKey[]; halfChecked: readonly TreeKey[] };
  defaultCheckedKeys?: readonly TreeKey[];
  loadData?: (node: TreeDataNode) => Promise<void>;
  loadedKeys?: readonly TreeKey[];
  onExpand?: (expandedKeys: TreeKey[], info: TreeEventInfo & { expanded: boolean }) => void;
  onLoad?: (loadedKeys: TreeKey[], info: TreeEventInfo) => void;
  onSelect?: (selectedKeys: TreeKey[], info: TreeEventInfo & { selected: boolean; selectedNodes: TreeDataNode[] }) => void;
  onCheck?: (checkedKeys: TreeKey[] | { checked: TreeKey[]; halfChecked: TreeKey[] }, info: TreeEventInfo & { checked: boolean; checkedNodes: TreeDataNode[] }) => void;
  onDoubleClick?: (event: MouseEvent, node: TreeDataNode) => void;
  onRightClick?: (info: { event: MouseEvent; node: TreeDataNode }) => void;
  onDragStart?: (info: TreeDragInfo) => void;
  onDragEnter?: (info: TreeDragInfo & { expandedKeys: TreeKey[] }) => void;
  onDragLeave?: (info: TreeDragInfo) => void;
  onDragOver?: (info: TreeDragInfo) => void;
  onDragEnd?: (info: TreeDragInfo) => void;
  onDrop?: (info: TreeDragInfo & { dragNode: TreeDataNode; dragNodesKeys: TreeKey[]; dropPosition: -1 | 0 | 1; dropToGap: boolean }) => void;
}

const flattenNodes = (nodes: readonly TreeDataNode[]): TreeDataNode[] => nodes.flatMap((node) => [node, ...flattenNodes(node.children ?? [])]);
const descendantKeys = (node: TreeDataNode): TreeKey[] => [node.key, ...(node.children ?? []).flatMap(descendantKeys)];

export function moveTreeNode(nodes: readonly TreeDataNode[], dragKey: TreeKey, dropKey: TreeKey, position: -1 | 0 | 1): TreeDataNode[] {
  let dragged: TreeDataNode | undefined;
  const remove = (items: readonly TreeDataNode[]): TreeDataNode[] => items.flatMap((node) => {
    if (node.key === dragKey) { dragged = node; return []; }
    return [{ ...node, children: node.children ? remove(node.children) : undefined }];
  });
  const remaining = remove(nodes);
  if (!dragged || descendantKeys(dragged).includes(dropKey)) return [...nodes];
  const insert = (items: readonly TreeDataNode[]): TreeDataNode[] => {
    const result: TreeDataNode[] = [];
    items.forEach((node) => {
      if (node.key === dropKey && position === -1) result.push(dragged!);
      if (node.key === dropKey && position === 0) result.push({ ...node, children: [...(node.children ?? []), dragged!] });
      else result.push({ ...node, children: node.children ? insert(node.children) : undefined });
      if (node.key === dropKey && position === 1) result.push(dragged!);
    });
    return result;
  };
  return insert(remaining);
}

const normalizeNodes = (nodes: readonly Record<string, unknown>[], fieldNames: Required<TreeFieldNames>): TreeDataNode[] => nodes.map((raw, index) => {
  const children = raw[fieldNames.children];
  const key = raw[fieldNames.key];
  return {
    ...raw,
    key: typeof key === 'string' || typeof key === 'number' ? key : index,
    title: raw[fieldNames.title] as JSX.Element ?? String(key ?? index),
    children: Array.isArray(children) ? normalizeNodes(children as Record<string, unknown>[], fieldNames) : undefined,
  } as TreeDataNode;
});

export function Tree(inputProps: TreeProps) {
  const config = useConfig();
  const props = merge({ treeData: [] as readonly TreeDataNode[], selectable: true, multiple: false, defaultExpandAll: false, defaultExpandParent: true, expandAction: 'doubleClick' as const }, config.componentDefaults('tree') as Partial<TreeProps>, inputProps);
  const [registeredNodes, setRegisteredNodes] = createSignal<readonly TreeDataNode[]>([], { ownedWrite: true });
  let currentRegistered: readonly TreeDataNode[] = [];
  const fieldNames = (): Required<TreeFieldNames> => ({ title: props.fieldNames?.title ?? 'title', key: props.fieldNames?.key ?? 'key', children: props.fieldNames?.children ?? 'children' });
  const treeData = createMemo<readonly TreeDataNode[]>(() => props.treeData?.length ? normalizeNodes(props.treeData as readonly Record<string, unknown>[], fieldNames()) : (registeredNodes(), currentRegistered));
  const allNodes = createMemo(() => flattenNodes(treeData()));
  const parentKeys = createMemo(() => { const result = new Map<TreeKey, TreeKey>(); const visit = (nodes: readonly TreeDataNode[], parent?: TreeKey) => nodes.forEach((node) => { if (parent !== undefined) result.set(node.key, parent); visit(node.children ?? [], node.key); }); visit(treeData()); return result; });
  const withAncestors = (keys: readonly TreeKey[]) => { const result = new Set(keys); const parents = parentKeys(); keys.forEach((key) => { let parent = parents.get(key); while (parent !== undefined) { result.add(parent); parent = parents.get(parent); } }); return [...result]; };
  const initial = untrack(() => {
    const expanded = props.defaultExpandAll ? allNodes().filter((node) => node.children?.length).map((node) => node.key) : props.defaultExpandedKeys ?? [];
    return {
      expanded: props.defaultExpandParent ? withAncestors(expanded) : expanded,
      selected: props.defaultSelectedKeys ?? [],
      checked: props.defaultCheckedKeys ?? [],
    };
  });
  const [internalExpanded, setInternalExpanded] = createSignal<readonly TreeKey[]>(initial.expanded, { ownedWrite: true });
  const [internalSelected, setInternalSelected] = createSignal<readonly TreeKey[]>(initial.selected, { ownedWrite: true });
  const [internalChecked, setInternalChecked] = createSignal<readonly TreeKey[]>(initial.checked, { ownedWrite: true });
  const [loadingKeys, setLoadingKeys] = createSignal<readonly TreeKey[]>([], { ownedWrite: true });
  const [internalLoadedKeys, setInternalLoadedKeys] = createSignal<readonly TreeKey[]>([], { ownedWrite: true });
  let dragged: TreeDataNode | undefined;
  let rootRef: HTMLDivElement | undefined;
  const others = omit(props, 'treeData', 'children', 'checkable', 'checkStrictly', 'selectable', 'multiple', 'showLine', 'showIcon', 'switcherIcon', 'switcherLoadingIcon', 'blockNode', 'disabled', 'draggable', 'allowDrop', 'fieldNames', 'filterTreeNode', 'titleRender', 'classNames', 'styles', 'rootStyle', 'height', 'virtual', 'autoExpandParent', 'defaultExpandParent', 'motion', 'defaultExpandAll', 'expandAction', 'expandedKeys', 'defaultExpandedKeys', 'selectedKeys', 'defaultSelectedKeys', 'checkedKeys', 'defaultCheckedKeys', 'loadData', 'loadedKeys', 'onExpand', 'onLoad', 'onSelect', 'onCheck', 'onDoubleClick', 'onRightClick', 'onDragStart', 'onDragEnter', 'onDragLeave', 'onDragOver', 'onDragEnd', 'onDrop', 'class', 'style');
  const semanticClasses = () => typeof props.classNames === 'function' ? props.classNames({ props }) : props.classNames ?? {};
  const semanticStyles = () => typeof props.styles === 'function' ? props.styles({ props }) : props.styles ?? {};
  const expanded = () => props.expandedKeys ?? internalExpanded();
  const effectiveExpanded = createMemo(() => props.autoExpandParent ? withAncestors(expanded()) : expanded());
  const visibleRows = createMemo(() => {
    const rows: Array<{ node: TreeDataNode; level: number }> = [];
    const visit = (nodes: readonly TreeDataNode[], level: number) => nodes.forEach((node) => { rows.push({ node, level }); if (effectiveExpanded().includes(node.key)) visit(node.children ?? [], level + 1); });
    visit(treeData(), 1);
    return rows;
  });
  const virtualEnabled = () => Boolean(props.virtual !== false && props.height && visibleRows().length > 40);
  const virtual = createVirtualList({ count: () => visibleRows().length, getScrollElement: () => rootRef ?? null, estimateSize: () => 28, viewportSize: () => props.height ?? 256, enabled: virtualEnabled, overscan: 8, getItemKey: (index) => visibleRows()[index]?.node.key ?? index });
  const rowCache = new Map<TreeKey, { node: TreeDataNode; level: number; index: number; virtual: VirtualItem | undefined }>();
  const cachedRow = (node: TreeDataNode, level: number, index: number, item?: VirtualItem) => {
    const current = rowCache.get(node.key) ?? { node, level, index, virtual: item };
    Object.assign(current, { node, level, index, virtual: item });
    rowCache.set(node.key, current);
    return current;
  };
  const renderedRows = () => virtualEnabled() ? virtual.items().map((item) => { const row = visibleRows()[item.index]; return cachedRow(row.node, row.level, item.index, item); }) : visibleRows().map((row, index) => cachedRow(row.node, row.level, index));
  const virtualPaddingTop = () => virtualEnabled() ? (virtual.items()[0]?.start ?? 0) : 0;
  const virtualPaddingBottom = () => virtualEnabled() ? Math.max(0, virtual.totalSize() - (virtual.items().at(-1)?.end ?? 0)) : 0;
  const loaded = () => props.loadedKeys ?? internalLoadedKeys();
  const selected = () => props.selectedKeys ?? internalSelected();
  const checked = (): readonly TreeKey[] => {
    const controlled = props.checkedKeys;
    if (Array.isArray(controlled)) return controlled as readonly TreeKey[];
    return (controlled as { checked: readonly TreeKey[] } | undefined)?.checked ?? internalChecked();
  };
  const disabled = (node: TreeDataNode) => props.disabled || node.disabled;
  const nodeDraggable = (node: TreeDataNode) => !disabled(node) && (typeof props.draggable === 'function' ? props.draggable(node) : typeof props.draggable === 'object' ? props.draggable.nodeDraggable?.(node) ?? true : Boolean(props.draggable));
  const nodeByKey = (key: TreeKey) => allNodes().find((node) => node.key === key);
  const dropPosition = (event: DragEvent): -1 | 0 | 1 => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    if (rect.height <= 0) return 0;
    const ratio = (event.clientY - rect.top) / rect.height;
    return ratio < 0.25 ? -1 : ratio > 0.75 ? 1 : 0;
  };
  const halfChecked = () => {
    const controlled = props.checkedKeys;
    if (controlled && !Array.isArray(controlled)) return [...(controlled as { halfChecked: readonly TreeKey[] }).halfChecked];
    const result: TreeKey[] = [];
    const visit = (node: TreeDataNode): boolean => {
      const childStates = (node.children ?? []).map(visit);
      const own = checked().includes(node.key);
      if (!own && childStates.some(Boolean)) result.push(node.key);
      return own || childStates.some(Boolean);
    };
    treeData().forEach(visit);
    return result;
  };
  const toggleExpand = async (node: TreeDataNode, event: MouseEvent) => {
    if (disabled(node) || node.isLeaf) return;
    const isExpanded = expanded().includes(node.key);
    if (!isExpanded && props.loadData && !node.children?.length && !loaded().includes(node.key)) {
      setLoadingKeys([...loadingKeys(), node.key]);
      try {
        await props.loadData(node);
        const nextLoaded = [...new Set([...loaded(), node.key])];
        if (props.loadedKeys === undefined) setInternalLoadedKeys(nextLoaded);
        props.onLoad?.(nextLoaded, { node, nativeEvent: event });
      } finally { setLoadingKeys(loadingKeys().filter((key) => key !== node.key)); }
    }
    const next = isExpanded ? expanded().filter((key) => key !== node.key) : [...expanded(), node.key];
    if (props.expandedKeys === undefined) setInternalExpanded(next);
    props.onExpand?.(next, { node, expanded: !isExpanded, nativeEvent: event });
  };
  const toggleSelect = (node: TreeDataNode, event: MouseEvent) => {
    if (disabled(node) || props.selectable === false || node.selectable === false) return;
    const isSelected = selected().includes(node.key);
    const next = props.multiple ? isSelected ? selected().filter((key) => key !== node.key) : [...selected(), node.key] : isSelected ? [] : [node.key];
    if (props.selectedKeys === undefined) setInternalSelected(next);
    props.onSelect?.(next, { node, selected: !isSelected, selectedNodes: next.map(nodeByKey).filter((item): item is TreeDataNode => Boolean(item)), nativeEvent: event });
  };
  const toggleCheck = (node: TreeDataNode, event: MouseEvent) => {
    if (disabled(node) || node.disableCheckbox) return;
    const isChecked = checked().includes(node.key);
    const affected = props.checkStrictly ? [node.key] : descendantKeys(node);
    const next = isChecked ? checked().filter((key) => !affected.includes(key)) : [...new Set([...checked(), ...affected])];
    if (props.checkedKeys === undefined) setInternalChecked(next);
    const info = { node, checked: !isChecked, checkedNodes: next.map(nodeByKey).filter((item): item is TreeDataNode => Boolean(item)), nativeEvent: event };
    props.onCheck?.(props.checkStrictly ? { checked: next, halfChecked: halfChecked() } : next, info);
  };
  const keyboard: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (event) => {
    const focused = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
    const index = Number(focused?.dataset.treeIndex ?? -1);
    let next: number | undefined;
    if (event.key === 'ArrowDown') next = Math.min(visibleRows().length - 1, index + 1);
    if (event.key === 'ArrowUp') next = Math.max(0, index - 1);
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = visibleRows().length - 1;
    if (next === undefined || next < 0) return;
    event.preventDefault();
    const target = event.currentTarget.querySelector<HTMLElement>(`[data-tree-index="${next}"]`);
    if (target) target.focus();
    else {
      if (virtualEnabled()) virtual.scrollToIndex(next);
      queueMicrotask(() => event.currentTarget.querySelector<HTMLElement>(`[data-tree-index="${next}"]`)?.focus());
    }
  };
  const renderNodes = (): JSX.Element => (
    <>
    <Show when={virtualPaddingTop() > 0}><div aria-hidden="true" style={{ height: `${virtualPaddingTop()}px` }} /></Show>
    <For each={renderedRows()}>{(entry) => {
      const node = entry.node;
      const level = entry.level;
      const isExpanded = () => expanded().includes(node.key);
      const isSelected = () => selected().includes(node.key);
      const isChecked = () => checked().includes(node.key);
      const hasChildren = () => !node.isLeaf && Boolean(node.children?.length || props.loadData);
      return (
        <div role="none" class={[node.class, props.motion && props.motion.motionName]} data-index={entry.virtual?.index}>
          <div
            role="treeitem"
            data-tree-index={entry.index}
            aria-level={level}
            aria-expanded={hasChildren() ? (isExpanded() ? 'true' : 'false') : undefined}
            aria-selected={isSelected() ? 'true' : 'false'}
            aria-checked={props.checkable ? (halfChecked().includes(node.key) ? 'mixed' : isChecked() ? 'true' : 'false') : undefined}
            aria-disabled={disabled(node) ? 'true' : undefined}
            tabindex={disabled(node) ? -1 : 0}
            draggable={nodeDraggable(node) ? 'true' : undefined}
            class={['ads-tree-node flex min-h-7 items-center rounded-control px-1 text-sm outline-none hover:bg-surface-container focus-visible:ring-2 focus-visible:ring-primary/20', isSelected() ? 'bg-[#e6f4ff] text-primary' : 'text-text', semanticClasses().item]}
            style={{ 'padding-left': `${(level - 1) * 20 + 4}px`, ...semanticStyles().item }}
            onClick={(event) => { toggleSelect(node, event); if (hasChildren() && props.expandAction === 'click') void toggleExpand(node, event); }}
            onDblClick={(event) => { props.onDoubleClick?.(event, node); if (hasChildren() && props.expandAction === 'doubleClick') void toggleExpand(node, event); }}
            onContextMenu={(event) => props.onRightClick?.({ event, node })}
            onDragStart={(event) => { if (!nodeDraggable(node)) return; dragged = node; props.onDragStart?.({ event, node }); }}
            onDragEnter={(event) => { if (dragged) props.onDragEnter?.({ event, node, expandedKeys: [...expanded()] }); }}
            onDragLeave={(event) => { if (dragged) props.onDragLeave?.({ event, node }); }}
            onDragOver={(event) => { const position = dropPosition(event); if (dragged && (props.allowDrop?.({ dropNode: node, dropPosition: position }) ?? true)) event.preventDefault(); props.onDragOver?.({ event, node }); }}
            onDragEnd={(event) => { props.onDragEnd?.({ event, node }); dragged = undefined; }}
            onDrop={(event) => { const position = dropPosition(event); if (dragged && (props.allowDrop?.({ dropNode: node, dropPosition: position }) ?? true)) props.onDrop?.({ event, node, dragNode: dragged, dragNodesKeys: descendantKeys(dragged), dropPosition: position, dropToGap: position !== 0 }); dragged = undefined; }}
          >
            <button type="button" aria-label={isExpanded() ? 'Collapse node' : 'Expand node'} disabled={!hasChildren() || disabled(node)} class={['inline-flex size-6 shrink-0 items-center justify-center bg-transparent text-xs text-text-secondary disabled:text-transparent', semanticClasses().itemSwitcher]} style={semanticStyles().itemSwitcher} onClick={(event) => { event.stopPropagation(); void toggleExpand(node, event); }}>{loadingKeys().includes(node.key) ? props.switcherLoadingIcon ?? <span class="ads-spin size-3 rounded-full border border-primary border-r-transparent" /> : typeof props.switcherIcon === 'function' ? props.switcherIcon({ expanded: isExpanded(), loading: false, node }) : props.switcherIcon ?? (isExpanded() ? <DownIcon /> : <RightIcon />)}</button>
            <Show when={props.checkable || node.checkable}><input type="checkbox" aria-label={`Check ${typeof node.title === 'string' ? node.title : String(node.key)}`} checked={isChecked()} disabled={disabled(node) || node.disableCheckbox} class="mr-1 size-4 accent-primary" onClick={(event) => { event.stopPropagation(); toggleCheck(node, event); }} /></Show>
            <Show when={props.showIcon && node.icon}><span aria-hidden="true" class={['mr-1 inline-flex', semanticClasses().itemIcon]} style={semanticStyles().itemIcon}>{node.icon}</span></Show>
            <span class={[props.blockNode ? 'min-w-0 flex-1 truncate' : '', props.filterTreeNode?.(node) ? 'font-semibold text-primary' : '', semanticClasses().itemTitle]} style={semanticStyles().itemTitle}>{props.titleRender?.(node) ?? node.title}</span>
          </div>
        </div>
      );
    }}</For>
    <Show when={virtualPaddingBottom() > 0}><div aria-hidden="true" style={{ height: `${virtualPaddingBottom()}px` }} /></Show>
    </>
  );

  const registry: TreeRegistryValue = { register(node) { currentRegistered = [...currentRegistered, node]; setRegisteredNodes(currentRegistered); return () => { currentRegistered = currentRegistered.filter((entry) => entry !== node); setRegisteredNodes(currentRegistered); }; } };
  return <><TreeRegistry value={registry}><div hidden>{props.children}</div></TreeRegistry><div {...others} ref={rootRef} role="tree" aria-multiselectable={props.multiple ? 'true' : undefined} class={['ads-tree min-w-0 bg-surface text-text', semanticClasses().root, props.class]} style={{ ...props.rootStyle, ...semanticStyles().root, ...(typeof props.style === 'object' ? props.style : {}), 'max-height': props.height ? `${props.height}px` : undefined, overflow: props.height ? 'auto' : undefined }} onKeyDown={keyboard}><Show when={true as boolean}>{(_value) => renderNodes()}</Show></div></>;
}

export interface DirectoryTreeProps extends TreeProps { expandAction?: 'click' | 'doubleClick' | false }
export function DirectoryTree(props: DirectoryTreeProps) { return <Tree {...props} blockNode showIcon expandAction={props.expandAction ?? 'click'} />; }
