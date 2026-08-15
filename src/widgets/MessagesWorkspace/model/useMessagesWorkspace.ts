import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { type ChatMember } from "@/entities/chatMember";
import { type ChatMessage } from "@/entities/chatMessage";
import {
  type Conversation,
  useGetConversationDetailsQuery,
  useGetConversationFilesQuery,
  useGetConversationsQuery,
  useSelectedConversationId,
} from "@/entities/conversation";
import { useUploadFileMutation } from "@/entities/file";
import {
  useDeleteMessageMutation,
  useGetConversationMessagesQuery,
  useSendMessageMutation,
  useUpdateMessageMutation,
  useUploadAudioMessageMutation,
} from "@/entities/message";
import { type SharedFile } from "@/entities/sharedFile";
import { selectAuthUser, useGetUsersQuery } from "@/entities/user";
import { useAddConversationMemberMutation } from "@/features/addConversationMember";
import { selectAccessToken } from "@/features/auth/model/selectors";
import { useMarkConversationReadMutation } from "@/features/markConversationRead";
import { useRemoveConversationMemberMutation } from "@/features/removeConversationMember";
import { useUpdateConversationMutation } from "@/features/updateConversation";
import { baseApi, type ConversationRecord, type UserRecord } from "@/shared/api";
import { getMessagesRoute } from "@/shared/config/router";
import { getApiErrorMessage } from "@/shared/lib/api";
import { formatBytes, formatConversationTime, formatDateTimeLabel } from "@/shared/lib/formatters";
import { mergePresenceState, setPresenceState, useRealtimeSocket } from "@/shared/lib/realtime";
import { useAppDispatch, useAppSelector } from "@/shared/libs/redux";
import type { RecordedAudioPayload } from "@/shared/ui/molecules/VoiceRecorderButton/VoiceRecorderButton";

const getConversationDisplay = (
  conversation: ConversationRecord,
  currentUserId?: string,
  users?: UserRecord[],
  presenceByUserId?: Record<string, boolean>,
): { avatar: string; name: string; subtitle: string } => {
  const members = users ?? conversation.members ?? [];

  if (conversation.type === "direct") {
    const otherUser = members.find((member) => member._id !== currentUserId) ?? members[0];
    const fullName = otherUser
      ? `${otherUser.firstName} ${otherUser.lastName}`.trim()
      : (conversation.title ?? "Direct chat");
    const isOtherUserOnline = otherUser
      ? (presenceByUserId?.[otherUser._id] ?? otherUser.presenceStatus === "online")
      : false;
    const presenceLabel = isOtherUserOnline ? "Online" : "Direct message";

    return {
      avatar: otherUser?.avatarUrl ?? conversation.avatarUrl ?? "",
      name: fullName,
      subtitle: presenceLabel,
    };
  }

  const fallbackName = members
    .map((member) => member.firstName)
    .slice(0, 3)
    .join(", ");
  const resolvedName = conversation.title ?? (fallbackName || "Conversation");

  return {
    avatar: conversation.avatarUrl ?? members[0]?.avatarUrl ?? "",
    name: resolvedName,
    subtitle: `${members.length} members`,
  };
};

const mapSharedType = (kind: string): SharedFile["type"] => {
  if (
    [
      "figma",
      "sketch",
      "xd",
      "svg",
      "document",
      "image",
      "audio",
      "video",
      "illustrator",
      "other",
    ].includes(kind)
  ) {
    return kind as SharedFile["type"];
  }

  return "other";
};

const formatAudioDuration = (durationMs?: number | null): string | undefined => {
  if (!durationMs || durationMs <= 0) {
    return undefined;
  }

  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${minutes}:${seconds}`;
};

interface UseMessagesWorkspaceResult {
  activeConversationId: string | null;
  availableConversationUsers: Array<{ id: string; label: string }>;
  canManageConversation: boolean;
  chatMembers: ChatMember[];
  chatMessages: ChatMessage[];
  conversationAvatar: string;
  conversationName: string;
  conversationSubtitle: string;
  conversationTitleDraft: string;
  conversationType: string;
  conversations: Conversation[];
  handleAttachImages: (files: FileList | null) => void;
  handleAddConversationMember: () => Promise<void>;
  handleConversationRoleChange: (value: "admin" | "member") => void;
  handleConversationTitleChange: (value: string) => void;
  handleConversationTitleSave: () => Promise<void>;
  handleConversationUserChange: (value: string) => void;
  handleUploadAudio: (payload: RecordedAudioPayload) => void;
  hasConversations: boolean;
  isError: boolean;
  isLoading: boolean;
  isManagingConversation: boolean;
  isMutating: boolean;
  managementStatusMessage: string | null;
  managementStatusTone: "error" | "success" | null;
  newConversationMemberRole: "admin" | "member";
  newMessage: string;
  onlineCount: number;
  pendingDeleteMessageId: string | null;
  pendingDeleteMessageText: string | null;
  confirmDeleteMessage: () => Promise<void>;
  closeDeleteMessageConfirm: () => void;
  selectConversation: (conversationId: string) => void;
  selectedConversationUserId: string;
  setNewMessage: (value: string) => void;
  sharedFiles: SharedFile[];
  statusMessage: string | null;
  statusTone: "error" | "success" | null;
  submitMessage: () => Promise<void>;
  typingText: string | null;
}

export const useMessagesWorkspace = (): UseMessagesWorkspaceResult => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectAccessToken);
  const currentUser = useAppSelector(selectAuthUser);
  const selectedConversationId = useSelectedConversationId();
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageText, setEditingMessageText] = useState("");
  const [conversationTitleDraft, setConversationTitleDraft] = useState("");
  const [selectedConversationUserId, setSelectedConversationUserId] = useState("");
  const [newConversationMemberRole, setNewConversationMemberRole] = useState<"admin" | "member">(
    "member",
  );
  const [presenceByUserId, setPresenceByUserId] = useState<Record<string, boolean>>({});
  const [managementStatusMessage, setManagementStatusMessage] = useState<string | null>(null);
  const [managementStatusTone, setManagementStatusTone] = useState<"error" | "success" | null>(
    null,
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"error" | "success" | null>(null);
  const [pendingDeleteMessageId, setPendingDeleteMessageId] = useState<string | null>(null);
  const [pendingDeleteMessageText, setPendingDeleteMessageText] = useState<string | null>(null);
  const [typingUsersByConversationId, setTypingUsersByConversationId] = useState<
    Record<string, string[]>
  >({});
  const typingTimeoutRef = useRef<number | null>(null);
  const typingConversationIdRef = useRef<string | null>(null);
  const {
    data: conversationsData,
    isError: isConversationsError,
    isLoading: isConversationsLoading,
  } = useGetConversationsQuery();
  const { data: users = [] } = useGetUsersQuery();
  const [markConversationRead] = useMarkConversationReadMutation();

  const hasConversations = (conversationsData?.length ?? 0) > 0;
  const activeConversationId = useMemo(() => {
    if (!selectedConversationId) {
      return null;
    }

    if (!conversationsData) {
      return selectedConversationId;
    }

    return conversationsData.some((conversation) => conversation._id === selectedConversationId)
      ? selectedConversationId
      : null;
  }, [conversationsData, selectedConversationId]);

  useEffect(() => {
    if (!conversationsData?.length) {
      return;
    }

    if (selectedConversationId && activeConversationId) {
      return;
    }

    void navigate(getMessagesRoute(conversationsData[0]._id), { replace: true });
  }, [activeConversationId, conversationsData, navigate, selectedConversationId]);

  const {
    data: conversationDetails,
    isError: isDetailsError,
    isLoading: isDetailsLoading,
  } = useGetConversationDetailsQuery(activeConversationId ?? "", {
    skip: !activeConversationId,
  });
  const {
    data: conversationMessages,
    isError: isMessagesError,
    isLoading: isMessagesLoading,
  } = useGetConversationMessagesQuery(activeConversationId ?? "", {
    skip: !activeConversationId,
  });
  const { data: conversationFiles, isError: isFilesError } = useGetConversationFilesQuery(
    activeConversationId ?? "",
    {
      skip: !activeConversationId,
    },
  );
  const [sendMessage, { isLoading: isSendingMessage }] = useSendMessageMutation();
  const [updateMessage, { isLoading: isUpdatingMessage }] = useUpdateMessageMutation();
  const [deleteMessage, { isLoading: isDeletingMessage }] = useDeleteMessageMutation();
  const [uploadAudioMessage, { isLoading: isUploadingAudio }] = useUploadAudioMessageMutation();
  const [uploadFile, { isLoading: isUploadingFiles }] = useUploadFileMutation();
  const [addConversationMember, { isLoading: isAddingConversationMember }] =
    useAddConversationMemberMutation();
  const [removeConversationMember, { isLoading: isRemovingConversationMember }] =
    useRemoveConversationMemberMutation();
  const [updateConversation, { isLoading: isUpdatingConversation }] =
    useUpdateConversationMutation();
  const presenceSocket = useRealtimeSocket("/presence", accessToken, hasConversations);
  const typingSocket = useRealtimeSocket("/typing", accessToken, hasConversations);
  const chatSocket = useRealtimeSocket("/chat", accessToken, hasConversations);

  useEffect(() => {
    setEditingMessageId(null);
    setEditingMessageText("");
    setConversationTitleDraft("");
    setSelectedConversationUserId("");
    setNewConversationMemberRole("member");
    setManagementStatusMessage(null);
    setManagementStatusTone(null);
    setStatusMessage(null);
    setStatusTone(null);
    setTypingUsersByConversationId((currentState) => {
      if (!activeConversationId) {
        return currentState;
      }

      const nextState = { ...currentState };
      delete nextState[activeConversationId];
      return nextState;
    });
  }, [activeConversationId]);

  const allConversationUserIds = useMemo(() => {
    const ids = new Set<string>();

    for (const conversation of conversationsData ?? []) {
      for (const member of conversation.members ?? []) {
        ids.add(member._id);
      }
    }

    for (const user of conversationDetails?.users ?? []) {
      ids.add(user._id);
    }

    return Array.from(ids);
  }, [conversationDetails?.users, conversationsData]);

  useEffect(() => {
    if (!presenceSocket || allConversationUserIds.length === 0) {
      return;
    }

    const subscribePresence = (): void => {
      presenceSocket.emit("presence.subscribe", {
        userIds: allConversationUserIds,
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
  }, [allConversationUserIds, presenceSocket]);

  useEffect(() => {
    if (!typingSocket || !conversationsData?.length) {
      return;
    }

    const joinConversations = (): void => {
      for (const conversation of conversationsData) {
        typingSocket.emit("conversation.join", {
          conversationId: conversation._id,
        });
      }
    };

    const updateTypingUsers = (
      conversationId: string,
      updater: (currentUsers: string[]) => string[],
    ): void => {
      setTypingUsersByConversationId((currentState) => {
        const nextUsers = updater(currentState[conversationId] ?? []);
        if (nextUsers.length === 0) {
          const nextState = { ...currentState };
          delete nextState[conversationId];
          return nextState;
        }

        return {
          ...currentState,
          [conversationId]: nextUsers,
        };
      });
    };

    const handleTypingStart = ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }): void => {
      if (userId === currentUser?.id) {
        return;
      }

      updateTypingUsers(conversationId, (currentUsers) =>
        currentUsers.includes(userId) ? currentUsers : [...currentUsers, userId],
      );
    };

    const handleTypingStop = ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }): void => {
      updateTypingUsers(conversationId, (currentUsers) =>
        currentUsers.filter((currentUserId) => currentUserId !== userId),
      );
    };

    if (typingSocket.connected) {
      joinConversations();
    }

    typingSocket.on("connect", joinConversations);
    typingSocket.on("typing.start", handleTypingStart);
    typingSocket.on("typing.stop", handleTypingStop);

    return () => {
      typingSocket.off("connect", joinConversations);
      typingSocket.off("typing.start", handleTypingStart);
      typingSocket.off("typing.stop", handleTypingStop);
    };
  }, [conversationsData, currentUser?.id, typingSocket]);

  useEffect(() => {
    if (!chatSocket || !conversationsData?.length) {
      return;
    }

    const joinConversations = (): void => {
      for (const conversation of conversationsData) {
        chatSocket.emit("conversation.join", {
          conversationId: conversation._id,
        });
      }
    };

    const invalidateConversationData = (conversationId?: string): void => {
      if (!conversationId) {
        dispatch(baseApi.util.invalidateTags(["Conversations"]));
        return;
      }

      dispatch(
        baseApi.util.invalidateTags([
          "Conversations",
          { id: conversationId, type: "Conversations" },
          { id: conversationId, type: "ConversationMessages" },
          { id: conversationId, type: "ConversationFiles" },
        ]),
      );
    };

    const handleMessageCreated = ({ message }: { message?: { conversationId?: string } }): void => {
      invalidateConversationData(message?.conversationId);
    };

    const handleMessageUpdated = ({ message }: { message?: { conversationId?: string } }): void => {
      invalidateConversationData(message?.conversationId);
    };

    const handleMessageDeleted = (): void => {
      invalidateConversationData(activeConversationId ?? undefined);
    };

    const handleMessageRead = (): void => {
      dispatch(baseApi.util.invalidateTags(["Conversations"]));
    };

    if (chatSocket.connected) {
      joinConversations();
    }

    chatSocket.on("connect", joinConversations);
    chatSocket.on("message.created", handleMessageCreated);
    chatSocket.on("message.updated", handleMessageUpdated);
    chatSocket.on("message.deleted", handleMessageDeleted);
    chatSocket.on("message.read", handleMessageRead);

    return () => {
      chatSocket.off("connect", joinConversations);
      chatSocket.off("message.created", handleMessageCreated);
      chatSocket.off("message.updated", handleMessageUpdated);
      chatSocket.off("message.deleted", handleMessageDeleted);
      chatSocket.off("message.read", handleMessageRead);
    };
  }, [activeConversationId, chatSocket, conversationsData, dispatch]);

  const conversations = useMemo<Conversation[]>(() => {
    return (
      conversationsData?.map((conversation) => {
        const typingUserIds =
          typingUsersByConversationId[conversation._id] ?? conversation.typingUserIds ?? [];
        const otherUser =
          conversation.type === "direct"
            ? (conversation.members ?? []).find((member) => member._id !== currentUser?.id)
            : null;
        const display = getConversationDisplay(
          conversation,
          currentUser?.id,
          conversation.members,
          presenceByUserId,
        );

        return {
          avatar: display.avatar,
          id: conversation._id,
          isOnline: otherUser ? (presenceByUserId[otherUser._id] ?? conversation.isOnline) : false,
          isRead: (conversation.unreadCount ?? 0) === 0,
          isTyping: typingUserIds.some((userId) => userId !== currentUser?.id),
          name: display.name,
          preview: typingUserIds.some((userId) => userId !== currentUser?.id)
            ? "Typing..."
            : (conversation.preview ?? "No messages yet"),
          time: formatConversationTime(conversation.lastMessageAt ?? conversation.updatedAt),
          unread: conversation.unreadCount,
        };
      }) ?? []
    );
  }, [conversationsData, currentUser?.id, presenceByUserId, typingUsersByConversationId]);

  const selectedConversation = useMemo(
    () =>
      conversationsData?.find((conversation) => conversation._id === activeConversationId) ?? null,
    [activeConversationId, conversationsData],
  );
  const selectedConversationType = selectedConversation?.type ?? null;
  const selectedConversationTitle = selectedConversation?.title ?? "";

  useEffect(() => {
    if (!selectedConversationType || selectedConversationType === "direct") {
      setConversationTitleDraft("");
      return;
    }

    setConversationTitleDraft(selectedConversationTitle);
  }, [activeConversationId, selectedConversationTitle, selectedConversationType]);

  useEffect(() => {
    if (
      !activeConversationId ||
      !selectedConversation ||
      isMessagesLoading ||
      (selectedConversation.unreadCount ?? 0) === 0 ||
      (selectedConversation.lastSequence ?? 0) <= 0
    ) {
      return;
    }

    void markConversationRead({
      conversationId: activeConversationId,
      sequence: selectedConversation.lastSequence,
    });
  }, [activeConversationId, isMessagesLoading, markConversationRead, selectedConversation]);

  const conversationUsers = useMemo(
    () => conversationDetails?.users ?? selectedConversation?.members ?? [],
    [conversationDetails?.users, selectedConversation?.members],
  );
  const conversationMemberships = useMemo(
    () => new Map((conversationDetails?.members ?? []).map((member) => [member.userId, member])),
    [conversationDetails?.members],
  );
  const userMap = useMemo(
    () => new Map(conversationUsers.map((user) => [user._id, user])),
    [conversationUsers],
  );
  const conversationDisplay = selectedConversation
    ? getConversationDisplay(
        selectedConversation,
        currentUser?.id,
        conversationUsers,
        presenceByUserId,
      )
    : { avatar: "", name: "Messages", subtitle: "" };

  const getIsUserOnline = useCallback(
    (user: UserRecord): boolean => presenceByUserId[user._id] ?? user.presenceStatus === "online",
    [presenceByUserId],
  );

  const currentConversationRole = useMemo(() => {
    if (!currentUser?.id) {
      return null;
    }

    return conversationMemberships.get(currentUser.id)?.role ?? null;
  }, [conversationMemberships, currentUser?.id]);

  const canManageConversation = Boolean(
    selectedConversation?.type === "group" &&
    (currentConversationRole === "owner" || currentConversationRole === "admin"),
  );

  const availableConversationUsers = useMemo(() => {
    if (selectedConversation?.type !== "group") {
      return [];
    }

    const existingUserIds = new Set(conversationUsers.map((user) => user._id));

    return users
      .filter((user) => !existingUserIds.has(user._id))
      .map((user) => ({
        id: user._id,
        label: `${user.firstName} ${user.lastName}`.trim() || user.email,
      }));
  }, [conversationUsers, selectedConversation?.type, users]);

  const sharedFiles = useMemo<SharedFile[]>(() => {
    return (
      conversationFiles?.map((file) => ({
        id: file._id,
        information: `${formatBytes(file.size)} · ${formatDateTimeLabel(file.createdAt)}`,
        name: file.originalName,
        type: mapSharedType(file.kind),
      })) ?? []
    );
  }, [conversationFiles]);
  const filesById = useMemo(
    () => new Map((conversationFiles ?? []).map((file) => [file._id, file])),
    [conversationFiles],
  );

  const activeTypingUserIds =
    (activeConversationId ? typingUsersByConversationId[activeConversationId] : undefined) ??
    selectedConversation?.typingUserIds ??
    [];
  const typingUsers = conversationUsers.filter(
    (user) => activeTypingUserIds.includes(user._id) && user._id !== currentUser?.id,
  );
  const typingText =
    typingUsers.length === 0
      ? null
      : typingUsers.length === 1
        ? `${typingUsers[0]?.firstName ?? "Someone"} is typing...`
        : `${typingUsers.length} people are typing...`;
  const onlineCount = conversationUsers.filter((user) => getIsUserOnline(user)).length;
  const isError = isConversationsError || isDetailsError || isMessagesError || isFilesError;
  const isManagingConversation =
    isAddingConversationMember || isRemovingConversationMember || isUpdatingConversation;
  const isMutating =
    isSendingMessage ||
    isUpdatingMessage ||
    isDeletingMessage ||
    isUploadingAudio ||
    isUploadingFiles;

  const selectConversation = (conversationId: string): void => {
    void navigate(getMessagesRoute(conversationId));
  };

  const handleConversationTitleChange = useCallback((value: string): void => {
    setConversationTitleDraft(value);
  }, []);

  const handleConversationUserChange = useCallback((value: string): void => {
    setSelectedConversationUserId(value);
  }, []);

  const handleConversationRoleChange = useCallback((value: "admin" | "member"): void => {
    setNewConversationMemberRole(value);
  }, []);

  const handleConversationTitleSave = useCallback(async (): Promise<void> => {
    if (!activeConversationId || selectedConversation?.type !== "group" || !canManageConversation) {
      return;
    }

    const normalizedTitle = conversationTitleDraft.trim();
    if (!normalizedTitle) {
      setManagementStatusMessage("Conversation title is required.");
      setManagementStatusTone("error");
      return;
    }

    if (normalizedTitle === selectedConversationTitle) {
      return;
    }

    setManagementStatusMessage(null);
    setManagementStatusTone(null);

    try {
      await updateConversation({
        conversationId: activeConversationId,
        title: normalizedTitle,
      }).unwrap();

      setManagementStatusMessage("Conversation title updated.");
      setManagementStatusTone("success");
    } catch (error) {
      setManagementStatusMessage(getApiErrorMessage(error, "Unable to update the conversation."));
      setManagementStatusTone("error");
    }
  }, [
    activeConversationId,
    canManageConversation,
    conversationTitleDraft,
    selectedConversationTitle,
    selectedConversation?.type,
    updateConversation,
  ]);

  const handleAddConversationMember = useCallback(async (): Promise<void> => {
    if (
      !activeConversationId ||
      selectedConversation?.type !== "group" ||
      !canManageConversation ||
      !selectedConversationUserId
    ) {
      return;
    }

    setManagementStatusMessage(null);
    setManagementStatusTone(null);

    try {
      await addConversationMember({
        conversationId: activeConversationId,
        role: newConversationMemberRole,
        userId: selectedConversationUserId,
      }).unwrap();

      setSelectedConversationUserId("");
      setNewConversationMemberRole("member");
      setManagementStatusMessage("Conversation member added.");
      setManagementStatusTone("success");
    } catch (error) {
      setManagementStatusMessage(
        getApiErrorMessage(error, "Unable to add the conversation member."),
      );
      setManagementStatusTone("error");
    }
  }, [
    activeConversationId,
    addConversationMember,
    canManageConversation,
    newConversationMemberRole,
    selectedConversation?.type,
    selectedConversationUserId,
  ]);

  const handleRemoveConversationMember = useCallback(
    async (memberUserId: string): Promise<void> => {
      if (
        !activeConversationId ||
        selectedConversation?.type !== "group" ||
        !canManageConversation
      ) {
        return;
      }

      setManagementStatusMessage(null);
      setManagementStatusTone(null);

      try {
        await removeConversationMember({
          conversationId: activeConversationId,
          memberUserId,
        }).unwrap();

        setManagementStatusMessage("Conversation member removed.");
        setManagementStatusTone("success");
      } catch (error) {
        setManagementStatusMessage(
          getApiErrorMessage(error, "Unable to remove the conversation member."),
        );
        setManagementStatusTone("error");
      }
    },
    [
      activeConversationId,
      canManageConversation,
      removeConversationMember,
      selectedConversation?.type,
    ],
  );

  const chatMembers = useMemo<ChatMember[]>(() => {
    return conversationUsers.map((user) => {
      const role = conversationMemberships.get(user._id)?.role;

      return {
        avatar: user.avatarUrl ?? "",
        canRemove: canManageConversation && role !== "owner" && user._id !== currentUser?.id,
        id: user._id,
        isOnline: getIsUserOnline(user),
        isCurrentUser: user._id === currentUser?.id,
        name: `${user.firstName} ${user.lastName}`.trim(),
        onRemove: () => {
          void handleRemoveConversationMember(user._id);
        },
        role,
        subtitle: [
          role ? `${role[0]?.toUpperCase() ?? ""}${role.slice(1)}` : null,
          getIsUserOnline(user) ? "Online" : null,
        ]
          .filter(Boolean)
          .join(" · "),
      };
    });
  }, [
    canManageConversation,
    conversationMemberships,
    conversationUsers,
    currentUser?.id,
    getIsUserOnline,
    handleRemoveConversationMember,
  ]);

  const handleStartEditMessage = useCallback((messageId: string, text: string): void => {
    setEditingMessageId(messageId);
    setEditingMessageText(text);
    setStatusMessage(null);
    setStatusTone(null);
  }, []);

  const handleCancelEditMessage = useCallback((): void => {
    setEditingMessageId(null);
    setEditingMessageText("");
    setStatusMessage(null);
    setStatusTone(null);
  }, []);

  const handleSubmitEditMessage = useCallback(async (): Promise<void> => {
    if (!editingMessageId) {
      return;
    }

    const normalizedText = editingMessageText.trim();
    if (!normalizedText) {
      setStatusMessage("Message text is required.");
      setStatusTone("error");
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await updateMessage({
        messageId: editingMessageId,
        text: normalizedText,
      }).unwrap();

      setEditingMessageId(null);
      setEditingMessageText("");
    } catch (error) {
      setStatusMessage(getApiErrorMessage(error, "Unable to update the message."));
      setStatusTone("error");
    }
  }, [editingMessageId, editingMessageText, updateMessage]);

  const handleDeleteMessage = useCallback(
    async (messageId: string): Promise<void> => {
      if (!activeConversationId) {
        return;
      }

      setStatusMessage(null);
      setStatusTone(null);

      try {
        await deleteMessage({
          conversationId: activeConversationId,
          messageId,
        }).unwrap();

        if (editingMessageId === messageId) {
          setEditingMessageId(null);
          setEditingMessageText("");
        }

        setStatusMessage("Message deleted.");
        setStatusTone("success");
      } catch (error) {
        setStatusMessage(getApiErrorMessage(error, "Unable to delete the message."));
        setStatusTone("error");
      }
    },
    [activeConversationId, deleteMessage, editingMessageId],
  );

  const closeDeleteMessageConfirm = useCallback((): void => {
    setPendingDeleteMessageId(null);
    setPendingDeleteMessageText(null);
  }, []);

  const confirmDeleteMessage = useCallback(async (): Promise<void> => {
    if (!pendingDeleteMessageId) {
      return;
    }

    await handleDeleteMessage(pendingDeleteMessageId);
    closeDeleteMessageConfirm();
  }, [closeDeleteMessageConfirm, handleDeleteMessage, pendingDeleteMessageId]);

  const stopTyping = useCallback(
    (conversationId?: string | null): void => {
      const resolvedConversationId = conversationId ?? typingConversationIdRef.current;
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
    if (
      typingConversationIdRef.current &&
      typingConversationIdRef.current !== activeConversationId
    ) {
      stopTyping(typingConversationIdRef.current);
    }
  }, [activeConversationId, stopTyping]);

  useEffect(() => {
    if (!typingSocket || !activeConversationId) {
      return;
    }

    const normalizedMessage = newMessage.trim();

    if (normalizedMessage === "") {
      stopTyping(activeConversationId);
      return;
    }

    if (typingConversationIdRef.current !== activeConversationId) {
      typingSocket.emit("typing.start", {
        conversationId: activeConversationId,
      });
      typingConversationIdRef.current = activeConversationId;
    }

    if (typingTimeoutRef.current !== null) {
      window.clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      stopTyping(activeConversationId);
    }, 1200);

    return () => {
      if (typingTimeoutRef.current !== null) {
        window.clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    };
  }, [activeConversationId, newMessage, stopTyping, typingSocket]);

  const handleAttachImages = (files: FileList | null): void => {
    const selectedFiles = Array.from(files ?? []);
    if (selectedFiles.length === 0) {
      return;
    }

    void (async () => {
      if (!activeConversationId) {
        return;
      }

      setStatusMessage(null);
      setStatusTone(null);

      try {
        const uploadedFiles = await Promise.all(
          selectedFiles.map(async (file) =>
            uploadFile({
              conversationId: activeConversationId,
              file,
              kind: file.type.startsWith("image/") ? "image" : undefined,
            }).unwrap(),
          ),
        );

        await sendMessage({
          conversationId: activeConversationId,
          fileIds: uploadedFiles.map((file) => file._id),
          kind: "text",
          text: newMessage.trim() || undefined,
        }).unwrap();

        setNewMessage("");
        stopTyping(activeConversationId);
        setStatusMessage("Files shared.");
        setStatusTone("success");
      } catch (error) {
        setStatusMessage(getApiErrorMessage(error, "Unable to share the selected files."));
        setStatusTone("error");
      }
    })();
  };

  const handleUploadAudio = (payload: RecordedAudioPayload): void => {
    void (async () => {
      if (!activeConversationId) {
        return;
      }

      setStatusMessage(null);
      setStatusTone(null);

      try {
        const uploadedAudio = await uploadAudioMessage({
          conversationId: activeConversationId,
          durationMs: payload.durationMs,
          file: payload.file,
          waveform: payload.waveform,
        }).unwrap();

        await sendMessage({
          audio: {
            fileId: uploadedAudio._id,
            durationMs: uploadedAudio.durationMs ?? undefined,
            mimeType: uploadedAudio.mimeType,
            waveform: uploadedAudio.waveform ?? undefined,
          },
          conversationId: activeConversationId,
          kind: "audio",
        }).unwrap();

        stopTyping(activeConversationId);
        setStatusMessage("Audio message sent.");
        setStatusTone("success");
      } catch (error) {
        setStatusMessage(getApiErrorMessage(error, "Unable to send the audio message."));
        setStatusTone("error");
      }
    })();
  };

  const submitMessage = async (): Promise<void> => {
    const normalizedMessage = newMessage.trim();

    if (!activeConversationId || !normalizedMessage) {
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await sendMessage({
        conversationId: activeConversationId,
        kind: "text",
        text: normalizedMessage,
      }).unwrap();

      setNewMessage("");
      stopTyping(activeConversationId);
    } catch (error) {
      setStatusMessage(getApiErrorMessage(error, "Unable to send the message."));
      setStatusTone("error");
    }
  };

  const chatMessages = useMemo<ChatMessage[]>(() => {
    return (
      conversationMessages?.map((message) => {
        const author = userMap.get(message.authorId);
        const attachments = (message.fileIds ?? [])
          .map((fileId) => ({
            file: filesById.get(fileId),
            fileId,
          }))
          .filter((entry) => Boolean(entry.file))
          .map((entry) => {
            const { file, fileId } = entry;
            const attachmentUrl = file?.previewUrl ?? file?.downloadUrl ?? "";

            return {
              id: file?._id ?? fileId,
              information: `${formatBytes(file?.size ?? 0)} · ${file?.kind ?? "file"}`,
              isImage: file?.mimeType?.startsWith("image/") ?? false,
              mimeType: file?.mimeType,
              name: file?.originalName ?? "Attachment",
              previewUrl: attachmentUrl,
            };
          })
          .filter((attachment) => attachment.previewUrl !== "");
        const audioFile = message.audio?.fileId ? filesById.get(message.audio.fileId) : undefined;

        return {
          attachments: attachments.length > 0 ? attachments : undefined,
          audio:
            message.kind === "audio" && audioFile
              ? {
                  duration: formatAudioDuration(message.audio?.durationMs),
                  mimeType: audioFile.mimeType,
                  src: audioFile.previewUrl ?? audioFile.downloadUrl ?? "",
                  waveform: audioFile.waveform ?? message.audio?.waveform ?? undefined,
                }
              : undefined,
          author: author ? `${author.firstName} ${author.lastName}`.trim() : "Teammate",
          avatar: author?.avatarUrl ?? "",
          canDelete: message.authorId === currentUser?.id,
          canEdit:
            message.authorId === currentUser?.id &&
            message.kind === "text" &&
            Boolean(message.text) &&
            (message.fileIds?.length ?? 0) === 0,
          id: message._id,
          editDraft: editingMessageId === message._id ? editingMessageText : (message.text ?? ""),
          isEdited: message.isEdited,
          isEditing: editingMessageId === message._id,
          isOwn: message.authorId === currentUser?.id,
          onDelete: () => {
            setPendingDeleteMessageId(message._id);
            setPendingDeleteMessageText(message.text?.trim() ?? null);
          },
          onEditCancel: handleCancelEditMessage,
          onEditChange: setEditingMessageText,
          onEditStart: () => {
            handleStartEditMessage(message._id, message.text ?? "");
          },
          onEditSubmit: () => {
            void handleSubmitEditMessage();
          },
          text: message.text ? [message.text] : undefined,
          time: formatConversationTime(message.createdAt),
        };
      }) ?? []
    );
  }, [
    conversationMessages,
    currentUser?.id,
    editingMessageId,
    editingMessageText,
    filesById,
    handleCancelEditMessage,
    handleStartEditMessage,
    handleSubmitEditMessage,
    userMap,
  ]);

  return {
    activeConversationId,
    availableConversationUsers,
    canManageConversation,
    chatMembers,
    chatMessages,
    conversationAvatar: conversationDisplay.avatar,
    conversationName: conversationDisplay.name,
    conversationSubtitle: conversationDisplay.subtitle,
    confirmDeleteMessage,
    conversationTitleDraft,
    conversationType: selectedConversation?.type ?? "",
    closeDeleteMessageConfirm,
    conversations,
    handleAttachImages,
    handleAddConversationMember,
    handleConversationRoleChange,
    handleConversationTitleChange,
    handleConversationTitleSave,
    handleConversationUserChange,
    handleUploadAudio,
    hasConversations,
    isError,
    isLoading: isConversationsLoading || isDetailsLoading || isMessagesLoading,
    isManagingConversation,
    isMutating,
    managementStatusMessage,
    managementStatusTone,
    newConversationMemberRole,
    newMessage,
    onlineCount,
    pendingDeleteMessageId,
    pendingDeleteMessageText,
    selectConversation,
    selectedConversationUserId,
    setNewMessage,
    sharedFiles,
    statusMessage,
    statusTone,
    submitMessage,
    typingText,
  };
};
