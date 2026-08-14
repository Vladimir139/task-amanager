import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetConversationsQuery } from "@/entities/conversation";
import { useGetTasksQuery } from "@/entities/task";
import { selectAuthUser } from "@/entities/user";
import { useLogoutMutation } from "@/features/auth";
import { getMessagesRoute, getSettingsRoute, getTasksRoute, ROUTES } from "@/shared/config/router";
import { formatDateLabel } from "@/shared/lib/formatters";
import { useAppSelector } from "@/shared/libs/redux";

export const settingsShortcutItems = [
  "My details",
  "Profile",
  "Password",
  "Notifications",
] as const;

interface NotificationMessageItem {
  conversationId: string;
  title: string;
  unreadCount: number;
}

interface NotificationTaskItem {
  dueDateLabel: string;
  taskId: string;
  title: string;
  boardId: string;
  projectId: string;
}

interface UseHeaderActionsResult {
  handleConfirmLogout: () => Promise<void>;
  handleOpenMessages: (conversationId: string) => Promise<void>;
  handleOpenProfile: () => Promise<void>;
  handleOpenSettingsPage: () => Promise<void>;
  handleOpenSettingsSection: (tab: string) => Promise<void>;
  handleOpenTask: (task: NotificationTaskItem) => Promise<void>;
  isLoggingOut: boolean;
  logoutAnchor: HTMLElement | null;
  notificationAnchor: HTMLElement | null;
  notificationCount: number;
  overdueTasks: NotificationTaskItem[];
  setLogoutAnchor: (element: HTMLElement | null) => void;
  setNotificationAnchor: (element: HTMLElement | null) => void;
  setSettingsAnchor: (element: HTMLElement | null) => void;
  settingsAnchor: HTMLElement | null;
  unreadMessages: NotificationMessageItem[];
}

const getConversationTitle = (
  conversation: {
    title?: string | null;
    type: string;
    members?: Array<{ _id: string; firstName: string; lastName: string }>;
  },
  currentUserId?: string,
): string => {
  if (conversation.type === "direct") {
    const directPeer = conversation.members?.find((member) => member._id !== currentUserId);

    if (directPeer) {
      return `${directPeer.firstName} ${directPeer.lastName}`.trim();
    }
  }

  const normalizedTitle = conversation.title?.trim();
  const fallbackTitle = normalizedTitle === "" ? undefined : normalizedTitle;

  return fallbackTitle ?? "Team chat";
};

export const useHeaderActions = (): UseHeaderActionsResult => {
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectAuthUser);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const { data: conversations = [] } = useGetConversationsQuery();
  const { data: tasks = [] } = useGetTasksQuery();
  const [notificationAnchor, setNotificationAnchor] = useState<HTMLElement | null>(null);
  const [settingsAnchor, setSettingsAnchor] = useState<HTMLElement | null>(null);
  const [logoutAnchor, setLogoutAnchor] = useState<HTMLElement | null>(null);

  const unreadMessages = useMemo<NotificationMessageItem[]>(
    () =>
      conversations
        .filter((conversation) => (conversation.unreadCount ?? 0) > 0)
        .slice(0, 5)
        .map((conversation) => ({
          conversationId: conversation._id,
          title: getConversationTitle(conversation, currentUser?.id),
          unreadCount: conversation.unreadCount ?? 0,
        })),
    [conversations, currentUser?.id],
  );

  const overdueTasks = useMemo<NotificationTaskItem[]>(
    () =>
      tasks
        .filter(
          (task) =>
            task.dueDate &&
            task.workflowState !== "done" &&
            new Date(task.dueDate).getTime() < Date.now(),
        )
        .sort((firstTask, secondTask) => {
          const firstDueTime = firstTask.dueDate ? new Date(firstTask.dueDate).getTime() : 0;
          const secondDueTime = secondTask.dueDate ? new Date(secondTask.dueDate).getTime() : 0;

          return firstDueTime - secondDueTime;
        })
        .slice(0, 5)
        .map((task) => ({
          boardId: task.boardId,
          dueDateLabel: formatDateLabel(task.dueDate),
          projectId: task.projectId,
          taskId: task._id,
          title: task.title,
        })),
    [tasks],
  );

  const notificationCount = unreadMessages.length + overdueTasks.length;

  const handleOpenMessages = async (conversationId: string): Promise<void> => {
    setNotificationAnchor(null);
    await navigate(getMessagesRoute(conversationId));
  };

  const handleOpenTask = async (task: NotificationTaskItem): Promise<void> => {
    setNotificationAnchor(null);
    await navigate(getTasksRoute(task.projectId, task.boardId, task.taskId));
  };

  const handleOpenSettingsSection = async (tab: string): Promise<void> => {
    setSettingsAnchor(null);
    await navigate(getSettingsRoute(tab));
  };

  const handleOpenProfile = async (): Promise<void> => {
    await navigate(getSettingsRoute("My details"));
  };

  const handleConfirmLogout = async (): Promise<void> => {
    await logout().unwrap();
    setLogoutAnchor(null);
  };

  const handleOpenSettingsPage = async (): Promise<void> => {
    setSettingsAnchor(null);
    await navigate(ROUTES.settings.page);
  };

  return {
    handleConfirmLogout,
    handleOpenMessages,
    handleOpenProfile,
    handleOpenSettingsPage,
    handleOpenSettingsSection,
    handleOpenTask,
    isLoggingOut,
    logoutAnchor,
    notificationAnchor,
    notificationCount,
    overdueTasks,
    setLogoutAnchor,
    setNotificationAnchor,
    setSettingsAnchor,
    settingsAnchor,
    unreadMessages,
  };
};
