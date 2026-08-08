import { useEffect, useMemo, useState } from "react";

import { type ChatMember } from "@/entities/chatMember";
import { type ChatMessage } from "@/entities/chatMessage";
import {
  useGetConversationDetailsQuery,
  useGetConversationFilesQuery,
  useGetConversationsQuery,
} from "@/entities/conversation";
import { type Conversation } from "@/entities/conversation";
import { useGetConversationMessagesQuery, useSendMessageMutation } from "@/entities/message";
import { type SharedFile } from "@/entities/sharedFile";
import { selectAuthUser } from "@/entities/user";
import type { ConversationRecord, UserRecord } from "@/shared/api";
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

    return {
      avatar: otherUser?.avatarUrl ?? conversation.avatarUrl ?? "",
      name: fullName,
      subtitle: otherUser?.email ?? fullName,
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
  isLoading: boolean;
  isSendingMessage: boolean;
  newMessage: string;
  onlineCount: number;
  setActiveConversationId: (conversationId: string) => void;
  setNewMessage: (value: string) => void;
  sharedFiles: SharedFile[];
  submitMessage: () => Promise<void>;
}

export const useMessagesWorkspace = (): UseMessagesWorkspaceResult => {
  const currentUser = useAppSelector(selectAuthUser);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const { data: conversationsData, isLoading: isConversationsLoading } = useGetConversationsQuery();

  useEffect(() => {
    if (activeConversationId || !conversationsData?.length) {
      return;
    }

    setActiveConversationId(conversationsData[0]._id);
  }, [activeConversationId, conversationsData]);

  const { data: conversationDetails, isLoading: isDetailsLoading } = useGetConversationDetailsQuery(
    activeConversationId ?? "",
    {
      skip: !activeConversationId,
    },
  );
  const { data: conversationMessages, isLoading: isMessagesLoading } =
    useGetConversationMessagesQuery(activeConversationId ?? "", {
      skip: !activeConversationId,
    });
  const { data: conversationFiles } = useGetConversationFilesQuery(activeConversationId ?? "", {
    skip: !activeConversationId,
  });
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
    isLoading: isConversationsLoading || isDetailsLoading || isMessagesLoading,
    isSendingMessage,
    newMessage,
    onlineCount,
    setActiveConversationId,
    setNewMessage,
    sharedFiles,
    submitMessage,
  };
};
