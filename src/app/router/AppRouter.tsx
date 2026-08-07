import type { FC } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { AppLayout, AuthLayout } from "@/app/layout";
import { GuestRoute, ProtectedRoute } from "@/app/router/guards";
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

const router = createBrowserRouter([
  {
    element: (
      <GuestRoute>
        <AuthLayout />
      </GuestRoute>
    ),
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "tasks",
        element: <TaskBoardPage />,
      },
      {
        path: "messages",
        element: <MessagesPage />,
      },
      {
        path: "files",
        element: <FilesPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export const AppRouter: FC = () => {
  return <RouterProvider router={router} />;
};
