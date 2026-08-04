import { Avatar } from "@mui/material";
import type { FC } from "react";

import type { BoardMemberAvatarProps } from "../../model/types.ts";
import styles from "./BoardMemberAvatar.module.scss";

export const BoardMemberAvatar: FC<BoardMemberAvatarProps> = ({
  member,
  size = "medium",
  showStatus = false,
  className,
}) => {
  return (
    <Avatar
      className={`${styles.avatar} ${size === "small" ? styles.small : ""} ${className ?? ""}`}
    >
      {member.initials}
      {showStatus && member.isOnline && <span className={styles.status} />}
    </Avatar>
  );
};
