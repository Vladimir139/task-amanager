import { Alert, Avatar, Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import type { FC } from "react";

import type { ChatMember } from "@/entities/chatMember";
import { ChatMemberItem } from "@/entities/chatMember";
import type { SharedFile } from "@/entities/sharedFile";
import { SharedFileItem } from "@/entities/sharedFile";

import styles from "./ChatInformationSidebar.module.scss";

interface ChatInformationSidebarProps {
  availableUsers: Array<{ id: string; label: string }>;
  canManageConversation: boolean;
  conversationTitle: string;
  conversationType: string;
  isMutatingConversation: boolean;
  managementStatusMessage?: string | null;
  managementStatusTone?: "error" | "success" | null;
  members: ChatMember[];
  memberRole: "admin" | "member";
  onAddMember: () => void;
  onConversationTitleChange: (value: string) => void;
  onConversationTitleSave: () => void;
  onMemberRoleChange: (value: "admin" | "member") => void;
  onSelectedUserChange: (value: string) => void;
  profileAvatar: string;
  profileName: string;
  profileSubtitle: string;
  selectedUserId: string;
  sharedFiles: SharedFile[];
}

export const ChatInformationSidebar: FC<ChatInformationSidebarProps> = ({
  availableUsers,
  canManageConversation,
  conversationTitle,
  conversationType,
  isMutatingConversation,
  managementStatusMessage = null,
  managementStatusTone = null,
  members,
  memberRole,
  onAddMember,
  onConversationTitleChange,
  onConversationTitleSave,
  onMemberRoleChange,
  onSelectedUserChange,
  profileAvatar,
  profileName,
  profileSubtitle,
  selectedUserId,
  sharedFiles,
}) => {
  const isGroupConversation = conversationType === "group";

  return (
    <aside className={styles.informationSidebar}>
      <Box className={styles.profile}>
        <Avatar src={profileAvatar} alt={profileName} />

        <Typography component="h2">{profileName}</Typography>

        <Typography>{profileSubtitle}</Typography>
      </Box>

      {managementStatusMessage && managementStatusTone && (
        <Alert severity={managementStatusTone} className={styles.statusAlert}>
          {managementStatusMessage}
        </Alert>
      )}

      {isGroupConversation && (
        <section className={styles.sidebarSection}>
          <Box className={styles.sidebarSectionHeader}>
            <Typography component="h3">Conversation settings</Typography>
          </Box>

          {!canManageConversation && (
            <Typography className={styles.helperText}>
              Only conversation owners and admins can rename this chat or manage its members.
            </Typography>
          )}

          <Box className={styles.settingsForm}>
            <TextField
              label="Conversation title"
              value={conversationTitle}
              onChange={(event) => {
                onConversationTitleChange(event.target.value);
              }}
              disabled={!canManageConversation}
              fullWidth
              size="small"
            />

            <Button
              variant="contained"
              onClick={onConversationTitleSave}
              disabled={
                !canManageConversation || isMutatingConversation || !conversationTitle.trim()
              }
            >
              Save title
            </Button>
          </Box>
        </section>
      )}

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

        {isGroupConversation && (
          <Box className={styles.addMemberRow}>
            <TextField
              select
              label="User"
              value={selectedUserId}
              onChange={(event) => {
                onSelectedUserChange(event.target.value);
              }}
              disabled={!canManageConversation || availableUsers.length === 0}
              fullWidth
              size="small"
            >
              {availableUsers.length > 0 ? (
                availableUsers.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.label}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  No users available
                </MenuItem>
              )}
            </TextField>

            <TextField
              select
              label="Role"
              value={memberRole}
              onChange={(event) => {
                onMemberRoleChange(event.target.value as "admin" | "member");
              }}
              disabled={!canManageConversation}
              fullWidth
              size="small"
            >
              <MenuItem value="member">Member</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>

            <Button
              variant="contained"
              onClick={onAddMember}
              disabled={!canManageConversation || !selectedUserId || isMutatingConversation}
            >
              Add
            </Button>
          </Box>
        )}

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
