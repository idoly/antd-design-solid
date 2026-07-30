import { createEffect, createSignal, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { CloseIcon, PlusIcon, UpIcon } from '../_internal/icons';
import { Badge, type BadgeProps } from '../badge';
import { Tooltip } from '../tooltip';
import type { FloatButtonRef } from '../compat-types';
import { useConfig } from '../config-provider';

export type FloatButtonSemanticName = 'root' | 'icon' | 'content';
export type FloatButtonSemanticClassNames = Partial<Record<FloatButtonSemanticName, string>>;
export type FloatButtonSemanticStyles = Partial<Record<FloatButtonSemanticName, JSX.CSSProperties>>;

export interface FloatButtonProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children' | 'onClick' | 'ref'> {
  type?: 'default' | 'primary';
  shape?: 'circle' | 'square';
  icon?: JSX.Element;
  description?: JSX.Element;
  tooltip?: JSX.Element;
  href?: string;
  target?: string;
  badge?: Omit<BadgeProps, 'children'>;
  onClick?: (event: MouseEvent) => void;
  ref?: (instance: FloatButtonRef) => void;
  classNames?: FloatButtonSemanticClassNames;
  styles?: FloatButtonSemanticStyles;
}

export interface FloatButtonGroupProps extends JSX.HTMLAttributes<HTMLDivElement> {
  shape?: FloatButtonProps['shape'];
  trigger?: 'click' | 'hover';
  open?: boolean;
  defaultOpen?: boolean;
  closeIcon?: JSX.Element;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  onOpenChange?: (open: boolean) => void;
}

export interface BackTopProps extends Omit<FloatButtonProps, 'onClick' | 'target'> {
  duration?: number;
  visibilityHeight?: number;
  target?: () => HTMLElement | Window | null;
  onClick?: (event: MouseEvent) => void;
}

function FloatButtonRoot(inputProps: FloatButtonProps) {
  const config = useConfig();
  let nativeElement: HTMLButtonElement | HTMLAnchorElement | undefined;
  const props = merge({ type: 'default' as const, shape: 'circle' as const }, config.componentDefaults('floatButton') as Partial<FloatButtonProps>, inputProps);
  props.ref?.({ get nativeElement() { return nativeElement ?? null; } });
  const buttonProps = omit(props, 'type', 'shape', 'icon', 'description', 'tooltip', 'href', 'target', 'badge', 'classNames', 'styles', 'class', 'onClick', 'ref');
  const visual = () => (
    <Badge {...props.badge}>
      <span class={[
        'ads-float-button inline-flex size-10 items-center justify-center overflow-hidden border text-sm shadow-popup outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/20',
        props.shape === 'circle' ? 'rounded-full' : 'rounded-surface',
        props.type === 'primary' ? 'border-primary bg-primary text-white hover:bg-primary-hover' : 'border-border-secondary bg-surface text-text hover:text-primary',
        props.description ? 'flex-col gap-0.5 px-1 text-[10px] leading-3' : '',
        props.class,
        props.classNames?.root,
      ]} style={props.styles?.root}>
        <Show when={props.icon}><span aria-hidden="true" class={['inline-flex text-base', props.classNames?.icon]} style={props.styles?.icon}>{props.icon}</span></Show>
        <Show when={props.description}><span class={['max-w-full truncate', props.classNames?.content]} style={props.styles?.content}>{props.description}</span></Show>
      </span>
    </Badge>
  );
  const control = () => props.href
    ? <a {...buttonProps as JSX.AnchorHTMLAttributes<HTMLAnchorElement>} ref={(element) => { nativeElement = element; }} href={props.href} target={props.target} class="inline-flex" onClick={props.onClick}>{visual()}</a>
    : <button {...buttonProps} ref={(element) => { nativeElement = element; }} type="button" class="inline-flex" onClick={props.onClick}>{visual()}</button>;
  return props.tooltip ? <Tooltip title={props.tooltip} placement="left" trigger={['hover', 'focus']}>{control()}</Tooltip> : control();
}

export function FloatButtonGroup(inputProps: FloatButtonGroupProps) {
  const props = merge({ shape: 'circle' as const, defaultOpen: false, placement: 'top' as const }, inputProps);
  const [internalOpen, setInternalOpen] = createSignal(Boolean(props.defaultOpen), { ownedWrite: true });
  const others = omit(props, 'shape', 'trigger', 'open', 'defaultOpen', 'closeIcon', 'placement', 'onOpenChange', 'children', 'class');
  const open = () => props.trigger ? props.open ?? internalOpen() : true;
  const setOpen = (next: boolean) => {
    if (!props.trigger || next === open()) return;
    if (props.open === undefined) setInternalOpen(next);
    props.onOpenChange?.(next);
  };
  const direction = () => props.placement === 'top' ? 'flex-col-reverse' : props.placement === 'bottom' ? 'flex-col' : props.placement === 'left' ? 'flex-row-reverse' : 'flex-row';
  return (
    <div
      {...others}
      class={['ads-float-button-group fixed bottom-6 right-6 z-[990] flex items-center gap-3', direction(), props.class]}
      onPointerEnter={() => { if (props.trigger === 'hover') setOpen(true); }}
      onPointerLeave={() => { if (props.trigger === 'hover') setOpen(false); }}
    >
      <Show when={open()}><div class={['flex items-center gap-3', direction()]}>{props.children}</div></Show>
      <Show when={props.trigger}>
        <FloatButtonRoot shape={props.shape} type="primary" icon={open() ? props.closeIcon ?? <CloseIcon /> : <PlusIcon />} aria-label={open() ? 'Close floating menu' : 'Open floating menu'} onClick={() => setOpen(!open())} />
      </Show>
    </div>
  );
}

export function BackTop(inputProps: BackTopProps) {
  const props = merge({ duration: 450, visibilityHeight: 400 }, inputProps);
  const [visible, setVisible] = createSignal(false, { ownedWrite: true });
  const buttonProps = omit(props, 'duration', 'visibilityHeight', 'target', 'onClick');
  const target = () => props.target?.() ?? window;
  const scrollTop = () => target() === window ? window.scrollY : (target() as HTMLElement).scrollTop;

  createEffect(
    () => target(),
    (scrollTarget) => {
      const update = () => setVisible(scrollTop() >= props.visibilityHeight);
      update();
      scrollTarget.addEventListener('scroll', update, { passive: true });
      return () => scrollTarget.removeEventListener('scroll', update);
    },
  );
  const back = (event: MouseEvent) => {
    props.onClick?.(event);
    const scrollTarget = target();
    scrollTarget.scrollTo({ top: 0, behavior: props.duration > 0 ? 'smooth' : 'auto' });
  };
  return <Show when={visible()}><div class="fixed bottom-6 right-6 z-[990]"><FloatButtonRoot {...buttonProps} icon={props.icon ?? <UpIcon />} aria-label={props['aria-label'] ?? 'Back to top'} onClick={back} /></div></Show>;
}

export const FloatButton = Object.assign(FloatButtonRoot, { Group: FloatButtonGroup, BackTop });
