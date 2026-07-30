import { createContext, createEffect, createSignal, For, merge, omit, Show, useContext } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { Affix } from '../affix';
import { useConfig } from '../config-provider';

export type AnchorSemanticName = 'root' | 'item' | 'itemTitle' | 'indicator';
export type AnchorSemanticClassNames = Partial<Record<AnchorSemanticName, string>>;
export type AnchorSemanticStyles = Partial<Record<AnchorSemanticName, JSX.CSSProperties>>;

export interface AnchorLinkItem {
  key?: string | number;
  href: string;
  title: JSX.Element;
  target?: string;
  children?: readonly AnchorLinkItem[];
  class?: string;
  replace?: boolean;
  targetOffset?: number;
}

export interface AnchorLinkProps extends Omit<JSX.HTMLAttributes<HTMLLIElement>, 'title'> {
  href: string;
  title: JSX.Element;
  target?: string;
  replace?: boolean;
  targetOffset?: number;
  children?: JSX.Element;
}

export interface AnchorProps extends Omit<JSX.HTMLAttributes<HTMLElement>, 'onChange' | 'onClick'> {
  items?: readonly AnchorLinkItem[];
  children?: JSX.Element;
  affix?: boolean;
  bounds?: number;
  offsetTop?: number;
  target?: () => Window | HTMLElement | null;
  direction?: 'vertical' | 'horizontal';
  currentAnchor?: string;
  replace?: boolean;
  getCurrentAnchor?: (activeLink: string) => string;
  onChange?: (currentActiveLink: string) => void;
  onClick?: (event: MouseEvent, link: AnchorLinkItem) => void;
  classNames?: AnchorSemanticClassNames;
  styles?: AnchorSemanticStyles;
}

interface AnchorContextValue {
  current: () => string;
  click: (event: MouseEvent, item: AnchorLinkItem) => void;
  classNames?: AnchorSemanticClassNames;
  styles?: AnchorSemanticStyles;
}
const AnchorContext = createContext<AnchorContextValue | null>(null);
const flatten = (items: readonly AnchorLinkItem[]): AnchorLinkItem[] => items.flatMap((item) => [item, ...flatten(item.children ?? [])]);

export function AnchorLink(props: AnchorLinkProps) {
  const context = useContext(AnchorContext);
  const item = (): AnchorLinkItem => ({ href: props.href, title: props.title, target: props.target, replace: props.replace, targetOffset: props.targetOffset });
  const others = omit(props, 'href', 'title', 'target', 'replace', 'targetOffset', 'children', 'class');
  return <li {...others} class={['relative', props.class, context?.classNames?.item]} style={context?.styles?.item}>
    <a href={props.href} target={props.target} aria-current={context?.current() === props.href ? 'location' : undefined} class={['block min-w-0 truncate border-l-2 py-1.5 pr-2 pl-3 text-sm transition-colors', context?.current() === props.href ? 'border-primary text-primary' : 'border-border-secondary text-text-secondary hover:text-text', context?.classNames?.itemTitle]} style={context?.styles?.itemTitle} onClick={(event) => context?.click(event, item())}>{props.title}<Show when={context?.current() === props.href}><span aria-hidden="true" class={['absolute inset-y-0 left-0 w-0.5 bg-primary', context?.classNames?.indicator]} style={context?.styles?.indicator} /></Show></a>
    <Show when={props.children}><ul>{props.children}</ul></Show>
  </li>;
}

export function Anchor(inputProps: AnchorProps) {
  const config = useConfig();
  const props = merge({ items: [] as readonly AnchorLinkItem[], affix: true, bounds: 5, offsetTop: 0, direction: 'vertical' as const, replace: false }, config.componentDefaults('anchor') as Partial<AnchorProps>, inputProps);
  const [internalCurrent, setInternalCurrent] = createSignal('');
  let currentValue = '';
  const others = omit(props, 'items', 'children', 'affix', 'bounds', 'offsetTop', 'target', 'direction', 'currentAnchor', 'replace', 'getCurrentAnchor', 'onChange', 'onClick', 'classNames', 'styles', 'class', 'style');
  const current = () => props.currentAnchor ?? internalCurrent();
  const setCurrent = (next: string) => {
    const resolved = props.getCurrentAnchor?.(next) ?? next;
    if (resolved === currentValue) return;
    currentValue = resolved;
    if (props.currentAnchor === undefined) setInternalCurrent(resolved);
    props.onChange?.(resolved);
  };

  createEffect(
    () => [props.items, props.target?.(), props.offsetTop, props.bounds] as const,
    ([items, configuredTarget, offsetTop, bounds]) => {
      const target = configuredTarget ?? window;
      const update = () => {
        let active = '';
        const targetTop = target === window ? 0 : (target as HTMLElement).getBoundingClientRect().top;
        for (const item of flatten(items)) {
          if (!item.href.startsWith('#')) continue;
          const element = document.getElementById(decodeURIComponent(item.href.slice(1)));
          if (!element) continue;
          if (element.getBoundingClientRect().top - targetTop <= offsetTop + bounds) active = item.href;
        }
        setCurrent(active);
      };
      update();
      target.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update, { passive: true });
      return () => {
        target.removeEventListener('scroll', update);
        window.removeEventListener('resize', update);
      };
    },
  );

  const click = (event: MouseEvent, item: AnchorLinkItem) => {
    props.onClick?.(event, item);
    if (event.defaultPrevented || !item.href.startsWith('#')) return;
    event.preventDefault();
    const element = document.getElementById(decodeURIComponent(item.href.slice(1)));
    if (element) {
      const target = props.target?.() ?? window;
      const scrollOffset = target === window ? window.scrollY : (target as HTMLElement).scrollTop - (target as HTMLElement).getBoundingClientRect().top;
      const top = element.getBoundingClientRect().top + scrollOffset - (item.targetOffset ?? props.offsetTop);
      target.scrollTo({ top, behavior: 'smooth' });
    }
    if (item.replace ?? props.replace) history.replaceState(null, '', item.href);
    else history.pushState(null, '', item.href);
    setCurrent(item.href);
  };
  const renderLinks = (items: readonly AnchorLinkItem[], level = 0): JSX.Element => (
    <For each={items}>{(item) => (
      <li class={['relative', item.class, props.classNames?.item]} style={props.styles?.item}>
        <a
          href={item.href}
          target={item.target}
          aria-current={current() === item.href ? 'location' : undefined}
          class={[
            'block min-w-0 truncate border-l-2 py-1.5 pr-2 text-sm transition-colors',
            current() === item.href ? 'border-primary text-primary' : 'border-border-secondary text-text-secondary hover:text-text',
            props.classNames?.itemTitle,
          ]}
          style={{ 'padding-left': `${12 + level * 16}px`, ...props.styles?.itemTitle }}
          onClick={(event) => click(event, item)}
        >
          {item.title}
          <Show when={current() === item.href}><span aria-hidden="true" class={['absolute inset-y-0 left-0 w-0.5 bg-primary', props.classNames?.indicator]} style={props.styles?.indicator} /></Show>
        </a>
        <Show when={item.children?.length}><ul>{renderLinks(item.children ?? [], level + 1)}</ul></Show>
      </li>
    )}</For>
  );
  const content = () => (
    <nav {...others} aria-label={props['aria-label'] ?? 'On this page'} class={['ads-anchor', props.direction === 'horizontal' ? 'overflow-x-auto' : '', props.class, props.classNames?.root]} style={{ ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}>
      <AnchorContext value={{ current, click, classNames: props.classNames, styles: props.styles }}><ul class={props.direction === 'horizontal' ? 'flex min-w-max [&>li>a]:border-b-2 [&>li>a]:border-l-0 [&>li>a]:px-3' : ''}>{renderLinks(props.items)}{props.children}</ul></AnchorContext>
    </nav>
  );

  return props.affix ? <Affix offsetTop={props.offsetTop} target={props.target}>{content()}</Affix> : content();
}
