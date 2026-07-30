import { createSignal, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { Button, type ButtonProps } from '../button';
import { Popover, type PopoverProps } from '../popover';
import { useConfig } from '../config-provider';

export type PopconfirmSemanticName = 'root' | 'container' | 'icon' | 'title' | 'content' | 'arrow';
export type PopconfirmSemanticClassNames = Partial<Record<PopconfirmSemanticName, string>>;
export type PopconfirmSemanticStyles = Partial<Record<PopconfirmSemanticName, JSX.CSSProperties>>;

export interface PopconfirmProps extends Omit<PopoverProps, 'title' | 'content' | 'onOpenChange' | 'onCancel' | 'classNames' | 'styles'> {
  title: JSX.Element | (() => JSX.Element);
  description?: JSX.Element | (() => JSX.Element);
  icon?: JSX.Element;
  okText?: JSX.Element;
  cancelText?: JSX.Element;
  okType?: ButtonProps['type'];
  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  showCancel?: boolean;
  disabled?: boolean;
  onConfirm?: (event?: MouseEvent) => void | Promise<void>;
  onCancel?: (event?: MouseEvent) => void;
  onOpenChange?: (open: boolean, event?: MouseEvent) => void;
  classNames?: PopconfirmSemanticClassNames;
  styles?: PopconfirmSemanticStyles;
}

export function Popconfirm(inputProps: PopconfirmProps) {
  const config = useConfig();
  const props = merge({ okType: 'primary' as const, showCancel: true, trigger: ['click'] as const }, config.componentDefaults('popconfirm') as Partial<PopconfirmProps>, inputProps);
  const [internalOpen, setInternalOpen] = createSignal(Boolean(props.defaultOpen), { ownedWrite: true });
  const [loading, setLoading] = createSignal(false, { ownedWrite: true });
  const popoverProps = omit(
    props,
    'title', 'description', 'icon', 'okText', 'cancelText', 'okType', 'okButtonProps',
    'cancelButtonProps', 'showCancel', 'disabled', 'onConfirm', 'onCancel', 'onOpenChange',
    'classNames', 'styles', 'children', 'open', 'defaultOpen',
  );
  const open = () => props.open ?? internalOpen();
  const setOpen = (next: boolean, event?: MouseEvent) => {
    if (props.disabled && next) return;
    if (props.open === undefined) setInternalOpen(next);
    props.onOpenChange?.(next, event);
  };
  const resolve = (value: JSX.Element | (() => JSX.Element) | undefined) => typeof value === 'function' ? value() : value;
  const cancel: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
    props.onCancel?.(event);
    setOpen(false, event);
  };
  const confirm: JSX.EventHandler<HTMLButtonElement, MouseEvent> = async (event) => {
    try {
      const result = props.onConfirm?.(event);
      if (result instanceof Promise) {
        setLoading(true);
        await result;
      }
      setOpen(false, event);
    } finally {
      setLoading(false);
    }
  };
  const title = () => (
    <span class="flex items-center gap-2">
      <span aria-hidden="true" class={['inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-warning text-xs font-semibold text-warning', props.classNames?.icon]} style={props.styles?.icon}>{props.icon ?? '!'}</span>
      <span class={props.classNames?.title} style={props.styles?.title}>{resolve(props.title)}</span>
    </span>
  );
  const content = () => (
    <div class="w-64">
      <Show when={props.description}><div class={['leading-[22px] text-text-secondary', props.classNames?.content]} style={props.styles?.content}>{resolve(props.description)}</div></Show>
      <div class="mt-3 flex justify-end gap-2">
        <Show when={props.showCancel}><Button size="small" {...props.cancelButtonProps} onClick={cancel}>{props.cancelText ?? config.locale().Popconfirm?.cancelText ?? 'Cancel'}</Button></Show>
        <Button size="small" {...props.okButtonProps} type={props.okType} loading={loading() || props.okButtonProps?.loading} onClick={confirm}>{props.okText ?? config.locale().Popconfirm?.okText ?? 'OK'}</Button>
      </div>
    </div>
  );

  const titleNode = title();
  const contentNode = content();

  return (
    <Popover
      {...popoverProps}
      open={open()}
      trigger={props.disabled ? [] : props.trigger}
      title={titleNode}
      content={contentNode}
      classNames={{ root: props.classNames?.root, container: props.classNames?.container, arrow: props.classNames?.arrow }}
      styles={{ root: props.styles?.root, container: props.styles?.container, arrow: props.styles?.arrow }}
      onOpenChange={(next) => setOpen(next)}
    >
      {props.children}
    </Popover>
  );
}
