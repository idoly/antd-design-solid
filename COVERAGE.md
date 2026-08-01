# Ant Design v6 component coverage

Reference: the public component entries in `antd@6.5.2`. A component is listed as complete only when this package has a public TypeScript API, Ant v6 token-based styling, relevant controlled/uncontrolled behavior, accessibility semantics, package exports, and behavior tests. This matrix tracks component families rather than compatibility aliases.

## Complete

### General and layout

- App / App.useApp
- Button
- ConfigProvider / ConfigContext / SizeContext / config / useConfig / locale / direction
- Divider
- Flex
- Grid / Row / Col / Grid.useBreakpoint
- Layout / Layout.Header / Layout.Content / Layout.Footer / Layout.Sider
- Space / Space.Compact / Space.Addon / SpaceContext

### Navigation

- Affix
- Anchor / Anchor.Link
- Breadcrumb / Breadcrumb.Item / Breadcrumb.Separator
- Dropdown / Dropdown.Button
- FloatButton / FloatButton.Group / BackTop
- Menu / Menu.Item / Menu.SubMenu / Menu.Divider / Menu.ItemGroup
- Pagination
- Steps

### Data entry

- AutoComplete / AutoComplete.Option
- Cascader / Cascader.Panel
- Checkbox / Checkbox.Group
- ColorPicker
- DatePicker / RangePicker / MonthPicker / WeekPicker / QuarterPicker / YearPicker / TimePicker / generatePicker
- Form / Form.Item / Form.List / Form.ErrorList / Form.Provider / useForm / useFormInstance / useWatch / Item.useStatus
- Input / Input.TextArea / Input.Search / Input.Password / Input.OTP / Input.Group
- InputNumber
- Mentions / Mentions.Option / getMentions
- Radio / Radio.Group / Radio.Button
- Rate
- Segmented
- Select / Select.Option / Select.OptGroup
- Slider
- Switch
- TimePicker / TimePicker.RangePicker
- Transfer
- TreeSelect / TreeSelect.TreeNode
- Upload / Upload.Dragger

### Data display

- Avatar / Avatar.Group
- Badge / Badge.Ribbon
- Calendar / Calendar.generateCalendar
- Card / Card.Meta / Card.Grid
- Carousel
- Collapse
- Descriptions
- Empty / PRESENTED_IMAGE_DEFAULT / PRESENTED_IMAGE_SIMPLE
- Image / Image.PreviewGroup
- List / List.Item / List.Item.Meta
- Popover
- QRCode
- Statistic / Statistic.Countdown / Statistic.Timer
- Table / Table.Column / Table.ColumnGroup / Table.Summary / selection constants
- Tabs / Tabs.TabPane
- Tag / Tag.CheckableTag / Tag.CheckableTagGroup
- Timeline
- Tooltip / Tooltip.UniqueProvider
- Tour
- Tree / Tree.TreeNode / Tree.DirectoryTree
- Typography.Text / Typography.Title / Typography.Paragraph / Typography.Link

### Feedback

- Alert / Alert.ErrorBoundary
- Drawer
- Message
- Modal / static confirm, info, success, error, warning / Modal.useModal
- Notification
- Popconfirm
- Progress
- Result / IconMap / ExceptionMap
- Skeleton / Skeleton.Avatar / Skeleton.Button / Skeleton.Image / Skeleton.Input / Skeleton.Node
- Spin / Spin.setDefaultIndicator

### Additional Ant v6 entries

- BorderBeam
- Masonry
- Splitter
- Watermark

## Package and compatibility entries

These do not represent additional visual component implementations. All component subpaths provide default and named exports for client and SSR builds, and root compatibility includes `GetProp`, `GetProps`, `GetRef`, and `unstableSetRender`.

- `locale`: LocaleProvider/useLocale plus 72 official locale data subpaths, consumed by component defaults
- `theme`: exported with useToken, getDesignToken, and default/dark/compact algorithms
- `base.css` and `<component>/style.css`: shared reset/tokens plus generated component-level styles for all 76 public component and alias entries
- `version`: package metadata
- `row`, `col`, `back-top`, `qrcode`, and kebab-case directories: aliases for the component families above
