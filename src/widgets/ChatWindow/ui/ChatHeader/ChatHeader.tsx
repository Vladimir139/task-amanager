import { Avatar, Box, Typography } from "@mui/material";
import type { FC } from "react";

import type { ChatMember } from "@/entities/chatMember";
import { getAvatarColors, getAvatarInitials } from "@/shared/lib/formatters";
import { MemberAvatarStack } from "@/shared/ui/molecules/MemberAvatarStack/MemberAvatarStack";

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
  const chatAvatarColors = getAvatarColors(title);

  return (
    <header className={styles.chatHeader}>
      <Box className={styles.teamInformation}>
        <Avatar src={avatar} alt={title} sx={avatar ? undefined : chatAvatarColors}>
          {getAvatarInitials(title)}
        </Avatar>

        <Box>
          <Typography component="h2">{title}</Typography>

          <Typography>
            {membersCount} members, {onlineCount} online
          </Typography>
        </Box>
      </Box>

      <Box className={styles.teamMembers}>
        <MemberAvatarStack
          items={members.map((member) => ({
            avatarUrl: member.avatar,
            id: member.id,
            name: member.name,
            role: member.role,
          }))}
          title={`${title} members`}
        />
      </Box>
    </header>
  );
};
