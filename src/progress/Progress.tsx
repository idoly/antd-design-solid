import { For, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { CheckIcon, CloseIcon } from '../_internal/icons';
import { useConfig } from '../config-provider';

export type ProgressSemanticName = 'root' | 'body' | 'rail' | 'track' | 'indicator';
export type ProgressSemanticClassNames = Partial<Record<ProgressSemanticName, string>>;
export type ProgressSemanticStyles = Partial<Record<ProgressSemanticName, JSX.CSSProperties>>;

export interface ProgressProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
  percent?: number;
  type?: 'line' | 'circle' | 'dashboard';
  status?: 'normal' | 'active' | 'success' | 'exception';
  showInfo?: boolean;
  format?: (percent: number, successPercent?: number) => JSX.Element;
  strokeColor?: string;
  trailColor?: string;
  strokeWidth?: number;
  size?: 'small' | 'default' | number | [number, number];
  steps?: number;
  success?: { percent?: number; strokeColor?: string };
  gapDegree?: number;
  gapPosition?: 'top' | 'bottom' | 'left' | 'right';
  classNames?: ProgressSemanticClassNames;
  styles?: ProgressSemanticStyles;
}

const clamp = (value: number) => Math.min(100, Math.max(0, value));

export function Progress(inputProps: ProgressProps) {
  const config = useConfig();
  const props = merge({
    percent: 0,
    type: 'line' as const,
    showInfo: true,
    size: 'default' as const,
    gapDegree: 75,
    gapPosition: 'bottom' as const,
  }, config.componentDefaults('progress') as Partial<ProgressProps>, inputProps);
  const others = omit(
    props,
    'percent', 'type', 'status', 'showInfo', 'format', 'strokeColor', 'trailColor',
    'strokeWidth', 'size', 'steps', 'success', 'gapDegree', 'gapPosition', 'classNames', 'styles', 'class', 'style',
  );
  const percent = () => clamp(props.percent);
  const successPercent = () => clamp(props.success?.percent ?? 0);
  const status = (): NonNullable<ProgressProps['status']> => props.status ?? (percent() >= 100 ? 'success' : 'normal');
  const color = () => props.strokeColor ?? (status() === 'exception' ? 'var(--ads-color-error)' : status() === 'success' ? 'var(--ads-color-success)' : 'var(--ads-progress-default-color, var(--ads-color-primary))');
  const trailColor = () => props.trailColor ?? 'var(--ads-progress-remaining-color, var(--ads-color-border-secondary))';
  const info = () => {
    if (props.format) return props.format(percent(), successPercent());
    if (status() === 'success') return <CheckIcon aria-label="Complete" />;
    if (status() === 'exception') return <CloseIcon aria-label="Failed" />;
    return `${Math.round(percent())}%`;
  };
  const lineDimensions = () => {
    if (Array.isArray(props.size)) return { width: `${props.size[0]}px`, height: `${props.size[1]}px` };
    if (typeof props.size === 'number') return { width: `${props.size}px`, height: `${props.strokeWidth ?? 8}px` };
    return { width: '100%', height: `${props.strokeWidth ?? (props.size === 'small' ? 6 : 8)}px` };
  };
  const circleSize = () => Array.isArray(props.size) ? props.size[0] : typeof props.size === 'number' ? props.size : props.size === 'small' ? 80 : 120;
  const circleStrokeWidth = () => props.strokeWidth ?? 6;
  const radius = () => 50 - circleStrokeWidth() / 2;
  const circumference = () => 2 * Math.PI * radius();
  const gap = () => props.type === 'dashboard' ? Math.min(295, Math.max(0, props.gapDegree)) : 0;
  const availableLength = () => circumference() * (360 - gap()) / 360;
  const progressLength = () => availableLength() * percent() / 100;
  const rotation = () => {
    if (props.type !== 'dashboard') return -90;
    const base = { top: 90, right: 180, bottom: -90, left: 0 }[props.gapPosition];
    return base + gap() / 2;
  };

  return (
    <div
      {...others}
      role="progressbar"
      aria-label={props['aria-label'] ?? 'Progress'}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={percent()}
      aria-valuetext={`${Math.round(percent())}%`}
      class={['ads-progress inline-flex min-w-0 items-center gap-2 text-sm text-text', props.type !== 'line' ? 'relative justify-center' : 'w-full', props.class, props.classNames?.root]}
      style={{ ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}
    >
      <Show when={props.type === 'line'} fallback={
        <div class={['relative inline-flex shrink-0 items-center justify-center', props.classNames?.body]} style={{ width: `${circleSize()}px`, height: `${circleSize()}px`, ...props.styles?.body }}>
          <svg viewBox="0 0 100 100" class="size-full" aria-hidden="true">
            <circle
              cx="50"
              cy="50"
              r={radius()}
              fill="none"
              stroke={trailColor()}
              stroke-width={circleStrokeWidth()}
              stroke-linecap="round"
              stroke-dasharray={`${availableLength()} ${circumference()}`}
              transform={`rotate(${rotation()} 50 50)`}
              class={props.classNames?.rail}
              style={props.styles?.rail}
            />
            <circle
              cx="50"
              cy="50"
              r={radius()}
              fill="none"
              stroke={color()}
              stroke-width={circleStrokeWidth()}
              stroke-linecap="round"
              stroke-dasharray={`${progressLength()} ${circumference()}`}
              transform={`rotate(${rotation()} 50 50)`}
              class={['transition-[stroke-dasharray] duration-[var(--ads-motion-mid)]', props.classNames?.track]}
              style={props.styles?.track}
            />
          </svg>
          <Show when={props.showInfo}><span class={['absolute text-center text-sm text-text', props.classNames?.indicator]} style={{ color: 'var(--ads-progress-circle-text-color, var(--ads-color-text))', 'font-size': 'var(--ads-progress-circle-text-font-size, 14px)', ...props.styles?.indicator }}>{info()}</span></Show>
        </div>
      }>
        <div class={['min-w-0 flex-1', props.classNames?.body]} style={props.styles?.body}>
          <Show when={props.steps && props.steps > 0} fallback={
            <div class={['relative overflow-hidden rounded-full bg-border-secondary', props.classNames?.rail]} style={{ ...lineDimensions(), 'background-color': trailColor(), 'border-radius': 'var(--ads-progress-line-border-radius, 100px)', ...props.styles?.rail }}>
              <div class={['absolute inset-y-0 left-0 rounded-full transition-[width] duration-[var(--ads-motion-mid)]', props.classNames?.track]} style={{ width: `${percent()}%`, 'background-color': color(), ...props.styles?.track }} />
              <Show when={successPercent() > 0}>
                <div class="absolute inset-y-0 left-0 rounded-full bg-success transition-[width] duration-[var(--ads-motion-mid)]" style={{ width: `${successPercent()}%`, 'background-color': props.success?.strokeColor ?? 'var(--ads-color-success)' }} />
              </Show>
              <Show when={status() === 'active'}><div class="absolute inset-y-0 left-0 animate-pulse rounded-full bg-white/25" style={{ width: `${percent()}%` }} /></Show>
            </div>
          }>
            <div class="flex gap-1" style={{ width: lineDimensions().width }}>
              <For each={Array.from({ length: props.steps ?? 0 })}>{(_, index) => {
                const active = () => (index() + 1) / (props.steps ?? 1) * 100 <= percent();
                return <span class="h-2 min-w-0 flex-1 rounded-small" style={{ 'background-color': active() ? color() : trailColor() }} />;
              }}</For>
            </div>
          </Show>
        </div>
        <Show when={props.showInfo}><span class={['w-10 shrink-0 text-right text-text-secondary', props.classNames?.indicator]} style={props.styles?.indicator}>{info()}</span></Show>
      </Show>
    </div>
  );
}
