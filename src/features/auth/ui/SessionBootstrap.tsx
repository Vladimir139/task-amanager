import type { JSX, PropsWithChildren } from "react";
import { useEffect } from "react";

import { projectSelectionActions } from "@/entities/project";
import { mapUserRecordToAuthUser, useGetCurrentUserQuery, userActions } from "@/entities/user";
import { clearAuthSession } from "@/features/auth/lib/session";
import { useAppDispatch, useAppSelector } from "@/shared/libs/redux";

import { selectAccessToken, selectAuthInitialized } from "../model/selectors";
import { authActions } from "../model/slice/authSlice";

export const SessionBootstrap = ({ children }: PropsWithChildren): JSX.Element => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectAccessToken);
  const isInitialized = useAppSelector(selectAuthInitialized);

  const { data, isError, isLoading, isSuccess } = useGetCurrentUserQuery(undefined, {
    skip: !accessToken,
  });

  useEffect(() => {
    if (accessToken || isInitialized) {
      return;
    }

    dispatch(authActions.setInitialized(true));
    dispatch(projectSelectionActions.hydrateCurrentProjectSelection(null));
    dispatch(userActions.clearAuthData());
  }, [accessToken, dispatch, isInitialized]);

  useEffect(() => {
    if (!isSuccess || !data) {
      return;
    }

    dispatch(userActions.setAuthData(mapUserRecordToAuthUser(data)));
    dispatch(projectSelectionActions.hydrateCurrentProjectSelection(data.currentProjectId ?? null));
    dispatch(authActions.setInitialized(true));
  }, [data, dispatch, isSuccess]);

  useEffect(() => {
    if (!accessToken || isLoading || !isError) {
      return;
    }

    clearAuthSession(dispatch);
  }, [accessToken, dispatch, isError, isLoading]);

  return <>{children}</>;
};
