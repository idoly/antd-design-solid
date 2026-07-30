import { createContext, createEffect, merge, omit, Show, useContext } from 'solid-js';
import { Dynamic } from '@solidjs/web';
import type { JSX } from '@solidjs/web';
import { message, type GlobalMessageConfig } from '../message';
import { modal, type ModalApi } from '../modal';
import { notification, type GlobalNotificationConfig } from '../notification';

export interface AppContextValue { message: typeof message; notification: typeof notification; modal: ModalApi }
export interface AppProps extends JSX.HTMLAttributes<HTMLElement> {
  component?: keyof JSX.IntrinsicElements | false;
  message?: GlobalMessageConfig;
  notification?: GlobalNotificationConfig;
  children?: JSX.Element;
}

const AppContext = createContext<AppContextValue | null>(null);
const globalApi: AppContextValue = { message, notification, modal };

function AppRoot(inputProps: AppProps) {
  const props = merge({ component: 'div' as keyof JSX.IntrinsicElements }, inputProps);
  const others = omit(props, 'component', 'message', 'notification', 'children');
  createEffect(
    () => [props.message, props.notification] as const,
    ([messageConfig, notificationConfig]) => {
      if (messageConfig) message.config(messageConfig);
      if (notificationConfig) notification.config(notificationConfig);
    },
  );
  return <AppContext value={globalApi}>
    <Show when={props.component !== false} fallback={props.children}>
      <Dynamic component={props.component as keyof JSX.IntrinsicElements} {...others}>{props.children}</Dynamic>
    </Show>
  </AppContext>;
}

export const App = Object.assign(AppRoot, {
  useApp(): AppContextValue { return useContext(AppContext) ?? globalApi; },
});
