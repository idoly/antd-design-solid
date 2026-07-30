import { arrow, autoUpdate, computePosition, flip, offset, shift, size, type Placement } from '@floating-ui/dom';
import { createEffect, createSignal, createUniqueId, merge, omit, onCleanup, Show } from 'solid-js';
import { Portal } from '@solidjs/web';
import type { JSX } from '@solidjs/web';
import { tokenToCssVariables } from '../config-provider/theme';
import { useConfig } from '../config-provider';

export type PopoverSemanticName = 'root' | 'container' | 'title' | 'content' | 'arrow';
export type PopoverSemanticClassNames = Partial<Record<PopoverSemanticName, string>>;
export type PopoverSemanticStyles = Partial<Record<PopoverSemanticName, JSX.CSSProperties>>;

export interface PopoverProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'title' | 'content' | 'children'> {
  title?: JSX.Element;
  content?: JSX.Element;
  children: JSX.Element;
  placement?: Placement;
  open?: boolean;
  defaultOpen?: boolean;
  trigger?: 'hover' | 'focus' | 'click' | readonly ('hover' | 'focus' | 'click')[];
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  arrow?: boolean;
  zIndex?: number;
  getPopupContainer?: (trigger: HTMLElement) => HTMLElement;
  overlayClass?: string;
  matchTriggerWidth?: boolean | number;
  onOpenChange?: (open: boolean) => void;
  classNames?: PopoverSemanticClassNames;
  styles?: PopoverSemanticStyles;
}

export function Popover(inputProps: PopoverProps) {
  const config = useConfig();
  const props = merge({
    placement: 'top' as Placement,
    defaultOpen: false,
    trigger: 'click' as const,
    mouseEnterDelay: 0.1,
    mouseLeaveDelay: 0.1,
    arrow: true,
  }, config.componentDefaults('popover') as Partial<PopoverProps>, inputProps);
  const [internalOpen, setInternalOpen] = createSignal(Boolean(props.defaultOpen), { ownedWrite: true });
  const uid = createUniqueId();
  const popoverId = `${uid}-popover`;
  const titleId = `${uid}-title`;
  let triggerRef: HTMLSpanElement | undefined;
  let popupRef: HTMLDivElement | undefined;
  let arrowRef: HTMLSpanElement | undefined;
  let openTimer: ReturnType<typeof setTimeout> | undefined;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;
  const others = omit(
    props,
    'title', 'content', 'children', 'placement', 'open', 'defaultOpen', 'trigger',
    'mouseEnterDelay', 'mouseLeaveDelay', 'arrow', 'zIndex', 'getPopupContainer',
    'overlayClass', 'matchTriggerWidth', 'onOpenChange', 'classNames', 'styles', 'class', 'aria-label', 'aria-controls', 'aria-expanded',
  );
  const hasContent = () => props.title !== undefined || props.content !== undefined;
  const popupContainer = () => props.getPopupContainer ?? config.getPopupContainer();
  const matchTriggerWidth = () => props.matchTriggerWidth ?? config.popupMatchSelectWidth();
  const isOpen = () => hasContent() && (props.open ?? internalOpen());
  const triggers = () => Array.isArray(props.trigger) ? props.trigger : [props.trigger];
  const hasTrigger = (trigger: 'hover' | 'focus' | 'click') => triggers().includes(trigger);
  const clearTimers = () => {
    if (openTimer) clearTimeout(openTimer);
    if (closeTimer) clearTimeout(closeTimer);
  };
  onCleanup(clearTimers);
  const setOpen = (next: boolean) => {
    if (!hasContent() || next === isOpen()) return;
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

  createEffect(
    () => isOpen(),
    (open) => {
      if (!open) return;
      let cleanupPosition: (() => void) | undefined;
      let cancelled = false;
      const handlePointerDown = (event: PointerEvent) => {
        if (!hasTrigger('click')) return;
        const target = event.target as Node;
        if (!triggerRef?.contains(target) && !popupRef?.contains(target)) setOpen(false);
      };
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          setOpen(false);
          triggerRef?.querySelector<HTMLElement>('[tabindex],button,a[href],input,select,textarea')?.focus();
        }
      };
      document.addEventListener('pointerdown', handlePointerDown);
      document.addEventListener('keydown', handleKeyDown);
      queueMicrotask(() => {
        if (cancelled || !triggerRef || !popupRef) return;
        cleanupPosition = autoUpdate(triggerRef, popupRef, () => {
          if (!triggerRef || !popupRef) return;
          const middleware = [offset(10), flip({ padding: 8 }), shift({ padding: 8 })];
          if (matchTriggerWidth() !== false && matchTriggerWidth() !== undefined) middleware.push(size({ apply({ rects, elements }) { elements.floating.style.width = typeof matchTriggerWidth() === 'number' ? `${matchTriggerWidth()}px` : `${rects.reference.width}px`; } }));
          if (props.arrow && arrowRef) middleware.push(arrow({ element: arrowRef, padding: 8 }));
          void computePosition(triggerRef, popupRef, {
            strategy: 'fixed',
            placement: props.placement,
            middleware,
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
            if (staticSide) arrowRef.style.setProperty(staticSide, '-4px');
          });
        });
      });
      return () => {
        cancelled = true;
        cleanupPosition?.();
        document.removeEventListener('pointerdown', handlePointerDown);
        document.removeEventListener('keydown', handleKeyDown);
      };
    },
  );

  return (
    <>
      <span
        {...others}
        ref={triggerRef}
        class={['ads-popover-trigger inline-flex min-w-0', props.class]}
        aria-haspopup="dialog"
        aria-controls={isOpen() ? popoverId : undefined}
        onPointerEnter={scheduleOpen}
        onPointerLeave={scheduleClose}
        onFocusIn={() => { if (hasTrigger('focus')) setOpen(true); }}
        onFocusOut={(event) => {
          if (hasTrigger('focus') && !event.currentTarget.contains(event.relatedTarget as Node | null) && !popupRef?.contains(event.relatedTarget as Node | null)) setOpen(false);
        }}
        onClick={() => { if (hasTrigger('click')) setOpen(!isOpen()); }}
      >
        {props.children}
      </span>
      <Show when={isOpen()}>
        <Portal mount={triggerRef && popupContainer()?.(triggerRef) as Element | undefined}>
          <div
            ref={popupRef}
            id={popoverId}
            role="dialog"
            aria-labelledby={props.title ? titleId : undefined}
            aria-label={!props.title ? props['aria-label'] ?? 'Popover' : undefined}
            class={['ads-root ads-popover ads-popover-theme', config.themeScopeClass(), 'fixed z-[1030] min-w-[177px] max-w-[320px] text-sm text-text outline-none', props.overlayClass, props.classNames?.root]}
            style={{
              ...tokenToCssVariables(config.theme()),
              'z-index': props.zIndex,
              'font-family': 'var(--ads-font-family)',
              ...props.styles?.root,
            }}
            onPointerEnter={() => { if (closeTimer) clearTimeout(closeTimer); }}
            onPointerLeave={scheduleClose}
          >
            <div class={['rounded-surface border border-border-secondary bg-surface shadow-popup', props.classNames?.container]} style={props.styles?.container}>
              <Show when={props.title}><div id={titleId} class={['border-b border-border-secondary px-3 py-2 font-semibold leading-[22px]', props.classNames?.title]} style={props.styles?.title}>{props.title}</div></Show>
              <Show when={props.content}><div class={['px-3 py-2 leading-[22px]', props.classNames?.content]} style={props.styles?.content}>{props.content}</div></Show>
            </div>
            <Show when={props.arrow}><span ref={arrowRef} aria-hidden="true" class={['absolute size-2 rotate-45 border border-border-secondary bg-surface', props.classNames?.arrow]} style={props.styles?.arrow} /></Show>
          </div>
        </Portal>
      </Show>
    </>
  );
}
