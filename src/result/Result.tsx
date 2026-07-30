import { merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { useConfig } from '../config-provider';

export type ResultSemanticName = 'root' | 'icon' | 'title' | 'subTitle' | 'extra' | 'body';
export type ResultSemanticClassNames = Partial<Record<ResultSemanticName, string>>;
export type ResultSemanticStyles = Partial<Record<ResultSemanticName, JSX.CSSProperties>>;

export type ResultStatusType = 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500';

export interface ResultProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title'> {
  status?: ResultStatusType;
  title?: JSX.Element;
  subTitle?: JSX.Element;
  icon?: JSX.Element;
  extra?: JSX.Element;
  classNames?: ResultSemanticClassNames;
  styles?: ResultSemanticStyles;
}

export interface ResultIconDefinition { label: string; text: string; class: string }
export const IconMap: Record<'success' | 'error' | 'info' | 'warning', ResultIconDefinition> = {
  success: { label: 'Success', text: 'ok', class: 'border-success text-success' }, error: { label: 'Error', text: 'x', class: 'border-error text-error' }, info: { label: 'Information', text: 'i', class: 'border-info text-info' }, warning: { label: 'Warning', text: '!', class: 'border-warning text-warning' },
};
export const ExceptionMap: Record<'403' | '404' | '500', ResultIconDefinition> = {
  '403': { label: 'Forbidden', text: '403', class: 'border-warning text-warning' }, '404': { label: 'Not found', text: '404', class: 'border-text-disabled text-text-secondary' }, '500': { label: 'Error', text: '500', class: 'border-error text-error' },
};
const statusIcon = (status: ResultStatusType): ResultIconDefinition => status in ExceptionMap ? ExceptionMap[status as keyof typeof ExceptionMap] : IconMap[status as keyof typeof IconMap];

export function Result(inputProps: ResultProps) {
  const config = useConfig();
  const props = merge(config.componentDefaults('result') as Partial<ResultProps>, inputProps);
  const others = omit(props, 'status', 'title', 'subTitle', 'icon', 'extra', 'classNames', 'styles', 'children', 'class', 'style');
  const status = (): ResultStatusType => props.status ?? 'info';
  const icon = () => statusIcon(status());
  return (
    <div {...others} class={['ads-result px-6 py-12 text-center text-text', props.class, props.classNames?.root]} style={{ ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}>
      <div class={['mb-6 flex justify-center', props.classNames?.icon]} style={props.styles?.icon}>
        <Show when={props.icon} fallback={
          <span role="img" aria-label={icon().label} class={['inline-flex size-18 items-center justify-center rounded-full border-2 text-xl font-semibold', icon().class]}>{icon().text}</span>
        }>
          <span class="inline-flex text-5xl">{props.icon}</span>
        </Show>
      </div>
      <Show when={props.title}><div class={['text-2xl leading-8', props.classNames?.title]} style={props.styles?.title}>{props.title}</div></Show>
      <Show when={props.subTitle}><div class={['mt-2 text-sm leading-[22px] text-text-secondary', props.classNames?.subTitle]} style={props.styles?.subTitle}>{props.subTitle}</div></Show>
      <Show when={props.extra}><div class={['mt-6 flex flex-wrap justify-center gap-2', props.classNames?.extra]} style={props.styles?.extra}>{props.extra}</div></Show>
      <Show when={props.children}><div class={['mx-auto mt-6 max-w-2xl text-left', props.classNames?.body]} style={props.styles?.body}>{props.children}</div></Show>
    </div>
  );
}
