import dayjs, { type Dayjs } from 'dayjs';
import { createSignal, For, merge, omit, Show, untrack } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { useConfig } from '../config-provider';

export type CalendarSemanticName = 'root' | 'header' | 'body' | 'content' | 'item' | 'itemContent';
export type CalendarSemanticClassNames = Partial<Record<CalendarSemanticName, string>>;
export type CalendarSemanticStyles = Partial<Record<CalendarSemanticName, JSX.CSSProperties>>;

export interface CalendarHeaderRenderProps {
  value: Dayjs;
  type: 'month' | 'year';
  onChange: (date: Dayjs) => void;
  onTypeChange: (type: 'month' | 'year') => void;
}

export interface CalendarProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSelect'> {
  value?: Dayjs;
  defaultValue?: Dayjs;
  fullscreen?: boolean;
  mode?: 'month' | 'year';
  validRange?: readonly [Dayjs, Dayjs];
  disabledDate?: (date: Dayjs) => boolean;
  headerRender?: (props: CalendarHeaderRenderProps) => JSX.Element;
  cellRender?: (date: Dayjs, info: { type: 'date' | 'month'; originNode: JSX.Element; today: Dayjs }) => JSX.Element;
  dateCellRender?: (date: Dayjs) => JSX.Element;
  dateFullCellRender?: (date: Dayjs) => JSX.Element;
  monthCellRender?: (date: Dayjs) => JSX.Element;
  monthFullCellRender?: (date: Dayjs) => JSX.Element;
  onChange?: (date: Dayjs) => void;
  onPanelChange?: (date: Dayjs, mode: 'month' | 'year') => void;
  onSelect?: (date: Dayjs, info: { source: 'year' | 'month' | 'date' | 'customize' }) => void;
  classNames?: CalendarSemanticClassNames;
  styles?: CalendarSemanticStyles;
}

export interface CalendarDateAdapter<Value> { toDayjs: (value: Value) => Dayjs; fromDayjs: (value: Dayjs) => Value; now?: () => Value }
export interface GeneratedCalendarProps<Value> extends Omit<CalendarProps, 'value' | 'defaultValue' | 'validRange' | 'disabledDate' | 'headerRender' | 'cellRender' | 'dateCellRender' | 'dateFullCellRender' | 'monthCellRender' | 'monthFullCellRender' | 'onChange' | 'onPanelChange' | 'onSelect'> {
  value?: Value; defaultValue?: Value; validRange?: readonly [Value, Value]; disabledDate?: (date: Value) => boolean; onChange?: (date: Value) => void; onPanelChange?: (date: Value, mode: 'month' | 'year') => void; onSelect?: (date: Value, info: { source: 'year' | 'month' | 'date' | 'customize' }) => void;
}

export function Calendar(inputProps: CalendarProps) {
  const config = useConfig();
  const props = merge({ defaultValue: dayjs(), fullscreen: true }, config.componentDefaults('calendar') as Partial<CalendarProps>, inputProps);
  const initial = untrack(() => ({ value: props.defaultValue, mode: inputProps.mode ?? 'month' as const }));
  const [internalValue, setInternalValue] = createSignal(initial.value, { ownedWrite: true });
  const [internalMode, setInternalMode] = createSignal<'month' | 'year'>(initial.mode, { ownedWrite: true });
  const others = omit(props, 'value', 'defaultValue', 'fullscreen', 'mode', 'validRange', 'disabledDate', 'headerRender', 'cellRender', 'dateCellRender', 'dateFullCellRender', 'monthCellRender', 'monthFullCellRender', 'onChange', 'onPanelChange', 'onSelect', 'classNames', 'styles', 'class', 'style');
  const value = () => props.value ?? internalValue();
  const mode = () => inputProps.mode ?? internalMode();
  const disabled = (date: Dayjs) => Boolean((props.validRange && (date.isBefore(props.validRange[0], 'day') || date.isAfter(props.validRange[1], 'day'))) || props.disabledDate?.(date));
  const dates = () => {
    const start = value().startOf('month').startOf('week');
    return Array.from({ length: 42 }, (_, index) => start.add(index, 'day'));
  };
  const select = (date: Dayjs, source: 'year' | 'month' | 'date') => {
    if (disabled(date)) return;
    if (props.value === undefined) setInternalValue(date);
    props.onChange?.(date);
    props.onSelect?.(date, { source });
  };
  const changeView = (date: Dayjs) => {
    if (props.value === undefined) setInternalValue(date);
    props.onPanelChange?.(date, mode());
  };
  const changeMode = (next: 'month' | 'year') => {
    if (inputProps.mode === undefined) setInternalMode(next);
    props.onPanelChange?.(value(), next);
  };
  const header = () => props.headerRender?.({ value: value(), type: mode(), onChange: changeView, onTypeChange: changeMode }) ?? (
    <div class="flex items-center justify-end gap-2 p-3">
      <button type="button" aria-label="Previous period" class="h-8 rounded-control border border-border px-3 hover:border-primary" onClick={() => changeView(value().subtract(1, mode() === 'month' ? 'month' : 'year'))}>&lt;</button>
      <select aria-label="Calendar month" value={value().month()} class="h-8 rounded-control border border-border bg-surface px-2" onChange={(event) => changeView(value().month(Number(event.currentTarget.value)))}><For each={Array.from({ length: 12 }, (_, index) => index)}>{(month) => <option value={month}>{dayjs().month(month).format('MMM')}</option>}</For></select>
      <select aria-label="Calendar year" value={value().year()} class="h-8 rounded-control border border-border bg-surface px-2" onChange={(event) => changeView(value().year(Number(event.currentTarget.value)))}><For each={Array.from({ length: 21 }, (_, index) => value().year() - 10 + index)}>{(year) => <option value={year}>{year}</option>}</For></select>
      <div class="inline-flex"><button type="button" class={mode() === 'month' ? 'h-8 rounded-l-control bg-primary px-3 text-white' : 'h-8 rounded-l-control border border-border px-3'} onClick={() => changeMode('month')}>Month</button><button type="button" class={mode() === 'year' ? 'h-8 rounded-r-control bg-primary px-3 text-white' : 'h-8 rounded-r-control border border-border px-3'} onClick={() => changeMode('year')}>Year</button></div>
      <button type="button" aria-label="Next period" class="h-8 rounded-control border border-border px-3 hover:border-primary" onClick={() => changeView(value().add(1, mode() === 'month' ? 'month' : 'year'))}>&gt;</button>
    </div>
  );
  const dateCell = (date: Dayjs) => {
    const origin = <div class={['min-h-20 border-t-2 p-2 text-left', date.isSame(value(), 'day') ? 'border-primary bg-[#e6f4ff]' : 'border-transparent', !date.isSame(value(), 'month') ? 'text-text-disabled' : '']}><div class="text-right text-sm">{date.date()}</div><Show when={props.dateCellRender}><div>{props.dateCellRender?.(date)}</div></Show></div>;
    return props.dateFullCellRender?.(date) ?? props.cellRender?.(date, { type: 'date', originNode: origin, today: dayjs() }) ?? origin;
  };
  const monthCell = (date: Dayjs) => {
    const origin = <div class={['min-h-24 rounded-control p-3 text-left hover:bg-surface-container', date.isSame(value(), 'month') ? 'bg-[#e6f4ff] text-primary' : '']}><div class="font-semibold">{date.format('MMMM')}</div><Show when={props.monthCellRender}><div>{props.monthCellRender?.(date)}</div></Show></div>;
    return props.monthFullCellRender?.(date) ?? props.cellRender?.(date, { type: 'month', originNode: origin, today: dayjs() }) ?? origin;
  };

  return (
    <div {...others} class={['ads-calendar overflow-hidden rounded-surface border border-border-secondary bg-surface text-text', props.fullscreen ? 'w-full' : 'w-80', props.class, props.classNames?.root]} style={{ ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}>
      <div class={props.classNames?.header} style={props.styles?.header}>{header()}</div>
      <div class={props.classNames?.body} style={props.styles?.body}>
        <Show when={mode() === 'month'} fallback={<div class={['grid grid-cols-3 gap-2 p-3', props.classNames?.content]} style={props.styles?.content}><For each={Array.from({ length: 12 }, (_, index) => value().month(index))}>{(date) => <button type="button" disabled={disabled(date)} class={props.classNames?.item} style={props.styles?.item} onClick={() => select(date, 'month')}><div class={props.classNames?.itemContent} style={props.styles?.itemContent}>{monthCell(date)}</div></button>}</For></div>}>
          <div class={props.classNames?.content} style={props.styles?.content}>
            <div class="grid grid-cols-7 border-t border-border-secondary bg-surface-container text-center text-sm font-semibold"><For each={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}>{(day) => <div class="p-2">{day}</div>}</For></div>
            <div class="grid grid-cols-7"><For each={dates()}>{(date) => <button type="button" aria-label={date.format('YYYY-MM-DD')} disabled={disabled(date)} class={['border-r border-t border-border-secondary disabled:bg-surface-container', props.classNames?.item]} style={props.styles?.item} onClick={() => select(date, 'date')}><div class={props.classNames?.itemContent} style={props.styles?.itemContent}>{dateCell(date)}</div></button>}</For></div>
          </div>
        </Show>
      </div>
    </div>
  );
}

export function generateCalendar<Value>(adapter: CalendarDateAdapter<Value>) {
  return function GeneratedCalendar(props: GeneratedCalendarProps<Value>) {
    const mapped = omit(props, 'value', 'defaultValue', 'validRange', 'disabledDate', 'onChange', 'onPanelChange', 'onSelect');
    return <Calendar {...mapped} value={props.value === undefined ? undefined : adapter.toDayjs(props.value)} defaultValue={props.defaultValue === undefined ? adapter.now ? adapter.toDayjs(adapter.now()) : undefined : adapter.toDayjs(props.defaultValue)} validRange={props.validRange ? [adapter.toDayjs(props.validRange[0]), adapter.toDayjs(props.validRange[1])] : undefined} disabledDate={props.disabledDate ? (date) => props.disabledDate!(adapter.fromDayjs(date)) : undefined} onChange={(date) => props.onChange?.(adapter.fromDayjs(date))} onPanelChange={(date, mode) => props.onPanelChange?.(adapter.fromDayjs(date), mode)} onSelect={(date, info) => props.onSelect?.(adapter.fromDayjs(date), info)} />;
  };
}
