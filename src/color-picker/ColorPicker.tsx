import { createSignal, For, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { Popover } from '../popover';
import { useConfig } from '../config-provider';
import { useFormItemControl } from '../form/context';

export type ColorPickerSemanticName = 'root' | 'body' | 'content' | 'description' | 'popup.root';
export type ColorPickerSemanticClassNames = Partial<Record<ColorPickerSemanticName, string>>;
export type ColorPickerSemanticStyles = Partial<Record<ColorPickerSemanticName, JSX.CSSProperties>>;

export interface ColorValue {
  toHexString: () => string;
  toHex8String: () => string;
  toRgbString: () => string;
  toCssString: () => string;
  getAlpha: () => number;
}

export interface ColorPreset {
  label: JSX.Element;
  colors: readonly string[];
  defaultOpen?: boolean;
}

export interface ColorPickerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  defaultValue?: string;
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  allowClear?: boolean;
  disabledAlpha?: boolean;
  showText?: boolean | ((color: ColorValue) => JSX.Element);
  size?: 'small' | 'middle' | 'large';
  trigger?: 'click' | 'hover';
  presets?: readonly ColorPreset[];
  panelRender?: (panel: JSX.Element, extra: { components: { Picker: JSX.Element; Presets: JSX.Element } }) => JSX.Element;
  onChange?: (value: ColorValue, css: string) => void;
  onChangeComplete?: (value: ColorValue) => void;
  onClear?: () => void;
  onOpenChange?: (open: boolean) => void;
  classNames?: ColorPickerSemanticClassNames;
  styles?: ColorPickerSemanticStyles;
}

const normalizeHex = (input: string): string => {
  const value = input.trim().replace(/^#/, '');
  if (/^[0-9a-f]{3}$/i.test(value)) return `#${value.split('').map((part) => part + part).join('').toLowerCase()}`;
  if (/^[0-9a-f]{6}$/i.test(value)) return `#${value.toLowerCase()}`;
  if (/^[0-9a-f]{8}$/i.test(value)) return `#${value.slice(0, 6).toLowerCase()}`;
  return '#1677ff';
};
const inputAlpha = (input: string): number => {
  const value = input.trim().replace(/^#/, '');
  return /^[0-9a-f]{8}$/i.test(value) ? parseInt(value.slice(6), 16) / 255 : 1;
};

function createColor(hex: string, alpha: number): ColorValue {
  const normalized = normalizeHex(hex);
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  const clampedAlpha = Math.min(1, Math.max(0, alpha));
  const alphaHex = Math.round(clampedAlpha * 255).toString(16).padStart(2, '0');
  return {
    toHexString: () => normalized,
    toHex8String: () => `${normalized}${alphaHex}`,
    toRgbString: () => clampedAlpha < 1 ? `rgba(${r}, ${g}, ${b}, ${Number(clampedAlpha.toFixed(2))})` : `rgb(${r}, ${g}, ${b})`,
    toCssString: () => clampedAlpha < 1 ? `rgba(${r}, ${g}, ${b}, ${Number(clampedAlpha.toFixed(2))})` : normalized,
    getAlpha: () => clampedAlpha,
  };
}

export function ColorPicker(inputProps: ColorPickerProps) {
  const config = useConfig();
  const field = useFormItemControl();
  const props = merge({ defaultValue: '#1677ff', defaultOpen: false, size: undefined, trigger: 'click' as const }, config.componentDefaults('colorPicker') as Partial<ColorPickerProps>, inputProps);
  const [internalValue, setInternalValue] = createSignal(props.defaultValue, { ownedWrite: true });
  const [internalOpen, setInternalOpen] = createSignal(Boolean(props.defaultOpen), { ownedWrite: true });
  const [alpha, setAlpha] = createSignal(inputAlpha(props.defaultValue), { ownedWrite: true });
  const others = omit(props, 'value', 'defaultValue', 'open', 'defaultOpen', 'disabled', 'allowClear', 'disabledAlpha', 'showText', 'size', 'trigger', 'presets', 'panelRender', 'onChange', 'onChangeComplete', 'onClear', 'onOpenChange', 'classNames', 'styles', 'class', 'style');
  const value = () => props.value ?? (field?.value() !== undefined ? String(field.value()) : internalValue());
  const color = () => createColor(value(), props.disabledAlpha ? 1 : alpha());
  const disabled = () => props.disabled ?? field?.disabled() ?? false;
  const open = () => props.open ?? internalOpen();
  const size = () => props.size ?? config.componentSize();
  const setOpen = (next: boolean) => {
    if (disabled()) return;
    if (props.open === undefined) setInternalOpen(next);
    props.onOpenChange?.(next);
  };
  const commit = (hex: string, nextAlpha = alpha(), complete = false) => {
    const nextColor = createColor(hex, props.disabledAlpha ? 1 : nextAlpha);
    const css = nextColor.toCssString();
    const stored = nextColor.getAlpha() < 1 ? nextColor.toHex8String() : nextColor.toHexString();
    if (props.value === undefined) {
      if (field) field.setValue(stored);
      else setInternalValue(stored);
    }
    props.onChange?.(nextColor, css);
    if (complete) props.onChangeComplete?.(nextColor);
  };
  const clear = () => {
    if (props.value === undefined) {
      if (field) field.setValue('');
      else setInternalValue('');
    }
    props.onClear?.();
  };
  const picker = () => (
    <div class="space-y-3">
      <input aria-label="Color" type="color" value={color().toHexString()} class="h-32 w-full cursor-pointer rounded-control border border-border bg-surface p-1" onInput={(event) => commit(event.currentTarget.value)} onChange={(event) => commit(event.currentTarget.value, alpha(), true)} />
      <div class="flex items-center gap-2">
        <input aria-label="Hex color" value={color().toHexString()} class="h-8 min-w-0 flex-1 rounded-control border border-border bg-surface px-2 font-mono text-xs uppercase outline-none focus:border-primary" onChange={(event) => commit(event.currentTarget.value, alpha(), true)} />
        <Show when={!props.disabledAlpha}><input aria-label="Alpha" type="range" min="0" max="1" step="0.01" value={alpha()} class="w-20 accent-primary" onInput={(event) => { const next = Number(event.currentTarget.value); setAlpha(next); commit(value(), next); }} onChange={() => props.onChangeComplete?.(color())} /></Show>
      </div>
    </div>
  );
  const presets = () => (
    <Show when={props.presets?.length}>
      <div class="space-y-3 border-t border-border-secondary pt-3">
        <For each={props.presets}>{(preset) => (
          <div>
            <div class="mb-2 text-xs text-text-secondary">{preset.label}</div>
            <div class="flex flex-wrap gap-2">
              <For each={preset.colors}>{(presetColor) => (
                <button type="button" aria-label={`Select ${presetColor}`} class="size-6 rounded-small border border-border shadow-sm" style={{ 'background-color': presetColor }} onClick={() => commit(presetColor, 1, true)} />
              )}</For>
            </div>
          </div>
        )}</For>
      </div>
    </Show>
  );
  const panel = () => <div class="w-64 space-y-3 p-3">{picker()}{presets()}<Show when={props.allowClear}><button type="button" class="w-full rounded-control border border-border bg-surface py-1.5 text-sm text-text hover:border-primary hover:text-primary" onClick={clear}>Clear</button></Show></div>;
  const renderedPanel = () => props.panelRender?.(panel(), { components: { Picker: picker(), Presets: presets() } }) ?? panel();
  const text = () => typeof props.showText === 'function' ? props.showText(color()) : props.showText ? color().toHexString().toUpperCase() : undefined;
  const renderedPanelNode = renderedPanel();

  return (
    <Popover open={open()} trigger={props.trigger} placement="bottom-start" content={renderedPanelNode} classNames={{ root: props.classNames?.['popup.root'] }} styles={{ root: props.styles?.['popup.root'] }} onOpenChange={setOpen}>
      <div
        {...others}
        id={field?.id}
        role="button"
        tabindex={disabled() ? -1 : 0}
        aria-label={props['aria-label'] ?? 'Choose color'}
        aria-disabled={disabled() ? 'true' : undefined}
        class={['ads-color-picker inline-flex cursor-pointer items-center gap-2 rounded-control border border-border bg-surface px-2 text-sm text-text hover:border-primary', size() === 'small' ? 'h-6' : size() === 'large' ? 'h-10 text-base' : 'h-8', disabled() ? 'cursor-not-allowed bg-surface-container text-text-disabled' : '', props.class, props.classNames?.root]}
        style={{ ...(typeof props.style === 'object' ? props.style : {}), ...props.styles?.root }}
        onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setOpen(!open()); } }}
      >
        <span aria-hidden="true" class={['inline-flex size-5 rounded-small border border-border shadow-sm', props.classNames?.body]} style={props.styles?.body}><span class={['size-full rounded-[inherit]', props.classNames?.content]} style={{ 'background-color': color().toCssString(), ...props.styles?.content }} /></span>
        <Show when={text()}><span class={props.classNames?.description} style={props.styles?.description}>{text()}</span></Show>
      </div>
    </Popover>
  );
}
