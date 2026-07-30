import { createSignal, merge, omit, onCleanup } from 'solid-js';
import type { JSX } from '@solidjs/web';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type ResponsiveBreakpoint = Breakpoint | 'xxxl';
export type BreakpointScreens = Partial<Record<ResponsiveBreakpoint, boolean>>;
export type Gutter = number | Partial<Record<Breakpoint, number>>;

export interface RowProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'style'> {
  align?: 'top' | 'middle' | 'bottom' | 'stretch';
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly';
  gutter?: Gutter | [Gutter, Gutter];
  wrap?: boolean;
  style?: JSX.CSSProperties;
}

export interface ColSize {
  span?: number;
  offset?: number;
  order?: number;
  pull?: number;
  push?: number;
}

export interface ColProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'style'> {
  span?: number;
  offset?: number;
  order?: number;
  pull?: number;
  push?: number;
  flex?: string | number;
  xs?: number | ColSize;
  sm?: number | ColSize;
  md?: number | ColSize;
  lg?: number | ColSize;
  xl?: number | ColSize;
  xxl?: number | ColSize;
  style?: JSX.CSSProperties;
}

const alignValue = { top: 'flex-start', middle: 'center', bottom: 'flex-end', stretch: 'stretch' } as const;
const justifyValue = { start: 'flex-start', end: 'flex-end', center: 'center', 'space-around': 'space-around', 'space-between': 'space-between', 'space-evenly': 'space-evenly' } as const;
const breakpointList: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

const gutterVariables = (prefix: string, gutter: Gutter | undefined): Record<string, string> => {
  if (gutter === undefined) return {};
  if (typeof gutter === 'number') return { [`--ads-row-${prefix}`]: `${gutter}px` };
  return Object.fromEntries(breakpointList.flatMap((breakpoint) => gutter[breakpoint] === undefined ? [] : [[`--ads-row-${prefix}-${breakpoint}`, `${gutter[breakpoint]}px`]]));
};

export function Row(inputProps: RowProps) {
  const props = merge({ align: 'top' as const, justify: 'start' as const, gutter: 0 as Gutter | [Gutter, Gutter], wrap: true }, inputProps);
  const others = omit(props, 'align', 'justify', 'gutter', 'wrap', 'style', 'class');
  const horizontal = () => Array.isArray(props.gutter) ? props.gutter[0] : props.gutter;
  const vertical = () => Array.isArray(props.gutter) ? props.gutter[1] : 0;
  const style = () => ({
    ...gutterVariables('gutter-x', horizontal()),
    ...gutterVariables('gutter-y', vertical()),
    'align-items': alignValue[props.align],
    'justify-content': justifyValue[props.justify],
    'flex-wrap': props.wrap ? 'wrap' : 'nowrap',
    ...props.style,
  } as JSX.CSSProperties);
  return <div {...others} class={['ads-row flex min-w-0', props.class]} style={style()}>{props.children}</div>;
}

const sizeConfig = (value: number | ColSize | undefined): ColSize => typeof value === 'number' ? { span: value } : value ?? {};

export function Col(inputProps: ColProps) {
  const props = merge({ span: 24, offset: 0, order: 0, pull: 0, push: 0 }, inputProps);
  const others = omit(props, 'span', 'offset', 'order', 'pull', 'push', 'flex', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'style', 'class');
  const variables = () => {
    const result: Record<string, string | number> = {
      '--ads-col-span': props.span,
      '--ads-col-offset': props.offset,
      '--ads-col-order': props.order,
      '--ads-col-pull': props.pull,
      '--ads-col-push': props.push,
    };
    for (const breakpoint of breakpointList) {
      const config = sizeConfig(props[breakpoint]);
      for (const key of ['span', 'offset', 'order', 'pull', 'push'] as const) {
        if (config[key] !== undefined) result[`--ads-col-${key}-${breakpoint}`] = config[key]!;
      }
    }
    return result;
  };
  const style = () => ({
    ...variables(),
    flex: props.flex === undefined ? undefined : typeof props.flex === 'number' ? `${props.flex} ${props.flex} auto` : props.flex,
    ...props.style,
  } as JSX.CSSProperties);
  return <div {...others} class={['ads-col relative min-h-px min-w-0', props.class]} style={style()}>{props.children}</div>;
}

const breakpointQueries: Record<ResponsiveBreakpoint, string> = {
  xs: '(max-width: 575px)', sm: '(min-width: 576px)', md: '(min-width: 768px)', lg: '(min-width: 992px)', xl: '(min-width: 1200px)', xxl: '(min-width: 1600px)', xxxl: '(min-width: 2000px)',
};

export function useBreakpoint(): () => BreakpointScreens {
  const initial = Object.fromEntries(Object.keys(breakpointQueries).map((key) => [key, false])) as BreakpointScreens;
  const [screens, setScreens] = createSignal<BreakpointScreens>(initial, { ownedWrite: true });
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    const entries = Object.entries(breakpointQueries) as [ResponsiveBreakpoint, string][];
    const media = entries.map(([key, query]) => {
      const list = window.matchMedia(query);
      const update = () => setScreens((current) => ({ ...current, [key]: list.matches }));
      update();
      list.addEventListener?.('change', update);
      return { list, update };
    });
    onCleanup(() => media.forEach(({ list, update }) => list.removeEventListener?.('change', update)));
  }
  return screens;
}

export const Grid = { Row, Col, useBreakpoint };
