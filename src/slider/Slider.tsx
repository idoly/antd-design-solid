import { createSignal, For, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { useConfig } from '../config-provider';
import { useFormItemControl } from '../form/context';

export type SliderSemanticName = 'root' | 'track' | 'tracks' | 'rail' | 'handle';
export type SliderSemanticClassNames = Partial<Record<SliderSemanticName, string>>;
export type SliderSemanticStyles = Partial<Record<SliderSemanticName, JSX.CSSProperties>>;

export interface SliderMark {
  label?: JSX.Element;
  style?: JSX.CSSProperties;
}

export interface SliderTooltipConfig {
  open?: boolean;
  formatter?: ((value?: number) => JSX.Element) | null;
}

export interface SliderProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  min?: number;
  max?: number;
  step?: number | null;
  value?: number | readonly [number, number];
  defaultValue?: number | readonly [number, number];
  range?: boolean | { draggableTrack?: boolean };
  marks?: Record<number, JSX.Element | SliderMark>;
  dots?: boolean;
  included?: boolean;
  vertical?: boolean;
  reverse?: boolean;
  disabled?: boolean;
  tooltip?: SliderTooltipConfig;
  onChange?: (value: number | [number, number]) => void;
  onChangeComplete?: (value: number | [number, number]) => void;
  classNames?: SliderSemanticClassNames;
  styles?: SliderSemanticStyles;
}

export function Slider(inputProps: SliderProps) {
  const config = useConfig();
  const props = merge({ min: 0, max: 100, step: 1, included: true, vertical: false, reverse: false }, config.componentDefaults('slider') as Partial<SliderProps>, inputProps);
  const field = useFormItemControl();
  const range = () => Boolean(props.range);
  const initial = props.defaultValue ?? (range() ? [props.min, props.max] as [number, number] : props.min);
  const [internalValue, setInternalValue] = createSignal<number | readonly [number, number]>(initial, { ownedWrite: true });
  const [activeHandle, setActiveHandle] = createSignal(0, { ownedWrite: true });
  const others = omit(props, 'min', 'max', 'step', 'value', 'defaultValue', 'range', 'marks', 'dots', 'included', 'vertical', 'reverse', 'disabled', 'tooltip', 'onChange', 'onChangeComplete', 'classNames', 'styles', 'class', 'style');
  const current = () => props.value ?? (field?.value() !== undefined ? field.value() as number | readonly [number, number] : internalValue());
  const values = (): [number, number] => range()
    ? (Array.isArray(current()) ? [Number((current() as readonly number[])[0]), Number((current() as readonly number[])[1])] : [props.min, props.max])
    : [Number(current()), Number(current())];
  const disabled = () => props.disabled ?? field?.disabled() ?? false;
  const normalize = (value: number) => {
    const clamped = Math.min(props.max, Math.max(props.min, value));
    if (props.step === null) return clamped;
    const steps = Math.round((clamped - props.min) / props.step);
    const precision = (String(props.step).split('.')[1] ?? '').length;
    return Number((props.min + steps * props.step).toFixed(precision));
  };
  const commit = (next: number | [number, number], complete = false) => {
    if (props.value === undefined) {
      if (field) field.setValue(next);
      else setInternalValue(next);
    }
    if (complete) props.onChangeComplete?.(next);
    else props.onChange?.(next);
  };
  const updateHandle = (index: number, value: number, complete = false) => {
    const nextValue = normalize(value);
    if (!range()) {
      commit(nextValue, complete);
      return;
    }
    const next: [number, number] = [...values()] as [number, number];
    next[index] = nextValue;
    if (next[0] > next[1]) {
      next.sort((a, b) => a - b);
      setActiveHandle(index === 0 ? 1 : 0);
    }
    commit(next, complete);
  };
  const percentage = (value: number) => (value - props.min) / (props.max - props.min || 1) * 100;
  const markEntries = () => Object.entries(props.marks ?? {}).map(([key, mark]) => ({ value: Number(key), mark })).filter(({ value }) => value >= props.min && value <= props.max).sort((a, b) => a.value - b.value);
  const chooseMark = (value: number) => {
    if (!range()) commit(normalize(value));
    else {
      const currentValues = values();
      const index = Math.abs(currentValues[0] - value) <= Math.abs(currentValues[1] - value) ? 0 : 1;
      updateHandle(index, value);
    }
  };
  const tooltipText = (value: number) => props.tooltip?.formatter === null ? undefined : props.tooltip?.formatter?.(value) ?? value;
  const railTokenStyle = (): JSX.CSSProperties => props.vertical
    ? { width: 'var(--ads-slider-rail-size, 6px)', 'background-color': 'var(--ads-slider-rail-bg, var(--ads-color-border-secondary))' }
    : { height: 'var(--ads-slider-rail-size, 6px)', 'background-color': 'var(--ads-slider-rail-bg, var(--ads-color-border-secondary))' };
  const trackTokenStyle = (): JSX.CSSProperties => ({ 'background-color': disabled() ? 'var(--ads-slider-track-bg-disabled, var(--ads-color-text-disabled))' : 'var(--ads-slider-track-bg, var(--ads-color-primary))' });
  const handleTokenStyle = (value: number): JSX.CSSProperties => {
    const size = 'var(--ads-slider-handle-size, 14px)';
    const rail = 'var(--ads-slider-rail-size, 6px)';
    return {
      width: size,
      height: size,
      'border-width': 'var(--ads-slider-handle-line-width, 2px)',
      'border-color': disabled() ? 'var(--ads-slider-handle-color-disabled, var(--ads-color-text-disabled))' : 'var(--ads-slider-handle-color, var(--ads-color-primary))',
      ...(props.vertical
        ? { bottom: `calc(${percentage(value)}% - ${size} / 2)`, left: `calc((${rail} - ${size}) / 2)` }
        : { left: `calc(${percentage(value)}% - ${size} / 2)`, top: `calc((${rail} - ${size}) / 2)` }),
    };
  };

  return (
    <div
      {...others}
      id={field?.id}
      class={['ads-slider relative min-w-0 py-3', props.vertical ? 'inline-flex h-48 w-10 justify-center px-3 py-0' : 'w-full', disabled() ? 'opacity-50' : '', props.class, props.classNames?.root]}
      style={{ ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}
      aria-invalid={field?.status() === 'error' ? 'true' : undefined}
      aria-describedby={field?.describedBy()}
      onFocusOut={(event) => { if (field && !event.currentTarget.contains(event.relatedTarget as Node | null)) void field.validate('onBlur'); }}
    >
      <div class={[props.vertical ? 'relative h-full w-1.5 rounded-full bg-border-secondary' : 'relative h-1.5 w-full rounded-full bg-border-secondary', props.classNames?.rail]} style={{ ...railTokenStyle(), ...props.styles?.rail }}>
        <div class={['absolute inset-0', props.classNames?.tracks]} style={props.styles?.tracks}><div
          class={['absolute rounded-full bg-primary', props.classNames?.track]}
          style={props.vertical
            ? { bottom: `${range() ? percentage(values()[0]) : 0}%`, height: `${range() ? percentage(values()[1]) - percentage(values()[0]) : percentage(values()[0])}%`, width: '100%', ...trackTokenStyle(), ...props.styles?.track }
            : { left: `${range() ? percentage(values()[0]) : 0}%`, width: `${range() ? percentage(values()[1]) - percentage(values()[0]) : percentage(values()[0])}%`, height: '100%', ...trackTokenStyle(), ...props.styles?.track }}
        /></div>
        <For each={range() ? [0, 1] : [0]}>{(index) => (
          <input
            type="range"
            min={props.min}
            max={props.max}
            step={props.step ?? 'any'}
            value={values()[index]}
            disabled={disabled()}
            aria-label={range() ? (index === 0 ? 'Lower value' : 'Upper value') : props['aria-label'] ?? 'Slider value'}
            aria-valuetext={String(tooltipText(values()[index]))}
            class={props.vertical ? 'absolute inset-0 h-full w-full cursor-pointer opacity-0' : 'absolute -inset-y-2 left-0 h-5 w-full cursor-pointer opacity-0'}
            style={props.vertical ? { 'writing-mode': 'vertical-lr', direction: props.reverse ? 'ltr' : 'rtl' } : { direction: props.reverse ? 'rtl' : 'ltr' }}
            onFocus={() => setActiveHandle(index)}
            onInput={(event) => updateHandle(index, Number(event.currentTarget.value))}
            onChange={(event) => updateHandle(index, Number(event.currentTarget.value), true)}
          />
        )}</For>
        <For each={range() ? values() : [values()[0]]}>{(value, index) => (
          <span
            aria-hidden="true"
            class={['pointer-events-none absolute z-10 size-3.5 rounded-full border-2 border-primary bg-surface shadow-sm', props.classNames?.handle]}
            style={{ ...handleTokenStyle(value), ...props.styles?.handle }}
          >
            <Show when={props.tooltip?.open && activeHandle() === index()}><span class="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-control bg-black/85 px-2 py-1 text-xs text-white">{tooltipText(value)}</span></Show>
          </span>
        )}</For>
      </div>
      <Show when={markEntries().length > 0}>
        <div class={props.vertical ? 'absolute inset-y-0 left-8' : 'relative mt-2 h-5'}>
          <For each={markEntries()}>{({ value, mark }) => {
            const config = typeof mark === 'object' && mark !== null && !('nodeType' in mark) && 'label' in mark ? mark as SliderMark : undefined;
            const label = () => config?.label ?? mark as JSX.Element;
            return (
              <button
                type="button"
                tabindex={-1}
                disabled={disabled()}
                class="absolute whitespace-nowrap bg-transparent text-xs text-text-secondary hover:text-primary"
                style={props.vertical ? { bottom: `${percentage(value)}%`, ...config?.style } : { left: `${percentage(value)}%`, transform: 'translateX(-50%)', ...config?.style }}
                onClick={() => chooseMark(value)}
              >
                {label()}
              </button>
            );
          }}</For>
        </div>
      </Show>
    </div>
  );
}
