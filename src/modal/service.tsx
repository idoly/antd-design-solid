import { createSignal, omit, Show, type Accessor, type Setter } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { renderImperative } from '../_internal/render';
import { Modal as InternalModal, type ModalProps } from './Modal';

export interface ModalFuncProps extends Omit<ModalProps, 'open' | 'children' | 'onOk' | 'onCancel'> {
  content?: JSX.Element;
  icon?: JSX.Element;
  type?: 'info' | 'success' | 'error' | 'warning' | 'confirm';
  onOk?: () => void | boolean | Promise<void | boolean>;
  onCancel?: () => void;
}
export interface ModalFuncResult {
  destroy: () => void;
  update: (config: Partial<ModalFuncProps> | ((previous: ModalFuncProps) => ModalFuncProps)) => void;
}
export interface ModalApi {
  info: (config: ModalFuncProps) => ModalFuncResult;
  success: (config: ModalFuncProps) => ModalFuncResult;
  error: (config: ModalFuncProps) => ModalFuncResult;
  warning: (config: ModalFuncProps) => ModalFuncResult;
  confirm: (config: ModalFuncProps) => ModalFuncResult;
  destroyAll: () => void;
  useModal: () => readonly [ModalApi, null];
}

const activeModals = new Set<() => void>();
const iconText = { info: 'i', success: 'ok', error: 'x', warning: '!', confirm: '?' } as const;
const iconClass = { info: 'text-info', success: 'text-success', error: 'text-error', warning: 'text-warning', confirm: 'text-warning' } as const;

function ServiceModal(props: { config: Accessor<ModalFuncProps | null>; destroy: () => void }) {
  return <Show when={props.config()} keyed>{(value) => {
    const modalProps = omit(value, 'content', 'icon', 'type', 'onOk', 'onCancel');
    const showCancel = value.type === 'confirm';
    return <InternalModal
      {...modalProps}
      open
      closable={value.closable ?? false}
      footer={value.footer === undefined ? undefined : value.footer}
      cancelButtonProps={showCancel ? value.cancelButtonProps : { ...value.cancelButtonProps, style: { display: 'none' } }}
      onCancel={() => { value.onCancel?.(); props.destroy(); }}
      onOk={() => { void Promise.resolve(value.onOk?.()).then((result) => { if (result !== false) props.destroy(); }); }}
    >
      <div class="flex items-start gap-3">
        <span aria-hidden="true" class={['mt-0.5 inline-flex size-6 shrink-0 items-center justify-center font-semibold', iconClass[value.type ?? 'info']]}>{value.icon ?? iconText[value.type ?? 'info']}</span>
        <div class="min-w-0 flex-1">{value.content}</div>
      </div>
    </InternalModal>;
  }}</Show>;
}

function openModal(type: ModalFuncProps['type'], initial: ModalFuncProps): ModalFuncResult {
  const host = document.createElement('div');
  host.setAttribute('data-ads-modal-service-host', '');
  document.body.append(host);
  let current: ModalFuncProps = { ...initial, type };
  let destroyed = false;
  let dispose = () => {};
  let setConfig: Setter<ModalFuncProps | null> | undefined;
  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    activeModals.delete(destroy);
    setConfig?.(null);
    window.setTimeout(() => { dispose(); host.remove(); }, 0);
  };
  activeModals.add(destroy);
  dispose = renderImperative(() => {
    const [config, setConfigSignal] = createSignal<ModalFuncProps | null>(current, { ownedWrite: true });
    setConfig = setConfigSignal;
    return <ServiceModal config={config} destroy={destroy} />;
  }, host);
  return {
    destroy,
    update(next) {
      current = typeof next === 'function' ? next(current) : { ...current, ...next };
      setConfig?.(current);
    },
  };
}

export const modal: ModalApi = {
  info: (config) => openModal('info', config),
  success: (config) => openModal('success', config),
  error: (config) => openModal('error', config),
  warning: (config) => openModal('warning', config),
  confirm: (config) => openModal('confirm', config),
  destroyAll: () => [...activeModals].forEach((destroy) => destroy()),
  useModal: () => [modal, null] as const,
};
