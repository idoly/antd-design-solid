import { render as solidRender } from '@solidjs/web';
import type { JSX } from '@solidjs/web';

export type ImperativeRender = (code: () => JSX.Element, container: HTMLElement) => void | (() => void);

let imperativeRender: ImperativeRender = solidRender;

export function renderImperative(code: () => JSX.Element, container: HTMLElement) {
  return imperativeRender(code, container) ?? (() => {});
}

export function unstableSetRender(next: ImperativeRender) {
  imperativeRender = next;
}
