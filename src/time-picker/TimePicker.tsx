import dayjs, { type Dayjs } from 'dayjs';
import { createSignal, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { CloseIcon } from '../_internal/icons';
import { useConfig } from '../config-provider';
import { useFormItemControl } from '../form/context';

export interface TimePickerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSelect'> {
  value?: Dayjs | null;
  defaultValue?: Dayjs | null;
  format?: string;
  use12Hours?: boolean;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  disabled?: boolean;
  allowClear?: boolean;
  placeholder?: string;
  size?: 'small' | 'middle' | 'large';
  status?: 'error' | 'warning';
  onChange?: (time: Dayjs | null, timeString: string) => void;
  onSelect?: (time: Dayjs) => void;
  onOpenChange?: (open: boolean) => void;
}

export interface TimeRangePickerProps extends Omit<TimePickerProps, 'value' | 'defaultValue' | 'onChange' | 'placeholder'> {
  value?: readonly [Dayjs | null, Dayjs | null] | null;
  defaultValue?: readonly [Dayjs | null, Dayjs | null] | null;
  placeholder?: readonly [string, string];
  onChange?: (times: [Dayjs | null, Dayjs | null] | null, timeStrings: [string, string]) => void;
}

const inputFormat = (format: string) => format.includes('ss') ? 'HH:mm:ss' : 'HH:mm';
const inputStep = (props: { secondStep?: number; minuteStep?: number; format?: string }) => props.format?.includes('ss') ? props.secondStep ?? 1 : (props.minuteStep ?? 1) * 60;

export function TimePicker(inputProps: TimePickerProps) {
  const config = useConfig();
  const field = useFormItemControl();
  const props = merge({ format: 'HH:mm:ss', allowClear: true, hourStep: 1, minuteStep: 1, secondStep: 1 }, inputProps);
  const [internalValue, setInternalValue] = createSignal<Dayjs | null>(props.defaultValue ?? null, { ownedWrite: true });
  const others = omit(props, 'value', 'defaultValue', 'format', 'use12Hours', 'hourStep', 'minuteStep', 'secondStep', 'disabled', 'allowClear', 'placeholder', 'size', 'status', 'onChange', 'onSelect', 'onOpenChange', 'class', 'aria-label');
  const value = () => props.value !== undefined ? props.value : field?.value() !== undefined ? field.value() as Dayjs | null : internalValue();
  const disabled = () => props.disabled ?? field?.disabled() ?? false;
  const status = () => props.status ?? (field?.status() === 'error' ? 'error' : field?.status() === 'warning' ? 'warning' : undefined);
  const size = () => props.size ?? config.componentSize();
  const change = (next: Dayjs | null) => {
    if (props.value === undefined) { if (field) field.setValue(next); else setInternalValue(next); }
    props.onChange?.(next, next?.format(props.format) ?? '');
    if (next) props.onSelect?.(next);
  };
  const parse = (text: string) => {
    if (!text) return null;
    const parts = text.split(':').map(Number);
    return dayjs().hour(parts[0] ?? 0).minute(parts[1] ?? 0).second(parts[2] ?? 0).millisecond(0);
  };
  return (
    <div {...others} id={field?.id} class={['ads-time-picker inline-flex w-full items-center rounded-control border bg-surface text-sm', size() === 'small' ? 'h-6' : size() === 'large' ? 'h-10' : 'h-8', status() === 'error' ? 'border-error' : status() === 'warning' ? 'border-warning' : 'border-border', props.class]}>
      <input
        type="time"
        aria-label={props['aria-label'] ?? 'Choose time'}
        value={value()?.format(inputFormat(props.format)) ?? ''}
        placeholder={props.placeholder ?? config.locale().TimePicker?.placeholder ?? 'Select time'}
        step={inputStep(props)}
        disabled={disabled()}
        class="h-full min-w-0 flex-1 bg-transparent px-3 text-text outline-none disabled:text-text-disabled"
        onFocus={() => props.onOpenChange?.(true)}
        onBlur={() => { props.onOpenChange?.(false); if (field) void field.validate('onBlur'); }}
        onInput={(event) => change(parse(event.currentTarget.value))}
      />
      <Show when={props.allowClear && value() && !disabled()}><button type="button" aria-label="Clear time" class="mr-1 size-6 bg-transparent text-text-disabled" onClick={() => change(null)}><CloseIcon /></button></Show>
    </div>
  );
}

export function TimeRangePicker(inputProps: TimeRangePickerProps) {
  const props = merge({ format: 'HH:mm:ss' }, inputProps);
  const config = useConfig();
  const field = useFormItemControl();
  const [internal, setInternal] = createSignal<[Dayjs | null, Dayjs | null]>(props.defaultValue ? [...props.defaultValue] : [null, null], { ownedWrite: true });
  const value = (): [Dayjs | null, Dayjs | null] => props.value ? [...props.value] : field?.value() ? [...field.value() as [Dayjs | null, Dayjs | null]] : internal();
  const change = (index: number, time: Dayjs | null) => {
    const next: [Dayjs | null, Dayjs | null] = [...value()];
    next[index] = time;
    if (props.value === undefined) { if (field) field.setValue(next); else setInternal(next); }
    props.onChange?.(next, [next[0]?.format(props.format) ?? '', next[1]?.format(props.format) ?? '']);
  };
  const parse = (text: string) => text ? dayjs().hour(Number(text.split(':')[0])).minute(Number(text.split(':')[1])).second(Number(text.split(':')[2] ?? 0)).millisecond(0) : null;
  return (
    <div id={field?.id} class={['ads-time-range-picker inline-flex h-8 w-full items-center rounded-control border border-border bg-surface text-sm', props.class]}>
      <input type="time" aria-label="Start time" placeholder={props.placeholder?.[0] ?? config.locale().TimePicker?.rangePlaceholder?.[0] ?? 'Start time'} value={value()[0]?.format(inputFormat(props.format)) ?? ''} step={inputStep(props)} class="h-full min-w-0 flex-1 bg-transparent px-3 outline-none" onInput={(event) => change(0, parse(event.currentTarget.value))} />
      <span class="text-text-disabled">-</span>
      <input type="time" aria-label="End time" placeholder={props.placeholder?.[1] ?? config.locale().TimePicker?.rangePlaceholder?.[1] ?? 'End time'} value={value()[1]?.format(inputFormat(props.format)) ?? ''} step={inputStep(props)} class="h-full min-w-0 flex-1 bg-transparent px-3 outline-none" onInput={(event) => change(1, parse(event.currentTarget.value))} />
    </div>
  );
}

export const TimePickerComponent = Object.assign(TimePicker, { RangePicker: TimeRangePicker });
TimePicker.RangePicker = TimeRangePicker;
