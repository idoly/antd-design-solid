import { InputGroup } from './Group';
import { InternalInput } from './Input';
import { OTP } from './OTP';
import { Password } from './Password';
import { Search } from './Search';
import { TextArea } from './TextArea';

export const Input = Object.assign(InternalInput, { Group: InputGroup, OTP, Password, Search, TextArea });
export { InputGroup, OTP, Password, Search, TextArea };
export type * from './Group';
export type * from './Input';
export type * from './OTP';
export type * from './Password';
export type * from './Search';
export type * from './TextArea';
