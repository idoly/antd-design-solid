import { createContext, createEffect, createMemo, createSignal, For, merge, omit, Show, untrack, useContext } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { tv } from 'tailwind-variants';
import type { Breakpoint } from '../grid';
import type { PopoverProps } from '../popover';

const avatar = tv({
  base: 'ads-avatar relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-text-disabled text-center text-white align-middle',
  variants: {
    shape: { circle: 'rounded-full', square: 'rounded-surface' },
    size: {
      small: 'size-6 text-xs',
      default: 'size-8 text-sm',
      large: 'size-10 text-base',
    },
  },
  defaultVariants: { shape: 'circle', size: 'default' },
});

export type AvatarResponsiveSize = Partial<Record<Breakpoint, number>>;
export type AvatarSize = 'small' | 'default' | 'medium' | 'large' | number | AvatarResponsiveSize;

export interface AvatarProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'children' | 'draggable'> {
  src?: string;
  srcSet?: string;
  alt?: string;
  icon?: JSX.Element;
  size?: AvatarSize;
  shape?: 'circle' | 'square';
  gap?: number;
  draggable?: boolean | 'true' | 'false';
  crossOrigin?: '' | 'anonymous' | 'use-credentials';
  onError?: () => boolean | void;
  children?: JSX.Element;
}

export interface AvatarGroupProps extends JSX.HTMLAttributes<HTMLDivElement> {
  size?: AvatarProps['size'];
  shape?: AvatarProps['shape'];
  max?: number | { count?: number; style?: JSX.CSSProperties; popover?: Omit<PopoverProps, 'children' | 'content'> };
  maxCount?: number;
  maxStyle?: JSX.CSSProperties;
  maxPopoverPlacement?: 'top' | 'bottom';
  maxPopoverTrigger?: 'hover' | 'focus' | 'click';
}

interface AvatarGroupContextValue {
  size: () => AvatarProps['size'];
  shape: () => AvatarProps['shape'];
}

const AvatarGroupContext = createContext<AvatarGroupContextValue | null>(null);

function AvatarRoot(inputProps: AvatarProps) {
  const group = useContext(AvatarGroupContext);
  const props = merge({ shape: undefined, size: undefined, gap: 4 }, inputProps);
  const [imageFailed, setImageFailed] = createSignal(false, { ownedWrite: true });
  const others = omit(props, 'src', 'srcSet', 'alt', 'icon', 'size', 'shape', 'gap', 'draggable', 'crossOrigin', 'onError', 'children', 'class', 'style');
  const size = () => props.size ?? group?.size() ?? 'default';
  const shape = () => props.shape ?? group?.shape() ?? 'circle';
  const numericSize = () => typeof size() === 'number' ? size() as number : undefined;
  const responsiveSize = () => typeof size() === 'object' ? size() as AvatarResponsiveSize : undefined;
  const responsiveStyle = (): JSX.CSSProperties => {
    const responsive = responsiveSize();
    if (!responsive) return {};
    let inherited = responsive.xs ?? 32;
    return Object.fromEntries((['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const).map((breakpoint) => {
      inherited = responsive[breakpoint] ?? inherited;
      return [`--ads-avatar-responsive-${breakpoint}`, `${inherited}px`];
    })) as JSX.CSSProperties;
  };
  const text = () => typeof props.children === 'string' || typeof props.children === 'number' ? String(props.children) : undefined;
  const textScale = () => {
    const length = text()?.length ?? 0;
    return length > 2 ? Math.max(0.55, 2 / length) : 1;
  };

  createEffect(
    () => props.src,
    () => { setImageFailed(false); },
  );

  const imageDraggable = (): 'true' | 'false' | undefined => props.draggable === undefined ? undefined : props.draggable === true || props.draggable === 'true' ? 'true' : 'false';
  const handleError = () => {
    const keepImage = props.onError?.() === false;
    if (!keepImage) setImageFailed(true);
  };

  return (
    <span
      {...others}
      data-size={typeof size() === 'string' ? size() === 'medium' ? 'default' : size() : undefined}
      data-responsive={responsiveSize() ? 'true' : undefined}
      class={avatar({ shape: shape(), size: typeof size() === 'string' ? (size() === 'medium' ? 'default' : size()) as 'small' | 'default' | 'large' : undefined, class: props.class as string | undefined })}
      style={{
        ...responsiveStyle(),
        width: numericSize() ? `${numericSize()}px` : undefined,
        height: numericSize() ? `${numericSize()}px` : undefined,
        'font-size': numericSize() ? `${Math.max(12, numericSize()! / 2)}px` : undefined,
        ...props.style as JSX.CSSProperties,
      }}
    >
      <Show when={props.src && !imageFailed()} fallback={
        <Show when={props.icon} fallback={<span data-avatar-content="text" style={{ transform: `scale(${textScale()})` }} class="whitespace-nowrap">{props.children}</span>}>
          <span data-avatar-content="icon" aria-hidden="true" class="inline-flex">{props.icon}</span>
        </Show>
      }>
        <img src={props.src} srcset={props.srcSet} alt={props.alt ?? ''} draggable={imageDraggable()} crossorigin={props.crossOrigin} class="size-full object-cover" onError={handleError} />
      </Show>
    </span>
  );
}

function AvatarGroupContent(props: AvatarGroupProps) {
  const others = omit(props, 'size', 'shape', 'max', 'maxCount', 'maxStyle', 'maxPopoverPlacement', 'maxPopoverTrigger', 'children', 'class');
  const items = createMemo<readonly JSX.Element[]>(() => Array.isArray(props.children) ? props.children : props.children === undefined ? [] : [props.children]);
  const maxCount = () => typeof props.max === 'number' ? props.max : props.max?.count ?? props.maxCount ?? items().length;
  const overflowStyle = () => typeof props.max === 'object' ? props.max.style ?? props.maxStyle : props.maxStyle;
  const visible = () => items().slice(0, maxCount());
  const hidden = () => items().slice(maxCount());
  const excess = () => Math.max(0, items().length - visible().length);
  const overflowPopover = () => typeof props.max === 'object' ? props.max.popover ?? {} : {};
  const [internalOpen, setInternalOpen] = createSignal(Boolean(untrack(() => overflowPopover().defaultOpen)), { ownedWrite: true });
  const isOpen = () => overflowPopover().open ?? internalOpen();
  const triggers = () => Array.isArray(overflowPopover().trigger) ? overflowPopover().trigger as readonly string[] : [overflowPopover().trigger ?? props.maxPopoverTrigger ?? 'hover'];
  const hasTrigger = (trigger: 'hover' | 'focus' | 'click') => triggers().includes(trigger);
  const setOpen = (next: boolean) => {
    if (next === isOpen()) return;
    if (overflowPopover().open === undefined) setInternalOpen(next);
    overflowPopover().onOpenChange?.(next);
  };
  const placement = () => overflowPopover().placement ?? props.maxPopoverPlacement ?? 'top';

  return (
    <div {...others} class={['ads-avatar-group flex items-center pl-2 [&_.ads-avatar]:-ml-2 [&_.ads-avatar]:border-2 [&_.ads-avatar]:border-surface', props.class]}>
      <For each={visible()}>{(item) => item}</For>
      <Show when={excess() > 0}>
        <span
          class="relative inline-flex"
          onPointerEnter={() => { if (hasTrigger('hover')) setOpen(true); }}
          onPointerLeave={() => { if (hasTrigger('hover')) setOpen(false); }}
          onFocusIn={() => { if (hasTrigger('focus')) setOpen(true); }}
          onFocusOut={() => { if (hasTrigger('focus')) setOpen(false); }}
        >
          <button type="button" aria-label="Show hidden avatars" aria-haspopup="dialog" aria-expanded={isOpen() ? 'true' : 'false'} class="inline-flex rounded-full" onClick={() => { if (hasTrigger('click')) setOpen(!isOpen()); }}>
            <AvatarRoot data-avatar-overflow="true" style={overflowStyle()}>+{excess()}</AvatarRoot>
          </button>
          <Show when={isOpen()}>
            <div
              role="dialog"
              aria-label="Hidden avatars"
              class={['ads-avatar-group-popover absolute z-[1030] flex items-center rounded-surface border border-border-secondary bg-surface p-2 shadow-popup', placement().startsWith('bottom') ? 'top-full mt-2' : 'bottom-full mb-2', overflowPopover().overlayClass]}
              style={{ 'z-index': overflowPopover().zIndex, ...overflowPopover().styles?.root, ...overflowPopover().styles?.content }}
            >
              <For each={hidden()}>{(item) => item}</For>
            </div>
          </Show>
        </span>
      </Show>
    </div>
  );
}

export function AvatarGroup(inputProps: AvatarGroupProps) {
  const props = merge({ size: 'default' as const, shape: 'circle' as const }, inputProps);
  const context: AvatarGroupContextValue = { size: () => props.size, shape: () => props.shape };
  return <AvatarGroupContext value={context}><AvatarGroupContent {...props} /></AvatarGroupContext>;
}

export const Avatar = Object.assign(AvatarRoot, { Group: AvatarGroup });
