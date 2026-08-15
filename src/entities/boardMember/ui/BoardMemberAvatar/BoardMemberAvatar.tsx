import { Avatar } from "@mui/material";
import type { FC } from "react";

import { getAvatarColors } from "@/shared/lib/formatters";

import type { BoardMemberAvatarProps } from "../../model/types.ts";
import styles from "./BoardMemberAvatar.module.scss";

export const BoardMemberAvatar: FC<BoardMemberAvatarProps> = ({
  member,
  size = "medium",
  showStatus = false,
  className,
}) => {
  const avatarColors = getAvatarColors(String(member.id));

  return (
    <Avatar
      src={member.avatarUrl}
      className={`${styles.avatar} ${size === "small" ? styles.small : ""} ${className ?? ""}`}
      alt={member.name}
      sx={member.avatarUrl ? undefined : avatarColors}
    >
      {member.initials}
      {showStatus && member.isOnline && <span className={styles.status} />}
    </Avatar>
  );
};
