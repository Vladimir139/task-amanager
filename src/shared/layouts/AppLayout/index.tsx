import type { FC, ReactNode } from "react";

import { Header, Sidebar } from "@/widgets";

export const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>
      <Sidebar />

      <div>
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
};
