import { merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { useConfig } from '../config-provider';

export const PRESENTED_IMAGE_DEFAULT = 'default' as const;
export const PRESENTED_IMAGE_SIMPLE = 'simple' as const;

export type EmptySemanticName = 'root' | 'image' | 'description' | 'footer';
export type EmptySemanticClassNames = Partial<Record<EmptySemanticName, string>>;
export type EmptySemanticStyles = Partial<Record<EmptySemanticName, JSX.CSSProperties>>;

export interface EmptyProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title'> {
  image?: JSX.Element | string;
  imageStyle?: JSX.CSSProperties;
  description?: JSX.Element | false;
  classNames?: EmptySemanticClassNames;
  styles?: EmptySemanticStyles;
}

export function Empty(inputProps: EmptyProps) {
  const config = useConfig();
  const props = merge({ image: PRESENTED_IMAGE_DEFAULT as JSX.Element | string }, config.componentDefaults('empty') as Partial<EmptyProps>, inputProps);
  const description = () => props.description ?? config.locale().Empty?.description ?? 'No data';
  const others = omit(props, 'image', 'imageStyle', 'description', 'classNames', 'styles', 'children', 'class', 'style');
  const preset = () => props.image === PRESENTED_IMAGE_DEFAULT || props.image === PRESENTED_IMAGE_SIMPLE;
  const simple = () => props.image === PRESENTED_IMAGE_SIMPLE;
  const imageContent = () => {
    if (preset()) {
      return (
        <div class={simple() ? 'relative mx-auto h-10 w-16' : 'relative mx-auto h-16 w-24'} aria-hidden="true">
          <div class="absolute inset-x-1 bottom-1 h-3 rounded-[50%] bg-border-secondary opacity-60" />
          <div class="absolute inset-x-3 bottom-2 h-8 rounded-small border border-border bg-surface-container">
            <div class="mx-auto mt-2 h-px w-1/2 bg-border" />
            <div class="mx-auto mt-1.5 h-px w-1/3 bg-border-secondary" />
          </div>
        </div>
      );
    }
    if (typeof props.image === 'string') return <img src={props.image} alt="" class="mx-auto max-h-full max-w-full object-contain" />;
    return props.image;
  };

  return (
    <div {...others} class={['ads-empty my-8 text-center text-sm text-text-secondary', props.class, props.classNames?.root]} style={{ ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}>
      <div class={['mb-2 h-16', props.classNames?.image]} style={{ ...props.imageStyle, ...props.styles?.image }}>{imageContent()}</div>
      <Show when={props.description !== false}><div class={['leading-[22px]', props.classNames?.description]} style={props.styles?.description}>{description()}</div></Show>
      <Show when={props.children}><div class={['mt-4', props.classNames?.footer]} style={props.styles?.footer}>{props.children}</div></Show>
    </div>
  );
}
