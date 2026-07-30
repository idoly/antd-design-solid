import { createSignal, For, merge, omit, Show, untrack } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { useConfig } from '../config-provider';
import { useFormItemControl } from '../form/context';

export interface OTPProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onInput'> {
  length?: number;
  variant?: 'outlined' | 'borderless' | 'filled' | 'underlined';
  rootClass?: string;
  size?: 'small' | 'middle' | 'large';
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  formatter?: (value: string) => string;
  separator?: JSX.Element | ((index: number) => JSX.Element);
  disabled?: boolean;
  status?: 'error' | 'warning';
  mask?: boolean | string;
  type?: JSX.InputHTMLAttributes<HTMLInputElement>['type'];
  autocomplete?: string;
  onInput?: (value: string[]) => void;
}

export function OTP(inputProps: OTPProps) {
  const props = merge({ length: 6, variant: 'outlined' as const, type: 'text' as const }, inputProps);
  const config = useConfig();
  const field = useFormItemControl();
  const [internalValue, setInternalValue] = createSignal(props.defaultValue ?? '', { ownedWrite: true });
  let currentValue = props.defaultValue ?? '';
  const refs: HTMLInputElement[] = [];
  const others = omit(props, 'length', 'variant', 'rootClass', 'size', 'defaultValue', 'value', 'onChange', 'formatter', 'separator', 'disabled', 'status', 'mask', 'type', 'autocomplete', 'onInput', 'class', 'children', 'id', 'role', 'aria-label', 'aria-labelledby');
  const value = () => {
    if (props.value !== undefined) return props.value;
    if (field?.value() !== undefined) return String(field.value());
    internalValue();
    return currentValue;
  };
  const format = (next: string) => (props.formatter?.(next) ?? next).slice(0, props.length);
  const chars = () => Array.from({ length: props.length }, (_, index) => value()[index] ?? '');
  const disabled = () => props.disabled ?? field?.disabled() ?? false;
  const status = () => props.status ?? (field?.status() === 'error' ? 'error' : field?.status() === 'warning' ? 'warning' : undefined);
  const commit = (nextChars: string[], focusIndex?: number) => {
    const next = format(nextChars.join(''));
    currentValue = next;
    if (props.value === undefined) {
      if (field) field.setValue(next);
      else setInternalValue(next);
    }
    props.onInput?.(Array.from({ length: props.length }, (_, index) => next[index] ?? ''));
    if (next.length === props.length) props.onChange?.(next);
    if (focusIndex !== undefined) queueMicrotask(() => refs[Math.max(0, Math.min(props.length - 1, focusIndex))]?.focus());
  };
  const enter = (index: number, entered: string) => {
    const next = chars();
    const values = Array.from(format(entered));
    values.forEach((character, offset) => { if (index + offset < props.length) next[index + offset] = character; });
    commit(next, index + Math.max(1, values.length));
  };
  const inputSize = () => ({ small: 'size-6', middle: 'size-8', large: 'size-10 text-base' })[props.size ?? config.componentSize()];
  const inputClass = () => ['min-w-0 rounded-control border bg-surface text-center text-sm text-text outline-none transition-colors focus:border-primary', inputSize(), props.variant === 'borderless' ? 'border-transparent' : 'border-border', props.variant === 'filled' ? 'bg-surface-container' : '', props.variant === 'underlined' ? 'rounded-none border-x-0 border-t-0' : '', status() === 'error' ? 'border-error' : status() === 'warning' ? 'border-warning' : ''];
  const display = (character: string) => character && props.mask ? (typeof props.mask === 'string' ? Array.from(props.mask)[0] : '*') : character;

  return <div {...others} role="group" aria-label={props['aria-label'] ?? field?.name ?? 'One-time password'} aria-labelledby={props['aria-labelledby']} class={['ads-input-otp inline-flex max-w-full items-center gap-2', props.rootClass, props.class]}>
    <For each={chars()}>{(character, index) => <>
      <Show when={index() > 0 && props.separator !== undefined}><span aria-hidden="true" class="text-text-disabled">{typeof props.separator === 'function' ? props.separator(index() - 1) : props.separator}</span></Show>
      <input
        {...(index() === 0 ? { id: props.id ?? field?.id } : {})}
        ref={(element) => { refs[untrack(index)] = element; }}
        type={props.type}
        inputmode={props.type === 'number' ? 'numeric' : undefined}
        autocomplete={props.autocomplete ?? (index() === 0 ? 'one-time-code' : 'off')}
        aria-label={`Digit ${index() + 1} of ${props.length}`}
        value={display(character)}
        disabled={disabled()}
        maxlength={1}
        class={inputClass()}
        onFocus={(event) => event.currentTarget.select()}
        onInput={(event) => enter(index(), event.currentTarget.value)}
        onPaste={(event) => { event.preventDefault(); enter(index(), event.clipboardData?.getData('text') ?? ''); }}
        onKeyDown={(event) => {
          if (event.key === 'Backspace') { event.preventDefault(); const next = chars(); if (next[index()]) next[index()] = ''; else if (index() > 0) next[index() - 1] = ''; commit(next, index() - 1); }
          else if (event.key === 'ArrowLeft') { event.preventDefault(); refs[index() - 1]?.focus(); }
          else if (event.key === 'ArrowRight') { event.preventDefault(); refs[index() + 1]?.focus(); }
        }}
        onBlur={() => { if (field) void field.validate('onBlur'); }}
      />
    </>}</For>
  </div>;
}
