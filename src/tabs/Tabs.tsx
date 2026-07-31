import { createContext, createSignal, createUniqueId, For, merge, omit, onCleanup, Show, useContext } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { tv } from 'tailwind-variants';

const tabs = tv({
  slots: {
    root: 'ads-tabs min-w-0 text-sm text-text',
    list: 'relative flex min-w-0 gap-8 border-b border-border-secondary',
    tab: 'relative inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 border-0 bg-transparent px-0 text-text-secondary outline-none transition-colors duration-[var(--ads-motion-fast)] after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.5 after:scale-x-0 after:bg-primary after:transition-transform after:duration-[var(--ads-motion-mid)] hover:text-primary focus-visible:rounded-small focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:text-text-disabled',
    panel: 'pt-4 outline-none',
  },
  variants: {
    active: {
      true: { tab: 'font-semibold text-primary after:scale-x-100' },
    },
    centered: {
      true: { list: 'justify-center' },
    },
    size: {
      small: { list: 'gap-6', tab: 'h-8' },
      middle: {},
      large: { tab: 'h-12 text-base' },
    },
  },
  defaultVariants: { size: 'middle' },
});

export type TabsSemanticName = 'root' | 'header' | 'item' | 'remove' | 'indicator' | 'body' | 'content' | 'popup.root';
export type TabsSemanticClassNames = Partial<Record<TabsSemanticName, string>> | ((info: { props: TabsProps }) => Partial<Record<TabsSemanticName, string>>);
export type TabsSemanticStyles = Partial<Record<TabsSemanticName, JSX.CSSProperties>> | ((info: { props: TabsProps }) => Partial<Record<TabsSemanticName, JSX.CSSProperties>>);

export interface TabItemType {
  key: string;
  label: JSX.Element;
  children?: JSX.Element;
  icon?: JSX.Element;
  disabled?: boolean;
  class?: string;
  style?: JSX.CSSProperties;
  destroyOnHidden?: boolean;
  forceRender?: boolean;
  closable?: boolean;
  closeIcon?: JSX.Element | null | false;
}

interface TabRegistryValue { register: (item: TabItemType) => () => void }
const TabRegistry = createContext<TabRegistryValue | null>(null);

export interface TabPaneProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title'> {
  tab: JSX.Element;
  tabKey?: string;
  key?: string;
  disabled?: boolean;
  forceRender?: boolean;
  destroyOnHidden?: boolean;
}
export function TabPane(props: TabPaneProps) {
  const registry = useContext(TabRegistry);
  let unregister: (() => void) | undefined;
  let cancelled = false;
  const key = props.tabKey ?? props.key ?? createUniqueId();
  queueMicrotask(() => { if (!cancelled) unregister = registry?.register({ key, label: props.tab, children: props.children, disabled: props.disabled, destroyOnHidden: props.destroyOnHidden, forceRender: props.forceRender }); });
  onCleanup(() => { cancelled = true; unregister?.(); });
  return null;
}

export interface TabsProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items?: readonly TabItemType[];
  children?: JSX.Element;
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (activeKey: string) => void;
  centered?: boolean;
  size?: 'small' | 'middle' | 'large';
  type?: 'line' | 'card' | 'editable-card';
  tabPlacement?: 'top' | 'end' | 'bottom' | 'start';
  tabPosition?: 'top' | 'right' | 'bottom' | 'left';
  animated?: boolean | { inkBar?: boolean; tabPane?: boolean };
  addIcon?: JSX.Element;
  hideAdd?: boolean;
  removeIcon?: JSX.Element;
  indicator?: { size?: number | ((origin: number) => number); align?: 'start' | 'center' | 'end' };
  tabBarExtraContent?: JSX.Element | { left?: JSX.Element; right?: JSX.Element };
  tabBarGutter?: number;
  tabBarStyle?: JSX.CSSProperties;
  destroyInactiveTabPane?: boolean;
  destroyOnHidden?: boolean;
  popupClassName?: string;
  more?: Record<string, unknown>;
  renderTabBar?: (node: JSX.Element, props: TabsProps) => JSX.Element;
  onEdit?: (targetKey: string | MouseEvent, action: 'add' | 'remove') => void;
  onTabClick?: (key: string, event: MouseEvent) => void;
  onTabScroll?: (info: { direction: 'left' | 'right' | 'top' | 'bottom' }) => void;
  tabListClass?: string;
  classNames?: TabsSemanticClassNames;
  styles?: TabsSemanticStyles;
}

export function Tabs(inputProps: TabsProps) {
  const props = merge({ items: [] as readonly TabItemType[], size: 'middle' as const, type: 'line' as const, destroyOnHidden: false }, inputProps);
  const [registeredItems, setRegisteredItems] = createSignal<readonly TabItemType[]>([], { ownedWrite: true });
  let currentRegistered: readonly TabItemType[] = [];
  const items = () => props.items.length ? props.items : (registeredItems(), currentRegistered);
  const firstEnabledKey = () => items().find((item) => !item.disabled)?.key;
  const [internalKey, setInternalKey] = createSignal(props.defaultActiveKey ?? firstEnabledKey() ?? '', { ownedWrite: true });
  const uid = createUniqueId();
  const others = omit(
    props,
    'items', 'children', 'activeKey', 'defaultActiveKey', 'onChange', 'centered', 'size', 'type',
    'tabPlacement', 'tabPosition', 'animated', 'addIcon', 'hideAdd', 'removeIcon', 'indicator',
    'tabBarExtraContent', 'tabBarGutter', 'tabBarStyle', 'destroyInactiveTabPane', 'destroyOnHidden',
    'popupClassName', 'more', 'renderTabBar', 'onEdit', 'onTabClick', 'onTabScroll', 'tabListClass',
    'classNames', 'styles', 'class', 'style',
  );
  const selectedKey = () => {
    const requested = props.activeKey ?? internalKey();
    return items().some((item) => item.key === requested && !item.disabled) ? requested : firstEnabledKey();
  };
  const styles = () => tabs({ centered: props.centered, size: props.size });
  const semanticClasses = () => typeof props.classNames === 'function' ? props.classNames({ props }) : props.classNames ?? {};
  const semanticStyles = () => typeof props.styles === 'function' ? props.styles({ props }) : props.styles ?? {};
  const placement = (): 'top' | 'end' | 'bottom' | 'start' => props.tabPlacement ?? (props.tabPosition === 'right' ? 'end' : props.tabPosition === 'left' ? 'start' : props.tabPosition ?? 'top');
  const vertical = () => placement() === 'start' || placement() === 'end';
  const destroyHidden = () => props.destroyOnHidden || Boolean(props.destroyInactiveTabPane);
  const extra = () => {
    const value = props.tabBarExtraContent;
    return value && typeof value === 'object' && !Array.isArray(value) && ('left' in value || 'right' in value) ? value as { left?: JSX.Element; right?: JSX.Element } : { right: value as JSX.Element };
  };
  let lastScrollLeft = 0;
  let lastScrollTop = 0;
  const handleScroll: JSX.EventHandler<HTMLDivElement, Event> = (event) => {
    const element = event.currentTarget;
    const horizontal = element.scrollLeft - lastScrollLeft;
    const verticalDelta = element.scrollTop - lastScrollTop;
    lastScrollLeft = element.scrollLeft;
    lastScrollTop = element.scrollTop;
    if (Math.abs(horizontal) >= Math.abs(verticalDelta) && horizontal !== 0) props.onTabScroll?.({ direction: horizontal > 0 ? 'right' : 'left' });
    else if (verticalDelta !== 0) props.onTabScroll?.({ direction: verticalDelta > 0 ? 'bottom' : 'top' });
  };
  const tabId = (key: string) => `${uid}-tab-${key}`;
  const panelId = (key: string) => `${uid}-panel-${key}`;

  const select = (item: TabItemType) => {
    if (item.disabled || item.key === selectedKey()) return;
    if (props.activeKey === undefined) setInternalKey(item.key);
    props.onChange?.(item.key);
  };
  const clickTab = (item: TabItemType, event: MouseEvent) => {
    if (item.disabled) return;
    props.onTabClick?.(item.key, event);
    select(item);
  };
  const removeTab = (item: TabItemType, event: MouseEvent) => {
    event.stopPropagation();
    props.onEdit?.(item.key, 'remove');
  };

  const handleKeyDown = (event: KeyboardEvent, key: string) => {
    const enabled = items().filter((item) => !item.disabled);
    const index = enabled.findIndex((item) => item.key === key);
    if (index < 0) return;

    let next: TabItemType | undefined;
    if (event.key === (vertical() ? 'ArrowDown' : 'ArrowRight')) next = enabled[(index + 1) % enabled.length];
    if (event.key === (vertical() ? 'ArrowUp' : 'ArrowLeft')) next = enabled[(index - 1 + enabled.length) % enabled.length];
    if (event.key === 'Home') next = enabled[0];
    if (event.key === 'End') next = enabled[enabled.length - 1];
    if (!next) return;

    event.preventDefault();
    select(next);
    document.getElementById(tabId(next.key))?.focus();
  };

  const registry: TabRegistryValue = { register(item) { currentRegistered = [...currentRegistered.filter((entry) => entry.key !== item.key), item]; setRegisteredItems(currentRegistered); return () => { currentRegistered = currentRegistered.filter((entry) => entry !== item); setRegisteredItems(currentRegistered); }; } };

  const indicatorStyle = (): JSX.CSSProperties => {
    const align = props.indicator?.align ?? 'center';
    const size = typeof props.indicator?.size === 'number' ? `${props.indicator.size}px` : undefined;
    if (vertical()) return { height: size, top: align === 'start' ? 0 : align === 'center' ? '50%' : undefined, bottom: align === 'end' ? 0 : undefined, transform: align === 'center' && size ? 'translateY(-50%)' : undefined, ...semanticStyles().indicator };
    return { width: size, left: align === 'start' ? 0 : align === 'center' ? '50%' : undefined, right: align === 'end' ? 0 : undefined, transform: align === 'center' && size ? 'translateX(-50%)' : undefined, ...semanticStyles().indicator };
  };
  const tabBar = () => <div class={['ads-tabs-header flex min-w-0 items-end gap-4', vertical() ? 'flex-col items-stretch' : '']}>
    <Show when={extra().left}><div class="shrink-0">{extra().left}</div></Show>
    <div role="tablist" aria-orientation={vertical() ? 'vertical' : 'horizontal'} class={styles().list({ class: ['ads-tabs-list min-w-0 flex-1 overflow-auto', vertical() ? 'flex-col gap-0 border-b-0 border-r' : '', props.tabListClass, semanticClasses().header] })} style={{ gap: props.tabBarGutter === undefined ? undefined : `${props.tabBarGutter}px`, ...props.tabBarStyle, ...semanticStyles().header }} onScroll={handleScroll}>
      <For each={items()}>{(item) => <div class={['ads-tabs-tab-wrapper relative flex shrink-0 items-center', props.type !== 'line' ? 'ads-tabs-card-tab' : '']}>
        <button
          type="button"
          role="tab"
          id={tabId(item.key)}
          aria-controls={panelId(item.key)}
          aria-selected={selectedKey() === item.key ? 'true' : 'false'}
          tabindex={selectedKey() === item.key ? 0 : -1}
          disabled={item.disabled}
          class={tabs({ active: selectedKey() === item.key, size: props.size }).tab({ class: ['ads-tabs-tab', item.class, semanticClasses().item] })}
          style={{ ...item.style, ...semanticStyles().item }}
          onClick={(event) => clickTab(item, event)}
          onKeyDown={(event) => handleKeyDown(event, item.key)}
        >
          <Show when={item.icon}><span aria-hidden="true" class="inline-flex shrink-0">{item.icon}</span></Show>
          <span>{item.label}</span>
          <Show when={props.type === 'line' && selectedKey() === item.key}><span ref={(element) => { const size = props.indicator?.size; if (typeof size === 'function') queueMicrotask(() => { const origin = vertical() ? element.parentElement?.offsetHeight ?? 0 : element.parentElement?.offsetWidth ?? 0; element.style[vertical() ? 'height' : 'width'] = `${size(origin)}px`; }); }} aria-hidden="true" class={['ads-tabs-indicator absolute bottom-[-1px] h-0.5 bg-primary', semanticClasses().indicator]} style={indicatorStyle()} /></Show>
        </button>
        <Show when={props.type === 'editable-card' && item.closable !== false && item.closeIcon !== null && item.closeIcon !== false}><button type="button" aria-label={`Remove ${String(item.label)}`} class={['ads-tabs-remove mr-2 bg-transparent text-text-secondary hover:text-text', semanticClasses().remove]} style={semanticStyles().remove} onClick={(event) => removeTab(item, event)}>{item.closeIcon ?? props.removeIcon ?? 'x'}</button></Show>
      </div>}</For>
      <Show when={props.type === 'editable-card' && !props.hideAdd}><button type="button" aria-label="Add tab" class="ads-tabs-add shrink-0 px-3 text-text-secondary hover:text-primary" onClick={(event) => props.onEdit?.(event, 'add')}>{props.addIcon ?? '+'}</button></Show>
    </div>
    <Show when={extra().right}><div class="shrink-0">{extra().right}</div></Show>
  </div>;
  const renderedTabBar = () => props.renderTabBar ? props.renderTabBar(tabBar(), props) : tabBar();

  return (
    <TabRegistry value={registry}>
      <div hidden>{props.children}</div>
      <div {...others} data-type={props.type} data-placement={placement()} data-animated={props.animated === false ? 'false' : 'true'} class={styles().root({ class: ['ads-tabs-layout', vertical() ? 'flex gap-4' : '', placement() === 'end' ? 'flex-row-reverse' : '', placement() === 'bottom' ? 'flex flex-col-reverse' : '', props.class as string | undefined, semanticClasses().root] })} style={{ ...(typeof props.style === 'object' ? props.style : {}), ...semanticStyles().root }}>
        {renderedTabBar()}
        <div class={['ads-tabs-body min-w-0 flex-1', semanticClasses().body]} style={semanticStyles().body}><For each={items()}>{(item) => (
          <Show when={item.forceRender || !(item.destroyOnHidden ?? destroyHidden()) || selectedKey() === item.key}>
            <div
              role="tabpanel"
              id={panelId(item.key)}
              aria-labelledby={tabId(item.key)}
              tabindex={0}
              hidden={selectedKey() !== item.key}
              class={styles().panel({ class: semanticClasses().content })}
              style={semanticStyles().content}
            >
              {item.children}
            </div>
          </Show>
        )}</For></div>
      </div>
    </TabRegistry>
  );
}
