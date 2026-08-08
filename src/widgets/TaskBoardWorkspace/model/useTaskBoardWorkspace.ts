import { useMemo, useState } from "react";

import { useGetBoardViewQuery } from "@/entities/board/api/boardsApi";
import { type BoardMember } from "@/entities/boardMember";
import { type BoardColumn } from "@/entities/boardTask";
import { useSendMessageMutation } from "@/entities/message";
import { useGetProjectsQuery } from "@/entities/project";
import { selectAuthUser } from "@/entities/user";
import {
  formatDateLabel,
  formatTimeLabel,
  getInitials,
  normalizeCategoryLabel,
} from "@/shared/lib/formatters";
import { useAppSelector } from "@/shared/libs/redux";

interface UseTaskBoardWorkspaceResult {
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
  hasBoard: boolean;
  isLoading: boolean;
  isSendingMessage: boolean;
  message: string;
  sendMessage: () => Promise<void>;
  setMessage: (value: string) => void;
  taskBoardEmoji: string;
  taskBoardExtraMembersCount: number;
  taskBoardMembersCount: number;
  taskBoardTitle: string;
}

export const useTaskBoardWorkspace = (): UseTaskBoardWorkspaceResult => {
  const currentUser = useAppSelector(selectAuthUser);
  const [message, setMessage] = useState("");
  const { data: projects, isLoading: isProjectsLoading } = useGetProjectsQuery({
    limit: 1,
    page: 1,
  });
  const activeProject = projects?.items[0];
  const { data: boardView, isLoading: isBoardLoading } = useGetBoardViewQuery(
    activeProject?._id ?? "",
    {
      skip: !activeProject?._id,
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
    return (
      boardView?.chatPreview?.messages.map((item) => {
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
  }, [boardView?.chatPreview?.messages, currentUser?.id, memberMap]);

  const sendMessage = async (): Promise<void> => {
    const normalizedMessage = message.trim();
    const conversationId = boardView?.chatPreview?.conversationId;

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
    boardColumns,
    boardMessages,
    boardMembers,
    hasBoard: Boolean(boardView?.board),
    isLoading: isProjectsLoading || isBoardLoading,
    isSendingMessage,
    message,
    sendMessage,
    setMessage,
    taskBoardEmoji: boardView?.board.emoji ?? "🔥",
    taskBoardExtraMembersCount: Math.max(boardMembers.length - 5, 0),
    taskBoardMembersCount: boardMembers.length,
    taskBoardTitle: boardView?.board.title ?? "Task board",
  };
};
