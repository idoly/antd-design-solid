import { createContext, For, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { useConfig } from '../config-provider';

export interface SpaceContextValue { direction: () => 'horizontal' | 'vertical'; size: () => SpaceSize | [SpaceSize, SpaceSize] }
export const SpaceContext = createContext<SpaceContextValue | null>(null);

export type SpaceSize = 'small' | 'middle' | 'large' | number;
export type SpaceSemanticName = 'root' | 'item' | 'separator';
export type SpaceSemanticClassNames = Partial<Record<SpaceSemanticName, string>>;
export type SpaceSemanticStyles = Partial<Record<SpaceSemanticName, JSX.CSSProperties>>;

export interface SpaceProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'style'> {
  direction?: 'horizontal' | 'vertical';
  orientation?: 'horizontal' | 'vertical';
  vertical?: boolean;
  size?: SpaceSize | [SpaceSize, SpaceSize];
  align?: 'start' | 'end' | 'center' | 'baseline';
  wrap?: boolean;
  split?: JSX.Element;
  separator?: JSX.Element;
  style?: JSX.CSSProperties;
  classNames?: SpaceSemanticClassNames;
  styles?: SpaceSemanticStyles;
}

export interface SpaceAddonProps extends JSX.HTMLAttributes<HTMLDivElement> {
  variant?: 'outlined' | 'borderless' | 'filled' | 'underlined';
  disabled?: boolean;
  status?: 'error' | 'warning';
}

export interface SpaceCompactProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'style'> {
  direction?: 'horizontal' | 'vertical';
  block?: boolean;
  size?: 'small' | 'middle' | 'large';
  style?: JSX.CSSProperties;
}

const sizeValue = (size: SpaceSize): string => {
  if (typeof size === 'number') return `${size}px`;
  if (size === 'small') return '8px';
  if (size === 'large') return '24px';
  return '16px';
};

export function Space(inputProps: SpaceProps) {
  const config = useConfig();
  const props = merge({ direction: 'horizontal' as const, size: 'small' as SpaceSize, wrap: false }, config.componentDefaults('space') as Partial<SpaceProps>, inputProps);
  const others = omit(props, 'direction', 'orientation', 'vertical', 'size', 'align', 'wrap', 'split', 'separator', 'classNames', 'styles', 'style', 'class', 'children');
  const items = () => Array.isArray(props.children) ? props.children : props.children === undefined || props.children === null ? [] : [props.children];
  const style = (): JSX.CSSProperties => {
    const size = Array.isArray(props.size) ? `${sizeValue(props.size[1])} ${sizeValue(props.size[0])}` : sizeValue(props.size);
    return {
      display: 'inline-flex',
      'flex-direction': (props.orientation ?? (props.vertical ? 'vertical' : props.direction)) === 'vertical' ? 'column' : 'row',
      'align-items': props.align === 'start' ? 'flex-start' : props.align === 'end' ? 'flex-end' : props.align,
      'flex-wrap': props.wrap ? 'wrap' : 'nowrap',
      gap: size,
      ...props.style,
      ...props.styles?.root,
    };
  };

  const context: SpaceContextValue = { direction: () => props.orientation ?? (props.vertical ? 'vertical' : props.direction), size: () => props.size };
  return (
    <SpaceContext value={context}>
    <div {...others} class={['ads-space max-w-full', props.class, props.classNames?.root]} style={style()}>
      <For each={items()}>{(item, index) => (
        <>
          <span class={['ads-space-item min-w-0', props.classNames?.item]} style={props.styles?.item}>{item}</span>
          <Show when={(props.separator ?? props.split) && index() < items().length - 1}><span class={['ads-space-split text-text-secondary', props.classNames?.separator]} style={props.styles?.separator}>{props.separator ?? props.split}</span></Show>
        </>
      )}</For>
    </div>
    </SpaceContext>
  );
}

export function SpaceCompact(inputProps: SpaceCompactProps) {
  const props = merge({ direction: 'horizontal' as const, block: false, size: 'middle' as const }, inputProps);
  const others = omit(props, 'direction', 'block', 'size', 'style', 'class');
  const vertical = () => props.direction === 'vertical';
  return (
    <div
      {...others}
      class={[
        'ads-space-compact inline-flex [&>*]:relative [&>*]:z-0 hover:[&>*]:z-10 focus-within:[&>*]:z-10',
        vertical()
          ? 'flex-col [&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none'
          : 'flex-row [&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none',
        props.block ? 'flex w-full [&>*]:min-w-0 [&>*]:flex-1' : '',
        props.class,
      ]}
      style={props.style}
    >
      {props.children}
    </div>
  );
}

export function SpaceAddon(props: SpaceAddonProps) {
  const others = omit(props, 'variant', 'disabled', 'status', 'class', 'children');
  return <div {...others} aria-disabled={props.disabled ? 'true' : undefined} class={['ads-space-addon inline-flex min-h-8 items-center border border-border bg-surface-container px-[11px] text-sm text-text-secondary', props.variant === 'borderless' ? 'border-transparent' : '', props.variant === 'filled' ? 'bg-surface-container' : '', props.variant === 'underlined' ? 'border-x-0 border-t-0 bg-transparent' : '', props.status === 'error' ? 'border-error' : props.status === 'warning' ? 'border-warning' : '', props.disabled ? 'text-text-disabled' : '', props.class]}>{props.children}</div>;
}
