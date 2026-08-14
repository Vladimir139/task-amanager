import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import { getPreferredBoardColumnId, useGetBoardViewQuery } from "@/entities/board";
import { useActiveProject, useGetProjectsQuery } from "@/entities/project";
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
  handleProjectChange: (projectId: string) => void;
  handleEmojiSelect: (emoji: string) => void;
  handleTaskTitleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleCollaboratorToggle: (collaboratorId: string) => void;
  helperMessage: string;
  isLoading: boolean;
  isProjectReady: boolean;
  projectOptions: Array<{ id: string; title: string }>;
  selectedEmoji: string | null;
  selectedCollaboratorIds: string[];
  selectedProjectId: string;
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
  const [projectOverrideId, setProjectOverrideId] = useState<string | null>(null);
  const {
    activeProjectId,
    currentProjectTitle,
    isError: isProjectError,
    isLoading: isProjectLoading,
  } = useActiveProject();
  const { data: projectsResponse } = useGetProjectsQuery({
    limit: 100,
    page: 1,
  });
  const projectOptions =
    projectsResponse?.items.map((project) => ({
      id: project._id,
      title: project.title,
    })) ?? [];
  const selectedProjectId = projectOverrideId ?? activeProjectId ?? "";
  const selectedProjectTitle =
    projectOptions.find((project) => project.id === selectedProjectId)?.title ??
    currentProjectTitle ??
    null;
  const {
    data: boardView,
    isError: isBoardError,
    isLoading: isBoardLoading,
  } = useGetBoardViewQuery(
    { projectId: selectedProjectId },
    {
      skip: !selectedProjectId,
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

  const handleProjectChange = (projectId: string): void => {
    setProjectOverrideId(projectId === activeProjectId ? null : projectId);
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

    if (!normalizedTitle || !selectedProjectId || !boardId) {
      toast.error(
        !normalizedTitle
          ? "Task title is required."
          : !selectedProjectId
            ? "Select a project before creating a dashboard task."
            : "Project board is not ready yet.",
      );
      return;
    }

    try {
      await createTask({
        assigneeIds: selectedCollaboratorIds,
        boardId,
        category: "planning",
        columnId: preferredColumnId ?? undefined,
        description: `Created from dashboard quick action for ${selectedProjectTitle ?? "project"}`,
        emoji: selectedEmoji ?? undefined,
        priority: "medium",
        projectId: selectedProjectId,
        title: normalizedTitle,
      }).unwrap();

      setTaskTitle("");
      setSelectedEmoji(null);
      toast.success("Task created successfully.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to create the dashboard task."));
    }
  };

  const isProjectReady = Boolean(selectedProjectId && boardView?.board._id);
  const helperMessage =
    isProjectLoading || isBoardLoading
      ? "Loading project workspace..."
      : isProjectError || isBoardError
        ? "Unable to load the active project workspace."
        : !selectedProjectId
          ? "No project available yet. Create a project first."
          : !boardView?.board._id
            ? "This project does not have a board yet."
            : collaborators.length === 0
              ? "No collaborators available on this board yet."
              : "Pick collaborators and create a task in the selected project backlog.";

  return {
    canCreateTask: taskTitle.trim() !== "" && isProjectReady,
    collaborators,
    currentProjectTitle: selectedProjectTitle,
    handleCreateTask,
    handleProjectChange,
    handleEmojiSelect,
    handleTaskTitleChange,
    handleCollaboratorToggle,
    helperMessage,
    isLoading,
    isProjectReady,
    projectOptions,
    selectedEmoji,
    selectedCollaboratorIds,
    selectedProjectId,
    taskTitle,
  };
};
