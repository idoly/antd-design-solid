import { createSignal, For, merge, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { useFormItemControl } from '../form/context';
import { CheckableTag } from './CheckableTag';

export interface CheckableTagOption<Value extends string | number = string> { value: Value; label: JSX.Element; class?: string; style?: JSX.CSSProperties }
export interface CheckableTagGroupProps<Value extends string | number = string> extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options?: readonly (CheckableTagOption<Value> | Value)[];
  multiple?: boolean;
  value?: Value | null | readonly Value[];
  defaultValue?: Value | null | readonly Value[];
  disabled?: boolean;
  onChange?: (value: Value | null | Value[]) => void;
  rootClass?: string;
  classNames?: { root?: string; item?: string };
  styles?: { root?: JSX.CSSProperties; item?: JSX.CSSProperties };
}

export function CheckableTagGroup<Value extends string | number = string>(inputProps: CheckableTagGroupProps<Value>) {
  const props = merge({ options: [] as readonly (CheckableTagOption<Value> | Value)[] }, inputProps);
  const field = useFormItemControl();
  const [version, setVersion] = createSignal(0, { ownedWrite: true });
  let currentValue: Value | null | readonly Value[] = props.defaultValue ?? (props.multiple ? [] : null);
  const others = omit(props, 'options', 'multiple', 'value', 'defaultValue', 'disabled', 'onChange', 'rootClass', 'classNames', 'styles', 'class', 'style', 'children', 'id', 'role');
  const value = () => {
    if (props.value !== undefined) return props.value;
    if (field?.value() !== undefined) return field.value() as Value | null | readonly Value[];
    version();
    return currentValue;
  };
  const selected = (item: Value) => Array.isArray(value()) ? (value() as readonly Value[]).includes(item) : value() === item;
  const commit = (item: Value) => {
    let next: Value | null | Value[];
    if (props.multiple) {
      const values = Array.isArray(value()) ? [...value() as readonly Value[]] : [];
      next = values.includes(item) ? values.filter((entry) => entry !== item) : [...values, item];
    } else next = value() === item ? null : item;
    currentValue = next;
    if (props.value === undefined) { if (field) field.setValue(next); else setVersion((value) => value + 1); }
    props.onChange?.(next);
  };
  const option = (item: CheckableTagOption<Value> | Value): CheckableTagOption<Value> => typeof item === 'object' ? item : { value: item, label: String(item) };
  return <div {...others} id={props.id ?? field?.id} role={props.role ?? 'group'} class={['ads-checkable-tag-group flex flex-wrap items-center gap-2', props.rootClass, props.classNames?.root, props.class]} style={{ ...props.styles?.root, ...(typeof props.style === 'object' ? props.style : {}) }}>
    <For each={props.options}>{(raw) => { const item = option(raw); return <CheckableTag checked={selected(item.value)} disabled={props.disabled ?? field?.disabled()} class={[props.classNames?.item, item.class]} style={{ ...props.styles?.item, ...item.style }} onChange={() => commit(item.value)}>{item.label}</CheckableTag>; }}</For>
  </div>;
}
