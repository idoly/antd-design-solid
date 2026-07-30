import { createEffect, createSignal, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { useConfig } from '../config-provider';
import { Skeleton } from '../skeleton';

export type StatisticSemanticName = 'root' | 'header' | 'title' | 'prefix' | 'content' | 'value' | 'suffix';
export type StatisticSemanticClassNames = Partial<Record<StatisticSemanticName, string>>;
export type StatisticSemanticStyles = Partial<Record<StatisticSemanticName, JSX.CSSProperties>>;

export interface StatisticProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title' | 'prefix' | 'onChange'> {
  title?: JSX.Element;
  value?: string | number;
  precision?: number;
  decimalSeparator?: string;
  groupSeparator?: string;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
  formatter?: (value: string | number) => JSX.Element;
  loading?: boolean;
  valueStyle?: JSX.CSSProperties;
  classNames?: StatisticSemanticClassNames;
  styles?: StatisticSemanticStyles;
}

export interface CountdownProps extends Omit<StatisticProps, 'value' | 'formatter'> {
  value: number | Date;
  format?: string;
  onFinish?: () => void;
  onChange?: (value: number) => void;
}

const formatNumber = (value: number, precision?: number, groupSeparator = ',', decimalSeparator = '.'): string => {
  const fixed = precision === undefined ? String(value) : value.toFixed(precision);
  const [integer, decimal] = fixed.split('.');
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);
  return decimal === undefined ? grouped : `${grouped}${decimalSeparator}${decimal}`;
};

function StatisticRoot(inputProps: StatisticProps) {
  const config = useConfig();
  const props = merge({ value: 0, decimalSeparator: '.', groupSeparator: ',' }, config.componentDefaults('statistic') as Partial<StatisticProps>, inputProps);
  const others = omit(props, 'title', 'value', 'precision', 'decimalSeparator', 'groupSeparator', 'prefix', 'suffix', 'formatter', 'loading', 'valueStyle', 'classNames', 'styles', 'class', 'style');
  const displayValue = () => props.formatter
    ? props.formatter(props.value)
    : typeof props.value === 'number'
      ? formatNumber(props.value, props.precision, props.groupSeparator, props.decimalSeparator)
      : props.value;

  return (
    <div {...others} class={['ads-statistic min-w-0 text-text', props.class, props.classNames?.root]} style={{ ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}>
      <Show when={props.title}><div class={['mb-1', props.classNames?.header]} style={props.styles?.header}><div class={['text-sm leading-[22px] text-text-secondary', props.classNames?.title]} style={props.styles?.title}>{props.title}</div></div></Show>
      <Show when={!props.loading} fallback={<Skeleton title={false} paragraph={{ rows: 1, width: '60%' }} active />}>
        <div class={['flex min-w-0 items-baseline gap-1 text-2xl leading-8', props.classNames?.content]} style={{ ...props.valueStyle, ...props.styles?.content }}>
          <Show when={props.prefix}><span class={['shrink-0 text-lg', props.classNames?.prefix]} style={props.styles?.prefix}>{props.prefix}</span></Show>
          <span class={['min-w-0 truncate', props.classNames?.value]} style={props.styles?.value}>{displayValue()}</span>
          <Show when={props.suffix}><span class={['shrink-0 text-base text-text-secondary', props.classNames?.suffix]} style={props.styles?.suffix}>{props.suffix}</span></Show>
        </div>
      </Show>
    </div>
  );
}

export interface StatisticTimerProps extends Omit<StatisticProps, 'formatter' | 'value'> {
  type: 'countdown' | 'countup';
  value?: number | Date;
  format?: string;
  onFinish?: () => void;
  onChange?: (value: number) => void;
}

const pad = (value: number, length = 2) => String(Math.max(0, Math.floor(value))).padStart(length, '0');
const formatDuration = (total: number, format: string) => {
  const days = Math.floor(total / 86400000);
  const hours = Math.floor(total / 3600000) % 24;
  const totalHours = Math.floor(total / 3600000);
  const minutes = Math.floor(total / 60000) % 60;
  const seconds = Math.floor(total / 1000) % 60;
  const milliseconds = total % 1000;
  return format
    .replace(/DD/g, pad(days))
    .replace(/HH/g, pad(format.includes('DD') ? hours : totalHours))
    .replace(/mm/g, pad(minutes))
    .replace(/ss/g, pad(seconds))
    .replace(/SSS/g, pad(milliseconds, 3));
};

export function Countdown(inputProps: CountdownProps) {
  const props = merge({ format: 'HH:mm:ss' }, inputProps);
  const target = () => props.value instanceof Date ? props.value.getTime() : props.value;
  const [remaining, setRemaining] = createSignal(Math.max(0, target() - Date.now()), { ownedWrite: true });
  let finished = false;

  createEffect(
    () => target(),
    (timestamp) => {
      finished = false;
      const update = () => {
        const next = Math.max(0, timestamp - Date.now());
        setRemaining(next);
        props.onChange?.(next);
        if (next === 0 && !finished) {
          finished = true;
          props.onFinish?.();
        }
      };
      update();
      const timer = setInterval(update, 1000);
      return () => clearInterval(timer);
    },
  );

  const formatted = () => formatDuration(remaining(), props.format);
  const statisticProps = omit(props, 'value', 'format', 'onFinish', 'onChange');
  return <StatisticRoot {...statisticProps} value={formatted()} />;
}

export function StatisticTimer(inputProps: StatisticTimerProps) {
  const props = merge({ format: 'HH:mm:ss' }, inputProps);
  const timestamp = () => props.value instanceof Date ? props.value.getTime() : props.value ?? Date.now();
  const initialTimestamp = timestamp();
  const initialElapsed = props.type === 'countdown' ? Math.max(0, initialTimestamp - Date.now()) : Math.max(0, Date.now() - initialTimestamp);
  const [elapsed, setElapsed] = createSignal(initialElapsed, { ownedWrite: true });
  let finished = false;
  createEffect(
    () => [props.type, timestamp(), props.format] as const,
    ([type, activeTimestamp, format]) => {
      finished = false;
      const update = () => {
        const now = Date.now();
        const next = type === 'countdown' ? Math.max(0, activeTimestamp - now) : Math.max(0, now - activeTimestamp);
        setElapsed(next);
        props.onChange?.(next);
        if (type === 'countdown' && next === 0 && !finished) { finished = true; props.onFinish?.(); }
      };
      update();
      const timer = setInterval(update, format.includes('SSS') ? 30 : 1000);
      return () => clearInterval(timer);
    },
  );
  const statisticProps = omit(props, 'type', 'value', 'format', 'onFinish', 'onChange');
  return <StatisticRoot {...statisticProps} value={formatDuration(elapsed(), props.format)} />;
}

export const Statistic = Object.assign(StatisticRoot, { Countdown, Timer: StatisticTimer });
