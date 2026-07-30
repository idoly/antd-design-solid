import { merge, omit, onCleanup, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';

export interface WatermarkFont {
  color?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontFamily?: string;
  fontStyle?: 'normal' | 'italic' | 'oblique';
  textAlign?: 'left' | 'center' | 'right';
}

export interface WatermarkText { text: string; font?: WatermarkFont }
export type WatermarkContent = string | WatermarkText;

export interface WatermarkProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'content'> {
  width?: number;
  height?: number;
  rotate?: number;
  zIndex?: number;
  gap?: [number, number];
  offset?: [number, number];
  font?: WatermarkFont;
  image?: string;
  content?: WatermarkContent | readonly WatermarkContent[];
  inherit?: boolean;
  onRemove?: () => void;
}

const escapeXml = (value: string) => value.replace(/[<>&"']/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[character]!);

export function Watermark(inputProps: WatermarkProps) {
  const props = merge({ width: 120, height: 64, rotate: -22, zIndex: 9, gap: [100, 100] as [number, number], offset: [0, 0] as [number, number], inherit: false }, inputProps);
  const others = omit(props, 'width', 'height', 'rotate', 'zIndex', 'gap', 'offset', 'font', 'image', 'content', 'inherit', 'onRemove', 'children', 'class', 'style');
  let rootRef: HTMLDivElement | undefined;
  let layerRef: HTMLDivElement | undefined;
  let observer: MutationObserver | undefined;
  queueMicrotask(() => {
    if (!rootRef || !layerRef || typeof MutationObserver === 'undefined') return;
    observer = new MutationObserver(() => {
      if (rootRef && layerRef && !rootRef.contains(layerRef)) {
        props.onRemove?.();
        rootRef.append(layerRef);
      }
    });
    observer.observe(rootRef, { childList: true });
  });
  onCleanup(() => observer?.disconnect());
  const baseFont = () => ({ color: 'rgba(0, 0, 0, 0.15)', fontSize: 16, fontWeight: 400, fontFamily: 'var(--ads-font-family)', fontStyle: 'normal', textAlign: 'center', ...props.font });
  const contents = (): WatermarkText[] => (Array.isArray(props.content) ? props.content : props.content ? [props.content] : []).map((item) => typeof item === 'string' ? { text: item } : item);
  const svg = () => {
    const lines = contents();
    const lineHeight = Math.max(...lines.map((line) => ({ ...baseFont(), ...line.font }).fontSize * 1.4), baseFont().fontSize * 1.4);
    const startY = props.height / 2 - (lines.length - 1) * lineHeight / 2;
    const body = props.image
      ? `<image href="${escapeXml(props.image)}" x="0" y="0" width="${props.width}" height="${props.height}" preserveAspectRatio="xMidYMid meet"/>`
      : lines.map((line, index) => {
        const font = { ...baseFont(), ...line.font };
        const anchor = font.textAlign === 'left' ? 'start' : font.textAlign === 'right' ? 'end' : 'middle';
        const x = font.textAlign === 'left' ? 0 : font.textAlign === 'right' ? props.width : props.width / 2;
        return `<text x="${x}" y="${startY + index * lineHeight}" dominant-baseline="middle" text-anchor="${anchor}" fill="${escapeXml(font.color)}" font-size="${font.fontSize}" font-weight="${font.fontWeight}" font-family="${escapeXml(font.fontFamily)}" font-style="${font.fontStyle}">${escapeXml(line.text)}</text>`;
      }).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${props.width}" height="${props.height}" viewBox="0 0 ${props.width} ${props.height}"><g transform="rotate(${props.rotate} ${props.width / 2} ${props.height / 2})">${body}</g></svg>`;
  };
  const background = () => `url("data:image/svg+xml,${encodeURIComponent(svg())}")`;
  const markStyle = (): JSX.CSSProperties => ({
    position: props.inherit ? 'absolute' : 'absolute',
    inset: '0',
    'z-index': props.zIndex,
    'pointer-events': 'none',
    'background-image': background(),
    'background-repeat': 'repeat',
    'background-position': `${props.offset[0]}px ${props.offset[1]}px`,
    'background-size': `${props.width + props.gap[0]}px ${props.height + props.gap[1]}px`,
  });

  return (
    <div {...others} ref={rootRef} class={['ads-watermark relative min-w-0', props.class]} style={props.style}>
      {props.children}
      <Show when={props.image || contents().length > 0}><div ref={layerRef} aria-hidden="true" class="ads-watermark-layer" style={markStyle()} /></Show>
    </div>
  );
}
