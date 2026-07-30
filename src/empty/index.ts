import { Empty as InternalEmpty, PRESENTED_IMAGE_DEFAULT, PRESENTED_IMAGE_SIMPLE } from './Empty';

export const Empty = Object.assign(InternalEmpty, { PRESENTED_IMAGE_DEFAULT, PRESENTED_IMAGE_SIMPLE });
export { PRESENTED_IMAGE_DEFAULT, PRESENTED_IMAGE_SIMPLE };
export type * from './Empty';
