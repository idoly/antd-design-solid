import dayjs from 'dayjs';
import { createSignal } from 'solid-js';
import {
  Alert,
  App as DesignApp,
  AutoComplete,
  Avatar,
  Badge,
  BorderBeam,
  Breadcrumb,
  Button,
  Calendar,
  Card,
  Carousel,
  Cascader,
  Checkbox,
  Collapse,
  ColorPicker,
  ConfigProvider,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  FloatButton,
  Form,
  Grid,
  Image,
  Input,
  InputNumber,
  List,
  Masonry,
  Mentions,
  Menu,
  message,
  Modal,
  notification,
  Pagination,
  Popover,
  Progress,
  QRCode,
  Radio,
  Rate,
  Result,
  Segmented,
  Select,
  Skeleton,
  Slider,
  Space,
  Spin,
  Splitter,
  Statistic,
  Steps,
  Switch,
  Table,
  Tabs,
  Tag,
  Timeline,
  TimePicker,
  Tooltip,
  Tour,
  Transfer,
  Tree,
  TreeSelect,
  Typography,
  Upload,
  Watermark,
  theme,
} from './index';

const members = [
  { id: 1, name: 'Ada Lovelace', role: 'Owner', status: 'Active', projects: 12 },
  { id: 2, name: 'Grace Hopper', role: 'Engineer', status: 'Active', projects: 8 },
  { id: 3, name: 'Linus Torvalds', role: 'Engineer', status: 'Away', projects: 15 },
  { id: 4, name: 'Margaret Hamilton', role: 'Admin', status: 'Active', projects: 10 },
  { id: 5, name: 'Barbara Liskov', role: 'Reviewer', status: 'Active', projects: 7 },
  { id: 6, name: 'Donald Knuth', role: 'Reviewer', status: 'Away', projects: 9 },
];

const teams = [
  { id: 1, name: 'Platform', description: 'Runtime and infrastructure' },
  { id: 2, name: 'Experience', description: 'Product and design systems' },
  { id: 3, name: 'Research', description: 'Developer tooling and prototypes' },
];

export default function App() {
  const [primary, setPrimary] = createSignal('#1677ff');
  const [displayMode, setDisplayMode] = createSignal<'light' | 'dark' | 'compact' | 'rtl'>('light', { ownedWrite: true });
  const [loading, setLoading] = createSignal(false);
  const [modalOpen, setModalOpen] = createSignal(false);
  const [drawerOpen, setDrawerOpen] = createSignal(false);
  const [tourOpen, setTourOpen] = createSignal(false);
  let tourTarget: HTMLButtonElement | undefined;
  const [workspaceForm] = Form.useForm<{ name: string }>();

  const submit = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 900);
  };

  return (
    <ConfigProvider direction={displayMode() === 'rtl' ? 'rtl' : 'ltr'} theme={{ token: { colorPrimary: primary() }, algorithm: displayMode() === 'dark' ? theme.darkAlgorithm : displayMode() === 'compact' ? theme.compactAlgorithm : undefined }}>
      <DesignApp>
        <main class="min-h-screen bg-surface-layout px-4 py-6 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-7xl space-y-8">
            <header class="flex flex-wrap items-start justify-between gap-4 border-b border-border-secondary pb-5">
              <div>
                <div class="mb-2 flex flex-wrap items-center gap-2">
                  <Badge status="processing" text="Solid 2 beta" />
                  <Tag color="blue">Ant Design v6</Tag>
                  <Tag>71 families</Tag>
                </div>
                <h1 class="text-2xl font-semibold leading-8 text-text">Ant Design Solid workbench</h1>
                <p class="mt-1 max-w-2xl text-sm text-text-secondary">Interactive component catalog for application workflows, data entry, display, feedback, and layout.</p>
              </div>
              <div class="flex items-center gap-3">
                <label class="flex items-center gap-2 text-sm text-text-secondary">
                  Theme
                  <input aria-label="Primary color" type="color" value={primary()} onInput={(event) => setPrimary(event.currentTarget.value)} class="size-8 cursor-pointer rounded-control border border-border bg-surface p-1" />
                </label>
                <Dropdown trigger={['click']} menu={{ items: [{ key: 'light', label: 'Light theme' }, { key: 'dark', label: 'Dark theme' }, { key: 'compact', label: 'Compact theme' }, { key: 'rtl', label: 'RTL preview' }], onSelect: (info) => setDisplayMode(info.key as 'light' | 'dark' | 'compact' | 'rtl') }}>
                  <Button>Display: {displayMode()}</Button>
                </Dropdown>
              </div>
            </header>

            <nav aria-label="Component sections" class="overflow-x-auto border-b border-border-secondary">
              <div class="flex min-w-max gap-6 text-sm">
                <a class="border-b-2 border-primary pb-3 font-medium text-primary" href="#overview">Overview</a>
                <a class="pb-3 text-text-secondary hover:text-primary" href="#entry">Data entry</a>
                <a class="pb-3 text-text-secondary hover:text-primary" href="#display">Data display</a>
                <a class="pb-3 text-text-secondary hover:text-primary" href="#feedback">Feedback</a>
                <a class="pb-3 text-text-secondary hover:text-primary" href="#extensions">v6 extensions</a>
              </div>
            </nav>

            <section id="overview" class="scroll-mt-4 space-y-4">
              <div class="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 class="text-lg font-semibold text-text">Overview and navigation</h2>
                  <p class="text-sm text-text-secondary">Common hierarchy, progress, actions, and application status.</p>
                </div>
                <Breadcrumb items={[{ title: 'Workbench', href: '#overview' }, { title: 'Components', href: '#entry' }, { title: 'Overview' }]} />
              </div>

              <div class="grid border-y border-border-secondary bg-surface sm:grid-cols-2 lg:grid-cols-4">
                <div class="border-b border-border-secondary p-5 sm:border-r lg:border-b-0"><Statistic title="Component families" value={71} /></div>
                <div class="border-b border-border-secondary p-5 lg:border-b-0 lg:border-r"><Statistic title="Automated tests" value={271} suffix="passing" /></div>
                <div class="border-b border-border-secondary p-5 sm:border-b-0 sm:border-r"><Statistic title="Locale packs" value={72} /></div>
                <div class="p-5"><Statistic title="Bundle status" value="Ready" /></div>
              </div>

              <Card title="Release workflow" extra={<Tag color="green">On track</Tag>}>
                <Steps current={1} items={[{ title: 'Configure', description: 'Workspace settings' }, { title: 'Validate', description: 'Checks running' }, { title: 'Publish', description: 'Release package' }, { title: 'Monitor', description: 'Observe adoption' }]} />
                <Divider />
                <div class="grid gap-5 lg:grid-cols-[220px_1fr]">
                  <Menu mode="inline" defaultSelectedKeys={['dashboard']} items={[{ key: 'dashboard', label: 'Dashboard' }, { key: 'components', label: 'Components', children: [{ key: 'inputs', label: 'Inputs' }, { key: 'display', label: 'Data display' }] }, { key: 'settings', label: 'Settings' }]} />
                  <div class="min-w-0 space-y-4">
                    <Alert type="info" showIcon closable title="Catalog expanded" description="The workbench now covers the major component groups and their interactive states." />
                    <div class="flex flex-wrap items-center gap-3">
                      <Button type="primary" loading={loading()} onClick={submit}>Run checks</Button>
                      <Button onClick={() => setModalOpen(true)}>Create workspace</Button>
                      <Button onClick={() => setDrawerOpen(true)}>Settings</Button>
                      <Button ref={tourTarget} onClick={() => setTourOpen(true)}>Start tour</Button>
                      <Dropdown.Button menu={{ items: [{ key: 'draft', label: 'Save draft' }, { key: 'clone', label: 'Clone release' }] }}>Publish</Dropdown.Button>
                    </div>
                    <Pagination total={96} defaultPageSize={10} showSizeChanger showQuickJumper />
                  </div>
                </div>
              </Card>
            </section>

            <section id="entry" class="scroll-mt-4 space-y-4">
              <div>
                <h2 class="text-lg font-semibold text-text">Data entry</h2>
                <p class="text-sm text-text-secondary">Text, choices, dates, structured values, uploads, and transfer flows.</p>
              </div>

              <div class="grid gap-5 lg:grid-cols-2">
                <Card title="Text and selection">
                  <div class="space-y-4">
                    <Space.Compact block><Space.Addon>https://</Space.Addon><Input aria-label="Workspace domain" placeholder="workspace.example" /></Space.Compact>
                    <div class="grid gap-3 sm:grid-cols-2">
                      <Input placeholder="Workspace name" allowClear showCount maxlength={40} />
                      <Input.Search aria-label="Member search" placeholder="Search members" enterButton />
                      <Input.Password aria-label="Access key" placeholder="Access key" />
                      <AutoComplete aria-label="Framework" placeholder="Framework" options={[{ value: 'Solid', label: 'Solid' }, { value: 'React', label: 'React' }, { value: 'Vue', label: 'Vue' }]} />
                    </div>
                    <Input.OTP aria-label="Verification code" length={6} separator={<span>-</span>} />
                    <Select showSearch allowClear placeholder="Select a region" aria-label="Region" options={[{ value: 'apac', label: 'Asia Pacific' }, { value: 'emea', label: 'Europe, Middle East and Africa' }, { value: 'americas', label: 'Americas' }]} />
                    <TreeSelect showSearch allowClear treeDefaultExpandAll placeholder="Select a team" aria-label="Team" treeData={[{ key: 'engineering', title: 'Engineering', children: [{ key: 'frontend', title: 'Frontend' }, { key: 'platform', title: 'Platform' }] }, { key: 'design', title: 'Design' }]} />
                    <Mentions aria-label="Release note" placeholder="Mention a reviewer with @" options={[{ value: 'ada', label: 'Ada' }, { value: 'grace', label: 'Grace' }]} />
                  </div>
                </Card>

                <Card title="Dates and numeric values">
                  <div class="space-y-5">
                    <div class="grid gap-3 sm:grid-cols-2">
                      <DatePicker aria-label="Release date" defaultValue={dayjs('2026-07-30')} needConfirm showNow presets={[{ label: 'Today', value: () => dayjs() }, { label: 'Release day', value: dayjs('2026-07-30') }]} />
                      <TimePicker aria-label="Release time" />
                    </div>
                    <DatePicker.RangePicker aria-label="Release window" />
                    <div class="grid gap-3 sm:grid-cols-2">
                      <InputNumber aria-label="Replica count" defaultValue={3} min={1} max={12} />
                      <ColorPicker aria-label="Brand color" defaultValue="#1677ff" showText presets={[{ label: 'Brand', colors: ['#1677ff', '#52c41a', '#faad14', '#ff4d4f'] }]} />
                    </div>
                    <div>
                      <div class="mb-2 text-sm text-text-secondary">Rollout percentage</div>
                      <Slider range defaultValue={[20, 80]} marks={{ 0: '0', 50: '50', 100: '100' }} />
                    </div>
                    <div class="flex flex-wrap items-center gap-5">
                      <Rate aria-label="Quality rating" allowHalf defaultValue={4.5} />
                      <Segmented defaultValue="staged" options={[{ label: 'Canary', value: 'canary' }, { label: 'Staged', value: 'staged' }, { label: 'Full', value: 'full' }]} />
                    </div>
                  </div>
                </Card>

                <Card title="Choice controls">
                  <div class="space-y-5">
                    <Checkbox.Group aria-label="Permissions" defaultValue={['read', 'deploy']} options={[{ value: 'read', label: 'Read' }, { value: 'write', label: 'Write' }, { value: 'deploy', label: 'Deploy' }, { value: 'admin', label: 'Admin' }]} />
                    <Radio.Group aria-label="Billing interval" optionType="button" defaultValue="monthly" options={[{ value: 'monthly', label: 'Monthly' }, { value: 'quarterly', label: 'Quarterly' }, { value: 'yearly', label: 'Yearly' }]} />
                    <div class="flex flex-wrap gap-5">
                      <Switch aria-label="Auto renew" defaultChecked checkedChildren="On" unCheckedChildren="Off" />
                      <Switch aria-label="Maintenance mode" checkedChildren="On" unCheckedChildren="Off" />
                    </div>
                    <Cascader aria-label="Office location" placeholder="Choose an office" showSearch options={[{ value: 'eu', label: 'Europe', children: [{ value: 'de', label: 'Germany' }, { value: 'fr', label: 'France' }] }, { value: 'us', label: 'United States', children: [{ value: 'ca', label: 'California' }, { value: 'ny', label: 'New York' }] }]} />
                  </div>
                </Card>

                <Card title="Files and assignment">
                  <div class="space-y-5">
                    <Upload.Dragger multiple pastable beforeUpload={() => false} onDrop={(event) => message.info(`${event.dataTransfer?.files.length ?? 0} file(s) dropped`)} onChange={(info) => message.success({ content: `${info.file.name} added`, duration: 1 })}>
                      <div class="py-5 text-center"><div class="text-sm font-medium text-text">Drop a release artifact here</div><div class="mt-1 text-xs text-text-secondary">or click to select a local file</div></div>
                    </Upload.Dragger>
                    <div class="overflow-x-auto pb-1"><div class="min-w-[560px]"><Transfer showSearch defaultTargetKeys={['grace']} dataSource={[{ key: 'ada', title: 'Ada Lovelace' }, { key: 'grace', title: 'Grace Hopper' }, { key: 'margaret', title: 'Margaret Hamilton' }, { key: 'barbara', title: 'Barbara Liskov' }]} /></div></div>
                  </div>
                </Card>
              </div>
            </section>

            <section id="display" class="scroll-mt-4 space-y-4">
              <div>
                <h2 class="text-lg font-semibold text-text">Data display</h2>
                <p class="text-sm text-text-secondary">Structured records, hierarchy, media, status, and long-form content.</p>
              </div>

              <div class="grid gap-5 lg:grid-cols-3">
                <Card title="Team directory" class="lg:col-span-2">
                  <List dataSource={teams} renderItem={(team) => <List.Item actions={[<Button type="link">Open</Button>]}><List.Item.Meta avatar={<Avatar>{team.name.slice(0, 1)}</Avatar>} title={team.name} description={team.description} /></List.Item>} />
                </Card>
                <Card title="Release code">
                  <div class="flex flex-col items-center gap-3">
                    <QRCode type="svg" value="https://example.com/releases/0.1.0" />
                    <Typography.Text copyable>release/0.1.0</Typography.Text>
                    <Avatar.Group max={3}><Avatar>A</Avatar><Avatar>G</Avatar><Avatar>M</Avatar><Avatar>B</Avatar></Avatar.Group>
                  </div>
                </Card>
              </div>

              <Card title="Workspace members" extra={<Badge count={members.length} showZero />}>
                <Table rowKey="id" bordered dataSource={members} columns={[{ dataIndex: 'name', title: 'Name', sorter: true }, { dataIndex: 'role', title: 'Role', filterSearch: true, filters: [{ text: 'Owner', value: 'Owner' }, { text: 'Engineer', value: 'Engineer' }, { text: 'Admin', value: 'Admin' }, { text: 'Reviewer', value: 'Reviewer' }], onFilter: (value, record) => record.role === value }, { dataIndex: 'status', title: 'Status', render: (value) => <Tag color={value === 'Active' ? 'green' : 'gold'}>{value as string}</Tag> }, { dataIndex: 'projects', title: 'Projects', sorter: true, align: 'right' }]} rowSelection={{}} expandable={{ expandedRowRender: (record) => <div class="grid gap-2 text-sm sm:grid-cols-3"><span><strong>Member:</strong> {record.name}</span><span><strong>Role:</strong> {record.role}</span><span><strong>Projects:</strong> {record.projects}</span></div> }} pagination={{ pageSize: 4, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}` }} scroll={{ x: 720 }} />
              </Card>

              <div class="grid gap-5 xl:grid-cols-2">
                <Card title="Release details">
                  <Descriptions bordered column={2} items={[{ label: 'Package', children: 'ant-design-solid' }, { label: 'Version', children: <Tag color="blue">0.1.0</Tag> }, { label: 'Runtime', children: 'Solid 2 beta' }, { label: 'Status', children: <Badge status="success" text="Ready" /> }, { label: 'Distribution', children: 'Client, SSR, declarations, and locale packs', span: 2 }]} />
                  <Divider orientation="start">Activity</Divider>
                  <Timeline items={[{ children: 'Build completed', color: 'green' }, { children: '271 tests passed', color: 'green' }, { children: 'Package verified', color: 'blue' }]} pending="Awaiting publish" />
                </Card>
                <Card title="Repository tree">
                  <Tree checkable draggable defaultExpandAll height={220} fieldNames={{ key: 'id', title: 'name', children: 'nodes' }} filterTreeNode={(node) => node.id === 'table'} titleRender={(node) => <span>{node.name as string}</span>} treeData={[{ id: 'src', name: 'src', nodes: [{ id: 'components', name: 'components', nodes: [{ id: 'form', name: 'form' }, { id: 'table', name: 'table' }, { id: 'tree', name: 'tree' }] }, { id: 'locales', name: 'locale' }] }, { id: 'tests', name: 'tests' }, { id: 'dist', name: 'dist' }]} />
                  <Divider />
                  <Collapse defaultActiveKey="api" items={[{ key: 'api', label: 'Public API', children: 'Root and component subpath exports are available for client and SSR consumers.' }, { key: 'tokens', label: 'Design tokens', children: 'Theme values are scoped through ConfigProvider.' }, { key: 'accessibility', label: 'Accessibility', children: 'Keyboard and ARIA behavior is covered by automated tests.' }]} />
                </Card>
              </div>

              <div class="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
                <Card title="Calendar">
                  <div class="overflow-x-auto"><div class="min-w-[680px]"><Calendar fullscreen defaultValue={dayjs('2026-07-30')} dateCellRender={(date) => date.date() === 30 ? <Badge status="processing" text="Release" /> : null} /></div></div>
                </Card>
                <Card title="Media carousel">
                  <Carousel arrows draggable>
                    <div class="relative h-64 overflow-hidden bg-[#dce6f2]"><Image preview={false} class="h-full w-full object-cover" src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80" alt="Team workspace" /><div class="absolute inset-x-0 bottom-0 bg-black/55 p-4 text-white">Workspace</div></div>
                    <div class="relative h-64 overflow-hidden bg-[#e4eadf]"><Image preview={false} class="h-full w-full object-cover" src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80" alt="Product studio" /><div class="absolute inset-x-0 bottom-0 bg-black/55 p-4 text-white">Product studio</div></div>
                  </Carousel>
                  <div class="mt-4"><Typography.Title level={4}>Component composition</Typography.Title><Typography.Paragraph ellipsis={{ rows: 2, expandable: 'collapsible' }}>The catalog combines production-oriented controls into realistic workflows while keeping every component available for focused inspection.</Typography.Paragraph></div>
                </Card>
              </div>
            </section>

            <section id="feedback" class="scroll-mt-4 space-y-4">
              <div>
                <h2 class="text-lg font-semibold text-text">Feedback and state</h2>
                <p class="text-sm text-text-secondary">Progress, loading, empty, result, overlays, and service notifications.</p>
              </div>

              <Card title="Status center">
                <Tabs defaultActiveKey="feedback" items={[{ key: 'feedback', label: 'Feedback', children: <div class="space-y-5"><Progress percent={68} aria-label="Deployment progress" /><Progress type="circle" percent={82} size={96} /><div class="grid gap-3 md:grid-cols-2"><Alert type="success" showIcon message="Deployment completed" /><Alert type="warning" showIcon message="Review required" /><Alert type="error" showIcon message="Validation failed" /><Alert type="info" showIcon message="New version available" /></div></div> }, { key: 'loading', label: 'Loading', children: <div class="grid gap-5 md:grid-cols-2"><Skeleton active avatar paragraph={{ rows: 3 }} /><Spin spinning tip="Loading component metadata"><div class="min-h-32 rounded-control border border-border-secondary bg-surface-container p-5">Component metadata</div></Spin></div> }, { key: 'empty', label: 'Empty', children: <Empty image="simple" description="No pending reviews"><Button>Request review</Button></Empty> }, { key: 'result', label: 'Result', children: <Result status="success" title="Package is ready" subTitle="All validation stages completed successfully." extra={<Button type="primary">View package</Button>} /> }]} />
                <Divider />
                <div class="flex flex-wrap gap-3">
                  <Button onClick={() => message.success('Changes saved')}>Message</Button>
                  <Button onClick={() => notification.success({ message: 'Deployment complete', description: 'Version 0.1.0 is ready to publish.' })}>Notification</Button>
                  <Popover title="Deployment" content="Last verified a few seconds ago."><Button>Popover</Button></Popover>
                  <Tooltip title="Runs the full verification pipeline"><Button>Tooltip</Button></Tooltip>
                  <Button onClick={() => Modal.confirm({ title: 'Publish changes', content: 'Publish this workspace configuration?' })}>Confirm dialog</Button>
                </div>
              </Card>
            </section>

            <section id="extensions" class="scroll-mt-4 space-y-4 pb-8">
              <div>
                <h2 class="text-lg font-semibold text-text">Ant Design v6 extensions</h2>
                <p class="text-sm text-text-secondary">Animated boundaries, masonry layout, split panes, and protected content.</p>
              </div>

              <div class="grid gap-5 lg:grid-cols-2">
                <BorderBeam color={[{ color: '#1677ff', percent: 15 }, { color: '#52c41a', percent: 55 }, { color: '#faad14', percent: 85 }]} lineWidth={2} class="rounded-surface border border-border bg-surface p-5">
                  <div class="mb-4 flex items-center justify-between"><h3 class="font-semibold text-text">Border Beam</h3><Badge status="processing" text="Animated" /></div>
                  <p class="text-sm text-text-secondary">A token-aware animated boundary for focused operational states.</p>
                  <Progress class="mt-5" percent={76} />
                </BorderBeam>

                <Card title="Watermark">
                  <Watermark content={['Ant Design Solid', { text: 'Internal preview', font: { fontSize: 12 } }]} gap={[44, 34]}>
                    <div class="min-h-36 rounded-control border border-border-secondary bg-surface-container p-5"><Typography.Title level={5}>Release brief</Typography.Title><Typography.Paragraph>Confidential package metadata and rollout information.</Typography.Paragraph></div>
                  </Watermark>
                </Card>

                <Card title="Masonry">
                  <Masonry columns={{ xs: 2, sm: 3 }} gutter={[12, 12]} items={[{ key: 'a', data: 'API', height: 76, children: <div class="h-full rounded-control bg-[#e6f4ff] p-3 text-primary">API surface</div> }, { key: 'b', data: 'SSR', height: 110, children: <div class="h-full rounded-control bg-[#f6ffed] p-3 text-success">SSR entries</div> }, { key: 'c', data: 'Locale', height: 88, children: <div class="h-full rounded-control bg-[#fffbe6] p-3 text-[#ad6800]">72 locales</div> }, { key: 'd', data: 'Types', height: 64, children: <div class="h-full rounded-control bg-[#fff2f0] p-3 text-error">Type declarations</div> }, { key: 'e', data: 'Tests', height: 92, children: <div class="h-full rounded-control bg-surface-container p-3 text-text">271 tests</div> }]} />
                </Card>

                <Card title="Splitter">
                  <Splitter class="h-56 rounded-control border border-border-secondary">
                    <Splitter.Panel collapsible defaultSize={36}><div class="h-full bg-surface-container p-4"><div class="mb-3 text-xs font-semibold uppercase text-text-secondary">Navigation</div><Space direction="vertical"><a href="#overview">Overview</a><a href="#entry">Inputs</a><a href="#display">Display</a></Space></div></Splitter.Panel>
                    <Splitter.Panel defaultSize={64}><div class="p-4"><Typography.Title level={5}>Resizable workspace</Typography.Title><Typography.Paragraph>Drag the separator or use arrow keys to resize both panels.</Typography.Paragraph></div></Splitter.Panel>
                  </Splitter>
                </Card>
              </div>
            </section>
          </div>
        </main>

        <FloatButton.Group trigger="click">
          <FloatButton aria-label="Create item" icon="+" onClick={() => setModalOpen(true)} />
          <FloatButton aria-label="Show notification" icon="!" onClick={() => notification.info({ message: 'Workbench status', description: 'All component demos are available.' })} />
          <FloatButton.BackTop visibilityHeight={300} />
        </FloatButton.Group>

        <Tour open={tourOpen()} onClose={() => setTourOpen(false)} onFinish={() => setTourOpen(false)} steps={[{ target: () => tourTarget ?? null, title: 'Component workbench', description: 'Each section groups components by the workflow they support.' }, { title: 'Service context', description: 'App scopes message, notification, and modal APIs.' }]} />

        <Drawer open={drawerOpen()} title="Workspace settings" onClose={() => setDrawerOpen(false)}>
          <Form layout="vertical">
            <Form.Item label="Display name"><Input defaultValue="Design system" /></Form.Item>
            <Form.Item label="Visibility"><Radio.Group defaultValue="private" options={[{ value: 'private', label: 'Private' }, { value: 'public', label: 'Public' }]} /></Form.Item>
            <Form.Item label="Notifications"><Switch defaultChecked /></Form.Item>
          </Form>
        </Drawer>

        <Modal open={modalOpen()} title="Create workspace" onCancel={() => setModalOpen(false)} onOk={() => workspaceForm.submit()}>
          <Form form={workspaceForm} layout="vertical" onFinish={() => { setModalOpen(false); workspaceForm.resetFields(); message.success('Workspace created'); }}>
            <p class="mb-4 text-text-secondary">Choose a name for the new workspace.</p>
            <Form.Item name="name" label="Workspace name" rules={[{ required: true, min: 3 }]}><Input autofocus placeholder="Workspace name" aria-label="Workspace name" /></Form.Item>
          </Form>
        </Modal>
      </DesignApp>
    </ConfigProvider>
  );
}
