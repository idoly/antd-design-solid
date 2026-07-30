import { createContext, createEffect, createMemo, createSignal, createUniqueId, For, merge, omit, onCleanup, Show, useContext } from 'solid-js';
import { Dynamic, type JSX } from '@solidjs/web';
import { tv } from 'tailwind-variants';
import { FormItemContext, type FormFieldStatus, type FormItemControl } from './context';
import { SizeContext, useConfig } from '../config-provider';
import { createForm, namePathKey, toNamePath, type FieldData, type FormInstance, type FormValues, type InternalFormInstance, type NamePath, type Rule, type RuleConfig, type ValidateErrorInfo } from './formStore';

const formStyles = tv({
  slots: {
    root: 'ads-form text-sm text-text',
    item: 'ads-form-item min-w-0',
    label: 'ads-form-label mb-1.5 block text-sm text-text',
    control: 'min-w-0',
    help: 'mt-1 min-h-5 text-xs leading-5',
    extra: 'mt-1 text-xs leading-5 text-text-secondary',
  },
  variants: {
    layout: {
      vertical: { root: 'space-y-4' },
      horizontal: { root: 'space-y-4', item: 'grid items-start gap-x-4 sm:grid-cols-[minmax(120px,1fr)_3fr]', label: 'mb-0 pt-1.5 text-right' },
      inline: { root: 'flex flex-wrap items-start gap-3', item: 'flex items-start gap-2', label: 'mb-0 pt-1.5' },
    },
    status: {
      error: { help: 'text-error' },
      warning: { help: 'text-warning' },
      success: { help: 'text-success' },
      validating: { help: 'text-text-secondary' },
    },
  },
  defaultVariants: { layout: 'horizontal' },
});

interface FormContextValue<Values extends FormValues = FormValues> {
  form: InternalFormInstance<Values>;
  layout: () => NonNullable<FormProps<Values>['layout']>;
  disabled: () => boolean;
  requiredMark: () => boolean;
  validateMessages: () => Record<string, any> | undefined;
  preserve: () => boolean;
  validateTrigger: () => string | readonly string[];
  semanticClasses: () => Partial<Record<FormSemanticName, string>>;
  semanticStyles: () => Partial<Record<FormSemanticName, JSX.CSSProperties>>;
  colon: () => boolean;
  labelAlign: () => 'left' | 'right';
  labelWrap: () => boolean;
  labelCol: () => FormProps['labelCol'];
  wrapperCol: () => FormProps['wrapperCol'];
  tooltip: () => FormProps['tooltip'];
  feedbackIcons: () => FormProps['feedbackIcons'];
  variant: () => FormProps['variant'];
  setFieldValue: (name: NamePath, value: unknown) => void;
  validateField: (name: NamePath, trigger?: string) => Promise<string[]>;
  dependencyVersion: () => number;
  registerDependencies: (name: NamePath | undefined, dependencies: readonly NamePath[]) => () => void;
}

const FormContext = createContext<FormContextValue | null>(null);
const FormListContext = createContext<readonly (string | number)[]>([]);

interface FormProviderValue {
  forms: Record<string, FormInstance>;
  onFormChange?: (name: string, info: { changedFields: { name: NamePath; value: unknown }[]; forms: Record<string, FormInstance> }) => void;
  onFormFinish?: (name: string, info: { values: FormValues; forms: Record<string, FormInstance> }) => void;
}
const FormProviderContext = createContext<FormProviderValue | null>(null);

export type FormSemanticName = 'root' | 'label' | 'content' | 'help' | 'helpItem' | 'extra';
export type FormSemanticClassNames<Values extends FormValues = FormValues> = Partial<Record<FormSemanticName, string>> | ((info: { props: FormProps<Values> }) => Partial<Record<FormSemanticName, string>>);
export type FormSemanticStyles<Values extends FormValues = FormValues> = Partial<Record<FormSemanticName, JSX.CSSProperties>> | ((info: { props: FormProps<Values> }) => Partial<Record<FormSemanticName, JSX.CSSProperties>>);

export interface FormProps<Values extends FormValues = FormValues> extends Omit<JSX.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onReset' | 'onChange'> {
  form?: FormInstance<Values>;
  name?: string;
  initialValues?: Partial<Values>;
  layout?: 'horizontal' | 'vertical' | 'inline';
  component?: keyof JSX.IntrinsicElements | false;
  fields?: readonly FieldData[];
  preserve?: boolean;
  clearOnDestroy?: boolean;
  validateTrigger?: string | readonly string[];
  scrollToFirstError?: boolean | ScrollIntoViewOptions;
  classNames?: FormSemanticClassNames<Values>;
  styles?: FormSemanticStyles<Values>;
  colon?: boolean;
  labelAlign?: 'left' | 'right';
  labelWrap?: boolean;
  labelCol?: { span?: number; offset?: number };
  wrapperCol?: { span?: number; offset?: number };
  size?: 'small' | 'middle' | 'large';
  variant?: 'outlined' | 'borderless' | 'filled' | 'underlined';
  tooltip?: JSX.Element | { title: JSX.Element; icon?: JSX.Element };
  feedbackIcons?: (info: { status?: FormFieldStatus; errors: JSX.Element[]; warnings: JSX.Element[] }) => Partial<Record<FormFieldStatus, JSX.Element>>;
  disabled?: boolean;
  requiredMark?: boolean;
  validateMessages?: Record<string, any>;
  onFinish?: (values: Values) => void | Promise<void>;
  onFinishFailed?: (error: ValidateErrorInfo<Values>) => void;
  onValuesChange?: (changedValues: Partial<Values>, allValues: Values) => void;
  onFieldsChange?: (changedFields: FieldData[], allFields: FieldData[]) => void;
  onReset?: JSX.EventHandler<HTMLFormElement, Event>;
}

export interface FormItemProps {
  name?: NamePath;
  label?: JSX.Element;
  rules?: readonly RuleConfig[];
  dependencies?: readonly NamePath[];
  preserve?: boolean;
  validateTrigger?: string | readonly string[];
  validateFirst?: boolean | 'parallel';
  validateDebounce?: number;
  normalize?: (value: unknown, previousValue: unknown, allValues: FormValues) => unknown;
  valuePropName?: string;
  trigger?: string;
  getValueProps?: (value: unknown) => Record<string, unknown>;
  getValueFromEvent?: (...args: unknown[]) => unknown;
  messageVariables?: Record<string, string>;
  required?: boolean;
  initialValue?: unknown;
  help?: JSX.Element;
  extra?: JSX.Element;
  validateStatus?: FormFieldStatus;
  hasFeedback?: boolean | { icons: NonNullable<FormProps['feedbackIcons']> };
  hidden?: boolean;
  tooltip?: JSX.Element | { title: JSX.Element; icon?: JSX.Element };
  layout?: 'horizontal' | 'vertical';
  htmlFor?: string;
  noStyle?: boolean;
  class?: string;
  labelClass?: string;
  controlClass?: string;
  children?: JSX.Element | ((form: FormInstance) => JSX.Element);
}

export function useForm<Values extends FormValues = FormValues>(initialValues?: Partial<Values>): [FormInstance<Values>] {
  return [createForm(initialValues)];
}

function FormRoot<Values extends FormValues = FormValues>(inputProps: FormProps<Values>) {
  const config = useConfig();
  const props = merge({ layout: 'horizontal' as const, component: 'form' as const, requiredMark: true, preserve: true, validateTrigger: 'onChange' as const, colon: true, labelAlign: 'right' as const }, config.componentDefaults('form') as Partial<FormProps<Values>>, inputProps);
  const [ownForm] = useForm<Values>(props.initialValues);
  const [dependencyVersion, setDependencyVersion] = createSignal(0, { ownedWrite: true });
  const dependencyEntries = new Set<{ name?: NamePath; dependencies: readonly string[] }>();
  const form = (props.form ?? ownForm) as InternalFormInstance<Values>;
  const provider = useContext(FormProviderContext);
  form._setInitialValues(props.initialValues);
  if (props.name && provider) provider.forms[props.name] = form as unknown as FormInstance;
  let formRef: HTMLElement | undefined;
  form._setFieldResolver((name) => {
    const key = namePathKey(name);
    return Array.from(formRef?.querySelectorAll<HTMLElement>('[data-form-field]') ?? []).find((element) => element.dataset.formField === key);
  });
  const semanticClasses = () => typeof props.classNames === 'function' ? props.classNames({ props }) : props.classNames ?? {};
  const semanticStyles = () => typeof props.styles === 'function' ? props.styles({ props }) : props.styles ?? {};
  createEffect(() => props.fields, (next) => { if (next) form.setFields(next); });
  const others = omit(
    props,
    'form', 'name', 'initialValues', 'layout', 'component', 'fields', 'preserve', 'clearOnDestroy', 'validateTrigger', 'scrollToFirstError', 'classNames', 'styles', 'colon', 'labelAlign', 'labelWrap', 'labelCol', 'wrapperCol', 'size', 'variant', 'tooltip', 'feedbackIcons', 'disabled', 'requiredMark', 'validateMessages', 'onFinish',
    'onFinishFailed', 'onValuesChange', 'onFieldsChange', 'onReset', 'children', 'class', 'style',
  );

  const submit = async () => {
    let values: Values;
    try {
      values = await form.validateFields();
    } catch (error) {
      const validationError = error as ValidateErrorInfo<Values>;
      props.onFinishFailed?.(validationError);
      if (props.scrollToFirstError && validationError.errorFields[0]) {
        form.scrollToField(validationError.errorFields[0].name, { ...(typeof props.scrollToFirstError === 'object' ? props.scrollToFirstError : { block: 'nearest' }), focus: true });
      }
      return;
    }
    await props.onFinish?.(values);
    if (props.name && provider) provider.onFormFinish?.(props.name, { values, forms: provider.forms });
  };
  form._setSubmit(() => formRef instanceof HTMLFormElement ? formRef.requestSubmit() : void submit());
  onCleanup(() => {
    form._setSubmit(() => undefined);
    form._setFieldResolver(() => undefined);
    form._destroy(Boolean(props.clearOnDestroy));
    if (props.name && provider?.forms[props.name] === form as unknown as FormInstance) delete provider.forms[props.name];
  });

  const context: FormContextValue<Values> = {
    form,
    layout: () => props.layout,
    disabled: () => Boolean(props.disabled),
    requiredMark: () => props.requiredMark,
    validateMessages: () => ({ ...config.locale().Form?.defaultValidateMessages, ...props.validateMessages }),
    preserve: () => props.preserve,
    validateTrigger: () => props.validateTrigger,
    semanticClasses,
    semanticStyles,
    colon: () => props.colon,
    labelAlign: () => props.labelAlign,
    labelWrap: () => Boolean(props.labelWrap),
    labelCol: () => props.labelCol,
    wrapperCol: () => props.wrapperCol,
    tooltip: () => props.tooltip,
    feedbackIcons: () => props.feedbackIcons,
    variant: () => props.variant,
    setFieldValue(name, value) {
      form.setFieldValue(name, value);
      const key = namePathKey(name);
      setDependencyVersion((version) => version + 1);
      for (const entry of dependencyEntries) if (entry.name && entry.dependencies.includes(key)) void form.validateFields([entry.name]).catch(() => undefined);
      props.onValuesChange?.({ [key]: value } as Partial<Values>, form.getFieldsValue() as Values);
      props.onFieldsChange?.(form._getFieldData([name]), form._getFieldData());
      if (props.name && provider) provider.onFormChange?.(props.name, { changedFields: [{ name, value }], forms: provider.forms });
    },
    async validateField(name, trigger) {
      if (trigger) return form._validateField(name, trigger);
      try {
        await form.validateFields([name]);
      } catch {
        // Field errors are available through the form instance.
      }
      return form.getFieldError(name);
    },
    dependencyVersion,
    registerDependencies(name, dependencies) {
      const entry = { name, dependencies: dependencies.map(namePathKey) };
      dependencyEntries.add(entry);
      return () => dependencyEntries.delete(entry);
    },
  };

  const handleSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (event) => {
    event.preventDefault();
    void submit();
  };
  const handleReset: JSX.EventHandler<HTMLFormElement, Event> = (event) => {
    event.preventDefault();
    form.resetFields();
    if (typeof props.onReset === 'function') props.onReset(event);
  };

  const content = () => props.component === false ? props.children : (
    <Dynamic
      component={props.component}
      {...others}
      ref={(element: HTMLElement) => { formRef = element; }}
      data-layout={props.layout}
      class={formStyles({ layout: props.layout }).root({ class: [semanticClasses().root, props.class as string | undefined].filter(Boolean).join(' ') })}
      style={{ ...semanticStyles().root, ...(props.style && typeof props.style === 'object' ? props.style as JSX.CSSProperties : {}) }}
      aria-disabled={props.disabled ? 'true' : undefined}
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      {props.children}
    </Dynamic>
  );
  return <FormContext value={context as FormContextValue}><SizeContext value={() => props.size ?? config.componentSize()}>{content()}</SizeContext></FormContext>;
}

export function FormItem(props: FormItemProps) {
  const context = useContext(FormContext);
  const listPrefix = useContext(FormListContext);
  const effectiveName = () => props.name === undefined ? undefined : [...listPrefix, ...toNamePath(props.name)];
  const fieldKey = () => effectiveName() ? namePathKey(effectiveName()!) : undefined;
  const uid = createUniqueId();
  const helpId = `${uid}-help`;
  const controlId = `${uid}-control`;
  const rules = (): Rule[] => (props.rules ?? []).map((rule) => typeof rule === 'function' ? context ? rule(context.form) : {} : rule);
  const isRequired = () => props.required ?? rules().some((rule) => rule.required);
  const errors = () => effectiveName() && context ? context.form.getFieldError(effectiveName()!) : [];
  const warnings = () => effectiveName() && context ? context.form.getFieldWarning(effectiveName()!) : [];
  const status = (): FormFieldStatus | undefined => props.validateStatus ?? (effectiveName() && context?.form.isFieldValidating(effectiveName()!) ? 'validating' : errors().length > 0 ? 'error' : warnings().length > 0 ? 'warning' : undefined);
  const help = () => props.help ?? errors()[0] ?? warnings()[0];
  const styles = () => formStyles({ layout: context?.layout() ?? 'horizontal', status: status() });

  let unregister: (() => void) | undefined;
  let unregisterDependencies: (() => void) | undefined;
  if (context && props.dependencies?.length) {
    const dependencies = props.dependencies.map((dependency) => [...listPrefix, ...toNamePath(dependency)]);
    unregisterDependencies = context.registerDependencies(effectiveName(), dependencies);
  }
  if (effectiveName() && context) {
    unregister = context.form._registerField(effectiveName()!, {
      rules,
      label: () => typeof props.label === 'string' ? props.label : fieldKey()!,
      validateFirst: () => props.validateFirst,
      validateDebounce: () => props.validateDebounce,
      messageVariables: () => props.messageVariables,
      validateMessages: () => context.validateMessages(),
    }, props.initialValue, props.preserve ?? context.preserve());
  }
  onCleanup(() => { unregister?.(); unregisterDependencies?.(); });

  const [bindingRoot, setBindingRoot] = createSignal<HTMLElement | null>(null, { ownedWrite: true });
  let contextConsumed = false;
  const control: FormItemControl | undefined = effectiveName() && context ? {
    name: fieldKey()!,
    id: controlId,
    value: () => context.form.getFieldValue(effectiveName()!),
    setValue: (value) => {
      const previousValue = context.form.getFieldValue(effectiveName()!);
      const normalized = props.normalize ? props.normalize(value, previousValue, context.form.getFieldsValue(true) as FormValues) : value;
      context.setFieldValue(effectiveName()!, normalized);
      const triggers = props.validateTrigger ?? context.validateTrigger();
      if ((Array.isArray(triggers) ? triggers : [triggers]).includes('onChange')) void context.validateField(effectiveName()!, 'onChange');
    },
    validate: (trigger) => {
      const configured = props.validateTrigger ?? context.validateTrigger();
      const triggers = Array.isArray(configured) ? configured : [configured];
      return trigger && !triggers.includes(trigger) ? Promise.resolve(errors()) : context.validateField(effectiveName()!, trigger);
    },
    status,
    errors,
    warnings,
    describedBy: () => help() || props.extra ? helpId : undefined,
    disabled: () => context.disabled(),
    variant: () => context.variant(),
    _markConsumed: () => { contextConsumed = true; },
  } : undefined;

  const nativeControl = (root: HTMLElement | null) => root?.querySelector<HTMLElement>('input,select,textarea,[contenteditable="true"],[data-form-control]');
  createEffect(
    () => ({ root: bindingRoot(), value: control?.value(), valuePropName: props.valuePropName ?? 'value', valueProps: props.getValueProps }),
    ({ root, value, valuePropName, valueProps }) => {
      const element = nativeControl(root);
      if (contextConsumed || !element || element.id === controlId) return;
      const nextProps = valueProps?.(value) ?? { [valuePropName]: value ?? '' };
      for (const [name, nextValue] of Object.entries(nextProps)) {
        if (name in element) (element as unknown as Record<string, unknown>)[name] = nextValue;
        else if (nextValue === false || nextValue == null) element.removeAttribute(name);
        else element.setAttribute(name, nextValue === true ? '' : String(nextValue));
      }
    },
  );
  createEffect(
    () => ({ root: bindingRoot(), trigger: props.trigger ?? 'onChange' }),
    ({ root, trigger }) => {
      if (!root || !control) return;
      const eventNames = trigger === 'onChange' ? ['input', 'change'] : [trigger.replace(/^on/, '').toLowerCase()];
      const handler = (event: Event) => {
        const element = nativeControl(root);
        if (contextConsumed || !element || event.target !== element || element.id === controlId) return;
        const value = props.getValueFromEvent?.(event) ?? (element as unknown as Record<string, unknown>)[props.valuePropName ?? 'value'];
        if (!Object.is(control.value(), value)) control.setValue(value);
      };
      for (const eventName of eventNames) root.addEventListener(eventName, handler, eventName === 'blur' || eventName === 'focus');
      return () => { for (const eventName of eventNames) root.removeEventListener(eventName, handler, eventName === 'blur' || eventName === 'focus'); };
    },
  );
  createEffect(
    () => ({ root: bindingRoot(), configured: props.validateTrigger ?? context?.validateTrigger() }),
    ({ root, configured }) => {
      if (!root || !control || !configured) return;
      const triggers = (Array.isArray(configured) ? configured : [configured]).filter((trigger) => trigger !== 'onChange');
      const listeners = triggers.map((trigger) => ({ trigger, eventName: trigger.replace(/^on/, '').toLowerCase() }));
      const handler = (trigger: string) => (event: Event) => {
        const element = nativeControl(root);
        if (contextConsumed || !element || event.target !== element || element.id === controlId) return;
        void control.validate(trigger);
      };
      const handlers = listeners.map(({ trigger, eventName }) => ({ eventName, handler: handler(trigger) }));
      for (const entry of handlers) root.addEventListener(entry.eventName, entry.handler, entry.eventName === 'blur' || entry.eventName === 'focus');
      return () => { for (const entry of handlers) root.removeEventListener(entry.eventName, entry.handler, entry.eventName === 'blur' || entry.eventName === 'focus'); };
    },
  );

  const content = () => {
    if (props.noStyle && props.dependencies?.length && typeof props.children === 'function' && context) {
      return <FormItemContext value={control ?? null}>{(props.children as unknown as (form: FormInstance) => JSX.Element)(context.form)}</FormItemContext>;
    }
    return <FormItemContext value={control ?? null}>{props.children as JSX.Element}</FormItemContext>;
  };

  if (props.noStyle && props.dependencies?.length) return <span ref={setBindingRoot} style={{ display: 'contents' }}><Show when={{ version: context?.dependencyVersion() ?? 0 }} keyed>{(_) => content()}</Show></span>;
  if (props.noStyle) return <span ref={setBindingRoot} style={{ display: 'contents' }}>{content()}</span>;

  const tooltip = () => props.tooltip ?? context?.tooltip();
  const tooltipTitle = () => { const value = tooltip(); return value && typeof value === 'object' && 'title' in value ? value.title : value; };
  const tooltipIcon = () => { const value = tooltip(); return value && typeof value === 'object' && 'icon' in value ? value.icon : '?'; };
  const feedback = () => {
    if (!props.hasFeedback || !status()) return undefined;
    const icons = typeof props.hasFeedback === 'object' ? props.hasFeedback.icons : context?.feedbackIcons();
    return icons?.({ status: status(), errors: errors(), warnings: warnings() })[status()!];
  };
  const spanStyle = (column: FormProps['labelCol']): JSX.CSSProperties => column?.span ? { width: `${column.span / 24 * 100}%`, 'margin-left': column.offset ? `${column.offset / 24 * 100}%` : undefined } : {};

  return (
    <div ref={setBindingRoot} data-form-field={fieldKey()} hidden={props.hidden} class={styles().item({ class: [props.hidden ? 'hidden' : '', props.class].filter(Boolean).join(' ') })}>
      <Show when={props.label}>
        <label for={props.htmlFor ?? (effectiveName() ? controlId : undefined)} class={styles().label({ class: [context?.semanticClasses().label, props.labelClass, context?.labelAlign() === 'left' ? 'text-left' : 'text-right', context?.labelWrap() ? 'whitespace-normal' : 'whitespace-nowrap'].filter(Boolean).join(' ') })} style={{ ...spanStyle(context?.labelCol()), ...context?.semanticStyles().label }}>
          <Show when={isRequired() && (context?.requiredMark() ?? true)}><span aria-hidden="true" class="mr-1 text-error">*</span></Show>
          {props.label}<Show when={context?.colon()}><span aria-hidden="true">:</span></Show>
          <Show when={tooltip()}><span title={typeof tooltipTitle() === 'string' ? tooltipTitle() as string : undefined} class="ml-1 cursor-help text-text-secondary">{tooltipIcon()}</span></Show>
        </label>
      </Show>
      <div class={styles().control({ class: [context?.semanticClasses().content, props.controlClass].filter(Boolean).join(' ') })} style={{ ...spanStyle(context?.wrapperCol()), ...context?.semanticStyles().content }}>
        {content()}
        <Show when={feedback()}><span aria-hidden="true" class="ml-1 inline-flex">{feedback()}</span></Show>
        <Show when={help()}>
          <div id={helpId} role={status() === 'error' ? 'alert' : undefined} class={styles().help({ class: context?.semanticClasses().help })} style={context?.semanticStyles().help}><span class={context?.semanticClasses().helpItem} style={context?.semanticStyles().helpItem}>{help()}</span></div>
        </Show>
        <Show when={props.extra}><div id={help() ? undefined : helpId} class={styles().extra({ class: context?.semanticClasses().extra })} style={context?.semanticStyles().extra}>{props.extra}</div></Show>
      </div>
    </div>
  );
}

export interface FormListFieldData { name: number; key: number }
export interface FormListOperation {
  add: (defaultValue?: unknown, insertIndex?: number) => void;
  remove: (index: number | readonly number[]) => void;
  move: (from: number, to: number) => void;
}
export interface FormListProps {
  name: NamePath;
  rules?: readonly RuleConfig[];
  initialValue?: readonly unknown[];
  children: (fields: FormListFieldData[], operation: FormListOperation, meta: { errors: string[]; warnings: string[] }) => JSX.Element;
}

let listKey = 0;
export function FormList(props: FormListProps) {
  const context = useContext(FormContext);
  const parentPrefix = useContext(FormListContext);
  const path = [...parentPrefix, ...toNamePath(props.name)];
  let keys: number[] = [];
  const values = () => context?.form.getFieldValue(path) as readonly unknown[] | undefined;
  const syncKeys = () => {
    const length = values()?.length ?? 0;
    while (keys.length < length) keys.push(listKey += 1);
    if (keys.length > length) keys = keys.slice(0, length);
  };
  let unregister: (() => void) | undefined;
  if (context) unregister = context.form._registerField(path, { rules: () => (props.rules ?? []).map((rule) => typeof rule === 'function' ? rule(context.form) : rule), label: () => namePathKey(path) }, props.initialValue ?? []);
  onCleanup(() => unregister?.());
  const update = (next: unknown[]) => context?.setFieldValue(path, next);
  const operation: FormListOperation = {
    add(defaultValue, insertIndex) {
      const next = [...(values() ?? [])];
      const index = Math.max(0, Math.min(insertIndex ?? next.length, next.length));
      next.splice(index, 0, defaultValue);
      keys.splice(index, 0, listKey += 1);
      update(next);
    },
    remove(index) {
      const removed = new Set(Array.isArray(index) ? index : [index]);
      update([...(values() ?? [])].filter((_, itemIndex) => !removed.has(itemIndex)));
      keys = keys.filter((_, itemIndex) => !removed.has(itemIndex));
    },
    move(from, to) {
      const next = [...(values() ?? [])];
      if (from < 0 || from >= next.length || to < 0 || to >= next.length || from === to) return;
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      const [key] = keys.splice(from, 1);
      keys.splice(to, 0, key);
      update(next);
    },
  };
  const fields = () => { syncKeys(); return (values() ?? []).map((_, index) => ({ name: index, key: keys[index] })); };
  const errors = () => context?.form.getFieldError(path) ?? [];
  const state = () => ({ fields: fields(), errors: errors() });
  return <FormListContext value={path}><Show when={state()} keyed>{(current) => props.children(current.fields, operation, { errors: current.errors, warnings: [] })}</Show></FormListContext>;
}

export interface FormErrorListProps {
  fieldId?: string;
  help?: JSX.Element;
  errors?: readonly JSX.Element[];
  warnings?: readonly JSX.Element[];
  class?: string;
  onVisibleChanged?: (visible: boolean) => void;
}
export function FormErrorList(props: FormErrorListProps) {
  const visible = () => Boolean(props.help || props.errors?.length || props.warnings?.length);
  createEffect(() => visible(), (next) => props.onVisibleChanged?.(next));
  return <Show when={visible()}><div id={props.fieldId} class={['ads-form-error-list space-y-1 text-xs', props.class]}><Show when={props.help}><div>{props.help}</div></Show><For each={props.errors}>{(error) => <div role="alert" class="text-error">{error}</div>}</For><For each={props.warnings}>{(warning) => <div class="text-warning">{warning}</div>}</For></div></Show>;
}

export interface FormProviderProps {
  onFormChange?: FormProviderValue['onFormChange'];
  onFormFinish?: FormProviderValue['onFormFinish'];
  children?: JSX.Element;
}
export function FormProvider(props: FormProviderProps) {
  const parent = useContext(FormProviderContext);
  const value: FormProviderValue = { forms: parent?.forms ?? {}, onFormChange: props.onFormChange ?? parent?.onFormChange, onFormFinish: props.onFormFinish ?? parent?.onFormFinish };
  return <FormProviderContext value={value}>{props.children}</FormProviderContext>;
}

export function useFormItemStatus() {
  const control = useContext(FormItemContext);
  return {
    get status() { return control?.status(); },
    get errors() { return control?.errors() ?? []; },
    get warnings() { return control?.warnings() ?? []; },
  };
}

export function useFormInstance<Values extends FormValues = FormValues>(): FormInstance<Values> {
  const context = useContext(FormContext);
  if (!context) throw new Error('Form.useFormInstance must be used inside Form');
  return context.form as InternalFormInstance<Values>;
}

export function useWatch(name: NamePath, form?: FormInstance): () => unknown {
  const context = useContext(FormContext);
  const target = form ?? context?.form;
  if (!target) throw new Error('Form.useWatch requires a form instance or Form context');
  return createMemo(() => target.getFieldValue(name));
}

export const FormItemComponent = Object.assign(FormItem, { useStatus: useFormItemStatus });
export const Form = Object.assign(FormRoot, {
  Item: FormItemComponent,
  List: FormList,
  ErrorList: FormErrorList,
  Provider: FormProvider,
  useForm,
  useFormInstance,
  useWatch,
});
