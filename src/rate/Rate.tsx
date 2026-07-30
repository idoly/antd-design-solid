import { createSignal, For, merge, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { useFormItemControl } from '../form/context';

export interface RateProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onMouseMove'> {
  count?: number;
  value?: number;
  defaultValue?: number;
  allowClear?: boolean;
  allowHalf?: boolean;
  disabled?: boolean;
  character?: JSX.Element | ((props: { index: number }) => JSX.Element);
  tooltips?: readonly string[];
  onChange?: (value: number) => void;
  onHoverChange?: (value: number) => void;
}

export function Rate(inputProps: RateProps) {
  const props = merge({ count: 5, defaultValue: 0, allowClear: true, allowHalf: false }, inputProps);
  const field = useFormItemControl();
  const [internalValue, setInternalValue] = createSignal(props.defaultValue, { ownedWrite: true });
  const [hoverValue, setHoverValue] = createSignal<number | undefined>(undefined, { ownedWrite: true });
  const others = omit(props, 'count', 'value', 'defaultValue', 'allowClear', 'allowHalf', 'disabled', 'character', 'tooltips', 'onChange', 'onHoverChange', 'class');
  const value = () => props.value ?? (field?.value() !== undefined ? Number(field.value()) : internalValue());
  const displayValue = () => hoverValue() ?? value();
  const disabled = () => props.disabled ?? field?.disabled() ?? false;
  const character = (index: number) => {
    const content = props.character;
    return typeof content === 'function' ? content({ index }) : content ?? <>&#9733;</>;
  };
  const commit = (next: number) => {
    const normalized = Math.min(props.count, Math.max(0, next));
    const cleared = props.allowClear && normalized === value() ? 0 : normalized;
    if (props.value === undefined) {
      if (field) field.setValue(cleared);
      else setInternalValue(cleared);
    }
    props.onChange?.(cleared);
  };
  const pointValue = (event: MouseEvent, index: number) => {
    if (!props.allowHalf) return index + 1;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    return event.clientX <= rect.left + rect.width / 2 ? index + 0.5 : index + 1;
  };
  const hover = (next: number | undefined) => {
    setHoverValue(next);
    props.onHoverChange?.(next ?? 0);
  };
  const keyboard: JSX.EventHandler<HTMLElement, KeyboardEvent> = (event) => {
    if (disabled()) return;
    const step = props.allowHalf ? 0.5 : 1;
    let next: number | undefined;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = value() + step;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = value() - step;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = props.count;
    if (next === undefined) return;
    event.preventDefault();
    commit(next);
  };

  return (
    <div
      {...others}
      id={field?.id}
      role="radiogroup"
      aria-disabled={disabled() ? 'true' : undefined}
      aria-invalid={field?.status() === 'error' ? 'true' : undefined}
      aria-describedby={field?.describedBy()}
      class={['ads-rate inline-flex items-center gap-1 text-2xl leading-none outline-none focus-visible:rounded-control focus-visible:ring-2 focus-visible:ring-primary/20', disabled() ? 'cursor-not-allowed opacity-50' : '', props.class]}
      onMouseLeave={() => hover(undefined)}
      onBlur={() => { if (field) void field.validate('onBlur'); }}
    >
      <For each={Array.from({ length: props.count })}>{(_, index) => {
        const filled = () => Math.min(1, Math.max(0, displayValue() - index()));
        return (
          <button
            type="button"
            role="radio"
            tabindex={!disabled() && (Math.ceil(value()) === index() + 1 || value() === 0 && index() === 0) ? 0 : -1}
            aria-checked={Math.ceil(value()) === index() + 1 ? 'true' : 'false'}
            aria-label={props.tooltips?.[index()] ?? `${index() + 1} stars`}
            title={props.tooltips?.[index()]}
            disabled={disabled()}
            class="relative inline-flex size-7 items-center justify-center bg-transparent text-border transition-transform hover:scale-110 disabled:cursor-not-allowed"
            onMouseMove={(event) => hover(pointValue(event, index()))}
            onKeyDown={keyboard}
            onClick={(event) => commit(pointValue(event, index()))}
          >
            <span aria-hidden="true">{character(index())}</span>
            <span aria-hidden="true" class="absolute inset-0 overflow-hidden text-warning" style={{ width: `${filled() * 100}%` }}>{character(index())}</span>
          </button>
        );
      }}</For>
    </div>
  );
}
