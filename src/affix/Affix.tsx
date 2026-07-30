import { createEffect, createSignal, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import type { AffixRef } from '../compat-types';

export interface AffixProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange' | 'style' | 'ref'> {
  offsetTop?: number;
  offsetBottom?: number;
  target?: () => Window | HTMLElement | null;
  onChange?: (affixed?: boolean) => void;
  style?: JSX.CSSProperties;
  ref?: (instance: AffixRef) => void;
}

export function Affix(props: AffixProps) {
  let placeholderRef: HTMLDivElement | undefined;
  let contentRef: HTMLDivElement | undefined;
  const [affixed, setAffixed] = createSignal(false, { ownedWrite: true });
  const [fixedStyle, setFixedStyle] = createSignal<JSX.CSSProperties>({}, { ownedWrite: true });
  const [placeholderStyle, setPlaceholderStyle] = createSignal<JSX.CSSProperties>({}, { ownedWrite: true });
  let currentAffixed = false;
  let updatePosition = () => {};
  props.ref?.({ updatePosition: () => updatePosition() });
  const others = omit(props, 'offsetTop', 'offsetBottom', 'target', 'onChange', 'style', 'children', 'class', 'ref');

  createEffect(
    () => [props.offsetTop, props.offsetBottom, props.target?.()] as const,
    ([offsetTop, offsetBottom, configuredTarget]) => {
      const target = configuredTarget ?? window;
      const update = () => {
        if (!placeholderRef || !contentRef) return;
        const rect = placeholderRef.getBoundingClientRect();
        const isWindow = target === window;
        const targetRect = isWindow
          ? { top: 0, bottom: window.innerHeight }
          : (target as HTMLElement).getBoundingClientRect();
        const useBottom = offsetTop === undefined && offsetBottom !== undefined;
        const next = useBottom
          ? rect.bottom > targetRect.bottom - (offsetBottom ?? 0)
          : rect.top < targetRect.top + (offsetTop ?? 0);
        if (next) {
          const contentRect = contentRef.getBoundingClientRect();
          setPlaceholderStyle({ width: `${rect.width}px`, height: `${contentRect.height}px` });
          setFixedStyle(useBottom
            ? { position: 'fixed', bottom: `${isWindow ? offsetBottom ?? 0 : window.innerHeight - targetRect.bottom + (offsetBottom ?? 0)}px`, left: `${rect.left}px`, width: `${rect.width}px`, 'z-index': 10 }
            : { position: 'fixed', top: `${targetRect.top + (offsetTop ?? 0)}px`, left: `${rect.left}px`, width: `${rect.width}px`, 'z-index': 10 });
        } else {
          setPlaceholderStyle({});
          setFixedStyle({});
        }
        if (next !== currentAffixed) {
          currentAffixed = next;
          setAffixed(next);
          props.onChange?.(next);
        }
      };
      updatePosition = update;
      update();
      target.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update, { passive: true });
      return () => {
        target.removeEventListener('scroll', update);
        window.removeEventListener('resize', update);
      };
    },
  );

  return (
    <div {...others} ref={placeholderRef} class={['ads-affix-placeholder', props.class]} style={placeholderStyle()} data-affixed={affixed() ? 'true' : 'false'}>
      <div ref={contentRef} class="ads-affix" style={{ ...fixedStyle(), ...props.style }}>{props.children}</div>
    </div>
  );
}
