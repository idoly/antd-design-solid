import { createSignal, For, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { tv } from 'tailwind-variants';
import { Skeleton } from '../skeleton';
import type { TabsProps } from '../tabs';

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
export type CardSemanticName = 'root' | 'header' | 'body' | 'extra' | 'title' | 'actions' | 'cover';
export type CardSemanticStyles = Partial<Record<CardSemanticName, JSX.CSSProperties>> | ((info: { props: CardProps }) => Partial<Record<CardSemanticName, JSX.CSSProperties>>);
export type CardSemanticClasses = Partial<Record<CardSemanticName, string>> | ((info: { props: CardProps }) => Partial<Record<CardSemanticName, string>>);
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
  tabProps?: Partial<TabsProps>;
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
  const others = omit(props, 'title', 'extra', 'cover', 'bordered', 'variant', 'hoverable', 'loading', 'size', 'type', 'bodyClass', 'rootClass', 'headStyle', 'bodyStyle', 'actions', 'tabList', 'tabBarExtraContent', 'tabProps', 'activeTabKey', 'defaultActiveTabKey', 'onTabChange', 'classNames', 'styles', 'children', 'class', 'style');
  const padding = () => props.size === 'small' ? 'p-3' : 'p-6';
  const semanticClasses = () => typeof props.classNames === 'function' ? props.classNames({ props }) : props.classNames ?? {};
  const semanticStyles = () => typeof props.styles === 'function' ? props.styles({ props }) : props.styles ?? {};
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
    <div {...others} data-size={props.size ?? 'default'} data-loading={props.loading ? 'true' : undefined} style={{ ...semanticStyles().root, ...(typeof props.style === 'object' ? props.style : {}) }} class={card({ bordered: bordered(), hoverable: props.hoverable, size: props.size, type: props.type, class: [props.rootClass, semanticClasses().root, props.class as string | undefined] })}>
      <Show when={props.cover}><div class={['ads-card-cover [&>*]:block [&>*]:w-full', semanticClasses().cover]} style={semanticStyles().cover}>{props.cover}</div></Show>
      <Show when={hasHeader()}>
        <div class={['ads-card-header min-h-14 border-b border-border-secondary', props.size === 'small' ? 'px-3' : 'px-6', semanticClasses().header]} style={{ ...props.headStyle, ...semanticStyles().header }}>
          <div class="ads-card-header-wrapper flex min-h-14 items-center justify-between gap-4">
            <Show when={props.title}><div class={['ads-card-title min-w-0 text-base font-semibold', semanticClasses().title]} style={semanticStyles().title}>{props.title}</div></Show>
            <Show when={props.extra}><div class={['ads-card-extra ml-auto shrink-0', semanticClasses().extra]} style={semanticStyles().extra}>{props.extra}</div></Show>
          </div>
          <Show when={props.tabList?.length}><div class="ads-card-tabs flex min-w-0 items-end justify-between gap-4"><div role="tablist" class={['flex min-w-0 gap-6', props.tabProps?.class]} style={typeof props.tabProps?.style === 'object' ? props.tabProps.style : undefined}><For each={props.tabList}>{(item) => <button type="button" role="tab" aria-selected={activeTab() === item.key ? 'true' : 'false'} disabled={item.disabled} class={['relative h-10 shrink-0 bg-transparent text-sm text-text-secondary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary', activeTab() === item.key ? 'font-semibold text-primary after:block' : 'after:hidden']} onClick={() => selectTab(item)}>{item.label ?? item.tab}</button>}</For></div>{props.tabBarExtraContent}</div></Show>
        </div>
      </Show>
      <div class={['ads-card-body', padding(), 'flow-root', props.bodyClass, semanticClasses().body]} style={{ ...props.bodyStyle, ...semanticStyles().body }}>
        <Show when={!props.loading} fallback={<Skeleton active paragraph={{ rows: 3 }} />}>{props.children}</Show>
      </div>
      <Show when={props.actions?.length}><div class={['ads-card-actions grid min-h-12 border-t border-border-secondary', semanticClasses().actions]} style={{ 'grid-template-columns': `repeat(${props.actions?.length}, minmax(0, 1fr))`, ...semanticStyles().actions }}><For each={props.actions}>{(action) => <div class="ads-card-action flex items-center justify-center border-r border-border-secondary px-3 text-text-secondary last:border-r-0">{action}</div>}</For></div></Show>
    </div>
  );
}
