import { Show } from 'solid-js';
import type { JSX } from '@solidjs/web';

export interface CardMetaProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title'> {
  avatar?: JSX.Element;
  title?: JSX.Element;
  description?: JSX.Element;
}

export function CardMeta(props: CardMetaProps) {
  return <div class={['ads-card-meta flex min-w-0 items-start gap-4', props.class]} style={props.style}>
    <Show when={props.avatar}><div class="shrink-0">{props.avatar}</div></Show>
    <div class="min-w-0 flex-1">
      <Show when={props.title}><div class="truncate font-semibold text-text">{props.title}</div></Show>
      <Show when={props.description}><div class="mt-1 text-sm leading-[22px] text-text-secondary">{props.description}</div></Show>
      {props.children}
    </div>
  </div>;
}
