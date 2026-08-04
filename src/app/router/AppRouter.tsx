import type { FC } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { AppLayout } from "@/app/layout";
import {
  DashboardPage,
  FilesPage,
  MessagesPage,
  ProjectsPage,
  SettingsPage,
  TaskBoardPage,
} from "@/views";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
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
]);

export const AppRouter: FC = () => {
  return <RouterProvider router={router} />;
};
