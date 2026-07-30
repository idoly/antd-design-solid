import { createEffect, createSignal, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { useConfig } from '../config-provider';

let defaultIndicator: JSX.Element;
export function setDefaultIndicator(indicator?: JSX.Element) { defaultIndicator = indicator; }

export type SpinSemanticName = 'root' | 'section' | 'indicator' | 'description' | 'container';
export type SpinSemanticClassNames = Partial<Record<SpinSemanticName, string>>;
export type SpinSemanticStyles = Partial<Record<SpinSemanticName, JSX.CSSProperties>>;

export interface SpinProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
  spinning?: boolean;
  delay?: number;
  size?: 'small' | 'default' | 'large';
  tip?: JSX.Element;
  indicator?: JSX.Element;
  fullscreen?: boolean;
  percent?: number | 'auto';
  wrapperClass?: string;
  children?: JSX.Element;
  classNames?: SpinSemanticClassNames;
  styles?: SpinSemanticStyles;
}

export function Spin(inputProps: SpinProps) {
  const config = useConfig();
  const props = merge({ spinning: true, delay: 0, size: 'default' as const, fullscreen: false }, config.componentDefaults('spin') as Partial<SpinProps>, inputProps);
  const [visible, setVisible] = createSignal(props.spinning && props.delay <= 0, { ownedWrite: true });
  const others = omit(props, 'spinning', 'delay', 'size', 'tip', 'indicator', 'fullscreen', 'percent', 'wrapperClass', 'classNames', 'styles', 'children', 'class', 'style');
  const sizeClass = () => props.size === 'small' ? 'size-4' : props.size === 'large' ? 'size-8' : 'size-5';
  const dotTokenSize = () => props.size === 'small'
    ? 'var(--ads-spin-dot-size-sm, 16px)'
    : props.size === 'large'
      ? 'var(--ads-spin-dot-size-lg, 32px)'
      : 'var(--ads-spin-dot-size, 20px)';

  createEffect(
    () => [props.spinning, props.delay] as const,
    ([spinning, delay]) => {
      if (!spinning) {
        setVisible(false);
        return;
      }
      if (delay <= 0) {
        setVisible(true);
        return;
      }
      const timer = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(timer);
    },
  );

  const indicator = () => props.indicator ?? defaultIndicator ?? <span aria-hidden="true" class={['ads-spin rounded-full border-2 border-primary border-r-transparent', sizeClass()]} style={{ width: dotTokenSize(), height: dotTokenSize() }} />;
  const spinner = () => (
    <Show when={visible()}>
      <div
        {...others}
        role="status"
        aria-live="polite"
        aria-label={typeof props.tip === 'string' ? props.tip : 'Loading'}
        class={[
          'ads-spin-container flex flex-col items-center justify-center gap-2 text-sm text-primary',
          props.fullscreen ? 'fixed inset-0 z-[2010] bg-surface/85' : '',
          props.class,
          props.classNames?.root,
        ]}
        style={{ ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}
      >
        <div class={['flex flex-col items-center justify-center gap-2', props.classNames?.section]} style={props.styles?.section}>
          <div class={['relative inline-flex items-center justify-center', props.classNames?.indicator]} style={props.styles?.indicator}>
            {indicator()}
            <Show when={typeof props.percent === 'number'}><span class="absolute text-[9px] font-semibold">{Math.round(Math.min(100, Math.max(0, props.percent as number)))}</span></Show>
          </div>
          <Show when={props.tip}><div class={props.classNames?.description} style={props.styles?.description}>{props.tip}</div></Show>
        </div>
      </div>
    </Show>
  );

  return props.children ? (
    <div class={['ads-spin-wrapper relative', props.wrapperClass]} aria-busy={visible() ? 'true' : 'false'}>
      <div class={[visible() ? 'pointer-events-none opacity-50 transition-opacity duration-[var(--ads-motion-mid)]' : '', props.classNames?.container]} style={{ 'min-height': visible() ? 'var(--ads-spin-content-height, auto)' : undefined, ...props.styles?.container }}>{props.children}</div>
      <Show when={!props.fullscreen && visible()}><div class="absolute inset-0 flex items-center justify-center">{spinner()}</div></Show>
      <Show when={props.fullscreen}>{spinner()}</Show>
    </div>
  ) : spinner();
}
