import { arrow, autoUpdate, computePosition, flip, offset, shift, type Placement } from '@floating-ui/dom';
import { createEffect, createSignal, merge, omit, onCleanup, Show } from 'solid-js';
import { Portal } from '@solidjs/web';
import type { JSX } from '@solidjs/web';
import { DownIcon } from '../_internal/icons';
import { Button, type ButtonProps } from '../button';
import { tokenToCssVariables } from '../config-provider/theme';
import { useConfig } from '../config-provider';
import { Menu, type MenuInfo, type MenuProps } from '../menu';
import { SpaceCompact } from '../space';

export type DropdownSemanticName = 'root' | 'itemTitle' | 'item' | 'itemContent' | 'itemIcon';
export type DropdownSemanticClassNames = Partial<Record<DropdownSemanticName, string>>;
export type DropdownSemanticStyles = Partial<Record<DropdownSemanticName, JSX.CSSProperties>>;

export type DropdownPlacement = 'bottomLeft' | 'bottom' | 'bottomRight' | 'topLeft' | 'top' | 'topRight';

export interface DropdownProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'children'> {
  menu?: MenuProps;
  children: JSX.Element;
  trigger?: readonly ('click' | 'hover' | 'contextMenu')[];
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  placement?: DropdownPlacement;
  arrow?: boolean | { pointAtCenter?: boolean };
  autoAdjustOverflow?: boolean;
  destroyOnHidden?: boolean;
  dropdownRender?: (menu: JSX.Element) => JSX.Element;
  getPopupContainer?: (trigger: HTMLElement) => HTMLElement;
  overlayClass?: string;
  onOpenChange?: (open: boolean, info: { source: 'trigger' | 'menu' }) => void;
  classNames?: DropdownSemanticClassNames;
  styles?: DropdownSemanticStyles;
}

export interface DropdownButtonProps extends Omit<ButtonProps, 'onClick' | 'children'> {
  menu: MenuProps;
  children?: JSX.Element;
  placement?: DropdownPlacement;
  trigger?: DropdownProps['trigger'];
  open?: boolean;
  disabled?: boolean;
  onClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  onOpenChange?: DropdownProps['onOpenChange'];
}

const placementMap: Record<DropdownPlacement, Placement> = {
  bottomLeft: 'bottom-start',
  bottom: 'bottom',
  bottomRight: 'bottom-end',
  topLeft: 'top-start',
  top: 'top',
  topRight: 'top-end',
};

function DropdownRoot(inputProps: DropdownProps) {
  const config = useConfig();
  const props = merge({ trigger: ['hover'] as readonly ('click' | 'hover' | 'contextMenu')[], defaultOpen: false, placement: 'bottomLeft' as DropdownPlacement, autoAdjustOverflow: true }, config.componentDefaults('dropdown') as Partial<DropdownProps>, inputProps);
  const [internalOpen, setInternalOpen] = createSignal(Boolean(props.defaultOpen), { ownedWrite: true });
  let triggerRef: HTMLSpanElement | undefined;
  let popupRef: HTMLDivElement | undefined;
  let arrowRef: HTMLSpanElement | undefined;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;
  const others = omit(props, 'menu', 'children', 'trigger', 'open', 'defaultOpen', 'disabled', 'placement', 'arrow', 'autoAdjustOverflow', 'destroyOnHidden', 'dropdownRender', 'getPopupContainer', 'overlayClass', 'onOpenChange', 'classNames', 'styles', 'class');
  const isOpen = () => props.open ?? internalOpen();
  const hasTrigger = (trigger: 'click' | 'hover' | 'contextMenu') => props.trigger.includes(trigger);
  const setOpen = (next: boolean, source: 'trigger' | 'menu' = 'trigger') => {
    if (props.disabled || next === isOpen()) return;
    if (props.open === undefined) setInternalOpen(next);
    props.onOpenChange?.(next, { source });
  };
  const scheduleClose = () => {
    if (!hasTrigger('hover')) return;
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(() => setOpen(false), 100);
  };
  onCleanup(() => { if (closeTimer) clearTimeout(closeTimer); });

  createEffect(
    () => isOpen(),
    (open) => {
      if (!open) return;
      let cleanupPosition: (() => void) | undefined;
      let cancelled = false;
      const outside = (event: PointerEvent) => {
        const target = event.target as Node;
        if (!triggerRef?.contains(target) && !popupRef?.contains(target)) setOpen(false);
      };
      const escape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setOpen(false);
          triggerRef?.querySelector<HTMLElement>('button,a[href],[tabindex]')?.focus();
        }
      };
      document.addEventListener('pointerdown', outside);
      document.addEventListener('keydown', escape);
      queueMicrotask(() => {
        if (cancelled || !triggerRef || !popupRef) return;
        cleanupPosition = autoUpdate(triggerRef, popupRef, () => {
          if (!triggerRef || !popupRef) return;
          const middleware = [offset(props.arrow ? 10 : 4)];
          if (props.autoAdjustOverflow) middleware.push(flip({ padding: 8 }), shift({ padding: 8 }));
          if (props.arrow && arrowRef) middleware.push(arrow({ element: arrowRef, padding: 8 }));
          void computePosition(triggerRef, popupRef, { strategy: 'fixed', placement: placementMap[props.placement], middleware }).then(({ x, y, placement, middlewareData }) => {
            if (!popupRef) return;
            Object.assign(popupRef.style, { left: `${x}px`, top: `${y}px` });
            if (!arrowRef) return;
            const side = placement.split('-')[0];
            const staticSide = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' }[side];
            Object.assign(arrowRef.style, { left: middlewareData.arrow?.x === undefined ? '' : `${middlewareData.arrow.x}px`, top: middlewareData.arrow?.y === undefined ? '' : `${middlewareData.arrow.y}px`, right: '', bottom: '' });
            if (staticSide) arrowRef.style.setProperty(staticSide, '-4px');
          });
        });
      });
      return () => {
        cancelled = true;
        cleanupPosition?.();
        document.removeEventListener('pointerdown', outside);
        document.removeEventListener('keydown', escape);
      };
    },
  );

  const menuClick = (info: MenuInfo) => {
    props.menu?.onClick?.(info);
    setOpen(false, 'menu');
  };
  const menuNode = () => props.menu ? <Menu
    {...props.menu}
    class={['min-w-40 rounded-surface border border-border-secondary shadow-popup', props.menu.class]}
    classNames={(info) => ({
      ...(typeof props.menu?.classNames === 'function' ? props.menu.classNames(info) : props.menu?.classNames),
      item: props.classNames?.item ?? (typeof props.menu?.classNames === 'function' ? props.menu.classNames(info).item : props.menu?.classNames?.item),
      itemTitle: props.classNames?.itemTitle ?? (typeof props.menu?.classNames === 'function' ? props.menu.classNames(info).itemTitle : props.menu?.classNames?.itemTitle),
      itemContent: props.classNames?.itemContent ?? (typeof props.menu?.classNames === 'function' ? props.menu.classNames(info).itemContent : props.menu?.classNames?.itemContent),
      itemIcon: props.classNames?.itemIcon ?? (typeof props.menu?.classNames === 'function' ? props.menu.classNames(info).itemIcon : props.menu?.classNames?.itemIcon),
    })}
    styles={(info) => ({
      ...(typeof props.menu?.styles === 'function' ? props.menu.styles(info) : props.menu?.styles),
      item: props.styles?.item ?? (typeof props.menu?.styles === 'function' ? props.menu.styles(info).item : props.menu?.styles?.item),
      itemTitle: props.styles?.itemTitle ?? (typeof props.menu?.styles === 'function' ? props.menu.styles(info).itemTitle : props.menu?.styles?.itemTitle),
      itemContent: props.styles?.itemContent ?? (typeof props.menu?.styles === 'function' ? props.menu.styles(info).itemContent : props.menu?.styles?.itemContent),
      itemIcon: props.styles?.itemIcon ?? (typeof props.menu?.styles === 'function' ? props.menu.styles(info).itemIcon : props.menu?.styles?.itemIcon),
    })}
    onClick={menuClick}
  /> : null;
  const overlay = () => props.dropdownRender?.(menuNode()) ?? menuNode();

  return (
    <>
      <span
        {...others}
        ref={triggerRef}
        class={['ads-dropdown-trigger inline-flex min-w-0', props.class]}
        aria-haspopup="menu"
        onClick={() => { if (hasTrigger('click')) setOpen(!isOpen()); }}
        onPointerEnter={() => { if (closeTimer) clearTimeout(closeTimer); if (hasTrigger('hover')) setOpen(true); }}
        onPointerLeave={scheduleClose}
        onContextMenu={(event) => { if (hasTrigger('contextMenu')) { event.preventDefault(); setOpen(true); } }}
      >
        {props.children}
      </span>
      <Show when={isOpen()}>
        <Portal mount={triggerRef && props.getPopupContainer?.(triggerRef)}>
          <div
            ref={popupRef}
            class={['ads-root ads-dropdown ads-dropdown-theme', config.themeScopeClass(), 'fixed z-[1050]', props.overlayClass, props.classNames?.root]}
            style={{ ...tokenToCssVariables(config.theme()), 'font-family': 'var(--ads-font-family)', ...props.styles?.root }}
            onPointerEnter={() => { if (closeTimer) clearTimeout(closeTimer); }}
            onPointerLeave={scheduleClose}
          >
            {overlay()}
            <Show when={props.arrow}><span ref={arrowRef} aria-hidden="true" class="absolute size-2 rotate-45 border border-border-secondary bg-surface" /></Show>
          </div>
        </Portal>
      </Show>
    </>
  );
}

export function DropdownButton(inputProps: DropdownButtonProps) {
  const props = merge({ placement: 'bottomRight' as DropdownPlacement, trigger: ['click'] as const }, inputProps);
  const buttonProps = omit(props, 'menu', 'children', 'placement', 'trigger', 'open', 'onClick', 'onOpenChange');
  return (
    <SpaceCompact>
      <Button {...buttonProps} onClick={props.onClick}>{props.children}</Button>
      <Dropdown menu={props.menu} placement={props.placement} trigger={props.trigger} open={props.open} disabled={props.disabled} onOpenChange={props.onOpenChange}>
        <Button {...buttonProps} aria-label="Open menu" icon={<DownIcon />} />
      </Dropdown>
    </SpaceCompact>
  );
}

export const Dropdown = Object.assign(DropdownRoot, { Button: DropdownButton });
