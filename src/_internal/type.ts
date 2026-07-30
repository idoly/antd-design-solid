import type { Component, Context } from 'solid-js';

export type Primitive = null | undefined | string | number | boolean | symbol | bigint;
export type LiteralUnion<T, U extends Primitive = string> = T | (U & Record<never, never>);
export type AnyObject = Record<PropertyKey, any>;
export type EmptyObject = Record<never, never>;
export type CustomComponent<Props extends Record<string, any> = AnyObject> = Component<Props> | keyof HTMLElementTagNameMap;

export type GetProps<T extends Component<any> | object> =
  T extends Context<infer Value> ? Value :
  T extends Component<infer Props> ? Props :
  T extends object ? T : never;

export type GetProp<
  T extends Component<any> | object,
  PropName extends keyof GetProps<T>,
  Type extends 'Default' | 'Return' = 'Default',
> = Type extends 'Return'
  ? ReturnType<Extract<NonNullable<GetProps<T>[PropName]>, (...args: any[]) => unknown>>
  : NonNullable<GetProps<T>[PropName]>;

export type GetRef<T extends Component<any> | object> = GetProps<T> extends { ref?: infer Ref } ? NonNullable<Ref> : never;
