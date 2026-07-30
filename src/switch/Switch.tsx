import { createSignal, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { tv } from 'tailwind-variants';
import { useConfig } from '../config-provider';
import { useFormItemControl } from '../form/context';

const switchStyles = tv({
  slots: {
    root: 'ads-switch relative inline-flex shrink-0 cursor-pointer items-center border-0 bg-text-disabled p-0 align-middle outline-none transition-colors duration-[var(--ads-motion-mid)] focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50',
    handle: 'pointer-events-none absolute left-0.5 rounded-full bg-white shadow-sm transition-transform duration-[var(--ads-motion-mid)]',
    content: 'pointer-events-none w-full overflow-hidden whitespace-nowrap text-center text-xs text-white',
  },
  variants: {
    size: {
      small: { root: 'h-4 min-w-7 rounded-full', handle: 'size-3', content: 'pl-1 pr-3 text-[10px]' },
      default: { root: 'h-[22px] min-w-11 rounded-full', handle: 'size-[18px]', content: 'pl-1.5 pr-6' },
    },
    checked: {
      true: { root: 'bg-primary hover:bg-primary-hover', content: 'pl-6 pr-1.5' },
      false: { root: 'hover:bg-text-secondary' },
    },
  },
  compoundVariants: [
    { size: 'small', checked: true, class: { handle: 'translate-x-3', content: 'pl-3 pr-1' } },
    { size: 'default', checked: true, class: { handle: 'translate-x-[22px]' } },
  ],
  defaultVariants: { size: 'default', checked: false },
});

export type SwitchSemanticName = 'root' | 'content' | 'indicator';
export type SwitchSemanticClassNames = Partial<Record<SwitchSemanticName, string>>;
export type SwitchSemanticStyles = Partial<Record<SwitchSemanticName, JSX.CSSProperties>>;

export interface SwitchProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'value' | 'onChange' | 'onClick' | 'children'> {
  checked?: boolean;
  defaultChecked?: boolean;
  value?: boolean;
  defaultValue?: boolean;
  checkedChildren?: JSX.Element;
  unCheckedChildren?: JSX.Element;
  loading?: boolean;
  size?: 'small' | 'default';
  onChange?: (checked: boolean, event: MouseEvent) => void;
  onClick?: (checked: boolean, event: MouseEvent) => void;
  classNames?: SwitchSemanticClassNames;
  styles?: SwitchSemanticStyles;
}

export function Switch(inputProps: SwitchProps) {
  const config = useConfig();
  const props = merge({ defaultChecked: false, defaultValue: false, size: 'default' as const }, config.componentDefaults('switch') as Partial<SwitchProps>, inputProps);
  const field = useFormItemControl();
  const [internalChecked, setInternalChecked] = createSignal(Boolean(inputProps.defaultChecked ?? inputProps.defaultValue), { ownedWrite: true });
  const others = omit(
    props,
    'checked', 'defaultChecked', 'value', 'defaultValue', 'checkedChildren', 'unCheckedChildren',
    'loading', 'size', 'onChange', 'onClick', 'classNames', 'styles', 'class', 'style', 'disabled', 'id',
  );
  const checked = () => props.checked ?? props.value ?? (field?.value() !== undefined ? Boolean(field.value()) : internalChecked());
  const disabled = () => props.disabled ?? field?.disabled() ?? false;
  const styles = () => switchStyles({ size: props.size, checked: checked() });
  const tokenSuffix = () => props.size === 'small' ? '-sm' : '';
  const trackTokenStyle = (): JSX.CSSProperties => ({
    height: `var(--ads-switch-track-height${tokenSuffix()}, ${props.size === 'small' ? '16px' : '22px'})`,
    'min-width': `var(--ads-switch-track-min-width${tokenSuffix()}, ${props.size === 'small' ? '28px' : '44px'})`,
    padding: 'var(--ads-switch-track-padding, 2px)',
  });
  const handleTokenStyle = (): JSX.CSSProperties => {
    const size = `var(--ads-switch-handle-size${tokenSuffix()}, ${props.size === 'small' ? '12px' : '18px'})`;
    const track = `var(--ads-switch-track-min-width${tokenSuffix()}, ${props.size === 'small' ? '28px' : '44px'})`;
    const padding = 'var(--ads-switch-track-padding, 2px)';
    return {
      width: size,
      height: size,
      left: padding,
      transform: checked() ? `translateX(calc(${track} - ${size} - ${padding} - ${padding}))` : undefined,
      'background-color': 'var(--ads-switch-handle-bg, #fff)',
      'box-shadow': 'var(--ads-switch-handle-shadow, 0 2px 4px rgba(0, 35, 11, 0.2))',
    };
  };

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
    if (props.loading) {
      event.preventDefault();
      return;
    }
    const next = !checked();
    if (props.checked === undefined && props.value === undefined) {
      if (field) field.setValue(next);
      else setInternalChecked(next);
    }
    props.onChange?.(next, event);
    props.onClick?.(next, event);
  };

  return (
    <button
      {...others}
      id={props.id ?? field?.id}
      type="button"
      role="switch"
      aria-checked={checked() ? 'true' : 'false'}
      aria-busy={props.loading ? 'true' : undefined}
      aria-invalid={field?.status() === 'error' ? 'true' : undefined}
      aria-describedby={field?.describedBy()}
      disabled={disabled() || props.loading}
      class={styles().root({ class: [props.class as string | undefined, props.classNames?.root] })}
      style={{ ...trackTokenStyle(), ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}
      onClick={handleClick}
      onBlur={() => { if (field) void field.validate('onBlur'); }}
    >
      <span aria-hidden="true" class={styles().handle({ class: props.classNames?.indicator })} style={{ ...handleTokenStyle(), ...props.styles?.indicator }}>
        <Show when={props.loading}><span class="ads-spin absolute inset-[3px] rounded-full border border-primary border-r-transparent" /></Show>
      </span>
      <span class={styles().content({ class: props.classNames?.content })} style={props.styles?.content}>{checked() ? props.checkedChildren : props.unCheckedChildren}</span>
    </button>
  );
}
