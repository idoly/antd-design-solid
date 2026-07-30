import { createContext, createMemo, createUniqueId, merge, useContext, type Accessor, type ParentProps } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { defaultTheme, tokenToCssVariables, type ThemeToken } from './theme';
import enUS from '../locale/en_US';
import type { Locale } from '../locale/types';
import type { ComponentThemeToken, ConfigComponentThemes, GlobalThemeTokenOverrides } from './componentTokens';

export type ThemeAlgorithm = (token: ThemeToken) => ThemeToken;
export type ConfigThemeTokens = Partial<ThemeToken> & GlobalThemeTokenOverrides;
export type { ComponentThemeToken, ConfigComponentThemes, GlobalThemeTokenOverrides, GlobalTokenName, ComponentTokenNameMap } from './componentTokens';
export interface ConfigThemeConfig { token?: ConfigThemeTokens; algorithm?: ThemeAlgorithm | readonly ThemeAlgorithm[]; components?: ConfigComponentThemes }
export interface ConfigProviderProps extends ParentProps {
  componentSize?: 'small' | 'middle' | 'large';
  prefixCls?: string;
  theme?: ConfigThemeTokens | ConfigThemeConfig;
  direction?: 'ltr' | 'rtl';
  locale?: Locale;
  componentDisabled?: boolean;
  variant?: 'outlined' | 'filled' | 'borderless';
  virtual?: boolean;
  csp?: { nonce: string };
  getPopupContainer?: (trigger?: HTMLElement) => HTMLElement | ShadowRoot;
  getTargetContainer?: () => HTMLElement | Window | ShadowRoot;
  iconPrefixCls?: string;
  popupMatchSelectWidth?: boolean | number;
  popupOverflow?: 'viewport' | 'scroll';
  renderEmpty?: (componentName: string) => JSX.Element;
  warning?: { strict: boolean };
  autoInsertSpaceInButton?: boolean;
  dropdownMatchSelectWidth?: boolean;
  button?: Record<string, unknown>;
  checkbox?: Record<string, unknown>;
  radio?: Record<string, unknown>;
  switch?: Record<string, unknown>;
  slider?: Record<string, unknown>;
  progress?: Record<string, unknown>;
  steps?: Record<string, unknown>;
  divider?: Record<string, unknown>;
  empty?: Record<string, unknown>;
  masonry?: Record<string, unknown>;
  qrCode?: Record<string, unknown>;
  result?: Record<string, unknown>;
  segmented?: Record<string, unknown>;
  anchor?: Record<string, unknown>;
  breadcrumb?: Record<string, unknown>;
  layout?: Record<string, unknown>;
  space?: Record<string, unknown>;
  spin?: Record<string, unknown>;
  statistic?: Record<string, unknown>;
  calendar?: Record<string, unknown>;
  colorPicker?: Record<string, unknown>;
  dropdown?: Record<string, unknown>;
  popconfirm?: Record<string, unknown>;
  popover?: Record<string, unknown>;
  skeleton?: Record<string, unknown>;
  timeline?: Record<string, unknown>;
  typography?: Record<string, unknown>;
  floatButton?: Record<string, unknown>;
  image?: Record<string, unknown>;
  mentions?: Record<string, unknown>;
  splitter?: Record<string, unknown>;
  tour?: Record<string, unknown>;
  transfer?: Record<string, unknown>;
  input?: Record<string, unknown>;
  inputNumber?: Record<string, unknown>;
  select?: Record<string, unknown>;
  datePicker?: Record<string, unknown>;
  table?: Record<string, unknown>;
  modal?: Record<string, unknown>;
  form?: Record<string, unknown>;
  upload?: Record<string, unknown>;
  tree?: Record<string, unknown>;
  treeSelect?: Record<string, unknown>;
  pagination?: Record<string, unknown>;
  drawer?: Record<string, unknown>;
  tooltip?: Record<string, unknown>;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface ConfigContextValue {
  componentSize: () => 'small' | 'middle' | 'large';
  prefixCls: () => string;
  theme: () => ThemeToken;
  direction: () => 'ltr' | 'rtl';
  locale: () => Locale;
  componentDisabled: () => boolean;
  variant: () => 'outlined' | 'filled' | 'borderless' | undefined;
  virtual: () => boolean;
  getPopupContainer: () => ((trigger?: HTMLElement) => HTMLElement | ShadowRoot) | undefined;
  getTargetContainer: () => (() => HTMLElement | Window | ShadowRoot) | undefined;
  popupMatchSelectWidth: () => boolean | number | undefined;
  renderEmpty: () => ((componentName: string) => JSX.Element) | undefined;
  componentTheme: (componentName: string) => ComponentThemeToken;
  themeScopeClass: () => string;
  componentDefaults: (componentName: 'button' | 'checkbox' | 'radio' | 'switch' | 'slider' | 'progress' | 'steps' | 'divider' | 'empty' | 'masonry' | 'qrCode' | 'result' | 'segmented' | 'anchor' | 'breadcrumb' | 'layout' | 'space' | 'spin' | 'statistic' | 'calendar' | 'colorPicker' | 'dropdown' | 'popconfirm' | 'popover' | 'skeleton' | 'timeline' | 'typography' | 'floatButton' | 'image' | 'mentions' | 'splitter' | 'tour' | 'transfer' | 'input' | 'inputNumber' | 'select' | 'datePicker' | 'table' | 'modal' | 'form' | 'upload' | 'tree' | 'treeSelect' | 'pagination' | 'drawer' | 'tooltip') => Record<string, unknown>;
}

export interface GlobalConfigProps { prefixCls?: string; theme?: ConfigThemeTokens; locale?: Locale }
let globalPrefixCls = 'ads';
let globalTheme: ThemeToken = defaultTheme;
let globalLocale: Locale = enUS;
export function setGlobalConfig(config: GlobalConfigProps) { if (config.prefixCls) globalPrefixCls = config.prefixCls; if (config.theme) globalTheme = { ...globalTheme, ...config.theme }; if (config.locale) globalLocale = config.locale; }
export function globalConfig() { return { getPrefixCls: (suffix?: string, custom?: string) => custom ?? (suffix ? `${globalPrefixCls}-${suffix}` : globalPrefixCls), getRootPrefixCls: () => globalPrefixCls, getTheme: () => globalTheme, getLocale: () => globalLocale }; }

const defaultContext: ConfigContextValue = {
  componentSize: () => 'middle',
  prefixCls: () => globalPrefixCls,
  theme: () => globalTheme,
  direction: () => 'ltr',
  locale: () => globalLocale,
  componentDisabled: () => false,
  variant: () => undefined,
  virtual: () => true,
  getPopupContainer: () => undefined,
  getTargetContainer: () => undefined,
  popupMatchSelectWidth: () => undefined,
  renderEmpty: () => undefined,
  componentTheme: () => ({}),
  themeScopeClass: () => '',
  componentDefaults: () => ({}),
};

export const ConfigContext = createContext<ConfigContextValue>(defaultContext);
export const SizeContext = createContext<Accessor<'small' | 'middle' | 'large'>>(() => 'middle');

export function useConfig(): ConfigContextValue {
  return useContext(ConfigContext);
}

const sanitizeTokenValue = (value: string | number) => String(value).replace(/[;}]/g, '');
const formatTokenVariable = (key: string, value: string | number): string => {
  if (typeof value === 'string') return sanitizeTokenValue(value);
  if (/(?:zIndex|opacity|fontWeight|lineHeight|scale)$/i.test(key)) return String(value);
  if (/Duration$/i.test(key)) return `${value}s`;
  return `${value}px`;
};

export function ConfigProvider(inputProps: ConfigProviderProps) {
  const props = merge({ componentSize: 'middle' as const, prefixCls: 'ads' }, inputProps);
  const parent = useConfig();
  const scopeClass = `ads-theme-${createUniqueId()}`;
  const themeConfig = () => props.theme && ('token' in props.theme || 'algorithm' in props.theme || 'components' in props.theme) ? props.theme as ConfigThemeConfig : undefined;
  const theme = createMemo<ThemeToken>(() => {
    const configured = props.theme;
    if (!configured || !('token' in configured || 'algorithm' in configured || 'components' in configured)) return { ...parent.theme(), ...configured as Partial<ThemeToken> };
    let result = { ...parent.theme(), ...configured.token };
    const algorithms = Array.isArray(configured.algorithm) ? configured.algorithm : configured.algorithm ? [configured.algorithm] : [];
    for (const algorithm of algorithms) result = algorithm(result);
    return result;
  });
  const value: ConfigContextValue = {
    componentSize: () => props.componentSize ?? parent.componentSize(),
    prefixCls: () => props.prefixCls ?? parent.prefixCls(),
    theme,
    direction: () => props.direction ?? parent.direction(),
    componentDisabled: () => props.componentDisabled ?? parent.componentDisabled(),
    variant: () => props.variant ?? parent.variant(),
    virtual: () => props.virtual ?? parent.virtual(),
    getPopupContainer: () => props.getPopupContainer ?? parent.getPopupContainer(),
    getTargetContainer: () => props.getTargetContainer ?? parent.getTargetContainer(),
    popupMatchSelectWidth: () => props.popupMatchSelectWidth ?? props.dropdownMatchSelectWidth ?? parent.popupMatchSelectWidth(),
    renderEmpty: () => props.renderEmpty ?? parent.renderEmpty(),
    themeScopeClass: () => [parent.themeScopeClass(), scopeClass].filter(Boolean).join(' '),
    componentTheme: (componentName) => {
      const inherited = parent.componentTheme(componentName);
      const entries = Object.entries(themeConfig()?.components ?? {});
      const local = entries.find(([name]) => name.toLowerCase() === componentName.toLowerCase())?.[1] ?? {};
      return { ...inherited, ...local };
    },
    componentDefaults: (componentName) => ({ ...parent.componentDefaults(componentName), ...(props[componentName] ?? {}) }),
    locale: () => {
      const base = parent.locale();
      const next = props.locale;
      if (!next) return base;
      return { ...base, ...next, global: { ...base.global, ...next.global }, Empty: { ...base.Empty, ...next.Empty }, Select: { ...base.Select, ...next.Select }, Table: { ...base.Table, ...next.Table }, Modal: { ...base.Modal, ...next.Modal }, Tour: { ...base.Tour, ...next.Tour }, Popconfirm: { ...base.Popconfirm, ...next.Popconfirm }, Transfer: { ...base.Transfer, ...next.Transfer }, Upload: { ...base.Upload, ...next.Upload }, QRCode: { ...base.QRCode, ...next.QRCode }, DatePicker: { ...base.DatePicker, ...next.DatePicker }, TimePicker: { ...base.TimePicker, ...next.TimePicker }, Pagination: { ...base.Pagination, ...next.Pagination }, Text: { ...base.Text, ...next.Text }, ColorPicker: { ...base.ColorPicker, ...next.ColorPicker }, Form: { ...base.Form, ...next.Form, defaultValidateMessages: { ...base.Form?.defaultValidateMessages, ...next.Form?.defaultValidateMessages } } };
    },
  };
  const style = createMemo<JSX.CSSProperties>(() => {
    const configuredTokens = themeConfig()?.token ?? (!themeConfig() ? props.theme as ConfigThemeTokens | undefined : undefined) ?? {};
    const officialVariables = Object.fromEntries(Object.entries(configuredTokens).flatMap(([key, tokenValue]) => typeof tokenValue === 'string' || typeof tokenValue === 'number' ? [[`--ads-token-${key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`, formatTokenVariable(key, tokenValue)]] : []));
    return {
      ...officialVariables,
      ...tokenToCssVariables(theme()),
      ...props.style,
    } as JSX.CSSProperties;
  });
  const componentCss = createMemo(() => {
    const entries = Object.entries(themeConfig()?.components ?? {});
    const scopedVariables = entries.flatMap(([componentName, rawComponentToken]) => {
      const slug = componentName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();
      return Object.entries(rawComponentToken as Record<string, unknown>).flatMap(([key, tokenValue]) => typeof tokenValue === 'string' || typeof tokenValue === 'number'
        ? [[`--ads-${slug}-${key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`, formatTokenVariable(key, tokenValue)] as const]
        : []);
    });
    const componentRules = entries.map(([componentName, rawComponentToken]) => {
      const componentToken = rawComponentToken as ComponentThemeToken & Record<string, unknown>;
      const slug = componentName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();
      const globalOverrides = Object.fromEntries(Object.keys(defaultTheme).flatMap((key) => {
        const value = componentToken[key];
        if (typeof value === 'string') return [[key, value]];
        if (typeof value === 'number') return [[key, key.startsWith('borderRadius') ? `${value}px` : String(value)]];
        return [];
      })) as Partial<ThemeToken>;
      const variables: Record<string, string> = {
        ...tokenToCssVariables({ ...theme(), ...globalOverrides }),
        ...Object.fromEntries(scopedVariables.filter(([name]) => name.startsWith(`--ads-${slug}-`))),
      };
      return `.${scopeClass} .ads-${slug},.${scopeClass}.ads-${slug},.${scopeClass}.ads-${slug}-theme{${Object.entries(variables).map(([name, value]) => `${name}:${value}`).join(';')}}`;
    }).join('\n');
    return `.${scopeClass}{${scopedVariables.map(([name, value]) => `${name}:${value}`).join(';')}}\n${componentRules}`;
  });

  return (
    <ConfigContext value={value}>
      <SizeContext value={value.componentSize}>
        <div class={['ads-root', scopeClass, props.class]} dir={value.direction()} style={style()}><style nonce={props.csp?.nonce}>{componentCss()}</style>{props.children}</div>
      </SizeContext>
    </ConfigContext>
  );
}
