import { createEffect, createSignal, onSettled, untrack, type Accessor } from 'solid-js';
import {
  elementScroll,
  observeElementOffset,
  observeElementRect,
  Virtualizer,
  type VirtualItem,
} from '@tanstack/virtual-core';

export interface VirtualListOptions {
  count: Accessor<number>;
  getScrollElement: () => HTMLElement | null;
  estimateSize: Accessor<number>;
  viewportSize?: Accessor<number>;
  enabled?: Accessor<boolean>;
  overscan?: number;
  getItemKey?: (index: number) => string | number;
}

export interface VirtualListController {
  items: Accessor<VirtualItem[]>;
  totalSize: Accessor<number>;
  measureElement: (element: HTMLElement | null) => void;
  resizeItem: (index: number, size: number) => void;
  scrollToIndex: (index: number, align?: 'auto' | 'start' | 'center' | 'end') => void;
  scrollToOffset: (offset: number) => void;
}

export function createVirtualList(options: VirtualListOptions): VirtualListController {
  const [version, setVersion] = createSignal(0, { ownedWrite: true });
  const initial = untrack(() => ({
    count: options.count(),
    enabled: options.enabled?.() ?? true,
    viewportSize: options.viewportSize?.() ?? 400,
  }));
  const virtualizer = new Virtualizer<HTMLElement, HTMLElement>({
    count: initial.count,
    getScrollElement: options.getScrollElement,
    estimateSize: () => options.estimateSize(),
    getItemKey: options.getItemKey,
    overscan: options.overscan ?? 5,
    enabled: initial.enabled,
    initialRect: { width: 0, height: initial.viewportSize },
    observeElementRect: (instance, callback) => observeElementRect(instance, (rect) => callback({ width: rect.width, height: rect.height || options.viewportSize?.() || 400 })),
    observeElementOffset,
    scrollToFn: elementScroll,
    onChange: () => setVersion((value) => value + 1),
  });

  createEffect(
    () => [options.count(), options.estimateSize(), options.viewportSize?.() ?? 400, options.enabled?.() ?? true] as const,
    ([count, estimateSize, viewportSize, enabled]) => {
      virtualizer.setOptions({
        ...virtualizer.options,
        count,
        enabled,
        estimateSize: () => estimateSize,
        getScrollElement: options.getScrollElement,
        initialRect: { width: 0, height: viewportSize },
        observeElementRect: (instance, callback) => observeElementRect(instance, (rect) => callback({ width: rect.width, height: rect.height || viewportSize })),
        onChange: () => setVersion((value) => value + 1),
      });
      virtualizer._willUpdate();
    },
  );
  onSettled(() => virtualizer._didMount());

  return {
    items: () => { version(); return virtualizer.getVirtualItems(); },
    totalSize: () => { version(); return virtualizer.getTotalSize(); },
    measureElement: (element) => virtualizer.measureElement(element),
    resizeItem: (index, size) => virtualizer.resizeItem(index, size),
    scrollToIndex: (index, align = 'auto') => virtualizer.scrollToIndex(index, { align }),
    scrollToOffset: (offset) => virtualizer.scrollToOffset(offset),
  };
}
