import { createEffect, createMemo, createSignal, createUniqueId, merge, omit, Show } from 'solid-js';
import { Portal } from '@solidjs/web';
import type { JSX } from '@solidjs/web';
import { tv } from 'tailwind-variants';
import { CloseIcon } from '../_internal/icons';
import { Button, type ButtonProps, type ButtonType } from '../button';
import { tokenToCssVariables } from '../config-provider/theme';
import { useConfig } from '../config-provider';
import { lockBodyScroll, unlockBodyScroll } from '../_internal/scrollLock';

const modal = tv({
  slots: {
    root: 'ads-modal-root fixed inset-0 z-[1000] overflow-y-auto text-sm text-text',
    mask: 'fixed inset-0 bg-black/45',
    wrapper: 'relative flex min-h-full items-start justify-center px-4 py-[100px]',
    container: 'ads-modal-container relative w-full overflow-hidden rounded-surface bg-surface shadow-popup outline-none',
    header: 'ads-modal-header flex min-h-14 items-center gap-4 border-b border-border-secondary px-6',
    title: 'ads-modal-title min-w-0 flex-1 text-base font-semibold leading-6',
    body: 'ads-modal-body px-6 py-5 leading-[22px]',
    footer: 'ads-modal-footer flex min-h-14 items-center justify-end gap-2 border-t border-border-secondary px-6 py-2.5',
    close: 'ml-auto inline-flex size-8 shrink-0 items-center justify-center rounded-control bg-transparent text-lg leading-none text-text-secondary hover:bg-surface-container hover:text-text disabled:pointer-events-none disabled:opacity-50',
  },
  variants: {
    centered: {
      true: { wrapper: 'items-center py-6' },
    },
  },
});

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export type ModalSemanticName = 'root' | 'mask' | 'container' | 'wrapper' | 'header' | 'title' | 'body' | 'footer' | 'close';
export type ModalClassNames = Partial<Record<ModalSemanticName, string>> | ((info: { props: ModalProps }) => Partial<Record<ModalSemanticName, string>>);
export type ModalStyles = Partial<Record<ModalSemanticName, JSX.CSSProperties>> | ((info: { props: ModalProps }) => Partial<Record<ModalSemanticName, JSX.CSSProperties>>);
export interface ModalClosableConfig { afterClose?: () => void; closeIcon?: JSX.Element; disabled?: boolean; onClose?: () => void }
export interface ModalMaskConfig { enabled?: boolean; blur?: boolean; closable?: boolean }
export interface ModalFocusableConfig { trap?: boolean; focusTriggerAfterClose?: boolean }
export type ModalFooterRender = (originNode: JSX.Element, extra: { OkBtn: () => JSX.Element; CancelBtn: () => JSX.Element }) => JSX.Element;

export interface ModalProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title' | 'onCancel' | 'style'> {
  open?: boolean;
  style?: JSX.CSSProperties;
  styles?: ModalStyles;
  classNames?: ModalClassNames;
  title?: JSX.Element;
  footer?: JSX.Element | null | ModalFooterRender;
  closable?: boolean | ModalClosableConfig;
  closeIcon?: JSX.Element;
  mask?: boolean | ModalMaskConfig;
  maskClosable?: boolean;
  keyboard?: boolean;
  centered?: boolean;
  width?: number | string;
  zIndex?: number;
  okText?: JSX.Element;
  cancelText?: JSX.Element;
  okType?: ButtonType;
  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  confirmLoading?: boolean;
  loading?: boolean;
  destroyOnHidden?: boolean;
  /** @deprecated Use destroyOnHidden. */
  destroyOnClose?: boolean;
  forceRender?: boolean;
  focusable?: ModalFocusableConfig;
  /** @deprecated Use focusable.focusTriggerAfterClose. */
  focusTriggerAfterClose?: boolean;
  scrollLock?: boolean;
  getContainer?: HTMLElement | (() => HTMLElement) | string | false;
  wrapClassName?: string;
  bodyClass?: string;
  modalRender?: (node: JSX.Element) => JSX.Element;
  onOk?: (event: MouseEvent) => void;
  onCancel?: (event: MouseEvent | KeyboardEvent) => void;
  afterClose?: () => void;
  afterOpenChange?: (open: boolean) => void;
}

export function Modal(inputProps: ModalProps) {
  const config = useConfig();
  const props = merge({
    open: false,
    closable: true,
    mask: true,
    maskClosable: true,
    keyboard: true,
    width: 520,
    okType: 'primary' as ButtonType,
    scrollLock: true,
  }, config.componentDefaults('modal') as Partial<ModalProps>, inputProps);
  const uid = createUniqueId();
  const titleId = `${uid}-title`;
  let dialogRef: HTMLDivElement | undefined;
  let previouslyFocused: HTMLElement | null = null;
  let initialized = false;
  let previousOpen = false;
  const [hasOpened, setHasOpened] = createSignal(false);
  const others = omit(
    props,
    'open', 'title', 'footer', 'closable', 'closeIcon', 'mask', 'maskClosable',
    'keyboard', 'centered', 'width', 'zIndex', 'okText', 'cancelText', 'okType', 'okButtonProps',
    'cancelButtonProps', 'confirmLoading', 'loading', 'destroyOnHidden', 'destroyOnClose',
    'forceRender', 'focusable', 'focusTriggerAfterClose', 'scrollLock', 'getContainer',
    'wrapClassName', 'bodyClass', 'modalRender', 'onOk', 'onCancel', 'afterClose',
    'afterOpenChange', 'classNames', 'styles', 'children', 'class', 'style',
  );
  const styles = () => modal({ centered: props.centered });
  const semanticClasses = createMemo(() => typeof props.classNames === 'function' ? props.classNames({ props }) : (props.classNames ?? {}));
  const semanticStyles = createMemo(() => typeof props.styles === 'function' ? props.styles({ props }) : (props.styles ?? {}));
  const rootStyle = createMemo<JSX.CSSProperties>(() => ({
    ...tokenToCssVariables(config.theme()),
    'font-family': 'var(--ads-font-family)',
    'z-index': props.zIndex,
    display: props.open ? undefined : 'none',
    ...props.style,
    ...semanticStyles().root,
  } as JSX.CSSProperties));
  const dialogStyle = createMemo<JSX.CSSProperties>(() => ({
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    'max-width': 'calc(100vw - 32px)',
    ...semanticStyles().container,
  }));
  const closeConfig = createMemo<ModalClosableConfig>(() => typeof props.closable === 'object' ? props.closable : {});
  const isClosable = createMemo(() => props.closable !== false && props.closeIcon !== null && props.closeIcon !== false && closeConfig().closeIcon !== null && closeConfig().closeIcon !== false);
  const maskConfig = createMemo<ModalMaskConfig>(() => typeof props.mask === 'object' ? props.mask : {});
  const hasMask = createMemo(() => typeof props.mask === 'object' ? props.mask.enabled !== false : props.mask);
  const isMaskClosable = createMemo(() => maskConfig().closable ?? props.maskClosable);
  const shouldRender = createMemo(() => props.open || props.forceRender || (hasOpened() && !(props.destroyOnHidden ?? props.destroyOnClose)));
  const shouldRestoreFocus = createMemo(() => props.focusable?.focusTriggerAfterClose ?? props.focusTriggerAfterClose ?? true);

  const cancel = (event: MouseEvent | KeyboardEvent) => props.onCancel?.(event);
  const close = (event: MouseEvent) => {
    if (closeConfig().disabled) return;
    closeConfig().onClose?.();
    cancel(event);
  };
  const CancelBtn = () => <Button {...props.cancelButtonProps} onClick={cancel}>{props.cancelText ?? config.locale().Modal?.cancelText ?? 'Cancel'}</Button>;
  const OkBtn = () => <Button {...props.okButtonProps} type={props.okType} loading={props.confirmLoading} onClick={props.onOk}>{props.okText ?? config.locale().Modal?.okText ?? 'OK'}</Button>;
  const defaultFooter = () => <><CancelBtn /><OkBtn /></>;

  const handleRootKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (event) => {
    if (event.key === 'Escape' && props.keyboard) {
      event.stopPropagation();
      cancel(event);
      return;
    }
    if (event.key !== 'Tab' || !dialogRef || props.focusable?.trap === false) return;

    const focusable = Array.from(dialogRef.querySelectorAll<HTMLElement>(focusableSelector));
    if (focusable.length === 0) {
      event.preventDefault();
      dialogRef.focus();
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
    () => ({
      open: props.open,
      afterOpenChange: props.afterOpenChange,
      afterClose: props.afterClose,
      configAfterClose: closeConfig().afterClose,
      scrollLock: props.scrollLock,
      restoreFocus: shouldRestoreFocus(),
    }),
    (state) => {
      if (state.open) setHasOpened(true);
      if (!initialized) initialized = true;
      else state.afterOpenChange?.(state.open);
      if (previousOpen && !state.open) {
        state.afterClose?.();
        state.configAfterClose?.();
      }
      previousOpen = state.open;
      if (!state.open) return;

      previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      if (state.scrollLock) lockBodyScroll();
      queueMicrotask(() => {
        const autofocus = dialogRef?.querySelector<HTMLElement>('[autofocus]');
        const first = dialogRef?.querySelector<HTMLElement>(focusableSelector);
        (autofocus ?? first ?? dialogRef)?.focus();
      });
      return () => {
        if (state.scrollLock) unlockBodyScroll();
        if (state.restoreFocus) previouslyFocused?.focus();
      };
    },
  );

  const content = () => (
    <Show when={shouldRender()}>
      <div
        {...others}
        class={styles().root({ class: ['ads-root', 'ads-modal', 'ads-modal-theme', config.themeScopeClass(), props.class as string | undefined, semanticClasses().root] })}
        style={rootStyle()}
        onKeyDown={handleRootKeyDown}
      >
        <Show when={hasMask()}><div class={styles().mask({ class: [maskConfig().blur && 'backdrop-blur-sm', semanticClasses().mask] })} style={semanticStyles().mask} aria-hidden="true" /></Show>
        <div
          class={styles().wrapper({ class: [props.wrapClassName, semanticClasses().wrapper] })}
          style={semanticStyles().wrapper}
          onClick={(event) => {
            if (isMaskClosable() && event.target === event.currentTarget) cancel(event);
          }}
        >
          {(props.modalRender ?? ((node: JSX.Element) => node))(<div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={props.title ? titleId : undefined}
            aria-busy={props.loading ? 'true' : undefined}
            tabindex={-1}
            class={styles().container({ class: semanticClasses().container })}
            style={dialogStyle()}
          >
            <Show when={props.title || isClosable()}>
              <div class={styles().header({ class: semanticClasses().header })} style={semanticStyles().header}>
                <Show when={props.title}><div id={titleId} class={styles().title({ class: semanticClasses().title })} style={semanticStyles().title}>{props.title}</div></Show>
                <Show when={isClosable()}>
                  <button
                    type="button"
                    aria-label="Close"
                    disabled={closeConfig().disabled}
                    class={styles().close({ class: semanticClasses().close })}
                    style={semanticStyles().close}
                    onClick={close}
                  >
                    {closeConfig().closeIcon ?? props.closeIcon ?? <CloseIcon />}
                  </button>
                </Show>
              </div>
            </Show>
            <div class={styles().body({ class: [props.bodyClass, semanticClasses().body] })} style={semanticStyles().body}>
              <Show when={!props.loading} fallback={<div class="space-y-3 py-1" aria-label="Loading"><div class="h-4 w-2/5 animate-pulse rounded-control bg-surface-container" /><div class="h-4 w-full animate-pulse rounded-control bg-surface-container" /><div class="h-4 w-4/5 animate-pulse rounded-control bg-surface-container" /></div>}>
                {props.children}
              </Show>
            </div>
            <Show when={props.footer !== null && !props.loading}>
              <div class={styles().footer({ class: semanticClasses().footer })} style={semanticStyles().footer}>
                {typeof props.footer === 'function' ? props.footer(defaultFooter(), { OkBtn, CancelBtn }) : (props.footer === undefined ? defaultFooter() : props.footer)}
              </div>
            </Show>
          </div>)}
        </div>
      </div>
    </Show>
  );

  const container = () => {
    if (typeof props.getContainer === 'function') return props.getContainer();
    if (typeof props.getContainer === 'string') return document.querySelector<HTMLElement>(props.getContainer) ?? undefined;
    return props.getContainer || undefined;
  };
  return props.getContainer === false
    ? content()
    : <Portal mount={container()}>{content()}</Portal>;
}
