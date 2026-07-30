import { createContext, createEffect, createSignal, For, merge, omit, Show, useContext } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { useConfig } from '../config-provider';
import { useFormItemControl } from '../form/context';
import type { CheckboxRef } from '../compat-types';

export type CheckboxValueType = string | number | boolean;
export type CheckboxSemanticName = 'root' | 'icon' | 'label';
export type CheckboxSemanticClassNames = Partial<Record<CheckboxSemanticName, string>>;
export type CheckboxSemanticStyles = Partial<Record<CheckboxSemanticName, JSX.CSSProperties>>;

export interface CheckboxChangeEvent {
  target: {
    checked: boolean;
    value: CheckboxValueType;
  };
  nativeEvent: Event;
}

export interface CheckboxProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'defaultChecked' | 'value' | 'onChange' | 'ref'> {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  value?: CheckboxValueType;
  onChange?: (event: CheckboxChangeEvent) => void;
  children?: JSX.Element;
  ref?: (instance: CheckboxRef) => void;
  classNames?: CheckboxSemanticClassNames;
  styles?: CheckboxSemanticStyles;
}

export interface CheckboxOption {
  label: JSX.Element;
  value: CheckboxValueType;
  disabled?: boolean;
  class?: string;
}

export interface CheckboxGroupProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
  options?: readonly (CheckboxOption | CheckboxValueType)[];
  value?: readonly CheckboxValueType[];
  defaultValue?: readonly CheckboxValueType[];
  disabled?: boolean;
  name?: string;
  onChange?: (checkedValues: CheckboxValueType[]) => void;
  children?: JSX.Element;
}

interface CheckboxGroupContextValue {
  values: () => readonly CheckboxValueType[];
  disabled: () => boolean;
  name: () => string | undefined;
  toggle: (value: CheckboxValueType, checked: boolean) => void;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

const optionFromValue = (option: CheckboxOption | CheckboxValueType): CheckboxOption => typeof option === 'object'
  ? option
  : { label: String(option), value: option };

function CheckboxRoot(inputProps: CheckboxProps) {
  const config = useConfig();
  const props = merge({ defaultChecked: false, value: true as CheckboxValueType }, config.componentDefaults('checkbox') as Partial<CheckboxProps>, inputProps);
  const field = useFormItemControl();
  const group = useContext(CheckboxGroupContext);
  const [internalChecked, setInternalChecked] = createSignal(Boolean(props.defaultChecked), { ownedWrite: true });
  let inputRef: HTMLInputElement | undefined;
  props.ref?.({ focus: () => inputRef?.focus(), blur: () => inputRef?.blur(), get input() { return inputRef ?? null; }, get nativeElement() { return inputRef ?? null; } });
  const others = omit(props, 'checked', 'defaultChecked', 'indeterminate', 'value', 'onChange', 'children', 'classNames', 'styles', 'class', 'style', 'disabled', 'id', 'name', 'ref');
  const checked = () => group
    ? group.values().includes(props.value)
    : props.checked ?? (field?.value() !== undefined ? Boolean(field.value()) : internalChecked());
  const disabled = () => props.disabled ?? group?.disabled() ?? field?.disabled() ?? false;

  createEffect(
    () => Boolean(props.indeterminate),
    (indeterminate) => {
      if (inputRef) inputRef.indeterminate = indeterminate;
    },
  );

  const handleChange: JSX.ChangeEventHandler<HTMLInputElement, Event> = (event) => {
    const next = event.currentTarget.checked;
    if (group) group.toggle(props.value, next);
    else if (props.checked === undefined) {
      if (field) field.setValue(next);
      else setInternalChecked(next);
    }
    props.onChange?.({
      target: { checked: next, value: props.value },
      nativeEvent: event,
    });
  };

  return (
    <label class={['ads-checkbox-wrapper inline-flex min-w-0 cursor-pointer items-start gap-2 text-sm text-text', disabled() ? 'cursor-not-allowed text-text-disabled' : '', props.class, props.classNames?.root]} style={{ ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}>
      <input
        {...others}
        ref={inputRef}
        id={props.id ?? (!group ? field?.id : undefined)}
        name={props.name ?? group?.name() ?? field?.name}
        type="checkbox"
        value={String(props.value)}
        checked={checked()}
        disabled={disabled()}
        aria-checked={props.indeterminate ? 'mixed' : checked() ? 'true' : 'false'}
        aria-invalid={field?.status() === 'error' ? 'true' : undefined}
        aria-describedby={field?.describedBy()}
        class={['mt-0.5 size-4 shrink-0 cursor-pointer accent-primary disabled:cursor-not-allowed', props.classNames?.icon]}
        style={props.styles?.icon}
        onChange={handleChange}
        onBlur={() => { if (field && !group) void field.validate('onBlur'); }}
      />
      <Show when={props.children}><span class={['min-w-0 leading-[22px]', props.classNames?.label]} style={props.styles?.label}>{props.children}</span></Show>
    </label>
  );
}

export function CheckboxGroup(inputProps: CheckboxGroupProps) {
  const props = merge({ defaultValue: [] as readonly CheckboxValueType[] }, inputProps);
  const field = useFormItemControl();
  const [internalValue, setInternalValue] = createSignal<readonly CheckboxValueType[]>(props.defaultValue, { ownedWrite: true });
  const others = omit(props, 'options', 'value', 'defaultValue', 'disabled', 'name', 'onChange', 'children', 'class', 'id');
  const values = () => props.value ?? (field?.value() !== undefined ? field.value() as readonly CheckboxValueType[] : internalValue());
  const disabled = () => props.disabled ?? field?.disabled() ?? false;
  const toggle = (value: CheckboxValueType, checked: boolean) => {
    const next = checked
      ? [...values().filter((item) => item !== value), value]
      : values().filter((item) => item !== value);
    if (props.value === undefined) {
      if (field) field.setValue(next);
      else setInternalValue(next);
    }
    props.onChange?.(next);
  };
  const context: CheckboxGroupContextValue = {
    values,
    disabled,
    name: () => props.name ?? field?.name,
    toggle,
  };

  return (
    <CheckboxGroupContext value={context}>
      <div
        {...others}
        id={props.id ?? field?.id}
        role="group"
        aria-invalid={field?.status() === 'error' ? 'true' : undefined}
        aria-describedby={field?.describedBy()}
        class={['ads-checkbox-group flex flex-wrap items-center gap-x-4 gap-y-2', props.class]}
      >
        <For each={props.options}>{(rawOption) => {
          const option = optionFromValue(rawOption);
          return <Checkbox value={option.value} disabled={option.disabled} class={option.class}>{option.label}</Checkbox>;
        }}</For>
        {props.children}
      </div>
    </CheckboxGroupContext>
  );
}

export const Checkbox = Object.assign(CheckboxRoot, {
  Group: CheckboxGroup,
});
