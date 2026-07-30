import type { Locale } from '../types';

const enUS: Locale = {
  locale: 'en',
  global: { placeholder: 'Please select', close: 'Close', sortable: 'sortable', show: 'Show', hide: 'Hide' },
  Empty: { description: 'No data' },
  Select: { notFoundContent: 'Not Found' },
  Table: { emptyText: 'No data', expand: 'Expand row', collapse: 'Collapse row', sortTitle: 'Sort' },
  Modal: { okText: 'OK', cancelText: 'Cancel', justOkText: 'OK' },
  Tour: { Next: 'Next', Previous: 'Previous', Finish: 'Finish' },
  Popconfirm: { okText: 'OK', cancelText: 'Cancel' },
  Transfer: { searchPlaceholder: 'Search here', itemUnit: 'item', itemsUnit: 'items', remove: 'Remove', selectAll: 'Select all data', deselectAll: 'Deselect all data' },
  Upload: { uploading: 'Uploading...', removeFile: 'Remove file', uploadError: 'Upload error', previewFile: 'Preview file', downloadFile: 'Download file' },
  QRCode: { expired: 'QR code expired', refresh: 'Refresh', scanned: 'Scanned' },
  DatePicker: { placeholder: 'Select date', rangePlaceholder: ['Start date', 'End date'], previous: 'Previous', next: 'Next' },
  TimePicker: { placeholder: 'Select time', rangePlaceholder: ['Start time', 'End time'] },
  Pagination: { prev_page: 'Previous page', next_page: 'Next page', items_per_page: 'items/page', jump_to: 'Go to', page: 'Page' },
  Form: { optional: '(optional)', defaultValidateMessages: { default: 'Field validation error for ${label}', required: 'Please enter ${label}', whitespace: '${label} cannot be a blank character', types: { string: '${label} is not a valid ${type}', number: '${label} is not a valid ${type}', email: '${label} is not a valid ${type}', array: '${label} is not a valid ${type}' }, string: { len: '${label} must be ${len} characters', min: '${label} must be at least ${min} characters', max: '${label} must be up to ${max} characters' }, pattern: { mismatch: '${label} does not match the pattern ${pattern}' } } },
};

export default enUS;
