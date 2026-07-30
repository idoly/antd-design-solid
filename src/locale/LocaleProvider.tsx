import { merge, type ParentProps } from 'solid-js';
import { ConfigContext, useConfig, type ConfigContextValue } from '../config-provider';
import type { Locale } from './types';

export const ANT_MARK = 'internalMark';

export interface LocaleProviderProps extends ParentProps { locale: Locale }

export function LocaleProvider(props: LocaleProviderProps) {
  const parent = useConfig();
  const value: ConfigContextValue = { ...parent, locale: () => {
    const base = parent.locale();
    const next = props.locale;
    return { ...base, ...next, global: { ...base.global, ...next.global }, Empty: { ...base.Empty, ...next.Empty }, Select: { ...base.Select, ...next.Select }, Table: { ...base.Table, ...next.Table }, Modal: { ...base.Modal, ...next.Modal }, Tour: { ...base.Tour, ...next.Tour }, Popconfirm: { ...base.Popconfirm, ...next.Popconfirm }, Transfer: { ...base.Transfer, ...next.Transfer }, Upload: { ...base.Upload, ...next.Upload }, QRCode: { ...base.QRCode, ...next.QRCode }, DatePicker: { ...base.DatePicker, ...next.DatePicker }, TimePicker: { ...base.TimePicker, ...next.TimePicker }, Pagination: { ...base.Pagination, ...next.Pagination }, Text: { ...base.Text, ...next.Text }, ColorPicker: { ...base.ColorPicker, ...next.ColorPicker }, Form: { ...base.Form, ...next.Form, defaultValidateMessages: { ...base.Form?.defaultValidateMessages, ...next.Form?.defaultValidateMessages } } };
  } };
  return <ConfigContext value={value}>{props.children}</ConfigContext>;
}

export function useLocale<ComponentName extends Exclude<keyof Locale, 'locale'>>(
  componentName: ComponentName,
  defaultLocale?: Locale[ComponentName] | (() => Locale[ComponentName]),
) {
  const configured = useConfig().locale();
  const fallback = typeof defaultLocale === 'function' ? defaultLocale() : defaultLocale;
  return [merge(fallback ?? {}, configured[componentName] ?? {}) as NonNullable<Locale[ComponentName]>, configured.locale] as const;
}
