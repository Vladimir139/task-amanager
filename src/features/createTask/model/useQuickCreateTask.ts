import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";

import { getPreferredBoardColumnId, useGetBoardViewQuery } from "@/entities/board";
import { useActiveProject } from "@/entities/project";
import { selectAuthUser } from "@/entities/user";
import { getInitials } from "@/shared/lib/formatters";
import { useAppSelector } from "@/shared/libs/redux";

import { useCreateTaskMutation } from "../api/createTaskApi";

export interface QuickTaskCollaborator {
  id: string;
  initials: string;
  name: string;
}

interface UseQuickCreateTaskResult {
  canCreateTask: boolean;
  collaborators: QuickTaskCollaborator[];
  currentProjectTitle: string | null;
  handleCreateTask: () => Promise<void>;
  handleEmojiSelect: (emoji: string) => void;
  handleTaskTitleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleCollaboratorToggle: (collaboratorId: string) => void;
  helperMessage: string;
  isLoading: boolean;
  isProjectReady: boolean;
  selectedEmoji: string | null;
  selectedCollaboratorIds: string[];
  statusMessage: string | null;
  statusTone: "error" | "success" | null;
  taskTitle: string;
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (!error || typeof error !== "object" || !("data" in error)) {
    return fallback;
  }

  const data = error.data as { message?: string | string[] };
  if (Array.isArray(data.message)) {
    return data.message[0] ?? fallback;
  }

  return data.message ?? fallback;
};

export const useQuickCreateTask = (): UseQuickCreateTaskResult => {
  const currentUser = useAppSelector(selectAuthUser);
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [selectedCollaboratorIds, setSelectedCollaboratorIds] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"error" | "success" | null>(null);
  const {
    activeProjectId,
    currentProjectTitle,
    isError: isProjectError,
    isLoading: isProjectLoading,
  } = useActiveProject();
  const {
    data: boardView,
    isError: isBoardError,
    isLoading: isBoardLoading,
  } = useGetBoardViewQuery(
    { projectId: activeProjectId ?? "" },
    {
      skip: !activeProjectId,
    },
  );
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const currentUserId = currentUser?.id;
  const boardMemberIdsKey = useMemo(
    () => (boardView?.members ?? []).map((member) => member._id).join(","),
    [boardView?.members],
  );

  const collaborators = useMemo(() => {
    return (boardView?.members ?? []).map((member) => ({
      id: member._id,
      initials: getInitials(member.firstName, member.lastName),
      name: `${member.firstName} ${member.lastName}`.trim(),
    }));
  }, [boardView?.members]);

  useEffect(() => {
    const defaultCollaboratorIds =
      currentUserId && (boardView?.members ?? []).some((member) => member._id === currentUserId)
        ? [currentUserId]
        : [];

    setSelectedCollaboratorIds(defaultCollaboratorIds);
  }, [boardMemberIdsKey, boardView?.board._id, boardView?.members, currentUserId]);

  const handleTaskTitleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setTaskTitle(event.target.value);
  };

  const handleEmojiSelect = (emoji: string): void => {
    setSelectedEmoji(emoji);
  };

  const handleCollaboratorToggle = (collaboratorId: string): void => {
    setSelectedCollaboratorIds((currentState) =>
      currentState.includes(collaboratorId)
        ? currentState.filter((item) => item !== collaboratorId)
        : [...currentState, collaboratorId],
    );
  };

  const handleCreateTask = async (): Promise<void> => {
    const normalizedTitle = taskTitle.trim();
    const boardId = boardView?.board._id;
    const preferredColumnId = getPreferredBoardColumnId(boardView?.columns);

    if (!normalizedTitle || !activeProjectId || !boardId) {
      setStatusMessage(
        !normalizedTitle
          ? "Task title is required."
          : !activeProjectId
            ? "Select a project before creating a dashboard task."
            : "Project board is not ready yet.",
      );
      setStatusTone("error");
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await createTask({
        assigneeIds: selectedCollaboratorIds,
        boardId,
        category: "planning",
        columnId: preferredColumnId ?? undefined,
        description: `Created from dashboard quick action for ${currentProjectTitle ?? "project"}`,
        emoji: selectedEmoji ?? undefined,
        priority: "medium",
        projectId: activeProjectId,
        title: normalizedTitle,
      }).unwrap();

      setTaskTitle("");
      setSelectedEmoji(null);
      setStatusMessage("Task created successfully.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getErrorMessage(error, "Unable to create the dashboard task."));
      setStatusTone("error");
    }
  };

  const isProjectReady = Boolean(activeProjectId && boardView?.board._id);
  const helperMessage =
    isProjectLoading || isBoardLoading
      ? "Loading project workspace..."
      : isProjectError || isBoardError
        ? "Unable to load the active project workspace."
        : !activeProjectId
          ? "No project available yet. Create a project first."
          : !boardView?.board._id
            ? "This project does not have a board yet."
            : collaborators.length === 0
              ? "No collaborators available on this board yet."
              : "Pick collaborators and create a task in the active project board.";

  return {
    canCreateTask: taskTitle.trim() !== "" && isProjectReady,
    collaborators,
    currentProjectTitle,
    handleCreateTask,
    handleEmojiSelect,
    handleTaskTitleChange,
    handleCollaboratorToggle,
    helperMessage,
    isLoading,
    isProjectReady,
    selectedEmoji,
    selectedCollaboratorIds,
    statusMessage,
    statusTone,
    taskTitle,
  };
};
