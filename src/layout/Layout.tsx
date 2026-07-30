import { createContext, createEffect, createSignal, createUniqueId, merge, omit, onCleanup, Show, useContext } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { useConfig } from '../config-provider';

interface LayoutContextValue {
  addSider: (id: string) => void;
  removeSider: (id: string) => void;
}

const LayoutContext = createContext<LayoutContextValue | null>(null);

export interface LayoutProps extends Omit<JSX.HTMLAttributes<HTMLElement>, 'style'> {
  hasSider?: boolean;
  style?: JSX.CSSProperties;
}

export type SiderSemanticName = 'root' | 'body';
export type SiderSemanticClassNames = Partial<Record<SiderSemanticName, string>>;
export type SiderSemanticStyles = Partial<Record<SiderSemanticName, JSX.CSSProperties>>;

export interface SiderProps extends Omit<JSX.HTMLAttributes<HTMLElement>, 'onCollapse' | 'style'> {
  breakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  collapsedWidth?: number;
  collapsible?: boolean;
  reverseArrow?: boolean;
  trigger?: JSX.Element | null;
  width?: number | string;
  zeroWidthTriggerStyle?: JSX.CSSProperties;
  theme?: 'light' | 'dark';
  classNames?: SiderSemanticClassNames;
  styles?: SiderSemanticStyles;
  style?: JSX.CSSProperties;
  onBreakpoint?: (broken: boolean) => void;
  onCollapse?: (collapsed: boolean, type: 'clickTrigger' | 'responsive') => void;
}

const breakpoints = { xs: 480, sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1600, xxxl: 2000 } as const;

function LayoutRoot(inputProps: LayoutProps) {
  const props = merge({ hasSider: false }, inputProps);
  const [siders, setSiders] = createSignal<readonly string[]>([], { ownedWrite: true });
  let currentSiders: readonly string[] = [];
  const others = omit(props, 'hasSider', 'style', 'class');
  const updateSiders = (next: readonly string[]) => {
    currentSiders = next;
    setSiders(next);
  };
  const context: LayoutContextValue = {
    addSider(id) {
      if (!currentSiders.includes(id)) updateSiders([...currentSiders, id]);
    },
    removeSider(id) {
      updateSiders(currentSiders.filter((item) => item !== id));
    },
  };
  const hasSider = () => props.hasSider || siders().length > 0;

  return (
    <LayoutContext value={context}>
      <section {...others} class={['ads-layout flex min-h-0 min-w-0 flex-auto bg-surface-layout', hasSider() ? 'flex-row' : 'flex-col', props.class]} style={props.style}>
        {props.children}
      </section>
    </LayoutContext>
  );
}

export function Header(props: JSX.HTMLAttributes<HTMLElement>) {
  const others = omit(props, 'class');
  return <header {...others} class={['ads-layout-header h-16 shrink-0 bg-[#001529] px-12 text-white', props.class]}>{props.children}</header>;
}

export function Footer(props: JSX.HTMLAttributes<HTMLElement>) {
  const others = omit(props, 'class');
  return <footer {...others} class={['ads-layout-footer shrink-0 bg-surface-layout px-12 py-6 text-text', props.class]}>{props.children}</footer>;
}

export function Content(props: JSX.HTMLAttributes<HTMLElement>) {
  const others = omit(props, 'class');
  return <main {...others} class={['ads-layout-content min-h-0 min-w-0 flex-auto', props.class]}>{props.children}</main>;
}

export function Sider(inputProps: SiderProps) {
  const config = useConfig();
  const props = merge({ defaultCollapsed: false, collapsedWidth: 80, collapsible: false, width: 200, theme: 'dark' as const }, config.componentDefaults('layout') as Partial<SiderProps>, inputProps);
  const parent = useContext(LayoutContext);
  const id = createUniqueId();
  const [internalCollapsed, setInternalCollapsed] = createSignal(Boolean(props.defaultCollapsed), { ownedWrite: true });
  const others = omit(
    props,
    'breakpoint', 'collapsed', 'defaultCollapsed', 'collapsedWidth', 'collapsible',
    'reverseArrow', 'trigger', 'width', 'zeroWidthTriggerStyle', 'theme', 'classNames', 'styles', 'style', 'onBreakpoint',
    'onCollapse', 'children', 'class',
  );
  parent?.addSider(id);
  onCleanup(() => parent?.removeSider(id));
  const collapsed = () => props.collapsed ?? internalCollapsed();
  const numericWidth = () => collapsed() ? props.collapsedWidth : props.width;
  const width = () => typeof numericWidth() === 'number' ? `${numericWidth()}px` : numericWidth();
  const setCollapsed = (next: boolean, type: 'clickTrigger' | 'responsive') => {
    if (props.collapsed === undefined) setInternalCollapsed(next);
    props.onCollapse?.(next, type);
  };

  createEffect(
    () => props.breakpoint,
    (breakpoint) => {
      if (!breakpoint || typeof window === 'undefined') return;
      const media = window.matchMedia(`(max-width: ${breakpoints[breakpoint] - 0.02}px)`);
      const change = (event: MediaQueryListEvent | MediaQueryList) => {
        props.onBreakpoint?.(event.matches);
        setCollapsed(event.matches, 'responsive');
      };
      change(media);
      media.addEventListener('change', change);
      return () => media.removeEventListener('change', change);
    },
  );

  const defaultTrigger = () => props.reverseArrow ? (collapsed() ? '<' : '>') : (collapsed() ? '>' : '<');
  const siderStyle = (): JSX.CSSProperties => ({
    width: width(),
    'min-width': width(),
    'max-width': width(),
    ...props.style,
    ...props.styles?.root,
  } as JSX.CSSProperties);
  return (
    <aside
      {...others}
      class={['ads-layout-sider relative shrink-0 transition-[width] duration-[var(--ads-motion-mid)]', props.theme === 'light' ? 'bg-surface text-text' : 'bg-[#001529] text-white', props.class, props.classNames?.root]}
      style={siderStyle()}
      data-collapsed={collapsed() ? 'true' : 'false'}
    >
      <div class={['h-full overflow-hidden', props.classNames?.body]} style={props.styles?.body}>{props.children}</div>
      <Show when={props.collapsible && props.trigger !== null}>
        <button
          type="button"
          aria-label={collapsed() ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={collapsed() ? 'false' : 'true'}
          class={props.collapsedWidth === 0 && collapsed()
            ? 'absolute bottom-16 left-full z-10 flex h-12 w-9 items-center justify-center rounded-r-control bg-[#001529] text-white'
            : 'absolute inset-x-0 bottom-0 flex h-12 items-center justify-center bg-black/20 text-white hover:bg-black/30'}
          style={props.collapsedWidth === 0 && collapsed() ? props.zeroWidthTriggerStyle : undefined}
          onClick={() => setCollapsed(!collapsed(), 'clickTrigger')}
        >
          {props.trigger ?? defaultTrigger()}
        </button>
      </Show>
    </aside>
  );
}

export const Layout = Object.assign(LayoutRoot, { Header, Footer, Content, Sider });
