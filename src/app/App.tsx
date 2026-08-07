import type { FC } from "react";

import { AppProviders } from "@/app/providers";
import { AppRouter } from "@/app/router";

export const App: FC = () => {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
};
