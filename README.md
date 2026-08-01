# @idoly/ant-design-solid

An Ant Design v6 component port for Solid `2.0.0-beta.29`, styled with Tailwind CSS v4 and `tailwind-variants`.

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

`--legacy-peer-deps` is currently required because `@solidjs/testing-library` declares stable Solid 2 peer ranges while the runtime remains a prerelease; `vite-plugin-solid@3.0.0-next.21` explicitly supports beta.29. Ordinary local `npm run check` includes the pinned Playwright Chromium desktop/mobile projects. CI additionally runs Firefox and WebKit after installing their Ubuntu dependencies. Fedora cannot directly run Playwright's Ubuntu Firefox or WebKit builds because their GTK, ICU, and media-library ABIs differ, so the locally verified cross-browser gates use rootless Podman with the exact Playwright `1.62.0` Noble image:

```bash
npm run test:e2e:webkit:container:pull
npm run test:e2e:webkit:container
```

Keep the image tag synchronized with the installed Playwright version. The container gates are explicit rather than part of ordinary `npm run check`, avoiding a large image/runtime requirement for every local check. `npm run test:e2e:system` runs the desktop/mobile Chromium and Firefox projects in the same rootless Podman image, so it does not require a system-installed browser. CI and release workflows set `PLAYWRIGHT_SKIP_SCREENSHOTS=1` because distro font rasterization is not pixel-identical; Chromium screenshot baselines remain enforced on the pinned local baseline host while CI enforces browser behavior, accessibility, performance, layout overflow, and computed CSS.

The local component workbench runs at `http://localhost:5173/`.

## Usage

```bash
npm install @idoly/ant-design-solid solid-js@2.0.0-beta.29 @solidjs/web@2.0.0-beta.29
```

```tsx
import {
  App,
  Button,
  ConfigProvider,
  Form,
  Input,
  message,
} from "@idoly/ant-design-solid";
import "@idoly/ant-design-solid/base.css";
import "@idoly/ant-design-solid/app/style.css";
import "@idoly/ant-design-solid/button/style.css";
import "@idoly/ant-design-solid/form/style.css";
import "@idoly/ant-design-solid/input/style.css";
import "@idoly/ant-design-solid/message/style.css";

export function WorkspaceForm() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#1677ff" } }}>
      <App>
        <Form onFinish={() => message.success("Saved")}>
          <Form.Item
            name="workspace"
            label="Workspace"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form>
      </App>
    </ConfigProvider>
  );
}
```

The package is precompiled with Tailwind. Consumers do not need to scan package sources in their Tailwind configuration. Conditional exports provide a client bundle for browser builds and a server-compiled bundle for Solid SSR.

Load the shared reset/token layer exactly once, then import styles for the components in use:

```tsx
import "@idoly/ant-design-solid/base.css";
import "@idoly/ant-design-solid/button/style.css";
import "@idoly/ant-design-solid/select/style.css";
import "@idoly/ant-design-solid/tooltip/style.css";
```

No aggregate stylesheet is published. `base.css` contains reset, theme declarations, and high-frequency shared utilities; component styles contain the remaining dependency-specific rules, so `base.css` is required.

Component subpaths resolve to the same shared runtime, so contexts and service singletons are not duplicated. Prefer subpaths in small applications so the client and SSR graphs do not load unrelated component implementations or optional dependencies such as `dayjs` and `qrcode`:

```tsx
import Button, { type ButtonProps } from "@idoly/ant-design-solid/button";
import Select, { type SelectProps } from "@idoly/ant-design-solid/select";
import theme from "@idoly/ant-design-solid/theme";
```

JavaScript and CSS both support component-level loading. Component styles are generated from the public entry's transitive source dependencies, so compound components such as BackTop include the FloatButton, Badge, and Tooltip utilities they require.

Input components bind automatically to the nearest named `Form.Item`. Form rules support required, type, length, range, pattern, whitespace, and custom async validation. Form supports nested name paths, dynamic `Form.List`, Provider events, `useForm`, `useFormInstance`, `useWatch`, and `Form.Item.useStatus`.

Compatibility-style compound APIs are implemented, including declarative Select/AutoComplete/Mentions options, Menu and Tree child nodes, Tabs.TabPane, Cascader.Panel, Table columns/groups/summary, DatePicker shortcuts and generators, Grid.useBreakpoint, Statistic.Timer, and Tooltip.UniqueProvider.

All component subpaths provide Ant-compatible default exports and named exports. Browser and SSR subpaths share the same ConfigContext and service singletons. The package provides the complete official locale directory, for example `import frFR from '@idoly/ant-design-solid/locale/fr_FR'`.

Portaled components preserve scoped `ConfigProvider` token values. ConfigProvider accepts flat legacy tokens or `{ token, algorithm, components }`; component token overrides produce nested, CSP-aware scoped variables. `theme` exports default, dark, and compact algorithms plus `useToken` and `getDesignToken`. Floating controls use Floating UI for collision-aware positioning. `App.useApp()` exposes message, notification, and modal services from component context. `Modal.confirm/info/success/error/warning`, `Modal.destroyAll()`, and `Modal.useModal()` share the same imperative service implementation.

## Reactive themes

Pass a memoized theme config to make Solid signals update global and component tokens without remounting children:

```tsx
import { createMemo, createSignal } from "solid-js";
import { Button, ConfigProvider, theme } from "@idoly/ant-design-solid";

export function ThemeControls() {
  const [dark, setDark] = createSignal(false);
  const [primary, setPrimary] = createSignal("#1677ff");
  const config = createMemo(() => ({
    token: { colorPrimary: primary() },
    algorithm: dark() ? theme.darkAlgorithm : undefined,
    components: {
      Button: { focusRing: `0 0 0 3px ${primary()}33` },
      Tooltip: { colorBg: dark() ? "#f5f5f5" : "#111111", colorText: dark() ? "#111111" : "#ffffff" },
    },
  }));

  return (
    <ConfigProvider theme={config()}>
      <Button onClick={() => setDark(!dark())}>Toggle theme</Button>
      <input type="color" value={primary()} onInput={(event) => setPrimary(event.currentTarget.value)} />
    </ConfigProvider>
  );
}
```

Component token names are typed and emitted as stable `--ads-<component>-<token>` variables inside the provider scope. Button, Tooltip, and FloatButton expose state variables including focus rings, hover colors, and active transforms.

## Overlay state and portals

`open` plus `onOpenChange` is the controlled contract. `defaultOpen` selects uncontrolled state. Drawer and Modal use `onClose`; Tooltip, Popover, Dropdown, Select, and DatePicker use `onOpenChange` or their documented compatibility alias.

```tsx
const [open, setOpen] = createSignal(false);

<Tooltip title="Account settings" open={open()} onOpenChange={setOpen} trigger="click">
  <Button>Account</Button>
</Tooltip>
```

`ConfigProvider.getPopupContainer` establishes the default portal host, while a component `getPopupContainer` prop takes precedence. Resolve DOM containers lazily and only in the browser. The package ships separate Solid SSR entries and does not access a configured portal container until the component mounts; browser and SSR entries share public types and hydration markup contracts. Modal and Drawer restore focus to the previously active element when their focus-management options are enabled.

## Semantic DOM

For native controls such as Button and FloatButton, `class`, `style`, and native HTML attributes target the primary interactive element. Complex components expose `classNames` and `styles` for stable internal slots; consult the exported semantic types when their root and primary element differ:

| Component | Stable slots |
| --- | --- |
| Button | `root`, `icon`, `content` |
| FloatButton / BackTop | `root`, `trigger`, `icon`, `content` |
| Tooltip | `root`, `container`, `arrow` |
| Drawer | `root`, `mask`, `section`, `header`, `title`, `extra`, `close`, `body`, `footer`, `dragger` |
| Modal | `root`, `mask`, `wrapper`, `container`, `header`, `title`, `close`, `body`, `footer` |
| Collapse | `root`, `header`, `icon`, `title`, `body` |

The exported `*SemanticClassNames` and `*SemanticStyles` types are the authoritative slot list for each component. FloatButton's `root` is the stable outer layout node and `trigger` is the actual `button` or `a`; `class`, `style`, `data-*`, ARIA attributes, and `ref.nativeElement` all target that trigger.

Tooltip keeps its compatibility wrapper for ordinary children. Use `triggerRender` when a grid/flex item must remain the direct layout child:

```tsx
<Tooltip
  title="Pin item"
  triggerRender={(triggerProps) => (
    <button {...triggerProps} type="button" aria-label="Pin item">Pin</button>
  )}
/>
```

Spread all supplied trigger props so positioning, ARIA linkage, hover/focus/click handling, and the native ref remain attached. FloatButton and BackTop apply this direct-root behavior internally, including when their semantic root uses fixed positioning.

Tooltip popups are non-interactive and do not receive pointer input, so they cannot cover or block their trigger. Use Popover when the floating content contains links, buttons, or other interactive controls.

## React antd differences

- Components are Solid functions and accept Solid JSX/events; React elements, hooks, and `cloneElement` patterns do not apply.
- `triggerRender` is the no-wrapper Tooltip API instead of React-style child cloning.
- Imperative services render through the Solid service host and `App` context.
- Advanced parity status and deliberate gaps are maintained in [COMPATIBILITY.md](./COMPATIBILITY.md).
- Component styles are available only through `@idoly/ant-design-solid/<component>/style.css` and require one `base.css` import.

## Versioning

The package version and Solid peer version are independent. The package is currently `0.2.4`; `solid-js` remains pinned to `2.0.0-beta.29` until the beta API stabilizes.
