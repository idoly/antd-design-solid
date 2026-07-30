import { omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { tv } from 'tailwind-variants';

const dot = tv({
  base: 'inline-block size-1.5 shrink-0 rounded-full',
  variants: {
    status: {
      success: 'bg-success',
      processing: 'bg-info ring-2 ring-info/20',
      default: 'bg-text-disabled',
      error: 'bg-error',
      warning: 'bg-warning',
    },
  },
  defaultVariants: { status: 'default' },
});

export interface BadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  count?: number | string | JSX.Element;
  dot?: boolean;
  showZero?: boolean;
  overflowCount?: number;
  status?: 'success' | 'processing' | 'default' | 'error' | 'warning';
  text?: JSX.Element;
  color?: string;
}

export function Badge(props: BadgeProps) {
  const others = omit(props, 'count', 'dot', 'showZero', 'overflowCount', 'status', 'text', 'color', 'children', 'class');
  const overflow = () => props.overflowCount ?? 99;
  const hidden = () => !props.dot && !props.showZero && (props.count === 0 || props.count == null);
  const count = () => typeof props.count === 'number' && props.count > overflow() ? `${overflow()}+` : props.count;

  return (
    <Show
      when={!props.status}
      fallback={<span {...others} class={['ads-badge-status inline-flex items-center gap-2 text-sm text-text', props.class]}><span class={dot({ status: props.status })} style={{ 'background-color': props.color }} />{props.text}</span>}
    >
      <span {...others} class={['ads-badge relative inline-flex align-middle', props.class]}>
        {props.children}
        <Show when={!hidden()}>
          <sup class={[props.dot ? 'size-1.5 min-w-0 p-0' : 'h-5 min-w-5 px-1.5', 'absolute right-0 top-0 z-10 flex -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-error text-xs leading-5 text-white shadow-[0_0_0_1px_var(--ads-color-surface)]']} style={{ 'background-color': props.color }}>
            <Show when={!props.dot}>{count()}</Show>
          </sup>
        </Show>
      </span>
    </Show>
  );
}
