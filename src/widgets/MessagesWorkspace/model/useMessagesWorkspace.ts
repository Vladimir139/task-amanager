import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { type ChatMember } from "@/entities/chatMember";
import { type ChatMessage } from "@/entities/chatMessage";
import {
  useGetConversationDetailsQuery,
  useGetConversationFilesQuery,
  useGetConversationsQuery,
  useSelectedConversationId,
} from "@/entities/conversation";
import { type Conversation } from "@/entities/conversation";
import { useUploadFileMutation } from "@/entities/file";
import {
  useDeleteMessageMutation,
  useGetConversationMessagesQuery,
  useSendMessageMutation,
  useUpdateMessageMutation,
  useUploadAudioMessageMutation,
} from "@/entities/message";
import { type SharedFile } from "@/entities/sharedFile";
import { selectAuthUser } from "@/entities/user";
import { useMarkConversationReadMutation } from "@/features/markConversationRead";
import type { ConversationRecord, UserRecord } from "@/shared/api";
import { getMessagesRoute } from "@/shared/config/router";
import { formatBytes, formatConversationTime, formatDateTimeLabel } from "@/shared/lib/formatters";
import { useAppSelector } from "@/shared/libs/redux";

const getConversationDisplay = (
  conversation: ConversationRecord,
  currentUserId?: string,
  users?: UserRecord[],
): { avatar: string; name: string; subtitle: string } => {
  const members = users ?? conversation.members ?? [];

  if (conversation.type === "direct") {
    const otherUser = members.find((member) => member._id !== currentUserId) ?? members[0];
    const fullName = otherUser
      ? `${otherUser.firstName} ${otherUser.lastName}`.trim()
      : (conversation.title ?? "Direct chat");
    const presenceLabel = otherUser?.presenceStatus === "online" ? "Online" : "Direct message";

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

interface UseMessagesWorkspaceResult {
  activeConversationId: string | null;
  chatMembers: ChatMember[];
  chatMessages: ChatMessage[];
  conversationAvatar: string;
  conversationName: string;
  conversationSubtitle: string;
  conversations: Conversation[];
  handleAttachImages: (files: FileList | null) => void;
  handleUploadAudio: (files: FileList | null) => void;
  hasConversations: boolean;
  isError: boolean;
  isLoading: boolean;
  isMutating: boolean;
  newMessage: string;
  onlineCount: number;
  selectConversation: (conversationId: string) => void;
  setNewMessage: (value: string) => void;
  sharedFiles: SharedFile[];
  statusMessage: string | null;
  statusTone: "error" | "success" | null;
  submitMessage: () => Promise<void>;
}

export const useMessagesWorkspace = (): UseMessagesWorkspaceResult => {
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectAuthUser);
  const selectedConversationId = useSelectedConversationId();
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageText, setEditingMessageText] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"error" | "success" | null>(null);
  const {
    data: conversationsData,
    isError: isConversationsError,
    isLoading: isConversationsLoading,
  } = useGetConversationsQuery();
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

  useEffect(() => {
    setEditingMessageId(null);
    setEditingMessageText("");
    setStatusMessage(null);
    setStatusTone(null);
  }, [activeConversationId]);

  const conversations = useMemo<Conversation[]>(() => {
    return (
      conversationsData?.map((conversation) => {
        const display = getConversationDisplay(conversation, currentUser?.id, conversation.members);

        return {
          avatar: display.avatar,
          id: conversation._id,
          isOnline: conversation.isOnline,
          isRead: (conversation.unreadCount ?? 0) === 0,
          isTyping: conversation.isTyping,
          name: display.name,
          preview: conversation.isTyping
            ? "Typing..."
            : (conversation.preview ?? "No messages yet"),
          time: formatConversationTime(conversation.lastMessageAt ?? conversation.updatedAt),
          unread: conversation.unreadCount,
        };
      }) ?? []
    );
  }, [conversationsData, currentUser?.id]);

  const selectedConversation = useMemo(
    () =>
      conversationsData?.find((conversation) => conversation._id === activeConversationId) ?? null,
    [activeConversationId, conversationsData],
  );

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
  const userMap = useMemo(
    () => new Map(conversationUsers.map((user) => [user._id, user])),
    [conversationUsers],
  );
  const conversationDisplay = selectedConversation
    ? getConversationDisplay(selectedConversation, currentUser?.id, conversationUsers)
    : { avatar: "", name: "Messages", subtitle: "" };

  const chatMembers = useMemo<ChatMember[]>(() => {
    return conversationUsers.map((user) => ({
      avatar: user.avatarUrl ?? "",
      id: user._id,
      name: `${user.firstName} ${user.lastName}`.trim(),
    }));
  }, [conversationUsers]);

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

  const onlineCount = conversationUsers.filter((user) => user.presenceStatus === "online").length;
  const isError = isConversationsError || isDetailsError || isMessagesError || isFilesError;
  const isMutating =
    isSendingMessage ||
    isUpdatingMessage ||
    isDeletingMessage ||
    isUploadingAudio ||
    isUploadingFiles;

  const selectConversation = (conversationId: string): void => {
    void navigate(getMessagesRoute(conversationId));
  };

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
      setStatusMessage("Message updated.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getErrorMessage(error, "Unable to update the message."));
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
        setStatusMessage(getErrorMessage(error, "Unable to delete the message."));
        setStatusTone("error");
      }
    },
    [activeConversationId, deleteMessage, editingMessageId],
  );

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
        setStatusMessage("Images shared.");
        setStatusTone("success");
      } catch (error) {
        setStatusMessage(getErrorMessage(error, "Unable to share the selected images."));
        setStatusTone("error");
      }
    })();
  };

  const handleUploadAudio = (files: FileList | null): void => {
    const file = files?.[0];
    if (!file) {
      return;
    }

    void (async () => {
      if (!activeConversationId) {
        return;
      }

      setStatusMessage(null);
      setStatusTone(null);

      try {
        const uploadedAudio = await uploadAudioMessage({
          conversationId: activeConversationId,
          file,
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

        setStatusMessage("Audio message sent.");
        setStatusTone("success");
      } catch (error) {
        setStatusMessage(getErrorMessage(error, "Unable to send the audio message."));
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
    } catch (error) {
      setStatusMessage(getErrorMessage(error, "Unable to send the message."));
      setStatusTone("error");
    }
  };

  const chatMessages = useMemo<ChatMessage[]>(() => {
    return (
      conversationMessages?.map((message) => {
        const author = userMap.get(message.authorId);
        const attachments = (conversationFiles ?? [])
          .filter((file) => file.messageId === message._id && file.previewUrl)
          .map((file) => ({
            id: file._id,
            image: file.previewUrl ?? file.downloadUrl ?? "",
          }));

        return {
          attachments: attachments.length > 0 ? attachments : undefined,
          author: author ? `${author.firstName} ${author.lastName}`.trim() : "Teammate",
          avatar: author?.avatarUrl ?? "",
          canDelete: message.authorId === currentUser?.id,
          canEdit: message.authorId === currentUser?.id && Boolean(message.text),
          id: message._id,
          editDraft: editingMessageId === message._id ? editingMessageText : (message.text ?? ""),
          isEdited: message.isEdited,
          isEditing: editingMessageId === message._id,
          isOwn: message.authorId === currentUser?.id,
          onDelete: () => {
            void handleDeleteMessage(message._id);
          },
          onEditCancel: handleCancelEditMessage,
          onEditChange: setEditingMessageText,
          onEditStart: () => {
            handleStartEditMessage(message._id, message.text ?? "");
          },
          onEditSubmit: () => {
            void handleSubmitEditMessage();
          },
          text: message.text
            ? [message.text]
            : message.kind === "audio"
              ? ["Voice message"]
              : undefined,
          time: formatConversationTime(message.createdAt),
        };
      }) ?? []
    );
  }, [
    conversationFiles,
    conversationMessages,
    currentUser?.id,
    editingMessageId,
    editingMessageText,
    handleCancelEditMessage,
    handleDeleteMessage,
    handleStartEditMessage,
    handleSubmitEditMessage,
    userMap,
  ]);

  return {
    activeConversationId,
    chatMembers,
    chatMessages,
    conversationAvatar: conversationDisplay.avatar,
    conversationName: conversationDisplay.name,
    conversationSubtitle: conversationDisplay.subtitle,
    conversations,
    handleAttachImages,
    handleUploadAudio,
    hasConversations,
    isError,
    isLoading: isConversationsLoading || isDetailsLoading || isMessagesLoading,
    isMutating,
    newMessage,
    onlineCount,
    selectConversation,
    setNewMessage,
    sharedFiles,
    statusMessage,
    statusTone,
    submitMessage,
  };
};
