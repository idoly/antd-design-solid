import { mkdirSync, writeFileSync } from 'node:fs';

const entries = {
  affix: 'Affix', alert: 'Alert', anchor: 'Anchor', app: 'App', 'auto-complete': 'AutoComplete', avatar: 'Avatar',
  badge: 'Badge', 'border-beam': 'BorderBeam', breadcrumb: 'Breadcrumb', button: 'Button', calendar: 'Calendar', card: 'Card',
  carousel: 'Carousel', cascader: 'Cascader', checkbox: 'Checkbox', collapse: 'Collapse', 'color-picker': 'ColorPicker',
  'config-provider': 'ConfigProvider', 'date-picker': 'DatePicker', descriptions: 'Descriptions', divider: 'Divider', drawer: 'Drawer',
  dropdown: 'Dropdown', empty: 'Empty', flex: 'Flex', 'float-button': 'FloatButton', form: 'Form', grid: 'Grid', image: 'Image',
  input: 'Input', 'input-number': 'InputNumber', layout: 'Layout', list: 'List', masonry: 'Masonry', mentions: 'Mentions', menu: 'Menu',
  message: 'message', modal: 'Modal', notification: 'notification', pagination: 'Pagination', popconfirm: 'Popconfirm', popover: 'Popover',
  progress: 'Progress', 'qr-code': 'QRCode', radio: 'Radio', rate: 'Rate', result: 'Result', segmented: 'Segmented', select: 'Select',
  skeleton: 'Skeleton', slider: 'Slider', space: 'Space', spin: 'Spin', splitter: 'Splitter', statistic: 'Statistic', steps: 'Steps',
  switch: 'Switch', table: 'Table', tabs: 'Tabs', tag: 'Tag', theme: 'theme', timeline: 'Timeline', 'time-picker': 'TimePicker',
  tooltip: 'Tooltip', tour: 'Tour', transfer: 'Transfer', tree: 'Tree', 'tree-select': 'TreeSelect', typography: 'Typography', upload: 'Upload',
  version: 'version', watermark: 'Watermark', 'back-top': 'BackTop', row: 'Row', col: 'Col', qrcode: 'QRCode',
};

mkdirSync('src/entries', { recursive: true });
for (const [path, symbol] of Object.entries(entries)) {
  const module = path === 'back-top' ? 'float-button' : path === 'row' || path === 'col' ? 'grid' : path === 'qrcode' ? 'qr-code' : path;
  writeFileSync(`src/entries/${path}.ts`, `export { ${symbol} as default } from '../${module}/index.js';\nexport * from '../${module}/index.js';\n`);
}
console.log(`Generated ${Object.keys(entries).length} component entries`);
