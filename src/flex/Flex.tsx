import { merge, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';

export type FlexGap = 'small' | 'middle' | 'large' | number | string;

export interface FlexProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'style'> {
  vertical?: boolean;
  wrap?: boolean | 'nowrap' | 'wrap' | 'wrap-reverse';
  justify?: JSX.CSSProperties['justify-content'];
  align?: JSX.CSSProperties['align-items'];
  flex?: JSX.CSSProperties['flex'];
  gap?: FlexGap | [FlexGap, FlexGap];
  inline?: boolean;
  style?: JSX.CSSProperties;
}

const gapValue = (gap: FlexGap): string => {
  if (typeof gap === 'number') return `${gap}px`;
  if (gap === 'small') return '8px';
  if (gap === 'middle') return '16px';
  if (gap === 'large') return '24px';
  return gap;
};

export function Flex(inputProps: FlexProps) {
  const props = merge({ vertical: false, wrap: false, inline: false }, inputProps);
  const others = omit(props, 'vertical', 'wrap', 'justify', 'align', 'flex', 'gap', 'inline', 'style', 'class');
  const style = (): JSX.CSSProperties => {
    const gap = Array.isArray(props.gap) ? `${gapValue(props.gap[1])} ${gapValue(props.gap[0])}` : props.gap === undefined ? undefined : gapValue(props.gap);
    return {
      display: props.inline ? 'inline-flex' : 'flex',
      'flex-direction': props.vertical ? 'column' : 'row',
      'flex-wrap': props.wrap === true ? 'wrap' : props.wrap || 'nowrap',
      'justify-content': props.justify,
      'align-items': props.align,
      flex: props.flex,
      gap,
      ...props.style,
    };
  };

  return <div {...others} class={['ads-flex min-w-0', props.class]} style={style()}>{props.children}</div>;
}
