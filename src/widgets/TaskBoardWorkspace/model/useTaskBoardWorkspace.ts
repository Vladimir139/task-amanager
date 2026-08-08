import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetBoardsQuery, useGetBoardViewQuery, useSelectedBoardId } from "@/entities/board";
import { type BoardMember } from "@/entities/boardMember";
import { type BoardColumn } from "@/entities/boardTask";
import { useGetConversationMessagesQuery, useSendMessageMutation } from "@/entities/message";
import { useSelectedProjectId } from "@/entities/project";
import { selectAuthUser } from "@/entities/user";
import type { BoardColumnRecord, BoardRecord, TaskRecord } from "@/shared/api/types";
import { getTasksRoute } from "@/shared/config/router";
import {
  formatDateLabel,
  formatTimeLabel,
  getInitials,
  normalizeCategoryLabel,
} from "@/shared/lib/formatters";
import { useAppSelector } from "@/shared/libs/redux";

interface UseTaskBoardWorkspaceResult {
  activeBoardId: string | null;
  board: BoardRecord | null;
  boardColumnRecords: BoardColumnRecord[];
  boardColumns: BoardColumn[];
  boardMessages: Array<{
    audio?: {
      duration: string;
      waveform: { id: string; height: number }[];
    };
    author: string;
    avatar: BoardMember;
    id: string;
    isOwn?: boolean;
    text?: string;
    time: string;
  }>;
  boardMembers: BoardMember[];
  boards: BoardRecord[];
  canManageBoard: boolean;
  hasBoard: boolean;
  isError: boolean;
  isLoading: boolean;
  isMessagesError: boolean;
  isProjectSelected: boolean;
  isSendingMessage: boolean;
  message: string;
  onBoardSelect: (boardId: string) => void;
  projectId: string | null;
  sendMessage: () => Promise<void>;
  setMessage: (value: string) => void;
  taskBoardEmoji: string;
  taskBoardExtraMembersCount: number;
  taskBoardMembersCount: number;
  taskBoardTitle: string;
  tasksByColumn: Record<string, TaskRecord[]>;
}

export const useTaskBoardWorkspace = (): UseTaskBoardWorkspaceResult => {
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectAuthUser);
  const projectId = useSelectedProjectId();
  const selectedBoardId = useSelectedBoardId();
  const [message, setMessage] = useState("");
  const {
    data: boards = [],
    isError: isBoardsError,
    isLoading: isBoardsLoading,
  } = useGetBoardsQuery(projectId ?? "", {
    skip: !projectId,
  });
  const activeBoardId = useMemo(() => {
    if (!boards.length) {
      return null;
    }

    if (selectedBoardId && boards.some((board) => board._id === selectedBoardId)) {
      return selectedBoardId;
    }

    return boards.find((board) => board.isDefault)?._id ?? boards[0]?._id ?? null;
  }, [boards, selectedBoardId]);

  useEffect(() => {
    if (!projectId || !activeBoardId || activeBoardId === selectedBoardId) {
      return;
    }

    void navigate(getTasksRoute(projectId, activeBoardId), { replace: true });
  }, [activeBoardId, navigate, projectId, selectedBoardId]);

  const {
    data: boardView,
    isError: isBoardError,
    isLoading: isBoardLoading,
  } = useGetBoardViewQuery(
    {
      boardId: activeBoardId ?? undefined,
      projectId: projectId ?? "",
    },
    {
      skip: !projectId || !activeBoardId,
    },
  );
  const conversationId = boardView?.chatPreview?.conversationId;
  const { data: conversationMessages, isError: isMessagesError } = useGetConversationMessagesQuery(
    conversationId ?? "",
    {
      skip: !conversationId,
    },
  );
  const [sendBoardMessage, { isLoading: isSendingMessage }] = useSendMessageMutation();

  const boardMembers = useMemo<BoardMember[]>(() => {
    return (
      boardView?.members.map((member) => ({
        avatarUrl: member.avatarUrl ?? undefined,
        id: member._id,
        initials: getInitials(member.firstName, member.lastName),
        isOnline: member.isOnline,
      })) ?? []
    );
  }, [boardView?.members]);

  const memberMap = useMemo(() => {
    return new Map(
      (boardView?.members ?? []).map((member) => [
        member._id,
        {
          avatarUrl: member.avatarUrl ?? undefined,
          id: member._id,
          initials: getInitials(member.firstName, member.lastName),
          isOnline: member.isOnline,
          name: `${member.firstName} ${member.lastName}`.trim(),
        },
      ]),
    );
  }, [boardView?.members]);

  const boardColumns = useMemo<BoardColumn[]>(() => {
    if (!boardView) {
      return [];
    }

    return boardView.columns.map((column) => ({
      id: column._id,
      tasks: (boardView.tasksByColumn[column._id] ?? []).map((task) => ({
        comments: task.commentCount || undefined,
        completed: task.checklistTotal > 0 ? task.checklistCompleted : undefined,
        date: formatDateLabel(task.dueDate ?? task.createdAt),
        description: task.description || "No description yet",
        files: task.attachmentCount || undefined,
        id: task._id,
        members: task.assigneeIds
          .map((assigneeId) => memberMap.get(assigneeId))
          .filter(Boolean)
          .map((member) => ({
            avatarUrl: member?.avatarUrl,
            id: String(member?.id),
            initials: member?.initials ?? "NA",
            isOnline: member?.isOnline,
          })),
        title: task.title,
        total: task.checklistTotal || undefined,
        category: normalizeCategoryLabel(task.category),
      })),
      title: column.title,
    }));
  }, [boardView, memberMap]);

  const boardMessages = useMemo(() => {
    const messages = conversationMessages ?? boardView?.chatPreview?.messages ?? [];

    return (
      messages.slice(-10).map((item) => {
        const author = memberMap.get(item.authorId);
        const waveform = item.audio?.waveform?.map((barHeight, index) => ({
          height: Math.max(8, Math.round(barHeight)),
          id: `${item._id}-${index}`,
        }));

        return {
          audio:
            item.kind === "audio" && item.audio
              ? {
                  duration: formatTimeLabel(
                    new Date((item.audio.durationMs ?? 0) * 1000).toISOString(),
                  ),
                  waveform: waveform ?? [],
                }
              : undefined,
          author: author?.name ?? "Teammate",
          avatar: {
            avatarUrl: author?.avatarUrl,
            id: author?.id ?? item.authorId,
            initials: author?.initials ?? "TM",
            isOnline: author?.isOnline,
          },
          id: item._id,
          isOwn: item.authorId === currentUser?.id,
          text: item.text ?? undefined,
          time: formatTimeLabel(item.createdAt),
        };
      }) ?? []
    );
  }, [boardView?.chatPreview?.messages, conversationMessages, currentUser?.id, memberMap]);

  const canManageBoard = useMemo(() => {
    const currentMemberRole =
      boardView?.members.find((member) => member._id === currentUser?.id)?.memberRole ?? null;

    return currentMemberRole === "owner" || currentMemberRole === "admin";
  }, [boardView?.members, currentUser?.id]);

  const handleBoardSelect = (boardId: string): void => {
    if (!projectId) {
      return;
    }

    void navigate(getTasksRoute(projectId, boardId));
  };

  const sendMessage = async (): Promise<void> => {
    const normalizedMessage = message.trim();

    if (!normalizedMessage || !conversationId) {
      return;
    }

    await sendBoardMessage({
      conversationId,
      kind: "text",
      text: normalizedMessage,
    }).unwrap();

    setMessage("");
  };

  return {
    activeBoardId,
    board: boardView?.board ?? null,
    boardColumnRecords: boardView?.columns ?? [],
    boardColumns,
    boardMessages,
    boardMembers,
    boards,
    canManageBoard,
    hasBoard: boards.length > 0 && Boolean(boardView?.board),
    isError: isBoardsError || isBoardError,
    isLoading:
      Boolean(projectId) && (isBoardsLoading || (Boolean(activeBoardId) && isBoardLoading)),
    isMessagesError,
    isProjectSelected: Boolean(projectId),
    isSendingMessage,
    message,
    onBoardSelect: handleBoardSelect,
    projectId,
    sendMessage,
    setMessage,
    taskBoardEmoji: boardView?.board.emoji ?? "🔥",
    taskBoardExtraMembersCount: Math.max(boardMembers.length - 5, 0),
    taskBoardMembersCount: boardMembers.length,
    taskBoardTitle: boardView?.board.title ?? "Task board",
    tasksByColumn: boardView?.tasksByColumn ?? {},
  };
};
