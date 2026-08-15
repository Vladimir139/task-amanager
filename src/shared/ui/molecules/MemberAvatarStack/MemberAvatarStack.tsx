import { Avatar, Box, Typography } from "@mui/material";
import type { FC } from "react";
import { useMemo, useState } from "react";

import { getAvatarColors, getAvatarInitials } from "@/shared/lib/formatters";
import { AppModal } from "@/shared/ui/molecules/AppModal/AppModal";

import styles from "./MemberAvatarStack.module.scss";

export interface MemberAvatarStackItem {
  avatarUrl?: string;
  id: string | number;
  initials?: string;
  name: string;
  role?: string;
}

interface MemberAvatarStackProps {
  items: MemberAvatarStackItem[];
  maxVisible?: number;
  renderAsButton?: boolean;
  title?: string;
}

const roleOrder = new Map([
  ["owner", 0],
  ["admin", 1],
  ["member", 2],
  ["viewer", 3],
]);

export const MemberAvatarStack: FC<MemberAvatarStackProps> = ({
  items,
  maxVisible = 3,
  renderAsButton = true,
  title = "Members",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const sortedItems = useMemo(
    () =>
      [...items].sort((firstItem, secondItem) => {
        const firstOrder = roleOrder.get(firstItem.role ?? "") ?? 10;
        const secondOrder = roleOrder.get(secondItem.role ?? "") ?? 10;

        if (firstOrder !== secondOrder) {
          return firstOrder - secondOrder;
        }

        return firstItem.name.localeCompare(secondItem.name);
      }),
    [items],
  );
  const visibleItems = sortedItems.slice(0, maxVisible);
  const hiddenCount = Math.max(sortedItems.length - maxVisible, 0);

  if (sortedItems.length === 0) {
    return null;
  }

  return (
    <>
      {renderAsButton ? (
        <button
          type="button"
          className={styles.stackButton}
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <Box className={styles.avatars}>
            {visibleItems.map((item) => {
              const avatarColors = getAvatarColors(String(item.id));

              return (
                <Avatar
                  key={item.id}
                  src={item.avatarUrl}
                  alt={item.name}
                  className={styles.avatar}
                  sx={item.avatarUrl ? undefined : avatarColors}
                >
                  {item.initials ?? getAvatarInitials(item.name)}
                </Avatar>
              );
            })}

            {hiddenCount > 0 && (
              <Avatar className={`${styles.avatar} ${styles.extraAvatar}`}>+{hiddenCount}</Avatar>
            )}
          </Box>
        </button>
      ) : (
        <div
          role="button"
          tabIndex={0}
          className={styles.stackButton}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setIsOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key !== "Enter" && event.key !== " ") {
              return;
            }

            event.preventDefault();
            event.stopPropagation();
            setIsOpen(true);
          }}
        >
          <Box className={styles.avatars}>
            {visibleItems.map((item) => {
              const avatarColors = getAvatarColors(String(item.id));

              return (
                <Avatar
                  key={item.id}
                  src={item.avatarUrl}
                  alt={item.name}
                  className={styles.avatar}
                  sx={item.avatarUrl ? undefined : avatarColors}
                >
                  {item.initials ?? getAvatarInitials(item.name)}
                </Avatar>
              );
            })}

            {hiddenCount > 0 && (
              <Avatar className={`${styles.avatar} ${styles.extraAvatar}`}>+{hiddenCount}</Avatar>
            )}
          </Box>
        </div>
      )}

      <AppModal
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        title={title}
      >
        <Box className={styles.modalList}>
          {sortedItems.map((item) => {
            const avatarColors = getAvatarColors(String(item.id));

            return (
              <Box key={item.id} className={styles.memberRow}>
                <Avatar
                  src={item.avatarUrl}
                  alt={item.name}
                  sx={item.avatarUrl ? undefined : avatarColors}
                >
                  {item.initials ?? getAvatarInitials(item.name)}
                </Avatar>

                <Box className={styles.memberContent}>
                  <Typography className={styles.memberName}>{item.name}</Typography>
                  {item.role && (
                    <Typography className={styles.memberMeta}>
                      {item.role[0]?.toUpperCase() ?? ""}
                      {item.role.slice(1)}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </AppModal>
    </>
  );
};
