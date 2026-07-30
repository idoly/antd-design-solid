import { createSignal, For, Show, type Setter } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { renderImperative } from '../_internal/render';

export type MessageTypeName = 'info' | 'success' | 'error' | 'warning' | 'loading';
export type MessageKey = string | number;

export interface MessageConfig {
  key?: MessageKey;
  content: JSX.Element;
  duration?: number;
  type?: MessageTypeName;
  icon?: JSX.Element;
  className?: string;
  style?: JSX.CSSProperties;
  onClick?: () => void;
  onClose?: () => void;
}

export interface GlobalMessageConfig {
  top?: number;
  duration?: number;
  maxCount?: number;
  getContainer?: () => HTMLElement;
}

export interface MessageType {
  (): void;
  then: Promise<void>['then'];
  promise: Promise<void>;
}

interface Notice extends Required<Pick<MessageConfig, 'key' | 'type' | 'duration'>>, Omit<MessageConfig, 'key' | 'type' | 'duration'> { }

let globalConfig: GlobalMessageConfig = { top: 16, duration: 3, maxCount: Infinity };
let current: Notice[] = [];
let setNotices: Setter<readonly Notice[]> | undefined;
let host: HTMLDivElement | undefined;
let sequence = 0;
const timers = new Map<MessageKey, number>();
const resolvers = new Map<MessageKey, Set<() => void>>();

const iconText: Record<MessageTypeName, string> = { info: 'i', success: 'ok', error: 'x', warning: '!', loading: '' };
const iconClass: Record<MessageTypeName, string> = { info: 'text-info', success: 'text-success', error: 'text-error', warning: 'text-warning', loading: 'text-primary' };

function MessageHost(props: { notices: () => readonly Notice[] }) {
  return (
    <div class="ads-root pointer-events-none fixed inset-x-0 z-[2050] flex flex-col items-center gap-2 px-4" style={{ top: `${globalConfig.top ?? 16}px` }} aria-live="polite">
      <For each={props.notices()}>{(notice) => (
        <div
          role={notice.type === 'error' || notice.type === 'warning' ? 'alert' : 'status'}
          class={['pointer-events-auto flex max-w-full items-center gap-2 rounded-surface bg-surface px-4 py-2.5 text-sm text-text shadow-popup', notice.className]}
          style={notice.style}
          onClick={notice.onClick}
        >
          <Show when={notice.type === 'loading'} fallback={<span aria-hidden="true" class={['inline-flex min-w-4 justify-center text-xs font-semibold', iconClass[notice.type]]}>{notice.icon ?? iconText[notice.type]}</span>}>
            <span aria-hidden="true" class="ads-spin size-4 rounded-full border-2 border-primary border-r-transparent" />
          </Show>
          <span class="min-w-0">{notice.content}</span>
        </div>
      )}</For>
    </div>
  );
}

function ensureHost() {
  if (setNotices || typeof document === 'undefined') return;
  host = document.createElement('div');
  host.setAttribute('data-ads-message-host', '');
  (globalConfig.getContainer?.() ?? document.body).append(host);
  renderImperative(() => {
    const [notices, set] = createSignal<readonly Notice[]>(current, { ownedWrite: true });
    setNotices = set;
    return <MessageHost notices={notices} />;
  }, host);
}

function publish() {
  setNotices?.([...current]);
}

function remove(key: MessageKey) {
  const notice = current.find((item) => item.key === key);
  if (!notice) return;
  current = current.filter((item) => item.key !== key);
  const timer = timers.get(key);
  if (timer) window.clearTimeout(timer);
  timers.delete(key);
  notice.onClose?.();
  resolvers.get(key)?.forEach((resolve) => resolve());
  resolvers.delete(key);
  publish();
}

function open(config: MessageConfig): MessageType {
  ensureHost();
  const key = config.key ?? `ads-message-${sequence += 1}`;
  const duration = config.duration ?? globalConfig.duration ?? 3;
  const notice: Notice = { ...config, key, duration, type: config.type ?? 'info' };
  const existing = current.findIndex((item) => item.key === key);
  if (existing >= 0) current = current.map((item, index) => index === existing ? notice : item);
  else current = [...current, notice];
  while (current.length > (globalConfig.maxCount ?? Infinity)) remove(current[0].key);
  publish();
  const oldTimer = timers.get(key);
  if (oldTimer) window.clearTimeout(oldTimer);
  if (duration > 0) timers.set(key, window.setTimeout(() => remove(key), duration * 1000));
  const promise = new Promise<void>((resolve) => {
    const pending = resolvers.get(key) ?? new Set();
    pending.add(resolve);
    resolvers.set(key, pending);
  });
  const close = (() => remove(key)) as MessageType;
  close.promise = promise;
  close.then = promise.then.bind(promise);
  return close;
}

const typed = (type: MessageTypeName) => (content: JSX.Element | Omit<MessageConfig, 'type'>, duration?: number, onClose?: () => void) => typeof content === 'object' && content !== null && 'content' in content
  ? open({ ...content as Omit<MessageConfig, 'type'>, type })
  : open({ content: content as JSX.Element, duration, onClose, type });

export const message = {
  open,
  info: typed('info'),
  success: typed('success'),
  error: typed('error'),
  warning: typed('warning'),
  loading: typed('loading'),
  destroy(key?: MessageKey) {
    if (key !== undefined) remove(key);
    else [...current].forEach((notice) => remove(notice.key));
  },
  config(config: GlobalMessageConfig) {
    globalConfig = { ...globalConfig, ...config };
    if (host && config.getContainer) config.getContainer().append(host);
  },
  useMessage() {
    return [message, null] as const;
  },
};
