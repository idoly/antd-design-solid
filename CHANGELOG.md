# Changelog

Notable changes to `@idoly/ant-design-solid` are documented here. Until the public API stabilizes, minor and patch releases may contain compatibility changes called out in this file.

## 0.2.2 - 2026-08-01

### Changed

- Enforce absolute virtual-table timing and heap budgets only in an explicitly controlled benchmark environment; shared CI runners continue to verify virtualization behavior and DOM bounds.
- Split CI and release checks into individually visible audit, typecheck, test, build, and browser steps for actionable failure reporting.

## 0.2.1 - 2026-08-01

### Changed

- Retry a failed Playwright test once in CI while keeping local runs fail-fast. Persistent browser failures still block releases.

## 0.2.0 - 2026-08-01

### Added

- Stable FloatButton and BackTop `trigger` semantic slots for the native button or link.
- Tooltip `triggerRender` for wrapper-free grid and flex integration.
- Typed Button, FloatButton, and Tooltip interaction tokens with public scoped CSS variables.
- Client and SSR package checks that reject unrelated DatePicker and QRCode dependencies in the Button subpath graph.
- Component-level CSS exports at `<component>/style.css`, backed by a shared `base.css` reset, token, and high-frequency utility layer.

### Changed

- FloatButton `class`, `style`, native attributes, and `ref.nativeElement` now consistently target the native interactive element. Use `classNames.root` and `styles.root` for the outer layout node.
- Button and FloatButton use a consistent `focus-visible`, active, hover, and disabled state contract.
- SSR component subpaths are independently chunked instead of re-exporting the complete root entry.
- High-frequency Tailwind utilities are promoted into `base.css` to reduce repeated CSS across multi-component applications, with package-level gzip budgets for representative workflows.
- The supported Node.js range is `>=20.19.0`, matching the minimum required by the current build toolchain.

### Removed

- Aggregate `styles.css`, `reset.css`, and `style` package exports. Applications must import `base.css` once and the styles for each component they use.

## 0.1.0

- Initial public release with Ant Design v6 component APIs for Solid `2.0.0-beta.29`.
