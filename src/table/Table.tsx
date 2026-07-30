import { createContext, createEffect, createMemo, createSignal, createUniqueId, For, merge, omit, onCleanup, Show, untrack, useContext } from 'solid-js';
import { Dynamic, Portal } from '@solidjs/web';
import type { JSX } from '@solidjs/web';
import { tv } from 'tailwind-variants';
import { DownIcon, UpIcon } from '../_internal/icons';
import { Dropdown } from '../dropdown';
import { Pagination } from '../pagination';
import { createVirtualList, type VirtualListController } from '../_internal/virtual';
import type { VirtualItem } from '@tanstack/virtual-core';
import { useConfig } from '../config-provider';

const table = tv({
  slots: {
    root: 'ads-table relative min-w-0 text-sm text-text',
    container: 'relative overflow-auto rounded-surface border border-border-secondary bg-surface',
    table: 'w-full border-separate border-spacing-0 text-left',
    header: 'bg-surface-container font-semibold text-text',
    headerCell: 'border-b border-border-secondary px-4 py-3 text-sm font-semibold',
    cell: 'border-b border-border-secondary px-4 py-3 align-middle',
    row: 'transition-colors duration-[var(--ads-motion-fast)] hover:bg-surface-container',
  },
  variants: {
    size: {
      small: { headerCell: 'px-2 py-2', cell: 'px-2 py-2' },
      middle: {},
      large: { headerCell: 'px-4 py-4', cell: 'px-4 py-4' },
    },
    bordered: {
      true: {
        headerCell: 'border-r border-border-secondary last:border-r-0',
        cell: 'border-r border-border-secondary last:border-r-0',
      },
    },
  },
  defaultVariants: { size: 'middle' },
});

export type TableKey = string | number;
export type TableFilterValue = string | number | boolean;
export type SortOrder = 'ascend' | 'descend' | null;

export interface TableColumnFilter {
  text: JSX.Element;
  value: TableFilterValue;
  children?: readonly TableColumnFilter[];
}

export interface TableColumnSorter<RecordType> {
  compare?: (a: RecordType, b: RecordType) => number;
  multiple?: number;
}

export interface TableColumn<RecordType> {
  key?: TableKey;
  dataIndex?: keyof RecordType | readonly (string | number)[];
  title?: JSX.Element;
  render?: (value: unknown, record: RecordType, index: number) => JSX.Element;
  sorter?: boolean | ((a: RecordType, b: RecordType) => number) | TableColumnSorter<RecordType>;
  sortOrder?: SortOrder;
  defaultSortOrder?: Exclude<SortOrder, null>;
  sortDirections?: readonly Exclude<SortOrder, null>[];
  showSorterTooltip?: boolean | TableSorterTooltipConfig;
  filters?: readonly TableColumnFilter[];
  filteredValue?: readonly TableFilterValue[] | null;
  defaultFilteredValue?: readonly TableFilterValue[];
  filterMultiple?: boolean;
  filterSearch?: boolean | ((input: string, filter: TableColumnFilter) => boolean);
  filterResetToDefaultFilteredValue?: boolean;
  onFilter?: (value: TableFilterValue, record: RecordType) => boolean;
  filterIcon?: JSX.Element | ((filtered: boolean) => JSX.Element);
  width?: number | string;
  fixed?: boolean | 'left' | 'right';
  align?: 'left' | 'center' | 'right';
  ellipsis?: boolean;
  hidden?: boolean;
  class?: string;
  headerClass?: string;
  children?: readonly TableColumn<RecordType>[];
}

interface ColumnRegistryValue { register: (column: TableColumn<object>) => () => void }
const ColumnRegistry = createContext<ColumnRegistryValue | null>(null);
export interface TableColumnProps<RecordType extends object = Record<string, unknown>> extends Omit<TableColumn<RecordType>, 'children'> { children?: JSX.Element }
export function TableColumnComponent<RecordType extends object = object>(props: TableColumnProps<RecordType>) {
  const registry = useContext(ColumnRegistry); let unregister: (() => void) | undefined; let cancelled = false;
  queueMicrotask(() => { if (!cancelled) unregister = registry?.register(omit(props, 'children') as TableColumn<object>); });
  onCleanup(() => { cancelled = true; unregister?.(); }); return null;
}
export interface TableColumnGroupProps<RecordType extends object = Record<string, unknown>> { title?: JSX.Element; children?: JSX.Element; class?: string }
export function TableColumnGroupComponent<RecordType extends object = object>(props: TableColumnGroupProps<RecordType>) {
  const parent = useContext(ColumnRegistry); const children: TableColumn<object>[] = [];
  const registry: ColumnRegistryValue = { register(column) { children.push(column); return () => { const index = children.indexOf(column); if (index >= 0) children.splice(index, 1); }; } };
  let unregister: (() => void) | undefined; let cancelled = false;
  queueMicrotask(() => queueMicrotask(() => { if (!cancelled) unregister = parent?.register({ title: props.title, class: props.class, children }); }));
  onCleanup(() => { cancelled = true; unregister?.(); }); return <ColumnRegistry value={registry}>{props.children}</ColumnRegistry>;
}

export interface TableSummaryProps { children?: JSX.Element; class?: string }
export function TableSummary(props: TableSummaryProps) { return <tfoot class={['ads-table-summary bg-surface-container font-semibold', props.class]}>{props.children}</tfoot>; }
export interface TableSummaryRowProps extends JSX.HTMLAttributes<HTMLTableRowElement> { }
export function TableSummaryRow(props: TableSummaryRowProps) { return <tr {...props}>{props.children}</tr>; }
export interface TableSummaryCellProps extends JSX.TdHTMLAttributes<HTMLTableCellElement> { index?: number }
export function TableSummaryCell(props: TableSummaryCellProps) { const others = omit(props, 'index', 'class'); return <td {...others} class={['border-t border-border-secondary px-4 py-3', props.class]}>{props.children}</td>; }

export interface TablePaginationConfig {
  current?: number;
  defaultCurrent?: number;
  pageSize?: number;
  defaultPageSize?: number;
  pageSizeOptions?: readonly number[];
  showSizeChanger?: boolean;
  hideOnSinglePage?: boolean;
  showTotal?: (total: number, range: [number, number]) => JSX.Element;
  onChange?: (page: number, pageSize: number) => void;
}

export interface TableSorterResult<RecordType> {
  column?: TableColumn<RecordType>;
  columnKey?: TableKey;
  field?: keyof RecordType | readonly (string | number)[];
  order: SortOrder;
}

export interface TableSelectionItem {
  key: string;
  text: JSX.Element;
  onSelect?: (changeableRowKeys: TableKey[]) => void;
}

export type TableSelection = TableSelectionItem | 'SELECT_ALL' | 'SELECT_INVERT' | 'SELECT_NONE';

export interface TableRowSelection<RecordType> {
  type?: 'checkbox' | 'radio';
  checkStrictly?: boolean;
  fixed?: boolean | 'left' | 'right';
  align?: 'left' | 'center' | 'right';
  selectedRowKeys?: readonly TableKey[];
  defaultSelectedRowKeys?: readonly TableKey[];
  preserveSelectedRowKeys?: boolean;
  hideSelectAll?: boolean;
  columnTitle?: JSX.Element | ((originNode: JSX.Element) => JSX.Element);
  columnWidth?: number | string;
  getCheckboxProps?: (record: RecordType) => JSX.InputHTMLAttributes<HTMLInputElement> & { indeterminate?: boolean };
  getTitleCheckboxProps?: () => JSX.InputHTMLAttributes<HTMLInputElement>;
  renderCell?: (checked: boolean, record: RecordType, index: number, originNode: JSX.Element) => JSX.Element;
  onCell?: (record: RecordType, rowIndex: number) => JSX.TdHTMLAttributes<HTMLTableCellElement>;
  onChange?: (selectedRowKeys: TableKey[], selectedRows: RecordType[], info: { type: 'single' | 'multiple' | 'all' | 'none' | 'invert' }) => void;
  onSelect?: (record: RecordType, selected: boolean, selectedRows: RecordType[], nativeEvent: Event) => void;
  onSelectMultiple?: (selected: boolean, selectedRows: RecordType[], changeRows: RecordType[]) => void;
  onSelectAll?: (selected: boolean, selectedRows: RecordType[], changedRows: RecordType[]) => void;
  onSelectInvert?: (selectedRowKeys: TableKey[]) => void;
  onSelectNone?: () => void;
  selections?: readonly TableSelection[] | boolean;
}

export interface TableChangeExtra<RecordType> {
  currentDataSource: RecordType[];
  action: 'paginate' | 'sort' | 'filter';
}

export type TableFilters = Record<string, TableFilterValue[] | null>;

export interface TableExpandableConfig<RecordType> {
  childrenColumnName?: keyof RecordType;
  columnTitle?: JSX.Element;
  columnWidth?: number | string;
  defaultExpandAllRows?: boolean;
  defaultExpandedRowKeys?: readonly TableKey[];
  expandedRowClassName?: string | ((record: RecordType, index: number, indent: number) => string | undefined);
  expandedRowKeys?: readonly TableKey[];
  expandedRowRender?: (record: RecordType, index: number, indent: number, expanded: boolean) => JSX.Element;
  expandIcon?: (props: { expanded: boolean; expandable: boolean; record: RecordType; onExpand: (record: RecordType, event: MouseEvent) => void }) => JSX.Element;
  expandRowByClick?: boolean;
  fixed?: boolean | 'left' | 'right';
  indentSize?: number;
  rowExpandable?: (record: RecordType) => boolean;
  showExpandColumn?: boolean;
  onExpand?: (expanded: boolean, record: RecordType) => void;
  onExpandedRowsChange?: (expandedRows: TableKey[]) => void;
}

export interface TableRef { nativeElement: HTMLDivElement | null; scrollTo: (config: { index?: number; key?: TableKey; top?: number; offset?: number; align?: ScrollLogicalPosition }) => void }
export type TableElementComponent<Props extends object = Record<string, unknown>> = (props: Props & { children?: JSX.Element }) => JSX.Element;
export interface TableComponents<RecordType extends object> {
  table?: TableElementComponent<JSX.HTMLAttributes<HTMLTableElement>>;
  header?: { wrapper?: TableElementComponent<JSX.HTMLAttributes<HTMLTableSectionElement>>; row?: TableElementComponent<JSX.HTMLAttributes<HTMLTableRowElement>>; cell?: TableElementComponent<JSX.ThHTMLAttributes<HTMLTableCellElement>> };
  body?: { wrapper?: TableElementComponent<JSX.HTMLAttributes<HTMLTableSectionElement>>; row?: TableElementComponent<JSX.HTMLAttributes<HTMLTableRowElement> & { record?: RecordType; index?: number }>; cell?: TableElementComponent<JSX.TdHTMLAttributes<HTMLTableCellElement> & { record?: RecordType; index?: number; column?: TableColumn<RecordType> }> };
}
export interface TableSorterTooltipConfig { target?: 'full-header' | 'sorter-icon'; title?: JSX.Element }

export type TableSemanticName = 'root' | 'title' | 'content' | 'header.wrapper' | 'header.row' | 'header.cell' | 'section' | 'body.wrapper' | 'body.row' | 'body.cell' | 'footer' | 'pagination.root' | 'pagination.item' | 'container' | 'table' | 'header' | 'body' | 'row' | 'cell' | 'headerCell';
export type TableSemanticClassNames<RecordType extends object> = Partial<Record<TableSemanticName, string>> | ((info: { props: TableProps<RecordType> }) => Partial<Record<TableSemanticName, string>>);
export type TableSemanticStyles<RecordType extends object> = Partial<Record<TableSemanticName, JSX.CSSProperties>> | ((info: { props: TableProps<RecordType> }) => Partial<Record<TableSemanticName, JSX.CSSProperties>>);

export interface TableProps<RecordType extends object> extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title' | 'onChange' | 'children' | 'ref'> {
  columns?: readonly TableColumn<RecordType>[];
  column?: Partial<TableColumn<RecordType>>;
  components?: TableComponents<RecordType>;
  children?: JSX.Element;
  summary?: (data: readonly RecordType[]) => JSX.Element;
  dataSource?: readonly RecordType[];
  rowKey?: keyof RecordType | ((record: RecordType) => TableKey);
  pagination?: false | TablePaginationConfig;
  rowSelection?: TableRowSelection<RecordType>;
  expandable?: TableExpandableConfig<RecordType>;
  loading?: boolean | { tip?: JSX.Element };
  size?: 'small' | 'middle' | 'large';
  bordered?: boolean;
  tableLayout?: 'auto' | 'fixed';
  scroll?: { x?: number | string | true; y?: number | string; scrollToFirstRowOnChange?: boolean };
  virtual?: boolean;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  showSorterTooltip?: boolean | TableSorterTooltipConfig;
  locale?: { emptyText?: JSX.Element; selectionAll?: JSX.Element; selectInvert?: JSX.Element; selectNone?: JSX.Element };
  title?: (data: readonly RecordType[]) => JSX.Element;
  footer?: (data: readonly RecordType[]) => JSX.Element;
  rowClassName?: string | ((record: RecordType, index: number) => string | undefined);
  rowHoverable?: boolean;
  showHeader?: boolean;
  sticky?: boolean;
  sortDirections?: readonly Exclude<SortOrder, null>[];
  classNames?: TableSemanticClassNames<RecordType>;
  styles?: TableSemanticStyles<RecordType>;
  onRow?: (record: RecordType, index: number) => JSX.HTMLAttributes<HTMLTableRowElement>;
  onHeaderRow?: (columns: readonly TableColumn<RecordType>[], index: number) => JSX.HTMLAttributes<HTMLTableRowElement>;
  onScroll?: JSX.EventHandler<HTMLDivElement, Event>;
  ref?: (instance: TableRef) => void;
  onChange?: (
    pagination: { current: number; pageSize: number; total: number },
    filters: TableFilters,
    sorter: TableSorterResult<RecordType> | TableSorterResult<RecordType>[],
    extra: TableChangeExtra<RecordType>,
  ) => void;
}

interface SortState {
  key: TableKey;
  order: Exclude<SortOrder, null>;
}

function callInputHandler(handler: unknown, event: Event) {
  if (typeof handler === 'function') (handler as (event: Event) => void)(event);
  else if (handler && typeof handler === 'object' && 0 in handler) {
    const bound = handler as { 0: (data: unknown, event: Event) => void; 1: unknown };
    bound[0](bound[1], event);
  }
}

function SelectionCheckbox(props: JSX.InputHTMLAttributes<HTMLInputElement> & { indeterminate?: boolean }) {
  let ref: HTMLInputElement | undefined;
  createEffect(
    () => Boolean(props.indeterminate),
    (indeterminate) => {
      if (ref) ref.indeterminate = indeterminate;
    },
  );
  const others = omit(props, 'indeterminate');
  return <input {...others} ref={ref} class="size-4 cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50" />;
}

const getValue = <RecordType extends object>(record: RecordType, dataIndex?: TableColumn<RecordType>['dataIndex']): unknown => {
  if (dataIndex === undefined) return undefined;
  const path = Array.isArray(dataIndex) ? dataIndex : [dataIndex];
  return path.reduce<unknown>((value, key) => value !== null && typeof value === 'object'
    ? (value as Record<string | number, unknown>)[key]
    : undefined, record);
};

const styleObject = (value: unknown): JSX.CSSProperties => value && typeof value === 'object' ? value as JSX.CSSProperties : {};

const compareValues = (left: unknown, right: unknown): number => {
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  return String(left ?? '').localeCompare(String(right ?? ''), undefined, { numeric: true, sensitivity: 'base' });
};

const columnKey = <RecordType extends object>(column: TableColumn<RecordType>, index: number): TableKey => {
  if (column.key !== undefined) return column.key;
  if (Array.isArray(column.dataIndex)) return column.dataIndex.join('.');
  return column.dataIndex !== undefined ? String(column.dataIndex) : index;
};

const flattenFilters = (filters: readonly TableColumnFilter[] | undefined): TableColumnFilter[] =>
  filters?.flatMap((filter) => [filter, ...flattenFilters(filter.children)]) ?? [];

export function Table<RecordType extends object>(inputProps: TableProps<RecordType>) {
  const config = useConfig();
  const props = merge({ columns: [] as readonly TableColumn<RecordType>[], dataSource: [] as readonly RecordType[], size: 'middle' as const, tableLayout: 'auto' as const, rowHoverable: true, showHeader: true, sticky: false, sortDirections: ['ascend', 'descend'] as readonly Exclude<SortOrder, null>[] }, config.componentDefaults('table') as Partial<TableProps<RecordType>>, inputProps);
  let rootRef: HTMLDivElement | undefined;
  let scrollRef: HTMLDivElement | undefined;
  let virtualController: VirtualListController | undefined;
  untrack(() => props.ref)?.({
    get nativeElement() { return rootRef ?? null; },
    scrollTo(options) {
      if (!scrollRef) return;
      if (options.top !== undefined) { if (virtualEnabled()) virtualController?.scrollToOffset(options.top); else scrollRef.scrollTop = options.top; return; }
      if (virtualEnabled() && virtualController) {
        const targetIndex = options.key !== undefined ? treePageRows().findIndex((row) => String(getRowKey(row.record, sourceIndex(row.record))) === String(options.key)) : options.index;
        if (targetIndex !== undefined && targetIndex >= 0) { virtualController.scrollToIndex(targetIndex, options.align === 'nearest' ? 'auto' : options.align); return; }
      }
      const rows = Array.from(scrollRef.querySelectorAll<HTMLTableRowElement>('tbody > tr[data-row-key]'));
      const row = options.key !== undefined ? rows.find((item) => item.dataset.rowKey === String(options.key)) : options.index !== undefined ? rows[options.index] : undefined;
      if (!row) return;
      if (options.offset !== undefined) scrollRef.scrollTop += row.getBoundingClientRect().top - scrollRef.getBoundingClientRect().top - options.offset;
      else row.scrollIntoView?.({ block: options.align ?? 'nearest' });
    },
  });
  const [registeredColumns, setRegisteredColumns] = createSignal<readonly TableColumn<RecordType>[]>([], { ownedWrite: true });
  let currentRegistered: readonly TableColumn<RecordType>[] = [];
  const rootColumns = () => props.columns?.length ? props.columns : (registeredColumns(), currentRegistered);
  const initial = untrack(() => {
    const columns = rootColumns().flatMap((column) => column.children?.length ? column.children : [column]);
    const sorts = columns.map((column, index) => ({ column, key: columnKey(column, index) })).filter(({ column }) => column.defaultSortOrder).map(({ column, key }) => ({ key, order: column.defaultSortOrder! }));
    const pagination = props.pagination === false ? undefined : props.pagination ?? {};
    return {
      filters: Object.fromEntries(columns.map((column, index) => [String(columnKey(column, index)), column.defaultFilteredValue ? [...column.defaultFilteredValue] : null])),
      sorts,
      page: pagination?.defaultCurrent ?? 1,
      pageSize: pagination?.defaultPageSize ?? pagination?.pageSize ?? 10,
      selectedKeys: props.rowSelection?.defaultSelectedRowKeys ?? [],
    };
  });
  const [internalFilters, setInternalFilters] = createSignal<TableFilters>(initial.filters, { ownedWrite: true });
  const uid = createUniqueId();
  const [internalSorts, setInternalSorts] = createSignal<readonly SortState[]>(initial.sorts, { ownedWrite: true });
  let currentInternalSorts: readonly SortState[] = initial.sorts;
  const paginationConfig = () => props.pagination === false ? undefined : props.pagination ?? {};
  const [internalPage, setInternalPage] = createSignal(initial.page, { ownedWrite: true });
  const [internalPageSize, setInternalPageSize] = createSignal(initial.pageSize, { ownedWrite: true });
  const [internalSelectedKeys, setInternalSelectedKeys] = createSignal<readonly TableKey[]>(initial.selectedKeys, { ownedWrite: true });
  const others = omit(
    props,
    'columns', 'column', 'components', 'children', 'summary', 'dataSource', 'rowKey', 'pagination', 'rowSelection', 'expandable', 'loading', 'size',
    'bordered', 'tableLayout', 'scroll', 'locale', 'title', 'footer', 'rowClassName', 'rowHoverable',
    'showHeader', 'sticky', 'sortDirections', 'virtual', 'getPopupContainer', 'showSorterTooltip', 'classNames', 'styles', 'onRow', 'onHeaderRow', 'onScroll',
    'onChange', 'class', 'style', 'ref',
  );
  const withColumnDefaults = (column: TableColumn<RecordType>): TableColumn<RecordType> => ({ ...props.column, ...column, children: column.children?.map(withColumnDefaults) });
  const visibleRootColumns = createMemo(() => rootColumns().map(withColumnDefaults).filter((column) => !column.hidden));
  const visibleColumns = createMemo(() => visibleRootColumns().flatMap((column) => column.children?.filter((child) => !child.hidden) ?? [column]));
  const fixedSide = (column: TableColumn<RecordType>): 'left' | 'right' | undefined => column.fixed === true ? 'left' : column.fixed || undefined;
  const numericWidth = (width: number | string | undefined, fallback: number) => typeof width === 'number' ? width : typeof width === 'string' && /^\d+(?:\.\d+)?px$/.test(width) ? Number.parseFloat(width) : fallback;
  const numericColumnWidth = (column: TableColumn<RecordType>) => numericWidth(column.width, 0);
  const selectionWidth = () => numericWidth(props.rowSelection?.columnWidth, 32);
  const expandWidth = () => numericWidth(props.expandable?.columnWidth, 48);
  const selectionFixedSide = (): 'left' | 'right' | undefined => props.rowSelection?.fixed === true ? 'left' : props.rowSelection?.fixed || undefined;
  const expandFixedSide = (): 'left' | 'right' | undefined => props.expandable?.fixed === true ? 'left' : props.expandable?.fixed || undefined;
  const auxiliaryOffset = (side: 'left' | 'right') => (selectionFixedSide() === side ? selectionWidth() : 0) + (expandFixedSide() === side ? expandWidth() : 0);
  const stickyStyle = (side: 'left' | 'right', offset: number, header: boolean): JSX.CSSProperties => ({ position: 'sticky', [side]: `${offset}px`, 'z-index': header ? 12 : 2, 'background-color': header ? 'var(--ads-table-header-bg, var(--ads-surface-container))' : 'var(--ads-surface)' });
  const selectionCellStyle = (header = false): JSX.CSSProperties => {
    const side = selectionFixedSide();
    return side ? stickyStyle(side, 0, header) : {};
  };
  const expandCellStyle = (header = false): JSX.CSSProperties => {
    const side = expandFixedSide();
    if (!side) return {};
    const offset = selectionFixedSide() === side ? selectionWidth() : 0;
    return stickyStyle(side, offset, header);
  };
  const fixedCellStyle = (column: TableColumn<RecordType>, index: number, header = false): JSX.CSSProperties => {
    const side = fixedSide(column);
    if (!side) return {};
    const columns = visibleColumns();
    const offset = auxiliaryOffset(side) + (side === 'left'
      ? columns.slice(0, index).filter((item) => fixedSide(item) === 'left').reduce((sum, item) => sum + numericColumnWidth(item), 0)
      : columns.slice(index + 1).filter((item) => fixedSide(item) === 'right').reduce((sum, item) => sum + numericColumnWidth(item), 0));
    return stickyStyle(side, offset, header);
  };
  const hasColumnGroups = () => visibleRootColumns().some((column) => column.children?.length);
  const firstHeaderCells = () => {
    const roots = visibleRootColumns();
    const columns = visibleColumns();
    const grouped = roots.some((column) => column.children?.length);
    return roots.map((column) => column.children?.length
      ? { column: { ...column, sorter: false } as TableColumn<RecordType>, index: columns.indexOf(column.children[0]), rowSpan: 1, colSpan: column.children.filter((child) => !child.hidden).length }
      : { column, index: columns.indexOf(column), rowSpan: grouped ? 2 : 1, colSpan: undefined });
  };
  const secondHeaderCells = () => {
    const columns = visibleColumns();
    return visibleRootColumns().flatMap((column) => column.children?.filter((child) => !child.hidden) ?? []).map((column) => ({ column, index: columns.indexOf(column) }));
  };
  const getRowKey = (record: RecordType, index: number): TableKey => {
    if (typeof props.rowKey === 'function') return props.rowKey(record);
    const keyName = (props.rowKey ?? 'key') as keyof RecordType;
    const key = record[keyName];
    return typeof key === 'string' || typeof key === 'number' ? key : index;
  };
  const childRecords = (record: RecordType): readonly RecordType[] => {
    const name = props.expandable?.childrenColumnName ?? ('children' as keyof RecordType);
    const children = record[name];
    return Array.isArray(children) ? children as readonly RecordType[] : [];
  };
  const flattenRecords = (records: readonly RecordType[]): RecordType[] => records.flatMap((record) => [record, ...flattenRecords(childRecords(record))]);
  const allDataRecords = createMemo(() => flattenRecords(props.dataSource));
  const sourceIndexes = createMemo(() => new Map(allDataRecords().map((record, index) => [record, index] as const)));
  const sourceIndex = (record: RecordType) => sourceIndexes().get(record) ?? -1;
  createEffect(
    () => ({ records: allDataRecords(), controlled: props.rowSelection?.selectedRowKeys !== undefined, preserve: props.rowSelection?.preserveSelectedRowKeys }),
    ({ records, controlled, preserve }) => {
      if (controlled || preserve) return;
      const available = new Set(records.map((record, index) => getRowKey(record, index)));
      setInternalSelectedKeys((current) => current.filter((key) => available.has(key)));
    },
  );
  const initialExpandedKeys = untrack(() => props.expandable?.defaultExpandAllRows
    ? allDataRecords().filter((record) => childRecords(record).length > 0).map((record, index) => getRowKey(record, index))
    : [...(props.expandable?.defaultExpandedRowKeys ?? [])]);
  const [internalExpandedKeys, setInternalExpandedKeys] = createSignal<readonly TableKey[]>(initialExpandedKeys, { ownedWrite: true });
  const expandedKeys = () => props.expandable?.expandedRowKeys ?? internalExpandedKeys();
  const rowExpandable = (record: RecordType) => (Boolean(props.expandable?.expandedRowRender) || childRecords(record).length > 0) && (props.expandable?.rowExpandable?.(record) ?? true);
  const controlledSorts = (): SortState[] => visibleColumns().map((column, index) => ({ column, key: columnKey(column, index) })).filter(({ column }) => column.sortOrder != null).map(({ column, key }) => ({ key, order: column.sortOrder! }));
  const sortStates = (): readonly SortState[] => controlledSorts().length ? controlledSorts() : (internalSorts(), currentInternalSorts);
  const sorterResults = (states: readonly SortState[] = sortStates()): TableSorterResult<RecordType> | TableSorterResult<RecordType>[] => {
    const results = states.map((state) => {
      const found = visibleColumns().map((column, index) => ({ column, key: columnKey(column, index) })).find(({ key }) => key === state.key);
      return { column: found?.column, columnKey: found?.key, field: found?.column.dataIndex, order: state.order } as TableSorterResult<RecordType>;
    });
    return results.length > 1 ? results : results[0] ?? { order: null };
  };
  const activeFilters = (): TableFilters => Object.fromEntries(visibleColumns().flatMap((column, index) => {
    if (!column.filters?.length && column.filteredValue === undefined && column.defaultFilteredValue === undefined) return [];
    const key = String(columnKey(column, index));
    const values = column.filteredValue !== undefined ? column.filteredValue : internalFilters()[key];
    return [[key, values?.length ? [...values] : null]];
  }));
  const filterData = (filters = activeFilters()): RecordType[] => props.dataSource.filter((record) => visibleColumns().every((column, index) => {
    const values = filters[String(columnKey(column, index))];
    if (!values?.length) return true;
    return values.some((value) => column.onFilter ? column.onFilter(value, record) : getValue(record, column.dataIndex) === value);
  }));
  const sortedData = (filters = activeFilters()): RecordType[] => {
    const data = [...filterData(filters)];
    const active = sortStates().map((state) => {
      const found = visibleColumns().map((column, index) => ({ column, key: columnKey(column, index) })).find(({ key }) => key === state.key);
      if (!found?.column.sorter) return undefined;
      const compare = typeof found.column.sorter === 'function'
        ? found.column.sorter
        : typeof found.column.sorter === 'object' && found.column.sorter.compare
          ? found.column.sorter.compare
          : (a: RecordType, b: RecordType) => compareValues(getValue(a, found.column.dataIndex), getValue(b, found.column.dataIndex));
      const priority = typeof found.column.sorter === 'object' ? found.column.sorter.multiple ?? 0 : 0;
      return { state, compare, priority };
    }).filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)).sort((left, right) => right.priority - left.priority);
    if (!active.length) return data;
    return data.sort((a, b) => {
      for (const { state, compare } of active) {
        const result = (state.order === 'ascend' ? 1 : -1) * compare(a, b);
        if (result) return result;
      }
      return 0;
    });
  };
  const currentSortedData = createMemo(() => sortedData());
  const pageSize = () => Math.max(1, paginationConfig()?.pageSize ?? internalPageSize());
  const pageCount = () => Math.max(1, Math.ceil(currentSortedData().length / pageSize()));
  const currentPage = () => Math.min(pageCount(), Math.max(1, paginationConfig()?.current ?? internalPage()));
  const pageData = createMemo(() => {
    const data = currentSortedData();
    if (!paginationConfig()) return data;
    const start = (currentPage() - 1) * pageSize();
    return data.slice(start, start + pageSize());
  });
  const treePageRows = createMemo(() => {
    const rows: Array<{ record: RecordType; index: number; indent: number }> = [];
    const visit = (records: readonly RecordType[], indent: number) => records.forEach((record) => {
      rows.push({ record, index: rows.length, indent });
      if (expandedKeys().includes(getRowKey(record, sourceIndex(record)))) visit(childRecords(record), indent + 1);
    });
    visit(pageData(), 0);
    return rows;
  });
  const virtualEnabled = () => Boolean(props.virtual && typeof props.scroll?.y === 'number');
  const rowHeight = () => props.size === 'small' ? 40 : props.size === 'large' ? 56 : 48;
  const virtual = createVirtualList({ count: () => treePageRows().length, getScrollElement: () => scrollRef ?? null, estimateSize: rowHeight, viewportSize: () => typeof props.scroll?.y === 'number' ? props.scroll.y : 400, enabled: virtualEnabled, overscan: 8, getItemKey: (index) => getRowKey(treePageRows()[index].record, sourceIndex(treePageRows()[index].record)) });
  virtualController = virtual;
  const measureVirtualRow = (index: number) => {
    if (!virtualEnabled()) return;
    const measure = () => {
      const elements = rootRef?.querySelectorAll<HTMLElement>(`[data-virtual-measure="${index}"]`);
      const height = Array.from(elements ?? []).reduce((sum, element) => sum + (element.getBoundingClientRect().height || element.offsetHeight), 0);
      if (height > 0) virtual.resizeItem(index, height);
    };
    queueMicrotask(measure);
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(measure);
  };
  const rowCache = new Map<TableKey, { record: RecordType; index: number; indent: number; virtual: VirtualItem | undefined }>();
  const cachedRow = (record: RecordType, index: number, indent: number, item?: VirtualItem) => {
    const key = getRowKey(record, sourceIndex(record));
    const current = rowCache.get(key) ?? { record, index, indent, virtual: item };
    Object.assign(current, { record, index, indent, virtual: item });
    rowCache.set(key, current);
    return current;
  };
  const renderedRows = () => virtualEnabled()
    ? virtual.items().map((item) => { const row = treePageRows()[item.index]; return cachedRow(row.record, row.index, row.indent, item); })
    : treePageRows().map((row) => cachedRow(row.record, row.index, row.indent));
  const virtualPaddingTop = () => virtualEnabled() ? (virtual.items()[0]?.start ?? 0) : 0;
  const virtualPaddingBottom = () => virtualEnabled() ? Math.max(0, virtual.totalSize() - (virtual.items().at(-1)?.end ?? 0)) : 0;
  const selectedKeys = () => props.rowSelection?.selectedRowKeys ?? internalSelectedKeys();
  const selectedRows = (keys = selectedKeys()) => allDataRecords().filter((record, index) => keys.includes(getRowKey(record, index)));
  const rowSelectionType = () => props.rowSelection?.type ?? 'checkbox';
  const selectionStrict = () => props.rowSelection?.checkStrictly ?? true;
  const recordKey = (record: RecordType) => getRowKey(record, sourceIndex(record));
  const recordDisabled = (record: RecordType) => Boolean(props.rowSelection?.getCheckboxProps?.(record).disabled);
  const descendantRecords = (record: RecordType): RecordType[] => childRecords(record).flatMap((child) => [child, ...descendantRecords(child)]);
  const selectionIndeterminate = (record: RecordType) => {
    if (selectionStrict() || rowSelectionType() !== 'checkbox') return false;
    const descendants = descendantRecords(record).filter((child) => !recordDisabled(child));
    const selectedCount = descendants.filter((child) => selectedKeys().includes(recordKey(child))).length;
    return selectedCount > 0 && selectedCount < descendants.length;
  };
  const selectablePageRows = () => flattenRecords(pageData()).filter((record) => !recordDisabled(record));
  const selectableDataRows = () => flattenRecords(currentSortedData()).filter((record) => !recordDisabled(record));
  const allPageSelected = () => selectablePageRows().length > 0 && selectablePageRows().every((record) => selectedKeys().includes(getRowKey(record, sourceIndex(record))));
  const somePageSelected = () => !allPageSelected() && selectablePageRows().some((record) => selectedKeys().includes(getRowKey(record, sourceIndex(record))));
  const styles = () => table({ size: props.size, bordered: props.bordered });
  const cellTokenStyle = (): JSX.CSSProperties => {
    const suffix = props.size === 'small' ? '-sm' : props.size === 'large' ? '' : '-md';
    return {
      'padding-block': `var(--ads-table-cell-padding-block${suffix}, ${props.size === 'small' ? '8px' : props.size === 'large' ? '16px' : '12px'})`,
      'padding-inline': `var(--ads-table-cell-padding-inline${suffix}, ${props.size === 'small' ? '8px' : '16px'})`,
      'font-size': `var(--ads-table-cell-font-size${suffix}, 14px)`,
      'border-color': 'var(--ads-table-border-color, var(--ads-border-secondary))',
    };
  };
  const headerTokenStyle = (): JSX.CSSProperties => ({ ...cellTokenStyle(), color: 'var(--ads-table-header-color, var(--ads-text))', 'background-color': 'var(--ads-table-header-bg, var(--ads-surface-container))' });
  const semanticClasses = () => typeof props.classNames === 'function' ? props.classNames({ props }) : props.classNames ?? {};
  const semanticStyles = () => typeof props.styles === 'function' ? props.styles({ props }) : props.styles ?? {};
  const loadingTip = () => typeof props.loading === 'object' ? props.loading.tip : 'Loading...';

  const emitChange = (action: TableChangeExtra<RecordType>['action'], page = currentPage(), states = sortStates(), nextPageSize = pageSize(), filters = activeFilters()) => {
    const currentDataSource = sortedData(filters);
    props.onChange?.(
      { current: page, pageSize: nextPageSize, total: currentDataSource.length },
      filters,
      sorterResults(states),
      { currentDataSource, action },
    );
  };
  const changePage = (page: number, nextPageSize = pageSize()) => {
    const maxPage = Math.max(1, Math.ceil(currentSortedData().length / nextPageSize));
    const next = Math.min(maxPage, Math.max(1, page));
    if (paginationConfig()?.current === undefined) setInternalPage(next);
    if (paginationConfig()?.pageSize === undefined) setInternalPageSize(nextPageSize);
    paginationConfig()?.onChange?.(next, nextPageSize);
    emitChange('paginate', next, sortStates(), nextPageSize);
  };
  const changeFilter = (column: TableColumn<RecordType>, index: number, values: TableFilterValue[]) => {
    const key = String(columnKey(column, index));
    const nextFilters = { ...activeFilters(), [key]: values.length ? values : null };
    if (column.filteredValue === undefined) setInternalFilters((current) => ({ ...current, [key]: nextFilters[key] }));
    if (paginationConfig()?.current === undefined) setInternalPage(1);
    emitChange('filter', 1, sortStates(), pageSize(), nextFilters);
  };
  const toggleExpanded = (record: RecordType, index: number, event?: MouseEvent) => {
    if (!rowExpandable(record)) return;
    event?.stopPropagation();
    const key = getRowKey(record, index);
    const expanded = expandedKeys().includes(key);
    const next = expanded ? expandedKeys().filter((item) => item !== key) : [...expandedKeys(), key];
    if (props.expandable?.expandedRowKeys === undefined) setInternalExpandedKeys(next);
    props.expandable?.onExpand?.(!expanded, record);
    props.expandable?.onExpandedRowsChange?.([...next]);
    const virtualIndex = treePageRows().findIndex((row) => getRowKey(row.record, sourceIndex(row.record)) === key);
    if (virtualIndex >= 0) measureVirtualRow(virtualIndex);
  };
  const changeSort = (column: TableColumn<RecordType>, index: number) => {
    if (!column.sorter) return;
    const key = columnKey(column, index);
    const previous = sortStates().find((state) => state.key === key)?.order ?? null;
    const directions = column.sortDirections ?? props.sortDirections;
    const currentIndex = previous === null ? -1 : directions.indexOf(previous);
    const order: SortOrder = currentIndex < directions.length - 1 ? directions[currentIndex + 1] : null;
    const multiple = typeof column.sorter === 'object' && column.sorter.multiple !== undefined;
    const retained = multiple ? sortStates().filter((state) => state.key !== key) : [];
    const next: SortState[] = order ? [...retained, { key, order }] : retained;
    if (column.sortOrder === undefined && controlledSorts().length === 0) { currentInternalSorts = next; setInternalSorts(next); }
    if (paginationConfig()?.current === undefined) setInternalPage(1);
    emitChange('sort', 1, next);
  };
  let previousSelectedIndex: number | null = null;
  const changeSelection = (next: TableKey[], type: 'single' | 'multiple' | 'all' | 'none' | 'invert', record?: RecordType, selected?: boolean, nativeEvent?: Event) => {
    if (props.rowSelection?.selectedRowKeys === undefined) setInternalSelectedKeys(next);
    const rows = selectedRows(next);
    props.rowSelection?.onChange?.(next, rows, { type });
    if (record && selected !== undefined && nativeEvent) props.rowSelection?.onSelect?.(record, selected, rows, nativeEvent);
  };
  const toggleRow = (record: RecordType, index: number, nativeEvent: Event) => {
    const key = getRowKey(record, index);
    const selected = selectedKeys().includes(key);
    if (rowSelectionType() === 'radio' && selected) return;
    if (rowSelectionType() === 'checkbox' && selectionStrict() && nativeEvent instanceof MouseEvent && nativeEvent.shiftKey && selectedKeys().length > 0) {
      const rows = selectablePageRows();
      const currentIndex = rows.findIndex((item) => recordKey(item) === key);
      const anchorIndex = previousSelectedIndex ?? currentIndex;
      const range = rows.slice(Math.min(anchorIndex, currentIndex), Math.max(anchorIndex, currentIndex) + 1);
      const shouldSelect = range.some((item) => !selectedKeys().includes(recordKey(item)));
      const next = new Set(selectedKeys());
      const changedRows: RecordType[] = [];
      range.forEach((item) => {
        const itemKey = recordKey(item);
        if (next.has(itemKey) !== shouldSelect) changedRows.push(item);
        if (shouldSelect) next.add(itemKey); else next.delete(itemKey);
      });
      const keys = [...next];
      const rowsSelected = selectedRows(keys);
      previousSelectedIndex = shouldSelect ? Math.max(anchorIndex, currentIndex) : null;
      props.rowSelection?.onSelectMultiple?.(shouldSelect, rowsSelected, changedRows);
      changeSelection(keys, 'multiple');
      return;
    }
    if (rowSelectionType() === 'radio' || selectionStrict()) {
      const next = rowSelectionType() === 'radio' ? [key] : (selected ? selectedKeys().filter((item) => item !== key) : [...selectedKeys(), key]);
      previousSelectedIndex = selected ? null : selectablePageRows().findIndex((item) => recordKey(item) === key);
      changeSelection([...next], 'single', record, !selected, nativeEvent);
      return;
    }
    const next = new Set(selectedKeys());
    const affected = [record, ...descendantRecords(record)].filter((item) => !recordDisabled(item));
    for (const item of affected) {
      if (selected) next.delete(recordKey(item));
      else next.add(recordKey(item));
    }
    const reconcile = (records: readonly RecordType[]): void => {
      for (const item of records) reconcile(childRecords(item));
      for (const item of records) {
        if (recordDisabled(item)) continue;
        const children = childRecords(item).filter((child) => !recordDisabled(child));
        if (!children.length) continue;
        if (children.every((child) => next.has(recordKey(child)))) next.add(recordKey(item));
        else next.delete(recordKey(item));
      }
    };
    reconcile(props.dataSource);
    changeSelection([...next], 'multiple', record, !selected, nativeEvent);
  };
  const toggleAll = (event?: Event) => {
    const titleProps = props.rowSelection?.getTitleCheckboxProps?.();
    if (event) callInputHandler(titleProps?.onChange, event);
    previousSelectedIndex = null;
    const pageRows = selectablePageRows();
    const pageKeys = pageRows.map(recordKey);
    const selectAll = !allPageSelected();
    const changedRows = pageRows.filter((record) => selectedKeys().includes(recordKey(record)) !== selectAll);
    const next = selectAll
      ? [...new Set([...selectedKeys(), ...pageKeys])]
      : selectedKeys().filter((key) => !pageKeys.includes(key));
    changeSelection(next, 'all');
    props.rowSelection?.onSelectAll?.(selectAll, selectedRows(next), changedRows);
  };
  const runSelection = (selection: TableSelection) => {
    previousSelectedIndex = null;
    if (typeof selection === 'object') {
      selection.onSelect?.(selectablePageRows().map(recordKey));
      return;
    }
    if (selection === 'SELECT_ALL') {
      const selectableKeys = selectableDataRows().map(recordKey);
      const retained = selectedKeys().filter((key) => {
        const record = allDataRecords().find((item) => recordKey(item) === key);
        return record ? recordDisabled(record) : Boolean(props.rowSelection?.preserveSelectedRowKeys);
      });
      changeSelection([...new Set([...retained, ...selectableKeys])], 'all');
      return;
    }
    if (selection === 'SELECT_INVERT') {
      const pageKeys = selectablePageRows().map(recordKey);
      const next = new Set(selectedKeys());
      pageKeys.forEach((key) => { if (next.has(key)) next.delete(key); else next.add(key); });
      const keys = [...next];
      props.rowSelection?.onSelectInvert?.(keys);
      changeSelection(keys, 'invert');
      return;
    }
    const next = selectedKeys().filter((key) => {
      const record = allDataRecords().find((item) => recordKey(item) === key);
      return record ? recordDisabled(record) : Boolean(props.rowSelection?.preserveSelectedRowKeys);
    });
    props.rowSelection?.onSelectNone?.();
    changeSelection(next, 'none');
  };
  const selectionItems = (): readonly TableSelection[] => props.rowSelection?.selections === true
    ? ['SELECT_ALL', 'SELECT_INVERT', 'SELECT_NONE']
    : props.rowSelection?.selections || [];
  const selectionLabel = (selection: TableSelection): JSX.Element => typeof selection === 'object' ? selection.text
    : selection === 'SELECT_ALL' ? props.locale?.selectionAll ?? 'Select all data'
      : selection === 'SELECT_INVERT' ? props.locale?.selectInvert ?? 'Invert current page'
        : props.locale?.selectNone ?? 'Select none';
  const renderSelectionHeader = () => {
    const titleProps = props.rowSelection?.getTitleCheckboxProps?.() ?? {};
    const origin = props.rowSelection?.hideSelectAll ? <></> : <SelectionCheckbox {...titleProps} type="checkbox" aria-label={titleProps['aria-label'] ?? 'Select all rows'} aria-checked={somePageSelected() ? 'mixed' : undefined} checked={allPageSelected()} indeterminate={somePageSelected()} disabled={titleProps.disabled || selectablePageRows().length === 0} onChange={toggleAll} />;
    const actions = props.rowSelection?.hideSelectAll || !selectionItems().length ? null : <Dropdown
      trigger={['click']}
      getPopupContainer={props.getPopupContainer}
      menu={{
        selectable: false,
        items: selectionItems().map((selection, index) => ({ key: typeof selection === 'object' ? selection.key : selection, label: selectionLabel(selection) })),
        onClick: ({ key }) => { const selection = selectionItems().find((item, index) => (typeof item === 'object' ? item.key : item) === key) ?? selectionItems()[Number(key)]; if (selection) runSelection(selection); },
      }}
    ><button type="button" aria-label="Selection actions" class="flex size-5 items-center justify-center text-text-secondary hover:text-text focus-visible:rounded-small focus-visible:ring-2 focus-visible:ring-primary/20"><DownIcon /></button></Dropdown>;
    const checkboxNode = <div class="flex items-center gap-1">{origin}{actions}</div>;
    if (typeof props.rowSelection?.columnTitle === 'function') return props.rowSelection.columnTitle(checkboxNode);
    return <div class="flex items-center gap-2">{checkboxNode}{props.rowSelection?.columnTitle}</div>;
  };
  const renderHeaderCell = (column: TableColumn<RecordType>, index: number, rowSpan?: number, colSpan?: number) => {
    const key = () => columnKey(column, index);
    const filterKey = () => String(key());
    const order = () => sortStates().find((state) => state.key === key())?.order ?? null;
    const align = () => column.align ?? 'left';
    const selectedFilters = () => activeFilters()[filterKey()] ?? [];
    const [filterSearch, setFilterSearch] = createSignal('', { ownedWrite: true });
    const [filterOpen, setFilterOpen] = createSignal(false, { ownedWrite: true });
    let filterTrigger: HTMLButtonElement | undefined;
    const filterMount = () => filterTrigger ? (props.getPopupContainer?.(filterTrigger) ?? rootRef ?? document.body) : (rootRef ?? document.body);
    const filterPopupStyle = (): JSX.CSSProperties => {
      const triggerRect = filterTrigger?.getBoundingClientRect();
      const mountRect = filterMount().getBoundingClientRect();
      return triggerRect ? { position: 'absolute', left: `${triggerRect.right - mountRect.left - 224}px`, top: `${triggerRect.bottom - mountRect.top + 8}px` } : {};
    };
    const filterOptions = () => flattenFilters(column.filters).filter((filter) => {
      if (!filterSearch()) return true;
      return typeof column.filterSearch === 'function' ? column.filterSearch(filterSearch(), filter) : String(filter.text).toLowerCase().includes(filterSearch().toLowerCase());
    });
    const toggleFilter = (value: TableFilterValue) => {
      const selected = selectedFilters();
      const next = selected.includes(value) ? selected.filter((item) => item !== value) : column.filterMultiple === false ? [value] : [...selected, value];
      changeFilter(column, index, next);
    };
    const filterIcon = () => typeof column.filterIcon === 'function' ? column.filterIcon(selectedFilters().length > 0) : column.filterIcon ?? 'Y';
    const sorterTooltip = () => column.showSorterTooltip ?? props.showSorterTooltip ?? true;
    const sorterTooltipTarget = () => { const value = sorterTooltip(); return typeof value === 'object' ? value.target ?? 'full-header' : 'full-header'; };
    const sorterTooltipTitle = () => {
      const value = sorterTooltip();
      if (!value) return undefined;
      if (typeof value === 'object' && value.title) return String(value.title);
      const directions = column.sortDirections ?? props.sortDirections;
      const current = order();
      const next = directions[current === null ? 0 : (directions.indexOf(current) + 1) % directions.length];
      return next === 'ascend' ? 'Click to sort ascending' : 'Click to sort descending';
    };
    return <Dynamic component={props.components?.header?.cell ?? 'th'} scope="col" rowspan={rowSpan} colspan={colSpan} aria-sort={order() === 'ascend' ? 'ascending' : order() === 'descend' ? 'descending' : column.sorter ? 'none' : undefined} class={styles().headerCell({ class: [semanticClasses().headerCell, semanticClasses()['header.cell'], column.headerClass] })} style={{ ...headerTokenStyle(), ...semanticStyles().headerCell, ...semanticStyles()['header.cell'], width: typeof column.width === 'number' ? `${column.width}px` : column.width, 'text-align': align(), ...fixedCellStyle(column, index, true) }}>
      <div class="flex items-center gap-1">
        <Show when={column.sorter} fallback={<span class="min-w-0 flex-1">{column.title}</span>}><button type="button" title={sorterTooltipTarget() === 'full-header' ? sorterTooltipTitle() : undefined} class="flex min-w-0 flex-1 items-center gap-2 bg-transparent text-inherit outline-none focus-visible:rounded-small focus-visible:ring-2 focus-visible:ring-primary/20" onClick={() => changeSort(column, index)}><span class="min-w-0 flex-1" style={{ 'text-align': align() }}>{column.title}</span><span aria-hidden="true" title={sorterTooltipTarget() === 'sorter-icon' ? sorterTooltipTitle() : undefined} class={order() ? 'text-primary' : 'text-text-disabled'}>{order() === 'ascend' ? <UpIcon /> : order() === 'descend' ? <DownIcon /> : <span class="flex flex-col"><UpIcon /><DownIcon /></span>}</span></button></Show>
        <Show when={column.filters?.length}>
          <button ref={filterTrigger} type="button" aria-label={`Filter ${String(column.title ?? filterKey())}`} aria-expanded={filterOpen() ? 'true' : 'false'} class={['flex size-6 items-center justify-center rounded-small font-normal hover:bg-border-secondary focus-visible:ring-2 focus-visible:ring-primary/20', selectedFilters().length ? 'text-primary' : 'text-text-secondary']} onClick={() => setFilterOpen((open) => !open)}>{filterIcon()}</button>
          <Show when={filterOpen()}><Portal mount={filterMount()}><div class={['ads-table-theme', config.themeScopeClass(), 'z-30 w-56 rounded-small bg-surface p-2 text-left font-normal text-text shadow-popup']} style={filterPopupStyle()}><Show when={column.filterSearch}><input type="search" aria-label="Search filters" value={filterSearch()} class="mb-1 h-8 w-full rounded-control border border-border bg-surface px-2 text-sm outline-none focus:border-primary" onInput={(event) => setFilterSearch(event.currentTarget.value)} /></Show><div class="max-h-56 overflow-auto py-1"><For each={filterOptions()}>{(filter) => <label class="flex cursor-pointer items-center gap-2 rounded-small px-2 py-1.5 hover:bg-surface-container"><input type={column.filterMultiple === false ? 'radio' : 'checkbox'} name={column.filterMultiple === false ? `${uid}-${filterKey()}-filter` : undefined} checked={selectedFilters().includes(filter.value)} class="size-4 accent-primary" onChange={() => toggleFilter(filter.value)} /><span class="min-w-0 truncate">{filter.text}</span></label>}</For></div><button type="button" class="mt-1 h-7 px-2 text-primary hover:text-primary-hover" onClick={() => changeFilter(column, index, column.filterResetToDefaultFilteredValue ? [...(column.defaultFilteredValue ?? [])] : [])}>Reset</button></div></Portal></Show>
        </Show>
      </div>
    </Dynamic>;
  };
  const registry: ColumnRegistryValue = { register(column) { const typed = column as TableColumn<RecordType>; currentRegistered = [...currentRegistered, typed]; setRegisteredColumns(currentRegistered); return () => { currentRegistered = currentRegistered.filter((entry) => entry !== typed); setRegisteredColumns(currentRegistered); }; } };
  return (
    <>
    <ColumnRegistry value={registry}><div hidden>{props.children}</div></ColumnRegistry>
    <div {...others} ref={rootRef} class={styles().root({ class: [semanticClasses().root, props.class as string | undefined] })} style={{ ...semanticStyles().root, ...styleObject(props.style) }}>
      <Show when={props.title}><div class={['rounded-t-surface border border-b-0 border-border-secondary bg-surface px-4 py-3 text-base font-semibold', semanticClasses().title]} style={semanticStyles().title}>{props.title?.(props.dataSource)}</div></Show>
      <div
        ref={scrollRef}
        class={styles().container({ class: [semanticClasses().container, semanticClasses().content] })}
        style={{ ...semanticStyles().container, ...semanticStyles().content, 'max-height': typeof props.scroll?.y === 'number' ? `${props.scroll.y}px` : props.scroll?.y }}
        onScroll={props.onScroll}
      >
        <Dynamic
          component={props.components?.table ?? 'table'}
          class={styles().table({ class: [semanticClasses().table, semanticClasses().section] })}
          style={{
            ...semanticStyles().table,
            ...semanticStyles().section,
            'table-layout': props.tableLayout,
            'min-width': props.scroll?.x === true ? 'max-content' : typeof props.scroll?.x === 'number' ? `${props.scroll.x}px` : props.scroll?.x,
          }}
        >
          <Show when={props.showHeader}><Dynamic component={props.components?.header?.wrapper ?? 'thead'} class={styles().header({ class: [props.sticky ? 'sticky top-0 z-10' : '', semanticClasses().header, semanticClasses()['header.wrapper']] })} style={{ 'background-color': 'var(--ads-table-header-bg, var(--ads-surface-container))', ...semanticStyles().header, ...semanticStyles()['header.wrapper'] }}>
            <Dynamic component={props.components?.header?.row ?? 'tr'} class={semanticClasses()['header.row']} style={semanticStyles()['header.row']} {...props.onHeaderRow?.(visibleRootColumns(), 0)}>
              <Show when={props.rowSelection}><th scope="col" rowspan={hasColumnGroups() ? 2 : 1} class={styles().headerCell({ class: semanticClasses().headerCell })} style={{ ...headerTokenStyle(), ...semanticStyles().headerCell, width: typeof props.rowSelection?.columnWidth === 'number' ? `${props.rowSelection.columnWidth}px` : props.rowSelection?.columnWidth ?? 'var(--ads-table-selection-column-width, 32px)', 'text-align': props.rowSelection?.align, ...selectionCellStyle(true) }}><Show when={rowSelectionType() === 'checkbox'} fallback={typeof props.rowSelection?.columnTitle === 'function' ? props.rowSelection.columnTitle(<></>) : props.rowSelection?.columnTitle}>{renderSelectionHeader()}</Show></th></Show>
              <Show when={props.expandable && props.expandable.showExpandColumn !== false}><th scope="col" rowspan={hasColumnGroups() ? 2 : 1} class={styles().headerCell({ class: semanticClasses().headerCell })} style={{ ...headerTokenStyle(), ...semanticStyles().headerCell, width: typeof props.expandable?.columnWidth === 'number' ? `${props.expandable.columnWidth}px` : props.expandable?.columnWidth ?? '48px', ...expandCellStyle(true) }}>{props.expandable?.columnTitle}</th></Show>
              <For each={firstHeaderCells()}>{(cell) => renderHeaderCell(cell.column, cell.index, cell.rowSpan, cell.colSpan)}</For>
            </Dynamic>
            <Show when={hasColumnGroups()}><Dynamic component={props.components?.header?.row ?? 'tr'} {...props.onHeaderRow?.(visibleColumns(), 1)}><For each={secondHeaderCells()}>{(cell) => renderHeaderCell(cell.column, cell.index)}</For></Dynamic></Show>
          </Dynamic></Show>
          <Dynamic component={props.components?.body?.wrapper ?? 'tbody'} class={[semanticClasses().body, semanticClasses()['body.wrapper']]} style={{ ...semanticStyles().body, ...semanticStyles()['body.wrapper'] }}>
            <Show when={virtualPaddingTop() > 0}><tr aria-hidden="true"><td colspan={visibleColumns().length + (props.rowSelection ? 1 : 0) + (props.expandable && props.expandable.showExpandColumn !== false ? 1 : 0)} style={{ height: `${virtualPaddingTop()}px`, padding: 0, border: 0 }} /></tr></Show>
            <For each={renderedRows()}>{(entry) => {
              const record = entry.record;
              const rowIndex = () => entry.index;
              const absoluteIndex = () => paginationConfig() ? (currentPage() - 1) * pageSize() + rowIndex() : rowIndex();
              const key = () => getRowKey(record, sourceIndex(record));
              const rowClass = () => typeof props.rowClassName === 'function' ? props.rowClassName(record, absoluteIndex()) : props.rowClassName;
              const checkboxProps = () => props.rowSelection?.getCheckboxProps?.(record) ?? {};
              const selectionCellProps = createMemo(() => props.rowSelection?.onCell?.(record, absoluteIndex()) ?? {});
              const renderSelectionControl = () => {
                const origin = <SelectionCheckbox
                  {...checkboxProps()}
                  type={rowSelectionType()}
                  name={checkboxProps().name ?? (rowSelectionType() === 'radio' ? `${uid}-selection` : undefined)}
                  aria-label={checkboxProps()['aria-label'] ?? (selectedKeys().includes(key()) ? `Row ${absoluteIndex() + 1} selected` : `Select row ${absoluteIndex() + 1}`)}
                  aria-checked={selectionIndeterminate(record) ? 'mixed' : undefined}
                  checked={selectedKeys().includes(key())}
                  indeterminate={selectionIndeterminate(record) || Boolean(checkboxProps().indeterminate)}
                  disabled={checkboxProps().disabled}
                  onClick={(event) => { callInputHandler(checkboxProps().onClick, event); event.stopPropagation(); if (!event.defaultPrevented) toggleRow(record, sourceIndex(record), event); }}
                  onChange={(event) => callInputHandler(checkboxProps().onChange, event)}
                />;
                return props.rowSelection?.renderCell?.(selectedKeys().includes(key()), record, absoluteIndex(), origin) ?? origin;
              };
              const customRowProps = createMemo(() => props.onRow?.(record, absoluteIndex()) ?? {});
              return (
                <>
                <Dynamic component={props.components?.body?.row ?? 'tr'} ref={entry.virtual ? (element: HTMLTableRowElement) => measureVirtualRow(entry.virtual!.index) : undefined} record={props.components?.body?.row ? record : undefined} index={props.components?.body?.row ? absoluteIndex() : undefined} data-index={entry.virtual?.index} data-virtual-measure={entry.virtual?.index} {...customRowProps()} onClick={(event) => { if (typeof customRowProps().onClick === 'function') (customRowProps().onClick as (event: MouseEvent) => void)(event); if (props.expandable?.expandRowByClick) toggleExpanded(record, sourceIndex(record), event); }} class={styles().row({ class: [props.rowHoverable ? '' : 'hover:bg-transparent', semanticClasses().row, semanticClasses()['body.row'], rowClass(), customRowProps().class as string | undefined] })} style={{ ...semanticStyles().row, ...semanticStyles()['body.row'], ...styleObject(customRowProps().style) }} data-row-key={String(key())}>
                  <Show when={props.rowSelection}>
                    <td {...selectionCellProps()} class={styles().cell({ class: [semanticClasses().cell, selectionCellProps().class as string | undefined] })} style={{ ...cellTokenStyle(), ...semanticStyles().cell, 'text-align': props.rowSelection?.align, ...styleObject(selectionCellProps().style), ...selectionCellStyle() }}>
                      {renderSelectionControl()}
                    </td>
                  </Show>
                  <Show when={props.expandable && props.expandable.showExpandColumn !== false}>
                    <td class={styles().cell({ class: semanticClasses().cell })} style={{ ...cellTokenStyle(), ...semanticStyles().cell, 'padding-left': `${16 + entry.indent * (props.expandable?.indentSize ?? 15)}px`, ...expandCellStyle() }}>
                      <Show when={rowExpandable(record)}>{props.expandable?.expandIcon?.({ expanded: expandedKeys().includes(key()), expandable: true, record, onExpand: (item, event) => toggleExpanded(item, sourceIndex(item), event) }) ?? <button type="button" aria-label={expandedKeys().includes(key()) ? 'Collapse row' : 'Expand row'} aria-expanded={expandedKeys().includes(key()) ? 'true' : 'false'} class="inline-flex size-5 items-center justify-center rounded-small border border-border bg-surface text-xs text-text-secondary hover:border-primary hover:text-primary" onClick={(event) => toggleExpanded(record, sourceIndex(record), event)}>{expandedKeys().includes(key()) ? '-' : '+'}</button>}</Show>
                    </td>
                  </Show>
                  <For each={visibleColumns()}>{(column, columnIndex) => (
                    <Dynamic
                      component={props.components?.body?.cell ?? 'td'}
                      record={props.components?.body?.cell ? record : undefined}
                      index={props.components?.body?.cell ? absoluteIndex() : undefined}
                      column={props.components?.body?.cell ? column : undefined}
                      class={styles().cell({ class: [semanticClasses().cell, semanticClasses()['body.cell'], column.ellipsis ? 'max-w-0 truncate' : '', column.class] })}
                      style={{ ...cellTokenStyle(), ...semanticStyles().cell, ...semanticStyles()['body.cell'], 'text-align': column.align ?? 'left', 'padding-left': props.expandable?.showExpandColumn === false && columnIndex() === 0 ? `${16 + entry.indent * (props.expandable?.indentSize ?? 15)}px` : undefined, ...fixedCellStyle(column, columnIndex()) }}
                      title={column.ellipsis && typeof getValue(record, column.dataIndex) === 'string' ? String(getValue(record, column.dataIndex)) : undefined}
                    >
                      {column.render ? column.render(getValue(record, column.dataIndex), record, absoluteIndex()) : getValue(record, column.dataIndex) as JSX.Element}
                    </Dynamic>
                  )}</For>
                </Dynamic>
                <Show when={props.expandable?.expandedRowRender && expandedKeys().includes(key())}>
                  <tr ref={entry.virtual ? () => measureVirtualRow(entry.virtual!.index) : undefined} data-virtual-measure={entry.virtual?.index} class={['ads-table-expanded-row bg-[var(--ads-table-row-expanded-bg,var(--ads-surface-container))]', typeof props.expandable?.expandedRowClassName === 'function' ? props.expandable.expandedRowClassName(record, absoluteIndex(), 0) : props.expandable?.expandedRowClassName]}>
                    <td colspan={visibleColumns().length + (props.rowSelection ? 1 : 0) + (props.expandable?.showExpandColumn === false ? 0 : 1)} class="border-b border-border-secondary px-4 py-4">{props.expandable?.expandedRowRender?.(record, absoluteIndex(), 0, true)}</td>
                  </tr>
                </Show>
                </>
              );
            }}</For>
            <Show when={virtualPaddingBottom() > 0}><tr aria-hidden="true"><td colspan={visibleColumns().length + (props.rowSelection ? 1 : 0) + (props.expandable && props.expandable.showExpandColumn !== false ? 1 : 0)} style={{ height: `${virtualPaddingBottom()}px`, padding: 0, border: 0 }} /></tr></Show>
            <Show when={pageData().length === 0}>
              <tr>
                <td colspan={visibleColumns().length + (props.rowSelection ? 1 : 0) + (props.expandable && props.expandable.showExpandColumn !== false ? 1 : 0)} class="h-24 border-b border-border-secondary px-4 text-center text-text-disabled">
                  {props.locale?.emptyText ?? config.renderEmpty()?.('Table') ?? config.locale().Table?.emptyText ?? 'No data'}
                </td>
              </tr>
            </Show>
          </Dynamic>
          {props.summary?.(pageData())}
        </Dynamic>
        <Show when={props.loading}>
          <div class="absolute inset-0 flex items-center justify-center gap-2 bg-surface/70 text-text-secondary" role="status">
            <span aria-hidden="true" class="ads-spin size-4 rounded-full border-2 border-primary border-r-transparent" />
            <span>{loadingTip()}</span>
          </div>
        </Show>
      </div>
      <Show when={props.footer}><div class={['rounded-b-surface border border-t-0 border-border-secondary bg-surface px-4 py-3', semanticClasses().footer]} style={semanticStyles().footer}>{props.footer?.(props.dataSource)}</div></Show>
      <Show when={paginationConfig()}>
        <Pagination
          aria-label="Table pagination"
          class={['justify-end px-1 pt-3', semanticClasses()['pagination.root']]}
          current={currentPage()}
          pageSize={pageSize()}
          total={sortedData().length}
          pageSizeOptions={paginationConfig()?.pageSizeOptions}
          showSizeChanger={paginationConfig()?.showSizeChanger}
          hideOnSinglePage={paginationConfig()?.hideOnSinglePage}
          showTotal={paginationConfig()?.showTotal}
          onChange={changePage}
        />
      </Show>
    </div>
    </>
  );
}
