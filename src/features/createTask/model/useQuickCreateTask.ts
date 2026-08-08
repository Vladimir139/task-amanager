import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";

import { getPreferredBoardColumnId, useGetBoardViewQuery } from "@/entities/board";
import { useActiveProject } from "@/entities/project";
import { getInitials } from "@/shared/lib/formatters";

import { useCreateTaskMutation } from "../api/createTaskApi";

export interface QuickTaskCollaborator {
  id: string;
  initials: string;
  name: string;
}

interface UseQuickCreateTaskResult {
  collaborators: QuickTaskCollaborator[];
  currentProjectTitle: string | null;
  handleCreateTask: () => Promise<void>;
  handleEmojiSelect: (emoji: string) => void;
  handleTaskTitleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  selectedEmoji: string | null;
  taskTitle: string;
}

export const useQuickCreateTask = (): UseQuickCreateTaskResult => {
  const [taskTitle, setTaskTitle] = useState("Create new");
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const { activeProjectId, currentProjectTitle } = useActiveProject();
  const { data: boardView } = useGetBoardViewQuery(
    { projectId: activeProjectId ?? "" },
    {
      skip: !activeProjectId,
    },
  );
  const [createTask, { isLoading }] = useCreateTaskMutation();

  const collaborators = useMemo(() => {
    return (boardView?.members ?? []).slice(0, 2).map((member) => ({
      id: member._id,
      initials: getInitials(member.firstName, member.lastName),
      name: `${member.firstName} ${member.lastName}`.trim(),
    }));
  }, [boardView?.members]);

  const handleTaskTitleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setTaskTitle(event.target.value);
  };

  const handleEmojiSelect = (emoji: string): void => {
    setSelectedEmoji(emoji);
  };

  const handleCreateTask = async (): Promise<void> => {
    const normalizedTitle = taskTitle.trim();
    const boardId = boardView?.board._id;
    const preferredColumnId = getPreferredBoardColumnId(boardView?.columns);

    if (!normalizedTitle || !activeProjectId || !boardId) {
      return;
    }

    await createTask({
      assigneeIds: collaborators.map((collaborator) => String(collaborator.id)),
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
  };

  return {
    collaborators,
    currentProjectTitle,
    handleCreateTask,
    handleEmojiSelect,
    handleTaskTitleChange,
    isLoading,
    selectedEmoji,
    taskTitle,
  };
};
