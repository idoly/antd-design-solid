import { DatePicker as InternalDatePicker, generatePicker, MonthPicker, QuarterPicker, RangePicker, WeekPicker, YearPicker } from './DatePicker';
import { TimePicker } from '../time-picker';

export const DatePicker = Object.assign(InternalDatePicker, { RangePicker, MonthPicker, WeekPicker, QuarterPicker, YearPicker, TimePicker, generatePicker });
export { generatePicker, MonthPicker, QuarterPicker, RangePicker, WeekPicker, YearPicker };
export type * from './DatePicker';
export type { Dayjs } from 'dayjs';
