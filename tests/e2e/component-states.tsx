import dayjs from 'dayjs';
import { render } from '@solidjs/web';
import {
  Alert,
  Avatar,
  Button,
  Card,
  Checkbox,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Layout,
  Menu,
  Mentions,
  Pagination,
  Progress,
  Radio,
  Select,
  Skeleton,
  Slider,
  Spin,
  Switch,
  Tabs,
  Tag,
  theme,
} from '../../src';
import '../../src/styles.css';

const params = new URLSearchParams(location.search);
const dark = params.has('dark');
const customTokens = params.has('tokens');

function StateMatrix() {
  return (
    <ConfigProvider theme={dark || customTokens ? {
      algorithm: dark ? theme.darkAlgorithm : undefined,
      components: customTokens ? {
        Avatar: { containerSize: 36, containerSizeLG: 48, containerSizeSM: 26, groupBorderColor: '#f7d774', groupOverlapping: -10, groupSpace: 6, iconFontSize: 20, iconFontSizeLG: 26, iconFontSizeSM: 13, textFontSize: 16, textFontSizeLG: 18, textFontSizeSM: 12 },
        Card: { actionsBg: '#f1f8e9', actionsLiMargin: '4px 0', bodyPadding: 19, bodyPaddingSM: 13, extraColor: '#8b2f4c', headerBg: '#e8f2ff', headerFontSize: 18, headerFontSizeSM: 15, headerHeight: 48, headerHeightSM: 34, headerPadding: 20, headerPaddingSM: 11, tabsMarginBottom: 14 },
        InputNumber: { controlWidth: 112 },
        Layout: { bodyBg: '#eaf2f8', footerBg: '#d5e5f2', footerPadding: '7px 13px', headerBg: '#17324d', headerColor: '#f7d774', headerHeight: 44, headerPadding: '0 17px', siderBg: '#234f63', triggerBg: '#102f3d', triggerColor: '#f7d774', triggerHeight: 34 },
        Menu: { itemHeight: 37, itemBorderRadius: 7, itemPaddingInline: 17, horizontalItemSelectedBg: '#123abc', horizontalItemSelectedColor: '#fedcba' },
        Mentions: { activeBg: '#f0ffee', inputFontSize: 17, paddingBlock: 9, paddingInline: 18 },
        Pagination: { itemActiveBg: '#123456', itemActiveColor: '#fedcba', itemInputBg: '#eef7ff', itemSize: 36 },
        Switch: { handleBg: '#ffeecc', handleSize: 20, trackHeight: 24, trackMinWidth: 48 },
        Tabs: { cardBg: '#ddeeff', cardGutter: 6, cardHeight: 38, itemSelectedColor: '#123456', titleFontSize: 15 },
        Slider: { handleColor: '#654321', handleSize: 18, railSize: 8, trackBg: '#abcdef' },
        Radio: { buttonPaddingInline: 19, buttonSolidCheckedBg: '#123456' },
        Progress: { defaultColor: '#345678', lineBorderRadius: 7, remainingColor: '#ddeeff' },
        Alert: { withDescriptionIconSize: 26, withDescriptionPadding: '18px 20px' },
        Spin: { dotSize: 24 },
        Skeleton: { blockRadius: 7, paragraphLiHeight: 14, titleHeight: 18 },
      } : undefined,
    } : undefined}>
      <main class="min-h-screen bg-surface-layout p-5">
        <div class="mx-auto max-w-5xl space-y-6">
          <header>
            <h1 class="text-2xl font-semibold">Component state matrix</h1>
            <p class="text-text-secondary">{dark ? 'Dark' : 'Light'} visual regression surface</p>
          </header>

          <section data-testid="action-states" class="space-y-3 border-t border-border pt-4" aria-labelledby="actions-heading">
            <h2 id="actions-heading" class="text-base font-semibold">Actions</h2>
            <div class="flex flex-wrap gap-3">
              <Button>Default</Button>
              <Button type="primary">Primary</Button>
              <Button type="primary" danger>Danger</Button>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button type="link">Link action</Button>
            </div>
          </section>

          <section data-testid="field-states" class="space-y-3 border-t border-border pt-4" aria-labelledby="fields-heading">
            <h2 id="fields-heading" class="text-base font-semibold">Fields</h2>
            <div class="grid gap-3 md:grid-cols-2">
              <Input aria-label="Focused field" defaultValue="Focused value" />
              <Input aria-label="Error field" status="error" defaultValue="Invalid value" />
              <Input aria-label="Warning field" status="warning" defaultValue="Review value" />
              <Input aria-label="Disabled field" disabled defaultValue="Unavailable" />
              <InputNumber aria-label="Numeric field" defaultValue={42} min={0} max={100} />
              <Select aria-label="Selected option" defaultValue="solid" options={[{ value: 'solid', label: 'Solid 2' }, { value: 'react', label: 'React' }]} />
              <DatePicker.RangePicker aria-label="Release range" showTime defaultValue={[dayjs('2026-07-01T09:00:00'), dayjs('2026-07-03T18:00:00')]} />
              <Mentions aria-label="Review mentions" placeholder="Mention a reviewer" autoSize={{ minRows: 2, maxRows: 3 }} options={[{ value: 'ada', label: 'Ada' }]} />
            </div>
          </section>

          <section data-testid="choice-states" class="space-y-3 border-t border-border pt-4" aria-labelledby="choices-heading">
            <h2 id="choices-heading" class="text-base font-semibold">Choices</h2>
            <div class="flex flex-wrap items-center gap-5">
              <div data-testid="state-avatars" class="flex flex-wrap items-center gap-4">
                <Avatar>A</Avatar>
                <Avatar icon={<span>+</span>} />
                <Avatar size="small">S</Avatar>
                <Avatar size="small" icon={<span>+</span>} />
                <Avatar size="large">LG</Avatar>
                <Avatar size="large" icon={<span>+</span>} />
                <Avatar.Group max={{ count: 2, popover: { trigger: 'click' } }}><Avatar>1</Avatar><Avatar>2</Avatar><Avatar>3</Avatar><Avatar>4</Avatar></Avatar.Group>
              </div>
              <Checkbox checked>Checked</Checkbox>
              <Checkbox indeterminate>Mixed</Checkbox>
              <Checkbox disabled>Disabled</Checkbox>
              <Radio checked>Selected</Radio>
              <Radio.Group optionType="button" buttonStyle="solid" defaultValue="grid" options={[{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }]} />
              <div class="w-48"><Slider aria-label="Choice slider" defaultValue={62} /></div>
              <Switch checked checkedChildren="On" unCheckedChildren="Off" />
              <Switch loading aria-label="Loading switch" />
              <Tag color="green">Success</Tag>
              <Tag color="gold">Warning</Tag>
              <Tag color="red">Error</Tag>
            </div>
            <Menu aria-label="Token menu" mode="horizontal" defaultSelectedKeys={['overview']} items={[{ key: 'overview', label: 'Overview' }, { key: 'settings', label: 'Settings' }, { key: 'remove', label: 'Remove', danger: true }, { key: 'locked', label: 'Locked', disabled: true }]} />
            <Tabs type="card" defaultActiveKey="details" items={[{ key: 'details', label: 'Details', children: 'Release details' }, { key: 'activity', label: 'Activity', children: 'Recent activity' }, { key: 'disabled', label: 'Disabled', disabled: true }]} />
          </section>

          <section data-testid="feedback-states" class="space-y-3 border-t border-border pt-4" aria-labelledby="feedback-heading">
            <h2 id="feedback-heading" class="text-base font-semibold">Feedback</h2>
            <div class="grid gap-3 md:grid-cols-2">
              <Alert type="success" showIcon message="Deployment complete" />
              <Alert type="info" showIcon message="New version available" description="Version 6 compatibility metadata is ready." />
              <Alert type="warning" showIcon message="Configuration needs review" />
              <Alert type="error" showIcon message="Build failed" />
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <Progress aria-label="Build progress" percent={68} status="active" />
              <Progress aria-label="Completed progress" percent={100} />
              <Skeleton active paragraph={{ rows: 2 }} />
              <div class="flex min-h-24 items-center justify-center border border-border-secondary bg-surface"><Spin tip="Loading data" /></div>
              <Pagination aria-label="State pagination" total={30} defaultCurrent={2} showQuickJumper />
              <Card data-testid="state-card-small" size="small" loading title="Loading card" />
              <Card data-testid="state-card" class="md:col-span-2" title="Release card" extra="Review" defaultActiveTabKey="summary" tabList={[{ key: 'summary', label: 'Summary' }, { key: 'activity', label: 'Activity' }]} actions={[<Button type="text">Approve</Button>, <Button type="text">Archive</Button>]}>Version 6 compatibility is ready.</Card>
              <Layout class="h-40 overflow-hidden md:col-span-2">
                <Layout.Header class="flex items-center">Release workspace</Layout.Header>
                <Layout hasSider>
                  <Layout.Sider width={112} collapsible>Navigation</Layout.Sider>
                  <Layout.Content class="p-3">Workspace content</Layout.Content>
                </Layout>
                <Layout.Footer>Release status</Layout.Footer>
              </Layout>
            </div>
          </section>

          <section class="border-t border-border pt-4" aria-labelledby="validation-heading">
            <h2 id="validation-heading" class="mb-3 text-base font-semibold">Validation</h2>
            <Form layout="vertical">
              <Form.Item label="Account" validateStatus="error" help="Account is required"><Input aria-label="Invalid account" /></Form.Item>
            </Form>
          </section>
        </div>
      </main>
    </ConfigProvider>
  );
}

render(() => <StateMatrix />, document.getElementById('root')!);
