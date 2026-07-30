import { createSignal, merge, omit, onCleanup, Show } from 'solid-js';
import { Dynamic } from '@solidjs/web';
import type { JSX } from '@solidjs/web';
import { useConfig } from '../config-provider';

export type TypographySemanticName = 'root' | 'actions' | 'action' | 'textarea';
export type TypographySemanticClassNames = Partial<Record<TypographySemanticName, string>>;
export type TypographySemanticStyles = Partial<Record<TypographySemanticName, JSX.CSSProperties>>;

export type TypographyType = 'secondary' | 'success' | 'warning' | 'danger';

export interface CopyConfig {
  text?: string;
  onCopy?: (event: MouseEvent) => void;
}

export interface EditConfig {
  editing?: boolean;
  maxLength?: number;
  onChange?: (value: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export interface EllipsisConfig {
  rows?: number;
  expandable?: boolean | 'collapsible';
  symbol?: JSX.Element | ((expanded: boolean) => JSX.Element);
  onExpand?: (event: MouseEvent, info: { expanded: boolean }) => void;
}

interface BaseTypographyProps extends Omit<JSX.HTMLAttributes<HTMLElement>, 'onChange' | 'style'> {
  type?: TypographyType;
  disabled?: boolean;
  mark?: boolean;
  code?: boolean;
  keyboard?: boolean;
  underline?: boolean;
  delete?: boolean;
  strong?: boolean;
  italic?: boolean;
  copyable?: boolean | CopyConfig;
  editable?: boolean | EditConfig;
  ellipsis?: boolean | EllipsisConfig;
  style?: JSX.CSSProperties;
  classNames?: TypographySemanticClassNames;
  styles?: TypographySemanticStyles;
}

export type TypographyProps = BaseTypographyProps;
export interface TextProps extends BaseTypographyProps { }
export interface ParagraphProps extends BaseTypographyProps { }
export interface TitleProps extends BaseTypographyProps { level?: 1 | 2 | 3 | 4 | 5 }
export interface LinkProps extends Omit<BaseTypographyProps, 'disabled'> { href?: string; target?: string; disabled?: boolean }

const typeClass = (type?: TypographyType) => {
  if (type === 'secondary') return 'text-text-secondary';
  if (type === 'success') return 'text-success';
  if (type === 'warning') return 'text-warning';
  if (type === 'danger') return 'text-error';
  return 'text-text';
};

function TypographyBase(inputProps: BaseTypographyProps & { component: 'span' | 'p' | 'a' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5'; multiline?: boolean; href?: string; target?: string }) {
  const config = useConfig();
  const props = merge(config.componentDefaults('typography') as Partial<typeof inputProps>, inputProps);
  const [internalEditing, setInternalEditing] = createSignal(false, { ownedWrite: true });
  const [draft, setDraft] = createSignal('', { ownedWrite: true });
  const [expanded, setExpanded] = createSignal(false, { ownedWrite: true });
  const [copied, setCopied] = createSignal(false, { ownedWrite: true });
  let draftValue = '';
  let copyTimer: number | undefined;
  onCleanup(() => { if (copyTimer) window.clearTimeout(copyTimer); });
  const others = omit(
    props,
    'component', 'multiline', 'type', 'disabled', 'mark', 'code', 'keyboard',
    'underline', 'delete', 'strong', 'italic', 'copyable', 'editable', 'ellipsis',
    'classNames', 'styles', 'style', 'class', 'children', 'href', 'target',
  );
  const editConfig = () => typeof props.editable === 'object' ? props.editable : {};
  const ellipsisConfig = () => typeof props.ellipsis === 'object' ? props.ellipsis : {};
  const copyConfig = () => typeof props.copyable === 'object' ? props.copyable : {};
  const text = () => typeof props.children === 'string' || typeof props.children === 'number' ? String(props.children) : '';
  const editing = () => editConfig().editing ?? internalEditing();
  const startEdit = () => {
    if (props.disabled) return;
    draftValue = text();
    setDraft(draftValue);
    if (editConfig().editing === undefined) setInternalEditing(true);
    editConfig().onStart?.();
  };
  const finishEdit = () => {
    if (editConfig().editing === undefined) setInternalEditing(false);
    editConfig().onChange?.(draftValue);
    editConfig().onEnd?.();
  };
  const copy = async (event: MouseEvent) => {
    const value = copyConfig().text ?? text();
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.append(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    setCopied(true);
    if (copyTimer) window.clearTimeout(copyTimer);
    copyTimer = window.setTimeout(() => setCopied(false), 1500);
    copyConfig().onCopy?.(event);
  };
  const toggleExpanded: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
    const next = !expanded();
    setExpanded(next);
    ellipsisConfig().onExpand?.(event, { expanded: next });
  };
  const expandSymbol = () => {
    const symbol = ellipsisConfig().symbol;
    return typeof symbol === 'function' ? symbol(expanded()) : symbol ?? (expanded() ? config.locale().Text?.collapse ?? 'Collapse' : config.locale().Text?.expand ?? 'Expand');
  };
  const ellipsisStyle = (): JSX.CSSProperties => props.ellipsis && !expanded() ? {
    display: '-webkit-box',
    overflow: 'hidden',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': String(ellipsisConfig().rows ?? 1),
  } as JSX.CSSProperties : {};
  const contentClass = () => [
    typeClass(props.type),
    props.disabled ? 'cursor-not-allowed text-text-disabled' : '',
    props.mark ? 'bg-[#fffbe6]' : '',
    props.code ? 'rounded-small border border-border bg-surface-container px-1 font-mono text-[0.9em]' : '',
    props.keyboard ? 'rounded-small border border-b-2 border-border bg-surface-container px-1 font-mono text-[0.9em]' : '',
    props.underline ? 'underline' : '',
    props.delete ? 'line-through' : '',
    props.strong ? 'font-semibold' : '',
    props.italic ? 'italic' : '',
  ];

  return (
    <Show when={!editing()} fallback={props.multiline
      ? <textarea autofocus value={draft()} maxlength={editConfig().maxLength} class={['min-h-20 w-full rounded-control border border-primary bg-surface px-3 py-2 text-sm text-text outline-none ring-2 ring-primary/20', props.classNames?.textarea]} style={props.styles?.textarea} onInput={(event) => { draftValue = event.currentTarget.value; setDraft(draftValue); }} onBlur={finishEdit} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); finishEdit(); } }} />
      : <input autofocus value={draft()} maxlength={editConfig().maxLength} class={['h-8 min-w-0 rounded-control border border-primary bg-surface px-3 text-sm text-text outline-none ring-2 ring-primary/20', props.classNames?.textarea]} style={props.styles?.textarea} onInput={(event) => { draftValue = event.currentTarget.value; setDraft(draftValue); }} onBlur={finishEdit} onKeyDown={(event) => { if (event.key === 'Enter') finishEdit(); }} />}
    >
      <Dynamic
        {...others}
        component={props.component}
        href={props.component === 'a' && !props.disabled ? props.href : undefined}
        target={props.component === 'a' ? props.target : undefined}
        aria-disabled={props.disabled ? 'true' : undefined}
        class={['ads-typography', ...contentClass(), props.class, props.classNames?.root]}
        style={{ ...ellipsisStyle(), ...props.style, ...props.styles?.root }}
      >
        {props.children}
      </Dynamic>
      <Show when={(props.ellipsis && ellipsisConfig().expandable) || props.editable || props.copyable}>
        <span class={props.classNames?.actions} style={props.styles?.actions}>
          <Show when={props.ellipsis && ellipsisConfig().expandable}>
            <button type="button" class={['ml-1 bg-transparent text-primary hover:text-primary-hover', props.classNames?.action]} style={props.styles?.action} onClick={toggleExpanded}>{expandSymbol()}</button>
          </Show>
          <Show when={props.editable}>
            <button type="button" aria-label={config.locale().Text?.edit ?? 'Edit text'} class={['ml-1 bg-transparent text-primary hover:text-primary-hover disabled:text-text-disabled', props.classNames?.action]} style={props.styles?.action} disabled={props.disabled} onClick={startEdit}>{config.locale().Text?.edit ?? 'Edit'}</button>
          </Show>
          <Show when={props.copyable}>
            <button type="button" aria-label={copied() ? config.locale().Text?.copied ?? 'Copied' : config.locale().Text?.copy ?? 'Copy text'} class={['ml-1 bg-transparent text-primary hover:text-primary-hover', props.classNames?.action]} style={props.styles?.action} onClick={copy}>{copied() ? config.locale().Text?.copied ?? 'Copied' : config.locale().Text?.copy ?? 'Copy'}</button>
          </Show>
        </span>
      </Show>
    </Show>
  );
}

export function Text(props: TextProps) {
  return <TypographyBase {...props} component="span" />;
}

export function Paragraph(props: ParagraphProps) {
  return <TypographyBase {...props} component="p" multiline />;
}

export function Title(inputProps: TitleProps) {
  const props = merge({ level: 1 as const }, inputProps);
  const others = omit(props, 'level');
  const component = () => `h${props.level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  const sizeClass = () => props.level === 1 ? 'text-4xl leading-[1.25]' : props.level === 2 ? 'text-3xl leading-10' : props.level === 3 ? 'text-2xl leading-8' : props.level === 4 ? 'text-xl leading-7' : 'text-base leading-6';
  return <TypographyBase {...others} component={component()} class={['mb-2 mt-0 font-semibold', sizeClass(), props.class]} />;
}

export function Link(props: LinkProps) {
  return <TypographyBase {...props} component="a" class={['cursor-pointer text-primary hover:text-primary-hover', props.class]} />;
}

export const Typography = { Text, Paragraph, Title, Link };
