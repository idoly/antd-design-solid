import { createSignal, omit, Show } from 'solid-js';
import { Dynamic } from '@solidjs/web';
import type { JSX } from '@solidjs/web';
import { tv } from 'tailwind-variants';
import { CloseIcon } from '../_internal/icons';

const presetColors = ['default', 'blue', 'green', 'red', 'orange', 'gold', 'purple', 'cyan', 'magenta'] as const;
type PresetColor = typeof presetColors[number];
const tag = tv({
  base: 'ads-tag inline-flex h-5 items-center gap-1 whitespace-nowrap rounded-small border px-[7px] text-xs leading-[18px]',
  variants: {
    color: {
      default: 'border-border bg-surface-container text-text', blue: 'border-[#91caff] bg-[#e6f4ff] text-[#0958d9]', green: 'border-[#b7eb8f] bg-[#f6ffed] text-[#389e0d]', red: 'border-[#ffccc7] bg-[#fff2f0] text-[#cf1322]', orange: 'border-[#ffd591] bg-[#fff7e6] text-[#d46b08]', gold: 'border-[#ffe58f] bg-[#fffbe6] text-[#d48806]', purple: 'border-[#d3adf7] bg-[#f9f0ff] text-[#531dab]', cyan: 'border-[#87e8de] bg-[#e6fffb] text-[#08979c]', magenta: 'border-[#ffadd2] bg-[#fff0f6] text-[#c41d7f]',
    },
    bordered: { false: 'border-transparent' },
  },
  defaultVariants: { color: 'default', bordered: true },
});

export interface TagProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'onClose'> {
  color?: string;
  variant?: 'filled' | 'solid' | 'outlined';
  bordered?: boolean;
  closable?: boolean;
  closeIcon?: JSX.Element;
  icon?: JSX.Element;
  href?: string;
  target?: string;
  disabled?: boolean;
  rootClass?: string;
  onClose?: (event: MouseEvent) => void;
}

export function InternalTag(props: TagProps) {
  const [visible, setVisible] = createSignal(true, { ownedWrite: true });
  const others = omit(props, 'color', 'variant', 'bordered', 'closable', 'closeIcon', 'icon', 'href', 'target', 'disabled', 'rootClass', 'onClose', 'children', 'class', 'style', 'onClick');
  const preset = (): PresetColor | undefined => presetColors.includes((props.color ?? 'default') as PresetColor) ? (props.color ?? 'default') as PresetColor : undefined;
  const customStyle = (): JSX.CSSProperties => {
    if (preset() || !props.color) return typeof props.style === 'object' ? props.style : {};
    if (props.variant === 'solid') return { 'background-color': props.color, 'border-color': props.color, color: '#fff', ...props.style as JSX.CSSProperties };
    if (props.variant === 'outlined') return { 'border-color': props.color, color: props.color, 'background-color': 'transparent', ...props.style as JSX.CSSProperties };
    return { 'border-color': props.color, color: props.color, 'background-color': `color-mix(in srgb, ${props.color} 10%, white)`, ...props.style as JSX.CSSProperties };
  };
  const close = (event: MouseEvent) => {
    event.stopPropagation();
    props.onClose?.(event);
    const prevented = event.defaultPrevented;
    event.preventDefault();
    if (!prevented) setVisible(false);
  };
  const variantClass = () => props.variant === 'solid' ? 'border-transparent bg-primary text-white' : props.variant === 'outlined' ? 'bg-transparent' : '';
  return <Show when={visible()}>
    <Dynamic
      component={props.href ? 'a' : 'span'}
      {...others}
      href={props.disabled ? undefined : props.href}
      target={props.target}
      aria-disabled={props.disabled ? 'true' : undefined}
      style={customStyle()}
      class={tag({ color: preset(), bordered: props.bordered, class: [variantClass(), props.disabled ? 'pointer-events-none opacity-50' : '', props.rootClass, props.class as string | undefined] })}
      onClick={(event: MouseEvent) => { if (props.disabled) event.preventDefault(); else if (typeof props.onClick === 'function') props.onClick(event as never); }}
    >
      <Show when={props.icon}><span aria-hidden="true" class="inline-flex">{props.icon}</span></Show>
      <span>{props.children}</span>
      <Show when={props.closable}><span role="button" tabindex={props.disabled ? -1 : 0} aria-label="Close" class="inline-flex size-3 items-center justify-center opacity-65 hover:opacity-100" onClick={close} onKeyDown={(event: KeyboardEvent) => { if (event.key === 'Enter' || event.key === ' ') close(event as unknown as MouseEvent); }}>{props.closeIcon ?? <CloseIcon />}</span></Show>
    </Dynamic>
  </Show>;
}
