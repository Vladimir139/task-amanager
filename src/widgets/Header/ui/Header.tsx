import { LogoutOutlined, NotificationsNoneOutlined, TaskAltOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import { type FC } from "react";

import { selectAuthUser } from "@/entities/user";
import { useAppSelector } from "@/shared/libs/redux";

import { settingsShortcutItems, useHeaderActions } from "../model/useHeaderActions";
import { useProjectSwitcher } from "../model/useProjectSwitcher";
import styles from "./Header.module.scss";

export const Header: FC = () => {
  const user = useAppSelector(selectAuthUser);
  const { handleProjectChange, isDisabled, isLoading, projectOptions, selectedProjectId } =
    useProjectSwitcher();
  const {
    handleConfirmLogout,
    handleOpenMessages,
    handleOpenProfile,
    handleOpenSettingsPage,
    handleOpenSettingsSection,
    handleOpenTask,
    handleOpenTeamInvitations,
    invitationNotifications,
    isLoggingOut,
    logoutAnchor,
    notificationAnchor,
    notificationCount,
    overdueTasks,
    setLogoutAnchor,
    setNotificationAnchor,
    setSettingsAnchor,
    settingsAnchor,
    unreadMessages,
  } = useHeaderActions();
  const initials = `${user?.firstName?.[0] ?? "A"}${user?.lastName?.[0] ?? "N"}`;

  return (
    <header className={styles.header}>
      <Box className={styles.projectSwitcher}>
        <TextField
          select
          label="Current project"
          value={selectedProjectId}
          disabled={isDisabled}
          onChange={(event) => {
            void handleProjectChange(event.target.value);
          }}
          className={styles.projectSelect}
          slotProps={{ inputLabel: { shrink: true } }}
        >
          {projectOptions.length > 0 ? (
            projectOptions.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.title}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="" disabled>
              {isLoading ? "Loading projects..." : "No projects yet"}
            </MenuItem>
          )}
        </TextField>
      </Box>

      <Box className={styles.profileActions}>
        <IconButton
          className={styles.notificationButton}
          onClick={(event) => {
            setNotificationAnchor(event.currentTarget);
          }}
        >
          <NotificationsNoneOutlined />
          {notificationCount > 0 && (
            <span className={styles.notificationCount}>{notificationCount}</span>
          )}
        </IconButton>

        <IconButton
          className={styles.avatarButton}
          aria-label="Open profile settings"
          onClick={() => {
            void handleOpenProfile();
          }}
        >
          <Avatar src={user?.avatarUrl ?? undefined} className={styles.profileAvatar}>
            {initials}
          </Avatar>
        </IconButton>

        <IconButton
          aria-label="logout"
          disabled={isLoggingOut}
          onClick={(event) => {
            setLogoutAnchor(event.currentTarget);
          }}
        >
          <LogoutOutlined />
        </IconButton>

        <IconButton
          aria-label="Open settings shortcuts"
          onClick={(event) => {
            setSettingsAnchor(event.currentTarget);
          }}
        >
          <TaskAltOutlined />
        </IconButton>
      </Box>

      <Popover
        open={Boolean(notificationAnchor)}
        anchorEl={notificationAnchor}
        onClose={() => {
          setNotificationAnchor(null);
        }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        slotProps={{ paper: { className: styles.popoverPaper } }}
      >
        <Box className={styles.popoverContent}>
          <Typography className={styles.popoverTitle}>Notifications</Typography>

          <Box className={styles.notificationSection}>
            <Typography className={styles.sectionTitle}>Unread messages</Typography>
            {unreadMessages.length > 0 ? (
              unreadMessages.map((message) => (
                <button
                  key={message.conversationId}
                  type="button"
                  className={styles.notificationItem}
                  onClick={() => {
                    void handleOpenMessages(message.conversationId);
                  }}
                >
                  <Typography>{message.title}</Typography>
                  <span>{message.unreadCount} unread</span>
                </button>
              ))
            ) : (
              <Typography className={styles.emptyText}>No unread messages.</Typography>
            )}
          </Box>

          <Divider />

          <Box className={styles.notificationSection}>
            <Typography className={styles.sectionTitle}>Overdue tasks</Typography>
            {overdueTasks.length > 0 ? (
              overdueTasks.map((task) => (
                <button
                  key={task.taskId}
                  type="button"
                  className={styles.notificationItem}
                  onClick={() => {
                    void handleOpenTask(task);
                  }}
                >
                  <Typography>{task.title}</Typography>
                  <span>{task.dueDateLabel}</span>
                </button>
              ))
            ) : (
              <Typography className={styles.emptyText}>No overdue tasks.</Typography>
            )}
          </Box>

          <Divider />

          <Box className={styles.notificationSection}>
            <Typography className={styles.sectionTitle}>Team invitations</Typography>
            {invitationNotifications.length > 0 ? (
              invitationNotifications.map((invitation) => (
                <button
                  key={invitation.invitationId}
                  type="button"
                  className={styles.notificationItem}
                  onClick={() => {
                    void handleOpenTeamInvitations();
                  }}
                >
                  <Typography>{invitation.projectTitle}</Typography>
                  <span>{invitation.roleLabel}</span>
                </button>
              ))
            ) : (
              <Typography className={styles.emptyText}>No team invitations.</Typography>
            )}
          </Box>
        </Box>
      </Popover>

      <Popover
        open={Boolean(settingsAnchor)}
        anchorEl={settingsAnchor}
        onClose={() => {
          setSettingsAnchor(null);
        }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        slotProps={{ paper: { className: styles.shortcutPopoverPaper } }}
      >
        <Box className={styles.shortcutMenu}>
          <Typography className={styles.popoverTitle}>Settings shortcuts</Typography>

          {settingsShortcutItems.map((item) => (
            <button
              key={item}
              type="button"
              className={styles.shortcutButton}
              onClick={() => {
                void handleOpenSettingsSection(item);
              }}
            >
              {item}
            </button>
          ))}

          <Button
            variant="text"
            className={styles.openAllSettingsButton}
            onClick={() => {
              void handleOpenSettingsPage();
            }}
          >
            Open all settings
          </Button>
        </Box>
      </Popover>

      <Popover
        open={Boolean(logoutAnchor)}
        anchorEl={logoutAnchor}
        onClose={() => {
          setLogoutAnchor(null);
        }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        slotProps={{ paper: { className: styles.shortcutPopoverPaper } }}
      >
        <Box className={styles.logoutConfirm}>
          <Typography className={styles.popoverTitle}>Sign out?</Typography>
          <Typography className={styles.logoutText}>
            You will need to sign in again to continue.
          </Typography>

          <Box className={styles.logoutActions}>
            <Button
              variant="text"
              onClick={() => {
                setLogoutAnchor(null);
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="error"
              disabled={isLoggingOut}
              onClick={() => {
                void handleConfirmLogout();
              }}
            >
              {isLoggingOut ? "Signing out..." : "Sign out"}
            </Button>
          </Box>
        </Box>
      </Popover>
    </header>
  );
};
