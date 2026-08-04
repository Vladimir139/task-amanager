import { Add, ExpandMore } from "@mui/icons-material";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import type { FC } from "react";

import { ChatMemberItem } from "@/entities/chatMember";
import { SharedFileItem } from "@/entities/sharedFile";
import { sharedFiles } from "@/widgets";

import { chatMembers } from "../model/sidebar.data.ts";
import styles from "./ChatInformationSidebar.module.scss";

interface ChatInformationSidebarProps {
  conversationId: number;
}

export const ChatInformationSidebar: FC<ChatInformationSidebarProps> = ({ conversationId }) => {
  const handleAddMember = () => {
    console.log("Add member to conversation:", conversationId);
  };

  const handleViewAllFiles = () => {
    console.log("View all files for conversation:", conversationId);
  };

  return (
    <aside className={styles.informationSidebar}>
      <Box className={styles.profile}>
        <Avatar src="/images/users/ahmed.jpg" alt="Killan James" />

        <Typography component="h2">Killan James</Typography>

        <Typography>@killan james</Typography>
      </Box>

      <section className={styles.sidebarSection}>
        <Box className={styles.sidebarSectionHeader}>
          <Typography component="h3">Attachments</Typography>

          <IconButton aria-label="Collapse attachments">
            <ExpandMore />
          </IconButton>
        </Box>

        <Box className={styles.files}>
          {sharedFiles.map((file) => (
            <SharedFileItem key={file.id} file={file} />
          ))}
        </Box>

        <button type="button" className={styles.viewAllButton} onClick={handleViewAllFiles}>
          View all
        </button>
      </section>

      <section className={styles.sidebarSection}>
        <Box className={styles.sidebarSectionHeader}>
          <Typography component="h3">Members</Typography>

          <IconButton aria-label="Collapse members">
            <ExpandMore />
          </IconButton>
        </Box>

        <button type="button" className={styles.addMember} onClick={handleAddMember}>
          <span>
            <Add />
          </span>
          Add Member
        </button>

        <Box className={styles.members}>
          {chatMembers.map((member) => (
            <ChatMemberItem key={member.id} member={member} />
          ))}
        </Box>
      </section>
    </aside>
  );
};
