import { CloseOutlined } from "@mui/icons-material";
import { Box, Dialog, IconButton, Typography } from "@mui/material";
import type { JSX, PropsWithChildren, ReactNode } from "react";

import styles from "./AppModal.module.scss";

interface AppModalProps extends PropsWithChildren {
  contentClassName?: string;
  footer?: ReactNode;
  onClose: () => void;
  open: boolean;
  paperClassName?: string;
  title?: string;
}

export const AppModal = ({
  children,
  contentClassName,
  footer,
  onClose,
  open,
  paperClassName,
  title,
}: AppModalProps): JSX.Element => {
  const hasHeader = title != null || footer != null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      slotProps={{
        backdrop: {
          className: styles.backdrop,
        },
        paper: {
          className: [styles.paper, paperClassName].filter(Boolean).join(" "),
        },
      }}
    >
      {hasHeader && (
        <Box className={styles.header}>
          <Box>
            {title && (
              <Typography component="h2" className={styles.title}>
                {title}
              </Typography>
            )}
          </Box>

          <IconButton aria-label="Close modal" onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Box>
      )}

      <Box className={[styles.content, contentClassName].filter(Boolean).join(" ")}>{children}</Box>
      {footer && <Box className={styles.footer}>{footer}</Box>}
    </Dialog>
  );
};
