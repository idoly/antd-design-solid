import { autoUpdate, computePosition, flip, offset, shift, size as floatingSize, type Placement } from '@floating-ui/dom';
import { createContext, createEffect, createSignal, createUniqueId, For, merge, omit, onCleanup, Show, useContext } from 'solid-js';
import { Portal } from '@solidjs/web';
import type { JSX } from '@solidjs/web';
import { tv } from 'tailwind-variants';
import { useConfig } from '../config-provider';
import { tokenToCssVariables } from '../config-provider/theme';
import { useFormItemControl } from '../form/context';
import type { RefSelectProps } from '../compat-types';
import { CheckIcon, CloseIcon, DownIcon } from '../_internal/icons';
import { createVirtualList } from '../_internal/virtual';
import type { VirtualItem } from '@tanstack/virtual-core';

const select = tv({
  slots: {
    root: 'ads-select relative inline-flex w-full min-w-0 cursor-pointer items-center rounded-control border border-border bg-surface text-sm text-text outline-none transition-[border-color,box-shadow] duration-[var(--ads-motion-fast)] hover:border-primary-hover focus-within:border-primary focus-within:shadow-[0_0_0_2px_color-mix(in_srgb,var(--ads-color-primary)_20%,transparent)]',
    selector: 'ads-select-selector relative flex min-w-0 flex-1 items-center gap-1 overflow-hidden px-[11px]',
    input: 'h-full min-w-0 flex-1 cursor-inherit border-0 bg-transparent p-0 text-sm text-text outline-none placeholder:text-text-disabled read-only:caret-transparent',
    dropdown: 'ads-select-dropdown z-[1050] overflow-y-auto rounded-control border border-border-secondary bg-surface p-1 text-sm text-text shadow-popup outline-none',
    option: 'flex min-h-8 cursor-pointer items-center justify-between gap-3 rounded-small px-2.5 py-1.5 outline-none transition-colors duration-[var(--ads-motion-fast)] hover:bg-surface-container',
    tag: 'ads-select-tag inline-flex h-5 max-w-[160px] shrink-0 items-center gap-1 rounded-small border border-border bg-surface-container px-1.5 text-xs',
  },
  variants: {
    size: {
      small: { root: 'min-h-6', selector: 'min-h-[22px]', input: 'h-[22px]' },
      middle: { root: 'min-h-8', selector: 'min-h-[30px]', input: 'h-[30px]' },
      large: { root: 'min-h-10 text-base', selector: 'min-h-[38px]', input: 'h-[38px] text-base' },
    },
    status: {
      error: { root: 'border-error hover:border-error focus-within:border-error focus-within:shadow-[0_0_0_2px_color-mix(in_srgb,var(--ads-color-error)_20%,transparent)]' },
      warning: { root: 'border-warning hover:border-warning focus-within:border-warning focus-within:shadow-[0_0_0_2px_color-mix(in_srgb,var(--ads-color-warning)_20%,transparent)]' },
    },
    disabled: {
      true: { root: 'pointer-events-none cursor-not-allowed bg-surface-container text-text-disabled' },
    },
    selected: {
      true: { option: 'bg-[#e6f4ff] font-semibold text-primary hover:bg-[#e6f4ff]' },
    },
    active: {
      true: { option: 'bg-surface-container' },
    },
    variant: {
      outlined: {},
      borderless: { root: 'border-transparent shadow-none hover:border-transparent focus-within:border-transparent focus-within:shadow-none' },
      filled: { root: 'border-transparent bg-surface-container hover:border-transparent' },
      underlined: { root: 'rounded-none border-x-0 border-t-0 shadow-none focus-within:shadow-none' },
    },
  },
  defaultVariants: { size: 'middle', variant: 'outlined' },
});

export type SelectValue = string | number;
export interface LabeledValue { key?: SelectValue; value: SelectValue; label?: JSX.Element }
export interface SelectFieldNames { label?: string; value?: string; options?: string; groupLabel?: string }

export interface SelectOption {
  value: SelectValue;
  label: JSX.Element;
  disabled?: boolean;
  title?: string;
  class?: string;
  group?: JSX.Element;
}

interface SelectRegistryValue { register: (option: SelectOption) => () => void }
const SelectRegistry = createContext<SelectRegistryValue | null>(null);
const SelectGroupContext = createContext<JSX.Element | null>(null);

export interface SelectOptionProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'value' | 'title'> {
  value: SelectValue;
  label?: JSX.Element;
  disabled?: boolean;
  title?: string;
}
export function SelectOptionComponent(props: SelectOptionProps) {
  const registry = useContext(SelectRegistry);
  const group = useContext(SelectGroupContext);
  let unregister: (() => void) | undefined;
  let cancelled = false;
  queueMicrotask(() => { if (!cancelled) unregister = registry?.register({ value: props.value, label: props.label ?? props.children, disabled: props.disabled, title: props.title, class: props.class as string | undefined, group: group ?? undefined }); });
  onCleanup(() => { cancelled = true; unregister?.(); });
  return null;
}
export interface SelectOptGroupProps { label: JSX.Element; children?: JSX.Element }
export function SelectOptGroup(props: SelectOptGroupProps) { return <SelectGroupContext value={props.label}>{props.children}</SelectGroupContext>; }

export type SelectSemanticName = 'root' | 'selector' | 'input' | 'dropdown' | 'option' | 'tag';
export type SelectSemanticClassNames = Partial<Record<SelectSemanticName, string>> | ((info: { props: SelectProps }) => Partial<Record<SelectSemanticName, string>>);
export type SelectSemanticStyles = Partial<Record<SelectSemanticName, JSX.CSSProperties>> | ((info: { props: SelectProps }) => Partial<Record<SelectSemanticName, JSX.CSSProperties>>);

export interface SelectProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onInput' | 'onSelect' | 'prefix' | 'value' | 'defaultValue' | 'ref'> {
  options?: readonly Record<string, any>[];
  children?: JSX.Element;
  value?: SelectValue | LabeledValue | readonly (SelectValue | LabeledValue)[];
  defaultValue?: SelectValue | LabeledValue | readonly (SelectValue | LabeledValue)[];
  mode?: 'multiple';
  placeholder?: JSX.Element;
  disabled?: boolean;
  loading?: boolean;
  loadingIcon?: JSX.Element;
  defaultActiveFirstOption?: boolean;
  listHeight?: number;
  virtual?: boolean;
  allowClear?: boolean;
  showSearch?: boolean;
  searchValue?: string;
  defaultSearchValue?: string;
  open?: boolean;
  defaultOpen?: boolean;
  size?: 'small' | 'middle' | 'large';
  status?: 'error' | 'warning';
  notFoundContent?: JSX.Element;
  maxTagCount?: number;
  maxCount?: number;
  maxTagTextLength?: number;
  maxTagPlaceholder?: JSX.Element | ((omitted: SelectOption[]) => JSX.Element);
  fieldNames?: SelectFieldNames;
  labelInValue?: boolean;
  tokenSeparators?: readonly string[];
  autoClearSearchValue?: boolean;
  prefix?: JSX.Element;
  suffixIcon?: JSX.Element;
  showArrow?: boolean;
  bordered?: boolean;
  variant?: 'outlined' | 'borderless' | 'filled' | 'underlined';
  clearIcon?: JSX.Element;
  removeIcon?: JSX.Element;
  popupClass?: string;
  popupClassName?: string;
  dropdownClassName?: string;
  popupStyle?: JSX.CSSProperties;
  dropdownStyle?: JSX.CSSProperties;
  popupMatchSelectWidth?: boolean | number;
  dropdownMatchSelectWidth?: boolean | number;
  popupRender?: (menu: JSX.Element) => JSX.Element;
  dropdownRender?: (menu: JSX.Element) => JSX.Element;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight' | Placement;
  classNames?: SelectSemanticClassNames;
  styles?: SelectSemanticStyles;
  getPopupContainer?: (trigger: HTMLElement) => HTMLElement;
  filterOption?: boolean | ((input: string, option: SelectOption) => boolean);
  filterSort?: (optionA: SelectOption, optionB: SelectOption, info: { searchValue: string }) => number;
  optionFilterProp?: string;
  optionLabelProp?: string;
  optionRender?: (option: SelectOption, info: { index: number }) => JSX.Element;
  labelRender?: (value: LabeledValue) => JSX.Element;
  tagRender?: (info: { label: JSX.Element; value: SelectValue; closable: boolean; onClose: (event?: Event) => void; option: SelectOption }) => JSX.Element;
  menuItemSelectedIcon?: JSX.Element | ((option: SelectOption) => JSX.Element);
  onChange?: (value: SelectValue | LabeledValue | (SelectValue | LabeledValue)[] | undefined, option: SelectOption | SelectOption[] | undefined) => void;
  onSelect?: (value: SelectValue | LabeledValue, option: SelectOption) => void;
  onDeselect?: (value: SelectValue | LabeledValue, option: SelectOption) => void;
  onClear?: () => void;
  onSearch?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  onDropdownVisibleChange?: (open: boolean) => void;
  onBlur?: (event: FocusEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onInputKeyDown?: (event: KeyboardEvent) => void;
  onPopupScroll?: JSX.EventHandler<HTMLDivElement, Event>;
  onActive?: (value: SelectValue, option: SelectOption) => void;
  ref?: (instance: RefSelectProps) => void;
}

const optionText = (option: SelectOption) => typeof option.label === 'string' || typeof option.label === 'number'
  ? String(option.label)
  : String(option.value);

export function Select(inputProps: SelectProps) {
  const config = useConfig();
  const field = useFormItemControl();
  const props = merge({ options: [] as readonly Record<string, any>[], size: undefined, defaultOpen: false, defaultSearchValue: '', autoClearSearchValue: true, defaultActiveFirstOption: true, listHeight: 256, notFoundContent: undefined as JSX.Element }, config.componentDefaults('select') as Partial<SelectProps>, inputProps);
  const [registeredOptions, setRegisteredOptions] = createSignal<readonly SelectOption[]>([], { ownedWrite: true });
  let currentRegistered: readonly SelectOption[] = [];
  const normalizeOptions = (items: readonly Record<string, any>[], inheritedGroup?: JSX.Element): SelectOption[] => {
    const names = { label: 'label', value: 'value', options: 'options', groupLabel: 'label', ...props.fieldNames };
    return items.flatMap((item) => {
      const children = item[names.options];
      if (Array.isArray(children)) return normalizeOptions(children, item[names.groupLabel] ?? item[names.label]);
      return [{ ...item, value: item[names.value] as SelectValue, label: item[names.label] as JSX.Element, group: inheritedGroup ?? item.group } as SelectOption];
    });
  };
  const options = () => props.options?.length ? normalizeOptions(props.options) : (registeredOptions(), [...currentRegistered]);
  const [internalValue, setInternalValue] = createSignal<SelectValue | LabeledValue | readonly (SelectValue | LabeledValue)[] | undefined>(props.defaultValue, { ownedWrite: true });
  const [internalOpen, setInternalOpen] = createSignal(Boolean(props.defaultOpen), { ownedWrite: true });
  const [internalSearch, setInternalSearch] = createSignal(props.defaultSearchValue, { ownedWrite: true });
  const [activeIndex, setActiveIndex] = createSignal(-1, { ownedWrite: true });
  const uid = createUniqueId();
  const listboxId = `${uid}-listbox`;
  let triggerRef: HTMLDivElement | undefined;
  let inputRef: HTMLInputElement | undefined;
  let dropdownRef: HTMLDivElement | undefined;
  props.ref?.({ focus: (options) => inputRef?.focus(options), blur: () => inputRef?.blur(), get nativeElement() { return triggerRef ?? null; } });

  const others = omit(
    props,
    'options', 'value', 'defaultValue', 'mode', 'placeholder', 'disabled', 'loading', 'loadingIcon', 'defaultActiveFirstOption', 'listHeight', 'virtual',
    'allowClear', 'showSearch', 'searchValue', 'defaultSearchValue', 'open', 'defaultOpen',
    'size', 'status', 'notFoundContent', 'maxTagCount', 'maxCount', 'maxTagTextLength', 'maxTagPlaceholder', 'fieldNames', 'labelInValue', 'tokenSeparators',
    'autoClearSearchValue', 'prefix', 'suffixIcon', 'showArrow', 'bordered', 'variant', 'clearIcon',
    'removeIcon', 'popupClass', 'popupClassName', 'dropdownClassName', 'popupStyle', 'dropdownStyle',
    'popupMatchSelectWidth', 'dropdownMatchSelectWidth', 'popupRender', 'dropdownRender', 'placement', 'classNames', 'styles',
    'getPopupContainer', 'filterOption', 'filterSort', 'optionFilterProp', 'optionLabelProp', 'optionRender', 'labelRender', 'tagRender', 'menuItemSelectedIcon', 'onChange', 'onSelect', 'onDeselect', 'onClear', 'onSearch',
    'onOpenChange', 'onDropdownVisibleChange', 'onBlur', 'onFocus', 'onInputKeyDown', 'onPopupScroll', 'onActive', 'onClick', 'class', 'children', 'aria-label', 'aria-labelledby',
    'aria-describedby', 'aria-invalid', 'id', 'ref', 'style',
  );
  const isDisabled = () => props.disabled ?? field?.disabled() ?? config.componentDisabled();
  const currentValue = () => {
    if (props.value !== undefined) return props.value;
    const fieldValue = field?.value();
    return fieldValue !== undefined ? fieldValue as SelectValue | LabeledValue | readonly (SelectValue | LabeledValue)[] : internalValue();
  };
  const rawValue = (value: SelectValue | LabeledValue): SelectValue => typeof value === 'object' ? value.value : value;
  const selectedValues = (): readonly SelectValue[] => {
    const current = currentValue();
    if (props.mode === 'multiple') return Array.isArray(current) ? current.map((value) => rawValue(value as SelectValue | LabeledValue)) : [];
    return current === undefined ? [] : [rawValue(current as SelectValue | LabeledValue)];
  };
  const outputValue = (value: SelectValue, option?: SelectOption): SelectValue | LabeledValue => props.labelInValue ? { key: value, value, label: option?.label ?? String(value) } : value;
  const outputValues = (values: readonly SelectValue[]) => values.map((value) => outputValue(value, options().find((option) => option.value === value)));
  const selectedOptions = () => selectedValues().map((value) => options().find((option) => option.value === value)).filter((option): option is SelectOption => Boolean(option));
  const isOpen = () => props.open ?? internalOpen();
  const search = () => props.searchValue ?? internalSearch();
  const status = (): SelectProps['status'] => props.status ?? (field?.status() === 'error' ? 'error' : field?.status() === 'warning' ? 'warning' : undefined);
  const size = () => props.size ?? config.componentSize();
  const filteredOptions = () => {
    const query = search().trim().toLocaleLowerCase();
    let result = options();
    if (props.showSearch && query && props.filterOption !== false) {
      const filter = props.filterOption;
      result = typeof filter === 'function' ? result.filter((option) => filter(search(), option)) : result.filter((option) => optionText(option).toLocaleLowerCase().includes(query));
    }
    if (props.optionFilterProp && props.showSearch && query && props.filterOption === undefined) result = options().filter((option) => String((option as Record<string, any>)[props.optionFilterProp!] ?? '').toLocaleLowerCase().includes(query));
    return props.filterSort ? [...result].sort((left, right) => props.filterSort!(left, right, { searchValue: search() })) : result;
  };
  const virtualEnabled = () => (props.virtual ?? config.virtual()) && filteredOptions().length > 40;
  const virtual = createVirtualList({ count: () => filteredOptions().length, getScrollElement: () => dropdownRef ?? null, estimateSize: () => 32, viewportSize: () => props.listHeight, enabled: virtualEnabled, overscan: 8, getItemKey: (index) => filteredOptions()[index]?.value ?? index });
  const optionCache = new Map<SelectValue, { option: SelectOption; index: number; virtual: VirtualItem | undefined }>();
  const cachedOption = (option: SelectOption, index: number, item?: VirtualItem) => {
    const current = optionCache.get(option.value) ?? { option, index, virtual: item };
    Object.assign(current, { option, index, virtual: item });
    optionCache.set(option.value, current);
    return current;
  };
  const renderedOptions = () => virtualEnabled()
    ? virtual.items().map((item) => cachedOption(filteredOptions()[item.index], item.index, item))
    : filteredOptions().map((option, index) => cachedOption(option, index));
  const virtualPaddingTop = () => virtualEnabled() ? (virtual.items()[0]?.start ?? 0) : 0;
  const virtualPaddingBottom = () => virtualEnabled() ? Math.max(0, virtual.totalSize() - (virtual.items().at(-1)?.end ?? 0)) : 0;
  const visibleTags = () => selectedOptions().slice(0, props.maxTagCount ?? selectedOptions().length);
  const displayLabel = (option: SelectOption) => props.optionLabelProp ? (option as Record<string, any>)[props.optionLabelProp] ?? option.label : option.label;
  const tagLabel = (option: SelectOption) => typeof displayLabel(option) === 'string' && props.maxTagTextLength !== undefined ? String(displayLabel(option)).slice(0, props.maxTagTextLength) : displayLabel(option);
  const omittedTags = () => selectedOptions().slice(visibleTags().length);
  const hiddenTagCount = () => omittedTags().length;
  const hasValue = () => selectedValues().length > 0;
  const styles = () => select({ size: size(), status: status(), disabled: isDisabled(), variant: props.bordered === false ? 'borderless' : props.variant ?? field?.variant() ?? config.variant() ?? 'outlined' });
  const rootTokenStyle = (): JSX.CSSProperties => {
    const suffix = size() === 'small' ? '-sm' : size() === 'large' ? '-lg' : '';
    return { 'min-height': `var(--ads-select-control-height${suffix}, ${size() === 'small' ? '24px' : size() === 'large' ? '40px' : '32px'})`, 'background-color': 'var(--ads-select-selector-bg, var(--ads-color-surface))' };
  };
  const semanticClasses = () => typeof props.classNames === 'function' ? props.classNames({ props }) : props.classNames ?? {};
  const semanticStyles = () => typeof props.styles === 'function' ? props.styles({ props }) : props.styles ?? {};

  const activate = (index: number) => {
    setActiveIndex(index);
    if (virtualEnabled() && index >= 0) virtual.scrollToIndex(index);
    const option = filteredOptions()[index];
    if (option) props.onActive?.(option.value, option);
  };
  const setOpen = (next: boolean) => {
    if (isDisabled() || next === isOpen()) return;
    if (props.open === undefined) setInternalOpen(next);
    props.onOpenChange?.(next);
    props.onDropdownVisibleChange?.(next);
    if (next) {
      const selectedIndex = filteredOptions().findIndex((option) => selectedValues().includes(option.value) && !option.disabled);
      const first = props.defaultActiveFirstOption ? filteredOptions().findIndex((option) => !option.disabled) : -1;
      activate(selectedIndex >= 0 ? selectedIndex : first);
    } else {
      setActiveIndex(-1);
      if (props.searchValue === undefined) setInternalSearch('');
    }
  };
  const setSearch = (input: string) => {
    let next = input;
    if (props.mode === 'multiple' && props.tokenSeparators?.some((separator) => input.includes(separator))) {
      const escaped = props.tokenSeparators.map((separator) => separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
      const parts = input.split(new RegExp(escaped, 'g'));
      const matched = parts.slice(0, -1).map((token) => token.trim()).filter(Boolean).map((token) => options().find((option) => String(option.value) === token || optionText(option).toLocaleLowerCase() === token.toLocaleLowerCase())).filter((option): option is SelectOption => Boolean(option && !option.disabled));
      const available = props.maxCount === undefined ? Infinity : Math.max(0, props.maxCount - selectedValues().length);
      const added = matched.filter((option) => !selectedValues().includes(option.value)).slice(0, available);
      if (added.length) {
        const values = [...new Set([...selectedValues(), ...added.map((option) => option.value)])];
        commit(outputValues(values), options().filter((option) => values.includes(option.value)));
        added.forEach((option) => props.onSelect?.(outputValue(option.value, option), option));
      }
      next = parts.at(-1) ?? '';
    }
    if (props.searchValue === undefined) setInternalSearch(next);
    props.onSearch?.(next);
    activate(props.defaultActiveFirstOption ? filteredOptions().findIndex((option) => !option.disabled) : -1);
  };
  const commit = (next: SelectValue | LabeledValue | (SelectValue | LabeledValue)[] | undefined, option: SelectOption | SelectOption[] | undefined) => {
    if (props.value === undefined) {
      if (field) field.setValue(next);
      else setInternalValue(next);
    }
    props.onChange?.(next, option);
  };
  const choose = (option: SelectOption) => {
    if (option.disabled) return;
    if (props.mode === 'multiple') {
      const values = selectedValues();
      const selected = values.includes(option.value);
      if (!selected && props.maxCount !== undefined && values.length >= props.maxCount) return;
      const next = selected ? values.filter((value) => value !== option.value) : [...values, option.value];
      commit(outputValues(next), options().filter((item) => next.includes(item.value)));
      if (selected) props.onDeselect?.(outputValue(option.value, option), option);
      else props.onSelect?.(outputValue(option.value, option), option);
      if (props.autoClearSearchValue) setSearch('');
    } else {
      commit(outputValue(option.value, option), option);
      props.onSelect?.(outputValue(option.value, option), option);
      setOpen(false);
    }
    inputRef?.focus();
  };
  const remove = (value: SelectValue) => {
    const option = options().find((item) => item.value === value);
    const next = selectedValues().filter((item) => item !== value);
    commit(outputValues(next), options().filter((item) => next.includes(item.value)));
    if (option) props.onDeselect?.(outputValue(value, option), option);
  };
  const clear = () => {
    commit(props.mode === 'multiple' ? [] : undefined, props.mode === 'multiple' ? [] : undefined);
    props.onClear?.();
    setSearch('');
    inputRef?.focus();
  };
  const moveActive = (direction: 1 | -1) => {
    const options = filteredOptions();
    if (options.length === 0) return;
    let next = activeIndex();
    for (let step = 0; step < options.length; step += 1) {
      next = (next + direction + options.length) % options.length;
      if (!options[next].disabled) {
        activate(next);
        queueMicrotask(() => document.getElementById(`${uid}-option-${next}`)?.scrollIntoView({ block: 'nearest' }));
        return;
      }
    }
  };

  const handleKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (event) => {
    if (isDisabled()) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen()) setOpen(true);
      else moveActive(event.key === 'ArrowDown' ? 1 : -1);
      return;
    }
    if (event.key === 'Enter' && isOpen()) {
      event.preventDefault();
      const option = filteredOptions()[activeIndex()];
      if (option) choose(option);
      return;
    }
    if (event.key === 'Escape' && isOpen()) {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key === 'Tab') setOpen(false);
    if (event.key === 'Backspace' && props.mode === 'multiple' && !search() && selectedValues().length > 0) {
      remove(selectedValues()[selectedValues().length - 1]);
    }
  };

  createEffect(
    () => isOpen(),
    (open) => {
      if (!open) return;
      let cleanupPosition: (() => void) | undefined;
      let cancelled = false;
      const handlePointerDown = (event: PointerEvent) => {
        const target = event.target as Node;
        if (!triggerRef?.contains(target) && !dropdownRef?.contains(target)) setOpen(false);
      };
      document.addEventListener('pointerdown', handlePointerDown);
      queueMicrotask(() => {
        if (cancelled || !triggerRef || !dropdownRef) return;
        cleanupPosition = autoUpdate(triggerRef, dropdownRef, () => {
          if (!triggerRef || !dropdownRef) return;
          void computePosition(triggerRef, dropdownRef, {
            strategy: 'fixed',
            placement: ({ bottomLeft: 'bottom-start', bottomRight: 'bottom-end', topLeft: 'top-start', topRight: 'top-end' } as Record<string, Placement>)[props.placement ?? 'bottomLeft'] ?? props.placement as Placement,
            middleware: [
              offset(4),
              flip({ padding: 8 }),
              shift({ padding: 8 }),
              floatingSize({
                padding: 8,
                apply({ rects, availableHeight, elements }) {
                  Object.assign(elements.floating.style, {
                    width: props.popupMatchSelectWidth === false || props.dropdownMatchSelectWidth === false ? undefined : typeof (props.popupMatchSelectWidth ?? props.dropdownMatchSelectWidth) === 'number' ? `${props.popupMatchSelectWidth ?? props.dropdownMatchSelectWidth}px` : `${rects.reference.width}px`,
                    maxHeight: `${Math.max(80, Math.min(availableHeight, props.listHeight))}px`,
                  });
                },
              }),
            ],
          }).then(({ x, y }) => {
            if (dropdownRef) Object.assign(dropdownRef.style, { left: `${x}px`, top: `${y}px` });
          });
        });
      });
      return () => {
        cancelled = true;
        cleanupPosition?.();
        document.removeEventListener('pointerdown', handlePointerDown);
      };
    },
  );

  const menu = () => (
    <Show when={filteredOptions().length > 0} fallback={<div class="px-3 py-2 text-center text-text-disabled">{props.notFoundContent ?? config.renderEmpty()?.('Select') ?? config.locale().Select?.notFoundContent ?? 'Not Found'}</div>}>
      <Show when={virtualPaddingTop() > 0}><div aria-hidden="true" style={{ height: `${virtualPaddingTop()}px` }} /></Show>
      <For each={renderedOptions()}>{(entry) => {
        const option = entry.option;
        const index = () => entry.index;
        const selected = () => selectedValues().includes(option.value);
        const showGroup = () => option.group !== undefined && (index() === 0 || filteredOptions()[index() - 1]?.group !== option.group);
        return <div data-index={entry.virtual?.index}><Show when={showGroup()}><div role="presentation" class="px-2.5 py-1 text-xs font-semibold text-text-disabled">{option.group}</div></Show><div id={`${uid}-option-${index()}`} role="option" aria-selected={selected() ? 'true' : 'false'} aria-disabled={option.disabled ? 'true' : undefined} data-active={activeIndex() === index() ? 'true' : undefined} title={option.title} class={select({ selected: selected(), active: activeIndex() === index() }).option({ class: [semanticClasses().option, option.disabled ? 'pointer-events-none text-text-disabled' : '', option.class] })} style={semanticStyles().option} onPointerMove={() => { if (!option.disabled && activeIndex() !== index()) activate(index()); }} onPointerDown={(event) => event.preventDefault()} onClick={() => choose(option)}><span class="min-w-0 flex-1 truncate">{props.optionRender?.(option, { index: index() }) ?? option.label}</span><Show when={selected()}><span aria-hidden="true" class="shrink-0 text-primary">{typeof props.menuItemSelectedIcon === 'function' ? props.menuItemSelectedIcon(option) : props.menuItemSelectedIcon ?? <CheckIcon />}</span></Show></div></div>;
      }}</For>
      <Show when={virtualPaddingBottom() > 0}><div aria-hidden="true" style={{ height: `${virtualPaddingBottom()}px` }} /></Show>
    </Show>
  );

  const dropdown = () => (
    <Show when={isOpen()}>
      <Portal mount={triggerRef && props.getPopupContainer?.(triggerRef)}>
        <div
          ref={dropdownRef}
          id={listboxId}
          role="listbox"
          aria-multiselectable={props.mode === 'multiple' ? 'true' : undefined}
          class={styles().dropdown({ class: ['ads-root ads-select-theme fixed', config.themeScopeClass(), semanticClasses().dropdown, props.popupClass, props.popupClassName, props.dropdownClassName] })}
          style={{
            ...tokenToCssVariables(config.theme()),
            ...semanticStyles().dropdown,
            ...props.dropdownStyle,
            ...props.popupStyle,
            'font-family': 'var(--ads-font-family)',
          }}
          onScroll={props.onPopupScroll}
        >
          {(props.popupRender ?? props.dropdownRender)?.(menu()) ?? menu()}
        </div>
      </Portal>
    </Show>
  );

  const registry: SelectRegistryValue = { register(option) { currentRegistered = [...currentRegistered.filter((item) => item.value !== option.value), option]; setRegisteredOptions(currentRegistered); return () => { currentRegistered = currentRegistered.filter((item) => item !== option); setRegisteredOptions(currentRegistered); }; } };

  return (
    <>
      <SelectRegistry value={registry}><div hidden>{props.children}</div></SelectRegistry>
      <div
        {...others}
        ref={triggerRef}
        data-status={status()}
        data-disabled={isDisabled() ? 'true' : undefined}
        class={styles().root({ class: [semanticClasses().root, props.class as string | undefined] })} style={{ ...rootTokenStyle(), ...semanticStyles().root, ...(props.style && typeof props.style === 'object' ? props.style as JSX.CSSProperties : {}) }}
        onClick={(event) => {
          if (!isDisabled()) {
            inputRef?.focus();
            setOpen(true);
          }
          if (typeof props.onClick === 'function') props.onClick(event);
        }}
      >
        <div class={styles().selector({ class: semanticClasses().selector })} style={semanticStyles().selector}>
          <Show when={props.prefix}><span class="inline-flex shrink-0">{props.prefix}</span></Show>
          <Show when={props.mode === 'multiple'}>
            <For each={visibleTags()}>{(option) => {
              const close = (event?: Event) => { event?.stopPropagation(); remove(option.value); };
              return props.tagRender?.({ label: tagLabel(option), value: option.value, closable: true, onClose: close, option }) ?? <span class={styles().tag({ class: semanticClasses().tag })} style={semanticStyles().tag}><span class="truncate">{tagLabel(option)}</span><button type="button" aria-label={`Remove ${optionText(option)}`} class="inline-flex size-3 shrink-0 items-center justify-center bg-transparent text-text-secondary hover:text-text" onPointerDown={(event) => event.preventDefault()} onClick={close}>{props.removeIcon ?? <CloseIcon />}</button></span>;
            }}</For>
            <Show when={hiddenTagCount() > 0}><span class="shrink-0 text-xs text-text-secondary">{typeof props.maxTagPlaceholder === 'function' ? props.maxTagPlaceholder(omittedTags()) : props.maxTagPlaceholder ?? `+${hiddenTagCount()}`}</span></Show>
          </Show>
          <Show when={props.mode !== 'multiple' && hasValue() && !search()}>
            <span class="pointer-events-none absolute min-w-0 max-w-[calc(100%_-_56px)] truncate">{selectedOptions()[0] ? props.labelRender?.({ value: selectedOptions()[0].value, label: displayLabel(selectedOptions()[0]), key: selectedOptions()[0].value }) ?? displayLabel(selectedOptions()[0]) : String(selectedValues()[0])}</span>
          </Show>
          <Show when={!hasValue() && !search()}>
            <span class="pointer-events-none absolute truncate text-text-disabled">{props.placeholder}</span>
          </Show>
          <input
            ref={inputRef}
            id={props.id ?? field?.id}
            role="combobox"
            type="text"
            value={search()}
            readonly={!props.showSearch}
            disabled={isDisabled()}
            aria-label={props['aria-label']}
            aria-labelledby={props['aria-labelledby']}
            aria-describedby={props['aria-describedby'] ?? field?.describedBy()}
            aria-invalid={props['aria-invalid'] ?? (status() === 'error' ? 'true' : undefined)}
            aria-controls={listboxId}
            aria-expanded={isOpen() ? 'true' : 'false'}
            aria-autocomplete={props.showSearch ? 'list' : 'none'}
            aria-activedescendant={isOpen() && activeIndex() >= 0 ? `${uid}-option-${activeIndex()}` : undefined}
            autocomplete="off"
            class={styles().input({ class: semanticClasses().input })}
            style={semanticStyles().input}
            onInput={(event) => setSearch(event.currentTarget.value)}
            onKeyDown={(event) => { props.onInputKeyDown?.(event); if (!event.defaultPrevented) handleKeyDown(event); }}
            onFocus={(event) => props.onFocus?.(event)}
            onBlur={(event) => {
              queueMicrotask(() => {
                if (!triggerRef?.contains(document.activeElement) && !dropdownRef?.contains(document.activeElement)) setOpen(false);
              });
              if (field) void field.validate('onBlur');
              props.onBlur?.(event);
            }}
          />
        </div>
        <Show when={props.allowClear && hasValue() && !isDisabled()}>
          <button
            type="button"
            aria-label="Clear selection"
            class="mr-1 inline-flex size-6 shrink-0 items-center justify-center rounded-small bg-transparent text-text-disabled hover:text-text-secondary"
            onPointerDown={(event) => event.preventDefault()}
            onClick={(event) => { event.stopPropagation(); clear(); }}
          >
            {props.clearIcon ?? <CloseIcon />}
          </button>
        </Show>
        <Show when={props.loading || props.showArrow !== false}><span aria-hidden="true" class="mr-2 inline-flex size-4 shrink-0 items-center justify-center text-xs text-text-disabled">
          {props.loading ? props.loadingIcon ?? <span class="ads-spin size-3 rounded-full border border-current border-r-transparent" /> : props.suffixIcon ?? <DownIcon />}
        </span></Show>
      </div>
      {dropdown()}
    </>
  );
}
