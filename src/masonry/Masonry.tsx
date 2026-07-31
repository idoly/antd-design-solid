import { createEffect, createProjection, createSignal, For, merge, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { useConfig } from '../config-provider';
import type { Breakpoint, Gutter } from '../grid';

export type MasonrySemanticName = 'root' | 'item';
export type MasonrySemanticClassNames = Partial<Record<MasonrySemanticName, string>>;
export type MasonrySemanticStyles = Partial<Record<MasonrySemanticName, JSX.CSSProperties>>;

export interface MasonryItemType<T = unknown> {
  key: string | number;
  column?: number;
  height?: number;
  children?: JSX.Element;
  data: T;
}

export interface MasonryProps<T = unknown> extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  gutter?: Gutter | [Gutter, Gutter];
  items?: readonly MasonryItemType<T>[];
  itemRender?: (item: MasonryItemType<T> & { index: number }) => JSX.Element;
  columns?: number | Partial<Record<Breakpoint, number>>;
  onLayoutChange?: (sortInfo: { key: string | number; column: number }[]) => void;
  fresh?: boolean;
  classNames?: MasonrySemanticClassNames;
  styles?: MasonrySemanticStyles;
}

const breakpointWidths = { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1600 } as const;
const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

const responsiveValue = (value: number | Partial<Record<Breakpoint, number>> | undefined, width: number, fallback: number) => {
  if (typeof value === 'number') return value;
  let result = fallback;
  for (const breakpoint of breakpointOrder) if (width >= breakpointWidths[breakpoint] && value?.[breakpoint] !== undefined) result = value[breakpoint]!;
  return result;
};

export function Masonry<T = unknown>(inputProps: MasonryProps<T>) {
  const config = useConfig();
  const props = merge({ items: [] as readonly MasonryItemType<T>[], columns: 3 as number | Partial<Record<Breakpoint, number>>, gutter: 16 as Gutter | [Gutter, Gutter] }, config.componentDefaults('masonry') as Partial<MasonryProps<T>>, inputProps);
  const [viewportWidth, setViewportWidth] = createSignal(typeof window === 'undefined' ? 0 : window.innerWidth, { ownedWrite: true });
  const others = omit(props, 'gutter', 'items', 'itemRender', 'columns', 'onLayoutChange', 'fresh', 'classNames', 'styles', 'class', 'style');
  const horizontalGutter = () => Array.isArray(props.gutter) ? props.gutter[0] : props.gutter;
  const verticalGutter = () => Array.isArray(props.gutter) ? props.gutter[1] : props.gutter;
  const gutter = (value: Gutter) => responsiveValue(value, viewportWidth(), 0);
  const columnCount = () => Math.max(1, Math.floor(responsiveValue(props.columns, viewportWidth(), 1)));
  const layout = createProjection(() => {
    const columns = Array.from({ length: columnCount() }, (_, column) => ({ key: column, column, items: [] as { key: string | number; item: MasonryItemType<T>; index: number }[] }));
    const heights = Array.from({ length: columnCount() }, () => 0);
    props.items.forEach((item, index) => {
      const requested = item.column === undefined ? -1 : Math.min(columnCount() - 1, Math.max(0, item.column));
      const column = requested >= 0 ? requested : heights.indexOf(Math.min(...heights));
      columns[column].items.push({ key: item.key, item, index });
      heights[column] += (item.height ?? 0) + gutter(verticalGutter());
    });
    return columns;
  }, [], { key: 'key' });

  createEffect(
    () => layout.flatMap(({ column, items }) => items.map(({ item }) => ({ key: item.key, column }))),
    (sortInfo) => { props.onLayoutChange?.(sortInfo); },
  );
  createEffect(
    () => true,
    () => {
      const resize = () => setViewportWidth(window.innerWidth);
      window.addEventListener('resize', resize, { passive: true });
      return () => window.removeEventListener('resize', resize);
    },
  );

  return (
    <div {...others} class={['ads-masonry flex min-w-0 items-start', props.class, props.classNames?.root]} style={{ ...(typeof props.style === 'object' ? props.style : {}), gap: `${gutter(horizontalGutter())}px`, ...props.styles?.root }}>
      <For each={layout}>{(column) => (
        <div class="flex min-w-0 flex-1 flex-col" style={{ gap: `${gutter(verticalGutter())}px` }} data-column={column.column}>
          <For each={column.items}>{({ item, index }) => (
            <div class={['ads-masonry-item min-w-0', props.classNames?.item]} style={{ height: item.height ? `${item.height}px` : undefined, ...props.styles?.item }} data-key={String(item.key)}>
              {props.itemRender ? props.itemRender({ ...item, index }) : item.children}
            </div>
          )}</For>
        </div>
      )}</For>
    </div>
  );
}
