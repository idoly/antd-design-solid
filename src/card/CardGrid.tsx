import type { JSX } from '@solidjs/web';

export interface CardGridProps extends JSX.HTMLAttributes<HTMLDivElement> { hoverable?: boolean }

export function CardGrid(props: CardGridProps) {
  return <div {...props} class={['ads-card-grid float-left w-1/3 border-b border-r border-border-secondary p-6 text-sm', props.hoverable !== false ? 'transition-shadow hover:relative hover:z-1 hover:shadow-popup' : '', props.class]}>{props.children}</div>;
}
