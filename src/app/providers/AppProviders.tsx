import type { FC, PropsWithChildren } from "react";
import { Provider } from "react-redux";

import { store } from "@/app/providers/store";
import { SessionBootstrap } from "@/features/auth/ui/SessionBootstrap";

export const AppProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Provider store={store}>
      <SessionBootstrap>{children}</SessionBootstrap>
    </Provider>
  );
};
