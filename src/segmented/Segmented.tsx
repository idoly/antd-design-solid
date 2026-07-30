import { createSignal, createUniqueId, For, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { tv } from 'tailwind-variants';
import { useConfig } from '../config-provider';
import { useFormItemControl } from '../form/context';

export type SegmentedValue = string | number;
export type SegmentedSemanticName = 'root' | 'item' | 'label' | 'icon';
export type SegmentedSemanticClassNames = Partial<Record<SegmentedSemanticName, string>>;
export type SegmentedSemanticStyles = Partial<Record<SegmentedSemanticName, JSX.CSSProperties>>;

export interface SegmentedOption {
  label: JSX.Element;
  value: SegmentedValue;
  icon?: JSX.Element;
  disabled?: boolean;
  class?: string;
  title?: string;
}

export interface SegmentedProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: readonly (SegmentedOption | SegmentedValue)[];
  value?: SegmentedValue;
  defaultValue?: SegmentedValue;
  block?: boolean;
  vertical?: boolean;
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
  shape?: 'default' | 'round';
  name?: string;
  onChange?: (value: SegmentedValue) => void;
  classNames?: SegmentedSemanticClassNames;
  styles?: SegmentedSemanticStyles;
}

const segmented = tv({
  slots: {
    root: 'ads-segmented inline-flex min-w-0 gap-0.5 bg-surface-container p-0.5 text-sm text-text-secondary',
    item: 'inline-flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-1.5 border-0 bg-transparent px-3 outline-none transition-[background-color,box-shadow,color] duration-[var(--ads-motion-fast)] hover:text-text focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:text-text-disabled',
  },
  variants: {
    size: {
      small: { item: 'h-6 px-2 text-xs' },
      middle: { item: 'h-7' },
      large: { item: 'h-9 px-4 text-base' },
    },
    shape: {
      default: { root: 'rounded-control', item: 'rounded-small' },
      round: { root: 'rounded-full', item: 'rounded-full' },
    },
    vertical: { true: { root: 'flex-col', item: 'w-full' } },
    selected: { true: { item: 'bg-surface text-text shadow-sm' } },
    block: { true: { root: 'flex w-full' } },
  },
  defaultVariants: { size: 'middle', shape: 'default' },
});

const normalizeOption = (option: SegmentedOption | SegmentedValue): SegmentedOption => typeof option === 'object'
  ? option
  : { label: String(option), value: option };

export function Segmented(inputProps: SegmentedProps) {
  const config = useConfig();
  const props = merge({ size: 'middle' as const, shape: 'default' as const, block: false, vertical: false }, config.componentDefaults('segmented') as Partial<SegmentedProps>, inputProps);
  const field = useFormItemControl();
  const normalized = () => props.options.map(normalizeOption);
  const initial = props.defaultValue ?? normalized().find((option) => !option.disabled)?.value;
  const [internalValue, setInternalValue] = createSignal<SegmentedValue | undefined>(initial, { ownedWrite: true });
  const uid = createUniqueId();
  const others = omit(props, 'options', 'value', 'defaultValue', 'block', 'vertical', 'disabled', 'size', 'shape', 'name', 'onChange', 'classNames', 'styles', 'class', 'style');
  const value = () => props.value ?? (field?.value() !== undefined ? field.value() as SegmentedValue : internalValue());
  const disabled = () => props.disabled ?? field?.disabled() ?? false;
  const select = (option: SegmentedOption) => {
    if (disabled() || option.disabled || option.value === value()) return;
    if (props.value === undefined) {
      if (field) field.setValue(option.value);
      else setInternalValue(option.value);
    }
    props.onChange?.(option.value);
  };
  const move = (event: KeyboardEvent, index: number) => {
    const enabled = normalized().map((option, optionIndex) => ({ option, optionIndex })).filter(({ option }) => !option.disabled);
    const enabledIndex = enabled.findIndex(({ optionIndex }) => optionIndex === index);
    let next = enabledIndex;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (enabledIndex + 1) % enabled.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (enabledIndex - 1 + enabled.length) % enabled.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = enabled.length - 1;
    else return;
    event.preventDefault();
    const target = enabled[next];
    select(target.option);
    document.getElementById(`${uid}-${target.optionIndex}`)?.focus();
  };

  return (
    <div
      {...others}
      id={field?.id}
      role="radiogroup"
      aria-disabled={disabled() ? 'true' : undefined}
      aria-invalid={field?.status() === 'error' ? 'true' : undefined}
      aria-describedby={field?.describedBy()}
      class={segmented({ size: props.size, shape: props.shape, vertical: props.vertical, block: props.block }).root({ class: [props.class as string | undefined, props.classNames?.root] })}
      style={{ ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}
      onFocusOut={(event) => { if (field && !event.currentTarget.contains(event.relatedTarget as Node | null)) void field.validate('onBlur'); }}
    >
      <For each={normalized()}>{(option, index) => {
        const selected = () => value() === option.value;
        return (
          <button
            type="button"
            role="radio"
            id={`${uid}-${index()}`}
            name={props.name ?? field?.name}
            aria-checked={selected() ? 'true' : 'false'}
            disabled={disabled() || option.disabled}
            tabindex={selected() ? 0 : -1}
            title={option.title}
            class={segmented({ size: props.size, shape: props.shape, selected: selected() }).item({ class: [option.class, props.classNames?.item] })}
            style={props.styles?.item}
            onClick={() => select(option)}
            onKeyDown={(event) => move(event, index())}
          >
            <Show when={option.icon}><span aria-hidden="true" class={['inline-flex shrink-0', props.classNames?.icon]} style={props.styles?.icon}>{option.icon}</span></Show>
            <span class={['truncate', props.classNames?.label]} style={props.styles?.label}>{option.label}</span>
          </button>
        );
      }}</For>
    </div>
  );
}
