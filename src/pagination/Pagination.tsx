import { createSignal, For, merge, omit, Show, untrack } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { tv } from 'tailwind-variants';
import { useConfig } from '../config-provider';

const pagination = tv({
  slots: {
    root: 'ads-pagination flex min-h-8 flex-wrap items-center gap-2 text-sm text-text-secondary',
    item: 'ads-pagination-item inline-flex shrink-0 items-center justify-center rounded-control border border-border bg-surface text-text outline-none hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:border-border disabled:text-text-disabled',
  },
  variants: {
    size: {
      small: { root: 'gap-1 text-xs', item: 'size-6 rounded-small' },
      default: { item: 'size-8' },
    },
    active: {
      true: { item: 'border-primary bg-primary text-white hover:bg-primary-hover hover:text-white' },
    },
  },
  defaultVariants: { size: 'default' },
});

export type PaginationItemType = 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next';
export type PaginationSemanticName = 'root' | 'item';
export type PaginationSemanticClassNames = Partial<Record<PaginationSemanticName, string>>;
export type PaginationSemanticStyles = Partial<Record<PaginationSemanticName, JSX.CSSProperties>>;

export interface PaginationProps extends Omit<JSX.HTMLAttributes<HTMLElement>, 'onChange' | 'children'> {
  current?: number;
  defaultCurrent?: number;
  total?: number;
  pageSize?: number;
  defaultPageSize?: number;
  pageSizeOptions?: readonly number[];
  showSizeChanger?: boolean;
  showQuickJumper?: boolean | { goButton?: JSX.Element };
  showTotal?: (total: number, range: [number, number]) => JSX.Element;
  hideOnSinglePage?: boolean;
  simple?: boolean;
  disabled?: boolean;
  size?: 'small' | 'default';
  itemRender?: (page: number, type: PaginationItemType, originalElement: JSX.Element) => JSX.Element;
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
  classNames?: PaginationSemanticClassNames;
  styles?: PaginationSemanticStyles;
}

export function Pagination(inputProps: PaginationProps) {
  const config = useConfig();
  const props = merge({
    defaultCurrent: 1,
    total: 0,
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50, 100] as readonly number[],
    size: 'default' as const,
  }, config.componentDefaults('pagination') as Partial<PaginationProps>, inputProps);
  const initial = untrack(() => ({ current: props.defaultCurrent, pageSize: props.defaultPageSize, itemRender: props.itemRender }));
  const [internalCurrent, setInternalCurrent] = createSignal(initial.current, { ownedWrite: true });
  const [internalPageSize, setInternalPageSize] = createSignal(initial.pageSize, { ownedWrite: true });
  const [quickPage, setQuickPage] = createSignal('');
  let quickPageValue = '';
  const others = omit(
    props,
    'current', 'defaultCurrent', 'total', 'pageSize', 'defaultPageSize', 'pageSizeOptions',
    'showSizeChanger', 'showQuickJumper', 'showTotal', 'hideOnSinglePage', 'simple',
    'disabled', 'size', 'itemRender', 'onChange', 'onShowSizeChange', 'classNames', 'styles', 'class', 'style',
  );
  const pageSize = () => Math.max(1, props.pageSize ?? internalPageSize());
  const pageCount = (size = pageSize()) => Math.max(1, Math.ceil(props.total / size));
  const current = () => Math.min(pageCount(), Math.max(1, props.current ?? internalCurrent()));
  const range = (): [number, number] => props.total === 0
    ? [0, 0]
    : [(current() - 1) * pageSize() + 1, Math.min(current() * pageSize(), props.total)];
  const styles = () => pagination({ size: props.size });
  const items = (): { type: 'page' | 'jump-prev' | 'jump-next'; page: number }[] => {
    const total = pageCount();
    if (total <= 7) return Array.from({ length: total }, (_, index) => ({ type: 'page', page: index + 1 }));
    const active = current();
    const candidates = [...new Set([1, active - 2, active - 1, active, active + 1, active + 2, total].filter((page) => page >= 1 && page <= total))];
    const result: { type: 'page' | 'jump-prev' | 'jump-next'; page: number }[] = [];
    candidates.forEach((page, index) => {
      if (index > 0 && page - candidates[index - 1] > 1) {
        const type = page < active ? 'jump-prev' : 'jump-next';
        result.push({ type, page: type === 'jump-prev' ? Math.max(1, active - 5) : Math.min(total, active + 5) });
      }
      result.push({ type: 'page', page });
    });
    return result;
  };
  const setPage = (page: number, size = pageSize()) => {
    if (props.disabled) return;
    const next = Math.min(pageCount(size), Math.max(1, page));
    if (props.current === undefined) setInternalCurrent(next);
    props.onChange?.(next, size);
  };
  const setPageSize = (size: number) => {
    const nextCurrent = Math.min(current(), pageCount(size));
    if (props.pageSize === undefined) setInternalPageSize(size);
    if (props.current === undefined) setInternalCurrent(nextCurrent);
    props.onShowSizeChange?.(nextCurrent, size);
    props.onChange?.(nextCurrent, size);
  };
  const renderItem = (page: number, type: PaginationItemType, element: JSX.Element) => initial.itemRender?.(page, type, element) ?? element;
  const goQuick = () => {
    const value = Number(quickPageValue);
    if (Number.isFinite(value) && value >= 1) setPage(value);
    quickPageValue = '';
    setQuickPage('');
  };

  return (
    <Show when={!(props.hideOnSinglePage && pageCount() <= 1)}>
      <nav {...others} data-size={props.size} aria-label={props['aria-label'] ?? 'Pagination'} class={styles().root({ class: [props.class as string | undefined, props.classNames?.root] })} style={{ ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}>
        <Show when={props.showTotal}><span class="mr-auto">{props.showTotal?.(props.total, range())}</span></Show>
        {renderItem(current() - 1, 'prev', (
          <button type="button" aria-label={config.locale().Pagination?.prev_page ?? 'Previous page'} disabled={props.disabled || current() <= 1} class={styles().item({ class: props.classNames?.item })} style={props.styles?.item} onClick={() => setPage(current() - 1)}>&lt;</button>
        ))}
        <Show when={props.simple} fallback={
          <For each={items()}>{(item) => item.type === 'page'
            ? renderItem(item.page, 'page', (
              <button
                type="button"
                aria-label={`Page ${item.page}`}
                aria-current={current() === item.page ? 'page' : undefined}
                disabled={props.disabled}
                class={pagination({ size: props.size, active: current() === item.page }).item({ class: props.classNames?.item })}
                style={props.styles?.item}
                onClick={() => setPage(item.page)}
              >
                {item.page}
              </button>
            ))
            : renderItem(item.page, item.type, (
              <button type="button" aria-label={item.type === 'jump-prev' ? 'Jump back 5 pages' : 'Jump forward 5 pages'} disabled={props.disabled} class={styles().item({ class: props.classNames?.item })} style={props.styles?.item} onClick={() => setPage(item.page)}>...</button>
            ))}
          </For>
        }>
          <span class="inline-flex items-center gap-1">
            <input
              aria-label="Current page"
              inputmode="numeric"
              value={current()}
              disabled={props.disabled}
              class="h-8 w-12 rounded-control border border-border bg-surface px-2 text-center text-text outline-none focus:border-primary"
              onChange={(event) => setPage(Number(event.currentTarget.value))}
            />
            <span>/ {pageCount()}</span>
          </span>
        </Show>
        {renderItem(current() + 1, 'next', (
          <button type="button" aria-label={config.locale().Pagination?.next_page ?? 'Next page'} disabled={props.disabled || current() >= pageCount()} class={styles().item({ class: props.classNames?.item })} style={props.styles?.item} onClick={() => setPage(current() + 1)}>&gt;</button>
        ))}
        <Show when={props.showSizeChanger}>
          <select
            aria-label="Rows per page"
            value={pageSize()}
            disabled={props.disabled}
            class={props.size === 'small' ? 'h-6 rounded-small border border-border bg-surface px-1 text-xs text-text outline-none focus:border-primary' : 'h-8 rounded-control border border-border bg-surface px-2 text-text outline-none focus:border-primary'}
            onChange={(event) => setPageSize(Number(event.currentTarget.value))}
          >
            <For each={props.pageSizeOptions}>{(option) => <option value={option}>{option} / page</option>}</For>
          </select>
        </Show>
        <Show when={props.showQuickJumper}>
          <span class="inline-flex items-center gap-1">
            <span>{config.locale().Pagination?.jump_to ?? 'Go to'}</span>
            <input
              aria-label="Quick jump page"
              inputmode="numeric"
              value={quickPage()}
              disabled={props.disabled}
              class="h-8 w-12 rounded-control border border-border bg-surface px-2 text-center text-text outline-none focus:border-primary"
              onInput={(event) => {
                quickPageValue = event.currentTarget.value;
                setQuickPage(quickPageValue);
              }}
              onKeyDown={(event) => { if (event.key === 'Enter') goQuick(); }}
            />
            <Show when={typeof props.showQuickJumper === 'object' && props.showQuickJumper.goButton}>
              <button type="button" class="h-8 rounded-control border border-border bg-surface px-3 text-text hover:border-primary hover:text-primary" onClick={goQuick}>{typeof props.showQuickJumper === 'object' && props.showQuickJumper.goButton}</button>
            </Show>
          </span>
        </Show>
      </nav>
    </Show>
  );
}
