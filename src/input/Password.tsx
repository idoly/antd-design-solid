import { createSignal, merge, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { InternalInput, type InputProps } from './Input';

export interface PasswordVisibilityToggle { tabIndex?: number; visible?: boolean; onVisibleChange?: (visible: boolean) => void }
export interface PasswordProps extends InputProps {
  action?: 'click' | 'hover';
  visibilityToggle?: boolean | PasswordVisibilityToggle;
  iconRender?: (visible: boolean) => JSX.Element;
}

export function Password(inputProps: PasswordProps) {
  const props = merge({ action: 'click' as const, visibilityToggle: true as PasswordProps['visibilityToggle'] }, inputProps);
  const config = () => typeof props.visibilityToggle === 'object' ? props.visibilityToggle : undefined;
  const [internalVisible, setInternalVisible] = createSignal(false, { ownedWrite: true });
  let visibleSnapshot = false;
  const visible = () => config()?.visible ?? (internalVisible(), visibleSnapshot);
  const setVisible = (next: boolean) => {
    visibleSnapshot = next;
    if (config()?.visible === undefined) setInternalVisible(next);
    config()?.onVisibleChange?.(next);
  };
  const others = omit(props, 'action', 'visibilityToggle', 'iconRender', 'type', 'suffix');
  const toggle = <button
    type="button"
    aria-label={visible() ? 'Hide password' : 'Show password'}
    aria-pressed={visible() ? 'true' : 'false'}
    tabindex={config()?.tabIndex ?? 0}
    class="mr-2 inline-flex size-6 items-center justify-center bg-transparent text-xs text-text-secondary"
    onPointerEnter={() => { if (props.action === 'hover') setVisible(true); }}
    onPointerLeave={() => { if (props.action === 'hover') setVisible(false); }}
    onClick={() => { if (props.action === 'click') setVisible(!visible()); }}
  >{props.iconRender?.(visible()) ?? (visible() ? 'hide' : 'show')}</button>;
  return <InternalInput {...others} type={visible() ? 'text' : 'password'} suffix={<>{props.suffix}{props.visibilityToggle !== false ? toggle : null}</>} />;
}
