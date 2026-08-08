import { Avatar, Box, Typography } from "@mui/material";
import type { FC } from "react";

import type { ChatMember } from "@/entities/chatMember";
import { ChatMemberItem } from "@/entities/chatMember";
import type { SharedFile } from "@/entities/sharedFile";
import { SharedFileItem } from "@/entities/sharedFile";

import styles from "./ChatInformationSidebar.module.scss";

interface ChatInformationSidebarProps {
  members: ChatMember[];
  profileAvatar: string;
  profileName: string;
  profileSubtitle: string;
  sharedFiles: SharedFile[];
}

export const ChatInformationSidebar: FC<ChatInformationSidebarProps> = ({
  members,
  profileAvatar,
  profileName,
  profileSubtitle,
  sharedFiles,
}) => {
  return (
    <aside className={styles.informationSidebar}>
      <Box className={styles.profile}>
        <Avatar src={profileAvatar} alt={profileName} />

        <Typography component="h2">{profileName}</Typography>

        <Typography>{profileSubtitle}</Typography>
      </Box>

      <section className={styles.sidebarSection}>
        <Box className={styles.sidebarSectionHeader}>
          <Typography component="h3">Attachments</Typography>
        </Box>

        <Box className={styles.files}>
          {sharedFiles.length > 0 ? (
            sharedFiles.map((file) => <SharedFileItem key={file.id} file={file} />)
          ) : (
            <Typography>No shared files yet.</Typography>
          )}
        </Box>
      </section>

      <section className={styles.sidebarSection}>
        <Box className={styles.sidebarSectionHeader}>
          <Typography component="h3">Members</Typography>
        </Box>

        <Box className={styles.members}>
          {members.length > 0 ? (
            members.map((member) => <ChatMemberItem key={member.id} member={member} />)
          ) : (
            <Typography>No members found.</Typography>
          )}
        </Box>
      </section>
    </aside>
  );
};
