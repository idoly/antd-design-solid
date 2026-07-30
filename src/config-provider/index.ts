import { ConfigContext, ConfigProvider as InternalConfigProvider, SizeContext, globalConfig, setGlobalConfig, useConfig } from './ConfigProvider';

export const ConfigProvider = Object.assign(InternalConfigProvider, { ConfigContext, SizeContext, config: setGlobalConfig, useConfig });
export { ConfigContext, SizeContext, globalConfig, setGlobalConfig, useConfig };
export type * from './ConfigProvider';
export { defaultTheme } from './theme';
export type * from './theme';
