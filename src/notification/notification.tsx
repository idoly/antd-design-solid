import { createSignal, For, Show, type Setter } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { CloseIcon } from '../_internal/icons';
import { renderImperative } from '../_internal/render';

export type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'top' | 'bottom';
export type NotificationType = 'info' | 'success' | 'error' | 'warning';
export type NotificationKey = string | number;

export interface NotificationConfig {
  key?: NotificationKey;
  message: JSX.Element;
  description?: JSX.Element;
  type?: NotificationType;
  icon?: JSX.Element;
  placement?: NotificationPlacement;
  duration?: number;
  btn?: JSX.Element;
  actions?: JSX.Element;
  closeIcon?: JSX.Element | false;
  showProgress?: boolean;
  pauseOnHover?: boolean;
  className?: string;
  style?: JSX.CSSProperties;
  role?: 'alert' | 'status';
  onClick?: () => void;
  onClose?: () => void;
}

export interface GlobalNotificationConfig {
  placement?: NotificationPlacement;
  duration?: number;
  maxCount?: number;
  top?: number;
  bottom?: number;
  getContainer?: () => HTMLElement;
}

interface Notice extends Required<Pick<NotificationConfig, 'key' | 'placement' | 'duration' | 'type'>>, Omit<NotificationConfig, 'key' | 'placement' | 'duration' | 'type'> { }

let globalConfig: GlobalNotificationConfig = { placement: 'topRight', duration: 4.5, maxCount: Infinity, top: 24, bottom: 24 };
let current: Notice[] = [];
let setNotices: Setter<readonly Notice[]> | undefined;
let host: HTMLDivElement | undefined;
let sequence = 0;
const timers = new Map<NotificationKey, number>();

const typeIcon = { info: 'i', success: 'ok', error: 'x', warning: '!' } as const;
const typeClass = { info: 'text-info', success: 'text-success', error: 'text-error', warning: 'text-warning' } as const;
const placementClass: Record<NotificationPlacement, string> = {
  topLeft: 'left-6 items-start', topRight: 'right-6 items-end', bottomLeft: 'left-6 items-start', bottomRight: 'right-6 items-end', top: 'left-1/2 -translate-x-1/2 items-center', bottom: 'left-1/2 -translate-x-1/2 items-center',
};

function remove(key: NotificationKey) {
  const notice = current.find((item) => item.key === key);
  if (!notice) return;
  current = current.filter((item) => item.key !== key);
  const timer = timers.get(key);
  if (timer) window.clearTimeout(timer);
  timers.delete(key);
  notice.onClose?.();
  setNotices?.([...current]);
}

function schedule(notice: Notice) {
  const old = timers.get(notice.key);
  if (old) window.clearTimeout(old);
  if (notice.duration > 0) timers.set(notice.key, window.setTimeout(() => remove(notice.key), notice.duration * 1000));
}

function NotificationHost(props: { notices: () => readonly Notice[] }) {
  const placements = Object.keys(placementClass) as NotificationPlacement[];
  return (
    <>
      <For each={placements}>{(placement) => (
        <div
          class={['ads-root pointer-events-none fixed z-[2050] flex max-w-[calc(100vw-48px)] flex-col gap-3', placementClass[placement]]}
          style={placement.startsWith('bottom') || placement === 'bottom' ? { bottom: `${globalConfig.bottom ?? 24}px` } : { top: `${globalConfig.top ?? 24}px` }}
        >
          <For each={props.notices().filter((notice) => notice.placement === placement)}>{(notice) => (
            <div
              role={notice.role ?? (notice.type === 'error' || notice.type === 'warning' ? 'alert' : 'status')}
              class={['pointer-events-auto relative flex w-[384px] max-w-full items-start gap-3 overflow-hidden rounded-surface border border-border-secondary bg-surface p-4 text-sm text-text shadow-popup', notice.className]}
              style={notice.style}
              onClick={notice.onClick}
              onPointerEnter={() => { if (notice.pauseOnHover !== false) { const timer = timers.get(notice.key); if (timer) window.clearTimeout(timer); timers.delete(notice.key); } }}
              onPointerLeave={() => { if (notice.pauseOnHover !== false) schedule(notice); }}
            >
              <span aria-hidden="true" class={['inline-flex size-5 shrink-0 items-center justify-center text-xs font-semibold', typeClass[notice.type]]}>{notice.icon ?? typeIcon[notice.type]}</span>
              <div class="min-w-0 flex-1">
                <div class="pr-6 font-semibold leading-[22px]">{notice.message}</div>
                <Show when={notice.description}><div class="mt-1 leading-[22px] text-text-secondary">{notice.description}</div></Show>
                <Show when={notice.actions ?? notice.btn}><div class="mt-3 flex justify-end gap-2">{notice.actions ?? notice.btn}</div></Show>
              </div>
              <Show when={notice.closeIcon !== false}><button type="button" aria-label="Close notification" class="absolute right-2 top-2 inline-flex size-6 items-center justify-center rounded-small bg-transparent text-text-secondary hover:bg-surface-container" onClick={(event) => { event.stopPropagation(); remove(notice.key); }}>{notice.closeIcon ?? <CloseIcon />}</button></Show>
              <Show when={notice.showProgress && notice.duration > 0}><span aria-hidden="true" class="absolute inset-x-0 bottom-0 h-0.5 origin-left animate-pulse bg-primary" /></Show>
            </div>
          )}</For>
        </div>
      )}</For>
    </>
  );
}

function ensureHost() {
  if (setNotices || typeof document === 'undefined') return;
  host = document.createElement('div');
  host.setAttribute('data-ads-notification-host', '');
  (globalConfig.getContainer?.() ?? document.body).append(host);
  renderImperative(() => {
    const [notices, set] = createSignal<readonly Notice[]>(current, { ownedWrite: true });
    setNotices = set;
    return <NotificationHost notices={notices} />;
  }, host);
}

function open(config: NotificationConfig) {
  ensureHost();
  const key = config.key ?? `ads-notification-${sequence += 1}`;
  const notice: Notice = { ...config, key, placement: config.placement ?? globalConfig.placement ?? 'topRight', duration: config.duration ?? globalConfig.duration ?? 4.5, type: config.type ?? 'info' };
  const existing = current.findIndex((item) => item.key === key);
  if (existing >= 0) current = current.map((item, index) => index === existing ? notice : item);
  else current = [...current, notice];
  while (current.length > (globalConfig.maxCount ?? Infinity)) remove(current[0].key);
  setNotices?.([...current]);
  schedule(notice);
  return () => remove(key);
}

const typed = (type: NotificationType) => (config: Omit<NotificationConfig, 'type'>) => open({ ...config, type });

export const notification = {
  open,
  info: typed('info'),
  success: typed('success'),
  error: typed('error'),
  warning: typed('warning'),
  close: remove,
  destroy(key?: NotificationKey) {
    if (key !== undefined) remove(key);
    else [...current].forEach((notice) => remove(notice.key));
  },
  config(config: GlobalNotificationConfig) {
    globalConfig = { ...globalConfig, ...config };
    if (host && config.getContainer) config.getContainer().append(host);
  },
  useNotification() {
    return [notification, null] as const;
  },
};
