import { omit } from 'solid-js';
import type { JSX } from '@solidjs/web';

export interface CheckableTagProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'onChange'> {
  checked: boolean;
  icon?: JSX.Element;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export function CheckableTag(props: CheckableTagProps) {
  const others = omit(props, 'checked', 'icon', 'disabled', 'onChange', 'onClick', 'onKeyDown', 'class', 'children', 'role', 'tabindex', 'aria-checked', 'aria-disabled');
  const toggle = () => { if (!props.disabled) props.onChange?.(!props.checked); };
  return <span
    {...others}
    role="checkbox"
    tabindex={props.disabled ? -1 : props.tabindex ?? 0}
    aria-checked={props.checked ? 'true' : 'false'}
    aria-disabled={props.disabled ? 'true' : undefined}
    class={['ads-checkable-tag inline-flex min-h-6 cursor-pointer select-none items-center gap-1 rounded-small border px-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/20', props.checked ? 'border-primary bg-primary text-white' : 'border-transparent bg-surface-container text-text hover:text-primary', props.disabled ? 'cursor-not-allowed opacity-50' : '', props.class]}
    onClick={(event) => { if (!props.disabled) { toggle(); if (typeof props.onClick === 'function') props.onClick(event); } }}
    onKeyDown={(event) => { if ((event.key === 'Enter' || event.key === ' ') && !props.disabled) { event.preventDefault(); toggle(); } if (typeof props.onKeyDown === 'function') props.onKeyDown(event); }}
  >{props.icon}{props.children}</span>;
}
