import { autoUpdate, computePosition, flip, offset, shift, type Placement } from '@floating-ui/dom';
import { createEffect, createSignal, For, merge, Show } from 'solid-js';
import { Portal } from '@solidjs/web';
import type { JSX } from '@solidjs/web';
import { CloseIcon } from '../_internal/icons';
import { useConfig } from '../config-provider';
import { tokenToCssVariables } from '../config-provider/theme';

export type TourSemanticName = 'root' | 'mask' | 'section' | 'cover' | 'close' | 'header' | 'title' | 'description' | 'footer' | 'actions' | 'indicators' | 'indicator';
export type TourSemanticClassNames = Partial<Record<TourSemanticName, string>>;
export type TourSemanticStyles = Partial<Record<TourSemanticName, JSX.CSSProperties>>;

export interface TourButtonProps { children?: JSX.Element; onClick?: () => void }
export interface TourStep {
  target?: HTMLElement | null | (() => HTMLElement | null);
  title?: JSX.Element;
  description?: JSX.Element;
  cover?: JSX.Element;
  placement?: Placement | 'center';
  type?: 'default' | 'primary';
  mask?: boolean;
  nextButtonProps?: TourButtonProps;
  prevButtonProps?: TourButtonProps;
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions;
  className?: string;
}
export interface TourProps {
  steps: readonly TourStep[];
  open?: boolean;
  defaultOpen?: boolean;
  current?: number;
  defaultCurrent?: number;
  placement?: Placement | 'center';
  type?: 'default' | 'primary';
  mask?: boolean;
  arrow?: boolean;
  gap?: { offset?: number; radius?: number };
  zIndex?: number;
  disabledInteraction?: boolean;
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions;
  indicatorsRender?: (current: number, total: number) => JSX.Element;
  actionsRender?: (originNode: JSX.Element, info: { current: number; total: number }) => JSX.Element;
  onChange?: (current: number) => void;
  onClose?: (current: number) => void;
  onFinish?: () => void;
  classNames?: TourSemanticClassNames;
  styles?: TourSemanticStyles;
}

interface Rect { top: number; left: number; right: number; bottom: number; width: number; height: number }
const emptyRect: Rect = { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 };

export function Tour(inputProps: TourProps) {
  const config = useConfig();
  const props = merge({ defaultOpen: false, defaultCurrent: 0, placement: 'bottom' as const, type: 'default' as const, mask: true, arrow: true, gap: { offset: 6, radius: 4 }, zIndex: 1001, scrollIntoViewOptions: true }, config.componentDefaults('tour') as Partial<TourProps>, inputProps);
  const [internalOpen, setInternalOpen] = createSignal(props.defaultOpen, { ownedWrite: true });
  const [internalCurrent, setInternalCurrent] = createSignal(props.defaultCurrent, { ownedWrite: true });
  const [rect, setRect] = createSignal<Rect>(emptyRect, { ownedWrite: true });
  let panelRef: HTMLDivElement | undefined;
  let currentSnapshot = props.defaultCurrent;
  const isOpen = () => props.open ?? internalOpen();
  const current = () => props.current ?? (internalCurrent(), currentSnapshot);
  const step = () => props.steps[current()];
  const target = () => { const value = step()?.target; return typeof value === 'function' ? value() : value ?? null; };
  const placement = () => step()?.placement ?? props.placement;
  const hasMask = () => step()?.mask ?? props.mask;
  const close = () => { if (props.open === undefined) setInternalOpen(false); props.onClose?.(current()); };
  const go = (next: number) => {
    if (next >= props.steps.length) { props.onFinish?.(); close(); return; }
    currentSnapshot = Math.max(0, next);
    if (props.current === undefined) setInternalCurrent(currentSnapshot);
    props.onChange?.(currentSnapshot);
  };
  const next = () => { step()?.nextButtonProps?.onClick?.(); go(current() + 1); };
  const previous = () => { step()?.prevButtonProps?.onClick?.(); go(current() - 1); };

  createEffect(
    () => [isOpen(), current(), target()] as const,
    ([open, index, element]) => {
    if (!open || !props.steps[index]) return;
    const activeStep = props.steps[index];
    const scroll = activeStep.scrollIntoViewOptions ?? props.scrollIntoViewOptions;
    if (element && scroll && typeof element.scrollIntoView === 'function') element.scrollIntoView(typeof scroll === 'object' ? scroll : { block: 'center', inline: 'center' });
    const updateRect = () => {
      if (!element) { setRect(emptyRect); return; }
      const source = element.getBoundingClientRect();
      const gap = props.gap.offset ?? 6;
      setRect({ top: source.top - gap, left: source.left - gap, right: source.right + gap, bottom: source.bottom + gap, width: source.width + gap * 2, height: source.height + gap * 2 });
    };
    updateRect();
    let stopPosition: (() => void) | undefined;
    let frame = requestAnimationFrame(() => {
      if (!panelRef) return;
      if (!element || placement() === 'center') {
        Object.assign(panelRef.style, { position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' });
        return;
      }
      stopPosition = autoUpdate(element, panelRef, () => {
        updateRect();
        void computePosition(element, panelRef!, { strategy: 'fixed', placement: placement() as Placement, middleware: [offset(14), flip(), shift({ padding: 8 })] }).then(({ x, y }) => { if (panelRef) Object.assign(panelRef.style, { position: 'fixed', left: `${x}px`, top: `${y}px`, transform: '' }); });
      });
    });
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') close(); };
    document.addEventListener('keydown', onKeyDown);
    return () => { cancelAnimationFrame(frame); stopPosition?.(); document.removeEventListener('keydown', onKeyDown); };
    },
  );

  const actions = () => (
    <div class={['flex items-center gap-2', props.classNames?.actions]} style={props.styles?.actions}>
      <Show when={current() > 0}><button type="button" class="h-8 rounded-control border border-border px-3 text-sm" onClick={previous}>{step()?.prevButtonProps?.children ?? config.locale().Tour?.Previous ?? 'Previous'}</button></Show>
      <button type="button" class="h-8 rounded-control bg-primary px-3 text-sm text-white" onClick={next}>{step()?.nextButtonProps?.children ?? (current() === props.steps.length - 1 ? config.locale().Tour?.Finish ?? 'Finish' : config.locale().Tour?.Next ?? 'Next')}</button>
    </div>
  );
  const indicators = () => props.indicatorsRender?.(current(), props.steps.length) ?? <div class={['flex gap-1', props.classNames?.indicators]} style={props.styles?.indicators} aria-label={`Step ${current() + 1} of ${props.steps.length}`}><For each={props.steps}>{(_, index) => <span class={['h-1.5 w-1.5 rounded-full', index() === current() ? 'bg-primary' : 'bg-border', props.classNames?.indicator]} style={props.styles?.indicator} />}</For></div>;

  return <Show when={isOpen() && step()}><Portal>
    <div class={['ads-tour', 'ads-tour-theme', config.themeScopeClass(), props.classNames?.root]} style={{ ...tokenToCssVariables(config.theme()), 'z-index': props.zIndex, ...props.styles?.root }}>
      <Show when={hasMask()}>
        <div class={['fixed bg-black/45', props.classNames?.mask]} style={{ top: '0', left: '0', right: '0', height: `${rect().top}px`, ...props.styles?.mask }} />
        <div class={['fixed bg-black/45', props.classNames?.mask]} style={{ top: `${rect().top}px`, left: '0', width: `${rect().left}px`, height: `${rect().height}px`, ...props.styles?.mask }} />
        <div class={['fixed bg-black/45', props.classNames?.mask]} style={{ top: `${rect().top}px`, left: `${rect().right}px`, right: '0', height: `${rect().height}px`, ...props.styles?.mask }} />
        <div class={['fixed bg-black/45', props.classNames?.mask]} style={{ top: `${rect().bottom}px`, left: '0', right: '0', bottom: '0', ...props.styles?.mask }} />
        <Show when={target()}><div class="pointer-events-none fixed border-2 border-primary" style={{ top: `${rect().top}px`, left: `${rect().left}px`, width: `${rect().width}px`, height: `${rect().height}px`, 'border-radius': `${props.gap.radius ?? 4}px`, 'box-shadow': '0 0 0 2px rgba(255,255,255,.8)' }} /></Show>
        <Show when={props.disabledInteraction && target()}><div class="fixed" style={{ top: `${rect().top}px`, left: `${rect().left}px`, width: `${rect().width}px`, height: `${rect().height}px` }} /></Show>
      </Show>
      <div ref={panelRef} role="dialog" aria-modal="true" class={['w-[min(320px,calc(100vw-24px))] rounded-surface border border-border-secondary bg-surface p-4 text-text shadow-popup', step()?.className, props.classNames?.section, (step()?.type ?? props.type) === 'primary' ? 'border-primary' : '']} style={props.styles?.section}>
        <button type="button" aria-label="Close tour" class={['absolute right-2 top-2 size-7 bg-transparent text-text-secondary', props.classNames?.close]} style={props.styles?.close} onClick={close}><CloseIcon /></button>
        <Show when={step()?.cover}><div class={['mb-3 overflow-hidden rounded-small', props.classNames?.cover]} style={props.styles?.cover}>{step()?.cover}</div></Show>
        <Show when={step()?.title}><div class={props.classNames?.header} style={props.styles?.header}><div class={['pr-6 text-base font-semibold', props.classNames?.title]} style={props.styles?.title}>{step()?.title}</div></div></Show>
        <Show when={step()?.description}><div class={['mt-2 text-sm text-text-secondary', props.classNames?.description]} style={props.styles?.description}>{step()?.description}</div></Show>
        <div class={['mt-4 flex items-center justify-between gap-3', props.classNames?.footer]} style={props.styles?.footer}>{indicators()}{props.actionsRender?.(actions(), { current: current(), total: props.steps.length }) ?? actions()}</div>
      </div>
    </div>
  </Portal></Show>;
}
