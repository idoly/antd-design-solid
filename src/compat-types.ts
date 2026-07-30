import type { JSX } from '@solidjs/web';
import type { AlertErrorBoundaryProps } from './alert';
import type { CalendarProps } from './calendar';
import type { CascaderPanelProps, CascaderProps } from './cascader';
import type { CheckboxOption } from './checkbox';
import type { DropdownProps } from './dropdown';
import type { Rule } from './form';
import type { ImageProps } from './image';
import type { MentionOption } from './mentions';
import type { MessageConfig } from './message';
import type { ModalFuncProps } from './modal';
import type { NotificationConfig } from './notification';
import type { QRCodeProps } from './qr-code';
import type { SliderProps } from './slider';
import type { TableColumn } from './table';
import type { TagProps } from './tag';
import type { DesignTokenConfig, ThemeToken } from './theme';
import type { TourStep } from './tour';
import type { UploadProps } from './upload';

export interface AffixRef { updatePosition: () => void }
export type CalendarMode = NonNullable<CalendarProps['mode']>;
export type CascaderAutoProps = CascaderProps;
export type CascaderPanelAutoProps = CascaderPanelProps;
export type CheckboxOptionType = CheckboxOption;
export interface CheckboxRef { focus: () => void; blur: () => void; input: HTMLInputElement | null; nativeElement: HTMLElement | null }
export type DraggerProps<T = unknown> = UploadProps<T>;
/** @deprecated Use DropdownProps instead. */
export type DropDownProps = DropdownProps;
export type ErrorBoundaryProps = AlertErrorBoundaryProps;
export interface FloatButtonRef { nativeElement: HTMLElement | null }
export type FormRule = Rule;
export type GlobalToken = ThemeToken;
export interface ImageProgressConfig { percent?: number; render?: (progress: JSX.Element, percent: number) => JSX.Element }
export type PlaceholderType = JSX.Element | { progress?: boolean | ImageProgressConfig };
export type InputRef = HTMLInputElement;
export type MentionProps = MentionOption;
export interface MenuRef { menu: HTMLElement | null; focus: (options?: FocusOptions) => void }
export type MenuTheme = 'light' | 'dark';
export type MessageArgsProps = MessageConfig;
export interface ModalLocale { okText: string; cancelText: string; justOkText: string }
export type NotificationArgsProps = NotificationConfig;
export type QRPropsCanvas = QRCodeProps & Omit<JSX.CanvasHTMLAttributes<HTMLCanvasElement>, keyof QRCodeProps>;
export type QRPropsSvg = QRCodeProps & Omit<JSX.SvgSVGAttributes<SVGSVGElement>, keyof QRCodeProps>;
export interface RefSelectProps { focus: (options?: FocusOptions) => void; blur: () => void; nativeElement: HTMLElement | null }
export type SliderSingleProps = SliderProps & { range?: false };
export type TableColumnType<RecordType extends object = Record<string, unknown>> = TableColumn<RecordType>;
export type TableColumnGroupType<RecordType extends object = Record<string, unknown>> = TableColumn<RecordType> & { children: readonly TableColumn<RecordType>[] };
export type TableColumnsType<RecordType extends object = Record<string, unknown>> = readonly TableColumn<RecordType>[];
export type TagType = NonNullable<TagProps['color']>;
export type ThemeConfig = DesignTokenConfig;
export type TourStepProps = TourStep;
