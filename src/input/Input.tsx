import { createSignal, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { tv } from 'tailwind-variants';
import { CloseIcon } from '../_internal/icons';
import { useConfig } from '../config-provider';
import { useFormItemControl } from '../form/context';

const input = tv({
  base: 'ads-input min-w-0 flex-1 bg-transparent px-[11px] text-sm text-text outline-none placeholder:text-text-disabled disabled:cursor-not-allowed disabled:text-text-disabled',
  variants: {
    size: {
      small: 'h-6',
      middle: 'h-8',
      large: 'h-10 text-base',
    },
  },
});

const wrapper = tv({
  base: 'ads-input-wrapper inline-flex w-full items-center overflow-hidden rounded-control border border-border bg-surface transition-[border-color,box-shadow] duration-[var(--ads-motion-fast)] focus-within:border-primary focus-within:shadow-[0_0_0_2px_color-mix(in_srgb,var(--ads-color-primary)_20%,transparent)] hover:border-primary-hover has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-surface-container',
  variants: {
    status: {
      error: 'border-error focus-within:border-error focus-within:shadow-[0_0_0_2px_color-mix(in_srgb,var(--ads-color-error)_20%,transparent)]',
      warning: 'border-warning focus-within:border-warning focus-within:shadow-[0_0_0_2px_color-mix(in_srgb,var(--ads-color-warning)_20%,transparent)]',
    },
    bordered: {
      false: 'border-transparent bg-surface-container shadow-none',
    },
  },
  defaultVariants: { bordered: true },
});

export type InputSemanticName = 'root' | 'input' | 'prefix' | 'suffix' | 'count';
export type InputClassNames = Partial<Record<InputSemanticName, string>> | ((info: { props: InputProps }) => Partial<Record<InputSemanticName, string>>);
export type InputStyles = Partial<Record<InputSemanticName, JSX.CSSProperties>> | ((info: { props: InputProps }) => Partial<Record<InputSemanticName, JSX.CSSProperties>>);
export interface InputCountConfig { show?: boolean; max?: number; strategy?: (value: string) => number; exceedFormatter?: (value: string, config: { max: number }) => string }

export interface InputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'onChange'> {
  size?: 'small' | 'middle' | 'large';
  prefix?: JSX.Element;
  suffix?: JSX.Element;
  status?: 'error' | 'warning';
  bordered?: boolean;
  rootClass?: string;
  variant?: 'outlined' | 'borderless' | 'filled' | 'underlined';
  addonBefore?: JSX.Element;
  addonAfter?: JSX.Element;
  allowClear?: boolean | { clearIcon?: JSX.Element };
  showCount?: boolean | { formatter: (info: { value: string; count: number; maxLength?: number }) => JSX.Element };
  classNames?: InputClassNames;
  styles?: InputStyles;
  count?: InputCountConfig;
  value?: string | number | string[];
  defaultValue?: string | number | string[];
  disabled?: boolean;
  id?: string;
  type?: string;
  onChange?: (event: InputEvent & { currentTarget: HTMLInputElement; target: HTMLInputElement }) => void;
  onPressEnter?: (event: KeyboardEvent & { currentTarget: HTMLInputElement; target: Element }) => void;
  onClear?: () => void;
}

export function InternalInput(inputProps: InputProps) {
  const config = useConfig();
  const field = useFormItemControl();
  const props = merge({ bordered: true }, config.componentDefaults('input') as Partial<InputProps>, inputProps);
  const [internalValue, setInternalValue] = createSignal(String(props.defaultValue ?? ''), { ownedWrite: true });
  let currentValue = String(props.defaultValue ?? '');
  let inputRef: HTMLInputElement | undefined;
  const others = omit(
    props,
    'size', 'prefix', 'suffix', 'status', 'bordered', 'rootClass', 'variant', 'addonBefore', 'addonAfter', 'allowClear', 'showCount', 'classNames', 'styles', 'count', 'class',
    'value', 'defaultValue', 'onInput', 'onChange', 'onPressEnter', 'onClear', 'onBlur', 'onKeyDown', 'disabled', 'name', 'id', 'ref', 'aria-invalid', 'aria-describedby',
  );
  const size = () => props.size ?? config.componentSize();
  const semanticClasses = () => typeof props.classNames === 'function' ? props.classNames({ props }) : props.classNames ?? {};
  const semanticStyles = () => typeof props.styles === 'function' ? props.styles({ props }) : props.styles ?? {};
  const status = (): InputProps['status'] => props.status ?? (field?.status() === 'error' ? 'error' : field?.status() === 'warning' ? 'warning' : undefined);
  const disabled = () => props.disabled ?? field?.disabled() ?? config.componentDisabled();
  const value = () => {
    if (props.value !== undefined) return props.value;
    if (field) return (field.value() ?? '') as string | number | string[];
    internalValue();
    return currentValue;
  };

  const handleInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (event) => {
    currentValue = event.currentTarget.value;
    if (props.value === undefined && !field) setInternalValue(currentValue);
    field?.setValue(currentValue);
    if (typeof props.onInput === 'function') props.onInput(event);
    props.onChange?.(event as InputEvent & { currentTarget: HTMLInputElement; target: HTMLInputElement });
  };
  const handleBlur: JSX.FocusEventHandler<HTMLInputElement, FocusEvent> = (event) => {
    if (field) void field.validate('onBlur');
    if (typeof props.onBlur === 'function') props.onBlur(event);
  };

  const clear = () => {
    if (!inputRef) return;
    inputRef.value = '';
    inputRef.dispatchEvent(new InputEvent('input', { bubbles: true }));
    props.onClear?.();
    inputRef.focus();
  };
  const count = () => props.count?.strategy?.(String(value() ?? '')) ?? String(value() ?? '').length;
  const countMax = () => props.count?.max ?? (typeof props.maxlength === 'number' ? props.maxlength : undefined);
  const countValue = () => countMax() !== undefined && count() > countMax()! && props.count?.exceedFormatter ? props.count.exceedFormatter(String(value() ?? ''), { max: countMax()! }) : String(value() ?? '');
  const variant = () => props.variant ?? field?.variant() ?? config.variant() ?? 'outlined';
  const bordered = () => variant() === 'borderless' || props.bordered === false ? false : true;
  const inputTokenStyle = (): JSX.CSSProperties => {
    const suffix = size() === 'small' ? '-sm' : size() === 'large' ? '-lg' : '';
    return {
      height: `var(--ads-input-control-height${suffix}, ${size() === 'small' ? '24px' : size() === 'large' ? '40px' : '32px'})`,
      'padding-block': `var(--ads-input-padding-block${suffix}, 0px)`,
      'padding-inline': `var(--ads-input-padding-inline${suffix}, 11px)`,
      'font-size': `var(--ads-input-input-font-size${suffix}, ${size() === 'large' ? '16px' : '14px'})`,
    };
  };

  return (
    <span class="ads-input-group inline-flex w-full min-w-0">
      <Show when={props.addonBefore}><span class="inline-flex shrink-0 items-center rounded-l-control border border-r-0 border-border bg-surface-container px-[11px] text-sm text-text-secondary">{props.addonBefore}</span></Show>
    <span data-status={status()} class={wrapper({ status: status(), bordered: bordered(), class: [props.rootClass, variant() === 'filled' ? 'bg-surface-container' : '', variant() === 'underlined' ? 'rounded-none border-x-0 border-t-0' : '', props.addonBefore ? 'rounded-l-none' : '', props.addonAfter ? 'rounded-r-none' : '', semanticClasses().root] })} style={{ 'background-color': 'var(--ads-input-active-bg, var(--ads-color-surface))', ...semanticStyles().root }}>
      <Show when={props.prefix}><span class={['ml-[11px] inline-flex shrink-0 text-text-secondary', semanticClasses().prefix]} style={semanticStyles().prefix}>{props.prefix}</span></Show>
      <input
        {...others}
        ref={(element) => { inputRef = element; if (typeof props.ref === 'function') props.ref(element); }}
        id={props.id ?? field?.id}
        name={props.name ?? field?.name}
        value={countValue()}
        disabled={disabled()}
        aria-invalid={props['aria-invalid'] ?? (status() === 'error' ? 'true' : undefined)}
        aria-describedby={props['aria-describedby'] ?? field?.describedBy()}
        class={input({ size: size(), class: [semanticClasses().input, props.class as string | undefined] })}
        style={{ ...inputTokenStyle(), ...semanticStyles().input }}
        onInput={handleInput}
        onBlur={handleBlur}
        onKeyDown={(event) => { if (event.key === 'Enter') props.onPressEnter?.(event); if (typeof props.onKeyDown === 'function') props.onKeyDown(event); }}
      />
      <Show when={props.showCount || props.count?.show}><span class={['mr-2 shrink-0 text-xs text-text-disabled', semanticClasses().count]} style={semanticStyles().count}>{typeof props.showCount === 'object' ? props.showCount.formatter({ value: String(value() ?? ''), count: count(), maxLength: countMax() }) : `${count()}${countMax() !== undefined ? ` / ${countMax()}` : ''}`}</span></Show>
      <Show when={props.allowClear && String(value() ?? '') && !disabled()}><button type="button" aria-label="Clear input" class="mr-2 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-border text-[10px] text-text-secondary" onClick={clear}>{typeof props.allowClear === 'object' ? props.allowClear.clearIcon ?? <CloseIcon /> : <CloseIcon />}</button></Show>
      <Show when={props.suffix}><span class={['mr-[11px] inline-flex shrink-0 text-text-secondary', semanticClasses().suffix]} style={semanticStyles().suffix}>{props.suffix}</span></Show>
    </span>
      <Show when={props.addonAfter}><span class="inline-flex shrink-0 items-center rounded-r-control border border-l-0 border-border bg-surface-container px-[11px] text-sm text-text-secondary">{props.addonAfter}</span></Show>
    </span>
  );
}
