import { merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { tv } from 'tailwind-variants';
import { useConfig } from '../config-provider';

const divider = tv({
  slots: {
    root: 'ads-divider flex min-w-0 items-center border-border-secondary text-sm text-text',
    line: 'border-border-secondary',
    label: 'shrink-0 px-4',
  },
  variants: {
    type: {
      horizontal: { root: 'my-4 w-full', line: 'min-w-0 flex-1 border-t' },
      vertical: { root: 'mx-2 inline-flex h-[0.9em] w-0 border-l align-middle' },
    },
    variant: {
      solid: { line: 'border-solid' },
      dashed: { line: 'border-dashed' },
      dotted: { line: 'border-dotted' },
    },
    orientation: {
      start: { line: 'first:max-w-[5%]' },
      center: {},
      end: { line: 'last:max-w-[5%]' },
    },
    plain: {
      true: { label: 'font-normal text-text-secondary' },
      false: { label: 'font-semibold' },
    },
  },
  defaultVariants: { type: 'horizontal', variant: 'solid', orientation: 'center', plain: false },
});

export type DividerSemanticName = 'root' | 'rail' | 'content';
export type DividerSemanticClassNames = Partial<Record<DividerSemanticName, string>>;
export type DividerSemanticStyles = Partial<Record<DividerSemanticName, JSX.CSSProperties>>;

export interface DividerProps extends JSX.HTMLAttributes<HTMLDivElement> {
  type?: 'horizontal' | 'vertical';
  orientation?: 'start' | 'center' | 'end';
  variant?: 'solid' | 'dashed' | 'dotted';
  dashed?: boolean;
  plain?: boolean;
  children?: JSX.Element;
  classNames?: DividerSemanticClassNames;
  styles?: DividerSemanticStyles;
}

export function Divider(inputProps: DividerProps) {
  const config = useConfig();
  const props = merge({ type: 'horizontal' as const, orientation: 'center' as const, variant: 'solid' as const, plain: false }, config.componentDefaults('divider') as Partial<DividerProps>, inputProps);
  const others = omit(props, 'type', 'orientation', 'variant', 'dashed', 'plain', 'children', 'classNames', 'styles', 'class', 'style');
  const styles = () => divider({
    type: props.type,
    orientation: props.orientation,
    variant: props.dashed ? 'dashed' : props.variant,
    plain: props.plain,
  });

  return (
    <div
      {...others}
      role="separator"
      aria-orientation={props.type}
      class={styles().root({ class: [props.class as string | undefined, props.classNames?.root] })}
      style={{ ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}
    >
      <Show when={props.type === 'horizontal'}>
        <span class={styles().line({ class: props.classNames?.rail })} style={props.styles?.rail} />
        <Show when={props.children}><span class={styles().label({ class: props.classNames?.content })} style={props.styles?.content}>{props.children}</span></Show>
        <span class={styles().line({ class: props.classNames?.rail })} style={props.styles?.rail} />
      </Show>
    </div>
  );
}
