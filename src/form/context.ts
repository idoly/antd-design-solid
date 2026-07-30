import { createContext, useContext } from 'solid-js';

export type FormFieldStatus = 'error' | 'warning' | 'success' | 'validating';

export interface FormItemControl {
  name: string;
  id: string;
  value: () => unknown;
  setValue: (value: unknown) => void;
  validate: (trigger?: string) => Promise<string[]>;
  status: () => FormFieldStatus | undefined;
  errors: () => string[];
  warnings: () => string[];
  describedBy: () => string | undefined;
  disabled: () => boolean;
  variant: () => 'outlined' | 'borderless' | 'filled' | 'underlined' | undefined;
  _markConsumed?: () => void;
}

export const FormItemContext = createContext<FormItemControl | null>(null);

export function useFormItemControl(): FormItemControl | undefined {
  const control = useContext(FormItemContext) ?? undefined;
  control?._markConsumed?.();
  return control;
}
