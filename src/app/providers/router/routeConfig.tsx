import { createBrowserRouter, Navigate } from "react-router-dom";

import { AppLayout, AuthLayout } from "@/app/layouts";
import { ROUTES } from "@/shared/config/router";
import {
  DashboardPage,
  FilesPage,
  LoginPage,
  MessagesPage,
  NotFoundPage,
  ProjectsPage,
  RegisterPage,
  SettingsPage,
  TaskBoardPage,
} from "@/views";

import { AuthRoute } from "./AuthRoute";
import { UnAuthRoute } from "./UnAuthRoute";

export const router = createBrowserRouter([
  {
    path: ROUTES.auth.route,
    element: (
      <UnAuthRoute>
        <AuthLayout />
      </UnAuthRoute>
    ),
    children: [
      {
        path: ROUTES.auth.login.route,
        element: <LoginPage />,
      },
      {
        path: ROUTES.auth.register.route,
        element: <RegisterPage />,
      },
      {
        index: true,
        element: <Navigate to={ROUTES.auth.login.page} replace />,
      },
    ],
  },
  {
    path: ROUTES.appRoute,
    element: (
      <AuthRoute>
        <AppLayout />
      </AuthRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.dashboard.route} replace />,
      },
      {
        path: ROUTES.dashboard.route,
        element: <DashboardPage />,
      },
      {
        path: ROUTES.projects.route,
        element: <ProjectsPage />,
      },
      {
        path: ROUTES.tasks.route,
        element: <TaskBoardPage />,
      },
      {
        path: ROUTES.messages.route,
        element: <MessagesPage />,
      },
      {
        path: ROUTES.files.route,
        element: <FilesPage />,
      },
      {
        path: ROUTES.settings.route,
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
