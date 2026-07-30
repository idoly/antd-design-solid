export interface ThemeToken {
  colorPrimary: string;
  colorPrimaryHover: string;
  colorPrimaryActive: string;
  colorSuccess: string;
  colorWarning: string;
  colorError: string;
  colorInfo: string;
  colorBgContainer: string;
  colorBgContainerSecondary: string;
  colorBgLayout: string;
  colorText: string;
  colorTextSecondary: string;
  colorTextDisabled: string;
  colorBorder: string;
  colorBorderSecondary: string;
  borderRadius: string;
  borderRadiusLG: string;
  borderRadiusSM: string;
  fontFamily: string;
  motionDurationFast: string;
  motionDurationMid: string;
  motionDurationSlow: string;
  motionEaseOutCirc: string;
  motionEaseInOutCirc: string;
}

export const defaultTheme: ThemeToken = {
  colorPrimary: '#1677ff',
  colorPrimaryHover: '#4096ff',
  colorPrimaryActive: '#0958d9',
  colorSuccess: '#52c41a',
  colorWarning: '#faad14',
  colorError: '#ff4d4f',
  colorInfo: '#1677ff',
  colorBgContainer: '#ffffff',
  colorBgContainerSecondary: '#fafafa',
  colorBgLayout: '#f5f5f5',
  colorText: 'rgba(0, 0, 0, 0.88)',
  colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
  colorTextDisabled: 'rgba(0, 0, 0, 0.25)',
  colorBorder: '#d9d9d9',
  colorBorderSecondary: '#f0f0f0',
  borderRadius: '6px',
  borderRadiusLG: '8px',
  borderRadiusSM: '4px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  motionDurationFast: '100ms',
  motionDurationMid: '200ms',
  motionDurationSlow: '300ms',
  motionEaseOutCirc: 'cubic-bezier(0.08, 0.82, 0.17, 1)',
  motionEaseInOutCirc: 'cubic-bezier(0.78, 0.14, 0.15, 0.86)',
};

export const tokenToCssVariables = (token: ThemeToken): Record<string, string> => ({
  '--ads-color-primary': token.colorPrimary,
  '--ads-color-primary-hover': token.colorPrimaryHover,
  '--ads-color-primary-active': token.colorPrimaryActive,
  '--ads-color-success': token.colorSuccess,
  '--ads-color-warning': token.colorWarning,
  '--ads-color-error': token.colorError,
  '--ads-color-info': token.colorInfo,
  '--ads-color-surface': token.colorBgContainer,
  '--ads-color-surface-container': token.colorBgContainerSecondary,
  '--ads-color-surface-layout': token.colorBgLayout,
  '--ads-color-text': token.colorText,
  '--ads-color-text-secondary': token.colorTextSecondary,
  '--ads-color-text-disabled': token.colorTextDisabled,
  '--ads-color-border': token.colorBorder,
  '--ads-color-border-secondary': token.colorBorderSecondary,
  '--ads-radius-control': token.borderRadius,
  '--ads-radius-surface': token.borderRadiusLG,
  '--ads-radius-small': token.borderRadiusSM,
  '--ads-font-family': token.fontFamily,
  '--ads-motion-fast': token.motionDurationFast,
  '--ads-motion-mid': token.motionDurationMid,
  '--ads-motion-slow': token.motionDurationSlow,
  '--ads-motion-ease-out-circ': token.motionEaseOutCirc,
  '--ads-motion-ease-in-out-circ': token.motionEaseInOutCirc,
});
