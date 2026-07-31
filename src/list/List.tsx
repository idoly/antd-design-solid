import { createSignal, For, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { Empty } from '../empty';
import { Pagination, type PaginationProps } from '../pagination';
import { Spin, type SpinProps } from '../spin';

export interface ListGridType {
  gutter?: number;
  column?: number;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
  xxxl?: number;
}

export interface ListProps<ItemType> extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
  dataSource?: readonly ItemType[];
  children?: JSX.Element;
  renderItem?: (item: ItemType, index: number) => JSX.Element;
  rowKey?: keyof ItemType | ((item: ItemType) => string | number);
  bordered?: boolean;
  split?: boolean;
  loading?: boolean | SpinProps;
  size?: 'small' | 'default' | 'large';
  itemLayout?: 'horizontal' | 'vertical';
  grid?: ListGridType;
  header?: JSX.Element;
  footer?: JSX.Element;
  extra?: JSX.Element;
  loadMore?: JSX.Element;
  rootClassName?: string;
  locale?: { emptyText?: JSX.Element };
  pagination?: false | PaginationProps;
}

export type ListItemSemanticName = 'extra' | 'actions';
export type ListItemSemanticClassNames = Partial<Record<ListItemSemanticName, string>>;
export type ListItemSemanticStyles = Partial<Record<ListItemSemanticName, JSX.CSSProperties>>;

export interface ListItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
  actions?: readonly JSX.Element[];
  extra?: JSX.Element;
  classNames?: ListItemSemanticClassNames;
  styles?: ListItemSemanticStyles;
}

export interface ListItemMetaProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title'> {
  avatar?: JSX.Element;
  title?: JSX.Element;
  description?: JSX.Element;
}

export function ListItemMeta(props: ListItemMetaProps) {
  const others = omit(props, 'avatar', 'title', 'description', 'class');
  return (
    <div {...others} class={['ads-list-item-meta flex min-w-0 flex-1 items-start', props.class]}>
      <Show when={props.avatar}><div class="ads-list-item-meta-avatar shrink-0">{props.avatar}</div></Show>
      <div class="ads-list-item-meta-content min-w-0 flex-1">
        <Show when={props.title}><div class="ads-list-item-meta-title font-semibold leading-[22px] text-text">{props.title}</div></Show>
        <Show when={props.description}><div class="ads-list-item-meta-description text-sm leading-[22px] text-text-secondary">{props.description}</div></Show>
      </div>
    </div>
  );
}

export function ListItem(props: ListItemProps) {
  const others = omit(props, 'actions', 'extra', 'classNames', 'styles', 'children', 'class');
  return (
    <div {...others} role="listitem" class={['ads-list-item flex min-w-0 items-center gap-4', props.class]}>
      <div class="ads-list-item-main min-w-0 flex-1">{props.children}</div>
      <Show when={props.actions?.length}><ul class={['flex shrink-0 items-center divide-x divide-border-secondary', props.classNames?.actions]} style={props.styles?.actions}><For each={props.actions}>{(action) => <li class="px-2 first:pl-0 last:pr-0">{action}</li>}</For></ul></Show>
      <Show when={props.extra}><div class={['shrink-0', props.classNames?.extra]} style={props.styles?.extra}>{props.extra}</div></Show>
    </div>
  );
}

function ListRoot<ItemType>(inputProps: ListProps<ItemType>) {
  const props = merge({ dataSource: [] as readonly ItemType[], bordered: false, split: true, size: 'default' as const, itemLayout: 'horizontal' as const }, inputProps);
  const pagination = () => props.pagination === false ? undefined : props.pagination;
  const [page, setPage] = createSignal(pagination()?.defaultCurrent ?? 1, { ownedWrite: true });
  const [pageSize, setPageSize] = createSignal(pagination()?.defaultPageSize ?? pagination()?.pageSize ?? 10, { ownedWrite: true });
  const others = omit(props, 'dataSource', 'renderItem', 'rowKey', 'bordered', 'split', 'loading', 'size', 'itemLayout', 'grid', 'header', 'footer', 'extra', 'loadMore', 'rootClassName', 'locale', 'pagination', 'children', 'class');
  const currentPage = () => pagination()?.current ?? page();
  const currentPageSize = () => pagination()?.pageSize ?? pageSize();
  const data = () => {
    if (!pagination()) return props.dataSource;
    const start = (currentPage() - 1) * currentPageSize();
    return props.dataSource.slice(start, start + currentPageSize());
  };
  const padding = () => props.size === 'small' ? 'px-3 py-2' : props.size === 'large' ? 'px-6 py-5' : 'px-4 py-3';
  const gridStyle = (): JSX.CSSProperties | undefined => props.grid ? {
    display: 'grid',
    'grid-template-columns': `repeat(${props.grid.column ?? 1}, minmax(0, 1fr))`,
    gap: `${props.grid.gutter ?? 0}px`,
  } : undefined;
  const loadingProps = () => typeof props.loading === 'object' ? props.loading : {};
  const changePage = (nextPage: number, nextSize: number) => {
    if (pagination()?.current === undefined) setPage(nextPage);
    if (pagination()?.pageSize === undefined) setPageSize(nextSize);
    pagination()?.onChange?.(nextPage, nextSize);
  };

  const content = () => (
    <>
      <Show when={props.header}><div class={['ads-list-header border-b border-border-secondary font-semibold', padding()]}>{props.header}</div></Show>
      <Show when={data().length > 0 || props.children !== undefined} fallback={<div class="ads-list-empty"><Empty image="simple" description={props.locale?.emptyText} /></div>}>
        <div role="list" class={props.grid ? 'p-4' : ''} style={gridStyle()}>
          <Show when={props.children !== undefined}><div role="none" class={['ads-list-row min-w-0', props.itemLayout === 'vertical' ? '[&>.ads-list-item]:items-start' : '']}>{props.children}</div></Show>
          <For each={data()}>{(item, index) => (
            <div role="none" data-row-key={typeof props.rowKey === 'function' ? String(props.rowKey(item)) : props.rowKey ? String(item[props.rowKey]) : String((currentPage() - 1) * currentPageSize() + index())} class={[
              'ads-list-row min-w-0',
              !props.grid ? padding() : '',
              props.split && !props.grid ? 'border-b border-border-secondary last:border-b-0' : '',
              props.itemLayout === 'vertical' ? '[&>.ads-list-item]:items-start' : '',
            ]}>
              {props.renderItem?.(item, (currentPage() - 1) * currentPageSize() + index())}
            </div>
          )}</For>
        </div>
      </Show>
      <Show when={props.loadMore}><div class="p-4 text-center">{props.loadMore}</div></Show>
      <Show when={props.extra}><div class="ads-list-extra p-4">{props.extra}</div></Show>
      <Show when={props.footer}><div class={['ads-list-footer border-t border-border-secondary', padding()]}>{props.footer}</div></Show>
    </>
  );

  return (
    <div {...others} data-size={props.size} data-item-layout={props.itemLayout} class={['ads-list min-w-0 bg-surface text-sm text-text', props.bordered ? 'overflow-hidden rounded-surface border border-border-secondary' : '', props.rootClassName, props.class]}>
      <Show when={props.loading} fallback={content()}>
        <Spin {...loadingProps()}>{content()}</Spin>
      </Show>
      <Show when={pagination()}>
        <Pagination {...pagination()} class={['mt-4 justify-end', pagination()?.class]} current={currentPage()} pageSize={currentPageSize()} total={props.dataSource.length} onChange={changePage} />
      </Show>
    </div>
  );
}

const Item = Object.assign(ListItem, { Meta: ListItemMeta });
export const List = Object.assign(ListRoot, { Item });
