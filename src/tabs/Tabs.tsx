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
export type TabsSemanticClassNames = Partial<Record<TabsSemanticName, string>>;
export type TabsSemanticStyles = Partial<Record<TabsSemanticName, JSX.CSSProperties>>;

export interface TabItemType {
  key: string;
  label: JSX.Element;
  children?: JSX.Element;
  icon?: JSX.Element;
  disabled?: boolean;
  class?: string;
  destroyOnHidden?: boolean;
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
  queueMicrotask(() => { if (!cancelled) unregister = registry?.register({ key, label: props.tab, children: props.children, disabled: props.disabled, destroyOnHidden: props.destroyOnHidden }); });
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
  tabBarExtraContent?: JSX.Element;
  destroyOnHidden?: boolean;
  tabListClass?: string;
  classNames?: TabsSemanticClassNames;
  styles?: TabsSemanticStyles;
}

export function Tabs(inputProps: TabsProps) {
  const props = merge({ items: [] as readonly TabItemType[], size: 'middle' as const, destroyOnHidden: false }, inputProps);
  const [registeredItems, setRegisteredItems] = createSignal<readonly TabItemType[]>([], { ownedWrite: true });
  let currentRegistered: readonly TabItemType[] = [];
  const items = () => props.items.length ? props.items : (registeredItems(), currentRegistered);
  const firstEnabledKey = () => items().find((item) => !item.disabled)?.key;
  const [internalKey, setInternalKey] = createSignal(props.defaultActiveKey ?? firstEnabledKey() ?? '', { ownedWrite: true });
  const uid = createUniqueId();
  const others = omit(
    props,
    'items', 'children', 'activeKey', 'defaultActiveKey', 'onChange', 'centered', 'size',
    'tabBarExtraContent', 'destroyOnHidden', 'tabListClass', 'classNames', 'styles', 'class', 'style',
  );
  const selectedKey = () => {
    const requested = props.activeKey ?? internalKey();
    return items().some((item) => item.key === requested && !item.disabled) ? requested : firstEnabledKey();
  };
  const styles = () => tabs({ centered: props.centered, size: props.size });
  const tabId = (key: string) => `${uid}-tab-${key}`;
  const panelId = (key: string) => `${uid}-panel-${key}`;

  const select = (item: TabItemType) => {
    if (item.disabled || item.key === selectedKey()) return;
    if (props.activeKey === undefined) setInternalKey(item.key);
    props.onChange?.(item.key);
  };

  const handleKeyDown = (event: KeyboardEvent, key: string) => {
    const enabled = items().filter((item) => !item.disabled);
    const index = enabled.findIndex((item) => item.key === key);
    if (index < 0) return;

    let next: TabItemType | undefined;
    if (event.key === 'ArrowRight') next = enabled[(index + 1) % enabled.length];
    if (event.key === 'ArrowLeft') next = enabled[(index - 1 + enabled.length) % enabled.length];
    if (event.key === 'Home') next = enabled[0];
    if (event.key === 'End') next = enabled[enabled.length - 1];
    if (!next) return;

    event.preventDefault();
    select(next);
    document.getElementById(tabId(next.key))?.focus();
  };

  const registry: TabRegistryValue = { register(item) { currentRegistered = [...currentRegistered.filter((entry) => entry.key !== item.key), item]; setRegisteredItems(currentRegistered); return () => { currentRegistered = currentRegistered.filter((entry) => entry !== item); setRegisteredItems(currentRegistered); }; } };

  return (
    <TabRegistry value={registry}>
      <div hidden>{props.children}</div>
    <div {...others} class={styles().root({ class: [props.class as string | undefined, props.classNames?.root] })} style={{ ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}>
      <div class="flex min-w-0 items-end gap-4">
        <div role="tablist" class={styles().list({ class: ['min-w-0 flex-1 overflow-x-auto', props.tabListClass, props.classNames?.header] })} style={props.styles?.header}>
          <For each={items()}>{(item) => (
            <button
              type="button"
              role="tab"
              id={tabId(item.key)}
              aria-controls={panelId(item.key)}
              aria-selected={selectedKey() === item.key ? 'true' : 'false'}
              tabindex={selectedKey() === item.key ? 0 : -1}
              disabled={item.disabled}
              class={tabs({ active: selectedKey() === item.key, size: props.size }).tab({ class: [item.class, props.classNames?.item] })}
              style={props.styles?.item}
              onClick={() => select(item)}
              onKeyDown={(event) => handleKeyDown(event, item.key)}
            >
              <Show when={item.icon}><span aria-hidden="true" class="inline-flex shrink-0">{item.icon}</span></Show>
              <span>{item.label}</span>
              <Show when={selectedKey() === item.key}><span aria-hidden="true" class={['absolute inset-x-0 bottom-[-1px] h-0.5 bg-primary', props.classNames?.indicator]} style={props.styles?.indicator} /></Show>
            </button>
          )}</For>
        </div>
        <Show when={props.tabBarExtraContent}><div class="mb-2 shrink-0">{props.tabBarExtraContent}</div></Show>
      </div>

      <div class={props.classNames?.body} style={props.styles?.body}><For each={items()}>{(item) => (
        <Show when={!(item.destroyOnHidden ?? props.destroyOnHidden) || selectedKey() === item.key}>
          <div
            role="tabpanel"
            id={panelId(item.key)}
            aria-labelledby={tabId(item.key)}
            tabindex={0}
            hidden={selectedKey() !== item.key}
            class={styles().panel({ class: props.classNames?.content })}
            style={props.styles?.content}
          >
            {item.children}
          </div>
        </Show>
      )}</For></div>
    </div>
    </TabRegistry>
  );
}
