import { createSignal, For, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { tv } from 'tailwind-variants';
import { Skeleton } from '../skeleton';

const card = tv({
  base: 'ads-card flow-root overflow-hidden rounded-surface border border-border-secondary bg-surface text-text',
  variants: {
    bordered: { false: 'border-transparent' },
    hoverable: { true: 'transition-[box-shadow,border-color] duration-[var(--ads-motion-mid)] hover:border-transparent hover:shadow-popup' },
    size: { default: '', medium: '', small: '' },
    type: { inner: 'rounded-control bg-surface-container' },
  },
  defaultVariants: { bordered: true, size: 'default' },
});

export interface CardTabItem {
  key: string;
  label?: JSX.Element;
  tab?: JSX.Element;
  disabled?: boolean;
}
export interface CardSemanticStyles {
  root?: JSX.CSSProperties;
  header?: JSX.CSSProperties;
  body?: JSX.CSSProperties;
  extra?: JSX.CSSProperties;
  title?: JSX.CSSProperties;
  actions?: JSX.CSSProperties;
  cover?: JSX.CSSProperties;
}
export interface CardSemanticClasses {
  root?: string;
  header?: string;
  body?: string;
  extra?: string;
  title?: string;
  actions?: string;
  cover?: string;
}
export interface CardProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: JSX.Element;
  extra?: JSX.Element;
  cover?: JSX.Element;
  bordered?: boolean;
  variant?: 'borderless' | 'outlined';
  hoverable?: boolean;
  loading?: boolean;
  size?: 'default' | 'medium' | 'small';
  type?: 'inner';
  bodyClass?: string;
  rootClass?: string;
  headStyle?: JSX.CSSProperties;
  bodyStyle?: JSX.CSSProperties;
  actions?: readonly JSX.Element[];
  tabList?: readonly CardTabItem[];
  tabBarExtraContent?: JSX.Element;
  activeTabKey?: string;
  defaultActiveTabKey?: string;
  onTabChange?: (key: string) => void;
  classNames?: CardSemanticClasses;
  styles?: CardSemanticStyles;
}

export function InternalCard(inputProps: CardProps) {
  const props = merge({ variant: 'outlined' as const }, inputProps);
  const [internalTab, setInternalTab] = createSignal(props.defaultActiveTabKey ?? props.tabList?.[0]?.key ?? '', { ownedWrite: true });
  let currentTab = props.defaultActiveTabKey ?? props.tabList?.[0]?.key ?? '';
  const others = omit(props, 'title', 'extra', 'cover', 'bordered', 'variant', 'hoverable', 'loading', 'size', 'type', 'bodyClass', 'rootClass', 'headStyle', 'bodyStyle', 'actions', 'tabList', 'tabBarExtraContent', 'activeTabKey', 'defaultActiveTabKey', 'onTabChange', 'classNames', 'styles', 'children', 'class', 'style');
  const padding = () => props.size === 'small' ? 'p-3' : 'p-6';
  const activeTab = () => props.activeTabKey ?? (internalTab(), currentTab);
  const selectTab = (item: CardTabItem) => {
    if (item.disabled || item.key === activeTab()) return;
    currentTab = item.key;
    if (props.activeTabKey === undefined) setInternalTab(item.key);
    props.onTabChange?.(item.key);
  };
  const bordered = () => props.variant === 'borderless' || props.bordered === false ? false : true;
  const hasHeader = () => props.title || props.extra || props.tabList?.length;
  return (
    <div {...others} style={{ ...props.styles?.root, ...(typeof props.style === 'object' ? props.style : {}) }} class={card({ bordered: bordered(), hoverable: props.hoverable, size: props.size, type: props.type, class: [props.rootClass, props.classNames?.root, props.class as string | undefined] })}>
      <Show when={props.cover}><div class={['[&>*]:block [&>*]:w-full', props.classNames?.cover]} style={props.styles?.cover}>{props.cover}</div></Show>
      <Show when={hasHeader()}>
        <div class={['min-h-14 border-b border-border-secondary', props.size === 'small' ? 'px-3' : 'px-6', props.classNames?.header]} style={{ ...props.headStyle, ...props.styles?.header }}>
          <div class="flex min-h-14 items-center justify-between gap-4">
            <Show when={props.title}><div class={['min-w-0 text-base font-semibold', props.classNames?.title]} style={props.styles?.title}>{props.title}</div></Show>
            <Show when={props.extra}><div class={['ml-auto shrink-0', props.classNames?.extra]} style={props.styles?.extra}>{props.extra}</div></Show>
          </div>
          <Show when={props.tabList?.length}><div class="flex min-w-0 items-end justify-between gap-4"><div role="tablist" class="flex min-w-0 gap-6"><For each={props.tabList}>{(item) => <button type="button" role="tab" aria-selected={activeTab() === item.key ? 'true' : 'false'} disabled={item.disabled} class={['relative h-10 shrink-0 bg-transparent text-sm text-text-secondary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary', activeTab() === item.key ? 'font-semibold text-primary after:block' : 'after:hidden']} onClick={() => selectTab(item)}>{item.label ?? item.tab}</button>}</For></div>{props.tabBarExtraContent}</div></Show>
        </div>
      </Show>
      <div class={[padding(), 'flow-root', props.bodyClass, props.classNames?.body]} style={{ ...props.bodyStyle, ...props.styles?.body }}>
        <Show when={!props.loading} fallback={<Skeleton active paragraph={{ rows: 3 }} />}>{props.children}</Show>
      </div>
      <Show when={props.actions?.length}><div class={['grid min-h-12 border-t border-border-secondary', props.classNames?.actions]} style={{ 'grid-template-columns': `repeat(${props.actions?.length}, minmax(0, 1fr))`, ...props.styles?.actions }}><For each={props.actions}>{(action) => <div class="flex items-center justify-center border-r border-border-secondary px-3 text-text-secondary last:border-r-0">{action}</div>}</For></div></Show>
    </div>
  );
}
