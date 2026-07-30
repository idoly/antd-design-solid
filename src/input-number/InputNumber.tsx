import { createSignal, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { tv } from 'tailwind-variants';
import { DownIcon, UpIcon } from '../_internal/icons';
import { useConfig } from '../config-provider';
import { useFormItemControl } from '../form/context';

const inputNumber = tv({
  slots: {
    root: 'ads-input-number inline-flex w-full min-w-0 items-stretch overflow-hidden rounded-control border border-border bg-surface text-sm text-text transition-[border-color,box-shadow] hover:border-primary-hover focus-within:border-primary focus-within:shadow-[0_0_0_2px_color-mix(in_srgb,var(--ads-color-primary)_20%,transparent)]',
    input: 'min-w-0 flex-1 bg-transparent px-[11px] text-right outline-none disabled:cursor-not-allowed disabled:text-text-disabled',
  },
  variants: {
    size: {
      small: { root: 'h-6', input: 'h-[22px]' },
      middle: { root: 'h-8', input: 'h-[30px]' },
      large: { root: 'h-10 text-base', input: 'h-[38px] text-base' },
    },
    status: {
      error: { root: 'border-error hover:border-error focus-within:border-error' },
      warning: { root: 'border-warning hover:border-warning focus-within:border-warning' },
    },
    disabled: { true: { root: 'cursor-not-allowed bg-surface-container' } },
  },
  defaultVariants: { size: 'middle' },
});

export type InputNumberValue = number | string | null;
export type InputNumberSemanticName = 'root' | 'prefix' | 'input' | 'suffix' | 'actions' | 'action';
export type InputNumberSemanticClassNames = Partial<Record<InputNumberSemanticName, string>>;
export type InputNumberSemanticStyles = Partial<Record<InputNumberSemanticName, JSX.CSSProperties>>;

export interface InputNumberProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onInput' | 'prefix'> {
  value?: number | string | null;
  defaultValue?: number | string | null;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  stringMode?: boolean;
  controls?: boolean;
  keyboard?: boolean;
  changeOnWheel?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  size?: 'small' | 'middle' | 'large';
  status?: 'error' | 'warning';
  prefix?: JSX.Element;
  suffix?: JSX.Element;
  formatter?: (value: InputNumberValue, info: { userTyping: boolean; input: string }) => string;
  parser?: (displayValue: string | undefined) => number | string;
  onChange?: (value: InputNumberValue) => void;
  onStep?: (value: number, info: { offset: number; type: 'up' | 'down' }) => void;
  classNames?: InputNumberSemanticClassNames;
  styles?: InputNumberSemanticStyles;
}

const decimals = (value: number) => (String(value).split('.')[1] ?? '').length;

export function InputNumber(inputProps: InputNumberProps) {
  const config = useConfig();
  const field = useFormItemControl();
  const props = merge({ step: 1, controls: true, keyboard: true, changeOnWheel: false }, config.componentDefaults('inputNumber') as Partial<InputNumberProps>, inputProps);
  const [internalValue, setInternalValue] = createSignal<InputNumberValue>(props.defaultValue ?? null, { ownedWrite: true });
  const [inputText, setInputText] = createSignal('', { ownedWrite: true });
  const [focused, setFocused] = createSignal(false, { ownedWrite: true });
  let currentInput = '';
  const others = omit(
    props,
    'value', 'defaultValue', 'min', 'max', 'step', 'precision', 'stringMode', 'controls',
    'keyboard', 'changeOnWheel', 'disabled', 'readOnly', 'size', 'status', 'prefix',
    'suffix', 'formatter', 'parser', 'onChange', 'onStep', 'classNames', 'styles', 'class', 'style', 'id', 'aria-label',
    'aria-labelledby', 'aria-describedby', 'aria-invalid',
  );
  const current = (): InputNumberValue => props.value !== undefined ? props.value : field?.value() !== undefined ? field.value() as InputNumberValue : internalValue();
  const disabled = () => props.disabled ?? field?.disabled() ?? config.componentDisabled();
  const status = (): InputNumberProps['status'] => props.status ?? (field?.status() === 'error' ? 'error' : field?.status() === 'warning' ? 'warning' : undefined);
  const size = () => props.size ?? config.componentSize();
  const sizeSuffix = () => size() === 'small' ? '-sm' : size() === 'large' ? '-lg' : '';
  const rootTokenStyle = (): JSX.CSSProperties => ({
    width: 'var(--ads-input-number-control-width, 90px)',
    'max-width': '100%',
    'background-color': disabled() ? undefined : 'var(--ads-input-number-active-bg, var(--ads-color-surface))',
    'box-shadow': focused()
      ? status() === 'error'
        ? 'var(--ads-input-number-error-active-shadow, 0 0 0 2px color-mix(in srgb, var(--ads-color-error) 10%, transparent))'
        : status() === 'warning'
          ? 'var(--ads-input-number-warning-active-shadow, 0 0 0 2px color-mix(in srgb, var(--ads-color-warning) 10%, transparent))'
          : 'var(--ads-input-number-active-shadow, 0 0 0 2px color-mix(in srgb, var(--ads-color-primary) 20%, transparent))'
      : undefined,
  });
  const inputTokenStyle = (): JSX.CSSProperties => ({
    'font-size': `var(--ads-input-number-input-font-size${sizeSuffix()}, ${size() === 'large' ? '16px' : '14px'})`,
    'padding-inline': `var(--ads-input-number-padding-inline${sizeSuffix()}, 11px)`,
  });
  const actionsTokenStyle = (): JSX.CSSProperties => ({
    width: 'var(--ads-input-number-handle-width, 22px)',
    'background-color': 'var(--ads-input-number-handle-bg, transparent)',
    'border-color': 'var(--ads-input-number-handle-border-color, var(--ads-color-border-secondary))',
  });
  const precision = () => props.precision ?? decimals(props.step);
  const normalize = (value: number): number => {
    const clamped = Math.min(props.max ?? Infinity, Math.max(props.min ?? -Infinity, value));
    return Number(clamped.toFixed(precision()));
  };
  const rawText = () => current() === null || current() === undefined ? '' : String(current());
  const display = () => {
    const raw = focused() ? inputText() : rawText();
    return props.formatter ? props.formatter(current(), { userTyping: focused(), input: raw }) : raw;
  };
  const commit = (value: InputNumberValue) => {
    if (props.value === undefined) {
      if (field) field.setValue(value);
      else setInternalValue(value);
    }
    props.onChange?.(value);
  };
  const parse = (text: string): InputNumberValue => {
    const parsed = props.parser ? props.parser(text) : text.replace(/[^0-9+\-.]/g, '');
    if (parsed === '' || parsed === '-' || parsed === '+') return null;
    const numeric = Number(parsed);
    if (!Number.isFinite(numeric)) return null;
    const next = normalize(numeric);
    return props.stringMode ? String(next) : next;
  };
  const step = (direction: 'up' | 'down') => {
    if (disabled() || props.readOnly) return;
    const offset = direction === 'up' ? props.step : -props.step;
    const base = typeof current() === 'number' ? current() as number : Number(current() ?? 0);
    const next = normalize((Number.isFinite(base) ? base : 0) + offset);
    commit(props.stringMode ? String(next) : next);
    props.onStep?.(next, { offset, type: direction });
  };

  return (
    <div {...others} class={inputNumber({ size: size(), status: status(), disabled: disabled() }).root({ class: [props.class as string | undefined, props.classNames?.root] })} style={{ ...rootTokenStyle(), ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}>
      <Show when={props.prefix}><span class={['ml-[11px] inline-flex shrink-0 items-center text-text-secondary', props.classNames?.prefix]} style={props.styles?.prefix}>{props.prefix}</span></Show>
      <input
        id={props.id ?? field?.id}
        role="spinbutton"
        inputmode="decimal"
        autocomplete="off"
        value={display()}
        readonly={props.readOnly}
        disabled={disabled()}
        aria-label={props['aria-label']}
        aria-labelledby={props['aria-labelledby']}
        aria-describedby={props['aria-describedby'] ?? field?.describedBy()}
        aria-invalid={props['aria-invalid'] ?? (status() === 'error' ? 'true' : undefined)}
        aria-valuemin={props.min}
        aria-valuemax={props.max}
        aria-valuenow={typeof current() === 'number' ? current() as number : Number(current()) || undefined}
        class={inputNumber({ size: size() }).input({ class: props.classNames?.input })}
        style={{ ...inputTokenStyle(), ...props.styles?.input }}
        onFocus={() => {
          currentInput = rawText();
          setInputText(currentInput);
          setFocused(true);
        }}
        onInput={(event) => {
          currentInput = event.currentTarget.value;
          setInputText(currentInput);
          commit(parse(currentInput));
        }}
        onBlur={() => {
          setFocused(false);
          if (field) void field.validate('onBlur');
        }}
        onKeyDown={(event) => {
          if (!props.keyboard) return;
          if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
            step(event.key === 'ArrowUp' ? 'up' : 'down');
          }
        }}
        onWheel={(event) => {
          if (props.changeOnWheel && focused()) {
            event.preventDefault();
            step(event.deltaY < 0 ? 'up' : 'down');
          }
        }}
      />
      <Show when={props.suffix}><span class={['mr-2 inline-flex shrink-0 items-center text-text-secondary', props.classNames?.suffix]} style={props.styles?.suffix}>{props.suffix}</span></Show>
      <Show when={props.controls}>
        <span class={['flex w-6 shrink-0 flex-col border-l border-border-secondary', props.classNames?.actions]} style={{ ...actionsTokenStyle(), ...props.styles?.actions }}>
          <button type="button" aria-label="Increase value" tabindex={-1} disabled={disabled() || props.readOnly || (typeof current() === 'number' && current() as number >= (props.max ?? Infinity))} class={['flex min-h-0 flex-1 items-center justify-center bg-transparent text-[10px] text-text-secondary hover:text-primary disabled:text-text-disabled', props.classNames?.action]} style={props.styles?.action} onClick={() => step('up')}><UpIcon /></button>
          <button type="button" aria-label="Decrease value" tabindex={-1} disabled={disabled() || props.readOnly || (typeof current() === 'number' && current() as number <= (props.min ?? -Infinity))} class={['flex min-h-0 flex-1 items-center justify-center border-t border-border-secondary bg-transparent text-[10px] text-text-secondary hover:text-primary disabled:text-text-disabled', props.classNames?.action]} style={props.styles?.action} onClick={() => step('down')}><DownIcon /></button>
        </span>
      </Show>
    </div>
  );
}
