import { Calendar as InternalCalendar, generateCalendar } from './Calendar';

export const Calendar = Object.assign(InternalCalendar, { generateCalendar });
export { generateCalendar };
export type * from './Calendar';
