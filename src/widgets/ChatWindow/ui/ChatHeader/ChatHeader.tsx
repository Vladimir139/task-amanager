import { Avatar, AvatarGroup, Box, Typography } from "@mui/material";
import type { FC } from "react";

import type { ChatMember } from "@/entities/chatMember";

import styles from "../ChatWindow/ChatWindow.module.scss";

interface ChatHeaderProps {
  title: string;
  avatar: string;
  members: ChatMember[];
  membersCount: number;
  onlineCount: number;
}

export const ChatHeader: FC<ChatHeaderProps> = ({
  title,
  avatar,
  members,
  membersCount,
  onlineCount,
}) => {
  return (
    <header className={styles.chatHeader}>
      <Box className={styles.teamInformation}>
        <Avatar src={avatar} alt={title} />

        <Box>
          <Typography component="h2">{title}</Typography>

          <Typography>
            {membersCount} members, {onlineCount} online
          </Typography>
        </Box>
      </Box>

      <Box className={styles.teamMembers}>
        <AvatarGroup max={3}>
          {members.slice(0, 3).map((member) => (
            <Avatar key={member.id} src={member.avatar} alt={member.name} />
          ))}
        </AvatarGroup>
      </Box>
    </header>
  );
};
