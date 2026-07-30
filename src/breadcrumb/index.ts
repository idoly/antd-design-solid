import { Breadcrumb as InternalBreadcrumb, BreadcrumbItem, BreadcrumbSeparator } from './Breadcrumb';

export const Breadcrumb = Object.assign(InternalBreadcrumb, { Item: BreadcrumbItem, Separator: BreadcrumbSeparator });
export { BreadcrumbItem, BreadcrumbSeparator };
export type * from './Breadcrumb';
