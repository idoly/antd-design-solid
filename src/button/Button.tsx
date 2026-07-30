import { createEffect, createMemo, createSignal, merge, omit, onCleanup, Show, untrack } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { tv } from 'tailwind-variants';
import { useConfig } from '../config-provider';

const button = tv({
  base: 'ads-button relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 border text-sm font-normal outline-none transition-colors duration-[var(--ads-motion-fast)] focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  variants: {
    variant: {
      outlined: 'border-border bg-surface text-text hover:border-primary-hover hover:text-primary-hover active:border-primary-active active:text-primary-active',
      dashed: 'border-dashed border-border bg-surface text-text hover:border-primary-hover hover:text-primary-hover',
      solid: 'border-transparent bg-primary text-white hover:bg-primary-hover active:bg-primary-active',
      filled: 'border-transparent bg-surface-container text-text hover:bg-border-secondary',
      text: 'border-transparent bg-transparent text-text hover:bg-surface-container',
      link: 'h-auto border-transparent bg-transparent p-0 text-primary hover:text-primary-hover',
    },
    danger: {
      true: '',
    },
    size: {
      small: 'h-6 px-2 text-sm',
      middle: 'h-8 px-[15px]',
      large: 'h-10 px-[15px] text-base',
    },
    shape: {
      default: 'rounded-control',
      circle: 'aspect-square rounded-full px-0',
      round: 'rounded-full',
    },
    block: {
      true: 'flex w-full',
    },
  },
  compoundVariants: [
    { danger: true, variant: 'solid', class: 'bg-error hover:bg-[#ff7875] active:bg-[#d9363e]' },
    { danger: true, variant: 'outlined', class: 'border-error text-error hover:border-[#ff7875] hover:text-[#ff7875]' },
    { danger: true, variant: 'dashed', class: 'border-error text-error hover:border-[#ff7875] hover:text-[#ff7875]' },
    { danger: true, variant: 'filled', class: 'bg-[#fff2f0] text-error hover:bg-[#fff1f0]' },
    { danger: true, variant: 'text', class: 'text-error hover:bg-[#fff2f0]' },
    { danger: true, variant: 'link', class: 'text-error hover:text-[#ff7875]' },
    { shape: 'circle', size: 'small', class: 'w-6' },
    { shape: 'circle', size: 'middle', class: 'w-8' },
    { shape: 'circle', size: 'large', class: 'w-10' },
  ],
  defaultVariants: {
    variant: 'outlined',
    size: 'middle',
    shape: 'default',
  },
});

export type ButtonVariant = 'outlined' | 'dashed' | 'solid' | 'filled' | 'text' | 'link';
export type ButtonType = 'primary' | 'dashed' | 'link' | 'text' | 'default';
export type ButtonSize = 'small' | 'middle' | 'large';
export type ButtonSemanticName = 'root' | 'icon' | 'content';
export type ButtonSemanticClassNames = Partial<Record<ButtonSemanticName, string>>;
export type ButtonSemanticStyles = Partial<Record<ButtonSemanticName, JSX.CSSProperties>>;

export interface ButtonProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'color'> {
  type?: ButtonType;
  variant?: ButtonVariant;
  danger?: boolean;
  ghost?: boolean;
  block?: boolean;
  shape?: 'default' | 'circle' | 'round';
  size?: ButtonSize;
  htmlType?: 'button' | 'submit' | 'reset';
  icon?: JSX.Element;
  iconPlacement?: 'start' | 'end';
  loading?: boolean | { delay?: number; icon?: JSX.Element };
  classNames?: ButtonSemanticClassNames;
  styles?: ButtonSemanticStyles;
}

const typeToVariant: Record<ButtonType, ButtonVariant> = {
  primary: 'solid',
  dashed: 'dashed',
  link: 'link',
  text: 'text',
  default: 'outlined',
};

export function Button(inputProps: ButtonProps) {
  const config = useConfig();
  const props = merge({
    type: 'default' as ButtonType,
    htmlType: 'button' as const,
    shape: 'default' as const,
    iconPlacement: 'start' as const,
  }, config.componentDefaults('button') as Partial<ButtonProps>, inputProps);
  const others = omit(
    props,
    'type', 'variant', 'danger', 'ghost', 'block', 'shape', 'size', 'htmlType',
    'icon', 'iconPlacement', 'loading', 'classNames', 'styles', 'children', 'class', 'style', 'disabled', 'onClick',
  );
  const initialLoading = untrack(() => typeof props.loading === 'object' && (props.loading.delay ?? 0) > 0 ? false : Boolean(props.loading));
  const [delayedLoading, setDelayedLoading] = createSignal(initialLoading, { ownedWrite: true });
  let loadingTimer: ReturnType<typeof setTimeout> | undefined;
  createEffect(
    () => props.loading,
    (loading) => {
      if (loadingTimer) clearTimeout(loadingTimer);
      loadingTimer = undefined;
      const delay = typeof loading === 'object' ? Math.max(0, loading.delay ?? 0) : 0;
      if (loading && delay > 0) {
        setDelayedLoading(false);
        loadingTimer = setTimeout(() => { setDelayedLoading(true); loadingTimer = undefined; }, delay);
      } else setDelayedLoading(Boolean(loading));
    },
  );
  onCleanup(() => { if (loadingTimer) clearTimeout(loadingTimer); });
  const isLoading = createMemo(() => delayedLoading());
  const isDisabled = createMemo(() => props.disabled ?? config.componentDisabled());
  const variant = createMemo<ButtonVariant>(() => props.ghost ? 'outlined' : (props.variant ?? typeToVariant[props.type]));
  const size = createMemo<ButtonSize>(() => props.size ?? config.componentSize());
  const tokenStyle = (): JSX.CSSProperties => {
    const suffix = size() === 'small' ? '-sm' : size() === 'large' ? '-lg' : '';
    return {
      height: `var(--ads-button-control-height${suffix}, ${size() === 'small' ? '24px' : size() === 'large' ? '40px' : '32px'})`,
      'font-size': `var(--ads-button-content-font-size${suffix}, ${size() === 'large' ? '16px' : '14px'})`,
      'font-weight': 'var(--ads-button-font-weight, 400)',
      'padding-inline': `var(--ads-button-padding-inline${suffix}, ${size() === 'small' ? '8px' : '15px'})`,
      gap: 'var(--ads-button-icon-gap, 8px)',
    };
  };
  const spinner = () => typeof props.loading === 'object' && props.loading.icon
    ? props.loading.icon
    : <span aria-hidden="true" class="ads-spin size-3.5 rounded-full border-2 border-current border-r-transparent" />;
  const icon = () => isLoading() ? spinner() : props.icon;

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
    if (isLoading()) {
      event.preventDefault();
      return;
    }
    if (typeof props.onClick === 'function') props.onClick(event);
  };

  return (
    <button
      {...others}
      type={props.htmlType}
      disabled={isDisabled() || isLoading()}
      aria-busy={isLoading() ? 'true' : undefined}
      data-variant={variant()}
      data-danger={props.danger ? 'true' : undefined}
      class={button({ variant: variant(), danger: props.danger, size: size(), shape: props.shape, block: props.block, class: [props.class as string | undefined, props.classNames?.root] })}
      style={{ ...tokenStyle(), ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}
      onClick={handleClick}
    >
      <Show when={props.iconPlacement === 'start' && icon()}><span class={['inline-flex', props.classNames?.icon]} style={props.styles?.icon}>{icon()}</span></Show>
      <Show when={props.children}><span class={props.classNames?.content} style={props.styles?.content}>{props.children}</span></Show>
      <Show when={props.iconPlacement === 'end' && icon()}><span class={['inline-flex', props.classNames?.icon]} style={props.styles?.icon}>{icon()}</span></Show>
    </button>
  );
}
