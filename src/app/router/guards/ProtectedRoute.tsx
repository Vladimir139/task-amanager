import type { JSX, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

import { selectIsAuthenticated, useAppSelector } from "@/app/store";

export const ProtectedRoute = ({ children }: PropsWithChildren): JSX.Element => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
