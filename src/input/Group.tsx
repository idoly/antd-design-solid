import type { JSX } from '@solidjs/web';

export interface InputGroupProps extends JSX.HTMLAttributes<HTMLSpanElement> { compact?: boolean }

export function InputGroup(props: InputGroupProps) {
  return <span {...props} class={['ads-input-group inline-flex w-full min-w-0 [&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none', props.class]}>{props.children}</span>;
}
