import type { JSX, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

import { selectIsAuthenticated, useAppSelector } from "@/app/store";

export const GuestRoute = ({ children }: PropsWithChildren): JSX.Element => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
