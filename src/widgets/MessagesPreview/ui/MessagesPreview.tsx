import { Box, Typography } from "@mui/material";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

import { useGetConversationsQuery } from "@/entities/conversation";
import { MessageItem } from "@/entities/message";
import { selectAuthUser } from "@/entities/user";
import { getMessagesRoute } from "@/shared/config/router";
import { getInitials } from "@/shared/lib/formatters";
import { useAppSelector } from "@/shared/libs/redux";

import styles from "./MessagesPreview.module.scss";

const colors = ["#f5a623", "#ff7285", "#5ac8e8", "#8e72d8", "#3ad29f"];

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
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectAuthUser);
  const { data, isError, isLoading } = useGetConversationsQuery();

  const unreadConversations = (data ?? []).filter(
    (conversation) => (conversation.unreadCount ?? 0) > 0,
  );
  const extraChatCount = Math.max(unreadConversations.length - 5, 0);
  const messages = unreadConversations.slice(0, 5).map((conversation, index) => {
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
      color: colors[index % colors.length],
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
