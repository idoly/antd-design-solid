import { createContext, createEffect, createSignal, For, merge, omit, Show, useContext } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { tv } from 'tailwind-variants';

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

export interface AvatarProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'children'> {
  src?: string;
  srcSet?: string;
  alt?: string;
  icon?: JSX.Element;
  size?: 'small' | 'default' | 'large' | number;
  shape?: 'circle' | 'square';
  gap?: number;
  onError?: () => boolean | void;
  children?: JSX.Element;
}

export interface AvatarGroupProps extends JSX.HTMLAttributes<HTMLDivElement> {
  size?: AvatarProps['size'];
  shape?: AvatarProps['shape'];
  max?: number | { count?: number };
  maxStyle?: JSX.CSSProperties;
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
  const others = omit(props, 'src', 'srcSet', 'alt', 'icon', 'size', 'shape', 'gap', 'onError', 'children', 'class', 'style');
  const size = () => props.size ?? group?.size() ?? 'default';
  const shape = () => props.shape ?? group?.shape() ?? 'circle';
  const numericSize = () => typeof size() === 'number' ? size() as number : undefined;
  const text = () => typeof props.children === 'string' || typeof props.children === 'number' ? String(props.children) : undefined;
  const textScale = () => {
    const length = text()?.length ?? 0;
    return length > 2 ? Math.max(0.55, 2 / length) : 1;
  };

  createEffect(
    () => props.src,
    () => { setImageFailed(false); },
  );

  const handleError = () => {
    const keepImage = props.onError?.() === false;
    if (!keepImage) setImageFailed(true);
  };

  return (
    <span
      {...others}
      class={avatar({ shape: shape(), size: typeof size() === 'number' ? undefined : size() as 'small' | 'default' | 'large', class: props.class as string | undefined })}
      style={{
        width: numericSize() ? `${numericSize()}px` : undefined,
        height: numericSize() ? `${numericSize()}px` : undefined,
        'font-size': numericSize() ? `${Math.max(12, numericSize()! / 2)}px` : undefined,
        ...props.style as JSX.CSSProperties,
      }}
    >
      <Show when={props.src && !imageFailed()} fallback={
        <Show when={props.icon} fallback={<span style={{ transform: `scale(${textScale()})` }} class="whitespace-nowrap">{props.children}</span>}>
          <span aria-hidden="true" class="inline-flex">{props.icon}</span>
        </Show>
      }>
        <img src={props.src} srcset={props.srcSet} alt={props.alt ?? ''} class="size-full object-cover" onError={handleError} />
      </Show>
    </span>
  );
}

export function AvatarGroup(inputProps: AvatarGroupProps) {
  const props = merge({ size: 'default' as const, shape: 'circle' as const }, inputProps);
  const others = omit(props, 'size', 'shape', 'max', 'maxStyle', 'children', 'class');
  const items = () => Array.isArray(props.children) ? props.children : props.children === undefined ? [] : [props.children];
  const maxCount = () => typeof props.max === 'number' ? props.max : props.max?.count ?? items().length;
  const visible = () => items().slice(0, maxCount());
  const excess = () => Math.max(0, items().length - visible().length);
  const context: AvatarGroupContextValue = { size: () => props.size, shape: () => props.shape };

  return (
    <AvatarGroupContext value={context}>
      <div {...others} class={['ads-avatar-group flex items-center pl-2 [&_.ads-avatar]:-ml-2 [&_.ads-avatar]:border-2 [&_.ads-avatar]:border-surface', props.class]}>
        <For each={visible()}>{(item) => item}</For>
        <Show when={excess() > 0}>
          <AvatarRoot style={props.maxStyle}>+{excess()}</AvatarRoot>
        </Show>
      </div>
    </AvatarGroupContext>
  );
}

export const Avatar = Object.assign(AvatarRoot, { Group: AvatarGroup });
