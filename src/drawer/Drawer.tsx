import { createEffect, createMemo, createUniqueId, merge, omit, Show } from 'solid-js';
import { Portal } from '@solidjs/web';
import type { JSX } from '@solidjs/web';
import { tv } from 'tailwind-variants';
import { CloseIcon } from '../_internal/icons';
import { lockBodyScroll, unlockBodyScroll } from '../_internal/scrollLock';
import { tokenToCssVariables } from '../config-provider/theme';
import { useConfig } from '../config-provider';

const drawer = tv({
  slots: {
    root: 'ads-drawer-root fixed inset-0 z-[1000] text-sm text-text',
    mask: 'absolute inset-0 bg-black/45',
    panel: 'absolute flex overflow-hidden bg-surface shadow-popup outline-none',
    header: 'flex min-h-14 shrink-0 items-center gap-4 border-b border-border-secondary px-6',
    title: 'min-w-0 flex-1 text-base font-semibold leading-6',
    body: 'min-h-0 flex-1 overflow-y-auto px-6 py-5 leading-[22px]',
    footer: 'flex min-h-14 shrink-0 items-center justify-end gap-2 border-t border-border-secondary px-6 py-2.5',
  },
  variants: {
    placement: {
      left: { panel: 'inset-y-0 left-0 flex-col' },
      right: { panel: 'inset-y-0 right-0 flex-col' },
      top: { panel: 'inset-x-0 top-0 flex-col' },
      bottom: { panel: 'inset-x-0 bottom-0 flex-col' },
    },
  },
  defaultVariants: { placement: 'right' },
});

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export type DrawerSemanticName = 'root' | 'mask' | 'section' | 'header' | 'title' | 'extra' | 'body' | 'footer' | 'dragger' | 'close';
export type DrawerSemanticClassNames = Partial<Record<DrawerSemanticName, string>>;
export type DrawerSemanticStyles = Partial<Record<DrawerSemanticName, JSX.CSSProperties>>;

export interface DrawerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title' | 'onClose' | 'style'> {
  open?: boolean;
  title?: JSX.Element;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  width?: number | string;
  height?: number | string;
  closable?: boolean;
  closeIcon?: JSX.Element;
  mask?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean;
  extra?: JSX.Element;
  footer?: JSX.Element | null;
  getContainer?: HTMLElement | false;
  zIndex?: number;
  style?: JSX.CSSProperties;
  rootStyle?: JSX.CSSProperties;
  rootClass?: string;
  bodyClass?: string;
  footerClass?: string;
  onClose?: (event: MouseEvent | KeyboardEvent) => void;
  afterOpenChange?: (open: boolean) => void;
  classNames?: DrawerSemanticClassNames;
  styles?: DrawerSemanticStyles;
}

export function Drawer(inputProps: DrawerProps) {
  const config = useConfig();
  const props = merge({
    open: false,
    placement: 'right' as const,
    width: 378,
    height: 378,
    closable: true,
    mask: true,
    maskClosable: true,
    keyboard: true,
  }, config.componentDefaults('drawer') as Partial<DrawerProps>, inputProps);
  const uid = createUniqueId();
  const titleId = `${uid}-title`;
  let panelRef: HTMLDivElement | undefined;
  let previouslyFocused: HTMLElement | null = null;
  let initialized = false;
  const others = omit(
    props,
    'open', 'title', 'placement', 'width', 'height', 'closable', 'closeIcon', 'mask',
    'maskClosable', 'keyboard', 'extra', 'footer', 'getContainer', 'zIndex', 'style',
    'rootStyle', 'rootClass', 'bodyClass', 'footerClass', 'onClose', 'afterOpenChange',
    'classNames', 'styles', 'children', 'class',
  );
  const styles = () => drawer({ placement: props.placement });
  const rootStyle = createMemo<JSX.CSSProperties>(() => ({
    ...tokenToCssVariables(config.theme()),
    'font-family': 'var(--ads-font-family)',
    'z-index': props.zIndex,
    ...props.rootStyle,
  } as JSX.CSSProperties));
  const panelStyle = createMemo<JSX.CSSProperties>(() => {
    const horizontal = props.placement === 'left' || props.placement === 'right';
    return {
      width: horizontal ? (typeof props.width === 'number' ? `${props.width}px` : props.width) : '100%',
      height: horizontal ? '100%' : (typeof props.height === 'number' ? `${props.height}px` : props.height),
      'max-width': '100vw',
      'max-height': '100vh',
      ...props.style,
    };
  });

  const close = (event: MouseEvent | KeyboardEvent) => props.onClose?.(event);
  const handleKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (event) => {
    if (event.key === 'Escape' && props.keyboard) {
      event.stopPropagation();
      close(event);
      return;
    }
    if (event.key !== 'Tab' || !panelRef) return;
    const focusable = Array.from(panelRef.querySelectorAll<HTMLElement>(focusableSelector));
    if (focusable.length === 0) {
      event.preventDefault();
      panelRef.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  createEffect(
    () => ({ open: props.open, afterOpenChange: props.afterOpenChange }),
    (state) => {
      if (!initialized) initialized = true;
      else state.afterOpenChange?.(state.open);
      if (!state.open) return;
      previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      lockBodyScroll();
      queueMicrotask(() => {
        const autofocus = panelRef?.querySelector<HTMLElement>('[autofocus]');
        const first = panelRef?.querySelector<HTMLElement>(focusableSelector);
        (autofocus ?? first ?? panelRef)?.focus();
      });
      return () => {
        unlockBodyScroll();
        previouslyFocused?.focus();
      };
    },
  );

  const content = () => (
    <Show when={props.open}>
      <div
        {...others}
        class={styles().root({ class: ['ads-root', 'ads-drawer', 'ads-drawer-theme', config.themeScopeClass(), props.rootClass, props.classNames?.root] })}
        style={{ ...rootStyle(), ...props.styles?.root }}
        onKeyDown={handleKeyDown}
      >
        <Show when={props.mask}>
          <div class={styles().mask({ class: props.classNames?.mask })} style={props.styles?.mask} aria-hidden="true" onClick={(event) => { if (props.maskClosable) close(event); }} />
        </Show>
        <div
          ref={panelRef}
          role="dialog"
          aria-modal={props.mask ? 'true' : 'false'}
          aria-labelledby={props.title ? titleId : undefined}
          tabindex={-1}
          class={styles().panel({ class: [props.class as string | undefined, props.classNames?.section] })}
          style={{ ...panelStyle(), ...props.styles?.section }}
        >
          <Show when={props.title || props.closable || props.extra}>
            <div class={styles().header({ class: props.classNames?.header })} style={props.styles?.header}>
              <Show when={props.closable}>
                <button type="button" aria-label="Close" class={['inline-flex size-8 shrink-0 items-center justify-center rounded-control bg-transparent text-lg leading-none text-text-secondary hover:bg-surface-container hover:text-text', props.classNames?.close]} style={props.styles?.close} onClick={close}>
                  {props.closeIcon ?? <CloseIcon />}
                </button>
              </Show>
              <Show when={props.title}><div id={titleId} class={styles().title({ class: props.classNames?.title })} style={props.styles?.title}>{props.title}</div></Show>
              <Show when={props.extra}><div class={['ml-auto shrink-0', props.classNames?.extra]} style={props.styles?.extra}>{props.extra}</div></Show>
            </div>
          </Show>
          <div class={styles().body({ class: [props.bodyClass, props.classNames?.body] })} style={props.styles?.body}>{props.children}</div>
          <Show when={props.footer !== undefined && props.footer !== null}>
            <div class={styles().footer({ class: [props.footerClass, props.classNames?.footer] })} style={props.styles?.footer}>{props.footer}</div>
          </Show>
        </div>
      </div>
    </Show>
  );

  return props.getContainer === false
    ? content()
    : <Portal mount={props.getContainer || undefined}>{content()}</Portal>;
}
