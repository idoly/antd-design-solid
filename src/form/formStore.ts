import { createSignal } from 'solid-js';

export type FormValues = Record<string, unknown>;
export type DeepPartial<T> = T extends readonly unknown[] ? T : T extends object ? { [Key in keyof T]?: DeepPartial<T[Key]> } : T;
export type NamePath = string | number | readonly (string | number)[];

export const toNamePath = (name: NamePath): (string | number)[] => Array.isArray(name) ? [...name] : typeof name === 'string' && name.includes('.') ? name.split('.').map((part) => /^\d+$/.test(part) ? Number(part) : part) : [name as string | number];
export const namePathKey = (name: NamePath): string => toNamePath(name).join('.');

export function getPathValue(source: unknown, name: NamePath): unknown {
  return toNamePath(name).reduce<unknown>((value, key) => value != null && typeof value === 'object' ? (value as Record<string | number, unknown>)[key] : undefined, source);
}

export function setPathValue<Values extends FormValues>(source: Values, name: NamePath, value: unknown): Values {
  const path = toNamePath(name);
  const root: unknown = Array.isArray(source) ? [...source] : { ...source };
  let cursor = root as Record<string | number, unknown>;
  path.forEach((key, index) => {
    if (index === path.length - 1) { cursor[key] = value; return; }
    const existing = cursor[key];
    const nextKey = path[index + 1];
    const clone = Array.isArray(existing) ? [...existing] : existing && typeof existing === 'object' ? { ...existing as object } : typeof nextKey === 'number' ? [] : {};
    cursor[key] = clone;
    cursor = clone as Record<string | number, unknown>;
  });
  return root as Values;
}

function mergeFormValues(current: unknown, next: unknown): unknown {
  if (Array.isArray(next)) return next.map((item) => item && typeof item === 'object' ? mergeFormValues(Array.isArray(item) ? [] : {}, item) : item);
  if (!next || typeof next !== 'object') return next;
  const base = current && typeof current === 'object' && !Array.isArray(current) ? current as Record<string, unknown> : {};
  return Object.fromEntries(Array.from(new Set([...Object.keys(base), ...Object.keys(next as object)])).map((key) => [key, Object.prototype.hasOwnProperty.call(next, key) ? mergeFormValues(base[key], (next as Record<string, unknown>)[key]) : base[key]]));
}

function valueLeafPaths(value: unknown, prefix: (string | number)[] = []): (string | number)[][] {
  if (Array.isArray(value)) return value.length ? value.flatMap((item, index) => valueLeafPaths(item, [...prefix, index])) : [prefix];
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    return entries.length ? entries.flatMap(([key, item]) => valueLeafPaths(item, [...prefix, key])) : [prefix];
  }
  return [prefix];
}

function deletePathValue<Values extends FormValues>(source: Values, name: NamePath): Values {
  const path = toNamePath(name);
  if (path.length === 0) return source;
  const next = setPathValue(source, path, undefined);
  const parent = getPathValue(next, path.slice(0, -1));
  const key = path[path.length - 1];
  if (Array.isArray(parent) && typeof key === 'number') parent.splice(key, 1);
  else if (parent && typeof parent === 'object') delete (parent as Record<string | number, unknown>)[key];
  return next;
}

export interface Rule {
  required?: boolean;
  message?: string;
  min?: number;
  max?: number;
  len?: number;
  pattern?: RegExp;
  type?: 'string' | 'number' | 'email' | 'array' | 'object' | 'boolean' | 'integer' | 'float' | 'url' | 'hex' | 'tel' | 'date' | 'regexp' | 'method' | 'enum' | 'any';
  whitespace?: boolean;
  enum?: readonly unknown[];
  transform?: (value: unknown) => unknown;
  warningOnly?: boolean;
  validateTrigger?: string | readonly string[];
  defaultField?: Rule | readonly Rule[];
  fields?: Record<string, Rule | readonly Rule[]>;
  validator?: (rule: Rule, value: unknown, callback: (error?: string) => void, values?: FormValues) => void | string | Promise<void | string>;
}

export interface FieldError {
  name: NamePath;
  errors: string[];
}

export interface FieldData {
  name: NamePath;
  value?: unknown;
  touched?: boolean;
  validating?: boolean;
  errors?: string[];
  warnings?: string[];
}

export interface FormFieldMeta {
  touched: boolean;
  validating: boolean;
}

export interface GetFieldsValueConfig {
  strict?: boolean;
  filter?: (meta: FormFieldMeta) => boolean;
}

export interface ValidateConfig {
  validateOnly?: boolean;
  recursive?: boolean;
  dirty?: boolean;
}

export interface ValidateErrorInfo<Values extends FormValues = FormValues> {
  values: Values;
  errorFields: FieldError[];
  outOfDate?: boolean;
}

interface FieldRegistration {
  rules: () => readonly Rule[];
  label: () => string;
  validateFirst?: () => boolean | 'parallel' | undefined;
  validateDebounce?: () => number | undefined;
  messageVariables?: () => Record<string, string> | undefined;
  validateMessages?: () => Record<string, any> | undefined;
}

export interface FormInstance<Values extends FormValues = FormValues> {
  getFieldValue: (name: keyof Values | NamePath) => unknown;
  getFieldsValue: (nameList?: true | readonly (keyof Values | NamePath)[] | GetFieldsValueConfig, filter?: (meta: FormFieldMeta) => boolean) => Partial<Values>;
  getFieldError: (name: keyof Values | NamePath) => string[];
  getFieldWarning: (name: keyof Values | NamePath) => string[];
  getFieldsError: (names?: readonly (keyof Values | NamePath)[]) => FieldError[];
  getFieldInstance: (name: keyof Values | NamePath) => HTMLElement | undefined;
  isFieldTouched: (name: keyof Values | NamePath) => boolean;
  isFieldsTouched: (names?: readonly (keyof Values | NamePath)[] | boolean, allTouched?: boolean) => boolean;
  isFieldValidating: (name: keyof Values | NamePath) => boolean;
  setFieldValue: (name: keyof Values | NamePath, value: unknown) => void;
  setFieldsValue: (values: DeepPartial<Values>) => void;
  setFields: (fields: readonly FieldData[]) => void;
  resetFields: (names?: readonly (keyof Values | NamePath)[]) => void;
  validateFields: (names?: readonly (keyof Values | NamePath)[], config?: ValidateConfig) => Promise<Values>;
  scrollToField: (name: keyof Values | NamePath, options?: ScrollIntoViewOptions & { focus?: boolean }) => void;
  focusField: (name: keyof Values | NamePath, options?: FocusOptions & { cursor?: 'start' | 'end' | 'all' }) => void;
  submit: () => void;
}

export type RuleConfig<Values extends FormValues = FormValues> = Rule | ((form: FormInstance<Values>) => Rule);

export interface InternalFormInstance<Values extends FormValues = FormValues> extends FormInstance<Values> {
  _registerField: (name: NamePath, field: FieldRegistration, initialValue?: unknown, preserve?: boolean) => () => void;
  _validateField: (name: NamePath, trigger?: string) => Promise<string[]>;
  _getFieldData: (names?: readonly NamePath[]) => FieldData[];
  _destroy: (clear: boolean) => void;
  _setInitialValues: (values?: Partial<Values>) => void;
  _setSubmit: (submit: () => void) => void;
  _setFieldResolver: (resolver: (name: NamePath) => HTMLElement | undefined) => void;
}

const isEmpty = (value: unknown) => value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
const valueSize = (value: unknown) => typeof value === 'number' ? value : typeof value === 'string' || Array.isArray(value) ? value.length : undefined;

function applyMessage(template: unknown, label: string, rule: Rule): string | undefined {
  if (typeof template !== 'string') return undefined;
  const values: Record<string, unknown> = { label, type: rule.type, min: rule.min, max: rule.max, len: rule.len, pattern: rule.pattern };
  return template.replace(/\$\{(\w+)\}/g, (_, key) => String(values[key] ?? key));
}

function defaultMessage(name: string, rule: Rule, messages?: Record<string, any>, value?: unknown): string {
  let template: unknown;
  if (rule.required) template = messages?.required;
  else if (rule.type) template = messages?.types?.[rule.type];
  else if (rule.whitespace) template = messages?.whitespace;
  else if (rule.pattern) template = messages?.pattern?.mismatch;
  else {
    const category = typeof value === 'number' ? 'number' : Array.isArray(value) ? 'array' : 'string';
    if (rule.len !== undefined) template = messages?.[category]?.len;
    else if (rule.min !== undefined) template = messages?.[category]?.min;
    else if (rule.max !== undefined) template = messages?.[category]?.max;
  }
  const localized = applyMessage(template ?? messages?.default, name, rule);
  if (localized) return localized;
  if (rule.required) return `${name} is required`;
  if (rule.type === 'email') return `${name} is not a valid email`;
  if (rule.type) return `${name} is not a valid ${rule.type}`;
  if (rule.pattern) return `${name} does not match the required pattern`;
  if (rule.len !== undefined) return `${name} must be exactly ${rule.len}`;
  if (rule.min !== undefined) return `${name} must be at least ${rule.min}`;
  if (rule.max !== undefined) return `${name} must be at most ${rule.max}`;
  return `${name} is invalid`;
}

async function validateRule(rule: Rule, rawValue: unknown, values: FormValues, label: string, messages?: Record<string, any>, messageVariables?: Record<string, string>): Promise<string | undefined> {
  const value = rule.transform ? rule.transform(rawValue) : rawValue;
  const message = (fallback: string) => {
    const template = rule.message ?? fallback;
    const variables: Record<string, unknown> = { label, type: rule.type, min: rule.min, max: rule.max, len: rule.len, pattern: rule.pattern, ...messageVariables };
    return template.replace(/\$\{(\w+)\}/g, (_, key) => String(variables[key] ?? key));
  };
  if (rule.required && isEmpty(value)) return message(defaultMessage(label, rule, messages, value));
  if (isEmpty(value)) return undefined;

  let invalidType = false;
  if (rule.type === 'string') invalidType = typeof value !== 'string';
  if (rule.type === 'number' || rule.type === 'float') invalidType = typeof value !== 'number' || Number.isNaN(value);
  if (rule.type === 'integer') invalidType = typeof value !== 'number' || !Number.isInteger(value);
  if (rule.type === 'array') invalidType = !Array.isArray(value);
  if (rule.type === 'object') invalidType = value === null || typeof value !== 'object' || Array.isArray(value);
  if (rule.type === 'boolean') invalidType = typeof value !== 'boolean';
  if (rule.type === 'regexp') invalidType = !(value instanceof RegExp);
  if (rule.type === 'method') invalidType = typeof value !== 'function';
  if (rule.type === 'date') invalidType = !(value instanceof Date) || Number.isNaN(value.valueOf());
  if (rule.type === 'email') invalidType = typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  if (rule.type === 'url') { try { if (typeof value !== 'string') invalidType = true; else new URL(value); } catch { invalidType = true; } }
  if (rule.type === 'hex') invalidType = typeof value !== 'string' || !/^(?:#|0x)?[0-9a-f]+$/i.test(value);
  if (rule.type === 'tel') invalidType = typeof value !== 'string' || !/^\+?[0-9](?:[0-9 .()-]{5,}[0-9])$/.test(value);
  if (rule.type === 'enum') invalidType = !rule.enum?.some((item) => Object.is(item, value));
  if (invalidType) return message(rule.type === 'enum' ? `${label} must be one of the allowed values` : defaultMessage(label, rule, messages, value));
  if (rule.whitespace && typeof value === 'string' && value.trim().length === 0) return message(defaultMessage(label, { ...rule, required: false, whitespace: true }, messages, value));
  if (rule.pattern && (typeof value !== 'string' || !new RegExp(rule.pattern.source, rule.pattern.flags).test(value))) return message(defaultMessage(label, rule, messages, value));

  const size = valueSize(value);
  if (rule.len !== undefined && size !== rule.len) return message(defaultMessage(label, rule, messages, value));
  if (rule.min !== undefined && size !== undefined && size < rule.min) return message(defaultMessage(label, rule, messages, value));
  if (rule.max !== undefined && size !== undefined && size > rule.max) return message(defaultMessage(label, rule, messages, value));

  if (rule.defaultField && Array.isArray(value)) {
    const nestedRules = Array.isArray(rule.defaultField) ? rule.defaultField : [rule.defaultField];
    for (let index = 0; index < value.length; index += 1) {
      for (const nestedRule of nestedRules) {
        const nested = await validateRule(nestedRule, value[index], values, `${label}.${index}`, messages, messageVariables);
        if (nested) return nested;
      }
    }
  }
  if (rule.fields && value !== null && typeof value === 'object') {
    for (const [key, configuredRules] of Object.entries(rule.fields)) {
      const nestedRules = Array.isArray(configuredRules) ? configuredRules : [configuredRules];
      for (const nestedRule of nestedRules) {
        const nested = await validateRule(nestedRule, (value as Record<string, unknown>)[key], values, `${label}.${key}`, messages, messageVariables);
        if (nested) return nested;
      }
    }
  }

  if (rule.validator) {
    try {
      let resolveCallback!: (error?: string) => void;
      const callbackResult = new Promise<string | undefined>((resolve) => { resolveCallback = resolve; });
      const result = rule.validator(rule, value, resolveCallback, values);
      if (result && typeof (result as Promise<unknown>).then === 'function') {
        const resolved = await result;
        return typeof resolved === 'string' ? resolved : undefined;
      }
      if (typeof result === 'string') return result;
      return rule.validator.length >= 3 ? await callbackResult : undefined;
    } catch (error) {
      return error instanceof Error ? error.message : message(defaultMessage(label, rule, messages, value));
    }
  }
  return undefined;
}

export function createForm<Values extends FormValues = FormValues>(initial?: Partial<Values>): InternalFormInstance<Values> {
  let currentValues = { ...(initial ?? {}) } as Values;
  let initialValues = { ...(initial ?? {}) } as Partial<Values>;
  let currentErrors: Record<string, string[]> = {};
  let currentWarnings: Record<string, string[]> = {};
  const touchedFields = new Set<string>();
  const validatingFields = new Set<string>();
  const validatedFields = new Set<string>();
  let submitHandler: () => void = () => undefined;
  let resolveField: (name: NamePath) => HTMLElement | undefined = () => undefined;
  const fields = new Map<string, FieldRegistration>();
  const validationVersions = new Map<string, number>();
  const [values, setValues] = createSignal<FormValues>(currentValues, { ownedWrite: true });
  const [errors, setErrors] = createSignal(currentErrors, { ownedWrite: true });
  const [warnings, setWarnings] = createSignal(currentWarnings, { ownedWrite: true });
  const [metaVersion, setMetaVersion] = createSignal(0, { ownedWrite: true });

  const updateValues = (next: Values) => {
    currentValues = next;
    setValues(next as FormValues);
  };
  const updateErrors = (name: string, fieldErrors: string[]) => {
    currentErrors = { ...currentErrors, [name]: fieldErrors };
    setErrors(currentErrors);
  };
  const updateWarnings = (name: string, fieldWarnings: string[]) => {
    currentWarnings = { ...currentWarnings, [name]: fieldWarnings };
    setWarnings(currentWarnings);
  };
  const invalidateValidation = (name: string) => {
    validationVersions.set(name, (validationVersions.get(name) ?? 0) + 1);
    if (validatingFields.delete(name)) setMetaVersion((current) => current + 1);
  };
  const validateField = async (name: string, field: FieldRegistration, validateOnly = false, trigger?: string): Promise<{ errors: string[]; warnings: string[]; outOfDate: boolean }> => {
    const version = (validationVersions.get(name) ?? 0) + 1;
    validationVersions.set(name, version);
    validatingFields.add(name);
    setMetaVersion((current) => current + 1);
    const debounce = Math.max(0, field.validateDebounce?.() ?? 0);
    if (debounce) await new Promise((resolve) => setTimeout(resolve, debounce));
    if (validationVersions.get(name) !== version) return { errors: [], warnings: [], outOfDate: true };
    const snapshot = currentValues;
    const rules = field.rules().filter((rule) => {
      if (!trigger || !rule.validateTrigger) return true;
      const triggers = Array.isArray(rule.validateTrigger) ? rule.validateTrigger : [rule.validateTrigger];
      return triggers.includes(trigger);
    });
    const validateOne = async (rule: Rule) => ({ rule, message: await validateRule(rule, getPathValue(snapshot, name), snapshot, field.label() || name, field.validateMessages?.(), field.messageVariables?.()) });
    let results: Awaited<ReturnType<typeof validateOne>>[];
    if (field.validateFirst?.() === true) {
      results = [];
      for (const rule of rules) {
        const result = await validateOne(rule);
        results.push(result);
        if (result.message && !rule.warningOnly) break;
      }
    } else results = await Promise.all(rules.map(validateOne));
    const outOfDate = validationVersions.get(name) !== version;
    if (outOfDate) return { errors: [], warnings: [], outOfDate: true };
    validatingFields.delete(name);
    setMetaVersion((current) => current + 1);
    let fieldErrors = results.filter(({ rule, message }) => message && !rule.warningOnly).map(({ message }) => message!);
    let fieldWarnings = results.filter(({ rule, message }) => message && rule.warningOnly).map(({ message }) => message!);
    if (field.validateFirst?.() === true || field.validateFirst?.() === 'parallel') {
      const firstError = results.find(({ rule, message }) => Boolean(message) && !rule.warningOnly);
      const firstWarning = results.find(({ rule, message }) => Boolean(message) && rule.warningOnly);
      fieldErrors = firstError?.message ? [firstError.message] : [];
      fieldWarnings = firstWarning?.message ? [firstWarning.message] : [];
    }
    validatedFields.add(name);
    if (!validateOnly) {
      updateErrors(name, fieldErrors);
      updateWarnings(name, fieldWarnings);
    }
    return { errors: fieldErrors, warnings: fieldWarnings, outOfDate: false };
  };

  const form: InternalFormInstance<Values> = {
    getFieldValue(name) {
      values();
      return getPathValue(currentValues, name as NamePath);
    },
    getFieldsValue(nameList, filter) {
      values();
      metaVersion();
      if (nameList === true) return { ...currentValues };
      const config = nameList && !Array.isArray(nameList) ? nameList as GetFieldsValueConfig : undefined;
      const selectedFilter = config?.filter ?? filter;
      const targets = Array.isArray(nameList)
        ? nameList.map((name) => namePathKey(name as NamePath))
        : Array.from(fields.keys());
      return targets.reduce<FormValues>((result, name) => {
        if (!fields.has(name)) return result;
        if (selectedFilter && !selectedFilter({ touched: touchedFields.has(name), validating: validatingFields.has(name) })) return result;
        const value = getPathValue(currentValues, name);
        return value === undefined ? result : setPathValue(result, name, value);
      }, {}) as Partial<Values>;
    },
    getFieldError(name) {
      errors();
      return currentErrors[namePathKey(name as NamePath)] ?? [];
    },
    getFieldWarning(name) {
      warnings();
      return currentWarnings[namePathKey(name as NamePath)] ?? [];
    },
    getFieldsError(names) {
      const targets = names?.map((name) => namePathKey(name as NamePath)) ?? Array.from(fields.keys());
      errors();
      return targets.map((name) => ({ name, errors: currentErrors[name] ?? [] }));
    },
    getFieldInstance(name) {
      return resolveField(name as NamePath);
    },
    isFieldTouched(name) {
      metaVersion();
      return touchedFields.has(namePathKey(name as NamePath));
    },
    isFieldsTouched(names, allTouched = false) {
      metaVersion();
      const targets = Array.isArray(names) ? names.map((name) => namePathKey(name as NamePath)) : Array.from(fields.keys());
      const requireAll = typeof names === 'boolean' ? names : allTouched;
      return requireAll ? targets.length > 0 && targets.every((name) => touchedFields.has(name)) : targets.some((name) => touchedFields.has(name));
    },
    isFieldValidating(name) {
      metaVersion();
      return validatingFields.has(namePathKey(name as NamePath));
    },
    setFieldValue(name, value) {
      const fieldName = namePathKey(name as NamePath);
      touchedFields.add(fieldName);
      setMetaVersion((current) => current + 1);
      invalidateValidation(fieldName);
      updateValues(setPathValue(currentValues, name as NamePath, value));
      updateErrors(fieldName, []);
      updateWarnings(fieldName, []);
    },
    setFieldsValue(next) {
      updateValues(mergeFormValues(currentValues, next) as Values);
      for (const path of valueLeafPaths(next)) {
        const name = namePathKey(path);
        touchedFields.add(name);
        setMetaVersion((current) => current + 1);
        invalidateValidation(name);
        updateErrors(name, []);
        updateWarnings(name, []);
      }
    },
    setFields(nextFields) {
      let nextValues = currentValues;
      for (const field of nextFields) {
        const key = namePathKey(field.name);
        if ('value' in field) nextValues = setPathValue(nextValues, field.name, field.value);
        if (field.touched !== undefined) field.touched ? touchedFields.add(key) : touchedFields.delete(key);
        if (field.validating !== undefined) field.validating ? validatingFields.add(key) : validatingFields.delete(key);
        if (field.errors) updateErrors(key, [...field.errors]);
        if (field.warnings) updateWarnings(key, [...field.warnings]);
      }
      if (nextValues !== currentValues) updateValues(nextValues);
      setMetaVersion((current) => current + 1);
    },
    resetFields(names) {
      const targets = names?.map((name) => namePathKey(name as NamePath)) ?? Array.from(new Set([...fields.keys(), ...Object.keys(currentValues)]));
      let next = { ...currentValues };
      for (const name of targets) {
        const initialValue = getPathValue(initialValues, name);
        next = initialValue !== undefined ? setPathValue(next, name, initialValue) : deletePathValue(next, name);
        invalidateValidation(name);
        touchedFields.delete(name);
        validatedFields.delete(name);
        updateErrors(name, []);
        updateWarnings(name, []);
      }
      setMetaVersion((current) => current + 1);
      updateValues(next);
    },
    async validateFields(names, config = {}) {
      const requested = names?.map((name) => namePathKey(name as NamePath));
      let targets = requested
        ? Array.from(fields.keys()).filter((name) => requested.includes(name) || Boolean(config.recursive && requested.some((parent) => name.startsWith(`${parent}.`))))
        : Array.from(fields.keys());
      if (config.dirty) targets = targets.filter((name) => touchedFields.has(name) || validatedFields.has(name));
      const errorFields: FieldError[] = [];
      let outOfDate = false;
      for (const name of targets) {
        const field = fields.get(name);
        if (!field) continue;
        const result = await validateField(name, field, config.validateOnly);
        outOfDate ||= result.outOfDate;
        if (result.errors.length > 0) errorFields.push({ name, errors: result.errors });
      }
      if (errorFields.length > 0 || outOfDate) throw { values: { ...currentValues }, errorFields, outOfDate } satisfies ValidateErrorInfo<Values>;
      return { ...currentValues };
    },
    scrollToField(name, options) {
      const target = resolveField(name as NamePath);
      if (!target) return;
      const { focus, ...scrollOptions } = options ?? {};
      target.scrollIntoView?.(scrollOptions);
      if (focus) form.focusField(name);
    },
    focusField(name, options) {
      const target = resolveField(name as NamePath)?.querySelector<HTMLElement>('input,select,textarea,button,[tabindex]');
      if (!target) return;
      target.focus({ preventScroll: options?.preventScroll });
      if (options?.cursor && (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
        const position = options.cursor === 'start' ? 0 : target.value.length;
        target.setSelectionRange(options.cursor === 'all' ? 0 : position, target.value.length && options.cursor === 'all' ? target.value.length : position);
      }
    },
    submit() {
      submitHandler();
    },
    async _validateField(name, trigger) {
      const key = namePathKey(name);
      const field = fields.get(key);
      if (!field) return [];
      return (await validateField(key, field, false, trigger)).errors;
    },
    _registerField(name, field, initialValue, preserve = true) {
      const key = namePathKey(name);
      fields.set(key, field);
      if (getPathValue(currentValues, name) === undefined && initialValue !== undefined) {
        initialValues = setPathValue(initialValues as Values, name, initialValue);
        updateValues(setPathValue(currentValues, name, initialValue));
      }
      return () => {
        if (fields.get(key) !== field) return;
        fields.delete(key);
        if (!preserve) {
          touchedFields.delete(key);
          validatingFields.delete(key);
          validatedFields.delete(key);
          setMetaVersion((current) => current + 1);
          updateValues(deletePathValue(currentValues, name));
          updateErrors(key, []);
          updateWarnings(key, []);
        }
      };
    },
    _getFieldData(names) {
      values();
      errors();
      warnings();
      metaVersion();
      const targets = names?.map(namePathKey) ?? Array.from(fields.keys());
      return targets.map((name) => ({ name, value: getPathValue(currentValues, name), touched: touchedFields.has(name), validating: validatingFields.has(name), errors: currentErrors[name] ?? [], warnings: currentWarnings[name] ?? [] }));
    },
    _destroy(clear) {
      fields.clear();
      if (clear) {
        currentErrors = {};
        currentWarnings = {};
        touchedFields.clear();
        validatingFields.clear();
        validatedFields.clear();
        setErrors(currentErrors);
        setWarnings(currentWarnings);
        setMetaVersion((current) => current + 1);
        updateValues({} as Values);
      }
    },
    _setInitialValues(next) {
      if (!next) return;
      initialValues = { ...next, ...initialValues };
      const missing = Object.fromEntries(Object.entries(next).filter(([name]) => !Object.prototype.hasOwnProperty.call(currentValues, name)));
      if (Object.keys(missing).length > 0) updateValues({ ...missing, ...currentValues } as Values);
    },
    _setSubmit(submit) {
      submitHandler = submit;
    },
    _setFieldResolver(resolver) {
      resolveField = resolver;
    },
  };
  return form;
}
