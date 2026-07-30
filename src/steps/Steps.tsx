import { For, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { tv } from 'tailwind-variants';
import { CheckIcon, CloseIcon } from '../_internal/icons';
import { useConfig } from '../config-provider';

export type StepStatus = 'wait' | 'process' | 'finish' | 'error';
export type StepsSemanticName = 'root' | 'item' | 'itemWrapper' | 'itemIcon' | 'itemHeader' | 'itemTitle' | 'itemSubtitle' | 'itemSection' | 'itemContent' | 'itemRail';
export type StepsSemanticClassNames = Partial<Record<StepsSemanticName, string>>;
export type StepsSemanticStyles = Partial<Record<StepsSemanticName, JSX.CSSProperties>>;

export interface StepItem {
  key?: string | number;
  title: JSX.Element;
  subTitle?: JSX.Element;
  description?: JSX.Element;
  icon?: JSX.Element;
  status?: StepStatus;
  disabled?: boolean;
  class?: string;
}

export interface StepsProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: readonly StepItem[];
  current?: number;
  initial?: number;
  direction?: 'horizontal' | 'vertical';
  labelPlacement?: 'horizontal' | 'vertical';
  percent?: number;
  progressDot?: boolean | ((dot: JSX.Element, info: { index: number; status: StepStatus; title: JSX.Element; description?: JSX.Element }) => JSX.Element);
  responsive?: boolean;
  size?: 'small' | 'default';
  status?: StepStatus;
  type?: 'default' | 'navigation' | 'inline';
  onChange?: (current: number) => void;
  classNames?: StepsSemanticClassNames;
  styles?: StepsSemanticStyles;
}

const steps = tv({
  slots: {
    root: 'ads-steps flex min-w-0 text-sm text-text',
    item: 'relative flex min-w-0 flex-1',
    icon: 'relative z-10 inline-flex size-8 shrink-0 items-center justify-center rounded-full border bg-surface text-sm transition-colors',
    tail: 'absolute bg-border-secondary',
    content: 'min-w-0',
    title: 'font-semibold leading-8',
  },
  variants: {
    direction: {
      horizontal: { root: 'flex-row', item: 'items-start', tail: 'left-4 right-[-50%] top-4 h-px', content: 'ml-3 pr-4' },
      vertical: { root: 'flex-col', item: 'min-h-20', tail: 'bottom-0 left-4 top-8 w-px', content: 'ml-3 pb-6' },
    },
    status: {
      wait: { icon: 'border-border text-text-disabled', title: 'text-text-secondary' },
      process: { icon: 'border-primary bg-primary text-white', title: 'text-text' },
      finish: { icon: 'border-primary text-primary', title: 'text-text' },
      error: { icon: 'border-error text-error', title: 'text-error' },
    },
    size: {
      small: { icon: 'size-6 text-xs', title: 'leading-6' },
      default: {},
    },
    labelPlacement: {
      vertical: { item: 'flex-col items-center text-center', content: 'ml-0 mt-2 px-2', tail: 'left-[50%] right-[-50%]' },
      horizontal: {},
    },
    type: {
      default: {},
      navigation: { root: 'border-b border-border-secondary', item: 'cursor-pointer px-4 py-3 hover:bg-surface-container', icon: 'size-6', tail: 'hidden', content: 'ml-2' },
      inline: { root: 'gap-2', item: 'flex-none items-center rounded-control px-2 py-1 hover:bg-surface-container', icon: 'size-2 border-0', tail: 'hidden', content: 'ml-2', title: 'text-xs font-normal leading-5' },
    },
  },
  defaultVariants: { direction: 'horizontal', status: 'wait', size: 'default', labelPlacement: 'horizontal', type: 'default' },
});

export function Steps(inputProps: StepsProps) {
  const config = useConfig();
  const props = merge({ current: 0, initial: 0, direction: 'horizontal' as const, labelPlacement: 'horizontal' as const, size: 'default' as const, status: 'process' as StepStatus, type: 'default' as const }, config.componentDefaults('steps') as Partial<StepsProps>, inputProps);
  const others = omit(props, 'items', 'current', 'initial', 'direction', 'labelPlacement', 'percent', 'progressDot', 'responsive', 'size', 'status', 'type', 'onChange', 'classNames', 'styles', 'class', 'style');
  const itemStatus = (item: StepItem, index: number): StepStatus => item.status ?? (index < props.current ? 'finish' : index === props.current ? props.status : 'wait');
  const styles = () => steps({ direction: props.direction, size: props.size, labelPlacement: props.labelPlacement, type: props.type });
  const select = (item: StepItem, index: number) => {
    if (!item.disabled && props.onChange) props.onChange(index);
  };

  return (
    <div {...others} class={styles().root({ class: [props.class as string | undefined, props.classNames?.root] })} style={{ ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }} role="list">
      <For each={props.items}>{(item, index) => {
        const status = () => itemStatus(item, index());
        const dot = () => <span class="size-2 rounded-full bg-current" />;
        const icon = () => {
          const progressDot = props.progressDot;
          if (progressDot) return typeof progressDot === 'function' ? progressDot(dot(), { index: index(), status: status(), title: item.title, description: item.description }) : dot();
          return item.icon ?? (status() === 'finish' ? <CheckIcon aria-label="Finished" /> : status() === 'error' ? <CloseIcon aria-label="Error" /> : index() + props.initial + 1);
        };
        const itemStyles = () => steps({ direction: props.direction, status: status(), size: props.size, labelPlacement: props.labelPlacement, type: props.type });
        return (
          <div
            role="listitem"
            aria-current={status() === 'process' ? 'step' : undefined}
            aria-disabled={item.disabled ? 'true' : undefined}
            tabindex={props.onChange && !item.disabled ? 0 : undefined}
            class={itemStyles().item({ class: [props.onChange && !item.disabled ? 'cursor-pointer' : '', item.disabled ? 'cursor-not-allowed opacity-50' : '', item.class, props.classNames?.item] })}
            style={props.styles?.item}
            onClick={() => select(item, index())}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                select(item, index());
              }
            }}
          >
            <div class={['contents', props.classNames?.itemWrapper]} style={props.styles?.itemWrapper}>
            <Show when={index() < props.items.length - 1}><span aria-hidden="true" class={itemStyles().tail({ class: props.classNames?.itemRail })} style={props.styles?.itemRail} /></Show>
            <span class={itemStyles().icon({ class: props.classNames?.itemIcon })} style={props.styles?.itemIcon}>
              {icon()}
              <Show when={status() === 'process' && props.percent !== undefined && !props.progressDot}>
                <span class="absolute -inset-1 rounded-full border border-primary" style={{ 'clip-path': `inset(${100 - Math.min(100, Math.max(0, props.percent ?? 0))}% 0 0 0)` }} />
              </Show>
            </span>
            <div class={itemStyles().content({ class: props.classNames?.itemSection })} style={props.styles?.itemSection}>
              <div class={props.classNames?.itemHeader} style={props.styles?.itemHeader}><div class={itemStyles().title({ class: props.classNames?.itemTitle })} style={props.styles?.itemTitle}>{item.title}<Show when={item.subTitle}><span class={['ml-2 font-normal text-text-secondary', props.classNames?.itemSubtitle]} style={props.styles?.itemSubtitle}>{item.subTitle}</span></Show></div></div>
              <Show when={item.description && props.type !== 'inline'}><div class={['mt-1 text-sm leading-[22px] text-text-secondary', props.classNames?.itemContent]} style={props.styles?.itemContent}>{item.description}</div></Show>
            </div>
            </div>
          </div>
        );
      }}</For>
    </div>
  );
}
