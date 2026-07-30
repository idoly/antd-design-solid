import { Table as InternalTable, TableColumnComponent, TableColumnGroupComponent, TableSummary, TableSummaryCell, TableSummaryRow } from './Table';

export const SELECTION_ALL = 'SELECT_ALL';
export const SELECTION_INVERT = 'SELECT_INVERT';
export const SELECTION_NONE = 'SELECT_NONE';
export const SELECTION_COLUMN = Symbol('SELECTION_COLUMN');
export const EXPAND_COLUMN = Symbol('EXPAND_COLUMN');
export const Summary = Object.assign(TableSummary, { Row: TableSummaryRow, Cell: TableSummaryCell });
export const Table = Object.assign(InternalTable, { Column: TableColumnComponent, ColumnGroup: TableColumnGroupComponent, Summary, SELECTION_ALL, SELECTION_INVERT, SELECTION_NONE, SELECTION_COLUMN, EXPAND_COLUMN });
export { TableColumnComponent, TableColumnGroupComponent, TableSummary, TableSummaryCell, TableSummaryRow };
export type * from './Table';
