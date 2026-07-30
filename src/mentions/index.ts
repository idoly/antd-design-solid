import { MentionOptionComponent, Mentions as InternalMentions } from './Mentions';

export const Mentions = Object.assign(InternalMentions, { Option: MentionOptionComponent });
export { MentionOptionComponent };
export type * from './Mentions';
