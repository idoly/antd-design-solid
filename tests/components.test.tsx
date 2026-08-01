import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library';
import dayjs from 'dayjs';
import { createMemo, createSignal, useContext } from 'solid-js';
import { render as renderSolid } from '@solidjs/web';
import type { JSX } from '@solidjs/web';
import type { AffixRef, CheckboxRef, DatePickerPanelMode, FloatButtonRef, GetProp, GetProps, GetRef, MentionsRef, MenuRef, RefSelectProps, TableRef } from '../src';
import { Affix, Alert, Anchor, App, AutoComplete, Avatar, Badge, BorderBeam, Breadcrumb, Button, Calendar, Card, Carousel, Cascader, Checkbox, Collapse, ColorPicker, ConfigProvider, DatePicker, Descriptions, Divider, Drawer, Dropdown, Empty, Flex, FloatButton, Form, Grid, Image, Input, InputNumber, Layout, List, Masonry, Menu, Mentions, message, Modal, moveTreeNode, notification, Pagination, Popconfirm, Popover, Progress, QRCode, Radio, Rate, Result, Segmented, Select, Skeleton, Slider, Space, Spin, Splitter, Statistic, Steps, Switch, Table, Tabs, Tag, Timeline, TimePicker, Tooltip, Tour, Transfer, Tree, TreeSelect, Typography, Upload, unstableSetRender, version, Watermark, theme, enUS, zhCN } from '../src';

const enforcePerformanceBudget = process.env.COMPONENT_TEST_ENFORCE_PERFORMANCE_BUDGET === '1';
const expectRenderWithin = (started: number, budgetMs: number) => {
  if (enforcePerformanceBudget) expect(performance.now() - started).toBeLessThan(budgetMs);
};

describe('Ant Design Solid primitives', () => {
  it('exports component prop and ref utility types', () => {
    const props = { type: 'primary' } satisfies GetProps<typeof Button>;
    const onClick: GetProp<typeof Button, 'onClick'> = () => undefined;
    const inputRef: GetRef<typeof Input> = document.createElement('input');
    expect(props.type).toBe('primary');
    expect(onClick).toBeTypeOf('function');
    expect(inputRef).toBeInstanceOf(HTMLInputElement);
  });
  it('exposes functional component refs', () => {
    let affixRef: AffixRef | undefined;
    let checkboxRef: CheckboxRef | undefined;
    let floatRef: FloatButtonRef | undefined;
    let menuRef: MenuRef | undefined;
    let selectRef: RefSelectProps | undefined;
    render(() => <><Affix ref={(value) => { affixRef = value; }}>Pinned</Affix><Checkbox ref={(value) => { checkboxRef = value; }}>Check</Checkbox><FloatButton aria-label="Float ref" ref={(value) => { floatRef = value; }} /><Menu ref={(value) => { menuRef = value; }} items={[{ key: 'one', label: 'One' }]} /><Select aria-label="Select ref" ref={(value) => { selectRef = value; }} options={[{ value: 'one', label: 'One' }]} /></>);
    expect(() => affixRef?.updatePosition()).not.toThrow();
    expect(checkboxRef?.input).toBe(screen.getByRole('checkbox'));
    checkboxRef?.focus();
    expect(screen.getByRole('checkbox')).toHaveFocus();
    expect(floatRef?.nativeElement).toBe(screen.getByRole('button', { name: 'Float ref' }));
    expect(menuRef?.menu).toBe(screen.getByRole('menu'));
    selectRef?.focus();
    expect(screen.getByRole('combobox', { name: 'Select ref' })).toHaveFocus();
  });

  it('disables a loading button and exposes busy state', () => {
    render(() => <Button loading>Save</Button>);
    const button = screen.getByRole('button', { name: /save/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('delays and cancels object-form Button loading state', async () => {
    const [loading, setLoading] = createSignal<boolean | { delay: number }>({ delay: 25 });
    render(() => <Button loading={loading()}>Delayed save</Button>);
    const button = screen.getByRole('button', { name: /delayed save/i });
    expect(button).toBeEnabled();
    expect(button).not.toHaveAttribute('aria-busy');
    await waitFor(() => expect(button).toHaveAttribute('aria-busy', 'true'));
    expect(button).toBeDisabled();
    setLoading(false);
    await waitFor(() => expect(button).toBeEnabled());
    expect(button).not.toHaveAttribute('aria-busy');
  });

  it('supports linked and custom-color Tags', () => {
    render(() => <Tag href="/release" color="#123456" variant="outlined" icon="i">Release</Tag>);
    const link = screen.getByRole('link', { name: /Release/ });
    expect(link).toHaveAttribute('href', '/release');
    expect(link).toHaveStyle({ 'border-color': '#123456', color: '#123456' });
  });

  it('controls CheckableTag with checkbox keyboard semantics', async () => {
    const [checked, setChecked] = createSignal(false);
    render(() => <Tag.CheckableTag checked={checked()} onChange={setChecked}>Frontend</Tag.CheckableTag>);
    const tag = screen.getByRole('checkbox', { name: 'Frontend' });
    fireEvent.keyDown(tag, { key: ' ' });
    await waitFor(() => expect(tag).toHaveAttribute('aria-checked', 'true'));
  });

  it('binds multiple CheckableTagGroup values to Form', async () => {
    const onFinish = vi.fn();
    render(() => <Form onFinish={onFinish}><Form.Item name="skills" label="Skills"><Tag.CheckableTagGroup multiple options={[{ value: 'solid', label: 'Solid' }, { value: 'typescript', label: 'TypeScript' }]} /></Form.Item><Button htmlType="submit">Save skills</Button></Form>);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Solid' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'TypeScript' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save skills' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ skills: ['solid', 'typescript'] }));
  });

  it('renders input state and forwards native attributes', () => {
    render(() => <Input status="error" aria-label="Email" required />);
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toBeRequired();
    expect(input.parentElement).toHaveClass('border-error');
  });

  it('clears Input values and renders character counts', async () => {
    const onInput = vi.fn();
    render(() => <Input aria-label="Account" defaultValue="solid" allowClear showCount maxlength={10} onInput={onInput} />);
    expect(screen.getByText('5 / 10')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear input' }));
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Account' })).toHaveValue(''));
    expect(onInput).toHaveBeenCalled();
  });

  it('applies Input semantics, count config, enter, change, and clear callbacks', () => {
    const onChange = vi.fn();
    const onPressEnter = vi.fn();
    const onClear = vi.fn();
    const { container } = render(() => <Input aria-label="Semantic input" defaultValue="solid" allowClear count={{ show: true, max: 10 }} classNames={{ root: 'input-root', input: 'input-control', count: 'input-count' }} styles={{ input: { color: 'rgb(0, 0, 255)' } }} onChange={onChange} onPressEnter={onPressEnter} onClear={onClear} />);
    expect(container.querySelector('.input-root')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Semantic input' })).toHaveClass('input-control');
    expect(screen.getByRole('textbox', { name: 'Semantic input' })).toHaveStyle({ color: 'rgb(0, 0, 255)' });
    expect(screen.getByText('5 / 10')).toHaveClass('input-count');
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Semantic input' }), { key: 'Enter' });
    expect(onPressEnter).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', { name: 'Clear input' }));
    expect(onClear).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalled();
  });

  it('submits TextArea values through Form and displays its count', async () => {
    const onFinish = vi.fn();
    render(() => <Form onFinish={onFinish}><Form.Item name="notes" label="Notes"><Input.TextArea aria-label="Notes field" showCount maxlength={20} /></Form.Item><Button htmlType="submit">Save notes</Button></Form>);
    fireEvent.input(screen.getByRole('textbox', { name: 'Notes field' }), { target: { value: 'Solid textarea' } });
    expect(await screen.findByText('14 / 20')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Save notes' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ notes: 'Solid textarea' }));
  });

  it('submits Search on Enter with the current value', () => {
    const onSearch = vi.fn();
    render(() => <Input.Search aria-label="Repository search" defaultValue="components" onSearch={onSearch} enterButton />);
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Repository search' }), { key: 'Enter' });
    expect(onSearch).toHaveBeenCalledWith('components', expect.anything(), { source: 'input' });
  });

  it('toggles Password visibility with accessible state', async () => {
    render(() => <Input.Password aria-label="Secret" defaultValue="ant-solid" />);
    const password = screen.getByLabelText('Secret');
    expect(password).toHaveAttribute('type', 'password');
    fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
    await waitFor(() => expect(password).toHaveAttribute('type', 'text'));
    expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('accepts pasted OTP values and binds the completed code to Form', async () => {
    const onFinish = vi.fn();
    const onChange = vi.fn();
    render(() => <Form onFinish={onFinish}><Form.Item name="code" label="Code"><Input.OTP length={4} onChange={onChange} /></Form.Item><Button htmlType="submit">Verify code</Button></Form>);
    fireEvent.paste(screen.getByRole('textbox', { name: 'Digit 1 of 4' }), { clipboardData: { getData: () => '4821' } });
    await waitFor(() => expect(onChange).toHaveBeenCalledWith('4821'));
    fireEvent.click(screen.getByRole('button', { name: 'Verify code' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ code: '4821' }));
  });

  it('closes alerts after an unprevented close event', async () => {
    const afterClose = vi.fn();
    render(() => <Alert closable message="Temporary notice" afterClose={afterClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByText('Temporary notice')).not.toBeInTheDocument());
    expect(afterClose).toHaveBeenCalledOnce();
  });

  it('renders Alert.ErrorBoundary details for child failures', async () => {
    const onError = vi.fn();
    function Broken() { if (true) throw new Error('Widget crashed'); return <span />; }
    render(() => <Alert.ErrorBoundary title="Unable to render" onError={onError}><Broken /></Alert.ErrorBoundary>);
    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to render');
    expect(screen.getByRole('alert')).toHaveTextContent('Widget crashed');
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: 'Widget crashed' }));
  });

  it('resets Alert.ErrorBoundary through a custom fallback', async () => {
    const [broken, setBroken] = createSignal(true);
    function Recoverable() { const content = createMemo(() => { if (broken()) throw new Error('Temporary failure'); return 'Recovered content'; }); return <span>{content()}</span>; }
    render(() => <Alert.ErrorBoundary fallback={(error, reset) => <Button onClick={() => { setBroken(false); reset(); }}>Retry {error.message}</Button>}><Recoverable /></Alert.ErrorBoundary>);
    fireEvent.click(await screen.findByRole('button', { name: 'Retry Temporary failure' }));
    expect(await screen.findByText('Recovered content')).toBeInTheDocument();
  });

  it('allows tag close to be prevented', () => {
    render(() => <Tag closable onClose={(event) => event.preventDefault()}>Pinned</Tag>);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.getByText('Pinned')).toBeInTheDocument();
  });

  it('renders Card Meta, Grid, actions, and controlled tab state', async () => {
    const onTabChange = vi.fn();
    const { container } = render(() => <Card title="Profile" defaultActiveTabKey="details" onTabChange={onTabChange} tabProps={{ class: 'card-tab-list', style: { color: 'rgb(1, 2, 3)' } }} classNames={() => ({ root: 'card-root-slot', header: 'card-header-slot', body: 'card-body-slot', title: 'card-title-slot', actions: 'card-actions-slot' })} styles={() => ({ body: { color: 'rgb(4, 5, 6)' } })} tabList={[{ key: 'details', label: 'Details' }, { key: 'activity', label: 'Activity' }]} actions={[<Button type="text">Edit profile</Button>, <Button type="text">Share profile</Button>]}><Card.Meta title="Ada Lovelace" description="Owner" /><Card.Grid>Projects</Card.Grid><Card.Grid>Teams</Card.Grid></Card>);
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(container.querySelectorAll('.ads-card-grid')).toHaveLength(2);
    expect(container.querySelector('.card-root-slot')).toContainElement(container.querySelector('.card-header-slot'));
    expect(container.querySelector('.card-header-slot')).toContainElement(container.querySelector('.card-title-slot'));
    expect(container.querySelector('.card-body-slot')).toHaveStyle({ color: 'rgb(4, 5, 6)' });
    expect(container.querySelector('.card-tab-list')).toHaveStyle({ color: 'rgb(1, 2, 3)' });
    fireEvent.click(screen.getByRole('tab', { name: 'Activity' }));
    await waitFor(() => expect(screen.getByRole('tab', { name: 'Activity' })).toHaveAttribute('aria-selected', 'true'));
    expect(onTabChange).toHaveBeenCalledWith('activity');
    expect(screen.getByRole('button', { name: 'Edit profile' })).toBeInTheDocument();
  });

  it('replaces Card content with a loading skeleton', () => {
    const { container } = render(() => <Card loading><span>Loaded content</span></Card>);
    expect(screen.queryByText('Loaded content')).not.toBeInTheDocument();
    expect(container.querySelector('.ads-skeleton')).toBeInTheDocument();
  });

  it('limits numeric badge counts', () => {
    render(() => <Badge count={120} overflowCount={99}><span>Inbox</span></Badge>);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('renders logical Badge ribbons with preset and custom colors', () => {
    const { container } = render(() => <Badge.Ribbon placement="start" color="blue" text="Featured"><article>Release notes</article></Badge.Ribbon>);
    expect(screen.getByText('Featured')).toBeInTheDocument();
    expect(screen.getByText('Release notes')).toBeInTheDocument();
    const ribbon = container.querySelector('.ads-badge-ribbon') as HTMLElement;
    expect(ribbon).toHaveStyle({ 'background-color': '#1677ff', 'inset-inline-start': '-8px' });
    const custom = render(() => <Badge.Ribbon color="#123456" text="Custom"><span>Content</span></Badge.Ribbon>);
    expect(custom.container.querySelector('.ads-badge-ribbon')).toHaveStyle({ 'background-color': '#123456', 'inset-inline-end': '-8px' });
  });

  it('maps theme overrides to scoped CSS variables', () => {
    const { container } = render(() => <ConfigProvider theme={{ colorPrimary: '#123456' }}><Button>Theme</Button></ConfigProvider>);
    expect(container.firstElementChild).toHaveStyle({ '--ads-color-primary': '#123456' });
  });

  it('maps interactive component tokens to public CSS variables', () => {
    const { container } = render(() => (
      <ConfigProvider theme={{ components: {
        Button: { focusRing: '0 0 0 3px #ff0000', activeTransform: 'translateY(1px)' },
        FloatButton: { defaultHoverBg: '#eeeeee', focusRing: '0 0 0 3px #00ff00' },
        Tooltip: { colorBg: '#112233', colorText: '#ffffff', maxWidth: 320 },
      } }}>
        <Button>Token button</Button>
        <FloatButton aria-label="Token float" />
        <Tooltip title="Token tooltip" open><Button>Token trigger</Button></Tooltip>
      </ConfigProvider>
    ));
    const css = container.querySelector('style')?.textContent ?? '';
    expect(css).toContain('--ads-button-focus-ring:0 0 0 3px #ff0000');
    expect(css).toContain('--ads-button-active-transform:translateY(1px)');
    expect(css).toContain('--ads-float-button-default-hover-bg:#eeeeee');
    expect(css).toContain('--ads-float-button-focus-ring:0 0 0 3px #00ff00');
    expect(css).toContain('--ads-tooltip-color-bg:#112233');
    expect(css).toContain('--ads-tooltip-color-text:#ffffff');
    expect(screen.getByRole('tooltip')).toHaveStyle({
      backgroundColor: 'var(--ads-tooltip-color-bg, rgba(0, 0, 0, 0.85))',
      color: 'var(--ads-tooltip-color-text, #fff)',
      maxWidth: 'var(--ads-tooltip-max-width, 250px)',
    });
  });

  it('applies ConfigProvider locale across component families', async () => {
    render(() => <ConfigProvider locale={zhCN}><Empty /><Select aria-label="Localized select" open /><Modal open title="标题">内容</Modal><DatePicker aria-label="Localized date" /><Pagination total={30} /><QRCode value="locale" status="expired" /><Form validateTrigger="onBlur"><Form.Item name="account" label="账户" rules={[{ required: true }]}><Input aria-label="Localized form field" /></Form.Item></Form></ConfigProvider>);
    expect(screen.getAllByText('暂无数据').length).toBeGreaterThan(0);
    expect(screen.getByText('无匹配结果')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '确定' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '取消' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Localized date' })).toHaveAttribute('placeholder', '请选择日期');
    expect(screen.getByRole('button', { name: '上一页' })).toBeInTheDocument();
    expect(screen.getByText('二维码过期')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '点击刷新' })).toBeInTheDocument();
    fireEvent.blur(screen.getByRole('textbox', { name: 'Localized form field' }));
    await waitFor(() => expect(screen.getByText('请输入账户')).toBeInTheDocument());
  });

  it('applies ConfigProvider token algorithms and direction', () => {
    const { container } = render(() => <ConfigProvider direction="rtl" theme={{ token: { colorPrimary: '#234567', controlHeight: 36 }, algorithm: theme.compactAlgorithm }}><Button>RTL</Button></ConfigProvider>);
    expect(container.firstElementChild).toHaveAttribute('dir', 'rtl');
    expect(container.firstElementChild).toHaveStyle({ '--ads-color-primary': '#234567', '--ads-radius-control': '4px', '--ads-token-control-height': '36px' });
  });

  it('scopes and merges ConfigProvider component design tokens', async () => {
    function ThemeReader() { const config = useContext(ConfigProvider.ConfigContext); const token = config.componentTheme('Button'); return <output aria-label="Component theme">{String(token.colorPrimary)}:{String(token.controlHeight)}</output>; }
    const { container } = render(() => (
      <ConfigProvider theme={{ components: { Button: { colorPrimary: '#112233', controlHeight: 36, contentFontSize: 15, iconGap: 6, paddingInline: 18 }, Input: { colorBorder: '#445566', controlHeight: 34, paddingInline: 17, inputFontSize: 15 }, InputNumber: { controlWidth: 112, handleWidth: 28, inputFontSize: 15, paddingInline: 13 }, Select: { controlHeight: 38, optionHeight: 41, optionSelectedBg: '#ddeeff' }, Form: { itemMarginBottom: 21, labelFontSize: 13 }, Table: { cellPaddingBlockMD: 19, headerBg: '#abcdef' }, DatePicker: { cellWidth: 44, presetsWidth: 156 }, Modal: { borderRadius: 12, contentBg: '#fedcba', titleFontSize: 19 }, Switch: { handleBg: '#ffeecc', handleSize: 20, trackHeight: 24, trackMinWidth: 48 }, Slider: { handleColor: '#654321', handleSize: 18, railBg: '#eeeeee', railSize: 8, trackBg: '#abcdef' }, Radio: { buttonBg: '#f0f1f2', buttonPaddingInline: 19, buttonSolidCheckedBg: '#123456' }, Progress: { defaultColor: '#345678', lineBorderRadius: 7, remainingColor: '#ddeeff' }, Popover: { zIndexPopup: 1400 } } }} csp={{ nonce: 'theme-nonce' }}>
        <Button>Outer themed button</Button>
        <Input aria-label="Token input" />
        <InputNumber aria-label="Token input number" defaultValue={42} />
        <Select aria-label="Token select" open options={[{ value: 'token', label: 'Token option' }]} />
        <Form layout="vertical"><Form.Item name="token" label="Token label"><Input /></Form.Item></Form>
        <Table pagination={false} dataSource={[{ key: 1, name: 'Token row' }]} columns={[{ dataIndex: 'name', title: 'Token header' }]} />
        <DatePicker aria-label="Portal token date" defaultValue={dayjs('2026-02-10')} />
        <Modal open title="Portal token modal">Modal token content</Modal>
        <Switch aria-label="Token switch" defaultChecked />
        <Slider aria-label="Token slider" defaultValue={40} />
        <Radio.Group optionType="button" buttonStyle="solid" defaultValue="token" options={[{ value: 'token', label: 'Token radio' }]} />
        <Progress aria-label="Token progress" percent={40} />
        <Popover open content="Portal token popover"><Button>Portal token trigger</Button></Popover>
        <ThemeReader />
        <ConfigProvider theme={{ components: { Button: { colorPrimary: '#778899' }, Popover: { zIndexPopup: 1500 } } }}><Button>Inner themed button</Button><Popover open aria-label="Inner themed popover" content="Inner popup">Inner trigger</Popover><ThemeReader /></ConfigProvider>
      </ConfigProvider>
    ));
    const styles = container.querySelectorAll('style');
    expect(styles[0]).toHaveAttribute('nonce', 'theme-nonce');
    expect(styles[0].textContent).toContain('.ads-button');
    expect(styles[0].textContent).toContain('--ads-color-primary:#112233');
    expect(styles[0].textContent).toContain('--ads-button-control-height:36px');
    expect(styles[0].textContent).toContain('.ads-input');
    expect(styles[0].textContent).toContain('--ads-input-number-control-width:112px');
    expect(styles[0].textContent).toContain('--ads-select-option-height:41px');
    expect(styles[0].textContent).toContain('--ads-form-item-margin-bottom:21px');
    expect(screen.getByRole('button', { name: 'Outer themed button' }).getAttribute('style')).toContain('height: var(--ads-button-control-height');
    expect(screen.getByRole('button', { name: 'Outer themed button' }).getAttribute('style')).toContain('var(--ads-button-content-font-size');
    expect(screen.getByRole('textbox', { name: 'Token input' }).getAttribute('style')).toContain('height: var(--ads-input-control-height');
    expect(screen.getByRole('textbox', { name: 'Token input' }).getAttribute('style')).toContain('var(--ads-input-padding-inline');
    expect(screen.getByRole('spinbutton', { name: 'Token input number' }).closest('.ads-input-number')?.getAttribute('style')).toContain('var(--ads-input-number-control-width');
    expect(screen.getByRole('spinbutton', { name: 'Token input number' }).getAttribute('style')).toContain('var(--ads-input-number-padding-inline');
    expect(screen.getByRole('combobox', { name: 'Token select' }).closest('.ads-select')).toHaveStyle({ minHeight: 'var(--ads-select-control-height, 32px)', backgroundColor: 'var(--ads-select-selector-bg, var(--ads-color-surface))' });
    expect(styles[0].textContent).toContain('--ads-radius-control:12px');
    expect(screen.getByRole('option', { name: 'Token option' }).closest('.ads-select-dropdown')).toBeInTheDocument();
    expect(screen.getByText('Token label').closest('form')).toHaveAttribute('data-layout', 'vertical');
    expect(styles[0].textContent).toContain('--ads-date-picker-presets-width:156px');
    expect(styles[0].textContent).toContain('--ads-table-cell-padding-block-md:19px');
    expect(styles[0].textContent).toContain('--ads-switch-handle-size:20px');
    expect(styles[0].textContent).toContain('--ads-slider-handle-size:18px');
    expect(styles[0].textContent).toContain('--ads-radio-button-padding-inline:19px');
    expect(styles[0].textContent).toContain('--ads-progress-remaining-color:#ddeeff');
    const tokenSwitch = screen.getByRole('switch', { name: 'Token switch' });
    expect(tokenSwitch.getAttribute('style')).toContain('var(--ads-switch-track-height');
    expect(tokenSwitch.querySelector('span')?.getAttribute('style')).toContain('var(--ads-switch-handle-size');
    expect(screen.getByRole('slider', { name: 'Token slider' }).parentElement?.querySelector('[aria-hidden="true"]')?.getAttribute('style')).toContain('var(--ads-slider-handle-size');
    expect(screen.getByRole('radio', { name: 'Token radio' }).closest('label')?.getAttribute('style')).toContain('var(--ads-radio-button-solid-checked-bg');
    expect(screen.getByRole('progressbar', { name: 'Token progress' }).querySelector('.overflow-hidden')?.getAttribute('style')).toContain('var(--ads-progress-line-border-radius');
    expect(screen.getByRole('columnheader', { name: 'Token header' }).getAttribute('style')).toContain('var(--ads-table-cell-padding-block-md');
    expect(screen.getByRole('cell', { name: 'Token row' }).getAttribute('style')).toContain('var(--ads-table-cell-padding-block-md');
    fireEvent.click(screen.getByRole('textbox', { name: 'Portal token date' }));
    const scopeClass = Array.from(container.firstElementChild!.classList).find((name) => name.startsWith('ads-theme-'))!;
    const datePopup = await screen.findByRole('dialog', { name: 'Date picker dialog' });
    expect(datePopup).toHaveClass(scopeClass, 'ads-popover-theme');
    expect(datePopup.querySelector('.ads-date-picker-theme')).toHaveClass(scopeClass);
    expect(screen.getByRole('dialog', { name: 'Portal token modal' }).closest('.ads-modal')).toHaveClass(scopeClass, 'ads-modal-theme');
    expect(screen.getByRole('dialog', { name: 'Portal token modal' })).toHaveClass('ads-modal-container');
    expect(screen.getByText('Portal token modal')).toHaveClass('ads-modal-title');
    expect(screen.getByRole('dialog', { name: 'Popover' })).toHaveClass(scopeClass, 'ads-popover-theme');
    const nestedPopup = screen.getByRole('dialog', { name: 'Inner themed popover' });
    const nestedScopes = Array.from(nestedPopup.classList).filter((name) => name.startsWith('ads-theme-'));
    expect(nestedScopes).toHaveLength(2);
    expect(nestedScopes).toContain(scopeClass);
    expect(screen.getAllByLabelText('Component theme')[0]).toHaveTextContent('#112233:36');
    expect(screen.getAllByLabelText('Component theme')[1]).toHaveTextContent('#778899:36');
  });

  it('exposes live ConfigProvider ConfigContext and SizeContext', () => {
    function ContextReader() { const config = useContext(ConfigProvider.ConfigContext); const size = useContext(ConfigProvider.SizeContext); return <span>{config.prefixCls()}:{size()}</span>; }
    render(() => <ConfigProvider prefixCls="custom" componentSize="large"><ContextReader /></ConfigProvider>);
    expect(screen.getByText('custom:large')).toBeInTheDocument();
    ConfigProvider.config({ prefixCls: 'global', theme: { colorPrimary: '#101010' }, locale: zhCN });
    function GlobalReader() { const config = ConfigProvider.useConfig(); return <span>{config.prefixCls()}:{config.theme().colorPrimary}:{config.locale().Modal?.okText}</span>; }
    render(() => <GlobalReader />);
    expect(screen.getByText('global:#101010:确定')).toBeInTheDocument();
    const staticModal = Modal.confirm({ content: 'Global locale modal' });
    expect(screen.getByRole('button', { name: '确定' })).toBeInTheDocument();
    staticModal.destroy();
    ConfigProvider.config({ prefixCls: 'ads', theme: { colorPrimary: '#1677ff' }, locale: enUS });
  });

  it('inherits ConfigProvider disabled, variant, empty, and popup policies', async () => {
    const popupHost = document.createElement('div');
    document.body.append(popupHost);
    const disabledView = render(() => <ConfigProvider componentDisabled><Button>Disabled action</Button><Input aria-label="Disabled input" /></ConfigProvider>);
    expect(screen.getByRole('button', { name: 'Disabled action' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'Disabled input' })).toBeDisabled();
    disabledView.unmount();

    render(() => <ConfigProvider variant="filled" renderEmpty={(name) => <>Empty {name}</>} getPopupContainer={() => popupHost}><Input aria-label="Filled input" /><Select open aria-label="Empty select" options={[]} /><Popover open content="Scoped popup"><Button>Popup trigger</Button></Popover></ConfigProvider>);
    expect(screen.getByRole('textbox', { name: 'Filled input' }).parentElement).toHaveClass('bg-surface-container');
    expect(await screen.findByText('Empty Select')).toBeInTheDocument();
    expect(popupHost).toHaveTextContent('Scoped popup');
    popupHost.remove();
  });

  it('merges nested ConfigProvider component defaults below local props', () => {
    render(() => (
      <ConfigProvider button={{ type: 'primary' }} input={{ size: 'large' }} select={{ allowClear: true }} datePicker={{ variant: 'filled' }} table={{ bordered: true }} modal={{ centered: true }}>
        <Button>Default primary</Button>
        <Input aria-label="Default large input" />
        <Select aria-label="Default clear select" defaultValue="a" options={[{ value: 'a', label: 'A' }]} />
        <DatePicker aria-label="Default filled date" />
        <Table pagination={false} dataSource={[{ key: 1, name: 'A' }]} columns={[{ dataIndex: 'name', title: 'Name' }]} />
        <Modal open title="Default centered modal">Body</Modal>
        <ConfigProvider button={{ type: 'text' }}><Button>Nested text</Button><Input size="small" aria-label="Local small input" /></ConfigProvider>
      </ConfigProvider>
    ));
    expect(screen.getByRole('button', { name: 'Default primary' })).toHaveClass('bg-primary');
    expect(screen.getByRole('textbox', { name: 'Default large input' })).toHaveClass('h-10');
    expect(screen.getByRole('button', { name: 'Clear selection' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Default filled date' }).closest('.ads-date-picker')).toHaveClass('bg-surface-container');
    expect(document.querySelector('.ads-table th')).toHaveClass('border-r');
    expect(screen.getByRole('dialog', { name: 'Default centered modal' }).parentElement).toHaveClass('items-center');
    expect(screen.getByRole('button', { name: 'Nested text' })).toHaveClass('bg-transparent');
    expect(screen.getByRole('textbox', { name: 'Local small input' })).toHaveClass('h-6');
  });

  it('applies extended ConfigProvider defaults with local precedence', async () => {
    render(() => (
      <ConfigProvider
        form={{ requiredMark: false }}
        upload={{ multiple: true }}
        tree={{ multiple: true }}
        treeSelect={{ allowClear: true }}
        pagination={{ disabled: true }}
        drawer={{ closable: false }}
        tooltip={{ defaultOpen: true }}
      >
        <Form><Form.Item name="project" label="Project" required><Input /></Form.Item></Form>
        <Form requiredMark><Form.Item name="owner" label="Owner" required><Input /></Form.Item></Form>
        <Upload><Button>Choose files</Button></Upload>
        <Tree treeData={[{ key: 'node', title: 'Node' }]} />
        <TreeSelect aria-label="Provider tree select" defaultValue="node" treeData={[{ value: 'node', title: 'Node' }]} />
        <Pagination total={20} />
        <Drawer open title="Provider drawer">Drawer body</Drawer>
        <Tooltip title="Provider tooltip"><Button>Tooltip target</Button></Tooltip>
      </ConfigProvider>
    ));
    expect(screen.getByText('Project').closest('label')).not.toHaveTextContent('*');
    expect(screen.getByText('Owner').closest('label')).toHaveTextContent('*');
    expect(document.querySelector<HTMLInputElement>('input[type="file"]')).toHaveProperty('multiple', true);
    expect(screen.getByRole('tree')).toHaveAttribute('aria-multiselectable', 'true');
    expect(screen.getByRole('button', { name: 'Clear selection' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('dialog', { name: 'Provider drawer' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Provider tooltip');
  });

  it('maps official semantic slots for core controls and overlays', async () => {
    const { container } = render(() => (
      <>
        <Button icon={<span>Icon</span>} classNames={{ root: 'button-root-slot', icon: 'button-icon-slot', content: 'button-content-slot' }} styles={{ content: { color: 'rgb(255, 0, 0)' } }}>Action</Button>
        <Alert title="Notice" description="Details" action="Resolve" closable classNames={{ root: 'alert-root-slot', icon: 'alert-icon-slot', section: 'alert-section-slot', title: 'alert-title-slot', description: 'alert-description-slot', actions: 'alert-actions-slot', close: 'alert-close-slot' }} showIcon />
        <InputNumber aria-label="Semantic number" prefix="$" suffix="USD" classNames={{ root: 'number-root-slot', prefix: 'number-prefix-slot', input: 'number-input-slot', suffix: 'number-suffix-slot', actions: 'number-actions-slot', action: 'number-action-slot' }} styles={{ input: { color: 'rgb(0, 0, 255)' } }} />
        <Drawer open title="Semantic drawer" extra="Extra" footer="Footer" classNames={{ root: 'drawer-root-slot', mask: 'drawer-mask-slot', section: 'drawer-section-slot', header: 'drawer-header-slot', title: 'drawer-title-slot', extra: 'drawer-extra-slot', body: 'drawer-body-slot', footer: 'drawer-footer-slot', close: 'drawer-close-slot' }}>Body</Drawer>
        <Tooltip open title="Semantic tooltip" classNames={{ root: 'tooltip-root-slot', container: 'tooltip-container-slot', arrow: 'tooltip-arrow-slot' }} styles={{ container: { color: 'rgb(0, 255, 0)' } }}><Button>Tooltip semantic target</Button></Tooltip>
      </>
    ));
    expect(container.querySelector('.button-root-slot')).toBeInTheDocument();
    expect(container.querySelector('.button-icon-slot')).toHaveTextContent('Icon');
    expect(container.querySelector('.button-content-slot')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    expect(container.querySelector('.alert-root-slot')).toBeInTheDocument();
    expect(container.querySelector('.alert-section-slot')).toContainElement(container.querySelector('.alert-title-slot'));
    expect(container.querySelector('.alert-actions-slot')).toHaveTextContent('Resolve');
    expect(container.querySelector('.number-input-slot')).toHaveStyle({ color: 'rgb(0, 0, 255)' });
    expect(container.querySelectorAll('.number-action-slot')).toHaveLength(2);
    expect(await screen.findByRole('dialog', { name: 'Semantic drawer' })).toHaveClass('drawer-section-slot');
    expect(document.querySelector('.drawer-root-slot')).toBeInTheDocument();
    expect(document.querySelector('.drawer-footer-slot')).toHaveTextContent('Footer');
    expect(await screen.findByRole('tooltip')).toHaveClass('tooltip-root-slot');
    expect(document.querySelector('.tooltip-container-slot')).toHaveStyle({ color: 'rgb(0, 255, 0)' });
  });

  it('maps official semantic slots for navigation and data display', () => {
    const { container } = render(() => (
      <>
        <Pagination total={20} classNames={{ root: 'pagination-root-slot', item: 'pagination-item-slot' }} styles={{ item: { color: 'rgb(255, 0, 0)' } }} />
        <Collapse defaultActiveKey="panel" items={[{ key: 'panel', label: 'Panel title', children: 'Panel body' }]} classNames={{ root: 'collapse-root-slot', header: 'collapse-header-slot', icon: 'collapse-icon-slot', title: 'collapse-title-slot', body: 'collapse-body-slot' }} />
        <Descriptions title="Profile" extra="Edit" items={[{ label: 'Name', children: 'Ada' }]} classNames={{ root: 'descriptions-root-slot', header: 'descriptions-header-slot', title: 'descriptions-title-slot', extra: 'descriptions-extra-slot', label: 'descriptions-label-slot', content: 'descriptions-content-slot' }} />
        <Tabs defaultActiveKey="first" items={[{ key: 'first', label: 'First', children: 'First content' }, { key: 'second', label: 'Second', children: 'Second content' }]} classNames={{ root: 'tabs-root-slot', header: 'tabs-header-slot', item: 'tabs-item-slot', indicator: 'tabs-indicator-slot', body: 'tabs-body-slot', content: 'tabs-content-slot' }} />
      </>
    ));
    expect(container.querySelector('.pagination-root-slot')).toBeInTheDocument();
    expect(container.querySelectorAll('.pagination-item-slot').length).toBeGreaterThan(2);
    expect(container.querySelector('.collapse-header-slot')).toContainElement(container.querySelector('.collapse-title-slot'));
    expect(container.querySelector('.collapse-body-slot')).toHaveTextContent('Panel body');
    expect(container.querySelector('.descriptions-header-slot')).toContainElement(container.querySelector('.descriptions-title-slot'));
    expect(container.querySelector('.descriptions-label-slot')).toHaveTextContent('Name');
    expect(container.querySelector('.descriptions-content-slot')).toHaveTextContent('Ada');
    expect(container.querySelector('.tabs-header-slot')).toContainElement(container.querySelector('.tabs-indicator-slot'));
    expect(container.querySelector('.tabs-body-slot')).toContainElement(container.querySelector('.tabs-content-slot'));
  });

  it('maps official semantic slots for selection controls', () => {
    const { container } = render(() => (
      <>
        <Checkbox classNames={{ root: 'checkbox-root-slot', icon: 'checkbox-icon-slot', label: 'checkbox-label-slot' }} styles={{ label: { color: 'rgb(255, 0, 0)' } }}>Checkbox label</Checkbox>
        <Radio classNames={{ root: 'radio-root-slot', icon: 'radio-icon-slot', label: 'radio-label-slot' }} styles={{ icon: { width: '18px' } }}>Radio label</Radio>
        <Switch checkedChildren="On" classNames={{ root: 'switch-root-slot', content: 'switch-content-slot', indicator: 'switch-indicator-slot' }} styles={{ content: { color: 'rgb(0, 0, 255)' } }} />
      </>
    ));
    expect(container.querySelector('.checkbox-root-slot')).toContainElement(container.querySelector('.checkbox-icon-slot'));
    expect(container.querySelector('.checkbox-label-slot')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    expect(container.querySelector('.radio-root-slot')).toContainElement(container.querySelector('.radio-label-slot'));
    expect(container.querySelector('.radio-icon-slot')).toHaveStyle({ width: '18px' });
    expect(container.querySelector('.switch-root-slot')).toContainElement(container.querySelector('.switch-indicator-slot'));
    expect(container.querySelector('.switch-content-slot')).toHaveStyle({ color: 'rgb(0, 0, 255)' });
  });

  it('maps official semantic slots for progress controls', () => {
    const { container } = render(() => (
      <>
        <Slider defaultValue={40} classNames={{ root: 'slider-root-slot', rail: 'slider-rail-slot', tracks: 'slider-tracks-slot', track: 'slider-track-slot', handle: 'slider-handle-slot' }} styles={{ handle: { color: 'rgb(255, 0, 0)' } }} />
        <Progress percent={40} classNames={{ root: 'progress-root-slot', body: 'progress-body-slot', rail: 'progress-rail-slot', track: 'progress-track-slot', indicator: 'progress-indicator-slot' }} />
        <Steps current={0} items={[{ title: 'Build', subTitle: 'Now', description: 'Compiling' }, { title: 'Release' }]} classNames={{ root: 'steps-root-slot', item: 'steps-item-slot', itemWrapper: 'steps-wrapper-slot', itemIcon: 'steps-icon-slot', itemHeader: 'steps-header-slot', itemTitle: 'steps-title-slot', itemSubtitle: 'steps-subtitle-slot', itemSection: 'steps-section-slot', itemContent: 'steps-content-slot', itemRail: 'steps-rail-slot' }} />
      </>
    ));
    expect(container.querySelector('.slider-root-slot')).toContainElement(container.querySelector('.slider-rail-slot'));
    expect(container.querySelector('.slider-tracks-slot')).toContainElement(container.querySelector('.slider-track-slot'));
    expect(container.querySelector('.slider-handle-slot')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    expect(container.querySelector('.progress-body-slot')).toContainElement(container.querySelector('.progress-rail-slot'));
    expect(container.querySelector('.progress-rail-slot')).toContainElement(container.querySelector('.progress-track-slot'));
    expect(container.querySelector('.progress-indicator-slot')).toHaveTextContent('40%');
    expect(container.querySelector('.steps-item-slot')).toContainElement(container.querySelector('.steps-wrapper-slot'));
    expect(container.querySelector('.steps-header-slot')).toContainElement(container.querySelector('.steps-title-slot'));
    expect(container.querySelector('.steps-section-slot')).toContainElement(container.querySelector('.steps-content-slot'));
  });

  it('maps official semantic slots for utility and result components', () => {
    const { container } = render(() => (
      <>
        <Divider classNames={{ root: 'divider-root-slot', rail: 'divider-rail-slot', content: 'divider-content-slot' }}>Section</Divider>
        <Empty classNames={{ root: 'empty-root-slot', image: 'empty-image-slot', description: 'empty-description-slot', footer: 'empty-footer-slot' }}><Button>Retry</Button></Empty>
        <Masonry columns={1} items={[{ key: 'item', data: 'Item', children: 'Masonry item' }]} classNames={{ root: 'masonry-root-slot', item: 'masonry-item-slot' }} />
        <QRCode value="semantic" status="expired" classNames={{ root: 'qrcode-root-slot', cover: 'qrcode-cover-slot' }} />
        <Result title="Done" subTitle="Complete" extra={<Button>Continue</Button>} classNames={{ root: 'result-root-slot', icon: 'result-icon-slot', title: 'result-title-slot', subTitle: 'result-subtitle-slot', extra: 'result-extra-slot', body: 'result-body-slot' }}>Details</Result>
        <Segmented options={[{ value: 'one', label: 'One', icon: <span>1</span> }]} classNames={{ root: 'segmented-root-slot', item: 'segmented-item-slot', icon: 'segmented-icon-slot', label: 'segmented-label-slot' }} />
      </>
    ));
    expect(container.querySelectorAll('.divider-rail-slot')).toHaveLength(2);
    expect(container.querySelector('.divider-root-slot')).toContainElement(container.querySelector('.divider-content-slot'));
    expect(container.querySelector('.empty-root-slot')).toContainElement(container.querySelector('.empty-footer-slot'));
    expect(container.querySelector('.empty-image-slot')).toBeInTheDocument();
    expect(container.querySelector('.masonry-root-slot')).toContainElement(container.querySelector('.masonry-item-slot'));
    expect(container.querySelector('.qrcode-root-slot')).toContainElement(container.querySelector('.qrcode-cover-slot'));
    expect(container.querySelector('.result-title-slot')).toHaveTextContent('Done');
    expect(container.querySelector('.result-root-slot')).toContainElement(container.querySelector('.result-body-slot'));
    expect(container.querySelector('.segmented-item-slot')).toContainElement(container.querySelector('.segmented-icon-slot'));
    expect(container.querySelector('.segmented-label-slot')).toHaveTextContent('One');
  });

  it('maps official semantic slots for navigation and data display components', () => {
    const { container } = render(() => (
      <>
        <Anchor affix={false} currentAnchor="#overview" items={[{ href: '#overview', title: 'Overview' }]} classNames={{ root: 'anchor-root-slot', item: 'anchor-item-slot', itemTitle: 'anchor-title-slot', indicator: 'anchor-indicator-slot' }} />
        <Breadcrumb items={[{ title: 'Home', href: '/' }, { title: 'Current' }]} classNames={{ root: 'breadcrumb-root-slot', item: 'breadcrumb-item-slot', separator: 'breadcrumb-separator-slot' }} />
        <Space separator="/" classNames={{ root: 'space-root-slot', item: 'space-item-slot', separator: 'space-separator-slot' }}><span>One</span><span>Two</span></Space>
        <Spin tip="Loading" classNames={{ root: 'spin-root-slot', section: 'spin-section-slot', indicator: 'spin-indicator-slot', description: 'spin-description-slot', container: 'spin-container-slot' }}><span>Content</span></Spin>
        <Statistic title="Revenue" value={1250} prefix="$" suffix="USD" classNames={{ root: 'statistic-root-slot', header: 'statistic-header-slot', title: 'statistic-title-slot', prefix: 'statistic-prefix-slot', content: 'statistic-content-slot', value: 'statistic-value-slot', suffix: 'statistic-suffix-slot' }} />
        <Layout><Layout.Sider classNames={{ root: 'sider-root-slot', body: 'sider-body-slot' }}>Navigation</Layout.Sider></Layout>
      </>
    ));
    expect(container.querySelector('.anchor-root-slot')).toContainElement(container.querySelector('.anchor-item-slot'));
    expect(container.querySelector('.anchor-title-slot')).toContainElement(container.querySelector('.anchor-indicator-slot'));
    expect(container.querySelectorAll('.breadcrumb-item-slot')).toHaveLength(2);
    expect(container.querySelector('.breadcrumb-root-slot')).toContainElement(container.querySelector('.breadcrumb-separator-slot'));
    expect(container.querySelectorAll('.space-item-slot')).toHaveLength(2);
    expect(container.querySelector('.space-root-slot')).toContainElement(container.querySelector('.space-separator-slot'));
    expect(container.querySelector('.spin-root-slot')).toContainElement(container.querySelector('.spin-section-slot'));
    expect(container.querySelector('.spin-section-slot')).toContainElement(container.querySelector('.spin-description-slot'));
    expect(container.querySelector('.spin-indicator-slot')).toBeInTheDocument();
    expect(container.querySelector('.spin-container-slot')).toHaveTextContent('Content');
    expect(container.querySelector('.statistic-header-slot')).toContainElement(container.querySelector('.statistic-title-slot'));
    expect(container.querySelector('.statistic-content-slot')).toContainElement(container.querySelector('.statistic-value-slot'));
    expect(container.querySelector('.statistic-prefix-slot')).toHaveTextContent('$');
    expect(container.querySelector('.statistic-suffix-slot')).toHaveTextContent('USD');
    expect(container.querySelector('.sider-root-slot')).toContainElement(container.querySelector('.sider-body-slot'));
  });

  it('supports the v6 Timeline model and maps every semantic slot', () => {
    const { container } = render(() => (
      <Timeline
        orientation="horizontal"
        mode="end"
        variant="filled"
        titleSpan={8}
        items={[{ title: 'Build', content: 'Compiled', icon: <span>B</span> }, { title: 'Test', content: 'Running', loading: true }]}
        classNames={{ root: 'timeline-root-slot', item: 'timeline-item-slot', itemWrapper: 'timeline-wrapper-slot', itemIcon: 'timeline-icon-slot', itemSection: 'timeline-section-slot', itemHeader: 'timeline-header-slot', itemTitle: 'timeline-title-slot', itemContent: 'timeline-content-slot', itemRail: 'timeline-rail-slot' }}
      />
    ));
    expect(container.querySelector('.timeline-root-slot')).toHaveClass('flex');
    expect(container.querySelectorAll('.timeline-item-slot')).toHaveLength(2);
    expect(container.querySelectorAll('.timeline-item-slot')[0]).toHaveAttribute('data-placement', 'end');
    expect(container.querySelectorAll('.timeline-wrapper-slot')).toHaveLength(2);
    expect(container.querySelectorAll('.timeline-icon-slot')).toHaveLength(2);
    expect(container.querySelectorAll('.timeline-section-slot')).toHaveLength(2);
    expect(container.querySelectorAll('.timeline-header-slot')).toHaveLength(2);
    expect(container.querySelectorAll('.timeline-title-slot')).toHaveLength(2);
    expect(container.querySelectorAll('.timeline-content-slot')).toHaveLength(2);
    expect(container.querySelectorAll('.timeline-rail-slot')).toHaveLength(1);
    expect(container.querySelector('.timeline-title-slot')).toHaveStyle({ width: '33.33333333333333%' });
    expect(container.querySelectorAll('.timeline-icon-slot')[1]).toHaveAttribute('aria-busy', 'true');
  });

  it('maps all common and directional Transfer semantic slots', () => {
    const { container } = render(() => (
      <Transfer
        dataSource={[{ key: 'source', title: 'Source item' }, { key: 'target', title: 'Target item' }]}
        defaultTargetKeys={['target']}
        footer={({ direction }) => `${direction} footer`}
        classNames={{
          root: 'transfer-root-slot', section: 'transfer-section-slot', header: 'transfer-header-slot', title: 'transfer-title-slot', body: 'transfer-body-slot', list: 'transfer-list-slot', item: 'transfer-item-slot', itemIcon: 'transfer-icon-slot', itemContent: 'transfer-content-slot', footer: 'transfer-footer-slot', actions: 'transfer-actions-slot',
          'source.section': 'source-section-slot', 'source.header': 'source-header-slot', 'source.title': 'source-title-slot', 'source.body': 'source-body-slot', 'source.list': 'source-list-slot', 'source.item': 'source-item-slot', 'source.itemIcon': 'source-icon-slot', 'source.itemContent': 'source-content-slot', 'source.footer': 'source-footer-slot',
          'target.section': 'target-section-slot', 'target.header': 'target-header-slot', 'target.title': 'target-title-slot', 'target.body': 'target-body-slot', 'target.list': 'target-list-slot', 'target.item': 'target-item-slot', 'target.itemIcon': 'target-icon-slot', 'target.itemContent': 'target-content-slot', 'target.footer': 'target-footer-slot',
        }}
      />
    ));
    expect(container.querySelector('.transfer-root-slot')).toContainElement(container.querySelector('.transfer-actions-slot'));
    for (const slot of ['section', 'header', 'title', 'body', 'list', 'item', 'icon', 'content', 'footer']) expect(container.querySelectorAll(`.transfer-${slot}-slot`)).toHaveLength(2);
    for (const side of ['source', 'target']) {
      const section = container.querySelector(`.${side}-section-slot`);
      expect(section).toContainElement(container.querySelector(`.${side}-header-slot`));
      expect(section).toContainElement(container.querySelector(`.${side}-title-slot`));
      expect(section).toContainElement(container.querySelector(`.${side}-body-slot`));
      expect(section).toContainElement(container.querySelector(`.${side}-list-slot`));
      expect(section).toContainElement(container.querySelector(`.${side}-item-slot`));
      expect(container.querySelector(`.${side}-item-slot`)).toContainElement(container.querySelector(`.${side}-icon-slot`));
      expect(container.querySelector(`.${side}-item-slot`)).toContainElement(container.querySelector(`.${side}-content-slot`));
      expect(section).toContainElement(container.querySelector(`.${side}-footer-slot`));
    }
  });

  it('maps every official Tour semantic slot', () => {
    render(() => (
      <Tour
        defaultOpen
        steps={[{ title: 'Welcome', description: 'First step', cover: <div>Cover</div> }, { title: 'Next' }]}
        classNames={{ root: 'tour-root-slot', mask: 'tour-mask-slot', section: 'tour-section-slot', cover: 'tour-cover-slot', close: 'tour-close-slot', header: 'tour-header-slot', title: 'tour-title-slot', description: 'tour-description-slot', footer: 'tour-footer-slot', actions: 'tour-actions-slot', indicators: 'tour-indicators-slot', indicator: 'tour-indicator-slot' }}
      />
    ));
    expect(document.querySelectorAll('.tour-mask-slot')).toHaveLength(4);
    expect(document.querySelector('.tour-root-slot')).toContainElement(document.querySelector('.tour-section-slot'));
    expect(document.querySelector('.tour-section-slot')).toContainElement(document.querySelector('.tour-cover-slot'));
    expect(document.querySelector('.tour-close-slot')).toBeInTheDocument();
    expect(document.querySelector('.tour-header-slot')).toContainElement(document.querySelector('.tour-title-slot'));
    expect(document.querySelector('.tour-description-slot')).toHaveTextContent('First step');
    expect(document.querySelector('.tour-footer-slot')).toContainElement(document.querySelector('.tour-actions-slot'));
    expect(document.querySelector('.tour-footer-slot')).toContainElement(document.querySelector('.tour-indicators-slot'));
    expect(document.querySelectorAll('.tour-indicator-slot')).toHaveLength(2);
  });

  it('maps FloatButton, Mentions, Splitter, and Image semantic slots', async () => {
    const { container } = render(() => (
      <>
        <FloatButton icon={<span>+</span>} description="Create" class="native-float-class" classNames={{ root: 'float-root-slot', trigger: 'float-trigger-slot', icon: 'float-icon-slot', content: 'float-content-slot' }} styles={{ trigger: { color: 'rgb(1, 2, 3)' } }} />
        <Mentions defaultValue="@" allowClear options={[{ value: 'solid', label: 'Solid' }]} classNames={{ root: 'mentions-root-slot', textarea: 'mentions-textarea-slot', suffix: 'mentions-suffix-slot', popup: 'mentions-popup-slot' }} />
        <Splitter classNames={{ root: 'splitter-root-slot', panel: 'splitter-panel-slot', dragger: 'splitter-dragger-slot' }}><Splitter.Panel>Left</Splitter.Panel><Splitter.Panel>Right</Splitter.Panel></Splitter>
        <Image src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="Preview source" preview={{ visible: true }} classNames={{ root: 'image-root-slot', image: 'image-image-slot', cover: 'image-cover-slot', 'popup.root': 'image-popup-root-slot', 'popup.mask': 'image-popup-mask-slot', 'popup.body': 'image-popup-body-slot', 'popup.footer': 'image-popup-footer-slot', 'popup.actions': 'image-popup-actions-slot', 'popup.close': 'image-popup-close-slot' }} />
      </>
    ));
    expect(container.querySelector('.float-root-slot')).toContainElement(container.querySelector('.float-trigger-slot'));
    expect(container.querySelector('.float-trigger-slot')).toContainElement(container.querySelector('.float-icon-slot'));
    expect(container.querySelector('.float-trigger-slot')).toHaveClass('native-float-class');
    expect(container.querySelector('.float-trigger-slot')).toHaveStyle({ color: 'rgb(1, 2, 3)' });
    expect(container.querySelector('.float-content-slot')).toHaveTextContent('Create');
    expect(container.querySelector('.mentions-root-slot')).toContainElement(container.querySelector('.mentions-textarea-slot'));
    expect(container.querySelector('.mentions-root-slot')).toContainElement(container.querySelector('.mentions-suffix-slot'));
    const mentions = container.querySelector('.mentions-textarea-slot') as HTMLTextAreaElement;
    mentions.setSelectionRange(1, 1);
    fireEvent.click(mentions);
    await waitFor(() => expect(document.querySelector('.mentions-popup-slot')).toBeInTheDocument());
    expect(container.querySelectorAll('.splitter-panel-slot')).toHaveLength(2);
    expect(container.querySelector('.splitter-root-slot')).toContainElement(container.querySelector('.splitter-dragger-slot'));
    expect(container.querySelector('.image-root-slot')).toContainElement(container.querySelector('.image-image-slot'));
    expect(container.querySelector('.image-root-slot')).toContainElement(container.querySelector('.image-cover-slot'));
    expect(document.querySelector('.image-popup-root-slot')).toContainElement(document.querySelector('.image-popup-mask-slot'));
    expect(document.querySelector('.image-popup-root-slot')).toContainElement(document.querySelector('.image-popup-body-slot'));
    expect(document.querySelector('.image-popup-footer-slot')).toContainElement(document.querySelector('.image-popup-actions-slot'));
    expect(document.querySelector('.image-popup-close-slot')).toBeInTheDocument();
  });

  it('maps Skeleton, List.Item, and Typography semantic slots', async () => {
    const { container } = render(() => (
      <>
        <Skeleton avatar paragraph={{ rows: 2 }} classNames={{ root: 'skeleton-root-slot', header: 'skeleton-header-slot', section: 'skeleton-section-slot', avatar: 'skeleton-avatar-slot', title: 'skeleton-title-slot', paragraph: 'skeleton-paragraph-slot' }} />
        <List.Item actions={[<Button>Edit</Button>]} extra="Extra" classNames={{ actions: 'list-actions-slot', extra: 'list-extra-slot' }}>Item</List.Item>
        <Typography.Text copyable ellipsis={{ expandable: true }} classNames={{ root: 'typography-root-slot', actions: 'typography-actions-slot', action: 'typography-action-slot' }}>Long text</Typography.Text>
        <Typography.Paragraph editable classNames={{ textarea: 'typography-textarea-slot' }}>Editable paragraph</Typography.Paragraph>
      </>
    ));
    expect(container.querySelector('.skeleton-root-slot')).toContainElement(container.querySelector('.skeleton-header-slot'));
    expect(container.querySelector('.skeleton-header-slot')).toContainElement(container.querySelector('.skeleton-avatar-slot'));
    expect(container.querySelector('.skeleton-section-slot')).toContainElement(container.querySelector('.skeleton-title-slot'));
    expect(container.querySelector('.skeleton-section-slot')).toContainElement(container.querySelector('.skeleton-paragraph-slot'));
    expect(container.querySelector('.list-actions-slot')).toHaveTextContent('Edit');
    expect(container.querySelector('.list-extra-slot')).toHaveTextContent('Extra');
    expect(container.querySelector('.typography-root-slot')).toHaveTextContent('Long text');
    expect(container.querySelectorAll('.typography-action-slot')).toHaveLength(2);
    expect(container.querySelector('.typography-actions-slot')).toContainElement(container.querySelector('.typography-action-slot'));
    fireEvent.click(screen.getByRole('button', { name: 'Edit text' }));
    await waitFor(() => expect(container.querySelector('.typography-textarea-slot')).toBeInstanceOf(HTMLTextAreaElement));
  });

  it('maps official semantic slots through portal overlays', () => {
    render(() => (
      <>
        <Popover defaultOpen title="Title" content="Content" classNames={{ root: 'popover-root-slot', container: 'popover-container-slot', title: 'popover-title-slot', content: 'popover-content-slot', arrow: 'popover-arrow-slot' }}><Button>Popover</Button></Popover>
        <Popconfirm defaultOpen title="Delete?" description="This cannot be undone" classNames={{ root: 'popconfirm-root-slot', container: 'popconfirm-container-slot', icon: 'popconfirm-icon-slot', title: 'popconfirm-title-slot', content: 'popconfirm-content-slot', arrow: 'popconfirm-arrow-slot' }}><Button>Delete</Button></Popconfirm>
        <ColorPicker defaultOpen showText classNames={{ root: 'color-root-slot', body: 'color-body-slot', content: 'color-content-slot', description: 'color-description-slot', 'popup.root': 'color-popup-root-slot' }} />
        <Dropdown defaultOpen menu={{ items: [{ key: 'edit', label: 'Edit', icon: <span>E</span> }] }} classNames={{ root: 'dropdown-root-slot', item: 'dropdown-item-slot', itemTitle: 'dropdown-title-slot', itemContent: 'dropdown-content-slot', itemIcon: 'dropdown-icon-slot' }}><Button>Actions</Button></Dropdown>
      </>
    ));
    expect(document.querySelector('.popover-root-slot')).toContainElement(document.querySelector('.popover-container-slot'));
    expect(document.querySelector('.popover-container-slot')).toContainElement(document.querySelector('.popover-title-slot'));
    expect(document.querySelector('.popover-content-slot')).toHaveTextContent('Content');
    expect(document.querySelector('.popover-arrow-slot')).toBeInTheDocument();
    expect(document.querySelector('.popconfirm-root-slot')).toContainElement(document.querySelector('.popconfirm-container-slot'));
    expect(document.querySelector('.popconfirm-icon-slot')).toBeInTheDocument();
    expect(document.querySelector('.popconfirm-title-slot')).toHaveTextContent('Delete?');
    expect(document.querySelector('.popconfirm-content-slot')).toHaveTextContent('This cannot be undone');
    expect(document.querySelector('.popconfirm-arrow-slot')).toBeInTheDocument();
    expect(document.querySelector('.color-root-slot')).toContainElement(document.querySelector('.color-body-slot'));
    expect(document.querySelector('.color-body-slot')).toContainElement(document.querySelector('.color-content-slot'));
    expect(document.querySelector('.color-description-slot')).toHaveTextContent('#1677FF');
    expect(document.querySelector('.color-popup-root-slot')).toBeInTheDocument();
    expect(document.querySelector('.dropdown-root-slot')).toContainElement(document.querySelector('.dropdown-item-slot'));
    expect(document.querySelector('.dropdown-item-slot')).toHaveClass('dropdown-title-slot');
    expect(document.querySelector('.dropdown-item-slot')).toContainElement(document.querySelector('.dropdown-content-slot'));
    expect(document.querySelector('.dropdown-icon-slot')).toHaveTextContent('E');
  });

  it('maps every official Calendar semantic slot', () => {
    const { container } = render(() => (
      <Calendar
        fullscreen={false}
        value={dayjs('2026-03-15')}
        classNames={{ root: 'calendar-root-slot', header: 'calendar-header-slot', body: 'calendar-body-slot', content: 'calendar-content-slot', item: 'calendar-item-slot', itemContent: 'calendar-item-content-slot' }}
      />
    ));
    expect(container.querySelector('.calendar-root-slot')).toContainElement(container.querySelector('.calendar-header-slot'));
    expect(container.querySelector('.calendar-body-slot')).toContainElement(container.querySelector('.calendar-content-slot'));
    expect(container.querySelectorAll('.calendar-item-slot')).toHaveLength(42);
    expect(container.querySelector('.calendar-item-slot')).toContainElement(container.querySelector('.calendar-item-content-slot'));
  });

  it('applies semantic component defaults with local precedence', () => {
    const { container } = render(() => (
      <ConfigProvider
        breadcrumb={{ classNames: { root: 'default-breadcrumb-root' } }}
        space={{ size: 24, classNames: { root: 'default-space-root' } }}
        statistic={{ classNames: { root: 'default-statistic-root' } }}
        calendar={{ fullscreen: false, classNames: { root: 'default-calendar-root' } }}
      >
        <Breadcrumb items={[{ title: 'Current' }]} />
        <Space classNames={{ root: 'local-space-root' }}><span>One</span><span>Two</span></Space>
        <Statistic value={1} />
        <Calendar />
      </ConfigProvider>
    ));
    expect(container.querySelector('.default-breadcrumb-root')).toBeInTheDocument();
    expect(container.querySelector('.local-space-root')).toHaveStyle({ gap: '24px' });
    expect(container.querySelector('.default-space-root')).not.toBeInTheDocument();
    expect(container.querySelector('.default-statistic-root')).toBeInTheDocument();
    expect(container.querySelector('.default-calendar-root')).toHaveClass('w-80');
  });

  it('derives and reads public theme tokens and version', () => {
    const token = theme.getDesignToken({ token: { colorPrimary: '#123456' }, algorithm: [theme.darkAlgorithm, theme.compactAlgorithm] });
    expect(token.colorPrimary).toBe('#123456');
    expect(token.colorBgContainer).toBe('#141414');
    expect(token.borderRadius).toBe('4px');
    function TokenReader() { const result = theme.useToken(); return <span>{result.token.colorPrimary}</span>; }
    render(() => <ConfigProvider theme={{ colorPrimary: '#abcdef' }}><TokenReader /></ConfigProvider>);
    expect(screen.getByText('#abcdef')).toBeInTheDocument();
    expect(version).toBe('0.2.4');
  });

  it('switches tabs with click and keyboard while skipping disabled items', async () => {
    const onChange = vi.fn();
    render(() => (
      <Tabs
        defaultActiveKey="overview"
        onChange={onChange}
        items={[
          { key: 'overview', label: 'Overview', children: 'Overview panel' },
          { key: 'locked', label: 'Locked', children: 'Locked panel', disabled: true },
          { key: 'activity', label: 'Activity', children: 'Activity panel' },
        ]}
      />
    ));

    const overview = screen.getByRole('tab', { name: 'Overview' });
    fireEvent.keyDown(overview, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith('activity');
    await waitFor(() => expect(screen.getByRole('tab', { name: 'Activity' })).toHaveAttribute('aria-selected', 'true'));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity panel');
  });

  it('supports editable, placed, forced, and scrollable Tabs workflows', async () => {
    const onEdit = vi.fn();
    const onTabClick = vi.fn();
    const onTabScroll = vi.fn();
    render(() => <div>
      <div data-testid="editable-tabs"><Tabs
        type="editable-card"
        defaultActiveKey="overview"
        tabBarGutter={11}
        tabBarExtraContent={{ left: <span>Before tabs</span>, right: <span>After tabs</span> }}
        addIcon="Add"
        removeIcon="Remove"
        onEdit={onEdit}
        onTabClick={onTabClick}
        items={[{ key: 'overview', label: 'Overview', children: 'Overview card' }, { key: 'locked', label: 'Locked', children: 'Locked card', closable: false }, { key: 'activity', label: 'Activity', children: 'Activity card' }]}
      /></div>
      <div data-testid="placed-tabs"><Tabs
        tabPlacement="start"
        indicator={{ size: 18, align: 'end' }}
        destroyInactiveTabPane
        defaultActiveKey="first"
        onTabScroll={onTabScroll}
        items={[{ key: 'first', label: 'First', children: 'Forced first', forceRender: true }, { key: 'second', label: 'Second', children: 'Second panel' }]}
      /></div>
    </div>);

    const editable = within(screen.getByTestId('editable-tabs'));
    expect(editable.getByText('Before tabs')).toBeInTheDocument();
    expect(editable.getByText('After tabs')).toBeInTheDocument();
    expect(editable.getByRole('tablist')).toHaveStyle({ gap: '11px' });
    expect(editable.getByRole('tab', { name: 'Overview' }).parentElement).toHaveClass('ads-tabs-card-tab');
    expect(editable.getByRole('tab', { name: 'Overview' }).querySelector('.ads-tabs-indicator')).not.toBeInTheDocument();
    expect(editable.queryByRole('button', { name: 'Remove Locked' })).not.toBeInTheDocument();
    fireEvent.click(editable.getByRole('button', { name: 'Remove Overview' }));
    expect(onEdit).toHaveBeenCalledWith('overview', 'remove');
    expect(onTabClick).not.toHaveBeenCalled();
    fireEvent.click(editable.getByRole('button', { name: 'Add tab' }));
    expect(onEdit).toHaveBeenCalledWith(expect.any(MouseEvent), 'add');
    fireEvent.click(editable.getByRole('tab', { name: 'Activity' }));
    expect(onTabClick).toHaveBeenCalledWith('activity', expect.any(MouseEvent));

    const placed = within(screen.getByTestId('placed-tabs'));
    const placedList = placed.getByRole('tablist');
    expect(placedList).toHaveAttribute('aria-orientation', 'vertical');
    expect(placed.getByRole('tab', { name: 'First' }).querySelector('.ads-tabs-indicator')).toHaveStyle({ height: '18px', bottom: '0px' });
    expect(placed.getByText('Forced first')).toBeInTheDocument();
    expect(placed.queryByText('Second panel')).not.toBeInTheDocument();
    fireEvent.keyDown(placed.getByRole('tab', { name: 'First' }), { key: 'ArrowDown' });
    await waitFor(() => expect(placed.getByRole('tab', { name: 'Second' })).toHaveAttribute('aria-selected', 'true'));
    expect(placed.getByText('Forced first')).not.toBeVisible();
    expect(placed.getByText('Second panel')).toBeVisible();
    Object.defineProperty(placedList, 'scrollTop', { value: 20, configurable: true });
    fireEvent.scroll(placedList);
    expect(onTabScroll).toHaveBeenCalledWith({ direction: 'bottom' });
  });

  it('registers declarative Tabs.TabPane children', async () => {
    render(() => <Tabs defaultActiveKey="overview"><Tabs.TabPane tab="Overview" tabKey="overview">Overview pane</Tabs.TabPane><Tabs.TabPane tab="Activity" tabKey="activity">Activity pane</Tabs.TabPane></Tabs>);
    expect(await screen.findByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('tab', { name: 'Activity' }));
    await waitFor(() => expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity pane'));
  });

  it('connects form initial values, input changes, and successful submission', async () => {
    const onFinish = vi.fn();
    render(() => (
      <Form layout="vertical" initialValues={{ email: 'before@example.com' }} onFinish={onFinish}>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input aria-label="Email address" />
        </Form.Item>
        <Button htmlType="submit">Save profile</Button>
      </Form>
    ));

    const input = screen.getByRole('textbox', { name: 'Email address' });
    expect(input).toHaveValue('before@example.com');
    fireEvent.input(input, { target: { value: 'after@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save profile' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ email: 'after@example.com' }));
  });

  it('manages nested arrays with Form.List operations', async () => {
    const onFinish = vi.fn();
    render(() => <Form initialValues={{ users: [{ name: 'Ada' }] }} onFinish={onFinish}>
      <Form.List name="users">{(fields, operations) => <div>
        {fields.map((field) => <Form.Item name={[field.name, 'name']}><Input aria-label={`User ${field.key}`} /></Form.Item>)}
        <Button onClick={() => operations.add({ name: '' })}>Add user</Button>
        <Button onClick={() => operations.move(1, 0)}>Move user</Button>
      </div>}</Form.List>
      <Button htmlType="submit">Save users</Button>
    </Form>);
    expect(screen.getByRole('textbox')).toHaveValue('Ada');
    fireEvent.click(screen.getByRole('button', { name: 'Add user' }));
    await waitFor(() => expect(screen.getAllByRole('textbox')).toHaveLength(2));
    fireEvent.input(screen.getAllByRole('textbox')[1], { target: { value: 'Grace' } });
    fireEvent.click(screen.getByRole('button', { name: 'Move user' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save users' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ users: [{ name: 'Grace' }, { name: 'Ada' }] }));
  });

  it('maintains nested Form.List paths after inner removals', async () => {
    const onFinish = vi.fn();
    render(() => (
      <Form initialValues={{ users: [{ name: 'Ada', contacts: [{ value: 'first' }, { value: 'second' }] }] }} onFinish={onFinish}>
        <Form.List name="users">{(users) => <>{users.map((user) => <div>
          <Form.Item name={[user.name, 'name']}><Input aria-label="Nested user name" /></Form.Item>
          <Form.List name={[user.name, 'contacts']}>{(contacts, operations) => <div>
            {contacts.map((contact, index) => <Form.Item name={[contact.name, 'value']}><Input aria-label={`Contact ${index + 1}`} /></Form.Item>) }
            <Button onClick={() => operations.remove(0)}>Remove first contact</Button>
            <Button onClick={() => operations.add({ value: '' })}>Add contact</Button>
          </div>}</Form.List>
        </div>)}</>}</Form.List>
        <Button htmlType="submit">Save nested lists</Button>
      </Form>
    ));
    expect(screen.getByRole('textbox', { name: 'Contact 1' })).toHaveValue('first');
    expect(screen.getByRole('textbox', { name: 'Contact 2' })).toHaveValue('second');
    fireEvent.click(screen.getByRole('button', { name: 'Remove first contact' }));
    await waitFor(() => expect(screen.getAllByRole('textbox', { name: /Contact/ })).toHaveLength(1));
    expect(screen.getByRole('textbox', { name: 'Contact 1' })).toHaveValue('second');
    fireEvent.click(screen.getByRole('button', { name: 'Add contact' }));
    await waitFor(() => expect(screen.getAllByRole('textbox', { name: /Contact/ })).toHaveLength(2));
    fireEvent.input(screen.getByRole('textbox', { name: 'Contact 2' }), { target: { value: 'third' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save nested lists' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ users: [{ name: 'Ada', contacts: [{ value: 'second' }, { value: 'third' }] }] }));
  });

  it('reports named forms through Form.Provider and updates useWatch', async () => {
    const onFormChange = vi.fn();
    const onFormFinish = vi.fn();
    function WatchedValue() { const value = Form.useWatch('name'); return <output>{String(value() ?? '')}</output>; }
    render(() => <Form.Provider onFormChange={onFormChange} onFormFinish={onFormFinish}>
      <Form name="profile" onFinish={() => undefined}><Form.Item name="name"><Input aria-label="Provider name" /></Form.Item><WatchedValue /><Button htmlType="submit">Submit provider</Button></Form>
    </Form.Provider>);
    fireEvent.input(screen.getByRole('textbox', { name: 'Provider name' }), { target: { value: 'Ada' } });
    await waitFor(() => expect(screen.getByText('Ada')).toBeInTheDocument());
    expect(onFormChange).toHaveBeenCalledWith('profile', expect.objectContaining({ forms: expect.objectContaining({ profile: expect.anything() }) }));
    fireEvent.click(screen.getByRole('button', { name: 'Submit provider' }));
    await waitFor(() => expect(onFormFinish).toHaveBeenCalledWith('profile', expect.objectContaining({ values: { name: 'Ada' } })));
  });

  it('supports validateOnly and recursive Form validation configs', async () => {
    let form!: ReturnType<typeof Form.useForm>[0];
    render(() => { [form] = Form.useForm(); return <Form form={form} initialValues={{ user: { name: '', role: '' } }}>
      <Form.Item name={['user', 'name']} label="Nested name" rules={[{ required: true }]}><Input aria-label="Recursive name" /></Form.Item>
      <Form.Item name={['user', 'role']} label="Nested role" rules={[{ required: true }]}><Input aria-label="Recursive role" /></Form.Item>
    </Form>; });
    await expect(form.validateFields([['user', 'name']], { validateOnly: true })).rejects.toMatchObject({ errorFields: [{ name: 'user.name' }] });
    expect(form.getFieldError(['user', 'name'])).toEqual([]);
    expect(screen.queryByText('Please enter Nested name')).not.toBeInTheDocument();
    await expect(form.validateFields([['user']], { recursive: true })).rejects.toMatchObject({ errorFields: [{ name: 'user.name' }, { name: 'user.role' }] });
    expect(form.getFieldError(['user', 'name'])).toEqual(['Please enter Nested name']);
    expect(form.getFieldError(['user', 'role'])).toEqual(['Please enter Nested role']);
  });

  it('limits dirty Form validation to touched or previously validated fields', async () => {
    let form!: ReturnType<typeof Form.useForm>[0];
    render(() => { [form] = Form.useForm(); return <Form form={form}><Form.Item name="first" rules={[{ required: true }]}><Input aria-label="Dirty first" /></Form.Item><Form.Item name="second" rules={[{ required: true }]}><Input aria-label="Dirty second" /></Form.Item></Form>; });
    await expect(form.validateFields(undefined, { dirty: true })).resolves.toEqual({});
    fireEvent.input(screen.getByRole('textbox', { name: 'Dirty first' }), { target: { value: 'x' } });
    fireEvent.input(screen.getByRole('textbox', { name: 'Dirty first' }), { target: { value: '' } });
    await expect(form.validateFields(undefined, { dirty: true })).rejects.toMatchObject({ errorFields: [{ name: 'first' }] });
    expect(form.getFieldError('second')).toEqual([]);
  });

  it('keeps Form.Provider sibling registries current across unmounts', async () => {
    const [showSettings, setShowSettings] = createSignal(true);
    const onFormChange = vi.fn();
    render(() => <Form.Provider onFormChange={onFormChange}>
      <Form name="profile"><Form.Item name="name"><Input aria-label="Cross profile" /></Form.Item></Form>
      <>{showSettings() && <Form name="settings" initialValues={{ theme: 'dark' }}><Form.Item name="theme"><Input aria-label="Cross settings" /></Form.Item></Form>}</>
      <Button onClick={() => setShowSettings(false)}>Unmount settings</Button>
    </Form.Provider>);
    fireEvent.input(screen.getByRole('textbox', { name: 'Cross profile' }), { target: { value: 'Ada' } });
    expect(onFormChange.mock.calls.at(-1)?.[1].forms.settings.getFieldValue('theme')).toBe('dark');
    fireEvent.click(screen.getByRole('button', { name: 'Unmount settings' }));
    await waitFor(() => expect(screen.queryByRole('textbox', { name: 'Cross settings' })).not.toBeInTheDocument());
    fireEvent.input(screen.getByRole('textbox', { name: 'Cross profile' }), { target: { value: 'Grace' } });
    expect(onFormChange.mock.calls.at(-1)?.[1].forms).not.toHaveProperty('settings');
    expect(onFormChange.mock.calls.at(-1)?.[1].forms).toHaveProperty('profile');
  });

  it('overrides localized Form validation templates', async () => {
    render(() => <Form validateTrigger="onBlur" validateMessages={{ required: 'Fill ${label}!' }}> <Form.Item name="email" label="Email" rules={[{ required: true }]}><Input aria-label="Template email" /></Form.Item></Form>);
    fireEvent.blur(screen.getByRole('textbox', { name: 'Template email' }));
    await waitFor(() => expect(screen.getByText('Fill Email!')).toBeInTheDocument());
  });

  it('reads validation state with Form.Item.useStatus', async () => {
    function StatusReader() { const state = Form.Item.useStatus(); return <output aria-label="Field status">{state.status ?? 'none'}:{state.errors.join(',')}</output>; }
    render(() => <Form><Form.Item name="account" validateTrigger="onBlur" rules={[{ required: true, message: 'Account required' }]}><Input aria-label="Status account" /><StatusReader /></Form.Item></Form>);
    expect(screen.getByLabelText('Field status')).toHaveTextContent('none');
    fireEvent.blur(screen.getByRole('textbox', { name: 'Status account' }));
    await waitFor(() => expect(screen.getByLabelText('Field status')).toHaveTextContent('error:Account required'));
  });

  it('controls Form fields and reports field changes', async () => {
    const onFieldsChange = vi.fn();
    render(() => <Form fields={[{ name: 'account', value: 'Ada', errors: ['External error'] }]} onFieldsChange={onFieldsChange}><Form.Item name="account"><Input aria-label="Controlled account" /></Form.Item></Form>);
    const input = screen.getByRole('textbox', { name: 'Controlled account' });
    await waitFor(() => expect(input).toHaveValue('Ada'));
    expect(screen.getByRole('alert')).toHaveTextContent('External error');
    fireEvent.input(input, { target: { value: 'Grace' } });
    expect(onFieldsChange).toHaveBeenCalledWith([expect.objectContaining({ name: 'account', value: 'Grace' })], expect.arrayContaining([expect.objectContaining({ name: 'account', value: 'Grace' })]));
  });

  it('reports Form field validating lifecycle through onFieldsChange', async () => {
    const onFieldsChange = vi.fn();
    let finishValidation: (() => void) | undefined;
    render(() => <Form onFieldsChange={onFieldsChange}><Form.Item name="account" rules={[{ validator: () => new Promise<void>((resolve) => { finishValidation = resolve; }) }]}><Input aria-label="Lifecycle account" /></Form.Item></Form>);

    fireEvent.input(screen.getByRole('textbox', { name: 'Lifecycle account' }), { target: { value: 'Ada' } });
    await waitFor(() => expect(onFieldsChange.mock.calls.some((call) => call[0][0].validating === true)).toBe(true));
    finishValidation?.();
    await waitFor(() => expect(onFieldsChange.mock.calls.map((call) => call[0][0].validating)).toEqual([false, true, false]));
    expect(onFieldsChange.mock.calls.map((call) => call[1].find((field: { name: string }) => field.name === 'account')?.validating)).toEqual([false, true, false]);
  });

  it('deep-merges Form.setFieldsValue and invalidates nested field metadata', () => {
    const [form] = Form.useForm({ profile: { name: 'Ada', role: 'Owner', settings: { locale: 'en', compact: false } }, tags: ['one', 'two'] });
    render(() => <Form form={form}><Form.Item name={['profile', 'name']}><Input /></Form.Item><Form.Item name={['profile', 'role']}><Input /></Form.Item></Form>);
    form.setFields([{ name: ['profile', 'name'], errors: ['Stale error'] }]);
    form.setFieldsValue({ profile: { name: 'Grace', settings: { compact: true } }, tags: ['three'] });
    expect(form.getFieldsValue()).toEqual({ profile: { name: 'Grace', role: 'Owner' } });
    expect(form.getFieldsValue(true)).toEqual({ profile: { name: 'Grace', role: 'Owner', settings: { locale: 'en', compact: true } }, tags: ['three'] });
    expect(form.getFieldsValue([['profile', 'name']])).toEqual({ profile: { name: 'Grace' } });
    expect(form.getFieldsValue({ filter: ({ touched }) => touched })).toEqual({ profile: { name: 'Grace' } });
    expect(form.getFieldError(['profile', 'name'])).toEqual([]);
    expect(form.isFieldTouched(['profile', 'name'])).toBe(true);
    expect(form.isFieldTouched(['profile', 'settings', 'compact'])).toBe(true);
    expect(form.isFieldTouched(['profile', 'role'])).toBe(false);
  });

  it('drops unmounted fields when preserve is false and clears destroyed forms', async () => {
    const [form] = Form.useForm<{ temporary?: string }>();
    const [visible, setVisible] = createSignal(true);
    const view = render(() => <Form form={form} clearOnDestroy><>{visible() && <Form.Item name="temporary" preserve={false}><Input aria-label="Temporary field" /></Form.Item>}</><Button onClick={() => setVisible(false)}>Hide field</Button></Form>);
    fireEvent.input(screen.getByRole('textbox', { name: 'Temporary field' }), { target: { value: 'discard me' } });
    expect(form.getFieldValue('temporary')).toBe('discard me');
    fireEvent.click(screen.getByRole('button', { name: 'Hide field' }));
    await waitFor(() => expect(form.getFieldValue('temporary')).toBeUndefined());
    form.setFieldValue('temporary', 'destroy me');
    view.unmount();
    expect(form.getFieldsValue()).toEqual({});
  });

  it('honors Form validateTrigger and scrolls to the first submit error', async () => {
    const scrollIntoView = vi.fn();
    const original = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = scrollIntoView;
    render(() => <Form validateTrigger="onBlur" scrollToFirstError><Form.Item name="account" rules={[{ required: true, message: 'Account missing' }]}><Input aria-label="Triggered account" /></Form.Item><Button htmlType="submit">Validate account</Button></Form>);
    const input = screen.getByRole('textbox', { name: 'Triggered account' });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    fireEvent.blur(input);
    expect(await screen.findByRole('alert')).toHaveTextContent('Account missing');
    fireEvent.click(screen.getByRole('button', { name: 'Validate account' }));
    await waitFor(() => expect(scrollIntoView).toHaveBeenCalled());
    expect(input).toHaveFocus();
    HTMLElement.prototype.scrollIntoView = original;
  });

  it('exposes Form field instance, touch, validation, focus, and scroll APIs', async () => {
    const [form] = Form.useForm();
    const scrollIntoView = vi.fn();
    const original = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = scrollIntoView;
    render(() => <Form form={form}><Form.Item name="account" rules={[{ validator: async () => { await new Promise((resolve) => setTimeout(resolve, 20)); } }]}><Input aria-label="Imperative account" /></Form.Item></Form>);
    const input = screen.getByRole('textbox', { name: 'Imperative account' }) as HTMLInputElement;
    expect(form.getFieldInstance('account')).toBe(input.closest('[data-form-field]'));
    expect(form.isFieldTouched('account')).toBe(false);
    fireEvent.input(input, { target: { value: 'abcdef' } });
    expect(form.isFieldTouched('account')).toBe(true);
    expect(form.isFieldsTouched(['account'], true)).toBe(true);
    await waitFor(() => expect(form.isFieldValidating('account')).toBe(true));
    await waitFor(() => expect(form.isFieldValidating('account')).toBe(false));
    form.focusField('account', { cursor: 'all' });
    expect(input).toHaveFocus();
    expect([input.selectionStart, input.selectionEnd]).toEqual([0, 6]);
    form.scrollToField('account', { block: 'center', focus: true });
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'center' });
    expect(() => form.scrollToField('unmounted', { focus: true })).not.toThrow();
    expect(() => form.focusField('unmounted')).not.toThrow();
    form.resetFields();
    expect(form.isFieldTouched('account')).toBe(false);
    HTMLElement.prototype.scrollIntoView = original;
  });

  it('marks a submit validation as out of date when its value changes', async () => {
    const [form] = Form.useForm();
    const onFinish = vi.fn();
    const onFinishFailed = vi.fn();
    render(() => <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}><Form.Item name="account" rules={[{ validator: async (_, value) => { await new Promise((resolve) => setTimeout(resolve, value === 'bad' ? 40 : 1)); if (value === 'bad') throw new Error('Unavailable'); } }]}><Input aria-label="Racing submit" /></Form.Item><Button htmlType="submit">Submit racing form</Button></Form>);
    const input = screen.getByRole('textbox', { name: 'Racing submit' });
    fireEvent.input(input, { target: { value: 'bad' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit racing form' }));
    await new Promise((resolve) => setTimeout(resolve, 5));
    fireEvent.input(input, { target: { value: 'good' } });
    await waitFor(() => expect(onFinishFailed).toHaveBeenCalledWith(expect.objectContaining({ outOfDate: true, errorFields: [] })));
    expect(onFinish).not.toHaveBeenCalled();
    expect(form.getFieldError('account')).toEqual([]);
  });

  it('applies Form semantic slots, label options, tooltip, and feedback icons', async () => {
    render(() => <Form layout="vertical" variant="filled" colon={false} labelAlign="left" labelWrap classNames={{ root: 'semantic-form', label: 'semantic-label', content: 'semantic-content', help: 'semantic-help' }} styles={{ root: { color: 'rgb(1, 2, 3)' } }} tooltip="Form help" feedbackIcons={() => ({ error: '!' })}><Form.Item name="semantic" label="Semantic" hasFeedback rules={[{ required: true }]}><Input aria-label="Semantic field" /></Form.Item></Form>);
    expect(document.querySelector('.semantic-form')).toHaveStyle({ color: 'rgb(1, 2, 3)' });
    expect(screen.getByText('Semantic')).toHaveClass('semantic-label', 'text-left', 'whitespace-normal');
    expect(document.querySelector('.semantic-content')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Semantic field' }).parentElement).toHaveClass('bg-surface-container');
    fireEvent.input(screen.getByRole('textbox', { name: 'Semantic field' }), { target: { value: '' } });
    expect(await screen.findByRole('alert')).toHaveClass('semantic-help');
    expect(screen.getByText('!')).toBeInTheDocument();
    expect(screen.getByTitle('Form help')).toBeInTheDocument();
  });

  it('renders Form.ErrorList errors and warnings', () => {
    render(() => <Form.ErrorList errors={['Invalid account']} warnings={['Check spelling']} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid account');
    expect(screen.getByText('Check spelling')).toHaveClass('text-warning');
  });

  it('revalidates Form.Item dependencies and updates render props', async () => {
    render(() => (
      <Form layout="vertical">
        <Form.Item name="password" label="Password"><Input aria-label="Password dependency" /></Form.Item>
        <Form.Item
          name="confirm"
          label="Confirm"
          dependencies={['password']}
          rules={[(form) => ({ validator: async (_, value) => { if (value && value !== form.getFieldValue('password')) throw new Error('Passwords do not match'); } })]}
        >
          <Input aria-label="Confirm dependency" />
        </Form.Item>
        <Form.Item noStyle dependencies={['password']}>
          {(form: any) => <span data-testid="password-preview">{String(form.getFieldValue('password') ?? '')}</span>}
        </Form.Item>
      </Form>
    ));
    fireEvent.input(screen.getByLabelText('Password dependency'), { target: { value: 'alpha' } });
    fireEvent.input(screen.getByLabelText('Confirm dependency'), { target: { value: 'alpha' } });
    await waitFor(() => expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument());
    expect(screen.getByTestId('password-preview')).toHaveTextContent('alpha');

    fireEvent.input(screen.getByLabelText('Password dependency'), { target: { value: 'beta' } });
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Passwords do not match'));
    expect(screen.getByTestId('password-preview')).toHaveTextContent('beta');
  });

  it('supports rule-level triggers, callback validators, hex/tel types, and parallel first failure', async () => {
    const callbackValidator = vi.fn((_rule, value, callback: (error?: string) => void) => { setTimeout(() => callback(value === 'approved' ? undefined : 'Approval callback failed'), 5); });
    render(() => <Form validateTrigger={['onChange', 'onBlur']}>
      <Form.Item name="hex" rules={[{ type: 'hex', validateTrigger: 'onBlur', message: 'Invalid hex value' }]}><Input aria-label="Hex rule" /></Form.Item>
      <Form.Item name="phone" rules={[{ type: 'tel', message: 'Invalid telephone' }]}><Input aria-label="Telephone rule" /></Form.Item>
      <Form.Item name="approval" validateTrigger="onBlur" rules={[{ validator: callbackValidator }]}><Input aria-label="Callback rule" /></Form.Item>
      <Form.Item name="parallel" validateFirst="parallel" rules={[
        { validator: async () => { await new Promise((resolve) => setTimeout(resolve, 20)); throw new Error('First parallel failure'); } },
        { validator: async () => { await new Promise((resolve) => setTimeout(resolve, 1)); throw new Error('Second parallel failure'); } },
      ]}><Input aria-label="Parallel rule" /></Form.Item>
    </Form>);

    const hex = screen.getByRole('textbox', { name: 'Hex rule' });
    fireEvent.input(hex, { target: { value: 'not-hex' } });
    expect(screen.queryByText('Invalid hex value')).not.toBeInTheDocument();
    fireEvent.blur(hex);
    expect(await screen.findByText('Invalid hex value')).toBeInTheDocument();
    fireEvent.input(hex, { target: { value: '#a1B2c3' } });
    fireEvent.blur(hex);
    await waitFor(() => expect(screen.queryByText('Invalid hex value')).not.toBeInTheDocument());

    fireEvent.input(screen.getByRole('textbox', { name: 'Telephone rule' }), { target: { value: '+1 (415) 555-0123' } });
    await waitFor(() => expect(screen.queryByText('Invalid telephone')).not.toBeInTheDocument());
    const approval = screen.getByRole('textbox', { name: 'Callback rule' });
    fireEvent.input(approval, { target: { value: 'pending' } });
    fireEvent.blur(approval);
    expect(await screen.findByText('Approval callback failed')).toBeInTheDocument();
    expect(callbackValidator).toHaveBeenCalledWith(expect.any(Object), 'pending', expect.any(Function), expect.any(Object));

    fireEvent.input(screen.getByRole('textbox', { name: 'Parallel rule' }), { target: { value: 'x' } });
    await waitFor(() => expect(screen.getByText('First parallel failure')).toBeInTheDocument());
    expect(screen.queryByText('Second parallel failure')).not.toBeInTheDocument();
  });

  it('supports Form normalize, transformed enum rules, warning-only submit, and validateFirst', async () => {
    const onFinish = vi.fn();
    function WarningReader() { const state = Form.Item.useStatus(); return <output aria-label="Rule state">{state.status ?? 'none'}:{state.errors.join('|')}:{state.warnings.join('|')}</output>; }
    render(() => <Form layout="vertical" onFinish={onFinish}>
      <Form.Item name="code" label="Code" normalize={(value) => String(value).trim().toUpperCase()} rules={[{ transform: (value) => String(value).toLowerCase(), type: 'enum', enum: ['allowed'], message: 'Code is not allowed' }]}><Input aria-label="Normalized code" /></Form.Item>
      <Form.Item name="channel" label="Channel" validateFirst rules={[{ min: 5, message: 'Channel too short' }, { pattern: /^modern$/, message: 'Channel format invalid' }, { pattern: /^modern$/, message: 'Legacy channel warning', warningOnly: true }]}><Input aria-label="Warning channel" /><WarningReader /></Form.Item>
      <Button htmlType="submit">Submit warning form</Button>
    </Form>);
    const code = screen.getByRole('textbox', { name: 'Normalized code' });
    fireEvent.input(code, { target: { value: '  ALLOWED  ' } });
    await waitFor(() => expect(code).toHaveValue('ALLOWED'));
    const channel = screen.getByRole('textbox', { name: 'Warning channel' });
    fireEvent.input(channel, { target: { value: 'legacy' } });
    await waitFor(() => expect(screen.getByLabelText('Rule state')).toHaveTextContent('error:Channel format invalid:'));
    expect(screen.queryByText('Legacy channel warning')).not.toBeInTheDocument();
    fireEvent.input(channel, { target: { value: 'modern' } });
    await waitFor(() => expect(screen.getByLabelText('Rule state')).toHaveTextContent('none::'));
    fireEvent.input(channel, { target: { value: 'legacy-modern' } });
    await waitFor(() => expect(screen.getByLabelText('Rule state')).toHaveTextContent('error:Channel format invalid:'));
    fireEvent.input(channel, { target: { value: 'modern' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit warning form' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ code: 'ALLOWED', channel: 'modern' }));
  });

  it('binds Select arrays and RangePicker tuples through Form submit and reset', async () => {
    const [form] = Form.useForm();
    const onFinish = vi.fn();
    render(() => <Form
      form={form}
      initialValues={{ roles: ['owner'], window: [dayjs('2026-05-10'), dayjs('2026-05-12')] }}
      onFinish={onFinish}
    >
      <Form.Item name="roles" label="Roles"><Select mode="multiple" aria-label="Roles" defaultValue={['ignored']} options={[{ value: 'owner', label: 'Owner' }, { value: 'reviewer', label: 'Reviewer' }]} /></Form.Item>
      <Form.Item name="window" label="Window"><DatePicker.RangePicker defaultValue={[dayjs('2025-01-01'), dayjs('2025-01-02')]} /></Form.Item>
      <Button htmlType="submit">Save compound fields</Button>
      <Button onClick={() => form.resetFields()}>Reset compound fields</Button>
    </Form>);

    expect(screen.getByRole('button', { name: 'Remove Owner' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Remove ignored' })).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Start date' })).toHaveValue('2026-05-10');
    fireEvent.click(screen.getByRole('combobox', { name: 'Roles' }));
    fireEvent.click(await screen.findByRole('option', { name: 'Reviewer' }));
    const end = screen.getByRole('textbox', { name: 'End date' });
    fireEvent.input(end, { target: { value: '2026-05-15' } });
    fireEvent.keyDown(end, { key: 'Enter' });
    fireEvent.click(screen.getByRole('button', { name: 'Save compound fields' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalled());
    expect(onFinish.mock.calls[0][0].roles).toEqual(['owner', 'reviewer']);
    expect(onFinish.mock.calls[0][0].window.map((date: dayjs.Dayjs) => date.format('YYYY-MM-DD'))).toEqual(['2026-05-10', '2026-05-15']);

    fireEvent.click(screen.getByRole('button', { name: 'Reset compound fields' }));
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Remove Reviewer' })).not.toBeInTheDocument());
    expect(screen.getByRole('textbox', { name: 'End date' })).toHaveValue('2026-05-12');
  });

  it('binds custom native controls with Form.Item value and event adapters', async () => {
    const [form] = Form.useForm();
    const onFinish = vi.fn();
    const onValuesChange = vi.fn();
    const NativeCheckbox = () => <input data-form-control type="checkbox" aria-label="Native agreement" />;
    const NativeText = () => <input data-form-control aria-label="Native handle" />;
    render(() => <Form form={form} initialValues={{ agreement: true, handle: 'ada' }} onFinish={onFinish} onValuesChange={onValuesChange}>
      <Form.Item name="agreement" valuePropName="checked" getValueFromEvent={(event) => (event as Event & { target: HTMLInputElement }).target.checked}><NativeCheckbox /></Form.Item>
      <Form.Item name="handle" noStyle trigger="onBlur" validateTrigger="onBlur" rules={[{ min: 3, message: 'Handle is too short' }]} getValueProps={(value) => ({ value: `@${String(value ?? '')}` })} getValueFromEvent={(event) => (event as Event & { target: HTMLInputElement }).target.value.replace(/^@/, '')} normalize={(value) => String(value).toUpperCase()}><NativeText /></Form.Item>
      <Button htmlType="submit">Submit native controls</Button>
    </Form>);
    const checkbox = screen.getByRole('checkbox', { name: 'Native agreement' });
    const handle = screen.getByRole('textbox', { name: 'Native handle' });
    expect(checkbox).toBeChecked();
    expect(handle).toHaveValue('@ada');
    fireEvent.click(checkbox);
    fireEvent.input(handle, { target: { value: '@x' } });
    expect(onValuesChange).toHaveBeenCalledTimes(1);
    fireEvent.blur(handle);
    await waitFor(() => expect(form.getFieldError('handle')).toEqual(['Handle is too short']));
    expect(handle).toHaveValue('@X');
    fireEvent.input(handle, { target: { value: '@grace' } });
    fireEvent.blur(handle);
    await waitFor(() => expect(form.getFieldError('handle')).toEqual([]));
    expect(handle).toHaveValue('@GRACE');
    fireEvent.click(screen.getByRole('button', { name: 'Submit native controls' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ agreement: false, handle: 'GRACE' }));
  });

  it('does not duplicate Form changes for context-aware built-in controls', () => {
    const onValuesChange = vi.fn();
    render(() => <Form onValuesChange={onValuesChange}><Form.Item name="account"><Input aria-label="Context-aware account" /></Form.Item></Form>);
    fireEvent.input(screen.getByRole('textbox', { name: 'Context-aware account' }), { target: { value: 'Ada' } });
    expect(onValuesChange).toHaveBeenCalledTimes(1);
  });

  it('validates nested Form array and object rules', async () => {
    const [form] = Form.useForm({ tags: ['solid', 'x'], profile: { age: 2.5, site: 'invalid' } });
    render(() => <Form form={form}>
      <Form.Item name="tags" rules={[{ type: 'array', defaultField: { type: 'string', min: 3, message: 'Each tag needs three characters' } }]}><span /></Form.Item>
      <Form.Item name="profile" rules={[{ type: 'object', fields: { age: { type: 'integer', message: 'Age must be an integer' } } }, { type: 'object', fields: { site: { type: 'url', message: 'Site must be a URL' } } }]}><span /></Form.Item>
    </Form>);
    await expect(form.validateFields()).rejects.toMatchObject({ errorFields: [
      { name: 'tags', errors: ['Each tag needs three characters'] },
      { name: 'profile', errors: ['Age must be an integer', 'Site must be a URL'] },
    ] });
    form.setFieldsValue({ tags: ['solid', 'design'], profile: { age: 3, site: 'https://example.com' } });
    await expect(form.validateFields()).resolves.toMatchObject({ tags: ['solid', 'design'], profile: { age: 3, site: 'https://example.com' } });
  });

  it('debounces Form validation before invoking the latest rule', async () => {
    const validator = vi.fn(async (_rule: unknown, _value: unknown) => undefined);
    render(() => <Form><Form.Item name="search" validateDebounce={30} rules={[{ validator }]}><Input aria-label="Debounced rule" /></Form.Item></Form>);
    const input = screen.getByRole('textbox', { name: 'Debounced rule' });
    fireEvent.input(input, { target: { value: 'a' } });
    fireEvent.input(input, { target: { value: 'ab' } });
    fireEvent.input(input, { target: { value: 'abc' } });
    await new Promise((resolve) => setTimeout(resolve, 55));
    expect(validator).toHaveBeenCalledTimes(1);
    expect(validator.mock.calls[0][1]).toBe('abc');
  });

  it('allows warningOnly Form rules to report warnings without blocking submit', async () => {
    const onFinish = vi.fn();
    function WarningReader() { const state = Form.Item.useStatus(); return <output aria-label="Warning-only state">{state.status ?? 'none'}:{state.warnings.join('|')}</output>; }
    render(() => <Form onFinish={onFinish}><Form.Item name="version" rules={[{ pattern: /^current$/, message: 'Version is deprecated', warningOnly: true }]}><Input aria-label="Warning-only version" /><WarningReader /></Form.Item><Button htmlType="submit">Submit warning only</Button></Form>);
    fireEvent.input(screen.getByRole('textbox', { name: 'Warning-only version' }), { target: { value: 'legacy' } });
    await waitFor(() => expect(screen.getByLabelText('Warning-only state')).toHaveTextContent('warning:Version is deprecated'));
    fireEvent.click(screen.getByRole('button', { name: 'Submit warning only' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ version: 'legacy' }));
  });

  it('discards stale asynchronous Form validation results', async () => {
    render(() => (
      <Form layout="vertical">
        <Form.Item name="account" label="Account" rules={[{
          validator: async (_, value) => {
            await new Promise((resolve) => setTimeout(resolve, value === 'bad' ? 35 : 1));
            if (value === 'bad') throw new Error('Account is unavailable');
          },
        }]}>
          <Input aria-label="Async account" />
        </Form.Item>
      </Form>
    ));
    const input = screen.getByLabelText('Async account');
    fireEvent.input(input, { target: { value: 'bad' } });
    fireEvent.input(input, { target: { value: 'good' } });
    await new Promise((resolve) => setTimeout(resolve, 55));
    expect(screen.queryByText('Account is unavailable')).not.toBeInTheDocument();
    expect(input).toHaveValue('good');
  });

  it('reports form validation errors on blur and blocks invalid submission', async () => {
    const onFinish = vi.fn();
    const onFinishFailed = vi.fn();
    render(() => (
      <Form layout="vertical" validateTrigger="onBlur" onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Form.Item name="name" label="Workspace" rules={[{ required: true, message: 'Workspace is required' }]}>
          <Input aria-label="Workspace name" />
        </Form.Item>
        <Button htmlType="submit">Create</Button>
      </Form>
    ));

    const input = screen.getByRole('textbox', { name: 'Workspace name' });
    fireEvent.blur(input);
    expect(await screen.findByRole('alert')).toHaveTextContent('Workspace is required');
    expect(input).toHaveAttribute('aria-invalid', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    await waitFor(() => expect(onFinishFailed).toHaveBeenCalledOnce());
    expect(onFinish).not.toHaveBeenCalled();
  });

  it('opens a select listbox and commits a single option', async () => {
    const onChange = vi.fn();
    render(() => (
      <Select
        aria-label="Environment"
        placeholder="Choose environment"
        allowClear
        options={[
          { value: 'production', label: 'Production' },
          { value: 'staging', label: 'Staging' },
        ]}
        onChange={onChange}
      />
    ));

    const combobox = screen.getByRole('combobox', { name: 'Environment' });
    fireEvent.click(combobox);
    const option = await screen.findByRole('option', { name: 'Staging' });
    fireEvent.click(option);

    await waitFor(() => expect(combobox).toHaveAttribute('aria-expanded', 'false'));
    expect(onChange).toHaveBeenCalledWith('staging', expect.objectContaining({ value: 'staging' }));
    expect(screen.getByText('Staging')).toBeInTheDocument();
  });

  it('filters searchable select options', async () => {
    render(() => (
      <Select
        aria-label="Country"
        showSearch
        options={[
          { value: 'cn', label: 'China' },
          { value: 'de', label: 'Germany' },
          { value: 'jp', label: 'Japan' },
        ]}
      />
    ));

    const combobox = screen.getByRole('combobox', { name: 'Country' });
    fireEvent.click(combobox);
    await screen.findByRole('listbox');
    fireEvent.input(combobox, { target: { value: 'ger' } });

    await waitFor(() => expect(screen.queryByRole('option', { name: 'China' })).not.toBeInTheDocument());
    expect(screen.getByRole('option', { name: 'Germany' })).toBeInTheDocument();
  });

  it('selects the first enabled option with the keyboard', async () => {
    const onChange = vi.fn();
    render(() => (
      <Select
        aria-label="Plan"
        options={[
          { value: 'legacy', label: 'Legacy', disabled: true },
          { value: 'standard', label: 'Standard' },
        ]}
        onChange={onChange}
      />
    ));

    const combobox = screen.getByRole('combobox', { name: 'Plan' });
    fireEvent.click(combobox);
    await screen.findByRole('listbox');
    fireEvent.keyDown(combobox, { key: 'Enter' });
    await waitFor(() => expect(onChange).toHaveBeenCalledWith('standard', expect.objectContaining({ value: 'standard' })));
  });

  it('registers declarative Select.Option and Select.OptGroup', async () => {
    const onChange = vi.fn();
    render(() => <Select aria-label="Declarative select" onChange={onChange}><Select.OptGroup label="Europe"><Select.Option value="de">Germany</Select.Option><Select.Option value="fr">France</Select.Option></Select.OptGroup><Select.Option value="jp">Japan</Select.Option></Select>);
    const select = screen.getByRole('combobox', { name: 'Declarative select' });
    await waitFor(() => fireEvent.click(select));
    expect(await screen.findByText('Europe')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('option', { name: 'Germany' }));
    expect(onChange).toHaveBeenCalledWith('de', expect.objectContaining({ value: 'de' }));
  });

  it('maps custom Select option fields and groups', async () => {
    const onChange = vi.fn();
    render(() => <Select aria-label="Mapped select" fieldNames={{ label: 'name', value: 'code', options: 'nodes', groupLabel: 'name' }} options={[{ name: 'People', nodes: [{ code: 'ada', name: 'Ada' }, { code: 'grace', name: 'Grace' }] }]} onChange={onChange} />);
    fireEvent.click(screen.getByRole('combobox', { name: 'Mapped select' }));
    expect(await screen.findByText('People')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('option', { name: 'Grace' }));
    expect(onChange).toHaveBeenCalledWith('grace', expect.objectContaining({ value: 'grace', label: 'Grace' }));
  });

  it('emits labeled Select values and selection lifecycle events', async () => {
    const onChange = vi.fn();
    const onSelect = vi.fn();
    const onDeselect = vi.fn();
    const onClear = vi.fn();
    render(() => <Select mode="multiple" labelInValue allowClear aria-label="Labeled select" defaultValue={[{ value: 'ada', label: 'Ada' }]} options={[{ value: 'ada', label: 'Ada' }, { value: 'grace', label: 'Grace' }]} onChange={onChange} onSelect={onSelect} onDeselect={onDeselect} onClear={onClear} />);
    fireEvent.click(screen.getByRole('combobox', { name: 'Labeled select' }));
    fireEvent.click(await screen.findByRole('option', { name: 'Grace' }));
    expect(onChange).toHaveBeenLastCalledWith([expect.objectContaining({ value: 'ada', label: 'Ada' }), expect.objectContaining({ value: 'grace', label: 'Grace' })], expect.any(Array));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: 'grace', label: 'Grace' }), expect.objectContaining({ value: 'grace' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Remove Grace' }));
    expect(onDeselect).toHaveBeenCalledWith(expect.objectContaining({ value: 'grace' }), expect.objectContaining({ value: 'grace' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('selects multiple options from token separators', () => {
    const onChange = vi.fn();
    render(() => <Select mode="multiple" showSearch tokenSeparators={[',']} aria-label="Token select" options={[{ value: 'ada', label: 'Ada' }, { value: 'grace', label: 'Grace' }]} onChange={onChange} />);
    fireEvent.input(screen.getByRole('combobox', { name: 'Token select' }), { target: { value: 'Ada,Grace,' } });
    expect(onChange).toHaveBeenCalledWith(['ada', 'grace'], [expect.objectContaining({ value: 'ada' }), expect.objectContaining({ value: 'grace' })]);
  });

  it('customizes Select popup semantics and event hooks', async () => {
    const onFocus = vi.fn();
    const onInputKeyDown = vi.fn();
    const onPopupScroll = vi.fn();
    const onActive = vi.fn();
    render(() => <Select showSearch defaultActiveFirstOption={false} listHeight={120} aria-label="Custom popup select" options={[{ value: 'a', label: 'Alpha' }, { value: 'z', label: 'Zulu' }]} filterSort={(left, right) => String(right.label).localeCompare(String(left.label))} classNames={{ root: 'semantic-root', dropdown: 'semantic-popup', option: 'semantic-option' }} styles={{ option: { color: 'rgb(0, 128, 0)' } }} popupRender={(menu) => <>{menu}<div>Popup footer</div></>} onFocus={onFocus} onInputKeyDown={onInputKeyDown} onPopupScroll={onPopupScroll} onActive={onActive} />);
    const input = screen.getByRole('combobox', { name: 'Custom popup select' });
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(onFocus).toHaveBeenCalledOnce();
    expect(onInputKeyDown).toHaveBeenCalledOnce();
    expect(input.closest('.ads-select')).toHaveClass('semantic-root');
    const options = await screen.findAllByRole('option');
    expect(options[0]).toHaveTextContent('Zulu');
    expect(input).not.toHaveAttribute('aria-activedescendant');
    fireEvent.pointerMove(options[0]);
    expect(onActive).toHaveBeenCalledWith('z', expect.objectContaining({ value: 'z' }));
    expect(options[0]).toHaveClass('semantic-option');
    expect(options[0]).toHaveStyle({ color: 'rgb(0, 128, 0)' });
    expect(screen.getByText('Popup footer')).toBeInTheDocument();
    const popup = screen.getByRole('listbox');
    expect(popup).toHaveClass('semantic-popup');
    fireEvent.scroll(popup);
    expect(onPopupScroll).toHaveBeenCalledOnce();
  });

  it('virtualizes large Select option lists while preserving keyboard selection', async () => {
    const onChange = vi.fn();
    const options = Array.from({ length: 5000 }, (_, index) => ({ value: index, label: `Option ${index}` }));
    const started = performance.now();
    render(() => <Select virtual listHeight={128} aria-label="Virtual select" options={options} onChange={onChange} />);
    expectRenderWithin(started, 1500);
    const input = screen.getByRole('combobox', { name: 'Virtual select' });
    fireEvent.click(input);
    const rendered = await screen.findAllByRole('option');
    expect(rendered.length).toBeLessThan(40);
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith(0, expect.objectContaining({ value: 0 }));
  });

  it('renders custom Select option, label, prefix, and compatibility callbacks', async () => {
    const onDropdownVisibleChange = vi.fn();
    render(() => <Select aria-label="Rendered select" prefix="@" variant="filled" showArrow={false} options={[{ value: 'ada', label: 'Ada' }]} optionRender={(option) => <>Pick {option.label}</>} labelRender={(value) => <>Chosen {value.label}</>} menuItemSelectedIcon="selected" onDropdownVisibleChange={onDropdownVisibleChange} />);
    const input = screen.getByRole('combobox', { name: 'Rendered select' });
    expect(input.closest('.ads-select')).toHaveClass('bg-surface-container');
    expect(screen.getByText('@')).toBeInTheDocument();
    fireEvent.click(input);
    fireEvent.click(await screen.findByRole('option', { name: 'Pick Ada' }));
    expect(await screen.findByText('Chosen Ada')).toBeInTheDocument();
    expect(onDropdownVisibleChange).toHaveBeenCalledWith(true);
    expect(onDropdownVisibleChange).toHaveBeenLastCalledWith(false);
  });

  it('renders Select custom tags and omitted placeholders', () => {
    render(() => <Select mode="multiple" aria-label="Tag renderer" maxTagCount={1} maxTagTextLength={3} maxTagPlaceholder={(omitted) => `${omitted.length} hidden`} defaultValue={['alpha', 'beta']} options={[{ value: 'alpha', label: 'Alphabet' }, { value: 'beta', label: 'Beta' }]} tagRender={(info) => <button type="button" onClick={() => info.onClose()}>Tag {info.label}</button>} />);
    expect(screen.getByRole('button', { name: 'Tag Alp' })).toBeInTheDocument();
    expect(screen.getByText('1 hidden')).toBeInTheDocument();
  });

  it('enforces Select maxCount and preserves search when auto clear is disabled', async () => {
    const onChange = vi.fn();
    render(() => <Select mode="multiple" showSearch maxCount={1} autoClearSearchValue={false} aria-label="Limited select" options={[{ value: 'ada', label: 'Ada' }, { value: 'grace', label: 'Grace' }]} onChange={onChange} />);
    const input = screen.getByRole('combobox', { name: 'Limited select' });
    fireEvent.click(input);
    fireEvent.input(input, { target: { value: 'A' } });
    fireEvent.click(await screen.findByRole('option', { name: 'Ada' }));
    expect(await screen.findByRole('button', { name: 'Remove Ada' })).toBeInTheDocument();
    expect(input).toHaveValue('A');
    fireEvent.input(input, { target: { value: '' } });
    fireEvent.click(screen.getByRole('option', { name: 'Grace' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: 'Remove Grace' })).not.toBeInTheDocument();
  });

  it('submits multiple select values through Form', async () => {
    const onFinish = vi.fn();
    render(() => (
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="members" label="Members" rules={[{ required: true }]}>
          <Select
            mode="multiple"
            options={[
              { value: 'ada', label: 'Ada' },
              { value: 'grace', label: 'Grace' },
            ]}
          />
        </Form.Item>
        <Button htmlType="submit">Invite</Button>
      </Form>
    ));

    const combobox = screen.getByRole('combobox', { name: 'Members' });
    fireEvent.click(combobox);
    fireEvent.click(await screen.findByRole('option', { name: 'Ada' }));
    fireEvent.click(screen.getByRole('option', { name: 'Grace' }));
    fireEvent.click(screen.getByRole('button', { name: 'Invite' }));

    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ members: ['ada', 'grace'] }));
  });

  it('registers Table.ColumnGroup columns and renders Table.Summary', async () => {
    render(() => <Table dataSource={[{ key: 1, name: 'Ada', role: 'Owner' }]} pagination={false} summary={() => <Table.Summary><Table.Summary.Row><Table.Summary.Cell colspan={2}>Total: 1</Table.Summary.Cell></Table.Summary.Row></Table.Summary>}><Table.ColumnGroup title="Identity"><Table.Column dataIndex="name" title="Name" /><Table.Column dataIndex="role" title="Role" /></Table.ColumnGroup></Table>);
    expect(await screen.findByRole('columnheader', { name: 'Identity' })).toHaveAttribute('colspan', '2');
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.getByText('Total: 1').closest('tfoot')).toHaveClass('ads-table-summary');
    expect(Table.SELECTION_ALL).toBe('SELECT_ALL');
  });

  it('renders recursive Table column groups and prunes fully hidden branches', () => {
    const { container } = render(() => <Table
      pagination={false}
      scroll={{ x: 900 }}
      dataSource={[{ key: 1, name: 'Ada', team: 'Core', score: 98, action: 'Open', secret: 'x' }]}
      rowSelection={{ fixed: true, columnWidth: 40 }}
      expandable={{ fixed: 'left', columnWidth: 32, expandedRowRender: () => 'Details' }}
      columns={[
        { title: 'Account', children: [{ title: 'Identity', children: [
          { dataIndex: 'name', title: 'Name', width: 100, fixed: 'left' },
          { dataIndex: 'team', title: 'Team', width: 80, fixed: 'left' },
        ] }] },
        { dataIndex: 'score', title: 'Score', width: 120 },
        { title: 'Hidden group', children: [{ dataIndex: 'secret', title: 'Secret', hidden: true }] },
        { title: 'Actions', children: [{ dataIndex: 'action', title: 'Action', width: 60, fixed: 'right' }] },
      ]}
    />);

    const headers = screen.getAllByRole('columnheader');
    expect(container.querySelectorAll('thead > tr')).toHaveLength(3);
    expect(screen.queryByRole('columnheader', { name: 'Hidden group' })).not.toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Secret' })).not.toBeInTheDocument();
    expect(headers[0]).toHaveAttribute('rowspan', '3');
    expect(headers[1]).toHaveAttribute('rowspan', '3');
    expect(screen.getByRole('columnheader', { name: 'Account' })).toHaveAttribute('colspan', '2');
    expect(screen.getByRole('columnheader', { name: 'Account' })).toHaveStyle({ position: 'sticky', left: '72px', width: '180px' });
    expect(screen.getByRole('columnheader', { name: 'Identity' })).toHaveAttribute('colspan', '2');
    expect(screen.getByRole('columnheader', { name: 'Identity' })).toHaveStyle({ position: 'sticky', left: '72px', width: '180px' });
    expect(screen.getByRole('columnheader', { name: 'Score' })).toHaveAttribute('rowspan', '3');
    expect(screen.getByRole('columnheader', { name: 'Actions' })).toHaveStyle({ position: 'sticky', right: '0px' });
    expect(screen.getByRole('columnheader', { name: 'Action' })).toHaveAttribute('rowspan', '2');
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveStyle({ position: 'sticky', left: '72px' });
    expect(screen.getByRole('columnheader', { name: 'Team' })).toHaveStyle({ position: 'sticky', left: '172px' });
    const cells = screen.getAllByRole('cell');
    expect(cells).toHaveLength(6);
    expect(cells[2]).toHaveTextContent('Ada');
    expect(cells[2]).toHaveStyle({ position: 'sticky', left: '72px' });
    expect(cells[3]).toHaveTextContent('Core');
    expect(cells[3]).toHaveStyle({ position: 'sticky', left: '172px' });
    expect(cells[5]).toHaveTextContent('Open');
    expect(cells[5]).toHaveStyle({ position: 'sticky', right: '0px' });
  });

  it('applies Table semantic slots and row/header/scroll callbacks', () => {
    let tableRef: TableRef | undefined;
    const onRowClick = vi.fn();
    const onHeaderClick = vi.fn();
    const onScroll = vi.fn();
    const { container } = render(() => <Table ref={(value) => { tableRef = value; }} sticky pagination={false} dataSource={[{ key: 1, name: 'Ada' }]} columns={[{ dataIndex: 'name', title: 'Name' }]} classNames={{ root: 'custom-root', body: 'custom-body', row: 'custom-row', cell: 'custom-cell' }} styles={{ cell: { color: 'rgb(255, 0, 0)' } }} onRow={() => ({ onClick: onRowClick, 'data-testid': 'data-row' })} onHeaderRow={() => ({ onClick: onHeaderClick })} onScroll={onScroll} />);
    expect(container.querySelector('.ads-table')).toHaveClass('custom-root');
    expect(tableRef?.nativeElement).toBe(container.querySelector('.ads-table'));
    expect(container.querySelector('thead')).toHaveClass('sticky');
    expect(container.querySelector('tbody')).toHaveClass('custom-body');
    const row = screen.getByTestId('data-row');
    expect(row).toHaveClass('custom-row');
    expect(row.querySelector('td')).toHaveClass('custom-cell');
    expect(row.querySelector('td')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    fireEvent.click(row);
    fireEvent.click(screen.getByRole('columnheader', { name: 'Name' }).closest('tr')!);
    fireEvent.scroll(container.querySelector('.overflow-auto')!);
    expect(onRowClick).toHaveBeenCalledOnce();
    expect(onHeaderClick).toHaveBeenCalledOnce();
    expect(onScroll).toHaveBeenCalledOnce();
    tableRef?.scrollTo({ top: 24 });
    expect((container.querySelector('.overflow-auto') as HTMLElement).scrollTop).toBe(24);
  });

  it('applies shared Table columns, custom components, sorter tooltips, and popup containers', async () => {
    const popupHost = document.createElement('div');
    popupHost.dataset.testid = 'table-popup-host';
    document.body.append(popupHost);
    const CustomTable = (props: JSX.HTMLAttributes<HTMLTableElement>) => <table {...props} data-custom-table="true" />;
    const CustomHeaderCell = (props: JSX.ThHTMLAttributes<HTMLTableCellElement>) => <th {...props} data-custom-header="true" />;
    const CustomBodyCell = (props: JSX.TdHTMLAttributes<HTMLTableCellElement>) => <td {...props} data-custom-cell="true" />;
    render(() => (
      <Table
        pagination={false}
        column={{ align: 'right' }}
        components={{ table: CustomTable, header: { cell: CustomHeaderCell }, body: { cell: CustomBodyCell } }}
        getPopupContainer={() => popupHost}
        showSorterTooltip={{ target: 'full-header' }}
        dataSource={[{ key: 1, name: 'Ada' }]}
        columns={[{ dataIndex: 'name', title: 'Name', sorter: true, filters: [{ text: 'Ada', value: 'Ada' }] }]}
      />
    ));
    expect(document.querySelector('[data-custom-table="true"]')).toBeInTheDocument();
    expect(document.querySelector('[data-custom-header="true"]')).toHaveStyle({ textAlign: 'right' });
    expect(document.querySelector('[data-custom-cell="true"]')).toHaveStyle({ textAlign: 'right' });
    expect(screen.getByTitle('Click to sort ascending')).toHaveAccessibleName('Name');
    fireEvent.click(screen.getByRole('button', { name: 'Filter Name' }));
    await waitFor(() => expect(popupHost.querySelector('input[type="checkbox"]')).toBeInTheDocument());
    popupHost.remove();
  });

  it('virtualizes large Table data and scrolls through its imperative ref', async () => {
    let tableRef: TableRef | undefined;
    const data = Array.from({ length: 1000 }, (_, key) => ({ key, name: `Row ${key}` }));
    render(() => <Table ref={(value) => { tableRef = value; }} virtual scroll={{ y: 120 }} pagination={false} dataSource={data} columns={[{ dataIndex: 'name', title: 'Name' }]} />);
    await waitFor(() => expect(document.querySelectorAll('tbody > tr[data-row-key]').length).toBeGreaterThan(0));
    expect(document.querySelectorAll('tbody > tr[data-row-key]').length).toBeLessThan(40);
    tableRef?.scrollTo({ index: 500, align: 'start' });
    expect(tableRef?.nativeElement).toHaveClass('ads-table');
  });

  it('combines custom Table body rows with virtual expansion and memoized onRow props', async () => {
    const onRow = vi.fn((_record: { key: number; name: string }, _index: number): JSX.HTMLAttributes<HTMLTableRowElement> => ({ class: 'custom-row-prop' }));
    const CustomWrapper = (props: JSX.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} data-custom-wrapper="true" />;
    const CustomRow = (props: JSX.HTMLAttributes<HTMLTableRowElement> & { record?: unknown; index?: number }) => {
      const { record: _record, index: _index, ...rowProps } = props;
      return <tr {...rowProps} data-custom-body-row="true" />;
    };
    const data = Array.from({ length: 100 }, (_, key) => ({ key, name: `Custom ${key}` }));
    const { container } = render(() => <Table virtual scroll={{ y: 120 }} pagination={false} dataSource={data} columns={[{ dataIndex: 'name', title: 'Name' }]} components={{ body: { wrapper: CustomWrapper, row: CustomRow } }} onRow={onRow} expandable={{ expandedRowRender: (record) => <div style={{ height: '73px' }}>Details {record.name}</div> }} />);
    await waitFor(() => expect(container.querySelectorAll('[data-custom-body-row="true"]').length).toBeGreaterThan(0));
    const visibleRows = container.querySelectorAll('tr[data-row-key]').length;
    expect(onRow).toHaveBeenCalledTimes(visibleRows);
    expect(container.querySelector('[data-custom-wrapper="true"]')).toBeInTheDocument();
    expect(container.querySelector('tr.custom-row-prop')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: 'Expand row' })[0]);
    expect(await screen.findByText('Details Custom 0')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-virtual-measure="0"]')).toHaveLength(2);
  });

  it('keeps virtual Table DOM and scroll position bounded across data growth', async () => {
    let tableRef: TableRef | undefined;
    const [data, setData] = createSignal(Array.from({ length: 5000 }, (_, key) => ({ key, name: `Record ${key}` })));
    const started = performance.now();
    const { container } = render(() => <Table ref={(value) => { tableRef = value; }} virtual scroll={{ y: 160 }} pagination={false} dataSource={data()} columns={[{ dataIndex: 'name', title: 'Name' }]} />);
    expectRenderWithin(started, 1500);
    await waitFor(() => expect(container.querySelectorAll('tbody > tr[data-row-key]').length).toBeGreaterThan(0));
    expect(container.querySelectorAll('tbody > tr[data-row-key]').length).toBeLessThan(50);
    const viewport = container.querySelector('.ads-table > .overflow-auto') as HTMLElement;
    expect(tableRef?.nativeElement).toBe(container.querySelector('.ads-table'));
    viewport.scrollTop = 120000;
    fireEvent.scroll(viewport);
    await waitFor(() => expect(Number((container.querySelector('tbody > tr[data-index]') as HTMLElement)?.dataset.index)).toBeGreaterThan(2000));
    const offset = viewport.scrollTop;
    setData((current) => [...current, ...Array.from({ length: 500 }, (_, index) => ({ key: current.length + index, name: `Record ${current.length + index}` }))]);
    await waitFor(() => expect(container.querySelectorAll('tbody > tr[data-row-key]').length).toBeLessThan(50));
    expect(viewport.scrollTop).toBe(offset);
  });

  it('hides Table headers when requested', () => {
    render(() => <Table showHeader={false} sortDirections={['descend']} pagination={false} dataSource={[{ key: 1, score: 1 }, { key: 2, score: 2 }]} columns={[{ dataIndex: 'score', title: 'Score', sorter: true }]} />);
    expect(screen.queryByRole('columnheader')).not.toBeInTheDocument();
  });

  it('pins fixed Table columns on both horizontal scroll edges', () => {
    const { container } = render(() => (
      <Table
        pagination={false}
        scroll={{ x: 800 }}
        dataSource={[{ key: 1, name: 'Ada', role: 'Owner', action: 'Open' }]}
        columns={[
          { dataIndex: 'name', title: 'Name', width: 120, fixed: 'left' },
          { dataIndex: 'role', title: 'Role', width: 300 },
          { dataIndex: 'action', title: 'Action', width: 80, fixed: 'right' },
        ]}
      />
    ));
    const leftHeader = screen.getByRole('columnheader', { name: 'Name' });
    const rightHeader = screen.getByRole('columnheader', { name: 'Action' });
    expect(leftHeader).toHaveStyle({ position: 'sticky', left: '0px' });
    expect(rightHeader).toHaveStyle({ position: 'sticky', right: '0px' });
    const cells = screen.getAllByRole('cell');
    expect(cells[0]).toHaveStyle({ position: 'sticky', left: '0px' });
    expect(cells[2]).toHaveStyle({ position: 'sticky', right: '0px' });
    expect(container.querySelector('table')).toHaveStyle({ 'min-width': '800px' });
  });

  it('sorts table rows and reports the sort action', async () => {
    const onChange = vi.fn();
    render(() => (
      <Table
        rowKey="id"
        pagination={false}
        dataSource={[
          { id: 1, name: 'Ada', score: 92 },
          { id: 2, name: 'Grace', score: 88 },
          { id: 3, name: 'Linus', score: 95 },
        ]}
        columns={[
          { dataIndex: 'name', title: 'Name' },
          { dataIndex: 'score', title: 'Score', sorter: true },
        ]}
        onChange={onChange}
      />
    ));

    fireEvent.click(screen.getByRole('button', { name: 'Score' }));
    await waitFor(() => expect(screen.getAllByRole('row')[1]).toHaveTextContent('Grace'));
    expect(screen.getByRole('columnheader', { name: 'Score' })).toHaveAttribute('aria-sort', 'ascending');
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ current: 1, total: 3 }),
      {},
      expect.objectContaining({ order: 'ascend', field: 'score' }),
      expect.objectContaining({ action: 'sort' }),
    );
  });

  it('combines multiple Table sorters by declared priority', async () => {
    const onChange = vi.fn();
    render(() => (
      <Table
        rowKey="id"
        pagination={false}
        dataSource={[
          { id: 1, name: 'Alpha', chinese: 90, math: 80 },
          { id: 2, name: 'Beta', chinese: 90, math: 70 },
          { id: 3, name: 'Gamma', chinese: 80, math: 99 },
        ]}
        columns={[
          { dataIndex: 'name', title: 'Name' },
          { dataIndex: 'chinese', title: 'Chinese', sorter: { compare: (a, b) => a.chinese - b.chinese, multiple: 3 } },
          { dataIndex: 'math', title: 'Math', sorter: { compare: (a, b) => a.math - b.math, multiple: 2 } },
        ]}
        onChange={onChange}
      />
    ));

    fireEvent.click(screen.getByRole('button', { name: 'Chinese' }));
    fireEvent.click(screen.getByRole('button', { name: 'Math' }));
    await waitFor(() => {
      const rows = screen.getAllByRole('row').slice(1);
      expect(rows[0]).toHaveTextContent('Gamma');
      expect(rows[1]).toHaveTextContent('Beta');
      expect(rows[2]).toHaveTextContent('Alpha');
    });
    const sorter = onChange.mock.calls.at(-1)?.[2];
    expect(sorter).toEqual([
      expect.objectContaining({ field: 'chinese', order: 'ascend' }),
      expect.objectContaining({ field: 'math', order: 'ascend' }),
    ]);
  });

  it('combines controlled Table filters and sorting without mutating external state', async () => {
    const [roles, setRoles] = createSignal<readonly string[] | null>(null);
    const [order, setOrder] = createSignal<'ascend' | 'descend'>('ascend');
    const onChange = vi.fn();
    render(() => <div>
      <Button onClick={() => setRoles(['Engineer'])}>Filter engineers</Button>
      <Button onClick={() => setOrder('descend')}>Sort descending</Button>
      <Table
        rowKey="id"
        pagination={false}
        dataSource={[{ id: 1, name: 'Ada', role: 'Owner' }, { id: 2, name: 'Grace', role: 'Engineer' }, { id: 3, name: 'Linus', role: 'Engineer' }]}
        columns={[
          { dataIndex: 'name', title: 'Name', sorter: (left, right) => left.name.localeCompare(right.name), sortOrder: order() },
          { dataIndex: 'role', title: 'Role', filteredValue: roles(), filters: [{ text: 'Owner', value: 'Owner' }, { text: 'Engineer', value: 'Engineer' }], onFilter: (value, record) => record.role === value },
        ]}
        onChange={onChange}
      />
    </div>);
    fireEvent.click(screen.getByRole('button', { name: 'Filter engineers' }));
    fireEvent.click(screen.getByRole('button', { name: 'Sort descending' }));
    await waitFor(() => {
      const rows = screen.getAllByRole('row').slice(1);
      expect(rows).toHaveLength(2);
      expect(rows[0]).toHaveTextContent('Linus');
      expect(rows[1]).toHaveTextContent('Grace');
    });
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('aria-sort', 'descending');
    fireEvent.click(screen.getByRole('button', { name: 'Name' }));
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ role: ['Engineer'] }), expect.objectContaining({ order: null }), expect.objectContaining({ action: 'sort' }));
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('aria-sort', 'descending');
  });

  it('filters table rows and reports Ant-style filter state', async () => {
    const onChange = vi.fn();
    render(() => (
      <Table
        rowKey="id"
        pagination={false}
        dataSource={[{ id: 1, name: 'Ada', role: 'Owner' }, { id: 2, name: 'Grace', role: 'Engineer' }, { id: 3, name: 'Linus', role: 'Engineer' }]}
        columns={[{ dataIndex: 'name', title: 'Name' }, { dataIndex: 'role', title: 'Role', filterSearch: true, filters: [{ text: 'Owner', value: 'Owner' }, { text: 'Engineer', value: 'Engineer' }], onFilter: (value, record) => record.role === value }]}
        onChange={onChange}
      />
    ));

    fireEvent.click(screen.getByLabelText('Filter Role'));
    fireEvent.input(await screen.findByRole('searchbox', { name: 'Search filters' }), { target: { value: 'engineer' } });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Engineer' }));
    await waitFor(() => expect(screen.queryByText('Ada')).not.toBeInTheDocument());
    expect(screen.getByText('Grace')).toBeInTheDocument();
    expect(screen.getByText('Linus')).toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ current: 1, total: 2 }),
      expect.objectContaining({ role: ['Engineer'] }),
      expect.anything(),
      expect.objectContaining({ action: 'filter', currentDataSource: expect.arrayContaining([expect.objectContaining({ name: 'Grace' })]) }),
    );
  });

  it('renders expandable table rows and reports expansion changes', async () => {
    const onExpand = vi.fn();
    const onExpandedRowsChange = vi.fn();
    render(() => (
      <Table
        rowKey="id"
        pagination={false}
        dataSource={[{ id: 1, name: 'Ada', details: 'Owner of Platform' }, { id: 2, name: 'Locked', details: 'Unavailable' }]}
        columns={[{ dataIndex: 'name', title: 'Name' }]}
        expandable={{ defaultExpandedRowKeys: [1], expandedRowRender: (record) => record.details, rowExpandable: (record) => record.name !== 'Locked', onExpand, onExpandedRowsChange }}
      />
    ));

    expect(screen.getByText('Owner of Platform')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Collapse row' })).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Collapse row' }));
    await waitFor(() => expect(screen.queryByText('Owner of Platform')).not.toBeInTheDocument());
    expect(onExpand).toHaveBeenCalledWith(false, expect.objectContaining({ name: 'Ada' }));
    expect(onExpandedRowsChange).toHaveBeenCalledWith([]);
    expect(screen.queryByRole('button', { name: /row/, hidden: false })).toBeInTheDocument();
  });

  it('keeps fixed selection, expansion, and data columns in a continuous sticky stack', () => {
    const { container } = render(() => (
      <Table
        rowKey="id"
        pagination={false}
        scroll={{ x: 900 }}
        dataSource={[{ id: 1, name: 'Ada', role: 'Owner' }]}
        rowSelection={{ fixed: true, columnWidth: 40 }}
        expandable={{ fixed: 'left', columnWidth: 32, expandedRowRender: (record) => record.role }}
        columns={[
          { dataIndex: 'name', title: 'Name', width: 120, fixed: 'left' },
          { dataIndex: 'role', title: 'Role', width: 160 },
          { dataIndex: 'id', title: 'ID', width: 80, fixed: 'right' },
        ]}
      />
    ));

    const headers = container.querySelectorAll('thead th');
    expect(headers[0]).toHaveStyle({ position: 'sticky', left: '0px' });
    expect(headers[1]).toHaveStyle({ position: 'sticky', left: '40px' });
    expect(headers[2]).toHaveStyle({ position: 'sticky', left: '72px' });
    expect(headers[4]).toHaveStyle({ position: 'sticky', right: '0px' });
    const cells = container.querySelectorAll('tbody tr:first-child > td');
    expect(cells[0]).toHaveStyle({ position: 'sticky', left: '0px' });
    expect(cells[1]).toHaveStyle({ position: 'sticky', left: '40px' });
    expect(cells[2]).toHaveStyle({ position: 'sticky', left: '72px' });
    expect(cells[4]).toHaveStyle({ position: 'sticky', right: '0px' });
  });

  it('keeps right-fixed selection, expansion, and data columns in a continuous sticky stack', () => {
    const { container } = render(() => (
      <Table
        rowKey="id"
        pagination={false}
        scroll={{ x: 900 }}
        dataSource={[{ id: 1, name: 'Ada', role: 'Owner' }]}
        rowSelection={{ fixed: 'right', columnWidth: 40 }}
        expandable={{ fixed: 'right', columnWidth: 32, expandedRowRender: (record) => record.role }}
        columns={[
          { dataIndex: 'name', title: 'Name', width: 120 },
          { dataIndex: 'role', title: 'Role', width: 160 },
          { dataIndex: 'id', title: 'ID', width: 80, fixed: 'right' },
        ]}
      />
    ));

    const headers = container.querySelectorAll('thead th');
    expect(headers[0]).toHaveStyle({ position: 'sticky', right: '0px' });
    expect(headers[1]).toHaveStyle({ position: 'sticky', right: '40px' });
    expect(headers[4]).toHaveStyle({ position: 'sticky', right: '72px' });
    const cells = container.querySelectorAll('tbody tr:first-child > td');
    expect(cells[0]).toHaveStyle({ position: 'sticky', right: '0px' });
    expect(cells[1]).toHaveStyle({ position: 'sticky', right: '40px' });
    expect(cells[4]).toHaveStyle({ position: 'sticky', right: '72px' });
  });

  it('offsets a right-fixed data column around a right-fixed expand column', () => {
    const { container } = render(() => (
      <Table
        rowKey="id"
        pagination={false}
        scroll={{ x: 600 }}
        dataSource={[{ id: 1, name: 'Ada' }]}
        expandable={{ fixed: 'right', columnWidth: 36, expandedRowRender: () => 'Details' }}
        columns={[{ dataIndex: 'name', title: 'Name' }, { dataIndex: 'id', title: 'ID', width: 80, fixed: 'right' }]}
      />
    ));
    const headers = container.querySelectorAll('thead th');
    expect(headers[0]).toHaveStyle({ position: 'sticky', right: '0px' });
    expect(headers[2]).toHaveStyle({ position: 'sticky', right: '36px' });
  });

  it('expands nested Table data with indentation and child selection', async () => {
    const onSelectionChange = vi.fn();
    render(() => (
      <Table
        rowKey="id"
        pagination={false}
        dataSource={[{ id: 'parent', name: 'Parent', nodes: [{ id: 'child', name: 'Child' }] }]}
        columns={[{ dataIndex: 'name', title: 'Name' }]}
        expandable={{ childrenColumnName: 'nodes', indentSize: 20 }}
        rowSelection={{ onChange: onSelectionChange }}
      />
    ));
    expect(screen.queryByText('Child')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Expand row' }));
    expect(await screen.findByText('Child')).toBeInTheDocument();
    const childRow = screen.getByText('Child').closest('tr')!;
    expect(childRow.querySelectorAll('td')[1]).toHaveStyle({ paddingLeft: '36px' });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select row 2' }));
    expect(onSelectionChange).toHaveBeenCalledWith(['child'], [expect.objectContaining({ name: 'Child' })], { type: 'single' });
  });

  it('cascades tree row selection when checkStrictly is false', async () => {
    const onChange = vi.fn();
    render(() => (
      <Table
        rowKey="id"
        pagination={false}
        dataSource={[{ id: 'parent', name: 'Parent', children: [{ id: 'child-1', name: 'Child one' }, { id: 'child-2', name: 'Child two' }] }]}
        columns={[{ dataIndex: 'name', title: 'Name' }]}
        expandable={{ defaultExpandAllRows: true }}
        rowSelection={{ checkStrictly: false, onChange }}
      />
    ));

    const parent = screen.getByRole('checkbox', { name: 'Select row 1' });
    fireEvent.click(parent);
    await waitFor(() => expect(onChange).toHaveBeenLastCalledWith(
      expect.arrayContaining(['parent', 'child-1', 'child-2']),
      expect.arrayContaining([expect.objectContaining({ name: 'Parent' }), expect.objectContaining({ name: 'Child one' }), expect.objectContaining({ name: 'Child two' })]),
      { type: 'multiple' },
    ));
    expect(parent).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Row 2 selected' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Row 3 selected' })).toBeChecked();

    fireEvent.click(screen.getByRole('checkbox', { name: 'Row 2 selected' }));
    await waitFor(() => expect(onChange).toHaveBeenLastCalledWith(
      ['child-2'],
      [expect.objectContaining({ name: 'Child two' })],
      { type: 'multiple' },
    ));
    expect(parent).not.toBeChecked();
    expect(parent).toHaveAttribute('aria-checked', 'mixed');
    expect((parent as HTMLInputElement).indeterminate).toBe(true);
  });

  it('paginates table data and changes page size', async () => {
    const data = Array.from({ length: 12 }, (_, index) => ({ id: index + 1, name: `User ${index + 1}` }));
    render(() => (
      <Table
        rowKey="id"
        dataSource={data}
        columns={[{ dataIndex: 'name', title: 'Name' }]}
        pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: [5, 10] }}
      />
    ));

    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.queryByText('User 6')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    await waitFor(() => expect(screen.getByText('User 6')).toBeInTheDocument());

    fireEvent.change(screen.getByRole('combobox', { name: 'Rows per page' }), { target: { value: '10' } });
    await waitFor(() => expect(screen.getByText('User 10')).toBeInTheDocument());
  });

  it('selects table rows and exposes selected records', async () => {
    const onSelectionChange = vi.fn();
    render(() => (
      <Table
        rowKey="id"
        pagination={false}
        dataSource={[
          { id: 'a', name: 'Ada' },
          { id: 'g', name: 'Grace' },
        ]}
        columns={[{ dataIndex: 'name', title: 'Name' }]}
        rowSelection={{ onChange: onSelectionChange }}
      />
    ));

    fireEvent.click(screen.getByRole('checkbox', { name: 'Select row 1' }));
    await waitFor(() => expect(onSelectionChange).toHaveBeenCalledWith(['a'], [expect.objectContaining({ name: 'Ada' })], { type: 'single' }));
    expect(screen.getByRole('checkbox', { name: 'Row 1 selected' })).toBeChecked();
  });

  it('selects and clears contiguous Table ranges with shift-click', async () => {
    const onChange = vi.fn();
    const onSelect = vi.fn();
    const onSelectMultiple = vi.fn();
    render(() => <Table
      rowKey="id"
      pagination={false}
      dataSource={['a', 'b', 'c', 'd'].map((id) => ({ id, name: id.toUpperCase() }))}
      columns={[{ dataIndex: 'name', title: 'Name' }]}
      rowSelection={{ onChange, onSelect, onSelectMultiple }}
    />);

    fireEvent.click(screen.getByRole('checkbox', { name: 'Select row 1' }));
    await waitFor(() => expect(screen.getByRole('checkbox', { name: 'Row 1 selected' })).toBeChecked());
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select row 4' }), { shiftKey: true });
    expect(onChange).toHaveBeenLastCalledWith(['a', 'b', 'c', 'd'], expect.any(Array), { type: 'multiple' });
    expect(onSelectMultiple).toHaveBeenLastCalledWith(true, expect.arrayContaining([expect.objectContaining({ id: 'a' }), expect.objectContaining({ id: 'd' })]), [expect.objectContaining({ id: 'b' }), expect.objectContaining({ id: 'c' }), expect.objectContaining({ id: 'd' })]);
    expect(onSelect).toHaveBeenCalledOnce();

    await waitFor(() => expect(screen.getByRole('checkbox', { name: 'Row 4 selected' })).toBeChecked());
    fireEvent.click(screen.getByRole('checkbox', { name: 'Row 2 selected' }), { shiftKey: true });
    expect(onChange).toHaveBeenLastCalledWith(['a'], [expect.objectContaining({ id: 'a' })], { type: 'multiple' });
    expect(onSelectMultiple).toHaveBeenLastCalledWith(false, [expect.objectContaining({ id: 'a' })], [expect.objectContaining({ id: 'b' }), expect.objectContaining({ id: 'c' }), expect.objectContaining({ id: 'd' })]);
  });

  it('runs default and custom Table selection actions across pages while preserving disabled rows', async () => {
    const onChange = vi.fn();
    const onSelectInvert = vi.fn();
    const onSelectNone = vi.fn();
    const customSelect = vi.fn();
    render(() => <Table
      rowKey="id"
      dataSource={[{ id: 'a', name: 'Ada' }, { id: 'b', name: 'Blocked' }, { id: 'c', name: 'Charles' }]}
      columns={[{ dataIndex: 'name', title: 'Name' }]}
      pagination={{ defaultPageSize: 2 }}
      rowSelection={{
        defaultSelectedRowKeys: ['b'],
        getCheckboxProps: (record) => ({ disabled: record.id === 'b' }),
        selections: ['SELECT_ALL', 'SELECT_INVERT', 'SELECT_NONE', { key: 'custom', text: 'Custom selectable', onSelect: customSelect }],
        onChange,
        onSelectInvert,
        onSelectNone,
      }}
    />);

    const choose = async (name: string) => {
      fireEvent.click(screen.getByRole('button', { name: 'Selection actions' }));
      fireEvent.click(await screen.findByRole('menuitem', { name }));
    };
    await choose('Select all data');
    expect(onChange).toHaveBeenLastCalledWith(['b', 'a', 'c'], expect.arrayContaining([expect.objectContaining({ id: 'a' }), expect.objectContaining({ id: 'b' }), expect.objectContaining({ id: 'c' })]), { type: 'all' });

    await choose('Select none');
    expect(onSelectNone).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenLastCalledWith(['b'], [expect.objectContaining({ id: 'b' })], { type: 'none' });

    await choose('Invert current page');
    expect(onSelectInvert).toHaveBeenCalledWith(['b', 'a']);
    expect(onChange).toHaveBeenLastCalledWith(['b', 'a'], expect.arrayContaining([expect.objectContaining({ id: 'a' }), expect.objectContaining({ id: 'b' })]), { type: 'invert' });

    await choose('Custom selectable');
    expect(customSelect).toHaveBeenCalledWith(['a']);
  });

  it('scopes Table selection actions to filtered data and the current page', async () => {
    const onChange = vi.fn();
    const customSelect = vi.fn();
    render(() => <Table
      rowKey="id"
      dataSource={[{ id: 'a', name: 'Ada', role: 'owner' }, { id: 'b', name: 'Bob', role: 'viewer' }, { id: 'c', name: 'Charles', role: 'owner' }]}
      columns={[{ dataIndex: 'name', title: 'Name' }, { dataIndex: 'role', title: 'Role', filters: [{ text: 'Owner', value: 'owner' }], defaultFilteredValue: ['owner'], onFilter: (value, record) => record.role === value }]}
      pagination={{ defaultPageSize: 1 }}
      rowSelection={{ selections: ['SELECT_ALL', { key: 'page', text: 'Current page keys', onSelect: customSelect }], onChange }}
    />);
    const choose = async (name: string) => {
      fireEvent.click(screen.getByRole('button', { name: 'Selection actions' }));
      fireEvent.click(await screen.findByRole('menuitem', { name }));
    };
    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    await choose('Current page keys');
    expect(customSelect).toHaveBeenCalledWith(['a']);
    await choose('Select all data');
    expect(onChange).toHaveBeenLastCalledWith(['a', 'c'], expect.arrayContaining([expect.objectContaining({ id: 'a' }), expect.objectContaining({ id: 'c' })]), { type: 'all' });
  });

  it('reports only changed rows from the Table select-all checkbox', async () => {
    const onSelectAll = vi.fn();
    const onChange = vi.fn();
    render(() => <Table
      rowKey="id"
      pagination={false}
      dataSource={[{ id: 'a', name: 'Ada' }, { id: 'b', name: 'Blocked' }, { id: 'c', name: 'Charles' }]}
      columns={[{ dataIndex: 'name', title: 'Name' }]}
      rowSelection={{ defaultSelectedRowKeys: ['a'], getCheckboxProps: (record) => ({ disabled: record.id === 'b' }), onChange, onSelectAll }}
    />);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
    expect(onChange).toHaveBeenLastCalledWith(['a', 'c'], expect.any(Array), { type: 'all' });
    expect(onSelectAll).toHaveBeenLastCalledWith(true, expect.any(Array), [expect.objectContaining({ id: 'c' })]);
    await waitFor(() => expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toBeChecked());
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
    expect(onChange).toHaveBeenLastCalledWith([], [], { type: 'all' });
    expect(onSelectAll).toHaveBeenLastCalledWith(false, [], [expect.objectContaining({ id: 'a' }), expect.objectContaining({ id: 'c' })]);
  });

  it('forwards Table checkbox ARIA, native attributes, and event hooks', async () => {
    const rowClick = vi.fn();
    const rowChange = vi.fn();
    const titleChange = vi.fn();
    const onChange = vi.fn();
    render(() => <Table
      rowKey="id"
      pagination={false}
      dataSource={[{ id: 'a', name: 'Ada' }, { id: 'b', name: 'Grace' }]}
      columns={[{ dataIndex: 'name', title: 'Name' }]}
      rowSelection={{
        getTitleCheckboxProps: () => ({ 'aria-label': 'Toggle available people', onChange: titleChange }),
        getCheckboxProps: (record) => ({ 'aria-label': `Pick ${record.name}`, 'data-testid': `pick-${record.id}`, tabIndex: record.id === 'a' ? 0 : -1, onClick: rowClick, onChange: rowChange }),
        onChange,
      }}
    />);
    const ada = screen.getByRole('checkbox', { name: 'Pick Ada' });
    expect(ada).toHaveAttribute('data-testid', 'pick-a');
    expect(ada).toHaveAttribute('tabindex', '0');
    fireEvent.click(ada);
    expect(rowClick).toHaveBeenCalledWith(expect.any(MouseEvent));
    expect(rowChange).toHaveBeenCalledWith(expect.any(Event));
    expect(onChange).toHaveBeenLastCalledWith(['a'], [expect.objectContaining({ id: 'a' })], { type: 'single' });
    await waitFor(() => expect(ada).toBeChecked());
    fireEvent.click(screen.getByRole('checkbox', { name: 'Toggle available people' }));
    expect(titleChange).toHaveBeenCalledWith(expect.any(Event));
    expect(onChange).toHaveBeenLastCalledWith(['a', 'b'], expect.any(Array), { type: 'all' });
  });

  it('customizes Table selection headers and cells with official rowSelection hooks', async () => {
    const onSelect = vi.fn();
    const { container } = render(() => <Table
      rowKey="id"
      pagination={false}
      dataSource={[{ id: 'a', name: 'Ada' }]}
      columns={[{ dataIndex: 'name', title: 'Name' }]}
      rowSelection={{
        align: 'center',
        columnTitle: (origin) => <div data-testid="selection-title">{origin}<span>People</span></div>,
        getTitleCheckboxProps: () => ({ 'aria-label': 'Toggle everybody' }),
        renderCell: (_checked, record, _index, origin) => <label data-testid="selection-render">{origin}<span>{record.name}</span></label>,
        onCell: () => ({ class: 'selection-hook-cell' }),
        onSelect,
      }}
    />);
    expect(screen.getByTestId('selection-title')).toHaveTextContent('People');
    expect(screen.getByRole('checkbox', { name: 'Toggle everybody' })).toBeInTheDocument();
    expect(container.querySelector('.selection-hook-cell')).toHaveStyle({ textAlign: 'center' });
    expect(screen.getByTestId('selection-render')).toHaveTextContent('Ada');
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select row 1' }));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'a' }), true, [expect.objectContaining({ id: 'a' })], expect.any(Event));
    expect(container.querySelector('th')?.getAttribute('style')).toContain('text-align: center');
  });

  it('hides the Table select-all control while preserving a custom title', () => {
    render(() => <Table pagination={false} dataSource={[{ key: 1, name: 'Ada' }]} columns={[{ dataIndex: 'name', title: 'Name' }]} rowSelection={{ hideSelectAll: true, columnTitle: 'Pick' }} />);
    expect(screen.queryByRole('checkbox', { name: 'Select all rows' })).not.toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Pick' })).toBeInTheDocument();
  });

  it('prunes removed Table selection keys unless preservation is enabled', async () => {
    const [data, setData] = createSignal([{ id: 'a', name: 'Ada' }]);
    render(() => <div>
      <div data-testid="pruned-selection"><Table rowKey="id" pagination={false} dataSource={data()} columns={[{ dataIndex: 'name', title: 'Name' }]} rowSelection={{ defaultSelectedRowKeys: ['a'] }} /></div>
      <div data-testid="preserved-selection"><Table rowKey="id" pagination={false} dataSource={data()} columns={[{ dataIndex: 'name', title: 'Name' }]} rowSelection={{ defaultSelectedRowKeys: ['a'], preserveSelectedRowKeys: true }} /></div>
      <Button onClick={() => setData([])}>Remove selected row</Button>
      <Button onClick={() => setData([{ id: 'a', name: 'Ada' }])}>Restore selected row</Button>
    </div>);
    const pruned = screen.getByTestId('pruned-selection');
    const preserved = screen.getByTestId('preserved-selection');
    expect(within(pruned).getByRole('checkbox', { name: 'Row 1 selected' })).toBeChecked();
    expect(within(preserved).getByRole('checkbox', { name: 'Row 1 selected' })).toBeChecked();
    fireEvent.click(screen.getByRole('button', { name: 'Remove selected row' }));
    await waitFor(() => expect(within(pruned).queryByRole('checkbox', { name: 'Select row 1' })).not.toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Restore selected row' }));
    await waitFor(() => expect(within(pruned).getByRole('checkbox', { name: 'Select row 1' })).not.toBeChecked());
    expect(within(preserved).getByRole('checkbox', { name: 'Row 1 selected' })).toBeChecked();
  });

  it('toggles an uncontrolled checkbox and reports Ant-style change data', async () => {
    const onChange = vi.fn();
    render(() => <Checkbox value="terms" onChange={onChange}>Accept terms</Checkbox>);
    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });

    fireEvent.click(checkbox);
    await waitFor(() => expect(checkbox).toBeChecked());
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ target: { checked: true, value: 'terms' } }));
  });

  it('binds checkbox groups to Form array values', async () => {
    const onFinish = vi.fn();
    render(() => (
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="members" label="Members">
          <Checkbox.Group
            aria-label="Members"
            options={[
              { label: 'Ada', value: 'ada' },
              { label: 'Grace', value: 'grace' },
            ]}
          />
        </Form.Item>
        <Button htmlType="submit">Save members</Button>
      </Form>
    ));

    fireEvent.click(screen.getByRole('checkbox', { name: 'Ada' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Grace' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save members' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ members: ['ada', 'grace'] }));
  });

  it('maps checkbox indeterminate state to the native control', () => {
    render(() => <Checkbox indeterminate>Select some</Checkbox>);
    const checkbox = screen.getByRole('checkbox', { name: 'Select some' }) as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
  });

  it('binds radio button groups to a Form field', async () => {
    const onFinish = vi.fn();
    render(() => (
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="plan" label="Plan">
          <Radio.Group
            aria-label="Plan"
            optionType="button"
            buttonStyle="solid"
            options={[
              { label: 'Starter', value: 'starter' },
              { label: 'Team', value: 'team' },
            ]}
          />
        </Form.Item>
        <Button htmlType="submit">Save plan</Button>
      </Form>
    ));

    fireEvent.click(screen.getByRole('radio', { name: 'Team' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save plan' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ plan: 'team' }));
    expect(screen.getByRole('radio', { name: 'Team' })).toBeChecked();
  });

  it('reports radio changes with the selected value', () => {
    const onChange = vi.fn();
    render(() => <Radio value="daily" onChange={onChange}>Daily</Radio>);
    fireEvent.click(screen.getByRole('radio', { name: 'Daily' }));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ target: { checked: true, value: 'daily' } }));
  });

  it('toggles a switch and reports its next state', async () => {
    const onChange = vi.fn();
    render(() => <Switch aria-label="Notifications" onChange={onChange} checkedChildren="On" unCheckedChildren="Off" />);
    const control = screen.getByRole('switch', { name: 'Notifications' });

    fireEvent.click(control);
    await waitFor(() => expect(control).toHaveAttribute('aria-checked', 'true'));
    expect(onChange).toHaveBeenCalledWith(true, expect.any(MouseEvent));
  });

  it('binds switch boolean values to Form and locks while loading', async () => {
    const onFinish = vi.fn();
    render(() => (
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="enabled" label="Enabled">
          <Switch aria-label="Enabled" />
        </Form.Item>
        <Switch aria-label="Loading switch" loading />
        <Button htmlType="submit">Save switch</Button>
      </Form>
    ));

    fireEvent.click(screen.getByRole('switch', { name: 'Enabled' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save switch' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ enabled: true }));
    expect(screen.getByRole('switch', { name: 'Loading switch' })).toBeDisabled();
    expect(screen.getByRole('switch', { name: 'Loading switch' })).toHaveAttribute('aria-busy', 'true');
  });

  it('shows a themed tooltip on focus and links its trigger description', async () => {
    render(() => (
      <ConfigProvider theme={{ colorPrimary: '#123456' }}>
        <Tooltip title="Create a new item" trigger="focus">
          <Button>Add item</Button>
        </Tooltip>
      </ConfigProvider>
    ));
    const trigger = screen.getByRole('button', { name: 'Add item' });

    fireEvent.focusIn(trigger);
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('Create a new item');
    expect(tooltip).toHaveStyle({ '--ads-color-primary': '#123456' });
    expect(trigger.closest('.ads-tooltip-trigger')).toHaveAttribute('aria-describedby', tooltip.id);

    fireEvent.focusOut(trigger, { relatedTarget: document.body });
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('renders a Tooltip trigger without a layout wrapper', async () => {
    const { container } = render(() => (
      <Tooltip
        title="Direct trigger"
        trigger="click"
        triggerRender={(triggerProps) => <button {...triggerProps} type="button" data-testid="direct-tooltip-trigger">Open direct tooltip</button>}
      />
    ));
    const trigger = screen.getByTestId('direct-tooltip-trigger');
    expect(trigger).toHaveClass('ads-tooltip-trigger');
    expect(container.querySelector('.ads-tooltip-trigger')).toBe(trigger);
    expect(trigger.parentElement).toBe(container);
    fireEvent.click(trigger);
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('Direct trigger');
    expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
  });

  it('toggles a click-triggered tooltip and reports open changes', async () => {
    const onOpenChange = vi.fn();
    render(() => <Tooltip title="Details" trigger="click" onOpenChange={onOpenChange}><Button>Info</Button></Tooltip>);
    const trigger = screen.getByRole('button', { name: 'Info' });

    fireEvent.click(trigger);
    await screen.findByRole('tooltip');
    fireEvent.click(trigger);
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
    expect(onOpenChange).toHaveBeenNthCalledWith(1, true);
    expect(onOpenChange).toHaveBeenNthCalledWith(2, false);
  });

  it('keeps one Tooltip open inside UniqueProvider', async () => {
    const firstChange = vi.fn();
    render(() => <Tooltip.UniqueProvider><Tooltip title="First tip" trigger="click" onOpenChange={firstChange}><Button>First trigger</Button></Tooltip><Tooltip title="Second tip" trigger="click"><Button>Second trigger</Button></Tooltip></Tooltip.UniqueProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'First trigger' }));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('First tip');
    fireEvent.click(screen.getByRole('button', { name: 'Second trigger' }));
    await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('Second tip'));
    expect(screen.getAllByRole('tooltip')).toHaveLength(1);
    expect(firstChange).toHaveBeenLastCalledWith(false);
  });

  it('changes pagination pages and page size', async () => {
    const onChange = vi.fn();
    const onShowSizeChange = vi.fn();
    render(() => <Pagination total={95} showSizeChanger onChange={onChange} onShowSizeChange={onShowSizeChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Page 2' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page'));
    expect(onChange).toHaveBeenCalledWith(2, 10);

    fireEvent.change(screen.getByRole('combobox', { name: 'Rows per page' }), { target: { value: '20' } });
    await waitFor(() => expect(onShowSizeChange).toHaveBeenCalledWith(2, 20));
    expect(onChange).toHaveBeenLastCalledWith(2, 20);
  });

  it('supports pagination quick jumps from the keyboard', async () => {
    const onChange = vi.fn();
    render(() => <Pagination total={200} showQuickJumper onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: 'Quick jump page' });

    fireEvent.input(input, { target: { value: '8' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(8, 10));
    expect(screen.getByRole('button', { name: 'Page 8' })).toHaveAttribute('aria-current', 'page');
  });

  it('keeps popover content interactive and closes on outside press', async () => {
    const action = vi.fn();
    const onOpenChange = vi.fn();
    render(() => (
      <ConfigProvider theme={{ colorPrimary: '#246810' }}>
        <Popover title="Account" content={<Button onClick={action}>Manage account</Button>} onOpenChange={onOpenChange}>
          <Button>Open account</Button>
        </Popover>
      </ConfigProvider>
    ));
    const trigger = screen.getByRole('button', { name: 'Open account' });
    fireEvent.click(trigger);
    const popover = await screen.findByRole('dialog', { name: 'Account' });
    expect(popover).toHaveStyle({ '--ads-color-primary': '#246810' });

    fireEvent.click(screen.getByRole('button', { name: 'Manage account' }));
    expect(action).toHaveBeenCalledOnce();
    expect(popover).toBeInTheDocument();

    fireEvent.pointerDown(document.body);
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Account' })).not.toBeInTheDocument());
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('opens a hover popover and closes it after pointer leave', async () => {
    render(() => (
      <Popover title="Status" content="All systems operational" trigger="hover" mouseEnterDelay={0} mouseLeaveDelay={0}>
        <Button>Status</Button>
      </Popover>
    ));
    const wrapper = screen.getByRole('button', { name: 'Status' }).closest('.ads-popover-trigger')!;
    fireEvent.pointerEnter(wrapper);
    await screen.findByRole('dialog', { name: 'Status' });
    fireEvent.pointerLeave(wrapper);
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Status' })).not.toBeInTheDocument());
  });

  it('clamps line progress values and exposes progressbar semantics', () => {
    render(() => <Progress percent={125} aria-label="Upload progress" />);
    const progress = screen.getByRole('progressbar', { name: 'Upload progress' });
    expect(progress).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByLabelText('Complete')).toBeInTheDocument();
  });

  it('renders circular and stepped progress variants', () => {
    const { container } = render(() => (
      <div>
        <Progress type="circle" percent={42} aria-label="Circle progress" />
        <Progress percent={60} steps={5} showInfo={false} aria-label="Step progress" />
      </div>
    ));
    expect(screen.getByRole('progressbar', { name: 'Circle progress' }).querySelectorAll('circle')).toHaveLength(2);
    expect(screen.getByRole('progressbar', { name: 'Step progress' }).querySelectorAll('.h-2')).toHaveLength(5);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders horizontal and vertical divider semantics', () => {
    render(() => <div><Divider dashed orientation="start">Section</Divider><Divider type="vertical" /></div>);
    const dividers = screen.getAllByRole('separator');
    expect(dividers[0]).toHaveAttribute('aria-orientation', 'horizontal');
    expect(dividers[0].querySelector('.border-dashed')).toBeInTheDocument();
    expect(screen.getByText('Section')).toBeInTheDocument();
    expect(dividers[1]).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('maps Flex layout props to stable CSS styles', () => {
    render(() => <Flex vertical wrap gap={['small', 12]} justify="space-between" align="center" data-testid="flex"><span>A</span><span>B</span></Flex>);
    expect(screen.getByTestId('flex')).toHaveStyle({
      display: 'flex',
      'flex-direction': 'column',
      'flex-wrap': 'wrap',
      'justify-content': 'space-between',
      'align-items': 'center',
      gap: '12px 8px',
    });
  });

  it('renders Space separators and compact groups', () => {
    render(() => (
      <div>
        <Space split="/" size="small"><span>One</span><span>Two</span><span>Three</span></Space>
        <Space.Compact block data-testid="compact"><Space.Addon status="warning">https://</Space.Addon><Input aria-label="Domain" /></Space.Compact>
      </div>
    ));
    expect(screen.getAllByText('/')).toHaveLength(2);
    expect(screen.getByTestId('compact')).toHaveClass('flex', 'w-full');
    expect(screen.getByText('https://')).toHaveClass('ads-space-addon', 'border-warning');
  });

  it('falls back from a failed avatar image and limits avatar groups', async () => {
    render(() => (
      <div>
        <Avatar src="/missing.png" alt="Profile" draggable={false} crossOrigin="anonymous">AD</Avatar>
        <Avatar.Group size={{ xs: 28, md: 44 }} max={{ count: 2, style: { color: 'rgb(255, 0, 0)' }, popover: { trigger: 'click' } }}>
          <Avatar>A</Avatar><Avatar>B</Avatar><Avatar>C</Avatar><Avatar>D</Avatar>
        </Avatar.Group>
      </div>
    ));
    const image = screen.getByRole('img', { name: 'Profile' });
    expect(image).toHaveAttribute('draggable', 'false');
    expect(image).toHaveAttribute('crossorigin', 'anonymous');
    fireEvent.error(image);
    await waitFor(() => expect(screen.getByText('AD')).toBeInTheDocument());
    expect(screen.getByText('+2').closest('.ads-avatar')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    expect(screen.getByText('A').closest('.ads-avatar')).toHaveAttribute('data-responsive', 'true');
    const responsiveAvatar = screen.getByText('A').closest('.ads-avatar') as HTMLElement;
    expect(responsiveAvatar.style.getPropertyValue('--ads-avatar-responsive-xs')).toBe('28px');
    expect(responsiveAvatar.style.getPropertyValue('--ads-avatar-responsive-md')).toBe('44px');
    fireEvent.click(screen.getByText('+2'));
    const overflow = await screen.findByRole('dialog', { name: 'Hidden avatars' });
    expect(within(overflow).getByText('C')).toBeInTheDocument();
    expect(within(overflow).getByText('D')).toBeInTheDocument();
  });

  it('renders Empty presets, descriptions, and actions', () => {
    render(() => <Empty image="simple" description="No members"><Button>Invite member</Button></Empty>);
    expect(screen.getByText('No members')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Invite member' })).toBeInTheDocument();
    expect(screen.getByText('No members').previousElementSibling).toHaveClass('mb-2');
  });

  it('uses Spin.setDefaultIndicator for unconfigured instances', () => {
    Spin.setDefaultIndicator(<span data-testid="global-spinner">Global</span>);
    render(() => <Spin />);
    expect(screen.getByTestId('global-spinner')).toBeInTheDocument();
    Spin.setDefaultIndicator(undefined);
  });

  it('delays Spin visibility and exposes loading status', async () => {
    render(() => <Spin delay={20} tip="Loading records" />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(await screen.findByRole('status', { name: 'Loading records' })).toBeInTheDocument();
  });

  it('overlays nested Spin content and reports busy state', () => {
    const { container } = render(() => <Spin spinning percent={42}><div>Report content</div></Spin>);
    expect(screen.getByText('Report content')).toBeInTheDocument();
    expect(container.querySelector('.ads-spin-wrapper')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders Skeleton rows and reveals loaded children', () => {
    const { container } = render(() => (
      <div>
        <Skeleton active avatar paragraph={{ rows: 2 }} />
        <Skeleton loading={false}><span>Loaded content</span></Skeleton>
      </div>
    ));
    expect(container.querySelectorAll('.ads-skeleton .h-3')).toHaveLength(2);
    expect(container.querySelector('.ads-skeleton-avatar')).toBeInTheDocument();
    expect(screen.getByText('Loaded content')).toBeInTheDocument();
  });

  it('renders Skeleton element subcomponents with stable dimensions', () => {
    const { container } = render(() => <div><Skeleton.Button size="small" /><Skeleton.Image size="large" /><Skeleton.Node>Node</Skeleton.Node></div>);
    expect(container.querySelector('.ads-skeleton-element')).toHaveStyle({ width: '64px', height: '24px' });
    expect(container.querySelector('.ads-skeleton-image')).toHaveStyle({ width: '96px', height: '96px' });
    expect(screen.getByText('Node')).toBeInTheDocument();
  });

  it('formats Statistic values and affixes', () => {
    render(() => <Statistic title="Revenue" value={12345.6} precision={2} prefix="$" suffix="USD" />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('12,345.60')).toBeInTheDocument();
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
  });

  it('updates Statistic.Timer in countup mode', async () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));
      const onChange = vi.fn();
      render(() => <Statistic.Timer title="Elapsed" type="countup" value={Date.now()} format="HH:mm:ss" onChange={onChange} />);
      expect(screen.getByText('00:00:00')).toBeInTheDocument();
      await vi.advanceTimersByTimeAsync(2000);
      expect(onChange).toHaveBeenLastCalledWith(2000);
      await vi.advanceTimersByTimeAsync(0);
      expect(screen.getByText('00:00:02')).toBeInTheDocument();
    } finally { vi.useRealTimers(); }
  });

  it('updates Statistic Countdown and calls onFinish', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    const onFinish = vi.fn();
    try {
      render(() => <Statistic.Countdown title="Launch" value={Date.now() + 2000} format="HH:mm:ss" onFinish={onFinish} />);
      expect(screen.getByText('00:00:02')).toBeInTheDocument();
      await vi.advanceTimersByTimeAsync(2000);
      expect(screen.getByText('00:00:00')).toBeInTheDocument();
      expect(onFinish).toHaveBeenCalledOnce();
    } finally {
      vi.useRealTimers();
    }
  });

  it('renders Result status, actions, and detail content', () => {
    render(() => <Result status="404" title="Page missing" subTitle="Check the address" extra={<Button>Go home</Button>}><div>Request ID: 42</div></Result>);
    expect(screen.getByRole('img', { name: 'Not found' })).toHaveTextContent('404');
    expect(screen.getByText('Page missing')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go home' })).toBeInTheDocument();
    expect(screen.getByText('Request ID: 42')).toBeInTheDocument();
  });

  it('registers and collapses Layout Sider', async () => {
    const onCollapse = vi.fn();
    const { container } = render(() => (
      <Layout>
        <Layout.Sider collapsible width={240} collapsedWidth={72} classNames={() => ({ root: 'sider-root', body: 'sider-body' })} styles={() => ({ body: { color: 'rgb(1, 2, 3)' } })} onCollapse={onCollapse}>Navigation</Layout.Sider>
        <Layout.Content>Content</Layout.Content>
      </Layout>
    ));
    await waitFor(() => expect(container.querySelector('.ads-layout')).toHaveClass('flex-row'));
    const sider = container.querySelector('.ads-layout-sider')!;
    expect(sider).toHaveStyle({ width: '240px' });
    expect(sider).toHaveClass('sider-root');
    expect(container.querySelector('.ads-layout-sider-body')).toHaveClass('sider-body');
    expect(container.querySelector('.ads-layout-sider-body')).toHaveStyle({ color: 'rgb(1, 2, 3)' });

    fireEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
    await waitFor(() => expect(sider).toHaveStyle({ width: '72px' }));
    expect(onCollapse).toHaveBeenCalledWith(true, 'clickTrigger');
  });

  it('only reports responsive Layout collapse when the breakpoint state changes', async () => {
    const onBreakpoint = vi.fn();
    const onCollapse = vi.fn();
    let matches = false;
    let listener: ((event: { matches: boolean }) => void) | undefined;
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: () => ({
        get matches() { return matches; },
        addEventListener: (_type: string, next: (event: { matches: boolean }) => void) => { listener = next; },
        removeEventListener: () => undefined,
      }),
    });
    render(() => <Layout><Layout.Sider breakpoint="md" onBreakpoint={onBreakpoint} onCollapse={onCollapse}>Navigation</Layout.Sider></Layout>);
    expect(onBreakpoint).toHaveBeenCalledWith(false);
    expect(onCollapse).not.toHaveBeenCalled();

    matches = true;
    listener?.({ matches });
    await waitFor(() => expect(onCollapse).toHaveBeenCalledWith(true, 'responsive'));
    listener?.({ matches });
    expect(onCollapse).toHaveBeenCalledTimes(1);
  });

  it('renders Typography heading and editable text semantics', async () => {
    const onChange = vi.fn();
    render(() => <div><Typography.Title level={3}>Section title</Typography.Title><Typography.Text editable={{ onChange }}>Original</Typography.Text></div>);
    expect(screen.getByRole('heading', { level: 3, name: 'Section title' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Edit text' }));
    const input = await screen.findByDisplayValue('Original');
    fireEvent.input(input, { target: { value: 'Updated' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith('Updated');
  });

  it('expands ellipsized Typography and reports expansion', async () => {
    const onExpand = vi.fn();
    render(() => <Typography.Paragraph ellipsis={{ rows: 2, expandable: 'collapsible', onExpand }}>Long paragraph content</Typography.Paragraph>);
    const paragraph = screen.getByText('Long paragraph content');
    expect(paragraph).toHaveStyle({ '-webkit-line-clamp': '2' });
    fireEvent.click(screen.getByRole('button', { name: 'Expand' }));
    await waitFor(() => expect(paragraph).not.toHaveStyle({ '-webkit-line-clamp': '2' }));
    expect(onExpand).toHaveBeenCalledWith(expect.any(MouseEvent), { expanded: true });
  });

  it('copies Typography text through the clipboard API', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    render(() => <Typography.Text copyable>Copy value</Typography.Text>);
    fireEvent.click(screen.getByRole('button', { name: 'Copy text' }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith('Copy value'));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument());
  });

  it('renders Breadcrumb links, params, separators, and current page', () => {
    render(() => (
      <Breadcrumb
        params={{ id: '42' }}
        separator=">"
        items={[
          { title: 'Home', href: '/' },
          { title: 'Project', href: '/projects/:id' },
          { title: 'Settings' },
        ]}
      />
    ));
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Project' })).toHaveAttribute('href', '/projects/42');
    expect(screen.getByText('Settings').parentElement).toHaveAttribute('aria-current', 'page');
    expect(screen.getAllByText('>')).toHaveLength(2);
  });

  it('supports declarative Breadcrumb Item and Separator nodes', () => {
    render(() => <Breadcrumb><Breadcrumb.Item href="/home">Home</Breadcrumb.Item><Breadcrumb.Separator>:</Breadcrumb.Separator><Breadcrumb.Item>Current</Breadcrumb.Item></Breadcrumb>);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/home');
    expect(screen.getByText(':')).toHaveClass('ads-breadcrumb-separator');
  });

  it('reports Steps navigation and ignores disabled items', () => {
    const onChange = vi.fn();
    render(() => (
      <Steps
        current={1}
        onChange={onChange}
        items={[
          { title: 'Account' },
          { title: 'Profile' },
          { title: 'Review', disabled: true },
        ]}
      />
    ));
    const items = screen.getAllByRole('listitem');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(screen.getByLabelText('Finished')).toBeInTheDocument();
    fireEvent.keyDown(items[0], { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith(0);
    fireEvent.click(items[2]);
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('renders reversed Timeline items and pending state', () => {
    render(() => <Timeline reverse pending="Syncing" items={[{ children: 'Created', color: 'green' }, { children: 'Published', color: 'blue' }]} />);
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Published');
    expect(items[1]).toHaveTextContent('Created');
    expect(items[2]).toHaveTextContent('Syncing');
    expect(items[1].querySelector('[style*="--ads-color-success"]')).toBeInTheDocument();
  });

  it('lays out bordered Descriptions with item spans', () => {
    const { container } = render(() => (
      <Descriptions
        title="User info"
        bordered
        column={2}
        items={[
          { label: 'Name', children: 'Ada' },
          { label: 'Role', children: 'Owner' },
          { label: 'Address', children: 'London', span: 2 },
        ]}
      />
    ));
    expect(screen.getByText('User info')).toBeInTheDocument();
    expect(screen.getByText((_, element) => element?.textContent === 'Name:')).toBeInTheDocument();
    expect(screen.getByText((_, element) => element?.textContent === 'Address:').parentElement).toHaveStyle({ 'grid-column': 'span 2 / span 2' });
    expect(container.querySelector('.ads-descriptions')).toBeInTheDocument();
  });

  it('steps and clamps InputNumber values', async () => {
    const onChange = vi.fn();
    render(() => <InputNumber aria-label="Quantity" defaultValue={2} min={1} max={3} onChange={onChange} />);
    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    fireEvent.click(screen.getByRole('button', { name: 'Increase value' }));
    await waitFor(() => expect(input).toHaveValue('3'));
    expect(onChange).toHaveBeenCalledWith(3);
    expect(screen.getByRole('button', { name: 'Increase value' })).toBeDisabled();
  });

  it('binds string-mode InputNumber values to Form', async () => {
    const onFinish = vi.fn();
    render(() => (
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="amount" label="Amount"><InputNumber stringMode precision={2} aria-label="Amount" /></Form.Item>
        <Button htmlType="submit">Save amount</Button>
      </Form>
    ));
    fireEvent.input(screen.getByRole('spinbutton', { name: 'Amount' }), { target: { value: '4.25' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save amount' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ amount: '4.25' }));
  });

  it('navigates Segmented options and submits through Form', async () => {
    const onFinish = vi.fn();
    render(() => (
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="view" label="View">
          <Segmented options={[{ label: 'List', value: 'list' }, { label: 'Locked', value: 'locked', disabled: true }, { label: 'Grid', value: 'grid' }]} />
        </Form.Item>
        <Button htmlType="submit">Save view</Button>
      </Form>
    ));
    const list = screen.getByRole('radio', { name: 'List' });
    fireEvent.keyDown(list, { key: 'ArrowRight' });
    await waitFor(() => expect(screen.getByRole('radio', { name: 'Grid' })).toHaveAttribute('aria-checked', 'true'));
    fireEvent.click(screen.getByRole('button', { name: 'Save view' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ view: 'grid' }));
  });

  it('changes Rate values with keyboard and Form submission', async () => {
    const onFinish = vi.fn();
    render(() => (
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="rating" label="Rating"><Rate aria-label="Rating" allowHalf defaultValue={2} /></Form.Item>
        <Button htmlType="submit">Save rating</Button>
      </Form>
    ));
    const rate = screen.getByRole('radiogroup', { name: 'Rating' });
    fireEvent.keyDown(screen.getByRole('radio', { name: '2 stars' }), { key: 'ArrowRight' });
    await waitFor(() => expect(screen.getByRole('radio', { name: '3 stars' })).toHaveAttribute('aria-checked', 'true'));
    expect(rate).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Save rating' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ rating: 2.5 }));
  });

  it('clears Rate when the selected value is clicked again', async () => {
    const onChange = vi.fn();
    render(() => <Rate defaultValue={3} onChange={onChange} />);
    fireEvent.click(screen.getByRole('radio', { name: '3 stars' }));
    await waitFor(() => expect(screen.getByRole('radio', { name: '1 stars' })).toHaveAttribute('tabindex', '0'));
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('binds range Slider values to Form', async () => {
    const onFinish = vi.fn();
    render(() => (
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="range" label="Range"><Slider range defaultValue={[20, 80]} /></Form.Item>
        <Button htmlType="submit">Save range</Button>
      </Form>
    ));
    const sliders = screen.getAllByRole('slider');
    fireEvent.input(sliders[0], { target: { value: '30' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save range' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ range: [30, 80] }));
  });

  it('selects Slider marks', async () => {
    const onChange = vi.fn();
    render(() => <Slider defaultValue={0} marks={{ 0: 'Start', 50: 'Half', 100: 'End' }} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Half' }));
    await waitFor(() => expect(screen.getByRole('slider')).toHaveValue('50'));
    expect(onChange).toHaveBeenCalledWith(50);
  });

  it('tracks media changes through Grid.useBreakpoint', async () => {
    const listeners = new Map<string, () => void>();
    const states = new Map<string, boolean>([['(min-width: 768px)', false]]);
    Object.defineProperty(window, 'matchMedia', { configurable: true, value: (query: string) => ({ media: query, get matches() { return states.get(query) ?? false; }, addEventListener: (_: string, listener: () => void) => listeners.set(query, listener), removeEventListener: () => undefined }) });
    function Breakpoints() { const screens = Grid.useBreakpoint(); return <output>{screens().md ? 'desktop' : 'mobile'}</output>; }
    render(() => <Breakpoints />);
    expect(screen.getByText('mobile')).toBeInTheDocument();
    states.set('(min-width: 768px)', true);
    listeners.get('(min-width: 768px)')?.();
    await waitFor(() => expect(screen.getByText('desktop')).toBeInTheDocument());
  });

  it('maps Grid gutters and responsive columns to CSS variables', () => {
    render(() => (
      <Grid.Row gutter={[16, 24]} data-testid="row">
        <Grid.Col span={12} offset={1} md={{ span: 6, offset: 2 }} data-testid="col">Column</Grid.Col>
      </Grid.Row>
    ));
    expect(screen.getByTestId('row')).toHaveStyle({ '--ads-row-gutter-x': '16px', '--ads-row-gutter-y': '24px' });
    expect(screen.getByTestId('col')).toHaveStyle({
      '--ads-col-span': '12',
      '--ads-col-offset': '1',
      '--ads-col-span-md': '6',
      '--ads-col-offset-md': '2',
    });
  });

  it('handles Collapse accordion, disabled, and preserved panels', async () => {
    const onChange = vi.fn();
    render(() => (
      <Collapse
        accordion
        defaultActiveKey="a"
        onChange={onChange}
        items={[
          { key: 'a', label: 'Panel A', children: <input aria-label="Preserved input" /> },
          { key: 'b', label: 'Panel B', children: 'Content B' },
          { key: 'c', label: 'Panel C', children: 'Content C', collapsible: 'disabled' },
        ]}
      />
    ));
    const preserved = screen.getByRole('textbox', { name: 'Preserved input' });
    fireEvent.input(preserved, { target: { value: 'kept' } });
    fireEvent.click(screen.getByRole('button', { name: 'Panel B' }));
    await waitFor(() => expect(screen.getByText('Content B')).toBeVisible());
    expect(preserved).toBeInTheDocument();
    expect(preserved).not.toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Panel C' }));
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('renders paginated List data and List.Item.Meta', async () => {
    const data = Array.from({ length: 12 }, (_, index) => ({ id: index + 1, name: `Member ${index + 1}` }));
    render(() => (
      <List
        bordered
        dataSource={data}
        pagination={{ defaultPageSize: 5 }}
        renderItem={(item) => <List.Item actions={[<Button type="link">Open</Button>]}><List.Item.Meta avatar={<Avatar>{item.id}</Avatar>} title={item.name} description={`ID ${item.id}`} /></List.Item>}
      />
    ));
    expect(screen.getByText('Member 1')).toBeInTheDocument();
    expect(screen.queryByText('Member 6')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    await waitFor(() => expect(screen.getByText('Member 6')).toBeInTheDocument());
    expect(document.querySelectorAll('.ads-list-item')).toHaveLength(5);
  });

  it('renders declarative List children and root compatibility props', () => {
    const { container } = render(() => <List rootClassName="list-root" extra="Summary"><List.Item>Declarative member</List.Item></List>);
    expect(container.querySelector('.ads-list')).toHaveClass('list-root');
    expect(screen.getByRole('listitem')).toHaveTextContent('Declarative member');
    expect(screen.getByText('Summary')).toHaveClass('ads-list-extra');
  });

  it('registers declarative Menu subcomponents', async () => {
    const onSelect = vi.fn();
    render(() => <Menu onSelect={onSelect}><Menu.Item itemKey="home">Home</Menu.Item><Menu.SubMenu itemKey="settings" title="Settings"><Menu.Item itemKey="profile">Profile</Menu.Item><Menu.Divider /><Menu.ItemGroup title="Security"><Menu.Item itemKey="access">Access</Menu.Item></Menu.ItemGroup></Menu.SubMenu></Menu>);
    fireEvent.click(await screen.findByRole('menuitem', { name: /Settings/ }));
    const profile = await screen.findByRole('menuitem', { name: 'Profile' });
    fireEvent.click(profile);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ key: 'profile', keyPath: ['settings', 'profile'] }));
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('selects nested Menu items and supports keyboard navigation', async () => {
    const onSelect = vi.fn();
    render(() => (
      <Menu
        onSelect={onSelect}
        items={[
          { key: 'home', label: 'Home' },
          { key: 'admin', label: 'Admin', children: [{ key: 'users', label: 'Users' }] },
          { key: 'locked', label: 'Locked', disabled: true },
        ]}
      />
    ));
    const home = screen.getByRole('menuitem', { name: 'Home' });
    home.focus();
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' });
    expect(screen.getByRole('menuitem', { name: 'Admin' })).toHaveFocus();

    fireEvent.click(screen.getByRole('menuitem', { name: 'Admin' }));
    const users = await screen.findByRole('menuitem', { name: 'Users' });
    fireEvent.click(users);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ key: 'users', keyPath: ['admin', 'users'], selectedKeys: ['users'] }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Locked' }));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('supports Menu semantic slots, popup rendering, icons, tooltips, and delayed hover', async () => {
    vi.useFakeTimers();
    const onOpenChange = vi.fn();
    render(() => (
      <Menu
        inlineCollapsed
        forceSubMenuRender
        subMenuOpenDelay={0.05}
        subMenuCloseDelay={0.05}
        expandIcon={({ open }) => open ? 'v' : '+'}
        tooltip={{ title: 'Collapsed navigation' }}
        classNames={{ root: 'menu-root', item: 'menu-item', itemContent: 'menu-content', 'subMenu.list': 'submenu-list', popup: 'menu-popup' }}
        styles={{ item: { color: 'rgb(1, 2, 3)' } }}
        popupRender={(node, info) => <section data-popup-key={String(info.item.key)}>{node}<span>Popup extra</span></section>}
        onOpenChange={onOpenChange}
        items={[{ key: 'tools', label: 'Tools', children: [{ key: 'build', label: 'Build' }] }]}
      />
    ));
    const tools = screen.getByRole('menuitem', { name: 'Collapsed navigation' });
    expect(tools).toHaveAttribute('title', 'Collapsed navigation');
    expect(tools).toHaveClass('menu-item');
    expect(tools).toHaveStyle({ color: 'rgb(1, 2, 3)' });
    expect(document.querySelector('.submenu-list')).toHaveClass('hidden');
    expect(screen.getByText('Popup extra')).toBeInTheDocument();

    fireEvent.pointerEnter(tools);
    await vi.advanceTimersByTimeAsync(50);
    expect(onOpenChange).toHaveBeenCalledWith(['tools']);
    expect(document.querySelector('.submenu-list')).not.toHaveClass('hidden');
    vi.useRealTimers();
  });

  it('collapses overflowing horizontal Menu items into the overflow submenu', async () => {
    let resize!: () => void;
    const OriginalResizeObserver = globalThis.ResizeObserver;
    globalThis.ResizeObserver = class {
      constructor(callback: ResizeObserverCallback) { resize = () => callback([], this as unknown as ResizeObserver); }
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
    const view = render(() => <Menu mode="horizontal" overflowedIndicator="More" items={[{ key: 'one', label: 'One' }, { key: 'two', label: 'Two' }, { key: 'three', label: 'Three' }]} />);
    const menu = screen.getByRole('menu');
    Object.defineProperty(menu, 'clientWidth', { configurable: true, value: 130 });
    menu.querySelectorAll<HTMLElement>('[data-menu-top]').forEach((node) => { node.getBoundingClientRect = () => ({ width: 60, height: 40, top: 0, left: 0, right: 60, bottom: 40, x: 0, y: 0, toJSON() {} }); });
    resize();
    await waitFor(() => expect(screen.getByRole('menuitem', { name: /More/ })).toBeInTheDocument());
    expect(screen.queryByRole('menuitem', { name: 'Two' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('menuitem', { name: /More/ }));
    expect(await screen.findByRole('menuitem', { name: 'Two' })).toBeInTheDocument();
    view.unmount();
    globalThis.ResizeObserver = OriginalResizeObserver;
  });

  it('opens Dropdown menus and closes from a menu selection', async () => {
    const onOpenChange = vi.fn();
    const onClick = vi.fn();
    render(() => (
      <Dropdown trigger={['click']} menu={{ items: [{ key: 'edit', label: 'Edit' }], onClick }} onOpenChange={onOpenChange}>
        <Button>Actions</Button>
      </Dropdown>
    ));
    const trigger = screen.getByRole('button', { name: 'Actions' });
    fireEvent.click(trigger);
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Edit' }));
    await waitFor(() => expect(screen.queryByRole('menuitem', { name: 'Edit' })).not.toBeInTheDocument());
    expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ key: 'edit' }));
    expect(onOpenChange).toHaveBeenNthCalledWith(1, true, { source: 'trigger' });
    expect(onOpenChange).toHaveBeenNthCalledWith(2, false, { source: 'menu' });
  });

  it('renders Dropdown.Button primary and menu triggers', async () => {
    render(() => <Dropdown.Button menu={{ items: [{ key: 'archive', label: 'Archive' }] }}>Save</Dropdown.Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(await screen.findByRole('menuitem', { name: 'Archive' })).toBeInTheDocument();
  });

  it('waits for asynchronous Popconfirm confirmation before closing', async () => {
    let resolveConfirm!: () => void;
    const onConfirm = vi.fn(() => new Promise<void>((resolve) => { resolveConfirm = resolve; }));
    render(() => <Popconfirm title="Delete record?" description="This cannot be undone" onConfirm={onConfirm}><Button>Delete</Button></Popconfirm>);
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    await screen.findByRole('dialog', { name: /Delete record/ });
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'OK' })).toBeDisabled());
    resolveConfirm();
    await waitFor(() => expect(screen.queryByRole('dialog', { name: /Delete record/ })).not.toBeInTheDocument());
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('cancels Popconfirm without confirming', async () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    render(() => <Popconfirm title="Archive?" onCancel={onCancel} onConfirm={onConfirm}><Button>Archive</Button></Popconfirm>);
    fireEvent.click(screen.getByRole('button', { name: 'Archive' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('dialog', { name: /Archive/ })).not.toBeInTheDocument());
    expect(onCancel).toHaveBeenCalledOnce();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('affixes content after crossing the configured offset', async () => {
    const onChange = vi.fn();
    const { container } = render(() => <Affix offsetTop={10} onChange={onChange}><Button>Sticky action</Button></Affix>);
    const placeholder = container.querySelector('.ads-affix-placeholder') as HTMLDivElement;
    const content = container.querySelector('.ads-affix') as HTMLDivElement;
    placeholder.getBoundingClientRect = () => ({ x: 20, y: -5, top: -5, left: 20, right: 120, bottom: 35, width: 100, height: 40, toJSON: () => ({}) });
    content.getBoundingClientRect = () => ({ x: 20, y: -5, top: -5, left: 20, right: 120, bottom: 35, width: 100, height: 40, toJSON: () => ({}) });
    fireEvent.scroll(window);
    await waitFor(() => expect(placeholder).toHaveAttribute('data-affixed', 'true'));
    expect(content).toHaveStyle({ position: 'fixed', top: '10px', left: '20px', width: '100px' });
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('activates Anchor links and updates browser history', async () => {
    const scrollTo = vi.fn();
    Object.defineProperty(window, 'scrollTo', { configurable: true, value: scrollTo });
    const onChange = vi.fn();
    render(() => (
      <div>
        <Anchor affix={false} onChange={onChange} items={[{ href: '#intro', title: 'Introduction' }, { href: '#api', title: 'API' }]} />
        <section id="intro">Intro section</section><section id="api">API section</section>
      </div>
    ));
    fireEvent.click(screen.getByRole('link', { name: 'API' }));
    await waitFor(() => expect(screen.getByRole('link', { name: 'API' })).toHaveAttribute('aria-current', 'location'));
    expect(window.location.hash).toBe('#api');
    expect(onChange).toHaveBeenCalledWith('#api');
    expect(scrollTo).toHaveBeenCalled();
  });

  it('uses shared navigation behavior for declarative Anchor.Link', async () => {
    Object.defineProperty(window, 'scrollTo', { configurable: true, value: vi.fn() });
    const onChange = vi.fn();
    render(() => <div><Anchor affix={false} onChange={onChange}><Anchor.Link href="#declarative" title="Declarative"><Anchor.Link href="#nested" title="Nested" /></Anchor.Link></Anchor><section id="declarative">Target</section><section id="nested">Nested target</section></div>);
    fireEvent.click(screen.getByRole('link', { name: 'Nested' }));
    await waitFor(() => expect(screen.getByRole('link', { name: 'Nested' })).toHaveAttribute('aria-current', 'location'));
    expect(onChange).toHaveBeenCalledWith('#nested');
  });

  it('generates an actual SVG QR code', async () => {
    render(() => <QRCode type="svg" value="https://example.com" />);
    const image = await screen.findByRole('img', { name: 'QR code' });
    await waitFor(() => expect(image.querySelector('svg')).toBeInTheDocument());
    expect(image.querySelectorAll('path').length).toBeGreaterThan(0);
  });

  it('renders QRCode expired state and refresh action', () => {
    const onRefresh = vi.fn();
    render(() => <QRCode type="svg" value="expired" status="expired" onRefresh={onRefresh} />);
    expect(screen.getByText('QR code expired')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));
    expect(onRefresh).toHaveBeenCalledOnce();
  });

  it('encodes and restores the Watermark layer after removal', async () => {
    const onRemove = vi.fn();
    const { container } = render(() => <Watermark onRemove={onRemove} content={['Confidential', { text: 'Internal', font: { color: '#ff0000', fontSize: 12 } }]} width={140} height={70} gap={[40, 30]} offset={[5, 10]}><div>Document</div></Watermark>);
    expect(screen.getByText('Document')).toBeInTheDocument();
    const layer = container.querySelector('.ads-watermark-layer') as HTMLElement;
    expect(layer.style.backgroundImage).toContain('data:image/svg+xml');
    expect(decodeURIComponent(layer.style.backgroundImage)).toContain('Internal');
    expect(decodeURIComponent(layer.style.backgroundImage)).toContain('#ff0000');
    expect(layer).toHaveStyle({ 'background-size': '180px 100px', 'background-position': '5px 10px' });
    expect(layer).toHaveAttribute('aria-hidden', 'true');
    await Promise.resolve();
    layer.remove();
    await waitFor(() => expect(onRemove).toHaveBeenCalledOnce());
    expect(container.querySelector('.ads-watermark-layer')).toBe(layer);
  });

  it('opens and manually closes thenable messages', async () => {
    const close = message.success('Saved successfully', 0);
    expect(await screen.findByRole('status')).toHaveTextContent('Saved successfully');
    close();
    await close.promise;
    await waitFor(() => expect(screen.queryByText('Saved successfully')).not.toBeInTheDocument());
  });

  it('updates messages by key and destroys the queue', async () => {
    message.open({ key: 'sync', content: 'Starting', duration: 0, type: 'loading' });
    await screen.findByText('Starting');
    message.open({ key: 'sync', content: 'Completed', duration: 0, type: 'success' });
    await waitFor(() => expect(screen.queryByText('Starting')).not.toBeInTheDocument());
    expect(screen.getByText('Completed')).toBeInTheDocument();
    message.destroy();
    await waitFor(() => expect(screen.queryByText('Completed')).not.toBeInTheDocument());
  });

  it('opens notification cards with actions and closes them', async () => {
    const onClose = vi.fn();
    notification.success({ key: 'deploy', message: 'Deployment complete', description: 'Version 2 is live', duration: 0, placement: 'bottomLeft', actions: <Button>View</Button>, onClose });
    const notice = await screen.findByRole('status');
    expect(notice).toHaveTextContent('Deployment complete');
    expect(screen.getByRole('button', { name: 'View' })).toBeInTheDocument();
    expect(notice.parentElement).toHaveStyle({ bottom: '24px' });
    fireEvent.click(screen.getByRole('button', { name: 'Close notification' }));
    await waitFor(() => expect(screen.queryByText('Deployment complete')).not.toBeInTheDocument());
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('updates and destroys notifications by key', async () => {
    notification.open({ key: 'job', message: 'Running', duration: 0 });
    await screen.findByText('Running');
    notification.open({ key: 'job', message: 'Finished', duration: 0, type: 'success' });
    await waitFor(() => expect(screen.queryByText('Running')).not.toBeInTheDocument());
    expect(screen.getByText('Finished')).toBeInTheDocument();
    notification.destroy('job');
    await waitFor(() => expect(screen.queryByText('Finished')).not.toBeInTheDocument());
  });

  it('submits free AutoComplete input through Form', async () => {
    const onFinish = vi.fn();
    render(() => (
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="framework" label="Framework"><AutoComplete aria-label="Framework" dataSource={['Solid', 'React', 'Vue']} /></Form.Item>
        <Button htmlType="submit">Save framework</Button>
      </Form>
    ));
    fireEvent.input(screen.getByRole('combobox', { name: 'Framework' }), { target: { value: 'Solid 2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save framework' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ framework: 'Solid 2' }));
  });

  it('registers declarative AutoComplete.Option candidates', async () => {
    const onSelect = vi.fn();
    render(() => <AutoComplete aria-label="Declarative language" onSelect={onSelect}><AutoComplete.Option value="ts">TypeScript</AutoComplete.Option><AutoComplete.Option value="js">JavaScript</AutoComplete.Option></AutoComplete>);
    const input = screen.getByRole('combobox', { name: 'Declarative language' });
    fireEvent.click(input);
    fireEvent.click(await screen.findByRole('option', { name: 'TypeScript' }));
    expect(onSelect).toHaveBeenCalledWith('ts', expect.objectContaining({ value: 'ts' }));
  });

  it('selects AutoComplete candidates', async () => {
    const onSelect = vi.fn();
    render(() => <AutoComplete aria-label="Language" options={[{ value: 'ts', label: 'TypeScript' }, { value: 'js', label: 'JavaScript' }]} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('combobox', { name: 'Language' }));
    fireEvent.click(await screen.findByRole('option', { name: 'TypeScript' }));
    expect(onSelect).toHaveBeenCalledWith('ts', expect.objectContaining({ label: 'TypeScript' }));
  });

  it('falls back and clears Image placeholders after loading', async () => {
    render(() => <Image src="/broken.png" fallback="/fallback.png" alt="Profile photo" placeholder />);
    const image = screen.getByRole('img', { name: 'Profile photo' });
    expect(document.querySelector('.ads-spin')).toBeInTheDocument();
    fireEvent.error(image);
    await waitFor(() => expect(image).toHaveAttribute('src', '/fallback.png'));
    fireEvent.load(image);
    await waitFor(() => expect(document.querySelector('.ads-image .ads-spin')).not.toBeInTheDocument());
  });

  it('previews and navigates grouped Images', async () => {
    render(() => (
      <Image.PreviewGroup>
        <Image src="/one.png" alt="One" />
        <Image src="/two.png" alt="Two" />
      </Image.PreviewGroup>
    ));
    fireEvent.click(screen.getByRole('img', { name: 'One' }));
    const dialog = await screen.findByRole('dialog', { name: 'Image preview' });
    expect(dialog.querySelector('img')).toHaveAttribute('src', '/one.png');
    fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
    await waitFor(() => expect(screen.getByText('150%')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Next image' }));
    await waitFor(() => expect(dialog.querySelector('img')).toHaveAttribute('src', '/two.png'));
    fireEvent.click(screen.getByRole('button', { name: 'Close preview' }));
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Image preview' })).not.toBeInTheDocument());
  });

  it('forwards FloatButton attributes, class, style, slots, and ref to stable nodes', () => {
    let floatRef: FloatButtonRef | undefined;
    const { container } = render(() => (
      <FloatButton
        ref={(value) => { floatRef = value; }}
        aria-label="Forwarded float"
        data-action="create"
        class="shared-tool-button"
        style={{ opacity: 0.75 }}
        classNames={{ root: 'float-root', trigger: 'float-trigger' }}
        styles={{ root: { display: 'inline-flex' }, trigger: { color: 'rgb(1, 2, 3)' } }}
      />
    ));
    const button = screen.getByRole('button', { name: 'Forwarded float' });
    expect(button).toHaveClass('ads-float-button', 'shared-tool-button', 'float-trigger');
    expect(button).toHaveAttribute('data-action', 'create');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveStyle({ opacity: '0.75', color: 'rgb(1, 2, 3)' });
    expect(container.querySelector('.float-root')).toContainElement(button);
    expect(floatRef?.nativeElement).toBe(button);
  });

  it('opens and closes FloatButton groups', async () => {
    render(() => <FloatButton.Group trigger="click"><FloatButton aria-label="Create item" icon="+" /></FloatButton.Group>);
    expect(screen.queryByRole('button', { name: 'Create item' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Open floating menu' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Create item' })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Close floating menu' }));
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Create item' })).not.toBeInTheDocument());
  });

  it('shows BackTop after target scrolling and scrolls to zero', async () => {
    let target!: HTMLDivElement;
    const scrollTo = vi.fn();
    render(() => <div ref={target}><FloatButton.BackTop target={() => target} visibilityHeight={100} duration={0} /></div>);
    Object.defineProperty(target, 'scrollTop', { configurable: true, value: 150, writable: true });
    Object.defineProperty(target, 'scrollTo', { configurable: true, value: scrollTo });
    fireEvent.scroll(target);
    const button = await screen.findByRole('button', { name: 'Back to top' });
    fireEvent.click(button);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
  });

  it('configures animated BorderBeam variables', () => {
    render(() => <BorderBeam color={[{ color: '#f00', percent: 20 }, { color: '#00f', percent: 70 }]} duration={4} lineWidth={2} outset={3} data-testid="beam">Content</BorderBeam>);
    expect(screen.getByTestId('beam')).toHaveStyle({
      '--ads-border-beam-duration': '4s',
      '--ads-border-beam-width': '2px',
      '--ads-border-beam-outset': '3px',
    });
    expect(screen.getByTestId('beam').style.getPropertyValue('--ads-border-beam-color')).toContain('#f00 20%');
  });

  it('assigns Masonry items to shortest columns', async () => {
    const onLayoutChange = vi.fn();
    const { container } = render(() => (
      <Masonry
        columns={2}
        gutter={[16, 10]}
        onLayoutChange={onLayoutChange}
        items={[
          { key: 'a', data: 'A', height: 100, children: 'A' },
          { key: 'b', data: 'B', height: 50, children: 'B' },
          { key: 'c', data: 'C', height: 30, children: 'C' },
        ]}
      />
    ));
    expect(container.querySelector('[data-column="0"]')).toHaveTextContent('A');
    expect(container.querySelector('[data-column="1"]')).toHaveTextContent('BC');
    await waitFor(() => expect(onLayoutChange).toHaveBeenCalledWith([{ key: 'a', column: 0 }, { key: 'b', column: 1 }, { key: 'c', column: 1 }]));
  });

  it('preserves Masonry item DOM through keyed Solid projections', async () => {
    const [gutter, setGutter] = createSignal(8);
    const { container } = render(() => (
      <Masonry
        columns={2}
        gutter={gutter()}
        itemRender={(item) => <span data-testid={`masonry-${item.key}`}>{String(item.data)}</span>}
        items={[{ key: 'a', data: 'A', height: 80 }, { key: 'b', data: 'B', height: 60 }]}
      />
    ));
    const item = screen.getByTestId('masonry-a').closest('.ads-masonry-item');
    setGutter(20);
    await waitFor(() => expect(container.querySelector('.ads-masonry')).toHaveStyle({ gap: '20px' }));
    expect(screen.getByTestId('masonry-a').closest('.ads-masonry-item')).toBe(item);
  });

  it('selects ColorPicker presets and submits through Form', async () => {
    const onFinish = vi.fn();
    const onChange = vi.fn();
    render(() => (
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="color" label="Color">
          <ColorPicker aria-label="Color" showText onChange={onChange} presets={[{ label: 'Brand', colors: ['#ff0000', '#00ff00'] }]} />
        </Form.Item>
        <Button htmlType="submit">Save color</Button>
      </Form>
    ));
    fireEvent.click(screen.getByRole('button', { name: 'Color' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Select #ff0000' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save color' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ color: '#ff0000' }));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ toHexString: expect.any(Function) }), '#ff0000');
  });

  it('clears ColorPicker values', async () => {
    const onClear = vi.fn();
    render(() => <ColorPicker aria-label="Clearable color" allowClear onClear={onClear} />);
    fireEvent.click(screen.getByRole('button', { name: 'Clearable color' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Clear' }));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('registers declarative Mentions.Option suggestions', async () => {
    const onSelect = vi.fn();
    render(() => <Mentions aria-label="Declarative mention" onSelect={onSelect}><Mentions.Option value="ada">Ada Lovelace</Mentions.Option><Mentions.Option value="grace">Grace Hopper</Mentions.Option></Mentions>);
    const input = screen.getByRole('textbox', { name: 'Declarative mention' });
    fireEvent.input(input, { target: { value: '@ad', selectionStart: 3 } });
    fireEvent.click(await screen.findByRole('option', { name: 'Ada Lovelace' }));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: 'ada' }), '@');
    await waitFor(() => expect(input).toHaveValue('@ada '));
  });

  it('selects Mentions suggestions and submits through Form', async () => {
    const onFinish = vi.fn();
    const onSearch = vi.fn();
    render(() => (
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="message" label="Message">
          <Mentions aria-label="Message" options={[{ value: 'ada', label: 'Ada' }, { value: 'grace', label: 'Grace' }]} onSearch={onSearch} />
        </Form.Item>
        <Button htmlType="submit">Send</Button>
      </Form>
    ));
    const textarea = screen.getByRole('textbox', { name: 'Message' });
    fireEvent.input(textarea, { target: { value: '@ad', selectionStart: 3 } });
    expect(onSearch).toHaveBeenCalledWith('ad', '@');
    fireEvent.click(await screen.findByRole('option', { name: 'Ada' }));
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ message: '@ada ' }));
  });

  it('supports Mentions autosize, refs, resize, popup scroll, and semantic functions', async () => {
    const OriginalResizeObserver = globalThis.ResizeObserver;
    let notifyResize: (() => void) | undefined;
    globalThis.ResizeObserver = class {
      constructor(callback: ResizeObserverCallback) { notifyResize = () => callback([{ contentRect: { width: 320, height: 66 } } as ResizeObserverEntry], this as unknown as ResizeObserver); }
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const onResize = vi.fn();
    const onPopupScroll = vi.fn();
    let mentionsRef: MentionsRef | undefined;
    render(() => <Mentions
      ref={(value) => { mentionsRef = value; }}
      aria-label="Advanced mentions"
      autoSize={{ minRows: 2, maxRows: 3 }}
      size="large"
      variant="filled"
      options={[{ value: 'ada', label: 'Ada', style: { color: 'rgb(0, 128, 0)' } }]}
      classNames={() => ({ root: 'mentions-root-slot', textarea: 'mentions-textarea-slot', popup: 'mentions-popup-slot' })}
      styles={() => ({ textarea: { 'padding-left': '17px' } })}
      onFocus={onFocus}
      onBlur={onBlur}
      onResize={onResize}
      onPopupScroll={onPopupScroll}
    />);
    const textarea = screen.getByRole('textbox', { name: 'Advanced mentions' });
    expect(textarea.closest('.ads-mentions-root')).toHaveAttribute('data-size', 'large');
    expect(textarea.closest('.ads-mentions-root')).toHaveAttribute('data-variant', 'filled');
    expect(textarea.closest('.ads-mentions-root')).toHaveClass('mentions-root-slot');
    expect(textarea).toHaveClass('mentions-textarea-slot', 'bg-surface-container');
    expect(textarea).toHaveStyle({ paddingLeft: '17px' });
    mentionsRef?.focus();
    expect(textarea).toHaveFocus();
    expect(onFocus).toHaveBeenCalled();
    notifyResize?.();
    expect(onResize).toHaveBeenCalledWith({ width: 320, height: 66 });
    fireEvent.input(textarea, { target: { value: '@a\nsecond line', selectionStart: 2 } });
    expect(textarea).toHaveStyle({ height: '44px' });
    const option = await screen.findByRole('option', { name: 'Ada' });
    expect(option).toHaveStyle({ color: 'rgb(0, 128, 0)' });
    const listbox = screen.getByRole('listbox');
    fireEvent.scroll(listbox);
    expect(onPopupScroll).toHaveBeenCalled();
    mentionsRef?.blur();
    expect(onBlur).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    globalThis.ResizeObserver = OriginalResizeObserver;
  });

  it('parses mentions with multiple prefixes', () => {
    expect(Mentions.getMentions('@ada #team', { prefix: ['@', '#'] })).toEqual([{ prefix: '@', value: 'ada' }, { prefix: '#', value: 'team' }]);
  });

  it('resizes and collapses Splitter panels', async () => {
    const onResize = vi.fn();
    render(() => (
      <Splitter class="h-48" onResize={onResize}>
        <Splitter.Panel collapsible defaultSize={40}>Navigation panel</Splitter.Panel>
        <Splitter.Panel defaultSize={60}>Content panel</Splitter.Panel>
      </Splitter>
    ));
    const separator = await screen.findByRole('separator');
    expect(separator).toHaveAttribute('aria-valuenow', '40');
    fireEvent.keyDown(separator, { key: 'ArrowRight' });
    await waitFor(() => expect(separator).toHaveAttribute('aria-valuenow', '41'));
    expect(onResize).toHaveBeenCalledWith([41, 59]);

    fireEvent.click(screen.getByRole('button', { name: 'Collapse panel' }));
    await waitFor(() => expect(screen.getByText('Navigation panel')).not.toBeVisible());
    fireEvent.click(screen.getByRole('button', { name: 'Expand panel' }));
    await waitFor(() => expect(screen.getByText('Navigation panel')).toBeVisible());
  });

  it('navigates Carousel slides with controls and imperative ref', async () => {
    let carousel!: { goTo: (slide: number) => void; next: () => void; prev: () => void };
    render(() => <Carousel arrows ref={(ref) => { carousel = ref; }}><div>Slide one</div><div>Slide two</div><div>Slide three</div></Carousel>);
    expect(screen.getByRole('group', { name: '1 of 3' })).toHaveAttribute('aria-hidden', 'false');
    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    await waitFor(() => expect(screen.getByRole('group', { name: '2 of 3' })).toHaveAttribute('aria-hidden', 'false'));
    carousel.goTo(2);
    await waitFor(() => expect(screen.getByRole('group', { name: '3 of 3' })).toHaveAttribute('aria-hidden', 'false'));
    fireEvent.click(screen.getByRole('button', { name: 'Go to slide 1' }));
    await waitFor(() => expect(screen.getByRole('group', { name: '1 of 3' })).toHaveAttribute('aria-hidden', 'false'));
  });

  it('exposes DatePicker shortcut pickers and TimePicker', async () => {
    const GeneratedPicker = DatePicker.generatePicker<Date>({ toDayjs: (value) => dayjs(value), fromDayjs: (value) => value.toDate() });
    const { container } = render(() => <div><GeneratedPicker.MonthPicker defaultValue={new Date('2027-04-01T00:00:00Z')} /><DatePicker.MonthPicker defaultValue={dayjs('2026-03-01')} /><DatePicker.WeekPicker defaultValue={dayjs('2026-03-01')} /><DatePicker.QuarterPicker defaultValue={dayjs('2026-03-01')} /><DatePicker.YearPicker defaultValue={dayjs('2026-03-01')} /><DatePicker.TimePicker aria-label="Shortcut time" /></div>);
    const values = Array.from(container.querySelectorAll<HTMLInputElement>('.ads-date-picker input')).map((input) => input.value);
    expect(values).toEqual(['2027-04', '2026-03', '2026-W09', '2026-Q1', '2026']);
    expect(screen.getByLabelText('Shortcut time')).toHaveAttribute('type', 'time');
  });

  it('adapts generated DatePicker and RangePicker preset values', async () => {
    const GeneratedPicker = DatePicker.generatePicker<Date>({ toDayjs: (value) => dayjs(value), fromDayjs: (value) => value.toDate() });
    const onDateChange = vi.fn();
    const onDateSelect = vi.fn();
    const onDateOk = vi.fn();
    const generatedDateDisabledTime = vi.fn((_date: Date) => ({}));
    const generatedDateCellRender = vi.fn((_date: Date, info) => info.originNode);
    const onRangeChange = vi.fn();
    const onRangeCalendarChange = vi.fn();
    const onRangeOk = vi.fn();
    const onRangePickerValueChange = vi.fn();
    const generatedDisabledDate = vi.fn((_date: Date, _info: { from?: Date }) => false);
    const generatedDisabledTime = vi.fn((_date: Date, _type: 'start' | 'end', _info: { from?: Date }) => ({}));
    const generatedCellRender = vi.fn((_date: Date, info) => info.originNode);
    render(() => <div>
      <GeneratedPicker
        aria-label="Generated preset date"
        format="YYYY-MM-DD"
        showTime={{ disabledTime: generatedDateDisabledTime }}
        defaultValue={new Date('2026-05-01T08:00:00Z')}
        pickerValue={new Date('2026-06-01T00:00:00Z')}
        presets={[{ label: 'Generated day', value: new Date('2026-06-03T00:00:00Z') }]}
        cellRender={generatedDateCellRender}
        onChange={onDateChange}
        onSelect={onDateSelect}
        onOk={onDateOk}
      />
      <GeneratedPicker.RangePicker
        format="YYYY-MM-DD"
        showTime={{ disabledTime: generatedDisabledTime }}
        defaultValue={[new Date('2026-06-01T08:00:00Z'), new Date('2026-06-02T09:00:00Z')]}
        pickerValue={[new Date('2026-07-01T00:00:00Z'), new Date('2026-08-01T00:00:00Z')]}
        presets={[{ label: 'Generated interval', value: [new Date('2026-07-01T00:00:00Z'), new Date('2026-07-04T00:00:00Z')] }]}
        disabledDate={generatedDisabledDate}
        cellRender={generatedCellRender}
        onChange={onRangeChange}
        onCalendarChange={onRangeCalendarChange}
        onOk={onRangeOk}
        onPickerValueChange={onRangePickerValueChange}
      />
    </div>);
    fireEvent.click(screen.getByRole('textbox', { name: 'Generated preset date' }));
    await screen.findByRole('group', { name: 'June 2026 calendar' });
    expect(generatedDateCellRender.mock.calls[0][0]).toBeInstanceOf(Date);
    fireEvent.click(screen.getByRole('button', { name: 'Generated day' }));
    expect(onDateSelect).toHaveBeenCalledWith(expect.any(Date));
    fireEvent.click(screen.getByRole('button', { name: /^OK$/ }));
    expect(onDateChange.mock.calls[0][0]).toBeInstanceOf(Date);
    expect(onDateChange.mock.calls[0][0].toISOString().slice(0, 10)).toBe('2026-06-03');
    expect(onDateOk).toHaveBeenCalledWith(expect.any(Date));
    expect(generatedDateDisabledTime).toHaveBeenCalledWith(expect.any(Date));
    fireEvent.click(screen.getByRole('textbox', { name: 'Start date' }));
    await screen.findByRole('group', { name: 'July 2026 calendar' });
    expect(onRangePickerValueChange.mock.calls[0][0][0]).toBeInstanceOf(Date);
    expect(onRangePickerValueChange.mock.calls[0][0][1]).toBeInstanceOf(Date);
    expect(onRangePickerValueChange.mock.calls[0][1]).toMatchObject({ range: 'start', source: 'reset' });
    expect(generatedDisabledDate.mock.calls[0][0]).toBeInstanceOf(Date);
    expect(generatedDisabledDate.mock.calls[0][1].from).toBeInstanceOf(Date);
    expect(generatedCellRender.mock.calls[0][0]).toBeInstanceOf(Date);
    fireEvent.click(screen.getByRole('button', { name: 'Generated interval' }));
    expect(onRangeChange.mock.calls[0][0][0]).toBeInstanceOf(Date);
    expect(onRangeChange.mock.calls[0][0][1]).toBeInstanceOf(Date);
    expect(onRangeChange.mock.calls[0][1]).toEqual(['2026-07-01', '2026-07-04']);
    expect(onRangeCalendarChange).toHaveBeenCalledWith([expect.any(Date), expect.any(Date)], ['2026-07-01', '2026-07-04'], { range: 'start' });
    expect(onRangeOk).toHaveBeenCalledWith([expect.any(Date), expect.any(Date)]);
    expect(generatedDisabledTime).toHaveBeenCalledWith(expect.any(Date), 'start', { from: expect.any(Date) });
    expect(generatedDisabledTime).toHaveBeenCalledWith(expect.any(Date), 'end', { from: expect.any(Date) });
  });

  it('adapts generated multiple DatePicker arrays without leaking Dayjs', async () => {
    const GeneratedPicker = DatePicker.generatePicker<Date>({ toDayjs: (value) => dayjs(value), fromDayjs: (value) => value.toDate() });
    const onChange = vi.fn();
    const onOk = vi.fn();
    render(() => <GeneratedPicker
      multiple
      aria-label="Generated multiple dates"
      defaultValue={[new Date('2026-06-01T00:00:00Z'), new Date('2026-06-02T00:00:00Z')]}
      onChange={onChange}
      onOk={onOk}
    />);
    fireEvent.click(screen.getByRole('textbox', { name: 'Generated multiple dates' }));
    fireEvent.click(await screen.findByRole('button', { name: '2026-06-03' }));
    fireEvent.click(screen.getByRole('button', { name: /^OK$/ }));
    expect(onChange).toHaveBeenCalledWith([expect.any(Date), expect.any(Date), expect.any(Date)], ['2026-06-01', '2026-06-02', '2026-06-03']);
    expect(onOk).toHaveBeenCalledWith([expect.any(Date), expect.any(Date), expect.any(Date)]);
  });

  it('selects DatePicker values and stores Dayjs in Form', async () => {
    const onFinish = vi.fn();
    render(() => (
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="date" label="Date"><DatePicker defaultValue={dayjs('2026-01-15')} aria-label="Date" /></Form.Item>
        <Button htmlType="submit">Save date</Button>
      </Form>
    ));
    fireEvent.click(screen.getByRole('textbox', { name: 'Date' }));
    fireEvent.click(await screen.findByRole('button', { name: '2026-01-20' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save date' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalled());
    expect(onFinish.mock.calls[0][0].date.format('YYYY-MM-DD')).toBe('2026-01-20');
  });

  it('supports DatePicker presets, confirmation, semantic slots, and custom cells', async () => {
    const onChange = vi.fn();
    const onSelect = vi.fn();
    const onOk = vi.fn();
    const onClear = vi.fn();
    render(() => <DatePicker aria-label="Advanced date" allowClear needConfirm showNow defaultValue={dayjs('2026-03-01')} defaultPickerValue={dayjs('2026-03-01')} presets={[{ label: 'Release day', value: dayjs('2026-03-18') }]} renderExtraFooter={() => 'Calendar footer'} cellRender={(date, info) => date.date() === 18 ? <span>Day 18</span> : info.originNode} classNames={{ root: 'date-root', popupFooter: 'date-footer' }} styles={{ root: { color: 'rgb(0, 0, 255)' } }} onChange={onChange} onSelect={onSelect} onOk={onOk} onClear={onClear} />);
    expect(screen.getByRole('group', { name: 'Advanced date' })).toHaveClass('date-root');
    expect(screen.getByRole('group', { name: 'Advanced date' })).toHaveStyle({ color: 'rgb(0, 0, 255)' });
    fireEvent.click(screen.getByRole('textbox', { name: 'Advanced date' }));
    expect(await screen.findByText('Calendar footer')).toBeInTheDocument();
    expect(screen.getByText('Day 18')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Release day' }));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ format: expect.any(Function) }));
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(expect.anything(), '2026-03-18'));
    expect(onOk).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Clear date' }));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('selects, orders, and confirms multiple DatePicker values', async () => {
    const onChange = vi.fn();
    render(() => <DatePicker multiple order defaultPickerValue={dayjs('2026-03-01')} aria-label="Multiple dates" onChange={onChange} />);
    fireEvent.click(screen.getByRole('textbox', { name: 'Multiple dates' }));
    fireEvent.click(await screen.findByRole('button', { name: '2026-03-18' }));
    fireEvent.click(screen.getByRole('button', { name: '2026-03-10' }));
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /^OK$/ }));
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(onChange.mock.calls[0][0].map((value: dayjs.Dayjs) => value.format('YYYY-MM-DD'))).toEqual(['2026-03-10', '2026-03-18']);
    expect(onChange.mock.calls[0][1]).toEqual(['2026-03-10', '2026-03-18']);
  });

  it('combines DatePicker date and time selection while enforcing disabledTime', async () => {
    const onChange = vi.fn();
    render(() => <DatePicker showTime={{ disabledHours: () => [13] }} defaultValue={dayjs('2026-03-01T13:05:06')} defaultPickerValue={dayjs('2026-03-01')} aria-label="Timed date" onChange={onChange} />);
    fireEvent.click(screen.getByRole('textbox', { name: 'Timed date' }));
    fireEvent.click(await screen.findByRole('button', { name: '2026-03-18' }));
    expect(screen.getByRole('button', { name: /^OK$/ })).toBeDisabled();
    fireEvent.input(screen.getByRole('spinbutton', { name: 'Hour' }), { target: { value: '14' } });
    await waitFor(() => expect(screen.getByRole('button', { name: /^OK$/ })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: /^OK$/ }));
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(onChange.mock.calls[0][0].format('YYYY-MM-DD HH:mm:ss')).toBe('2026-03-18 14:05:06');
  });

  it('enforces disabled milliseconds and time field visibility in DatePicker', async () => {
    const onChange = vi.fn();
    render(() => <DatePicker
      aria-label="Precise date"
      showTime={{ showMinute: false, showMillisecond: true, millisecondStep: 5, disabledTime: () => ({ disabledMilliseconds: (hour, minute, second) => hour === 13 && minute === 5 && second === 6 ? [123] : [] }) }}
      defaultValue={dayjs('2026-03-01T13:05:06.123')}
      onChange={onChange}
    />);
    expect(screen.getByRole('textbox', { name: 'Precise date' })).toHaveValue('2026-03-01 13:05:06.123');
    fireEvent.click(screen.getByRole('textbox', { name: 'Precise date' }));
    expect(screen.queryByRole('spinbutton', { name: 'Minute' })).not.toBeInTheDocument();
    const milliseconds = await screen.findByRole('spinbutton', { name: 'Millisecond' });
    expect(milliseconds).toHaveAttribute('step', '5');
    expect(screen.getByRole('button', { name: /^OK$/ })).toBeDisabled();
    fireEvent.input(milliseconds, { target: { value: '124' } });
    await waitFor(() => expect(screen.getByRole('button', { name: /^OK$/ })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: /^OK$/ }));
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(onChange.mock.calls[0][0].format('YYYY-MM-DD HH:mm:ss.SSS')).toBe('2026-03-01 13:05:06.124');
  });

  it('maps 12-hour DatePicker input and meridiem changes to disabled 24-hour values', async () => {
    const onChange = vi.fn();
    render(() => <DatePicker
      aria-label="Twelve hour date"
      showTime={{ use12Hours: true }}
      defaultValue={dayjs('2026-03-01T13:05:06')}
      disabledTime={() => ({ disabledHours: () => [2] })}
      onChange={onChange}
    />);
    const picker = screen.getByRole('textbox', { name: 'Twelve hour date' });
    expect(picker).toHaveValue('2026-03-01 01:05:06 PM');
    fireEvent.click(picker);
    const hour = await screen.findByRole('spinbutton', { name: 'Hour' });
    const meridiem = screen.getByRole('combobox', { name: 'Meridiem' });
    expect(hour).toHaveValue(1);
    expect(hour).toHaveAttribute('min', '1');
    expect(hour).toHaveAttribute('max', '12');

    fireEvent.change(meridiem, { target: { value: 'AM' } });
    await waitFor(() => expect(meridiem).toHaveValue('AM'));
    fireEvent.input(hour, { target: { value: '2' } });
    expect(hour).toHaveValue(1);
    fireEvent.change(meridiem, { target: { value: 'PM' } });
    fireEvent.input(hour, { target: { value: '2' } });
    await waitFor(() => expect(hour).toHaveValue(2));
    fireEvent.click(screen.getByRole('button', { name: /^OK$/ }));
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(onChange.mock.calls[0][0].hour()).toBe(14);
    expect(onChange.mock.calls[0][1]).toBe('2026-03-01 02:05:06 PM');
  });

  it('returns directly from the DatePicker year panel to the date panel', async () => {
    const onChange = vi.fn();
    const onPanelChange = vi.fn();
    render(() => <DatePicker aria-label="Panel date" defaultPickerValue={dayjs('2026-03-01')} onChange={onChange} onPanelChange={onPanelChange} />);
    fireEvent.click(screen.getByRole('textbox', { name: 'Panel date' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Choose month or year' }));
    expect(onPanelChange).toHaveBeenCalledWith(expect.anything(), 'month');
    expect(await screen.findByRole('group', { name: '2026 months' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Choose month or year' }));
    expect(await screen.findByRole('group', { name: /years/ })).toBeInTheDocument();
    expect(onPanelChange).toHaveBeenCalledWith(expect.anything(), 'year');
    fireEvent.click(screen.getByRole('button', { name: '2027' }));
    expect(await screen.findByRole('group', { name: 'March 2027 calendar' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '2027-03-15' }));
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(expect.anything(), '2027-03-15'));
    expect(onPanelChange.mock.calls.map((call) => call[1])).toEqual(expect.arrayContaining(['month', 'year', 'date']));
  });

  it('keeps DatePicker mode controlled until the external value changes', async () => {
    const [mode, setMode] = createSignal<'date' | 'month'>('date');
    const onPanelChange = vi.fn();
    render(() => <div><DatePicker aria-label="Controlled panel date" mode={mode()} defaultPickerValue={dayjs('2026-03-01')} onPanelChange={onPanelChange} /><Button onClick={() => setMode('month')}>Apply month mode</Button></div>);
    fireEvent.click(screen.getByRole('textbox', { name: 'Controlled panel date' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Choose month or year' }));
    expect(onPanelChange).toHaveBeenCalledWith(expect.anything(), 'month');
    expect(screen.getByRole('group', { name: 'March 2026 calendar' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Apply month mode' }));
    expect(await screen.findByRole('group', { name: '2026 months' })).toBeInTheDocument();
  });

  it('navigates DatePicker grids by keyboard across disabled days and month boundaries', async () => {
    const onChange = vi.fn();
    const onPanelChange = vi.fn();
    render(() => <DatePicker aria-label="Keyboard date" defaultPickerValue={dayjs('2026-03-01')} disabledDate={(date) => date.isSame(dayjs('2026-03-19'), 'day')} onChange={onChange} onPanelChange={onPanelChange} />);
    fireEvent.click(screen.getByRole('textbox', { name: 'Keyboard date' }));
    const day18 = await screen.findByRole('button', { name: '2026-03-18' });
    day18.focus();
    fireEvent.keyDown(day18, { key: 'ArrowRight' });
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: '2026-03-20' })));
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: '2026-03-27' })));
    fireEvent.keyDown(document.activeElement!, { key: 'Home' });
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: '2026-03-22' })));
    fireEvent.keyDown(document.activeElement!, { key: 'PageDown' });
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: '2026-04-22' })));
    fireEvent.keyDown(document.activeElement!, { key: 'Enter' });
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(expect.anything(), '2026-04-22'));
    expect(onPanelChange).toHaveBeenCalledWith(expect.anything(), 'date');
  });

  it('supports DatePicker typed input, invalid preservation, locale, components, weeks, and popup hosts', async () => {
    const popupHost = document.createElement('div');
    document.body.append(popupHost);
    const onChange = vi.fn();
    const CustomInput = (props: JSX.InputHTMLAttributes<HTMLInputElement>) => <input {...props} data-custom-date-input="true" />;
    render(() => <DatePicker aria-label="Typed date" preserveInvalidOnBlur showWeek defaultPickerValue={dayjs('2026-03-01')} locale={{ lang: { placeholder: 'Local date', shortWeekDays: ['S0', 'M1', 'T2', 'W3', 'T4', 'F5', 'S6'] } }} components={{ input: CustomInput, date: (props) => <section data-custom-date-panel="true">{props.children}</section> }} getPopupContainer={() => popupHost} onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: 'Typed date' });
    expect(input).toHaveAttribute('data-custom-date-input', 'true');
    fireEvent.input(input, { target: { value: 'invalid date' } });
    fireEvent.blur(input);
    expect(input).toHaveValue('invalid date');
    fireEvent.input(input, { target: { value: '2026-04-12' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith(expect.anything(), '2026-04-12');
    fireEvent.focus(input);
    expect(await screen.findByText('Wk')).toBeInTheDocument();
    expect(screen.getByText('S0')).toBeInTheDocument();
    expect(popupHost.querySelector('[data-custom-date-panel="true"]')).toBeInTheDocument();
    popupHost.remove();
  });

  it('formats and parses DatePicker values with arrays, mask objects, and functions', async () => {
    const onChange = vi.fn();
    render(() => <div>
      <DatePicker aria-label="Array format date" defaultValue={dayjs('2026-04-12')} format={['DD/MM/YYYY', 'YYYY-MM-DD']} onChange={onChange} />
      <DatePicker aria-label="Mask format date" defaultValue={dayjs('2026-04-12')} format={{ format: 'MM.DD.YYYY', type: 'mask' }} />
      <DatePicker aria-label="Function format date" defaultValue={dayjs('2026-04-12')} format={(date) => `Release ${date.format('YYYYMMDD')}`} inputReadOnly />
    </div>);
    const arrayInput = screen.getByRole('textbox', { name: 'Array format date' });
    expect(arrayInput).toHaveValue('12/04/2026');
    expect(screen.getByRole('textbox', { name: 'Mask format date' })).toHaveValue('04.12.2026');
    expect(screen.getByRole('textbox', { name: 'Function format date' })).toHaveValue('Release 20260412');
    fireEvent.input(arrayInput, { target: { value: '2027-05-19' } });
    fireEvent.keyDown(arrayInput, { key: 'Enter' });
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(expect.anything(), '19/05/2027'));
    expect(arrayInput).toHaveValue('19/05/2027');
  });

  it('applies locale week starts and first-week rules to DatePicker panels', async () => {
    render(() => <DatePicker aria-label="Locale week date" showWeek defaultPickerValue={dayjs('2021-01-01')} locale={{ lang: { weekStartsOn: 1, firstWeekContainsDate: 4, shortWeekDays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] } }} />);
    fireEvent.click(screen.getByRole('textbox', { name: 'Locale week date' }));
    const grid = await screen.findByRole('group', { name: 'January 2021 calendar' });
    expect(grid.querySelectorAll('button')[0]).toHaveAccessibleName('2020-12-28');
    expect(screen.getByText('Mo')).toBeInTheDocument();
    expect(screen.getByText('53')).toBeInTheDocument();
  });

  it('selects a RangePicker endpoint with calendar keyboard navigation', async () => {
    const onChange = vi.fn();
    render(() => <DatePicker.RangePicker defaultValue={[dayjs('2026-02-10'), null]} onChange={onChange} />);
    fireEvent.click(screen.getByRole('textbox', { name: 'End date' }));
    const date = await screen.findByRole('button', { name: '2026-02-12' });
    date.focus();
    fireEvent.keyDown(date, { key: 'ArrowLeft' });
    await waitFor(() => expect(screen.getByRole('button', { name: '2026-02-11' })).toHaveFocus());
    fireEvent.keyDown(screen.getByRole('button', { name: '2026-02-11' }), { key: 'Enter' });
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(expect.any(Array), ['2026-02-10', '2026-02-11']));
  });

  it('selects and orders DatePicker ranges', async () => {
    const onChange = vi.fn();
    render(() => <DatePicker.RangePicker defaultValue={[dayjs('2026-02-10'), null]} onChange={onChange} />);
    fireEvent.click(screen.getByRole('textbox', { name: 'End date' }));
    fireEvent.click(await screen.findByRole('button', { name: '2026-02-05' }));
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0][1]).toEqual(['2026-02-05', '2026-02-10']);
  });

  it('enforces endpoint-specific disabled time in RangePicker', async () => {
    const onChange = vi.fn();
    const disabledTime = vi.fn((_: dayjs.Dayjs, type: 'start' | 'end') => ({ disabledHours: () => type === 'start' ? [4] : [20] }));
    render(() => (
      <DatePicker.RangePicker
        showTime
        defaultValue={[dayjs('2026-02-10T03:15:00'), dayjs('2026-02-11T19:30:00')]}
        disabledTime={disabledTime}
        onChange={onChange}
      />
    ));

    fireEvent.click(screen.getByRole('textbox', { name: 'Start date' }));
    fireEvent.input(await screen.findByRole('spinbutton', { name: 'Start hour' }), { target: { value: '4' } });
    fireEvent.input(screen.getByRole('spinbutton', { name: 'Start hour' }), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /^OK$/ }));
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(onChange.mock.calls.at(-1)?.[0][0].format('YYYY-MM-DD HH:mm:ss')).toBe('2026-02-10 05:15:00');

    fireEvent.click(screen.getByRole('textbox', { name: 'End date' }));
    fireEvent.input(await screen.findByRole('spinbutton', { name: 'End hour' }), { target: { value: '20' } });
    fireEvent.input(screen.getByRole('spinbutton', { name: 'End hour' }), { target: { value: '21' } });
    fireEvent.click(screen.getByRole('button', { name: /^OK$/ }));
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(2));
    expect(onChange.mock.calls.at(-1)?.[0][1].format('YYYY-MM-DD HH:mm:ss')).toBe('2026-02-11 21:30:00');
    expect(disabledTime.mock.calls.some((call) => call[1] === 'start')).toBe(true);
    expect(disabledTime.mock.calls.some((call) => call[1] === 'end')).toBe(true);
  });

  it('validates disabled milliseconds across both RangePicker endpoints', async () => {
    const onChange = vi.fn();
    const disabledTime = vi.fn((date: dayjs.Dayjs, type: 'start' | 'end', info: { from?: dayjs.Dayjs }) => ({
      disabledMilliseconds: () => type === 'start' && date.date() === 10 && info.from?.date() === 11 ? [111] : type === 'end' && date.date() === 11 && info.from?.date() === 10 ? [222] : [],
    }));
    render(() => <DatePicker.RangePicker
      showTime={{ showMillisecond: true, millisecondStep: 10, disabledTime }}
      defaultValue={[dayjs('2026-02-10T08:00:00.111'), dayjs('2026-02-11T09:00:00.222')]}
      onChange={onChange}
    />);

    expect(screen.getByRole('textbox', { name: 'Start date' })).toHaveValue('2026-02-10 08:00:00.111');
    expect(screen.getByRole('textbox', { name: 'End date' })).toHaveValue('2026-02-11 09:00:00.222');
    fireEvent.click(screen.getByRole('textbox', { name: 'Start date' }));
    const startMilliseconds = await screen.findByRole('spinbutton', { name: 'Start millisecond' });
    expect(startMilliseconds).toHaveAttribute('step', '10');
    expect(screen.getByRole('button', { name: /^OK$/ })).toBeDisabled();
    fireEvent.input(startMilliseconds, { target: { value: '112' } });
    expect(screen.getByRole('button', { name: /^OK$/ })).toBeDisabled();

    fireEvent.click(screen.getByRole('textbox', { name: 'End date' }));
    const endMilliseconds = await screen.findByRole('spinbutton', { name: 'End millisecond' });
    fireEvent.input(endMilliseconds, { target: { value: '223' } });
    await waitFor(() => expect(screen.getByRole('button', { name: /^OK$/ })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: /^OK$/ }));
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(onChange.mock.calls[0][0].map((date: dayjs.Dayjs) => date.millisecond())).toEqual([112, 223]);
    expect(disabledTime.mock.calls.some((call) => call[1] === 'start' && call[2].from?.date() === 11)).toBe(true);
    expect(disabledTime.mock.calls.some((call) => call[1] === 'end' && call[2].from?.date() === 10)).toBe(true);
  });

  it('applies RangePicker locale, semantic popup slots, panel rendering, and presets', async () => {
    const onChange = vi.fn();
    render(() => <DatePicker.RangePicker
      defaultValue={[dayjs('2026-02-10'), dayjs('2026-02-12')]}
      locale={{ lang: { weekStartsOn: 1, shortWeekDays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] } }}
      presets={[{ label: 'Next interval', value: [dayjs('2026-03-01'), dayjs('2026-03-05')] }]}
      classNames={{ root: 'range-semantic-root', popupRoot: 'range-popup-root', popupContainer: 'range-popup-container', popupItem: 'range-popup-item', popupFooter: 'range-popup-footer' }}
      styles={{ popupItem: { color: 'rgb(0, 128, 0)' } }}
      cellRender={(date, info) => <>{info.originNode}R</>}
      panelRender={(panel) => <section aria-label="Custom range panel">{panel}</section>}
      renderExtraFooter={() => <>Range footer</>}
      onChange={onChange}
    />);
    expect(screen.getByRole('group', { name: 'Choose date range' })).toHaveClass('range-semantic-root');
    fireEvent.click(screen.getByRole('textbox', { name: 'Start date' }));
    expect(await screen.findByRole('region', { name: 'Custom range panel' })).toBeInTheDocument();
    expect(screen.getByText('Mo')).toBeInTheDocument();
    const date = screen.getByRole('button', { name: '2026-02-10' });
    expect(date).toHaveClass('range-popup-item');
    expect(date).toHaveStyle({ color: 'rgb(0, 128, 0)' });
    expect(date).toHaveTextContent('10R');
    expect(screen.getByText('Range footer')).toHaveClass('range-popup-footer');
    expect(screen.getByRole('button', { name: 'Next interval' }).parentElement).toHaveClass('ads-date-picker-presets');
    expect(document.querySelector('.range-popup-root')).toBeInTheDocument();
    expect(document.querySelector('.range-popup-container')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next interval' }));
    expect(onChange).toHaveBeenCalledWith(expect.arrayContaining([expect.anything(), expect.anything()]), ['2026-03-01', '2026-03-05']);
  });

  it('keeps disabled RangePicker controls inert and applies field status styling', async () => {
    render(() => <DatePicker.RangePicker disabled status="warning" prefix="R" suffixIcon="S" defaultValue={[dayjs('2026-02-10'), dayjs('2026-02-12')]} />);
    const root = screen.getByRole('group', { name: 'Choose date range' });
    expect(root).toHaveClass('border-warning');
    expect(root).toHaveAttribute('data-status', 'warning');
    expect(root).toHaveTextContent('R');
    expect(root).toHaveTextContent('S');
    expect(screen.getByRole('textbox', { name: 'Start date' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'End date' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Clear dates' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('textbox', { name: 'Start date' }));
    expect(screen.queryByRole('dialog', { name: 'Date range picker dialog' })).not.toBeInTheDocument();
  });

  it('reports deduplicated DatePicker open changes from focus, click, and Escape', () => {
    const onOpenChange = vi.fn();
    render(() => <DatePicker aria-label="Open lifecycle date" onOpenChange={onOpenChange} />);
    const input = screen.getByRole('textbox', { name: 'Open lifecycle date' });
    fireEvent.focus(input);
    fireEvent.click(input);
    expect(onOpenChange.mock.calls).toEqual([[true]]);
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
  });

  it('reports deduplicated RangePicker open changes from focus, click, and Escape', async () => {
    const onOpenChange = vi.fn();
    render(() => <DatePicker.RangePicker onOpenChange={onOpenChange} />);
    const start = screen.getByRole('textbox', { name: 'Start date' });
    fireEvent.focus(start);
    fireEvent.click(start);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    fireEvent.keyDown(start, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledTimes(2);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('supports endpoint RangePicker disabled, ids, separator, picker views, and callback info', async () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const onCalendarChange = vi.fn();
    const onChange = vi.fn();
    const disabledTime = vi.fn((_date: ReturnType<typeof dayjs>, _part: 'start' | 'end', _info: { from?: ReturnType<typeof dayjs> }) => ({}));
    let disabledDateInfo: { from?: ReturnType<typeof dayjs>; type: string } | undefined;
    let cellInfo: { range?: string; type: string; locale?: unknown } | undefined;
    render(() => <DatePicker.RangePicker
      id={{ start: 'range-start-id', end: 'range-end-id' }}
      disabled={[true, false]}
      separator="to"
      defaultValue={[dayjs('2026-02-10'), dayjs('2026-02-12')]}
      pickerValue={[dayjs('2026-03-01'), dayjs('2026-04-01')]}
      disabledTime={disabledTime}
      disabledDate={(_date, info) => { disabledDateInfo = info; return false; }}
      cellRender={(_date, info) => { cellInfo = info; return info.originNode; }}
      onFocus={onFocus}
      onBlur={onBlur}
      onCalendarChange={onCalendarChange}
      onChange={onChange}
    />);
    const start = screen.getByRole('textbox', { name: 'Start date' });
    const end = screen.getByRole('textbox', { name: 'End date' });
    expect(start).toHaveAttribute('id', 'range-start-id');
    expect(end).toHaveAttribute('id', 'range-end-id');
    expect(start).toBeDisabled();
    expect(end).toBeEnabled();
    expect(screen.getByText('to')).toBeInTheDocument();
    fireEvent.focus(end);
    fireEvent.blur(end);
    expect(onFocus).toHaveBeenCalledWith(expect.any(FocusEvent), { range: 'end' });
    expect(onBlur).toHaveBeenCalledWith(expect.any(FocusEvent), { range: 'end' });
    fireEvent.click(end);
    const targetDate = await screen.findByRole('button', { name: '2026-04-15' });
    expect(disabledDateInfo?.type).toBe('date');
    expect(disabledDateInfo?.from?.format('YYYY-MM-DD')).toBe('2026-02-10');
    expect(cellInfo).toMatchObject({ range: 'end', type: 'date' });
    fireEvent.click(targetDate);
    expect(onCalendarChange).toHaveBeenCalledWith(expect.any(Array), expect.any(Array), { range: 'end' });
    expect(disabledTime).toHaveBeenCalledWith(expect.anything(), 'end', { from: expect.objectContaining({}) });
    expect(disabledTime.mock.calls.at(-1)?.[2].from!.format('YYYY-MM-DD')).toBe('2026-02-10');
    expect(onChange).toHaveBeenCalled();
  });

  it('controls RangePicker endpoint views and reports tuple panel state', async () => {
    const [pickerValue, setPickerValue] = createSignal<ReturnType<typeof dayjs> | readonly [ReturnType<typeof dayjs>, ReturnType<typeof dayjs>]>(dayjs('2026-03-01'));
    const [modes, setModes] = createSignal<readonly [DatePickerPanelMode, DatePickerPanelMode]>(['date', 'month']);
    const onPickerValueChange = vi.fn((next: [dayjs.Dayjs, dayjs.Dayjs]) => setPickerValue(next));
    const onPanelChange = vi.fn((_dates: [dayjs.Dayjs | null, dayjs.Dayjs | null], nextModes: [DatePickerPanelMode, DatePickerPanelMode]) => setModes(nextModes));
    render(() => <DatePicker.RangePicker
      defaultValue={[dayjs('2026-02-10'), dayjs('2026-02-12')]}
      pickerValue={pickerValue()}
      mode={modes()}
      onPickerValueChange={onPickerValueChange}
      onPanelChange={onPanelChange}
    />);

    fireEvent.click(screen.getByRole('textbox', { name: 'End date' }));
    expect(await screen.findByRole('group', { name: '2026 months' })).toBeInTheDocument();
    expect(onPickerValueChange).toHaveBeenCalledWith(
      [expect.objectContaining({}), expect.objectContaining({})],
      { range: 'end', source: 'reset', mode: ['date', 'month'] },
    );
    expect(onPickerValueChange.mock.calls[0][0][0].format('YYYY-MM-DD')).toBe('2026-03-01');
    expect(onPickerValueChange.mock.calls[0][0][1].format('YYYY-MM-DD')).toBe('2026-03-01');

    fireEvent.click(screen.getByRole('button', { name: 'March 2026' }));
    expect(onPanelChange).toHaveBeenLastCalledWith(expect.any(Array), ['date', 'date']);
    await waitFor(() => expect(modes()).toEqual(['date', 'date']));
    await screen.findByRole('group', { name: 'March 2026 calendar' });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPickerValueChange).toHaveBeenLastCalledWith(
      expect.any(Array),
      { range: 'end', source: 'panel', mode: ['date', 'date'] },
    );
    expect(onPickerValueChange.mock.calls.at(-1)?.[0][1].format('YYYY-MM-DD')).toBe('2026-04-01');
  });

  it('strictly parses RangePicker endpoint inputs using every configured format', async () => {
    const onChange = vi.fn();
    const onCalendarChange = vi.fn();
    render(() => <DatePicker.RangePicker
      format={['DD/MM/YYYY', 'YYYY-MM-DD']}
      defaultValue={[null, dayjs('2026-05-20')]}
      onCalendarChange={onCalendarChange}
      onChange={onChange}
    />);
    const start = screen.getByRole('textbox', { name: 'Start date' });
    fireEvent.input(start, { target: { value: '19/05/2026' } });
    fireEvent.keyDown(start, { key: 'Enter' });
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(expect.any(Array), ['19/05/2026', '20/05/2026']));
    expect(onChange.mock.calls[0][0][0].format('YYYY-MM-DD')).toBe('2026-05-19');
    expect(onCalendarChange).toHaveBeenCalledWith(expect.any(Array), ['19/05/2026', '20/05/2026'], { range: 'start' });
    expect(start).toHaveValue('19/05/2026');
  });

  it('restores invalid RangePicker input unless preserveInvalidOnBlur is enabled', async () => {
    render(() => <div>
      <DatePicker.RangePicker aria-label="Restored range" defaultValue={[dayjs('2026-04-10'), dayjs('2026-04-12')]} />
      <DatePicker.RangePicker aria-label="Preserved range" preserveInvalidOnBlur defaultValue={[dayjs('2026-04-10'), dayjs('2026-04-12')]} />
    </div>);
    const restored = within(screen.getByRole('group', { name: 'Restored range' })).getByRole('textbox', { name: 'Start date' });
    fireEvent.input(restored, { target: { value: '2026-02-30' } });
    fireEvent.blur(restored);
    await waitFor(() => expect(restored).toHaveValue('2026-04-10'));

    const preserved = within(screen.getByRole('group', { name: 'Preserved range' })).getByRole('textbox', { name: 'Start date' });
    fireEvent.input(preserved, { target: { value: 'not-a-date' } });
    fireEvent.blur(preserved);
    expect(preserved).toHaveValue('not-a-date');
  });

  it('validates typed RangePicker times against the opposite endpoint across days', async () => {
    const onChange = vi.fn();
    const disabledTime = vi.fn((date: dayjs.Dayjs, type: 'start' | 'end', info: { from?: dayjs.Dayjs }) => ({
      disabledHours: () => type === 'end' && date.date() === 11 && info.from?.date() === 10 ? [7] : [],
    }));
    render(() => <DatePicker.RangePicker
      showTime
      defaultValue={[dayjs('2026-02-10T22:00:00'), dayjs('2026-02-11T08:00:00')]}
      disabledTime={disabledTime}
      onChange={onChange}
    />);
    const end = screen.getByRole('textbox', { name: 'End date' });
    fireEvent.input(end, { target: { value: '2026-02-11 07:00:00' } });
    fireEvent.keyDown(end, { key: 'Enter' });
    expect(onChange).not.toHaveBeenCalled();
    await waitFor(() => expect(end).toHaveValue('2026-02-11 08:00:00'));
    expect(disabledTime).toHaveBeenCalledWith(expect.anything(), 'end', { from: expect.anything() });
    expect(disabledTime.mock.calls.at(-1)?.[2].from?.format('YYYY-MM-DD')).toBe('2026-02-10');

    fireEvent.input(end, { target: { value: '2026-02-11 09:00:00' } });
    fireEvent.keyDown(end, { key: 'Enter' });
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(onChange.mock.calls[0][0][1].format('YYYY-MM-DD HH:mm:ss')).toBe('2026-02-11 09:00:00');
  });

  it('commits an allowed open RangePicker interval without losing tuple positions', async () => {
    const onChange = vi.fn();
    const onOk = vi.fn();
    render(() => <DatePicker.RangePicker allowEmpty onChange={onChange} onOk={onOk} />);
    fireEvent.click(screen.getByRole('textbox', { name: 'End date' }));
    fireEvent.click(await screen.findByRole('button', { name: dayjs().date(18).format('YYYY-MM-DD') }));
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(onChange.mock.calls[0][0][0]).toBeNull();
    expect(onChange.mock.calls[0][0][1]).toBeTruthy();
    expect(onOk).toHaveBeenCalledWith([null, expect.anything()]);
  });

  it('treats a controlled null RangePicker value as an empty range', () => {
    render(() => <DatePicker.RangePicker value={null} defaultValue={[dayjs('2026-03-01'), dayjs('2026-03-05')]} />);
    expect(screen.getByRole('textbox', { name: 'Start date' })).toHaveValue('');
    expect(screen.getByRole('textbox', { name: 'End date' })).toHaveValue('');
    expect(screen.queryByRole('button', { name: 'Clear dates' })).not.toBeInTheDocument();
  });

  it('revalidates RangePicker endpoint times on confirmation and rejects out-of-range input', async () => {
    const onChange = vi.fn();
    render(() => <DatePicker.RangePicker showTime defaultValue={[dayjs('2026-02-10T08:00:00'), dayjs('2026-02-11T09:00:00')]} disabledTime={(date, type) => ({ disabledHours: () => type === 'end' && date.date() === 11 ? [9] : [] })} onChange={onChange} />);
    fireEvent.click(screen.getByRole('textbox', { name: 'End date' }));
    const hour = await screen.findByRole('spinbutton', { name: 'End hour' });
    expect(screen.getByRole('button', { name: /^OK$/ })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /^OK$/ }));
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.input(hour, { target: { value: '24' } });
    expect(hour).toHaveValue(9);
    fireEvent.input(hour, { target: { value: '10' } });
    await waitFor(() => expect(screen.getByRole('button', { name: /^OK$/ })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: /^OK$/ }));
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(onChange.mock.calls[0][0][1].format('YYYY-MM-DD HH:mm:ss')).toBe('2026-02-11 10:00:00');
  });

  it('parses TimePicker values into Dayjs', async () => {
    const onChange = vi.fn();
    render(() => <TimePicker aria-label="Meeting time" onChange={onChange} />);
    fireEvent.input(screen.getByLabelText('Meeting time'), { target: { value: '14:30:15' } });
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(onChange.mock.calls[0][0].format('HH:mm:ss')).toBe('14:30:15');
    expect(onChange.mock.calls[0][1]).toBe('14:30:15');
  });

  it('generates Calendar components with custom date adapters', () => {
    const GeneratedCalendar = Calendar.generateCalendar<Date>({ toDayjs: (value) => dayjs(value), fromDayjs: (value) => value.toDate() });
    const onSelect = vi.fn();
    render(() => <GeneratedCalendar defaultValue={new Date('2026-05-10T00:00:00Z')} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: '2026-05-11' }));
    expect(onSelect.mock.calls[0][0]).toBeInstanceOf(Date);
    expect(onSelect.mock.calls[0][0].getDate()).toBe(11);
  });

  it('selects Calendar dates and switches panel mode', async () => {
    const onSelect = vi.fn();
    const onPanelChange = vi.fn();
    render(() => <Calendar defaultValue={dayjs('2026-03-10')} onSelect={onSelect} onPanelChange={onPanelChange} />);
    fireEvent.click(screen.getByRole('button', { name: '2026-03-18' }));
    expect(onSelect).toHaveBeenCalledWith(expect.anything(), { source: 'date' });
    expect(onSelect.mock.calls[0][0].format('YYYY-MM-DD')).toBe('2026-03-18');
    fireEvent.click(screen.getByRole('button', { name: 'Year' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'March' })).toBeInTheDocument());
    expect(onPanelChange).toHaveBeenCalledWith(expect.anything(), 'year');
  });

  it('registers Tree.TreeNode and expands DirectoryTree on click', async () => {
    const onSelect = vi.fn();
    render(() => <Tree.DirectoryTree onSelect={onSelect}><Tree.TreeNode nodeKey="docs" title="Documents"><Tree.TreeNode nodeKey="guide" title="Guide" isLeaf /></Tree.TreeNode></Tree.DirectoryTree>);
    const documents = await screen.findByRole('treeitem', { name: /Documents/ });
    fireEvent.click(documents);
    expect(await screen.findByRole('treeitem', { name: /Guide/ })).toBeInTheDocument();
    expect(onSelect).toHaveBeenCalledWith(['docs'], expect.objectContaining({ selected: true }));
  });

  it('expands, selects, and checks Tree nodes', async () => {
    const onSelect = vi.fn();
    const onCheck = vi.fn();
    render(() => (
      <Tree
        checkable
        onSelect={onSelect}
        onCheck={onCheck}
        treeData={[{ key: 'root', title: 'Root', children: [{ key: 'child', title: 'Child' }] }]}
      />
    ));
    fireEvent.click(screen.getByRole('button', { name: 'Expand node' }));
    const child = await screen.findByRole('treeitem', { name: /Child/ });
    fireEvent.click(child);
    expect(onSelect).toHaveBeenCalledWith(['child'], expect.objectContaining({ selected: true }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Check Root' }));
    await waitFor(() => expect(screen.getByRole('checkbox', { name: 'Check Child' })).toBeChecked());
    expect(onCheck).toHaveBeenCalledWith(['root', 'child'], expect.objectContaining({ checked: true }));
  });

  it('assigns unique fallback Table keys to nested records without explicit keys', () => {
    const { container } = render(() => <Table pagination={false} expandable={{ defaultExpandAllRows: true }} dataSource={[{ name: 'Parent', children: [{ name: 'Child one' }, { name: 'Child two' }] }]} columns={[{ dataIndex: 'name', title: 'Name' }]} />);
    const keys = Array.from(container.querySelectorAll<HTMLTableRowElement>('tr[data-row-key]'), (row) => row.dataset.rowKey);
    expect(keys).toEqual(['0', '1', '2']);
    expect(new Set(keys).size).toBe(3);
  });

  it('moves focus through Tree nodes with the keyboard', async () => {
    render(() => <Tree defaultExpandAll treeData={[{ key: 'a', title: 'A', children: [{ key: 'b', title: 'B' }] }]} />);
    const nodes = await screen.findAllByRole('treeitem');
    nodes[0].focus();
    fireEvent.keyDown(screen.getByRole('tree'), { key: 'ArrowDown' });
    expect(nodes[1]).toHaveFocus();
  });

  it('virtualizes large Trees and expands controlled ancestors', async () => {
    const data = Array.from({ length: 5000 }, (_, index) => ({ key: index, title: `Node ${index}` }));
    const started = performance.now();
    const view = render(() => <Tree virtual height={112} treeData={data} />);
    expectRenderWithin(started, 1500);
    const rendered = await screen.findAllByRole('treeitem');
    expect(rendered.length).toBeLessThan(40);
    view.unmount();

    render(() => <Tree autoExpandParent expandedKeys={['leaf']} treeData={[{ key: 'root', title: 'Root', children: [{ key: 'branch', title: 'Branch', children: [{ key: 'leaf', title: 'Leaf' }] }] }]} />);
    expect(screen.getByRole('treeitem', { name: /Leaf/ })).toHaveAttribute('aria-level', '3');
  });

  it('virtualizes large TreeSelect popups through the shared Tree engine', async () => {
    const treeData = Array.from({ length: 5000 }, (_, index) => ({ key: index, value: index, title: `Choice ${index}` }));
    const started = performance.now();
    render(() => <TreeSelect virtual listHeight={112} aria-label="Virtual tree select" treeData={treeData} />);
    expectRenderWithin(started, 1500);
    fireEvent.click(screen.getByRole('combobox'));
    const rendered = await screen.findAllByRole('treeitem');
    expect(rendered.length).toBeLessThan(40);
  });

  it('maps Tree fields and applies title, filter, and semantic customization', () => {
    const { container } = render(() => <Tree fieldNames={{ key: 'id', title: 'name', children: 'nodes' }} height={120} rootStyle={{ border: '1px solid red' }} classNames={{ root: 'tree-root', item: 'tree-item', itemTitle: 'tree-title' }} styles={{ itemTitle: { color: 'rgb(0, 0, 255)' } }} defaultExpandAll filterTreeNode={(node) => node.id === 'leaf'} titleRender={(node) => <>Node {node.name as string}</>} treeData={[{ id: 'root', name: 'Root', nodes: [{ id: 'leaf', name: 'Leaf' }] }]} />);
    expect(screen.getByRole('tree')).toHaveClass('tree-root');
    expect(screen.getByRole('tree')).toHaveStyle({ 'max-height': '120px', overflow: 'auto' });
    expect(screen.getByRole('tree').getAttribute('style')).toContain('border');
    expect(screen.getByText('Node Root')).toHaveClass('tree-title');
    expect(screen.getByText('Node Leaf')).toHaveClass('font-semibold', 'text-primary');
    expect(screen.getByText('Node Leaf')).toHaveStyle({ color: 'rgb(0, 0, 255)' });
    expect(container.querySelectorAll('.tree-item')).toHaveLength(2);
  });

  it('reports Tree pointer and drag lifecycle events', () => {
    const onDoubleClick = vi.fn();
    const onRightClick = vi.fn();
    const onDragStart = vi.fn();
    const onDragEnter = vi.fn();
    const onDragOver = vi.fn();
    const onDrop = vi.fn();
    const onDragEnd = vi.fn();
    render(() => <Tree draggable defaultExpandAll onDoubleClick={onDoubleClick} onRightClick={onRightClick} onDragStart={onDragStart} onDragEnter={onDragEnter} onDragOver={onDragOver} onDrop={onDrop} onDragEnd={onDragEnd} treeData={[{ key: 'root', title: 'Root', children: [{ key: 'leaf', title: 'Leaf' }] }]} />);
    const root = screen.getByRole('treeitem', { name: /Root/ });
    const leaf = screen.getByRole('treeitem', { name: /Leaf/ });
    fireEvent.doubleClick(leaf);
    fireEvent.contextMenu(leaf);
    fireEvent.dragStart(root);
    fireEvent.dragEnter(leaf);
    fireEvent.dragOver(leaf);
    fireEvent.drop(leaf);
    fireEvent.dragEnd(root);
    expect(onDoubleClick).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ key: 'leaf' }));
    expect(onRightClick).toHaveBeenCalledWith(expect.objectContaining({ node: expect.objectContaining({ key: 'leaf' }) }));
    expect(onDragStart).toHaveBeenCalledOnce();
    expect(onDragEnter).toHaveBeenCalledWith(expect.objectContaining({ expandedKeys: ['root'] }));
    expect(onDragOver).toHaveBeenCalledOnce();
    expect(onDrop).toHaveBeenCalledWith(expect.objectContaining({ dragNode: expect.objectContaining({ key: 'root' }), node: expect.objectContaining({ key: 'leaf' }), dragNodesKeys: ['root', 'leaf'] }));
    expect(onDragEnd).toHaveBeenCalledOnce();
  });

  it('registers declarative TreeSelect.TreeNode values', async () => {
    const onChange = vi.fn();
    render(() => <TreeSelect onChange={onChange}><TreeSelect.TreeNode value="engineering" title="Engineering"><TreeSelect.TreeNode value="frontend" title="Frontend" isLeaf /></TreeSelect.TreeNode></TreeSelect>);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(await screen.findByRole('button', { name: 'Expand node' }));
    fireEvent.click(await screen.findByRole('treeitem', { name: /Frontend/ }));
    expect(onChange).toHaveBeenCalledWith('frontend', 'Frontend');
  });

  it('maps simple TreeSelect data and reports expansion', async () => {
    const onChange = vi.fn();
    const onTreeExpand = vi.fn();
    render(() => <TreeSelect treeDataSimpleMode={{ rootPId: null }} fieldNames={{ label: 'name', value: 'id' }} treeDefaultExpandAll treeTitleRender={(node) => <>Node {node.title}</>} treeData={[{ id: 'root', pId: null, name: 'Root' }, { id: 'leaf', pId: 'root', name: 'Leaf' }]} onChange={onChange} onTreeExpand={onTreeExpand} />);
    fireEvent.click(screen.getByRole('combobox'));
    const collapse = await screen.findByRole('button', { name: 'Collapse node' });
    expect(screen.getByRole('treeitem', { name: /Node Leaf/ })).toBeInTheDocument();
    fireEvent.click(collapse);
    expect(onTreeExpand).toHaveBeenCalledWith([]);
    fireEvent.click(screen.getByRole('button', { name: 'Expand node' }));
    fireEvent.click(screen.getByRole('treeitem', { name: /Node Leaf/ }));
    expect(onChange).toHaveBeenCalledWith('leaf', 'Leaf');
  });

  it('reports positional Tree gap drops and provides immutable mutation helpers', () => {
    const onDrop = vi.fn();
    render(() => <Tree draggable onDrop={onDrop} treeData={[{ key: 'a', title: 'A' }, { key: 'b', title: 'B' }]} />);
    const source = screen.getByRole('treeitem', { name: /A/ });
    const target = screen.getByRole('treeitem', { name: /B/ });
    target.getBoundingClientRect = () => ({ top: 0, bottom: 30, left: 0, right: 100, width: 100, height: 30, x: 0, y: 0, toJSON() {} });
    fireEvent.dragStart(source);
    const dragOver = new Event('dragover', { bubbles: true, cancelable: true });
    Object.defineProperty(dragOver, 'clientY', { value: 2 });
    fireEvent(target, dragOver);
    const drop = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(drop, 'clientY', { value: 2 });
    fireEvent(target, drop);
    expect(onDrop).toHaveBeenCalledWith(expect.objectContaining({ dropPosition: -1, dropToGap: true }));

    const original = [{ key: 'parent', title: 'Parent', children: [{ key: 'child', title: 'Child' }] }, { key: 'target', title: 'Target' }];
    const moved = moveTreeNode(original, 'child', 'target', 0);
    expect(original[0].children).toHaveLength(1);
    expect(moved.find((node) => node.key === 'target')?.children?.[0].key).toBe('child');
  });

  it('customizes TreeSelect popup, semantics, tags, and clear lifecycle', async () => {
    const onClear = vi.fn();
    const onDropdownVisibleChange = vi.fn();
    const onPopupScroll = vi.fn();
    render(() => <TreeSelect multiple showSearch allowClear variant="filled" popupMatchSelectWidth={280} maxTagCount={1} maxTagTextLength={3} maxTagPlaceholder={(nodes) => `${nodes.length} hidden`} defaultValue={['alpha', 'beta']} aria-label="Semantic tree select" treeData={[{ key: 'alpha', title: 'Alphabet' }, { key: 'beta', title: 'Beta' }]} classNames={{ root: 'tree-root', panel: 'tree-panel', input: 'tree-input' }} styles={{ panel: { color: 'rgb(0, 0, 255)' } }} popupRender={(menu) => <>{menu}<div>Tree footer</div></>} tagRender={(info) => <button type="button" onClick={info.onClose}>Tree tag {info.label}</button>} onClear={onClear} onDropdownVisibleChange={onDropdownVisibleChange} onPopupScroll={onPopupScroll} />);
    const input = screen.getByRole('textbox', { name: 'Semantic tree select' });
    expect(input.closest('.ads-tree-select')).toHaveClass('tree-root', 'bg-surface-container');
    expect(input).toHaveClass('tree-input');
    expect(screen.getByRole('button', { name: 'Tree tag Alp' })).toBeInTheDocument();
    expect(screen.getByText('1 hidden')).toBeInTheDocument();
    fireEvent.focus(input);
    const panel = await screen.findByText('Tree footer');
    const scrollPanel = panel.parentElement?.querySelector('.tree-panel') as HTMLElement;
    expect(scrollPanel).toHaveStyle({ color: 'rgb(0, 0, 255)' });
    await waitFor(() => expect(screen.getByRole('dialog')).toHaveStyle({ width: '280px' }));
    fireEvent.scroll(scrollPanel);
    expect(onPopupScroll).toHaveBeenCalledOnce();
    expect(onDropdownVisibleChange).toHaveBeenCalledWith(true);
    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('applies TreeSelect checked display strategies and switcher icons', async () => {
    const onChange = vi.fn();
    render(() => <TreeSelect treeCheckable showCheckedStrategy={TreeSelect.SHOW_PARENT} treeDefaultExpandAll switcherIcon={({ expanded }) => expanded ? '-' : '+'} treeData={[{ key: 'parent', title: 'Parent', children: [{ key: 'child', title: 'Child' }] }]} onChange={onChange} />);
    expect(TreeSelect.SHOW_ALL).toBe('SHOW_ALL');
    expect(TreeSelect.SHOW_CHILD).toBe('SHOW_CHILD');
    fireEvent.click(screen.getByRole('combobox'));
    expect(await screen.findByRole('button', { name: 'Collapse node' })).toHaveTextContent('-');
    fireEvent.click(screen.getByRole('checkbox', { name: 'Check Parent' }));
    expect(onChange).toHaveBeenCalledWith(['parent'], ['Parent']);
  });

  it('tracks loaded TreeSelect nodes and avoids duplicate async loads', async () => {
    const loadData = vi.fn(async () => undefined);
    const onLoad = vi.fn();
    render(() => <TreeSelect loadData={loadData} onLoad={onLoad} treeData={[{ key: 'async', title: 'Async' }]} />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(await screen.findByRole('button', { name: 'Expand node' }));
    await waitFor(() => expect(onLoad).toHaveBeenCalledWith(['async'], { node: expect.objectContaining({ key: 'async' }) }));
    fireEvent.click(screen.getByRole('button', { name: 'Collapse node' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Expand node' }));
    expect(loadData).toHaveBeenCalledTimes(1);
  });

  it('filters TreeSelect with a custom node field', async () => {
    render(() => <TreeSelect showSearch aria-label="Custom tree search" treeNodeFilterProp="keywords" treeData={[{ key: 'eng', title: 'Engineering', keywords: 'software' }, { key: 'design', title: 'Design', keywords: 'visual' }]} />);
    const search = screen.getByRole('textbox', { name: 'Custom tree search' });
    fireEvent.focus(search);
    fireEvent.input(search, { target: { value: 'soft' } });
    expect(await screen.findByRole('treeitem', { name: /Engineering/ })).toBeInTheDocument();
    expect(screen.queryByRole('treeitem', { name: /Design/ })).not.toBeInTheDocument();
  });

  it('selects TreeSelect values and submits through Form', async () => {
    const onFinish = vi.fn();
    render(() => (
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="team" label="Team"><TreeSelect placeholder="Select team" treeData={[{ key: 'engineering', title: 'Engineering' }, { key: 'design', title: 'Design' }]} /></Form.Item>
        <Button htmlType="submit">Save team</Button>
      </Form>
    ));
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(await screen.findByRole('treeitem', { name: /Design/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Save team' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ team: 'design' }));
  });

  it('filters searchable TreeSelect nodes', async () => {
    render(() => <TreeSelect showSearch aria-label="Search teams" treeData={[{ key: 'engineering', title: 'Engineering' }, { key: 'design', title: 'Design' }]} />);
    const search = screen.getByRole('textbox', { name: 'Search teams' });
    fireEvent.focus(search);
    fireEvent.input(search, { target: { value: 'eng' } });
    await waitFor(() => expect(screen.queryByRole('treeitem', { name: /Design/ })).not.toBeInTheDocument());
    expect(screen.getByRole('treeitem', { name: /Engineering/ })).toBeInTheDocument();
  });

  it('selects Cascader paths and submits through Form', async () => {
    const onFinish = vi.fn();
    const options = [{ value: 'eu', label: 'Europe', children: [{ value: 'uk', label: 'United Kingdom' }, { value: 'de', label: 'Germany' }] }];
    render(() => (
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="region" label="Region"><Cascader options={options} /></Form.Item>
        <Button htmlType="submit">Save region</Button>
      </Form>
    ));
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(await screen.findByRole('button', { name: /Europe/ }));
    fireEvent.click(await screen.findByRole('button', { name: /Germany/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Save region' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ region: ['eu', 'de'] }));
  });

  it('selects paths in inline Cascader.Panel and supports keyboard movement', async () => {
    const onChange = vi.fn();
    render(() => <Cascader.Panel options={[{ value: 'eu', label: 'Europe', children: [{ value: 'de', label: 'Germany' }, { value: 'fr', label: 'France' }] }, { value: 'asia', label: 'Asia' }]} onChange={onChange} />);
    const europe = screen.getByRole('option', { name: /Europe/ });
    fireEvent.click(europe);
    const germany = await screen.findByRole('option', { name: 'Germany' });
    fireEvent.keyDown(germany, { key: 'ArrowDown' });
    expect(screen.getByRole('option', { name: 'France' })).toHaveFocus();
    fireEvent.click(germany);
    expect(onChange).toHaveBeenCalledWith(['eu', 'de'], expect.arrayContaining([expect.objectContaining({ value: 'eu' }), expect.objectContaining({ value: 'de' })]));
  });

  it('searches Cascader option paths', async () => {
    render(() => <Cascader showSearch aria-label="Search region" options={[{ value: 'eu', label: 'Europe', children: [{ value: 'de', label: 'Germany' }] }, { value: 'asia', label: 'Asia', children: [{ value: 'jp', label: 'Japan' }] }]} />);
    const input = screen.getByRole('textbox', { name: 'Search region' });
    fireEvent.focus(input);
    fireEvent.input(input, { target: { value: 'germ' } });
    expect(await screen.findByRole('button', { name: /Europe \/ Germany/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Japan/ })).not.toBeInTheDocument();
  });

  it('moves Transfer items and submits target keys through Form', async () => {
    const onFinish = vi.fn();
    render(() => (
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="members" label="Members">
          <Transfer dataSource={[{ key: 'ada', title: 'Ada' }, { key: 'grace', title: 'Grace' }]} render={(item) => item.title} />
        </Form.Item>
        <Button htmlType="submit">Save transfer</Button>
      </Form>
    ));
    fireEvent.click(screen.getByRole('listitem', { name: /Ada/ }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Move right' })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: 'Move right' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save transfer' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ members: ['ada'] }));
  });

  it('filters Transfer source lists', async () => {
    render(() => <Transfer showSearch dataSource={[{ key: 'ada', title: 'Ada' }, { key: 'grace', title: 'Grace' }]} render={(item) => item.title} />);
    fireEvent.input(screen.getByRole('textbox', { name: 'Search left list' }), { target: { value: 'gra' } });
    await waitFor(() => expect(screen.queryByRole('listitem', { name: /Ada/ })).not.toBeInTheDocument());
    expect(screen.getByRole('listitem', { name: /Grace/ })).toBeInTheDocument();
  });

  it('uploads files with a custom request and submits them through Form', async () => {
    const onFinish = vi.fn();
    const customRequest = vi.fn((options: { onProgress: (event: { percent: number }) => void; onSuccess: (body: object) => void }) => {
      options.onProgress({ percent: 60 });
      options.onSuccess({ ok: true });
    });
    const { container } = render(() => (
      <Form onFinish={onFinish}>
        <Form.Item name="documents" label="Documents">
          <Upload customRequest={customRequest}><Button>Select file</Button></Upload>
        </Form.Item>
        <Button htmlType="submit">Save upload</Button>
      </Form>
    ));
    const file = new File(['report'], 'report.txt', { type: 'text/plain' });
    fireEvent.change(container.querySelector('input[type="file"]')!, { target: { files: [file] } });
    await screen.findByRole('button', { name: 'report.txt' });
    expect(customRequest).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Save upload' }));
    await waitFor(() => expect((onFinish.mock.calls[0]?.[0].documents as Array<{ status: string }>)[0].status).toBe('done'));
  });

  it('honors Upload.LIST_IGNORE and removes listed files', async () => {
    const onChange = vi.fn();
    const { container } = render(() => <Upload beforeUpload={(file) => file.name.endsWith('.tmp') ? Upload.LIST_IGNORE : false} onChange={onChange}><Button>Choose</Button></Upload>);
    fireEvent.change(container.querySelector('input[type="file"]')!, { target: { files: [new File(['x'], 'skip.tmp'), new File(['x'], 'keep.txt')] } });
    await screen.findByRole('button', { name: 'keep.txt' });
    expect(screen.queryByText('skip.tmp')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Remove file keep.txt' }));
    await waitFor(() => expect(screen.queryByRole('button', { name: 'keep.txt' })).not.toBeInTheDocument());
  });

  it('customizes Upload semantics and file item rendering', () => {
    const { container } = render(() => <Upload defaultFileList={[{ uid: 'ready', name: 'ready.txt', status: 'done' }]} classNames={{ root: 'upload-root', trigger: 'upload-trigger', list: 'upload-list', item: 'upload-item' }} styles={{ item: { color: 'rgb(0, 0, 255)' } }} iconRender={() => <span>FILE</span>} itemRender={(origin) => <article>{origin}<span>Custom item</span></article>}><Button>Choose file</Button></Upload>);
    expect(container.querySelector('.ads-upload')).toHaveClass('upload-root');
    expect(container.querySelector('.upload-trigger')).toBeInTheDocument();
    expect(container.querySelector('.upload-list')).toBeInTheDocument();
    expect(container.querySelector('.upload-item')).toHaveStyle({ color: 'rgb(0, 0, 255)' });
    expect(screen.getByText('FILE')).toBeInTheDocument();
    expect(screen.getByText('Custom item')).toBeInTheDocument();
  });

  it('renders configured Upload progress', async () => {
    const customRequest = (options: { onProgress: (event: { percent: number }) => void }) => options.onProgress({ percent: 42 });
    const { container } = render(() => <Upload customRequest={customRequest} progress={{ strokeWidth: 3, format: (percent) => `${percent} uploaded` }}><Button>Upload progress file</Button></Upload>);
    fireEvent.change(container.querySelector('input[type="file"]')!, { target: { files: [new File(['x'], 'progress.txt')] } });
    expect(await screen.findByText('42 uploaded')).toBeInTheDocument();
  });

  it('accepts pasted and dropped Upload files', async () => {
    const onDrop = vi.fn();
    const pasted = render(() => <Upload pastable beforeUpload={() => false}><Button>Paste file</Button></Upload>);
    const pasteFile = new File(['paste'], 'pasted.txt', { type: 'text/plain' });
    fireEvent.paste(pasted.container.querySelector('.ads-upload')!, { clipboardData: { files: [pasteFile] } });
    expect(await screen.findByRole('button', { name: 'pasted.txt' })).toBeInTheDocument();

    const dropped = render(() => <Upload.Dragger beforeUpload={() => false} onDrop={onDrop}>Drop file</Upload.Dragger>);
    const dropFile = new File(['drop'], 'dropped.txt', { type: 'text/plain' });
    fireEvent.drop(dropped.container.querySelector('[role="button"]')!, { dataTransfer: { files: [dropFile] } });
    expect(await screen.findByRole('button', { name: 'dropped.txt' })).toBeInTheDocument();
    expect(onDrop).toHaveBeenCalledOnce();
  });

  it('navigates Tour steps and finishes the sequence', async () => {
    const onChange = vi.fn();
    const onFinish = vi.fn();
    const target = document.createElement('button');
    target.textContent = 'Target';
    document.body.append(target);
    Object.defineProperty(target, 'getBoundingClientRect', { value: () => ({ top: 20, left: 30, right: 130, bottom: 60, width: 100, height: 40, x: 30, y: 20, toJSON: () => ({}) }) });
    render(() => <Tour defaultOpen steps={[{ target, title: 'First', description: 'Start here' }, { title: 'Second' }]} onChange={onChange} onFinish={onFinish} />);
    expect(await screen.findByRole('dialog')).toHaveTextContent('First');
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() => expect(screen.getByRole('dialog')).toHaveTextContent('Second'));
    expect(onChange).toHaveBeenCalledWith(1);
    fireEvent.click(screen.getByRole('button', { name: 'Finish' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(onFinish).toHaveBeenCalledOnce();
    target.remove();
  });

  it('updates and destroys imperative Modal instances', async () => {
    const instance = Modal.info({ title: 'Initial title', content: 'Initial content' });
    expect(await screen.findByRole('dialog')).toHaveTextContent('Initial content');
    instance.update({ title: 'Updated title', content: 'Updated content' });
    await waitFor(() => expect(screen.getByRole('dialog')).toHaveTextContent('Updated content'));
    expect(screen.getByRole('dialog')).toHaveTextContent('Updated title');
    instance.destroy();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('uses the configured imperative renderer for static services', async () => {
    const customRender = vi.fn((code: () => any, container: HTMLElement) => renderSolid(code, container));
    unstableSetRender(customRender);
    const instance = Modal.info({ title: 'Custom renderer', content: 'Mounted' });
    expect(customRender).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Mounted')).toBeInTheDocument();
    instance.destroy();
    unstableSetRender(renderSolid);
    await waitFor(() => expect(screen.queryByText('Mounted')).not.toBeInTheDocument());
  });

  it('keeps static Modal open when onOk resolves false and exposes useModal', async () => {
    const onOk = vi.fn(() => false);
    const [api, holder] = Modal.useModal();
    expect(holder).toBeNull();
    const instance = api.confirm({ title: 'Keep open', content: 'Review first', onOk });
    await screen.findByRole('dialog');
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    await waitFor(() => expect(onOk).toHaveBeenCalledOnce());
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    instance.destroy();
  });

  it('provides message and modal services through App.useApp', async () => {
    const onOk = vi.fn();
    function Consumer() {
      const api = App.useApp();
      return <><Button onClick={() => api.message.success({ content: 'Saved in App', duration: 0 })}>Show app message</Button><Button onClick={() => api.modal.confirm({ title: 'Delete entry', content: 'This cannot be undone', onOk })}>Show app modal</Button></>;
    }
    render(() => <App><Consumer /></App>);
    fireEvent.click(screen.getByRole('button', { name: 'Show app message' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Saved in App');
    fireEvent.click(screen.getByRole('button', { name: 'Show app modal' }));
    expect(await screen.findByRole('dialog')).toHaveTextContent('Delete entry');
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(onOk).toHaveBeenCalledOnce();
    message.destroy();
  });

  it('closes a themed drawer with Escape and restores trigger focus', async () => {
    const Example = () => {
      const [open, setOpen] = createSignal(false);
      return (
        <ConfigProvider theme={{ colorPrimary: '#654321' }}>
          <Button onClick={() => setOpen(true)}>Open drawer</Button>
          <Drawer open={open()} title="Edit settings" width={420} onClose={() => setOpen(false)}>
            <Input autofocus aria-label="Setting name" />
          </Drawer>
        </ConfigProvider>
      );
    };
    render(() => <Example />);
    const trigger = screen.getByRole('button', { name: 'Open drawer' });
    trigger.focus();
    fireEvent.click(trigger);

    const dialog = await screen.findByRole('dialog', { name: 'Edit settings' });
    expect(dialog).toHaveStyle({ width: '420px' });
    expect(dialog.closest('.ads-drawer-root')).toHaveStyle({ '--ads-color-primary': '#654321' });
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Setting name' })).toHaveFocus());

    fireEvent.keyDown(dialog, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Edit settings' })).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('supports bottom drawer sizing and mask cancellation', () => {
    const onClose = vi.fn();
    render(() => <Drawer open title="Activity" placement="bottom" height={240} onClose={onClose}>Recent activity</Drawer>);
    const dialog = screen.getByRole('dialog', { name: 'Activity' });
    expect(dialog).toHaveStyle({ width: '100%', height: '240px' });

    const mask = dialog.parentElement!.querySelector('[aria-hidden="true"]')!;
    fireEvent.click(mask);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('keeps body scrolling locked until all overlays close', async () => {
    const Example = () => {
      const [modalOpen, setModalOpen] = createSignal(true);
      const [drawerOpen, setDrawerOpen] = createSignal(true);
      return (
        <>
          <Modal open={modalOpen()} title="Modal layer" onCancel={() => setModalOpen(false)}>Modal</Modal>
          <Drawer open={drawerOpen()} title="Drawer layer" onClose={() => setDrawerOpen(false)}>Drawer</Drawer>
        </>
      );
    };
    render(() => <Example />);
    const modal = await screen.findByRole('dialog', { name: 'Modal layer' });
    const drawer = screen.getByRole('dialog', { name: 'Drawer layer' });
    expect(document.body).toHaveStyle({ overflow: 'hidden' });

    fireEvent.keyDown(modal, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Modal layer' })).not.toBeInTheDocument());
    expect(document.body).toHaveStyle({ overflow: 'hidden' });

    fireEvent.keyDown(drawer, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Drawer layer' })).not.toBeInTheDocument());
    expect(document.body.style.overflow).toBe('');
  });

  it('closes a modal with Escape, restores focus, and carries scoped tokens into its portal', async () => {
    const onCancel = vi.fn();
    const Example = () => {
      const [open, setOpen] = createSignal(false);
      return (
        <ConfigProvider theme={{ colorPrimary: '#123456' }}>
          <Button onClick={() => setOpen(true)}>Open dialog</Button>
          <Modal open={open()} title="Edit profile" onCancel={(event) => { onCancel(event); setOpen(false); }}>
            <Input autofocus aria-label="Display name" />
          </Modal>
        </ConfigProvider>
      );
    };
    render(() => <Example />);

    const trigger = screen.getByRole('button', { name: 'Open dialog' });
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Edit profile' });
    expect(dialog.closest('.ads-modal-root')).toHaveStyle({ '--ads-color-primary': '#123456' });
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Display name' })).toHaveFocus());

    fireEvent.keyDown(dialog, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(onCancel).toHaveBeenCalledOnce();
    expect(trigger).toHaveFocus();
  });

  it('closes a controlled Modal from the default cancel button', async () => {
    const [open, setOpen] = createSignal(true);
    render(() => <Modal open={open()} title="Cancelable modal" onCancel={() => setOpen(false)}>Body</Modal>);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Cancelable modal' })).not.toBeInTheDocument());
  });

  it('only treats direct mask-positioner presses as modal cancellation', () => {
    const onCancel = vi.fn();
    render(() => <Modal open title="Confirm" onCancel={onCancel}>Body</Modal>);
    const dialog = screen.getByRole('dialog', { name: 'Confirm' });

    fireEvent.click(dialog);
    expect(onCancel).not.toHaveBeenCalled();
    fireEvent.click(dialog.parentElement!);
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('preserves modal content by default and destroys it on hidden when requested', async () => {
    let setOpen!: (open: boolean) => void;
    const Example = (props: { destroy?: boolean }) => {
      const [open, updateOpen] = createSignal(true);
      setOpen = updateOpen;
      return <Modal open={open()} title="Stateful" destroyOnHidden={props.destroy}><Input aria-label="Draft" /></Modal>;
    };
    const view = render(() => <Example />);
    const draft = screen.getByRole('textbox', { name: 'Draft' });
    fireEvent.input(draft, { target: { value: 'preserved' } });
    setOpen(false);
    expect(document.body.contains(draft)).toBe(true);
    setOpen(true);
    expect(screen.getByRole('textbox', { name: 'Draft' })).toBe(draft);
    expect(draft).toHaveValue('preserved');

    view.unmount();
    render(() => <Example destroy />);
    const disposable = screen.getByRole('textbox', { name: 'Draft' });
    setOpen(false);
    await waitFor(() => expect(document.body.contains(disposable)).toBe(false));
  });

  it('supports Modal v6 lifecycle, rendering, mask, loading, and semantic configuration', async () => {
    const afterClose = vi.fn();
    const closeAfterClose = vi.fn();
    const closeAction = vi.fn();
    let setOpen!: (open: boolean) => void;
    let setLoading!: (loading: boolean) => void;
    const Example = () => {
      const [open, updateOpen] = createSignal(true);
      const [loading, updateLoading] = createSignal(true);
      setOpen = updateOpen;
      setLoading = updateLoading;
      return (
        <Modal
          open={open()}
          title="Advanced modal"
          loading={loading()}
          scrollLock={false}
          mask={{ blur: true, closable: false }}
          closable={{ disabled: true, onClose: closeAction, afterClose: closeAfterClose }}
          afterClose={afterClose}
          classNames={{ root: 'semantic-root', mask: 'semantic-mask', container: 'semantic-container', close: 'semantic-close' }}
          styles={{ body: { color: 'rgb(1, 2, 3)' } }}
          footer={(origin, { OkBtn }) => <>{origin}<span>Extra action</span><OkBtn /></>}
          modalRender={(node) => <section data-testid="modal-renderer">{node}</section>}
        >
          Hidden content
        </Modal>
      );
    };
    render(() => <Example />);

    const dialog = screen.getByRole('dialog', { name: 'Advanced modal' });
    expect(dialog).toHaveAttribute('aria-busy', 'true');
    expect(dialog).toHaveClass('semantic-container');
    expect(dialog.closest('.semantic-root')).toBeTruthy();
    expect(screen.getByTestId('modal-renderer')).toContainElement(dialog);
    expect(document.querySelector('.semantic-mask')).toHaveClass('backdrop-blur-sm');
    expect(screen.getByRole('button', { name: 'Close' })).toBeDisabled();
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
    fireEvent.click(dialog.parentElement!);
    expect(closeAction).not.toHaveBeenCalled();

    setLoading(false);
    await waitFor(() => expect(screen.getByText('Hidden content')).toBeInTheDocument());
    expect(screen.getByText('Extra action')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'OK' })).toHaveLength(2);

    setOpen(false);
    await waitFor(() => expect(afterClose).toHaveBeenCalledOnce());
    expect(closeAfterClose).toHaveBeenCalledOnce();
  });
});
