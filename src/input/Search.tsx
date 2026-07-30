import { merge, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { InternalInput, type InputProps } from './Input';

export interface SearchProps extends InputProps {
  onSearch?: (value: string, event?: Event, info?: { source?: 'clear' | 'input' }) => void;
  searchIcon?: JSX.Element;
  enterButton?: JSX.Element | boolean;
  loading?: boolean;
  onPressEnter?: (event: KeyboardEvent & { currentTarget: HTMLInputElement; target: Element }) => void;
}

export function Search(inputProps: SearchProps) {
  const props = merge({ enterButton: false }, inputProps);
  let inputRef: HTMLInputElement | undefined;
  const others = omit(props, 'onSearch', 'searchIcon', 'enterButton', 'loading', 'onPressEnter', 'suffix', 'onKeyDown', 'onInput');
  const submit = (event?: Event) => props.onSearch?.(inputRef?.value ?? '', event, { source: 'input' });
  const button = <button type="button" aria-label="Search" disabled={props.disabled || props.loading} class={props.enterButton ? 'mr-0 inline-flex h-full min-w-8 items-center justify-center self-stretch bg-primary px-3 text-white disabled:bg-border' : 'mr-2 inline-flex size-6 items-center justify-center bg-transparent text-text-secondary'} onClick={(event) => submit(event)}>{props.loading ? <span class="ads-spin size-3 rounded-full border-2 border-current border-r-transparent" /> : props.enterButton === true ? 'Search' : props.enterButton || props.searchIcon || '?'}</button>;
  return <InternalInput
    {...others}
    ref={(element) => { inputRef = element; if (typeof props.ref === 'function') props.ref(element); }}
    suffix={<>{props.suffix}{button}</>}
    onInput={(event) => { if (typeof props.onInput === 'function') props.onInput(event); }}
    onKeyDown={(event) => {
      if (event.key === 'Enter' && !event.isComposing) { props.onPressEnter?.(event); submit(event); }
      if (typeof props.onKeyDown === 'function') props.onKeyDown(event);
    }}
  />;
}
