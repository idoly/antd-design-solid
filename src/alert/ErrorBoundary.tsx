import { Errored } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { Alert } from './Alert';

export interface AlertErrorBoundaryProps {
  title?: JSX.Element;
  message?: JSX.Element;
  description?: JSX.Element | ((error: Error) => JSX.Element);
  children?: JSX.Element;
  id?: string;
  fallback?: (error: Error, reset: () => void) => JSX.Element;
  onError?: (error: Error) => void;
}

export function AlertErrorBoundary(props: AlertErrorBoundaryProps) {
  return <Errored fallback={(caught, reset) => {
    const value = caught();
    const error = value instanceof Error ? value : new Error(String(value));
    props.onError?.(error);
    if (props.fallback) return props.fallback(error, reset);
    return <Alert
      id={props.id}
      type="error"
      showIcon
      title={props.title ?? props.message ?? 'Something went wrong'}
      description={typeof props.description === 'function' ? props.description(error) : props.description ?? error.message}
    />;
  }}>{props.children}</Errored>;
}
