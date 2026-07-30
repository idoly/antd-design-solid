import dayjs from 'dayjs';
import { render } from '@solidjs/web';
import {
  Alert,
  Button,
  Checkbox,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Progress,
  Radio,
  Select,
  Skeleton,
  Slider,
  Spin,
  Switch,
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
        InputNumber: { controlWidth: 112 },
        Switch: { handleBg: '#ffeecc', handleSize: 20, trackHeight: 24, trackMinWidth: 48 },
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
            </div>
          </section>

          <section data-testid="choice-states" class="space-y-3 border-t border-border pt-4" aria-labelledby="choices-heading">
            <h2 id="choices-heading" class="text-base font-semibold">Choices</h2>
            <div class="flex flex-wrap items-center gap-5">
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
