import {
  CalendarOutlined,
  CheckOutlined,
  CloseOutlined,
  DownloadOutlined,
  DownOutlined,
  LeftOutlined,
  MinusOutlined,
  PlusOutlined,
  RightOutlined,
  UpOutlined,
} from '@ant-design/icons-svg';
import type { AbstractNode, IconDefinition } from '@ant-design/icons-svg/es/types';
import { For, untrack } from 'solid-js';
import type { JSX } from '@solidjs/web';

interface IconProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
  icon: IconDefinition;
}

function IconNode(props: { node: AbstractNode }) {
  const node = untrack(() => props.node);
  const children = () => <For each={node.children}>{(child) => <IconNode node={child} />}</For>;
  if (node.tag === 'g') return <g {...node.attrs}>{children()}</g>;
  if (node.tag === 'circle') return <circle {...node.attrs} />;
  if (node.tag === 'rect') return <rect {...node.attrs} />;
  if (node.tag === 'line') return <line {...node.attrs} />;
  if (node.tag === 'polyline') return <polyline {...node.attrs} />;
  if (node.tag === 'polygon') return <polygon {...node.attrs} />;
  return <path {...node.attrs} />;
}

export function AntIcon(props: IconProps) {
  const definition = () => typeof props.icon.icon === 'function' ? props.icon.icon('#1677ff', '#e6f4ff') : props.icon.icon;
  return (
    <svg
      {...definition().attrs}
      class={props.class}
      style={props.style}
      width={props.width ?? '1em'}
      height={props.height ?? '1em'}
      fill="currentColor"
      aria-hidden={props['aria-label'] ? undefined : 'true'}
      aria-label={props['aria-label']}
      role={props['aria-label'] ? 'img' : undefined}
    >
      <For each={definition().children}>{(child) => <IconNode node={child} />}</For>
    </svg>
  );
}

export const CalendarIcon = (props: Omit<IconProps, 'icon'>) => <AntIcon {...props} icon={CalendarOutlined} />;
export const CheckIcon = (props: Omit<IconProps, 'icon'>) => <AntIcon {...props} icon={CheckOutlined} />;
export const CloseIcon = (props: Omit<IconProps, 'icon'>) => <AntIcon {...props} icon={CloseOutlined} />;
export const DownloadIcon = (props: Omit<IconProps, 'icon'>) => <AntIcon {...props} icon={DownloadOutlined} />;
export const DownIcon = (props: Omit<IconProps, 'icon'>) => <AntIcon {...props} icon={DownOutlined} />;
export const LeftIcon = (props: Omit<IconProps, 'icon'>) => <AntIcon {...props} icon={LeftOutlined} />;
export const MinusIcon = (props: Omit<IconProps, 'icon'>) => <AntIcon {...props} icon={MinusOutlined} />;
export const PlusIcon = (props: Omit<IconProps, 'icon'>) => <AntIcon {...props} icon={PlusOutlined} />;
export const RightIcon = (props: Omit<IconProps, 'icon'>) => <AntIcon {...props} icon={RightOutlined} />;
export const UpIcon = (props: Omit<IconProps, 'icon'>) => <AntIcon {...props} icon={UpOutlined} />;
