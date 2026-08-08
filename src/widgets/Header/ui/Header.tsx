import { KeyboardArrowDown, NotificationsNoneOutlined } from "@mui/icons-material";
import { Avatar, Box, IconButton } from "@mui/material";
import { type FC } from "react";

import { selectAuthUser, useAppSelector } from "@/app/store";

import styles from "./Header.module.scss";

export const Header: FC = () => {
  const user = useAppSelector(selectAuthUser);
  const initials = `${user?.firstName?.[0] ?? "A"}${user?.lastName?.[0] ?? "N"}`;

  return (
    <header className={styles.header}>
      <Box className={styles.profileActions}>
        <IconButton className={styles.notificationButton}>
          <NotificationsNoneOutlined />
          <span className={styles.notificationCount}>2</span>
        </IconButton>

        <Avatar src={user?.avatarUrl ?? undefined} className={styles.profileAvatar}>
          {initials}
        </Avatar>

        <IconButton>
          <KeyboardArrowDown />
        </IconButton>
      </Box>
    </header>
  );
};
