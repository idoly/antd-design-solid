import { Modal as InternalModal } from './Modal';
import { modal } from './service';

export const Modal = Object.assign(InternalModal, modal);
export { modal };
export type * from './Modal';
export type * from './service';
