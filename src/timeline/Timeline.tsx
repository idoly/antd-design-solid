import { For, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { useConfig } from '../config-provider';

export type TimelineSemanticName = 'root' | 'item' | 'itemWrapper' | 'itemIcon' | 'itemSection' | 'itemHeader' | 'itemTitle' | 'itemContent' | 'itemRail';
export type TimelineSemanticClassNames = Partial<Record<TimelineSemanticName, string>>;
export type TimelineSemanticStyles = Partial<Record<TimelineSemanticName, JSX.CSSProperties>>;

export interface TimelineItemType {
  key?: string | number;
  content?: JSX.Element;
  title?: JSX.Element;
  icon?: JSX.Element;
  loading?: boolean;
  placement?: 'start' | 'end';
  children?: JSX.Element;
  label?: JSX.Element;
  color?: 'blue' | 'red' | 'green' | 'gray' | string;
  dot?: JSX.Element;
  position?: 'left' | 'right' | 'start' | 'end';
  class?: string;
}

export interface TimelineProps extends Omit<JSX.HTMLAttributes<HTMLOListElement>, 'children'> {
  items?: readonly TimelineItemType[];
  mode?: 'start' | 'end' | 'alternate' | 'left' | 'right';
  orientation?: 'vertical' | 'horizontal';
  titleSpan?: number | string;
  variant?: 'filled' | 'outlined';
  pending?: boolean | JSX.Element;
  pendingDot?: JSX.Element;
  reverse?: boolean;
  children?: JSX.Element;
  classNames?: TimelineSemanticClassNames;
  styles?: TimelineSemanticStyles;
}

export interface TimelineItemProps extends JSX.HTMLAttributes<HTMLLIElement> {
  label?: JSX.Element;
  color?: TimelineItemType['color'];
  dot?: JSX.Element;
  position?: TimelineItemType['position'];
}

const dotColor = (color?: TimelineItemType['color']) => {
  if (color === 'red') return 'var(--ads-color-error)';
  if (color === 'green') return 'var(--ads-color-success)';
  if (color === 'gray') return 'var(--ads-color-text-disabled)';
  if (!color || color === 'blue') return 'var(--ads-color-primary)';
  return color;
};

export function TimelineItem(props: TimelineItemProps) {
  const others = omit(props, 'label', 'color', 'dot', 'position', 'children', 'class');
  return (
    <li {...others} class={['ads-timeline-item relative grid min-h-14 grid-cols-[120px_24px_minmax(0,1fr)] pb-5', props.class]}>
      <div class="pr-3 text-right text-sm text-text-secondary">{props.label}</div>
      <div class="relative flex justify-center">
        <span aria-hidden="true" class="absolute bottom-[-20px] top-3 w-px bg-border-secondary" />
        <Show when={props.dot} fallback={<span aria-hidden="true" class="relative z-10 mt-1.5 size-2.5 rounded-full border-2 bg-surface" style={{ 'border-color': dotColor(props.color) }} />}>
          <span class="relative z-10 inline-flex bg-surface">{props.dot}</span>
        </Show>
      </div>
      <div class="min-w-0 pl-3 text-sm leading-[22px] text-text">{props.children}</div>
    </li>
  );
}

export function Timeline(inputProps: TimelineProps) {
  const config = useConfig();
  const props = merge({ items: [] as readonly TimelineItemType[], mode: 'start' as const, orientation: 'vertical' as const, titleSpan: 12, variant: 'outlined' as const, reverse: false }, config.componentDefaults('timeline') as Partial<TimelineProps>, inputProps);
  const others = omit(props, 'items', 'mode', 'orientation', 'titleSpan', 'variant', 'pending', 'pendingDot', 'reverse', 'classNames', 'styles', 'children', 'class', 'style');
  const items = () => {
    const base = props.reverse ? [...props.items].reverse() : [...props.items];
    if (props.pending) base.push({ key: '__pending', content: props.pending === true ? 'Loading...' : props.pending, icon: props.pendingDot, loading: true });
    return base;
  };
  const placement = (item: TimelineItemType, index: number): 'start' | 'end' => {
    const legacy = item.position === 'left' ? 'start' : item.position === 'right' ? 'end' : item.position;
    if (item.placement ?? legacy) return (item.placement ?? legacy)!;
    if (props.mode === 'end' || props.mode === 'right') return 'end';
    return props.mode === 'alternate' && index % 2 === 1 ? 'end' : 'start';
  };
  const titleWidth = () => typeof props.titleSpan === 'number' ? `${Math.min(24, Math.max(0, props.titleSpan)) / 24 * 100}%` : props.titleSpan;

  return (
    <ol {...others} class={['ads-timeline min-w-0', props.orientation === 'horizontal' ? 'flex overflow-x-auto' : 'flex flex-col', props.class, props.classNames?.root]} style={{ ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}>
      <For each={items()}>{(item, index) => {
        const itemTitle = () => item.title ?? item.label;
        const itemContent = () => item.content ?? item.children;
        const itemIcon = () => item.icon ?? item.dot;
        return (
          <li data-placement={placement(item, index())} class={['ads-timeline-item relative min-w-0', props.orientation === 'horizontal' ? 'min-w-48 flex-1 pr-4' : 'pb-5', item.class, props.classNames?.item]} style={props.styles?.item}>
            <div class={['flex min-w-0 gap-3', props.orientation === 'horizontal' ? 'flex-col' : 'items-start', props.classNames?.itemWrapper]} style={props.styles?.itemWrapper}>
              <span class={['relative z-10 inline-flex size-5 shrink-0 items-center justify-center rounded-full', props.variant === 'filled' ? 'bg-primary text-white' : 'bg-surface', props.classNames?.itemIcon]} style={{ color: dotColor(item.color), 'border-color': dotColor(item.color), ...props.styles?.itemIcon }} aria-busy={item.loading ? 'true' : undefined}>
                <Show when={itemIcon()} fallback={<span aria-hidden="true" class={item.loading ? 'ads-spin size-3 rounded-full border-2 border-current border-r-transparent' : 'size-2.5 rounded-full border-2 border-current bg-surface'} />}>{itemIcon()}</Show>
              </span>
              <div class={['min-w-0 flex-1', props.classNames?.itemSection]} style={props.styles?.itemSection}>
                <div class={['flex min-w-0 items-center gap-3', props.classNames?.itemHeader]} style={props.styles?.itemHeader}>
                  <Show when={itemTitle()}><div class={['min-w-0 shrink-0 text-sm font-semibold text-text', props.classNames?.itemTitle]} style={{ width: titleWidth(), ...props.styles?.itemTitle }}>{itemTitle()}</div></Show>
                  <Show when={index() < items().length - 1}><span aria-hidden="true" class={['h-px min-w-4 flex-1 bg-border-secondary', props.classNames?.itemRail]} style={props.styles?.itemRail} /></Show>
                </div>
                <Show when={itemContent()}><div class={['mt-1 min-w-0 text-sm leading-[22px] text-text-secondary', props.classNames?.itemContent]} style={props.styles?.itemContent}>{itemContent()}</div></Show>
              </div>
            </div>
          </li>
        );
      }}</For>
      {props.children}
    </ol>
  );
}

Timeline.Item = TimelineItem;
