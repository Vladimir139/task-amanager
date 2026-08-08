import { useEffect, useMemo, useState } from "react";
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
import { useGetConversationMessagesQuery, useSendMessageMutation } from "@/entities/message";
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

interface UseMessagesWorkspaceResult {
  activeConversationId: string | null;
  chatMembers: ChatMember[];
  chatMessages: ChatMessage[];
  conversationAvatar: string;
  conversationName: string;
  conversationSubtitle: string;
  conversations: Conversation[];
  hasConversations: boolean;
  isError: boolean;
  isLoading: boolean;
  isSendingMessage: boolean;
  newMessage: string;
  onlineCount: number;
  selectConversation: (conversationId: string) => void;
  setNewMessage: (value: string) => void;
  sharedFiles: SharedFile[];
  submitMessage: () => Promise<void>;
}

export const useMessagesWorkspace = (): UseMessagesWorkspaceResult => {
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectAuthUser);
  const selectedConversationId = useSelectedConversationId();
  const [newMessage, setNewMessage] = useState("");
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
          id: message._id,
          isOwn: message.authorId === currentUser?.id,
          text: message.text
            ? [message.text]
            : message.kind === "audio"
              ? ["Voice message"]
              : undefined,
          time: formatConversationTime(message.createdAt),
        };
      }) ?? []
    );
  }, [conversationFiles, conversationMessages, currentUser?.id, userMap]);

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

  const selectConversation = (conversationId: string): void => {
    void navigate(getMessagesRoute(conversationId));
  };

  const submitMessage = async (): Promise<void> => {
    const normalizedMessage = newMessage.trim();

    if (!activeConversationId || !normalizedMessage) {
      return;
    }

    await sendMessage({
      conversationId: activeConversationId,
      kind: "text",
      text: normalizedMessage,
    }).unwrap();

    setNewMessage("");
  };

  return {
    activeConversationId,
    chatMembers,
    chatMessages,
    conversationAvatar: conversationDisplay.avatar,
    conversationName: conversationDisplay.name,
    conversationSubtitle: conversationDisplay.subtitle,
    conversations,
    hasConversations,
    isError,
    isLoading: isConversationsLoading || isDetailsLoading || isMessagesLoading,
    isSendingMessage,
    newMessage,
    onlineCount,
    selectConversation,
    setNewMessage,
    sharedFiles,
    submitMessage,
  };
};
