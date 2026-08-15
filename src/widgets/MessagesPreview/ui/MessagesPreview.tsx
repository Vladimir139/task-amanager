import { Box, Typography } from "@mui/material";
import type { FC } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useGetConversationsQuery } from "@/entities/conversation";
import { MessageItem } from "@/entities/message";
import { selectAuthUser } from "@/entities/user";
import { selectAccessToken } from "@/features/auth/model/selectors";
import { baseApi } from "@/shared/api";
import { getMessagesRoute } from "@/shared/config/router";
import { getAvatarColors, getInitials } from "@/shared/lib/formatters";
import { useRealtimeSocket } from "@/shared/lib/realtime";
import { useAppDispatch, useAppSelector } from "@/shared/libs/redux";

import styles from "./MessagesPreview.module.scss";

const getConversationInitials = (title: string): string => {
  const parts = title.trim().split(/\s+/).filter(Boolean);

  return (
    parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "CH"
  );
};

export const MessagesPreview: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const accessToken = useAppSelector(selectAccessToken);
  const currentUser = useAppSelector(selectAuthUser);
  const { data, isError, isLoading } = useGetConversationsQuery();
  const chatSocket = useRealtimeSocket("/chat", accessToken, Boolean((data?.length ?? 0) > 0));

  useEffect(() => {
    if (!chatSocket || !data?.length) {
      return;
    }

    const joinConversations = (): void => {
      for (const conversation of data) {
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
      dispatch(baseApi.util.invalidateTags(["Conversations"]));
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
  }, [chatSocket, data, dispatch]);

  const unreadConversations = (data ?? []).filter(
    (conversation) => (conversation.unreadCount ?? 0) > 0,
  );
  const extraChatCount = Math.max(unreadConversations.length - 5, 0);
  const messages = unreadConversations.slice(0, 5).map((conversation) => {
    const directPeer =
      conversation.type === "direct"
        ? conversation.members?.find((member) => member._id !== currentUser?.id)
        : null;
    const conversationName = directPeer
      ? `${directPeer.firstName} ${directPeer.lastName}`.trim()
      : (conversation.title?.trim() ?? "Team chat");

    return {
      avatar: directPeer
        ? getInitials(directPeer.firstName, directPeer.lastName)
        : getConversationInitials(conversationName),
      color: getAvatarColors(directPeer?._id ?? conversation._id).backgroundColor,
      id: conversation._id,
      message: conversation.isTyping ? "Typing..." : (conversation.preview ?? "Unread message"),
      name: conversationName,
      onOpen: () => {
        void navigate(getMessagesRoute(conversation._id));
      },
      unreadCount: conversation.unreadCount ?? 0,
    };
  });

  return (
    <section className={styles.messagesSection}>
      <Box className={styles.messagesHeader}>
        <Typography component="h2">Messages</Typography>
        {extraChatCount > 0 && (
          <Typography className={styles.extraChatsIndicator}>+{extraChatCount} chats</Typography>
        )}
      </Box>

      {isError && <Typography>Unable to load messages.</Typography>}
      {isLoading && <Typography>Loading messages...</Typography>}
      {!isLoading && !isError && messages.length === 0 && <Typography>No new messages.</Typography>}

      <Box className={styles.messagesList}>
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </Box>
    </section>
  );
};
