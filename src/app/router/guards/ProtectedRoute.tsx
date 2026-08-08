import type { JSX, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

import { selectAuthInitialized, selectIsAuthenticated, useAppSelector } from "@/app/store";

export const ProtectedRoute = ({ children }: PropsWithChildren): JSX.Element => {
  const isInitialized = useAppSelector(selectAuthInitialized);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isInitialized) {
    return <></>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
