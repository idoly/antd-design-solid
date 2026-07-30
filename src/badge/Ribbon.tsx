import { merge } from 'solid-js';
import type { JSX } from '@solidjs/web';

export interface RibbonSemanticClasses { root?: string; content?: string; indicator?: string }
export interface RibbonSemanticStyles { root?: JSX.CSSProperties; content?: JSX.CSSProperties; indicator?: JSX.CSSProperties }
export interface RibbonProps {
  class?: string;
  className?: string;
  rootClass?: string;
  style?: JSX.CSSProperties;
  text?: JSX.Element;
  color?: string;
  children?: JSX.Element;
  placement?: 'start' | 'end';
  classNames?: RibbonSemanticClasses;
  styles?: RibbonSemanticStyles;
}

const presetColors: Record<string, string> = {
  blue: '#1677ff', cyan: '#13c2c2', geekblue: '#2f54eb', gold: '#faad14', green: '#52c41a', lime: '#a0d911', magenta: '#eb2f96', orange: '#fa8c16', pink: '#eb2f96', purple: '#722ed1', red: '#f5222d', volcano: '#fa541c', yellow: '#fadb14',
};

export function Ribbon(inputProps: RibbonProps) {
  const props = merge({ placement: 'end' as const, color: 'red' }, inputProps);
  const color = () => presetColors[props.color] ?? props.color;
  const placementStyle = (): JSX.CSSProperties => props.placement === 'start' ? { 'inset-inline-start': '-8px' } : { 'inset-inline-end': '-8px' };
  const indicatorStyle = (): JSX.CSSProperties => props.placement === 'start'
    ? { 'inset-inline-start': '0', 'border-top-color': color(), 'border-inline-start-color': 'transparent' }
    : { 'inset-inline-end': '0', 'border-top-color': color(), 'border-inline-end-color': 'transparent' };
  return <div class={['ads-badge-ribbon-wrapper relative block', props.rootClass, props.classNames?.root]} style={props.styles?.root}>
    {props.children}
    <div class={['ads-badge-ribbon absolute top-2 z-10 h-6 max-w-[calc(100%-16px)] px-3 text-sm leading-6 text-white shadow-sm', props.placement === 'start' ? 'rounded-r-small' : 'rounded-l-small', props.className, props.class, props.classNames?.content]} style={{ 'background-color': color(), ...placementStyle(), ...props.style, ...props.styles?.content }}>
      <span class="block truncate">{props.text}</span>
      <span aria-hidden="true" class={['absolute top-full size-0 border-4 border-b-transparent', props.classNames?.indicator]} style={{ ...indicatorStyle(), ...props.styles?.indicator }} />
    </div>
  </div>;
}
