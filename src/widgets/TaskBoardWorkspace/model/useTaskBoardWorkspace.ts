import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  getBoardProjectTagId,
  getBoardTagId,
  useGetBoardsQuery,
  useGetBoardViewQuery,
  useSelectedBoardId,
} from "@/entities/board";
import { type BoardMember } from "@/entities/boardMember";
import { type BoardColumn } from "@/entities/boardTask";
import { useGetConversationDetailsQuery } from "@/entities/conversation";
import {
  useDeleteMessageMutation,
  useGetConversationMessagesQuery,
  useSendMessageMutation,
  useUpdateMessageMutation,
  useUploadAudioMessageMutation,
} from "@/entities/message";
import {
  projectSelectionActions,
  selectCurrentProjectId,
  useActiveProject,
} from "@/entities/project";
import { useSelectedTaskId } from "@/entities/task";
import { selectAuthUser, useUpdateCurrentProjectMutation } from "@/entities/user";
import { selectAccessToken } from "@/features/auth/model/selectors";
import { useMarkConversationReadMutation } from "@/features/markConversationRead";
import { baseApi } from "@/shared/api";
import type { BoardColumnRecord, BoardRecord, TaskRecord } from "@/shared/api/types";
import { getTasksRoute } from "@/shared/config/router";
import { getApiErrorMessage } from "@/shared/lib/api";
import {
  formatDateLabel,
  formatTimeLabel,
  getInitials,
  normalizeCategoryLabel,
} from "@/shared/lib/formatters";
import { mergePresenceState, setPresenceState, useRealtimeSocket } from "@/shared/lib/realtime";
import { useAppDispatch, useAppSelector } from "@/shared/libs/redux";
import type { RecordedAudioPayload } from "@/shared/ui/molecules/VoiceRecorderButton/VoiceRecorderButton";

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
    canDelete?: boolean;
    canEdit?: boolean;
    editDraft?: string;
    id: string;
    isEdited?: boolean;
    isEditing?: boolean;
    isOwn?: boolean;
    isRead?: boolean;
    onDelete?: () => void | Promise<void>;
    onEditCancel?: () => void;
    onEditChange?: (value: string) => void;
    onEditStart?: () => void;
    onEditSubmit?: () => Promise<void>;
    sequence?: number;
    text?: string;
    time: string;
  }>;
  boardMembers: BoardMember[];
  boards: BoardRecord[];
  canManageBoard: boolean;
  closeCreateTask: () => void;
  closeTask: () => void;
  createTaskColumnId: string | null;
  hasBoard: boolean;
  isError: boolean;
  isLoading: boolean;
  isMessagesError: boolean;
  isSavingGlobalProject: boolean;
  isSendingMessage: boolean;
  memberOptions: Array<{
    id: string;
    initials: string;
    isOnline?: boolean;
    name: string;
  }>;
  message: string;
  onAudioRecorded: (payload: RecordedAudioPayload) => Promise<void>;
  onBoardSelect: (boardId: string) => void;
  onCloseDeleteMessageConfirm: () => void;
  onConfirmDeleteMessage: () => Promise<void>;
  onCreateTask: (columnId: string) => void;
  onMakeProjectGlobal: () => Promise<void>;
  onOpenTask: (taskId: string) => void;
  pendingDeleteMessageId: string | null;
  pendingDeleteMessageText: string | null;
  projectId: string | null;
  sendMessage: () => Promise<void>;
  selectedTaskId: string | null;
  setMessage: (value: string) => void;
  shouldShowMakeProjectGlobalAction: boolean;
  taskBoardEmoji: string;
  taskBoardExtraMembersCount: number;
  taskBoardMembersCount: number;
  taskBoardTitle: string;
  tasksByColumn: Record<string, TaskRecord[]>;
  typingText: string | null;
}

export const useTaskBoardWorkspace = (): UseTaskBoardWorkspaceResult => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectAccessToken);
  const currentUser = useAppSelector(selectAuthUser);
  const currentProjectId = useAppSelector(selectCurrentProjectId);
  const { activeProjectId: projectId } = useActiveProject();
  const selectedBoardId = useSelectedBoardId();
  const selectedTaskId = useSelectedTaskId();
  const [message, setMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageText, setEditingMessageText] = useState("");
  const [pendingDeleteMessageId, setPendingDeleteMessageId] = useState<string | null>(null);
  const [pendingDeleteMessageText, setPendingDeleteMessageText] = useState<string | null>(null);
  const [presenceByUserId, setPresenceByUserId] = useState<Record<string, boolean>>({});
  const [typingUserIds, setTypingUserIds] = useState<string[]>([]);
  const [createTaskColumnId, setCreateTaskColumnId] = useState<string | null>(null);
  const [updateCurrentProject, { isLoading: isSavingGlobalProject }] =
    useUpdateCurrentProjectMutation();
  const typingTimeoutRef = useRef<number | null>(null);
  const typingConversationIdRef = useRef<string | null>(null);
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
  const { data: conversationDetails } = useGetConversationDetailsQuery(conversationId ?? "", {
    skip: !conversationId,
  });
  const { data: conversationMessages, isError: isMessagesError } = useGetConversationMessagesQuery(
    conversationId ?? "",
    {
      skip: !conversationId,
    },
  );
  const [sendBoardMessage, { isLoading: isSendingMessage }] = useSendMessageMutation();
  const [updateMessage] = useUpdateMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [uploadAudioMessage] = useUploadAudioMessageMutation();
  const [markConversationRead] = useMarkConversationReadMutation();
  const presenceSocket = useRealtimeSocket(
    "/presence",
    accessToken,
    Boolean((boardView?.members.length ?? 0) > 0),
  );
  const typingSocket = useRealtimeSocket("/typing", accessToken, Boolean(conversationId));
  const chatSocket = useRealtimeSocket("/chat", accessToken, Boolean(conversationId));
  const boardsSocket = useRealtimeSocket("/boards", accessToken, Boolean(activeBoardId));

  useEffect(() => {
    setTypingUserIds([]);
  }, [conversationId]);

  useEffect(() => {
    if (!presenceSocket || (boardView?.members.length ?? 0) === 0) {
      return;
    }

    const memberIds = boardView?.members.map((member) => member._id) ?? [];
    const subscribePresence = (): void => {
      presenceSocket.emit("presence.subscribe", {
        userIds: memberIds,
      });
    };

    const handlePresenceChanged = (presence: Record<string, boolean>): void => {
      setPresenceByUserId((currentState) => mergePresenceState(currentState, presence));
    };

    const handleOnline = ({ userId }: { userId: string }): void => {
      setPresenceByUserId((currentState) => setPresenceState(currentState, userId, true));
    };

    const handleOffline = ({ userId }: { userId: string }): void => {
      setPresenceByUserId((currentState) => setPresenceState(currentState, userId, false));
    };

    if (presenceSocket.connected) {
      subscribePresence();
    }

    presenceSocket.on("connect", subscribePresence);
    presenceSocket.on("presence.changed", handlePresenceChanged);
    presenceSocket.on("presence.online", handleOnline);
    presenceSocket.on("presence.offline", handleOffline);

    return () => {
      presenceSocket.off("connect", subscribePresence);
      presenceSocket.off("presence.changed", handlePresenceChanged);
      presenceSocket.off("presence.online", handleOnline);
      presenceSocket.off("presence.offline", handleOffline);
    };
  }, [boardView?.members, presenceSocket]);

  useEffect(() => {
    if (!boardsSocket || !activeBoardId || !projectId) {
      return;
    }

    const joinBoard = (): void => {
      boardsSocket.emit("board.join", {
        boardId: activeBoardId,
      });
    };

    const invalidateBoardData = (): void => {
      dispatch(
        baseApi.util.invalidateTags([
          "Tasks",
          { id: getBoardProjectTagId(projectId), type: "Board" },
          { id: getBoardTagId(activeBoardId), type: "Board" },
        ]),
      );
    };

    if (boardsSocket.connected) {
      joinBoard();
    }

    boardsSocket.on("connect", joinBoard);
    boardsSocket.on("task.updated", invalidateBoardData);
    boardsSocket.on("task.moved", invalidateBoardData);
    boardsSocket.on("column.created", invalidateBoardData);
    boardsSocket.on("column.updated", invalidateBoardData);
    boardsSocket.on("column.reordered", invalidateBoardData);
    boardsSocket.on("column.deleted", invalidateBoardData);

    return () => {
      boardsSocket.off("connect", joinBoard);
      boardsSocket.off("task.updated", invalidateBoardData);
      boardsSocket.off("task.moved", invalidateBoardData);
      boardsSocket.off("column.created", invalidateBoardData);
      boardsSocket.off("column.updated", invalidateBoardData);
      boardsSocket.off("column.reordered", invalidateBoardData);
      boardsSocket.off("column.deleted", invalidateBoardData);
    };
  }, [activeBoardId, boardsSocket, dispatch, projectId]);

  useEffect(() => {
    if (!chatSocket || !conversationId) {
      return;
    }

    const joinConversation = (): void => {
      chatSocket.emit("conversation.join", {
        conversationId,
      });
    };

    const invalidateMessages = (): void => {
      dispatch(
        baseApi.util.invalidateTags([
          { id: conversationId, type: "ConversationMessages" },
          { id: conversationId, type: "ConversationFiles" },
        ]),
      );
    };

    if (chatSocket.connected) {
      joinConversation();
    }

    chatSocket.on("connect", joinConversation);
    chatSocket.on("message.created", invalidateMessages);
    chatSocket.on("message.updated", invalidateMessages);
    chatSocket.on("message.deleted", invalidateMessages);
    chatSocket.on("message.read", invalidateMessages);

    return () => {
      chatSocket.off("connect", joinConversation);
      chatSocket.off("message.created", invalidateMessages);
      chatSocket.off("message.updated", invalidateMessages);
      chatSocket.off("message.deleted", invalidateMessages);
      chatSocket.off("message.read", invalidateMessages);
    };
  }, [chatSocket, conversationId, dispatch]);

  useEffect(() => {
    const lastSequence = conversationMessages?.at(-1)?.sequence ?? 0;
    const currentConversationMember = conversationDetails?.members.find(
      (member) => member.userId === currentUser?.id,
    );
    const lastReadSequence = currentConversationMember?.lastReadSequence ?? 0;

    if (!conversationId || lastSequence <= 0 || lastReadSequence >= lastSequence) {
      return;
    }

    void markConversationRead({
      conversationId,
      sequence: lastSequence,
    });
  }, [
    conversationDetails?.members,
    conversationId,
    conversationMessages,
    currentUser?.id,
    markConversationRead,
  ]);

  useEffect(() => {
    if (!typingSocket || !conversationId) {
      return;
    }

    const joinConversation = (): void => {
      typingSocket.emit("conversation.join", {
        conversationId,
      });
    };

    const handleTypingStart = ({
      conversationId: nextConversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }): void => {
      if (nextConversationId !== conversationId || userId === currentUser?.id) {
        return;
      }

      setTypingUserIds((currentState) =>
        currentState.includes(userId) ? currentState : [...currentState, userId],
      );
    };

    const handleTypingStop = ({
      conversationId: nextConversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }): void => {
      if (nextConversationId !== conversationId) {
        return;
      }

      setTypingUserIds((currentState) =>
        currentState.filter((currentUserId) => currentUserId !== userId),
      );
    };

    if (typingSocket.connected) {
      joinConversation();
    }

    typingSocket.on("connect", joinConversation);
    typingSocket.on("typing.start", handleTypingStart);
    typingSocket.on("typing.stop", handleTypingStop);

    return () => {
      typingSocket.off("connect", joinConversation);
      typingSocket.off("typing.start", handleTypingStart);
      typingSocket.off("typing.stop", handleTypingStop);
    };
  }, [conversationId, currentUser?.id, typingSocket]);

  const stopTyping = useCallback(
    (targetConversationId?: string | null): void => {
      const resolvedConversationId = targetConversationId ?? typingConversationIdRef.current;
      if (!typingSocket || !resolvedConversationId) {
        return;
      }

      typingSocket.emit("typing.stop", {
        conversationId: resolvedConversationId,
      });
      typingConversationIdRef.current = null;

      if (typingTimeoutRef.current !== null) {
        window.clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    },
    [typingSocket],
  );

  useEffect(() => {
    return () => {
      stopTyping(typingConversationIdRef.current);
    };
  }, [stopTyping]);

  useEffect(() => {
    if (typingConversationIdRef.current && typingConversationIdRef.current !== conversationId) {
      stopTyping(typingConversationIdRef.current);
    }
  }, [conversationId, stopTyping]);

  useEffect(() => {
    if (!typingSocket || !conversationId) {
      return;
    }

    const normalizedMessage = message.trim();
    if (normalizedMessage === "") {
      stopTyping(conversationId);
      return;
    }

    if (typingConversationIdRef.current !== conversationId) {
      typingSocket.emit("typing.start", {
        conversationId,
      });
      typingConversationIdRef.current = conversationId;
    }

    if (typingTimeoutRef.current !== null) {
      window.clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      stopTyping(conversationId);
    }, 1200);

    return () => {
      if (typingTimeoutRef.current !== null) {
        window.clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    };
  }, [conversationId, message, stopTyping, typingSocket]);

  const getIsMemberOnline = useCallback(
    (memberId: string, fallbackOnline?: boolean): boolean =>
      presenceByUserId[memberId] ?? fallbackOnline ?? false,
    [presenceByUserId],
  );

  const boardMembers = useMemo<BoardMember[]>(() => {
    return (
      boardView?.members.map((member) => ({
        avatarUrl: member.avatarUrl ?? undefined,
        id: member._id,
        initials: getInitials(member.firstName, member.lastName),
        isOnline: getIsMemberOnline(member._id, member.isOnline),
      })) ?? []
    );
  }, [boardView?.members, getIsMemberOnline]);

  const memberOptions = useMemo(() => {
    return (
      boardView?.members.map((member) => ({
        id: member._id,
        initials: getInitials(member.firstName, member.lastName),
        isOnline: getIsMemberOnline(member._id, member.isOnline),
        name: `${member.firstName} ${member.lastName}`.trim(),
      })) ?? []
    );
  }, [boardView?.members, getIsMemberOnline]);

  const memberMap = useMemo(() => {
    return new Map(
      (boardView?.members ?? []).map((member) => [
        member._id,
        {
          avatarUrl: member.avatarUrl ?? undefined,
          id: member._id,
          initials: getInitials(member.firstName, member.lastName),
          isOnline: getIsMemberOnline(member._id, member.isOnline),
          name: `${member.firstName} ${member.lastName}`.trim(),
        },
      ]),
    );
  }, [boardView?.members, getIsMemberOnline]);

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
    const currentConversationMember = conversationDetails?.members.find(
      (member) => member.userId === currentUser?.id,
    );
    const lastReadSequence = currentConversationMember?.lastReadSequence ?? 0;

    return (
      messages.slice(-10).map((item) => {
        const author = memberMap.get(item.authorId);
        const waveform = item.audio?.waveform?.map((barHeight, index) => ({
          height: Math.max(8, Math.round(barHeight)),
          id: `${item._id}-${index}`,
        }));
        const isOwn = item.authorId === currentUser?.id;
        const isRead = item.sequence <= lastReadSequence;

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
          canDelete: isOwn,
          canEdit: isOwn && item.kind === "text" && Boolean(item.text),
          editDraft: editingMessageId === item._id ? editingMessageText : (item.text ?? ""),
          id: item._id,
          isEdited: item.isEdited,
          isEditing: editingMessageId === item._id,
          isOwn,
          isRead,
          onDelete: () => {
            setPendingDeleteMessageId(item._id);
            setPendingDeleteMessageText(item.text?.trim() ?? null);
          },
          onEditCancel: () => {
            setEditingMessageId(null);
            setEditingMessageText("");
          },
          onEditChange: setEditingMessageText,
          onEditStart: () => {
            setEditingMessageId(item._id);
            setEditingMessageText(item.text ?? "");
          },
          onEditSubmit: async () => {
            if (!editingMessageId) {
              return;
            }

            const normalizedText = editingMessageText.trim();

            if (!normalizedText) {
              toast.error("Message text is required.");
              return;
            }

            try {
              await updateMessage({
                messageId: editingMessageId,
                text: normalizedText,
              }).unwrap();

              setEditingMessageId(null);
              setEditingMessageText("");
            } catch (error) {
              toast.error(getApiErrorMessage(error, "Unable to update the message."));
            }
          },
          sequence: item.sequence,
          text: item.text ?? undefined,
          time: formatTimeLabel(item.createdAt),
        };
      }) ?? []
    );
  }, [
    boardView?.chatPreview?.messages,
    conversationDetails?.members,
    conversationMessages,
    currentUser?.id,
    editingMessageId,
    editingMessageText,
    memberMap,
    updateMessage,
  ]);

  const handleCloseDeleteMessageConfirm = useCallback((): void => {
    setPendingDeleteMessageId(null);
    setPendingDeleteMessageText(null);
  }, []);

  const handleConfirmDeleteMessage = useCallback(async (): Promise<void> => {
    if (!conversationId || !pendingDeleteMessageId) {
      return;
    }

    try {
      await deleteMessage({
        conversationId,
        messageId: pendingDeleteMessageId,
      }).unwrap();

      if (editingMessageId === pendingDeleteMessageId) {
        setEditingMessageId(null);
        setEditingMessageText("");
      }

      handleCloseDeleteMessageConfirm();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to delete the message."));
    }
  }, [
    conversationId,
    deleteMessage,
    editingMessageId,
    handleCloseDeleteMessageConfirm,
    pendingDeleteMessageId,
  ]);

  const canManageBoard = useMemo(() => {
    const currentMemberRole =
      boardView?.members.find((member) => member._id === currentUser?.id)?.memberRole ?? null;

    return currentMemberRole === "owner" || currentMemberRole === "admin";
  }, [boardView?.members, currentUser?.id]);

  const shouldShowMakeProjectGlobalAction = Boolean(projectId) && currentProjectId !== projectId;

  const handleBoardSelect = (boardId: string): void => {
    if (!projectId) {
      return;
    }

    setCreateTaskColumnId(null);
    void navigate(getTasksRoute(projectId, boardId));
  };

  const handleMakeProjectGlobal = async (): Promise<void> => {
    if (!projectId || projectId === currentProjectId) {
      return;
    }

    dispatch(projectSelectionActions.setCurrentProjectId(projectId));

    try {
      await updateCurrentProject({ currentProjectId: projectId }).unwrap();
      toast.success("The project is now your global selection.");
    } catch {
      dispatch(projectSelectionActions.setCurrentProjectId(currentProjectId ?? null));
      toast.error("Unable to save the global project.");
    }
  };

  const handleOpenTask = (taskId: string): void => {
    if (!projectId || !activeBoardId) {
      return;
    }

    setCreateTaskColumnId(null);
    void navigate(getTasksRoute(projectId, activeBoardId, taskId));
  };

  const handleCloseTask = (): void => {
    if (!projectId || !activeBoardId) {
      return;
    }

    void navigate(getTasksRoute(projectId, activeBoardId));
  };

  const handleCreateTask = (columnId: string): void => {
    setCreateTaskColumnId(columnId);
    if (!projectId || !activeBoardId) {
      return;
    }

    void navigate(getTasksRoute(projectId, activeBoardId));
  };

  const handleCloseCreateTask = (): void => {
    setCreateTaskColumnId(null);
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
    stopTyping(conversationId);
  };

  const handleAudioRecorded = async (payload: RecordedAudioPayload): Promise<void> => {
    if (!conversationId) {
      return;
    }

    try {
      const uploadedAudio = await uploadAudioMessage({
        conversationId,
        durationMs: payload.durationMs,
        file: payload.file,
        waveform: payload.waveform,
      }).unwrap();

      await sendBoardMessage({
        audio: {
          fileId: uploadedAudio._id,
          durationMs: uploadedAudio.durationMs ?? undefined,
          mimeType: uploadedAudio.mimeType,
          waveform: uploadedAudio.waveform ?? undefined,
        },
        conversationId,
        kind: "audio",
      }).unwrap();

      stopTyping(conversationId);
      toast.success("Voice message sent.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to send the voice message."));
    }
  };

  const typingMembers = (boardView?.members ?? []).filter(
    (member) => typingUserIds.includes(member._id) && member._id !== currentUser?.id,
  );
  const typingText =
    typingMembers.length === 0
      ? null
      : typingMembers.length === 1
        ? `${typingMembers[0]?.firstName ?? "Someone"} is typing...`
        : `${typingMembers.length} people are typing...`;

  return {
    activeBoardId,
    board: boardView?.board ?? null,
    boardColumnRecords: boardView?.columns ?? [],
    boardColumns,
    boardMessages,
    boardMembers,
    boards,
    canManageBoard,
    closeCreateTask: handleCloseCreateTask,
    closeTask: handleCloseTask,
    createTaskColumnId,
    hasBoard: boards.length > 0 && Boolean(boardView?.board),
    isError: isBoardsError || isBoardError,
    isLoading:
      Boolean(projectId) && (isBoardsLoading || (Boolean(activeBoardId) && isBoardLoading)),
    isMessagesError,
    isSavingGlobalProject,
    isSendingMessage,
    memberOptions,
    message,
    onAudioRecorded: handleAudioRecorded,
    onBoardSelect: handleBoardSelect,
    onCloseDeleteMessageConfirm: handleCloseDeleteMessageConfirm,
    onConfirmDeleteMessage: handleConfirmDeleteMessage,
    onCreateTask: handleCreateTask,
    onMakeProjectGlobal: handleMakeProjectGlobal,
    onOpenTask: handleOpenTask,
    pendingDeleteMessageId,
    pendingDeleteMessageText,
    projectId,
    sendMessage,
    selectedTaskId,
    setMessage,
    shouldShowMakeProjectGlobalAction,
    taskBoardEmoji: boardView?.board.emoji ?? "🔥",
    taskBoardExtraMembersCount: Math.max(boardMembers.length - 5, 0),
    taskBoardMembersCount: boardMembers.length,
    taskBoardTitle: boardView?.board.title ?? "Task board",
    tasksByColumn: boardView?.tasksByColumn ?? {},
    typingText,
  };
};
