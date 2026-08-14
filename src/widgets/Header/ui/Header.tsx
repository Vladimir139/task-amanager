import { KeyboardArrowDown, LogoutOutlined, NotificationsNoneOutlined } from "@mui/icons-material";
import { Avatar, Box, IconButton, MenuItem, TextField } from "@mui/material";
import { type FC } from "react";

import { selectAuthUser } from "@/entities/user";
import { useLogoutMutation } from "@/features/auth";
import { useAppSelector } from "@/shared/libs/redux";

import { useProjectSwitcher } from "../model/useProjectSwitcher";
import styles from "./Header.module.scss";

export const Header: FC = () => {
  const user = useAppSelector(selectAuthUser);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const { handleProjectChange, isDisabled, isLoading, projectOptions, selectedProjectId } =
    useProjectSwitcher();
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
        <IconButton className={styles.notificationButton}>
          <NotificationsNoneOutlined />
          <span className={styles.notificationCount}>2</span>
        </IconButton>

        <Avatar src={user?.avatarUrl ?? undefined} className={styles.profileAvatar}>
          {initials}
        </Avatar>

        <IconButton
          aria-label="logout"
          disabled={isLoggingOut}
          onClick={() => {
            void logout();
          }}
        >
          <LogoutOutlined />
        </IconButton>

        <IconButton>
          <KeyboardArrowDown />
        </IconButton>
      </Box>
    </header>
  );
};
