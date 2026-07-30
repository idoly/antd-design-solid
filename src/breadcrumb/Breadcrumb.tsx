import { For, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { useConfig } from '../config-provider';

export type BreadcrumbSemanticName = 'root' | 'item' | 'separator';
export type BreadcrumbSemanticClassNames = Partial<Record<BreadcrumbSemanticName, string>>;
export type BreadcrumbSemanticStyles = Partial<Record<BreadcrumbSemanticName, JSX.CSSProperties>>;

export interface BreadcrumbItemType {
  key?: string | number;
  title: JSX.Element;
  href?: string;
  target?: string;
  class?: string;
  onClick?: JSX.EventHandler<HTMLAnchorElement, MouseEvent>;
}

export interface BreadcrumbProps extends Omit<JSX.HTMLAttributes<HTMLElement>, 'children'> {
  items?: readonly BreadcrumbItemType[];
  separator?: JSX.Element;
  itemRender?: (item: BreadcrumbItemType, index: number, items: readonly BreadcrumbItemType[]) => JSX.Element;
  params?: Record<string, string>;
  children?: JSX.Element;
  classNames?: BreadcrumbSemanticClassNames;
  styles?: BreadcrumbSemanticStyles;
}

export interface BreadcrumbItemProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  href?: string;
  target?: string;
}

export interface BreadcrumbSeparatorProps extends JSX.HTMLAttributes<HTMLLIElement> { }

export function BreadcrumbSeparator(props: BreadcrumbSeparatorProps) {
  const others = omit(props, 'children', 'class');
  return <li {...others} aria-hidden="true" class={['ads-breadcrumb-separator shrink-0 text-text-disabled', props.class]}>{props.children}</li>;
}

const replaceParams = (href: string, params?: Record<string, string>) => params
  ? Object.entries(params).reduce((path, [key, value]) => path.replace(`:${key}`, encodeURIComponent(value)), href)
  : href;

export function BreadcrumbItem(props: BreadcrumbItemProps) {
  const others = omit(props, 'href', 'target', 'children', 'class');
  return (
    <li class={['ads-breadcrumb-item inline-flex min-w-0 items-center gap-2', props.class]}>
      <Show when={props.href} fallback={<span {...others} class="truncate">{props.children}</span>}>
        <a href={props.href} target={props.target} class="truncate text-text-secondary hover:text-text"><span {...others}>{props.children}</span></a>
      </Show>
    </li>
  );
}

export function Breadcrumb(inputProps: BreadcrumbProps) {
  const config = useConfig();
  const props = merge({ separator: '/' as JSX.Element, items: [] as readonly BreadcrumbItemType[] }, config.componentDefaults('breadcrumb') as Partial<BreadcrumbProps>, inputProps);
  const others = omit(props, 'items', 'separator', 'itemRender', 'params', 'classNames', 'styles', 'children', 'class', 'style');
  return (
    <nav {...others} aria-label={props['aria-label'] ?? 'Breadcrumb'} class={['ads-breadcrumb text-sm text-text-secondary', props.class, props.classNames?.root]} style={{ ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}>
      <ol class="flex min-w-0 flex-wrap items-center gap-2">
        <For each={props.items}>{(item, index) => {
          const content = () => props.itemRender?.(item, index(), props.items) ?? item.title;
          const last = () => index() === props.items.length - 1;
          return (
            <>
              <li class={['inline-flex min-w-0 items-center', item.class, props.classNames?.item]} style={props.styles?.item} aria-current={last() ? 'page' : undefined}>
                <Show when={item.href && !last()} fallback={<span class={last() ? 'truncate text-text' : 'truncate'}>{content()}</span>}>
                  <a href={replaceParams(item.href!, props.params)} target={item.target} class="truncate hover:text-text" onClick={item.onClick}>{content()}</a>
                </Show>
              </li>
              <Show when={!last()}><li aria-hidden="true" class={['shrink-0 text-text-disabled', props.classNames?.separator]} style={props.styles?.separator}>{props.separator}</li></Show>
            </>
          );
        }}</For>
        {props.children}
      </ol>
    </nav>
  );
}
