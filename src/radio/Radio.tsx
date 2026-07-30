import { createContext, createSignal, createUniqueId, For, merge, omit, Show, useContext } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { useConfig } from '../config-provider';
import { useFormItemControl } from '../form/context';

export type RadioValueType = string | number | boolean;
export type RadioSemanticName = 'root' | 'icon' | 'label';
export type RadioSemanticClassNames = Partial<Record<RadioSemanticName, string>>;
export type RadioSemanticStyles = Partial<Record<RadioSemanticName, JSX.CSSProperties>>;

export interface RadioChangeEvent {
  target: {
    checked: boolean;
    value: RadioValueType;
  };
  nativeEvent: Event;
}

export interface RadioProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'defaultChecked' | 'value' | 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  value?: RadioValueType;
  onChange?: (event: RadioChangeEvent) => void;
  children?: JSX.Element;
  classNames?: RadioSemanticClassNames;
  styles?: RadioSemanticStyles;
}

export interface RadioOption {
  label: JSX.Element;
  value: RadioValueType;
  disabled?: boolean;
  class?: string;
}

export interface RadioGroupProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
  options?: readonly (RadioOption | RadioValueType)[];
  value?: RadioValueType;
  defaultValue?: RadioValueType;
  disabled?: boolean;
  name?: string;
  optionType?: 'default' | 'button';
  buttonStyle?: 'outline' | 'solid';
  size?: 'small' | 'middle' | 'large';
  onChange?: (event: RadioChangeEvent) => void;
  children?: JSX.Element;
}

interface RadioGroupContextValue {
  value: () => RadioValueType | undefined;
  disabled: () => boolean;
  name: () => string;
  optionType: () => 'default' | 'button';
  buttonStyle: () => 'outline' | 'solid';
  size: () => 'small' | 'middle' | 'large';
  select: (value: RadioValueType, nativeEvent: Event) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);
const optionFromValue = (option: RadioOption | RadioValueType): RadioOption => typeof option === 'object'
  ? option
  : { label: String(option), value: option };

function RadioRoot(inputProps: RadioProps & { button?: boolean }) {
  const config = useConfig();
  const props = merge({ defaultChecked: false, value: true as RadioValueType }, config.componentDefaults('radio') as Partial<RadioProps>, inputProps);
  const field = useFormItemControl();
  const group = useContext(RadioGroupContext);
  const [internalChecked, setInternalChecked] = createSignal(Boolean(props.defaultChecked), { ownedWrite: true });
  const others = omit(props, 'checked', 'defaultChecked', 'value', 'onChange', 'children', 'button', 'classNames', 'styles', 'class', 'style', 'disabled', 'id', 'name');
  const checked = () => group ? group.value() === props.value : props.checked ?? (field?.value() !== undefined ? field.value() === props.value : internalChecked());
  const disabled = () => props.disabled ?? group?.disabled() ?? field?.disabled() ?? false;
  const isButton = () => props.button ?? group?.optionType() === 'button';
  const sizeClass = () => {
    const size = group?.size() ?? 'middle';
    return size === 'small' ? 'h-6 px-2' : size === 'large' ? 'h-10 px-4 text-base' : 'h-8 px-3';
  };
  const buttonClass = () => {
    const selected = checked();
    const solid = group?.buttonStyle() === 'solid';
    if (selected && solid) return 'z-10 border-primary bg-primary text-white';
    if (selected) return 'z-10 border-primary text-primary';
    return 'border-border bg-surface text-text hover:text-primary';
  };
  const rootTokenStyle = (): JSX.CSSProperties => {
    if (!isButton()) return {};
    const solid = group?.buttonStyle() === 'solid';
    const selected = checked();
    return {
      'padding-inline': 'var(--ads-radio-button-padding-inline, 15px)',
      'background-color': disabled() && selected && solid
        ? 'var(--ads-radio-button-checked-bg-disabled, var(--ads-color-surface-container))'
        : selected && solid
          ? 'var(--ads-radio-button-solid-checked-bg, var(--ads-color-primary))'
          : selected
            ? 'var(--ads-radio-button-checked-bg, var(--ads-color-surface))'
            : 'var(--ads-radio-button-bg, var(--ads-color-surface))',
      color: disabled() && selected
        ? 'var(--ads-radio-button-checked-color-disabled, var(--ads-color-text-disabled))'
        : selected && solid
          ? 'var(--ads-radio-button-solid-checked-color, #fff)'
          : selected
            ? 'var(--ads-color-primary)'
            : 'var(--ads-radio-button-color, var(--ads-color-text))',
    };
  };
  const iconTokenStyle = (): JSX.CSSProperties => isButton() ? {} : {
    width: 'var(--ads-radio-radio-size, 16px)',
    height: 'var(--ads-radio-radio-size, 16px)',
  };

  const handleChange: JSX.ChangeEventHandler<HTMLInputElement, Event> = (event) => {
    if (!event.currentTarget.checked) return;
    if (group) {
      group.select(props.value, event);
      props.onChange?.({ target: { checked: true, value: props.value }, nativeEvent: event });
    } else {
      if (props.checked === undefined) {
        if (field) field.setValue(props.value);
        else setInternalChecked(true);
      }
      props.onChange?.({ target: { checked: true, value: props.value }, nativeEvent: event });
    }
  };

  return (
    <label class={isButton()
      ? ['ads-radio-button relative -ml-px inline-flex cursor-pointer items-center justify-center border first:ml-0 first:rounded-l-control last:rounded-r-control', sizeClass(), buttonClass(), disabled() ? 'cursor-not-allowed opacity-50' : '', props.class, props.classNames?.root]
      : ['ads-radio-wrapper inline-flex min-w-0 cursor-pointer items-start gap-2 text-sm text-text', disabled() ? 'cursor-not-allowed text-text-disabled' : '', props.class, props.classNames?.root]}
      style={{ ...rootTokenStyle(), ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}
    >
      <input
        {...others}
        id={props.id ?? (!group ? field?.id : undefined)}
        type="radio"
        name={props.name ?? group?.name() ?? field?.name}
        value={String(props.value)}
        checked={checked()}
        disabled={disabled()}
        aria-invalid={field?.status() === 'error' ? 'true' : undefined}
        aria-describedby={field?.describedBy()}
        class={[isButton() ? 'sr-only' : 'mt-0.5 size-4 shrink-0 cursor-pointer accent-primary disabled:cursor-not-allowed', props.classNames?.icon]}
        style={{ ...iconTokenStyle(), ...props.styles?.icon }}
        onChange={handleChange}
        onBlur={() => { if (field && !group) void field.validate('onBlur'); }}
      />
      <Show when={props.children}><span class={[isButton() ? 'truncate' : 'min-w-0 leading-[22px]', props.classNames?.label]} style={props.styles?.label}>{props.children}</span></Show>
    </label>
  );
}

export function RadioButton(props: RadioProps) {
  return <RadioRoot {...props} button />;
}

export function RadioGroup(inputProps: RadioGroupProps) {
  const props = merge({ optionType: 'default' as const, buttonStyle: 'outline' as const, size: 'middle' as const }, inputProps);
  const field = useFormItemControl();
  const uid = createUniqueId();
  const [internalValue, setInternalValue] = createSignal<RadioValueType | undefined>(props.defaultValue, { ownedWrite: true });
  const others = omit(props, 'options', 'value', 'defaultValue', 'disabled', 'name', 'optionType', 'buttonStyle', 'size', 'onChange', 'children', 'class', 'id');
  const value = () => props.value ?? (field?.value() !== undefined ? field.value() as RadioValueType : internalValue());
  const disabled = () => props.disabled ?? field?.disabled() ?? false;
  const select = (next: RadioValueType, nativeEvent: Event) => {
    if (next === value()) return;
    if (props.value === undefined) {
      if (field) field.setValue(next);
      else setInternalValue(next);
    }
    props.onChange?.({ target: { checked: true, value: next }, nativeEvent });
  };
  const context: RadioGroupContextValue = {
    value,
    disabled,
    name: () => props.name ?? `${uid}-radio-group`,
    optionType: () => props.optionType,
    buttonStyle: () => props.buttonStyle,
    size: () => props.size,
    select,
  };

  return (
    <RadioGroupContext value={context}>
      <div
        {...others}
        id={props.id ?? field?.id}
        role="radiogroup"
        aria-invalid={field?.status() === 'error' ? 'true' : undefined}
        aria-describedby={field?.describedBy()}
        class={props.optionType === 'button' ? ['ads-radio-group inline-flex items-center', props.class] : ['ads-radio-group flex flex-wrap items-center gap-x-4 gap-y-2', props.class]}
      >
        <For each={props.options}>{(rawOption) => {
          const option = optionFromValue(rawOption);
          const Component = props.optionType === 'button' ? RadioButton : RadioRoot;
          return <Component value={option.value} disabled={option.disabled} class={option.class}>{option.label}</Component>;
        }}</For>
        {props.children}
      </div>
    </RadioGroupContext>
  );
}

export const Radio = Object.assign(RadioRoot, {
  Button: RadioButton,
  Group: RadioGroup,
});
