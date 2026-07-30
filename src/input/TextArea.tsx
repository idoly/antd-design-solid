import { createEffect, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { CloseIcon } from '../_internal/icons';
import { useFormItemControl } from '../form/context';

export interface TextAreaProps extends Omit<JSX.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onInput'> {
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  bordered?: boolean;
  variant?: 'outlined' | 'borderless' | 'filled' | 'underlined';
  status?: 'error' | 'warning';
  rootClass?: string;
  allowClear?: boolean;
  showCount?: boolean | { formatter: (info: { value: string; count: number; maxLength?: number }) => JSX.Element };
  onInput?: JSX.InputEventHandler<HTMLTextAreaElement, InputEvent>;
}

export function TextArea(inputProps: TextAreaProps) {
  const props = merge({ bordered: true }, inputProps);
  const field = useFormItemControl();
  let textareaRef: HTMLTextAreaElement | undefined;
  const variant = () => props.variant ?? field?.variant() ?? 'outlined';
  const status = () => props.status ?? (field?.status() === 'error' ? 'error' : field?.status() === 'warning' ? 'warning' : undefined);
  const value = () => String(props.value !== undefined ? props.value : field?.value() ?? props.defaultValue ?? '');
  const others = omit(props, 'autoSize', 'bordered', 'variant', 'status', 'rootClass', 'allowClear', 'showCount', 'value', 'defaultValue', 'onInput', 'onBlur', 'disabled', 'id', 'name', 'class', 'aria-invalid', 'aria-describedby');
  const resize = () => {
    if (!textareaRef || !props.autoSize) return;
    const config = typeof props.autoSize === 'object' ? props.autoSize : {};
    const lineHeight = Number.parseFloat(getComputedStyle(textareaRef).lineHeight) || 22;
    textareaRef.style.height = 'auto';
    const min = (config.minRows ?? 1) * lineHeight + 10;
    const max = config.maxRows ? config.maxRows * lineHeight + 10 : Infinity;
    textareaRef.style.height = `${Math.min(max, Math.max(min, textareaRef.scrollHeight))}px`;
    textareaRef.style.overflowY = textareaRef.scrollHeight > max ? 'auto' : 'hidden';
  };
  createEffect(() => value(), () => queueMicrotask(resize));
  const clear = () => {
    if (!textareaRef) return;
    textareaRef.value = '';
    textareaRef.dispatchEvent(new InputEvent('input', { bubbles: true }));
    textareaRef.focus();
  };
  const count = () => value().length;
  return <span class={['ads-textarea-wrapper relative inline-flex w-full flex-col rounded-control border bg-surface transition-colors focus-within:border-primary', variant() === 'borderless' || props.bordered === false ? 'border-transparent' : 'border-border', variant() === 'filled' ? 'bg-surface-container' : '', variant() === 'underlined' ? 'rounded-none border-x-0 border-t-0' : '', status() === 'error' ? 'border-error' : status() === 'warning' ? 'border-warning' : '', props.rootClass]}>
    <textarea
      {...others}
      ref={textareaRef}
      id={props.id ?? field?.id}
      name={props.name ?? field?.name}
      value={value()}
      disabled={props.disabled ?? field?.disabled()}
      aria-invalid={props['aria-invalid'] ?? (status() === 'error' ? 'true' : undefined)}
      aria-describedby={props['aria-describedby'] ?? field?.describedBy()}
      class={['min-h-16 w-full resize-y bg-transparent px-[11px] py-1.5 text-sm text-text outline-none placeholder:text-text-disabled disabled:text-text-disabled', props.allowClear || props.showCount ? 'pr-8 pb-6' : '', props.class]}
      onInput={(event) => { field?.setValue(event.currentTarget.value); resize(); if (typeof props.onInput === 'function') props.onInput(event); }}
      onBlur={(event) => { if (field) void field.validate('onBlur'); if (typeof props.onBlur === 'function') props.onBlur(event); }}
    />
    <Show when={props.allowClear && value() && !(props.disabled ?? field?.disabled())}><button type="button" aria-label="Clear text" class="absolute right-2 top-2 size-5 rounded-full bg-border text-xs text-text-secondary" onClick={clear}><CloseIcon /></button></Show>
    <Show when={props.showCount}><span class="pointer-events-none absolute bottom-1 right-2 text-xs text-text-disabled">{typeof props.showCount === 'object' ? props.showCount.formatter({ value: value(), count: count(), maxLength: typeof props.maxlength === 'number' ? props.maxlength : undefined }) : `${count()}${props.maxlength ? ` / ${props.maxlength}` : ''}`}</span></Show>
  </span>;
}
