import { createEffect, createSignal, For, merge, omit, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';

export interface CarouselRef {
  goTo: (slide: number, dontAnimate?: boolean) => void;
  next: () => void;
  prev: () => void;
}

export interface CarouselProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'ref' | 'draggable'> {
  autoplay?: boolean | { dotDuration?: boolean };
  autoplaySpeed?: number;
  arrows?: boolean;
  dots?: boolean | { className?: string };
  dotPosition?: 'top' | 'bottom' | 'left' | 'right';
  effect?: 'scrollx' | 'fade';
  infinite?: boolean;
  speed?: number;
  draggable?: boolean;
  waitForAnimate?: boolean;
  pauseOnHover?: boolean;
  beforeChange?: (current: number, next: number) => void;
  afterChange?: (current: number) => void;
  ref?: (ref: CarouselRef) => void;
}

export function Carousel(inputProps: CarouselProps) {
  const props = merge({ autoplay: false as boolean | { dotDuration?: boolean }, autoplaySpeed: 3000, arrows: false, dots: true as boolean | { className?: string }, dotPosition: 'bottom' as const, effect: 'scrollx' as const, infinite: true, speed: 500, draggable: false, pauseOnHover: true }, inputProps);
  const [current, setCurrent] = createSignal(0, { ownedWrite: true });
  const [paused, setPaused] = createSignal(false, { ownedWrite: true });
  let dragStart: number | undefined;
  const others = omit(props, 'autoplay', 'autoplaySpeed', 'arrows', 'dots', 'dotPosition', 'effect', 'infinite', 'speed', 'draggable', 'waitForAnimate', 'pauseOnHover', 'beforeChange', 'afterChange', 'ref', 'children', 'class');
  const slides = () => Array.isArray(props.children) ? props.children : props.children === undefined ? [] : [props.children];
  const goTo = (slide: number) => {
    const count = slides().length;
    if (count === 0) return;
    const next = props.infinite ? (slide % count + count) % count : Math.min(count - 1, Math.max(0, slide));
    if (next === current()) return;
    props.beforeChange?.(current(), next);
    setCurrent(next);
    props.afterChange?.(next);
  };
  const api: CarouselRef = { goTo, next: () => goTo(current() + 1), prev: () => goTo(current() - 1) };
  props.ref?.(api);

  createEffect(
    () => [Boolean(props.autoplay), props.autoplaySpeed, paused(), slides().length] as const,
    ([autoplay, speed, isPaused, count]) => {
      if (!autoplay || isPaused || count <= 1) return;
      const timer = window.setInterval(api.next, speed);
      return () => window.clearInterval(timer);
    },
  );
  const verticalDots = () => props.dotPosition === 'left' || props.dotPosition === 'right';

  return (
    <div
      {...others}
      role="region"
      aria-roledescription="carousel"
      tabindex={0}
      class={['ads-carousel group relative min-w-0 overflow-hidden', props.class]}
      onPointerEnter={() => { if (props.pauseOnHover) setPaused(true); }}
      onPointerLeave={() => { if (props.pauseOnHover) setPaused(false); }}
      onPointerDown={(event) => { if (props.draggable) dragStart = event.clientX; }}
      onPointerUp={(event) => { if (dragStart !== undefined && Math.abs(event.clientX - dragStart) > 30) goTo(current() + (event.clientX < dragStart ? 1 : -1)); dragStart = undefined; }}
      onKeyDown={(event) => { if (event.key === 'ArrowRight') api.next(); if (event.key === 'ArrowLeft') api.prev(); }}
    >
      <div class={props.effect === 'fade' ? 'relative' : 'flex transition-transform'} style={props.effect === 'scrollx' ? { transform: `translateX(-${current() * 100}%)`, 'transition-duration': `${props.speed}ms` } : undefined}>
        <For each={slides()}>{(slide, index) => (
          <div
            role="group"
            aria-roledescription="slide"
            aria-label={`${index() + 1} of ${slides().length}`}
            aria-hidden={current() === index() ? 'false' : 'true'}
            class={props.effect === 'fade' ? ['absolute inset-0 w-full transition-opacity', current() === index() ? 'relative opacity-100' : 'pointer-events-none opacity-0'] : 'w-full shrink-0'}
            style={props.effect === 'fade' ? { 'transition-duration': `${props.speed}ms` } : undefined}
          >
            {slide}
          </div>
        )}</For>
      </div>
      <Show when={props.arrows && slides().length > 1}>
        <button type="button" aria-label="Previous slide" class="absolute left-3 top-1/2 z-10 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100" onClick={api.prev}>&lt;</button>
        <button type="button" aria-label="Next slide" class="absolute right-3 top-1/2 z-10 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100" onClick={api.next}>&gt;</button>
      </Show>
      <Show when={props.dots && slides().length > 1}>
        <div class={[
          'absolute z-10 flex gap-2',
          verticalDots() ? 'top-1/2 -translate-y-1/2 flex-col' : 'bottom-3 left-1/2 -translate-x-1/2',
          props.dotPosition === 'left' ? 'left-3' : props.dotPosition === 'right' ? 'right-3' : props.dotPosition === 'top' ? 'bottom-auto top-3' : '',
          typeof props.dots === 'object' ? props.dots.className : '',
        ]}>
          <For each={slides()}>{(_, index) => <button type="button" aria-label={`Go to slide ${index() + 1}`} aria-current={current() === index() ? 'true' : undefined} class={['h-1.5 rounded-full bg-white/55 transition-[width,background-color]', current() === index() ? 'w-6 bg-white' : 'w-3']} onClick={() => goTo(index())} />}</For>
        </div>
      </Show>
    </div>
  );
}
