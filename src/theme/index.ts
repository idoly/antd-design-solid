import { defaultTheme, type ThemeToken } from '../config-provider/theme';
import { useConfig } from '../config-provider';

export type MappingAlgorithm = (token: ThemeToken) => ThemeToken;
export interface DesignTokenConfig { token?: Partial<ThemeToken>; algorithm?: MappingAlgorithm | readonly MappingAlgorithm[] }

export const defaultAlgorithm: MappingAlgorithm = (token) => ({ ...token });
export const darkAlgorithm: MappingAlgorithm = (token) => ({
  ...token,
  colorBgContainer: '#141414',
  colorBgContainerSecondary: '#1f1f1f',
  colorBgLayout: '#000000',
  colorText: 'rgba(255, 255, 255, 0.85)',
  colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
  colorTextDisabled: 'rgba(255, 255, 255, 0.25)',
  colorBorder: '#424242',
  colorBorderSecondary: '#303030',
});
export const compactAlgorithm: MappingAlgorithm = (token) => ({ ...token, borderRadius: '4px', borderRadiusLG: '6px', borderRadiusSM: '2px' });

export function getDesignToken(config: DesignTokenConfig = {}): ThemeToken {
  let token = { ...defaultTheme, ...config.token };
  const algorithms = Array.isArray(config.algorithm) ? config.algorithm : config.algorithm ? [config.algorithm] : [defaultAlgorithm];
  for (const algorithm of algorithms) token = algorithm(token);
  return token;
}

export function useToken() {
  const config = useConfig();
  return {
    theme: defaultAlgorithm,
    get token() { return config.theme(); },
    hashId: '',
    get cssVar() { return config.theme(); },
  };
}

export const theme = {
  defaultSeed: defaultTheme,
  defaultAlgorithm,
  darkAlgorithm,
  compactAlgorithm,
  getDesignToken,
  useToken,
  defaultConfig: { token: defaultTheme, override: { override: defaultTheme }, hashed: false },
};

export type { ThemeToken };
