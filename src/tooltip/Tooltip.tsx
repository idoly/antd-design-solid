import { arrow, autoUpdate, computePosition, flip, offset, shift, type Placement } from '@floating-ui/dom';
import { createContext, createEffect, createMemo, createSignal, createUniqueId, merge, omit, onCleanup, Show, useContext } from 'solid-js';
import { Portal } from '@solidjs/web';
import type { JSX } from '@solidjs/web';
import { tokenToCssVariables } from '../config-provider/theme';
import { useConfig } from '../config-provider';

interface UniqueTooltipContextValue {
  register: (id: string, close: () => void) => () => void;
  activate: (id: string) => void;
}
const UniqueTooltipContext = createContext<UniqueTooltipContextValue | null>(null);

export interface TooltipUniqueProviderProps { children?: JSX.Element }
export function TooltipUniqueProvider(props: TooltipUniqueProviderProps) {
  const closers = new Map<string, () => void>();
  let active: string | undefined;
  const value: UniqueTooltipContextValue = {
    register(id, close) { closers.set(id, close); return () => { closers.delete(id); if (active === id) active = undefined; }; },
    activate(id) { if (active && active !== id) closers.get(active)?.(); active = id; },
  };
  return <UniqueTooltipContext value={value}>{props.children}</UniqueTooltipContext>;
}

export type TooltipSemanticName = 'root' | 'container' | 'arrow';
export type TooltipSemanticClassNames = Partial<Record<TooltipSemanticName, string>>;
export type TooltipSemanticStyles = Partial<Record<TooltipSemanticName, JSX.CSSProperties>>;

export interface TooltipTriggerProps extends JSX.HTMLAttributes<HTMLElement> {
  ref: (element: HTMLElement) => void;
}

export interface TooltipProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'title' | 'content' | 'children'> {
  title?: JSX.Element;
  children?: JSX.Element;
  placement?: Placement;
  open?: boolean;
  defaultOpen?: boolean;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  color?: string;
  zIndex?: number;
  trigger?: 'hover' | 'focus' | 'click' | readonly ('hover' | 'focus' | 'click')[];
  getPopupContainer?: (trigger: HTMLElement) => HTMLElement;
  overlayClass?: string;
  triggerRender?: (props: TooltipTriggerProps) => JSX.Element;
  onOpenChange?: (open: boolean) => void;
  classNames?: TooltipSemanticClassNames;
  styles?: TooltipSemanticStyles;
}

export function Tooltip(inputProps: TooltipProps) {
  const config = useConfig();
  const unique = useContext(UniqueTooltipContext);
  const props = merge({
    placement: 'top' as Placement,
    defaultOpen: false,
    mouseEnterDelay: 0.1,
    mouseLeaveDelay: 0.1,
    trigger: 'hover' as const,
  }, config.componentDefaults('tooltip') as Partial<TooltipProps>, inputProps);
  const [internalOpen, setInternalOpen] = createSignal(Boolean(props.defaultOpen), { ownedWrite: true });
  const uid = createUniqueId();
  const tooltipId = `${uid}-tooltip`;
  let triggerRef: HTMLElement | undefined;
  let popupRef: HTMLDivElement | undefined;
  let arrowRef: HTMLSpanElement | undefined;
  let openTimer: ReturnType<typeof setTimeout> | undefined;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;
  const others = omit(
    props,
    'title', 'children', 'placement', 'open', 'defaultOpen', 'mouseEnterDelay',
    'mouseLeaveDelay', 'color', 'zIndex', 'trigger', 'getPopupContainer', 'overlayClass', 'triggerRender',
    'onOpenChange', 'classNames', 'styles', 'class', 'aria-describedby',
  );
  const isOpen = () => Boolean(props.title) && (props.open ?? internalOpen());
  const triggers = () => Array.isArray(props.trigger) ? props.trigger : [props.trigger];
  const hasTrigger = (trigger: 'hover' | 'focus' | 'click') => triggers().includes(trigger);
  const clearTimers = () => {
    if (openTimer) clearTimeout(openTimer);
    if (closeTimer) clearTimeout(closeTimer);
    openTimer = undefined;
    closeTimer = undefined;
  };
  const setOpen = (next: boolean) => {
    if (!props.title || next === isOpen()) return;
    if (next) unique?.activate(uid);
    if (props.open === undefined) setInternalOpen(next);
    props.onOpenChange?.(next);
  };
  const scheduleOpen = () => {
    if (!hasTrigger('hover')) return;
    if (closeTimer) clearTimeout(closeTimer);
    openTimer = setTimeout(() => setOpen(true), props.mouseEnterDelay * 1000);
  };
  const scheduleClose = () => {
    if (!hasTrigger('hover')) return;
    if (openTimer) clearTimeout(openTimer);
    closeTimer = setTimeout(() => setOpen(false), props.mouseLeaveDelay * 1000);
  };
  const unregisterUnique = unique?.register(uid, () => {
    clearTimers();
    if (props.open === undefined) setInternalOpen(false);
    props.onOpenChange?.(false);
  });
  onCleanup(() => { clearTimers(); unregisterUnique?.(); });

  const triggerProps = (): TooltipTriggerProps => ({
    ...others,
    ref: (element) => { triggerRef = element; },
    class: ['ads-tooltip-trigger', props.class].filter(Boolean).join(' '),
    get 'aria-describedby'() { return isOpen() ? tooltipId : props['aria-describedby']; },
    onPointerEnter: scheduleOpen,
    onPointerLeave: scheduleClose,
    onFocusIn: () => { if (hasTrigger('focus')) setOpen(true); },
    onFocusOut: (event) => {
      if (hasTrigger('focus') && !event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
    },
    onClick: () => { if (hasTrigger('click')) setOpen(!isOpen()); },
  });

  createEffect(
    () => isOpen(),
    (open) => {
      if (!open) return;
      unique?.activate(uid);
      let cleanupPosition: (() => void) | undefined;
      let cancelled = false;
      const handlePointerDown = (event: PointerEvent) => {
        if (!hasTrigger('click')) return;
        const target = event.target as Node;
        if (!triggerRef?.contains(target) && !popupRef?.contains(target)) setOpen(false);
      };
      document.addEventListener('pointerdown', handlePointerDown);
      queueMicrotask(() => {
        if (cancelled || !triggerRef || !popupRef) return;
        cleanupPosition = autoUpdate(triggerRef, popupRef, () => {
          if (!triggerRef || !popupRef) return;
          void computePosition(triggerRef, popupRef, {
            strategy: 'fixed',
            placement: props.placement,
            middleware: [offset(8), flip({ padding: 8 }), shift({ padding: 8 }), arrowRef ? arrow({ element: arrowRef, padding: 4 }) : undefined].filter(Boolean),
          }).then(({ x, y, placement, middlewareData }) => {
            if (!popupRef) return;
            Object.assign(popupRef.style, { left: `${x}px`, top: `${y}px` });
            if (!arrowRef) return;
            const side = placement.split('-')[0];
            const staticSide = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' }[side];
            Object.assign(arrowRef.style, {
              left: middlewareData.arrow?.x === undefined ? '' : `${middlewareData.arrow.x}px`,
              top: middlewareData.arrow?.y === undefined ? '' : `${middlewareData.arrow.y}px`,
              right: '',
              bottom: '',
            });
            if (staticSide) arrowRef.style.setProperty(staticSide, '-3px');
          });
        });
      });
      return () => {
        cancelled = true;
        cleanupPosition?.();
        document.removeEventListener('pointerdown', handlePointerDown);
      };
    },
  );

  const triggerNode = createMemo(() => {
    const renderTrigger = props.triggerRender;
    return renderTrigger
      ? renderTrigger(triggerProps())
      : <span {...triggerProps()} class={['ads-tooltip-trigger inline-flex min-w-0', props.class]}>{props.children}</span>;
  });

  return (
    <>
      {triggerNode()}
      <Show when={isOpen()}>
        <Portal mount={triggerRef && props.getPopupContainer?.(triggerRef)}>
          <div
            ref={popupRef}
            id={tooltipId}
            role="tooltip"
            class={['ads-root ads-tooltip ads-tooltip-theme', config.themeScopeClass(), 'pointer-events-none fixed rounded-control px-2 py-1.5 text-xs leading-5 shadow-popup', props.overlayClass, props.classNames?.root]}
            style={{
              ...tokenToCssVariables(config.theme()),
              'z-index': props.zIndex ?? 'var(--ads-tooltip-z-index-popup, 1070)',
              'max-width': 'var(--ads-tooltip-max-width, 250px)',
              color: 'var(--ads-tooltip-color-text, #fff)',
              'background-color': props.color ?? 'var(--ads-tooltip-color-bg, rgba(0, 0, 0, 0.85))',
              'font-family': 'var(--ads-font-family)',
              ...props.styles?.root,
            }}
          >
            <div class={props.classNames?.container} style={props.styles?.container}>{props.title}</div>
            <span ref={arrowRef} aria-hidden="true" class={['absolute size-1.5 rotate-45 bg-[inherit]', props.classNames?.arrow]} style={props.styles?.arrow} />
          </div>
        </Portal>
      </Show>
    </>
  );
}
