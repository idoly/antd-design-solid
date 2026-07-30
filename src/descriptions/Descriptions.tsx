import { For, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';

export type DescriptionsSemanticName = 'root' | 'header' | 'title' | 'extra' | 'label' | 'content';
export type DescriptionsSemanticClassNames = Partial<Record<DescriptionsSemanticName, string>>;
export type DescriptionsSemanticStyles = Partial<Record<DescriptionsSemanticName, JSX.CSSProperties>>;

export interface DescriptionItemType {
  key?: string | number;
  label?: JSX.Element;
  children?: JSX.Element;
  span?: number | 'filled';
  class?: string;
  labelStyle?: JSX.CSSProperties;
  contentStyle?: JSX.CSSProperties;
}

export interface DescriptionsProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: JSX.Element;
  extra?: JSX.Element;
  items?: readonly DescriptionItemType[];
  bordered?: boolean;
  colon?: boolean;
  column?: number;
  layout?: 'horizontal' | 'vertical';
  size?: 'small' | 'middle' | 'default';
  labelStyle?: JSX.CSSProperties;
  contentStyle?: JSX.CSSProperties;
  classNames?: DescriptionsSemanticClassNames;
  styles?: DescriptionsSemanticStyles;
}

export interface DescriptionsItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
  label?: JSX.Element;
  span?: number;
}

export function DescriptionsItem(props: DescriptionsItemProps) {
  const others = omit(props, 'label', 'span', 'children', 'class');
  return <div {...others} class={['ads-descriptions-item min-w-0', props.class]}><span class="mr-2 text-text-secondary">{props.label}:</span>{props.children}</div>;
}

export function Descriptions(inputProps: DescriptionsProps) {
  const props = merge({ items: [] as readonly DescriptionItemType[], bordered: false, colon: true, column: 3, layout: 'horizontal' as const, size: 'default' as const }, inputProps);
  const others = omit(props, 'title', 'extra', 'items', 'bordered', 'colon', 'column', 'layout', 'size', 'labelStyle', 'contentStyle', 'classNames', 'styles', 'children', 'class', 'style');
  const padding = () => props.size === 'small' ? 'px-2 py-1.5' : props.size === 'middle' ? 'px-3 py-2' : 'px-4 py-3';
  const span = (item: DescriptionItemType) => item.span === 'filled' ? props.column : Math.min(props.column, Math.max(1, item.span ?? 1));

  return (
    <div {...others} class={['ads-descriptions min-w-0 text-sm text-text', props.class, props.classNames?.root]} style={{ ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}>
      <Show when={props.title || props.extra}>
        <div class={['mb-4 flex min-h-8 items-center justify-between gap-4', props.classNames?.header]} style={props.styles?.header}>
          <Show when={props.title}><div class={['min-w-0 text-base font-semibold', props.classNames?.title]} style={props.styles?.title}>{props.title}</div></Show>
          <Show when={props.extra}><div class={['ml-auto shrink-0', props.classNames?.extra]} style={props.styles?.extra}>{props.extra}</div></Show>
        </div>
      </Show>
      <div
        class={props.bordered ? 'grid overflow-hidden rounded-surface border border-border-secondary bg-surface' : 'grid gap-x-6 gap-y-3'}
        style={{ 'grid-template-columns': `repeat(${props.column}, minmax(0, 1fr))` }}
      >
        <For each={props.items}>{(item) => (
          <div
            class={[
              'min-w-0',
              props.bordered ? 'border-b border-r border-border-secondary last:border-b-0' : '',
              props.layout === 'vertical' ? 'flex flex-col' : 'flex items-baseline',
              item.class,
            ]}
            style={{ 'grid-column': `span ${span(item)} / span ${span(item)}` }}
          >
            <Show when={item.label !== undefined}>
              <div
                class={[
                  'shrink-0 text-text-secondary',
                  props.bordered ? ['bg-surface-container font-semibold', padding()] : props.layout === 'vertical' ? 'mb-1' : 'mr-2',
                  props.classNames?.label,
                ]}
                style={{ ...props.labelStyle, ...item.labelStyle, ...props.styles?.label }}
              >
                {item.label}<Show when={props.colon && props.layout === 'horizontal'}>:</Show>
              </div>
            </Show>
            <div class={['min-w-0 flex-1', props.bordered ? padding() : '', props.classNames?.content]} style={{ ...props.contentStyle, ...item.contentStyle, ...props.styles?.content }}>{item.children}</div>
          </div>
        )}</For>
        {props.children}
      </div>
    </div>
  );
}

Descriptions.Item = DescriptionsItem;
