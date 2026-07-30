import { For, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { useConfig } from '../config-provider';

export type SkeletonSemanticName = 'root' | 'header' | 'section' | 'avatar' | 'title' | 'paragraph';
export type SkeletonSemanticClassNames = Partial<Record<SkeletonSemanticName, string>>;
export type SkeletonSemanticStyles = Partial<Record<SkeletonSemanticName, JSX.CSSProperties>>;

export interface SkeletonAvatarProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  active?: boolean;
  shape?: 'circle' | 'square';
  size?: 'small' | 'default' | 'large' | number;
}

export interface SkeletonTitleProps {
  width?: number | string;
}

export interface SkeletonParagraphProps {
  rows?: number;
  width?: number | string | readonly (number | string)[];
}

export interface SkeletonProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title'> {
  active?: boolean;
  loading?: boolean;
  avatar?: boolean | SkeletonAvatarProps;
  title?: boolean | SkeletonTitleProps;
  paragraph?: boolean | SkeletonParagraphProps;
  round?: boolean;
  classNames?: SkeletonSemanticClassNames;
  styles?: SkeletonSemanticStyles;
}

export interface SkeletonElementProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  active?: boolean;
  block?: boolean;
  size?: 'small' | 'default' | 'large';
  shape?: 'default' | 'round' | 'circle' | 'square';
}

const widthValue = (value: number | string | undefined): string | undefined => typeof value === 'number' ? `${value}px` : value;
const activeClass = (active?: boolean) => active ? 'animate-pulse' : '';

export function SkeletonAvatar(inputProps: SkeletonAvatarProps) {
  const props = merge({ shape: 'circle' as const, size: 'default' as const }, inputProps);
  const others = omit(props, 'active', 'shape', 'size', 'class', 'style');
  const numeric = () => typeof props.size === 'number' ? props.size : props.size === 'small' ? 24 : props.size === 'large' ? 40 : 32;
  return <span {...others} aria-hidden="true" class={['ads-skeleton-avatar inline-block shrink-0 bg-border-secondary', props.shape === 'circle' ? 'rounded-full' : 'rounded-surface', activeClass(props.active), props.class]} style={{ width: `${numeric()}px`, height: `${numeric()}px`, ...props.style as JSX.CSSProperties }} />;
}

export function SkeletonElement(inputProps: SkeletonElementProps) {
  const props = merge({ size: 'default' as const, shape: 'default' as const }, inputProps);
  const others = omit(props, 'active', 'block', 'size', 'shape', 'class', 'style');
  const height = () => props.size === 'small' ? '24px' : props.size === 'large' ? '40px' : '32px';
  const width = () => props.shape === 'circle' || props.shape === 'square' ? height() : props.block ? '100%' : props.size === 'small' ? '64px' : props.size === 'large' ? '96px' : '80px';
  return <span {...others} aria-hidden="true" class={['ads-skeleton-element inline-block bg-border-secondary', props.shape === 'circle' ? 'rounded-full' : props.shape === 'round' ? 'rounded-full' : 'rounded-control', activeClass(props.active), props.class]} style={{ width: width(), height: height(), 'border-radius': props.shape === 'circle' || props.shape === 'round' ? undefined : 'var(--ads-skeleton-block-radius, var(--ads-radius-control))', ...props.style as JSX.CSSProperties }} />;
}

export function SkeletonImage(inputProps: SkeletonElementProps) {
  const props = merge({ size: 'large' as const }, inputProps);
  const others = omit(props, 'active', 'block', 'size', 'shape', 'class', 'style');
  const dimension = () => props.size === 'small' ? '64px' : props.size === 'large' ? '96px' : '80px';
  return <span {...others} aria-hidden="true" class={['ads-skeleton-image inline-block rounded-surface bg-border-secondary', activeClass(props.active), props.class]} style={{ width: props.block ? '100%' : dimension(), height: dimension(), ...props.style as JSX.CSSProperties }} />;
}

export function SkeletonNode(inputProps: SkeletonElementProps) {
  const props = merge({}, inputProps);
  const others = omit(props, 'active', 'block', 'size', 'shape', 'class', 'children');
  return <span {...others} aria-hidden="true" class={['ads-skeleton-node inline-flex min-h-24 min-w-24 items-center justify-center rounded-surface bg-border-secondary text-text-disabled', activeClass(props.active), props.class]}>{props.children}</span>;
}

function SkeletonRoot(inputProps: SkeletonProps) {
  const config = useConfig();
  const props = merge({ loading: true, title: true as boolean | SkeletonTitleProps, paragraph: true as boolean | SkeletonParagraphProps }, config.componentDefaults('skeleton') as Partial<SkeletonProps>, inputProps);
  const others = omit(props, 'active', 'loading', 'avatar', 'title', 'paragraph', 'round', 'classNames', 'styles', 'children', 'class', 'style');
  const avatarProps = () => typeof props.avatar === 'object' ? props.avatar : {};
  const titleProps = () => typeof props.title === 'object' ? props.title : {};
  const paragraphProps = () => typeof props.paragraph === 'object' ? props.paragraph : {};
  const rows = () => paragraphProps().rows ?? 3;
  const boneTokenStyle = (): JSX.CSSProperties => ({
    'border-radius': props.round ? '9999px' : 'var(--ads-skeleton-block-radius, var(--ads-radius-small))',
    'background-image': props.active ? 'linear-gradient(90deg, var(--ads-skeleton-gradient-from-color, transparent), var(--ads-skeleton-gradient-to-color, rgba(255,255,255,.35)), var(--ads-skeleton-gradient-from-color, transparent))' : undefined,
    'background-size': props.active ? '200% 100%' : undefined,
  });
  const rowWidth = (index: number): string => {
    const width = paragraphProps().width;
    const value = Array.isArray(width) ? width[index] : width;
    if (value !== undefined) return widthValue(value)!;
    return index === rows() - 1 ? '61%' : '100%';
  };

  return (
    <Show when={props.loading} fallback={props.children}>
      <div {...others} class={['ads-skeleton flex min-w-0 gap-4', activeClass(props.active), props.class, props.classNames?.root]} style={{ ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }} aria-hidden="true">
        <Show when={props.avatar}><div class={props.classNames?.header} style={props.styles?.header}><SkeletonAvatar {...avatarProps()} active={props.active} class={[avatarProps().class, props.classNames?.avatar]} style={{ ...(avatarProps().style as JSX.CSSProperties), ...props.styles?.avatar }} /></div></Show>
        <div class={['min-w-0 flex-1', props.classNames?.section]} style={props.styles?.section}>
          <Show when={props.title}>
            <div class={['mb-4 h-4 bg-border-secondary', props.round ? 'rounded-full' : 'rounded-small', props.classNames?.title]} style={{ width: widthValue(titleProps().width) ?? (props.avatar ? '40%' : '38%'), height: 'var(--ads-skeleton-title-height, 16px)', 'margin-bottom': 0, ...boneTokenStyle(), ...props.styles?.title }} />
          </Show>
          <Show when={props.paragraph}>
            <div class={['space-y-3', props.classNames?.paragraph]} style={{ 'margin-top': props.title ? 'var(--ads-skeleton-paragraph-margin-top, 16px)' : undefined, ...props.styles?.paragraph }}>
              <For each={Array.from({ length: rows() })}>{(_, index) => <div class={['h-3 bg-border-secondary', props.round ? 'rounded-full' : 'rounded-small']} style={{ width: rowWidth(index()), height: 'var(--ads-skeleton-paragraph-li-height, 12px)', ...boneTokenStyle() }} />}</For>
            </div>
          </Show>
        </div>
      </div>
    </Show>
  );
}

export const Skeleton = Object.assign(SkeletonRoot, {
  Avatar: SkeletonAvatar,
  Button: SkeletonElement,
  Input: SkeletonElement,
  Image: SkeletonImage,
  Node: SkeletonNode,
});
