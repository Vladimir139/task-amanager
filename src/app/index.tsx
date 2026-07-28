import type { FC, ReactNode } from "react";

export const App: FC<{ children: ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};
