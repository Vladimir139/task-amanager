import type { JSX, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

import { selectIsAuthenticated } from "@/entities/user";
import { selectAuthInitialized } from "@/features/auth/model/selectors";
import { ROUTES } from "@/shared/config/router";
import { useAppSelector } from "@/shared/libs/redux";

export const AuthRoute = ({ children }: PropsWithChildren): JSX.Element => {
  const isInitialized = useAppSelector(selectAuthInitialized);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isInitialized) {
    return <></>;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.auth.login.page} replace />;
  }

  return <>{children}</>;
};
