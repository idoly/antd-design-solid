import { createContext, createEffect, createMemo, createSignal, For, merge, omit, onCleanup, Show, untrack, useContext } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { RightIcon } from '../_internal/icons';
import type { MenuRef } from '../compat-types';

export type MenuKey = string | number;

export interface MenuItemType {
  key: MenuKey;
  label?: JSX.Element;
  icon?: JSX.Element;
  disabled?: boolean;
  danger?: boolean;
  title?: string;
  children?: readonly MenuItemType[];
  type?: 'item' | 'group' | 'divider';
  extra?: JSX.Element;
  class?: string;
  popupClassName?: string;
  popupOffset?: [number, number];
  theme?: 'light' | 'dark';
  onTitleClick?: (info: { key: MenuKey; domEvent: MouseEvent }) => void;
  popupRender?: MenuPopupRender;
}

export interface MenuInfo {
  key: MenuKey;
  keyPath: MenuKey[];
  item: MenuItemType;
  domEvent: MouseEvent | KeyboardEvent;
}

interface MenuRegistryValue { register: (item: MenuItemType) => () => void }
const MenuRegistry = createContext<MenuRegistryValue | null>(null);
let menuMarkerKey = 0;
function registerMenuItem(registry: MenuRegistryValue | null, item: () => MenuItemType, nested = false) {
  let unregister: (() => void) | undefined;
  let cancelled = false;
  const run = () => { if (!cancelled) unregister = registry?.register(item()); };
  if (nested) queueMicrotask(() => queueMicrotask(run)); else queueMicrotask(run);
  onCleanup(() => { cancelled = true; unregister?.(); });
}
export interface MenuItemProps { key?: MenuKey; itemKey?: MenuKey; icon?: JSX.Element; extra?: JSX.Element; disabled?: boolean; danger?: boolean; title?: string; class?: string; children?: JSX.Element }
export function MenuItem(props: MenuItemProps) { const registry = useContext(MenuRegistry); registerMenuItem(registry, () => ({ key: props.itemKey ?? props.key ?? '', label: props.children, icon: props.icon, extra: props.extra, disabled: props.disabled, danger: props.danger, title: props.title, class: props.class })); return null; }
export interface SubMenuProps extends Omit<MenuItemProps, 'title'> { title: JSX.Element; popupClassName?: string; popupOffset?: [number, number]; theme?: 'light' | 'dark'; onTitleClick?: (info: { key: MenuKey; domEvent: MouseEvent }) => void; popupRender?: MenuPopupRender }
export function SubMenu(props: SubMenuProps) {
  const parent = useContext(MenuRegistry);
  let children: MenuItemType[] = [];
  const registry: MenuRegistryValue = { register(item) { children = [...children, item]; return () => { children = children.filter((entry) => entry !== item); }; } };
  registerMenuItem(parent, () => ({ key: props.itemKey ?? props.key ?? '', label: props.title, icon: props.icon, disabled: props.disabled, class: props.class, children, popupClassName: props.popupClassName, popupOffset: props.popupOffset, theme: props.theme, onTitleClick: props.onTitleClick, popupRender: props.popupRender }), true);
  return <MenuRegistry value={registry}>{props.children}</MenuRegistry>;
}
export interface MenuDividerProps { class?: string; dashed?: boolean }
export function MenuDivider(props: MenuDividerProps) { const registry = useContext(MenuRegistry); registerMenuItem(registry, () => ({ key: `divider-${menuMarkerKey += 1}`, type: 'divider', class: [props.dashed && 'border-dashed', props.class].filter(Boolean).join(' ') })); return null; }
export interface MenuItemGroupProps { key?: MenuKey; itemKey?: MenuKey; title?: JSX.Element; class?: string; children?: JSX.Element }
export function MenuItemGroup(props: MenuItemGroupProps) {
  const parent = useContext(MenuRegistry); let children: MenuItemType[] = [];
  const registry: MenuRegistryValue = { register(item) { children = [...children, item]; return () => { children = children.filter((entry) => entry !== item); }; } };
  registerMenuItem(parent, () => ({ key: props.itemKey ?? props.key ?? `group-${menuMarkerKey += 1}`, type: 'group', label: props.title, class: props.class, children }), true);
  return <MenuRegistry value={registry}>{props.children}</MenuRegistry>;
}

export type MenuSemanticName = 'root' | 'item' | 'itemIcon' | 'itemContent' | 'subMenu.itemTitle' | 'subMenu.list' | 'subMenu.item' | 'subMenu.itemIcon' | 'subMenu.itemContent' | 'itemTitle' | 'list' | 'popup';
export type MenuClassNames = Partial<Record<MenuSemanticName, string>> | ((info: { props: MenuProps }) => Partial<Record<MenuSemanticName, string>>);
export type MenuStyles = Partial<Record<MenuSemanticName, JSX.CSSProperties>> | ((info: { props: MenuProps }) => Partial<Record<MenuSemanticName, JSX.CSSProperties>>);
export type MenuExpandIcon = JSX.Element | ((props: { item: MenuItemType; isSubMenu: boolean; open: boolean }) => JSX.Element);
export type MenuPopupRender = (node: JSX.Element, props: { item: MenuItemType; keys: MenuKey[] }) => JSX.Element;
export interface MenuTooltipConfig { title?: JSX.Element; placement?: string }

export interface MenuProps extends Omit<JSX.HTMLAttributes<HTMLUListElement>, 'onClick' | 'onSelect' | 'ref'> {
  items?: readonly MenuItemType[];
  children?: JSX.Element;
  mode?: 'horizontal' | 'vertical' | 'inline';
  theme?: 'light' | 'dark';
  inlineCollapsed?: boolean;
  inlineIndent?: number;
  selectable?: boolean;
  multiple?: boolean;
  selectedKeys?: readonly MenuKey[];
  defaultSelectedKeys?: readonly MenuKey[];
  openKeys?: readonly MenuKey[];
  defaultOpenKeys?: readonly MenuKey[];
  disabledOverflow?: boolean;
  overflowedIndicator?: JSX.Element;
  expandIcon?: MenuExpandIcon;
  forceSubMenuRender?: boolean;
  subMenuCloseDelay?: number;
  subMenuOpenDelay?: number;
  tooltip?: false | MenuTooltipConfig;
  popupRender?: MenuPopupRender;
  classNames?: MenuClassNames;
  styles?: MenuStyles;
  triggerSubMenuAction?: 'hover' | 'click';
  onClick?: (info: MenuInfo) => void;
  onSelect?: (info: MenuInfo & { selectedKeys: MenuKey[] }) => void;
  onDeselect?: (info: MenuInfo & { selectedKeys: MenuKey[] }) => void;
  onOpenChange?: (openKeys: MenuKey[]) => void;
  ref?: (instance: MenuRef) => void;
}

export function Menu(inputProps: MenuProps) {
  let menuRef: HTMLUListElement | undefined;
  const props = merge({ items: [] as readonly MenuItemType[], mode: 'vertical' as const, theme: 'light' as const, inlineIndent: 24, selectable: true, multiple: false, triggerSubMenuAction: 'hover' as const, subMenuOpenDelay: 0, subMenuCloseDelay: 0.1 }, inputProps);
  const [registeredItems, setRegisteredItems] = createSignal<readonly MenuItemType[]>([], { ownedWrite: true });
  let currentRegistered: readonly MenuItemType[] = [];
  const items = () => props.items.length ? props.items : (registeredItems(), currentRegistered);
  const initial = untrack(() => ({ selectedKeys: props.defaultSelectedKeys ?? [], openKeys: props.defaultOpenKeys ?? [], ref: props.ref }));
  const [internalSelected, setInternalSelected] = createSignal<readonly MenuKey[]>(initial.selectedKeys, { ownedWrite: true });
  const [internalOpen, setInternalOpen] = createSignal<readonly MenuKey[]>(initial.openKeys, { ownedWrite: true });
  const [overflowStart, setOverflowStart] = createSignal(Number.POSITIVE_INFINITY, { ownedWrite: true });
  const hoverTimers = new Map<MenuKey, ReturnType<typeof setTimeout>>();
  const semanticClasses = createMemo(() => typeof props.classNames === 'function' ? props.classNames({ props }) : (props.classNames ?? {}));
  const semanticStyles = createMemo(() => typeof props.styles === 'function' ? props.styles({ props }) : (props.styles ?? {}));
  const others = omit(
    props,
    'items', 'children', 'mode', 'theme', 'inlineCollapsed', 'inlineIndent', 'selectable', 'multiple',
    'selectedKeys', 'defaultSelectedKeys', 'openKeys', 'defaultOpenKeys', 'disabledOverflow',
    'overflowedIndicator', 'expandIcon', 'forceSubMenuRender', 'subMenuCloseDelay', 'subMenuOpenDelay',
    'tooltip', 'popupRender', 'classNames', 'styles', 'triggerSubMenuAction', 'onClick', 'onSelect',
    'onDeselect', 'onOpenChange', 'class', 'ref',
  );
  initial.ref?.({ get menu() { return menuRef ?? null; }, focus: (options) => (menuRef?.querySelector<HTMLElement>('[role="menuitem"]') ?? menuRef)?.focus(options) });
  const selectedKeys = () => props.selectedKeys ?? internalSelected();
  const openKeys = () => props.openKeys ?? internalOpen();
  const dark = () => props.theme === 'dark';
  const scheduleOpen = (key: MenuKey, open: boolean) => {
    clearTimeout(hoverTimers.get(key));
    const delay = (open ? props.subMenuOpenDelay : props.subMenuCloseDelay) * 1000;
    hoverTimers.set(key, setTimeout(() => updateOpen(key, open), delay));
  };
  onCleanup(() => hoverTimers.forEach(clearTimeout));
  const updateOpen = (key: MenuKey, open: boolean) => {
    const next = open ? [...new Set([...openKeys(), key])] : openKeys().filter((item) => item !== key);
    if (props.openKeys === undefined) setInternalOpen(next);
    props.onOpenChange?.(next);
  };
  const select = (item: MenuItemType, path: MenuKey[], event: MouseEvent | KeyboardEvent) => {
    if (item.disabled || item.type === 'divider' || item.type === 'group' || item.children) return;
    const info: MenuInfo = { key: item.key, keyPath: [...path, item.key], item, domEvent: event };
    props.onClick?.(info);
    if (!props.selectable) return;
    const selected = selectedKeys().includes(item.key);
    const next = props.multiple
      ? selected ? selectedKeys().filter((key) => key !== item.key) : [...selectedKeys(), item.key]
      : [item.key];
    if (props.selectedKeys === undefined) setInternalSelected(next);
    if (selected && props.multiple) props.onDeselect?.({ ...info, selectedKeys: next });
    else props.onSelect?.({ ...info, selectedKeys: next });
  };
  const displayItems = createMemo<readonly MenuItemType[]>(() => {
    const source = items();
    const start = overflowStart();
    if (props.mode !== 'horizontal' || props.disabledOverflow || start >= source.length) return source;
    return [...source.slice(0, start), { key: '__ads_overflow__', label: props.overflowedIndicator ?? '...', title: 'More', children: source.slice(start) }];
  });
  const itemWidths = new Map<string, number>();
  const measureOverflow = () => {
    if (!menuRef || props.mode !== 'horizontal' || props.disabledOverflow || menuRef.clientWidth <= 0) {
      setOverflowStart(Number.POSITIVE_INFINITY);
      return;
    }
    Array.from(menuRef.children).forEach((child) => {
      if (!(child instanceof HTMLElement)) return;
      const key = child.dataset.menuTop;
      if (key && key !== '__ads_overflow__') itemWidths.set(key, child.getBoundingClientRect().width);
    });
    const source = items();
    const indicatorWidth = menuRef.querySelector<HTMLElement>('[data-menu-top="__ads_overflow__"]')?.getBoundingClientRect().width || 48;
    let used = 0;
    let start = source.length;
    for (let index = 0; index < source.length; index += 1) {
      const width = itemWidths.get(String(source[index].key)) ?? 0;
      if (width > 0 && used + width + (index < source.length - 1 ? indicatorWidth : 0) > menuRef.clientWidth) { start = index; break; }
      used += width;
    }
    setOverflowStart(start);
  };
  createEffect(
    () => [props.mode, props.disabledOverflow, items().length] as const,
    () => {
      queueMicrotask(measureOverflow);
      if (typeof ResizeObserver === 'undefined' || !menuRef) return;
      const observer = new ResizeObserver(measureOverflow);
      observer.observe(menuRef);
      return () => observer.disconnect();
    },
  );

  const keyDown: JSX.EventHandler<HTMLUListElement, KeyboardEvent> = (event) => {
    const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])'));
    const index = focusable.indexOf(document.activeElement as HTMLElement);
    let next: number | undefined;
    if (event.key === 'ArrowDown' || (props.mode === 'horizontal' && event.key === 'ArrowRight')) next = (index + 1) % focusable.length;
    if (event.key === 'ArrowUp' || (props.mode === 'horizontal' && event.key === 'ArrowLeft')) next = (index - 1 + focusable.length) % focusable.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = focusable.length - 1;
    if (next === undefined || focusable.length === 0) return;
    event.preventDefault();
    focusable[next]?.focus();
  };
  const renderItems = (source: readonly MenuItemType[] | (() => readonly MenuItemType[]), level = 0, path: MenuKey[] = []): JSX.Element => (
    <For each={typeof source === 'function' ? source() : source}>{(item) => {
      if (item.type === 'divider') return <li role="separator" class={['my-1 border-t', dark() ? 'border-white/15' : 'border-border-secondary', item.class]} />;
      if (item.type === 'group') return (
        <li role="presentation" class={item.class}>
          <div class={['px-3 py-1 text-xs', dark() ? 'text-white/45' : 'text-text-disabled']}>{item.label}</div>
          <ul role="group" class={semanticClasses().list} style={semanticStyles().list}>{renderItems(item.children ?? [], level + 1, path)}</ul>
        </li>
      );
      const submenu = () => Boolean(item.children?.length);
      const open = () => openKeys().includes(item.key);
      const selected = () => selectedKeys().includes(item.key);
      const itemClass = () => [
        'flex min-h-10 w-full min-w-0 items-center gap-2 rounded-control px-3 text-left outline-none transition-colors duration-[var(--ads-motion-fast)] focus-visible:ring-2 focus-visible:ring-primary/20',
        item.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        item.danger ? 'text-error hover:bg-[#fff2f0]' : '',
        selected() ? (dark() ? 'bg-primary text-white' : 'bg-[#e6f4ff] text-primary') : dark() ? 'text-white/85 hover:bg-white/10' : 'text-text hover:bg-surface-container',
        item.class,
        level > 0 ? semanticClasses()['subMenu.item'] : semanticClasses().item,
        submenu() ? semanticClasses()['subMenu.itemTitle'] : semanticClasses().itemTitle,
      ];
      const activate: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
        if (item.disabled) return;
        if (submenu()) {
          item.onTitleClick?.({ key: item.key, domEvent: event });
          updateOpen(item.key, !open());
        } else select(item, path, event);
      };
      return (
        <li role="none" class="relative" data-menu-top={level === 0 ? String(item.key) : undefined}>
          <button
            type="button"
            role="menuitem"
            aria-disabled={item.disabled ? 'true' : undefined}
            aria-haspopup={submenu() ? 'menu' : undefined}
            aria-expanded={submenu() ? (open() ? 'true' : 'false') : undefined}
            tabindex={item.disabled ? -1 : 0}
            title={props.inlineCollapsed && level === 0 && props.tooltip !== false ? String(props.tooltip?.title ?? item.title ?? item.label ?? '') : item.title}
            class={itemClass()}
            style={{ ...semanticStyles()[level > 0 ? 'subMenu.item' : 'item'], ...semanticStyles()[submenu() ? 'subMenu.itemTitle' : 'itemTitle'], 'padding-left': props.mode === 'inline' ? `${12 + level * props.inlineIndent}px` : undefined }}
            onClick={activate}
            onPointerEnter={() => { if (!item.disabled && submenu() && props.triggerSubMenuAction === 'hover') scheduleOpen(item.key, true); }}
            onPointerLeave={() => { if (!item.disabled && submenu() && props.triggerSubMenuAction === 'hover') scheduleOpen(item.key, false); }}
          >
            <Show when={item.icon}><span aria-hidden="true" class={['inline-flex shrink-0', level > 0 ? semanticClasses()['subMenu.itemIcon'] : semanticClasses().itemIcon]} style={semanticStyles()[level > 0 ? 'subMenu.itemIcon' : 'itemIcon']}>{item.icon}</span></Show>
            <Show when={!props.inlineCollapsed || level > 0}><span class={['min-w-0 flex-1 truncate', level > 0 ? semanticClasses()['subMenu.itemContent'] : semanticClasses().itemContent]} style={semanticStyles()[level > 0 ? 'subMenu.itemContent' : 'itemContent']}>{item.label}</span></Show>
            <Show when={item.extra}><span class="ml-auto shrink-0 text-text-secondary">{item.extra}</span></Show>
            <Show when={submenu() && !props.inlineCollapsed}><span aria-hidden="true" class={['text-xs transition-transform', open() ? 'rotate-90' : '']}>{typeof props.expandIcon === 'function' ? props.expandIcon({ item, isSubMenu: true, open: open() }) : (props.expandIcon ?? <RightIcon />)}</span></Show>
          </button>
          <Show when={submenu() && (open() || props.forceSubMenuRender)}>
            {(item.popupRender ?? props.popupRender ?? ((node: JSX.Element) => node))(
              <ul
                role="menu"
                class={[props.mode === 'inline' ? 'mt-1' : ['z-20 min-w-40 rounded-surface p-1 shadow-popup', level === 0 && props.mode === 'horizontal' ? 'absolute left-0 top-full' : 'ml-4', dark() ? 'bg-[#001529]' : 'border border-border-secondary bg-surface', item.popupClassName, semanticClasses().popup], semanticClasses()['subMenu.list'], !open() && 'hidden']}
                style={{ ...semanticStyles()['subMenu.list'], ...(props.mode !== 'inline' ? semanticStyles().popup : {}), transform: item.popupOffset && props.mode !== 'inline' ? `translate(${item.popupOffset[0]}px, ${item.popupOffset[1]}px)` : undefined }}
                onPointerEnter={() => { if (props.triggerSubMenuAction === 'hover') { clearTimeout(hoverTimers.get(item.key)); updateOpen(item.key, true); } }}
                onPointerLeave={() => { if (props.triggerSubMenuAction === 'hover') scheduleOpen(item.key, false); }}
              >
                {renderItems(item.children ?? [], level + 1, [...path, item.key])}
              </ul>,
              { item, keys: [...path, item.key] },
            )}
          </Show>
        </li>
      );
    }}</For>
  );

  const registry: MenuRegistryValue = { register(item) { currentRegistered = [...currentRegistered, item]; setRegisteredItems(currentRegistered); return () => { currentRegistered = currentRegistered.filter((entry) => entry !== item); setRegisteredItems(currentRegistered); }; } };
  return (
    <>
    <MenuRegistry value={registry}><div hidden>{props.children}</div></MenuRegistry>
    <ul
      {...others}
      ref={menuRef}
      role="menu"
      aria-orientation={props.mode === 'horizontal' ? 'horizontal' : 'vertical'}
      class={[
        'ads-menu min-w-0 p-1 text-sm',
        props.mode === 'horizontal' ? 'flex items-center border-b border-border-secondary' : '',
        dark() ? 'bg-[#001529]' : 'bg-surface',
        props.inlineCollapsed ? 'w-12' : '',
        props.class,
        semanticClasses().root,
      ]}
      style={{ ...(props.style as JSX.CSSProperties), ...semanticStyles().root }}
      onKeyDown={keyDown}
    >
      {renderItems(displayItems)}
    </ul>
    </>
  );
}
