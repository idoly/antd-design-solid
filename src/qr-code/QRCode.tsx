import QRCodeEncoder from 'qrcode';
import { createEffect, createSignal, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { useConfig } from '../config-provider';

export type QRCodeSemanticName = 'root' | 'cover';
export type QRCodeSemanticClassNames = Partial<Record<QRCodeSemanticName, string>>;
export type QRCodeSemanticStyles = Partial<Record<QRCodeSemanticName, JSX.CSSProperties>>;

export interface QRCodeProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'color'> {
  value: string;
  type?: 'canvas' | 'svg';
  icon?: string;
  iconSize?: number | { width: number; height: number };
  size?: number;
  color?: string;
  bgColor?: string;
  bordered?: boolean;
  errorLevel?: 'L' | 'M' | 'Q' | 'H';
  status?: 'active' | 'expired' | 'loading' | 'scanned';
  statusRender?: (info: { status: NonNullable<QRCodeProps['status']>; locale: { expired: string; refresh: string; scanned: string } }) => JSX.Element;
  onRefresh?: () => void;
  classNames?: QRCodeSemanticClassNames;
  styles?: QRCodeSemanticStyles;
}

export function QRCode(inputProps: QRCodeProps) {
  const config = useConfig();
  const props = merge({ type: 'canvas' as const, size: 160, color: '#000000', bgColor: '#ffffff', bordered: true, errorLevel: 'M' as const, status: 'active' as const }, config.componentDefaults('qrCode') as Partial<QRCodeProps>, inputProps);
  const [dataUrl, setDataUrl] = createSignal('');
  const [svg, setSvg] = createSignal('');
  const [failed, setFailed] = createSignal(false);
  const others = omit(props, 'value', 'type', 'icon', 'iconSize', 'size', 'color', 'bgColor', 'bordered', 'errorLevel', 'status', 'statusRender', 'onRefresh', 'classNames', 'styles', 'class', 'style');
  const iconSize = () => typeof props.iconSize === 'number' ? { width: props.iconSize, height: props.iconSize } : props.iconSize ?? { width: props.size * 0.2, height: props.size * 0.2 };
  const locale = () => ({ expired: config.locale().QRCode?.expired ?? 'QR code expired', refresh: config.locale().QRCode?.refresh ?? 'Refresh', scanned: config.locale().QRCode?.scanned ?? 'Scanned' });

  createEffect(
    () => [props.value, props.type, props.size, props.color, props.bgColor, props.errorLevel] as const,
    ([value, type, size, color, bgColor, errorLevel]) => {
      let cancelled = false;
      void (async () => {
        try {
          setFailed(false);
          const options = { width: size, margin: 1, errorCorrectionLevel: errorLevel, color: { dark: color, light: bgColor } };
          if (type === 'svg') {
            const markup = await QRCodeEncoder.toString(value, { ...options, type: 'svg' });
            if (!cancelled) {
              setSvg(markup);
              setDataUrl('');
            }
          } else {
            const url = await QRCodeEncoder.toDataURL(value, options);
            if (!cancelled) {
              setDataUrl(url);
              setSvg('');
            }
          }
        } catch {
          if (!cancelled) setFailed(true);
        }
      })();
      return () => { cancelled = true; };
    },
  );

  const defaultStatus = () => {
    if (props.status === 'loading') return <span class="ads-spin size-6 rounded-full border-2 border-primary border-r-transparent" />;
    if (props.status === 'scanned') return <span class="font-semibold text-success">{locale().scanned}</span>;
    if (props.status === 'expired') return <div class="text-center"><div class="mb-2 text-xs text-text-secondary">{locale().expired}</div><button type="button" class="rounded-control bg-primary px-3 py-1 text-xs text-white hover:bg-primary-hover" onClick={props.onRefresh}>{locale().refresh}</button></div>;
    return null;
  };

  return (
    <div
      {...others}
      class={['ads-qrcode relative inline-flex items-center justify-center overflow-hidden bg-surface', props.bordered ? 'rounded-surface border border-border-secondary p-2' : '', props.class, props.classNames?.root]}
      style={{ ...(typeof props.style === 'object' ? props.style : {}), width: `${props.size + (props.bordered ? 18 : 0)}px`, height: `${props.size + (props.bordered ? 18 : 0)}px`, ...props.styles?.root }}
    >
      <Show when={!failed()} fallback={<span role="alert" class="text-xs text-error">Unable to generate QR code</span>}>
        <Show when={props.type === 'canvas'} fallback={<div role="img" aria-label="QR code" class="size-full [&>svg]:size-full" innerHTML={svg()} />}>
          <Show when={dataUrl()}><img src={dataUrl()} alt="QR code" width={props.size} height={props.size} class="block" /></Show>
        </Show>
        <Show when={props.icon && props.status === 'active'}><img src={props.icon} alt="" class="absolute rounded-small border-2 border-white object-cover" style={{ width: `${iconSize().width}px`, height: `${iconSize().height}px` }} /></Show>
        <Show when={props.status !== 'active'}>
          <div class={['absolute inset-2 flex items-center justify-center bg-surface/90', props.classNames?.cover]} style={props.styles?.cover}>
            {props.statusRender?.({ status: props.status, locale: locale() }) ?? defaultStatus()}
          </div>
        </Show>
      </Show>
    </div>
  );
}
