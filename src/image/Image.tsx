import { createContext, createEffect, createSignal, createUniqueId, merge, omit, onCleanup, Show, useContext } from 'solid-js';
import { Portal } from '@solidjs/web';
import type { JSX } from '@solidjs/web';
import { CloseIcon, MinusIcon, PlusIcon } from '../_internal/icons';
import { lockBodyScroll, unlockBodyScroll } from '../_internal/scrollLock';
import { useConfig } from '../config-provider';

export type ImageSemanticName = 'root' | 'image' | 'cover' | 'popup.root' | 'popup.mask' | 'popup.body' | 'popup.footer' | 'popup.actions' | 'popup.close';
export type ImageSemanticClassNames = Partial<Record<ImageSemanticName, string>>;
export type ImageSemanticStyles = Partial<Record<ImageSemanticName, JSX.CSSProperties>>;

export interface ImagePreviewConfig {
  visible?: boolean;
  src?: string;
  mask?: JSX.Element;
  closeIcon?: JSX.Element;
  scaleStep?: number;
  minScale?: number;
  maxScale?: number;
  onVisibleChange?: (visible: boolean, previousVisible: boolean) => void;
}

export interface ImageProps extends Omit<JSX.ImgHTMLAttributes<HTMLImageElement>, 'placeholder'> {
  fallback?: string;
  placeholder?: boolean | JSX.Element;
  preview?: boolean | ImagePreviewConfig;
  rootClass?: string;
  classNames?: ImageSemanticClassNames;
  styles?: ImageSemanticStyles;
}

export interface PreviewGroupProps extends JSX.HTMLAttributes<HTMLDivElement> {
  preview?: boolean | ImagePreviewConfig;
  fallback?: string;
  classNames?: ImageSemanticClassNames;
  styles?: ImageSemanticStyles;
}

interface GroupImage { id: string; src: string; alt?: string }
interface PreviewGroupContextValue {
  register: (image: GroupImage) => void;
  unregister: (id: string) => void;
  open: (id: string) => void;
  fallback?: string;
}

const PreviewGroupContext = createContext<PreviewGroupContextValue | null>(null);

function Preview(props: { src: string; alt?: string; visible: boolean; config: ImagePreviewConfig; classNames?: ImageSemanticClassNames; styles?: ImageSemanticStyles; onClose: () => void; previous?: () => void; next?: () => void }) {
  const config = useConfig();
  const [scale, setScale] = createSignal(1, { ownedWrite: true });
  const [rotate, setRotate] = createSignal(0, { ownedWrite: true });
  const step = () => props.config.scaleStep ?? 0.5;
  const min = () => props.config.minScale ?? 0.5;
  const max = () => props.config.maxScale ?? 5;
  const zoom = (offset: number) => setScale(Math.min(max(), Math.max(min(), scale() + offset)));

  createEffect(
    () => props.visible,
    (visible) => {
      if (!visible) return;
      setScale(1);
      setRotate(0);
      lockBodyScroll();
      const keydown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') props.onClose();
        if (event.key === '+' || event.key === '=') zoom(step());
        if (event.key === '-') zoom(-step());
        if (event.key === 'ArrowLeft') props.previous?.();
        if (event.key === 'ArrowRight') props.next?.();
      };
      document.addEventListener('keydown', keydown);
      return () => {
        unlockBodyScroll();
        document.removeEventListener('keydown', keydown);
      };
    },
  );

  return (
    <Show when={props.visible}>
      <Portal>
        <div class={['ads-root ads-image-theme', config.themeScopeClass(), 'fixed inset-0 z-[2020] flex items-center justify-center overflow-hidden', props.classNames?.['popup.root']]} style={props.styles?.['popup.root']} role="dialog" aria-modal="true" aria-label="Image preview">
          <div aria-hidden="true" class={['absolute inset-0 bg-black/85', props.classNames?.['popup.mask']]} style={props.styles?.['popup.mask']} />
          <button type="button" aria-label="Close preview" class={['absolute right-4 top-4 z-10 inline-flex size-10 items-center justify-center rounded-full bg-black/45 text-xl text-white hover:bg-black/65', props.classNames?.['popup.close']]} style={props.styles?.['popup.close']} onClick={props.onClose}>{props.config.closeIcon ?? <CloseIcon />}</button>
          <Show when={props.previous}><button type="button" aria-label="Previous image" class="absolute left-4 z-10 inline-flex size-10 items-center justify-center rounded-full bg-black/45 text-white hover:bg-black/65" onClick={props.previous}>&lt;</button></Show>
          <div class={['pointer-events-none absolute inset-0 flex items-center justify-center', props.classNames?.['popup.body']]} style={props.styles?.['popup.body']}><img src={props.src} alt={props.alt ?? ''} class="pointer-events-auto max-h-[calc(100vh-120px)] max-w-[calc(100vw-64px)] select-none object-contain transition-transform duration-[var(--ads-motion-mid)]" style={{ transform: `scale(${scale()}) rotate(${rotate()}deg)` }} /></div>
          <Show when={props.next}><button type="button" aria-label="Next image" class="absolute right-4 z-10 inline-flex size-10 items-center justify-center rounded-full bg-black/45 text-white hover:bg-black/65" onClick={props.next}>&gt;</button></Show>
          <div class={['absolute bottom-5 flex justify-center', props.classNames?.['popup.footer']]} style={props.styles?.['popup.footer']}><div class={['flex items-center gap-1 rounded-full bg-black/55 p-1 text-white', props.classNames?.['popup.actions']]} style={props.styles?.['popup.actions']}>
            <button type="button" aria-label="Zoom out" disabled={scale() <= min()} class="inline-flex size-8 items-center justify-center rounded-full bg-transparent hover:bg-white/15 disabled:opacity-40" onClick={() => zoom(-step())}><MinusIcon /></button>
            <span class="w-12 text-center text-xs">{Math.round(scale() * 100)}%</span>
            <button type="button" aria-label="Zoom in" disabled={scale() >= max()} class="inline-flex size-8 items-center justify-center rounded-full bg-transparent hover:bg-white/15 disabled:opacity-40" onClick={() => zoom(step())}><PlusIcon /></button>
            <button type="button" aria-label="Rotate left" class="inline-flex h-8 px-2 items-center justify-center rounded-full bg-transparent hover:bg-white/15" onClick={() => setRotate(rotate() - 90)}>Left</button>
            <button type="button" aria-label="Rotate right" class="inline-flex h-8 px-2 items-center justify-center rounded-full bg-transparent hover:bg-white/15" onClick={() => setRotate(rotate() + 90)}>Right</button>
          </div></div>
        </div>
      </Portal>
    </Show>
  );
}

function ImageRoot(inputProps: ImageProps) {
  const globalConfig = useConfig();
  const props = merge({ preview: true as boolean | ImagePreviewConfig }, globalConfig.componentDefaults('image') as Partial<ImageProps>, inputProps);
  const group = useContext(PreviewGroupContext);
  const uid = createUniqueId();
  const [loading, setLoading] = createSignal(true, { ownedWrite: true });
  const [failed, setFailed] = createSignal(false, { ownedWrite: true });
  const [visible, setVisible] = createSignal(false, { ownedWrite: true });
  const others = omit(props, 'fallback', 'placeholder', 'preview', 'rootClass', 'classNames', 'styles', 'class', 'style', 'src', 'alt', 'onLoad', 'onError');
  const config = (): ImagePreviewConfig => typeof props.preview === 'object' ? props.preview : {};
  const previewVisible = () => config().visible ?? visible();
  const fallback = () => props.fallback ?? group?.fallback;
  const originalSource = () => typeof props.src === 'string' ? props.src : '';
  const alt = () => typeof props.alt === 'string' ? props.alt : undefined;
  const source = (): string => failed() && fallback() ? fallback()! : originalSource();
  const setPreview = (next: boolean) => {
    const previous = previewVisible();
    if (config().visible === undefined) setVisible(next);
    config().onVisibleChange?.(next, previous);
  };
  const open = () => {
    if (!props.preview) return;
    if (group) group.open(uid);
    else setPreview(true);
  };
  group?.register({ id: uid, src: originalSource(), alt: alt() });
  onCleanup(() => group?.unregister(uid));

  createEffect(
    () => props.src,
    () => {
      setLoading(true);
      setFailed(false);
    },
  );

  return (
    <>
      <span class={['ads-image relative inline-flex max-w-full overflow-hidden align-middle', props.preview ? 'cursor-zoom-in' : '', props.rootClass, props.classNames?.root]} style={{ ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }} onClick={open}>
        <img
          {...others}
          src={source()}
          alt={alt() ?? ''}
          class={['block max-w-full object-cover', props.class, props.classNames?.image]}
          style={props.styles?.image}
          onLoad={(event) => { setLoading(false); if (typeof props.onLoad === 'function') props.onLoad(event); }}
          onError={(event) => { if (!failed() && fallback()) setFailed(true); else setLoading(false); if (typeof props.onError === 'function') props.onError(event); }}
        />
        <Show when={loading() && props.placeholder}>
          <span class="absolute inset-0 flex items-center justify-center bg-surface-container text-text-disabled">{props.placeholder === true ? <span class="ads-spin size-5 rounded-full border-2 border-primary border-r-transparent" /> : props.placeholder}</span>
        </Show>
        <Show when={props.preview}><span class={['absolute inset-0 flex items-center justify-center bg-black/0 text-sm text-transparent transition-colors hover:bg-black/45 hover:text-white', props.classNames?.cover]} style={props.styles?.cover}>{config().mask ?? 'Preview'}</span></Show>
      </span>
      <Show when={!group}><Preview src={config().src ?? source()} alt={alt()} visible={previewVisible()} config={config()} classNames={props.classNames} styles={props.styles} onClose={() => setPreview(false)} /></Show>
    </>
  );
}

export function PreviewGroup(inputProps: PreviewGroupProps) {
  const props = merge({ preview: true as boolean | ImagePreviewConfig }, inputProps);
  const [images, setImages] = createSignal<readonly GroupImage[]>([], { ownedWrite: true });
  const [activeId, setActiveId] = createSignal<string | undefined>(undefined, { ownedWrite: true });
  let currentImages: readonly GroupImage[] = [];
  const others = omit(props, 'preview', 'fallback', 'classNames', 'styles', 'children', 'class');
  const config = (): ImagePreviewConfig => typeof props.preview === 'object' ? props.preview : {};
  const index = () => currentImages.findIndex((image) => image.id === activeId());
  const active = () => currentImages[index()];
  const setVisible = (visible: boolean) => {
    const previous = Boolean(activeId());
    if (!visible) setActiveId(undefined);
    config().onVisibleChange?.(visible, previous);
  };
  const context: PreviewGroupContextValue = {
    fallback: props.fallback,
    register(image) {
      if (!currentImages.some((item) => item.id === image.id)) {
        currentImages = [...currentImages, image];
        setImages(currentImages);
      }
    },
    unregister(id) {
      currentImages = currentImages.filter((image) => image.id !== id);
      setImages(currentImages);
    },
    open(id) {
      if (props.preview) setActiveId(id);
    },
  };
  const move = (offset: number) => {
    if (images().length < 2) return;
    const next = (index() + offset + images().length) % images().length;
    setActiveId(images()[next].id);
  };

  return (
    <PreviewGroupContext value={context}>
      <div {...others} class={['ads-image-preview-group contents', props.class]}>{props.children}</div>
      <Show when={active()}>{(image) => <Preview src={image().src} alt={image().alt} visible config={config()} classNames={props.classNames} styles={props.styles} onClose={() => setVisible(false)} previous={images().length > 1 ? () => move(-1) : undefined} next={images().length > 1 ? () => move(1) : undefined} />}</Show>
    </PreviewGroupContext>
  );
}

export const Image = Object.assign(ImageRoot, { PreviewGroup });
