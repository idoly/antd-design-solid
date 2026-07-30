import { Alert as InternalAlert } from './Alert';
import { AlertErrorBoundary } from './ErrorBoundary';

export const Alert = Object.assign(InternalAlert, { ErrorBoundary: AlertErrorBoundary });
export { AlertErrorBoundary };
export type * from './Alert';
export type * from './ErrorBoundary';
