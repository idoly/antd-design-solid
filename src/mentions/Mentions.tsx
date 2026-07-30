import { createContext, createSignal, For, merge, omit, onCleanup, Show, useContext } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { CloseIcon } from '../_internal/icons';
import { useConfig } from '../config-provider';
import { Popover } from '../popover';
import { useFormItemControl } from '../form/context';

export type MentionsSemanticName = 'root' | 'textarea' | 'suffix' | 'popup';
export type MentionsSemanticClassNames = Partial<Record<MentionsSemanticName, string>>;
export type MentionsSemanticStyles = Partial<Record<MentionsSemanticName, JSX.CSSProperties>>;

export interface MentionOption {
  key?: string | number;
  value: string;
  label?: JSX.Element;
  disabled?: boolean;
  class?: string;
}

interface MentionRegistryValue { register: (option: MentionOption) => () => void }
const MentionRegistry = createContext<MentionRegistryValue | null>(null);
export interface MentionOptionProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'value'> { value: string; label?: JSX.Element; disabled?: boolean }
export function MentionOptionComponent(props: MentionOptionProps) {
  const registry = useContext(MentionRegistry);
  let unregister: (() => void) | undefined;
  let cancelled = false;
  queueMicrotask(() => { if (!cancelled) unregister = registry?.register({ value: props.value, label: props.label ?? props.children, disabled: props.disabled, class: props.class as string | undefined }); });
  onCleanup(() => { cancelled = true; unregister?.(); });
  return null;
}

export interface MentionsClearConfig { clearIcon?: JSX.Element; disabled?: boolean }

export interface MentionsProps extends Omit<JSX.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'onSelect' | 'prefix'> {
  options?: readonly MentionOption[];
  children?: JSX.Element;
  prefix?: string | readonly string[];
  split?: string;
  placement?: 'top' | 'bottom';
  status?: 'error' | 'warning';
  loading?: boolean;
  allowClear?: boolean | MentionsClearConfig;
  notFoundContent?: JSX.Element;
  filterOption?: false | ((input: string, option: MentionOption) => boolean);
  validateSearch?: (text: string, props: MentionsProps) => boolean;
  onChange?: (text: string) => void;
  onSelect?: (option: MentionOption, prefix: string) => void;
  onSearch?: (text: string, prefix: string) => void;
  classNames?: MentionsSemanticClassNames;
  styles?: MentionsSemanticStyles;
}

interface SearchState { text: string; prefix: string; start: number; end: number }

export function Mentions(inputProps: MentionsProps) {
  const config = useConfig();
  const props = merge({ options: [] as readonly MentionOption[], prefix: '@' as string | readonly string[], split: ' ', placement: 'bottom' as const, rows: 3, notFoundContent: 'Not Found' as JSX.Element }, config.componentDefaults('mentions') as Partial<MentionsProps>, inputProps);
  const field = useFormItemControl();
  const [registeredOptions, setRegisteredOptions] = createSignal<readonly MentionOption[]>([], { ownedWrite: true });
  let currentRegistered: readonly MentionOption[] = [];
  const options = () => props.options?.length ? props.options : (registeredOptions(), currentRegistered);
  const [internalValue, setInternalValue] = createSignal(String(props.defaultValue ?? ''), { ownedWrite: true });
  const [search, setSearch] = createSignal<SearchState | undefined>(undefined, { ownedWrite: true });
  const [activeIndex, setActiveIndex] = createSignal(0, { ownedWrite: true });
  let textareaRef: HTMLTextAreaElement | undefined;
  let currentText = String(props.defaultValue ?? '');
  const others = omit(props, 'options', 'prefix', 'split', 'placement', 'status', 'loading', 'allowClear', 'notFoundContent', 'filterOption', 'validateSearch', 'onChange', 'onSelect', 'onSearch', 'classNames', 'styles', 'children', 'class', 'style', 'value', 'defaultValue', 'aria-invalid', 'aria-describedby');
  const value = () => props.value !== undefined ? String(props.value) : field?.value() !== undefined ? String(field.value()) : internalValue();
  const prefixes = () => Array.isArray(props.prefix) ? props.prefix : [props.prefix];
  const status = (): MentionsProps['status'] => props.status ?? (field?.status() === 'error' ? 'error' : field?.status() === 'warning' ? 'warning' : undefined);
  const disabled = () => props.disabled ?? field?.disabled() ?? false;
  const filtered = () => {
    const state = search();
    if (!state) return [];
    if (props.filterOption === false) return options();
    const filter = props.filterOption;
    if (typeof filter === 'function') return options().filter((option) => filter(state.text, option));
    return options().filter((option) => option.value.toLocaleLowerCase().includes(state.text.toLocaleLowerCase()));
  };
  const commit = (text: string) => {
    currentText = text;
    if (props.value === undefined) {
      if (field) field.setValue(text);
      else setInternalValue(text);
    }
    props.onChange?.(text);
  };
  const findSearch = (text: string, caret: number): SearchState | undefined => {
    let best: SearchState | undefined;
    for (const prefix of prefixes()) {
      const start = text.lastIndexOf(prefix, caret - 1);
      if (start < 0) continue;
      const query = text.slice(start + prefix.length, caret);
      if (query.includes(props.split) || /\s/.test(query) && props.split !== '') continue;
      if (!props.validateSearch || props.validateSearch(query, props)) {
        const state = { text: query, prefix, start, end: caret };
        if (!best || start > best.start) best = state;
      }
    }
    return best;
  };
  const updateSearch = (text: string, caret: number) => {
    const state = findSearch(text, caret);
    setSearch(state);
    setActiveIndex(0);
    if (state) props.onSearch?.(state.text, state.prefix);
  };
  const choose = (option: MentionOption) => {
    const state = search();
    if (!state || option.disabled) return;
    const next = `${currentText.slice(0, state.start)}${state.prefix}${option.value}${props.split}${currentText.slice(state.end)}`;
    commit(next);
    setSearch(undefined);
    props.onSelect?.(option, state.prefix);
    queueMicrotask(() => {
      const caret = state.start + state.prefix.length + option.value.length + props.split.length;
      textareaRef?.focus();
      textareaRef?.setSelectionRange(caret, caret);
    });
  };
  const keyDown: JSX.EventHandler<HTMLTextAreaElement, KeyboardEvent> = (event) => {
    const options = filtered();
    if (!search() || options.length === 0) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((activeIndex() + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length);
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const option = options[activeIndex()];
      if (option) choose(option);
    }
    if (event.key === 'Escape') setSearch(undefined);
  };
  const content = () => (
    <div role="listbox" class="max-h-56 min-w-40 overflow-y-auto p-1">
      <Show when={!props.loading} fallback={<div class="flex justify-center p-3"><span class="ads-spin size-4 rounded-full border-2 border-primary border-r-transparent" /></div>}>
        <Show when={filtered().length > 0} fallback={<div class="px-3 py-2 text-center text-text-disabled">{props.notFoundContent}</div>}>
          <For each={filtered()}>{(option, index) => <button type="button" role="option" aria-selected={activeIndex() === index() ? 'true' : 'false'} disabled={option.disabled} class={['flex min-h-8 w-full items-center rounded-small px-3 text-left text-sm hover:bg-surface-container disabled:text-text-disabled', activeIndex() === index() ? 'bg-surface-container' : '', option.class]} onPointerDown={(event) => event.preventDefault()} onClick={() => choose(option)}>{option.label ?? option.value}</button>}</For>
        </Show>
      </Show>
    </div>
  );

  const registry: MentionRegistryValue = { register(option) { currentRegistered = [...currentRegistered.filter((item) => item.value !== option.value), option]; setRegisteredOptions(currentRegistered); return () => { currentRegistered = currentRegistered.filter((item) => item !== option); setRegisteredOptions(currentRegistered); }; } };

  return (
    <>
    <MentionRegistry value={registry}><div hidden>{props.children}</div></MentionRegistry>
    <Popover open={Boolean(search())} trigger={[]} placement={props.placement === 'top' ? 'top-start' : 'bottom-start'} content={content()} classNames={{ root: props.classNames?.popup }} styles={{ root: props.styles?.popup }}>
      <div class={['ads-mentions relative inline-flex w-full', props.classNames?.root]} style={{ ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}>
      <textarea
        {...others}
        ref={textareaRef}
        id={props.id ?? field?.id}
        value={value()}
        disabled={disabled()}
        aria-invalid={props['aria-invalid'] ?? (status() === 'error' ? 'true' : undefined)}
        aria-describedby={props['aria-describedby'] ?? field?.describedBy()}
        aria-autocomplete="list"
        class={[
          'ads-mentions w-full resize-y rounded-control border border-border bg-surface px-3 py-2 text-sm text-text outline-none placeholder:text-text-disabled hover:border-primary-hover focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-surface-container',
          status() === 'error' ? 'border-error' : status() === 'warning' ? 'border-warning' : '',
          props.class,
          props.classNames?.textarea,
        ]}
        style={props.styles?.textarea}
        onInput={(event) => { commit(event.currentTarget.value); updateSearch(currentText, event.currentTarget.selectionStart ?? currentText.length); }}
        onClick={(event) => updateSearch(event.currentTarget.value, event.currentTarget.selectionStart ?? event.currentTarget.value.length)}
        onKeyDown={keyDown}
        onBlur={() => { if (field) void field.validate('onBlur'); }}
      />
      <Show when={props.allowClear && value()}>
        <span class={['absolute right-2 top-1/2 inline-flex -translate-y-1/2', props.classNames?.suffix]} style={props.styles?.suffix}>
          <button type="button" aria-label="Clear" disabled={disabled() || (typeof props.allowClear === 'object' && props.allowClear.disabled)} class="inline-flex size-5 items-center justify-center text-text-disabled hover:text-text" onPointerDown={(event) => event.preventDefault()} onClick={() => commit('')}>{typeof props.allowClear === 'object' ? props.allowClear.clearIcon ?? <CloseIcon /> : <CloseIcon />}</button>
        </span>
      </Show>
      </div>
    </Popover>
    </>
  );
}

Mentions.getMentions = (value = '', config: { prefix?: string | readonly string[]; split?: string } = {}) => {
  const prefixes = Array.isArray(config.prefix) ? config.prefix : [config.prefix ?? '@'];
  const split = config.split ?? ' ';
  return value.split(split).flatMap((part) => prefixes.flatMap((prefix) => part.startsWith(prefix) && part.length > prefix.length ? [{ prefix, value: part.slice(prefix.length) }] : []));
};
