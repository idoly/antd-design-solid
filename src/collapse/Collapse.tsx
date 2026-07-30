import { createEffect, createSignal, createUniqueId, For, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';

export type CollapseKey = string | number;
export type CollapseSemanticName = 'root' | 'header' | 'icon' | 'title' | 'body';
export type CollapseSemanticClassNames = Partial<Record<CollapseSemanticName, string>>;
export type CollapseSemanticStyles = Partial<Record<CollapseSemanticName, JSX.CSSProperties>>;

export interface CollapseItemType {
  key: CollapseKey;
  label: JSX.Element;
  children?: JSX.Element;
  extra?: JSX.Element;
  showArrow?: boolean;
  collapsible?: 'header' | 'icon' | 'disabled';
  forceRender?: boolean;
  class?: string;
  headerClass?: string;
}

export interface CollapseProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items?: readonly CollapseItemType[];
  activeKey?: CollapseKey | readonly CollapseKey[];
  defaultActiveKey?: CollapseKey | readonly CollapseKey[];
  accordion?: boolean;
  bordered?: boolean;
  ghost?: boolean;
  size?: 'small' | 'middle' | 'large';
  expandIcon?: (panel: { isActive: boolean }) => JSX.Element;
  expandIconPosition?: 'start' | 'end';
  destroyOnHidden?: boolean;
  onChange?: (key: CollapseKey | CollapseKey[] | undefined) => void;
  classNames?: CollapseSemanticClassNames;
  styles?: CollapseSemanticStyles;
}

export interface CollapsePanelProps extends JSX.HTMLAttributes<HTMLDivElement> {
  header: JSX.Element;
  itemKey?: CollapseKey;
  extra?: JSX.Element;
  showArrow?: boolean;
  collapsible?: CollapseItemType['collapsible'];
  forceRender?: boolean;
}

const toKeys = (value?: CollapseKey | readonly CollapseKey[]): CollapseKey[] => value === undefined ? [] : Array.isArray(value) ? [...value] : [value as CollapseKey];

export function CollapsePanel(props: CollapsePanelProps) {
  const others = omit(props, 'header', 'itemKey', 'extra', 'showArrow', 'collapsible', 'forceRender', 'children', 'class');
  return <div {...others} class={['ads-collapse-panel', props.class]}><div class="font-semibold">{props.header}</div><div>{props.children}</div></div>;
}

export function Collapse(inputProps: CollapseProps) {
  const props = merge({ items: [] as readonly CollapseItemType[], bordered: true, ghost: false, size: 'middle' as const, expandIconPosition: 'start' as const }, inputProps);
  const [internalKeys, setInternalKeys] = createSignal<CollapseKey[]>(toKeys(props.defaultActiveKey), { ownedWrite: true });
  const [visitedKeys, setVisitedKeys] = createSignal<readonly CollapseKey[]>(toKeys(props.defaultActiveKey), { ownedWrite: true });
  let visited = toKeys(props.defaultActiveKey);
  const uid = createUniqueId();
  const others = omit(props, 'items', 'activeKey', 'defaultActiveKey', 'accordion', 'bordered', 'ghost', 'size', 'expandIcon', 'expandIconPosition', 'destroyOnHidden', 'onChange', 'classNames', 'styles', 'class', 'style');
  const keys = () => props.activeKey === undefined ? internalKeys() : toKeys(props.activeKey);
  const active = (key: CollapseKey) => keys().includes(key);
  const padding = () => props.size === 'small' ? 'px-3 py-2' : props.size === 'large' ? 'px-5 py-4' : 'px-4 py-3';
  createEffect(
    () => keys(),
    (activeKeys) => {
      const next = [...new Set([...visited, ...activeKeys])];
      if (next.length !== visited.length) {
        visited = next;
        setVisitedKeys(next);
      }
    },
  );
  const change = (item: CollapseItemType) => {
    if (item.collapsible === 'disabled') return;
    const isActive = active(item.key);
    const next = props.accordion ? (isActive ? [] : [item.key]) : isActive ? keys().filter((key) => key !== item.key) : [...keys(), item.key];
    if (props.activeKey === undefined) setInternalKeys(next);
    props.onChange?.(props.accordion ? next[0] as CollapseKey : next);
  };
  const icon = (isActive: boolean) => props.expandIcon?.({ isActive }) ?? <span aria-hidden="true" class={['inline-flex text-xs transition-transform', isActive ? 'rotate-90' : '']}> &gt; </span>;

  return (
    <div {...others} class={[
      'ads-collapse overflow-hidden text-sm text-text',
      props.bordered && !props.ghost ? 'rounded-surface border border-border-secondary bg-surface' : '',
      props.ghost ? 'bg-transparent' : '',
      props.class,
      props.classNames?.root,
    ]} style={{ ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}>
      <For each={props.items}>{(item, index) => {
        const isActive = () => active(item.key);
        const panelId = `${uid}-panel-${String(item.key)}`;
        const headerId = `${uid}-header-${String(item.key)}`;
        const canHeaderClick = () => item.collapsible !== 'icon' && item.collapsible !== 'disabled';
        return (
          <div class={['ads-collapse-item', index() > 0 && props.bordered && !props.ghost ? 'border-t border-border-secondary' : '', item.class]}>
            <div class={['flex min-h-10 items-center gap-3 bg-surface-container', padding(), item.headerClass, props.classNames?.header]} style={props.styles?.header}>
              <Show when={item.showArrow !== false && props.expandIconPosition === 'start'}>
                <button type="button" aria-label={isActive() ? 'Collapse panel' : 'Expand panel'} disabled={item.collapsible === 'disabled'} class={['inline-flex size-5 shrink-0 items-center justify-center bg-transparent text-text-secondary disabled:text-text-disabled', props.classNames?.icon]} style={props.styles?.icon} onClick={(event) => { event.stopPropagation(); change(item); }}>{icon(isActive())}</button>
              </Show>
              <button
                type="button"
                id={headerId}
                aria-expanded={isActive() ? 'true' : 'false'}
                aria-controls={panelId}
                disabled={!canHeaderClick()}
                class={['min-w-0 flex-1 bg-transparent text-left font-semibold text-text disabled:cursor-default disabled:text-text-disabled', props.classNames?.title]}
                style={props.styles?.title}
                onClick={() => change(item)}
              >
                {item.label}
              </button>
              <Show when={item.extra}><div class="shrink-0" onClick={(event) => event.stopPropagation()}>{item.extra}</div></Show>
              <Show when={item.showArrow !== false && props.expandIconPosition === 'end'}>
                <button type="button" aria-label={isActive() ? 'Collapse panel' : 'Expand panel'} disabled={item.collapsible === 'disabled'} class={['inline-flex size-5 shrink-0 items-center justify-center bg-transparent text-text-secondary disabled:text-text-disabled', props.classNames?.icon]} style={props.styles?.icon} onClick={() => change(item)}>{icon(isActive())}</button>
              </Show>
            </div>
            <Show when={isActive() || (!props.destroyOnHidden && (item.forceRender || visitedKeys().includes(item.key)))}>
              <div id={panelId} role="region" aria-labelledby={headerId} hidden={!isActive()} class={['bg-surface', padding(), props.classNames?.body]} style={props.styles?.body}>{item.children}</div>
            </Show>
          </div>
        );
      }}</For>
    </div>
  );
}

Collapse.Panel = CollapsePanel;
