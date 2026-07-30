import { merge, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';

export interface BorderBeamGradientItem { color: string; percent: number }
export type BorderBeamGradient = BorderBeamGradientItem[];
export type BorderBeamColor = string | BorderBeamGradient;

export interface BorderBeamProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'color' | 'style'> {
  color?: BorderBeamColor;
  duration?: number;
  lineWidth?: number | string;
  outset?: number | string;
  size?: number | string;
  style?: JSX.CSSProperties;
}

const cssSize = (value: number | string) => typeof value === 'number' ? `${value}px` : value;
const gradient = (color: BorderBeamColor) => {
  if (typeof color === 'string') return `transparent 0%, ${color} 50%, transparent 100%`;
  return color.map((item) => `${item.color} ${Math.min(100, Math.max(0, item.percent))}%`).join(', ');
};

export function BorderBeam(inputProps: BorderBeamProps) {
  const props = merge({ color: 'var(--ads-color-primary)' as BorderBeamColor, duration: 6, lineWidth: 1, outset: 0, size: 80 }, inputProps);
  const others = omit(props, 'color', 'duration', 'lineWidth', 'outset', 'size', 'children', 'class', 'style');
  const style = () => ({
    '--ads-border-beam-color': gradient(props.color),
    '--ads-border-beam-duration': `${Math.max(0.1, props.duration)}s`,
    '--ads-border-beam-width': cssSize(props.lineWidth),
    '--ads-border-beam-outset': cssSize(props.outset),
    '--ads-border-beam-size': cssSize(props.size),
    ...props.style,
  } as JSX.CSSProperties);
  return <div {...others} class={['ads-border-beam relative', props.class]} style={style()}>{props.children}</div>;
}
