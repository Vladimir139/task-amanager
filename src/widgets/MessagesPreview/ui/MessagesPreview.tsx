import { Box, Typography } from "@mui/material";
import type { FC } from "react";

import { useGetDashboardMessagesPreviewQuery } from "@/entities/dashboard/api/dashboardApi";
import { MessageItem } from "@/entities/message";
import { useGetUsersQuery } from "@/entities/user";
import { getInitials } from "@/shared/lib/formatters";

import styles from "./MessagesPreview.module.scss";

const colors = ["#f5a623", "#ff7285", "#5ac8e8", "#8e72d8", "#3ad29f"];

export const MessagesPreview: FC = () => {
  const { data, isError, isLoading } = useGetDashboardMessagesPreviewQuery();
  const { data: users } = useGetUsersQuery();

  const userMap = new Map((users ?? []).map((user) => [user._id, user]));
  const messages =
    data?.map((message, index) => {
      const author = userMap.get(message.authorId);
      const authorName = author ? `${author.firstName} ${author.lastName}`.trim() : "Teammate";

      return {
        avatar: author ? getInitials(author.firstName, author.lastName) : "TM",
        color: colors[index % colors.length],
        id: message._id,
        message: message.text ?? (message.kind === "audio" ? "Voice message" : "System message"),
        name: authorName,
      };
    }) ?? [];

  return (
    <section className={styles.messagesSection}>
      <Typography component="h2">Messages</Typography>

      {isError && <Typography>Unable to load messages.</Typography>}
      {isLoading && <Typography>Loading messages...</Typography>}

      <Box className={styles.messagesList}>
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </Box>
    </section>
  );
};
