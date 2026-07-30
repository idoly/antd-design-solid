import { setDefaultIndicator, Spin as InternalSpin } from './Spin';

export const Spin = Object.assign(InternalSpin, { setDefaultIndicator });
export { setDefaultIndicator };
export type * from './Spin';
