import { createSignal, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { tv } from 'tailwind-variants';
import { CloseIcon } from '../_internal/icons';

const alert = tv({
  slots: {
    root: 'ads-alert relative flex items-start gap-3 rounded-surface border px-3 py-2 text-sm text-text',
    icon: 'mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold leading-none',
  },
  variants: {
    type: {
      success: { root: 'border-[#b7eb8f] bg-[#f6ffed]', icon: 'border-success text-success' },
      info: { root: 'border-[#91caff] bg-[#e6f4ff]', icon: 'border-info text-info' },
      warning: { root: 'border-[#ffe58f] bg-[#fffbe6]', icon: 'border-warning text-[#d48806]' },
      error: { root: 'border-[#ffccc7] bg-[#fff2f0]', icon: 'border-error text-error' },
    },
    variant: {
      outlined: {},
      filled: {},
    },
    banner: {
      true: { root: 'rounded-none border-x-0 border-t-0' },
    },
  },
  compoundVariants: [
    { type: 'success', variant: 'filled', class: { root: 'border-success bg-success text-white', icon: 'border-white text-white' } },
    { type: 'info', variant: 'filled', class: { root: 'border-info bg-info text-white', icon: 'border-white text-white' } },
    { type: 'warning', variant: 'filled', class: { root: 'border-warning bg-warning', icon: 'border-text text-text' } },
    { type: 'error', variant: 'filled', class: { root: 'border-error bg-error text-white', icon: 'border-white text-white' } },
  ],
  defaultVariants: { type: 'info', variant: 'outlined' },
});

export type AlertSemanticName = 'root' | 'icon' | 'section' | 'title' | 'description' | 'actions' | 'close';
export type AlertSemanticClassNames = Partial<Record<AlertSemanticName, string>>;
export type AlertSemanticStyles = Partial<Record<AlertSemanticName, JSX.CSSProperties>>;

export interface AlertProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title' | 'onClose'> {
  type?: 'success' | 'info' | 'warning' | 'error';
  variant?: 'outlined' | 'filled';
  title?: JSX.Element;
  message?: JSX.Element;
  description?: JSX.Element;
  action?: JSX.Element;
  icon?: JSX.Element;
  showIcon?: boolean;
  closable?: boolean;
  closeIcon?: JSX.Element;
  banner?: boolean;
  onClose?: (event: MouseEvent) => void;
  afterClose?: () => void;
  classNames?: AlertSemanticClassNames;
  styles?: AlertSemanticStyles;
}

const iconText = { success: 'ok', info: 'i', warning: '!', error: 'x' } as const;

export function Alert(props: AlertProps) {
  const [visible, setVisible] = createSignal(true, { ownedWrite: true });
  const others = omit(
    props,
    'type', 'variant', 'title', 'message', 'description', 'action', 'icon', 'showIcon',
    'closable', 'closeIcon', 'banner', 'onClose', 'afterClose', 'classNames', 'styles', 'class', 'style',
  );
  const type = (): NonNullable<AlertProps['type']> => props.type ?? (props.banner ? 'warning' : 'info');
  const showIcon = () => props.showIcon ?? Boolean(props.banner);
  const styles = () => alert({ type: type(), variant: props.variant, banner: props.banner });
  const rootTokenStyle = (): JSX.CSSProperties => ({ padding: props.description ? 'var(--ads-alert-with-description-padding, 20px 24px)' : 'var(--ads-alert-default-padding, 8px 12px)' });
  const iconTokenStyle = (): JSX.CSSProperties => props.description ? {
    width: 'var(--ads-alert-with-description-icon-size, 24px)',
    height: 'var(--ads-alert-with-description-icon-size, 24px)',
    'font-size': 'var(--ads-alert-with-description-icon-size, 24px)',
  } : {};
  const adaptiveStatusStyle = (): JSX.CSSProperties => {
    if (props.variant === 'filled') return {};
    const color = `var(--ads-color-${type()})`;
    return {
      'border-color': `color-mix(in srgb, ${color} 45%, var(--ads-color-surface))`,
      'background-color': `color-mix(in srgb, ${color} 10%, var(--ads-color-surface))`,
    };
  };
  const close: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
    props.onClose?.(event);
    if (!event.defaultPrevented) {
      setVisible(false);
      props.afterClose?.();
    }
  };

  return (
    <Show when={visible()}>
      <div {...others} role="alert" class={styles().root({ class: [props.class as string | undefined, props.classNames?.root] })} style={{ ...rootTokenStyle(), ...adaptiveStatusStyle(), ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}>
        <Show when={showIcon()}>
          <span aria-hidden="true" class={styles().icon({ class: props.classNames?.icon })} style={{ ...iconTokenStyle(), ...props.styles?.icon }}>{props.icon ?? iconText[type()]}</span>
        </Show>
        <div class={['min-w-0 flex-1', props.classNames?.section]} style={props.styles?.section}>
          <Show when={props.title ?? props.message}><div class={['font-semibold leading-[22px]', props.classNames?.title]} style={props.styles?.title}>{props.title ?? props.message}</div></Show>
          <Show when={props.description}><div class={['mt-1 text-sm leading-[22px] opacity-80', props.classNames?.description]} style={props.styles?.description}>{props.description}</div></Show>
        </div>
        <Show when={props.action}><div class={['shrink-0', props.classNames?.actions]} style={props.styles?.actions}>{props.action}</div></Show>
        <Show when={props.closable}>
          <button type="button" aria-label="Close" class={['-mr-1 inline-flex size-6 shrink-0 items-center justify-center rounded-small bg-transparent text-text-secondary hover:bg-black/5', props.classNames?.close]} style={props.styles?.close} onClick={close}>
            {props.closeIcon ?? <CloseIcon />}
          </button>
        </Show>
      </div>
    </Show>
  );
}
