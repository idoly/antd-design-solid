import { createContext, createSignal, createUniqueId, For, merge, omit, onCleanup, Show, useContext } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { useConfig } from '../config-provider';

export type SplitterSemanticName = 'root' | 'panel' | 'dragger';
export type SplitterSemanticClassNames = Partial<Record<SplitterSemanticName, string>>;
export type SplitterSemanticStyles = Partial<Record<SplitterSemanticName, JSX.CSSProperties>>;

export interface SplitterPanelProps {
  class?: string;
  style?: JSX.CSSProperties;
  min?: number | string;
  max?: number | string;
  size?: number | string;
  defaultSize?: number | string;
  collapsible?: boolean | { start?: boolean; end?: boolean };
  resizable?: boolean;
  destroyOnHidden?: boolean;
  children?: JSX.Element;
}

export interface SplitterProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onResize' | 'onResizeStart' | 'onResizeEnd'> {
  orientation?: 'horizontal' | 'vertical';
  layout?: 'horizontal' | 'vertical';
  vertical?: boolean;
  lazy?: boolean;
  destroyOnHidden?: boolean;
  draggerIcon?: JSX.Element;
  onDraggerDoubleClick?: (index: number) => void;
  onResizeStart?: (sizes: number[]) => void;
  onResize?: (sizes: number[]) => void;
  onResizeEnd?: (sizes: number[]) => void;
  onCollapse?: (collapsed: boolean[], sizes: number[]) => void;
  classNames?: SplitterSemanticClassNames;
  styles?: SplitterSemanticStyles;
}

interface PanelRegistration { id: string; props: SplitterPanelProps }
interface SplitterContextValue { register: (panel: PanelRegistration) => void; unregister: (id: string) => void }
const SplitterContext = createContext<SplitterContextValue | null>(null);

const percentage = (value: number | string | undefined, fallback: number): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number.parseFloat(value) || fallback;
  return fallback;
};

export function SplitterPanel(props: SplitterPanelProps) {
  const context = useContext(SplitterContext);
  const id = createUniqueId();
  context?.register({ id, props });
  onCleanup(() => context?.unregister(id));
  return null;
}

function SplitterRoot(inputProps: SplitterProps) {
  const config = useConfig();
  const props = merge({ orientation: undefined, layout: 'horizontal' as const, vertical: false }, config.componentDefaults('splitter') as Partial<SplitterProps>, inputProps);
  const [panels, setPanels] = createSignal<readonly PanelRegistration[]>([], { ownedWrite: true });
  const [sizes, setSizes] = createSignal<number[]>([], { ownedWrite: true });
  const [collapsed, setCollapsed] = createSignal<boolean[]>([], { ownedWrite: true });
  let currentPanels: readonly PanelRegistration[] = [];
  let currentSizes: number[] = [];
  let currentCollapsed: boolean[] = [];
  let containerRef: HTMLDivElement | undefined;
  const others = omit(props, 'orientation', 'layout', 'vertical', 'lazy', 'destroyOnHidden', 'draggerIcon', 'onDraggerDoubleClick', 'onResizeStart', 'onResize', 'onResizeEnd', 'onCollapse', 'classNames', 'styles', 'children', 'class', 'style');
  const orientation = () => props.orientation ?? (props.vertical ? 'vertical' : props.layout);
  const publishSizes = (next: number[], resize = true) => {
    currentSizes = next;
    setSizes(next);
    if (resize) props.onResize?.(next);
  };
  const context: SplitterContextValue = {
    register(panel) {
      if (currentPanels.some((item) => item.id === panel.id)) return;
      currentPanels = [...currentPanels, panel];
      const count = currentPanels.length;
      const explicit = currentPanels.map((item) => percentage(item.props.size ?? item.props.defaultSize, 100 / count));
      const total = explicit.reduce((sum, value) => sum + value, 0);
      currentSizes = explicit.map((value) => value / total * 100);
      currentCollapsed = currentPanels.map(() => false);
      setPanels(currentPanels);
      setSizes(currentSizes);
      setCollapsed(currentCollapsed);
    },
    unregister(id) {
      const index = currentPanels.findIndex((panel) => panel.id === id);
      if (index < 0) return;
      currentPanels = currentPanels.filter((panel) => panel.id !== id);
      currentSizes = currentSizes.filter((_, itemIndex) => itemIndex !== index);
      currentCollapsed = currentCollapsed.filter((_, itemIndex) => itemIndex !== index);
      setPanels(currentPanels);
      setSizes(currentSizes);
      setCollapsed(currentCollapsed);
    },
  };
  const limits = (index: number) => {
    const panel = currentPanels[index]?.props;
    return { min: percentage(panel?.min, 0), max: percentage(panel?.max, 100) };
  };
  const resizePair = (index: number, delta: number) => {
    if (currentPanels[index]?.props.resizable === false || currentPanels[index + 1]?.props.resizable === false) return;
    const next = [...currentSizes];
    const pairTotal = next[index] + next[index + 1];
    const leftLimits = limits(index);
    const rightLimits = limits(index + 1);
    const left = Math.min(leftLimits.max, Math.max(leftLimits.min, next[index] + delta));
    const right = pairTotal - left;
    if (right < rightLimits.min || right > rightLimits.max) return;
    next[index] = left;
    next[index + 1] = right;
    publishSizes(next);
  };
  const startDrag = (event: PointerEvent, index: number) => {
    if (!containerRef) return;
    event.preventDefault();
    const start = orientation() === 'horizontal' ? event.clientX : event.clientY;
    const dimension = orientation() === 'horizontal' ? containerRef.clientWidth : containerRef.clientHeight;
    const initial = [...currentSizes];
    props.onResizeStart?.(initial);
    const move = (moveEvent: PointerEvent) => {
      const coordinate = orientation() === 'horizontal' ? moveEvent.clientX : moveEvent.clientY;
      currentSizes = [...initial];
      resizePair(index, (coordinate - start) / Math.max(1, dimension) * 100);
    };
    const end = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', end);
      props.onResizeEnd?.([...currentSizes]);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', end);
  };
  const collapsePanel = (index: number) => {
    const nextCollapsed = [...currentCollapsed];
    const nextSizes = [...currentSizes];
    if (nextCollapsed[index]) {
      nextCollapsed[index] = false;
      const restored = 100 / Math.max(1, currentPanels.length);
      const neighbor = index === currentPanels.length - 1 ? index - 1 : index + 1;
      nextSizes[index] = restored;
      if (neighbor >= 0) nextSizes[neighbor] = Math.max(0, nextSizes[neighbor] - restored);
    } else {
      const neighbor = index === currentPanels.length - 1 ? index - 1 : index + 1;
      if (neighbor >= 0) nextSizes[neighbor] += nextSizes[index];
      nextSizes[index] = 0;
      nextCollapsed[index] = true;
    }
    currentCollapsed = nextCollapsed;
    setCollapsed(nextCollapsed);
    publishSizes(nextSizes);
    props.onCollapse?.(nextCollapsed, nextSizes);
  };
  const reset = (index: number) => {
    const count = currentPanels.length;
    const next = currentPanels.map((panel) => percentage(panel.props.defaultSize ?? panel.props.size, 100 / count));
    const total = next.reduce((sum, value) => sum + value, 0);
    publishSizes(next.map((value) => value / total * 100));
    props.onDraggerDoubleClick?.(index);
  };

  return (
    <SplitterContext value={context}>
      <div class="hidden" aria-hidden="true">{props.children}</div>
      <div {...others} ref={containerRef} class={['ads-splitter flex min-h-0 min-w-0 overflow-hidden', orientation() === 'vertical' ? 'flex-col' : 'flex-row', props.class, props.classNames?.root]} style={{ ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}>
        <For each={panels()}>{(panel, index) => (
          <>
            <div
              class={['ads-splitter-panel min-h-0 min-w-0 overflow-auto', panel.props.class, props.classNames?.panel]}
              style={{ flex: `0 0 ${sizes()[index()] ?? 0}%`, ...panel.props.style, ...props.styles?.panel }}
              hidden={collapsed()[index()]}
            >
              <Show when={!collapsed()[index()] || !(panel.props.destroyOnHidden ?? props.destroyOnHidden)}>{panel.props.children}</Show>
            </div>
            <Show when={index() < panels().length - 1}>
              <div class={orientation() === 'horizontal' ? 'relative z-10 w-1 shrink-0' : 'relative z-10 h-1 shrink-0'}>
                <div
                  role="separator"
                  tabindex={0}
                  aria-orientation={orientation()}
                  aria-valuenow={Math.round(sizes()[index()] ?? 0)}
                  class={[orientation() === 'horizontal' ? 'group absolute inset-0 cursor-col-resize bg-border-secondary hover:bg-primary' : 'group absolute inset-0 cursor-row-resize bg-border-secondary hover:bg-primary', props.classNames?.dragger]}
                  style={props.styles?.dragger}
                  onPointerDown={(event) => startDrag(event, index())}
                  onDblClick={() => reset(index())}
                  onKeyDown={(event) => {
                    const decrease = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
                    const increase = event.key === 'ArrowRight' || event.key === 'ArrowDown';
                    if (decrease || increase) {
                      event.preventDefault();
                      resizePair(index(), increase ? 1 : -1);
                    }
                  }}
                >
                  <span aria-hidden="true" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-small bg-surface px-0.5 text-[10px] text-text-secondary opacity-0 shadow-sm group-hover:opacity-100">{props.draggerIcon ?? ':'}</span>
                </div>
                <Show when={panel.props.collapsible}><button type="button" aria-label={collapsed()[index()] ? 'Expand panel' : 'Collapse panel'} class="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-surface text-xs" onClick={() => collapsePanel(index())}>{collapsed()[index()] ? '>' : '<'}</button></Show>
              </div>
            </Show>
          </>
        )}</For>
      </div>
    </SplitterContext>
  );
}

export const Splitter = Object.assign(SplitterRoot, { Panel: SplitterPanel });
