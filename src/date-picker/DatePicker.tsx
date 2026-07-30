import dayjs, { type Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { createEffect, createSignal, For, merge, omit, Show, untrack } from 'solid-js';
import { Dynamic } from '@solidjs/web';
import type { JSX } from '@solidjs/web';
import { CalendarIcon, CloseIcon, LeftIcon, RightIcon } from '../_internal/icons';
import { Popover } from '../popover';
import { useConfig } from '../config-provider';
import { useFormItemControl } from '../form/context';

dayjs.extend(customParseFormat);

export type PickerMode = 'date' | 'week' | 'month' | 'quarter' | 'year';
export type DatePickerPanelMode = 'time' | 'date' | 'week' | 'month' | 'quarter' | 'year' | 'decade';
export type DatePickerValue = Dayjs | readonly Dayjs[] | null;
export type DatePickerFormat = string | readonly string[] | ((value: Dayjs) => string) | { format: string; type?: 'mask' };
export interface DatePickerDisabledTime { disabledHours?: () => number[]; disabledMinutes?: (hour: number) => number[]; disabledSeconds?: (hour: number, minute: number) => number[] }
const isDisabledTimeValue = (date: Dayjs, limits?: DatePickerDisabledTime) => Boolean(limits?.disabledHours?.().includes(date.hour()) || limits?.disabledMinutes?.(date.hour()).includes(date.minute()) || limits?.disabledSeconds?.(date.hour(), date.minute()).includes(date.second()));
export interface DatePickerShowTime { format?: string; defaultOpenValue?: Dayjs; defaultValue?: Dayjs; hideDisabledOptions?: boolean; hourStep?: number; minuteStep?: number; secondStep?: number }
export interface DatePickerLocale { lang?: { placeholder?: string; yearPlaceholder?: string; monthPlaceholder?: string; weekPlaceholder?: string; shortWeekDays?: string[]; shortMonths?: string[]; weekStartsOn?: number; firstWeekContainsDate?: number } }
export interface DatePickerComponents { input?: (props: JSX.InputHTMLAttributes<HTMLInputElement>) => JSX.Element; date?: (props: { children?: JSX.Element }) => JSX.Element; week?: (props: { children?: JSX.Element }) => JSX.Element; month?: (props: { children?: JSX.Element }) => JSX.Element; quarter?: (props: { children?: JSX.Element }) => JSX.Element; year?: (props: { children?: JSX.Element }) => JSX.Element; time?: (props: { children?: JSX.Element }) => JSX.Element }
export type DatePickerSemanticName = 'root' | 'prefix' | 'input' | 'suffix' | 'popupRoot' | 'popupContainer' | 'popupHeader' | 'popupBody' | 'popupContent' | 'popupItem' | 'popupFooter';
export type DatePickerClassNames = Partial<Record<DatePickerSemanticName, string>> | ((info: { props: DatePickerProps }) => Partial<Record<DatePickerSemanticName, string>>);
export type DatePickerStyles = Partial<Record<DatePickerSemanticName, JSX.CSSProperties>> | ((info: { props: DatePickerProps }) => Partial<Record<DatePickerSemanticName, JSX.CSSProperties>>);
export interface DatePickerPreset { label: JSX.Element; value: Dayjs | (() => Dayjs) }
export interface DatePickerCellRenderInfo { originNode: JSX.Element; today: Dayjs; type: PickerMode; range?: 'start' | 'end'; locale?: DatePickerLocale; subType?: 'hour' | 'minute' | 'second' | 'meridiem' }
export interface DatePickerDisabledDateInfo { from?: Dayjs; type: PickerMode }

export interface DatePickerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSelect' | 'prefix'> {
  value?: DatePickerValue;
  defaultValue?: DatePickerValue;
  format?: DatePickerFormat;
  picker?: PickerMode;
  mode?: DatePickerPanelMode;
  multiple?: boolean;
  order?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  disabledTime?: (date: Dayjs) => DatePickerDisabledTime;
  allowClear?: boolean;
  inputReadOnly?: boolean;
  preserveInvalidOnBlur?: boolean;
  previewValue?: false | 'hover';
  placeholder?: string;
  size?: 'small' | 'middle' | 'large';
  status?: 'error' | 'warning';
  bordered?: boolean;
  variant?: 'outlined' | 'borderless' | 'filled' | 'underlined';
  className?: string;
  style?: JSX.CSSProperties;
  classNames?: DatePickerClassNames;
  styles?: DatePickerStyles;
  presets?: readonly DatePickerPreset[];
  prefix?: JSX.Element;
  suffixIcon?: JSX.Element;
  clearIcon?: JSX.Element;
  prevIcon?: JSX.Element;
  nextIcon?: JSX.Element;
  superPrevIcon?: JSX.Element;
  superNextIcon?: JSX.Element;
  pickerValue?: Dayjs;
  defaultPickerValue?: Dayjs;
  needConfirm?: boolean;
  showNow?: boolean;
  showTime?: boolean | DatePickerShowTime;
  showWeek?: boolean;
  components?: DatePickerComponents;
  locale?: DatePickerLocale;
  getPopupContainer?: (trigger: HTMLElement) => HTMLElement;
  cellRender?: (date: Dayjs, info: DatePickerCellRenderInfo) => JSX.Element;
  dateRender?: (date: Dayjs, today: Dayjs) => JSX.Element;
  panelRender?: (panel: JSX.Element) => JSX.Element;
  renderExtraFooter?: (mode: PickerMode) => JSX.Element;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  popupClassName?: string;
  dropdownClassName?: string;
  popupStyle?: JSX.CSSProperties;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  disabledDate?: (date: Dayjs, info: DatePickerDisabledDateInfo) => boolean;
  onChange?: (date: DatePickerValue, dateString: string | string[]) => void;
  onOpenChange?: (open: boolean) => void;
  onPanelChange?: (date: Dayjs, mode: PickerMode) => void;
  onSelect?: (date: Dayjs) => void;
  onClear?: () => void;
  onOk?: (date: Dayjs | readonly Dayjs[]) => void;
}

export interface RangePickerShowTime extends Omit<DatePickerShowTime, 'defaultOpenValue' | 'defaultValue'> {
  defaultOpenValue?: readonly [Dayjs, Dayjs];
  defaultValue?: readonly [Dayjs, Dayjs];
}

export interface RangePickerPreset { label: JSX.Element; value: readonly [Dayjs | (() => Dayjs), Dayjs | (() => Dayjs)] | (() => readonly [Dayjs, Dayjs]) }

export interface RangePickerProps extends Omit<DatePickerProps, 'value' | 'defaultValue' | 'onChange' | 'placeholder' | 'disabledTime' | 'showTime' | 'presets' | 'disabled' | 'id' | 'onFocus' | 'onBlur' | 'onOk' | 'pickerValue' | 'defaultPickerValue' | 'mode' | 'onPanelChange'> {
  value?: readonly [Dayjs | null | undefined, Dayjs | null | undefined] | null;
  defaultValue?: readonly [Dayjs | null | undefined, Dayjs | null | undefined] | null;
  pickerValue?: readonly [Dayjs, Dayjs] | Dayjs | null;
  defaultPickerValue?: readonly [Dayjs, Dayjs] | Dayjs | null;
  mode?: readonly [DatePickerPanelMode, DatePickerPanelMode];
  placeholder?: readonly [string, string];
  id?: { start?: string; end?: string };
  disabled?: boolean | readonly [boolean, boolean];
  allowEmpty?: boolean | readonly [boolean, boolean];
  separator?: JSX.Element;
  disabledTime?: (date: Dayjs, type: 'start' | 'end', info: { from?: Dayjs }) => DatePickerDisabledTime;
  showTime?: boolean | RangePickerShowTime;
  presets?: readonly RangePickerPreset[];
  onChange?: (dates: [Dayjs | null, Dayjs | null] | null, dateStrings: [string, string]) => void;
  onCalendarChange?: (dates: [Dayjs | null, Dayjs | null], dateStrings: [string, string], info: { range: 'start' | 'end' }) => void;
  onOk?: (dates: [Dayjs | null, Dayjs | null]) => void;
  onPickerValueChange?: (dates: [Dayjs, Dayjs], info: { range: 'start' | 'end'; source: 'reset' | 'panel'; mode: [DatePickerPanelMode, DatePickerPanelMode] }) => void;
  onPanelChange?: (dates: [Dayjs | null, Dayjs | null], modes: [DatePickerPanelMode, DatePickerPanelMode]) => void;
  onFocus?: (event: FocusEvent, info: { range: 'start' | 'end' }) => void;
  onBlur?: (event: FocusEvent, info: { range: 'start' | 'end' }) => void;
}

const defaultFormat = (picker: PickerMode) => picker === 'year' ? 'YYYY' : picker === 'month' ? 'YYYY-MM' : 'YYYY-MM-DD';
const pickerInputTokenStyle = (size: 'small' | 'middle' | 'large'): JSX.CSSProperties => {
  const suffix = size === 'small' ? '-sm' : size === 'large' ? '-lg' : '';
  return {
    'padding-block': `var(--ads-date-picker-padding-block${suffix}, 0px)`,
    'padding-inline': `var(--ads-date-picker-padding-inline${suffix}, 12px)`,
    'font-size': `var(--ads-date-picker-input-font-size${suffix}, ${size === 'large' ? '16px' : '14px'})`,
  };
};
const startOfLocaleWeek = (date: Dayjs, weekStartsOn: number) => date.startOf('day').subtract((date.day() - weekStartsOn + 7) % 7, 'day');
const localeWeek = (date: Dayjs, weekStartsOn = 1, firstWeekContainsDate = 4): { year: number; week: number } => {
  const weekYearStart = (year: number) => startOfLocaleWeek(dayjs().year(year).month(0).date(firstWeekContainsDate), weekStartsOn);
  let year = date.year();
  if (date.isBefore(weekYearStart(year), 'day')) year -= 1;
  else if (!date.isBefore(weekYearStart(year + 1), 'day')) year += 1;
  return { year, week: Math.floor(date.startOf('day').diff(weekYearStart(year), 'day') / 7) + 1 };
};
const isoWeek = (date: Dayjs) => localeWeek(date);
const isDateArray = (value: DatePickerValue): value is readonly Dayjs[] => Array.isArray(value);
const formatPatterns = (custom?: DatePickerFormat): string[] => {
  if (custom === undefined || typeof custom === 'function') return [];
  if (typeof custom === 'string') return [custom];
  if (Array.isArray(custom)) return [...custom];
  return [(custom as { format: string }).format];
};
const formatPickerValue = (date: Dayjs, picker: PickerMode, custom?: DatePickerFormat) => {
  if (typeof custom === 'function') return custom(date);
  const pattern = formatPatterns(custom)[0];
  if (pattern) return date.format(pattern);
  if (picker === 'quarter') return `${date.year()}-Q${Math.floor(date.month() / 3) + 1}`;
  if (picker === 'week') { const value = isoWeek(date); return `${value.year}-W${String(value.week).padStart(2, '0')}`; }
  return date.format(defaultFormat(picker));
};

interface CalendarPanelProps {
  value?: Dayjs | null;
  values?: readonly Dayjs[];
  view: Dayjs;
  picker: PickerMode;
  modeControlled?: boolean;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  disabledDate?: (date: Dayjs, info: DatePickerDisabledDateInfo) => boolean;
  range?: 'start' | 'end';
  from?: Dayjs;
  onViewChange: (date: Dayjs) => void;
  onModeChange?: (mode: PickerMode) => void;
  onSelect: (date: Dayjs, mode: PickerMode) => PickerMode | void;
  previousLabel?: string;
  nextLabel?: string;
  previousIcon?: JSX.Element;
  nextIcon?: JSX.Element;
  cellRender?: DatePickerProps['cellRender'];
  dateRender?: DatePickerProps['dateRender'];
  showWeek?: boolean;
  locale?: DatePickerLocale;
  onHover?: (date: Dayjs | null) => void;
  classes?: Partial<Record<DatePickerSemanticName, string>>;
  styles?: Partial<Record<DatePickerSemanticName, JSX.CSSProperties>>;
}

function CalendarPanel(props: CalendarPanelProps) {
  let panelRef: HTMLDivElement | undefined;
  const [localPicker, setLocalPicker] = createSignal<PickerMode>(untrack(() => props.picker), { ownedWrite: true });
  const picker = () => props.modeControlled ? props.picker : localPicker();
  const changeMode = (next: PickerMode) => { if (!props.modeControlled) setLocalPicker(next); props.onModeChange?.(next); };
  const selectDate = (date: Dayjs) => {
    const next = props.onSelect(date, picker());
    if (next && !props.modeControlled) setLocalPicker(next);
  };
  const disabled = (date: Dayjs) => Boolean((props.minDate && date.isBefore(props.minDate, 'day')) || (props.maxDate && date.isAfter(props.maxDate, 'day')) || props.disabledDate?.(date, { from: props.from, type: picker() }));
  const samePeriod = (left: Dayjs | null | undefined, right: Dayjs) => {
    const current = picker();
    return Boolean(left && (current === 'quarter'
      ? left.year() === right.year() && Math.floor(left.month() / 3) === Math.floor(right.month() / 3)
      : left.isSame(right, current === 'date' || current === 'week' ? 'day' : current)));
  };
  const focusDate = (date: Dayjs) => {
    props.onViewChange(date);
    queueMicrotask(() => panelRef?.querySelector<HTMLElement>(`[data-picker-value="${date.valueOf()}"]`)?.focus());
  };
  const handleGridKeyDown = (event: KeyboardEvent, date: Dayjs) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (!disabled(date)) selectDate(date); return; }
    const horizontalUnit = picker() === 'year' ? 'year' : picker() === 'quarter' ? 'month' : picker() === 'month' ? 'month' : 'day';
    const horizontalStep = picker() === 'quarter' ? 3 : 1;
    const verticalStep = picker() === 'year' || picker() === 'month' ? 3 : picker() === 'quarter' ? 6 : 7;
    let next: Dayjs | undefined;
    let direction = 1;
    if (event.key === 'ArrowLeft') { next = date.subtract(horizontalStep, horizontalUnit); direction = -1; }
    else if (event.key === 'ArrowRight') next = date.add(horizontalStep, horizontalUnit);
    else if (event.key === 'ArrowUp') { next = date.subtract(verticalStep, horizontalUnit); direction = -1; }
    else if (event.key === 'ArrowDown') next = date.add(verticalStep, horizontalUnit);
    else if (event.key === 'Home') { next = picker() === 'date' || picker() === 'week' ? startOfLocaleWeek(date, weekStartsOn()) : picker() === 'year' ? date.year(years()[0].year()) : date.month(0); direction = -1; }
    else if (event.key === 'End') next = picker() === 'date' || picker() === 'week' ? startOfLocaleWeek(date, weekStartsOn()).add(6, 'day') : picker() === 'year' ? date.year(years().at(-1)!.year()) : date.month(picker() === 'quarter' ? 9 : 11);
    else if (event.key === 'PageUp') { next = date.subtract(1, event.shiftKey || picker() !== 'date' && picker() !== 'week' ? 'year' : 'month'); direction = -1; }
    else if (event.key === 'PageDown') next = date.add(1, event.shiftKey || picker() !== 'date' && picker() !== 'week' ? 'year' : 'month');
    if (!next) return;
    event.preventDefault();
    const stepUnit = picker() === 'date' || picker() === 'week' ? 'day' : horizontalUnit;
    for (let attempts = 0; attempts < 370 && disabled(next); attempts += 1) next = next.add(direction, stepUnit);
    focusDate(next);
  };
  const weekStartsOn = () => Math.min(6, Math.max(0, props.locale?.lang?.weekStartsOn ?? 0));
  const weekDays = () => {
    const days = props.locale?.lang?.shortWeekDays ?? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return [...days.slice(weekStartsOn()), ...days.slice(0, weekStartsOn())];
  };
  const weekInfo = (date: Dayjs) => localeWeek(date, weekStartsOn(), props.locale?.lang?.firstWeekContainsDate ?? (weekStartsOn() === 1 ? 4 : 1));
  const dates = () => {
    const start = startOfLocaleWeek(props.view.startOf('month'), weekStartsOn());
    return Array.from({ length: 42 }, (_, index) => start.add(index, 'day'));
  };
  const years = () => {
    const start = Math.floor(props.view.year() / 12) * 12;
    return Array.from({ length: 12 }, (_, index) => props.view.year(start + index));
  };
  const quarters = () => Array.from({ length: 4 }, (_, index) => ({ quarter: index + 1, date: props.view.month(index * 3) }));
  return (
    <div ref={panelRef} class={['w-72 p-3', props.classes?.popupContent]} style={props.styles?.popupContent} role="application" aria-label="Date picker">
      <div class={['mb-3 flex items-center justify-between', props.classes?.popupHeader]} style={props.styles?.popupHeader}>
        <button type="button" aria-label={props.previousLabel ?? 'Previous'} class="inline-flex size-8 items-center justify-center rounded-control hover:bg-surface-container" onClick={() => props.onViewChange(props.view.subtract(picker() === 'year' ? 12 : 1, picker() === 'year' ? 'year' : 'month'))}>{props.previousIcon ?? <LeftIcon />}</button>
        <button type="button" class="rounded-control px-2 py-1 font-semibold hover:bg-surface-container" aria-label={picker() === 'year' ? 'Year panel' : 'Choose month or year'} onClick={() => changeMode(picker() === 'date' || picker() === 'week' ? 'month' : 'year')}>{picker() === 'year' ? `${years()[0].year()}-${years()[11].year()}` : `${props.locale?.lang?.shortMonths?.[props.view.month()] ?? props.view.format('MMMM')} ${props.view.year()}`}</button>
        <button type="button" aria-label={props.nextLabel ?? 'Next'} class="inline-flex size-8 items-center justify-center rounded-control hover:bg-surface-container" onClick={() => props.onViewChange(props.view.add(picker() === 'year' ? 12 : 1, picker() === 'year' ? 'year' : 'month'))}>{props.nextIcon ?? <RightIcon />}</button>
      </div>
      <Show when={picker() === 'date' || picker() === 'week'}>
        <div class={['mb-1 grid text-center text-xs text-text-disabled', props.showWeek ? 'grid-cols-8' : 'grid-cols-7']}><Show when={props.showWeek}><span>Wk</span></Show><For each={weekDays()}>{(day) => <span>{day}</span>}</For></div>
        <div role="group" aria-label={`${props.view.format('MMMM YYYY')} calendar`} class={['grid gap-0.5', props.showWeek ? 'grid-cols-8' : 'grid-cols-7', props.classes?.popupBody]} style={props.styles?.popupBody} onPointerLeave={() => props.onHover?.(null)}>
          <For each={dates()}>{(date, index) => { const origin = <span>{date.date()}</span>; const selected = () => props.values?.some((value) => value.isSame(date, 'day')) || props.value?.isSame(date, 'day'); return <><Show when={props.showWeek && index() % 7 === 0}><span class="inline-flex items-center justify-center text-xs text-text-disabled">{weekInfo(date).week}</span></Show><button type="button" aria-label={date.format('YYYY-MM-DD')} aria-pressed={selected() ? 'true' : 'false'} tabindex={samePeriod(props.value ?? props.values?.[0] ?? props.view, date) ? 0 : -1} data-picker-value={date.valueOf()} disabled={disabled(date)} class={['ads-date-picker-popup-item inline-flex aspect-square items-center justify-center rounded-control text-sm hover:bg-surface-container disabled:text-text-disabled', !date.isSame(props.view, 'month') ? 'text-text-disabled' : '', selected() ? 'bg-primary text-white hover:bg-primary-hover' : '', date.isSame(dayjs(), 'day') && !selected() ? 'border border-primary text-primary' : '', props.classes?.popupItem]} style={{ width: 'var(--ads-date-picker-cell-width, 36px)', height: 'var(--ads-date-picker-cell-height, 24px)', ...props.styles?.popupItem }} onPointerEnter={() => props.onHover?.(date)} onKeyDown={(event) => handleGridKeyDown(event, date)} onClick={() => selectDate(date)}>{props.cellRender?.(date, { originNode: origin, today: dayjs(), type: picker(), range: props.range, locale: props.locale }) ?? props.dateRender?.(date, dayjs()) ?? origin}</button></>; }}</For>
        </div>
      </Show>
      <Show when={picker() === 'month'}><div role="group" aria-label={`${props.view.year()} months`} class="grid grid-cols-3 gap-2"><For each={Array.from({ length: 12 }, (_, index) => props.view.month(index))}>{(date) => <button type="button" aria-label={date.format('MMMM YYYY')} aria-pressed={samePeriod(props.value, date) ? 'true' : 'false'} tabindex={samePeriod(props.value ?? props.view, date) ? 0 : -1} data-picker-value={date.valueOf()} class={['rounded-control px-2 py-3 text-sm hover:bg-surface-container', props.value?.isSame(date, 'month') ? 'bg-primary text-white' : '']} onKeyDown={(event) => handleGridKeyDown(event, date)} onClick={() => selectDate(date)}>{date.format('MMM')}</button>}</For></div></Show>
      <Show when={picker() === 'quarter'}><div role="group" aria-label={`${props.view.year()} quarters`} class="grid grid-cols-2 gap-2"><For each={quarters()}>{({ quarter, date }) => <button type="button" aria-label={`Q${quarter} ${date.year()}`} aria-pressed={samePeriod(props.value, date) ? 'true' : 'false'} tabindex={samePeriod(props.value ?? props.view, date) ? 0 : -1} data-picker-value={date.valueOf()} class="rounded-control px-2 py-3 hover:bg-surface-container" onKeyDown={(event) => handleGridKeyDown(event, date)} onClick={() => selectDate(date)}>Q{quarter}</button>}</For></div></Show>
      <Show when={picker() === 'year'}><div role="group" aria-label={`${years()[0].year()} to ${years().at(-1)!.year()} years`} class="grid grid-cols-3 gap-2"><For each={years()}>{(date) => <button type="button" aria-label={String(date.year())} aria-pressed={samePeriod(props.value, date) ? 'true' : 'false'} tabindex={samePeriod(props.value ?? props.view, date) ? 0 : -1} data-picker-value={date.valueOf()} class={['rounded-control px-2 py-3 text-sm hover:bg-surface-container', props.value?.isSame(date, 'year') ? 'bg-primary text-white' : '']} onKeyDown={(event) => handleGridKeyDown(event, date)} onClick={() => selectDate(date)}>{date.year()}</button>}</For></div></Show>
    </div>
  );
}

export function DatePicker(inputProps: DatePickerProps) {
  const config = useConfig();
  const field = useFormItemControl();
  const props = merge({ picker: 'date' as PickerMode, defaultOpen: false, allowClear: true }, config.componentDefaults('datePicker') as Partial<DatePickerProps>, inputProps);
  const [internalValue, setInternalValue] = createSignal<DatePickerValue>(props.defaultValue ?? null, { ownedWrite: true });
  const initialPickerOpen = untrack(() => Boolean(props.open ?? props.defaultOpen));
  const [internalOpen, setInternalOpen] = createSignal(initialPickerOpen, { ownedWrite: true });
  let currentPickerOpen = initialPickerOpen;
  createEffect(() => props.open, (controlledOpen) => { if (controlledOpen !== undefined) currentPickerOpen = controlledOpen; });
  const initialDefaultValue = props.defaultValue ?? null;
  const initialView = props.defaultPickerValue ?? (isDateArray(initialDefaultValue) ? initialDefaultValue[0] : initialDefaultValue) ?? dayjs();
  const [internalView, setInternalView] = createSignal<Dayjs>(initialView, { ownedWrite: true });
  const initialPanelPicker: PickerMode = untrack(() => props.mode === 'month' || props.mode === 'year' ? props.mode : props.mode === 'decade' ? 'year' : props.picker);
  const [internalPanelPicker, setInternalPanelPicker] = createSignal<PickerMode>(initialPanelPicker, { ownedWrite: true });
  const [draft, setDraft] = createSignal<DatePickerValue>(props.defaultValue ?? null, { ownedWrite: true });
  const [inputText, setInputText] = createSignal('');
  let pendingInputText = '';
  const [preview, setPreview] = createSignal<Dayjs | null>(null, { ownedWrite: true });
  let pendingValue: DatePickerValue = props.defaultValue ?? null;
  const others = omit(props, 'value', 'defaultValue', 'format', 'picker', 'mode', 'multiple', 'order', 'open', 'defaultOpen', 'disabled', 'disabledTime', 'allowClear', 'inputReadOnly', 'preserveInvalidOnBlur', 'previewValue', 'placeholder', 'size', 'status', 'bordered', 'variant', 'className', 'classNames', 'styles', 'presets', 'prefix', 'suffixIcon', 'clearIcon', 'prevIcon', 'nextIcon', 'superPrevIcon', 'superNextIcon', 'pickerValue', 'defaultPickerValue', 'needConfirm', 'showNow', 'showTime', 'showWeek', 'components', 'locale', 'getPopupContainer', 'cellRender', 'dateRender', 'panelRender', 'renderExtraFooter', 'placement', 'popupClassName', 'dropdownClassName', 'popupStyle', 'minDate', 'maxDate', 'disabledDate', 'onChange', 'onOpenChange', 'onPanelChange', 'onSelect', 'onClear', 'onOk', 'class', 'style');
  const value = (): DatePickerValue => props.value !== undefined ? props.value : field?.value() !== undefined ? field.value() as DatePickerValue : internalValue();
  const values = (): readonly Dayjs[] => Array.isArray(value()) ? value() as readonly Dayjs[] : value() ? [value() as Dayjs] : [];
  const draftValues = (): readonly Dayjs[] => Array.isArray(draft()) ? draft() as readonly Dayjs[] : draft() ? [draft() as Dayjs] : [];
  const format = () => props.format;
  const open = () => props.open ?? internalOpen();
  const view = () => props.pickerValue ?? internalView();
  const semanticClasses = () => typeof props.classNames === 'function' ? props.classNames({ props }) : props.classNames ?? {};
  const semanticStyles = () => typeof props.styles === 'function' ? props.styles({ props }) : props.styles ?? {};
  const disabled = () => props.disabled ?? field?.disabled() ?? config.componentDisabled();
  const status = () => props.status ?? (field?.status() === 'error' ? 'error' : field?.status() === 'warning' ? 'warning' : undefined);
  const setOpen = (next: boolean) => {
    if (disabled() || next === currentPickerOpen) return;
    currentPickerOpen = next;
    if (props.open === undefined) setInternalOpen(next);
    props.onOpenChange?.(next);
  };
  const displayValue = (current: DatePickerValue = value()): string => {
    const list = isDateArray(current) ? current : current ? [current] : [];
    return list.map((date) => formatPickerValue(date, props.picker, format() ?? (props.showTime ? 'YYYY-MM-DD HH:mm:ss' : undefined))).join(', ');
  };
  const change = (next: DatePickerValue) => {
    if (props.value === undefined) { if (field) field.setValue(next); else setInternalValue(next); }
    const strings = isDateArray(next) ? next.map((date) => formatPickerValue(date, props.picker, format())) : next ? formatPickerValue(next, props.picker, format() ?? (props.showTime ? 'YYYY-MM-DD HH:mm:ss' : undefined)) : '';
    props.onChange?.(next, strings);
    pendingInputText = '';
    setInputText('');
  };
  const panelPicker = (): PickerMode => props.mode === 'month' || props.mode === 'year' ? props.mode : props.mode === 'decade' ? 'year' : props.mode === 'date' ? 'date' : internalPanelPicker();
  const setView = (date: Dayjs) => { if (props.pickerValue === undefined) setInternalView(date); props.onPanelChange?.(date, panelPicker()); };
  const setPanelPicker = (next: PickerMode) => { props.onPanelChange?.(view(), next); };
  const mergeTime = (date: Dayjs) => { const source = draftValues().at(-1) ?? values().at(-1) ?? (typeof props.showTime === 'object' ? props.showTime.defaultOpenValue ?? props.showTime.defaultValue : undefined); return source ? date.hour(source.hour()).minute(source.minute()).second(source.second()) : date; };
  const select = (rawDate: Dayjs) => {
    const date = props.showTime ? mergeTime(rawDate) : rawDate;
    props.onSelect?.(date); setView(date);
    let next: DatePickerValue = date;
    if (props.multiple) {
      const current = isDateArray(pendingValue) ? pendingValue : draftValues().length ? draftValues() : values();
      const same = (item: Dayjs) => props.picker === 'quarter' ? item.year() === date.year() && Math.floor(item.month() / 3) === Math.floor(date.month() / 3) : item.isSame(date, props.picker === 'date' ? 'day' : props.picker);
      next = current.some(same) ? current.filter((item) => !same(item)) : [...current, date];
      if (props.order !== false) next = [...next].sort((left, right) => left.valueOf() - right.valueOf());
    }
    const confirmRequired = props.needConfirm ?? Boolean(props.showTime || props.multiple);
    if (confirmRequired) { pendingValue = next; setDraft(next); } else { change(next); setOpen(false); }
  };
  const isConfirmationDisabled = (next: DatePickerValue) => {
    const dates = isDateArray(next) ? next : next ? [next] : [];
    return dates.length === 0 || dates.some((date) => isDisabledTimeValue(date, props.disabledTime?.(date)));
  };
  const confirmationDisabled = () => Boolean(props.disabledTime) && isConfirmationDisabled(draft());
  const confirm = () => { const next = pendingValue; if (!next || (isDateArray(next) && next.length === 0) || isConfirmationDisabled(next)) return; change(next); props.onOk?.(next); setOpen(false); };
  const selectPanel = (date: Dayjs, current = panelPicker()) => {
    if (current === 'year' && props.picker !== 'year') { const next = props.picker === 'quarter' ? 'quarter' : props.picker === 'month' ? 'month' : props.picker; setView(date); setPanelPicker(next); return next; }
    if (current === 'month' && (props.picker === 'date' || props.picker === 'week')) { setView(date); setPanelPicker(props.picker); return props.picker; }
    select(date);
  };
  const clear = () => { change(props.multiple ? [] : null); props.onClear?.(); };
  const size = () => props.size ?? config.componentSize();
  const updateTime = (part: 'hour' | 'minute' | 'second', raw: number): boolean => {
    if (!Number.isInteger(raw) || raw < 0 || raw > (part === 'hour' ? 23 : 59)) return false;
    const current = (isDateArray(pendingValue) ? pendingValue.at(-1) : pendingValue) ?? draftValues().at(-1) ?? values().at(-1) ?? dayjs();
    const limits = props.disabledTime?.(current);
    if (part === 'hour' && limits?.disabledHours?.().includes(raw)) return false;
    if (part === 'minute' && limits?.disabledMinutes?.(current.hour()).includes(raw)) return false;
    if (part === 'second' && limits?.disabledSeconds?.(current.hour(), current.minute()).includes(raw)) return false;
    const updated = part === 'hour' ? current.hour(raw) : part === 'minute' ? current.minute(raw) : current.second(raw);
    const next: DatePickerValue = props.multiple ? [...draftValues().slice(0, -1), updated] : updated;
    pendingValue = next; setDraft(next); setView(updated); return true;
  };
  const updateTimeInput = (event: InputEvent & { currentTarget: HTMLInputElement }, part: 'hour' | 'minute' | 'second') => {
    if (updateTime(part, Number(event.currentTarget.value))) return;
    const current = draftValues().at(-1) ?? values().at(-1) ?? dayjs();
    event.currentTarget.value = String(part === 'hour' ? current.hour() : part === 'minute' ? current.minute() : current.second());
  };
  const calendar = () => <Show keyed when={panelPicker()}>{(picker) => <Dynamic component={props.components?.[picker] ?? 'div'}><CalendarPanel value={(props.needConfirm || props.showTime || props.multiple ? draftValues() : values()).at(-1)} values={props.multiple ? draftValues() : undefined} view={view()} picker={picker} modeControlled={inputProps.mode !== undefined} minDate={props.minDate} maxDate={props.maxDate} disabledDate={props.disabledDate} onViewChange={setView} onModeChange={setPanelPicker} onSelect={selectPanel} showWeek={props.showWeek} locale={props.locale} onHover={(date) => setPreview(props.previewValue === false ? null : date)} previousLabel={config.locale().DatePicker?.previous} nextLabel={config.locale().DatePicker?.next} previousIcon={props.prevIcon ?? props.superPrevIcon} nextIcon={props.nextIcon ?? props.superNextIcon} cellRender={props.cellRender} dateRender={props.dateRender} classes={semanticClasses()} styles={semanticStyles()} /></Dynamic>}</Show>;
  const panel = () => {
    const content = <div class={['flex', semanticClasses().popupContainer]} style={{ ...semanticStyles().popupContainer, ...props.popupStyle }}><Show when={props.presets?.length}><div class="ads-date-picker-presets w-32 border-r border-border-secondary p-2"><For each={props.presets}>{(preset) => <button type="button" class="block h-8 w-full truncate rounded-control px-2 text-left text-sm hover:bg-surface-container" onClick={() => select(typeof preset.value === 'function' ? preset.value() : preset.value)}>{preset.label}</button>}</For></div></Show><div>{calendar()}<Show when={props.showTime}><div class="flex items-center justify-center gap-1 border-t border-border-secondary px-3 py-2"><input type="number" aria-label="Hour" min="0" max="23" step={typeof props.showTime === 'object' ? props.showTime.hourStep ?? 1 : 1} value={(draftValues().at(-1) ?? values().at(-1) ?? dayjs()).hour()} class="h-8 w-14 rounded-control border border-border px-1 text-center" onInput={(event) => updateTimeInput(event, 'hour')} /><span>:</span><input type="number" aria-label="Minute" min="0" max="59" step={typeof props.showTime === 'object' ? props.showTime.minuteStep ?? 1 : 1} value={(draftValues().at(-1) ?? values().at(-1) ?? dayjs()).minute()} class="h-8 w-14 rounded-control border border-border px-1 text-center" onInput={(event) => updateTimeInput(event, 'minute')} /><span>:</span><input type="number" aria-label="Second" min="0" max="59" step={typeof props.showTime === 'object' ? props.showTime.secondStep ?? 1 : 1} value={(draftValues().at(-1) ?? values().at(-1) ?? dayjs()).second()} class="h-8 w-14 rounded-control border border-border px-1 text-center" onInput={(event) => updateTimeInput(event, 'second')} /></div></Show><Show when={props.renderExtraFooter || props.showNow || props.needConfirm || props.showTime || props.multiple}><div class={['flex min-h-10 items-center justify-between gap-2 border-t border-border-secondary px-3 py-1', semanticClasses().popupFooter]} style={semanticStyles().popupFooter}><span>{props.renderExtraFooter?.(props.picker)}</span><span class="flex gap-2"><Show when={props.showNow}><button type="button" class="text-primary" onClick={() => select(dayjs())}>Now</button></Show><Show when={props.needConfirm ?? Boolean(props.showTime || props.multiple)}><button type="button" disabled={confirmationDisabled()} class="h-7 rounded-control bg-primary px-3 text-white disabled:bg-border disabled:text-text-disabled" onClick={confirm}>OK</button></Show></span></div></Show></div></div>;
    return <div class={['ads-date-picker-theme', config.themeScopeClass(), semanticClasses().popupRoot, props.popupClassName, props.dropdownClassName]} style={semanticStyles().popupRoot}>{props.panelRender?.(content) ?? content}</div>;
  };
  const parseInput = (text: string): DatePickerValue => {
    const parts = props.multiple ? text.split(',').map((item) => item.trim()).filter(Boolean) : [text.trim()];
    const patterns = formatPatterns(format());
    if (patterns.length === 0) patterns.push(props.showTime ? 'YYYY-MM-DD HH:mm:ss' : defaultFormat(props.picker));
    const parsed = parts.map((item) => patterns.map((pattern) => dayjs(item, pattern, true)).find((date) => date.isValid())).filter((date): date is Dayjs => Boolean(date));
    if (parsed.length !== parts.length) return null;
    return props.multiple ? (props.order === false ? parsed : parsed.sort((left, right) => left.valueOf() - right.valueOf())) : parsed[0] ?? null;
  };
  const commitInput = () => { const text = pendingInputText || inputText(); if (!text) return; const parsed = parseInput(text); if (parsed) { pendingInputText = ''; change(parsed); } else if (!props.preserveInvalidOnBlur) { pendingInputText = ''; setInputText(''); change(props.multiple ? [] : null); } };
  const inputValue = () => preview() ? formatPickerValue(preview()!, props.picker, format()) : inputText() || displayValue();
  const panelNode = panel();
  return (
    <Popover open={open()} trigger={[]} aria-label="Date picker dialog" placement={props.placement ?? 'bottom-start'} getPopupContainer={props.getPopupContainer} content={panelNode} onOpenChange={setOpen}>
      <div {...others} id={field?.id} role="group" data-status={status()} class={['ads-date-picker inline-flex w-full items-center rounded-control border bg-surface text-sm text-text hover:border-primary', size() === 'small' ? 'h-6' : size() === 'large' ? 'h-10 text-base' : 'h-8', status() === 'error' ? 'border-error' : status() === 'warning' ? 'border-warning' : 'border-border', (props.variant ?? config.variant()) === 'borderless' || props.bordered === false ? 'border-transparent' : '', (props.variant ?? config.variant()) === 'filled' ? 'bg-surface-container' : '', (props.variant ?? config.variant()) === 'underlined' ? 'rounded-none border-x-0 border-t-0' : '', disabled() ? 'cursor-not-allowed bg-surface-container text-text-disabled' : '', semanticClasses().root, props.className, props.class]} style={{ ...semanticStyles().root, ...(typeof props.style === 'object' ? props.style : {}) }}>
        <Show when={props.prefix}><span class={['ml-2 inline-flex', semanticClasses().prefix]} style={semanticStyles().prefix}>{props.prefix}</span></Show>
        <Dynamic component={props.components?.input ?? 'input'} type="text" aria-label={props['aria-label'] ?? 'Choose date'} disabled={disabled()} readonly={props.inputReadOnly} value={inputValue()} placeholder={props.placeholder ?? props.locale?.lang?.placeholder ?? config.locale().DatePicker?.placeholder ?? 'Select date'} class={['min-w-0 flex-1 truncate bg-transparent px-3 text-left text-inherit outline-none placeholder:text-text-disabled', semanticClasses().input]} style={{ ...pickerInputTokenStyle(size()), ...semanticStyles().input }} onFocus={() => { pendingValue = value(); setDraft(pendingValue); setOpen(true); }} onClick={() => { pendingValue = value(); setDraft(pendingValue); setOpen(true); }} onInput={(event: InputEvent & { currentTarget: HTMLInputElement }) => { pendingInputText = event.currentTarget.value; setInputText(pendingInputText); }} onKeyDown={(event: KeyboardEvent) => { if (event.key === 'Enter') { commitInput(); setOpen(false); } if (event.key === 'Escape') setOpen(false); }} onBlur={() => { commitInput(); setPreview(null); }} />
        <Show when={props.allowClear && value() && !disabled()}><button type="button" aria-label="Clear date" class="inline-flex size-6 items-center justify-center bg-transparent text-text-disabled hover:text-text" onClick={clear}>{props.clearIcon ?? <CloseIcon />}</button></Show>
        <span aria-hidden="true" class={['mr-2 text-text-disabled', semanticClasses().suffix]} style={semanticStyles().suffix}>{props.suffixIcon ?? <CalendarIcon />}</span>
      </div>
    </Popover>
  );
}

export function RangePicker(inputProps: RangePickerProps) {
  const config = useConfig();
  const props = merge({ picker: 'date' as PickerMode, defaultOpen: false, allowClear: true }, config.componentDefaults('datePicker') as Partial<RangePickerProps>, inputProps);
  const field = useFormItemControl();
  const semanticClasses = () => typeof props.classNames === 'function' ? props.classNames({ props: props as unknown as DatePickerProps }) : props.classNames ?? {};
  const semanticStyles = () => typeof props.styles === 'function' ? props.styles({ props: props as unknown as DatePickerProps }) : props.styles ?? {};
  const partDisabled = (part: 'start' | 'end') => Boolean(Array.isArray(props.disabled) ? props.disabled[part === 'start' ? 0 : 1] : props.disabled ?? field?.disabled() ?? config.componentDisabled());
  const disabled = () => partDisabled('start') && partDisabled('end');
  const status = () => props.status ?? field?.status();
  const size = () => props.size ?? config.componentSize();
  const normalizeRange = (source: RangePickerProps['value'] | RangePickerProps['defaultValue'] | unknown): [Dayjs | null, Dayjs | null] => Array.isArray(source) ? [source[0] ?? null, source[1] ?? null] : [null, null];
  const initialRange = normalizeRange(props.defaultValue);
  const [internalValue, setInternalValue] = createSignal<[Dayjs | null, Dayjs | null]>(initialRange, { ownedWrite: true });
  let currentInternalValue: [Dayjs | null, Dayjs | null] = initialRange;
  const pickerEndpoint = (source: RangePickerProps['pickerValue'] | RangePickerProps['defaultPickerValue'], index: number): Dayjs | undefined => !source ? undefined : dayjs.isDayjs(source) ? source : source[index];
  const initialViews: [Dayjs, Dayjs] = untrack(() => {
    const fallback = props.defaultValue?.[0] ?? props.defaultValue?.[1] ?? dayjs();
    return [pickerEndpoint(props.defaultPickerValue, 0) ?? props.defaultValue?.[0] ?? fallback, pickerEndpoint(props.defaultPickerValue, 1) ?? props.defaultValue?.[1] ?? fallback];
  });
  const [panelViews, setPanelViews] = createSignal<[Dayjs, Dayjs]>(initialViews, { ownedWrite: true });
  let currentPanelViews = initialViews;
  const initialModes: [DatePickerPanelMode, DatePickerPanelMode] = untrack(() => props.mode ? [...props.mode] : [props.picker, props.picker]);
  const [panelModes, setPanelModes] = createSignal<[DatePickerPanelMode, DatePickerPanelMode]>(initialModes, { ownedWrite: true });
  let currentPanelModes = initialModes;
  const initialOpen = untrack(() => Boolean(props.open ?? props.defaultOpen));
  const [open, setInternalRangeOpen] = createSignal(initialOpen, { ownedWrite: true });
  let currentRangeOpen = initialOpen;
  createEffect(() => props.open, (controlledOpen) => { if (controlledOpen !== undefined) currentRangeOpen = controlledOpen; });
  const setRangeOpen = (next: boolean) => {
    if (next === currentRangeOpen) return;
    currentRangeOpen = next;
    if (props.open === undefined) setInternalRangeOpen(next);
    props.onOpenChange?.(next);
  };
  const [rangeInputText, setRangeInputText] = createSignal<[string | undefined, string | undefined]>([undefined, undefined], { ownedWrite: true });
  let currentRangeInputText: [string | undefined, string | undefined] = [undefined, undefined];
  const updateRangeInputText = (next: [string | undefined, string | undefined] | ((current: [string | undefined, string | undefined]) => [string | undefined, string | undefined])) => {
    currentRangeInputText = typeof next === 'function' ? next(currentRangeInputText) : next;
    setRangeInputText(currentRangeInputText);
  };
  const [view, setView] = createSignal(initialViews[0], { ownedWrite: true });
  const initialPanelPicker: PickerMode = untrack(() => props.picker);
  const [internalPanelPicker, setInternalPanelPicker] = createSignal<PickerMode>(initialPanelPicker, { ownedWrite: true });
  const panelPicker = (): PickerMode => {
    const mode = props.mode?.[activePart() === 'start' ? 0 : 1] ?? (panelModes(), currentPanelModes)[activePart() === 'start' ? 0 : 1];
    return mode === 'decade' ? 'year' : mode === 'time' ? props.picker : mode;
  };
  const changeView = (date: Dayjs) => {
    setView(date);
    const index = activePart() === 'start' ? 0 : 1;
    const next = [...currentPanelViews] as [Dayjs, Dayjs];
    next[index] = date;
    currentPanelViews = next;
    if (props.pickerValue === undefined) setPanelViews(next);
    const modes = [...currentPanelModes] as [DatePickerPanelMode, DatePickerPanelMode];
    props.onPickerValueChange?.(next, { range: activePart(), source: 'panel', mode: modes });
    props.onPanelChange?.(value(), modes);
  };
  const changePanelPicker = (next: PickerMode) => {
    const index = activePart() === 'start' ? 0 : 1;
    const modes = [...currentPanelModes] as [DatePickerPanelMode, DatePickerPanelMode];
    modes[index] = next;
    currentPanelModes = modes;
    if (props.mode === undefined) { setPanelModes(modes); setInternalPanelPicker(next); }
    props.onPickerValueChange?.([...currentPanelViews], { range: activePart(), source: 'panel', mode: modes });
    props.onPanelChange?.(value(), modes);
  };
  const [activePart, setActivePart] = createSignal<'start' | 'end'>(initialRange[0] && !initialRange[1] ? 'end' : 'start', { ownedWrite: true });
  const value = (): [Dayjs | null, Dayjs | null] => props.value !== undefined ? normalizeRange(props.value) : field?.value() !== undefined ? normalizeRange(field.value()) : (internalValue(), currentInternalValue);
  const format = () => props.format ?? (props.showTime ? 'YYYY-MM-DD HH:mm:ss' : undefined);
  const stringsFor = (range: [Dayjs | null, Dayjs | null]): [string, string] => [range[0] ? formatPickerValue(range[0], props.picker, format()) : '', range[1] ? formatPickerValue(range[1], props.picker, format()) : ''];
  const publishDraft = (next: [Dayjs | null, Dayjs | null]) => {
    if (props.value === undefined) { if (field) field.setValue(next); else { currentInternalValue = next; setInternalValue(next); } }
    props.onCalendarChange?.(next, stringsFor(next), { range: activePart() });
  };
  const allowEmptyPart = (index: 0 | 1) => typeof props.allowEmpty === 'boolean' ? props.allowEmpty : Boolean(props.allowEmpty?.[index]);
  const rangeComplete = (next: [Dayjs | null, Dayjs | null]) => Boolean((next[0] && next[1]) || (next[0] && allowEmptyPart(1)) || (next[1] && allowEmptyPart(0)));
  const rangeConfirmationDisabled = (next: [Dayjs | null, Dayjs | null]) => !rangeComplete(next) || next.some((date, index) => date && isDisabledTimeValue(date, props.disabledTime?.(date, index === 0 ? 'start' : 'end', { from: next[index === 0 ? 1 : 0] ?? undefined })));
  const commitRange = (next: [Dayjs | null, Dayjs | null]) => {
    if (rangeConfirmationDisabled(next)) return;
    props.onChange?.(next, stringsFor(next));
    props.onOk?.(next);
    setRangeOpen(false);
  };
  const defaultRangeTime = (part: 'start' | 'end') => typeof props.showTime === 'object' ? (props.showTime.defaultOpenValue ?? props.showTime.defaultValue)?.[part === 'start' ? 0 : 1] : undefined;
  const mergeRangeTime = (date: Dayjs, part: 'start' | 'end') => {
    const source = value()[part === 'start' ? 0 : 1] ?? defaultRangeTime(part);
    return source ? date.hour(source.hour()).minute(source.minute()).second(source.second()) : date;
  };
  const choose = (rawDate: Dayjs) => {
    const current = value();
    const part = activePart();
    const index = part === 'start' ? 0 : 1;
    const date = props.showTime ? mergeRangeTime(rawDate, part) : rawDate;
    let next: [Dayjs | null, Dayjs | null] = part === 'start' ? [date, current[1]] : [current[0], date];
    if (next[0] && next[1] && props.order !== false && next[1].isBefore(next[0])) next = [next[1], next[0]];
    updateRangeInputText((texts) => { const updated = [...texts] as [string | undefined, string | undefined]; updated[index] = undefined; return updated; });
    publishDraft(next);
    if (part === 'start' && !partDisabled('end')) setActivePart('end');
    const confirmRequired = props.needConfirm ?? Boolean(props.showTime);
    if (rangeComplete(next) && !confirmRequired) commitRange(next);
  };
  const choosePanel = (date: Dayjs, current = panelPicker()) => {
    if (current === 'year' && props.picker !== 'year') { const next = props.picker === 'quarter' ? 'quarter' : props.picker === 'month' ? 'month' : props.picker; changeView(date); changePanelPicker(next); return next; }
    if (current === 'month' && (props.picker === 'date' || props.picker === 'week')) { changeView(date); changePanelPicker(props.picker); return props.picker; }
    choose(date);
  };
  const updateRangeTime = (unit: 'hour' | 'minute' | 'second', raw: number): boolean => {
    if (!Number.isInteger(raw) || raw < 0 || raw > (unit === 'hour' ? 23 : 59)) return false;
    const part = activePart();
    const index = part === 'start' ? 0 : 1;
    const current = value();
    const date = current[index] ?? defaultRangeTime(part) ?? dayjs();
    const limits = props.disabledTime?.(date, part, { from: current[index === 0 ? 1 : 0] ?? undefined });
    if (unit === 'hour' && limits?.disabledHours?.().includes(raw)) return false;
    if (unit === 'minute' && limits?.disabledMinutes?.(date.hour()).includes(raw)) return false;
    if (unit === 'second' && limits?.disabledSeconds?.(date.hour(), date.minute()).includes(raw)) return false;
    const updated = unit === 'hour' ? date.hour(raw) : unit === 'minute' ? date.minute(raw) : date.second(raw);
    const next = [...current] as [Dayjs | null, Dayjs | null];
    next[index] = updated;
    publishDraft(next);
    return true;
  };
  const updateRangeTimeInput = (event: InputEvent & { currentTarget: HTMLInputElement }, unit: 'hour' | 'minute' | 'second') => {
    if (updateRangeTime(unit, Number(event.currentTarget.value))) return;
    const part = activePart();
    const current = value()[part === 'start' ? 0 : 1] ?? defaultRangeTime(part) ?? dayjs();
    event.currentTarget.value = String(unit === 'hour' ? current.hour() : unit === 'minute' ? current.minute() : current.second());
  };
  const parseRangeInput = (text: string): Dayjs | null => {
    const patterns = formatPatterns(format());
    if (patterns.length === 0) patterns.push(props.showTime ? 'YYYY-MM-DD HH:mm:ss' : defaultFormat(props.picker));
    return patterns.map((pattern) => dayjs(text.trim(), pattern, true)).find((date) => date.isValid()) ?? null;
  };
  const commitRangeInput = (part: 'start' | 'end'): boolean => {
    const index = part === 'start' ? 0 : 1;
    const text = currentRangeInputText[index];
    if (text === undefined) return true;
    const current = value();
    if (!text.trim()) {
      if (!allowEmptyPart(index)) {
        if (!props.preserveInvalidOnBlur) updateRangeInputText((texts) => { const next = [...texts] as [string | undefined, string | undefined]; next[index] = undefined; return next; });
        return false;
      }
      const next = [...current] as [Dayjs | null, Dayjs | null];
      next[index] = null;
      updateRangeInputText((texts) => { const updated = [...texts] as [string | undefined, string | undefined]; updated[index] = undefined; return updated; });
      publishDraft(next);
      commitRange(next);
      return true;
    }
    const parsed = parseRangeInput(text);
    const opposite = current[index === 0 ? 1 : 0] ?? undefined;
    const invalid = !parsed || props.disabledDate?.(parsed, { from: opposite, type: props.picker }) || isDisabledTimeValue(parsed, parsed ? props.disabledTime?.(parsed, part, { from: opposite }) : undefined);
    if (invalid) {
      if (!props.preserveInvalidOnBlur) updateRangeInputText((texts) => { const next = [...texts] as [string | undefined, string | undefined]; next[index] = undefined; return next; });
      return false;
    }
    let next = [...current] as [Dayjs | null, Dayjs | null];
    next[index] = parsed;
    if (next[0] && next[1] && props.order !== false && next[1].isBefore(next[0])) next = [next[1], next[0]];
    updateRangeInputText((texts) => { const updated = [...texts] as [string | undefined, string | undefined]; updated[index] = undefined; return updated; });
    publishDraft(next);
    if (rangeComplete(next)) commitRange(next);
    return true;
  };
  const rangeInputValue = (part: 'start' | 'end') => {
    const index = part === 'start' ? 0 : 1;
    return (rangeInputText(), currentRangeInputText[index]) ?? (value()[index] ? formatPickerValue(value()[index]!, props.picker, format()) : '');
  };
  const openPart = (part: 'start' | 'end') => {
    setActivePart(part);
    const index = part === 'start' ? 0 : 1;
    const target = pickerEndpoint(props.pickerValue, index) ?? pickerEndpoint(props.defaultPickerValue, index) ?? value()[index] ?? value()[index === 0 ? 1 : 0] ?? currentPanelViews[index];
    const next = [pickerEndpoint(props.pickerValue, 0) ?? currentPanelViews[0], pickerEndpoint(props.pickerValue, 1) ?? currentPanelViews[1]] as [Dayjs, Dayjs];
    next[index] = target;
    currentPanelViews = next;
    if (props.pickerValue === undefined) setPanelViews(next);
    setView(target);
    const modes = props.mode ? [...props.mode] as [DatePickerPanelMode, DatePickerPanelMode] : [...currentPanelModes] as [DatePickerPanelMode, DatePickerPanelMode];
    currentPanelModes = modes;
    props.onPickerValueChange?.(next, { range: part, source: 'reset', mode: modes });
    setRangeOpen(true);
  };
  const applyPreset = (preset: RangePickerPreset) => {
    const raw = typeof preset.value === 'function' ? preset.value() : preset.value;
    const next: [Dayjs, Dayjs] = [typeof raw[0] === 'function' ? raw[0]() : raw[0], typeof raw[1] === 'function' ? raw[1]() : raw[1]];
    updateRangeInputText([undefined, undefined]);
    publishDraft(next);
    commitRange(next);
  };
  const panelContent = () => <div class={['flex', semanticClasses().popupContainer]} style={{ ...semanticStyles().popupContainer, ...props.popupStyle }}><Show when={props.presets?.length}><div class="ads-date-picker-presets w-32 border-r border-border-secondary p-2"><For each={props.presets}>{(preset) => <button type="button" class="block h-8 w-full truncate rounded-control px-2 text-left text-sm hover:bg-surface-container" onClick={() => applyPreset(preset)}>{preset.label}</button>}</For></div></Show><div><Show keyed when={panelPicker()}>{(picker) => <Dynamic component={props.components?.[picker] ?? 'div'}><CalendarPanel value={activePart() === 'start' ? value()[0] : value()[1]} view={view()} picker={picker} modeControlled={inputProps.mode !== undefined} minDate={props.minDate} maxDate={props.maxDate} disabledDate={props.disabledDate} onViewChange={changeView} onModeChange={changePanelPicker} onSelect={choosePanel} range={activePart()} from={value()[activePart() === 'start' ? 1 : 0] ?? undefined} showWeek={props.showWeek} locale={props.locale} previousLabel={config.locale().DatePicker?.previous} nextLabel={config.locale().DatePicker?.next} previousIcon={props.prevIcon ?? props.superPrevIcon} nextIcon={props.nextIcon ?? props.superNextIcon} cellRender={props.cellRender} dateRender={props.dateRender} classes={semanticClasses()} styles={semanticStyles()} /></Dynamic>}</Show><Show when={props.showTime}><div class="flex items-center justify-center gap-1 border-t border-border-secondary px-3 py-2"><input type="number" aria-label={`${activePart() === 'start' ? 'Start' : 'End'} hour`} min="0" max="23" value={(value()[activePart() === 'start' ? 0 : 1] ?? defaultRangeTime(activePart()) ?? dayjs()).hour()} class="h-8 w-14 rounded-control border border-border px-1 text-center" onInput={(event) => updateRangeTimeInput(event, 'hour')} /><span>:</span><input type="number" aria-label={`${activePart() === 'start' ? 'Start' : 'End'} minute`} min="0" max="59" value={(value()[activePart() === 'start' ? 0 : 1] ?? defaultRangeTime(activePart()) ?? dayjs()).minute()} class="h-8 w-14 rounded-control border border-border px-1 text-center" onInput={(event) => updateRangeTimeInput(event, 'minute')} /><span>:</span><input type="number" aria-label={`${activePart() === 'start' ? 'Start' : 'End'} second`} min="0" max="59" value={(value()[activePart() === 'start' ? 0 : 1] ?? defaultRangeTime(activePart()) ?? dayjs()).second()} class="h-8 w-14 rounded-control border border-border px-1 text-center" onInput={(event) => updateRangeTimeInput(event, 'second')} /></div></Show><Show when={(props.needConfirm ?? Boolean(props.showTime)) && rangeComplete(value())}><div class="flex justify-end border-t border-border-secondary p-2"><button type="button" disabled={rangeConfirmationDisabled(value())} class="h-7 rounded-control bg-primary px-3 text-white disabled:bg-border disabled:text-text-disabled" onClick={() => commitRange(value())}>OK</button></div></Show><Show when={props.renderExtraFooter}><div class={['min-h-10 border-t border-border-secondary px-3 py-2', semanticClasses().popupFooter]} style={semanticStyles().popupFooter}>{props.renderExtraFooter?.(props.picker)}</div></Show></div></div>;
  const panel = () => { const content = panelContent(); return <div class={['ads-date-picker-theme', config.themeScopeClass(), semanticClasses().popupRoot, props.popupClassName, props.dropdownClassName]} style={semanticStyles().popupRoot}>{props.panelRender?.(content) ?? content}</div>; };
  return (
    <Popover open={disabled() ? false : props.open ?? open()} trigger={[]} aria-label="Date range picker dialog" placement={props.placement ?? 'bottom-start'} getPopupContainer={props.getPopupContainer} content={panel()} onOpenChange={setRangeOpen}>
      <div id={field?.id} role="group" aria-label={props['aria-label'] ?? 'Choose date range'} data-status={status()} class={['ads-range-picker inline-flex w-full items-center rounded-control border bg-surface text-sm text-text hover:border-primary', size() === 'small' ? 'h-6' : size() === 'large' ? 'h-10 text-base' : 'h-8', status() === 'error' ? 'border-error' : status() === 'warning' ? 'border-warning' : 'border-border', (props.variant ?? config.variant()) === 'borderless' || props.bordered === false ? 'border-transparent' : '', (props.variant ?? config.variant()) === 'filled' ? 'bg-surface-container' : '', (props.variant ?? config.variant()) === 'underlined' ? 'rounded-none border-x-0 border-t-0' : '', disabled() ? 'cursor-not-allowed bg-surface-container text-text-disabled' : '', semanticClasses().root, props.className, props.class]} style={{ ...semanticStyles().root, ...(typeof props.style === 'object' ? props.style : {}) }}>
        <Show when={props.prefix}><span class={['ml-2 inline-flex', semanticClasses().prefix]} style={semanticStyles().prefix}>{props.prefix}</span></Show>
        <Dynamic component={props.components?.input ?? 'input'} id={props.id?.start} type="text" aria-label="Start date" disabled={partDisabled('start')} readonly={props.inputReadOnly} value={rangeInputValue('start')} placeholder={props.placeholder?.[0] ?? config.locale().DatePicker?.rangePlaceholder?.[0] ?? 'Start date'} class={['min-w-0 flex-1 truncate bg-transparent px-3 text-left text-inherit outline-none placeholder:text-text-disabled disabled:cursor-not-allowed', semanticClasses().input]} style={{ ...pickerInputTokenStyle(size()), ...semanticStyles().input }} onFocus={(event: FocusEvent) => { openPart('start'); props.onFocus?.(event, { range: 'start' }); }} onClick={() => openPart('start')} onInput={(event: InputEvent & { currentTarget: HTMLInputElement }) => updateRangeInputText((texts) => [event.currentTarget.value, texts[1]])} onKeyDown={(event: KeyboardEvent) => { if (event.key === 'Enter' && commitRangeInput('start')) setRangeOpen(false); if (event.key === 'Escape') { updateRangeInputText((texts) => [undefined, texts[1]]); setRangeOpen(false); } }} onBlur={(event: FocusEvent) => { commitRangeInput('start'); props.onBlur?.(event, { range: 'start' }); }} />
        <span class="text-text-disabled">{props.separator ?? '-'}</span>
        <Dynamic component={props.components?.input ?? 'input'} id={props.id?.end} type="text" aria-label="End date" disabled={partDisabled('end')} readonly={props.inputReadOnly} value={rangeInputValue('end')} placeholder={props.placeholder?.[1] ?? config.locale().DatePicker?.rangePlaceholder?.[1] ?? 'End date'} class={['min-w-0 flex-1 truncate bg-transparent px-3 text-left text-inherit outline-none placeholder:text-text-disabled disabled:cursor-not-allowed', semanticClasses().input]} style={{ ...pickerInputTokenStyle(size()), ...semanticStyles().input }} onFocus={(event: FocusEvent) => { openPart('end'); props.onFocus?.(event, { range: 'end' }); }} onClick={() => openPart('end')} onInput={(event: InputEvent & { currentTarget: HTMLInputElement }) => updateRangeInputText((texts) => [texts[0], event.currentTarget.value])} onKeyDown={(event: KeyboardEvent) => { if (event.key === 'Enter' && commitRangeInput('end')) setRangeOpen(false); if (event.key === 'Escape') { updateRangeInputText((texts) => [texts[0], undefined]); setRangeOpen(false); } }} onBlur={(event: FocusEvent) => { commitRangeInput('end'); props.onBlur?.(event, { range: 'end' }); }} />
        <Show when={props.allowClear && !disabled() && (value()[0] || value()[1])}><button type="button" aria-label="Clear dates" class="mr-1 size-6 bg-transparent text-text-disabled" onClick={() => { const next: [null, null] = [null, null]; updateRangeInputText([undefined, undefined]); if (field) field.setValue(next); else { currentInternalValue = next; setInternalValue(next); } props.onChange?.(null, ['', '']); props.onClear?.(); }}><CloseIcon /></button></Show>
        <span aria-hidden="true" class={['mr-2 text-text-disabled', semanticClasses().suffix]} style={semanticStyles().suffix}>{props.suffixIcon ?? <CalendarIcon />}</span>
      </div>
    </Popover>
  );
}

export interface PickerDateAdapter<Value> { toDayjs: (value: Value) => Dayjs; fromDayjs: (value: Dayjs) => Value }
export interface GeneratedPickerProps<Value> extends Omit<DatePickerProps, 'value' | 'defaultValue' | 'pickerValue' | 'defaultPickerValue' | 'minDate' | 'maxDate' | 'disabledDate' | 'disabledTime' | 'showTime' | 'cellRender' | 'dateRender' | 'onChange' | 'onPanelChange' | 'onSelect' | 'onOk' | 'presets'> {
  value?: Value | readonly Value[] | null;
  defaultValue?: Value | readonly Value[] | null;
  pickerValue?: Value;
  defaultPickerValue?: Value;
  minDate?: Value;
  maxDate?: Value;
  disabledDate?: (value: Value, info: { type: PickerMode }) => boolean;
  disabledTime?: (value: Value) => DatePickerDisabledTime;
  showTime?: boolean | (Omit<DatePickerShowTime, 'defaultOpenValue' | 'defaultValue'> & { defaultOpenValue?: Value; defaultValue?: Value });
  cellRender?: (value: Value, info: DatePickerCellRenderInfo) => JSX.Element;
  dateRender?: (value: Value, today: Value) => JSX.Element;
  presets?: readonly { label: JSX.Element; value: Value | (() => Value) }[];
  onChange?: (value: Value | readonly Value[] | null, text: string | string[]) => void;
  onPanelChange?: (value: Value, mode: PickerMode) => void;
  onSelect?: (value: Value) => void;
  onOk?: (value: Value | readonly Value[]) => void;
}
export interface GeneratedRangePickerProps<Value> extends Omit<RangePickerProps, 'value' | 'defaultValue' | 'pickerValue' | 'defaultPickerValue' | 'minDate' | 'maxDate' | 'disabledDate' | 'disabledTime' | 'showTime' | 'cellRender' | 'dateRender' | 'onChange' | 'onCalendarChange' | 'onOk' | 'onPickerValueChange' | 'onPanelChange' | 'presets'> {
  value?: readonly [Value | null | undefined, Value | null | undefined] | null;
  defaultValue?: readonly [Value | null | undefined, Value | null | undefined] | null;
  pickerValue?: readonly [Value, Value] | Value | null;
  defaultPickerValue?: readonly [Value, Value] | Value | null;
  minDate?: Value;
  maxDate?: Value;
  disabledDate?: (value: Value, info: { from?: Value; type: PickerMode }) => boolean;
  disabledTime?: (value: Value, type: 'start' | 'end', info: { from?: Value }) => DatePickerDisabledTime;
  showTime?: boolean | (Omit<RangePickerShowTime, 'defaultOpenValue' | 'defaultValue'> & { defaultOpenValue?: readonly [Value, Value]; defaultValue?: readonly [Value, Value] });
  cellRender?: (value: Value, info: DatePickerCellRenderInfo) => JSX.Element;
  dateRender?: (value: Value, today: Value) => JSX.Element;
  presets?: readonly { label: JSX.Element; value: readonly [Value | (() => Value), Value | (() => Value)] | (() => readonly [Value, Value]) }[];
  onChange?: (value: [Value | null, Value | null] | null, text: [string, string]) => void;
  onCalendarChange?: (value: [Value | null, Value | null], text: [string, string], info: { range: 'start' | 'end' }) => void;
  onOk?: (value: [Value | null, Value | null]) => void;
  onPickerValueChange?: (value: [Value, Value], info: { range: 'start' | 'end'; source: 'reset' | 'panel'; mode: [DatePickerPanelMode, DatePickerPanelMode] }) => void;
  onPanelChange?: (value: [Value | null, Value | null], modes: [DatePickerPanelMode, DatePickerPanelMode]) => void;
}
export function generatePicker<Value>(adapter: PickerDateAdapter<Value>) {
  const Generated = (props: GeneratedPickerProps<Value>) => {
    const mapped = omit(props, 'value', 'defaultValue', 'pickerValue', 'defaultPickerValue', 'minDate', 'maxDate', 'disabledDate', 'disabledTime', 'showTime', 'cellRender', 'dateRender', 'onChange', 'onPanelChange', 'onSelect', 'onOk', 'presets');
    const mapValue = (value: Value | readonly Value[] | null | undefined): DatePickerValue | undefined => value === undefined ? undefined : value === null ? null : Array.isArray(value) ? value.map((item) => adapter.toDayjs(item as Value)) : adapter.toDayjs(value as Value);
    const restoreValue = (value: DatePickerValue): Value | readonly Value[] | null => value === null ? null : isDateArray(value) ? value.map(adapter.fromDayjs) : adapter.fromDayjs(value);
    const presets = props.presets?.map((preset) => ({ label: preset.label, value: () => adapter.toDayjs(typeof preset.value === 'function' ? (preset.value as () => Value)() : preset.value) }));
    const showTime = typeof props.showTime === 'object' ? {
      ...props.showTime,
      defaultOpenValue: props.showTime.defaultOpenValue === undefined ? undefined : adapter.toDayjs(props.showTime.defaultOpenValue),
      defaultValue: props.showTime.defaultValue === undefined ? undefined : adapter.toDayjs(props.showTime.defaultValue),
    } : props.showTime;
    return <DatePicker
      {...mapped}
      presets={presets}
      value={mapValue(props.value)}
      defaultValue={mapValue(props.defaultValue)}
      pickerValue={props.pickerValue === undefined ? undefined : adapter.toDayjs(props.pickerValue)}
      defaultPickerValue={props.defaultPickerValue === undefined ? undefined : adapter.toDayjs(props.defaultPickerValue)}
      minDate={props.minDate === undefined ? undefined : adapter.toDayjs(props.minDate)}
      maxDate={props.maxDate === undefined ? undefined : adapter.toDayjs(props.maxDate)}
      disabledDate={props.disabledDate ? (date, info) => props.disabledDate!(adapter.fromDayjs(date), { type: info.type }) : undefined}
      disabledTime={props.disabledTime ? (date) => props.disabledTime!(adapter.fromDayjs(date)) : undefined}
      showTime={showTime}
      cellRender={props.cellRender ? (date, info) => props.cellRender!(adapter.fromDayjs(date), info) : undefined}
      dateRender={props.dateRender ? (date, today) => props.dateRender!(adapter.fromDayjs(date), adapter.fromDayjs(today)) : undefined}
      onChange={(date, text) => props.onChange?.(restoreValue(date), text)}
      onPanelChange={(date, mode) => props.onPanelChange?.(adapter.fromDayjs(date), mode)}
      onSelect={(date) => props.onSelect?.(adapter.fromDayjs(date))}
      onOk={(date) => { const restored = restoreValue(date); if (restored !== null) props.onOk?.(restored); }}
    />;
  };
  const GeneratedRange = (props: GeneratedRangePickerProps<Value>) => {
    const mapped = omit(props, 'value', 'defaultValue', 'pickerValue', 'defaultPickerValue', 'minDate', 'maxDate', 'disabledDate', 'disabledTime', 'showTime', 'cellRender', 'dateRender', 'onChange', 'onCalendarChange', 'onOk', 'onPickerValueChange', 'onPanelChange', 'presets');
    const mapRange = (value?: readonly [Value | null | undefined, Value | null | undefined] | null) => value ? [value[0] == null ? null : adapter.toDayjs(value[0]), value[1] == null ? null : adapter.toDayjs(value[1])] as const : value;
    const mapPickerRange = (value?: readonly [Value, Value] | Value | null): readonly [Dayjs, Dayjs] | Dayjs | null | undefined => value == null ? value as null | undefined : Array.isArray(value) ? [adapter.toDayjs(value[0]), adapter.toDayjs(value[1])] as const : adapter.toDayjs(value as Value);
    const restore = (value: [Dayjs | null, Dayjs | null]) => value.map((item) => item ? adapter.fromDayjs(item) : null) as [Value | null, Value | null];
    const restorePicker = (value: [Dayjs, Dayjs]) => value.map(adapter.fromDayjs) as [Value, Value];
    const presets = props.presets?.map((preset) => ({ label: preset.label, value: () => { const range = typeof preset.value === 'function' ? preset.value() : preset.value; const start = typeof range[0] === 'function' ? (range[0] as () => Value)() : range[0]; const end = typeof range[1] === 'function' ? (range[1] as () => Value)() : range[1]; return [adapter.toDayjs(start), adapter.toDayjs(end)] as const; } }));
    const showTime = typeof props.showTime === 'object' ? {
      ...props.showTime,
      defaultOpenValue: props.showTime.defaultOpenValue?.map(adapter.toDayjs) as [Dayjs, Dayjs] | undefined,
      defaultValue: props.showTime.defaultValue?.map(adapter.toDayjs) as [Dayjs, Dayjs] | undefined,
    } : props.showTime;
    return <RangePicker
      {...mapped}
      presets={presets}
      value={mapRange(props.value)}
      defaultValue={mapRange(props.defaultValue)}
      pickerValue={mapPickerRange(props.pickerValue)}
      defaultPickerValue={mapPickerRange(props.defaultPickerValue)}
      minDate={props.minDate === undefined ? undefined : adapter.toDayjs(props.minDate)}
      maxDate={props.maxDate === undefined ? undefined : adapter.toDayjs(props.maxDate)}
      disabledDate={props.disabledDate ? (date, info) => props.disabledDate!(adapter.fromDayjs(date), { ...info, from: info.from ? adapter.fromDayjs(info.from) : undefined }) : undefined}
      disabledTime={props.disabledTime ? (date, type, info) => props.disabledTime!(adapter.fromDayjs(date), type, { from: info.from ? adapter.fromDayjs(info.from) : undefined }) : undefined}
      showTime={showTime}
      cellRender={props.cellRender ? (date, info) => props.cellRender!(adapter.fromDayjs(date), info) : undefined}
      dateRender={props.dateRender ? (date, today) => props.dateRender!(adapter.fromDayjs(date), adapter.fromDayjs(today)) : undefined}
      onChange={(dates, text) => props.onChange?.(dates ? restore(dates) : null, text)}
      onCalendarChange={(dates, text, info) => props.onCalendarChange?.(restore(dates), text, info)}
      onOk={(dates) => props.onOk?.(restore(dates))}
      onPickerValueChange={(dates, info) => props.onPickerValueChange?.(restorePicker(dates), info)}
      onPanelChange={(dates, modes) => props.onPanelChange?.(restore(dates), modes)}
    />;
  };
  return Object.assign(Generated, { RangePicker: GeneratedRange, MonthPicker: (props: Omit<GeneratedPickerProps<Value>, 'picker'>) => <Generated {...props} picker="month" />, WeekPicker: (props: Omit<GeneratedPickerProps<Value>, 'picker'>) => <Generated {...props} picker="week" />, QuarterPicker: (props: Omit<GeneratedPickerProps<Value>, 'picker'>) => <Generated {...props} picker="quarter" />, YearPicker: (props: Omit<GeneratedPickerProps<Value>, 'picker'>) => <Generated {...props} picker="year" /> });
}

export type PickerShortcutProps = Omit<DatePickerProps, 'picker'>;
export function MonthPicker(props: PickerShortcutProps) { return <DatePicker {...props} picker="month" />; }
export function WeekPicker(props: PickerShortcutProps) { return <DatePicker {...props} picker="week" />; }
export function QuarterPicker(props: PickerShortcutProps) { return <DatePicker {...props} picker="quarter" />; }
export function YearPicker(props: PickerShortcutProps) { return <DatePicker {...props} picker="year" />; }

export const DatePickerComponent = Object.assign(DatePicker, { RangePicker, MonthPicker, WeekPicker, QuarterPicker, YearPicker });
