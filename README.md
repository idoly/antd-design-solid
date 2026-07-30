# ant-design-solid

An Ant Design v6 component port for Solid `2.0.0-beta.28`, styled with Tailwind CSS v4 and `tailwind-variants`.

## Status

The public visual component families from `antd@6.5.2` are implemented and exported. Coverage includes:

- General and layout: `App`, `Button`, `ConfigProvider`, `Divider`, `Flex`, `Grid`, `Layout`, `Space`
- Navigation: `Affix`, `Anchor`, `Breadcrumb`, `Dropdown`, `FloatButton`, `Menu`, `Pagination`, `Steps`
- Data entry: `AutoComplete`, `Cascader`, `Checkbox`, `ColorPicker`, `DatePicker`, `Form`, `Input` (TextArea/Search/Password/OTP), `InputNumber`, `Mentions`, `Radio`, `Rate`, `Segmented`, `Select`, `Slider`, `Switch`, `TimePicker`, `Transfer`, `TreeSelect`, `Upload`
- Data display: `Avatar`, `Badge` (Ribbon), `Calendar`, `Card` (Meta/Grid), `Carousel`, `Collapse`, `Descriptions`, `Empty`, `Image`, `List`, `Popover`, `QRCode`, `Statistic`, `Table`, `Tabs`, `Tag` (CheckableTag/Group), `Timeline`, `Tooltip`, `Tour`, `Tree`, `Typography`
- Feedback: `Alert` (ErrorBoundary), `Drawer`, `message`, `Modal`, `notification`, `Popconfirm`, `Progress`, `Result`, `Skeleton`, `Spin`
- Ant v6 additions: `BorderBeam`, `Masonry`, `Splitter`, `Watermark`

See [COVERAGE.md](./COVERAGE.md) for the component-family matrix and [COMPATIBILITY.md](./COMPATIBILITY.md) for the official CLI prop-gap audit and prioritized parity roadmap.

The visual system follows Ant Design v6 tokens: 14px base typography, a 4px spacing grid, 6px controls, 8px surfaces, semantic status colors, and restrained elevation. Components include public TypeScript APIs, controlled and uncontrolled state where applicable, keyboard/ARIA behavior, package declarations, and behavioral tests.

## Development

```bash
npm install --legacy-peer-deps
npx playwright install chromium
npm run dev
npm run check
```

`--legacy-peer-deps` is currently required because `@solidjs/testing-library` declares stable Solid 2 peer ranges while the runtime remains a prerelease; `vite-plugin-solid@3.0.0-next.20` explicitly supports beta.28. `npm run check` includes Playwright Chromium desktop/mobile and Firefox tests; the host must provide their system libraries. WebKit is enabled with `PLAYWRIGHT_INCLUDE_WEBKIT=1` and is mandatory in Ubuntu CI. Fedora cannot directly run Playwright's Ubuntu WebKit build because its ICU and media-library ABIs differ, so the locally verified WebKit gate uses rootless Podman with the exact Playwright `1.62.0` Noble image:

```bash
npm run test:e2e:webkit:container:pull
npm run test:e2e:webkit:container
```

Keep the image tag synchronized with the installed Playwright version. The container gate is explicit rather than part of ordinary `npm run check`, avoiding a large image/runtime requirement for every local check. `npm run test:e2e:system` additionally verifies the server-installed `/usr/sbin/chromium-browser`; override `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` when it is installed elsewhere.

The local component workbench runs at `http://localhost:5173/`.

## Usage

```tsx
import { App, Button, ConfigProvider, Form, Input, message } from 'ant-design-solid';
import 'ant-design-solid/styles.css';

export function WorkspaceForm() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#1677ff' } }}>
      <App>
        <Form onFinish={() => message.success('Saved')}>
          <Form.Item name="workspace" label="Workspace" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">Save</Button>
        </Form>
      </App>
    </ConfigProvider>
  );
}
```

The package is precompiled with Tailwind. Consumers do not need to scan package sources in their Tailwind configuration. Conditional exports provide a client bundle for browser builds and a server-compiled bundle for Solid SSR.

Component subpaths resolve to the same shared runtime, so contexts and service singletons are not duplicated:

```tsx
import Button, { type ButtonProps } from 'ant-design-solid/button';
import Select, { type SelectProps } from 'ant-design-solid/select';
import theme from 'ant-design-solid/theme';
```

Input components bind automatically to the nearest named `Form.Item`. Form rules support required, type, length, range, pattern, whitespace, and custom async validation. Form supports nested name paths, dynamic `Form.List`, Provider events, `useForm`, `useFormInstance`, `useWatch`, and `Form.Item.useStatus`.

Compatibility-style compound APIs are implemented, including declarative Select/AutoComplete/Mentions options, Menu and Tree child nodes, Tabs.TabPane, Cascader.Panel, Table columns/groups/summary, DatePicker shortcuts and generators, Grid.useBreakpoint, Statistic.Timer, and Tooltip.UniqueProvider.

All component subpaths provide Ant-compatible default exports and named exports. Browser and SSR subpaths share the same ConfigContext and service singletons. The package also provides `reset.css` and the complete official locale directory, for example `import frFR from 'ant-design-solid/locale/fr_FR'`.

Portaled components preserve scoped `ConfigProvider` token values. ConfigProvider accepts flat legacy tokens or `{ token, algorithm, components }`; component token overrides produce nested, CSP-aware scoped variables. `theme` exports default, dark, and compact algorithms plus `useToken` and `getDesignToken`. Floating controls use Floating UI for collision-aware positioning. `App.useApp()` exposes message, notification, and modal services from component context. `Modal.confirm/info/success/error/warning`, `Modal.destroyAll()`, and `Modal.useModal()` share the same imperative service implementation.

## Versioning

The package version and Solid peer version are independent. The package is currently `0.1.0`; `solid-js` remains pinned to `2.0.0-beta.28` until the beta API stabilizes.
