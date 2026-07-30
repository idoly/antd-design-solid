import { createSignal, For, merge, omit, Show, untrack } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { CloseIcon, DownloadIcon } from '../_internal/icons';
import { useFormItemControl } from '../form/context';
import { useConfig } from '../config-provider';

export type UploadFileStatus = 'error' | 'done' | 'uploading' | 'removed';
export type UploadListType = 'text' | 'picture' | 'picture-card' | 'picture-circle';

export interface UploadFile<T = unknown> {
  uid: string;
  name: string;
  status?: UploadFileStatus;
  percent?: number;
  size?: number;
  type?: string;
  url?: string;
  thumbUrl?: string;
  originFileObj?: File;
  response?: T;
  error?: Error;
}

export interface UploadChangeParam<T = UploadFile> { file: T; fileList: T[]; event?: { percent: number } }
export interface UploadRequestOption<T = unknown> {
  action: string;
  filename: string;
  file: File;
  data?: Record<string, unknown>;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  onProgress: (event: { percent: number }) => void;
  onSuccess: (body: T) => void;
  onError: (error: Error) => void;
}

export const LIST_IGNORE = '__ADS_UPLOAD_LIST_IGNORE__';

export interface UploadProgressConfig { strokeWidth?: number; showInfo?: boolean; format?: (percent: number) => JSX.Element }
export type UploadSemanticName = 'root' | 'list' | 'item' | 'trigger';
export type UploadSemanticClassNames<T = unknown> = Partial<Record<UploadSemanticName, string>> | ((info: { props: UploadProps<T> }) => Partial<Record<UploadSemanticName, string>>);
export type UploadSemanticStyles<T = unknown> = Partial<Record<UploadSemanticName, JSX.CSSProperties>> | ((info: { props: UploadProps<T> }) => Partial<Record<UploadSemanticName, JSX.CSSProperties>>);

export interface UploadProps<T = unknown> extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'onChange' | 'onDrop'> {
  accept?: string;
  action?: string | ((file: File) => string | Promise<string>);
  method?: string;
  name?: string;
  headers?: Record<string, string>;
  data?: Record<string, unknown> | ((file: File) => Record<string, unknown> | Promise<Record<string, unknown>>);
  withCredentials?: boolean;
  multiple?: boolean;
  directory?: boolean;
  disabled?: boolean;
  maxCount?: number;
  fileList?: readonly UploadFile<T>[];
  defaultFileList?: readonly UploadFile<T>[];
  listType?: UploadListType;
  showUploadList?: boolean | { showPreviewIcon?: boolean; showRemoveIcon?: boolean; showDownloadIcon?: boolean };
  openFileDialogOnClick?: boolean;
  pastable?: boolean;
  classNames?: UploadSemanticClassNames<T>;
  styles?: UploadSemanticStyles<T>;
  iconRender?: (file: UploadFile<T>, listType?: UploadListType) => JSX.Element;
  isImageUrl?: (file: UploadFile<T>) => boolean;
  itemRender?: (originNode: JSX.Element, file: UploadFile<T>, fileList: readonly UploadFile<T>[], actions: { download: () => void; preview: () => void; remove: () => void }) => JSX.Element;
  previewFile?: (file: File | Blob) => Promise<string>;
  progress?: UploadProgressConfig;
  beforeUpload?: (file: File, fileList: File[]) => boolean | string | File | Blob | Promise<boolean | string | File | Blob>;
  transformFile?: (file: File) => File | Blob | Promise<File | Blob>;
  customRequest?: (options: UploadRequestOption<T>) => void | { abort?: () => void };
  onChange?: (info: UploadChangeParam<UploadFile<T>>) => void;
  onRemove?: (file: UploadFile<T>) => boolean | void | Promise<boolean | void>;
  onPreview?: (file: UploadFile<T>) => void;
  onDownload?: (file: UploadFile<T>) => void;
  onDrop?: (event: DragEvent) => void;
}

let uid = 0;

function UploadRoot<T = unknown>(inputProps: UploadProps<T> & { dragger?: boolean }) {
  const config = useConfig();
  const props = merge({ method: 'post', name: 'file', listType: 'text' as UploadListType, showUploadList: true as UploadProps<T>['showUploadList'], openFileDialogOnClick: true }, config.componentDefaults('upload') as Partial<UploadProps<T>>, inputProps);
  const field = useFormItemControl();
  const [internalList, setInternalList] = createSignal<readonly UploadFile<T>[]>(props.defaultFileList ?? [], { ownedWrite: true });
  const [dragging, setDragging] = createSignal(false, { ownedWrite: true });
  let currentList: readonly UploadFile<T>[] = props.defaultFileList ?? [];
  let inputRef: HTMLInputElement | undefined;
  const others = omit(props, 'accept', 'action', 'method', 'name', 'headers', 'data', 'withCredentials', 'multiple', 'directory', 'disabled', 'maxCount', 'fileList', 'defaultFileList', 'listType', 'showUploadList', 'openFileDialogOnClick', 'pastable', 'classNames', 'styles', 'iconRender', 'isImageUrl', 'itemRender', 'previewFile', 'progress', 'beforeUpload', 'transformFile', 'customRequest', 'onChange', 'onRemove', 'onPreview', 'onDownload', 'onDrop', 'dragger', 'children', 'class', 'style');
  const semanticClasses = () => typeof props.classNames === 'function' ? props.classNames({ props }) : props.classNames ?? {};
  const semanticStyles = () => typeof props.styles === 'function' ? props.styles({ props }) : props.styles ?? {};
  const list = () => props.fileList ?? (field?.value() !== undefined ? field.value() as readonly UploadFile<T>[] : (internalList(), currentList));
  const disabled = () => props.disabled ?? field?.disabled() ?? false;
  const publish = (next: UploadFile<T>[], file: UploadFile<T>, event?: { percent: number }) => {
    currentList = props.maxCount ? next.slice(-props.maxCount) : next;
    if (props.fileList === undefined) {
      if (field) field.setValue(currentList);
      else setInternalList(currentList);
    }
    props.onChange?.({ file, fileList: [...currentList], event });
  };
  const update = (file: UploadFile<T>, patch: Partial<UploadFile<T>>, event?: { percent: number }) => {
    const nextFile = { ...file, ...patch };
    publish(list().map((item) => item.uid === file.uid ? nextFile : item), nextFile, event);
  };
  const request = async (uploadFile: UploadFile<T>, source: File) => {
    const transformed = props.transformFile ? await props.transformFile(source) : source;
    const file = transformed instanceof File ? transformed : new File([transformed], source.name, { type: transformed.type || source.type });
    const action = typeof props.action === 'function' ? await props.action(file) : props.action ?? '';
    const data = typeof props.data === 'function' ? await props.data(file) : props.data;
    const options: UploadRequestOption<T> = {
      action,
      filename: props.name,
      file,
      data,
      headers: props.headers,
      withCredentials: props.withCredentials,
      onProgress: (event) => update(uploadFile, { status: 'uploading', percent: event.percent }, event),
      onSuccess: (response) => update(uploadFile, { status: 'done', percent: 100, response }),
      onError: (error) => update(uploadFile, { status: 'error', error }),
    };
    if (props.customRequest) { props.customRequest(options); return; }
    if (!action) { options.onSuccess(undefined as T); return; }
    const xhr = new XMLHttpRequest();
    xhr.open(props.method.toUpperCase(), action);
    Object.entries(props.headers ?? {}).forEach(([key, value]) => xhr.setRequestHeader(key, value));
    xhr.withCredentials = Boolean(props.withCredentials);
    xhr.upload.onprogress = (event) => { if (event.total > 0) options.onProgress({ percent: event.loaded / event.total * 100 }); };
    xhr.onerror = () => options.onError(new Error('Upload failed'));
    xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? options.onSuccess(xhr.response as T) : options.onError(new Error(`Upload failed with status ${xhr.status}`));
    const form = new FormData();
    form.append(props.name, file);
    Object.entries(data ?? {}).forEach(([key, value]) => form.append(key, String(value)));
    xhr.send(form);
  };
  const process = async (files: File[]) => {
    for (const source of files) {
      let candidate: File | Blob = source;
      if (props.beforeUpload) {
        const result = await props.beforeUpload(source, files);
        if (result === false) {
          const stopped: UploadFile<T> = { uid: `ads-upload-${uid += 1}`, name: source.name, size: source.size, type: source.type, originFileObj: source };
          publish([...list(), stopped], stopped);
          continue;
        }
        if (result === LIST_IGNORE) continue;
        if (result instanceof Blob) candidate = result;
      }
      const file = candidate instanceof File ? candidate : new File([candidate], source.name, { type: candidate.type || source.type });
      const uploadFile: UploadFile<T> = { uid: `ads-upload-${uid += 1}`, name: file.name, status: 'uploading', percent: 0, size: file.size, type: file.type, originFileObj: file };
      publish([...list(), uploadFile], uploadFile);
      if (props.previewFile) void props.previewFile(file).then((thumbUrl) => update(uploadFile, { thumbUrl }));
      void request(uploadFile, file);
    }
  };
  const remove = async (file: UploadFile<T>) => {
    const allowed = await props.onRemove?.(file);
    if (allowed === false) return;
    publish(list().filter((item) => item.uid !== file.uid), { ...file, status: 'removed' });
  };
  const showConfig = () => typeof props.showUploadList === 'object' ? props.showUploadList : {};
  const imageFile = (file: UploadFile<T>) => props.isImageUrl?.(file) ?? Boolean(file.type?.startsWith('image/') || file.thumbUrl);
  const renderFileItem = (file: UploadFile<T>) => {
    const actions = { download: () => props.onDownload?.(file), preview: () => props.onPreview?.(file), remove: () => void remove(file) };
    const originNode = <div class={['flex min-h-8 items-center gap-2 rounded-control px-2 text-sm hover:bg-surface-container', file.status === 'error' ? 'text-error' : 'text-text', semanticClasses().item]} style={semanticStyles().item}>
      <Show when={props.iconRender}><span aria-hidden="true" class="inline-flex shrink-0">{props.iconRender?.(file, props.listType)}</span></Show>
      <Show when={props.listType !== 'text'}><span class={['size-10 shrink-0 overflow-hidden bg-surface-container', props.listType === 'picture-circle' ? 'rounded-full' : 'rounded-small']}><Show when={(file.thumbUrl ?? file.url) && imageFile(file)}><img src={file.thumbUrl ?? file.url} alt="" class="size-full object-cover" /></Show></span></Show>
      <button type="button" class="min-w-0 flex-1 truncate bg-transparent text-left" onClick={actions.preview}>{file.name}</button>
      <Show when={file.status === 'uploading'}><span class="flex min-w-20 items-center gap-2"><span class="h-1 min-w-12 flex-1 overflow-hidden rounded-full bg-border-secondary"><span class="block h-full bg-primary" style={{ width: `${Math.min(100, Math.max(0, file.percent ?? 0))}%`, height: `${props.progress?.strokeWidth ?? 2}px` }} /></span><Show when={props.progress?.showInfo !== false}><span class="text-xs text-text-secondary">{props.progress?.format?.(Math.round(file.percent ?? 0)) ?? `${Math.round(file.percent ?? 0)}%`}</span></Show></span></Show>
      <Show when={showConfig().showDownloadIcon !== false && props.onDownload}><button type="button" aria-label={`${config.locale().Upload?.downloadFile ?? 'Download file'} ${file.name}`} class="size-6 bg-transparent text-text-secondary" onClick={actions.download}><DownloadIcon /></button></Show>
      <Show when={showConfig().showRemoveIcon !== false}><button type="button" aria-label={`${config.locale().Upload?.removeFile ?? 'Remove file'} ${file.name}`} class="size-6 bg-transparent text-text-secondary hover:text-error" onClick={actions.remove}><CloseIcon /></button></Show>
    </div>;
    return props.itemRender?.(originNode, file, untrack(list), actions) ?? originNode;
  };

  return (
    <span {...others} id={field?.id} class={['ads-upload inline-block max-w-full', semanticClasses().root, props.class]} style={{ ...semanticStyles().root, ...(typeof props.style === 'object' ? props.style : {}) }} onPaste={(event) => { if (props.pastable && !disabled()) void process(Array.from(event.clipboardData?.files ?? [])); }}>
      <span
        role={props.dragger ? 'button' : undefined}
        tabindex={props.dragger && !disabled() ? 0 : undefined}
        class={[props.dragger ? ['flex min-h-40 w-full cursor-pointer flex-col items-center justify-center rounded-surface border border-dashed p-6 text-center transition-colors', dragging() ? 'border-primary bg-[#e6f4ff]' : 'border-border bg-surface hover:border-primary', disabled() ? 'cursor-not-allowed opacity-50' : ''] : '', semanticClasses().trigger]}
        style={semanticStyles().trigger}
        onClick={() => { if (!disabled() && props.openFileDialogOnClick) inputRef?.click(); }}
        onKeyDown={(event) => { if ((event.key === 'Enter' || event.key === ' ') && !disabled()) inputRef?.click(); }}
        onDragOver={(event) => { if (props.dragger) { event.preventDefault(); setDragging(true); } }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { props.onDrop?.(event); if (props.dragger) { event.preventDefault(); setDragging(false); if (!disabled()) void process(Array.from(event.dataTransfer?.files ?? [])); } }}
      >
        {props.children}
        <input ref={inputRef} type="file" class="hidden" accept={props.accept} multiple={props.multiple} disabled={disabled()} webkitdirectory={props.directory ? '' : undefined} onChange={(event) => { void process(Array.from(event.currentTarget.files ?? [])); event.currentTarget.value = ''; }} />
      </span>
      <Show when={props.showUploadList}>
        <div class={[props.listType === 'picture-card' || props.listType === 'picture-circle' ? 'mt-3 grid grid-cols-3 gap-2' : 'mt-2 space-y-1', semanticClasses().list]} style={semanticStyles().list}>
          <For each={list()}>{renderFileItem}</For>
        </div>
      </Show>
    </span>
  );
}

export function Dragger<T = unknown>(props: UploadProps<T>) { return <UploadRoot {...props} dragger />; }
export const Upload = Object.assign(UploadRoot, { Dragger, LIST_IGNORE });
