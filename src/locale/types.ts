export interface Locale {
  locale: string;
  global?: { placeholder?: string; close?: string; sortable?: string; show?: string; hide?: string };
  Empty?: { description?: string };
  Select?: { notFoundContent?: string };
  Table?: Record<string, unknown> & { emptyText?: string; expand?: string; collapse?: string; sortTitle?: string };
  Modal?: { okText?: string; cancelText?: string; justOkText?: string };
  Tour?: { Next?: string; Previous?: string; Finish?: string };
  Popconfirm?: { okText?: string; cancelText?: string };
  Transfer?: Record<string, unknown> & { titles?: readonly [string, string]; searchPlaceholder?: string; itemUnit?: string; itemsUnit?: string; remove?: string; selectAll?: string; deselectAll?: string };
  Upload?: { uploading?: string; removeFile?: string; uploadError?: string; previewFile?: string; downloadFile?: string };
  QRCode?: { expired?: string; refresh?: string; scanned?: string };
  DatePicker?: { placeholder?: string; rangePlaceholder?: readonly [string, string]; previous?: string; next?: string };
  TimePicker?: { placeholder?: string; rangePlaceholder?: readonly [string, string] };
  Pagination?: { prev_page?: string; next_page?: string; items_per_page?: string; jump_to?: string; page?: string };
  Text?: { edit?: string; copy?: string; copied?: string; expand?: string; collapse?: string };
  ColorPicker?: { presetEmpty?: string; transparent?: string; singleColor?: string; gradientColor?: string };
  Form?: { optional?: string; defaultValidateMessages?: Record<string, any> };
}
